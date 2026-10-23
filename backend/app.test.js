import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, test } from "node:test";
import { createBackendApp } from "./app.js";
import { loadConfig } from "./config.js";
import { openDatabase } from "./db/database.js";
import { InquiryRepository } from "./repositories/inquiry-repository.js";

const fixtures = [];

afterEach(async () => {
  await Promise.all(fixtures.splice(0).map(async (fixture) => {
    await fixture.stop();
    await rm(fixture.directory, { recursive: true, force: true });
  }));
});

async function startService({ rateLimit = false, databasePath, legacyStorePath = null } = {}) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "vantage-inquiry-"));
  const dbPath = databasePath || path.join(directory, "vantage.sqlite");
  const backend = createBackendApp({
    config: loadConfig({
      databasePath: dbPath,
      legacyStorePath,
      rateLimit,
      allowedOrigins: ["http://localhost:5173"],
      trustProxy: false,
    }),
  });
  const server = createServer(backend.app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  let stopped = false;
  const fixture = {
    directory,
    databasePath: dbPath,
    backend,
    server,
    baseUrl: `http://127.0.0.1:${server.address().port}`,
    stop: async () => {
      if (stopped) return;
      stopped = true;
      await new Promise((resolve) => server.close(resolve));
      backend.close();
    },
  };
  fixtures.push(fixture);
  return fixture;
}

const validInquiry = {
  name: "Ada Lovelace",
  email: "ADA@EXAMPLE.COM",
  company: "Analytical Engines",
  service: "Software & web applications",
  budget: "Prefer to discuss",
  description: "We need help turning a workflow into a reliable internal application.",
};

test("health and readiness expose safe service state", async () => {
  const { baseUrl } = await startService();
  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
  assert.equal(health.headers.get("x-content-type-options"), "nosniff");
  assert.equal(health.headers.get("x-frame-options"), "SAMEORIGIN");
  assert.deepEqual(await health.json(), { ok: true, service: "vantage-inquiry-service", version: "1.0.0" });

  const ready = await fetch(`${baseUrl}/api/ready`);
  assert.equal(ready.status, 200);
  assert.deepEqual(await ready.json(), { ok: true, service: "vantage-inquiry-service", database: "ready" });
});

test("inquiry requires JSON and validates fields without persistence", async () => {
  const fixture = await startService();
  const contentTypeResponse = await fetch(`${fixture.baseUrl}/api/inquiry`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: "not-json",
  });
  assert.equal(contentTypeResponse.status, 415);
  assert.equal((await contentTypeResponse.json()).code, "UNSUPPORTED_MEDIA_TYPE");

  const invalidResponse = await fetch(`${fixture.baseUrl}/api/inquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "A", email: "bad", service: "", description: "too short" }),
  });
  assert.equal(invalidResponse.status, 422);
  const error = await invalidResponse.json();
  assert.equal(error.code, "VALIDATION_ERROR");
  assert.equal(error.fields.name, "Please enter your name.");
  assert.equal(fixture.backend.repository.list().total, 0);
});

test("valid inquiries persist and survive a database restart", async () => {
  const first = await startService();
  const response = await fetch(`${first.baseUrl}/api/inquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "http://localhost:5173" },
    body: JSON.stringify(validInquiry),
  });
  assert.equal(response.status, 201);
  assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:5173");
  const payload = await response.json();
  assert.equal(payload.ok, true);
  assert.equal(payload.message, "Your inquiry is in. We’ll review it and get back to you.");
  assert.match(payload.inquiryId, /^inq_[0-9a-f-]{36}$/);
  const stored = first.backend.repository.findById(payload.inquiryId);
  assert.equal(stored.email, "ada@example.com");
  assert.equal(stored.status, "new");

  const databasePath = first.databasePath;
  await first.stop();
  const reopened = openDatabase({ databasePath, legacyStorePath: null });
  const repository = new InquiryRepository(reopened);
  assert.equal(repository.findById(payload.inquiryId).name, "Ada Lovelace");
  reopened.close();
});

test("repository supports constrained status updates, filtering, and deletion", async () => {
  const fixture = await startService();
  const created = fixture.backend.repository.create({ ...validInquiry, email: "one@example.com" });
  const updated = fixture.backend.repository.updateStatus(created.id, "contacted");
  assert.equal(updated.status, "contacted");
  assert.equal(fixture.backend.repository.list({ status: "contacted" }).total, 1);
  assert.equal(fixture.backend.repository.list({ search: "one@example.com" }).total, 1);
  assert.equal(fixture.backend.repository.deleteById(created.id), true);
  assert.equal(fixture.backend.repository.findById(created.id), null);
});

test("honeypot submissions are rejected", async () => {
  const { baseUrl, backend } = await startService();
  const response = await fetch(`${baseUrl}/api/inquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...validInquiry, website: "https://spam.example.com" }),
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).code, "BOT_DETECTED");
  assert.equal(backend.repository.list().total, 0);
});

test("malformed JSON and unknown API routes return consistent errors", async () => {
  const { baseUrl } = await startService();
  const malformed = await fetch(`${baseUrl}/api/inquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not-json",
  });
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).code, "INVALID_JSON");

  const unknown = await fetch(`${baseUrl}/api/unknown`);
  assert.equal(unknown.status, 404);
  assert.equal((await unknown.json()).code, "API_NOT_FOUND");
});

test("disallowed CORS preflight requests are refused", async () => {
  const { baseUrl } = await startService();
  const response = await fetch(`${baseUrl}/api/inquiry`, {
    method: "OPTIONS",
    headers: { Origin: "https://unknown.example" },
  });
  assert.equal(response.status, 403);
  assert.equal((await response.json()).code, "CORS_ORIGIN_DENIED");
});

test("the service rate limits repeated valid requests", async () => {
  const { baseUrl } = await startService({ rateLimit: { windowMs: 60_000, maxRequests: 1 } });
  const body = JSON.stringify({ ...validInquiry, email: "grace@example.com" });
  const request = () => fetch(`${baseUrl}/api/inquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  assert.equal((await request()).status, 201);
  const limited = await request();
  assert.equal(limited.status, 429);
  assert.match(limited.headers.get("retry-after"), /^\d+$/);
});

test("legacy inquiries migrate into SQLite once and remain queryable", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "vantage-legacy-"));
  const legacyPath = path.join(directory, "inquiries.ndjson");
  const databasePath = path.join(directory, "vantage.sqlite");
  const record = { id: "inq_legacy_001", receivedAt: "2026-01-01T00:00:00.000Z", name: "Legacy Client", email: "legacy@example.com", company: "Legacy Co", service: "Not sure yet", description: "A legacy inquiry imported during the database migration." };
  await writeFile(legacyPath, `${JSON.stringify(record)}\n`, "utf8");
  const db = openDatabase({ databasePath, legacyStorePath: legacyPath });
  const repository = new InquiryRepository(db);
  assert.equal(repository.findById(record.id).email, record.email);
  db.close();
  await rm(directory, { recursive: true, force: true });
});

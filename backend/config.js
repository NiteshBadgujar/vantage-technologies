import path from "node:path";

const LOCAL_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];

export function loadConfig(overrides = {}) {
  const port = Number(valueOrEnv(overrides, "port", process.env.BACKEND_PORT || 4174));
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("BACKEND_PORT must be an integer between 1 and 65535.");
  }

  const databasePath = path.resolve(valueOrEnv(overrides, "databasePath", process.env.DATABASE_PATH || "data/vantage.sqlite"));
  const legacyStorePath = valueOrEnv(overrides, "legacyStorePath", process.env.LEGACY_INQUIRY_STORE_PATH || "data/inquiries.ndjson");
  const allowedOrigins = valueOrEnv(overrides, "allowedOrigins", configuredOrigins());
  const rateLimit = valueOrEnv(overrides, "rateLimit", {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 1),
  });

  if (!Array.isArray(allowedOrigins)) throw new Error("allowedOrigins must be an array.");
  if (rateLimit !== false && (!Number.isInteger(rateLimit.windowMs) || rateLimit.windowMs < 1_000 || !Number.isInteger(rateLimit.maxRequests) || rateLimit.maxRequests < 1)) {
    throw new Error("Rate limit configuration must contain numeric values.");
  }

  return {
    port,
    databasePath,
    legacyStorePath: legacyStorePath ? path.resolve(legacyStorePath) : null,
    allowedOrigins,
    rateLimit,
    trustProxy: valueOrEnv(overrides, "trustProxy", process.env.TRUST_PROXY === "true"),
    environment: process.env.NODE_ENV || "development",
  };
}

function configuredOrigins() {
  const origins = process.env.FRONTEND_ORIGIN
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return origins?.length ? origins : LOCAL_ORIGINS;
}

function valueOrEnv(overrides, key, fallback) {
  return Object.prototype.hasOwnProperty.call(overrides, key) ? overrides[key] : fallback;
}

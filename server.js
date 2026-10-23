import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createBackendApp } from "./backend/app.js";
import { loadConfig } from "./backend/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 4173);
const backend = createBackendApp({ config: loadConfig({ port }) });
const siteMeta = {
  "/": {
    title: "Technology for the move ahead — Vantage Technologies",
    description: "Vantage Technologies helps businesses turn ideas, bottlenecks, and ambitious next steps into practical digital systems.",
  },
  "/services": {
    title: "Services with a point of view — Vantage Technologies",
    description: "Software, applied AI, technical direction, automation, integrations, and prototyping from Vantage Technologies in Nashik.",
  },
  "/projects": {
    title: "Selected work and experiments — Vantage Technologies",
    description: "Project notes, demonstrations, and systems thinking from Vantage Technologies.",
  },
  "/about": {
    title: "Small by design. Serious about the work — Vantage Technologies",
    description: "Meet Vantage Technologies, an independent technology consultancy based in Nashik, Maharashtra.",
  },
  "/contact": {
    title: "Let’s make the next move clear — Vantage Technologies",
    description: "Start a project conversation with Vantage Technologies in Nashik, Maharashtra.",
  },
};

app.disable("x-powered-by");
app.use(backend.app);

const distPath = path.join(__dirname, "dist");
const indexPath = path.join(distPath, "index.html");
const indexHtml = readFile(indexPath, "utf8");
app.use(express.static(distPath, { index: false }));
app.get("*splat", async (req, res, next) => {
  try {
    const html = await indexHtml;
    const meta = siteMeta[req.path] || {
      title: "Page not found — Vantage Technologies",
      description: "The requested Vantage Technologies page could not be found.",
      robots: "noindex, follow",
    };
    res.status(siteMeta[req.path] ? 200 : 404).type("html").send(injectMeta(html, meta));
  } catch (error) {
    next(error);
  }
});

function injectMeta(html, { title, description, robots = "index, follow" }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeRobots = escapeHtml(robots);
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`)
    .replace(/(<meta name="robots" content=")[^"]*("\s*\/>)/, `$1${safeRobots}$2`)
    .replace(/(<meta name="description" content=")[^"]*("\s*\/>)/, `$1${safeDescription}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*("\s*\/>)/, `$1${safeTitle}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*("\s*\/>)/, `$1${safeDescription}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*("\s*\/>)/, `$1${safeTitle}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*("\s*\/>)/, `$1${safeDescription}$2`);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

const server = app.listen(port, () => {
  console.log(`Vantage Technologies listening on http://localhost:${port}`);
});

function shutdown(signal) {
  console.log(`${signal} received; shutting down website server`);
  server.close(() => {
    backend.close();
    process.exit(0);
  });
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

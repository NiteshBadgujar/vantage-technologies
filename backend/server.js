import { createServer } from "node:http";
import { createBackendApp } from "./app.js";
import { loadConfig } from "./config.js";

const config = loadConfig();
const backend = createBackendApp({ config });
const server = createServer(backend.app);

server.listen(config.port, () => {
  console.log(`Vantage inquiry service listening on http://localhost:${config.port}`);
});

function shutdown(signal) {
  console.log(`${signal} received; shutting down inquiry service`);
  server.close(() => {
    backend.close();
    process.exit(0);
  });
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

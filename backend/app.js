import express from "express";
import { loadConfig } from "./config.js";
import { openDatabase } from "./db/database.js";
import { sendError, AppError } from "./errors.js";
import { errorHandler, apiNotFound, createCorsMiddleware, requestId, securityHeaders } from "./middleware.js";
import { InquiryRepository } from "./repositories/inquiry-repository.js";
import { createInquiryRoutes } from "./routes/inquiry-routes.js";
import { InquiryService } from "./services/inquiry-service.js";

export function createBackendApp(options = {}) {
  const config = options.config || loadConfig(options);
  const db = options.db || openDatabase({ databasePath: config.databasePath, legacyStorePath: config.legacyStorePath });
  const repository = options.repository || new InquiryRepository(db);
  const service = options.service || new InquiryService(repository);
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxy);
  app.use(requestId);
  app.use(securityHeaders);
  app.use(createCorsMiddleware(config.allowedOrigins));
  app.use(express.json({ limit: "24kb" }));

  const healthHandler = (_req, res) => res.json({ ok: true, service: "vantage-inquiry-service", version: "1.0.0" });
  const readyHandler = (req, res, next) => {
    try {
      db.prepare("SELECT 1 AS ok").get();
      return res.json({ ok: true, service: "vantage-inquiry-service", database: "ready" });
    } catch (error) {
      return next(new AppError(503, "DATABASE_UNAVAILABLE", "The inquiry database is unavailable."));
    }
  };

  app.get("/health", healthHandler);
  app.get("/ready", readyHandler);
  app.get("/api/health", healthHandler);
  app.get("/api/ready", readyHandler);
  app.use("/api", createInquiryRoutes({ service, rateLimit: config.rateLimit }));
  app.use(apiNotFound);
  app.use(errorHandler);

  return {
    app,
    db,
    repository,
    close() {
      if (db?.open) db.close();
    },
  };
}

import { Router } from "express";
import { createInquiryController } from "../controllers/inquiry-controller.js";
import { requireJson, createRateLimitMiddleware } from "../middleware.js";

export function createInquiryRoutes({ service, rateLimit }) {
  const router = Router();
  router.post("/inquiry", requireJson, createRateLimitMiddleware(rateLimit), createInquiryController(service));
  return router;
}

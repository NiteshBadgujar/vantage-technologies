import { randomUUID } from "node:crypto";
import { AppError, sendError } from "./errors.js";

export function requestId(req, res, next) {
  const supplied = typeof req.headers["x-request-id"] === "string" ? req.headers["x-request-id"].trim() : "";
  req.requestId = /^[A-Za-z0-9._:-]{1,100}$/.test(supplied) ? supplied : randomUUID();
  res.setHeader("X-Request-ID", req.requestId);
  if (isApiPath(req.path)) res.setHeader("Cache-Control", "no-store");
  next();
}

export function securityHeaders(_req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
}

export function createCorsMiddleware(allowedOrigins) {
  const allowed = new Set(allowedOrigins);
  return (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowed.has(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Request-ID");
      res.setHeader("Access-Control-Expose-Headers", "X-Request-ID");
      res.setHeader("Vary", "Origin");
    }
    if (req.method === "OPTIONS" && isApiPath(req.path)) {
      if (origin && !allowed.has(origin)) return sendError(res, req, new AppError(403, "CORS_ORIGIN_DENIED", "Origin is not allowed."));
      return res.status(204).end();
    }
    return next();
  };
}

export function requireJson(req, _res, next) {
  if (!req.is("application/json")) return next(new AppError(415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json."));
  next();
}

export function createRateLimitMiddleware(config) {
  if (config === false) return (_req, _res, next) => next();
  const requests = new Map();
  const windowMs = Number(config.windowMs);
  const maxRequests = Number(config.maxRequests);
  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const entry = requests.get(key);
    if (!entry || now - entry.startedAt >= windowMs) {
      requests.set(key, { startedAt: now, count: 1 });
      prune(requests, now, windowMs);
      return next();
    }
    entry.count += 1;
    if (entry.count > maxRequests) {
      res.setHeader("Retry-After", String(Math.max(1, Math.ceil((entry.startedAt + windowMs - now) / 1000))));
      return next(new AppError(429, "RATE_LIMITED", "Please wait a minute before sending another inquiry."));
    }
    return next();
  };
}

export function apiNotFound(req, res, next) {
  if (isApiPath(req.path)) return sendError(res, req, new AppError(404, "API_NOT_FOUND", "API route not found."));
  next();
}

export function errorHandler(error, req, res, _next) {
  if (error?.type === "entity.too.large") return sendError(res, req, new AppError(413, "PAYLOAD_TOO_LARGE", "Request body is too large."));
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) return sendError(res, req, new AppError(400, "INVALID_JSON", "Request body must be valid JSON."));
  if (!(error instanceof AppError)) console.error(`[${req.requestId || "unknown"}] ${error?.message || error}`);
  return sendError(res, req, error);
}

function prune(requests, now, windowMs) {
  if (requests.size <= 1000) return;
  for (const [key, entry] of requests) if (now - entry.startedAt >= windowMs) requests.delete(key);
}

function isApiPath(pathname) {
  return pathname === "/api" || pathname.startsWith("/api/");
}

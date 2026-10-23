export class AppError extends Error {
  constructor(statusCode, code, message, fields = undefined) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.fields = fields;
  }
}

export class ValidationError extends AppError {
  constructor(message, fields) {
    super(422, "VALIDATION_ERROR", message, fields);
  }
}

export function sendError(res, req, error) {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const code = error instanceof AppError ? error.code : "INTERNAL_ERROR";
  const message = error instanceof AppError ? error.message : "The service could not complete this request.";
  const payload = {
    ok: false,
    error: message,
    code,
    requestId: req.requestId,
  };
  if (error instanceof AppError && error.fields) payload.fields = error.fields;
  return res.status(statusCode).json(payload);
}

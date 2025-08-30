import { Request, Response, NextFunction } from "express";

// Custom Error Class (optional but clean)
export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error Middleware
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Error Middleware:", err);

  const status = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    success: false,
    message,
  });
}

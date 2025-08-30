import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../middleware/errorHandler";

export interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;

  if (!token) {
    return next(new AppError("Not authenticated", 401));
  }

  try {
    const decoded = verifyToken(token);
    
    // Type guard to ensure decoded is an object and has the expected properties
    if (typeof decoded === 'string' || !decoded || typeof decoded !== 'object') {
      return next(new AppError("Invalid token format", 401));
    }
    
    const payload = decoded as { userId: string; email: string };
    
    // Validate that the payload has the required properties
    if (!payload.userId || !payload.email) {
      return next(new AppError("Invalid token payload", 401));
    }
    
    req.user = payload;
    next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
}

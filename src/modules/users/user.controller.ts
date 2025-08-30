import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as userService from "./user.service";

export async function currentUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // `req.user` is set by authMiddleware after verifying token
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userService.getCurrentUser(userId);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

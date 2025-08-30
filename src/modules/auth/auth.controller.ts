import { Request, Response } from "express";
import * as authService from "./auth.service";
import { AppError } from "../../middleware/errorHandler";

export async function signup(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new AppError("All fields are required", 400);
  }
  const user = await authService.signup(name, email, password);
  res.status(201).json({
    message: "User created",
    user: { id: user.id, email: user.email },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);

  // Set HttpOnly cookie with cross-domain support
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Always true for cross-domain
    sameSite: "none", // Required for cross-domain
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // Don't set domain - let browser handle it
  });

  res.json({
    message: "Login successful",
    user: { id: user.id, email: user.email },
  });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
}

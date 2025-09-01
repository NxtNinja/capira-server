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

  res.json({
    message: "Login successful",
    user: { id: user.id, email: user.email },
    token: token, // Also return token in response body for cross-domain compatibility
  });
}

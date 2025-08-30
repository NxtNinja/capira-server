import { generateToken } from "../../utils/jwt";
import { comparePassword, hashPassword } from "../../utils/password";
import { AppError } from "../../middleware/errorHandler";
import prisma from "../../config/db";

export async function signup(name: string, email: string, password: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("User already exists", 401);
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    return user;
  } catch (error: any) {
    if (error instanceof AppError) throw error;

    // Prisma-specific error handling
    if (error.code === "P2002") {
      // Unique constraint violation
      throw new AppError("Email already taken", 400);
    }

    throw new AppError("Failed to create user", 500);
  }
}

export async function login(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("User not found", 401);

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new AppError("Invalid credentials", 401);

    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  } catch (error: any) {
    if (error instanceof AppError) throw error;

    throw new AppError("Login failed", 500);
  }
}

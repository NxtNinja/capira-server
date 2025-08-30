import prisma from "../../config/db";
import { AppError } from "../../middleware/errorHandler";

export async function getCurrentUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true }, // hide password
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to fetch current user", 500);
  }
}

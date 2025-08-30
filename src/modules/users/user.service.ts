import prisma from "../../config/db";

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  return prisma.user.create({
    data: { name, email, password },
  });
};

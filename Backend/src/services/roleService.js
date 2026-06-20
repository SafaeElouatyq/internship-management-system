import prisma from "../config/prisma.js";

export const getAllRoles = async () => {
  return await prisma.role.findMany({
    orderBy: {
      name: "asc",
    },
  });
};
import prisma from "../config/prisma.js";

export const getAllDepartments = async () => {
  return await prisma.department.findMany({
    orderBy: {
      name: "asc",
    },
  });
};
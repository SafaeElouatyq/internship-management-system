import prisma from "../config/prisma.js";

export const getAllSupervisors = async () => {
  return await prisma.supervisor.findMany({
    include: {
      user: true,
      department: true,
    },
    orderBy: {
      user: {
        firstName: "asc",
      },
    },
  });
};

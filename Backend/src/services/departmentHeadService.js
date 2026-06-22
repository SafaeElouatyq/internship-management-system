import prisma from "../config/prisma.js";

const includeRelations = {
  student: {
    include: {
      user: true,
      department: true,
    },
  },
  company: true,
  supervisor: {
    include: {
      user: true,
      department: true,
    },
  },
};

const validatedStatuses = [
  "ADMIN_VALIDATED",
  "SUPERVISOR_ASSIGNED",
  "SUBJECT_PENDING",
  "SUBJECT_VALIDATED",
  "IN_PROGRESS",
  "REPORT_LATE",
  "REPORT_WRITING",
  "READY_FOR_DEFENSE",
  "DEFENSE_AUTHORIZED",
  "DEFENSE_NOT_AUTHORIZED",
  "CLOSED",
];

export const getValidatedInternships = async () => {
  return await prisma.internship.findMany({
    where: {
      status: {
        in: validatedStatuses,
      },
      NOT: {
        administrativeStatus: "REJECTED",
      },
    },
    include: includeRelations,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getDepartmentHeadSupervisors = async () => {
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

export const assignAcademicSupervisor = async (internshipId, supervisorId) => {
  const internship = await prisma.internship.findUnique({
    where: {
      id: Number(internshipId),
    },
  });

  if (!internship) {
    throw new Error("Internship not found");
  }

  if (internship.status !== "ADMIN_VALIDATED") {
    throw new Error("Internship declaration is not validated yet");
  }

  if (internship.administrativeStatus === "REJECTED") {
    throw new Error("Internship declaration has been rejected");
  }

  const supervisor = await prisma.supervisor.findUnique({
    where: {
      id: Number(supervisorId),
    },
  });

  if (!supervisor) {
    throw new Error("Supervisor not found");
  }

  return await prisma.internship.update({
    where: {
      id: Number(internshipId),
    },
    data: {
      supervisor: {
        connect: {
          id: Number(supervisorId),
        },
      },
      status: "SUPERVISOR_ASSIGNED",
    },
    include: includeRelations,
  });
};

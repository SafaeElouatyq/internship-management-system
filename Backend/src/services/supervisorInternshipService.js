import prisma from "../config/prisma.js";

const internshipInclude = {
  student: {
    include: {
      user: true,
      department: true,
    },
  },
  company: true,
  documents: true,
  meetings: {
    orderBy: {
      date: "asc",
    },
  },
  subjectValidations: {
    orderBy: {
      createdAt: "desc",
    },
  },
};

const getSupervisorByUserId = async (userId) => {
  const supervisor = await prisma.supervisor.findUnique({
    where: {
      userId: Number(userId),
    },
  });

  if (!supervisor) {
    throw new Error("Profil encadrant introuvable");
  }

  return supervisor;
};

export const getAssignedInternships = async (userId, { student = "", status = "" } = {}) => {
  const supervisor = await getSupervisorByUserId(userId);
  const where = {
    supervisorId: supervisor.id,
    NOT: {
      administrativeStatus: "REJECTED",
    },
  };

  if (student) {
    where.student = {
      user: {
        OR: [
          {
            firstName: {
              contains: student,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: student,
              mode: "insensitive",
            },
          },
        ],
      },
    };
  }

  if (status) {
    where.status = status;
  }

  const internships = await prisma.internship.findMany({
    where,
    include: {
      student: {
        include: {
          user: true,
        },
      },
      company: true,
      meetings: {
        select: {
          id: true,
        },
      },
      subjectValidations: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingSubjectCount = internships.filter((internship) =>
    ["SUPERVISOR_ASSIGNED", "SUBJECT_PENDING"].includes(internship.status),
  ).length;

  const validatedSubjectCount = internships.filter(
    (internship) => internship.status === "SUBJECT_VALIDATED",
  ).length;

  return {
    internships,
    stats: {
      assignedCount: internships.length,
      pendingSubjectCount,
      validatedSubjectCount,
    },
  };
};

export const getAssignedInternshipById = async (userId, internshipId) => {
  const supervisor = await getSupervisorByUserId(userId);

  const internship = await prisma.internship.findFirst({
    where: {
      id: Number(internshipId),
      supervisorId: supervisor.id,
      NOT: {
        administrativeStatus: "REJECTED",
      },
    },
    include: internshipInclude,
  });

  if (!internship) {
    throw new Error("Stage introuvable ou non assigné à cet encadrant");
  }

  return internship;
};

export { getSupervisorByUserId };

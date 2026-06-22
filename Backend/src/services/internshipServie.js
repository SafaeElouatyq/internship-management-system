import prisma from "../config/prisma.js";

const includeRelations = {
  student: {
    include: {
      user: true,
    },
  },
  company: true,
  supervisor: true,
};

const getStudentByUserId = async (userId) => {
  const student = await prisma.student.findUnique({
    where: {
      userId: Number(userId),
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  return student;
};

const getOrCreateCompany = async ({
  companyName,
  companyAddress,
  companyEmail,
  companyPhone,
}) => {
  if (!companyName) {
    throw new Error("Company name is required");
  }

  let company = await prisma.company.findFirst({
    where: {
      name: {
        equals: companyName.trim(),
        mode: "insensitive",
      },
    },
  });

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: companyName.trim(),
        address: companyAddress || null,
        email: companyEmail || null,
        phone: companyPhone || null,
      },
    });
  }

  return company;
};

const getStudentInternship = async (internshipId, userId) => {
  const student = await getStudentByUserId(userId);

  const internship = await prisma.internship.findFirst({
    where: {
      id: Number(internshipId),
      studentId: student.id,
    },
  });

  if (!internship) {
    throw new Error("Internship not found");
  }

  return internship;
};

export const getMyInternships = async (userId) => {
  const student = await getStudentByUserId(userId);

  return await prisma.internship.findMany({
    where: {
      studentId: student.id,
    },
    include: includeRelations,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAllInternships = async ({ student = "", company = "", status = "" }) => {
  const where = {};

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

  if (company) {
    where.company = {
      name: {
        contains: company,
        mode: "insensitive",
      },
    };
  }

  if (status) {
    where.status = status;
  }

  return await prisma.internship.findMany({
    where,
    include: includeRelations,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getMyInternshipById = async (internshipId, userId) => {
  const internship = await getStudentInternship(internshipId, userId);

  return await prisma.internship.findUnique({
    where: {
      id: internship.id,
    },
    include: includeRelations,
  });
};

export const getInternshipById = async (internshipId) => {
  const internship = await prisma.internship.findUnique({
    where: {
      id: Number(internshipId),
    },
    include: includeRelations,
  });

  if (!internship) {
    throw new Error("Internship not found");
  }

  return internship;
};

export const addInternship = async (internshipData, userId) => {
  const {
    title,
    description,
    startDate,
    endDate,
    professionalSupervisor,
    supervisorId,
    companyName,
    companyAddress,
    companyEmail,
    companyPhone,
  } = internshipData;

  if (!title || !startDate || !endDate) {
    throw new Error("Title, start date and end date are required");
  }

  if (new Date(startDate) > new Date(endDate)) {
    throw new Error("End date must be after start date");
  }

  const student = await getStudentByUserId(userId);
  const company = await getOrCreateCompany({
    companyName,
    companyAddress,
    companyEmail,
    companyPhone,
  });

  return await prisma.internship.create({
    data: {
      title,
      description: description || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      professionalSupervisor: professionalSupervisor || null,
      status: "DECLARED",
      administrativeStatus: "PENDING_DOCUMENTS",
      student: {
        connect: {
          id: student.id,
        },
      },
      company: {
        connect: {
          id: company.id,
        },
      },
      ...(supervisorId && {
        supervisor: {
          connect: {
            id: Number(supervisorId),
          },
        },
      }),
    },
    include: includeRelations,
  });
};

export const updateInternship = async (internshipId, internshipData, userId) => {
  const internship = await getStudentInternship(internshipId, userId);
  const {
    title,
    description,
    startDate,
    endDate,
    professionalSupervisor,
    supervisorId,
    companyName,
    companyAddress,
    companyEmail,
    companyPhone,
  } = internshipData;

  const data = {};

  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description || null;
  if (startDate !== undefined) data.startDate = new Date(startDate);
  if (endDate !== undefined) data.endDate = new Date(endDate);
  if (professionalSupervisor !== undefined) {
    data.professionalSupervisor = professionalSupervisor || null;
  }

  if (
    (startDate || internship.startDate) &&
    (endDate || internship.endDate) &&
    new Date(startDate || internship.startDate) > new Date(endDate || internship.endDate)
  ) {
    throw new Error("End date must be after start date");
  }

  if (companyName) {
    const company = await getOrCreateCompany({
      companyName,
      companyAddress,
      companyEmail,
      companyPhone,
    });

    data.company = {
      connect: {
        id: company.id,
      },
    };
  }

  if (supervisorId) {
    data.supervisor = {
      connect: {
        id: Number(supervisorId),
      },
    };
  }

  return await prisma.internship.update({
    where: {
      id: internship.id,
    },
    data,
    include: includeRelations,
  });
};

export const deleteInternship = async (internshipId, userId) => {
  const internship = await getStudentInternship(internshipId, userId);

  await prisma.internship.delete({
    where: {
      id: internship.id,
    },
  });
};

export const assignSupervisor = async (internshipId, supervisorId) => {
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

export const updateAdministrativeStatus = async (
  internshipId,
  administrativeStatus,
) => {
  const allowedStatuses = [
    "COMPLETE",
    "INCOMPLETE",
    "PENDING_DOCUMENTS",
    "REJECTED",
  ];

  if (!allowedStatuses.includes(administrativeStatus)) {
    throw new Error("Invalid administrative status");
  }

  const internship = await prisma.internship.findUnique({
    where: {
      id: Number(internshipId),
    },
  });

  if (!internship) {
    throw new Error("Internship not found");
  }

  const status =
    administrativeStatus === "COMPLETE" ? "ADMIN_VALIDATED" : "ADMIN_PENDING";

  return await prisma.internship.update({
    where: {
      id: Number(internshipId),
    },
    data: {
      administrativeStatus,
      status,
    },
    include: includeRelations,
  });
};

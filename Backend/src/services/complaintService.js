import prisma from "../config/prisma.js";

const complaintInclude = {
  internship: {
    include: {
      student: {
        include: {
          user: true,
        },
      },
      company: true,
    },
  },
};

const getStudentByUserId = async (userId) => {
  const student = await prisma.student.findUnique({
    where: {
      userId: Number(userId),
    },
  });

  if (!student) {
    throw new Error("Profil étudiant introuvable");
  }

  return student;
};

const complaintStatusLabels = {
  PENDING: "En attente",
  IN_PROGRESS: "En cours de traitement",
  RESOLVED: "Résolue",
  REJECTED: "Rejetée",
};

export const createComplaint = async (userId, { subject, description }) => {
  if (!subject?.trim()) {
    throw new Error("Le sujet est obligatoire");
  }

  if (!description?.trim()) {
    throw new Error("La description est obligatoire");
  }

  const student = await getStudentByUserId(userId);

  const internship = await prisma.internship.findFirst({
    where: {
      studentId: student.id,
      administrativeStatus: {
        not: "REJECTED",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!internship) {
    throw new Error("Aucun stage actif trouvé pour déposer une réclamation");
  }

  return await prisma.complaint.create({
    data: {
      subject: subject.trim(),
      description: description.trim(),
      internship: {
        connect: {
          id: internship.id,
        },
      },
    },
    include: complaintInclude,
  });
};

export const getMyComplaints = async (userId) => {
  const student = await getStudentByUserId(userId);

  const complaints = await prisma.complaint.findMany({
    where: {
      internship: {
        studentId: student.id,
      },
    },
    include: complaintInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return complaints.map((complaint) => ({
    ...complaint,
    statusLabel: complaintStatusLabels[complaint.status] || complaint.status,
  }));
};

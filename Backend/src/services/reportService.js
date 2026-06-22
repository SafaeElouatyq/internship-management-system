import prisma from "../config/prisma.js";

const reportInclude = {
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

const activeStatuses = [
  "SUPERVISOR_ASSIGNED",
  "SUBJECT_PENDING",
  "SUBJECT_VALIDATED",
  "IN_PROGRESS",
  "REPORT_LATE",
  "REPORT_WRITING",
];

const getActiveInternship = async (studentId) => {
  const internship = await prisma.internship.findFirst({
    where: {
      studentId,
      supervisorId: {
        not: null,
      },
      status: {
        in: activeStatuses,
      },
      NOT: {
        administrativeStatus: "REJECTED",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (internship) {
    return internship;
  }

  const latest = await prisma.internship.findFirst({
    where: {
      studentId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!latest) {
    throw new Error(
      "Vous n'avez aucune déclaration de stage. Déclarez d'abord votre stage dans la section Mon Stage.",
    );
  }

  if (latest.administrativeStatus === "REJECTED") {
    throw new Error(
      "Votre déclaration de stage a été refusée. Vous ne pouvez pas soumettre de rapport.",
    );
  }

  if (["DECLARED", "ADMIN_PENDING"].includes(latest.status)) {
    throw new Error(
      "Votre déclaration est en attente de validation par le gestionnaire de stage.",
    );
  }

  if (latest.status === "ADMIN_VALIDATED" && !latest.supervisorId) {
    throw new Error(
      "Votre stage est validé mais aucun encadrant académique n'a encore été affecté. Attendez l'affectation par le chef de filière.",
    );
  }

  if (!latest.supervisorId) {
    throw new Error(
      "Aucun encadrant académique n'est affecté à votre stage.",
    );
  }

  if (latest.status === "CLOSED") {
    throw new Error(
      "Votre stage est clôturé. Vous ne pouvez plus soumettre de rapport.",
    );
  }

  throw new Error(
    "Votre stage n'est pas encore en cours de suivi. Les rapports hebdomadaires seront disponibles après l'affectation de l'encadrant.",
  );
};

export const createWeeklyReport = async (userId, reportData) => {
  const { completedWork, difficulties, nextWeekPlan, progress } = reportData;

  if (!completedWork || progress === undefined || progress === "") {
    throw new Error("Le travail réalisé et la progression sont obligatoires");
  }

  const progressValue = Number(progress);

  if (Number.isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
    throw new Error("La progression doit être comprise entre 0 et 100");
  }

  const student = await getStudentByUserId(userId);
  const internship = await getActiveInternship(student.id);

  return await prisma.weeklyReport.create({
    data: {
      completedWork,
      difficulties: difficulties || null,
      nextWeekPlan: nextWeekPlan || null,
      progress: progressValue,
      internship: {
        connect: {
          id: internship.id,
        },
      },
    },
    include: reportInclude,
  });
};

export const getMyWeeklyReports = async (userId) => {
  const student = await getStudentByUserId(userId);

  return await prisma.weeklyReport.findMany({
    where: {
      internship: {
        studentId: student.id,
      },
    },
    include: reportInclude,
    orderBy: {
      submittedAt: "desc",
    },
  });
};

export const getSupervisorWeeklyReports = async (userId) => {
  const supervisor = await getSupervisorByUserId(userId);

  return await prisma.weeklyReport.findMany({
    where: {
      internship: {
        supervisorId: supervisor.id,
      },
    },
    include: reportInclude,
    orderBy: {
      submittedAt: "desc",
    },
  });
};

export const getSupervisorReportStats = async (userId) => {
  const supervisor = await getSupervisorByUserId(userId);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [submittedCount, lateCount] = await Promise.all([
    prisma.weeklyReport.count({
      where: {
        internship: {
          supervisorId: supervisor.id,
        },
      },
    }),
    prisma.internship.count({
      where: {
        supervisorId: supervisor.id,
        status: "IN_PROGRESS",
        weeklyReports: {
          none: {
            submittedAt: {
              gte: oneWeekAgo,
            },
          },
        },
      },
    }),
  ]);

  return {
    submittedCount,
    lateCount,
  };
};

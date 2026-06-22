import prisma from "../config/prisma.js";
import { createNotification } from "./notificationService.js";
import { getInternshipUserIds } from "./internshipWorkflowService.js";

const internshipInclude = {
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
    },
  },
  documents: true,
  finalDecision: true,
};

const completedStatuses = [
  "READY_FOR_DEFENSE",
  "DEFENSE_AUTHORIZED",
  "DEFENSE_NOT_AUTHORIZED",
  "CLOSED",
];

const decisionLabels = {
  DEFENSE_AUTHORIZED: "Soutenance autorisée",
  DEFENSE_NOT_AUTHORIZED: "Soutenance refusée",
};

export const getFinalDecisions = async () => {
  const internships = await prisma.internship.findMany({
    where: {
      status: {
        in: completedStatuses,
      },
      NOT: {
        administrativeStatus: "REJECTED",
      },
    },
    include: internshipInclude,
    orderBy: {
      updatedAt: "desc",
    },
  });

  const authorizedCount = internships.filter(
    (internship) => internship.status === "DEFENSE_AUTHORIZED",
  ).length;
  const refusedCount = internships.filter(
    (internship) => internship.status === "DEFENSE_NOT_AUTHORIZED",
  ).length;

  return {
    internships,
    stats: {
      authorizedCount,
      refusedCount,
    },
  };
};

export const createFinalDecision = async ({
  internshipId,
  decision,
  comment,
}) => {
  if (!internshipId || !decision) {
    throw new Error("Le stage et la décision sont obligatoires");
  }

  if (!["DEFENSE_AUTHORIZED", "DEFENSE_NOT_AUTHORIZED"].includes(decision)) {
    throw new Error("Décision invalide");
  }

  const internship = await prisma.internship.findUnique({
    where: {
      id: Number(internshipId),
    },
    include: {
      finalDecision: true,
    },
  });

  if (!internship) {
    throw new Error("Stage introuvable");
  }

  if (internship.administrativeStatus === "REJECTED") {
    throw new Error("Ce stage a été refusé");
  }

  if (internship.status !== "READY_FOR_DEFENSE") {
    throw new Error("Ce stage n'est pas prêt pour une décision de soutenance");
  }

  if (internship.finalDecision) {
    throw new Error("Une décision finale existe déjà pour ce stage");
  }

  return await prisma.$transaction(async (tx) => {
    await tx.finalDecision.create({
      data: {
        decision: decisionLabels[decision],
        comment: comment || null,
        internship: {
          connect: {
            id: internship.id,
          },
        },
      },
    });

    return await tx.internship.update({
      where: {
        id: internship.id,
      },
      data: {
        status: decision,
      },
      include: internshipInclude,
    });
  }).then(async (updatedInternship) => {
    const userIds = await getInternshipUserIds(updatedInternship.id);

    if (userIds?.studentUserId) {
      await createNotification(
        userIds.studentUserId,
        "Décision de soutenance",
        decision === "DEFENSE_AUTHORIZED"
          ? "Votre soutenance a été autorisée."
          : "Votre soutenance n'a pas été autorisée.",
      );
    }

    return updatedInternship;
  });
};

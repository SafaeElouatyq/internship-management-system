import prisma from "../config/prisma.js";
import { createNotification } from "./notificationService.js";
import { getInternshipUserIds } from "./internshipWorkflowService.js";
import { getSupervisorByUserId } from "./supervisorInternshipService.js";
import { notificationLinks } from "../utils/notificationLinks.js";
import {
  FINAL_DECISION_LIST_STATUSES,
  getFinalDecisionEligibility,
  assertCanCreateFinalDecision,
} from "../utils/finalDecisionRules.js";

export const ALLOWED_DECISIONS = [
  "DEFENSE_AUTHORIZED",
  "DEFENSE_AUTHORIZED_WITH_CORRECTIONS",
  "DEFENSE_NOT_AUTHORIZED",
];

export const decisionLabels = {
  DEFENSE_AUTHORIZED: "Autorisé à soutenir",
  DEFENSE_AUTHORIZED_WITH_CORRECTIONS: "Autorisé sous réserve de corrections",
  DEFENSE_NOT_AUTHORIZED: "Non autorisé à soutenir",
};

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
  meetings: {
    select: {
      id: true,
      date: true,
    },
    orderBy: {
      date: "asc",
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

const mapDecisionToInternshipStatus = (decision) => {
  switch (decision) {
    case "DEFENSE_AUTHORIZED":
      return "CLOSED";
    case "DEFENSE_AUTHORIZED_WITH_CORRECTIONS":
      return "DEFENSE_AUTHORIZED";
    case "DEFENSE_NOT_AUTHORIZED":
      return "DEFENSE_NOT_AUTHORIZED";
    default:
      throw new Error("Décision invalide");
  }
};

const computeStats = (internships) => {
  const decided = internships.filter((internship) => internship.finalDecision);

  const authorizedCount = decided.filter((internship) =>
    ["DEFENSE_AUTHORIZED", "DEFENSE_AUTHORIZED_WITH_CORRECTIONS"].includes(
      internship.finalDecision.decision,
    ),
  ).length;
  const refusedCount = decided.filter(
    (internship) =>
      internship.finalDecision.decision === "DEFENSE_NOT_AUTHORIZED",
  ).length;

  return {
    authorizedCount,
    refusedCount,
  };
};

const mapInternshipForFinalDecision = (internship) => {
  const eligibility = getFinalDecisionEligibility(
    internship,
    internship.meetings ?? [],
  );

  return {
    ...internship,
    meetingCount: eligibility.meetingCount,
    minimumMeetingsRequired: eligibility.minimumMeetingsRequired,
    meetingsScheduled: eligibility.meetingsScheduled,
    meetingsCompleted: eligibility.meetingsCompleted,
    meetingsCompliant: eligibility.meetingsCompliant,
    adminValidated: eligibility.adminValidated,
    subjectValidated: eligibility.subjectValidated,
    canDecide: eligibility.canDecide,
  };
};

const getNotificationContent = (decision) => {
  if (decision === "DEFENSE_AUTHORIZED") {
    return {
      message: "Votre soutenance a été autorisée.",
      type: "SUCCESS",
    };
  }

  if (decision === "DEFENSE_AUTHORIZED_WITH_CORRECTIONS") {
    return {
      message:
        "Votre soutenance est autorisée sous réserve de corrections. Consultez le commentaire de votre encadrant.",
      type: "WARNING",
    };
  }

  return {
    message:
      "Votre soutenance n'a pas été autorisée. Consultez le commentaire de votre encadrant.",
    type: "WARNING",
  };
};

const buildFinalDecisionListWhere = (extra = {}) => ({
  status: {
    in: FINAL_DECISION_LIST_STATUSES,
  },
  NOT: {
    administrativeStatus: "REJECTED",
  },
  ...extra,
});

export const getFinalDecisionsForViewer = async () => {
  const internships = await prisma.internship.findMany({
    where: buildFinalDecisionListWhere(),
    include: internshipInclude,
    orderBy: {
      updatedAt: "desc",
    },
  });

  return {
    internships: internships.map(mapInternshipForFinalDecision),
    stats: computeStats(internships),
  };
};

export const getFinalDecisionsForSupervisor = async (userId) => {
  const supervisor = await getSupervisorByUserId(userId);

  const internships = await prisma.internship.findMany({
    where: buildFinalDecisionListWhere({
      supervisorId: supervisor.id,
    }),
    include: internshipInclude,
    orderBy: {
      updatedAt: "desc",
    },
  });

  return {
    internships: internships.map(mapInternshipForFinalDecision),
    stats: computeStats(internships),
  };
};

export const getStudentFinalDecision = async (userId) => {
  const student = await getStudentByUserId(userId);

  const internship = await prisma.internship.findFirst({
    where: {
      studentId: student.id,
      NOT: {
        administrativeStatus: "REJECTED",
      },
    },
    include: {
      finalDecision: true,
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!internship?.finalDecision) {
    return {
      internship: internship || null,
      finalDecision: null,
    };
  }

  return {
    internship,
    finalDecision: internship.finalDecision,
  };
};

export const createFinalDecision = async (
  userId,
  { internshipId, decision, comment },
) => {
  if (!internshipId || !decision) {
    throw new Error("Le stage et la décision sont obligatoires");
  }

  if (!ALLOWED_DECISIONS.includes(decision)) {
    throw new Error("Décision invalide");
  }

  if (!comment?.trim()) {
    throw new Error("Le commentaire est obligatoire");
  }

  const supervisor = await getSupervisorByUserId(userId);

  const internship = await prisma.internship.findFirst({
    where: {
      id: Number(internshipId),
      supervisorId: supervisor.id,
    },
    include: {
      finalDecision: true,
      student: true,
      meetings: {
        select: {
          id: true,
          date: true,
        },
        orderBy: {
          date: "asc",
        },
      },
    },
  });

  if (!internship) {
    throw new Error("Stage introuvable ou non assigné à cet encadrant");
  }

  if (internship.administrativeStatus === "REJECTED") {
    throw new Error("Ce stage a été refusé");
  }

  assertCanCreateFinalDecision(internship, internship.meetings);

  const internshipStatus = mapDecisionToInternshipStatus(decision);

  return await prisma.$transaction(async (tx) => {
    const finalDecision = await tx.finalDecision.create({
      data: {
        decision,
        comment: comment.trim(),
        internship: {
          connect: {
            id: internship.id,
          },
        },
      },
    });

    const updatedInternship = await tx.internship.update({
      where: {
        id: internship.id,
      },
      data: {
        status: internshipStatus,
      },
      include: internshipInclude,
    });

    return {
      ...mapInternshipForFinalDecision(updatedInternship),
      finalDecision,
    };
  }).then(async (updatedInternship) => {
    const userIds = await getInternshipUserIds(updatedInternship.id);
    const notificationContent = getNotificationContent(decision);

    if (userIds?.studentUserId) {
      await createNotification(
        userIds.studentUserId,
        "Décision de soutenance",
        notificationContent.message,
        {
          type: notificationContent.type,
          link: notificationLinks.student.internship({ detail: true }),
        },
      );
    }

    return updatedInternship;
  });
};

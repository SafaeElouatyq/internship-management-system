import prisma from "../config/prisma.js";
import { getSupervisorByUserId } from "./supervisorInternshipService.js";

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

const allowedDecisions = [
  "ACCEPTED",
  "ACCEPTED_WITH_REFORMULATION",
  "NEEDS_CORRECTION",
  "REJECTED",
];

const statusByDecision = {
  ACCEPTED: "SUBJECT_VALIDATED",
  ACCEPTED_WITH_REFORMULATION: "SUBJECT_VALIDATED",
  NEEDS_CORRECTION: "SUBJECT_PENDING",
  REJECTED: "SUBJECT_PENDING",
};

const validateableStatuses = ["SUBJECT_PENDING"];

export const createSubjectValidation = async (
  userId,
  internshipId,
  { decision, comment, reformulatedTitle },
) => {
  if (!decision) {
    throw new Error("La décision est obligatoire");
  }

  if (!allowedDecisions.includes(decision)) {
    throw new Error("Décision invalide");
  }

  if (decision === "ACCEPTED_WITH_REFORMULATION" && !reformulatedTitle?.trim()) {
    throw new Error("Le sujet reformulé est obligatoire pour cette décision");
  }

  const supervisor = await getSupervisorByUserId(userId);

  const internship = await prisma.internship.findFirst({
    where: {
      id: Number(internshipId),
      supervisorId: supervisor.id,
    },
    include: {
      meetings: true,
    },
  });

  if (!internship) {
    throw new Error("Stage introuvable ou non assigné à cet encadrant");
  }

  if (internship.administrativeStatus === "REJECTED") {
    throw new Error("Ce stage a été refusé");
  }

  if (!validateableStatuses.includes(internship.status)) {
    throw new Error(
      "Le sujet ne peut être validé qu'après la première réunion",
    );
  }

  if (!internship.meetings.length) {
    throw new Error(
      "Vous devez planifier la première réunion avant de valider le sujet",
    );
  }

  const internshipUpdate = {
    status: statusByDecision[decision],
  };

  if (decision === "ACCEPTED_WITH_REFORMULATION") {
    internshipUpdate.title = reformulatedTitle.trim();
  }

  return await prisma.$transaction(async (tx) => {
    await tx.subjectValidation.create({
      data: {
        decision,
        comment: comment || null,
        reformulatedTitle:
          decision === "ACCEPTED_WITH_REFORMULATION"
            ? reformulatedTitle.trim()
            : null,
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
      data: internshipUpdate,
      include: internshipInclude,
    });
  });
};

export const getSubjectValidations = async (userId, internshipId) => {
  const supervisor = await getSupervisorByUserId(userId);

  const internship = await prisma.internship.findFirst({
    where: {
      id: Number(internshipId),
      supervisorId: supervisor.id,
    },
  });

  if (!internship) {
    throw new Error("Stage introuvable ou non assigné à cet encadrant");
  }

  return await prisma.subjectValidation.findMany({
    where: {
      internshipId: internship.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

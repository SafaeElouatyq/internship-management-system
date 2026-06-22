import prisma from "../config/prisma.js";
import { PFE_CATEGORIES } from "../utils/pfeDocumentRules.js";

const terminalStatuses = [
  "READY_FOR_DEFENSE",
  "DEFENSE_AUTHORIZED",
  "DEFENSE_NOT_AUTHORIZED",
  "CLOSED",
];

const reportLateStatuses = ["IN_PROGRESS", "SUBJECT_VALIDATED"];

const reportWritingFromStatuses = [
  "SUBJECT_VALIDATED",
  "IN_PROGRESS",
  "REPORT_LATE",
];

export const getInternshipUserIds = async (internshipId) => {
  const internship = await prisma.internship.findUnique({
    where: {
      id: Number(internshipId),
    },
    include: {
      student: true,
      supervisor: true,
    },
  });

  if (!internship) {
    return null;
  }

  return {
    studentUserId: internship.student?.userId,
    supervisorUserId: internship.supervisor?.userId,
  };
};

export const transitionAfterWeeklyReport = async (internshipId) => {
  const internship = await prisma.internship.findUnique({
    where: {
      id: Number(internshipId),
    },
  });

  if (!internship || internship.status !== "SUBJECT_VALIDATED") {
    return internship;
  }

  return await prisma.internship.update({
    where: {
      id: internship.id,
    },
    data: {
      status: "IN_PROGRESS",
    },
  });
};

export const syncReportLateStatus = async (internshipId, hasMissingWeeks) => {
  const internship = await prisma.internship.findUnique({
    where: {
      id: Number(internshipId),
    },
  });

  if (!internship || terminalStatuses.includes(internship.status)) {
    return internship;
  }

  if (hasMissingWeeks && reportLateStatuses.includes(internship.status)) {
    return await prisma.internship.update({
      where: {
        id: internship.id,
      },
      data: {
        status: "REPORT_LATE",
      },
    });
  }

  if (!hasMissingWeeks && internship.status === "REPORT_LATE") {
    return await prisma.internship.update({
      where: {
        id: internship.id,
      },
      data: {
        status: "IN_PROGRESS",
      },
    });
  }

  return internship;
};

export const syncPfeWorkflowStatus = async (internshipId) => {
  const internship = await prisma.internship.findUnique({
    where: {
      id: Number(internshipId),
    },
  });

  if (!internship || terminalStatuses.includes(internship.status)) {
    return internship;
  }

  const documents = await prisma.document.findMany({
    where: {
      internshipId: Number(internshipId),
      category: {
        in: PFE_CATEGORIES,
      },
    },
  });

  const validatedCategories = new Set(
    documents
      .filter((document) => document.validationStatus === "VALIDATED")
      .map((document) => document.category),
  );

  const allValidated = PFE_CATEGORIES.every((category) =>
    validatedCategories.has(category),
  );

  if (allValidated) {
    if (internship.status === "READY_FOR_DEFENSE") {
      return internship;
    }

    return await prisma.internship.update({
      where: {
        id: internship.id,
      },
      data: {
        status: "READY_FOR_DEFENSE",
      },
    });
  }

  const finalValidated = validatedCategories.has("FINAL");

  if (
    finalValidated &&
    reportWritingFromStatuses.includes(internship.status)
  ) {
    return await prisma.internship.update({
      where: {
        id: internship.id,
      },
      data: {
        status: "REPORT_WRITING",
      },
    });
  }

  return internship;
};

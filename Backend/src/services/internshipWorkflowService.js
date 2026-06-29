import prisma from "../config/prisma.js";
import { PFE_CATEGORIES } from "../utils/pfeDocumentRules.js";
import {
  getMissingWeeks,
  normalizeWeekStartDate,
} from "../utils/reportWeekUtils.js";

const frozenStatuses = [
  "DEFENSE_AUTHORIZED",
  "DEFENSE_NOT_AUTHORIZED",
  "CLOSED",
];

const followUpStatuses = [
  "SUBJECT_VALIDATED",
  "IN_PROGRESS",
  "REPORT_LATE",
  "REPORT_WRITING",
  "READY_FOR_DEFENSE",
];

const reportLateFromStatuses = [
  "SUBJECT_VALIDATED",
  "IN_PROGRESS",
  "REPORT_WRITING",
];

const resolveFollowUpStatus = ({
  currentStatus,
  hasReports,
  hasMissingWeeks,
  hasPfeDocs,
  allPfeValidated,
}) => {
  if (allPfeValidated) {
    return "READY_FOR_DEFENSE";
  }

  if (hasMissingWeeks && reportLateFromStatuses.includes(currentStatus)) {
    return "REPORT_LATE";
  }

  if (hasPfeDocs) {
    return "REPORT_WRITING";
  }

  if (hasReports || currentStatus === "SUBJECT_VALIDATED") {
    return hasReports ? "IN_PROGRESS" : "SUBJECT_VALIDATED";
  }

  if (currentStatus === "REPORT_LATE" && !hasMissingWeeks) {
    return "IN_PROGRESS";
  }

  return currentStatus;
};

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

export const syncInternshipWorkflowStatus = async (
  internshipId,
  { hasMissingWeeks } = {},
) => {
  const internship = await prisma.internship.findUnique({
    where: {
      id: Number(internshipId),
    },
    include: {
      weeklyReports: {
        select: {
          weekStartDate: true,
        },
      },
      documents: {
        where: {
          category: {
            in: PFE_CATEGORIES,
          },
        },
        select: {
          category: true,
          validationStatus: true,
        },
      },
    },
  });

  if (!internship || frozenStatuses.includes(internship.status)) {
    return internship;
  }

  if (!followUpStatuses.includes(internship.status)) {
    return internship;
  }

  let missingWeeks = hasMissingWeeks;

  if (missingWeeks === undefined && internship.supervisorId) {
    const existingWeeks = internship.weeklyReports.map((report) =>
      normalizeWeekStartDate(report.weekStartDate),
    );
    missingWeeks =
      getMissingWeeks(internship.startDate, existingWeeks).length > 0;
  }

  const hasReports = internship.weeklyReports.length > 0;
  const hasPfeDocs = internship.documents.length > 0;
  const validatedCategories = new Set(
    internship.documents
      .filter((document) => document.validationStatus === "VALIDATED")
      .map((document) => document.category),
  );
  const allPfeValidated = PFE_CATEGORIES.every((category) =>
    validatedCategories.has(category),
  );

  const newStatus = resolveFollowUpStatus({
    currentStatus: internship.status,
    hasReports,
    hasMissingWeeks: Boolean(missingWeeks),
    hasPfeDocs,
    allPfeValidated,
  });

  if (newStatus === internship.status) {
    return internship;
  }

  return await prisma.internship.update({
    where: {
      id: internship.id,
    },
    data: {
      status: newStatus,
    },
  });
};

export const transitionAfterWeeklyReport = async (internshipId) =>
  syncInternshipWorkflowStatus(internshipId);

export const syncReportLateStatus = async (internshipId, hasMissingWeeks) =>
  syncInternshipWorkflowStatus(internshipId, { hasMissingWeeks });

export const syncPfeWorkflowStatus = async (internshipId) =>
  syncInternshipWorkflowStatus(internshipId);

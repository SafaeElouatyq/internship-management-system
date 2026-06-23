import fs from "fs";
import path from "path";
import prisma from "../config/prisma.js";
import { uploadDir } from "../config/upload.js";
import {
  addDaysToDateKey,
  canCreateReportForWeek,
  canModifyReport,
  dateKeyToDate,
  formatWeekLabel,
  getMissingWeeks,
  getReportStatusForSubmission,
  getSubmissionContext,
  getSubmissionWindowMessage,
  normalizeWeekStartDate,
} from "../utils/reportWeekUtils.js";
import { createNotification } from "./notificationService.js";
import {
  getInternshipUserIds,
  syncReportLateStatus,
  transitionAfterWeeklyReport,
} from "./internshipWorkflowService.js";

const reportInclude = {
  internship: {
    include: {
      student: {
        include: {
          user: true,
        },
      },
      company: true,
      supervisor: {
        include: {
          user: true,
        },
      },
    },
  },
  attachments: true,
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

const getAttachmentType = (mimetype) => {
  if (mimetype === "application/pdf") {
    return "PDF";
  }

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "DOCX";
  }

  if (mimetype.startsWith("image/")) {
    return "IMAGE";
  }

  return "FICHIER";
};

const validateReportFields = ({ completedWork, progress }) => {
  if (!completedWork?.trim() || progress === undefined || progress === "") {
    throw new Error("Le travail réalisé et la progression sont obligatoires");
  }

  const progressValue = Number(progress);

  if (Number.isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
    throw new Error("La progression doit être comprise entre 0 et 100");
  }

  return {
    completedWork: completedWork.trim(),
    progress: progressValue,
  };
};

const buildAttachmentData = (files = []) =>
  files.map((file) => ({
    name: file.originalname,
    path: `/uploads/${file.filename}`,
    type: getAttachmentType(file.mimetype),
  }));

const enrichReport = (report, date = new Date()) => {
  const weekStartDate = normalizeWeekStartDate(report.weekStartDate);

  return {
    ...report,
    weekStartDate,
    weekLabel: formatWeekLabel(weekStartDate),
    canEdit: canModifyReport(weekStartDate, date),
    canDelete: canModifyReport(weekStartDate, date),
  };
};

const getStudentReportById = async (studentId, reportId) => {
  const report = await prisma.weeklyReport.findFirst({
    where: {
      id: Number(reportId),
      internship: {
        studentId,
      },
    },
    include: reportInclude,
  });

  if (!report) {
    throw new Error("Rapport introuvable");
  }

  return report;
};

const getSupervisorReportById = async (supervisorId, reportId) => {
  const report = await prisma.weeklyReport.findFirst({
    where: {
      id: Number(reportId),
      internship: {
        supervisorId,
      },
    },
    include: reportInclude,
  });

  if (!report) {
    throw new Error("Rapport introuvable");
  }

  return report;
};

export const createWeeklyReport = async (userId, reportData, files = []) => {
  const { completedWork, progress } = validateReportFields(reportData);
  const { difficulties, nextWeekPlan } = reportData;
  const now = new Date();
  const submissionContext = getSubmissionContext(now);

  if (!submissionContext.canCreate) {
    throw new Error(
      "La fenêtre de soumission est fermée. Soumission autorisée du samedi 19h00 au samedi 19h00 suivant (heure du Maroc).",
    );
  }

  const student = await getStudentByUserId(userId);
  const internship = await getActiveInternship(student.id);
  const weekStartDate = submissionContext.weekStartDate;

  const existingReport = await prisma.weeklyReport.findUnique({
    where: {
      internshipId_weekStartDate: {
        internshipId: internship.id,
        weekStartDate: dateKeyToDate(weekStartDate),
      },
    },
  });

  if (existingReport) {
    throw new Error("Un rapport existe déjà pour cette semaine");
  }

  if (!canCreateReportForWeek(weekStartDate, now)) {
    throw new Error(
      "Impossible de soumettre un rapport en dehors de la fenêtre autorisée",
    );
  }

  const report = await prisma.weeklyReport.create({
    data: {
      completedWork,
      difficulties: difficulties?.trim() || null,
      nextWeekPlan: nextWeekPlan?.trim() || null,
      progress,
      weekStartDate: dateKeyToDate(weekStartDate),
      status: getReportStatusForSubmission(submissionContext.windowType),
      internship: {
        connect: {
          id: internship.id,
        },
      },
      ...(files.length && {
        attachments: {
          create: buildAttachmentData(files),
        },
      }),
    },
    include: reportInclude,
  });

  await transitionAfterWeeklyReport(internship.id);

  const userIds = await getInternshipUserIds(internship.id);

  if (userIds?.supervisorUserId) {
    await createNotification(
      userIds.supervisorUserId,
      "Nouveau rapport hebdomadaire",
      "Un étudiant a soumis un rapport hebdomadaire.",
      {
        type: "ACTION",
        link: "/supervisor/reports",
      },
    );
  }

  return report;
};

export const updateWeeklyReport = async (userId, reportId, reportData, files = []) => {
  const { completedWork, progress } = validateReportFields(reportData);
  const { difficulties, nextWeekPlan, removedAttachmentIds = [] } = reportData;
  const student = await getStudentByUserId(userId);
  const report = await getStudentReportById(student.id, reportId);
  const weekStartDate = normalizeWeekStartDate(report.weekStartDate);

  if (!canModifyReport(weekStartDate)) {
    throw new Error(
      "Ce rapport est en lecture seule. Modification autorisée uniquement pendant la fenêtre du samedi 19h00 au lundi 10h00 (heure du Maroc).",
    );
  }

  const idsToRemove = Array.isArray(removedAttachmentIds)
    ? removedAttachmentIds.map(Number).filter(Boolean)
    : typeof removedAttachmentIds === "string" && removedAttachmentIds
      ? removedAttachmentIds.split(",").map(Number).filter(Boolean)
      : [];

  if (idsToRemove.length) {
    const attachments = await prisma.reportAttachment.findMany({
      where: {
        id: {
          in: idsToRemove,
        },
        weeklyReportId: report.id,
      },
    });

    for (const attachment of attachments) {
      const filePath = path.join(
        uploadDir,
        path.basename(attachment.path),
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.reportAttachment.deleteMany({
      where: {
        id: {
          in: attachments.map((attachment) => attachment.id),
        },
      },
    });
  }

  return await prisma.weeklyReport.update({
    where: {
      id: report.id,
    },
    data: {
      completedWork,
      difficulties: difficulties?.trim() || null,
      nextWeekPlan: nextWeekPlan?.trim() || null,
      progress,
      ...(files.length && {
        attachments: {
          create: buildAttachmentData(files),
        },
      }),
    },
    include: reportInclude,
  });
};

export const deleteWeeklyReport = async (userId, reportId) => {
  const student = await getStudentByUserId(userId);
  const report = await getStudentReportById(student.id, reportId);
  const weekStartDate = normalizeWeekStartDate(report.weekStartDate);

  if (!canModifyReport(weekStartDate)) {
    throw new Error(
      "La suppression n'est autorisée que pendant la fenêtre du samedi 19h00 au lundi 10h00 (heure du Maroc).",
    );
  }

  for (const attachment of report.attachments) {
    const filePath = path.join(uploadDir, path.basename(attachment.path));

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await prisma.weeklyReport.delete({
    where: {
      id: report.id,
    },
  });

  return {
    message: "Rapport supprimé avec succès",
  };
};

export const getWeeklyReportByIdForStudent = async (userId, reportId) => {
  const student = await getStudentByUserId(userId);
  const report = await getStudentReportById(student.id, reportId);
  return enrichReport(report);
};

export const getMyWeeklyReports = async (userId) => {
  const student = await getStudentByUserId(userId);
  const now = new Date();
  const submissionContext = getSubmissionContext(now);

  let internship = null;

  try {
    internship = await getActiveInternship(student.id);
  } catch {
    internship = await prisma.internship.findFirst({
      where: {
        studentId: student.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  const reports = await prisma.weeklyReport.findMany({
    where: {
      internship: {
        studentId: student.id,
      },
    },
    include: reportInclude,
    orderBy: {
      weekStartDate: "desc",
    },
  });

  const enrichedReports = reports.map((report) => enrichReport(report, now));
  const missingWeeks =
    internship && internship.supervisorId
      ? getMissingWeeks(
          internship.startDate,
          reports.map((report) => normalizeWeekStartDate(report.weekStartDate)),
          now,
        )
      : [];

  const existingCurrentWeek = reports.some(
    (report) =>
      normalizeWeekStartDate(report.weekStartDate) ===
      submissionContext.weekStartDate,
  );

  if (internship) {
    await syncReportLateStatus(internship.id, missingWeeks.length > 0);
  }

  return {
    reports: enrichedReports,
    missingWeeks,
    submissionContext: {
      ...submissionContext,
      weekLabel: formatWeekLabel(submissionContext.weekStartDate),
      message: getSubmissionWindowMessage(submissionContext),
      canCreate: submissionContext.canCreate && !existingCurrentWeek,
    },
  };
};

export const getSupervisorWeeklyReports = async (
  userId,
  { student = "", status = "" } = {},
) => {
  const supervisor = await getSupervisorByUserId(userId);
  const where = {
    internship: {
      supervisorId: supervisor.id,
    },
  };

  if (student) {
    where.internship.student = {
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

  const reports = await prisma.weeklyReport.findMany({
    where,
    include: reportInclude,
    orderBy: {
      weekStartDate: "desc",
    },
  });

  return reports.map((report) => enrichReport(report));
};

export const getSupervisorWeeklyReportById = async (userId, reportId) => {
  const supervisor = await getSupervisorByUserId(userId);
  const report = await getSupervisorReportById(supervisor.id, reportId);
  return enrichReport(report);
};

export const updateSupervisorReportComment = async (
  userId,
  reportId,
  supervisorComment,
) => {
  const supervisor = await getSupervisorByUserId(userId);
  const report = await getSupervisorReportById(supervisor.id, reportId);

  const updatedReport = await prisma.weeklyReport.update({
    where: {
      id: Number(reportId),
    },
    data: {
      supervisorComment: supervisorComment?.trim() || null,
    },
    include: reportInclude,
  });

  const studentUserId = report.internship?.student?.user?.id;

  if (studentUserId && supervisorComment?.trim()) {
    await createNotification(
      studentUserId,
      "Commentaire sur votre rapport",
      "Votre encadrant a laissé un commentaire sur un rapport hebdomadaire.",
      {
        type: "INFO",
        link: "/student/reports",
      },
    );
  }

  return updatedReport;
};

export const getSupervisorReportStats = async (userId) => {
  const supervisor = await getSupervisorByUserId(userId);
  const now = new Date();
  const submissionContext = getSubmissionContext(now);

  const internships = await prisma.internship.findMany({
    where: {
      supervisorId: supervisor.id,
      status: {
        in: activeStatuses,
      },
    },
    include: {
      weeklyReports: {
        select: {
          weekStartDate: true,
          status: true,
        },
      },
    },
  });

  let onTimeCount = 0;
  let lateCount = 0;
  let missingCount = 0;

  for (const internship of internships) {
    const existingWeeks = internship.weeklyReports.map((report) =>
      normalizeWeekStartDate(report.weekStartDate),
    );
    const missingWeeks = getMissingWeeks(
      internship.startDate,
      existingWeeks,
      now,
    );

    missingCount += missingWeeks.length;
    onTimeCount += internship.weeklyReports.filter(
      (report) => report.status === "SUBMITTED_ON_TIME",
    ).length;
    lateCount += internship.weeklyReports.filter(
      (report) => report.status === "SUBMITTED_LATE",
    ).length;
  }

  return {
    submittedCount: onTimeCount + lateCount,
    onTimeCount,
    lateCount,
    missingCount,
    currentWeekStartDate: submissionContext.weekStartDate,
  };
};

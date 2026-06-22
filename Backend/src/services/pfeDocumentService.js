import fs from "fs";
import path from "path";
import prisma from "../config/prisma.js";
import { uploadDir } from "../config/upload.js";
import {
  PFE_CATEGORIES,
  PFE_CATEGORY_LABELS,
} from "../utils/pfeDocumentRules.js";

const documentInclude = {
  internship: {
    include: {
      student: {
        include: {
          user: true,
        },
      },
      supervisor: {
        include: {
          user: true,
        },
      },
    },
  },
};

const pfeEligibleStatuses = [
  "SUBJECT_VALIDATED",
  "IN_PROGRESS",
  "REPORT_LATE",
  "REPORT_WRITING",
  "READY_FOR_DEFENSE",
  "DEFENSE_AUTHORIZED",
  "DEFENSE_NOT_AUTHORIZED",
];

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

const getFileType = (mimetype) => {
  if (mimetype === "application/pdf") {
    return "PDF";
  }

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "DOCX";
  }

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return "PPTX";
  }

  return "FICHIER";
};

const getStudentInternshipForPfe = async (studentId) => {
  const internship = await prisma.internship.findFirst({
    where: {
      studentId,
      supervisorId: {
        not: null,
      },
      status: {
        in: pfeEligibleStatuses,
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

  throw new Error(
    "Votre stage n'est pas encore prêt pour le dépôt du rapport PFE. Le sujet doit être validé par l'encadrant.",
  );
};

const removeFile = (documentPath) => {
  const filePath = path.join(uploadDir, path.basename(documentPath));

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const getSupervisorDocument = async (supervisorId, documentId) => {
  const document = await prisma.document.findFirst({
    where: {
      id: Number(documentId),
      category: {
        not: null,
      },
      internship: {
        supervisorId,
      },
    },
    include: documentInclude,
  });

  if (!document) {
    throw new Error("Document PFE introuvable");
  }

  return document;
};

export const uploadPfeDocument = async (userId, { category }, file) => {
  if (!category || !PFE_CATEGORIES.includes(category)) {
    throw new Error("Type de document PFE invalide");
  }

  if (!file) {
    throw new Error("Le fichier est obligatoire");
  }

  const student = await getStudentByUserId(userId);
  const internship = await getStudentInternshipForPfe(student.id);

  const existingDocument = await prisma.document.findFirst({
    where: {
      internshipId: internship.id,
      category,
    },
  });

  if (
    existingDocument &&
    existingDocument.validationStatus === "VALIDATED"
  ) {
    throw new Error(
      "Ce document est validé. L'encadrant doit demander une correction avant un nouveau dépôt.",
    );
  }

  const documentData = {
    name: PFE_CATEGORY_LABELS[category],
    path: `/uploads/${file.filename}`,
    type: getFileType(file.mimetype),
    category,
    validationStatus: "PENDING",
    supervisorComment: null,
  };

  if (existingDocument) {
    removeFile(existingDocument.path);

    return await prisma.document.update({
      where: {
        id: existingDocument.id,
      },
      data: documentData,
      include: documentInclude,
    });
  }

  return await prisma.document.create({
    data: {
      ...documentData,
      internship: {
        connect: {
          id: internship.id,
        },
      },
    },
    include: documentInclude,
  });
};

export const getMyPfeDocuments = async (userId) => {
  const student = await getStudentByUserId(userId);

  const documents = await prisma.document.findMany({
    where: {
      internship: {
        studentId: student.id,
      },
      category: {
        not: null,
      },
    },
    include: documentInclude,
    orderBy: {
      category: "asc",
    },
  });

  const uploadedCategories = new Set(documents.map((document) => document.category));

  const missingCategories = PFE_CATEGORIES.filter(
    (category) => !uploadedCategories.has(category),
  ).map((category) => ({
    category,
    label: PFE_CATEGORY_LABELS[category],
    status: "MISSING",
  }));

  return {
    documents,
    missingCategories,
  };
};

export const deletePfeDocument = async (userId, documentId) => {
  const student = await getStudentByUserId(userId);

  const document = await prisma.document.findFirst({
    where: {
      id: Number(documentId),
      category: {
        not: null,
      },
      internship: {
        studentId: student.id,
      },
    },
  });

  if (!document) {
    throw new Error("Document PFE introuvable");
  }

  if (document.validationStatus === "VALIDATED") {
    throw new Error("Un document validé ne peut pas être supprimé");
  }

  removeFile(document.path);

  await prisma.document.delete({
    where: {
      id: document.id,
    },
  });

  return {
    message: "Document supprimé avec succès",
  };
};

export const getSupervisorPfeDocuments = async (
  userId,
  { student = "", category = "", validationStatus = "" } = {},
) => {
  const supervisor = await getSupervisorByUserId(userId);

  const where = {
    category: {
      not: null,
    },
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

  if (category) {
    where.category = category;
  }

  if (validationStatus) {
    where.validationStatus = validationStatus;
  }

  return await prisma.document.findMany({
    where,
    include: documentInclude,
    orderBy: [{ uploadedAt: "desc" }],
  });
};

export const validatePfeDocument = async (
  userId,
  documentId,
  { validationStatus, supervisorComment },
) => {
  if (
    !validationStatus ||
    !["VALIDATED", "NEEDS_CORRECTION", "REJECTED"].includes(validationStatus)
  ) {
    throw new Error("Décision de validation invalide");
  }

  const supervisor = await getSupervisorByUserId(userId);
  await getSupervisorDocument(supervisor.id, documentId);

  return await prisma.document.update({
    where: {
      id: Number(documentId),
    },
    data: {
      validationStatus,
      supervisorComment: supervisorComment?.trim() || null,
    },
    include: documentInclude,
  });
};

export const getPfeDocumentByIdForSupervisor = async (userId, documentId) => {
  const supervisor = await getSupervisorByUserId(userId);
  return await getSupervisorDocument(supervisor.id, documentId);
};

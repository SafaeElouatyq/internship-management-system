import fs from "fs";
import path from "path";
import prisma from "../config/prisma.js";
import { uploadDir } from "../config/upload.js";
import { createNotification } from "./notificationService.js";
import { notifyInternshipManagers } from "../utils/notificationHelpers.js";
import { getInternshipUserIds } from "./internshipWorkflowService.js";
import { notificationLinks } from "../utils/notificationLinks.js";

const ALLOWED_TYPES = ["CONVENTION", "ATTESTATION", "OTHER"];

const VIEW_ROLES = [
  "STUDENT",
  "SUPERVISOR",
  "INTERNSHIP_MANAGER",
  "ADMIN",
  "DEPARTMENT_HEAD",
];

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
  uploadedBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
};

const getInternshipById = async (internshipId) => {
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
    throw new Error("Stage introuvable");
  }

  return internship;
};

const assertCanViewInternship = async (userId, role, internshipId) => {
  if (!VIEW_ROLES.includes(role)) {
    throw new Error("Accès refusé");
  }

  const internship = await getInternshipById(internshipId);

  if (role === "STUDENT") {
    const student = await prisma.student.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    if (!student || internship.studentId !== student.id) {
      throw new Error("Accès refusé à ce stage");
    }
  }

  if (role === "SUPERVISOR") {
    const supervisor = await prisma.supervisor.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    if (!supervisor || internship.supervisorId !== supervisor.id) {
      throw new Error("Accès refusé à ce stage");
    }
  }

  return internship;
};

const assertStudentOwnsInternship = async (userId, internshipId) => {
  const student = await prisma.student.findUnique({
    where: {
      userId: Number(userId),
    },
  });

  if (!student) {
    throw new Error("Profil étudiant introuvable");
  }

  const internship = await getInternshipById(internshipId);

  if (internship.studentId !== student.id) {
    throw new Error("Accès refusé à ce stage");
  }

  if (internship.administrativeStatus === "REJECTED") {
    throw new Error("Ce stage a été refusé");
  }

  return internship;
};

export const uploadInternshipDocument = async (
  userId,
  internshipId,
  { type },
  file,
) => {
  if (!type || !ALLOWED_TYPES.includes(type)) {
    throw new Error("Type de document invalide");
  }

  if (!file) {
    throw new Error("Le fichier est obligatoire");
  }

  await assertStudentOwnsInternship(userId, internshipId);

  const document = await prisma.internshipDocument.create({
    data: {
      type,
      fileUrl: `/uploads/${file.filename}`,
      internship: {
        connect: {
          id: Number(internshipId),
        },
      },
      uploadedBy: {
        connect: {
          id: Number(userId),
        },
      },
    },
    include: documentInclude,
  });

  const userIds = await getInternshipUserIds(Number(internshipId));

  if (userIds?.supervisorUserId) {
    await createNotification(
      userIds.supervisorUserId,
      "Nouveau document de stage",
      "Un étudiant a téléversé un document administratif de stage.",
      {
        type: "INFO",
        link: notificationLinks.supervisor.internshipDetail(internshipId),
      },
    );
  }

  await notifyInternshipManagers({
    title: "Document de stage téléversé",
    message: "Un étudiant a téléversé un document administratif.",
    type: "ACTION",
    link: notificationLinks.manager.internshipDetail(internshipId),
  });

  return document;
};

export const getInternshipDocuments = async (userId, role, internshipId) => {
  await assertCanViewInternship(userId, role, internshipId);

  return await prisma.internshipDocument.findMany({
    where: {
      internshipId: Number(internshipId),
    },
    include: documentInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAllInternshipDocuments = async () => {
  return await prisma.internshipDocument.findMany({
    include: documentInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const deleteInternshipDocument = async (userId, role, documentId) => {
  const document = await prisma.internshipDocument.findUnique({
    where: {
      id: Number(documentId),
    },
    include: {
      internship: {
        include: {
          student: true,
        },
      },
    },
  });

  if (!document) {
    throw new Error("Document introuvable");
  }

  if (role !== "STUDENT") {
    throw new Error("Seul l'étudiant peut supprimer ce document");
  }

  const student = await prisma.student.findUnique({
    where: {
      userId: Number(userId),
    },
  });

  if (!student || document.internship.studentId !== student.id) {
    throw new Error("Accès refusé");
  }

  const filePath = path.join(uploadDir, path.basename(document.fileUrl));

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await prisma.internshipDocument.delete({
    where: {
      id: document.id,
    },
  });

  return {
    message: "Document supprimé avec succès",
  };
};

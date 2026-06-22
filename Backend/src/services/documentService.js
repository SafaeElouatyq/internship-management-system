import fs from "fs";
import path from "path";
import prisma from "../config/prisma.js";
import { uploadDir } from "../config/upload.js";

const documentInclude = {
  internship: {
    include: {
      student: {
        include: {
          user: true,
        },
      },
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

  return "FICHIER";
};

const getStudentInternshipForDocument = async (studentId) => {
  const internship = await prisma.internship.findFirst({
    where: {
      studentId,
      NOT: {
        administrativeStatus: "REJECTED",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!internship) {
    throw new Error(
      "Vous n'avez aucune déclaration de stage. Déclarez d'abord votre stage.",
    );
  }

  return internship;
};

export const uploadDocument = async (userId, { name }, file) => {
  if (!name || !name.trim()) {
    throw new Error("Le nom du document est obligatoire");
  }

  if (!file) {
    throw new Error("Le fichier est obligatoire");
  }

  const student = await getStudentByUserId(userId);
  const internship = await getStudentInternshipForDocument(student.id);

  return await prisma.document.create({
    data: {
      name: name.trim(),
      path: `/uploads/${file.filename}`,
      type: getFileType(file.mimetype),
      validationStatus: "PENDING",
      internship: {
        connect: {
          id: internship.id,
        },
      },
    },
    include: documentInclude,
  });
};

export const getMyDocuments = async (userId) => {
  const student = await getStudentByUserId(userId);

  return await prisma.document.findMany({
    where: {
      internship: {
        studentId: student.id,
      },
    },
    include: documentInclude,
    orderBy: {
      uploadedAt: "desc",
    },
  });
};

export const getAllDocuments = async () => {
  return await prisma.document.findMany({
    include: documentInclude,
    orderBy: {
      uploadedAt: "desc",
    },
  });
};

export const deleteDocument = async (documentId, userId) => {
  const student = await getStudentByUserId(userId);

  const document = await prisma.document.findFirst({
    where: {
      id: Number(documentId),
      internship: {
        studentId: student.id,
      },
    },
  });

  if (!document) {
    throw new Error("Document introuvable");
  }

  const filePath = path.join(uploadDir, path.basename(document.path));

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await prisma.document.delete({
    where: {
      id: document.id,
    },
  });
};

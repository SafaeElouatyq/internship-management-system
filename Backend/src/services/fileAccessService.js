import fs from "fs";
import path from "path";
import prisma from "../config/prisma.js";
import { uploadDir } from "../config/upload.js";
import {
  getMimeType,
  sanitizeFilename,
  toStoredUploadPath,
} from "../utils/filePathUtils.js";

const internshipInclude = {
  student: {
    include: {
      department: true,
    },
  },
  supervisor: true,
};

export const assertCanAccessInternship = async (
  userId,
  role,
  internshipId,
) => {
  const internship = await prisma.internship.findUnique({
    where: {
      id: Number(internshipId),
    },
    include: internshipInclude,
  });

  if (!internship) {
    throw new Error("Stage introuvable");
  }

  if (role === "ADMIN" || role === "INTERNSHIP_MANAGER") {
    return internship;
  }

  if (role === "STUDENT") {
    const student = await prisma.student.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    if (!student || internship.studentId !== student.id) {
      throw new Error("Accès refusé");
    }

    return internship;
  }

  if (role === "SUPERVISOR") {
    const supervisor = await prisma.supervisor.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    if (!supervisor || internship.supervisorId !== supervisor.id) {
      throw new Error("Accès refusé");
    }

    return internship;
  }

  if (role === "DEPARTMENT_HEAD") {
    const departmentHead = await prisma.departmentHead.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    if (
      !departmentHead ||
      departmentHead.departmentId !== internship.student.departmentId
    ) {
      throw new Error("Accès refusé");
    }

    return internship;
  }

  throw new Error("Accès refusé");
};

const findFileRecord = async (filename) => {
  const storedPath = toStoredUploadPath(filename);

  const [internshipDocument, reportAttachment, pfeDocument] =
    await Promise.all([
      prisma.internshipDocument.findFirst({
        where: {
          fileUrl: storedPath,
        },
      }),
      prisma.reportAttachment.findFirst({
        where: {
          path: storedPath,
        },
        include: {
          weeklyReport: {
            select: {
              internshipId: true,
            },
          },
        },
      }),
      prisma.document.findFirst({
        where: {
          path: storedPath,
        },
      }),
    ]);

  if (internshipDocument) {
    return {
      internshipId: internshipDocument.internshipId,
      displayName: path.basename(internshipDocument.fileUrl),
    };
  }

  if (reportAttachment) {
    return {
      internshipId: reportAttachment.weeklyReport.internshipId,
      displayName: reportAttachment.name,
    };
  }

  if (pfeDocument) {
    return {
      internshipId: pfeDocument.internshipId,
      displayName: pfeDocument.name,
    };
  }

  return null;
};

export const getAuthorizedFile = async (userId, role, rawFilename) => {
  const filename = sanitizeFilename(rawFilename);
  const fileRecord = await findFileRecord(filename);

  if (!fileRecord) {
    throw new Error("Fichier introuvable");
  }

  await assertCanAccessInternship(userId, role, fileRecord.internshipId);

  const absolutePath = path.join(uploadDir, filename);

  if (!fs.existsSync(absolutePath)) {
    throw new Error("Fichier introuvable sur le serveur");
  }

  return {
    filename,
    absolutePath,
    displayName: fileRecord.displayName || filename,
    mimeType: getMimeType(filename),
  };
};

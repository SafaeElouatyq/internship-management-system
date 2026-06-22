import prisma from "../config/prisma.js";
import { createNotification } from "./notificationService.js";
import { getInternshipUserIds } from "./internshipWorkflowService.js";

const includeRelations = {
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
      department: true,
    },
  },
};

const validatedStatuses = [
  "ADMIN_VALIDATED",
  "SUPERVISOR_ASSIGNED",
  "SUBJECT_PENDING",
  "SUBJECT_VALIDATED",
  "IN_PROGRESS",
  "REPORT_LATE",
  "REPORT_WRITING",
  "READY_FOR_DEFENSE",
  "DEFENSE_AUTHORIZED",
  "DEFENSE_NOT_AUTHORIZED",
  "CLOSED",
];

export const getValidatedInternships = async () => {
  return await prisma.internship.findMany({
    where: {
      status: {
        in: validatedStatuses,
      },
      NOT: {
        administrativeStatus: "REJECTED",
      },
    },
    include: includeRelations,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getDepartmentHeadSupervisors = async () => {
  return await prisma.supervisor.findMany({
    include: {
      user: true,
      department: true,
    },
    orderBy: {
      user: {
        firstName: "asc",
      },
    },
  });
};

export const assignAcademicSupervisor = async (internshipId, supervisorId) => {
  const internship = await prisma.internship.findUnique({
    where: {
      id: Number(internshipId),
    },
  });

  if (!internship) {
    throw new Error("Déclaration de stage introuvable");
  }

  if (internship.status !== "ADMIN_VALIDATED") {
    throw new Error(
      "Cette déclaration n'est pas encore validée par le gestionnaire de stage",
    );
  }

  if (internship.administrativeStatus === "REJECTED") {
    throw new Error("Cette déclaration de stage a été refusée");
  }

  const supervisor = await prisma.supervisor.findUnique({
    where: {
      id: Number(supervisorId),
    },
  });

  if (!supervisor) {
    throw new Error("Encadrant introuvable");
  }

  return await prisma.internship.update({
    where: {
      id: Number(internshipId),
    },
    data: {
      supervisor: {
        connect: {
          id: Number(supervisorId),
        },
      },
      status: "SUPERVISOR_ASSIGNED",
    },
    include: includeRelations,
  }).then(async (updatedInternship) => {
    const userIds = await getInternshipUserIds(updatedInternship.id);

    if (userIds?.studentUserId) {
      await createNotification(
        userIds.studentUserId,
        "Encadrant assigné",
        "Un encadrant académique a été assigné à votre stage.",
      );
    }

    if (userIds?.supervisorUserId) {
      await createNotification(
        userIds.supervisorUserId,
        "Nouveau stagiaire",
        "Un nouveau stage vous a été assigné.",
      );
    }

    return updatedInternship;
  });
};

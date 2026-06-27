import prisma from "../config/prisma.js";
import { createNotification } from "./notificationService.js";
import { getInternshipUserIds } from "./internshipWorkflowService.js";
import { notificationLinks } from "../utils/notificationLinks.js";
import { getMinimumMeetings } from "../utils/meetingRules.js";

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

const subjectValidatedStatuses = [
  "SUBJECT_VALIDATED",
  "IN_PROGRESS",
  "REPORT_LATE",
  "REPORT_WRITING",
  "READY_FOR_DEFENSE",
  "DEFENSE_AUTHORIZED",
  "DEFENSE_NOT_AUTHORIZED",
  "CLOSED",
];

const meetingTrackedStatuses = [
  "SUPERVISOR_ASSIGNED",
  "SUBJECT_PENDING",
  "SUBJECT_VALIDATED",
  "IN_PROGRESS",
  "REPORT_LATE",
  "REPORT_WRITING",
  "READY_FOR_DEFENSE",
  "DEFENSE_AUTHORIZED",
  "DEFENSE_NOT_AUTHORIZED",
];

const getDepartmentHeadByUserId = async (userId) => {
  const departmentHead = await prisma.departmentHead.findUnique({
    where: {
      userId: Number(userId),
    },
    include: {
      department: true,
    },
  });

  if (!departmentHead) {
    throw new Error("Profil chef de filière introuvable");
  }

  return departmentHead;
};

export const getDashboardStats = async (userId) => {
  const departmentHead = await getDepartmentHeadByUserId(userId);
  const { departmentId } = departmentHead;

  const internshipWhere = {
    student: {
      departmentId,
    },
    NOT: {
      administrativeStatus: "REJECTED",
    },
  };

  const [
    totalStudents,
    declaredStudents,
    internships,
    reportsOnTime,
    reportsLate,
    meetings,
  ] = await Promise.all([
    prisma.student.count({
      where: {
        departmentId,
      },
    }),
    prisma.internship.groupBy({
      by: ["studentId"],
      where: internshipWhere,
    }),
    prisma.internship.findMany({
      where: internshipWhere,
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
        meetings: {
          select: {
            id: true,
          },
        },
      },
    }),
    prisma.weeklyReport.count({
      where: {
        status: "SUBMITTED_ON_TIME",
        internship: {
          student: {
            departmentId,
          },
        },
      },
    }),
    prisma.weeklyReport.count({
      where: {
        status: "SUBMITTED_LATE",
        internship: {
          student: {
            departmentId,
          },
        },
      },
    }),
    prisma.meeting.findMany({
      where: {
        internship: {
          student: {
            departmentId,
          },
        },
      },
      select: {
        internshipId: true,
      },
    }),
  ]);

  const declaredStudentCount = declaredStudents.length;
  const studentsWithoutInternship = Math.max(
    0,
    totalStudents - declaredStudentCount,
  );

  const studentsWithoutSupervisor = new Set(
    internships
      .filter(
        (internship) =>
          !internship.supervisorId &&
          (internship.administrativeStatus === "COMPLETE" ||
            validatedStatuses.includes(internship.status)),
      )
      .map((internship) => internship.studentId),
  ).size;

  const administrativelyValidatedCount = internships.filter(
    (internship) =>
      internship.administrativeStatus === "COMPLETE" ||
      validatedStatuses.includes(internship.status),
  ).length;

  const subjectValidatedCount = internships.filter((internship) =>
    subjectValidatedStatuses.includes(internship.status),
  ).length;

  const authorizedCount = internships.filter(
    (internship) => internship.status === "DEFENSE_AUTHORIZED",
  ).length;

  const meetingCountByInternship = meetings.reduce((counts, meeting) => {
    counts[meeting.internshipId] = (counts[meeting.internshipId] || 0) + 1;
    return counts;
  }, {});

  const incompleteMeetingsCount = internships.filter((internship) => {
    if (
      !internship.supervisorId ||
      !meetingTrackedStatuses.includes(internship.status)
    ) {
      return false;
    }

    const minimumRequired = getMinimumMeetings(internship.student?.level);

    if (!minimumRequired) {
      return false;
    }

    const meetingCount =
      meetingCountByInternship[internship.id] || internship.meetings.length;

    return meetingCount < minimumRequired;
  }).length;

  const supervisorDistributionMap = new Map();

  internships
    .filter((internship) => internship.supervisorId)
    .forEach((internship) => {
      const supervisorId = internship.supervisorId;

      if (!supervisorDistributionMap.has(supervisorId)) {
        const supervisorUser = internship.supervisor?.user;

        supervisorDistributionMap.set(supervisorId, {
          supervisorId,
          supervisorName: supervisorUser
            ? `${supervisorUser.firstName} ${supervisorUser.lastName}`.trim()
            : "Encadrant",
          studentIds: new Set(),
        });
      }

      supervisorDistributionMap
        .get(supervisorId)
        .studentIds.add(internship.studentId);
    });

  const supervisorDistribution = [...supervisorDistributionMap.values()]
    .map((entry) => ({
      supervisorId: entry.supervisorId,
      supervisorName: entry.supervisorName,
      studentCount: entry.studentIds.size,
    }))
    .sort((left, right) => right.studentCount - left.studentCount);

  return {
    department: departmentHead.department,
    stats: {
      totalStudents,
      declaredStudentCount,
      studentsWithoutInternship,
      studentsWithoutSupervisor,
      administrativelyValidatedCount,
      subjectValidatedCount,
      weeklyReportsSubmitted: reportsOnTime + reportsLate,
      weeklyReportsLate: reportsLate,
      incompleteMeetingsCount,
      authorizedCount,
    },
    supervisorDistribution,
  };
};

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
        {
          type: "SUCCESS",
          link: notificationLinks.student.internship({ detail: true }),
        },
      );
    }

    if (userIds?.supervisorUserId) {
      await createNotification(
        userIds.supervisorUserId,
        "Nouveau stagiaire",
        "Un nouveau stage vous a été assigné.",
        {
          type: "ACTION",
          link: notificationLinks.supervisor.internshipDetail(
            updatedInternship.id,
          ),
        },
      );
    }

    return updatedInternship;
  });
};

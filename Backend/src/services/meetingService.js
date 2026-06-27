import prisma from "../config/prisma.js";
import {
  assertCanCreateMeeting,
  buildMeetingContext,
  enrichMeetingsWithSequence,
} from "../utils/meetingRules.js";
import { notifyDepartmentHeads } from "../utils/notificationHelpers.js";
import { createNotification } from "./notificationService.js";
import { getInternshipUserIds } from "./internshipWorkflowService.js";
import { notificationLinks } from "../utils/notificationLinks.js";

const meetingInclude = {
  internship: {
    include: {
      student: {
        include: {
          user: true,
        },
      },
      company: true,
    },
  },
};

const validateMeetingPayload = ({
  date,
  type,
  internshipId,
  requireInternshipId = true,
}) => {
  if (requireInternshipId && !internshipId) {
    throw new Error("L'étudiant est obligatoire");
  }

  if (!date || !type) {
    throw new Error("La date et le type sont obligatoires");
  }

  if (!["PRESENTIAL", "REMOTE"].includes(type)) {
    throw new Error("Type de réunion invalide");
  }
};

const buildMeetingData = (meetingData) => {
  const {
    date,
    type,
    summary,
    discussedPoints,
    decisions,
    assignedWork,
    supervisorComment,
  } = meetingData;

  return {
    date: new Date(date),
    type,
    summary: summary?.trim() || null,
    discussedPoints: discussedPoints?.trim() || null,
    decisions: decisions?.trim() || null,
    assignedWork: assignedWork?.trim() || null,
    supervisorComment: supervisorComment?.trim() || null,
  };
};

const getSupervisorMeeting = async (supervisorId, meetingId) => {
  const meeting = await prisma.meeting.findFirst({
    where: {
      id: Number(meetingId),
      internship: {
        supervisorId,
      },
    },
    include: meetingInclude,
  });

  if (!meeting) {
    throw new Error("Réunion introuvable");
  }

  return meeting;
};

const buildLicenceCompliance = (internships, meetings) => {
  return internships
    .filter((internship) => internship.student?.level === "LICENCE")
    .map((internship) => {
      const internshipMeetings = meetings.filter(
        (meeting) => meeting.internshipId === internship.id,
      );
      const context = buildMeetingContext(internship, internshipMeetings);
      const student = internship.student?.user;

      return {
        internshipId: internship.id,
        studentName: student
          ? `${student.firstName} ${student.lastName}`
          : "Étudiant",
        meetingCount: context.meetingCount,
        minimumRequired: context.minimumRequired,
        isCompliant: context.isCompliant,
        remaining: context.remaining,
        nextSequenceNumber: context.nextSequenceNumber,
        nextSequenceLabel: context.nextSequenceLabel,
        completedSequences: context.completedSequences,
      };
    });
};

const buildMeetingContexts = (internships, meetings) =>
  Object.fromEntries(
    internships.map((internship) => {
      const internshipMeetings = meetings.filter(
        (meeting) => meeting.internshipId === internship.id,
      );

      return [
        internship.id,
        buildMeetingContext(internship, internshipMeetings),
      ];
    }),
  );

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

const getSupervisorInternships = async (supervisorId) => {
  return await prisma.internship.findMany({
    where: {
      supervisorId,
      NOT: {
        administrativeStatus: "REJECTED",
      },
    },
    include: {
      student: {
        include: {
          user: true,
        },
      },
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getStudentActiveInternship = async (studentId) =>
  prisma.internship.findFirst({
    where: {
      studentId,
      NOT: {
        administrativeStatus: "REJECTED",
      },
    },
    include: {
      student: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

export const createMeeting = async (userId, meetingData) => {
  const {
    internshipId,
    date,
    type,
    summary,
    discussedPoints,
    decisions,
    assignedWork,
    supervisorComment,
  } = meetingData;

  validateMeetingPayload({ internshipId, date, type });

  const supervisor = await getSupervisorByUserId(userId);

  const internship = await prisma.internship.findFirst({
    where: {
      id: Number(internshipId),
      supervisorId: supervisor.id,
    },
    include: {
      student: true,
    },
  });

  if (!internship) {
    throw new Error("Stage introuvable ou non assigné à cet encadrant");
  }

  const existingMeetingsCount = await prisma.meeting.count({
    where: {
      internshipId: internship.id,
    },
  });

  const { nextSequenceNumber, nextSequenceLabel } = assertCanCreateMeeting(
    internship,
    existingMeetingsCount,
  );

  const meeting = await prisma.meeting.create({
    data: {
      ...buildMeetingData({
        date,
        type,
        summary,
        discussedPoints,
        decisions,
        assignedWork,
        supervisorComment,
      }),
      internship: {
        connect: {
          id: internship.id,
        },
      },
    },
    include: meetingInclude,
  });

  const enrichedMeeting = enrichMeetingsWithSequence([meeting])[0];

  if (existingMeetingsCount === 0 && internship.status === "SUPERVISOR_ASSIGNED") {
    await prisma.internship.update({
      where: {
        id: internship.id,
      },
      data: {
        status: "SUBJECT_PENDING",
      },
    });

    await notifyDepartmentHeads(internship.student?.departmentId, {
      title: "Sujet en attente de validation",
      message: "Un sujet de stage est en attente après la première réunion.",
      type: "ACTION",
      link: notificationLinks.departmentHead.internships(),
    });
  }

  const userIds = await getInternshipUserIds(internship.id);

  if (userIds?.studentUserId) {
    await createNotification(
      userIds.studentUserId,
      `${nextSequenceLabel} planifiée`,
      `Votre encadrant a planifié ${nextSequenceLabel.toLowerCase()}.`,
      {
        type: "INFO",
        link: notificationLinks.student.meetings(),
      },
    );
  }

  return enrichedMeeting;
};

export const updateMeeting = async (userId, meetingId, meetingData) => {
  const { date, type, summary, discussedPoints, decisions, assignedWork, supervisorComment } =
    meetingData;

  validateMeetingPayload({
    date,
    type,
    requireInternshipId: false,
  });

  const supervisor = await getSupervisorByUserId(userId);
  await getSupervisorMeeting(supervisor.id, meetingId);

  const meeting = await prisma.meeting.update({
    where: {
      id: Number(meetingId),
    },
    data: buildMeetingData({
      date,
      type,
      summary,
      discussedPoints,
      decisions,
      assignedWork,
      supervisorComment,
    }),
    include: meetingInclude,
  });

  return enrichMeetingsWithSequence([meeting])[0];
};

export const deleteMeeting = async (userId, meetingId) => {
  const supervisor = await getSupervisorByUserId(userId);
  const meeting = await getSupervisorMeeting(supervisor.id, meetingId);

  const laterMeeting = await prisma.meeting.findFirst({
    where: {
      internshipId: meeting.internshipId,
      id: {
        gt: meeting.id,
      },
    },
  });

  if (laterMeeting) {
    throw new Error(
      "Impossible de supprimer cette rencontre : supprimez d'abord les rencontres suivantes",
    );
  }

  const internship = await prisma.internship.findUnique({
    where: {
      id: meeting.internshipId,
    },
    include: {
      subjectValidations: {
        take: 1,
      },
    },
  });

  const remainingMeetingsCount = await prisma.meeting.count({
    where: {
      internshipId: meeting.internshipId,
      NOT: {
        id: meeting.id,
      },
    },
  });

  await prisma.meeting.delete({
    where: {
      id: meeting.id,
    },
  });

  if (
    remainingMeetingsCount === 0 &&
    internship?.status === "SUBJECT_PENDING" &&
    !internship.subjectValidations.length
  ) {
    await prisma.internship.update({
      where: {
        id: internship.id,
      },
      data: {
        status: "SUPERVISOR_ASSIGNED",
      },
    });
  }

  return {
    message: "Réunion supprimée avec succès",
  };
};

export const getMeetingByIdForSupervisor = async (userId, meetingId) => {
  const supervisor = await getSupervisorByUserId(userId);
  const meeting = await getSupervisorMeeting(supervisor.id, meetingId);

  return enrichMeetingsWithSequence([meeting])[0];
};

export const getStudentMeetings = async (userId) => {
  const student = await getStudentByUserId(userId);

  const [meetings, internship] = await Promise.all([
    prisma.meeting.findMany({
      where: {
        internship: {
          studentId: student.id,
        },
      },
      include: meetingInclude,
      orderBy: {
        date: "desc",
      },
    }),
    getStudentActiveInternship(student.id),
  ]);

  const enrichedMeetings = enrichMeetingsWithSequence(meetings);

  return {
    meetings: enrichedMeetings,
    meetingContext: internship
      ? buildMeetingContext(internship, meetings)
      : null,
  };
};

export const getSupervisorMeetings = async (userId) => {
  const supervisor = await getSupervisorByUserId(userId);

  const [meetings, internships] = await Promise.all([
    prisma.meeting.findMany({
      where: {
        internship: {
          supervisorId: supervisor.id,
        },
      },
      include: meetingInclude,
      orderBy: {
        date: "desc",
      },
    }),
    getSupervisorInternships(supervisor.id),
  ]);

  const enrichedMeetings = enrichMeetingsWithSequence(meetings);

  return {
    meetings: enrichedMeetings,
    internships,
    licenceCompliance: buildLicenceCompliance(internships, meetings),
    meetingContexts: buildMeetingContexts(internships, meetings),
  };
};

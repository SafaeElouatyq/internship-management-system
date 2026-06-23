import prisma from "../config/prisma.js";
import { MIN_MEETINGS_BY_LEVEL } from "../utils/meetingRules.js";
import { notifyDepartmentHeads } from "../utils/notificationHelpers.js";

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
      const meetingCount = meetings.filter(
        (meeting) => meeting.internshipId === internship.id,
      ).length;
      const minimumRequired = MIN_MEETINGS_BY_LEVEL.LICENCE;
      const student = internship.student?.user;

      return {
        internshipId: internship.id,
        studentName: student
          ? `${student.firstName} ${student.lastName}`
          : "Étudiant",
        meetingCount,
        minimumRequired,
        isCompliant: meetingCount >= minimumRequired,
        remaining: Math.max(0, minimumRequired - meetingCount),
      };
    });
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
      link: "/department-head/internships",
    });
  }

  return meeting;
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

  return await prisma.meeting.update({
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
};

export const deleteMeeting = async (userId, meetingId) => {
  const supervisor = await getSupervisorByUserId(userId);
  const meeting = await getSupervisorMeeting(supervisor.id, meetingId);

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
  return await getSupervisorMeeting(supervisor.id, meetingId);
};

export const getStudentMeetings = async (userId) => {
  const student = await getStudentByUserId(userId);

  return await prisma.meeting.findMany({
    where: {
      internship: {
        studentId: student.id,
      },
    },
    include: meetingInclude,
    orderBy: {
      date: "desc",
    },
  });
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

  return {
    meetings,
    internships,
    licenceCompliance: buildLicenceCompliance(internships, meetings),
  };
};

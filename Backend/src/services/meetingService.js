import prisma from "../config/prisma.js";

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

  if (!internshipId || !date || !type) {
    throw new Error("L'étudiant, la date et le type sont obligatoires");
  }

  if (!["PRESENTIAL", "REMOTE"].includes(type)) {
    throw new Error("Type de réunion invalide");
  }

  const supervisor = await getSupervisorByUserId(userId);

  const internship = await prisma.internship.findFirst({
    where: {
      id: Number(internshipId),
      supervisorId: supervisor.id,
    },
  });

  if (!internship) {
    throw new Error("Stage introuvable ou non assigné à cet encadrant");
  }

  return await prisma.meeting.create({
    data: {
      date: new Date(date),
      type,
      summary: summary || null,
      discussedPoints: discussedPoints || null,
      decisions: decisions || null,
      assignedWork: assignedWork || null,
      supervisorComment: supervisorComment || null,
      internship: {
        connect: {
          id: internship.id,
        },
      },
    },
    include: meetingInclude,
  });
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
  };
};

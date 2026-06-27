import prisma from "../config/prisma.js";
import { createNotification } from "./notificationService.js";
import { notifyInternshipManagers } from "../utils/notificationHelpers.js";
import { notificationLinks } from "../utils/notificationLinks.js";

const complaintInclude = {
  internship: {
    include: {
      student: {
        include: {
          user: true,
          department: true,
        },
      },
      company: true,
    },
  },
};

export const COMPLAINT_STATUSES = [
  "PENDING",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
];

const complaintStatusLabels = {
  PENDING: "En attente",
  IN_PROGRESS: "En cours",
  RESOLVED: "Traitée",
  REJECTED: "Rejetée",
};

const enrichComplaint = (complaint) => ({
  ...complaint,
  statusLabel: complaintStatusLabels[complaint.status] || complaint.status,
});

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

export const createComplaint = async (userId, { subject, description }) => {
  if (!subject?.trim()) {
    throw new Error("Le sujet est obligatoire");
  }

  if (!description?.trim()) {
    throw new Error("La description est obligatoire");
  }

  const student = await getStudentByUserId(userId);

  const internship = await prisma.internship.findFirst({
    where: {
      studentId: student.id,
      administrativeStatus: {
        not: "REJECTED",
      },
    },
    include: {
      student: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!internship) {
    throw new Error("Aucun stage actif trouvé pour déposer une réclamation");
  }

  const complaint = await prisma.complaint.create({
    data: {
      subject: subject.trim(),
      description: description.trim(),
      internship: {
        connect: {
          id: internship.id,
        },
      },
    },
    include: complaintInclude,
  });

  const studentUser = internship.student?.user;
  const studentName = studentUser
    ? `${studentUser.firstName} ${studentUser.lastName}`.trim()
    : "Un étudiant";

  await notifyInternshipManagers({
    title: "Nouvelle réclamation",
    message: `${studentName} a déposé une réclamation : ${complaint.subject.trim()}.`,
    type: "ACTION",
    link: notificationLinks.manager.complaints(complaint.id),
  });

  return enrichComplaint(complaint);
};

export const getMyComplaints = async (userId) => {
  const student = await getStudentByUserId(userId);

  const complaints = await prisma.complaint.findMany({
    where: {
      internship: {
        studentId: student.id,
      },
    },
    include: complaintInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return complaints.map(enrichComplaint);
};

export const getAllComplaints = async ({
  status = "",
  student = "",
  search = "",
} = {}) => {
  const where = {};

  if (status) {
    where.status = status;
  }

  if (student) {
    where.internship = {
      ...(where.internship || {}),
      student: {
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
            {
              email: {
                contains: student,
                mode: "insensitive",
              },
            },
          ],
        },
      },
    };
  }

  if (search) {
    where.AND = [
      ...(where.AND || []),
      {
        OR: [
          {
            subject: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    ];
  }

  const complaints = await prisma.complaint.findMany({
    where,
    include: complaintInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return complaints.map(enrichComplaint);
};

export const getComplaintById = async (complaintId) => {
  const complaint = await prisma.complaint.findUnique({
    where: {
      id: Number(complaintId),
    },
    include: complaintInclude,
  });

  if (!complaint) {
    throw new Error("Réclamation introuvable");
  }

  return enrichComplaint(complaint);
};

export const updateComplaint = async (
  managerUserId,
  complaintId,
  { status, response },
) => {
  if (!status) {
    throw new Error("Le statut est obligatoire");
  }

  if (!COMPLAINT_STATUSES.includes(status)) {
    throw new Error("Statut invalide");
  }

  if (!response?.trim()) {
    throw new Error("La réponse est obligatoire");
  }

  const complaint = await prisma.complaint.findUnique({
    where: {
      id: Number(complaintId),
    },
    include: {
      internship: {
        include: {
          student: true,
        },
      },
    },
  });

  if (!complaint) {
    throw new Error("Réclamation introuvable");
  }

  const updatedComplaint = await prisma.complaint.update({
    where: {
      id: complaint.id,
    },
    data: {
      status,
      response: response.trim(),
      handledById: Number(managerUserId),
    },
    include: complaintInclude,
  });

  const studentUserId = updatedComplaint.internship?.student?.userId;

  if (studentUserId) {
    await createNotification(
      studentUserId,
      "Réponse à votre réclamation",
      `Votre réclamation « ${updatedComplaint.subject} » a été mise à jour.`,
      {
        type: status === "RESOLVED" ? "SUCCESS" : "INFO",
        link: notificationLinks.student.complaints(updatedComplaint.id),
      },
    );
  }

  return enrichComplaint(updatedComplaint);
};

import prisma from "../config/prisma.js";
import { notifyUsers } from "../services/notificationService.js";

export const getInternshipManagerUserIds = async () => {
  const managers = await prisma.internshipManager.findMany({
    select: {
      userId: true,
    },
  });

  return managers.map((manager) => manager.userId);
};

export const getDepartmentHeadUserIds = async (departmentId = null) => {
  const heads = await prisma.departmentHead.findMany({
    where: departmentId ? { departmentId: Number(departmentId) } : undefined,
    select: {
      userId: true,
    },
  });

  return heads.map((head) => head.userId);
};

export const getAdminUserIds = async () => {
  const admins = await prisma.admin.findMany({
    select: {
      userId: true,
    },
  });

  return admins.map((admin) => admin.userId);
};

export const notifyInternshipManagers = async (payload) => {
  const userIds = await getInternshipManagerUserIds();
  await notifyUsers(userIds, payload);
};

export const notifyDepartmentHeads = async (departmentId, payload) => {
  const userIds = await getDepartmentHeadUserIds(departmentId);
  await notifyUsers(userIds, payload);
};

export const notifyAdmins = async (payload) => {
  const userIds = await getAdminUserIds();
  await notifyUsers(userIds, payload);
};

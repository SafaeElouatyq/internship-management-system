import prisma from "../config/prisma.js";

const ALLOWED_TYPES = ["INFO", "SUCCESS", "WARNING", "ACTION"];

export const createNotification = async (
  userId,
  title,
  message,
  { type = "INFO", link = null } = {},
) => {
  if (!userId || !title?.trim() || !message?.trim()) {
    return null;
  }

  const notificationType = ALLOWED_TYPES.includes(type) ? type : "INFO";

  return await prisma.notification.create({
    data: {
      title: title.trim(),
      message: message.trim(),
      type: notificationType,
      link: link?.trim() || null,
      user: {
        connect: {
          id: Number(userId),
        },
      },
    },
  });
};

export const notifyUsers = async (
  userIds,
  { title, message, type = "INFO", link = null },
) => {
  const uniqueUserIds = [...new Set(userIds.filter(Boolean).map(Number))];

  await Promise.all(
    uniqueUserIds.map((userId) =>
      createNotification(userId, title, message, { type, link }),
    ),
  );
};

export const getMyNotifications = async (userId) => {
  const notifications = await prisma.notification.findMany({
    where: {
      userId: Number(userId),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return {
    notifications,
    unreadCount,
  };
};

export const getUnreadCount = async (userId) => {
  const unreadCount = await prisma.notification.count({
    where: {
      userId: Number(userId),
      isRead: false,
    },
  });

  return { unreadCount };
};

export const markNotificationAsRead = async (userId, notificationId) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: Number(notificationId),
      userId: Number(userId),
    },
  });

  if (!notification) {
    throw new Error("Notification introuvable");
  }

  if (notification.isRead) {
    return notification;
  }

  return await prisma.notification.update({
    where: {
      id: notification.id,
    },
    data: {
      isRead: true,
    },
  });
};

export const markAllNotificationsAsRead = async (userId) => {
  await prisma.notification.updateMany({
    where: {
      userId: Number(userId),
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return {
    message: "Toutes les notifications ont été marquées comme lues",
  };
};

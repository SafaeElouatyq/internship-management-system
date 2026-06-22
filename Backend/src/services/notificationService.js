import prisma from "../config/prisma.js";

export const createNotification = async (userId, title, message) => {
  if (!userId || !title?.trim() || !message?.trim()) {
    return null;
  }

  return await prisma.notification.create({
    data: {
      title: title.trim(),
      message: message.trim(),
      user: {
        connect: {
          id: Number(userId),
        },
      },
    },
  });
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

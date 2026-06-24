export const openNotificationLink = async ({
  notification,
  navigate,
  markAsRead,
  refreshUnreadCount,
  onReadLocally,
}) => {
  if (!notification.isRead) {
    onReadLocally?.(notification.id);
    markAsRead(notification.id)
      .then(() => refreshUnreadCount?.())
      .catch(() => {});
  }

  if (notification.link) {
    navigate(notification.link);
  }
};

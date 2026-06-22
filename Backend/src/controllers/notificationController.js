import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notificationService.js";

export const getNotifications = async (req, res) => {
  try {
    const data = await getMyNotifications(req.user.id);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await markNotificationAsRead(
      req.user.id,
      req.params.id,
    );

    res.status(200).json({
      message: "Notification marquée comme lue",
      notification,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const result = await markAllNotificationsAsRead(req.user.id);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

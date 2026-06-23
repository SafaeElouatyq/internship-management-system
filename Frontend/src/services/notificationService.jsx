import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getNotifications = async () => {
  const response = await axios.get(API_URL, getToken());
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await axios.patch(
    `${API_URL}/${notificationId}/read`,
    {},
    getToken(),
  );
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axios.patch(`${API_URL}/read-all`, {}, getToken());
  return response.data;
};

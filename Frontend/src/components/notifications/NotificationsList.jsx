import { useEffect, useState } from "react";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notificationService.jsx";

function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const MarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      loadNotifications();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour de la notification",
      );
    }
  };

  const MarkAllAsRead = async () => {
    setSuccess("");
    setError("");

    try {
      await markAllNotificationsAsRead();
      setSuccess("Toutes les notifications ont été marquées comme lues");
      loadNotifications();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour des notifications",
      );
    }
  };

  const formatDate = (value) =>
    new Date(value).toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-2xl">
          {success}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={MarkAllAsRead}
          disabled={!unreadCount || loading}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium disabled:opacity-50"
        >
          Tout marquer comme lu ({unreadCount})
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
          Chargement...
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-slate-800">
            Aucune notification
          </h3>
          <p className="text-slate-500 mt-2">
            Vos notifications apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-2xl shadow-sm border p-5 ${
                notification.isRead
                  ? "border-slate-200"
                  : "border-blue-200 bg-blue-50/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {notification.title}
                  </h3>
                  <p className="text-slate-600 mt-1">{notification.message}</p>
                  <p className="text-sm text-slate-400 mt-2">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>

                {!notification.isRead && (
                  <button
                    type="button"
                    onClick={() => MarkAsRead(notification.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                  >
                    Marquer comme lu
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default NotificationsList;

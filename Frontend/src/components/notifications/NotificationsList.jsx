import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notificationService.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";
import {
  getNotificationTypeStyle,
  NOTIFICATION_TYPE_LABELS,
} from "../../utils/notificationUtils.jsx";

function NotificationsList() {
  const navigate = useNavigate();
  const { refreshUnreadCount } = useNotifications();
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
      await refreshUnreadCount();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const OpenNotification = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id);
        await refreshUnreadCount();
      }

      if (notification.link) {
        navigate(notification.link);
      }

      loadNotifications();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de l'ouverture de la notification",
      );
    }
  };

  const MarkAllAsRead = async () => {
    setSuccess("");
    setError("");

    try {
      await markAllNotificationsAsRead();
      setSuccess("Toutes les notifications ont été marquées comme lues");
      await refreshUnreadCount();
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
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-slate-800">
            Impossible de charger les notifications
          </h3>
          <p className="text-slate-500 mt-2">
            Vérifiez votre connexion et réessayez.
          </p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError("");
              loadNotifications();
            }}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium"
          >
            Réessayer
          </button>
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
              role="button"
              tabIndex={0}
              onClick={() => OpenNotification(notification)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  OpenNotification(notification);
                }
              }}
              className={`rounded-2xl shadow-sm border p-5 cursor-pointer transition hover:shadow-md ${
                notification.isRead
                  ? "bg-white border-slate-200"
                  : "border-blue-300 bg-blue-50/60"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getNotificationTypeStyle(notification.type)}`}
                    >
                      {NOTIFICATION_TYPE_LABELS[notification.type] ||
                        notification.type}
                    </span>
                    {!notification.isRead && (
                      <span className="inline-flex rounded-full bg-red-500 text-white px-2 py-0.5 text-xs font-semibold">
                        Non lu
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-slate-800 ${
                      notification.isRead ? "font-medium" : "font-bold"
                    }`}
                  >
                    {notification.title}
                  </h3>
                  <p className="text-slate-600 mt-1">{notification.message}</p>
                  <p className="text-sm text-slate-400 mt-2">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>

                {notification.link && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      OpenNotification(notification);
                    }}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap shrink-0"
                  >
                    <ExternalLink size={16} />
                    Ouvrir
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

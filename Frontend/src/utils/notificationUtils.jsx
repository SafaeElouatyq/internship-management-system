export const NOTIFICATION_TYPE_LABELS = {
  INFO: "Information",
  SUCCESS: "Succès",
  WARNING: "Alerte",
  ACTION: "Action requise",
};

export const NOTIFICATION_TYPE_STYLES = {
  INFO: "bg-blue-50 text-blue-700",
  SUCCESS: "bg-green-50 text-green-700",
  WARNING: "bg-amber-50 text-amber-700",
  ACTION: "bg-purple-50 text-purple-700",
};

export const getNotificationTypeStyle = (type) =>
  NOTIFICATION_TYPE_STYLES[type] || NOTIFICATION_TYPE_STYLES.INFO;

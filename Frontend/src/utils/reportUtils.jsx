export const reportStatusLabels = {
  SUBMITTED_ON_TIME: "Soumis à temps",
  SUBMITTED_LATE: "Soumis en retard",
  MISSING: "Rapport manquant",
};

export const reportStatusStyles = {
  SUBMITTED_ON_TIME: "bg-green-50 text-green-700",
  SUBMITTED_LATE: "bg-amber-50 text-amber-700",
  MISSING: "bg-red-50 text-red-700",
};

export const getReportAttachmentUrl = (attachmentPath) => {
  if (!attachmentPath) {
    return "#";
  }

  if (attachmentPath.startsWith("http")) {
    return attachmentPath;
  }

  return `http://localhost:5000${attachmentPath}`;
};

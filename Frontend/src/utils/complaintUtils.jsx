export const COMPLAINT_STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  { value: "PENDING", label: "En attente" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "RESOLVED", label: "Traitée" },
  { value: "REJECTED", label: "Rejetée" },
];

export const COMPLAINT_STATUS_LABELS = {
  PENDING: "En attente",
  IN_PROGRESS: "En cours",
  RESOLVED: "Traitée",
  REJECTED: "Rejetée",
};

export const getComplaintStatusLabel = (status) =>
  COMPLAINT_STATUS_LABELS[status] || status;

export const getComplaintStatusBadgeClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700";
    case "RESOLVED":
      return "bg-green-50 text-green-700";
    case "REJECTED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export const formatComplaintDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const getComplaintStudentName = (complaint) => {
  const user = complaint.internship?.student?.user;

  if (!user) {
    return "-";
  }

  return `${user.firstName} ${user.lastName}`.trim();
};

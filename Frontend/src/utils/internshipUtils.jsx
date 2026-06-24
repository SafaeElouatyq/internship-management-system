/** Matches Backend/prisma/schema.prisma InternshipStatus enum (order preserved). */
export const INTERNSHIP_STATUSES = [
  "DECLARED",
  "ADMIN_PENDING",
  "ADMIN_VALIDATED",
  "SUPERVISOR_ASSIGNED",
  "SUBJECT_PENDING",
  "SUBJECT_VALIDATED",
  "IN_PROGRESS",
  "REPORT_LATE",
  "REPORT_WRITING",
  "READY_FOR_DEFENSE",
  "DEFENSE_AUTHORIZED",
  "DEFENSE_NOT_AUTHORIZED",
  "CLOSED",
];

export const statusLabels = {
  DECLARED: "Déclaré",
  ADMIN_PENDING: "En attente",
  ADMIN_VALIDATED: "Stage validé",
  SUPERVISOR_ASSIGNED: "Encadrant affecté",
  SUBJECT_PENDING: "Sujet en attente",
  SUBJECT_VALIDATED: "Sujet validé",
  IN_PROGRESS: "En cours",
  REPORT_LATE: "Rapport en retard",
  REPORT_WRITING: "Rédaction du rapport",
  READY_FOR_DEFENSE: "Prêt pour soutenance",
  DEFENSE_AUTHORIZED: "Soutenance autorisée",
  DEFENSE_NOT_AUTHORIZED: "Soutenance refusée",
  CLOSED: "Clôturé",
};

export const internshipStatusOptions = INTERNSHIP_STATUSES.map((value) => ({
  value,
  label: statusLabels[value],
}));

export const getStatusLabel = (status) =>
  statusLabels[status] || status || "-";

export const administrativeStatusLabels = {
  COMPLETE: "Complet",
  INCOMPLETE: "Incomplet",
  PENDING_DOCUMENTS: "Documents en attente",
  REJECTED: "Rejeté",
};

export const canManageInternship = (internship) =>
  ["DECLARED", "ADMIN_PENDING", "SUBJECT_PENDING"].includes(internship.status) &&
  internship.administrativeStatus !== "REJECTED";

export const canModifyInternship = canManageInternship;

export const canVerifyAdministrativeFile = canManageInternship;

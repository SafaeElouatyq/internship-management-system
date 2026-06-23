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

import { PFE_CATEGORY_LABELS } from "./pfeDocumentUtils.jsx";

export const DECISION_OPTIONS = [
  {
    value: "DEFENSE_AUTHORIZED",
    label: "Autorisé à soutenir",
  },
  {
    value: "DEFENSE_AUTHORIZED_WITH_CORRECTIONS",
    label: "Autorisé sous réserve de corrections",
  },
  {
    value: "DEFENSE_NOT_AUTHORIZED",
    label: "Non autorisé à soutenir",
  },
];

export const DECISION_LABELS = {
  DEFENSE_AUTHORIZED: "Autorisé à soutenir",
  DEFENSE_AUTHORIZED_WITH_CORRECTIONS: "Autorisé sous réserve de corrections",
  DEFENSE_NOT_AUTHORIZED: "Non autorisé à soutenir",
  "Soutenance autorisée": "Autorisé à soutenir",
  "Soutenance refusée": "Non autorisé à soutenir",
};

export const getFinalReportLabel = (internship) => {
  const documents = internship.documents || [];
  const finalReport = documents.find(
    (document) => document.category === "FINAL",
  );

  return finalReport?.name || PFE_CATEGORY_LABELS.FINAL || "-";
};

export const getDecisionLabel = (internship) => {
  const decision = internship.finalDecision?.decision;

  if (decision) {
    return DECISION_LABELS[decision] || decision;
  }

  if (internship.status === "DEFENSE_AUTHORIZED") {
    return "Autorisé à soutenir";
  }

  if (internship.status === "DEFENSE_NOT_AUTHORIZED") {
    return "Non autorisé à soutenir";
  }

  return "En attente";
};

export const getDecisionBadgeClass = (internship) => {
  const decision = internship.finalDecision?.decision;

  if (canDecide(internship)) {
    return "bg-amber-50 text-amber-700";
  }

  if (
    decision === "DEFENSE_AUTHORIZED" ||
    internship.status === "DEFENSE_AUTHORIZED"
  ) {
    return "bg-green-50 text-green-700";
  }

  if (decision === "DEFENSE_AUTHORIZED_WITH_CORRECTIONS") {
    return "bg-blue-50 text-blue-700";
  }

  if (
    decision === "DEFENSE_NOT_AUTHORIZED" ||
    internship.status === "DEFENSE_NOT_AUTHORIZED"
  ) {
    return "bg-red-50 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
};

export const canDecide = (internship) =>
  internship.status === "READY_FOR_DEFENSE" && !internship.finalDecision;

export const formatDecisionDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

import { PFE_CATEGORY_LABELS } from "./pfeDocumentUtils.jsx";

export const getFinalReportLabel = (internship) => {
  const documents = internship.documents || [];
  const finalReport = documents.find(
    (document) => document.category === "FINAL",
  );

  return finalReport?.name || PFE_CATEGORY_LABELS.FINAL || "-";
};

export const getDecisionLabel = (internship) => {
  if (internship.finalDecision?.decision) {
    return internship.finalDecision.decision;
  }

  if (internship.status === "DEFENSE_AUTHORIZED") {
    return "Soutenance autorisée";
  }

  if (internship.status === "DEFENSE_NOT_AUTHORIZED") {
    return "Soutenance refusée";
  }

  return "En attente";
};

export const canDecide = (internship) => {
  return (
    internship.status === "READY_FOR_DEFENSE" && !internship.finalDecision
  );
};

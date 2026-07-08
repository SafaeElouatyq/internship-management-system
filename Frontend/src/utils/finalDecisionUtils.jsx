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

  if (canDecide(internship)) {
    return "Décision à prendre";
  }

  if (
    internship.status === "DEFENSE_AUTHORIZED" ||
    internship.status === "CLOSED"
  ) {
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
    internship.status === "DEFENSE_AUTHORIZED" ||
    internship.status === "CLOSED"
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

export const canDecide = (internship) => {
  if (internship.canDecide !== undefined) {
    return internship.canDecide;
  }

  return (
    !internship.finalDecision &&
    internship.adminValidated &&
    internship.subjectValidated &&
    isMeetingsCompliant(internship)
  );
};

export const isPendingFinalDecision = (internship) =>
  !internship.finalDecision &&
  (internship.adminValidated ?? internship.administrativeStatus === "COMPLETE") &&
  (internship.subjectValidated ??
    [
      "SUBJECT_VALIDATED",
      "IN_PROGRESS",
      "REPORT_LATE",
      "REPORT_WRITING",
      "READY_FOR_DEFENSE",
    ].includes(internship.status));

export const isMeetingsCompliant = (internship) => {
  if (internship.meetingsCompliant !== undefined) {
    return internship.meetingsCompliant;
  }

  const minimum = internship.minimumMeetingsRequired;

  if (!minimum) {
    return true;
  }

  return (internship.meetingCount ?? 0) >= minimum;
};

export const getMeetingsComplianceMessage = (internship) => {
  if (internship.finalDecision) {
    return null;
  }

  if (internship.adminValidated === false) {
    return "Décision impossible : le dossier administratif n'est pas encore validé.";
  }

  if (internship.subjectValidated === false) {
    return "Décision impossible : le sujet du stage n'est pas encore validé.";
  }

  const minimum = internship.minimumMeetingsRequired;
  const count = internship.meetingCount ?? 0;

  if (minimum && count < minimum) {
    const remaining = minimum - count;
    const levelLabel =
      internship.student?.level === "LICENCE"
        ? "Licence"
        : internship.student?.level === "MASTER"
          ? "Master"
          : internship.student?.level === "ENGINEER"
            ? "Ingénieur"
            : "ce niveau";

    return `Décision impossible : ${minimum} rencontre(s) obligatoire(s) requise(s) pour le niveau ${levelLabel} (${count}/${minimum} planifiée(s)). Il manque encore ${remaining} rencontre(s).`;
  }

  if (internship.meetingsCompleted === false) {
    return "Décision impossible : toutes les rencontres obligatoires doivent être terminées.";
  }

  return null;
};

export const formatDecisionDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

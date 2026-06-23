export const PFE_CATEGORIES = [
  "INITIAL",
  "CORRECTED",
  "FINAL",
  "PRESENTATION",
];

export const PFE_CATEGORY_LABELS = {
  INITIAL: "Version initiale",
  CORRECTED: "Version corrigée",
  FINAL: "Version finale",
  PRESENTATION: "Présentation",
};

export const PFE_VALIDATION_LABELS = {
  PENDING: "En attente",
  VALIDATED: "Validé",
  NEEDS_CORRECTION: "Nécessite correction",
  REJECTED: "Rejeté",
};

export const PFE_VALIDATION_STYLES = {
  PENDING: "bg-slate-100 text-slate-700",
  VALIDATED: "bg-green-50 text-green-700",
  NEEDS_CORRECTION: "bg-amber-50 text-amber-700",
  REJECTED: "bg-red-50 text-red-700",
};

export const SUPERVISOR_VALIDATION_OPTIONS = [
  { value: "VALIDATED", label: "Validé" },
  { value: "NEEDS_CORRECTION", label: "Nécessite correction" },
  { value: "REJECTED", label: "Rejeté" },
];

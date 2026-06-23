function PfeValidationBadge({ status }) {
  const labels = {
    PENDING: "En attente",
    VALIDATED: "Validé",
    NEEDS_CORRECTION: "Nécessite correction",
    REJECTED: "Rejeté",
    MISSING: "Non déposé",
  };

  const styles = {
    PENDING: "bg-slate-100 text-slate-700",
    VALIDATED: "bg-green-50 text-green-700",
    NEEDS_CORRECTION: "bg-amber-50 text-amber-700",
    REJECTED: "bg-red-50 text-red-700",
    MISSING: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

export default PfeValidationBadge;

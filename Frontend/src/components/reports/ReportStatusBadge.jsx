function ReportStatusBadge({ status }) {
  const labels = {
    SUBMITTED_ON_TIME: "Soumis à temps",
    SUBMITTED_LATE: "Soumis en retard",
    MISSING: "Rapport manquant",
  };

  const styles = {
    SUBMITTED_ON_TIME: "bg-green-50 text-green-700",
    SUBMITTED_LATE: "bg-amber-50 text-amber-700",
    MISSING: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {labels[status] || status || "-"}
    </span>
  );
}

export default ReportStatusBadge;

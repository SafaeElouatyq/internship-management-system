function LicenceMeetingsCompliance({ compliance = [] }) {
  if (!compliance.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Suivi réunions — Licence (minimum {compliance[0]?.minimumRequired || 3})
      </h2>

      <div className="space-y-3">
        {compliance.map((item) => (
          <div
            key={item.internshipId}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-slate-200 rounded-xl px-4 py-3"
          >
            <div>
              <p className="font-medium text-slate-800">{item.studentName}</p>
              <p className="text-sm text-slate-500">
                {item.meetingCount} / {item.minimumRequired} réunion
                {item.minimumRequired > 1 ? "s" : ""}
              </p>
            </div>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                item.isCompliant
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {item.isCompliant
                ? "Quota atteint"
                : `${item.remaining} réunion${item.remaining > 1 ? "s" : ""} restante${item.remaining > 1 ? "s" : ""}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LicenceMeetingsCompliance;

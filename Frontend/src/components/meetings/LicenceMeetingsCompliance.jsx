import { buildSequenceProgress, getMeetingSequenceLabel } from "../../utils/meetingUtils.jsx";

function LicenceMeetingsCompliance({ compliance = [] }) {
  if (!compliance.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">
        Suivi des rencontres obligatoires — Licence
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        3 rencontres séquentielles : Rencontre 1, puis 2, puis 3.
      </p>

      <div className="space-y-3">
        {compliance.map((item) => {
          const context = {
            minimumRequired: item.minimumRequired,
            completedSequences: item.completedSequences || [],
            nextSequenceNumber: item.nextSequenceNumber,
          };
          const progress = buildSequenceProgress(context);

          return (
            <div
              key={item.internshipId}
              className="border border-slate-200 rounded-xl px-4 py-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-800">{item.studentName}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {item.meetingCount} / {item.minimumRequired} rencontre
                    {item.minimumRequired > 1 ? "s" : ""} planifiée
                    {item.meetingCount > 1 ? "s" : ""}
                  </p>
                  {item.nextSequenceLabel && (
                    <p className="text-sm text-blue-700 mt-2 font-medium">
                      Prochaine : {item.nextSequenceLabel}
                    </p>
                  )}
                </div>

                <span
                  className={`inline-flex self-start rounded-full px-3 py-1 text-sm font-medium ${
                    item.isCompliant
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {item.isCompliant
                    ? "Quota atteint"
                    : `${item.remaining} restante${item.remaining > 1 ? "s" : ""}`}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {progress.map((step) => (
                  <span
                    key={step.sequenceNumber}
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      step.isCompleted
                        ? "bg-green-50 text-green-700"
                        : step.isCurrent
                          ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {getMeetingSequenceLabel(step.sequenceNumber)}
                    {step.isCompleted
                      ? " ✓"
                      : step.isCurrent
                        ? " — en cours"
                        : ""}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LicenceMeetingsCompliance;

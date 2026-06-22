function ReportDetailsModal({ report, onClose }) {
  const student = report.internship?.student?.user;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Rapport hebdomadaire
            </h2>

            <p className="text-slate-500 mt-1">
              {student?.firstName} {student?.lastName} —{" "}
              {report.submittedAt?.slice(0, 10)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
          >
            Fermer
          </button>
        </div>

        <div className="space-y-5 text-slate-700">
          <div>
            <p className="text-sm text-slate-500">Travail réalisé</p>
            <p className="font-medium mt-1">{report.completedWork}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Difficultés rencontrées</p>
            <p className="font-medium mt-1">{report.difficulties || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Plan semaine prochaine</p>
            <p className="font-medium mt-1">{report.nextWeekPlan || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Progression</p>
            <p className="font-medium mt-1">{report.progress}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportDetailsModal;

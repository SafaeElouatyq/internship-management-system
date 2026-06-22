import { Eye, Pencil, Trash2 } from "lucide-react";
import ReportStatusBadge from "./ReportStatusBadge";

function ReportTable({
  reports,
  missingWeeks = [],
  onView,
  onEdit,
  onDelete,
}) {
  const rows = [
    ...reports.map((report) => ({
      key: `report-${report.id}`,
      type: "report",
      report,
    })),
    ...missingWeeks.map((week) => ({
      key: `missing-${week.weekStartDate}`,
      type: "missing",
      week,
    })),
  ].sort((left, right) => {
    const leftDate =
      left.type === "report"
        ? left.report.weekStartDate
        : left.week.weekStartDate;
    const rightDate =
      right.type === "report"
        ? right.report.weekStartDate
        : right.week.weekStartDate;

    return rightDate.localeCompare(leftDate);
  });

  if (!rows.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Aucun rapport
        </h3>
        <p className="text-slate-500 mt-2">
          Vos rapports hebdomadaires apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">
          Mes rapports
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-4">Semaine</th>
              <th className="text-left px-4 py-4">Travail réalisé</th>
              <th className="text-left px-4 py-4">Progression</th>
              <th className="text-left px-4 py-4">Statut</th>
              <th className="text-center px-2 py-4 w-40">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              if (row.type === "missing") {
                return (
                  <tr
                    key={row.key}
                    className="border-t border-slate-200 bg-red-50/30"
                  >
                    <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                      {row.week.weekLabel}
                    </td>

                    <td className="px-4 py-4 text-slate-500 italic" colSpan={2}>
                      Aucun rapport soumis
                    </td>

                    <td className="px-4 py-4">
                      <ReportStatusBadge status="MISSING" />
                    </td>

                    <td className="px-2 py-4" />
                  </tr>
                );
              }

              const report = row.report;

              return (
                <tr
                  key={row.key}
                  className="border-t border-slate-200 hover:bg-slate-50"
                >
                  <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                    {report.weekLabel || report.weekStartDate}
                  </td>

                  <td className="px-4 py-4 text-slate-800">
                    <p className="line-clamp-2">{report.completedWork}</p>
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                      {report.progress}%
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <ReportStatusBadge status={report.status} />
                  </td>

                  <td className="px-2 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onView(report)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
                        title="Voir"
                        aria-label="Voir"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(report)}
                        disabled={!report.canEdit}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 disabled:opacity-40"
                        title="Modifier"
                        aria-label="Modifier"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(report)}
                        disabled={!report.canDelete}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-40"
                        title="Supprimer"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportTable;

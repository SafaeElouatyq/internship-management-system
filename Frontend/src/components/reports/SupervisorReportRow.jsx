import ReportStatusBadge from "./ReportStatusBadge";

function SupervisorReportRow({ report, onView }) {
  const student = report.internship?.student?.user;

  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50">
      <td className="px-4 py-4">
        <div className="font-medium text-slate-800">
          {student?.firstName} {student?.lastName}
        </div>
        <div className="text-sm text-slate-500 truncate max-w-40">
          {student?.email}
        </div>
      </td>

      <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
        {report.weekLabel || report.weekStartDate}
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
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => onView(report)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
            title="Voir rapport"
          >
            Voir rapport
          </button>
        </div>
      </td>
    </tr>
  );
}

export default SupervisorReportRow;

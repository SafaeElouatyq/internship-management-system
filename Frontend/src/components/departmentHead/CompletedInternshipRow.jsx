import { Check, X } from "lucide-react";
import {
  canDecide,
  getDecisionLabel,
  getFinalReportLabel,
} from "../../utils/finalDecisionUtils.jsx";

function CompletedInternshipRow({ internship, onAuthorize, onReject }) {
  const student = internship.student?.user;
  const pending = canDecide(internship);

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

      <td className="px-4 py-4 text-slate-600">
        {internship.company?.name}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {getFinalReportLabel(internship)}
      </td>

      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
            pending
              ? "bg-amber-50 text-amber-700"
              : internship.status === "DEFENSE_AUTHORIZED"
                ? "bg-green-50 text-green-700"
                : internship.status === "DEFENSE_NOT_AUTHORIZED"
                  ? "bg-red-50 text-red-700"
                  : "bg-slate-100 text-slate-700"
          }`}
        >
          {getDecisionLabel(internship)}
        </span>
      </td>

      <td className="px-2 py-4">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onAuthorize(internship)}
            disabled={!pending}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-green-600 hover:bg-green-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Autoriser soutenance"
          >
            <Check size={16} />
            Autoriser
          </button>

          <button
            type="button"
            onClick={() => onReject(internship)}
            disabled={!pending}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Refuser soutenance"
          >
            <X size={16} />
            Refuser
          </button>
        </div>
      </td>
    </tr>
  );
}

export default CompletedInternshipRow;

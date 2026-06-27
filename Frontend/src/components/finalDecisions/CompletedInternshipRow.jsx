import { Eye, Gavel } from "lucide-react";
import {
  canDecide,
  getDecisionBadgeClass,
  getDecisionLabel,
  getFinalReportLabel,
} from "../../utils/finalDecisionUtils.jsx";

function CompletedInternshipRow({
  internship,
  readOnly = false,
  onDecide,
  onView,
}) {
  const student = internship.student?.user;
  const pending = canDecide(internship);
  const hasDecision = Boolean(internship.finalDecision);

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
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getDecisionBadgeClass(internship)}`}
        >
          {getDecisionLabel(internship)}
        </span>
      </td>

      <td className="px-2 py-4">
        <div className="flex items-center justify-center gap-1">
          {!readOnly && pending && (
            <button
              type="button"
              onClick={() => onDecide?.(internship)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
              title="Prendre une décision"
            >
              <Gavel size={16} />
              Décider
            </button>
          )}

          {(readOnly || hasDecision) && hasDecision && (
            <button
              type="button"
              onClick={() => onView?.(internship)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              title="Voir la décision"
            >
              <Eye size={16} />
              Voir
            </button>
          )}

          {readOnly && !hasDecision && pending && (
            <span className="text-sm text-slate-400">En attente</span>
          )}
        </div>
      </td>
    </tr>
  );
}

export default CompletedInternshipRow;

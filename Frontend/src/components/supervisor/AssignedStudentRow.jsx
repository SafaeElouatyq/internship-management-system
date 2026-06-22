import { Eye } from "lucide-react";
import { statusLabels } from "../../utils/internshipUtils.jsx";
import { subjectDecisionLabels } from "../../utils/subjectValidationUtils.jsx";

function AssignedStudentRow({ internship, onView }) {
  const student = internship.student?.user;
  const latestDecision = internship.subjectValidations?.[0];

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

      <td className="px-4 py-4 font-medium text-slate-800">
        {internship.title}
      </td>

      <td className="px-4 py-4">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {statusLabels[internship.status] || internship.status}
        </span>
      </td>

      <td className="px-4 py-4">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {latestDecision
            ? subjectDecisionLabels[latestDecision.decision] ||
              latestDecision.decision
            : "-"}
        </span>
      </td>

      <td className="px-2 py-4">
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => onView(internship)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition"
            title="Voir le dossier"
            aria-label="Voir le dossier"
          >
            <Eye size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default AssignedStudentRow;

import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  canModifyInternship,
  getStatusLabel,
} from "../../utils/internshipUtils.jsx";

function InternshipRow({ internship, onView, onEdit, onDelete }) {
  const canModify = canModifyInternship(internship);

  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50">
      <td className="px-6 py-4 font-medium text-slate-800">
        {internship.title}
      </td>

      <td className="px-6 py-4 text-slate-600">
        {internship.company?.name}
      </td>

      <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
        {internship.startDate?.slice(0, 10)} —{" "}
        {internship.endDate?.slice(0, 10)}
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {getStatusLabel(internship.status)}
        </span>
      </td>

      <td className="px-6 py-4 text-center">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => onView(internship)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition"
            title="Voir détails"
            aria-label="Voir détails"
          >
            <Eye size={18} />
          </button>

          <button
            type="button"
            onClick={() => onEdit(internship)}
            disabled={!canModify}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Modifier"
            aria-label="Modifier"
          >
            <Pencil size={18} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(internship)}
            disabled={!canModify}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Supprimer"
            aria-label="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default InternshipRow;

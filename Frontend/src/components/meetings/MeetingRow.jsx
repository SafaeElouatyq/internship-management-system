import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  getMeetingStatus,
  getStatusClass,
  typeLabels,
} from "../../utils/meetingUtils.jsx";

function MeetingRow({ meeting, onView, onEdit, onDelete, showStudent, appearance = "default" }) {
  const student = meeting.internship?.student?.user;
  const status = getMeetingStatus(meeting.date);
  const isStudent = appearance === "student";

  return (
    <tr className={isStudent ? "border-b border-zinc-100 last:border-0 transition-colors duration-150 hover:bg-zinc-50/60" : "border-t border-slate-200 hover:bg-slate-50"}>
      {showStudent && (
        <td className={isStudent ? "px-5 py-4 text-sm font-medium text-zinc-900" : "px-4 py-4"}>
          <div className={isStudent ? "" : "font-medium text-slate-800"}>
            {student?.firstName} {student?.lastName}
          </div>
        </td>
      )}

      <td className={isStudent ? "px-5 py-4 text-sm font-medium text-zinc-900" : "px-4 py-4 font-medium text-slate-800"}>
        {meeting.sequenceLabel || `Rencontre ${meeting.sequenceNumber || "-"}`}
      </td>

      <td className={isStudent ? "px-5 py-4 text-sm text-zinc-600 whitespace-nowrap tabular-nums" : "px-4 py-4 text-slate-600 whitespace-nowrap"}>
        {meeting.date?.slice(0, 16).replace("T", " ")}
      </td>

      <td className={isStudent ? "px-5 py-4 text-sm text-zinc-600" : "px-4 py-4 text-slate-600"}>
        {typeLabels[meeting.type] || meeting.type}
      </td>

      <td className={isStudent ? "px-5 py-4" : "px-4 py-4"}>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(meeting.date)}`}
        >
          {status}
        </span>
      </td>

      {(onView || onEdit || onDelete) && (
        <td className={isStudent ? "px-5 py-4 text-center" : "px-2 py-4"}>
          <div className="flex items-center justify-center gap-1">
            {onView && (
              <button
                type="button"
                onClick={() => onView(meeting)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
                title="Voir réunion"
                aria-label="Voir réunion"
              >
                <Eye size={18} />
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(meeting)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50"
                title="Modifier réunion"
                aria-label="Modifier réunion"
              >
                <Pencil size={18} />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(meeting)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                title="Supprimer réunion"
                aria-label="Supprimer réunion"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
}

export default MeetingRow;

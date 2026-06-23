import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  getMeetingStatus,
  getStatusClass,
  typeLabels,
} from "../../utils/meetingUtils.jsx";

function MeetingRow({ meeting, onView, onEdit, onDelete, showStudent }) {
  const student = meeting.internship?.student?.user;
  const status = getMeetingStatus(meeting.date);

  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50">
      {showStudent && (
        <td className="px-4 py-4">
          <div className="font-medium text-slate-800">
            {student?.firstName} {student?.lastName}
          </div>
        </td>
      )}

      <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
        {meeting.date?.slice(0, 16).replace("T", " ")}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {typeLabels[meeting.type] || meeting.type}
      </td>

      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(meeting.date)}`}
        >
          {status}
        </span>
      </td>

      {(onView || onEdit || onDelete) && (
        <td className="px-2 py-4">
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

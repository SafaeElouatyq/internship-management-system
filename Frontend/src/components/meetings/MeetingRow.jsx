import { Eye } from "lucide-react";
import {
  getMeetingStatus,
  getStatusClass,
  typeLabels,
} from "../../utils/meetingUtils.jsx";

function MeetingRow({ meeting, onView, showStudent }) {
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

      {onView && (
        <td className="px-2 py-4">
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => onView(meeting)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
              title="Voir réunion"
            >
              <Eye size={18} />
              Voir
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}

export default MeetingRow;

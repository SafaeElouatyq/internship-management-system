import { Eye, Pencil } from "lucide-react";
import ComplaintStatusBadge from "./ComplaintStatusBadge";
import {
  formatComplaintDate,
  getComplaintStudentName,
} from "../../utils/complaintUtils.jsx";

function ManagerComplaintRow({ complaint, onView, onManage }) {
  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50">
      <td className="px-4 py-4">
        <p className="font-medium text-slate-800">{complaint.subject}</p>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
          {complaint.description}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="font-medium text-slate-800">
          {getComplaintStudentName(complaint)}
        </p>
        <p className="text-sm text-slate-500">
          {complaint.internship?.student?.user?.email}
        </p>
      </td>

      <td className="px-4 py-4 text-slate-600">
        {complaint.internship?.company?.name || "-"}
      </td>

      <td className="px-4 py-4">
        <ComplaintStatusBadge
          status={complaint.status}
          label={complaint.statusLabel}
        />
      </td>

      <td className="px-4 py-4 text-slate-600">
        {formatComplaintDate(complaint.createdAt)}
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onView(complaint)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            title="Voir le détail"
          >
            <Eye size={16} />
            Voir
          </button>

          <button
            type="button"
            onClick={() => onManage(complaint)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
            title="Traiter la réclamation"
          >
            <Pencil size={16} />
            Traiter
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ManagerComplaintRow;

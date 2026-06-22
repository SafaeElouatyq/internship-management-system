import { Eye, UserPlus } from "lucide-react";

function InternshipRow({ internship, onView, onAssign }) {
  const student = internship.student?.user;
  const supervisor = internship.supervisor?.user;

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

      <td className="px-3 py-4 text-slate-600 whitespace-nowrap">
        {internship.startDate?.slice(0, 10)}
      </td>

      <td className="px-3 py-4 text-slate-600 whitespace-nowrap">
        {internship.endDate?.slice(0, 10)}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : "-"}
      </td>

      <td className="px-4 py-4">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {internship.status === "SUPERVISOR_ASSIGNED"
            ? "Encadrant affecté"
            : "Validé par admin"}
        </span>
      </td>

      <td className="px-2 py-4">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onView(internship)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition"
            title="Voir détails"
            aria-label="Voir détails"
          >
            <Eye size={18} />
          </button>

          <button
            type="button"
            onClick={() => onAssign(internship)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition"
            title="Affecter un encadrant"
            aria-label="Affecter un encadrant"
          >
            <UserPlus size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default InternshipRow;

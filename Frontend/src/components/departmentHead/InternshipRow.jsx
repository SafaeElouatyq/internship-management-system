import { UserPlus } from "lucide-react";

function InternshipRow({ internship, onAssign }) {
  const student = internship.student?.user;
  const supervisor = internship.supervisor?.user;
  const canAssign =
    internship.status === "ADMIN_VALIDATED" && !internship.supervisorId;

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

      <td className="px-4 py-4 text-slate-600">
        {supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : "-"}
      </td>

      <td className="px-2 py-4">
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => onAssign(internship)}
            disabled={!canAssign}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Affecter encadrant"
          >
            <UserPlus size={18} />
            Affecter encadrant
          </button>
        </div>
      </td>
    </tr>
  );
}

export default InternshipRow;

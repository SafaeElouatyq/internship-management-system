import { Eye, SquarePen, UserPlus } from "lucide-react";

const statusLabels = {
  DECLARED: "Déclaré",
  ADMIN_PENDING: "En attente admin",
  ADMIN_VALIDATED: "Validé par admin",
  SUPERVISOR_ASSIGNED: "Encadrant affecté",
  SUBJECT_PENDING: "Sujet en attente",
  SUBJECT_VALIDATED: "Sujet validé",
  IN_PROGRESS: "En cours",
  REPORT_LATE: "Rapport en retard",
  REPORT_WRITING: "Rédaction du rapport",
  READY_FOR_DEFENSE: "Prêt pour soutenance",
  DEFENSE_AUTHORIZED: "Soutenance autorisée",
  DEFENSE_NOT_AUTHORIZED: "Soutenance non autorisée",
  CLOSED: "Clôturé",
};

const administrativeStatusLabels = {
  COMPLETE: "Complet",
  INCOMPLETE: "Incomplet",
  PENDING_DOCUMENTS: "Documents en attente",
  REJECTED: "Rejeté",
};

function InternshipRow({ internship, onView, onAssign, onEditStatus }) {
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

      <td className="px-4 py-4">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {statusLabels[internship.status] || internship.status}
        </span>
      </td>

      <td className="px-4 py-4">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {administrativeStatusLabels[internship.administrativeStatus] ||
            internship.administrativeStatus ||
            "-"}
        </span>
      </td>

      <td className="px-4 py-4 text-slate-600">
        {supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : "-"}
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

          {/*<button
            type="button"
            onClick={() => onAssign(internship)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition"
            title="Affecter un encadrant"
            aria-label="Affecter un encadrant"
          >
            <UserPlus size={18} />
          </button>*/}

          {onEditStatus && (
            <button
              type="button"
              onClick={() => onEditStatus(internship)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition"
              title="Modifier statut"
              aria-label="Modifier statut"
            >
              <SquarePen size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default InternshipRow;

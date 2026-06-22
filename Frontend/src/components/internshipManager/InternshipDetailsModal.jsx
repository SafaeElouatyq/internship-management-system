const administrativeStatusLabels = {
  COMPLETE: "Complet",
  INCOMPLETE: "Incomplet",
  PENDING_DOCUMENTS: "Documents en attente",
  REJECTED: "Rejeté",
};

const statusLabels = {
  DECLARED: "Déclaré",
  ADMIN_PENDING: "En attente admin",
  ADMIN_VALIDATED: "Validé par admin",
  SUPERVISOR_ASSIGNED: "Encadrant affecté",
  SUBJECT_PENDING: "Sujet en attente",
  SUBJECT_VALIDATED: "Sujet validé",
  IN_PROGRESS: "En cours",
  CLOSED: "Clôturé",
};

function InternshipDetailsModal({ internship, onClose }) {
  const student = internship.student?.user;
  const supervisor = internship.supervisor?.user;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Détails de la déclaration
            </h2>

            <p className="text-slate-500 mt-1">
              {internship.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
          >
            Fermer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-700">
          <div>
            <p className="text-sm text-slate-500">Étudiant</p>
            <p className="font-medium">
              {student?.firstName} {student?.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Entreprise</p>
            <p className="font-medium">{internship.company?.name}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Date début</p>
            <p className="font-medium">{internship.startDate?.slice(0, 10)}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Date fin</p>
            <p className="font-medium">{internship.endDate?.slice(0, 10)}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Statut</p>
            <p className="font-medium">
              {statusLabels[internship.status] || internship.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Dossier administratif</p>
            <p className="font-medium">
              {administrativeStatusLabels[internship.administrativeStatus] ||
                internship.administrativeStatus ||
                "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Encadrant</p>
            <p className="font-medium">
              {supervisor
                ? `${supervisor.firstName} ${supervisor.lastName}`
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Email étudiant</p>
            <p className="font-medium">{student?.email}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-slate-500">Description</p>
            <p className="font-medium">{internship.description || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InternshipDetailsModal;

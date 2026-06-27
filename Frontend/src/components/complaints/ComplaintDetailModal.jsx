import ComplaintStatusBadge from "./ComplaintStatusBadge";
import {
  formatComplaintDate,
  getComplaintStudentName,
} from "../../utils/complaintUtils.jsx";

function ComplaintDetailModal({ complaint, onClose, showStudentInfo = false }) {
  const student = complaint.internship?.student?.user;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Détail de la réclamation
            </h2>
            <p className="text-slate-500 mt-1">{complaint.subject}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
          >
            Fermer
          </button>
        </div>

        <div className="mb-6">
          <ComplaintStatusBadge
            status={complaint.status}
            label={complaint.statusLabel}
          />
        </div>

        <div className="space-y-5 text-slate-700">
          {showStudentInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Étudiant</p>
                <p className="font-medium mt-1">{getComplaintStudentName(complaint)}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium mt-1">{student?.email || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Entreprise</p>
                <p className="font-medium mt-1">
                  {complaint.internship?.company?.name || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Stage</p>
                <p className="font-medium mt-1">
                  {complaint.internship?.title || "-"}
                </p>
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-slate-500">Description</p>
            <p className="font-medium mt-1 whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Date de dépôt</p>
            <p className="font-medium mt-1">
              {formatComplaintDate(complaint.createdAt)}
            </p>
          </div>

          {complaint.response && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-700">
                Réponse du responsable des stages
              </p>
              <p className="mt-2 whitespace-pre-wrap text-slate-800">
                {complaint.response}
              </p>
              {complaint.handledBy && (
                <p className="text-sm text-slate-500 mt-3">
                  Par {complaint.handledBy.firstName} {complaint.handledBy.lastName}
                  {complaint.updatedAt
                    ? ` — ${formatComplaintDate(complaint.updatedAt)}`
                    : ""}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetailModal;

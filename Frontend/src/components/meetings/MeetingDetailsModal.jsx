import {
  getMeetingStatus,
  typeLabels,
} from "../../utils/meetingUtils.jsx";

function MeetingDetailsModal({ meeting, onClose }) {
  const student = meeting.internship?.student?.user;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Détails de la réunion
            </h2>

            <p className="text-slate-500 mt-1">
              {student?.firstName} {student?.lastName} —{" "}
              {meeting.date?.slice(0, 16).replace("T", " ")}
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

        <div className="space-y-5 text-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-sm text-slate-500">Type</p>
              <p className="font-medium mt-1">
                {typeLabels[meeting.type] || meeting.type}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Statut</p>
              <p className="font-medium mt-1">
                {getMeetingStatus(meeting.date)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-500">Résumé</p>
            <p className="font-medium mt-1">{meeting.summary || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Points discutés</p>
            <p className="font-medium mt-1">{meeting.discussedPoints || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Décisions</p>
            <p className="font-medium mt-1">{meeting.decisions || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Travail assigné</p>
            <p className="font-medium mt-1">{meeting.assignedWork || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Commentaire encadrant</p>
            <p className="font-medium mt-1">
              {meeting.supervisorComment || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingDetailsModal;

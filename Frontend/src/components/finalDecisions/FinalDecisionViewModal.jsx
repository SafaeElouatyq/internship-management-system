import {
  formatDecisionDate,
  getDecisionLabel,
} from "../../utils/finalDecisionUtils.jsx";

function FinalDecisionViewModal({ internship, onClose }) {
  const finalDecision = internship?.finalDecision;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Décision de soutenance
            </h2>

            <p className="text-slate-500 mt-1">
              {internship?.student?.user?.firstName}{" "}
              {internship?.student?.user?.lastName} — {internship?.title}
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
          <div>
            <p className="text-sm text-slate-500">Décision</p>
            <p className="font-medium mt-1">{getDecisionLabel(internship)}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Commentaire</p>
            <p className="font-medium mt-1 whitespace-pre-wrap">
              {finalDecision?.comment || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Date</p>
            <p className="font-medium mt-1">
              {formatDecisionDate(finalDecision?.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinalDecisionViewModal;

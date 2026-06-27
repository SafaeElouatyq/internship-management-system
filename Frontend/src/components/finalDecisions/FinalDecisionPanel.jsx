import {
  formatDecisionDate,
  getDecisionBadgeClass,
  getDecisionLabel,
} from "../../utils/finalDecisionUtils.jsx";

function FinalDecisionPanel({ internship }) {
  const finalDecision = internship?.finalDecision;

  if (!finalDecision) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Décision finale de soutenance
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-500">Décision</p>
          <span
            className={`inline-flex mt-2 rounded-full px-3 py-1 text-sm font-medium ${getDecisionBadgeClass(internship)}`}
          >
            {getDecisionLabel(internship)}
          </span>
        </div>

        <div>
          <p className="text-sm text-slate-500">Commentaire de l&apos;encadrant</p>
          <p className="font-medium mt-1 whitespace-pre-wrap text-slate-800">
            {finalDecision.comment}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Date de la décision</p>
          <p className="font-medium mt-1">
            {formatDecisionDate(finalDecision.createdAt)}
          </p>
        </div>
      </div>
    </section>
  );
}

export default FinalDecisionPanel;

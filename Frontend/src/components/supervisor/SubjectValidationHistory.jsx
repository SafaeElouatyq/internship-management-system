import { subjectDecisionLabels } from "../../utils/subjectValidationUtils.jsx";

function SubjectValidationHistory({ validations }) {
  if (!validations.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-3">
          Historique des décisions
        </h2>
        <p className="text-slate-500">Aucune décision enregistrée.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-5">
        Historique des décisions
      </h2>

      <div className="space-y-4">
        {validations.map((validation) => (
          <div
            key={validation.id}
            className="border border-slate-200 rounded-xl px-4 py-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="font-medium text-slate-800">
                {subjectDecisionLabels[validation.decision] ||
                  validation.decision}
              </p>

              <p className="text-sm text-slate-500">
                {validation.createdAt?.slice(0, 10)}
              </p>
            </div>

            {validation.reformulatedTitle && (
              <p className="text-sm text-slate-600 mt-2">
                Sujet reformulé : {validation.reformulatedTitle}
              </p>
            )}

            {validation.comment && (
              <p className="text-sm text-slate-600 mt-2">
                {validation.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectValidationHistory;

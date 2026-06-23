import { subjectDecisionOptions } from "../../utils/subjectValidationUtils.jsx";

function SubjectValidationForm({
  formData,
  onChange,
  onSubmit,
  saving,
  disabled,
}) {
  const showReformulatedTitle =
    formData.decision === "ACCEPTED_WITH_REFORMULATION";

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200"
    >
      <h2 className="text-xl font-bold text-slate-800 mb-5">
        Validation du sujet
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            Décision
          </label>

          <select
            name="decision"
            value={formData.decision}
            onChange={onChange}
            disabled={disabled || saving}
            className="w-full max-w-md border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            required
          >
            <option value="">Sélectionner une décision</option>

            {subjectDecisionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {showReformulatedTitle && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Sujet reformulé
            </label>

            <input
              type="text"
              name="reformulatedTitle"
              value={formData.reformulatedTitle}
              onChange={onChange}
              disabled={disabled || saving}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Commentaire
          </label>

          <textarea
            name="comment"
            value={formData.comment}
            onChange={onChange}
            rows={4}
            disabled={disabled || saving}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          />
        </div>

        {disabled && (
          <p className="text-sm text-slate-500">
            Le sujet ne peut être validé qu'après la première réunion et
            lorsque le statut est « Sujet en attente ».
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={disabled || saving || !formData.decision}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer la décision"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default SubjectValidationForm;

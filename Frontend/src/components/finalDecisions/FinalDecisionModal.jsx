function FinalDecisionModal({
  internship,
  decision,
  comment,
  onDecisionChange,
  onCommentChange,
  onSubmit,
  onCancel,
  saving,
  error = "",
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Décision de soutenance
          </h2>

          <p className="text-slate-500 mt-1">
            {internship?.student?.user?.firstName}{" "}
            {internship?.student?.user?.lastName} — {internship?.title}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Décision
            </label>

            <select
              name="decision"
              value={decision}
              onChange={onDecisionChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une décision</option>
              <option value="DEFENSE_AUTHORIZED">Autorisé à soutenir</option>
              <option value="DEFENSE_AUTHORIZED_WITH_CORRECTIONS">
                Autorisé sous réserve de corrections
              </option>
              <option value="DEFENSE_NOT_AUTHORIZED">
                Non autorisé à soutenir
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Commentaire <span className="text-red-500">*</span>
            </label>

            <textarea
              name="comment"
              value={comment}
              onChange={onCommentChange}
              rows={4}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Justifiez votre décision..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving || !decision || !comment.trim()}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : "Enregistrer la décision"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FinalDecisionModal;

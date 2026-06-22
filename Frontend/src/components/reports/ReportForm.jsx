function ReportForm({ formData, onChange, onSubmit, onCancel, saving }) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mb-8"
    >
      <h2 className="text-xl font-bold text-slate-800 mb-5">
        Nouveau rapport hebdomadaire
      </h2>

      <div className="grid grid-cols-1 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            Travail réalisé
          </label>

          <textarea
            name="completedWork"
            value={formData.completedWork}
            onChange={onChange}
            rows={4}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Difficultés rencontrées
          </label>

          <textarea
            name="difficulties"
            value={formData.difficulties}
            onChange={onChange}
            rows={3}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Plan semaine prochaine
          </label>

          <textarea
            name="nextWeekPlan"
            value={formData.nextWeekPlan}
            onChange={onChange}
            rows={3}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Progression %
          </label>

          <input
            type="number"
            name="progress"
            value={formData.progress}
            onChange={onChange}
            min="0"
            max="100"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100"
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
        >
          {saving ? "Envoi..." : "Soumettre"}
        </button>
      </div>
    </form>
  );
}

export default ReportForm;

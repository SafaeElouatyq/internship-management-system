function FirstMeetingForm({
  formData,
  onChange,
  onSubmit,
  saving,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200"
    >
      <h2 className="text-xl font-bold text-slate-800 mb-5">
        Planifier la première réunion
      </h2>

      <p className="text-slate-500 mb-5">
        La première réunion est requise avant la validation du sujet de stage.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            Date
          </label>

          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={onChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Type
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={onChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner un type</option>
            <option value="PRESENTIAL">Présentiel</option>
            <option value="REMOTE">Distanciel</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Résumé
          </label>

          <textarea
            name="summary"
            value={formData.summary}
            onChange={onChange}
            rows={3}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
        >
          {saving ? "Planification..." : "Planifier la première réunion"}
        </button>
      </div>
    </form>
  );
}

export default FirstMeetingForm;

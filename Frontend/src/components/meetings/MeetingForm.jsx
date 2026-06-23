function MeetingForm({
  formData,
  internships,
  onChange,
  onSubmit,
  onCancel,
  saving,
  isEdit = false,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mb-8"
    >
      <h2 className="text-xl font-bold text-slate-800 mb-5">
        {isEdit ? "Modifier la réunion" : "Planifier une réunion"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {!isEdit && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Étudiant
            </label>

            <select
              name="internshipId"
              value={formData.internshipId}
              onChange={onChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un étudiant</option>

              {internships.map((internship) => {
                const student = internship.student?.user;

                return (
                  <option key={internship.id} value={internship.id}>
                    {student?.firstName} {student?.lastName} — {internship.title}
                  </option>
                );
              })}
            </select>
          </div>
        )}

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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Points discutés
          </label>

          <textarea
            name="discussedPoints"
            value={formData.discussedPoints}
            onChange={onChange}
            rows={3}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Décisions
          </label>

          <textarea
            name="decisions"
            value={formData.decisions}
            onChange={onChange}
            rows={3}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Travail assigné
          </label>

          <textarea
            name="assignedWork"
            value={formData.assignedWork}
            onChange={onChange}
            rows={3}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Remarques encadrant
          </label>

          <textarea
            name="supervisorComment"
            value={formData.supervisorComment}
            onChange={onChange}
            rows={3}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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
          {saving ? "Enregistrement..." : isEdit ? "Enregistrer" : "Planifier"}
        </button>
      </div>
    </form>
  );
}

export default MeetingForm;

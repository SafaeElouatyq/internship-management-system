function InternshipForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  saving,
  selectedInternship,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mb-8"
    >
      <h2 className="text-xl font-bold text-slate-800 mb-5">
        {selectedInternship
          ? "Modifier la déclaration"
          : "Nouvelle déclaration de stage"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            Sujet du stage
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Nom de l'entreprise
          </label>

          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={onChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Date de début
          </label>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={onChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Date de fin
          </label>

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={onChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Adresse entreprise
          </label>

          <input
            type="text"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={onChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Email entreprise
          </label>

          <input
            type="email"
            name="companyEmail"
            value={formData.companyEmail}
            onChange={onChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Téléphone entreprise
          </label>

          <input
            type="text"
            name="companyPhone"
            value={formData.companyPhone}
            onChange={onChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Encadrant professionnel
          </label>

          <input
            type="text"
            name="professionalSupervisor"
            value={formData.professionalSupervisor}
            onChange={onChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows="4"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <p className="text-sm text-slate-500 mt-4">
        Les documents se téléversent séparément dans la section Documents après
        la création de la déclaration.
      </p>

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
          {saving
            ? "Enregistrement..."
            : selectedInternship
              ? "Modifier"
              : "Créer la déclaration"}
        </button>
      </div>
    </form>
  );
}

export default InternshipForm;

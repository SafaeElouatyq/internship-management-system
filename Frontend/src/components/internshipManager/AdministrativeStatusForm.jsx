const statusOptions = [
  {
    value: "COMPLETE",
    label: "Complet",
  },
  {
    value: "INCOMPLETE",
    label: "Incomplet",
  },
  {
    value: "PENDING_DOCUMENTS",
    label: "Documents en attente",
  },
  {
    value: "REJECTED",
    label: "Rejeté",
  },
];

function AdministrativeStatusForm({
  internship,
  administrativeStatus,
  onChange,
  onSubmit,
  onCancel,
  saving,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Vérifier le dossier administratif
          </h2>

          <p className="text-slate-500 mt-1">
            {internship?.title}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Statut administratif
            </label>

            <select
              name="administrativeStatus"
              value={administrativeStatus}
              onChange={onChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un statut</option>

              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
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
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdministrativeStatusForm;

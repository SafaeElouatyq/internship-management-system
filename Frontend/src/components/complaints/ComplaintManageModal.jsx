import { COMPLAINT_STATUS_OPTIONS } from "../../utils/complaintUtils.jsx";

function ComplaintManageModal({
  complaint,
  status,
  response,
  onStatusChange,
  onResponseChange,
  onSubmit,
  onCancel,
  saving,
  error = "",
}) {
  const statusOptions = COMPLAINT_STATUS_OPTIONS.filter(
    (option) => option.value,
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Traiter la réclamation
          </h2>
          <p className="text-slate-500 mt-1">{complaint?.subject}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Description de l&apos;étudiant</p>
            <p className="mt-2 text-slate-800 whitespace-pre-wrap">
              {complaint?.description}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Statut
            </label>
            <select
              name="status"
              value={status}
              onChange={onStatusChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Réponse <span className="text-red-500">*</span>
            </label>
            <textarea
              name="response"
              value={response}
              onChange={onResponseChange}
              rows={5}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Répondez à l'étudiant..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving || !status || !response.trim()}
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

export default ComplaintManageModal;

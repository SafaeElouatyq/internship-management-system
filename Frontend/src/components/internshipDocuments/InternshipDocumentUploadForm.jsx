import { INTERNSHIP_DOCUMENT_TYPE_OPTIONS } from "../../utils/internshipDocumentUtils.jsx";

function InternshipDocumentUploadForm({
  type,
  file,
  onTypeChange,
  onFileChange,
  onSubmit,
  onCancel,
  saving,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6"
    >
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Téléverser un document de stage
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Type de document
          </label>
          <select
            value={type}
            onChange={onTypeChange}
            required
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner un type</option>
            {INTERNSHIP_DOCUMENT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fichier (PDF ou DOCX)
          </label>
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onFileChange}
            required
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium disabled:opacity-60"
        >
          {saving ? "Téléversement..." : "Téléverser"}
        </button>
      </div>
    </form>
  );
}

export default InternshipDocumentUploadForm;

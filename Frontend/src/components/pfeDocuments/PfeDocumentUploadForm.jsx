import { PFE_CATEGORY_OPTIONS } from "../../utils/pfeDocumentUtils.jsx";

function PfeDocumentUploadForm({
  category,
  file,
  onCategoryChange,
  onFileChange,
  onSubmit,
  onCancel,
  saving,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mb-8"
    >
      <h2 className="text-xl font-bold text-slate-800 mb-5">
        Téléverser un document PFE
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Type de document
          </label>

          <select
            value={category}
            onChange={onCategoryChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner un type</option>

            {PFE_CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Fichier
          </label>

          <input
            type="file"
            accept=".pdf,.docx,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={onFileChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <p className="text-sm text-slate-500 mt-2">
            Formats acceptés : PDF, DOCX, PPTX (max. 15 Mo).
          </p>
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
          {saving ? "Téléversement..." : "Téléverser"}
        </button>
      </div>
    </form>
  );
}

export default PfeDocumentUploadForm;

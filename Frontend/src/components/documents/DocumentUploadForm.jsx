function DocumentUploadForm({
  name,
  file,
  onNameChange,
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
        Téléverser un document
      </h2>

      <div className="grid grid-cols-1 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            Nom document
          </label>

          <input
            type="text"
            name="name"
            value={name}
            onChange={onNameChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Fichier
          </label>

          <input
            type="file"
            name="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onFileChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <p className="text-sm text-slate-500 mt-2">
            Formats acceptés : PDF, DOCX
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
          {saving ? "Envoi..." : "Téléverser"}
        </button>
      </div>
    </form>
  );
}

export default DocumentUploadForm;

function ReportForm({
  formData,
  existingAttachments = [],
  removedAttachmentIds = [],
  selectedFiles = [],
  onChange,
  onFileChange,
  onRemoveExistingAttachment,
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
        {isEdit ? "Modifier le rapport" : "Nouveau rapport hebdomadaire"}
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

        <div>
          <label className="block text-sm font-medium mb-2">
            Pièces jointes (optionnel)
          </label>

          <input
            type="file"
            multiple
            accept=".pdf,.docx,.png,.jpg,.jpeg,.gif,.webp,image/*"
            onChange={onFileChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <p className="text-sm text-slate-500 mt-2">
            PDF, DOCX ou captures d'écran (max. 5 fichiers, 10 Mo chacun).
          </p>

          {selectedFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {selectedFiles.map((file) => (
                <p key={`${file.name}-${file.lastModified}`} className="text-sm text-slate-600">
                  {file.name}
                </p>
              ))}
            </div>
          )}

          {existingAttachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {existingAttachments.map((attachment) => {
                const isRemoved = removedAttachmentIds.includes(attachment.id);

                return (
                  <div
                    key={attachment.id}
                    className={`flex items-center justify-between border rounded-xl px-4 py-3 ${
                      isRemoved
                        ? "border-red-200 bg-red-50 opacity-60"
                        : "border-slate-200"
                    }`}
                  >
                    <p className="text-sm text-slate-700">{attachment.name}</p>

                    <button
                      type="button"
                      onClick={() => onRemoveExistingAttachment(attachment.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      {isRemoved ? "Annuler" : "Retirer"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
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
          {saving ? "Enregistrement..." : isEdit ? "Enregistrer" : "Soumettre"}
        </button>
      </div>
    </form>
  );
}

export default ReportForm;

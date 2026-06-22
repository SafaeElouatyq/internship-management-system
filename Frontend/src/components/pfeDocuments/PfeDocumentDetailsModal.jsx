import { getDocumentUrl } from "../../services/documentService.jsx";
import {
  PFE_CATEGORY_LABELS,
  SUPERVISOR_VALIDATION_OPTIONS,
} from "../../utils/pfeDocumentUtils.jsx";
import PfeValidationBadge from "./PfeValidationBadge";

function PfeDocumentDetailsModal({
  document,
  onClose,
  showValidation = false,
  validationStatus = "",
  supervisorComment = "",
  onValidationStatusChange,
  onCommentChange,
  onValidate,
  saving = false,
}) {
  const student = document.internship?.student?.user;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {PFE_CATEGORY_LABELS[document.category] || document.name}
            </h2>

            {student && (
              <p className="text-slate-500 mt-1">
                {student.firstName} {student.lastName}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
          >
            Fermer
          </button>
        </div>

        <div className="mb-6">
          <PfeValidationBadge status={document.validationStatus} />
        </div>

        <div className="space-y-5 text-slate-700">
          <div>
            <p className="text-sm text-slate-500">Format</p>
            <p className="font-medium mt-1">{document.type}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Date de dépôt</p>
            <p className="font-medium mt-1">
              {document.uploadedAt?.slice(0, 16).replace("T", " ")}
            </p>
          </div>

          <div>
            <a
              href={getDocumentUrl(document.path)}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Ouvrir le document
            </a>
          </div>

          {!showValidation && document.supervisorComment && (
            <div>
              <p className="text-sm text-slate-500">Remarques encadrant</p>
              <p className="font-medium mt-1">{document.supervisorComment}</p>
            </div>
          )}

          {showValidation && (
            <form onSubmit={onValidate} className="pt-2 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Décision
                </label>

                <select
                  value={validationStatus}
                  onChange={onValidationStatusChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner une décision</option>

                  {SUPERVISOR_VALIDATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Remarques encadrant
                </label>

                <textarea
                  value={supervisorComment}
                  onChange={onCommentChange}
                  rows={4}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ajoutez vos remarques pour l'étudiant..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving || !validationStatus}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
                >
                  {saving ? "Enregistrement..." : "Enregistrer la validation"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default PfeDocumentDetailsModal;

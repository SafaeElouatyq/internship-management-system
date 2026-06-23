import { Eye, Trash2 } from "lucide-react";
import { getDocumentUrl } from "../../services/documentService.jsx";
import {
  PFE_CATEGORY_LABELS,
  canDeletePfeDocument,
} from "../../utils/pfeDocumentUtils.jsx";
import PfeValidationBadge from "./PfeValidationBadge";

function PfeDocumentRow({ document, onView, onDelete, showStudent }) {
  const student = document.internship?.student?.user;
  const canDelete = canDeletePfeDocument(document);

  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50">
      <td className="px-4 py-4 font-medium text-slate-800">
        {PFE_CATEGORY_LABELS[document.category] || document.name}
      </td>

      {showStudent && (
        <td className="px-4 py-4">
          <div className="font-medium text-slate-800">
            {student?.firstName} {student?.lastName}
          </div>
        </td>
      )}

      <td className="px-4 py-4 text-slate-600">{document.type}</td>

      <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
        {document.uploadedAt?.slice(0, 10)}
      </td>

      <td className="px-4 py-4">
        <PfeValidationBadge status={document.validationStatus} />
      </td>

      <td className="px-2 py-4">
        <div className="flex items-center justify-center gap-1">
          {onView && (
            <button
              type="button"
              onClick={() => onView(document)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
              title="Voir"
              aria-label="Voir"
            >
              <Eye size={18} />
            </button>
          )}

          <a
            href={getDocumentUrl(document.path)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 px-3 items-center justify-center rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            Ouvrir
          </a>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(document)}
              disabled={!canDelete}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-40"
              title="Supprimer"
              aria-label="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default PfeDocumentRow;

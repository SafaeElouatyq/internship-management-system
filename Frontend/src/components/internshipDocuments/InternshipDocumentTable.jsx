import { Download, Trash2 } from "lucide-react";
import InternshipDocumentTypeBadge from "./InternshipDocumentTypeBadge";
import { getDocumentUrl } from "../../services/internshipDocumentService.jsx";
import { getFileNameFromUrl } from "../../utils/internshipDocumentUtils.jsx";

function InternshipDocumentTable({
  documents,
  onDelete,
  canDelete = false,
}) {
  if (!documents.length) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
        <p className="text-slate-500">
          Aucun document de stage. Téléversez votre convention, attestation ou
          autres documents administratifs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex items-center justify-between gap-4 border border-slate-200 rounded-xl px-4 py-3 bg-white"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <InternshipDocumentTypeBadge type={document.type} />
              <p className="font-medium text-slate-800 truncate">
                {getFileNameFromUrl(document.fileUrl)}
              </p>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {document.createdAt?.slice(0, 16).replace("T", " ")}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={getDocumentUrl(document.fileUrl)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              <Download size={16} />
              Ouvrir
            </a>

            {canDelete && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(document)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default InternshipDocumentTable;

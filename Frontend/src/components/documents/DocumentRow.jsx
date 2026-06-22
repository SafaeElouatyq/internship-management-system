import { Download, Trash2 } from "lucide-react";
import { getDocumentUrl } from "../../services/documentService.jsx";

function DocumentRow({ document, onDelete }) {
  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50">
      <td className="px-4 py-4 font-medium text-slate-800">
        {document.name}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {document.type}
      </td>

      <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
        {document.uploadedAt?.slice(0, 10)}
      </td>

      <td className="px-2 py-4">
        <div className="flex items-center justify-center gap-1">
          <a
            href={getDocumentUrl(document.path)}
            download
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition"
            title="Télécharger"
          >
            <Download size={18} />
          </a>

          <button
            type="button"
            onClick={() => onDelete(document)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default DocumentRow;

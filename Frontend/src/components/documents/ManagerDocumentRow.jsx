import { Download } from "lucide-react";
import InternshipDocumentTypeBadge from "../internshipDocuments/InternshipDocumentTypeBadge";
import { getDocumentUrl } from "../../services/internshipDocumentService.jsx";
import {
  getFileNameFromUrl,
} from "../../utils/internshipDocumentUtils.jsx";

function ManagerDocumentRow({ document }) {
  const student = document.internship?.student?.user;

  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50">
      <td className="px-4 py-4">
        <div className="font-medium text-slate-800">
          {student?.firstName} {student?.lastName}
        </div>
        <div className="text-sm text-slate-500 truncate max-w-40">
          {student?.email}
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          <InternshipDocumentTypeBadge type={document.type} />
          <span className="font-medium text-slate-800">
            {getFileNameFromUrl(document.fileUrl)}
          </span>
        </div>
      </td>

      <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
        {document.createdAt?.slice(0, 10)}
      </td>

      <td className="px-2 py-4">
        <div className="flex items-center justify-center">
          <a
            href={getDocumentUrl(document.fileUrl)}
            download
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
            title="Télécharger"
          >
            <Download size={18} />
            Télécharger
          </a>
        </div>
      </td>
    </tr>
  );
}

export default ManagerDocumentRow;

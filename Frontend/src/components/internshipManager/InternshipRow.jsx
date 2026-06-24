import { Check, ClipboardCheck, Eye, X } from "lucide-react";
import {
  administrativeStatusLabels,
  canManageInternship,
  canVerifyAdministrativeFile,
  getStatusLabel,
} from "../../utils/internshipUtils.jsx";

function InternshipRow({
  internship,
  onView,
  onVerify,
  onValidate,
  onReject,
}) {
  const student = internship.student?.user;
  const documentCount = internship.internshipDocuments?.length || 0;
  const canManage = canManageInternship(internship);
  const canVerify = canVerifyAdministrativeFile(internship);

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

      <td className="px-4 py-4 text-slate-600">
        {internship.company?.name}
      </td>

      <td className="px-4 py-4 font-medium text-slate-800">
        {internship.title}
      </td>

      <td className="px-3 py-4 text-slate-600 whitespace-nowrap">
        {internship.startDate?.slice(0, 10)}
      </td>

      <td className="px-3 py-4 text-slate-600 whitespace-nowrap">
        {internship.endDate?.slice(0, 10)}
      </td>

      <td className="px-4 py-4">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {getStatusLabel(internship.status)}
        </span>
      </td>

      <td className="px-4 py-4">
        <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
          {administrativeStatusLabels[internship.administrativeStatus] ||
            internship.administrativeStatus ||
            "-"}
        </span>
      </td>

      <td className="px-4 py-4">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {documentCount} document{documentCount > 1 ? "s" : ""}
        </span>
      </td>

      <td className="px-2 py-4">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onView(internship)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition"
            title="Voir dossier"
            aria-label="Voir dossier"
          >
            <Eye size={18} />
          </button>

          <button
            type="button"
            onClick={() => onVerify(internship)}
            disabled={!canVerify}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Vérifier le dossier administratif"
            aria-label="Vérifier le dossier administratif"
          >
            <ClipboardCheck size={18} />
          </button>

          <button
            type="button"
            onClick={() => onValidate(internship)}
            disabled={!canManage}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-green-600 hover:bg-green-50 hover:text-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Valider le stage"
            aria-label="Valider le stage"
          >
            <Check size={18} />
          </button>

          <button
            type="button"
            onClick={() => onReject(internship)}
            disabled={!canManage}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Refuser le stage"
            aria-label="Refuser le stage"
          >
            <X size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default InternshipRow;

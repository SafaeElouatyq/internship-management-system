import { Pencil, Trash2 } from "lucide-react";

function InternshipRow({ internship, onEdit, onDelete }) {
  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50">
      <td className="px-6 py-4 font-medium text-slate-800">
        {internship.title}
      </td>

      <td className="px-6 py-4 text-slate-600">
        {internship.company?.name}
      </td>

      <td className="px-6 py-4 text-slate-600">
        {internship.startDate?.slice(0, 10)} -{" "}
        {internship.endDate?.slice(0, 10)}
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {internship.status}
        </span>
      </td>

      <td className="px-6 py-4 text-center">
        <button
          type="button"
          onClick={() => onEdit(internship)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition mr-2"
          title="Modifier"
          aria-label="Modifier"
        >
          <Pencil size={18} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(internship)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition"
          title="Supprimer"
          aria-label="Supprimer"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}

export default InternshipRow;

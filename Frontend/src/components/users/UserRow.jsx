import { Pencil, Trash2 } from "lucide-react";

const roleLabels = {
  ADMIN: "Administrateur",
  STUDENT: "Étudiant",
  SUPERVISOR: "Encadrant",
  INTERNSHIP_MANAGER: "Responsable des stages",
  DEPARTMENT_HEAD: "Chef de département",
};

function UserRow({ user, onEdit, onDelete }) {
  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50">
      <td className="px-6 py-4">
        <div className="font-medium text-slate-800">
          {user.firstName} {user.lastName}
        </div>
        {user.department && (
          <div className="text-sm text-slate-500">{user.department}</div>
        )}
      </td>

      <td className="px-6 py-4 text-slate-600">
        {user.email}
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {roleLabels[user.role.name] || user.role.name}
        </span>
      </td>

      <td className="px-6 py-4 text-center">
        <button
          type="button"
          onClick={() => onEdit(user)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition mr-2"
          title="Modifier"
          aria-label="Modifier"
        >
          <Pencil size={18} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(user)}
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

export default UserRow;

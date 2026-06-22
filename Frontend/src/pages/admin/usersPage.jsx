import { useEffect, useState } from "react";
import UserTable from "../../components/users/UserTable";
import UserForm from "../../components/users/UserForm";
import { getUsers, deleteUser } from "../../services/userService";
import { Search } from "lucide-react";

const roleOptions = [
  { value: "", label: "Tous les rôles" },
  { value: "ADMIN", label: "Administrateur" },
  { value: "STUDENT", label: "Étudiant" },
  { value: "SUPERVISOR", label: "Encadrant" },
  { value: "INTERNSHIP_MANAGER", label: "Responsable des stages" },
  { value: "DEPARTMENT_HEAD", label: "Chef de département" },
];

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(search, roleFilter);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, roleFilter]);

  const loadUsers = async (searchValue = "", roleValue = "") => {
    try {
      const data = await getUsers(searchValue, roleValue);
      setUsers(data);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const Edit = (user) => {
    setSelectedUser(user);
    setOpenForm(true);
    setError("");
    setSuccess("");
  };

  const Delete = async (user) => {
    const confirmDelete = window.confirm(
      `Supprimer ${user.firstName} ${user.lastName} ?`,
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(user.id);
      setSuccess("Utilisateur supprimé avec succès");
      loadUsers(search, roleFilter);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Gestion des utilisateurs
          </h1>

          <p className="text-slate-500 mt-2">
            Consultez, recherchez et gérez les comptes utilisateurs.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedUser(null);
            setOpenForm(true);
            setError("");
            setSuccess("");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
        >
          + Ajouter
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-2xl">
          {success}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          Chargement...
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <UserTable users={users} onEdit={Edit} onDelete={Delete} />
        </>
      )}

      {openForm && (
        <UserForm
          user={selectedUser}
          onClose={() => {
            setOpenForm(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            loadUsers(search, roleFilter);
            setOpenForm(false);
            setSelectedUser(null);
            setSuccess(
              selectedUser
                ? "Utilisateur modifié avec succès"
                : "Utilisateur créé avec succès",
            );
          }}
        />
      )}
    </>
  );
}

export default UsersPage;

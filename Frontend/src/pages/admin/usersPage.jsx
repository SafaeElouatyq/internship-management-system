import { useEffect, useState } from "react";
import UserTable from "../../components/users/UserTable";
import UserForm from "../../components/users/UserForm";
import { getUsers, deleteUser } from "../../services/userService";
import { Search } from "lucide-react";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const loadUsers = async (value = "") => {
    try {
      const data = await getUsers(value);
      setUsers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const Edit = (user) => {
    setSelectedUser(user);
    setOpenForm(true);
  };

  const Delete = async (user) => {
    const confirmDelete = window.confirm(
      `Supprimer ${user.firstName} ${user.lastName} ?`,
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(user.id);

      alert("Utilisateur supprimé");

      loadUsers(search);
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

 return (
  <>
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Gestion des utilisateurs
        </h1>

        <p className="text-slate-500 mt-2">Liste de tous les utilisateurs.</p>
      </div>

      <button
        onClick={() => {
          setSelectedUser(null);
          setOpenForm(true);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
      >
        + Ajouter
      </button>
    </div>

    {loading ? (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
        Chargement...
      </div>
    ) : (
      <>
        <div className="mb-6">
          <div className="relative w-full md:w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
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
          loadUsers(search);
          setOpenForm(false);
          setSelectedUser(null);
        }}
      />
    )}
  </>
);
}

export default UsersPage;

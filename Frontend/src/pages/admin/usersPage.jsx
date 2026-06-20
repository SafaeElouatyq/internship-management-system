import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import UserTable from "../../components/users/UserTable";
import UserForm from "../../components/users/UserForm";
import { getUsers } from "../../services/userService";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    console.log(user);
  };

  const handleDelete = (user) => {
    console.log(user);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Gestion des utilisateurs
          </h1>

          <p className="text-slate-500 mt-2">
            Liste de tous les utilisateurs.
          </p>
        </div>

        <button
          onClick={() => setOpenForm(true)}
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
        <UserTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {openForm && (
        <UserForm
          onClose={() => setOpenForm(false)}
          onSuccess={() => {
            loadUsers();
            setOpenForm(false);
          }}
        />
      )}
    </AdminLayout>
  );
}

export default UsersPage;
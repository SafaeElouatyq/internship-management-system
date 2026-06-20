import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { getUsers } from "../../services/userService";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium">
          + Ajouter un utilisateur
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {loading ? (
          <div className="p-10 text-center">
            Chargement...
          </div>
        ) : (
          <table className="w-full">

            <thead className="bg-slate-100">
              <tr>

                <th className="text-left px-6 py-4">
                  Nom
                </th>

                <th className="text-left px-6 py-4">
                  Email
                </th>

                <th className="text-left px-6 py-4">
                  Rôle
                </th>

                <th className="text-center px-6 py-4">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-200 hover:bg-slate-50"
                >

                  <td className="px-6 py-4">
                    {user.firstName} {user.lastName}
                  </td>

                  <td className="px-6 py-4">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    {user.role.name}
                  </td>

                  <td className="px-6 py-4 text-center">

                    <button className="text-blue-600 hover:underline mr-4">
                      Modifier
                    </button>

                    <button className="text-red-600 hover:underline">
                      Supprimer
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}
      </div>
    </AdminLayout>
  );
}

export default UsersPage;
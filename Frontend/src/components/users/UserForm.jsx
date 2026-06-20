import { useState } from "react";
import { useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import Alert from "../common/alert.jsx";
import { createUser, updateUser } from "../../services/userService";
import { getDepartments } from "../../services/departementService.jsx";
import { getRoles } from "../../services/roleService.jsx";

function UserForm({ onClose, onSuccess, user }) {
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    studentCode: "",
    level: "",
    department: "",
    speciality: "",
  });
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: "",
        role: user.role.name,
        studentCode: "",
        level: "",
        department: "",
        speciality: "",
      });
    }
  }, [user]);
  useEffect(() => {
    loadDepartments();
    loadRoles();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (user) {
        const data = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        };

        if (formData.password) {
          data.password = formData.password;
        }

        await updateUser(user.id, data);

        setAlert({
          type: "success",
          message: "Utilisateur modifié avec succès",
        });
      } else {
        await createUser(formData);

        setAlert({
          type: "success",
          message: "Utilisateur créé avec succès",
        });
      }

      onSuccess();
    } catch (error) {
      console.log(error);

      console.log(error.response);

      console.log(error.response?.data);

      alert(error.response?.data?.message || error.message);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {user ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
            </h2>

            <p className="text-slate-500 mt-1">
              {user
                ? "Modifiez les informations."
                : "Remplissez les informations du nouvel utilisateur."}{" "}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">Prénom</label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Adresse e-mail
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mot de passe
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                required={!user}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rôle</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={user}
            >
              <option value="">Sélectionner un rôle</option>

              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {formData.role === "STUDENT" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Code étudiant
                </label>

                <input
                  type="text"
                  name="studentCode"
                  value={formData.studentCode}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Niveau</label>

                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="LICENCE">Licence</option>
                  <option value="MASTER">Master</option>
                  <option value="ENGINEER">Ingénieur</option>
                </select>
              </div>
            </>
          )}

          {(formData.role === "STUDENT" ||
            formData.role === "SUPERVISOR" ||
            formData.role === "DEPARTMENT_HEAD") && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Département
              </label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
                required
              >
                <option value="">Sélectionner un département</option>

                {departments.map((department) => (
                  <option key={department.id} value={department.name}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.role === "SUPERVISOR" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Spécialité
              </label>

              <input
                type="text"
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {user ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;

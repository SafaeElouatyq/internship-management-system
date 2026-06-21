import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../services/authService.jsx";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const Change = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const Submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (!formData.newPassword) {
      setError("Mot de passe requis");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      await changePassword({
        newPassword: formData.newPassword,
      });

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          mustChangePassword: false,
        }),
      );

      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du changement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl">
        <div className="mb-7 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Changer le mot de passe
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Entrez votre nouveau mot de passe.
          </p>
        </div>

        <form onSubmit={Submit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Nouveau mot de passe
            </label>

            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={Change}
              placeholder="Nouveau mot de passe"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Confirmer le mot de passe
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={Change}
              placeholder="Confirmer le mot de passe"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition disabled:opacity-50"
          >
            {loading ? "Changement..." : "Changer le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordPage;

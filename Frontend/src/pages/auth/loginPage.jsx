import { useState } from "react";
import { Mail, Eye, EyeOff } from "lucide-react";
import { login } from "../../services/authService.jsx";
import { useNavigate } from "react-router-dom";
import { redirectByRole } from "../../utils/redirectByRole";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email || !formData.password) {
      setError("Email et mot de passe requis");
      setLoading(false);
      return;
    }

    try {
      const data = await login(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.mustChangePassword === true) {
        navigate("/change-password");
      } else {
        redirectByRole(data.user.role, navigate);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 grid lg:grid-cols-[1.05fr_0.95fr]">
      <div className="hidden lg:block relative h-screen overflow-hidden">
        <img
          src="/mu.jpg"
          alt="Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/25"></div>
      </div>

      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl">
          <div className="mb-7 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Bienvenue</h2>

            <p className="mt-2 text-sm text-slate-500">
              {" "}
              Connectez-vous pour continuer
            </p>
          </div>

          <form onSubmit={Submit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={Change}
                  placeholder="Entrez votre email"
                  className="w-full px-4 pr-10 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <Mail
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={Change}
                  placeholder="Entrez votre mot de passe"
                  className="w-full px-4 pr-10 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

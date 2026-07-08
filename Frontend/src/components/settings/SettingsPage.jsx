import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Monitor,
  Moon,
  Palette,
  Sun,
} from "lucide-react";
import { changePassword, login } from "../../services/authService.jsx";
import { settingsCopy as copy } from "../../utils/settingsCopy.js";
import {
  applyTheme,
  getStoredTheme,
  setStoredTheme,
  THEMES,
} from "../../utils/userPreferences.js";

function PasswordField({
  label,
  name,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          required
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
          aria-label={
            show ? "Masquer le mot de passe" : "Afficher le mot de passe"
          }
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function SettingsPage() {
  const [theme, setTheme] = useState(getStoredTheme());
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [themeLoading, setThemeLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [themeMessage, setThemeMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handlePasswordChange = (event) => {
    setPasswordForm({
      ...passwordForm,
      [event.target.name]: event.target.value,
    });
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage({ type: "", text: "" });

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword.trim()) {
      setPasswordMessage({
        type: "error",
        text: copy.currentPasswordRequired,
      });
      setPasswordLoading(false);
      return;
    }

    if (!newPassword.trim()) {
      setPasswordMessage({
        type: "error",
        text: copy.newPasswordRequired,
      });
      setPasswordLoading(false);
      return;
    }

    if (!confirmPassword.trim()) {
      setPasswordMessage({
        type: "error",
        text: copy.confirmPasswordRequired,
      });
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: copy.passwordMinLength,
      });
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: copy.passwordMismatch,
      });
      setPasswordLoading(false);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user.email) {
        throw new Error(copy.passwordError);
      }

      await login({
        email: user.email,
        password: currentPassword,
      });

      await changePassword({ newPassword });

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          mustChangePassword: false,
        }),
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordMessage({
        type: "success",
        text: copy.passwordSuccess,
      });
    } catch (error) {
      const message =
        error.response?.status === 401
          ? copy.currentPasswordInvalid
          : error.response?.data?.message || copy.passwordError;

      setPasswordMessage({
        type: "error",
        text: message,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const submitTheme = async (event) => {
    event.preventDefault();
    setThemeLoading(true);
    setThemeMessage({ type: "", text: "" });

    try {
      setStoredTheme(theme);
      applyTheme(theme);
      setThemeMessage({
        type: "success",
        text: copy.appearanceSuccess,
      });
    } finally {
      setThemeLoading(false);
    }
  };

  const renderMessage = (message) => {
    if (!message.text) {
      return null;
    }

    const classes =
      message.type === "success"
        ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
        : "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-300";

    return (
      <div className={`rounded-xl border px-4 py-3 text-sm ${classes}`}>
        {message.text}
      </div>
    );
  };

  const themeOptions = [
    { value: THEMES.LIGHT, label: copy.themeLight, icon: Sun },
    { value: THEMES.DARK, label: copy.themeDark, icon: Moon },
    { value: THEMES.SYSTEM, label: copy.themeSystem, icon: Monitor },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {copy.pageTitle}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {copy.pageDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
              <KeyRound size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {copy.passwordTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {copy.passwordDescription}
              </p>
            </div>
          </div>

          <form onSubmit={submitPassword} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <PasswordField
                label={copy.currentPassword}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                show={showCurrentPassword}
                onToggle={() => setShowCurrentPassword((value) => !value)}
                placeholder={copy.currentPassword}
              />

              <PasswordField
                label={copy.newPassword}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                show={showNewPassword}
                onToggle={() => setShowNewPassword((value) => !value)}
                placeholder={copy.newPassword}
              />

              <PasswordField
                label={copy.confirmPassword}
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((value) => !value)}
                placeholder={copy.confirmPassword}
              />
            </div>

            {renderMessage(passwordMessage)}

            <button
              type="submit"
              disabled={passwordLoading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {passwordLoading ? copy.saving : copy.updatePassword}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-xl bg-violet-50 p-3 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
              <Palette size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {copy.appearanceTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {copy.appearanceDescription}
              </p>
            </div>
          </div>

          <form onSubmit={submitTheme} className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                      theme === option.value
                        ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
                        : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={option.value}
                      checked={theme === option.value}
                      onChange={(event) => setTheme(event.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <Icon
                      size={18}
                      className="text-slate-500 dark:text-slate-300"
                    />
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>

            {renderMessage(themeMessage)}

            <button
              type="submit"
              disabled={themeLoading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {themeLoading ? copy.saving : copy.saveAppearance}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;

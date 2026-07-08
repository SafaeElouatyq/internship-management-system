const THEME_KEY = "app-theme";

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

export const getStoredTheme = () =>
  localStorage.getItem(THEME_KEY) || THEMES.SYSTEM;

export const setStoredTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};

export const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEMES.DARK
    : THEMES.LIGHT;

export const resolveTheme = (theme = getStoredTheme()) =>
  theme === THEMES.SYSTEM ? getSystemTheme() : theme;

export const applyTheme = (theme = getStoredTheme()) => {
  const resolved = resolveTheme(theme);
  const root = document.documentElement;

  root.classList.toggle("dark", resolved === THEMES.DARK);
  root.dataset.theme = theme;
  root.style.colorScheme = resolved;
};

export const initUserPreferences = () => {
  applyTheme();

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemThemeChange = () => {
    if (getStoredTheme() === THEMES.SYSTEM) {
      applyTheme(THEMES.SYSTEM);
    }
  };

  mediaQuery.addEventListener("change", handleSystemThemeChange);

  return () => {
    mediaQuery.removeEventListener("change", handleSystemThemeChange);
  };
};

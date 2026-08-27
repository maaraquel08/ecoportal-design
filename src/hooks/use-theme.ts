import * as React from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function resolveInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * sc1m components consume semantic tokens, so dark mode is a single
 * `.dark` class on <html> — no `dark:` utilities in product code.
 */
export function useTheme() {
  const [theme, setTheme] = React.useState<Theme>(resolveInitialTheme);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = React.useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  return { theme, setTheme, toggle };
}

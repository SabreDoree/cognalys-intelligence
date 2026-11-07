export const themeKey = "cognalys-theme";
export const themeColors = { dark: "#090b0f", light: "#ffffff" } as const;

// Runs before the body paints, including on statically exported pages.
export const initialThemeScript = `try {
  if (localStorage.getItem("${themeKey}") === "light") {
    document.documentElement.dataset.theme = "light";
  }
} catch {}`;

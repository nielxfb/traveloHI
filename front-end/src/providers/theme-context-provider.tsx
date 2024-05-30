import { useContext, useState } from "react";
import { ThemeContext, ThemeProvider } from "styled-components";

export interface IThemeContext {
  primary: string;
  secondary: string;
  accent: string;
  font: string;
  fontDimmed: string;
  error: string;
  overlay: string;
  toggleTheme: VoidFunction;
  currentTheme: string;
}

function resetDocumentTheme(theme: string) {
  document.documentElement.style.setProperty(
    "background-color",
    `var(--background-${theme})`
  );
  document.documentElement.style.setProperty("color", `var(--font-${theme})`);
}

function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const localTheme = localStorage.getItem("theme");
  const [currentTheme, setCurrentTheme] = useState<string>(
    localTheme ? localTheme : "light"
  );
  resetDocumentTheme(currentTheme);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");
    localStorage.setItem("theme", currentTheme === "light" ? "dark" : "light");
    resetDocumentTheme(currentTheme);
  };

  const themeValue = () => ({
    primary: `var(--primary-${currentTheme})`,
    secondary: `var(--secondary-${currentTheme})`,
    accent: `var(--accent-${currentTheme})`,
    font: `var(--font-${currentTheme})`,
    fontDimmed: `var(--font-dimmed-${currentTheme})`,
    background: `var(--background-${currentTheme})`,
    error: `var(--error-${currentTheme})`,
    overlay: `var(--overlay-${currentTheme})`,
    shadow: `var(--shadow-${currentTheme})`,
    footer: `var(--footer-${currentTheme})`,
    toggleTheme,
    currentTheme,
  });

  return <ThemeProvider theme={themeValue}>{children}</ThemeProvider>;
}

export const useTheme = () => {
  return useContext(ThemeContext);
}

export default ThemeContextProvider;

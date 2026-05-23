import React, { useEffect } from "react";
import { useAppContext } from "../Context";

const ThemeInput: React.FC = () => {
  const { theme, setTheme } = useAppContext();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-3">
      <label className="font-medium text-gray-700 dark:text-gray-300">
        Theme:
      </label>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {theme === "dark" ? "Dark Mode" : "Light Mode"}
      </button>
    </div>
  );
};

export default ThemeInput;
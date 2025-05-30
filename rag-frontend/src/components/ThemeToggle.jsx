import { useEffect, useState } from "react";
import { setTheme } from "../utils/theme";

export default function ThemeToggle() {
  const [mode, setMode] = useState(() => localStorage.getItem("theme") || "system");

  useEffect(() => {
    setTheme(mode); // Apply theme class to <html>
  }, [mode]);

  return (
    <select
      value={mode}
      onChange={(e) => setMode(e.target.value)}
      className="bg-gray-200 dark:bg-gray-700 text-sm px-2 py-1 rounded"
    >
      <option value="light">☀️ Light</option>
      <option value="dark">🌙 Dark</option>
      <option value="system">🖥 System</option>
    </select>
  );
}

import { useState, useEffect } from "react";

const themes = [
  { id: "red", label: "Red & Gold", colors: ["#B91C1C", "#FFFFFF", "#1A1A1A", "#D4A62A"] },
  { id: "teal", label: "Teal (Current)", colors: ["#DC2626", "#DC2626", "#003840", "#1A1A1A"] },
  { id: "gold", label: "Black & Gold", colors: ["#D4A62A", "#1A1A1A", "#000000", "#F0C850"] },
];

export default function ThemeSwitcher() {
  const [currentTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vividpoly-theme") || "teal";
    }
    return "teal";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("vividpoly-theme", currentTheme);
  }, [currentTheme]);

  // Theme switcher button removed per user request - theme defaults to teal
  return null;
}

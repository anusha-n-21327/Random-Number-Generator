"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ThemeSwitcher() {
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const themes = ["tech-noir", "onyx-neon"];
    const lastTheme = localStorage.getItem("last-selected-theme");
    let nextThemeIndex = 0;

    if (lastTheme) {
      const lastIndex = themes.indexOf(lastTheme);
      nextThemeIndex = (lastIndex + 1) % themes.length;
    }

    const newTheme = themes[nextThemeIndex];
    setTheme(newTheme);
    localStorage.setItem("last-selected-theme", newTheme);
  }, [setTheme]);

  // This component no longer renders any UI as it's for automatic switching
  return null;
}
"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ThemeSwitcher() {
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const themes = ["tech-noir", "onyx-neon"];
    // Read the same storage key that next-themes uses ('theme' by default).
    // The value can be stored with quotes (e.g., '"tech-noir"'), so we remove them.
    const lastTheme = localStorage.getItem("theme")?.replace(/"/g, '');
    
    let nextThemeIndex = 0;

    if (lastTheme) {
      const lastIndex = themes.indexOf(lastTheme);
      // If the last theme is found in our array, calculate the next index.
      // Otherwise, we'll default to the first theme.
      if (lastIndex !== -1) {
        nextThemeIndex = (lastIndex + 1) % themes.length;
      }
    }

    const newTheme = themes[nextThemeIndex];
    setTheme(newTheme);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // We only want this to run once when the component mounts.

  return null;
}
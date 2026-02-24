import type { ThemeName, CustomTheme, ResolvedTheme, RGBColor } from "./types.js";

export function hexToRGB(hex: string): RGBColor {
  const h = hex.replace("#", "");
  return {
    red: parseInt(h.substring(0, 2), 16) / 255,
    green: parseInt(h.substring(2, 4), 16) / 255,
    blue: parseInt(h.substring(4, 6), 16) / 255,
  };
}

const THEMES: Record<ThemeName, ResolvedTheme> = {
  ndf: {
    primary: hexToRGB("#1a3f6f"),
    secondary: hexToRGB("#2e74b5"),
    accent: hexToRGB("#e67e22"),
    background: hexToRGB("#ffffff"),
    text: hexToRGB("#1a3f6f"),
    muted: hexToRGB("#3a7ca5"),
  },
  dark: {
    primary: hexToRGB("#d4a843"),
    secondary: hexToRGB("#2e74b5"),
    accent: hexToRGB("#e67e22"),
    background: hexToRGB("#0d1b3e"),
    text: hexToRGB("#ffffff"),
    muted: hexToRGB("#b0bec5"),
  },
  light: {
    primary: hexToRGB("#2e74b5"),
    secondary: hexToRGB("#3a7ca5"),
    accent: hexToRGB("#27ae60"),
    background: hexToRGB("#f0f4f8"),
    text: hexToRGB("#1a3f6f"),
    muted: hexToRGB("#78909c"),
  },
};

export function resolveTheme(theme: ThemeName | CustomTheme): ResolvedTheme {
  if (typeof theme === "string") {
    return THEMES[theme] ?? THEMES.ndf;
  }
  return {
    primary: hexToRGB(theme.primary),
    secondary: hexToRGB(theme.secondary),
    accent: hexToRGB(theme.accent),
    background: hexToRGB(theme.background),
    text: hexToRGB(theme.text),
    muted: hexToRGB(theme.muted),
  };
}

// For HTML preview: convert theme to CSS hex colors
export function themeToCSS(theme: ThemeName | CustomTheme): Record<string, string> {
  if (typeof theme === "string") {
    const presets: Record<ThemeName, Record<string, string>> = {
      ndf: { primary: "#1a3f6f", secondary: "#2e74b5", accent: "#e67e22", background: "#ffffff", text: "#1a3f6f", muted: "#3a7ca5" },
      dark: { primary: "#d4a843", secondary: "#2e74b5", accent: "#e67e22", background: "#0d1b3e", text: "#ffffff", muted: "#b0bec5" },
      light: { primary: "#2e74b5", secondary: "#3a7ca5", accent: "#27ae60", background: "#f0f4f8", text: "#1a3f6f", muted: "#78909c" },
    };
    return presets[theme] ?? presets.ndf;
  }
  return { ...theme };
}

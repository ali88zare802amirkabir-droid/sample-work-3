"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ThemeMode = "dark" | "light";
export type AccentId = "blue" | "violet" | "emerald" | "amber";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  accent: AccentId;
  setAccent: (accent: AccentId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "nexaboard-theme";
const ACCENT_KEY = "nexaboard-accent";

const ACCENTS: Record<
  AccentId,
  {
    label: string;
    dark: { accent: string; soft: string };
    light: { accent: string; soft: string };
  }
> = {
  blue: {
    label: "Blue",
    dark: { accent: "#55a1ff", soft: "rgba(85,161,255,0.14)" },
    light: { accent: "#2563eb", soft: "rgba(37,99,235,0.10)" },
  },
  violet: {
    label: "Violet",
    dark: { accent: "#8b7cff", soft: "rgba(139,124,255,0.16)" },
    light: { accent: "#6d5ae0", soft: "rgba(109,90,224,0.12)" },
  },
  emerald: {
    label: "Emerald",
    dark: { accent: "#34d399", soft: "rgba(52,211,153,0.14)" },
    light: { accent: "#059669", soft: "rgba(5,150,105,0.12)" },
  },
  amber: {
    label: "Amber",
    dark: { accent: "#f5b544", soft: "rgba(245,181,68,0.15)" },
    light: { accent: "#d97706", soft: "rgba(217,119,6,0.12)" },
  },
};

function readTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  try {
    const raw = window.localStorage.getItem(THEME_KEY);
    return raw === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function readAccent(): AccentId {
  if (typeof window === "undefined") return "blue";
  try {
    const raw = window.localStorage.getItem(ACCENT_KEY);
    return raw && ACCENTS[raw as AccentId] ? (raw as AccentId) : "blue";
  } catch {
    return "blue";
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(readTheme);
  const [accent, setAccentState] = useState<AccentId>(readAccent);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
    try {
      window.localStorage.setItem(ACCENT_KEY, accent);
    } catch {
      /* ignore */
    }
    apply(theme, accent);
  }, [theme, accent]);

  const setTheme = useCallback((mode: ThemeMode) => setThemeState(mode), []);
  const setAccent = useCallback((next: AccentId) => setAccentState(next), []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

function apply(mode: ThemeMode, accent: AccentId) {
  const root = document.documentElement;
  root.classList.toggle("light", mode === "light");
  const palette = ACCENTS[accent][mode];
  root.style.setProperty("--accent", palette.accent);
  root.style.setProperty("--accent-soft", palette.soft);
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

export { ACCENTS };
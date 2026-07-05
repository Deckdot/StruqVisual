'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
type ThemePreference = Theme | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemePreference;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: ThemePreference;
  resolvedTheme: Theme;
  setTheme: (theme: ThemePreference) => void;
};

const initialState: ThemeProviderState = {
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'dark' || value === 'light' || value === 'system';
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  // Align with the root layout's default `light` class. Stored preferences are
  // applied after mount without relying on inline scripts in React markup.
  storageKey = 'struq-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemePreference>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<Theme>(() =>
    defaultTheme === 'system' ? getSystemTheme() : defaultTheme
  );

  useEffect(() => {
    // Load theme from localStorage on mount
    const stored = localStorage.getItem(storageKey);
    if (isThemePreference(stored)) {
      setTheme(stored);
    }
  }, [storageKey]);

  useEffect(() => {
    const nextResolvedTheme = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(nextResolvedTheme);

    // Apply theme class to html element only when it differs to avoid a
    // redundant DOM mutation that can trigger repaints during hydration.
    const root = window.document.documentElement;
    const current = root.classList.contains('light') ? 'light' : root.classList.contains('dark') ? 'dark' : null;
    if (current !== nextResolvedTheme) {
      root.classList.remove('light', 'dark');
      root.classList.add(nextResolvedTheme);
    }

    // Save to localStorage
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      /* ignore */
    }
  }, [theme, storageKey]);

  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleSystemThemeChange = () => {
      const nextResolvedTheme = getSystemTheme();
      setResolvedTheme(nextResolvedTheme);
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(nextResolvedTheme);
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  const value = {
    theme,
    resolvedTheme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

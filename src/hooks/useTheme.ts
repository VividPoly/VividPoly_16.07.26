'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  applyTheme,
  applyThemeWithTransition,
  getSystemTheme,
  persistTheme,
  readStoredTheme,
  resolveTheme,
  type ThemeMode,
} from '@/lib/theme';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    setTheme(resolveTheme());

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (readStoredTheme()) return;
      const next = getSystemTheme();
      applyTheme(next);
      setTheme(next);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      persistTheme(next);
      applyThemeWithTransition(next);
      return next;
    });
  }, []);

  return { theme, isDark: theme === 'dark', toggleTheme };
}

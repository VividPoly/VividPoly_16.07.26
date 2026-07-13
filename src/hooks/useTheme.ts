'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  applyTheme,
  resolveTheme,
  type ThemeMode,
} from '@/lib/theme';

/** Theme API is light-only; toggle is a no-op that re-asserts light. */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    applyTheme('light');
    setTheme(resolveTheme());
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme('light');
    setTheme('light');
  }, []);

  return { theme, isDark: false, toggleTheme };
}

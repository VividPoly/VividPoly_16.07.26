'use client';

import { useEffect } from 'react';
import { applyTheme } from '@/lib/theme';

/** Locks the site to light mode. */
export default function VpSystemThemeSync() {
  useEffect(() => {
    applyTheme('light');
  }, []);

  return null;
}

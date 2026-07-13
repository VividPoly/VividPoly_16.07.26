'use client';

import { useEffect } from 'react';
import { applyTheme } from '@/lib/theme';

/** Keeps the site locked to light mode even when the OS prefers dark. */
export default function VpSystemThemeSync() {
  useEffect(() => {
    const lockLight = () => applyTheme('light');

    lockLight();

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSchemeChange = () => lockLight();
    media.addEventListener('change', onSchemeChange);

    const onStorage = () => lockLight();
    window.addEventListener('storage', onStorage);
    window.addEventListener('pageshow', lockLight);
    document.addEventListener('visibilitychange', lockLight);

    return () => {
      media.removeEventListener('change', onSchemeChange);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('pageshow', lockLight);
      document.removeEventListener('visibilitychange', lockLight);
    };
  }, []);

  return null;
}

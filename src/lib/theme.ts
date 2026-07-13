export type ThemeMode = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'vp-theme';
export const THEME_TRANSITION_MS = 300;

/** Site is light-only; system dark mode must never win. */
export function getSystemTheme(): ThemeMode {
  return 'light';
}

export function readStoredTheme(): ThemeMode | null {
  return null;
}

export function resolveTheme(): ThemeMode {
  return 'light';
}

export function clearThemePreference() {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    // Ignore blocked storage.
  }
}

export function applyTheme(_theme: ThemeMode = 'light') {
  const root = document.documentElement;
  root.setAttribute('data-theme', 'light');
  root.style.colorScheme = 'light';
  root.classList.remove('dark');
  if (document.body) {
    document.body.style.colorScheme = 'light';
  }
  clearThemePreference();
}

export function persistTheme(_theme: ThemeMode) {
  clearThemePreference();
}

export function applyThemeWithTransition(_theme: ThemeMode) {
  const root = document.documentElement;
  root.setAttribute('data-theme-transition', '');
  applyTheme('light');
  window.setTimeout(() => {
    root.removeAttribute('data-theme-transition');
  }, THEME_TRANSITION_MS);
}

/**
 * Inline boot script: force light before paint so iOS/Android dark mode
 * cannot flash or restyle the first frame on Vercel.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var r=document.documentElement;r.setAttribute('data-theme','light');r.style.colorScheme='light';r.classList.remove('dark');try{localStorage.removeItem('vp-theme');}catch(e){}}catch(e){}})();`;

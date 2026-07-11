export type ThemeMode = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'vp-theme';
export const THEME_TRANSITION_MS = 300;

export function getSystemTheme(): ThemeMode {
  return 'light';
}

export function readStoredTheme(): ThemeMode | null {
  return null;
}

export function resolveTheme(): ThemeMode {
  return 'light';
}

export function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function persistTheme(theme: ThemeMode) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore blocked storage.
  }
}

export function applyThemeWithTransition(theme: ThemeMode) {
  const root = document.documentElement;
  root.setAttribute('data-theme-transition', '');
  applyTheme(theme);
  window.setTimeout(() => {
    root.removeAttribute('data-theme-transition');
  }, THEME_TRANSITION_MS);
}

/** Inline boot script: light mode only. */
export const THEME_BOOT_SCRIPT = `(function(){document.documentElement.setAttribute('data-theme','light');})();`;

/** VIVIDPOLY design tokens read from CSS variables (theme-aware). */

export type VpTokens = {
  navyDeep: string;
  navy: string;
  steel: string;
  slate: string;
  mist: string;
  fog: string;
  paper: string;
  ink: string;
  white: string;
  crimson: string;
  ember: string;
  gold: string;
  sand: string;
  charcoal: string;
  cream: string;
  accent: string;
  accentHover: string;
  accentSecondary: string;
  accentSubtle: string;
  accentBorder: string;
  bg: string;
  bgSubtle: string;
  bgMuted: string;
  bgElevated: string;
  bgDark: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  textOnDark: string;
  textOnDarkMuted: string;
  navActive: string;
  navIdle: string;
  border: string;
  borderStrong: string;
  success: string;
  shadowAccent: string;
};

const TOKEN_MAP: Record<keyof VpTokens, string> = {
  navyDeep: '--vp-navy-deep',
  navy: '--vp-navy',
  steel: '--vp-steel',
  slate: '--vp-slate',
  mist: '--vp-mist',
  fog: '--vp-fog',
  paper: '--vp-paper',
  ink: '--vp-ink',
  white: '--vp-white',
  crimson: '--vp-crimson',
  ember: '--vp-ember',
  gold: '--vp-gold',
  sand: '--vp-sand',
  charcoal: '--vp-charcoal',
  cream: '--vp-cream',
  accent: '--vp-accent',
  accentHover: '--vp-accent-hover',
  accentSecondary: '--vp-accent-secondary',
  accentSubtle: '--vp-accent-subtle',
  accentBorder: '--vp-accent-border',
  bg: '--vp-bg',
  bgSubtle: '--vp-bg-subtle',
  bgMuted: '--vp-bg-muted',
  bgElevated: '--vp-bg-elevated',
  bgDark: '--vp-bg-dark',
  textPrimary: '--vp-text-primary',
  textSecondary: '--vp-text-secondary',
  textMuted: '--vp-text-muted',
  textInverse: '--vp-text-inverse',
  textOnDark: '--vp-text-on-dark',
  textOnDarkMuted: '--vp-text-on-dark-muted',
  navActive: '--vp-text-on-dark',
  navIdle: '--vp-text-on-dark-muted',
  border: '--vp-border',
  borderStrong: '--vp-border-strong',
  success: '--vp-success',
  shadowAccent: '--vp-shadow-accent',
};

const FALLBACKS: VpTokens = {
  navyDeep: '#D21E2B',
  navy: '#D21E2B',
  steel: '#D21E2B',
  slate: '#111111',
  mist: '#111111',
  fog: '#FFFFFF',
  paper: '#FFFFFF',
  ink: '#111111',
  white: '#FFFFFF',
  crimson: '#D21E2B',
  ember: '#B51824',
  gold: '#D21E2B',
  sand: '#FFFFFF',
  charcoal: '#111111',
  cream: '#FFFFFF',
  accent: '#D21E2B',
  accentHover: '#B51824',
  accentSecondary: '#D21E2B',
  accentSubtle: '#FFFFFF',
  accentBorder: '#D21E2B',
  bg: '#FFFFFF',
  bgSubtle: '#FFFFFF',
  bgMuted: '#FFFFFF',
  bgElevated: '#FFFFFF',
  bgDark: '#000000',
  textPrimary: '#111111',
  textSecondary: '#111111',
  textMuted: '#111111',
  textInverse: '#FFFFFF',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: '#FFFFFF',
  navActive: '#FFFFFF',
  navIdle: '#FFFFFF',
  border: '#111111',
  borderStrong: '#111111',
  success: '#25D366',
  shadowAccent: '0 8px 24px rgba(210, 30, 43, 0.22)',
};

function readCssVar(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function readVpTokens(): VpTokens {
  return (Object.keys(TOKEN_MAP) as (keyof VpTokens)[]).reduce((acc, key) => {
    acc[key] = readCssVar(TOKEN_MAP[key], FALLBACKS[key]);
    return acc;
  }, {} as VpTokens);
}

/** @deprecated Use readVpTokens() for theme-aware values. */
export const VP = FALLBACKS;

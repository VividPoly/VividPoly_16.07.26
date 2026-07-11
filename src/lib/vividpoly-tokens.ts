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
  navyDeep: '#5C1014',
  navy: '#5C1014',
  steel: '#9E1B26',
  slate: '#1C1A19',
  mist: '#B8A99A',
  fog: '#D9CFC0',
  paper: '#F6F1E8',
  ink: '#1C1A19',
  white: '#FFFFFF',
  crimson: '#9E1B26',
  ember: '#C0392E',
  gold: '#B4934A',
  sand: '#D9CFC0',
  charcoal: '#1C1A19',
  cream: '#F6F1E8',
  accent: '#5C1014',
  accentHover: '#C0392E',
  accentSecondary: '#9E1B26',
  accentSubtle: '#D9CFC0',
  accentBorder: '#D9CFC0',
  bg: '#F6F1E8',
  bgSubtle: '#D9CFC0',
  bgMuted: '#D9CFC0',
  bgElevated: '#FFFFFF',
  bgDark: '#1C1A19',
  textPrimary: '#1C1A19',
  textSecondary: '#1C1A19',
  textMuted: '#1C1A19',
  textInverse: '#FFFFFF',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: '#D9CFC0',
  navActive: '#FFFFFF',
  navIdle: '#D9CFC0',
  border: '#D9CFC0',
  borderStrong: '#D9CFC0',
  success: '#25D366',
  shadowAccent: '0 8px 24px rgba(92, 16, 20, 0.22)',
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

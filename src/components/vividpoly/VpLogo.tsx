type VpLogoProps = {
  /** `light` = red mark for light surfaces; `inverse` = white mark for dark surfaces. */
  variant?: 'light' | 'inverse';
  className?: string;
};

export default function VpLogo({ variant = 'light', className = '' }: VpLogoProps) {
  const src = variant === 'inverse' ? '/vividpoly-logo-white.png' : '/vividpoly-logo.png';

  return (
    <img
      src={src}
      alt="VIVIDPOLY, Quality Packaging Solutions"
      className={`vp-wordmark vp-wordmark-img${className ? ` ${className}` : ''}`}
    />
  );
}

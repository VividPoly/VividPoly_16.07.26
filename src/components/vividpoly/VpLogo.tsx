type VpLogoProps = {
  /** Kept for API compatibility; logo artwork is designed for dark/navy backgrounds. */
  variant?: 'light' | 'inverse';
  className?: string;
};

export default function VpLogo({ className = '' }: VpLogoProps) {
  return (
    <img
      src="/vividpoly-logo.png"
      alt="VIVIDPOLY, Quality Packaging Solutions"
      className={`vp-wordmark vp-wordmark-img${className ? ` ${className}` : ''}`}
    />
  );
}

type VpIecLogoProps = {
  className?: string;
};

export default function VpIecLogo({ className = '' }: VpIecLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 88 48"
      role="img"
      aria-label="IEC certified"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="88" height="48" rx="6" fill="#003DA5" />
      <text
        x="44"
        y="31"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="2"
      >
        IEC
      </text>
    </svg>
  );
}

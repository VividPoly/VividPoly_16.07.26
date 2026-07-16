import VpPhotoSlot from '@/components/vividpoly/VpPhotoSlot';

type VpKnackProductCardProps = {
  id: string;
  name: string;
  short: string;
  onClick: () => void;
  recommended?: boolean;
  className?: string;
  imageSrc?: string;
};

export default function VpKnackProductCard({
  id,
  name,
  short,
  onClick,
  recommended = false,
  className = '',
  imageSrc,
}: VpKnackProductCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`vp-prod-card vp-prod-card--knack${className ? ` ${className}` : ''}`}
      aria-label={`View ${name}`}
      data-vp-product-id={id}
    >
      <div className="vp-prod-card-media">
        {recommended && <span className="vp-prod-rec-badge">Recommended</span>}
        <VpPhotoSlot
          src={imageSrc || `/images/products/${id}.jpg`}
          alt=""
          variant="thumb"
          className="vp-prod-card-img"
        />
      </div>
      <div className="vp-prod-card-body">
        <h3 className="vp-prod-card-title">{name}</h3>
        <p className="vp-prod-card-desc">{short}</p>
      </div>
    </button>
  );
}

'use client';

import VpKnackReveal from '@/components/vividpoly/VpKnackReveal';
import VpKnackProductCarousel from '@/components/vividpoly/VpKnackProductCarousel';
import { ChevronRightIcon } from '@/components/vividpoly/VividPolyIcons';

export type KnackProductUseCard = {
  id: string;
  cardTitle: string;
  bags: string;
  tips: string;
};

type VpKnackProductUseSectionProps = {
  title: string;
  lead: string;
  cards: KnackProductUseCard[];
  onCardClick: () => void;
  viewAllLabel?: string;
  onViewAll?: () => void;
  previousLabel?: string;
  nextLabel?: string;
};

export default function VpKnackProductUseSection({
  title,
  lead,
  cards,
  onCardClick,
  viewAllLabel = 'View all',
  onViewAll,
  previousLabel = 'Previous product uses',
  nextLabel = 'Next product uses',
}: VpKnackProductUseSectionProps) {
  const carouselItems = cards.map((card) => ({
    id: card.id,
    name: card.cardTitle,
    short: card.bags,
    imageSrc: `/images/industry/${card.id}.jpg`,
    open: onCardClick,
  }));

  return (
    <section className="vp-use-section--knack" aria-labelledby="vp-product-use-title">
      <div className="vp-use-section-inner">
        <VpKnackReveal className="vp-use-section-head">
          <h2 id="vp-product-use-title" className="vp-use-section-title">
            {title}
          </h2>
          <p className="vp-use-section-lead">{lead}</p>
        </VpKnackReveal>

        <div className="vp-use-section-body">
          <VpKnackReveal>
            <VpKnackProductCarousel
              products={carouselItems}
              previousLabel={previousLabel}
              nextLabel={nextLabel}
              ariaLabel="Product uses"
            />
          </VpKnackReveal>

          {onViewAll ? (
            <div className="vp-use-section-footer">
              <button type="button" className="vp-use-section-view-all" onClick={onViewAll}>
                {viewAllLabel}
                <ChevronRightIcon size={14} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

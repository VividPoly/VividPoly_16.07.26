'use client';

import VpKnackReveal from '@/components/vividpoly/VpKnackReveal';
import VpKnackProductCard from '@/components/vividpoly/VpKnackProductCard';
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
};

export default function VpKnackProductUseSection({
  title,
  lead,
  cards,
  onCardClick,
  viewAllLabel = 'View all',
  onViewAll,
}: VpKnackProductUseSectionProps) {
  return (
    <section className="vp-use-section--knack" aria-labelledby="vp-product-use-title">
      <div className="vp-use-section-inner">
        <VpKnackReveal className="vp-use-section-head">
          <h2 id="vp-product-use-title" className="vp-use-section-title">
            {title}
          </h2>
          <p className="vp-use-section-lead">{lead}</p>
        </VpKnackReveal>

        <VpKnackReveal stagger className="vp-use-cards-grid">
          {cards.slice(0, 4).map((card) => (
            <VpKnackProductCard
              key={card.id}
              id={card.id}
              name={card.cardTitle}
              short={card.bags}
              imageSrc={`/images/industry/${card.id}.jpg`}
              onClick={onCardClick}
            />
          ))}
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
    </section>
  );
}

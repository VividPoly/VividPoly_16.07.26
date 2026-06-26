'use client';

export type VpFaqAccordionItem = {
  q: string;
  a: string;
  open: boolean;
  toggle: () => void;
};

type VpFaqAccordionProps = {
  items: VpFaqAccordionItem[];
  className?: string;
};

export default function VpFaqAccordion({ items, className }: VpFaqAccordionProps) {
  return (
    <div className={`vp-faq-accordion${className ? ` ${className}` : ''}`}>
      {items.map((item, index) => {
        const triggerId = `vp-faq-trigger-${index}`;
        const panelId = `vp-faq-panel-${index}`;

        return (
          <div
            key={index}
            className={`vp-faq-item${item.open ? ' vp-faq-item--open' : ''}`}
          >
            <button
              id={triggerId}
              type="button"
              className="vp-faq-trigger"
              onClick={item.toggle}
              aria-expanded={item.open}
              aria-controls={panelId}
            >
              <span className="vp-faq-q">{item.q}</span>
              <span className="vp-faq-icon" aria-hidden="true" />
            </button>
            <div
              id={panelId}
              className="vp-faq-panel"
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!item.open}
            >
              <div className="vp-faq-panel-inner">
                <div className="vp-faq-a">{item.a}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

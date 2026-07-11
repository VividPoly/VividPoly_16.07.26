type VpKnackBuyerSectionProps = {
  title: string;
  paragraphs: string[];
};

export default function VpKnackBuyerSection({ title, paragraphs }: VpKnackBuyerSectionProps) {
  return (
    <section className="vp-buyer-section--knack" aria-labelledby="vp-buyer-section-title">
      <div className="vp-buyer-section-shell">
        <div className="vp-buyer-section-card">
          <h2 id="vp-buyer-section-title" className="vp-buyer-section-title">
            {title}
          </h2>
          <div className="vp-buyer-section-copy">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="vp-buyer-section-body">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

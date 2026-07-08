type PdpProduct = {
  benefits: string;
  details: string;
  speciality: string;
  mfg: string;
  material: string;
};

type PdpFeature = { f: string; d: string };

const PRODUCTION_ROWS = [
  { key: 'Speciality', field: 'speciality' as const },
  { key: 'Manufacturing process', field: 'mfg' as const },
  { key: 'Material combination', field: 'material' as const },
];

export default function VpPdpDetails({
  product,
  features,
}: {
  product: PdpProduct;
  features: PdpFeature[];
}) {
  return (
    <section className="vp-pdp-details" aria-label="Product information">
      <div className="vp-pdp-details-inner">
        {features.length > 0 && (
          <div className="vp-pdp-details-block">
            <h2 className="vp-pdp-details-heading">Key features</h2>
            <div className={`vp-pdp-panel vp-pdp-panel--cols-${features.length === 3 ? 3 : 2}`}>
              {features.map((feature) => (
                <div key={feature.f} className="vp-pdp-panel-item">
                  <h3 className="vp-pdp-panel-title">{feature.f}</h3>
                  <p className="vp-pdp-panel-text">{feature.d}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="vp-pdp-details-block">
          <h2 className="vp-pdp-details-heading">Why buyers choose this bag</h2>
          <div className="vp-pdp-panel vp-pdp-panel--cols-2">
            <div className="vp-pdp-panel-item">
              <h3 className="vp-pdp-panel-title">Benefits</h3>
              <p className="vp-pdp-panel-text">{product.benefits}</p>
            </div>
            <div className="vp-pdp-panel-item">
              <h3 className="vp-pdp-panel-title">Customization details</h3>
              <p className="vp-pdp-panel-text">{product.details}</p>
            </div>
          </div>
        </div>

        <div className="vp-pdp-details-block">
          <h2 className="vp-pdp-details-heading">Production &amp; materials</h2>
          <div className="vp-pdp-panel vp-pdp-panel--cols-3">
            {PRODUCTION_ROWS.map((row) => (
              <div key={row.key} className="vp-pdp-panel-item">
                <h3 className="vp-pdp-panel-title">{row.key}</h3>
                <p className="vp-pdp-panel-text">{product[row.field]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

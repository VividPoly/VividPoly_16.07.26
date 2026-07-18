import { useLocaleMessages } from '@/lib/i18n/LocaleProvider';

type PdpProduct = {
  benefits: string;
  details: string;
  speciality: string;
  mfg: string;
  material: string;
};

type PdpFeature = { f: string; d: string };

// Section labels come from the localized `pdp` copy (see src/data/ui-copy.json
// and the per-locale files), so the whole product panel translates with the
// rest of the site. `field` still points at the product's data value.
const PRODUCTION_ROWS = [
  { field: 'speciality' as const, labelKey: 'speciality' as const },
  { field: 'mfg' as const, labelKey: 'manufacturingProcess' as const },
  { field: 'material' as const, labelKey: 'materialCombination' as const },
];

export default function VpPdpDetails({
  product,
  features,
}: {
  product: PdpProduct;
  features: PdpFeature[];
}) {
  const { pdp } = useLocaleMessages();

  return (
    <section className="vp-pdp-details" aria-label="Product information">
      <div className="vp-pdp-details-inner">
        {features.length > 0 && (
          <div className="vp-pdp-details-block">
            <h2 className="vp-pdp-details-heading">{pdp.keyFeatures}</h2>
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
          <h2 className="vp-pdp-details-heading">{pdp.whyBuyersChoose}</h2>
          <div className="vp-pdp-panel vp-pdp-panel--cols-2">
            <div className="vp-pdp-panel-item">
              <h3 className="vp-pdp-panel-title">{pdp.benefits}</h3>
              <p className="vp-pdp-panel-text">{product.benefits}</p>
            </div>
            <div className="vp-pdp-panel-item">
              <h3 className="vp-pdp-panel-title">{pdp.customization}</h3>
              <p className="vp-pdp-panel-text">{product.details}</p>
            </div>
          </div>
        </div>

        <div className="vp-pdp-details-block">
          <h2 className="vp-pdp-details-heading">{pdp.productionMaterials}</h2>
          <div className="vp-pdp-panel vp-pdp-panel--cols-3">
            {PRODUCTION_ROWS.map((row) => (
              <div key={row.field} className="vp-pdp-panel-item">
                <h3 className="vp-pdp-panel-title">{pdp[row.labelKey]}</h3>
                <p className="vp-pdp-panel-text">{product[row.field]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

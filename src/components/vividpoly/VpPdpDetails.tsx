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

            <div className={`vp-pdp-feature-grid${features.length === 3 ? ' vp-pdp-feature-grid--3' : ''}`}>

              {features.map((feature) => (

                <article key={feature.f} className="vp-pdp-feature-card">

                  <h3 className="vp-pdp-feature-title">{feature.f}</h3>

                  <p className="vp-pdp-feature-desc">{feature.d}</p>

                </article>

              ))}

            </div>

          </div>

        )}



        <div className="vp-pdp-details-block">

          <h2 className="vp-pdp-details-heading">Why buyers choose this bag</h2>

          <div className="vp-pdp-copy-grid">

            <article className="vp-pdp-copy-card">

              <h3 className="vp-pdp-copy-title">Benefits</h3>

              <p className="vp-pdp-copy-text">{product.benefits}</p>

            </article>

            <article className="vp-pdp-copy-card">

              <h3 className="vp-pdp-copy-title">Customization details</h3>

              <p className="vp-pdp-copy-text">{product.details}</p>

            </article>

          </div>

        </div>



        <div className="vp-pdp-details-block">

          <h2 className="vp-pdp-details-heading">Production &amp; materials</h2>

          <div className="vp-pdp-spec-grid">

            {PRODUCTION_ROWS.map((row) => (

              <div key={row.key} className="vp-pdp-spec-row">

                <span className="vp-pdp-spec-key">{row.key}</span>

                <span className="vp-pdp-spec-val">{product[row.field]}</span>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>

  );

}


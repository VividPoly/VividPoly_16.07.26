'use client';

import VpBankSearchOverlay from '@/components/vividpoly/VpBankSearchOverlay';
import VpSuccessCard from '@/components/vividpoly/VpSuccessCard';
import VpCustomSelect from '@/components/vividpoly/VpCustomSelect';
import { ChevronLeftIcon } from '@/components/vividpoly/VividPolyIcons';

type CheckoutView = Record<string, any>;

function ProgressStep({ label, state }: { label: string; state: 'done' | 'active' | 'upcoming' }) {
  return (
    <span className={`vp-checkout-step vp-checkout-step--${state}`}>
      {label}
    </span>
  );
}

function FieldPicker({
  label,
  value,
  onClick,
  required,
}: {
  label: string;
  value: string;
  onClick: () => void;
  required?: boolean;
}) {
  return (
    <div className="vp-checkout-field">
      <span className="vp-checkout-field-label">
        {label}
        {required ? ' *' : ''}
      </span>
      <button type="button" className="vp-checkout-field-picker" onClick={onClick}>
        <span>{value || `Select ${label.toLowerCase()}`}</span>
        <span className="vp-filter-chevron" aria-hidden="true" />
      </button>
    </div>
  );
}

function FieldStatic({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="vp-checkout-field">
      <span className="vp-checkout-field-label">{label}</span>
      <div className={`vp-checkout-field-static${bold ? ' vp-checkout-field-static--bold' : ''}`}>{value}</div>
    </div>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
  searchable,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
}) {
  return (
    <div className="vp-checkout-field">
      <label className="vp-checkout-field-label">
        {label}
        {required ? ' *' : ''}
      </label>
      <VpCustomSelect
        value={value}
        options={options}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        ariaLabel={label}
        searchable={searchable}
        menuClassName={searchable ? 'vp-sort-menu--contact' : undefined}
      />
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="vp-checkout-field">
      <label className="vp-checkout-field-label">
        {label}
        {required ? ' *' : ''}
      </label>
      <input
        type={type}
        className="vp-checkout-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function VpSampleCheckout({ v }: { v: CheckoutView }) {
  const step = v.sampleStep as number;

  const stepState = (index: number): 'done' | 'active' | 'upcoming' => {
    if (step > index) return 'done';
    if (step === index) return 'active';
    return 'upcoming';
  };

  if (step === 2) {
    return (
      <VpSuccessCard
        titleId="vp-sample-success-title"
        title={v.siteCopy.sampleSuccessTitle}
        body={
          <>
            {v.siteCopy.sampleSuccessBody}
            <p className="vp-success-card-meta">
              Reference: <strong>{v.sampleRef}</strong> · {v.sampleProduct.name}
            </p>
          </>
        }
        primary={{ label: 'Back to Home', onClick: v.sampleRestart }}
        secondary={{ label: 'Chat with Export Team', onClick: v.openContactEnquiry }}
      />
    );
  }

  return (
    <div className="vp-checkout">
      <div className="vp-checkout-top">
        <button type="button" onClick={v.sampleBack} className="vp-checkout-back vp-with-chevron"><ChevronLeftIcon size={14} /> Back</button>
        <div className="vp-checkout-progress" aria-label="Checkout progress">
          <ProgressStep label="Review" state={stepState(0)} />
          <span className="vp-checkout-progress-sep" aria-hidden="true" />
          <ProgressStep label="Payment" state={stepState(1)} />
          <span className="vp-checkout-progress-sep" aria-hidden="true" />
          <ProgressStep label="Confirmed" state={stepState(2)} />
        </div>
      </div>

      <div className="vp-checkout-grid">
        <div className="vp-checkout-main">
          {step === 0 && (
            <section className="vp-checkout-panel">
              <h2 className="vp-checkout-panel-title">Sample specification</h2>
              <p className="vp-checkout-panel-lead">{v.siteCopy.sampleBillIntro}</p>
              <div className="vp-checkout-spec-grid">
                {v.sampleBillRows
                  .filter((r: { k: string }) => r.k !== 'Total')
                  .map((r: { k: string; v: string }, i: number) => (
                    <div key={i} className="vp-checkout-spec-row">
                      <span className="vp-checkout-spec-key">{r.k}</span>
                      <span className="vp-checkout-spec-val">{r.v}</span>
                    </div>
                  ))}
              </div>
              <p className="vp-checkout-note">
                Sample specification is based on this product&apos;s standard construction. Custom print or size changes may be quoted separately after review.
              </p>
            </section>
          )}

          {step === 1 && (
            <>
              <section className="vp-checkout-panel">
                <h2 className="vp-checkout-panel-title">Your details</h2>
                <div className="vp-checkout-form-grid">
                  <FieldInput label="Company name" value={v.qv.company ?? ''} onChange={v.qSet.company} required />
                  <FieldInput label="Email" type="email" value={v.qv.email ?? ''} onChange={v.qSet.email} required />
                  <FieldInput label="Contact name" value={v.qv.name ?? ''} onChange={v.qSet.name} required />
                  <FieldInput label="WhatsApp / Phone" value={v.qv.whatsapp ?? ''} onChange={v.qSet.whatsapp} />
                  <FieldSelect
                    label="Country"
                    value={v.qv.country ?? ''}
                    onChange={v.selectCountry}
                    options={v.contactCountries}
                    placeholder="Select country"
                    searchable
                  />
                </div>
              </section>

              <section className="vp-checkout-panel">
                <h2 className="vp-checkout-panel-title">Bank transfer</h2>
                <p className="vp-checkout-panel-lead">{v.siteCopy.samplePaymentIntro}</p>
                <div className="vp-checkout-form-grid">
                  <FieldPicker label="Bank" value={v.samplePaymentAccount.bankName} onClick={v.openBankPicker} required />
                  <FieldPicker
                    label="Branch"
                    value={`${v.samplePaymentAccount.branch}, ${v.samplePaymentAccount.location}`}
                    onClick={v.openBranchPicker}
                    required
                  />
                  <FieldStatic label="Beneficiary" value={v.samplePaymentAccount.beneficiary} />
                  <FieldStatic label="Account number" value={v.samplePaymentAccount.accountNumber} />
                  <FieldStatic label="IFSC" value={v.samplePaymentAccount.ifsc} />
                  <FieldStatic label="SWIFT" value={v.samplePaymentAccount.swift} />
                  <FieldStatic label="Account type" value={v.samplePaymentAccount.accountType} />
                  <FieldStatic label="Payment reference" value={v.sampleRef} bold />
                </div>
                <p className="vp-checkout-note">{v.bankPaymentNote}</p>
              </section>
            </>
          )}
        </div>

        <aside className="vp-checkout-sidebar">
          <h3 className="vp-checkout-sidebar-title">Your sample order</h3>
          <div className="vp-checkout-cart-item">
            <div className="vp-checkout-cart-thumb vp-ph" aria-hidden="true" />
            <div className="vp-checkout-cart-meta">
              <div className="vp-checkout-cart-name">{v.sampleCart.productName}</div>
              <div className="vp-checkout-cart-sub">{v.sampleCart.productMeta}</div>
              <div className="vp-checkout-cart-qty">{v.sampleCart.qtyLabel}</div>
            </div>
            <div className="vp-checkout-cart-price">${v.sampleCart.subtotalUsd.toFixed(2)}</div>
          </div>

          <div className="vp-checkout-summary-lines">
            <div className="vp-checkout-summary-line">
              <span>Subtotal</span>
              <span>${v.sampleCart.subtotalUsd.toFixed(2)}</span>
            </div>
            <div className="vp-checkout-summary-line">
              <span>Export packing &amp; dispatch</span>
              <span>${v.sampleCart.shippingUsd.toFixed(2)}</span>
            </div>
          </div>

          <div className="vp-checkout-summary-total">
            <span>Total</span>
            <span>${v.sampleCart.totalUsd.toFixed(2)} {v.sampleCart.currency}</span>
          </div>

          {step === 0 && (
            <button type="button" onClick={v.sampleBuyNow} className="vp-cta-primary vp-cta-primary--lg vp-cta-primary--block">
              Continue to Payment
            </button>
          )}
          {step === 1 && (
            <button
              type="button"
              onClick={v.sampleConfirmPayment}
              disabled={!v.samplePaymentCanSubmit}
              className="vp-cta-primary vp-cta-primary--lg vp-cta-primary--block"
            >
              {v.siteCopy.samplePaymentConfirmCta}
            </button>
          )}
        </aside>
      </div>

      <VpBankSearchOverlay
        open={v.bankPickerOpen}
        title={v.bankPickerMode === 'bank' ? 'Select bank' : 'Select branch'}
        placeholder={v.bankPickerMode === 'bank' ? 'Search banks…' : 'Search branches…'}
        items={v.bankPickerItems}
        query={v.bankPickerQuery}
        onQueryChange={v.setBankPickerQuery}
        onSelect={v.selectBankPickerItem}
        onClose={v.closeBankPicker}
      />
    </div>
  );
}

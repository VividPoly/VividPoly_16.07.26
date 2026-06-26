'use client';

import type { ReactNode } from 'react';

export type VpSuccessCardOptional = {
  title: string;
  body: string;
};

export type VpSuccessCardAction = {
  label: string;
  onClick: () => void;
};

type VpSuccessCardProps = {
  title: string;
  body: ReactNode;
  optional?: VpSuccessCardOptional;
  primary?: VpSuccessCardAction;
  secondary?: VpSuccessCardAction;
  titleId?: string;
  className?: string;
};

export default function VpSuccessCard({
  title,
  body,
  optional,
  primary,
  secondary,
  titleId,
  className,
}: VpSuccessCardProps) {
  return (
    <section
      className={['vp-success-page', className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
    >
      <div className="vp-success-card">
        <div className="vp-success-card-icon" aria-hidden="true">✓</div>
        <h2 id={titleId} className="vp-success-card-title">{title}</h2>
        <div className="vp-success-card-text">{body}</div>

        {optional && (
          <div className="vp-success-card-optional">
            <h3 className="vp-success-card-optional-title">{optional.title}</h3>
            <p className="vp-success-card-optional-text">{optional.body}</p>
          </div>
        )}

        {(primary || secondary) && (
          <div className="vp-success-card-actions">
            {primary && (
              <button type="button" onClick={primary.onClick} className="vp-cta-primary vp-cta-primary--lg">
                {primary.label}
              </button>
            )}
            {secondary && (
              <button type="button" onClick={secondary.onClick} className="vp-success-card-secondary">
                {secondary.label}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

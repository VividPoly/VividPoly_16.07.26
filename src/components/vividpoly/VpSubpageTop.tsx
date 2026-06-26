'use client';

import type { CSSProperties, ReactNode } from 'react';
import type { VpBreadcrumb } from '@/lib/vividpoly-navigation';
import { withHomeBreadcrumb } from '@/lib/vividpoly-navigation';

type VpSubpageTopProps = {
  breadcrumb?: string;
  breadcrumbs?: VpBreadcrumb[];
  onHomeClick?: () => void;
  homeLabel?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

function BreadcrumbTrail({ items }: { items: VpBreadcrumb[] }) {
  return (
    <nav className="vp-page-crumb" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="vp-page-crumb-segment">
          {index > 0 && <span className="vp-page-crumb-sep" aria-hidden="true"> / </span>}
          {item.onClick ? (
            <button type="button" className="vp-page-crumb-link" onClick={item.onClick}>
              {item.label}
            </button>
          ) : (
            <span className="vp-page-crumb-current" aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default function VpSubpageTop({
  breadcrumb,
  breadcrumbs,
  onHomeClick,
  homeLabel = 'Home',
  children,
  className,
  style,
}: VpSubpageTopProps) {
  const base = breadcrumb ? [{ label: breadcrumb }] : [];
  const trail = breadcrumbs ?? (onHomeClick ? withHomeBreadcrumb(base, onHomeClick, homeLabel) : base);

  return (
    <div className={`vp-subpage-top${className ? ` ${className}` : ''}`} style={style}>
      {trail.length > 0 && <BreadcrumbTrail items={trail} />}
      {children}
    </div>
  );
}

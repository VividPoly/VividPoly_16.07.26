export type EnquiryProductType = {
  label: string;
  id: string;
};

export function enquiryTypeLabelForProductId(
  productId: string | undefined | null,
  enquiryProductTypes: EnquiryProductType[],
): string | null {
  if (!productId || productId === 'general') return null;
  return enquiryProductTypes.find((item) => item.id === productId)?.label ?? null;
}

export function resolveContactEnquiryType(
  quote: { product?: unknown; productId?: unknown },
  enquiryProductTypes: EnquiryProductType[],
  generalEnquiryType: string,
): string {
  const fromId = enquiryTypeLabelForProductId(
    typeof quote.productId === 'string' ? quote.productId : undefined,
    enquiryProductTypes,
  );
  if (fromId) return fromId;

  const product = typeof quote.product === 'string' ? quote.product : '';
  if (enquiryProductTypes.some((item) => item.label === product)) return product;

  return generalEnquiryType;
}

export function enquiryQuoteSelectionForProductId(
  productId: string,
  enquiryProductTypes: EnquiryProductType[],
  generalEnquiryType: string,
): { product: string; productId: string } {
  const label = enquiryTypeLabelForProductId(productId, enquiryProductTypes);
  if (label) {
    return { product: label, productId };
  }
  return { product: generalEnquiryType, productId: 'general' };
}

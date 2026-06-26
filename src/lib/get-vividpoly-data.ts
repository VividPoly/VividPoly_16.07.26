import { contactCountries as contactCountriesList } from '@/data/contact-countries';

export type VividPolyMessages = typeof import('@/data/ui-copy.json');

export function getVividPolyData(messages: VividPolyMessages) {
  const m = messages;

  const products = Object.entries(m.products).map(([id, p]) => ({
    id,
    name: p.name,
    cta: p.cta,
    group: p.group,
    short: p.short,
    intro: p.intro,
    features: p.features.map((f) => [f.title, f.body] as [string, string]),
    benefits: p.benefits,
    details: p.details,
    spec: p.spec.map((s) => [s.key, s.value] as [string, string]),
    speciality: p.speciality,
    mfg: p.mfg,
    material: p.material,
  }));

  const buyerRows = m.buyerRows.map((r) => [r.requirement, r.response, [] as string[]] as [string, string, string[]]);
  const useRows = m.useRows.map((r) => [r.use, r.bags, r.tips] as [string, string, string]);
  const faqList = m.faqList.map((f) => [f.q, f.a] as [string, string]);
  const blogList = m.blogList.map((b) => [b.title, b.purpose, b.excerpt, b.category, b.readTime] as [string, string, string, string, string]);
  const filterSections = m.filterSections.map((s) => [
    s.key,
    s.options.map((o) => (typeof o === 'string' ? o : o.id)),
  ] as [string, string[]]);

  return {
    products,
    buyerRows,
    buyerMeta: m.buyerMeta,
    useRows,
    useGuidance: m.useGuidance,
    typeGroups: m.typeGroups,
    useGroups: m.useGroups,
    filterSections,
    faqList,
    blogList,
    packedProductOptions: m.packedProductOptions,
    siteCopy: m.siteCopy,
    sampleOrderDefaults: m.sampleOrderDefaults,
    bankDetails: m.bankDetails,
    paymentBankAccounts: m.paymentBankAccounts,
    footerProductLinks: m.footerProductLinks,
    markets: m.markets,
    contactCountriesList,
    messages: m,
  };
}

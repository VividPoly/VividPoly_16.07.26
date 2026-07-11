import fs from 'fs';

const path = new URL('../src/data/ui-copy.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

data.topBar.whatsappHref = 'https://wa.me/919213626740';
data.topBar.email = 'info@vividpoly.com';

data.fab.label = 'Enquiry';
data.fab.ariaLabel = 'Open enquiry form';

data.siteCopy.heroCtaPrimary = 'WhatsApp';
data.siteCopy.heroCtaWhatsApp = 'WhatsApp';
data.siteCopy.heroWhatsAppHref = 'https://wa.me/919213626740';
data.siteCopy.heroIsoLabel = 'ISO certified';
data.siteCopy.heroIecLabel = 'IEC certified';
data.siteCopy.homeStats = [
  { value: '70+', label: 'Export Markets' },
  { value: '9+', label: 'Countries Served' },
  { value: '750', label: 'MT/ monthly capacity' },
  { value: '100%', label: 'Export Grade' },
];
data.siteCopy.homeCertsHeading = 'Certifications';

data.typeGroups = [
  {
    title: 'Woven Bag',
    ids: [
      'open-mouth',
      'stitched',
      'd-cut',
      'valve',
      'carry',
      'laminated',
      'pinch-bottom',
      'block-bottom',
      'gusset',
      'shopping',
    ],
  },
  { title: 'Fabric', ids: ['fabric'] },
  { title: 'Tape', ids: ['tape'] },
  { title: 'Weed Barrier', ids: ['weed-barrier'] },
];

for (const id of Object.keys(data.products)) {
  if (!['fabric', 'tape', 'weed-barrier'].includes(id)) {
    data.products[id].group = 'Woven Bag';
  }
}

function minimalProduct(name, cta, group, short) {
  return {
    name,
    cta,
    group,
    short,
    intro: short,
    features: [
      {
        title: 'Export ready',
        body: 'Supplied for international buyers with custom sizing and packing options.',
      },
      {
        title: 'Custom specification',
        body: 'Width, GSM, colour, and roll or cut length can be planned to order.',
      },
      {
        title: 'Quality focus',
        body: 'Consistent weave and finish for industrial and agricultural use.',
      },
    ],
    benefits: short,
    details: 'Share your required width, GSM, colour, quantity, and destination for a quotation.',
    spec: [
      { key: 'Format', value: 'Custom to enquiry' },
      { key: 'Material', value: 'PP woven' },
      { key: 'Packing', value: 'Export packing' },
    ],
    speciality: `${name} from VIVIDPOLY for global buyers.`,
    mfg: 'Weaving, finishing, inspection, and export packing.',
    material: 'PP woven material and buyer-specific additives where required.',
  };
}

data.products.fabric = minimalProduct(
  'PP Woven Fabric',
  'Explore PP Woven Fabric',
  'Fabric',
  'PP woven fabric rolls and cut lengths for industrial, agricultural, and conversion use.',
);
data.products.tape = minimalProduct(
  'Tape',
  'Explore Tape',
  'Tape',
  'PP tape for weaving and packaging applications, supplied to export specifications.',
);
data.products['weed-barrier'] = minimalProduct(
  'Weed Barrier',
  'Explore Weed Barrier',
  'Weed Barrier',
  'PP woven weed barrier fabric for landscaping, agriculture, and ground-cover applications.',
);

const extraEnquiry = [
  { label: 'PP Woven Fabric', id: 'fabric' },
  { label: 'Tape', id: 'tape' },
  { label: 'Weed Barrier', id: 'weed-barrier' },
];
for (const item of extraEnquiry) {
  if (!data.enquiryProductTypes.some((e) => e.id === item.id)) {
    data.enquiryProductTypes.push(item);
  }
}

for (const item of extraEnquiry) {
  if (!data.footerProductLinks.some((p) => p.id === item.id)) {
    data.footerProductLinks.push({ label: item.label, id: item.id });
  }
}

const productTypeSection = data.filterSections.find((s) => s.key === 'Product Type');
if (productTypeSection) {
  for (const opt of [
    { id: 'PP woven fabric', label: 'PP woven fabric' },
    { id: 'Tape', label: 'Tape' },
    { id: 'Weed barrier', label: 'Weed barrier' },
  ]) {
    if (!productTypeSection.options.some((o) => o.id === opt.id)) {
      productTypeSection.options.push(opt);
    }
  }
}

fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log('ui-copy.json updated');

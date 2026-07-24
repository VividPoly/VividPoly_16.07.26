import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const url = new URL(DATABASE_URL.replace('mysql://', 'http://'));
  const sslParam = DATABASE_URL.split('?ssl=')[1];
  
  const conn = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 4000,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: true }
  });

  // First check existing categories
  const [cats] = await conn.query('SELECT id, name, slug FROM product_categories ORDER BY id');
  console.log('Categories:', JSON.stringify(cats, null, 2));

  // Check existing products to see what's there
  const [prods] = await conn.query('SELECT id, name, slug, categoryId FROM products ORDER BY id');
  console.log('Products:', JSON.stringify(prods.map(p => ({id: p.id, name: p.name, slug: p.slug, cat: p.categoryId})), null, 2));

  // Find the PP Woven Fabric category or similar
  const fabricCat = cats.find(c => c.slug === 'pp-woven-fabric' || c.name.toLowerCase().includes('fabric'));
  console.log('Fabric category:', fabricCat);

  // Images array
  const images = JSON.stringify([
    "/manus-storage/weedbarrier_vividpoly_Usage_export_45393216.jpg",
    "/manus-storage/2_weedbarrier_vividpoly_Usage_export_70276433.jpg",
    "/manus-storage/4_weedbarrier_vividpoly_Usage_export_b5567948.jpg",
    "/manus-storage/5_weedbarrier_vividpoly_Usage_export_368247d7.jpg",
    "/manus-storage/10_weedbarrier_vividpoly_Usage_export_4ed97e11.jpg",
    "/manus-storage/6_weedbarrier_vividpoly_Usage_export_13830fae.webp",
    "/manus-storage/7_weedbarrier_vividpoly_Usage_export_fe9fc3ef.webp",
    "/manus-storage/8_weedbarrier_vividpoly_Usage_export_bf03c676.webp",
    "/manus-storage/3_weedbarrier_vividpoly_Usage_export_cc1ca5bb.webp",
    "/manus-storage/9_weedbarrier_vividpoly_Usage_export_978b7efe.webp"
  ]);

  const specifications = JSON.stringify({
    "Material": "PP Woven (Polypropylene)",
    "GSM Range": "70–130 GSM (customizable)",
    "Width": "0.5m to 5.2m (custom to order)",
    "Colour": "Black, Green, White (custom available)",
    "UV Stabilization": "3–5 years depending on GSM",
    "Roll Length": "50m, 100m, or custom cut",
    "Packing": "Export-ready roll packing"
  });

  const features = JSON.stringify([
    "Suppresses weed growth without chemicals",
    "Allows water and air permeability for healthy soil",
    "UV stabilized for long outdoor life (3–5 years)",
    "Suitable for all climates and terrain types",
    "Reduces soil erosion and moisture loss",
    "Easy to install with minimal tools",
    "Environmentally friendly and recyclable"
  ]);

  const applications = JSON.stringify([
    "Orchards and vineyards",
    "Nurseries and greenhouses",
    "Landscaping and garden pathways",
    "Commercial agriculture and horticulture",
    "Tree plantations and fruit farms",
    "Construction site ground cover",
    "Solar farm ground management"
  ]);

  const shortDescription = "High-quality PP woven weed barrier fabric engineered for landscaping, agriculture, horticulture, and ground-cover applications. Manufactured with UV-stabilized polypropylene for long-lasting outdoor performance across all climates.";

  const fullDescription = `<h2>PP Woven Weed Barrier Fabric</h2>
<p>VIVIDPOLY manufactures premium-grade PP woven weed barrier fabric designed for professional landscaping, commercial agriculture, and horticultural applications worldwide. Our weed control fabric effectively suppresses unwanted vegetation while allowing water and nutrients to reach plant roots, promoting healthier growth without the need for chemical herbicides.</p>

<h3>Superior Weed Control Technology</h3>
<p>Our woven ground cover fabric features a tight, durable weave structure that blocks sunlight penetration to the soil surface, preventing weed germination and growth. The fabric maintains excellent water permeability and air circulation, ensuring optimal soil health beneath the barrier.</p>

<h3>Built for Global Conditions</h3>
<p>Each roll is manufactured with high-tenacity polypropylene tape yarn and UV stabilizers rated for 3 to 5 years of continuous outdoor exposure. Whether deployed in tropical nurseries, temperate orchards, or arid agricultural zones, VIVIDPOLY weed barrier fabric delivers consistent performance season after season.</p>

<h3>Custom Specifications for Export Buyers</h3>
<p>We supply weed barrier fabric in custom widths (0.5m to 5.2m), GSM weights (70–130 GSM), colours, and roll lengths to match your project requirements. All orders include export-grade packing suitable for container shipping to any destination worldwide.</p>

<h3>Applications</h3>
<ul>
<li>Orchards, vineyards, and fruit tree plantations</li>
<li>Commercial nurseries and greenhouse flooring</li>
<li>Landscaping pathways and garden beds</li>
<li>Solar farm and construction site ground management</li>
<li>Erosion control on slopes and embankments</li>
</ul>`;

  // Determine category - use PP Woven Fabric if exists, otherwise create a new one or use the closest
  let categoryId;
  if (fabricCat) {
    categoryId = fabricCat.id;
  } else {
    // Check if there's any category that fits
    const ppCat = cats.find(c => c.name.toLowerCase().includes('pp woven'));
    if (ppCat) {
      categoryId = ppCat.id;
    } else {
      // Use the last category + 1 or just use category 5
      categoryId = cats[cats.length - 1]?.id || 5;
    }
  }

  // Check if weed-barrier product already exists
  const [existing] = await conn.query('SELECT id FROM products WHERE slug = ?', ['weed-barrier']);
  if (existing.length > 0) {
    console.log('Weed barrier product already exists with id:', existing[0].id);
    // Update it
    await conn.query(`UPDATE products SET 
      name = ?, shortDescription = ?, fullDescription = ?, specifications = ?, 
      features = ?, applications = ?, images = ?, categoryId = ?, featured = 1, displayOrder = 99
      WHERE slug = ?`, [
      'Weed Barrier',
      shortDescription,
      fullDescription,
      specifications,
      features,
      applications,
      images,
      categoryId,
      'weed-barrier'
    ]);
    console.log('Updated existing weed barrier product');
  } else {
    // Insert new product
    await conn.query(`INSERT INTO products 
      (categoryId, name, slug, shortDescription, fullDescription, specifications, features, applications, images, inStock, featured, displayOrder)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 99)`, [
      categoryId,
      'Weed Barrier',
      'weed-barrier',
      shortDescription,
      fullDescription,
      specifications,
      features,
      applications,
      images
    ]);
    console.log('Inserted new weed barrier product');
  }

  // Verify
  const [verify] = await conn.query('SELECT id, name, slug, categoryId FROM products WHERE slug = ?', ['weed-barrier']);
  console.log('Verified product:', verify[0]);

  await conn.end();
}

main().catch(console.error);

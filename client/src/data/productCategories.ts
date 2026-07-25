// VividPoly Product Categories Data
// Comprehensive product information for all product types

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface SubCategory {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  introduction: string;
  features: string[];
  benefits: string[];
  manufacturingProcess: string;
  materialComposition: string;
  specifications: ProductSpecification[];
  speciality: string;
  applications: string[];
  images: string[];
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  introduction: string;
  features: string[];
  benefits: string[];
  manufacturingProcess: string;
  materialComposition: string;
  specifications: ProductSpecification[];
  speciality: string;
  productionCapacity: string;
  whyChooseUs: string;
  applications: string[];
  images: string[];
  subCategories?: SubCategory[];
}

// PP Woven Bags Subcategories
const ppWovenBagsSubCategories: SubCategory[] = [
  {
    id: "open-mouth-pp-bags",
    slug: "open-mouth-pp-bags",
    name: "Open Mouth PP Bags",
    shortName: "OMPB",
    tagline: "Classic design for easy filling and versatile applications",
    introduction: "Open Mouth PP Bags are the most versatile and widely used packaging solution for bulk commodities. These bags feature an open top that allows for easy filling and can be closed using various methods including stitching, heat sealing, or tying. VividPoly's open mouth bags are manufactured to the highest quality standards, ensuring reliable performance across diverse applications.",
    features: [
      "Wide opening for easy filling",
      "Multiple closure options available",
      "Available in various sizes and GSM",
      "Can be lined with PE for moisture protection",
      "Excellent printability for branding",
      "UV stabilized options available"
    ],
    benefits: [
      "Fast and efficient filling process",
      "Cost-effective packaging solution",
      "Suitable for manual and automated filling",
      "Excellent product protection",
      "Reusable and recyclable"
    ],
    manufacturingProcess: "Open mouth bags are cut from tubular woven fabric to precise dimensions. The bottom is stitched or heat-sealed to create a secure closure. For lined bags, PE liners are inserted before the bottom closure. The open top allows for various closure methods after filling.",
    materialComposition: "Made from premium PP woven fabric (50-100 GSM) with optional PE coating. Liners available in PE, paper, or aluminum foil. High-tenacity stitching threads ensure strong seams.",
    specifications: [
      { label: "Width Range", value: "35 - 80 cm" },
      { label: "Length Range", value: "50 - 120 cm" },
      { label: "Fabric Weight", value: "50 - 100 GSM" },
      { label: "Load Capacity", value: "10 - 50 kg" },
      { label: "Printing", value: "Up to 6 colors flexo" }
    ],
    speciality: "Our open mouth bags are engineered for maximum filling efficiency while maintaining structural integrity. Each bag undergoes rigorous quality testing.",
    applications: ["Rice and grains", "Flour and sugar", "Fertilizers", "Animal feed", "Seeds", "Chemicals"],
    images: ["/products/photos/open-mouth-1.webp", "/products/photos/open-mouth-2.webp", "/products/photos/open-mouth-3.webp", "/products/photos/open-mouth-4.webp", "/products/photos/open-mouth-5.webp", "/products/photos/openmouth-real.jpg"]
  },
  {
    id: "top-bottom-stitched",
    slug: "top-bottom-stitched",
    name: "Top and Bottom Stitched Bags",
    shortName: "TBS",
    tagline: "Double-secured packaging for maximum protection",
    introduction: "Top and Bottom Stitched PP Bags feature secure stitching on both ends, providing enhanced strength and product protection. These bags are ideal for applications requiring pre-sealed packaging that can be opened, filled, and resealed. VividPoly manufactures these bags with precision stitching for consistent quality.",
    features: [
      "Secure stitching on both ends",
      "Can be opened and resealed",
      "Enhanced structural strength",
      "Available with gussets",
      "Multiple size options",
      "Excellent for automated handling"
    ],
    benefits: [
      "Superior seam strength",
      "Professional appearance",
      "Easy to stack and store",
      "Reduced product spillage",
      "Suitable for heavy loads"
    ],
    manufacturingProcess: "Fabric is cut to size and both top and bottom are stitched using industrial sewing machines. The stitching pattern can be customized for easy opening. Gussets are added during the cutting and stitching process.",
    materialComposition: "Premium PP woven fabric with high-tenacity polyester or PP stitching threads. Optional PE coating and liners available.",
    specifications: [
      { label: "Width Range", value: "40 - 75 cm" },
      { label: "Length Range", value: "60 - 110 cm" },
      { label: "Fabric Weight", value: "55 - 90 GSM" },
      { label: "Stitch Type", value: "Chain stitch, Lock stitch" },
      { label: "Load Capacity", value: "15 - 50 kg" }
    ],
    speciality: "Double-stitched construction ensures maximum durability. Our bags exceed industry standards for drop test performance.",
    applications: ["Cement", "Chemicals", "Minerals", "Industrial products", "Construction materials"],
    images: ["/media/TopandBottomStitchedppbags_96d06c16.png", "/products/photos/block-tasmania.jpg", "/products/photos/openmouth-real.jpg"]
  },
  {
    id: "d-cut-pp-bags",
    slug: "d-cut-pp-bags",
    name: "D-Cut PP Woven Bags",
    shortName: "DCB",
    tagline: "Ergonomic design with integrated handles",
    introduction: "D-Cut PP Woven Bags feature die-cut handles that provide easy carrying without additional handle attachments. The D-shaped cut creates comfortable grip handles integrated into the bag design. These bags are popular for retail, shopping, and promotional applications.",
    features: [
      "Integrated D-cut handles",
      "No separate handle attachment needed",
      "Clean, professional appearance",
      "Available in various sizes",
      "Excellent for branding",
      "Lightweight yet strong"
    ],
    benefits: [
      "Easy to carry",
      "Cost-effective (no handle cost)",
      "Fast production",
      "Attractive retail presentation",
      "Reusable shopping bags"
    ],
    manufacturingProcess: "Bags are manufactured from flat woven fabric. The D-cut handles are created using precision die-cutting equipment. Edges are heat-sealed to prevent fraying. Bottom is stitched or heat-sealed for strength.",
    materialComposition: "PP woven fabric with optional lamination for enhanced durability and printability. Heat-sealed edges for clean finish.",
    specifications: [
      { label: "Width Range", value: "25 - 50 cm" },
      { label: "Length Range", value: "30 - 60 cm" },
      { label: "Handle Size", value: "Custom D-cut dimensions" },
      { label: "Fabric Weight", value: "60 - 100 GSM" },
      { label: "Printing", value: "Full color flexo/gravure" }
    ],
    speciality: "Our D-cut bags combine functionality with aesthetics, making them perfect for retail and promotional use.",
    applications: ["Retail shopping", "Promotional bags", "Trade shows", "Grocery bags", "Gift packaging"],
    images: ["/products/photos/dcut-red.png", "/products/photos/dcut-blk.png", "/products/photos/dcut-green.png", "/products/photos/dcut-white.png", "/products/photos/dcut-yellow.png"]
  },
  {
    id: "valve-bags",
    slug: "valve-bags",
    name: "Valve Bags",
    shortName: "VB",
    tagline: "Efficient filling for powdered products",
    introduction: "Valve Bags are specially designed for automated filling of powdered and granular products. The valve opening allows for fast, dust-free filling while automatically closing after the filling process. VividPoly's valve bags are engineered for high-speed filling lines and superior product protection.",
    features: [
      "Self-closing valve mechanism",
      "Dust-free filling process",
      "Compatible with automated filling lines",
      "Available in various valve types",
      "Excellent moisture barrier options",
      "High burst strength"
    ],
    benefits: [
      "Faster filling speeds",
      "Reduced product loss",
      "Cleaner work environment",
      "No additional closure needed",
      "Consistent fill weights"
    ],
    manufacturingProcess: "Valve bags are manufactured with a specially designed valve pocket that allows product entry but prevents escape. The valve is formed during bag construction and can be internal or external type. Bags undergo pressure testing to ensure valve integrity.",
    materialComposition: "PP woven fabric with PE coating for moisture protection. Valve construction uses multi-layer paper or PE film. Optional aluminum foil barrier for sensitive products.",
    specifications: [
      { label: "Width Range", value: "40 - 60 cm" },
      { label: "Length Range", value: "60 - 90 cm" },
      { label: "Valve Type", value: "Internal, External, Pasted" },
      { label: "Valve Size", value: "100 - 150 mm" },
      { label: "Load Capacity", value: "25 - 50 kg" }
    ],
    speciality: "Our valve bags are tested for filling speed compatibility and valve seal integrity, ensuring optimal performance on high-speed filling lines.",
    applications: ["Cement", "Chemicals", "Minerals", "Flour", "Plaster", "Dry mortar"],
    images: ["/media/ppvalvebag_570857af.png", "/products/photos/block-tasmania.jpg", "/products/photos/block-fertilizer.jpg"]
  },
  {
    id: "carry-bags",
    slug: "carry-bags",
    name: "PP Carry Bags",
    shortName: "CB",
    tagline: "Sustainable shopping bags with style",
    introduction: "PP Carry Bags are reusable shopping bags that offer an eco-friendly alternative to single-use plastic bags. VividPoly manufactures high-quality carry bags with various handle options, making them perfect for retail, supermarkets, and promotional use.",
    features: [
      "Multiple handle options (soft loop, rope, die-cut)",
      "Reusable and durable",
      "Excellent print surface",
      "Available in various sizes",
      "Laminated options for premium look",
      "Eco-friendly alternative"
    ],
    benefits: [
      "Sustainable packaging choice",
      "Strong brand visibility",
      "Long-lasting use",
      "Customer-friendly design",
      "Cost-effective marketing tool"
    ],
    manufacturingProcess: "Carry bags are manufactured from laminated or unlaminated PP woven fabric. Handles are attached using ultrasonic welding or stitching. Bags can be printed with high-quality graphics before or after construction.",
    materialComposition: "PP woven fabric with BOPP or PE lamination. Handles in PP rope, soft loop, or integrated die-cut. Water-based inks for eco-friendly printing.",
    specifications: [
      { label: "Width Range", value: "30 - 50 cm" },
      { label: "Height Range", value: "35 - 55 cm" },
      { label: "Gusset", value: "8 - 15 cm" },
      { label: "Handle Types", value: "Soft loop, Rope, Die-cut" },
      { label: "Printing", value: "Up to 8 colors" }
    ],
    speciality: "Our carry bags are designed for maximum reusability while providing excellent branding opportunities for retailers.",
    applications: ["Supermarkets", "Retail stores", "Trade shows", "Promotional events", "Corporate gifting"],
    images: ["/products/photos/carry-red.png", "/products/photos/carry-green.png", "/products/photos/carry-white.png", "/products/photos/carry-yellow.png", "/products/photos/carry-blk.png"]
  },
  {
    id: "pinch-bottom-bags",
    slug: "pinch-bottom-bags",
    name: "Pinch Bottom Bags",
    shortName: "PBB",
    tagline: "Modern packaging for automated filling lines",
    introduction: "Pinch Bottom Bags feature a unique bottom closure that is formed by pinching and sealing the fabric layers together. This design is ideal for automated filling and provides excellent stacking stability. VividPoly's pinch bottom bags are manufactured for high-speed packaging operations.",
    features: [
      "Pinch-sealed bottom construction",
      "Excellent stacking stability",
      "Compatible with form-fill-seal machines",
      "Clean, professional appearance",
      "Available with various top closures",
      "High fill accuracy"
    ],
    benefits: [
      "Faster filling operations",
      "Better shelf presentation",
      "Reduced packaging costs",
      "Consistent bag dimensions",
      "Easy to palletize"
    ],
    manufacturingProcess: "Pinch bottom bags are manufactured on specialized equipment that folds and seals the bottom in a pinch configuration. The process creates a flat, stable base. Top closure can be open mouth or pre-sealed.",
    materialComposition: "PP woven fabric with optional coating. Bottom seal uses heat or adhesive bonding. High-strength construction for heavy loads.",
    specifications: [
      { label: "Width Range", value: "35 - 65 cm" },
      { label: "Length Range", value: "55 - 100 cm" },
      { label: "Bottom Type", value: "Pinch sealed" },
      { label: "Fabric Weight", value: "60 - 95 GSM" },
      { label: "Load Capacity", value: "20 - 50 kg" }
    ],
    speciality: "Our pinch bottom bags are optimized for automated filling lines, ensuring consistent performance and minimal downtime.",
    applications: ["Pet food", "Animal feed", "Fertilizers", "Seeds", "Chemicals", "Food products"],
    images: ["/products/photos/pinch-red.png", "/products/photos/pinch-blk.png", "/products/photos/pinch-green.png", "/products/photos/pinch-white.png", "/products/photos/pinch-yellow.png", "/products/photos/pinch-stacked.jpg"]
  },
  {
    id: "block-bottom-bags",
    slug: "block-bottom-bags",
    name: "Block Bottom Bags",
    shortName: "BBB",
    tagline: "Maximum stability and premium presentation",
    introduction: "Block Bottom Bags feature a rectangular bottom that allows the bag to stand upright on its own. This design provides excellent shelf presence and maximum stability for retail and industrial applications. VividPoly manufactures premium block bottom bags for customers seeking superior presentation.",
    features: [
      "Self-standing rectangular bottom",
      "Premium retail appearance",
      "Maximum filling capacity",
      "Excellent stacking stability",
      "Available with various closures",
      "Superior print surface"
    ],
    benefits: [
      "Outstanding shelf presence",
      "Efficient space utilization",
      "Professional brand image",
      "Easy product display",
      "Reduced damage during handling"
    ],
    manufacturingProcess: "Block bottom bags require specialized folding and sealing equipment. The bottom is formed by folding the fabric into a rectangular shape and sealing the corners. This creates a stable, flat base that allows the bag to stand upright.",
    materialComposition: "PP woven fabric with lamination for premium finish. Bottom construction uses heat sealing or adhesive bonding. Multiple liner options available.",
    specifications: [
      { label: "Width Range", value: "30 - 55 cm" },
      { label: "Length Range", value: "50 - 90 cm" },
      { label: "Bottom Dimensions", value: "Custom rectangular" },
      { label: "Fabric Weight", value: "65 - 100 GSM" },
      { label: "Printing", value: "Full coverage possible" }
    ],
    speciality: "Our block bottom bags combine functionality with aesthetics, making them ideal for premium product packaging.",
    applications: ["Pet food", "Rice", "Flour", "Specialty foods", "Retail products", "Premium packaging"],
    images: ["/products/photos/block-c-blk.png", "/products/photos/block-c-green.png", "/products/photos/block-c-white.png", "/products/photos/block-bottom-black.webp", "/products/photos/block-bottom-green.webp", "/products/photos/block-fertilizer.jpg"]
  },
  {
    id: "bottom-gusset-bags",
    slug: "bottom-gusset-bags",
    name: "Bottom Gusset Bags",
    shortName: "BGB",
    tagline: "Enhanced capacity with expandable design",
    introduction: "Bottom Gusset Bags feature an expandable gusset at the bottom that increases the bag's capacity and allows it to stand more stably when filled. This design is popular for products that require extra volume or better presentation. VividPoly's bottom gusset bags offer the perfect balance of capacity and functionality.",
    features: [
      "Expandable bottom gusset",
      "Increased filling capacity",
      "Better standing stability",
      "Available in various gusset sizes",
      "Compatible with standard filling equipment",
      "Multiple closure options"
    ],
    benefits: [
      "More product per bag",
      "Improved shelf stability",
      "Efficient storage and transport",
      "Professional appearance",
      "Cost-effective packaging"
    ],
    manufacturingProcess: "Bottom gusset bags are manufactured by folding the fabric to create an expandable section at the bottom. The gusset is formed during the cutting and stitching process. Gusset size can be customized based on capacity requirements.",
    materialComposition: "PP woven fabric with optional coating. Gusset construction maintains fabric strength. Available with PE or paper liners.",
    specifications: [
      { label: "Width Range", value: "35 - 70 cm" },
      { label: "Length Range", value: "55 - 110 cm" },
      { label: "Gusset Depth", value: "5 - 15 cm" },
      { label: "Fabric Weight", value: "55 - 90 GSM" },
      { label: "Load Capacity", value: "15 - 50 kg" }
    ],
    speciality: "Our bottom gusset bags are designed for optimal capacity utilization while maintaining ease of handling and storage.",
    applications: ["Agricultural products", "Chemicals", "Minerals", "Food products", "Industrial goods"],
    images: ["/products/photos/gusset-red.png", "/products/photos/gusset-green.png", "/products/photos/gusset-blk.png", "/products/photos/gusset-wht.png", "/products/photos/gusset-yellow.png"]
  }
];

// BOPP Laminated Bags Subcategories (same structure as PP Woven Bags but with lamination)
const boppLaminatedSubCategories: SubCategory[] = [
  {
    id: "bopp-open-mouth",
    slug: "bopp-open-mouth",
    name: "BOPP Open Mouth Bags",
    shortName: "BOMPB",
    tagline: "Premium laminated bags with stunning visual appeal",
    introduction: "BOPP Open Mouth Bags combine the strength of PP woven fabric with the visual appeal of BOPP lamination. The high-gloss or matte finish provides excellent printability for premium branding. These bags are ideal for products requiring attractive retail presentation.",
    features: [
      "High-quality BOPP lamination",
      "Photographic print quality",
      "Excellent moisture barrier",
      "Gloss or matte finish options",
      "Wide opening for easy filling",
      "Superior shelf appeal"
    ],
    benefits: [
      "Premium brand presentation",
      "Enhanced product protection",
      "Excellent print reproduction",
      "Moisture and dust resistant",
      "Attractive retail display"
    ],
    manufacturingProcess: "BOPP laminated bags start with PP woven fabric that is laminated with BOPP film using advanced lamination technology. The laminated fabric is then printed using rotogravure for photographic quality. Bags are cut and stitched to precise specifications.",
    materialComposition: "PP woven fabric base with BOPP film lamination. Rotogravure printing with food-safe inks. Optional PE liner for additional protection.",
    specifications: [
      { label: "Width Range", value: "35 - 75 cm" },
      { label: "Length Range", value: "50 - 110 cm" },
      { label: "Lamination", value: "BOPP 18-25 micron" },
      { label: "Print Quality", value: "Up to 10 colors rotogravure" },
      { label: "Finish", value: "Gloss, Matte, Soft touch" }
    ],
    speciality: "Our BOPP laminated bags offer unmatched print quality and visual appeal, making them perfect for premium product packaging.",
    applications: ["Rice", "Flour", "Pet food", "Fertilizers", "Seeds", "Premium products"],
    images: ["/products/photos/open-mouth-1.webp", "/products/photos/open-mouth-2.webp", "/products/photos/openmouth-real.jpg"]
  },
  {
    id: "bopp-top-bottom-stitched",
    slug: "bopp-top-bottom-stitched",
    name: "BOPP Top and Bottom Stitched",
    shortName: "BTBS",
    tagline: "Laminated strength with double-secured closure",
    introduction: "BOPP Top and Bottom Stitched Bags offer the premium appearance of BOPP lamination with the security of double-stitched construction. These bags are ideal for products requiring both visual appeal and robust packaging.",
    features: [
      "BOPP laminated exterior",
      "Secure stitching on both ends",
      "Premium print quality",
      "Enhanced moisture protection",
      "Professional appearance",
      "Available with gussets"
    ],
    benefits: [
      "Superior brand visibility",
      "Maximum seam strength",
      "Excellent product protection",
      "Easy to stack and store",
      "Premium retail presentation"
    ],
    manufacturingProcess: "Laminated fabric is cut to size and both ends are stitched using industrial equipment. The BOPP lamination is applied before cutting to ensure consistent quality across the entire bag surface.",
    materialComposition: "PP woven fabric with BOPP lamination. High-tenacity stitching threads. Optional PE liner for moisture-sensitive products.",
    specifications: [
      { label: "Width Range", value: "40 - 70 cm" },
      { label: "Length Range", value: "60 - 100 cm" },
      { label: "Lamination", value: "BOPP 20-25 micron" },
      { label: "Stitch Type", value: "Chain stitch, Lock stitch" },
      { label: "Load Capacity", value: "15 - 50 kg" }
    ],
    speciality: "Combining premium aesthetics with industrial strength, our BOPP stitched bags are perfect for demanding applications.",
    applications: ["Cement", "Chemicals", "Premium agricultural products", "Industrial goods"],
    images: ["/products/photos/bopp-black.png", "/products/photos/block-tasmania.jpg", "/media/TopandBottomStitchedppbags_96d06c16.png"]
  },
  {
    id: "bopp-d-cut",
    slug: "bopp-d-cut",
    name: "BOPP D-Cut Bags",
    shortName: "BDCB",
    tagline: "Premium shopping bags with integrated handles",
    introduction: "BOPP D-Cut Bags combine the convenience of die-cut handles with the premium appearance of BOPP lamination. These bags are perfect for retail and promotional applications where brand image is paramount.",
    features: [
      "Integrated D-cut handles",
      "High-gloss BOPP finish",
      "Photographic print quality",
      "Lightweight yet durable",
      "Excellent for branding",
      "Reusable design"
    ],
    benefits: [
      "Premium brand presentation",
      "Easy to carry",
      "Cost-effective production",
      "Attractive retail appeal",
      "Eco-friendly reusable option"
    ],
    manufacturingProcess: "BOPP laminated fabric is printed and then die-cut to create integrated handles. Edges are heat-sealed for a clean finish. Bottom closure is stitched or heat-sealed.",
    materialComposition: "PP woven fabric with BOPP lamination. Heat-sealed edges. Food-safe printing inks.",
    specifications: [
      { label: "Width Range", value: "25 - 45 cm" },
      { label: "Length Range", value: "30 - 55 cm" },
      { label: "Handle Size", value: "Custom D-cut" },
      { label: "Lamination", value: "BOPP 18-22 micron" },
      { label: "Printing", value: "Full color rotogravure" }
    ],
    speciality: "Our BOPP D-cut bags offer the perfect combination of functionality and premium aesthetics for retail applications.",
    applications: ["Retail shopping", "Promotional bags", "Trade shows", "Corporate events", "Gift packaging"],
    images: ["/products/photos/dcut-red.png", "/products/photos/dcut-green.png", "/products/photos/dcut-yellow.png"]
  },
  {
    id: "bopp-valve-bags",
    slug: "bopp-valve-bags",
    name: "BOPP Valve Bags",
    shortName: "BVB",
    tagline: "Premium valve bags for automated filling",
    introduction: "BOPP Valve Bags combine the efficiency of valve filling with the premium appearance of BOPP lamination. These bags are ideal for products requiring both automated filling capability and attractive retail presentation.",
    features: [
      "Self-closing valve mechanism",
      "BOPP laminated exterior",
      "Dust-free filling",
      "Premium print quality",
      "Excellent moisture barrier",
      "High-speed filling compatible"
    ],
    benefits: [
      "Efficient automated filling",
      "Premium brand visibility",
      "Superior product protection",
      "Clean filling process",
      "Attractive shelf presence"
    ],
    manufacturingProcess: "BOPP laminated fabric is used to construct valve bags with specialized valve pockets. The lamination provides moisture protection while the valve ensures efficient filling.",
    materialComposition: "PP woven fabric with BOPP lamination. Valve construction in multi-layer paper or PE. Optional aluminum barrier layer.",
    specifications: [
      { label: "Width Range", value: "40 - 55 cm" },
      { label: "Length Range", value: "60 - 85 cm" },
      { label: "Valve Type", value: "Internal, External" },
      { label: "Lamination", value: "BOPP 20-25 micron" },
      { label: "Load Capacity", value: "25 - 50 kg" }
    ],
    speciality: "Our BOPP valve bags deliver premium aesthetics without compromising filling efficiency.",
    applications: ["Premium cement", "Specialty chemicals", "Food ingredients", "Minerals"],
    images: ["/products/photos/bopp-black.png", "/products/photos/block-tasmania.jpg", "/products/photos/block-fertilizer.jpg"]
  },
  {
    id: "bopp-carry-bags",
    slug: "bopp-carry-bags",
    name: "BOPP Carry Bags",
    shortName: "BCB",
    tagline: "Premium reusable shopping bags",
    introduction: "BOPP Carry Bags are premium shopping bags that combine durability with stunning visual appeal. The BOPP lamination provides a high-quality finish that enhances brand visibility and creates a lasting impression.",
    features: [
      "Premium BOPP finish",
      "Multiple handle options",
      "Photographic print quality",
      "Highly durable",
      "Water-resistant surface",
      "Reusable design"
    ],
    benefits: [
      "Outstanding brand visibility",
      "Long-lasting use",
      "Premium customer experience",
      "Eco-friendly alternative",
      "Effective marketing tool"
    ],
    manufacturingProcess: "BOPP laminated fabric is printed with high-quality graphics and then converted into carry bags. Handles are attached using ultrasonic welding or stitching for maximum strength.",
    materialComposition: "PP woven fabric with BOPP lamination. Handles in PP rope, soft loop, or webbing. Water-based or UV inks for printing.",
    specifications: [
      { label: "Width Range", value: "30 - 50 cm" },
      { label: "Height Range", value: "35 - 55 cm" },
      { label: "Gusset", value: "10 - 15 cm" },
      { label: "Handle Types", value: "Soft loop, Rope, Webbing" },
      { label: "Printing", value: "Up to 10 colors" }
    ],
    speciality: "Our BOPP carry bags are designed to make a lasting impression while providing practical functionality.",
    applications: ["Premium retail", "Fashion stores", "Corporate events", "Trade shows", "Luxury brands"],
    images: ["/products/photos/bopp-green.png", "/products/photos/bopp-white.png", "/products/photos/carry-red.png"]
  },
  {
    id: "bopp-pinch-bottom",
    slug: "bopp-pinch-bottom",
    name: "BOPP Pinch Bottom Bags",
    shortName: "BPBB",
    tagline: "Premium automated filling with style",
    introduction: "BOPP Pinch Bottom Bags offer the efficiency of pinch bottom construction with the premium appearance of BOPP lamination. These bags are perfect for automated filling lines where brand presentation matters.",
    features: [
      "Pinch-sealed bottom",
      "BOPP laminated surface",
      "Excellent stacking stability",
      "Premium print quality",
      "Form-fill-seal compatible",
      "Professional appearance"
    ],
    benefits: [
      "Efficient filling operations",
      "Premium brand visibility",
      "Better shelf presentation",
      "Consistent bag dimensions",
      "Easy palletization"
    ],
    manufacturingProcess: "BOPP laminated fabric is processed on specialized pinch bottom bag making equipment. The lamination is applied before bag formation to ensure consistent quality.",
    materialComposition: "PP woven fabric with BOPP lamination. Pinch seal using heat or adhesive bonding. High-strength construction.",
    specifications: [
      { label: "Width Range", value: "35 - 60 cm" },
      { label: "Length Range", value: "55 - 95 cm" },
      { label: "Bottom Type", value: "Pinch sealed" },
      { label: "Lamination", value: "BOPP 20-25 micron" },
      { label: "Load Capacity", value: "20 - 50 kg" }
    ],
    speciality: "Our BOPP pinch bottom bags combine automated filling efficiency with premium brand presentation.",
    applications: ["Premium pet food", "Specialty foods", "Agricultural products", "Industrial products"],
    images: ["/products/photos/bopp-front.webp", "/products/photos/pinch-blk.png", "/products/photos/pinch-yellow.png"]
  },
  {
    id: "bopp-block-bottom",
    slug: "bopp-block-bottom",
    name: "BOPP Block Bottom Bags",
    shortName: "BBBB",
    tagline: "Premium self-standing packaging",
    introduction: "BOPP Block Bottom Bags combine the self-standing capability of block bottom design with the premium finish of BOPP lamination. These bags offer maximum shelf presence and are ideal for premium retail products.",
    features: [
      "Self-standing rectangular bottom",
      "Premium BOPP finish",
      "Maximum filling capacity",
      "Photographic print quality",
      "Excellent shelf presence",
      "Multiple closure options"
    ],
    benefits: [
      "Outstanding retail presentation",
      "Efficient space utilization",
      "Premium brand image",
      "Easy product display",
      "Superior product protection"
    ],
    manufacturingProcess: "BOPP laminated fabric is converted into block bottom bags using specialized folding and sealing equipment. The rectangular bottom is formed with precision for consistent standing stability.",
    materialComposition: "PP woven fabric with BOPP lamination. Block bottom formed with heat sealing. Optional PE liner for moisture protection.",
    specifications: [
      { label: "Width Range", value: "30 - 50 cm" },
      { label: "Length Range", value: "50 - 85 cm" },
      { label: "Bottom Dimensions", value: "Custom rectangular" },
      { label: "Lamination", value: "BOPP 22-28 micron" },
      { label: "Printing", value: "Full coverage rotogravure" }
    ],
    speciality: "Our BOPP block bottom bags deliver the ultimate combination of functionality and premium aesthetics.",
    applications: ["Premium rice", "Specialty foods", "Pet food", "Retail products", "Luxury packaging"],
    images: ["/products/photos/block-c-blk.png", "/products/photos/block-c-green.png", "/products/photos/bopp-black.png"]
  },
  {
    id: "bopp-bottom-gusset",
    slug: "bopp-bottom-gusset",
    name: "BOPP Bottom Gusset Bags",
    shortName: "BBGB",
    tagline: "Premium expandable capacity bags",
    introduction: "BOPP Bottom Gusset Bags feature an expandable gusset at the bottom combined with premium BOPP lamination. This design provides increased capacity with attractive retail presentation.",
    features: [
      "Expandable bottom gusset",
      "BOPP laminated surface",
      "Increased filling capacity",
      "Premium print quality",
      "Better standing stability",
      "Multiple gusset sizes"
    ],
    benefits: [
      "More product per bag",
      "Premium brand visibility",
      "Improved shelf stability",
      "Efficient storage",
      "Attractive presentation"
    ],
    manufacturingProcess: "BOPP laminated fabric is cut and folded to create the bottom gusset. The gusset size is customized based on capacity requirements. Bags are finished with stitching or heat sealing.",
    materialComposition: "PP woven fabric with BOPP lamination. Gusset maintains fabric strength. Optional PE liner available.",
    specifications: [
      { label: "Width Range", value: "35 - 65 cm" },
      { label: "Length Range", value: "55 - 100 cm" },
      { label: "Gusset Depth", value: "5 - 15 cm" },
      { label: "Lamination", value: "BOPP 20-25 micron" },
      { label: "Load Capacity", value: "15 - 50 kg" }
    ],
    speciality: "Our BOPP bottom gusset bags maximize capacity while maintaining premium visual appeal.",
    applications: ["Premium agricultural products", "Food products", "Industrial goods", "Retail products"],
    images: ["/products/photos/gusset-red.png", "/products/photos/gusset-green.png", "/products/photos/gusset-yellow.png"]
  }
];

export const productCategories: ProductCategory[] = [

  {
    id: "pp-woven-fabric",
    slug: "pp-woven-fabric",
    name: "PP Woven Fabrics (Coated/Uncoated)",
    shortName: "WF",
    tagline: "The versatile foundation for premium packaging",
    introduction: "PP Woven Fabric is the essential material that forms the basis of all woven packaging solutions. VividPoly produces both coated and uncoated woven fabrics in various GSM weights and widths to meet diverse packaging requirements.",
    features: [
      "Available in both tubular and flat fabric formats",
      "Wide range of GSM options (40-120 GSM)",
      "Coated and uncoated variants",
      "Multiple width options up to 4 meters",
      "UV stabilized for outdoor applications",
      "Food-grade options available",
      "Excellent printability surface",
      "Consistent mesh count and weave pattern"
    ],
    benefits: [
      "Superior tear and puncture resistance",
      "Excellent moisture barrier (coated variants)",
      "Cost-effective bulk packaging solution",
      "Lightweight yet incredibly strong",
      "Recyclable and environmentally responsible"
    ],
    manufacturingProcess: "Our woven fabric production utilizes high-speed circular looms and sulzer looms that weave PP tapes into robust fabric. For coated fabrics, we apply a uniform layer of polypropylene coating using advanced lamination technology.",
    materialComposition: "The fabric is woven from our in-house produced PP tapes, ensuring complete quality control from raw material to finished product.",
    specifications: [
      { label: "Fabric Weight", value: "40 - 120 GSM" },
      { label: "Width Range", value: "35 cm - 400 cm" },
      { label: "Coating Weight", value: "10 - 40 GSM (for coated)" },
      { label: "Mesh Count", value: "10x10 to 14x14" },
      { label: "Tensile Strength (Warp)", value: "40 - 80 kN/m" },
      { label: "Color Options", value: "White, Natural, Custom" }
    ],
    speciality: "VividPoly's woven fabrics are manufactured with precision-controlled parameters ensuring batch-to-batch consistency.",
    productionCapacity: "Our weaving facility operates multiple high-speed looms with a combined capacity of producing over 5,000 MT of woven fabric monthly.",
    whyChooseUs: "With decades of experience in fabric production, VividPoly delivers consistent quality that packaging converters trust.",
    applications: ["Packaging bags for agriculture", "Industrial packaging", "Flood control barriers", "Ground cover and landscaping", "Construction applications", "Furniture and mattress backing"],
    images: ["/products/photos/fabric-roll-red.png", "/products/photos/fabric-roll-black.png", "/products/photos/fabric-roll-green.png", "/products/photos/fabric-roll-white.png", "/products/photos/fabric-roll-yellow.png", "/products/photos/fabric-factory-green.jpg"]
  },
  {
    id: "pp-woven-bags",
    slug: "pp-woven-bags",
    name: "PP Woven Bags",
    shortName: "WPP",
    tagline: "Reliable packaging for bulk commodities",
    introduction: "PP Woven Bags are the workhorses of the packaging industry, trusted globally for packaging agricultural products, chemicals, minerals, and industrial goods. VividPoly manufactures a comprehensive range of PP woven bags designed to protect contents during storage and transportation.",
    features: [
      "High load-bearing capacity (10-50 kg)",
      "Excellent tear and puncture resistance",
      "Breathable construction for agricultural products",
      "Multiple closure options (stitched, heat-sealed)",
      "Available with or without liner",
      "UV stabilized for outdoor storage",
      "Custom sizes and specifications",
      "Food-grade options certified"
    ],
    benefits: [
      "Superior product protection during transit",
      "Stackable design for efficient warehousing",
      "Reusable and recyclable",
      "Cost-effective packaging solution",
      "Customizable for brand visibility"
    ],
    manufacturingProcess: "Our PP woven bags are manufactured through a streamlined process starting with fabric cutting to precise dimensions. The cut pieces are then stitched or heat-sealed using industrial sewing machines.",
    materialComposition: "The bags are made from our premium PP woven fabric, with optional PE or PP coating for moisture resistance.",
    specifications: [
      { label: "Bag Width", value: "35 - 80 cm" },
      { label: "Bag Length", value: "50 - 120 cm" },
      { label: "Fabric Weight", value: "50 - 100 GSM" },
      { label: "Load Capacity", value: "10 - 50 kg" },
      { label: "Closure Types", value: "Stitched, Heat-sealed, Open mouth" },
      { label: "Printing", value: "Up to 6 colors flexo" }
    ],
    speciality: "VividPoly's PP woven bags are engineered for performance. Our bags consistently exceed industry standards for drop test and burst strength.",
    productionCapacity: "Our automated production lines deliver consistent quality and reliable supply for global export orders of any volume.",
    whyChooseUs: "Quality, consistency, and competitive pricing make VividPoly the preferred choice for bulk packaging needs.",
    applications: ["Rice and grain packaging", "Flour and sugar bags", "Fertilizer and seed packaging", "Chemical and mineral packaging", "Animal feed bags", "Construction materials"],
    images: ["/products/photos/open-mouth-1.webp", "/products/photos/openmouth-real.jpg", "/products/photos/pinch-white.png", "/products/photos/block-c-green.png"],
    subCategories: ppWovenBagsSubCategories
  },
  {
    id: "bopp-laminated-bags",
    slug: "bopp-laminated-bags",
    name: "BOPP Laminated PP Woven Bags",
    shortName: "PLWPP",
    tagline: "Premium packaging with stunning visual appeal",
    introduction: "BOPP Laminated Bags represent the premium segment of woven packaging, combining the strength of PP woven fabric with the visual appeal of BOPP (Biaxially Oriented Polypropylene) film lamination. These bags offer exceptional print quality and moisture protection.",
    features: [
      "High-gloss or matte BOPP lamination",
      "Photographic quality printing possible",
      "Excellent moisture and dust barrier",
      "Superior shelf appeal",
      "Available in various sizes and styles",
      "Multiple closure options",
      "Food-grade certified options",
      "UV resistant for extended shelf life"
    ],
    benefits: [
      "Premium brand presentation",
      "Enhanced product protection",
      "Excellent print reproduction",
      "Moisture and dust resistant",
      "Attractive retail display"
    ],
    manufacturingProcess: "BOPP lamination is applied to PP woven fabric using advanced extrusion lamination technology. The laminated fabric is then printed using rotogravure for photographic quality.",
    materialComposition: "PP woven fabric base with BOPP film lamination. Rotogravure printing with food-safe inks.",
    specifications: [
      { label: "Bag Width", value: "30 - 80 cm" },
      { label: "Bag Length", value: "45 - 120 cm" },
      { label: "Lamination Thickness", value: "18 - 25 micron BOPP" },
      { label: "Print Colors", value: "Up to 10 colors rotogravure" },
      { label: "Finish Options", value: "Gloss, Matte, Soft touch" },
      { label: "Load Capacity", value: "5 - 50 kg" }
    ],
    speciality: "Our BOPP laminated bags offer unmatched print quality and visual appeal, making them perfect for premium product packaging.",
    productionCapacity: "Our lamination and printing facility can produce over 100,000 premium bags daily.",
    whyChooseUs: "For products that demand premium presentation, VividPoly's BOPP laminated bags deliver exceptional quality.",
    applications: ["Premium rice packaging", "Pet food bags", "Fertilizer bags", "Seed packaging", "Food products", "Retail products"],
    images: ["/products/photos/bopp-printed-1.jpg", "/products/photos/bopp-red.png", "/products/photos/bopp-front.webp", "/products/photos/bopp-rice-green.jpg", "/products/photos/bopp-yellow2.png", "/products/photos/bopp-white.png"],
    subCategories: boppLaminatedSubCategories
  },
  {
    id: "weed-barrier",
    slug: "weed-barrier",
    name: "Weed Barrier Fabric",
    shortName: "WB",
    tagline: "Effective ground cover for agriculture and landscaping",
    introduction: "VIVIDPOLY manufactures premium-grade PP woven weed barrier fabric designed for professional landscaping, commercial agriculture, and horticultural applications worldwide. Our weed control fabric effectively suppresses unwanted vegetation while allowing water and nutrients to reach plant roots, promoting healthier growth without the need for chemical herbicides.",
    features: [
      "Suppresses weed growth without chemicals",
      "Allows water and air permeability for healthy soil",
      "UV stabilized for long outdoor life (3–5 years)",
      "Suitable for all climates and terrain types",
      "Reduces soil erosion and moisture loss",
      "Easy to install with minimal tools",
      "Environmentally friendly and recyclable",
      "Custom widths up to 5.2 meters"
    ],
    benefits: [
      "Eliminates need for chemical weed killers",
      "Reduces labour costs for weed management",
      "Promotes healthier plant growth",
      "Long-lasting UV-stabilized performance",
      "Eco-friendly and fully recyclable"
    ],
    manufacturingProcess: "Our weed barrier fabric is produced using high-tenacity polypropylene tape yarn woven on precision looms. UV stabilizers are added during extrusion to ensure 3–5 years of continuous outdoor exposure resistance. Each roll undergoes strict quality inspection before export packing.",
    materialComposition: "100% virgin polypropylene woven fabric with integrated UV stabilizers and optional colour additives. Available in black, green, and white variants.",
    specifications: [
      { label: "Material", value: "PP Woven (Polypropylene)" },
      { label: "GSM Range", value: "70 – 130 GSM (customizable)" },
      { label: "Width", value: "0.5m to 5.2m (custom to order)" },
      { label: "Colour", value: "Black, Green, White (custom available)" },
      { label: "UV Stabilization", value: "3–5 years depending on GSM" },
      { label: "Roll Length", value: "50m, 100m, or custom cut" },
      { label: "Packing", value: "Export-ready roll packing" }
    ],
    speciality: "VIVIDPOLY's weed barrier fabric combines tight weave density with excellent permeability, delivering superior weed suppression while maintaining optimal soil health for crops and landscaping.",
    productionCapacity: "Our weaving facility produces weed barrier fabric in bulk quantities with consistent quality, supporting large-scale agricultural and landscaping projects globally.",
    whyChooseUs: "With custom sizing, competitive FOB pricing, and export-ready packing, VIVIDPOLY is the trusted source for weed barrier fabric across 23 export markets.",
    applications: ["Orchards and vineyards", "Nurseries and greenhouses", "Landscaping and garden pathways", "Commercial agriculture and horticulture", "Tree plantations and fruit farms", "Construction site ground cover", "Solar farm ground management"],
    images: ["/products/photos/weed-barrier-1.jpg", "/products/photos/weed-barrier-2.jpg", "/products/photos/weed-barrier-3.webp", "/products/photos/weed-barrier-4.jpg", "/products/photos/weed-barrier-5.jpg", "/products/photos/weed-barrier-6.webp"]
  },

];

// Helper function to get all subcategories
export const getAllSubCategories = (): SubCategory[] => {
  const allSubs: SubCategory[] = [];
  productCategories.forEach(cat => {
    if (cat.subCategories) {
      allSubs.push(...cat.subCategories);
    }
  });
  return allSubs;
};

// Helper function to find a category or subcategory by slug
export const findProductBySlug = (slug: string): ProductCategory | SubCategory | undefined => {
  // First check main categories
  const mainCategory = productCategories.find(cat => cat.slug === slug);
  if (mainCategory) return mainCategory;
  
  // Then check subcategories
  for (const cat of productCategories) {
    if (cat.subCategories) {
      const subCat = cat.subCategories.find(sub => sub.slug === slug);
      if (subCat) return subCat;
    }
  }
  
  return undefined;
};

// Helper function to get parent category of a subcategory
export const getParentCategory = (subSlug: string): ProductCategory | undefined => {
  for (const cat of productCategories) {
    if (cat.subCategories) {
      const found = cat.subCategories.find(sub => sub.slug === subSlug);
      if (found) return cat;
    }
  }
  return undefined;
};

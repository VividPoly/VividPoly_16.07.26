// GENERATED FILE — do not edit by hand.
// Source: SEO Google Sheet (meta / canonical / schema tabs).
// Regenerate with: node scripts/build-seo-data.mjs
// Generated 2026-07-26 from 47 pages.

export interface PageSEO {
  /** Route path, e.g. "/products/valve-bags". */
  path: string;
  /** Human label from the sheet, e.g. "Valve Bags". */
  name: string;
  title: string;
  description: string;
  /** The H1 the SEO sheet expects this page to render. */
  h1: string;
  canonical: string;
  /** JSON-LD blocks injected into <head> while this route is mounted. */
  schema: Record<string, unknown>[];
}

/** Canonical origin. The live site 308-redirects www -> apex, so no "www." here. */
export const SITE_ORIGIN = 'https://vividpoly.com';

export const pageSEO: Record<string, PageSEO> = {
  "/": {
    "path": "/",
    "name": "Home",
    "title": "PP Bags & Woven Bags Exporter from India | VIVIDPOLY",
    "description": "VIVIDPOLY exports PP woven bags, valve, laminated and custom packaging from India to global buyers. Request samples and bulk export quotes today.",
    "h1": "PP Bags Exporter from India for Global Buyers",
    "canonical": "https://vividpoly.com/",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://vividpoly.com/#organization",
        "name": "VIVIDPOLY",
        "url": "https://vividpoly.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://vividpoly.com/vividpoly-logo.png"
        },
        "image": "https://vividpoly.com/vividpoly-logo.png",
        "description": "VIVIDPOLY is an Indian manufacturer and exporter of PP woven bags, printed laminated woven bags, valve bags, open mouth bags, block bottom bags, block bottom gusset bags, pinch bottom bags, D-cut bags, shopping bags, PP woven fabric, weed barrier fabric, and custom export packaging solutions for buyers worldwide.",
        "email": "info@vividpoly.com",
        "telephone": "+91-92136-26740",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "IN"
        },
        "foundingLocation": {
          "@type": "Country",
          "name": "India"
        },
        "areaServed": "Worldwide",
        "knowsAbout": [
          "PP Woven Bags",
          "Printed Woven Bags",
          "Printed Laminated Woven Bags",
          "Open Mouth Bags",
          "Valve Bags",
          "Top and Bottom Stitched Bags",
          "Block Bottom Bags",
          "Block Bottom Gusset Bags",
          "Pinch Bottom Bags",
          "D-Cut PP Bags",
          "Carry Bags",
          "Shopping Bags",
          "PP Woven Fabric",
          "Weed Barrier Fabric",
          "Industrial Packaging",
          "Agricultural Packaging",
          "Custom Packaging",
          "Export Packaging"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": "https://vividpoly.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What types of PP bags does VIVIDPOLY export?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "VIVIDPOLY exports open mouth bags, top and bottom stitched bags, D-cut PP woven bags, valve bags, carry bags, printed and laminated woven PP bags, printed and laminated woven PP pinch bottom bags, printed and laminated woven PP block bottom bags, printed and laminated woven PP block bottom gusset bags, and woven shopping bags."
            }
          },
          {
            "@type": "Question",
            "name": "What weight capacity is available for VIVIDPOLY PP bags?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "VIVIDPOLY can discuss PP bag requirements from 5 kg to 75 kg, depending on product density, bag size, fabric strength, construction, lamination, liner, gusset, stitching, and end use application."
            }
          },
          {
            "@type": "Question",
            "name": "What information is needed for a quotation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Buyers should provide product type, packed product, capacity, bag size, quantity, printing requirement, lamination, liner, gusset, handle, cutting, stitching, packing type, destination country, and artwork or sample reference if available."
            }
          },
          {
            "@type": "Question",
            "name": "Can VIVIDPOLY supply printed and laminated woven PP bags?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. VIVIDPOLY can support printed and laminated woven PP bag requirements for products such as rice, flour, fertilizer, animal feed, pet food, seeds, salt, sugar, and retail commodities."
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between open mouth bags and valve bags?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Open mouth bags are filled through an open top and closed after filling. Valve bags are filled through a valve opening and are commonly used for powders, cement style products, chemicals, minerals, and construction materials."
            }
          },
          {
            "@type": "Question",
            "name": "What are pinch bottom bags used for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pinch bottom bags are used where buyers need premium packaging appearance and clean closure presentation. They are suitable for selected food, pet food, animal feed, grains, seeds, and retail products."
            }
          },
          {
            "@type": "Question",
            "name": "What are block bottom gusset bags used for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Block bottom gusset bags are suitable where buyers need improved volume, stable filled shape, stronger branding area, and better stacking presentation."
            }
          },
          {
            "@type": "Question",
            "name": "Can PP bags include windows?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Selected printed and laminated woven PP bags can include a transparent window to show the packed product inside."
            }
          },
          {
            "@type": "Question",
            "name": "Can VIVIDPOLY provide liners inside PP bags?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Liners can be considered where additional product protection, moisture support, or fine product retention is required."
            }
          },
          {
            "@type": "Question",
            "name": "What printing options are available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "VIVIDPOLY can support plain bags, flexo printed bags, and printed and laminated woven PP bag formats, depending on branding needs, artwork complexity, budget, and product market."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          }
        ]
      }
    ]
  },
  "/about": {
    "path": "/about",
    "name": "About Us",
    "title": "About VIVIDPOLY | PP Bag Exporter in India",
    "description": "Learn how VIVIDPOLY supports global buyers with export-grade PP bags, custom construction, printing and responsive sourcing support from India.",
    "h1": "About VIVIDPOLY, Your Global PP Bag Export Partner",
    "canonical": "https://vividpoly.com/about",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/about/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About Us",
            "item": "https://vividpoly.com/about"
          }
        ]
      }
    ]
  },
  "/contact": {
    "path": "/contact",
    "name": "Contact",
    "title": "Contact VIVIDPOLY | PP Bags Exporter in India",
    "description": "Contact VIVIDPOLY for PP bag export enquiries. Share your bag type, size, printing, quantity and destination for a fast, practical quotation.",
    "h1": "Contact VIVIDPOLY for PP Bag Export Enquiries",
    "canonical": "https://vividpoly.com/contact",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/contact/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Contact Us",
            "item": "https://vividpoly.com/contact"
          }
        ]
      }
    ]
  },
  "/inquiries": {
    "path": "/inquiries",
    "name": "Inquiries",
    "title": "Request a Quote | PP Bag Export Enquiries | VIVIDPOLY",
    "description": "Send your PP bag enquiry to VIVIDPOLY. Share bag type, size, printing, lamination, quantity and destination for a fast export quotation from India.",
    "h1": "Send Your PP Bag Enquiry to VIVIDPOLY",
    "canonical": "https://vividpoly.com/inquiries",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/inquiries#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Inquiries",
            "item": "https://vividpoly.com/inquiries"
          }
        ]
      }
    ]
  },
  "/products": {
    "path": "/products",
    "name": "Products",
    "title": "PP Woven Bags & Packaging Range | VIVIDPOLY India",
    "description": "Explore the full range of PP woven bags from VIVIDPOLY: open mouth, valve, D-cut, carry, laminated, block bottom and more, exported worldwide from India.",
    "h1": "PP Woven Bags and Packaging Product Range",
    "canonical": "https://vividpoly.com/products",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          }
        ]
      }
    ]
  },
  "/products/open-mouth-pp-bags": {
    "path": "/products/open-mouth-pp-bags",
    "name": "Open Mouth PP Bags",
    "title": "Open Mouth PP Bags Exporter India | VIVIDPOLY",
    "description": "Export-grade open mouth PP woven bags for grains, flour, feed, fertilizer, salt, sugar and minerals. Custom sizes 5 to 75 kg supplied from India.",
    "h1": "Open Mouth PP Woven Bags for Bulk Packaging",
    "canonical": "https://vividpoly.com/products/open-mouth-pp-bags",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/open-mouth-pp-bags#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Open Mouth PP Bags",
            "item": "https://vividpoly.com/products/open-mouth-pp-bags"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/open-mouth-pp-bags#product",
        "name": "Open Mouth PP Bags",
        "description": "VIVIDPOLY exports Open Mouth PP Woven Bags for agricultural, food, fertilizer, animal feed, chemical, mineral, salt, sugar, and industrial applications. Available in capacities from 5 kg to 75 kg with custom printing, lamination, gusset, liner, and export packing options.",
        "url": "https://vividpoly.com/products/open-mouth-pp-bags",
        "image": "https://vividpoly.com/products/photos/open-mouth-1.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "PP Woven Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Capacity",
            "value": "5 kg to 75 kg"
          },
          {
            "@type": "PropertyValue",
            "name": "Top Finish",
            "value": "Open mouth, heat cut, cold cut, zig-zag, hemmed"
          },
          {
            "@type": "PropertyValue",
            "name": "Bottom Finish",
            "value": "Single fold stitched, double fold stitched, custom finish"
          },
          {
            "@type": "PropertyValue",
            "name": "Printing",
            "value": "Plain, Flexo Printed, Laminated Printed"
          },
          {
            "@type": "PropertyValue",
            "name": "Packing",
            "value": "Bale, Bundle, Pallet, Carton, Export Packing"
          }
        ]
      }
    ]
  },
  "/products/top-bottom-stitched": {
    "path": "/products/top-bottom-stitched",
    "name": "Top & Bottom Stitched Bags",
    "title": "Stitched PP Woven Bags Exporter India | VIVIDPOLY",
    "description": "Secure top and bottom stitched PP bags for transport, storage and export of agricultural and industrial products. Custom sizes made in India.",
    "h1": "Top and Bottom Stitched PP Bags for Export",
    "canonical": "https://vividpoly.com/products/top-bottom-stitched",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/top-bottom-stitched#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Top and Bottom Stitched Bags",
            "item": "https://vividpoly.com/products/top-bottom-stitched"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/top-bottom-stitched#product",
        "name": "Top and Bottom Stitched Bags",
        "description": "VIVIDPOLY exports Top and Bottom Stitched PP Woven Bags for agricultural, food, fertilizer, animal feed, chemical, mineral, and industrial packaging. Available in capacities from 5 kg to 75 kg with custom stitching, printing, liners, and export packing.",
        "url": "https://vividpoly.com/products/top-bottom-stitched",
        "image": "https://vividpoly.com/products/photos/tbs-branded-stitch.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "PP Woven Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Capacity",
            "value": "5 kg to 75 kg"
          },
          {
            "@type": "PropertyValue",
            "name": "Stitching",
            "value": "Single fold, double fold, single thread, double thread, top and bottom stitched"
          },
          {
            "@type": "PropertyValue",
            "name": "Printing",
            "value": "Plain, Flexo Printed, Printed Laminated"
          },
          {
            "@type": "PropertyValue",
            "name": "Liner",
            "value": "Optional loose or stitched liner"
          },
          {
            "@type": "PropertyValue",
            "name": "Packing",
            "value": "Bale, Bundle, Pallet, Compressed Export Packing"
          }
        ]
      }
    ]
  },
  "/products/d-cut-pp-bags": {
    "path": "/products/d-cut-pp-bags",
    "name": "D-Cut PP Bags",
    "title": "D-Cut PP Woven Bags Exporter India | VIVIDPOLY",
    "description": "Carry-style D-cut PP woven bags with a built-in handle for retail, promotion and reusable packaging. Custom printed and exported from India.",
    "h1": "D-Cut PP Woven Bags with Integrated Handle",
    "canonical": "https://vividpoly.com/products/d-cut-pp-bags",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/d-cut-pp-bags#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "D-Cut PP Bags",
            "item": "https://vividpoly.com/products/d-cut-pp-bags"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/d-cut-pp-bags#product",
        "name": "D-Cut PP Bags",
        "description": "VIVIDPOLY exports D-Cut PP Woven Bags with integrated handles for retail, shopping, promotional, exhibition, and reusable packaging applications. Custom printing, lamination, gusset options, and export packing are available.",
        "url": "https://vividpoly.com/products/d-cut-pp-bags",
        "image": "https://vividpoly.com/products/photos/dcut-red.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "PP Woven Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Handle",
            "value": "D-cut or Reinforced D-cut Handle"
          },
          {
            "@type": "PropertyValue",
            "name": "Material",
            "value": "PP Woven or Laminated PP Material"
          },
          {
            "@type": "PropertyValue",
            "name": "Printing",
            "value": "Custom Printing"
          },
          {
            "@type": "PropertyValue",
            "name": "Stitching",
            "value": "Side and Bottom Stitching"
          },
          {
            "@type": "PropertyValue",
            "name": "Packing",
            "value": "Carton or Bundle Packing"
          }
        ]
      }
    ]
  },
  "/products/valve-bags": {
    "path": "/products/valve-bags",
    "name": "Valve Bags",
    "title": "Valve PP Bags Exporter from India | VIVIDPOLY",
    "description": "Valve-filling PP bags for cement, chemicals, minerals, powders and construction materials. Export-grade, custom sizes 5 to 75 kg from India.",
    "h1": "Valve PP Bags for Cement, Powders and Chemicals",
    "canonical": "https://vividpoly.com/products/valve-bags",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/valve-bags#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Valve Bags",
            "item": "https://vividpoly.com/products/valve-bags"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/valve-bags#product",
        "name": "Valve Bags",
        "description": "VIVIDPOLY exports Valve Bags for cement style products, chemicals, minerals, powders, construction materials, and industrial applications. Custom valve types, liners, perforation, printing, and export packing are available.",
        "url": "https://vividpoly.com/products/valve-bags",
        "image": "https://vividpoly.com/products/photos/valve-bag-branded.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "PP Woven Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Capacity",
            "value": "20 kg to 75 kg"
          },
          {
            "@type": "PropertyValue",
            "name": "Valve Type",
            "value": "Simple or Extended Valve"
          },
          {
            "@type": "PropertyValue",
            "name": "Construction",
            "value": "Standard or Block Bottom Construction"
          },
          {
            "@type": "PropertyValue",
            "name": "Add-Ons",
            "value": "Optional Liner and Perforation"
          }
        ]
      }
    ]
  },
  "/products/carry-bags": {
    "path": "/products/carry-bags",
    "name": "Carry Bags",
    "title": "PP Woven Carry Bags Exporter India | VIVIDPOLY",
    "description": "Strong, brandable woven PP carry bags for retail, trade and promotional use. Custom printing and export packing from India for global buyers.",
    "h1": "Woven PP Carry Bags for Retail and Promotion",
    "canonical": "https://vividpoly.com/products/carry-bags",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/carry-bags#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Carry Bags",
            "item": "https://vividpoly.com/products/carry-bags"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/carry-bags#product",
        "name": "Carry Bags",
        "description": "VIVIDPOLY exports PP Woven Carry Bags for retail, trade, shopping, events, and promotional packaging. Custom printing, lamination, gusset options, and export packing are available.",
        "url": "https://vividpoly.com/products/carry-bags",
        "image": "https://vividpoly.com/products/photos/carry-red.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "PP Woven Carry Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Material",
            "value": "PP Woven or Laminated PP Material"
          },
          {
            "@type": "PropertyValue",
            "name": "Printing",
            "value": "Flexo Printed or Laminated Print"
          },
          {
            "@type": "PropertyValue",
            "name": "Gusset",
            "value": "Side or Bottom Gusset"
          },
          {
            "@type": "PropertyValue",
            "name": "Handle Options",
            "value": "D-Cut, Loop, Stitched, Punched, Side Handle, Top Handle"
          },
          {
            "@type": "PropertyValue",
            "name": "Packing",
            "value": "Carton, Bundle or Bale Packing"
          }
        ]
      }
    ]
  },
  "/products/pinch-bottom-bags": {
    "path": "/products/pinch-bottom-bags",
    "name": "Pinch Bottom Bags",
    "title": "Pinch Bottom PP Bags Exporter India | VIVIDPOLY",
    "description": "Premium printed laminated pinch bottom PP bags with clean closure for retail-ready packaging of food, feed, grains and seeds. Made in India.",
    "h1": "Pinch Bottom PP Bags for Retail-Ready Packaging",
    "canonical": "https://vividpoly.com/products/pinch-bottom-bags",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/pinch-bottom-bags#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Pinch Bottom Bags",
            "item": "https://vividpoly.com/products/pinch-bottom-bags"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/pinch-bottom-bags#product",
        "name": "Pinch Bottom Bags",
        "description": "VIVIDPOLY exports Printed and Laminated Woven PP Pinch Bottom Bags for food grains, pet food, animal feed, seeds, and retail packaging. Custom sizes, windows, liners, gussets, and export packing are available.",
        "url": "https://vividpoly.com/products/pinch-bottom-bags",
        "image": "https://vividpoly.com/products/photos/pinch-red.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "Pinch Bottom Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Capacity",
            "value": "5 kg to 50 kg"
          },
          {
            "@type": "PropertyValue",
            "name": "Construction",
            "value": "Printed Laminated Woven PP"
          },
          {
            "@type": "PropertyValue",
            "name": "Add-Ons",
            "value": "Optional Window, Liner, and Gusset"
          },
          {
            "@type": "PropertyValue",
            "name": "Features",
            "value": "Pinch Bottom Construction, Printed Laminated Surface, Optional Easy Open Feature"
          }
        ]
      }
    ]
  },
  "/products/block-bottom-bags": {
    "path": "/products/block-bottom-bags",
    "name": "Block Bottom Bags",
    "title": "Block Bottom PP Bags Exporter India | VIVIDPOLY",
    "description": "Stable-shape printed laminated block bottom PP bags for better stacking, display and export presentation. Custom print and sizes from India.",
    "h1": "Block Bottom PP Bags for Stable Stacking",
    "canonical": "https://vividpoly.com/products/block-bottom-bags",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/block-bottom-bags#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Block Bottom Bags",
            "item": "https://vividpoly.com/products/block-bottom-bags"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/block-bottom-bags#product",
        "name": "Block Bottom Bags",
        "description": "VIVIDPOLY exports Printed and Laminated Woven PP Block Bottom Bags for fertilizer, pet food, animal feed, grains, minerals, chemicals, and retail packaging. Custom sizes, valve options, liners, perforation, and export packing are available.",
        "url": "https://vividpoly.com/products/block-bottom-bags",
        "image": "https://vividpoly.com/products/photos/block-c-blk.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "Block Bottom Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Capacity",
            "value": "5 kg to 75 kg"
          },
          {
            "@type": "PropertyValue",
            "name": "Format",
            "value": "Block Bottom"
          },
          {
            "@type": "PropertyValue",
            "name": "Top",
            "value": "Open Mouth or Optional Valve"
          },
          {
            "@type": "PropertyValue",
            "name": "Add-Ons",
            "value": "Liner, Perforation, Laminated Print"
          },
          {
            "@type": "PropertyValue",
            "name": "Features",
            "value": "Block Bottom Structure, Printed Laminated Finish, Strong Branding Surface"
          }
        ]
      }
    ]
  },
  "/products/bottom-gusset-bags": {
    "path": "/products/bottom-gusset-bags",
    "name": "Bottom Gusset Bags",
    "title": "Gusset PP Bags Exporter from India | VIVIDPOLY",
    "description": "High-volume block bottom gusset PP bags with a strong branding area and stable filled shape. Export-grade laminated packaging from India.",
    "h1": "Block Bottom Gusset PP Bags for High Volume",
    "canonical": "https://vividpoly.com/products/bottom-gusset-bags",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/bottom-gusset-bags#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Bottom Gusset Bags",
            "item": "https://vividpoly.com/products/bottom-gusset-bags"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/bottom-gusset-bags#product",
        "name": "Bottom Gusset Bags",
        "description": "VIVIDPOLY exports Printed and Laminated Woven PP Block Bottom Gusset Bags for animal feed, pet food, fertilizer, grains, seeds, and high volume retail or industrial packaging. Custom gusset sizes, liners, windows, valves, and export packing are available.",
        "url": "https://vividpoly.com/products/bottom-gusset-bags",
        "image": "https://vividpoly.com/products/photos/gusset-red.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "Block Bottom Gusset Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Capacity",
            "value": "5 kg to 75 kg"
          },
          {
            "@type": "PropertyValue",
            "name": "Gusset",
            "value": "Side, Bottom, or Block Bottom Gusset"
          },
          {
            "@type": "PropertyValue",
            "name": "Add-Ons",
            "value": "Optional Valve, Liner, and Window"
          },
          {
            "@type": "PropertyValue",
            "name": "Features",
            "value": "Block Bottom with Gusset, Printed Laminated Exterior, Custom Gusset Depth, Window, Liner, Perforation"
          }
        ]
      }
    ]
  },
  "/products/pp-woven-bags": {
    "path": "/products/pp-woven-bags",
    "name": "PP Woven Bags",
    "title": "PP Woven Bags Exporter & Supplier India | VIVIDPOLY",
    "description": "Durable PP woven bags for grains, feed, fertilizer, cement, minerals and retail. Custom sizes, printing and export packing supplied from India.",
    "h1": "PP Woven Bags for Industrial and Agricultural Use",
    "canonical": "https://vividpoly.com/products/pp-woven-bags",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/pp-woven-bags#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "PP Woven Bags",
            "item": "https://vividpoly.com/products/pp-woven-bags"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/pp-woven-bags#product",
        "name": "PP Woven Bags",
        "description": "VIVIDPOLY exports PP Woven Bags for grains, flour, animal feed, fertilizer, cement, minerals, sugar, salt, and general industrial packaging. Available in capacities from 5 kg to 75 kg with custom size, printing, lamination, liner, and export packing options.",
        "url": "https://vividpoly.com/products/pp-woven-bags",
        "image": "https://vividpoly.com/products/photos/open-mouth-1.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "PP Woven Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Capacity",
            "value": "5 kg to 75 kg"
          },
          {
            "@type": "PropertyValue",
            "name": "Construction",
            "value": "Tubular or Flat Woven PP"
          },
          {
            "@type": "PropertyValue",
            "name": "Printing",
            "value": "Plain, Flexo Printed, Laminated Printed"
          },
          {
            "@type": "PropertyValue",
            "name": "Add-Ons",
            "value": "Optional Liner, Gusset, and Lamination"
          },
          {
            "@type": "PropertyValue",
            "name": "Packing",
            "value": "Bale, Bundle, Pallet, Export Packing"
          }
        ]
      }
    ]
  },
  "/products/bopp-laminated-bags": {
    "path": "/products/bopp-laminated-bags",
    "name": "BOPP Laminated Bags",
    "title": "BOPP Laminated Woven Bags Exporter India | VIVIDPOLY",
    "description": "Premium BOPP laminated woven PP bags with high-definition printing for rice, flour, feed, pet food and seeds. Custom branding and export from India.",
    "h1": "BOPP Laminated Woven PP Bags with HD Printing",
    "canonical": "https://vividpoly.com/products/bopp-laminated-bags",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/bopp-laminated-bags#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "BOPP Laminated Bags",
            "item": "https://vividpoly.com/products/bopp-laminated-bags"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/bopp-laminated-bags#product",
        "name": "BOPP Laminated Bags",
        "description": "VIVIDPOLY exports BOPP Laminated Woven PP Bags with high-definition printing for rice, flour, fertilizer, animal feed, pet food, seeds, salt, sugar, and retail packaging. Custom sizes, artwork, liners, windows, and export packing are available.",
        "url": "https://vividpoly.com/products/bopp-laminated-bags",
        "image": "https://vividpoly.com/products/photos/bopp-printed-1.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "BOPP Laminated Woven PP Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Base Material",
            "value": "Woven PP with BOPP Laminated Film"
          },
          {
            "@type": "PropertyValue",
            "name": "Printing",
            "value": "High-Definition BOPP Reverse Printing"
          },
          {
            "@type": "PropertyValue",
            "name": "Finish",
            "value": "Gloss or Matte Finish"
          },
          {
            "@type": "PropertyValue",
            "name": "Liner",
            "value": "Optional"
          },
          {
            "@type": "PropertyValue",
            "name": "Capacity",
            "value": "5 kg to 75 kg"
          }
        ]
      }
    ]
  },
  "/products/bopp-open-mouth": {
    "path": "/products/bopp-open-mouth",
    "name": "BOPP Open Mouth Bags",
    "title": "BOPP Open Mouth Bags Exporter India | VIVIDPOLY",
    "description": "BOPP laminated open mouth PP bags for grains, flour, feed and fertilizer with glossy retail-ready print. Custom sizes 5 to 75 kg from India.",
    "h1": "BOPP Laminated Open Mouth PP Bags",
    "canonical": "https://vividpoly.com/products/bopp-open-mouth",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/bopp-open-mouth#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "BOPP Open Mouth Bags",
            "item": "https://vividpoly.com/products/bopp-open-mouth"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/bopp-open-mouth#product",
        "name": "BOPP Open Mouth Bags",
        "description": "VIVIDPOLY exports BOPP Laminated Open Mouth PP Bags for grains, flour, animal feed, fertilizer, salt, sugar, and minerals. Available in capacities from 5 kg to 75 kg with high-definition print, optional liner, and export packing.",
        "url": "https://vividpoly.com/products/bopp-open-mouth",
        "image": "https://vividpoly.com/products/photos/open-mouth-1.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "BOPP Laminated Woven PP Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Capacity",
            "value": "5 kg to 75 kg"
          },
          {
            "@type": "PropertyValue",
            "name": "Top Finish",
            "value": "Open mouth, heat cut, hemmed"
          },
          {
            "@type": "PropertyValue",
            "name": "Bottom Finish",
            "value": "Single fold stitched, double fold stitched"
          },
          {
            "@type": "PropertyValue",
            "name": "Printing",
            "value": "BOPP Laminated High-Definition Print"
          },
          {
            "@type": "PropertyValue",
            "name": "Packing",
            "value": "Bale, Bundle, Pallet, Export Packing"
          }
        ]
      }
    ]
  },
  "/products/bopp-top-bottom-stitched": {
    "path": "/products/bopp-top-bottom-stitched",
    "name": "BOPP Top & Bottom Stitched Bags",
    "title": "BOPP Stitched Woven Bags Exporter India | VIVIDPOLY",
    "description": "BOPP laminated top and bottom stitched PP bags with durable print for food, feed and industrial products. Custom sizes exported from India.",
    "h1": "BOPP Laminated Top and Bottom Stitched Bags",
    "canonical": "https://vividpoly.com/products/bopp-top-bottom-stitched",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/bopp-top-bottom-stitched#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "BOPP Top and Bottom Stitched Bags",
            "item": "https://vividpoly.com/products/bopp-top-bottom-stitched"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/bopp-top-bottom-stitched#product",
        "name": "BOPP Top and Bottom Stitched Bags",
        "description": "VIVIDPOLY exports BOPP Laminated Top and Bottom Stitched PP Bags for food, feed, fertilizer, chemical, mineral, and industrial packaging. Available in capacities from 5 kg to 75 kg with high-definition print, optional liner, and export packing.",
        "url": "https://vividpoly.com/products/bopp-top-bottom-stitched",
        "image": "https://vividpoly.com/products/photos/tbs-branded-stitch.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "BOPP Laminated Woven PP Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Capacity",
            "value": "5 kg to 75 kg"
          },
          {
            "@type": "PropertyValue",
            "name": "Stitching",
            "value": "Single fold, double fold, top and bottom stitched"
          },
          {
            "@type": "PropertyValue",
            "name": "Printing",
            "value": "BOPP Laminated High-Definition Print"
          },
          {
            "@type": "PropertyValue",
            "name": "Liner",
            "value": "Optional loose or stitched liner"
          },
          {
            "@type": "PropertyValue",
            "name": "Packing",
            "value": "Bale, Bundle, Pallet, Compressed Export Packing"
          }
        ]
      }
    ]
  },
  "/products/bopp-d-cut": {
    "path": "/products/bopp-d-cut",
    "name": "BOPP D-Cut Bags",
    "title": "BOPP D-Cut Woven Bags Exporter India | VIVIDPOLY",
    "description": "BOPP laminated D-cut PP bags with integrated handle and glossy print for retail and promotional packaging. Custom printed and exported from India.",
    "h1": "BOPP Laminated D-Cut Bags with Handle",
    "canonical": "https://vividpoly.com/products/bopp-d-cut",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/bopp-d-cut#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "BOPP D-Cut Bags",
            "item": "https://vividpoly.com/products/bopp-d-cut"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/bopp-d-cut#product",
        "name": "BOPP D-Cut Bags",
        "description": "VIVIDPOLY exports BOPP Laminated D-Cut PP Bags with integrated handles and glossy print for retail, shopping, promotional, and reusable packaging. Custom printing, gusset options, and export packing are available.",
        "url": "https://vividpoly.com/products/bopp-d-cut",
        "image": "https://vividpoly.com/products/photos/dcut-red.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "BOPP Laminated Woven PP Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Handle",
            "value": "D-cut or Reinforced D-cut Handle"
          },
          {
            "@type": "PropertyValue",
            "name": "Material",
            "value": "BOPP Laminated Woven PP"
          },
          {
            "@type": "PropertyValue",
            "name": "Printing",
            "value": "BOPP Laminated High-Definition Print"
          },
          {
            "@type": "PropertyValue",
            "name": "Gusset",
            "value": "Optional Side or Bottom Gusset"
          },
          {
            "@type": "PropertyValue",
            "name": "Packing",
            "value": "Carton or Bundle Packing"
          }
        ]
      }
    ]
  },
  "/products/bopp-valve-bags": {
    "path": "/products/bopp-valve-bags",
    "name": "BOPP Valve Bags",
    "title": "BOPP Valve Bags Exporter from India | VIVIDPOLY",
    "description": "BOPP laminated valve PP bags for cement, chemicals, minerals and powders with strong branding print. Export-grade custom sizes from India.",
    "h1": "BOPP Laminated Valve Bags for Powders",
    "canonical": "https://vividpoly.com/products/bopp-valve-bags",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/bopp-valve-bags#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "BOPP Valve Bags",
            "item": "https://vividpoly.com/products/bopp-valve-bags"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/bopp-valve-bags#product",
        "name": "BOPP Valve Bags",
        "description": "VIVIDPOLY exports BOPP Laminated Valve Bags for cement style products, chemicals, minerals, powders, and construction materials. Custom valve types, liners, perforation, and export packing are available with high-definition print.",
        "url": "https://vividpoly.com/products/bopp-valve-bags",
        "image": "https://vividpoly.com/products/photos/valve-bag-branded.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "BOPP Laminated Woven PP Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Capacity",
            "value": "20 kg to 75 kg"
          },
          {
            "@type": "PropertyValue",
            "name": "Valve Type",
            "value": "Simple or Extended Valve"
          },
          {
            "@type": "PropertyValue",
            "name": "Construction",
            "value": "Standard or Block Bottom Construction"
          },
          {
            "@type": "PropertyValue",
            "name": "Printing",
            "value": "BOPP Laminated High-Definition Print"
          },
          {
            "@type": "PropertyValue",
            "name": "Add-Ons",
            "value": "Optional Liner and Perforation"
          }
        ]
      }
    ]
  },
  "/products/bopp-carry-bags": {
    "path": "/products/bopp-carry-bags",
    "name": "BOPP Carry Bags",
    "title": "BOPP Carry Bags Exporter India | VIVIDPOLY",
    "description": "BOPP laminated woven carry bags with glossy retail print for shops, trade and promotions. Custom branding and export packing from India.",
    "h1": "BOPP Laminated Woven Carry Bags",
    "canonical": "https://vividpoly.com/products/bopp-carry-bags",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/bopp-carry-bags#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "BOPP Carry Bags",
            "item": "https://vividpoly.com/products/bopp-carry-bags"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/bopp-carry-bags#product",
        "name": "BOPP Carry Bags",
        "description": "VIVIDPOLY exports BOPP Laminated Woven Carry Bags for retail, trade, shopping, events, and promotional packaging. Glossy high-definition print, custom handles, gusset options, and export packing are available.",
        "url": "https://vividpoly.com/products/bopp-carry-bags",
        "image": "https://vividpoly.com/products/photos/bopp-green.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "BOPP Laminated Woven PP Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Material",
            "value": "BOPP Laminated Woven PP"
          },
          {
            "@type": "PropertyValue",
            "name": "Printing",
            "value": "BOPP Laminated High-Definition Print"
          },
          {
            "@type": "PropertyValue",
            "name": "Gusset",
            "value": "Side or Bottom Gusset"
          },
          {
            "@type": "PropertyValue",
            "name": "Handle Options",
            "value": "D-Cut, Loop, Stitched, Punched, Side Handle, Top Handle"
          },
          {
            "@type": "PropertyValue",
            "name": "Packing",
            "value": "Carton, Bundle or Bale Packing"
          }
        ]
      }
    ]
  },
  "/products/bopp-pinch-bottom": {
    "path": "/products/bopp-pinch-bottom",
    "name": "BOPP Pinch Bottom Bags",
    "title": "BOPP Pinch Bottom Bags Exporter India | VIVIDPOLY",
    "description": "BOPP laminated pinch bottom PP bags with clean closure and premium print for food, feed, grains and seeds. Retail-ready packaging from India.",
    "h1": "BOPP Laminated Pinch Bottom Bags",
    "canonical": "https://vividpoly.com/products/bopp-pinch-bottom",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/bopp-pinch-bottom#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "BOPP Pinch Bottom Bags",
            "item": "https://vividpoly.com/products/bopp-pinch-bottom"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/bopp-pinch-bottom#product",
        "name": "BOPP Pinch Bottom Bags",
        "description": "VIVIDPOLY exports BOPP Laminated Pinch Bottom PP Bags for food grains, pet food, animal feed, seeds, and retail packaging. Custom sizes, windows, liners, gussets, and export packing are available with high-definition print.",
        "url": "https://vividpoly.com/products/bopp-pinch-bottom",
        "image": "https://vividpoly.com/products/photos/bopp-pinch-real.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "BOPP Laminated Woven PP Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Capacity",
            "value": "5 kg to 50 kg"
          },
          {
            "@type": "PropertyValue",
            "name": "Construction",
            "value": "BOPP Laminated Woven PP, Pinch Bottom"
          },
          {
            "@type": "PropertyValue",
            "name": "Add-Ons",
            "value": "Optional Window, Liner, and Gusset"
          },
          {
            "@type": "PropertyValue",
            "name": "Printing",
            "value": "BOPP Laminated High-Definition Print"
          },
          {
            "@type": "PropertyValue",
            "name": "Features",
            "value": "Pinch Bottom Construction, Optional Easy Open Feature"
          }
        ]
      }
    ]
  },
  "/products/bopp-block-bottom": {
    "path": "/products/bopp-block-bottom",
    "name": "BOPP Block Bottom Bags",
    "title": "BOPP Block Bottom Bags Exporter India | VIVIDPOLY",
    "description": "BOPP laminated block bottom PP bags for stable stacking and strong shelf presentation. Custom print, sizes and export packing from India.",
    "h1": "BOPP Laminated Block Bottom Bags",
    "canonical": "https://vividpoly.com/products/bopp-block-bottom",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/bopp-block-bottom#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "BOPP Block Bottom Bags",
            "item": "https://vividpoly.com/products/bopp-block-bottom"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/bopp-block-bottom#product",
        "name": "BOPP Block Bottom Bags",
        "description": "VIVIDPOLY exports BOPP Laminated Block Bottom PP Bags for fertilizer, pet food, animal feed, grains, minerals, chemicals, and retail packaging. Custom sizes, valve options, liners, perforation, and export packing are available with high-definition print.",
        "url": "https://vividpoly.com/products/bopp-block-bottom",
        "image": "https://vividpoly.com/products/photos/block-c-blk.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "BOPP Laminated Woven PP Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Capacity",
            "value": "5 kg to 75 kg"
          },
          {
            "@type": "PropertyValue",
            "name": "Format",
            "value": "Block Bottom"
          },
          {
            "@type": "PropertyValue",
            "name": "Top",
            "value": "Open Mouth or Optional Valve"
          },
          {
            "@type": "PropertyValue",
            "name": "Printing",
            "value": "BOPP Laminated High-Definition Print"
          },
          {
            "@type": "PropertyValue",
            "name": "Features",
            "value": "Block Bottom Structure, Strong Branding Surface"
          }
        ]
      }
    ]
  },
  "/products/bopp-bottom-gusset": {
    "path": "/products/bopp-bottom-gusset",
    "name": "BOPP Bottom Gusset Bags",
    "title": "BOPP Gusset Bags Exporter from India | VIVIDPOLY",
    "description": "BOPP laminated block bottom gusset PP bags with large branding area and stable filled shape for high-volume packaging. Exported from India.",
    "h1": "BOPP Laminated Block Bottom Gusset Bags",
    "canonical": "https://vividpoly.com/products/bopp-bottom-gusset",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/bopp-bottom-gusset#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "BOPP Bottom Gusset Bags",
            "item": "https://vividpoly.com/products/bopp-bottom-gusset"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/bopp-bottom-gusset#product",
        "name": "BOPP Bottom Gusset Bags",
        "description": "VIVIDPOLY exports BOPP Laminated Block Bottom Gusset PP Bags for animal feed, pet food, fertilizer, grains, seeds, and high volume retail or industrial packaging. Custom gusset sizes, liners, windows, valves, and export packing are available with high-definition print.",
        "url": "https://vividpoly.com/products/bopp-bottom-gusset",
        "image": "https://vividpoly.com/products/photos/gusset-red.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "BOPP Laminated Woven PP Bags",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Capacity",
            "value": "5 kg to 75 kg"
          },
          {
            "@type": "PropertyValue",
            "name": "Gusset",
            "value": "Side, Bottom, or Block Bottom Gusset"
          },
          {
            "@type": "PropertyValue",
            "name": "Printing",
            "value": "BOPP Laminated High-Definition Print"
          },
          {
            "@type": "PropertyValue",
            "name": "Add-Ons",
            "value": "Optional Valve, Liner, and Window"
          },
          {
            "@type": "PropertyValue",
            "name": "Features",
            "value": "Block Bottom with Gusset, Custom Gusset Depth"
          }
        ]
      }
    ]
  },
  "/products/pp-woven-fabric": {
    "path": "/products/pp-woven-fabric",
    "name": "PP Woven Fabric",
    "title": "PP Woven Fabric Exporter from India | VIVIDPOLY",
    "description": "PP woven fabric in rolls and cut lengths for industrial, agricultural and conversion use. Export-grade fabric supplied from India in bulk.",
    "h1": "PP Woven Fabric Rolls for Industrial Use",
    "canonical": "https://vividpoly.com/products/pp-woven-fabric",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/pp-woven-fabric#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "PP Woven Fabric",
            "item": "https://vividpoly.com/products/pp-woven-fabric"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/pp-woven-fabric#product",
        "name": "PP Woven Fabric",
        "description": "VIVIDPOLY exports PP Woven Fabric rolls and cut lengths for industrial, agricultural, and conversion applications. Custom widths, GSM, colours, roll sizes, and export packing are available for global buyers.",
        "url": "https://vividpoly.com/products/pp-woven-fabric",
        "image": "https://vividpoly.com/products/photos/fabric-roll-red.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "PP Woven Fabric",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Format",
            "value": "Custom to Enquiry"
          },
          {
            "@type": "PropertyValue",
            "name": "Material",
            "value": "PP Woven"
          },
          {
            "@type": "PropertyValue",
            "name": "Customization",
            "value": "Custom Width, GSM, Colour, Roll or Cut Length"
          },
          {
            "@type": "PropertyValue",
            "name": "Packing",
            "value": "Export Packing"
          },
          {
            "@type": "PropertyValue",
            "name": "Features",
            "value": "Export Ready, Consistent Weave, Industrial and Agricultural Applications"
          }
        ]
      }
    ]
  },
  "/products/weed-barrier": {
    "path": "/products/weed-barrier",
    "name": "Weed Barrier",
    "title": "Weed Barrier Fabric Exporter India | VIVIDPOLY",
    "description": "Durable PP woven weed barrier fabric for landscaping, agriculture and ground cover. Export-grade rolls supplied from India for global buyers.",
    "h1": "PP Woven Weed Barrier Fabric for Landscaping",
    "canonical": "https://vividpoly.com/products/weed-barrier",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/products/weed-barrier#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://vividpoly.com/products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Weed Barrier",
            "item": "https://vividpoly.com/products/weed-barrier"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://vividpoly.com/products/weed-barrier#product",
        "name": "Weed Barrier",
        "description": "VIVIDPOLY exports PP Woven Weed Barrier fabric for landscaping, agriculture, nurseries, and ground cover applications. Custom widths, GSM, colours, roll sizes, and export packing are available for global buyers.",
        "url": "https://vividpoly.com/products/weed-barrier",
        "image": "https://vividpoly.com/products/photos/weed-barrier-1.webp",
        "brand": {
          "@type": "Brand",
          "name": "VIVIDPOLY"
        },
        "manufacturer": {
          "@id": "https://vividpoly.com/#organization"
        },
        "category": "Weed Barrier Fabric",
        "material": "Polypropylene (PP)",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "India"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Format",
            "value": "Custom to Enquiry"
          },
          {
            "@type": "PropertyValue",
            "name": "Material",
            "value": "PP Woven"
          },
          {
            "@type": "PropertyValue",
            "name": "Customization",
            "value": "Custom Width, GSM, Colour, Roll or Cut Length"
          },
          {
            "@type": "PropertyValue",
            "name": "Packing",
            "value": "Export Packing"
          },
          {
            "@type": "PropertyValue",
            "name": "Applications",
            "value": "Landscaping, Agriculture, Ground Cover, Nurseries"
          }
        ]
      }
    ]
  },
  "/industries": {
    "path": "/industries",
    "name": "Industries",
    "title": "PP Bags by Industry & Use | VIVIDPOLY India",
    "description": "Find the right PP bag by industry: grains, fertilizer, animal feed, cement, salt, sugar and retail. Export packaging guidance from India.",
    "h1": "PP Bags by Industry and Product Use",
    "canonical": "https://vividpoly.com/industries",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/industries#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Industries",
            "item": "https://vividpoly.com/industries"
          }
        ]
      }
    ]
  },
  "/industry/flour": {
    "path": "/industry/flour",
    "name": "Flour Industry",
    "title": "PP Bags for Flour Packaging | VIVIDPOLY India",
    "description": "Export-grade PP woven and laminated bags for flour and atta packaging. Moisture-aware options, custom print and sizes supplied from India.",
    "h1": "PP Bags for Flour and Atta Packaging",
    "canonical": "https://vividpoly.com/industry/flour",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/industry/flour#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Industries",
            "item": "https://vividpoly.com/industries"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Flour",
            "item": "https://vividpoly.com/industry/flour"
          }
        ]
      }
    ]
  },
  "/industry/food-grains": {
    "path": "/industry/food-grains",
    "name": "Food Grains Industry",
    "title": "PP Bags for Food Grain Packaging | VIVIDPOLY",
    "description": "PP woven and laminated bags for rice, wheat, pulses and food grains. Export-grade strength, custom print and sizes supplied from India.",
    "h1": "PP Bags for Food Grain Packaging",
    "canonical": "https://vividpoly.com/industry/food-grains",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/industry/food-grains#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Industries",
            "item": "https://vividpoly.com/industries"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Food Grains",
            "item": "https://vividpoly.com/industry/food-grains"
          }
        ]
      }
    ]
  },
  "/industry/fertilizers": {
    "path": "/industry/fertilizers",
    "name": "Fertilizers Industry",
    "title": "PP Bags for Fertilizer Packaging | VIVIDPOLY",
    "description": "Strong PP woven and laminated bags for fertilizer and soil products. UV-aware options, liners, custom sizes and export packing from India.",
    "h1": "PP Bags for Fertilizer Packaging",
    "canonical": "https://vividpoly.com/industry/fertilizers",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/industry/fertilizers#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Industries",
            "item": "https://vividpoly.com/industries"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Fertilizers",
            "item": "https://vividpoly.com/industry/fertilizers"
          }
        ]
      }
    ]
  },
  "/industry/chemicals": {
    "path": "/industry/chemicals",
    "name": "Chemicals Industry",
    "title": "PP Bags for Chemical Packaging | VIVIDPOLY",
    "description": "PP woven and valve bags for chemicals, powders and granules. Liner options, secure closures and export-grade construction supplied from India.",
    "h1": "PP Bags for Chemical and Powder Packaging",
    "canonical": "https://vividpoly.com/industry/chemicals",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/industry/chemicals#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Industries",
            "item": "https://vividpoly.com/industries"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Chemicals",
            "item": "https://vividpoly.com/industry/chemicals"
          }
        ]
      }
    ]
  },
  "/industry/cement": {
    "path": "/industry/cement",
    "name": "Cement Industry",
    "title": "PP Bags for Cement Packaging | VIVIDPOLY India",
    "description": "Valve and block bottom PP bags for cement and construction materials. Fast filling, stable stacking and export packing supplied from India.",
    "h1": "PP Valve Bags for Cement Packaging",
    "canonical": "https://vividpoly.com/industry/cement",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/industry/cement#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Industries",
            "item": "https://vividpoly.com/industries"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Cement",
            "item": "https://vividpoly.com/industry/cement"
          }
        ]
      }
    ]
  },
  "/industry/minerals": {
    "path": "/industry/minerals",
    "name": "Minerals Industry",
    "title": "PP Bags for Mineral Packaging | VIVIDPOLY",
    "description": "Heavy-duty PP woven and valve bags for minerals, ores and powders. Liner options, custom sizes and export-grade strength supplied from India.",
    "h1": "PP Bags for Mineral and Ore Packaging",
    "canonical": "https://vividpoly.com/industry/minerals",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/industry/minerals#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Industries",
            "item": "https://vividpoly.com/industries"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Minerals",
            "item": "https://vividpoly.com/industry/minerals"
          }
        ]
      }
    ]
  },
  "/industry/animal-feed": {
    "path": "/industry/animal-feed",
    "name": "Animal Feed Industry",
    "title": "PP Bags for Animal Feed Packaging | VIVIDPOLY",
    "description": "PP woven and laminated bags for cattle, poultry and pet feed. Strong seams, custom print and export packing supplied from India.",
    "h1": "PP Bags for Animal and Pet Feed",
    "canonical": "https://vividpoly.com/industry/animal-feed",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/industry/animal-feed#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Industries",
            "item": "https://vividpoly.com/industries"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Animal Feed",
            "item": "https://vividpoly.com/industry/animal-feed"
          }
        ]
      }
    ]
  },
  "/industry/sugar": {
    "path": "/industry/sugar",
    "name": "Sugar Industry",
    "title": "PP Bags for Sugar Packaging | VIVIDPOLY India",
    "description": "Food-grade PP woven and laminated bags for sugar and sweeteners. Liner options, custom sizes and export packing supplied from India.",
    "h1": "PP Bags for Sugar Packaging",
    "canonical": "https://vividpoly.com/industry/sugar",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/industry/sugar#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Industries",
            "item": "https://vividpoly.com/industries"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Sugar",
            "item": "https://vividpoly.com/industry/sugar"
          }
        ]
      }
    ]
  },
  "/industry/coal-charcoal": {
    "path": "/industry/coal-charcoal",
    "name": "Coal & Charcoal Industry",
    "title": "PP Bags for Coal & Charcoal | VIVIDPOLY India",
    "description": "Heavy-duty PP woven bags for coal, charcoal and briquettes. Strong seams, custom sizes and export packing supplied from India for bulk buyers.",
    "h1": "PP Bags for Coal and Charcoal Packaging",
    "canonical": "https://vividpoly.com/industry/coal-charcoal",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/industry/coal-charcoal#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Industries",
            "item": "https://vividpoly.com/industries"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Coal and Charcoal",
            "item": "https://vividpoly.com/industry/coal-charcoal"
          }
        ]
      }
    ]
  },
  "/industry/sandbags": {
    "path": "/industry/sandbags",
    "name": "Sandbags Industry",
    "title": "PP Sandbags Exporter from India | VIVIDPOLY",
    "description": "Durable PP woven sandbags for flood control, construction and defence use. UV-aware options, custom sizes and export packing from India.",
    "h1": "PP Woven Sandbags for Flood and Construction",
    "canonical": "https://vividpoly.com/industry/sandbags",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/industry/sandbags#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Industries",
            "item": "https://vividpoly.com/industries"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Sandbags",
            "item": "https://vividpoly.com/industry/sandbags"
          }
        ]
      }
    ]
  },
  "/industry/courier-bags": {
    "path": "/industry/courier-bags",
    "name": "Courier Bags Industry",
    "title": "Woven Courier & Mailing Bags | VIVIDPOLY India",
    "description": "Tamper-aware woven courier and mailing bags for logistics and e-commerce. Custom sizes, printing and export packing supplied from India.",
    "h1": "Woven Courier and Mailing Bags",
    "canonical": "https://vividpoly.com/industry/courier-bags",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/industry/courier-bags#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Industries",
            "item": "https://vividpoly.com/industries"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Courier Bags",
            "item": "https://vividpoly.com/industry/courier-bags"
          }
        ]
      }
    ]
  },
  "/industry/fruits-vegetables": {
    "path": "/industry/fruits-vegetables",
    "name": "Fruits & Vegetables Industry",
    "title": "PP Leno & Woven Bags for Produce | VIVIDPOLY",
    "description": "Ventilated leno and woven PP bags for fruits, vegetables and onions. Breathable mesh, custom sizes and export packing supplied from India.",
    "h1": "Leno and Woven Bags for Fruits and Vegetables",
    "canonical": "https://vividpoly.com/industry/fruits-vegetables",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/industry/fruits-vegetables#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Industries",
            "item": "https://vividpoly.com/industries"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Fruits and Vegetables",
            "item": "https://vividpoly.com/industry/fruits-vegetables"
          }
        ]
      }
    ]
  },
  "/blog": {
    "path": "/blog",
    "name": "Blog",
    "title": "News & PP Packaging Updates | VIVIDPOLY India",
    "description": "News, updates and practical guidance on PP woven bag packaging, export standards and product selection from VIVIDPOLY, a PP bag exporter in India.",
    "h1": "VIVIDPOLY News and Packaging Updates",
    "canonical": "https://vividpoly.com/blog",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/blog#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://vividpoly.com/blog"
          }
        ]
      }
    ]
  },
  "/certificates": {
    "path": "/certificates",
    "name": "Certificates",
    "title": "Certifications & Compliance | VIVIDPOLY India",
    "description": "View VIVIDPOLY certifications and compliance standards for export-grade PP woven bag manufacturing and quality assurance from India.",
    "h1": "VIVIDPOLY Certifications and Compliance",
    "canonical": "https://vividpoly.com/certificates",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/certificates#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Certificates",
            "item": "https://vividpoly.com/certificates"
          }
        ]
      }
    ]
  },
  "/quality-assurance": {
    "path": "/quality-assurance",
    "name": "Quality Assurance",
    "title": "Quality Assurance & Testing | VIVIDPOLY India",
    "description": "How VIVIDPOLY controls quality across raw material, weaving, printing, lamination and finishing for reliable export-grade PP bags from India.",
    "h1": "Quality Assurance for Export-Grade PP Bags",
    "canonical": "https://vividpoly.com/quality-assurance",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/quality-assurance#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Quality Assurance",
            "item": "https://vividpoly.com/quality-assurance"
          }
        ]
      }
    ]
  },
  "/recyclable": {
    "path": "/recyclable",
    "name": "Recyclable",
    "title": "Recyclable PP Bags & Sustainability | VIVIDPOLY",
    "description": "Learn how VIVIDPOLY supports recyclable PP woven packaging and responsible material use for export buyers seeking sustainable bag options.",
    "h1": "Recyclable PP Woven Packaging",
    "canonical": "https://vividpoly.com/recyclable",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/recyclable#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Recyclable",
            "item": "https://vividpoly.com/recyclable"
          }
        ]
      }
    ]
  },
  "/testimonials": {
    "path": "/testimonials",
    "name": "Testimonials",
    "title": "Client Testimonials & Reviews | VIVIDPOLY India",
    "description": "Read what global buyers say about working with VIVIDPOLY for export-grade PP woven bags, custom packaging and responsive sourcing from India.",
    "h1": "What Global Buyers Say About VIVIDPOLY",
    "canonical": "https://vividpoly.com/testimonials",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/testimonials#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Testimonials",
            "item": "https://vividpoly.com/testimonials"
          }
        ]
      }
    ]
  },
  "/careers": {
    "path": "/careers",
    "name": "Careers",
    "title": "Careers at VIVIDPOLY | PP Bag Exporter India",
    "description": "Explore career opportunities at VIVIDPOLY, a PP woven bag manufacturer and exporter in India. Join our manufacturing, sales and export teams.",
    "h1": "Build Your Career at VIVIDPOLY",
    "canonical": "https://vividpoly.com/careers",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/careers#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Careers",
            "item": "https://vividpoly.com/careers"
          }
        ]
      }
    ]
  },
  "/price-calculator": {
    "path": "/price-calculator",
    "name": "Price Calculator",
    "title": "PP Bag Price Calculator | VIVIDPOLY India",
    "description": "Estimate PP woven bag pricing by size, type, printing and quantity with the VIVIDPOLY price calculator, then request a confirmed export quote.",
    "h1": "PP Bag Price Calculator",
    "canonical": "https://vividpoly.com/price-calculator",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/price-calculator#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Price Calculator",
            "item": "https://vividpoly.com/price-calculator"
          }
        ]
      }
    ]
  },
  "/product-by-use": {
    "path": "/product-by-use",
    "name": "Product by Use",
    "title": "Find PP Bags by Application | VIVIDPOLY India",
    "description": "Choose the right PP bag by application: food, feed, fertilizer, cement, minerals, retail and more. Practical selection guidance from India.",
    "h1": "Find the Right PP Bag by Application",
    "canonical": "https://vividpoly.com/product-by-use",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/product-by-use#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Product by Use",
            "item": "https://vividpoly.com/product-by-use"
          }
        ]
      }
    ]
  },
  "/privacy-policy": {
    "path": "/privacy-policy",
    "name": "Privacy Policy",
    "title": "Privacy Policy | VIVIDPOLY",
    "description": "Read the VIVIDPOLY privacy policy covering how enquiry and contact information is collected, used and protected on our website.",
    "h1": "VIVIDPOLY Privacy Policy",
    "canonical": "https://vividpoly.com/privacy-policy",
    "schema": [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "https://vividpoly.com/privacy-policy#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vividpoly.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Privacy Policy",
            "item": "https://vividpoly.com/privacy-policy"
          }
        ]
      }
    ]
  }
};

/** Every path covered by the SEO sheet, in sheet order — used to build the sitemap. */
export const seoPaths: string[] = [
  "/",
  "/about",
  "/contact",
  "/inquiries",
  "/products",
  "/products/open-mouth-pp-bags",
  "/products/top-bottom-stitched",
  "/products/d-cut-pp-bags",
  "/products/valve-bags",
  "/products/carry-bags",
  "/products/pinch-bottom-bags",
  "/products/block-bottom-bags",
  "/products/bottom-gusset-bags",
  "/products/pp-woven-bags",
  "/products/bopp-laminated-bags",
  "/products/bopp-open-mouth",
  "/products/bopp-top-bottom-stitched",
  "/products/bopp-d-cut",
  "/products/bopp-valve-bags",
  "/products/bopp-carry-bags",
  "/products/bopp-pinch-bottom",
  "/products/bopp-block-bottom",
  "/products/bopp-bottom-gusset",
  "/products/pp-woven-fabric",
  "/products/weed-barrier",
  "/industries",
  "/industry/flour",
  "/industry/food-grains",
  "/industry/fertilizers",
  "/industry/chemicals",
  "/industry/cement",
  "/industry/minerals",
  "/industry/animal-feed",
  "/industry/sugar",
  "/industry/coal-charcoal",
  "/industry/sandbags",
  "/industry/courier-bags",
  "/industry/fruits-vegetables",
  "/blog",
  "/certificates",
  "/quality-assurance",
  "/recyclable",
  "/testimonials",
  "/careers",
  "/price-calculator",
  "/product-by-use",
  "/privacy-policy"
];

import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
}

/**
 * SEO component that dynamically updates document head meta tags per page.
 * Helps search engines and AI crawlers understand page-specific content.
 */
export function SEOHead({ title, description, keywords, canonicalPath }: SEOHeadProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Update meta keywords if provided
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }
    }

    // Update OG tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // Update canonical if provided
    if (canonicalPath) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', `https://www.vividpoly.com${canonicalPath}`);
    }
  }, [title, description, keywords, canonicalPath]);

  return null;
}

// Pre-defined SEO data for each page
export const pageSEO = {
  home: {
    title: 'VividPoly — PP Woven Bags Manufacturer & Exporter',
    description: 'VividPoly manufactures PP woven bags, BOPP laminated bags, valve bags & woven fabric. ISO certified, custom printed, FOB pricing for 23+ export markets.',
    keywords: 'PP woven bags manufacturer, BOPP laminated bags, polypropylene sacks supplier, woven fabric rolls, bulk packaging exporter, valve bags',
  },
  products: {
    title: 'PP Woven Bags & BOPP Laminated Packaging Products',
    description: 'Explore Vivid Poly complete range of PP woven bags, BOPP laminated bags, valve bags, block bottom bags, D-cut carry bags, and PP woven fabric rolls. Custom sizes, printing, and specifications available.',
    keywords: 'PP woven bags, BOPP laminated bags, valve bags, block bottom bags, D-cut carry bags, open mouth bags, gusseted bags, PP woven fabric, custom printed bags, polypropylene sacks',
  },
  about: {
    title: 'About Vivid Poly - 25+ Years Trading & Export Experience',
    description: 'Vivid Poly is India premier PP woven bags manufacturer with 25+ years of trading and export experience. ISO certified facility in Gujarat serving 20+ countries with premium packaging solutions.',
    keywords: 'Vivid Poly about, PP woven bags manufacturer India, Gujarat packaging company, ISO certified manufacturer, packaging export company India, 25 years experience',
  },
  quality: {
    title: 'Quality Assurance - ISO Certified Manufacturing',
    description: 'Vivid Poly maintains rigorous quality standards with ISO certification. Our PP woven bags undergo comprehensive testing for tensile strength, UV resistance, moisture barrier, and print quality.',
    keywords: 'ISO certified PP bags, quality assurance packaging, PP woven bags testing, packaging quality standards, UV stabilized bags, food grade packaging',
  },
  contact: {
    title: 'Contact Vivid Poly - Get Export Quote',
    description: 'Contact Vivid Poly for PP woven bags export quotes. Offices in India and Australia. Competitive FOB pricing, fast container shipments to 23+ markets worldwide.',
    keywords: 'contact Vivid Poly, PP woven bags quote, export packaging inquiry, bulk bags order, wholesale PP bags price, FOB pricing',
  },
  blog: {
    title: 'Blog - PP Woven Packaging Industry Insights',
    description: 'Expert insights on PP woven packaging industry trends, export tips, product innovations, and sustainable packaging solutions from Vivid Poly.',
    keywords: 'PP woven bags blog, packaging industry news, export packaging tips, sustainable packaging, BOPP laminated bags trends',
  },
  certificates: {
    title: 'Certifications & Compliance',
    description: 'Vivid Poly certifications including ISO quality management. Our PP woven bags meet international standards for food-grade packaging, sustainability, and export compliance.',
    keywords: 'ISO certification PP bags, packaging certifications India, export compliance, food grade packaging certification, quality management system',
  },
  sustainability: {
    title: 'Sustainability - Recyclable PP Woven Packaging',
    description: 'Vivid Poly commitment to sustainable packaging. Our PP woven bags are 100% recyclable, reducing environmental impact while maintaining durability and performance for global markets.',
    keywords: 'recyclable PP bags, sustainable packaging India, eco-friendly woven bags, green packaging solutions, recyclable polypropylene',
  },
  export: {
    title: 'Export Services - Global Shipping & Logistics',
    description: 'Vivid Poly export services cover 23+ countries. Competitive FOB pricing, full container loads, documentation support, and reliable delivery to Australia, Africa, Latin America & Asia.',
    keywords: 'PP bags export India, packaging export services, FOB pricing bags, container shipping packaging, export documentation, global logistics',
  },
};

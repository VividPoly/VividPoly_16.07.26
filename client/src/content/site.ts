// =====================================================
// SITE-WIDE CONTENT (Header, Footer, Company Info)
// Edit this file to update site-wide content
// =====================================================

export const siteContent = {
  // Company Information
  company: {
    name: "VividPoly",
    tagline: "India's Premier Global Export Packaging Company",
    description: "VividPoly is India's leading PP woven bags and BOPP laminated packaging global export company. Founded by multinational engineers from Australia, Canada, USA & India. Serving importers across Australia, Africa, Latin America & Asia with ISO certified quality and competitive FOB pricing.",
    foundedYear: 2020
  },

  // Contact Information (used in header, footer, and contact page)
  contact: {
    phone: "+919998014994",
    alternatePhone: "+61426712534",
    whatsapp: "+919998014994",
    email: "info@vividpoly.com",
    salesEmail: "sales@vividpoly.com",
    exportEmail: "export@vividpoly.com",
    address: {
      street: "Sankalp Square, A 1601, Sindhu Bhavan Marg",
      area: "near Taj Hotel, Bopal",
      cityState: "Ahmedabad, Gujarat 380058",
      country: "India"
    },
    factoryAddress: {
      street: "Vivid Poly, Sherpura Gam",
      area: "Halol Savli Road, Savli",
      cityState: "Vadodara, Gujarat",
      country: "India"
    },
    businessHours: {
      weekdays: "Mon - Sat: 9:00 AM - 7:00 PM IST",
      saturday: "Sat: 9:00 AM - 2:00 PM IST",
      sunday: "Sun: Closed"
    }
  },

  // Social Media Links
  socialMedia: {
    facebook: "https://facebook.com/vividpoly",
    twitter: "https://twitter.com/vividpoly",
    linkedin: "https://linkedin.com/company/vividpoly",
    instagram: "https://instagram.com/vividpoly"
  },

  // Navigation Menu Items
  navigation: [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Quality Assurance", href: "/quality-assurance" },
    { name: "100% Recyclable", href: "/recyclable" },
    { name: "Sustainability", href: "/blog" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Contact", href: "/contact" }
  ],

  // Footer Quick Links
  footerLinks: {
    quickLinks: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about" },
      { name: "Products", href: "/products" },
      { name: "Sustainability Blog", href: "/blog" },
      { name: "Certificates", href: "/certificates" },
      { name: "Contact Us", href: "/contact" }
    ],
    products: [
      "PP Woven Fabric Rolls",
      "Laminated PP Woven Bags",
      "BOPP Laminated Bags",
      "Valve Bags",
      "Custom Printed Bags"
    ]
  },

  // Footer Copyright
  footer: {
    copyright: "VividPoly. All rights reserved.",
    tagline: "India's Premier Global Export Packaging Company | PP Woven Bags & BOPP Laminated Bags Exporter"
  },

  // Languages supported
  languages: [
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
    { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
    { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
    { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
    { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
    { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
    { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
    { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
    { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
    { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
    { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
    { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" }
  ]
};

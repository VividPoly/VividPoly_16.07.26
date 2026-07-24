import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Globe, ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Bahasa', flag: '🇮🇩' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vividpoly-lang') || 'en';
    }
    return 'en';
  });
  const { user, isAuthenticated } = useAuth();

  const handleLanguageChange = (code: string) => {
    setCurrentLang(code);
    localStorage.setItem('vividpoly-lang', code);
    setShowLangMenu(false);
    document.documentElement.lang = code;
    window.dispatchEvent(new Event('vividpoly-lang-change'));
  };

  const currentLangData = languages.find(l => l.code === currentLang) || languages[0];

  const navigation = [
    { 
      name: "About Us", 
      href: "/about",
      dropdown: [
        { name: "Company Overview", href: "/about" },
        { name: "Our Infrastructure", href: "/quality-assurance" },
        { name: "Certificates", href: "/certificates" },
        { name: "Testimonials", href: "/testimonials" },
      ]
    },
    { 
      name: "Products", 
      href: "/products",
      megaMenu: true,
      columns: [
        {
          title: "Main Categories",
          items: [
            { name: "PP Woven Fabrics", href: "/products/pp-woven-fabric" },
            { name: "PP Woven Bags", href: "/products/pp-woven-bags" },
            { name: "BOPP Laminated Bags", href: "/products/bopp-laminated-bags" },
          ]
        },
        {
          title: "PP Woven Bags",
          items: [
            { name: "Open Mouth PP Bags", href: "/products/open-mouth-pp-bags" },
            { name: "Top & Bottom Stitched", href: "/products/top-bottom-stitched" },
            { name: "D-Cut PP Woven Bags", href: "/products/d-cut-pp-bags" },
            { name: "Valve Bags", href: "/products/valve-bags" },
            { name: "PP Carry Bags", href: "/products/carry-bags" },
            { name: "Pinch Bottom Bags", href: "/products/pinch-bottom-bags" },
            { name: "Block Bottom Bags", href: "/products/block-bottom-bags" },
            { name: "Bottom Gusset Bags", href: "/products/bottom-gusset-bags" },
          ]
        },
        {
          title: "BOPP Laminated Bags",
          items: [
            { name: "BOPP Open Mouth Bags", href: "/products/bopp-open-mouth" },
            { name: "BOPP Top & Bottom Stitched", href: "/products/bopp-top-bottom-stitched" },
            { name: "BOPP D-Cut Bags", href: "/products/bopp-d-cut" },
            { name: "BOPP Valve Bags", href: "/products/bopp-valve-bags" },
            { name: "BOPP Carry Bags", href: "/products/bopp-carry-bags" },
            { name: "BOPP Pinch Bottom Bags", href: "/products/bopp-pinch-bottom" },
            { name: "BOPP Block Bottom Bags", href: "/products/bopp-block-bottom" },
            { name: "BOPP Bottom Gusset Bags", href: "/products/bopp-bottom-gusset" },
          ]
        }
      ]
    },
    { 
      name: "Sustainability", 
      href: "/recyclable",
      dropdown: [
        { name: "Recyclable Products", href: "/recyclable" },
        { name: "Environmental Commitment", href: "/recyclable" },
        { name: "Sustainability Blog", href: "/blog" },
      ]
    },
    { name: "Industry Use", href: "/product-by-use" },
    { name: "Careers", href: "/careers" },
  ];

  const ctaButton = { name: "Get Quote", href: "/inquiries" };

  const topLinks = [
    { name: "Blog", href: "/blog" },
    { name: "Certificates", href: "/certificates" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="bg-[#1A1A1A] hidden lg:block">
        <div className="container mx-auto flex items-center justify-between py-1.5">
          <div className="flex items-center gap-4 text-xs text-white/70">
            <a href="mailto:info@vividpoly.com" className="hover:text-white transition-colors">info@vividpoly.com</a>
            <span className="text-white/30">|</span>
            <a href="https://wa.me/919998014994" className="hover:text-white transition-colors">(+91) 99980-14994</a>
          </div>
          <div className="flex items-center gap-4">
            {topLinks.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <Link 
                  href={item.href}
                  className="text-white/70 hover:text-white text-xs transition-colors"
                >
                  {item.name}
                </Link>
                {index < topLinks.length - 1 && (
                  <span className="ml-4 text-white/30">|</span>
                )}
              </div>
            ))}
            {/* Language Switcher */}
            <div className="relative ml-3 notranslate" translate="no">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 text-white/70 hover:text-white text-xs transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>{currentLangData.flag} {currentLangData.code.toUpperCase()}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-md shadow-xl border border-gray-100 py-1 z-50 max-h-72 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                        currentLang === lang.code ? 'bg-gray-50 font-semibold text-[#DC2626]' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto flex items-center justify-between py-0">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/media/vividpoly-red-logo_8b59cad5.png" 
              alt="VividPoly - Quality Packaging Solutions" 
              className="h-14 md:h-16 lg:h-18 w-auto py-2"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-0">
            {navigation.map((item) => (
              <div 
                key={item.name}
                className="relative"
                onMouseEnter={() => (item.dropdown || item.megaMenu) && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link 
                  href={item.href}
                  className="flex items-center px-4 py-5 text-[#1A1A1A] hover:text-[#DC2626] transition-colors font-medium text-sm tracking-wide"
                >
                  {item.name}
                  {(item.dropdown || item.megaMenu) && <ChevronDown className="ml-1 h-3.5 w-3.5" />}
                </Link>
                
                {/* Regular Dropdown */}
                {item.dropdown && !item.megaMenu && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 bg-white shadow-lg border border-gray-100 min-w-[220px] py-2 z-50">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#DC2626] transition-colors text-sm"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* Mega Menu for Products */}
                {item.megaMenu && item.columns && activeDropdown === item.name && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-xl border border-gray-100 z-50 min-w-[700px]">
                    <div className="grid grid-cols-3 gap-0">
                      {item.columns.map((column, colIndex) => (
                        <div key={column.title} className={`py-4 px-5 ${colIndex < item.columns.length - 1 ? 'border-r border-gray-100' : ''}`}>
                          <h4 className="text-[#DC2626] font-bold text-xs mb-3 uppercase tracking-wider">
                            {column.title}
                          </h4>
                          <ul className="space-y-0.5">
                            {column.items.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  className="block py-1.5 text-gray-700 hover:text-[#DC2626] transition-colors text-sm"
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                      <Link href="/products" className="text-[#DC2626] font-semibold text-sm hover:underline">
                        View All Products →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.length > 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm py-2 px-3 pr-9 w-44 rounded focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/20"
              />
              <Search 
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-[#DC2626]" 
                onClick={() => {
                  if (searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
              />
              {showSearchResults && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-md shadow-xl border border-gray-100 z-50 py-2 w-72">
                  <div className="px-3 py-1.5 text-xs text-gray-500 border-b font-medium uppercase tracking-wider">Products</div>
                  <div className="max-h-64 overflow-y-auto">
                    {["PP Woven Bags", "BOPP Laminated Bags", "PP Woven Fabric", "Open Mouth PP Bags", "Valve Bags", "D-Cut PP Woven Bags", "Carry Bags", "Pinch Bottom Bags", "Block Bottom Bags"].map((name) => (
                      <Link 
                        key={name}
                        href={`/products/${name.toLowerCase().replace(/\s+/g, '-').replace(/pp-/g, 'pp-')}`} 
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#DC2626]" 
                        onClick={() => setShowSearchResults(false)}
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp (replaces the old floating widget) */}
            <a
              href="https://wa.me/919998014994"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              title="Chat on WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors hover:bg-[#128C7E]"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>

            {/* Get Quote CTA */}
            <Link href={ctaButton.href}>
              <button className="btn-primary text-xs px-5 py-2.5">
                {ctaButton.name}
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-[#1A1A1A]" />
            ) : (
              <Menu className="h-6 w-6 text-[#1A1A1A]" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-gray-100 shadow-lg">
          <div className="container py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link 
                  href={item.href}
                  className="flex items-center justify-between py-3 text-[#1A1A1A] hover:text-[#DC2626] transition-colors font-medium text-sm"
                  onClick={() => !item.dropdown && setMobileMenuOpen(false)}
                >
                  {item.name}
                  {item.dropdown && <ChevronDown className="h-4 w-4 text-gray-400" />}
                </Link>
                {item.dropdown && (
                  <div className="pl-4 space-y-0.5 border-l-2 border-gray-200 ml-2">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block py-2 text-gray-600 hover:text-[#DC2626] text-sm transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
              {topLinks.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className="block py-2 text-gray-600 hover:text-[#DC2626] text-sm transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="pt-3 border-t border-gray-100">
              <Link href={ctaButton.href} onClick={() => setMobileMenuOpen(false)}>
                <button className="btn-primary w-full text-sm py-3">
                  {ctaButton.name}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

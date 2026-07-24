import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram, Youtube, Globe, ArrowRight } from "lucide-react";
import { siteContent } from "@/content/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { contact, company, socialMedia } = siteContent;

  return (
    <footer role="contentinfo">
      {/* Main Footer Content */}
      <div className="bg-[#1A1A1A] text-white">
        <div className="container py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link href="/">
                <img 
                  src="/media/vividpoly-logo-white_3fb81a9d.png" 
                  alt="VividPoly - Global Export Packaging Company" 
                  className="h-16 w-auto mb-4"
                />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-sm">
                {company.description}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-[#DC2626]" />
                <span className="text-[#DC2626] text-sm font-medium">Exporting to 70+ Countries Worldwide</span>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-3 mt-5">
                <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded bg-white/10 flex items-center justify-center hover:bg-[#DC2626] transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded bg-white/10 flex items-center justify-center hover:bg-[#DC2626] transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded bg-white/10 flex items-center justify-center hover:bg-[#DC2626] transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://youtube.com/@vividpoly" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded bg-white/10 flex items-center justify-center hover:bg-[#DC2626] transition-colors">
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-5">Products</h3>
              <ul className="space-y-2.5">
                <li><Link href="/products/pp-woven-bags" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">PP Woven Bags</Link></li>
                <li><Link href="/products/bopp-laminated-bags" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">BOPP Laminated Bags</Link></li>
                <li><Link href="/products/pp-woven-fabric" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">PP Woven Fabric Rolls</Link></li>
                <li><Link href="/products/valve-bags" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">Valve Bags</Link></li>
                <li><Link href="/products/block-bottom-bags" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">Block Bottom Bags</Link></li>
                <li><Link href="/products/pinch-bottom-bags" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">Pinch Bottom Bags</Link></li>
                <li><Link href="/products/carry-bags" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">D-Cut Carry Bags</Link></li>
                <li><Link href="/inquiries" className="text-[#DC2626] hover:text-white transition-colors text-sm font-medium">Request Quote →</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-5">Company</h3>
              <ul className="space-y-2.5">
                <li><Link href="/about" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">About Us</Link></li>
                <li><Link href="/quality-assurance" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">Infrastructure</Link></li>
                <li><Link href="/certificates" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">Certificates</Link></li>
                <li><Link href="/product-by-use" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">Product By Use</Link></li>
                <li><Link href="/recyclable" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">Sustainability</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">Blog</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-[#DC2626] transition-colors text-sm">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-5">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-[#DC2626] mt-0.5 flex-shrink-0" />
                  <div className="text-gray-400 text-sm">
                    <span className="font-medium text-white">Corporate Office</span><br />
                    {contact.address.street}<br />
                    {contact.address.area}<br />
                    {contact.address.cityState}
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-[#DC2626] mt-0.5 flex-shrink-0" />
                  <div className="text-gray-400 text-sm">
                    <span className="font-medium text-white">Factory</span><br />
                    {contact.factoryAddress.street}<br />
                    {contact.factoryAddress.area}<br />
                    {contact.factoryAddress.cityState}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-[#DC2626] flex-shrink-0" />
                  <div className="text-sm">
                    <a href={`tel:${contact.phone}`} className="text-gray-400 hover:text-[#DC2626] transition-colors block">
                      +91 99980 14994 (India)
                    </a>
                    <a href={`tel:${contact.alternatePhone}`} className="text-gray-400 hover:text-[#DC2626] transition-colors block">
                      +61 426 712 534 (Intl)
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-[#DC2626] flex-shrink-0" />
                  <div className="text-sm">
                    <a href={`mailto:${contact.email}`} className="text-gray-400 hover:text-[#DC2626] transition-colors block">
                      {contact.email}
                    </a>
                    <a href={`mailto:${contact.exportEmail}`} className="text-gray-400 hover:text-[#DC2626] transition-colors block">
                      {contact.exportEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Markets Bar */}
      <div className="bg-[#111111] border-t border-white/5">
        <div className="container py-4">
          <p className="text-center text-gray-500 text-xs">
            <span className="font-medium text-gray-400">Export Markets:</span> Australia | New Zealand | Nigeria | Ghana | Kenya | Tanzania | Brazil | Argentina | Chile | Japan | Sri Lanka | Vietnam | Philippines | Indonesia | Thailand | Cameroon | Senegal | Uganda | Colombia | Peru | Myanmar | Bangladesh | Nepal
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0A0A0A] border-t border-white/5">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
            <span className="text-gray-500">
              &copy; {currentYear} VividPoly Industries. All rights reserved.
            </span>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">Terms of Use</Link>
              <Link href="/sitemap" className="text-gray-500 hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

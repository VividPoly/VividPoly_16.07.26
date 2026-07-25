import { Link } from "wouter";
import { ArrowRight, ChevronRight } from "lucide-react";
import { productCategories } from "@/data/productCategories";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead, pageSEO } from "@/components/SEOHead";

// Add-on features data
const addOnFeatures = [
  { id: "layers-liners", name: "Layers & Liners", description: "Protective layers that enhance barrier properties", options: ["PE Liner", "Aluminum Foil", "Paper Liner", "Woven Liner"] },
  { id: "flexo-printing", name: "Flexo Printing", description: "High-quality printing for brand visibility", options: ["1-6 Colors", "Water-based Inks", "UV-resistant Inks", "Food-safe Inks"] },
  { id: "gusset-options", name: "Gusset Options", description: "Expandable sides for increased capacity", options: ["Side Gusset", "Bottom Gusset", "K-seal Bottom", "Square Bottom"] },
  { id: "cutting-types", name: "Types of Cutting", description: "Various cutting methods for different styles", options: ["Straight Cut", "Hot Cut", "Ultrasonic Cut", "Die Cut"] },
  { id: "stitching-types", name: "Types of Stitching", description: "Secure closure options for bag tops", options: ["Chain Stitch", "Lock Stitch", "Overlock", "Double Stitch"] },
  { id: "window-feature", name: "Window Feature", description: "Transparent window to showcase contents", options: ["Front Window", "Back Window", "Side Window", "Custom Shape"] },
  { id: "perforation", name: "Perforation", description: "Micro-holes for ventilation and freshness", options: ["Micro Perforation", "Macro Perforation", "Laser Perforation", "Custom Pattern"] },
  { id: "handle-types", name: "Handle Types", description: "Various handle options for easy carrying", options: ["Die-cut Handle", "Rope Handle", "Soft Loop Handle", "Patch Handle", "Webbing Handle"] }
];

export default function Products() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead {...pageSEO.products} canonicalPath="/products" />
      <Header />
      
      {/* Hero Banner */}
      <section className="bg-[#1A1A1A] py-20">
        <div className="container">
          <nav className="text-gray-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Products</span>
          </nav>
          <div className="inline-block bg-[#DC2626] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 mb-4">
            Our Range
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Product Categories
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Comprehensive PP woven packaging solutions for every industry need. 
            Quality manufacturing, global delivery.
          </p>
        </div>
      </section>

      {/* Product Categories Grid */}
      <section className="py-16">
        <div className="container">
          <div className="space-y-8">
            {productCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/products/${category.slug}`} className="group block">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-64 md:h-auto overflow-hidden bg-gray-50">
                      <img 
                        src={category.images[0]} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="md:w-2/3 p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-[#DC2626] text-white text-xs font-bold px-3 py-1">
                          {category.shortName}
                        </span>
                        {category.subCategories && (
                          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1">
                            {category.subCategories.length} Sub-categories
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#DC2626] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-3">{category.tagline}</p>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {category.introduction.substring(0, 200)}...
                      </p>
                      <div className="flex items-center text-[#DC2626] font-bold text-sm">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Subcategories */}
                {category.subCategories && category.subCategories.length > 0 && (
                  <div className="border-t border-gray-100 bg-[#F8F8F8] p-6">
                    <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
                      Sub-Categories
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {category.subCategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/products/${sub.slug}`}
                          className="group flex items-center gap-2 bg-white rounded px-4 py-3 hover:shadow-md hover:border-[#DC2626] transition-all border border-gray-100"
                        >
                          <ChevronRight className="w-4 h-4 text-[#DC2626] flex-shrink-0" />
                          <span className="text-sm text-gray-700 group-hover:text-[#DC2626] font-medium truncate">
                            {sub.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-on Features Section */}
      <section className="py-16 bg-[#F8F8F8]">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-[#DC2626] text-xs font-bold uppercase tracking-widest">Customization</span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] mt-3 mb-3">Add-on Features</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Customize your packaging with our range of value-added features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {addOnFeatures.map((feature) => (
              <div 
                key={feature.id}
                className="bg-white rounded-lg p-5 border border-gray-100 hover:border-[#DC2626] hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-[#1A1A1A] text-sm mb-2">{feature.name}</h3>
                <p className="text-gray-400 text-xs mb-3">{feature.description}</p>
                <div className="flex flex-wrap gap-1">
                  {feature.options.slice(0, 3).map((option, idx) => (
                    <span key={idx} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                      {option}
                    </span>
                  ))}
                  {feature.options.length > 3 && (
                    <span className="text-xs text-gray-400">+{feature.options.length - 3} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#DC2626]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Looking for Custom Packaging?
              </h2>
              <p className="text-white/80">
                Our team is ready to help you find the perfect solution.
              </p>
            </div>
            <Link href="/inquiries">
              <button className="bg-white text-[#DC2626] px-8 py-3.5 font-bold text-sm hover:bg-gray-100 transition-colors whitespace-nowrap rounded">
                Request a Quote
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

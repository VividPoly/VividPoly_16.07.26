import { Link, useParams } from "wouter";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Check, ChevronRight, Factory, Layers, Package, Ruler, Star, Cog, Award } from "lucide-react";
import { productCategories, findProductBySlug, getParentCategory, type ProductCategory, type SubCategory } from "@/data/productCategories";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Find the product (could be main category or subcategory)
  const product = findProductBySlug(slug || "");
  const parentCategory = getParentCategory(slug || "");
  const isSubCategory = !!parentCategory;
  
  // Type guard to check if product has subcategories (main category)
  const hasSubCategories = (p: ProductCategory | SubCategory): p is ProductCategory => {
    return 'subCategories' in p && !!p.subCategories;
  };
  
  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product category you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb */}
      <section className="bg-gray-50 border-b">
        <div className="container py-4">
          <nav className="flex items-center text-sm text-gray-600 flex-wrap">
            <Link href="/" className="hover:text-red-600">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/products" className="hover:text-red-600">Products</Link>
            {isSubCategory && parentCategory && (
              <>
                <ChevronRight className="w-4 h-4 mx-2" />
                <Link href={`/products/${parentCategory.slug}`} className="hover:text-red-600">
                  {parentCategory.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Hero Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                <img 
                  src={product.images[activeImageIndex]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
                    {product.shortName}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === activeImageIndex ? 'border-red-600' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-xl text-red-600 font-medium mb-6">
                {product.tagline}
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {product.introduction}
              </p>

              {/* Quick Features */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.slice(0, 6).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/inquiries">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    Request Quote
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories Section (only for main categories with subcategories) */}
      {hasSubCategories(product) && product.subCategories && product.subCategories.length > 0 && (
        <section className="py-12 bg-red-50">
          <div className="container">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Product Types</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.subCategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/products/${sub.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      <img 
                        src={sub.images[0]} 
                        alt={sub.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-1">
                        {sub.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{sub.tagline}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Detailed Information Tabs */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start bg-white rounded-lg p-1 mb-8 flex-wrap h-auto gap-1">
              <TabsTrigger value="details" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Package className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="specifications" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Ruler className="w-4 h-4 mr-2" />
                Specifications
              </TabsTrigger>
              <TabsTrigger value="speciality" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Star className="w-4 h-4 mr-2" />
                Speciality
              </TabsTrigger>
              <TabsTrigger value="manufacturing" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Cog className="w-4 h-4 mr-2" />
                Manufacturing
              </TabsTrigger>
              <TabsTrigger value="materials" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Layers className="w-4 h-4 mr-2" />
                Materials
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="bg-white rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Introduction</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {product.introduction}
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>
                  <ul className="space-y-2 mb-6">
                    {product.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications</h3>
                  <ul className="space-y-2">
                    {product.applications.map((app, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ArrowRight className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="bg-white rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-red-50">
                      <th className="text-left p-4 font-semibold text-gray-900 border border-gray-200">Parameter</th>
                      <th className="text-left p-4 font-semibold text-gray-900 border border-gray-200">Value / Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.specifications.map((spec, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-4 border border-gray-200 font-medium text-gray-700">
                          {spec.label}
                        </td>
                        <td className="p-4 border border-gray-200 text-gray-600">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                * Specifications can be customized based on customer requirements. Contact us for specific needs.
              </p>
            </TabsContent>

            {/* Speciality Tab */}
            <TabsContent value="speciality" className="bg-white rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What Makes Us Special</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Speciality</h3>
                  <p className="text-gray-700">{product.speciality}</p>
                </div>
                {'productionCapacity' in product && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <Factory className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Production Capacity</h3>
                    <p className="text-gray-700">{(product as ProductCategory).productionCapacity}</p>
                  </div>
                )}
                {'whyChooseUs' in product && (
                  <div className="bg-gray-50 rounded-lg p-6 md:col-span-2">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <Award className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Choose VividPoly</h3>
                    <p className="text-gray-700">{(product as ProductCategory).whyChooseUs}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Manufacturing Tab */}
            <TabsContent value="manufacturing" className="bg-white rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Manufacturing Process</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Cog className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Production Process</h3>
                    <p className="text-gray-700 leading-relaxed">{product.manufacturingProcess}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials" className="bg-white rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Material Composition</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Layers className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Materials & Composition</h3>
                    <p className="text-gray-700 leading-relaxed">{product.materialComposition}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Add-on Features Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Add-on Features Available</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Custom Printing", desc: "Up to 8-color flexographic or rotogravure printing with your brand design", icon: "🎨" },
              { title: "UV Protection", desc: "UV-stabilized material for outdoor storage and extended shelf life", icon: "☀️" },
              { title: "Anti-Slip Coating", desc: "Special coating for secure stacking during transport and storage", icon: "🔒" },
              { title: "Liner Options", desc: "PE liner, kraft paper liner, or aluminum foil for moisture barrier", icon: "🛡️" },
              { title: "Easy-Open Features", desc: "Tear strips, perforations, or zipper closures for convenience", icon: "✂️" },
              { title: "Handle Options", desc: "D-cut, patch handle, or rope handle for easy carrying", icon: "👜" },
              { title: "Ventilation", desc: "Micro-perforations or mesh panels for breathable packaging", icon: "💨" },
              { title: "Food Grade", desc: "Food-safe materials compliant with international food packaging standards", icon: "🍽️" },
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow">
                <span className="text-2xl mb-3 block">{feature.icon}</span>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inline Inquiry CTA */}
      <section className="py-12 bg-gradient-to-r from-[#DC2626] to-[#1A1A1A]">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Need a Custom Quote for {product.name}?
              </h2>
              <p className="text-red-100 mb-6">
                Our export team provides competitive pricing for bulk orders. 
                Get a response within 24 hours with detailed specifications and pricing.
              </p>
              <ul className="space-y-2 text-red-100">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-red-300" /> Free samples available for qualified buyers</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-red-300" /> Custom sizes, printing, and specifications</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-red-300" /> Export to 70+ countries worldwide</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-red-300" /> Competitive FOB/CIF/CFR pricing</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Inquiry</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500" />
                <input type="email" placeholder="Email Address" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500" />
                <input type="text" placeholder="Quantity Required" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500" />
                <textarea placeholder="Your Requirements..." rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 resize-none" />
                <Link href="/inquiries">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Submit Inquiry
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productCategories
              .filter(c => c.id !== product.id && (!isSubCategory || c.id !== parentCategory?.id))
              .slice(0, 4)
              .map((relatedCategory) => (
                <Link 
                  key={relatedCategory.id} 
                  href={`/products/${relatedCategory.slug}`}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={relatedCategory.images[0]} 
                        alt={relatedCategory.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                        {relatedCategory.name}
                      </h3>
                      <p className="text-sm text-gray-500">{relatedCategory.shortName}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Order {product.name}?
            </h2>
            <p className="text-red-100 mb-8 max-w-2xl mx-auto">
              Get competitive pricing and fast delivery for your packaging needs. 
              Our team is ready to assist you with customization options.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/inquiries">
                <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
                  Request a Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-red-700">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

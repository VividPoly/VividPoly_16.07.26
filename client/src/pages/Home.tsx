import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Globe, ChevronLeft, ChevronRight, Play } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShowcaseSlider from "@/components/ShowcaseSlider";
import { SEOHead, pageSEO } from "@/components/SEOHead";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = trpc.products.featured.useQuery();
  const { data: testimonials, isLoading: testimonialsLoading } = trpc.testimonials.featured.useQuery();
  const [currentSlide, setCurrentSlide] = useState(0);
  const industryRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const scrollBy = (ref: React.RefObject<HTMLDivElement>, dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 420), behavior: "smooth" });
  };
  const scrollIndustries = (dir: 1 | -1) => scrollBy(industryRef, dir);
  const scrollProducts = (dir: 1 | -1) => scrollBy(productsRef, dir);

  // Hero slideshow images
  const heroSlides = [
    { src: "/media/vividpoly_conference_room_HR_f1862d4a.webp", alt: "VividPoly Leadership" },
    { src: "/factory/factory-floor.jpg", alt: "VividPoly Factory Floor" },
    { src: "/factory/circular-loom-main.jpg", alt: "Circular Loom Manufacturing" },
    { src: "/media/circular-loom-blue_f43584da.jpg", alt: "Circular Loom Production" },
    { src: "/factory/tape-extrusion.jpg", alt: "Tape Extrusion Line" },
  ];

  // Auto-rotate hero slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Static products for carousel
  const staticProducts = [
    { id: "pp-woven-bags", name: "PP Woven Bags", image: "/products/photos/open-mouth-1.webp", description: "Durable & Lightweight Packaging" },
    { id: "bopp-laminated-bags", name: "BOPP Laminated Bags", image: "/products/photos/bopp-front.webp", description: "Premium Food-Grade Packaging" },
    { id: "pp-woven-fabric", name: "PP Woven Fabrics", image: "/products/photos/fabric-roll-red.webp", description: "The Heart of Woven Industry" },
    { id: "carry-bags", name: "PP Carry Bags", image: "/products/photos/carry-multi.webp", description: "Eco-Friendly Shopping Bags" },
    { id: "d-cut-pp-bags", name: "D-Cut PP Bags", image: "/products/photos/d-cut-green.webp", description: "Retail-Ready Woven Bags" },
    { id: "block-bottom-bags", name: "Block Bottom Bags", image: "/products/photos/block-c-blk.webp", description: "Flat-Base Stacking Bags" },
    { id: "weed-barrier", name: "Weed Barrier", image: "/products/photos/weed-barrier-1.webp", description: "Agricultural Ground Cover" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead {...pageSEO.home} canonicalPath="/" />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Modern Dark with Slideshow */}
        <section className="relative min-h-[620px] flex items-center overflow-hidden bg-[#1A1A1A]">
          {/* Background Slideshow */}
          <div className="absolute inset-0">
            {heroSlides.map((img, index) => (
              <img decoding="async" 
                key={index}
                src={img.src} 
                alt={img.alt} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? 'opacity-30' : 'opacity-0'}`}
              />
            ))}
          </div>
          
          {/* Content */}
          <div className="container relative z-10 py-20">
            <div className="max-w-3xl">
              <div className="inline-block bg-[#DC2626] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 mb-6">
                ISO 9001:2015 Certified
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                PP Woven Bags<br />
                <span className="text-[#DC2626]">Manufacturer & Exporter</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl">
                Leading polypropylene woven sacks supplier serving 70+ export markets. 
                Premium quality PP woven bags, BOPP laminated bags, and custom printed packaging with competitive FOB pricing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="w-full sm:w-auto">
                  <button className="btn-primary text-sm px-8 py-3.5 inline-flex items-center justify-center w-full sm:w-auto">
                    Explore Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
                <Link href="/inquiries" className="w-full sm:w-auto">
                  <button className="border-2 border-white text-white px-8 py-3.5 text-sm font-bold hover:bg-white hover:text-[#1A1A1A] transition-all inline-flex items-center justify-center w-full sm:w-auto">
                    Get a Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-[#DC2626] w-8' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-white border-b">
          <div className="container py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#DC2626]">20+</div>
                <div className="text-sm text-gray-500 mt-1">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#DC2626]">70+</div>
                <div className="text-sm text-gray-500 mt-1">Export Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#DC2626]">500+</div>
                <div className="text-sm text-gray-500 mt-1">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#DC2626]">100%</div>
                <div className="text-sm text-gray-500 mt-1">Recyclable Products</div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20 bg-[#F8F8F8]">
          <div className="container">
            <div className="text-center mb-12">
              <span className="text-[#DC2626] text-xs font-bold uppercase tracking-widest">What We Offer</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mt-3">Our Products</h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                Premium PP woven packaging solutions for global buyers
              </p>
            </div>

            {/* Product Carousel — responsive scroll-snap */}
            <div className="relative max-w-6xl mx-auto">
              <div
                ref={productsRef}
                className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {staticProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="snap-start shrink-0 w-[62%] sm:w-[45%] lg:w-[30%] xl:w-[23%]"
                  >
                    <div className="h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100">
                      <div className="h-44 md:h-52 overflow-hidden bg-gray-50">
                        <img loading="lazy" decoding="async"
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-bold text-[#1A1A1A] text-base mb-1">{product.name}</h3>
                        <p className="text-gray-400 text-sm">{product.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollProducts(-1)}
                aria-label="Previous"
                className="absolute left-1 md:-left-4 top-1/2 -translate-y-1/2 z-10 grid h-9 w-9 md:h-11 md:w-11 place-items-center rounded-full bg-[#DC2626]/90 md:bg-[#DC2626] text-white shadow-lg transition hover:bg-[#B91C1C]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollProducts(1)}
                aria-label="Next"
                className="absolute right-1 md:-right-4 top-1/2 -translate-y-1/2 z-10 grid h-9 w-9 md:h-11 md:w-11 place-items-center rounded-full bg-[#DC2626]/90 md:bg-[#DC2626] text-white shadow-lg transition hover:bg-[#B91C1C]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center mt-10">
              <Link href="/products">
                <button className="btn-primary text-sm px-8 py-3 inline-flex items-center">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* About / Sustainability Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-[#DC2626] text-xs font-bold uppercase tracking-widest">About VividPoly</span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mt-3 mb-6">
                  Engineering a Sustainable Future
                </h2>
                <p className="text-gray-600 leading-relaxed mb-5">
                  As a responsible PP woven bags manufacturer, VividPoly produces eco-friendly woven polypropylene 
                  packaging solutions that are 100% recyclable and reusable. Our commitment to sustainable 
                  manufacturing aims to achieve Carbon Neutrality by 2040.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  With 95% manufacturing waste recycled back into production, we deliver durable polypropylene 
                  sacks that serve agriculture, construction, and retail industries sustainably across 70+ countries.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/about">
                    <button className="btn-primary text-sm px-6 py-3 inline-flex items-center">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <img loading="lazy" decoding="async" 
                  src="/factory/circular-loom-main.jpg" 
                  alt="Sustainable Manufacturing" 
                  className="rounded-lg shadow-xl w-full"
                />
                <div className="absolute -bottom-5 -left-5 bg-[#DC2626] text-white p-5 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm">Recyclable</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industries Served - peek slider (swipe to see more), View All link, no arrows */}
        <section className="py-20 bg-[#1A1A1A]">
          <div className="container">
            <div className="text-center mb-12">
              <span className="text-[#DC2626] text-xs font-bold uppercase tracking-widest">Sectors</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">Industries We Serve</h2>
              <p className="text-gray-400 mt-3 max-w-xl mx-auto">
                Packaging solutions for agriculture, construction, food processing, and more
              </p>
            </div>
            <div className="relative">
            <div ref={industryRef} className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { name: "Animal Feed", image: "/media/animal-feed-product_dbdf3256.jpg", slug: "animal-feed" },
                { name: "Cement", image: "/industries/cement-product.jpg", slug: "cement" },
                { name: "Fertilizers", image: "/industries/fertilizers-grains.jpg", slug: "fertilizers" },
                { name: "Food Grains", image: "/industries/rice-product.jpg", slug: "food-grains" },
                { name: "Flour", image: "/industries/flour-product.jpg", slug: "flour" },
                { name: "Sugar", image: "/industries/sugar-product.jpg", slug: "sugar" },
                { name: "Minerals", image: "/industries/cement-product.jpg", slug: "minerals" },
                { name: "Courier Bags", image: "/industries/courier.jpg", slug: "courier-bags" },
              ].map((industry, index) => (
                <Link key={index} href={`/industry/${industry.slug}`} className="snap-start shrink-0 w-[58%] sm:w-[42%] lg:w-[30%] xl:w-[23%]">
                  <div className="group cursor-pointer relative overflow-hidden rounded-lg">
                    <img loading="lazy" decoding="async"
                      src={industry.image}
                      alt={industry.name}
                      className="w-full h-44 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="text-white font-bold text-sm">{industry.name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
              <button
                type="button"
                onClick={() => scrollIndustries(-1)}
                aria-label="Previous"
                className="absolute left-1 md:-left-4 top-1/2 -translate-y-1/2 z-10 grid h-9 w-9 md:h-11 md:w-11 place-items-center rounded-full bg-[#DC2626]/90 md:bg-[#DC2626] text-white shadow-lg transition hover:bg-[#B91C1C]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollIndustries(1)}
                aria-label="Next"
                className="absolute right-1 md:-right-4 top-1/2 -translate-y-1/2 z-10 grid h-9 w-9 md:h-11 md:w-11 place-items-center rounded-full bg-[#DC2626]/90 md:bg-[#DC2626] text-white shadow-lg transition hover:bg-[#B91C1C]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="text-center mt-8">
              <Link href="/industries" className="inline-flex items-center gap-1 text-sm font-bold text-white hover:text-[#DC2626] transition-colors">
                View All Industries
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Applications showcase slider (replaces the old Product-by-Use card grid) */}
        <ShowcaseSlider />

        {/* Global Export Markets */}
        <section className="py-20 bg-[#F8F8F8]">
          <div className="container">
            <div className="text-center mb-12">
              <span className="text-[#DC2626] text-xs font-bold uppercase tracking-widest">Global Reach</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mt-3">Export Markets</h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                Trusted by importers and distributors across 70+ countries
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
              {[
                { region: "Australia & NZ", countries: "Australia, New Zealand, Fiji" },
                { region: "West Africa", countries: "Nigeria, Ghana, Cameroon" },
                { region: "East Africa", countries: "Kenya, Tanzania, Uganda" },
                { region: "Latin America", countries: "Brazil, Argentina, Chile" },
                { region: "South Asia", countries: "Sri Lanka, Bangladesh, Nepal" },
                { region: "SE Asia", countries: "Vietnam, Philippines, Indonesia" },
              ].map((market, index) => (
                <div key={index} className="text-center p-5 bg-white rounded-lg border border-gray-100 hover:border-[#DC2626] hover:shadow-md transition-all group">
                  <Globe className="w-8 h-8 mx-auto mb-3 text-[#DC2626]" />
                  <h3 className="font-bold text-[#1A1A1A] text-sm mb-1">{market.region}</h3>
                  <p className="text-xs text-gray-400">{market.countries}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#DC2626] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 1200 400" className="w-full h-full">
              <path d="M0,200 Q300,100 600,200 T1200,200" stroke="#fff" strokeWidth="3" fill="none"/>
              <path d="M0,250 Q300,150 600,250 T1200,250" stroke="#fff" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <div className="container relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Get in touch with us for custom packaging solutions tailored to your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-white text-[#DC2626] px-8 py-3.5 text-sm font-bold hover:bg-gray-100 transition-all inline-flex items-center rounded">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
              <Link href="/products">
                <button className="border-2 border-white text-white px-8 py-3.5 text-sm font-bold hover:bg-white hover:text-[#DC2626] transition-all inline-flex items-center rounded">
                  View Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

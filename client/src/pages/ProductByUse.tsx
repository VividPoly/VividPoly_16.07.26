import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Quote, Star, Globe, Building2, Truck } from "lucide-react";

export default function ProductByUse() {
  // Product applications by industry
  const productApplications = [
    {
      name: "Flour & Wheat",
      slug: "flour",
      image: "/industries/flour-grains.jpg",
      description: "Premium PP woven bags for flour mills and wheat processors. Food-grade lamination ensures product freshness and prevents moisture ingress. Ideal for 10kg to 50kg packaging.",
      features: ["Food-grade lamination", "Moisture barrier", "Custom printing"]
    },
    {
      name: "Rice & Food Grains",
      slug: "food-grains",
      image: "/industries/rice-product.jpg",
      description: "High-quality woven sacks designed for rice, pulses, and lentils. UV-stabilized fabric with breathable design prevents moisture buildup during storage and transport.",
      features: ["UV stabilized", "Breathable design", "High tensile strength"]
    },
    {
      name: "Sugar",
      slug: "sugar",
      image: "/industries/sugar-product.jpg",
      description: "Specialized PP woven bags for sugar refineries. Inner liner options available for fine granulated sugar. Dust-proof construction maintains product purity.",
      features: ["Inner liner options", "Dust-proof", "50kg capacity"]
    },
    {
      name: "Animal Feed",
      slug: "animal-feed",
      image: "/media/animal-feed-industry-clean_a5634285.png",
      description: "Food-safe PP woven bags for poultry feed, cattle feed, and pet food. Breathable fabric maintains freshness while custom printing enhances brand visibility.",
      features: ["Food-safe materials", "Breathable fabric", "Brand printing"]
    },
    {
      name: "Fertilizers",
      slug: "fertilizers",
      image: "/industries/fertilizer.webp",
      description: "Heavy-duty PP woven bags designed for chemical fertilizers and agricultural inputs. UV-resistant and moisture-proof construction for outdoor storage.",
      features: ["Chemical resistant", "UV protection", "Moisture-proof"]
    },
    {
      name: "Cement & Building Materials",
      slug: "cement",
      image: "/industries/cement.jpg",
      description: "Industrial-grade PP woven cement bags with 50kg capacity. Valve-type and block-bottom options available. Dust-proof and moisture-resistant construction.",
      features: ["Valve & block bottom", "50kg capacity", "Dust-proof"]
    },
    {
      name: "Seeds & Agriculture",
      slug: "fertilizers",
      image: "/media/front_d62a94b3.webp",
      description: "Specialized packaging for agricultural seeds, ensuring optimal germination rates. Breathable yet protective design maintains seed viability during storage.",
      features: ["Seed-safe", "Breathable", "Tamper-evident options"]
    },
    {
      name: "Wheat & Grains",
      slug: "flour",
      image: "/industries/wheat-grains.jpg",
      description: "Bulk packaging solutions for wheat and grain traders. High-capacity bags with reinforced stitching for safe handling and transport.",
      features: ["Bulk capacity", "Reinforced stitching", "Easy handling"]
    },
    {
      name: "Agrochemicals",
      slug: "chemicals",
      image: "/industries/chemicals.jpeg",
      description: "Chemical-resistant PP woven bags for pesticides, herbicides, and agricultural chemicals. Inner liner options for hazardous material containment.",
      features: ["Chemical resistant", "Inner liners", "Safety compliant"]
    },
    {
      name: "Minerals & Mining",
      slug: "minerals",
      image: "/industries/minerals.jpg",
      description: "Heavy-duty bags for mineral ores, sand, and mining products. Extra-strong weave pattern handles abrasive materials and heavy loads.",
      features: ["Extra-strong weave", "Abrasion resistant", "Heavy-duty"]
    },
    {
      name: "Construction Materials",
      slug: "cement",
      image: "/industries/construction-mining.jpg",
      description: "Industrial PP woven bags for sand, gravel, and construction aggregates. Reinforced design handles rough handling on construction sites.",
      features: ["Reinforced design", "Rough handling", "Weather resistant"]
    },
    {
      name: "Coal & Charcoal",
      slug: "coal-charcoal",
      image: "/industries/coal.jpg",
      description: "Specialized bags for coal, charcoal, and solid fuels. Black-colored options available to mask product residue and maintain clean appearance.",
      features: ["Color options", "Dust containment", "High capacity"]
    },
    {
      name: "Powder & Granules",
      slug: "minerals",
      image: "/industries/flour.jpg",
      description: "Fine-mesh PP woven bags for powdered products and granules. Inner liner prevents product leakage while maintaining breathability.",
      features: ["Fine mesh", "Leak-proof liner", "Powder-safe"]
    },
    {
      name: "Shopping & Retail",
      slug: "courier-bags",
      image: "/media/red_f3abe28e.webp",
      description: "Eco-friendly PP woven shopping bags as sustainable alternatives to plastic. Reusable, washable, and customizable with brand logos.",
      features: ["Eco-friendly", "Reusable", "Custom branding"]
    },
    {
      name: "Sandbags & Flood Control",
      slug: "sandbags",
      image: "/media/sandbags_91b38bd1.jpg",
      description: "Heavy-duty sandbags for flood control, erosion prevention, and military applications. UV-stabilized for extended outdoor exposure.",
      features: ["UV stabilized", "Heavy-duty", "Quick-fill design"]
    },
    {
      name: "Fruits & Vegetables",
      slug: "fruits-vegetables",
      image: "/industries/fruits-vegetables.jpg",
      description: "Ventilated PP woven bags for fresh produce. Mesh design allows air circulation while protecting fruits and vegetables during transport.",
      features: ["Ventilated mesh", "Fresh produce safe", "Gentle handling"]
    },
  ];

  // Customer testimonials by industry
  const testimonials = [
    {
      name: "James Mitchell",
      company: "AusGrain Commodities",
      location: "Australia",
      industry: "Flour & Grains",
      image: "/testimonials/client-australia.jpg",
      rating: 5,
      quote: "VividPoly has been our trusted packaging supplier for over 5 years. Their BOPP laminated bags maintain excellent print quality and moisture barrier properties. Consistent quality across every container shipment."
    },
    {
      name: "Sarah Thompson",
      company: "PetNutrition Australia",
      location: "Australia",
      industry: "Animal Feed",
      image: "/testimonials/client-australia.jpg",
      rating: 5,
      quote: "We switched to VividPoly for our premium pet food bags and the results have been outstanding. The print quality is superb, bags are durable, and their team is responsive to our custom requirements."
    },
    {
      name: "Kwame Asante",
      company: "GoldCoast Agri-Exports",
      location: "Ghana",
      industry: "Rice & Grains",
      image: "/testimonials/client-nigeria.jpg",
      rating: 5,
      quote: "VividPoly delivers reliable PP woven bags for our rice and grain packaging needs. Their competitive FOB pricing and consistent on-time delivery make them our preferred Indian supplier."
    },
    {
      name: "Michael Okonkwo",
      company: "Lagos Cement Industries",
      location: "Nigeria",
      industry: "Cement",
      image: "/testimonials/client-nigeria.jpg",
      rating: 5,
      quote: "VividPoly delivers heavy-duty cement bags that handle our high-volume production. Their valve bags reduce filling time by 40% and the dust-proof construction keeps our facility cleaner."
    },
    {
      name: "Takeshi Yamamoto",
      company: "NipponAgri Corp.",
      location: "Japan",
      industry: "Rice & Grains",
      image: "/testimonials/client-australia.jpg",
      rating: 5,
      quote: "We source pinch bottom bags from VividPoly for our specialty rice products. Their attention to detail and food-grade quality standards meet our strict Japanese requirements."
    },
    {
      name: "Maria Santos",
      company: "BrasilPack Ltda.",
      location: "Brazil",
      industry: "Agricultural Packaging",
      image: "/testimonials/client-brazil.jpg",
      rating: 5,
      quote: "VividPoly has become our primary PP woven bag supplier for agricultural packaging. Their competitive pricing and ability to handle large volume orders make them ideal for the Latin American market."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-[#DC2626] py-16">
          <div className="container">
            <nav className="text-sm text-white/70 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Product by Use</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Product by Use
            </h1>
            <p className="text-xl text-white/80 max-w-3xl">
              Discover how VividPoly's PP woven packaging solutions serve diverse industries across 70+ countries worldwide.
            </p>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-[#1A1A1A] py-6">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <Globe className="w-8 h-8 text-[#DC2626] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">70+</div>
                <div className="text-white/70 text-sm">Countries Served</div>
              </div>
              <div>
                <Building2 className="w-8 h-8 text-[#DC2626] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">16+</div>
                <div className="text-white/70 text-sm">Industries</div>
              </div>
              <div>
                <Truck className="w-8 h-8 text-[#DC2626] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">200K</div>
                <div className="text-white/70 text-sm">Bags Daily</div>
              </div>
              <div>
                <Star className="w-8 h-8 text-[#DC2626] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-white/70 text-sm">Happy Clients</div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Applications Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                Industry Applications
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Our PP woven packaging solutions are trusted by businesses across diverse industries worldwide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {productApplications.map((product, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
                  <Link href={`/industry/${product.slug}`}>
                    <div className="relative h-48 overflow-hidden cursor-pointer">
                      <img loading="lazy" decoding="async"
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <h3 className="absolute bottom-4 left-4 text-white font-bold text-lg">{product.name}</h3>
                    </div>
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{product.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.features.map((feature, idx) => (
                        <span key={idx} className="text-xs bg-[#DC2626]/10 text-[#DC2626] px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex gap-2">
                      <Link href={`/industry/${product.slug}`} className="flex-1">
                        <button className="w-full border border-[#DC2626] text-[#DC2626] py-2 rounded-lg hover:bg-[#DC2626]/5 transition-colors text-sm font-semibold">
                          Learn More
                        </button>
                      </Link>
                      <Link href="/inquiries" className="flex-1">
                        <button className="w-full bg-[#DC2626] text-white py-2 rounded-lg hover:bg-[#1A1A1A] transition-colors text-sm font-semibold">
                          Request Quote
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                What Our Clients Say
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Trusted by businesses across 6 continents for quality PP woven packaging solutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 relative">
                  <Quote className="absolute top-4 right-4 w-10 h-10 text-[#DC2626]/20" />
                  
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>

                  {/* Client Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded bg-[#DC2626] flex items-center justify-center text-white font-bold text-xl">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1A1A1A]">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                      <p className="text-xs text-[#DC2626]">{testimonial.location} • {testimonial.industry}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#DC2626]">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Partner with VividPoly?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join 500+ satisfied clients worldwide. Get custom packaging solutions tailored to your industry needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/inquiries">
                <button className="bg-white text-[#DC2626] px-8 py-3 rounded font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
                  Request a Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="border-2 border-white text-white px-8 py-3 rounded font-semibold hover:bg-white/10 transition-colors inline-flex items-center">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
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

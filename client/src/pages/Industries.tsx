import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// All industries with SEO-optimized descriptions
const industries = [
  { 
    name: "Flour", 
    slug: "flour", 
    image: "/industries/flour-product.jpg",
    description: "Premium PP woven flour bags with food-grade lamination. Moisture-resistant packaging for wheat flour, maida, atta, and besan. Available in 10kg to 50kg bulk packaging with custom printing options."
  },
  { 
    name: "Food Grains", 
    slug: "food-grains", 
    image: "/industries/rice-product.jpg",
    description: "High-quality woven sacks for rice, wheat, pulses, and lentils. UV-stabilized polypropylene fabric with breathable design prevents moisture buildup. BOPP laminated options for retail packaging."
  },
  { 
    name: "Fertilizers", 
    slug: "fertilizers", 
    image: "/media/chemicals-product_50ddb5df.png",
    description: "Chemical-resistant PP woven fertilizer bags for urea, DAP, and NPK. High tensile strength with 50kg load capacity. Moisture barrier coating protects against humidity during storage."
  },
  { 
    name: "Chemicals", 
    slug: "chemicals", 
    image: "/media/chemicals-product_50ddb5df.png",
    description: "Industrial-grade PP woven bags for agrochemicals, dyes, and pigments. PE-lined interior prevents leakage. Anti-static options available for hazardous material compliance."
  },
  { 
    name: "Cement", 
    slug: "cement", 
    image: "/industries/cement-product.jpg",
    description: "Heavy-duty PP woven cement bags with 50kg capacity. Valve-type and block-bottom designs for automated filling. Dust-proof construction with moisture-resistant lamination."
  },
  { 
    name: "Minerals", 
    slug: "minerals", 
    image: "/industries/cement-product.jpg",
    description: "Abrasion-resistant PP woven bags for calcium carbonate, silica, and talc. High burst strength handles fine powders. FIBC bulk bags available for industrial quantities."
  },
  { 
    name: "Animal Feed", 
    slug: "animal-feed", 
    image: "/media/animal-feed-product_dbdf3256.jpg",
    description: "Food-safe PP woven bags for poultry feed, cattle feed, and pet food. Breathable fabric maintains nutritional freshness. Attractive BOPP printing for brand visibility on retail shelves."
  },
  { 
    name: "Sugar", 
    slug: "sugar", 
    image: "/industries/sugar-product.jpg",
    description: "Food-grade PP woven sugar bags with superior moisture barrier. Clean white fabric for premium presentation. Available in 25kg and 50kg sizes with tamper-evident closures."
  },
  { 
    name: "Coal & Charcoal", 
    slug: "coal-charcoal", 
    image: "/industries/coal.jpg",
    description: "Durable PP woven bags for coal, charcoal, and BBQ briquettes. Tear-resistant fabric with dust containment design. Ventilation options available for proper air circulation."
  },
  { 
    name: "Seeds", 
    slug: "sandbags", 
    image: "/media/sandbags_91b38bd1.jpg",
    description: "Breathable PP woven seed bags for agricultural and horticultural seeds. UV-stabilized for outdoor storage. Proper ventilation maintains seed viability during transport."
  },
  { 
    name: "Detergent Powder", 
    slug: "courier-bags", 
    image: "/industries/courier.jpg",
    description: "Moisture-proof PP woven bags for detergent and washing powder. Laminated interior prevents powder clumping. Vibrant BOPP printing for attractive retail packaging."
  },
  { 
    name: "Fruits & Vegetables", 
    slug: "fruits-vegetables", 
    image: "/industries/fruits-vegetables.jpg",
    description: "Leno mesh and ventilated PP woven bags for fresh produce. Allows air circulation to maintain freshness. Ideal for potatoes, onions, citrus fruits, and root vegetables."
  },
];

export default function Industries() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1A1A1A] to-[#DC2626] py-20">
        <div className="container text-center">
          <nav className="text-white/70 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-white">Industries We Serve</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">PP Woven Bags by Industry</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Exporting PP woven packaging to Australia, New Zealand, Africa, Latin America & Asia. India's trusted global export packaging company. 
            Custom solutions for diverse industries worldwide.
          </p>
        </div>
      </section>

      {/* Section Title */}
      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-[#1A1A1A] text-center">
            Packaging Solutions for Every Industry
          </h2>
          <p className="text-gray-600 text-center mt-4 max-w-3xl mx-auto">
            VividPoly manufactures high-quality PP woven bags tailored to meet specific industry requirements. 
            Our packaging solutions ensure product safety, freshness, and brand visibility.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-8 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex">
                <div className="w-2/5 overflow-hidden">
                  <img 
                    src={industry.image} 
                    alt={`PP woven bags for ${industry.name}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="w-3/5 p-6 flex flex-col justify-center">
                  <h3 className="font-bold text-[#1A1A1A] text-xl mb-3">{industry.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{industry.description}</p>
                  <Link href={`/industry/${industry.slug}`}>
                    <span className="text-[#DC2626] font-semibold hover:text-[#1A1A1A] inline-flex items-center gap-1 cursor-pointer text-sm">
                      View Products <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1A1A1A] to-[#DC2626]">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Need Custom PP Woven Packaging?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Get tailored packaging solutions for your specific industry requirements. 
            Competitive export pricing with worldwide shipping. MOQ starting from 5,000 bags.
          </p>
          <Link href="/contact">
            <button className="px-8 py-4 bg-white text-[#DC2626] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Request a Quote
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

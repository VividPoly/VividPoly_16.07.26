import { useParams, Link } from "wouter";
import { ArrowLeft, CheckCircle, Package, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Industry data with details
const industryData: Record<string, {
  name: string;
  image: string;
  description: string;
  benefits: string[];
  products: string[];
  applications: string[];
}> = {
  flour: {
    name: "Flour",
    image: "/industries/flour-product.jpg",
    description: "VividPoly manufactures premium PP woven flour bags with food-grade lamination. Our moisture-resistant packaging is ideal for wheat flour, maida, atta, besan, and specialty flours. Available in 10kg to 50kg bulk sizes with custom printing for brand visibility.",
    benefits: [
      "Food-grade material safe for direct contact",
      "Excellent moisture barrier protection",
      "High tensile strength for heavy loads",
      "Custom printing for brand visibility",
      "Recyclable and eco-friendly"
    ],
    products: [
      "Standard PP Woven Flour Bags",
      "Laminated Flour Bags",
      "BOPP Printed Flour Bags",
      "Valve Type Flour Bags"
    ],
    applications: [
      "Wheat Flour",
      "Rice Flour",
      "Maize Flour",
      "Multi-grain Flour",
      "Industrial Flour"
    ]
  },
  "food-grains": {
    name: "Food Grains",
    image: "/industries/rice-product.jpg",
    description: "High-quality PP woven sacks engineered for rice, wheat, pulses, and lentils. Our UV-stabilized polypropylene fabric with breathable design prevents moisture buildup during storage. BOPP laminated options available for attractive retail packaging.",
    benefits: [
      "Breathable fabric prevents moisture buildup",
      "UV stabilized for outdoor storage",
      "Pest-resistant design",
      "Available in various sizes (25kg to 100kg)",
      "Cost-effective bulk packaging solution"
    ],
    products: [
      "Rice Packaging Bags",
      "Wheat Packaging Bags",
      "Pulse & Lentil Bags",
      "Grain Storage Bags"
    ],
    applications: [
      "Rice",
      "Wheat",
      "Pulses & Lentils",
      "Corn & Maize",
      "Barley & Oats"
    ]
  },
  fertilizers: {
    name: "Fertilizers",
    image: "/media/chemicals-product_50ddb5df.png",
    description: "Chemical-resistant PP woven fertilizer bags designed for urea, DAP, NPK, and organic fertilizers. High tensile strength with 50kg load capacity. Moisture barrier coating protects against humidity during storage and transport.",
    benefits: [
      "Chemical resistant material",
      "High load-bearing capacity (up to 50kg)",
      "UV protection for outdoor storage",
      "Moisture barrier coating available",
      "Compliant with industry standards"
    ],
    products: [
      "Standard Fertilizer Bags",
      "Laminated Fertilizer Bags",
      "HDPE Lined Bags",
      "Block Bottom Bags"
    ],
    applications: [
      "Urea",
      "DAP (Diammonium Phosphate)",
      "NPK Fertilizers",
      "Organic Fertilizers",
      "Micronutrients"
    ]
  },
  chemicals: {
    name: "Chemicals",
    image: "/media/chemicals-product_50ddb5df.png",
    description: "Industrial-grade PP woven bags for agrochemicals, dyes, pigments, and industrial chemicals. PE-lined interior prevents leakage. Anti-static options available for hazardous material compliance and safety regulations.",
    benefits: [
      "Chemical-resistant inner lining",
      "Leak-proof construction",
      "Static dissipative options available",
      "Meets safety compliance standards",
      "Custom sizes and specifications"
    ],
    products: [
      "Chemical Packaging Bags",
      "PE Lined Chemical Bags",
      "Anti-static Bags",
      "Hazmat Compliant Bags"
    ],
    applications: [
      "Industrial Chemicals",
      "Agrochemicals",
      "Pharmaceutical Intermediates",
      "Dyes & Pigments",
      "Resins & Polymers"
    ]
  },
  cement: {
    name: "Cement",
    image: "/industries/cement-product.jpg",
    description: "Heavy-duty PP woven cement bags with 50kg capacity. Valve-type and block-bottom designs available for automated filling lines. Dust-proof construction with moisture-resistant lamination for extended shelf life.",
    benefits: [
      "Extra-strong weave for heavy loads",
      "Moisture-proof lamination",
      "Valve filling option for automation",
      "Dust-proof construction",
      "Stackable design for warehousing"
    ],
    products: [
      "Standard Cement Bags (50kg)",
      "Valve Type Cement Bags",
      "Block Bottom Cement Bags",
      "Laminated Cement Bags"
    ],
    applications: [
      "Portland Cement",
      "White Cement",
      "Ready Mix Concrete",
      "Mortar & Plaster",
      "Construction Materials"
    ]
  },
  minerals: {
    name: "Minerals",
    image: "/industries/cement-product.jpg",
    description: "Abrasion-resistant PP woven bags for calcium carbonate, silica, talc, and industrial minerals. High burst strength handles fine powders safely. FIBC bulk bags available for large industrial quantities.",
    benefits: [
      "Abrasion-resistant material",
      "High burst strength",
      "Suitable for fine powders",
      "Dust containment features",
      "Available in jumbo sizes"
    ],
    products: [
      "Mineral Packaging Bags",
      "FIBC Bulk Bags",
      "Lined Mineral Bags",
      "Heavy Duty Bags"
    ],
    applications: [
      "calcium Carbonate",
      "Silica & Quartz",
      "Talc & Kaolin",
      "Bentonite",
      "Metal Ores"
    ]
  },
  "animal-feed": {
    name: "Animal Feed",
    image: "/media/animal-feed-product_dbdf3256.jpg",
    description: "Food-safe PP woven bags for poultry feed, cattle feed, fish feed, and pet food. Breathable fabric maintains nutritional freshness. Attractive BOPP printing options for brand visibility on retail shelves.",
    benefits: [
      "Food-grade safe materials",
      "Breathable yet protective",
      "Rodent and pest resistant",
      "Attractive printing options",
      "Various size options"
    ],
    products: [
      "Poultry Feed Bags",
      "Cattle Feed Bags",
      "Pet Food Bags",
      "Aqua Feed Bags"
    ],
    applications: [
      "Poultry Feed",
      "Cattle & Dairy Feed",
      "Fish & Aqua Feed",
      "Pet Food",
      "Horse Feed"
    ]
  },
  sugar: {
    name: "Sugar",
    image: "/industries/sugar-product.jpg",
    description: "Food-grade PP woven sugar bags with superior moisture barrier properties. Clean white fabric for premium presentation. Available in 25kg and 50kg sizes with tamper-evident closures for quality assurance.",
    benefits: [
      "Food-grade certified",
      "Superior moisture barrier",
      "Clean and hygienic packaging",
      "High-quality printing",
      "Tamper-evident options"
    ],
    products: [
      "Standard Sugar Bags",
      "Laminated Sugar Bags",
      "Retail Sugar Bags",
      "Industrial Sugar Bags"
    ],
    applications: [
      "White Sugar",
      "Brown Sugar",
      "Raw Sugar",
      "Powdered Sugar",
      "Jaggery"
    ]
  },
  "coal-charcoal": {
    name: "Coal & Charcoal",
    image: "/industries/coal.jpg",
    description: "VividPoly manufactures durable bags for coal and charcoal packaging. These bags are designed to handle heavy, abrasive materials while preventing dust leakage.",
    benefits: [
      "Heavy-duty construction",
      "Dust containment design",
      "Tear and puncture resistant",
      "Ventilation options available",
      "Cost-effective packaging"
    ],
    products: [
      "Coal Packaging Bags",
      "Charcoal Bags",
      "BBQ Charcoal Bags",
      "Industrial Coal Bags"
    ],
    applications: [
      "Industrial Coal",
      "BBQ Charcoal",
      "Activated Carbon",
      "Coke",
      "Briquettes"
    ]
  },
  sandbags: {
    name: "Sandbags",
    image: "/media/sandbags_91b38bd1.jpg",
    description: "Our sandbags are engineered for flood control, construction, and military applications. These bags offer exceptional durability and UV resistance for outdoor use.",
    benefits: [
      "UV stabilized for long outdoor life",
      "High tensile strength",
      "Quick-fill design",
      "Tie closure system",
      "Bulk quantity available"
    ],
    products: [
      "Flood Control Sandbags",
      "Construction Sandbags",
      "Military Grade Sandbags",
      "Erosion Control Bags"
    ],
    applications: [
      "Flood Protection",
      "Construction Sites",
      "Military & Defense",
      "Erosion Control",
      "Ballast & Counterweight"
    ]
  },
  "courier-bags": {
    name: "Courier Bags",
    image: "/industries/courier.jpg",
    description: "VividPoly produces lightweight yet durable courier bags for the logistics and e-commerce industry. These bags protect packages during transit while being cost-effective.",
    benefits: [
      "Lightweight yet strong",
      "Water-resistant coating",
      "Tamper-evident closure",
      "Custom branding options",
      "Eco-friendly materials"
    ],
    products: [
      "Standard Courier Bags",
      "Security Courier Bags",
      "Padded Courier Bags",
      "Biodegradable Options"
    ],
    applications: [
      "E-commerce Shipping",
      "Document Delivery",
      "Parcel Services",
      "Retail Packaging",
      "Subscription Boxes"
    ]
  },
  "fruits-vegetables": {
    name: "Fruits & Vegetables",
    image: "/industries/fruits-vegetables.jpg",
    description: "Our produce bags are designed with ventilation features to keep fruits and vegetables fresh during transport and storage. These bags are ideal for agricultural markets.",
    benefits: [
      "Ventilated design for freshness",
      "Food-safe materials",
      "Prevents bruising and damage",
      "Reusable and durable",
      "Various mesh options"
    ],
    products: [
      "Leno Mesh Bags",
      "Ventilated PP Bags",
      "Produce Sacks",
      "Market Bags"
    ],
    applications: [
      "Potatoes & Onions",
      "Citrus Fruits",
      "Root Vegetables",
      "Cabbage & Lettuce",
      "Seasonal Produce"
    ]
  }
};

export default function IndustryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const industry = slug ? industryData[slug] : null;

  if (!industry) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">Industry Not Found</h1>
          <p className="text-gray-600 mb-8">The industry you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="bg-[#DC2626] hover:bg-[#1A1A1A]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img 
          src={industry.image} 
          alt={industry.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 to-[#DC2626]/70" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <Link href="/#industries">
              <Button variant="outline" className="mb-4 text-white border-white hover:bg-white hover:text-[#DC2626]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Industries
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{industry.name}</h1>
            <p className="text-xl text-white/90 max-w-2xl">Packaging Solutions</p>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Overview</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{industry.description}</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-[#1A1A1A] text-center mb-12">Key Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {industry.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-[#f8fafa] rounded-lg">
                <CheckCircle className="w-6 h-6 text-[#DC2626] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-[#f8fafa]">
        <div className="container">
          <h2 className="text-3xl font-bold text-[#1A1A1A] text-center mb-12">Our Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {industry.products.map((product, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
                <Package className="w-10 h-10 text-[#DC2626] mx-auto mb-4" />
                <h3 className="font-semibold text-[#1A1A1A]">{product}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-[#1A1A1A] text-center mb-12">Applications</h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {industry.applications.map((app, index) => (
              <span 
                key={index} 
                className="px-6 py-3 bg-[#DC2626] text-white rounded-full font-medium"
              >
                {app}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1A1A1A] to-[#DC2626]">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need {industry.name} Packaging Solutions?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your specific requirements and get a customized quote.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-[#DC2626] hover:bg-gray-100">
                <Truck className="w-5 h-5 mr-2" />
                Request Quote
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#DC2626]">
                <Shield className="w-5 h-5 mr-2" />
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

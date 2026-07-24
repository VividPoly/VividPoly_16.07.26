import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Factory, Award, Globe, Leaf, Users, Target, ArrowRight, GraduationCap, Heart } from "lucide-react";
import { Link } from "wouter";
import { SEOHead, pageSEO } from "@/components/SEOHead";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead {...pageSEO.about} canonicalPath="/about" />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - L&T Style */}
        <section className="bg-[#1A1A1A] text-white py-20">
          <div className="container">
            <span className="text-[#DC2626] text-xs font-bold uppercase tracking-widest">About Us</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3">VividPoly</h1>
            <p className="text-xl text-white/80 max-w-3xl">
              India's trusted PP woven packaging export partner serving Australia, Africa, Latin America & Asia with ISO certified quality
            </p>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-[#DC2626] text-xs font-bold uppercase tracking-widest">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">Story</h2>
                <p className="text-lg text-gray-600 mb-4">
                  VividPoly was founded by a team of experienced engineers with multinational expertise spanning Australia, Canada, USA, and India. Each founder brings deep specialization in their respective fields — from polymer science and manufacturing engineering to global supply chain management and international trade.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  United by a shared vision to build India's premier global export packaging company, our founders combined their international experience to create a world-class PP woven packaging operation that serves importers, distributors, and brand owners across Australia, Africa, Latin America, and Asia.
                </p>
              </div>
              <div className="rounded-xl h-96 overflow-hidden shadow-xl">
                <img 
                  src="/factory/factory-floor.jpg" 
                  alt="VividPoly Manufacturing Facility" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>



        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="h-2 bg-[#DC2626]"></div>
                <CardContent className="p-8">
                  <Target className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Our Mission</h3>
                  <p className="text-gray-600">
                    To be the preferred Indian export partner for PP woven packaging, delivering consistent quality, competitive pricing, and reliable supply to importers and distributors across Australia, Africa, Latin America, and Asia.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="h-2 bg-[#DC2626]"></div>
                <CardContent className="p-8">
                  <Award className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Our Vision</h3>
                  <p className="text-gray-600">
                    To become the most trusted PP woven packaging exporter from India, recognized globally for product innovation, sustainable manufacturing, and exceptional service to our export partners across every continent.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics - L&T Style */}
        <section className="py-16 bg-[#DC2626] text-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-xs font-bold uppercase tracking-widest text-[#DC2626]">Our </h2>
              <h2 className="text-3xl md:text-4xl font-bold text-white">ACHIEVEMENTS</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">4</div>
                <div className="text-[#DC2626] font-semibold">Countries</div>
                <div className="text-white/70">Founder Experience</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">25+</div>
                <div className="text-[#DC2626] font-semibold">Years</div>
                <div className="text-white/70">Trading & Export Experience</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">20+</div>
                <div className="text-[#DC2626] font-semibold">Countries</div>
                <div className="text-white/70">Export Markets</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">200+</div>
                <div className="text-[#DC2626] font-semibold">Clients</div>
                <div className="text-white/70">Satisfied</div>
              </div>
            </div>
          </div>
        </section>

        {/* Infrastructure Gallery */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <span className="text-[#DC2626] text-xs font-bold uppercase tracking-widest">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">INFRASTRUCTURE</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                State-of-the-art manufacturing facility equipped with world-class circular looms and extrusion lines
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Circular Loom Weaving", image: "/factory/circular-loom-main.jpg" },
                { title: "Tape Extrusion Line", image: "/factory/tape-extrusion.jpg" },
                { title: "Winding Machine", image: "/media/winding-machine-clean_1b365e20.png" },
                { title: "Lamination Line", image: "/factory/lamination-line.jpg" },
                { title: "Stitching Unit", image: "/factory/stitching-machine.jpg" },
                { title: "Warehouse", image: "/factory/warehouse.jpg" }
              ].map((item, index) => (
                <div key={index} className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-video">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Building India's Packaging Infrastructure */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-xs font-bold uppercase tracking-widest text-[#DC2626]">
                BUILDING INDIA'S
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
                PACKAGING INFRASTRUCTURE
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                VividPoly builds meaningful partnerships while pursuing progress and driving inclusive growth. 
                By aligning business goals with industry needs, we contribute to sustainable packaging solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden rounded-xl bg-white">
                <div className="h-48 bg-gradient-to-br from-[#DC2626] to-[#1A1A1A] flex items-center justify-center">
                  <Factory className="h-20 w-20 text-white/80" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Global Export Division</h3>
                  <p className="text-gray-600">
                    Our dedicated export division manages end-to-end international logistics, customs documentation, 
                    and container shipments to ensure seamless delivery to importers across all target markets.
                  </p>
                </div>
              </div>

              <div className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden rounded-xl bg-white">
                <div className="h-48 bg-gradient-to-br from-[#DC2626] to-[#DC2626] flex items-center justify-center">
                  <Leaf className="h-20 w-20 text-white/80" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Environmental Commitment</h3>
                  <p className="text-gray-600">
                    We pay special attention to environmental sustainability with recyclable materials, 
                    energy-efficient processes, and responsible waste management practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Life at VividPoly */}
        <section className="py-20 bg-[#f8fafa]">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl text-xs font-bold uppercase tracking-widest text-[#DC2626]">
                  LIFE AT
                </h2>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
                  VIVIDPOLY
                </h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  VividPoly is a team of dedicated professionals committed to excellence. We combine 
                  a proven track record, complex and exciting projects integrated with new-age technologies, 
                  woven together with a culture of nurturing and trust.
                </p>
                <Link href="/careers">
                  <button className="bg-[#DC2626] text-white px-6 py-3 rounded hover:bg-[#005A5F] transition-colors inline-flex items-center">
                    Join Our Team
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <Users className="h-10 w-10 text-[#DC2626] mb-4" />
                  <h4 className="font-bold text-[#1A1A1A] mb-2">Diversity</h4>
                  <p className="text-gray-600 text-sm">
                    A rich and colourful fabric of talent from across India and beyond.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <GraduationCap className="h-10 w-10 text-[#DC2626] mb-4" />
                  <h4 className="font-bold text-[#1A1A1A] mb-2">Learning & Development</h4>
                  <p className="text-gray-600 text-sm">
                    A young and agile company that stands proud on its commitment to growth.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow col-span-2">
                  <Heart className="h-10 w-10 text-[#DC2626] mb-4" />
                  <h4 className="font-bold text-[#1A1A1A] mb-2">Making a Difference</h4>
                  <p className="text-gray-600 text-sm">
                    Through our community programmes, we contribute to education, health, and environmental initiatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Ready to Partner With Us?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Get competitive FOB pricing for your PP woven packaging requirements. We ship to Australia, Africa, Latin America & Asia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quality-assurance">
                <button className="bg-[#DC2626] text-white px-6 py-3 rounded hover:bg-[#005A5F] transition-colors inline-flex items-center">
                  View Infrastructure
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
              <Link href="/certificates">
                <button className="border-2 border-[#DC2626] text-[#DC2626] px-6 py-3 rounded hover:bg-[#DC2626] hover:text-white transition-colors inline-flex items-center">
                  Our Certificates
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

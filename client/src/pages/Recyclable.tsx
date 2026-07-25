import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Recycle, Leaf, Factory, Droplets, Sun, TreePine, ArrowRight } from "lucide-react";

export default function Recyclable() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - L&T Style */}
        <section className="bg-[#1A1A1A] text-white py-20">
          <div className="container">
            <div className="flex items-center gap-4 mb-6">
              <Recycle className="h-16 w-16 text-[#DC2626]" />
              <div>
                <h2 className="text-3xl md:text-4xl font-normal text-white mb-2">100%</h2>
                <h1 className="text-4xl md:text-5xl font-bold">RECYCLABLE</h1>
              </div>
            </div>
            <p className="text-xl text-white/80 max-w-3xl">
              Our commitment to sustainability through fully recyclable PP woven products that contribute to a circular economy
            </p>
          </div>
        </section>

        {/* Why PP Woven is Sustainable */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-normal text-[#DC2626] mb-2">THE SUSTAINABLE</h2>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">CHOICE</h2>
                <p className="text-lg text-gray-600 mb-4">
                  All our PP woven products are manufactured from polypropylene, a thermoplastic polymer that is fully recyclable. Unlike single-use plastics that contribute to environmental pollution, PP woven bags can be collected, processed, and remanufactured into new products, creating a circular economy.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  We actively encourage our clients to implement collection and recycling programs, and we provide guidance on establishing effective recycling systems. By choosing VividPoly products, you're making an environmentally responsible decision.
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#DC2626] to-[#1A1A1A] rounded-xl h-96 flex items-center justify-center shadow-xl">
                <Recycle className="h-48 w-48 text-[#DC2626]" />
              </div>
            </div>
          </div>
        </section>

        {/* Environmental Benefits - L&T Style */}
        <section className="py-16 bg-[#f8fafa]">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-normal text-[#DC2626] mb-2">ENVIRONMENTAL</h2>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">BENEFITS</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                How our sustainable practices benefit the planet
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-2 bg-[#DC2626]"></div>
                <CardContent className="p-6">
                  <Recycle className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">100% Recyclable Materials</h3>
                  <p className="text-gray-600">
                    Every product we manufacture can be fully recycled at the end of its life cycle, reducing landfill waste and conserving resources.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-2 bg-[#DC2626]"></div>
                <CardContent className="p-6">
                  <Factory className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Energy-Efficient Manufacturing</h3>
                  <p className="text-gray-600">
                    Our modern machinery features variable frequency drives and optimized heating systems that significantly reduce power consumption.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-2 bg-[#DC2626]"></div>
                <CardContent className="p-6">
                  <Leaf className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">95%+ Waste Diversion</h3>
                  <p className="text-gray-600">
                    Edge trimmings and production remnants are collected and reprocessed into new raw materials rather than being discarded.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-2 bg-[#DC2626]"></div>
                <CardContent className="p-6">
                  <Droplets className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Water Conservation</h3>
                  <p className="text-gray-600">
                    Our closed-loop water circulation systems recycle and reuse water, reducing consumption by 70% compared to industry averages.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-2 bg-[#DC2626]"></div>
                <CardContent className="p-6">
                  <Sun className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">LED Lighting</h3>
                  <p className="text-gray-600">
                    Our facility utilizes LED lighting throughout, reducing electricity consumption by approximately 60% compared to traditional lighting.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-2 bg-[#DC2626]"></div>
                <CardContent className="p-6">
                  <TreePine className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Carbon Footprint Reduction</h3>
                  <p className="text-gray-600">
                    We continuously measure and reduce our carbon footprint through logistics optimization and local sourcing when possible.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Recycling Process - L&T Style */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-normal text-[#DC2626] mb-2">THE RECYCLING</h2>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">JOURNEY</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                How PP woven products are recycled and given new life
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#DC2626] rounded flex items-center justify-center text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Collection</h3>
                <p className="text-gray-600 text-sm">
                  Used PP woven bags are collected from businesses and recycling centers
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#DC2626] rounded flex items-center justify-center text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Sorting & Cleaning</h3>
                <p className="text-gray-600 text-sm">
                  Materials are sorted by type and cleaned to remove contaminants
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#DC2626] rounded flex items-center justify-center text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Processing</h3>
                <p className="text-gray-600 text-sm">
                  Materials are shredded and melted to create recycled PP pellets
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#DC2626] rounded flex items-center justify-center text-white text-2xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">New Products</h3>
                <p className="text-gray-600 text-sm">
                  Recycled pellets are used to manufacture new PP products
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Commitment - L&T Style */}
        <section className="py-16 bg-[#DC2626] text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Sustainability Commitment</h2>
            <p className="text-xl mb-8 text-white/80 max-w-3xl mx-auto">
              We are committed to continuous improvement in our environmental performance. Our product line includes bags manufactured with recycled polypropylene content, and we are actively exploring bio-based alternatives derived from renewable resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog">
                <button className="btn-primary inline-flex items-center">
                  Read Our Sustainability Blog <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="border-2 border-white text-white px-6 py-3 rounded hover:bg-white hover:text-[#DC2626] transition-colors inline-flex items-center">
                  Contact Us
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

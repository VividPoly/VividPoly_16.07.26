import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Award, CheckCircle, Shield, FileCheck, Microscope, ClipboardCheck, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { SEOHead, pageSEO } from "@/components/SEOHead";

export default function QualityAssurance() {
  const { data: certificates, isLoading } = trpc.certificates.list.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead {...pageSEO.quality} canonicalPath="/quality" />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - L&T Style */}
        <section className="bg-[#1A1A1A] text-white py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-normal text-white mb-2">QUALITY</h2>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">ASSURANCE</h1>
            <p className="text-xl text-white/80 max-w-3xl">
              Committed to excellence through rigorous testing, international certifications, and continuous improvement
            </p>
          </div>
        </section>

        {/* Quality Standards */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-normal text-[#DC2626] mb-2">OUR QUALITY</h2>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">STANDARDS</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Every product undergoes comprehensive testing to ensure it meets the highest industry standards
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-2 bg-[#DC2626]"></div>
                <CardContent className="p-6">
                  <Microscope className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Material Testing</h3>
                  <p className="text-gray-600">
                    Raw materials are tested for purity, strength, and consistency before entering production. Only premium-grade polypropylene resin is used in our manufacturing process.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-2 bg-[#DC2626]"></div>
                <CardContent className="p-6">
                  <Shield className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Tensile Strength Testing</h3>
                  <p className="text-gray-600">
                    Every batch is tested for tensile strength in both warp and weft directions, ensuring our products can handle the loads they're designed for.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-2 bg-[#DC2626]"></div>
                <CardContent className="p-6">
                  <FileCheck className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">UV Resistance Testing</h3>
                  <p className="text-gray-600">
                    Products designated for outdoor use undergo UV resistance testing to ensure long-term durability under sun exposure, with ratings up to 1000 hours.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-2 bg-[#DC2626]"></div>
                <CardContent className="p-6">
                  <ClipboardCheck className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Print Quality Control</h3>
                  <p className="text-gray-600">
                    Our printing processes are monitored for color accuracy, adhesion, and durability. We use Pantone matching to ensure brand consistency across all orders.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-2 bg-[#DC2626]"></div>
                <CardContent className="p-6">
                  <CheckCircle className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Final Inspection</h3>
                  <p className="text-gray-600">
                    Every shipment undergoes final inspection for dimensions, weight, print quality, and packaging integrity before leaving our facility.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-2 bg-[#DC2626]"></div>
                <CardContent className="p-6">
                  <Award className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Export Quality Standards</h3>
                  <p className="text-gray-600">
                    All products meet international export standards with rigorous testing for tensile strength, UV resistance, and print quality before container loading.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Certifications - L&T Style */}
        <section className="py-16 bg-[#f8fafa]">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-normal text-[#DC2626] mb-2">OUR</h2>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">CERTIFICATIONS</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Internationally recognized certifications that validate our commitment to quality
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#DC2626] to-[#1A1A1A] rounded flex items-center justify-center">
                    <Award className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">ISO 9001:2015</h3>
                  <p className="text-gray-600 text-sm">Quality Management System</p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#DC2626] to-[#DC2626] rounded flex items-center justify-center">
                    <Award className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">ISO 14001:2015</h3>
                  <p className="text-gray-600 text-sm">Environmental Management</p>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* Quality Process - L&T Style */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-normal text-[#DC2626] mb-2">OUR QUALITY</h2>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">PROCESS</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A systematic approach to ensuring excellence at every stage
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#DC2626]/20 hidden md:block"></div>
                
                <div className="space-y-8">
                  {[
                    { step: 1, title: "Raw Material Inspection", desc: "All incoming materials are inspected and tested before acceptance into inventory." },
                    { step: 2, title: "In-Process Quality Control", desc: "Continuous monitoring during production with real-time adjustments to maintain specifications." },
                    { step: 3, title: "Laboratory Testing", desc: "Samples from each batch undergo comprehensive laboratory testing for all critical parameters." },
                    { step: 4, title: "Visual Inspection", desc: "Trained inspectors examine products for defects, print quality, and overall appearance." },
                    { step: 5, title: "Final Audit", desc: "Complete audit of finished goods against customer specifications before packaging." },
                    { step: 6, title: "Documentation & Traceability", desc: "Full documentation maintained for traceability from raw material to delivered product." },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-[#DC2626] text-white rounded flex items-center justify-center text-2xl font-bold flex-shrink-0 z-10">
                        {item.step}
                      </div>
                      <div className="pt-3">
                        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#DC2626]">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Our Quality?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your packaging requirements and see how our quality standards can benefit your business.
            </p>
            <Link href="/contact">
              <button className="btn-primary inline-flex items-center">
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

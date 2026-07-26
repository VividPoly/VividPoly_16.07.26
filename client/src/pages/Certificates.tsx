import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Award, Shield, FileCheck, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Certificates() {
  const { data: certificates, isLoading } = trpc.certificates.list.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section - L&T Style */}
        <section className="bg-[#1A1A1A] text-white py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-normal text-white mb-2">OUR</h2>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">CERTIFICATES</h1>
            <p className="text-xl text-white/80 max-w-3xl">
              International certifications that validate our commitment to quality and excellence
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-24 w-24 bg-gray-200 rounded mx-auto mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : certificates && certificates.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certificates.map((cert) => (
                  <Card key={cert.id} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                    <div className="h-2 bg-[#DC2626]"></div>
                    <CardContent className="p-8">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#DC2626] to-[#1A1A1A] rounded flex items-center justify-center">
                        <Award className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{cert.name}</h3>
                      <p className="text-gray-500 text-sm mb-2">{cert.issuingAuthority}</p>
                      {cert.description && (
                        <p className="text-gray-600">{cert.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { name: "ISO 9001:2015", desc: "Quality Management System", color: "bg-[#DC2626]" },
                  { name: "ISO 14001:2015", desc: "Environmental Management", color: "bg-[#DC2626]" },
                  { name: "REACH Compliant", desc: "Chemical Safety Standards", color: "bg-[#1A1A1A]" },
                ].map((cert, i) => (
                  <Card key={i} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                    <div className={`h-2 ${cert.color}`}></div>
                    <CardContent className="p-8">
                      <div className={`w-24 h-24 mx-auto mb-4 ${cert.color} rounded flex items-center justify-center`}>
                        <Award className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{cert.name}</h3>
                      <p className="text-gray-600 text-sm">{cert.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#f8fafa]">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Quality You Can Trust</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Our certifications reflect our commitment to delivering products that meet the highest international standards.
            </p>
            <Link href="/contact">
              <button className="bg-[#DC2626] text-white px-6 py-3 rounded hover:bg-[#005A5F] transition-colors inline-flex items-center">
                Request Certificate Copies
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

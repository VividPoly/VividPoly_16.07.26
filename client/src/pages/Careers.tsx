import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, GraduationCap, Heart, Briefcase, MapPin, Clock, Building2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Careers() {
  // Job listings
  const jobs = [
    {
      id: 1,
      title: "Production Manager",
      department: "Manufacturing",
      location: "Ahmedabad, Gujarat",
      type: "Full-time",
      experience: "5-8 years",
      description: "Lead and manage production operations for PP woven bag manufacturing."
    },
    {
      id: 2,
      title: "Quality Control Engineer",
      department: "Quality Assurance",
      location: "Ahmedabad, Gujarat",
      type: "Full-time",
      experience: "3-5 years",
      description: "Ensure product quality standards and implement quality control processes."
    },
    {
      id: 3,
      title: "Export Sales Executive",
      department: "Sales & Marketing",
      location: "Ahmedabad, Gujarat",
      type: "Full-time",
      experience: "2-4 years",
      description: "Handle international client relationships and export documentation."
    },
    {
      id: 4,
      title: "Maintenance Technician",
      department: "Engineering",
      location: "Ahmedabad, Gujarat",
      type: "Full-time",
      experience: "2-3 years",
      description: "Maintain and repair circular looms and lamination machinery."
    },
    {
      id: 5,
      title: "HR Executive",
      department: "Human Resources",
      location: "Ahmedabad, Gujarat",
      type: "Full-time",
      experience: "1-3 years",
      description: "Support recruitment, employee engagement, and HR operations."
    },
  ];

  // Benefits
  const benefits = [
    { icon: Heart, title: "Health Insurance", description: "Comprehensive medical coverage for you and your family" },
    { icon: GraduationCap, title: "Learning & Development", description: "Continuous training and skill development programs" },
    { icon: Users, title: "Team Culture", description: "Collaborative and supportive work environment" },
    { icon: Building2, title: "Modern Facility", description: "State-of-the-art manufacturing campus" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-[#1A1A1A]">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="/factory/factory-floor.jpg" 
              alt="VividPoly Careers" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-normal text-white mb-2">
                LIFE AT
              </h1>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                VIVIDPOLY
              </h1>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                VividPoly is a team of dedicated professionals spread across our state-of-the-art facility. 
                We combine a proven track record, complex and exciting projects integrated with new-age 
                technologies, woven together with a culture of nurturing and trust.
              </p>
              <Link href="#openings">
                <button className="btn-primary inline-flex items-center">
                  View Open Positions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-4 bg-[#DC2626]"></div>
                <CardContent className="p-8">
                  <Users className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Diversity</h3>
                  <p className="text-gray-600">
                    VividPoly has beautifully woven a rich and colourful fabric which includes talent 
                    from across India. Multiculturality is an integral part of our ethos, fostering 
                    innovation and creativity.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-4 bg-[#DC2626]"></div>
                <CardContent className="p-8">
                  <GraduationCap className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Learning & Development</h3>
                  <p className="text-gray-600">
                    With a young and agile workforce, VividPoly stands proud on its commitment to 
                    continuous learning. We invest in our people through training programs and 
                    skill development initiatives.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-4 bg-[#DC2626]"></div>
                <CardContent className="p-8">
                  <Heart className="h-12 w-12 text-[#DC2626] mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Making a Difference</h3>
                  <p className="text-gray-600">
                    Through our community programmes, VividPoly employees contribute to education, 
                    health, and environmental initiatives, making a positive impact beyond the workplace.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-[#f8fafa]">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-normal text-[#DC2626] mb-2">WHY JOIN</h2>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">VIVIDPOLY</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
                  <benefit.icon className="h-10 w-10 text-[#DC2626] mx-auto mb-4" />
                  <h4 className="font-bold text-[#1A1A1A] mb-2">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Openings Section */}
        <section id="openings" className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-normal text-[#DC2626] mb-2">CURRENT</h2>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">OPENINGS</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join our growing team and be part of India's leading PP woven packaging manufacturer.
              </p>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="border border-gray-200 hover:border-[#DC2626] hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{job.title}</h3>
                        <p className="text-gray-600 mb-3">{job.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </span>
                          <span className="bg-[#F8F8F8] text-[#DC2626] px-3 py-1 rounded">
                            {job.experience}
                          </span>
                        </div>
                      </div>
                      <Link href="/contact">
                        <Button className="bg-[#DC2626] hover:bg-[#005A5F] text-white">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#DC2626]">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Don't see a suitable position?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Link href="/contact">
              <button className="btn-primary inline-flex items-center">
                Send Your Resume
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

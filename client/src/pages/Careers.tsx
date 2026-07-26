import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, GraduationCap, Heart, Briefcase, MapPin, Clock, Building2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Direct application form (Google Form).
const APPLY_HREF =
  "https://docs.google.com/forms/d/e/1FAIpQLScdHClo1CkNedEHXsUrl5LNPqRc0xG50r-OCxIuQsVnmbZnoA/viewform";

export default function Careers() {
  // Live openings are posted on these platforms (no fake in-house listings).
  const platforms = [
    {
      name: "LinkedIn",
      logo: "/images/platforms/linkedin.svg",
      href: "https://www.linkedin.com/company/vividpoly/jobs/",
      blurb: "Company updates and open roles for export, operations, and packaging careers.",
    },
    {
      name: "Indeed",
      logo: "/images/platforms/indeed.svg",
      href: "https://in.indeed.com/cmp/Vividpoly",
      blurb: "Search VIVIDPOLY listings by role, location, and experience level.",
    },
    {
      name: "Naukri",
      logo: "/images/platforms/naukri.png",
      href: "https://www.naukri.com/",
      blurb: "India-focused openings across manufacturing, sales, and support teams.",
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
            <img loading="lazy" decoding="async" 
              src="/factory/factory-floor.jpg" 
              alt="VividPoly Careers" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl">
              {/* One h1 per page: the two lines were separate <h1> elements,
                  which splits the page's primary heading signal. Same classes,
                  same rendering. */}
              <h1 className="text-4xl md:text-5xl text-white mb-6">
                <span className="block font-normal mb-2">LIFE AT</span>
                <span className="block font-bold">VIVIDPOLY</span>
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

        {/* Open Positions - live roles on job platforms (no fake listings) */}
        <section id="openings" className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <span className="text-[#DC2626] text-xs font-bold uppercase tracking-widest">Open Positions</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mt-3 mb-4">
                Find us where you&apos;re already looking
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Current openings are posted and updated on these platforms. Browse live roles, then
                apply through the form below.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#DC2626] hover:shadow-lg"
                >
                  <img loading="lazy" decoding="async" src={p.logo} alt={p.name} className="h-8 w-auto self-start object-contain" />
                  <h3 className="mt-5 text-lg font-bold text-[#1A1A1A]">{p.name}</h3>
                  <ul className="mt-2 flex-1">
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#DC2626]" />
                      {p.blurb}
                    </li>
                  </ul>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-[#DC2626]">
                    View Openings
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </a>
              ))}
            </div>

            <p className="mt-8 text-center text-gray-500">
              Prefer a direct application? Use{" "}
              <a href={APPLY_HREF} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#DC2626] underline">
                Apply Now
              </a>{" "}
              below.
            </p>
          </div>
        </section>

        {/* CTA Section - direct application via the form */}
        <section className="py-16 bg-[#DC2626]">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Your next career move starts here
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Share your role interest, experience, and preferred location. Our team reviews
              applications as openings become available.
            </p>
            <a href={APPLY_HREF} target="_blank" rel="noopener noreferrer">
              <button className="bg-white text-[#DC2626] px-8 py-3 font-bold text-sm rounded hover:bg-gray-100 transition-all inline-flex items-center">
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

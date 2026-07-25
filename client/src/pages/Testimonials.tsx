import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const { data: testimonials, isLoading } = trpc.testimonials.all.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - L&T Style */}
        <section className="bg-[#1A1A1A] text-white py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-normal text-white mb-2">CLIENT</h2>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">TESTIMONIALS</h1>
            <p className="text-xl text-white/80 max-w-3xl">
              Hear what our valued clients from around the world have to say about their experience with VividPoly
            </p>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16 bg-white">
          <div className="container">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-32 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : testimonials && testimonials.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                    <div className="h-2 bg-[#DC2626]"></div>
                    <CardContent className="p-6">
                      <Quote className="h-8 w-8 text-[#DC2626] mb-4" />
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= testimonial.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#DC2626] to-[#1A1A1A] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-[#1A1A1A]">{testimonial.name}</div>
                          {testimonial.position && (
                            <div className="text-sm text-gray-500">
                              {testimonial.position}
                            </div>
                          )}
                          {testimonial.company && (
                            <div className="text-sm text-gray-500">
                              {testimonial.company}
                            </div>
                          )}
                          {testimonial.country && (
                            <div className="text-sm text-[#DC2626] font-medium">
                              {testimonial.country}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Quote className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">No Testimonials Yet</h3>
                <p className="text-gray-600">
                  We're collecting feedback from our valued clients. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section - L&T Style */}
        <section className="py-16 bg-[#DC2626]">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-normal text-white mb-2">TRUSTED</h2>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">WORLDWIDE</h2>
              <p className="text-lg text-white/80">
                Our commitment to quality has earned us clients across the globe
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">500+</div>
                <div className="text-white font-semibold">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">25+</div>
                <div className="text-white font-semibold">Countries Served</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">98%</div>
                <div className="text-white font-semibold">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">20+</div>
                <div className="text-white font-semibold">Years Experience</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

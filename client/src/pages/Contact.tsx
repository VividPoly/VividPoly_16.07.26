import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send, ArrowRight } from "lucide-react";
import { SEOHead, pageSEO } from "@/components/SEOHead";

export default function Contact() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "", subject: "", message: ""
  });

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setFormData({ name: "", email: "", phone: "", company: "", subject: "", message: "" });
      setLocation("/thank-you");
    },
    onError: () => toast.error("Failed to send message. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      company: formData.company || undefined,
      subject: formData.subject || undefined,
      message: formData.message,
      source: "Contact Us page",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead {...pageSEO.contact} canonicalPath="/contact" />
      <Header />
      <main className="flex-1">
        {/* Hero Section - L&T Style */}
        <section className="bg-[#1A1A1A] text-white py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-normal text-white mb-2">GET IN</h2>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">TOUCH</h1>
            <p className="text-xl text-white/80 max-w-3xl">
              Get in touch with our team for inquiries, quotes, or any questions about our packaging solutions
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-6">
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="h-1 bg-[#DC2626]"></div>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded bg-[#F8F8F8] flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-[#DC2626]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] mb-1">Address</h3>
                      <p className="text-gray-600">Plot No. 45-48, GIDC Industrial Estate<br />Naroda Industrial Area<br />Ahmedabad, Gujarat 382330, India</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="h-1 bg-[#DC2626]"></div>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded bg-[#F8F8F8] flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-[#DC2626]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] mb-1">Phone</h3>
                      <p className="text-gray-600">+91 99980 14994 (India)</p>
                      <p className="text-gray-600">+61 426 712 534 (Australia)</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="h-1 bg-[#DC2626]"></div>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded bg-[#F8F8F8] flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-[#DC2626]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] mb-1">Email</h3>
                      <p className="text-gray-600">info@vividpoly.com</p>
                      <p className="text-gray-600">exports@vividpoly.com</p>
                      <p className="text-gray-600">accounts@vividpoly.com</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="h-1 bg-[#DC2626]"></div>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded bg-[#F8F8F8] flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-[#DC2626]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] mb-1">Business Hours</h3>
                      <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM<br />Sat: 9:00 AM - 1:00 PM</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-xl">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Send us a Message</h2>
                    <p className="text-gray-600 mb-6">Fill out the form below and we'll get back to you within 24 hours.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-[#1A1A1A]">Name *</Label>
                          <Input 
                            id="name" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            required 
                            className="border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-[#1A1A1A]">Email *</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            required 
                            className="border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone" className="text-[#1A1A1A]">Phone</Label>
                          <Input 
                            id="phone" 
                            value={formData.phone} 
                            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                            className="border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="company" className="text-[#1A1A1A]">Company</Label>
                          <Input 
                            id="company" 
                            value={formData.company} 
                            onChange={(e) => setFormData({...formData, company: e.target.value})} 
                            className="border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="subject" className="text-[#1A1A1A]">Subject *</Label>
                        <Input 
                          id="subject" 
                          value={formData.subject} 
                          onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                          required 
                          className="border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="message" className="text-[#1A1A1A]">Message *</Label>
                        <Textarea 
                          id="message" 
                          rows={5} 
                          value={formData.message} 
                          onChange={(e) => setFormData({...formData, message: e.target.value})} 
                          required 
                          className="border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="bg-[#DC2626] hover:bg-[#005A5F] text-white rounded px-8" 
                        disabled={submitContact.isPending}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        {submitContact.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-[#f8fafa]">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Visit Our Facility</h2>
              <p className="text-gray-600">Located in the heart of Gujarat's industrial hub</p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl h-96 bg-gray-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.8!2d72.6!3d23.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzAwLjAiTiA3MsKwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="VividPoly Location"
              ></iframe>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

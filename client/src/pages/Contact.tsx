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
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Globe, User, Building2, Tag, Loader2 } from "lucide-react";

/** Shared styling for the contact form controls. `peer` lets the leading icon react to focus. */
const fieldClass =
  "peer h-12 rounded-xl border-gray-200 bg-gray-50/60 pl-11 text-sm shadow-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus-visible:border-[#DC2626] focus-visible:bg-white focus-visible:ring-[3px] focus-visible:ring-[#DC2626]/15";

const fieldIconClass =
  "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors peer-focus:text-[#DC2626]";

const optionalHint = <span className="text-xs font-normal text-gray-400">(optional)</span>;

const requiredMark = <span className="text-[#DC2626]">*</span>;

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
      pageUrl: window.location.href,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-[#1A1A1A] text-white py-12 sm:py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#DC2626_0%,transparent_50%)]" />
          </div>
          <div className="container px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl">
              <p className="text-[#DC2626] font-semibold mb-2 sm:mb-3 tracking-wide uppercase text-xs sm:text-sm">Contact Us</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Let's Start a<br />
                <span className="text-[#DC2626]">Conversation</span>
              </h1>
              <p className="text-sm sm:text-lg text-white/70 max-w-2xl">
                Whether you need a quote, have questions about our packaging solutions, or want to discuss a custom project — we're here to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Strip */}
        <section className="relative z-20 bg-white border-b">
          <div className="container flow-root px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 -mt-8 gap-px bg-gray-100 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-white p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#DC2626]" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A] text-xs sm:text-sm">Our Office</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5">Ahmedabad, Gujarat</p>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-[#DC2626]" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A] text-xs sm:text-sm">Call Us</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5">+91 99980 14994</p>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#DC2626]" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A] text-xs sm:text-sm">Email Us</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5">info@vividpoly.com</p>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#DC2626]" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A] text-xs sm:text-sm">Business Hours</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5">Mon-Fri: 9AM-6PM</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content: Form + Contact Details */}
        <section className="py-10 sm:py-16 bg-[#F9FAFB]">
          <div className="container px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 items-start">
              {/* Left: Main Contact Form */}
              <div>
                <Card className="border-0 rounded-2xl overflow-hidden ring-1 ring-gray-100 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_16px_40px_-20px_rgba(16,24,40,0.18)]">
                  <CardContent className="p-5 sm:p-8 md:p-10">
                    <div className="flex items-start gap-4 mb-8">
                      <div className="w-11 h-11 shrink-0 rounded-xl bg-[#DC2626]/10 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-[#DC2626]" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">Send us a Message</h2>
                        <p className="mt-1 text-sm text-gray-500">Fill out the form and we'll get back to you within 24 hours.</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-[13px] font-semibold text-[#1A1A1A]">
                            <span>Full Name {requiredMark}</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              required
                              autoComplete="name"
                              placeholder="John Doe"
                              className={fieldClass}
                            />
                            <User className={fieldIconClass} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-[13px] font-semibold text-[#1A1A1A]">
                            <span>Email Address {requiredMark}</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              required
                              autoComplete="email"
                              placeholder="john@company.com"
                              className={fieldClass}
                            />
                            <Mail className={fieldIconClass} />
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-[13px] font-semibold text-[#1A1A1A]">
                            <span>Phone Number {optionalHint}</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              autoComplete="tel"
                              placeholder="+91 XXXXX XXXXX"
                              className={fieldClass}
                            />
                            <Phone className={fieldIconClass} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-[13px] font-semibold text-[#1A1A1A]">
                            <span>Company Name {optionalHint}</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="company"
                              value={formData.company}
                              onChange={(e) => setFormData({...formData, company: e.target.value})}
                              autoComplete="organization"
                              placeholder="Your company"
                              className={fieldClass}
                            />
                            <Building2 className={fieldIconClass} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-[13px] font-semibold text-[#1A1A1A]">
                          <span>Subject {requiredMark}</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            required
                            placeholder="What is this regarding?"
                            className={fieldClass}
                          />
                          <Tag className={fieldIconClass} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-[13px] font-semibold text-[#1A1A1A]">
                          <span>Message {requiredMark}</span>
                        </Label>
                        <Textarea
                          id="message"
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          required
                          placeholder="Tell us about your requirements, quantities needed, or any specific questions..."
                          className="rounded-xl border-gray-200 bg-gray-50/60 px-4 py-3 text-sm shadow-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus-visible:border-[#DC2626] focus-visible:bg-white focus-visible:ring-[3px] focus-visible:ring-[#DC2626]/15"
                        />
                      </div>
                      <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full sm:w-auto bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-[#DC2626]/20 hover:shadow-xl hover:shadow-[#DC2626]/30 transition-all disabled:opacity-70"
                          disabled={submitContact.isPending}
                        >
                          {submitContact.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="mr-2 h-4 w-4" />
                          )}
                          {submitContact.isPending ? "Sending..." : "Send Message"}
                        </Button>
                        <p className="text-xs text-gray-400 text-center sm:text-left">
                          {requiredMark} Required fields
                        </p>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Contact Details */}
              <div className="lg:sticky lg:top-8 space-y-6">
                {/* Direct Contact Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h4 className="font-bold text-[#1A1A1A] mb-4 text-sm">Direct Contact</h4>
                  <div className="space-y-4">
                    <a href="tel:+919998014994" className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-lg bg-[#DC2626]/10 flex items-center justify-center group-hover:bg-[#DC2626] transition-colors">
                        <Phone className="h-4 w-4 text-[#DC2626] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#DC2626] transition-colors">+91 99980 14994</p>
                        <p className="text-xs text-gray-400">India</p>
                      </div>
                    </a>
                    <a href="tel:+61426712534" className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-lg bg-[#DC2626]/10 flex items-center justify-center group-hover:bg-[#DC2626] transition-colors">
                        <Globe className="h-4 w-4 text-[#DC2626] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#DC2626] transition-colors">+61 426 712 534</p>
                        <p className="text-xs text-gray-400">Australia</p>
                      </div>
                    </a>
                    <a href="mailto:info@vividpoly.com" className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-lg bg-[#DC2626]/10 flex items-center justify-center group-hover:bg-[#DC2626] transition-colors">
                        <Mail className="h-4 w-4 text-[#DC2626] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#DC2626] transition-colors">info@vividpoly.com</p>
                        <p className="text-xs text-gray-400">General Inquiries</p>
                      </div>
                    </a>
                    <a href="mailto:exports@vividpoly.com" className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-lg bg-[#DC2626]/10 flex items-center justify-center group-hover:bg-[#DC2626] transition-colors">
                        <Mail className="h-4 w-4 text-[#DC2626] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#DC2626] transition-colors">exports@vividpoly.com</p>
                        <p className="text-xs text-gray-400">Export Inquiries</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Address Card */}
                <div className="bg-[#1A1A1A] rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-[#DC2626]" />
                    <h4 className="font-bold text-sm">Visit Our Facility</h4>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Plot No. 45-48, GIDC Industrial Estate<br />
                    Naroda Industrial Area<br />
                    Ahmedabad, Gujarat 382330, India
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-white/60 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Mon - Fri: 9:00 AM - 6:00 PM | Sat: 9:00 AM - 1:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-10 sm:py-16 bg-white">
          <div className="container px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-2 sm:mb-3">Our Location</h2>
              <p className="text-gray-500 text-sm sm:text-base">Located in the heart of Gujarat's industrial hub</p>
            </div>
            <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-xl h-[280px] sm:h-[400px] bg-gray-200 border border-gray-100">
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

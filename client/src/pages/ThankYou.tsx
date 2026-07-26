import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Home as HomeIcon } from "lucide-react";
import { useEffect } from "react";

export default function ThankYou() {
  // Fire a lightweight conversion signal if any analytics is present. The URL
  // change to /thank-you is itself the primary conversion marker.
  useEffect(() => {
    try {
      (window as any).dataLayer?.push?.({ event: "lead_submitted" });
      (window as any).gtag?.("event", "generate_lead");
    } catch {
      /* analytics optional */
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-20">
        <div className="container max-w-2xl text-center">
          <div className="bg-white rounded-2xl shadow-lg p-10 md:p-14">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-11 h-11 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">Thank You!</h1>
            <p className="text-gray-600 text-lg mb-2">
              Your enquiry has been received successfully.
            </p>
            <p className="text-gray-500 mb-8">
              Our export team will get back to you within <strong>24 hours</strong> with pricing and
              specifications. For anything urgent, reach us on WhatsApp at{" "}
              <a href="https://wa.me/919998014994" className="text-[#DC2626] font-medium">
                +91 99980-14994
              </a>
              .
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-[#DC2626] hover:bg-[#B91C1C] text-white w-full sm:w-auto">
                  Browse Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

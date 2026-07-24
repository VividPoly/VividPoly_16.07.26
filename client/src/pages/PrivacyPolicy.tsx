import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Privacy Policy | VividPoly"
        description="How VividPoly collects, uses and protects your information, including our use of cookies for a better browsing experience."
        canonicalPath="/privacy-policy"
      />
      <Header />
      <main className="flex-1">
        <section className="bg-[#1A1A1A] text-white py-16">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            <p className="text-gray-300 mt-3 max-w-2xl">
              Your privacy matters to us. This policy explains what we collect and how we use it.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container max-w-3xl">
            <div className="prose prose-neutral max-w-none space-y-8 text-gray-600">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Cookies</h2>
                <p className="mt-2">
                  We use cookies to give you a better browsing experience, remember your
                  preferences and understand how our website is used so we can improve it. You
                  can accept or reject cookies using the banner shown on your first visit, and you
                  can change your choice at any time by clearing your browser storage for this site.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Information We Collect</h2>
                <p className="mt-2">
                  When you submit an enquiry or quote request, we collect the details you provide
                  (such as your name, company, email, phone number, country and message) so our
                  export team can respond. We do not sell your personal information.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">How We Use Your Information</h2>
                <p className="mt-2">
                  Your information is used only to respond to your enquiry, provide quotations and
                  samples, and keep you updated about your order. Attachments you upload are used
                  solely to prepare your quotation.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Data Security</h2>
                <p className="mt-2">
                  We take reasonable technical and organisational measures to protect your
                  information against unauthorised access, alteration or disclosure.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Contact Us</h2>
                <p className="mt-2">
                  For any privacy questions or requests, contact us at{" "}
                  <a href="mailto:info@vividpoly.com" className="text-[#DC2626] underline">
                    info@vividpoly.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

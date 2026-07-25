import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { 
  Clock, 
  Package, 
  FileText, 
  Eye, 
  ArrowRight,
  CheckCircle,
  MessageSquare,
  DollarSign,
  Truck,
  XCircle,
  Loader2,
  Calendar,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

// Status badge colors and icons
const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ElementType; label: string }> = {
  new: { color: "text-blue-700", bgColor: "bg-blue-100", icon: Clock, label: "New" },
  contacted: { color: "text-yellow-700", bgColor: "bg-yellow-100", icon: MessageSquare, label: "Contacted" },
  quoted: { color: "text-purple-700", bgColor: "bg-purple-100", icon: DollarSign, label: "Quoted" },
  converted: { color: "text-green-700", bgColor: "bg-green-100", icon: CheckCircle, label: "Converted" },
  closed: { color: "text-gray-700", bgColor: "bg-gray-100", icon: XCircle, label: "Closed" }
};

export default function OrderHistory() {
  const { user, loading: authLoading } = useAuth();
  const [selectedInquiry, setSelectedInquiry] = useState<number | null>(null);

  // Fetch user's inquiries
  const { data: inquiries, isLoading } = trpc.contact.getUserInquiries.useQuery(
    undefined,
    { enabled: !!user }
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#DC2626]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-[#DC2626]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-[#DC2626]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-8">
              Please sign in to view your inquiry history and track the status of your quotation requests.
            </p>
            <Button asChild className="bg-[#DC2626] hover:bg-[#005a63]">
              <Link href="/login">
                Sign In <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedInquiryData = inquiries?.find(i => i.id === selectedInquiry);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1A1A1A] to-[#DC2626] text-white py-12">
        <div className="container">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span>Order History</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Inquiry History</h1>
          <p className="text-white/80 max-w-2xl">
            Track the status of your quotation requests and view your complete inquiry history with VividPoly.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#DC2626]" />
            </div>
          ) : !inquiries || inquiries.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="w-20 h-20 bg-[#DC2626]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-[#DC2626]" />
              </div>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">No Inquiries Yet</h2>
              <p className="text-gray-600 mb-8">
                You haven't submitted any quotation requests yet. Start by exploring our products and requesting a quote.
              </p>
              <Button asChild className="bg-[#DC2626] hover:bg-[#005a63]">
                <Link href="/inquiries">
                  Request a Quote <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Inquiry List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#1A1A1A]">
                    Your Inquiries ({inquiries.length})
                  </h2>
                </div>

                {inquiries.map((inquiry) => {
                  const status = statusConfig[inquiry.status] || statusConfig.new;
                  const StatusIcon = status.icon;
                  
                  return (
                    <div 
                      key={inquiry.id}
                      className={`bg-white rounded-xl shadow-sm border-2 p-6 cursor-pointer transition-all hover:shadow-md ${
                        selectedInquiry === inquiry.id ? 'border-[#DC2626]' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedInquiry(inquiry.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              {status.label}
                            </span>
                            <span className="text-sm text-gray-500">
                              #{inquiry.id.toString().padStart(5, '0')}
                            </span>
                          </div>
                          <h3 className="font-semibold text-[#1A1A1A] mb-1">
                            {inquiry.productInterest || 'General Inquiry'}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {inquiry.message}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            {inquiry.quantity && (
                              <span className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                {inquiry.quantity}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inquiry Details Panel */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
                  {selectedInquiryData ? (
                    <>
                      <h3 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Inquiry Details
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm text-gray-500">Reference Number</span>
                          <p className="font-medium text-[#1A1A1A]">
                            #{selectedInquiryData.id.toString().padStart(5, '0')}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm text-gray-500">Status</span>
                          <p className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[selectedInquiryData.status]?.bgColor} ${statusConfig[selectedInquiryData.status]?.color}`}>
                            {statusConfig[selectedInquiryData.status]?.label || 'New'}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm text-gray-500">Product Interest</span>
                          <p className="font-medium text-[#1A1A1A]">
                            {selectedInquiryData.productInterest || 'General Inquiry'}
                          </p>
                        </div>

                        {selectedInquiryData.quantity && (
                          <div>
                            <span className="text-sm text-gray-500">Quantity</span>
                            <p className="font-medium text-[#1A1A1A]">
                              {selectedInquiryData.quantity}
                            </p>
                          </div>
                        )}

                        <div>
                          <span className="text-sm text-gray-500">Submitted On</span>
                          <p className="font-medium text-[#1A1A1A]">
                            {new Date(selectedInquiryData.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm text-gray-500">Your Message</span>
                          <p className="text-gray-700 text-sm mt-1 bg-gray-50 p-3 rounded-lg">
                            {selectedInquiryData.message}
                          </p>
                        </div>

                        {selectedInquiryData.attachments && (() => {
                          const attachmentUrls = JSON.parse(selectedInquiryData.attachments) as string[];
                          return attachmentUrls.length > 0 && (
                          <div>
                            <span className="text-sm text-gray-500">Attachments</span>
                            <div className="mt-2 space-y-2">
                              {attachmentUrls.map((url: string, index: number) => (
                                <a 
                                  key={index}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-[#DC2626] hover:underline"
                                >
                                  <FileText className="w-4 h-4" />
                                  Attachment {index + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                        })()}
                      </div>

                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-medium text-[#1A1A1A] mb-3">Need Help?</h4>
                        <div className="space-y-2 text-sm">
                          <a href="mailto:exports@vividpoly.com" className="flex items-center gap-2 text-gray-600 hover:text-[#DC2626]">
                            <Mail className="w-4 h-4" />
                            exports@vividpoly.com
                          </a>
                          <a href="tel:+919998014994" className="flex items-center gap-2 text-gray-600 hover:text-[#DC2626]">
                            <Phone className="w-4 h-4" />
                            +91 99980 14994
                          </a>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Select an inquiry to view details</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-[#DC2626]">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need a New Quote?</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Submit a new inquiry and our export team will respond within 24 hours with a detailed quotation.
          </p>
          <Button asChild className="bg-white text-[#DC2626] hover:bg-gray-100">
            <Link href="/inquiries">
              Request a Quote <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

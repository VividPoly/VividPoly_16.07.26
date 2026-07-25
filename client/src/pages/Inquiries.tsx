import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useState, useRef } from "react";
import { 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Clock,
  Package,
  Truck,
  Shield,
  Award,
  Upload,
  X,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

// Complete list of countries
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos",
  "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
  "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
  "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// Export regions with SEO keywords
const exportRegions = [
  {
    region: "Australia & Oceania",
    countries: ["Germany", "France", "UK", "Italy", "Spain", "Netherlands", "Belgium", "Poland"],
    keywords: "PP woven bags Australia, polypropylene packaging Oceania, bulk bags New Zealand"
  },
  {
    region: "North America",
    countries: ["USA", "Canada", "Mexico"],
    keywords: "PP woven bags USA, bulk packaging Canada, industrial bags North America"
  },
  {
    region: "Latin America",
    countries: ["Brazil", "Argentina", "Chile", "Colombia", "Peru"],
    keywords: "PP woven sacks Latin America, packaging bags Brazil, export bags South America"
  },
  {
    region: "Africa",
    countries: ["South Africa", "Kenya", "Nigeria", "Egypt", "Morocco", "Ghana"],
    keywords: "PP bags Africa, woven sacks export Africa, agricultural bags Kenya"
  },
  {
    region: "Oceania",
    countries: ["Australia", "New Zealand"],
    keywords: "PP woven bags Australia, bulk packaging New Zealand, industrial bags Oceania"
  },
  {
    region: "Middle East",
    countries: ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Oman"],
    keywords: "PP bags Middle East, woven packaging UAE, cement bags Saudi Arabia"
  }
];

// Product categories for inquiry form with subcategories
const productCategoriesForForm = [
  {
    name: "PP Woven Fabrics (Coated/Uncoated)",
    subcategories: []
  },
  {
    name: "PP Woven Bags",
    subcategories: [
      "Open Mouth PP Bags",
      "Top and Bottom Stitched Bags",
      "D-Cut PP Woven Bags",
      "Valve Bags",
      "PP Carry Bags",
      "Pinch Bottom Bags",
      "Block Bottom Bags",
      "Bottom Gusset Bags"
    ]
  },
  {
    name: "BOPP Laminated PP Woven Bags",
    subcategories: [
      "BOPP Open Mouth Bags",
      "BOPP Top and Bottom Stitched",
      "BOPP D-Cut Bags",
      "BOPP Valve Bags",
      "BOPP Carry Bags",
      "BOPP Pinch Bottom Bags",
      "BOPP Block Bottom Bags",
      "BOPP Bottom Gusset Bags"
    ]
  },
  {
    name: "Custom Packaging",
    subcategories: []
  },
  {
    name: "Other",
    subcategories: []
  }
];

// Country codes for phone numbers
const countryCodes = [
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+962", country: "Jordan", flag: "🇯🇴" },
  { code: "+961", country: "Lebanon", flag: "🇱🇧" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" }
];

// Why choose us points
const whyChooseUs = [
  {
    icon: Award,
    title: "ISO Certified Quality",
    description: "ISO 9001:2015 certified manufacturing processes ensuring consistent quality standards"
  },
  {
    icon: Truck,
    title: "Global Export Experience",
    description: "Exporting to 70+ countries across 6 continents with reliable logistics partnerships"
  },
  {
    icon: Shield,
    title: "Competitive Pricing",
    description: "Factory-direct pricing with transparent quotations and no hidden costs"
  },
  {
    icon: Package,
    title: "Custom Solutions",
    description: "Tailored packaging solutions to meet your specific industry requirements"
  }
];

// File type icons
function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
    return <ImageIcon className="w-5 h-5 text-[#DC2626]" />;
  }
  return <FileText className="w-5 h-5 text-[#DC2626]" />;
}

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function Inquiries() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    countryCode: "+91",
    phone: "",
    country: "",
    productCategory: "",
    productSubcategory: "",
    quantity: "",
    // Size specifications
    bagWidth: "",
    bagHeight: "",
    bagGusset: "",
    gsmWeight: "",
    printingColors: "",
    message: ""
  });
  
  // Get subcategories for selected category
  const selectedCategory = productCategoriesForForm.find(cat => cat.name === formData.productCategory);
  const subcategories = selectedCategory?.subcategories || [];
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip', 'application/x-rar-compressed'
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Check total file count
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`You can only upload up to ${MAX_FILES} files`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of selectedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds 20MB limit`);
        continue;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        continue;
      }
      validFiles.push(file);
    }

    setFiles([...files, ...validFiles]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const submitInquiry = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setFiles([]);
      setUploadProgress(0);
      setLocation("/thank-you");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit inquiry. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      // Upload files to S3 if any
      const uploadedUrls: string[] = [];
      
      if (files.length > 0) {
        const totalFiles = files.length;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append('file', file);
          
          // Upload to backend which will store in S3
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (response.ok) {
            const result = await response.json();
            uploadedUrls.push(result.url);
          }
          
          setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
        }
      }
      
      // Submit inquiry with file URLs
      await submitInquiry.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone ? `${formData.countryCode} ${formData.phone}` : undefined,
        company: formData.company || undefined,
        country: formData.country || undefined,
        productInterest: formData.productSubcategory ? `${formData.productCategory} - ${formData.productSubcategory}` : formData.productCategory || undefined,
        quantity: formData.quantity || undefined,
        bagWidth: formData.bagWidth || undefined,
        bagHeight: formData.bagHeight || undefined,
        bagGusset: formData.bagGusset || undefined,
        gsmWeight: formData.gsmWeight || undefined,
        printingColors: formData.printingColors || undefined,
        message: formData.message,
        attachments: uploadedUrls.length > 0 ? uploadedUrls : undefined,
        source: "Quote Request (Inquiries page)",
        pageUrl: window.location.href,
      });
      
    } catch (error) {
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#DC2626] to-[#1A1A1A] text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          <div className="container relative z-10">
            <nav className="text-sm mb-6 text-white/70">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">›</span>
              <span className="text-white">Request a Quote</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Request a Quote</h1>
            <p className="text-xl text-white/80 max-w-3xl">
              Get competitive pricing for premium PP woven packaging. We export to Australia, New Zealand, Africa, Latin America & Asia. FOB pricing available.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Inquiry Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Send Your Inquiry</h2>
                  <p className="text-gray-600 mb-8">
                    Fill out the form below and our export team will respond within 24 hours with a detailed quotation.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-[#1A1A1A] font-medium">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Your full name"
                          className="mt-1 border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company" className="text-[#1A1A1A] font-medium">Company Name *</Label>
                        <Input
                          id="company"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          placeholder="Your company name"
                          className="mt-1 border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email" className="text-[#1A1A1A] font-medium">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="your@email.com"
                          className="mt-1 border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-[#1A1A1A] font-medium">Phone Number *</Label>
                        <div className="mt-1 flex gap-2">
                          <select
                            id="countryCode"
                            value={formData.countryCode}
                            onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                            className="w-32 h-10 px-2 rounded-md border border-gray-300 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] bg-white text-gray-900 text-sm"
                          >
                            {countryCodes.map((cc) => (
                              <option key={cc.code} value={cc.code}>{cc.flag} {cc.code}</option>
                            ))}
                          </select>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="9998014994"
                            className="flex-1 border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="country" className="text-[#1A1A1A] font-medium">Country *</Label>
                        <select
                          id="country"
                          required
                          value={formData.country}
                          onChange={(e) => setFormData({...formData, country: e.target.value})}
                          className="mt-1 w-full h-10 px-3 rounded-md border border-gray-300 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] bg-white text-gray-900"
                        >
                          <option value="">Select your country</option>
                          {countries.map((country) => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="product" className="text-[#1A1A1A] font-medium">Product Category *</Label>
                        <select
                          id="product"
                          required
                          value={formData.productCategory}
                          onChange={(e) => setFormData({...formData, productCategory: e.target.value, productSubcategory: ""})}
                          className="mt-1 w-full h-10 px-3 rounded-md border border-gray-300 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] bg-white text-gray-900"
                        >
                          <option value="">Select a product category</option>
                          {productCategoriesForForm.map((cat) => (
                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Subcategory dropdown - only show if category has subcategories */}
                    {subcategories.length > 0 && (
                      <div>
                        <Label htmlFor="subcategory" className="text-[#1A1A1A] font-medium">Product Type *</Label>
                        <select
                          id="subcategory"
                          required
                          value={formData.productSubcategory}
                          onChange={(e) => setFormData({...formData, productSubcategory: e.target.value})}
                          className="mt-1 w-full h-10 px-3 rounded-md border border-gray-300 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] bg-white text-gray-900"
                        >
                          <option value="">Select product type</option>
                          {subcategories.map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="quantity" className="text-[#1A1A1A] font-medium">Estimated Quantity</Label>
                      <Input
                        id="quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        placeholder="e.g., 50,000 bags per month"
                        className="mt-1 border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                      />
                    </div>

                    {/* Size Specifications Section */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-[#1A1A1A] font-semibold mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Size Specifications (Optional)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <Label htmlFor="bagWidth" className="text-[#1A1A1A] text-sm">Width (cm)</Label>
                          <Input
                            id="bagWidth"
                            type="number"
                            value={formData.bagWidth}
                            onChange={(e) => setFormData({...formData, bagWidth: e.target.value})}
                            placeholder="e.g., 50"
                            className="mt-1 border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bagHeight" className="text-[#1A1A1A] text-sm">Height (cm)</Label>
                          <Input
                            id="bagHeight"
                            type="number"
                            value={formData.bagHeight}
                            onChange={(e) => setFormData({...formData, bagHeight: e.target.value})}
                            placeholder="e.g., 80"
                            className="mt-1 border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bagGusset" className="text-[#1A1A1A] text-sm">Gusset (cm)</Label>
                          <Input
                            id="bagGusset"
                            type="number"
                            value={formData.bagGusset}
                            onChange={(e) => setFormData({...formData, bagGusset: e.target.value})}
                            placeholder="e.g., 15"
                            className="mt-1 border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="gsmWeight" className="text-[#1A1A1A] text-sm">GSM Weight</Label>
                          <Input
                            id="gsmWeight"
                            type="number"
                            value={formData.gsmWeight}
                            onChange={(e) => setFormData({...formData, gsmWeight: e.target.value})}
                            placeholder="e.g., 60"
                            className="mt-1 border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <Label htmlFor="printingColors" className="text-[#1A1A1A] text-sm">Printing Colors</Label>
                        <select
                          id="printingColors"
                          value={formData.printingColors}
                          onChange={(e) => setFormData({...formData, printingColors: e.target.value})}
                          className="mt-1 w-full h-10 px-3 rounded-md border border-gray-300 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] bg-white text-gray-900"
                        >
                          <option value="">Select printing option</option>
                          <option value="No Printing">No Printing (Plain)</option>
                          <option value="1 Color">1 Color</option>
                          <option value="2 Colors">2 Colors</option>
                          <option value="3 Colors">3 Colors</option>
                          <option value="4 Colors">4 Colors</option>
                          <option value="5+ Colors">5+ Colors (Full Color)</option>
                          <option value="BOPP Lamination">BOPP Lamination (Photo Quality)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-[#1A1A1A] font-medium">Your Requirements *</Label>
                      <Textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Please describe your packaging requirements including bag size, printing specifications, quantity, and delivery location..."
                        className="mt-1 border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                      />
                    </div>

                    {/* File Upload Section */}
                    <div>
                      <Label className="text-[#1A1A1A] font-medium">
                        Attachments <span className="text-gray-500 font-normal">(Logo, designs, documents - up to 5 files, 20MB each)</span>
                      </Label>
                      <div className="mt-2">
                        <div 
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#DC2626] transition-colors cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-1">
                            <span className="text-[#DC2626] font-medium">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-sm text-gray-500">
                            Images, PDFs, Word, Excel, PowerPoint, ZIP (Max 20MB each)
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {files.map((file, index) => (
                              <div 
                                key={index} 
                                className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
                              >
                                <div className="flex items-center gap-3">
                                  {getFileIcon(file.name)}
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-[200px] md:max-w-[300px]">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                  <X className="w-4 h-4 text-gray-500" />
                                </button>
                              </div>
                            ))}
                            <p className="text-sm text-gray-500 mt-2">
                              {files.length} of {MAX_FILES} files selected
                            </p>
                          </div>
                        )}

                        {/* Upload Progress */}
                        {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Uploading files...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#DC2626] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#DC2626] hover:bg-[#1A1A1A] text-white py-3 text-lg font-semibold"
                    >
                      {isSubmitting ? "Sending..." : "Submit Inquiry"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </div>

              {/* Contact Info Sidebar */}
              <div className="space-y-6">
                {/* Contact Card */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-[#DC2626] mt-1" />
                      <div>
                        <p className="font-medium text-[#1A1A1A]">Phone</p>
                        <p className="text-gray-600">+91 99980 14994</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-[#DC2626] mt-1" />
                      <div>
                        <p className="font-medium text-[#1A1A1A]">Email</p>
                        <p className="text-gray-600">exports@vividpoly.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#DC2626] mt-1" />
                      <div>
                        <p className="font-medium text-[#1A1A1A]">Factory Address</p>
                        <p className="text-gray-600">Industrial Area, Gujarat, India</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#DC2626] mt-1" />
                      <div>
                        <p className="font-medium text-[#1A1A1A]">Response Time</p>
                        <p className="text-gray-600">Within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export Regions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#DC2626]" />
                    We Export To
                  </h3>
                  <div className="space-y-3">
                    {exportRegions.map((region) => (
                      <div key={region.region} className="border-b border-gray-100 pb-2 last:border-0">
                        <p className="font-medium text-[#1A1A1A]">{region.region}</p>
                        <p className="text-sm text-gray-500">{region.countries.slice(0, 4).join(", ")}...</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Why Choose VividPoly?</h2>
              <div className="w-16 h-1 bg-[#DC2626] mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseUs.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-[#DC2626]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-[#DC2626]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">
                Premium PP Woven Packaging Solutions for Global Markets
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  VividPoly is a leading manufacturer and exporter of high-quality PP woven bags, BOPP laminated bags, 
                  and polypropylene woven fabric from India. We specialize in providing custom packaging solutions for 
                  agriculture, cement, chemicals, food processing, and retail industries worldwide.
                </p>
                <p>
                  Our state-of-the-art manufacturing facility produces a wide range of woven polypropylene products 
                  including bulk bags, valve bags, block bottom bags, gusseted bags, and printed laminated bags. 
                  With ISO 9001:2015 certification and strict quality control processes, we ensure consistent 
                  product quality that meets international standards.
                </p>
                <p>
                  We export PP woven packaging to Australia, New Zealand, Africa (Nigeria, Ghana, Kenya, Tanzania), 
                  Latin America (Brazil, Argentina, Chile), Africa (South Africa, Kenya, Nigeria), and Oceania 
                  (Australia, New Zealand). Our competitive factory-direct pricing, reliable delivery schedules, 
                  and dedicated export team make us the preferred packaging partner for businesses worldwide.
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

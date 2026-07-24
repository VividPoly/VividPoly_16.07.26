import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Send, Upload, FileText, Image, File, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const POPUP_DELAY_MS = 60000; // 1 minute
const POPUP_SESSION_KEY = "vividpoly_inquiry_popup_shown";

export default function InquiryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    productInterest: "",
    message: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const ALLOWED_TYPES = [
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "application/pdf",
    "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/zip",
  ];

  useEffect(() => {
    // Check if popup was already shown in this session
    const alreadyShown = sessionStorage.getItem(POPUP_SESSION_KEY);
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem(POPUP_SESSION_KEY, "true");
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return <Image className="w-4 h-4 text-blue-500" />;
    if (["pdf"].includes(ext || "")) return <FileText className="w-4 h-4 text-red-500" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const submitInquiry = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you! Our team will contact you within 24 hours.");
      setIsOpen(false);
      setFormData({ name: "", email: "", phone: "", company: "", country: "", productInterest: "", message: "" });
      setFiles([]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message || !formData.company || !formData.country || !formData.productInterest) {
      toast.error("Please fill in all required fields (name, email, company, country, product, and message)");
      return;
    }
    setIsSubmitting(true);

    try {
      // Upload files if any
      const uploadedUrls: string[] = [];
      if (files.length > 0) {
        for (const file of files) {
          const fd = new FormData();
          fd.append("file", file);
          const response = await fetch("/api/upload", { method: "POST", body: fd });
          if (response.ok) {
            const result = await response.json();
            uploadedUrls.push(result.url);
          }
        }
      }

      await submitInquiry.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        country: formData.country || undefined,
        productInterest: formData.productInterest || undefined,
        message: formData.message,
        attachments: uploadedUrls.length > 0 ? uploadedUrls : undefined,
      });
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white rounded-2xl shadow-2xl w-[95%] max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#DC2626] to-[#1A1A1A] text-white p-5 rounded-t-2xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">Get a Free Quote</h2>
          <p className="text-sm text-white/80 mt-1">
            Tell us your packaging needs. Our export team responds within 24 hours.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Company *</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                placeholder="Company name"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Country *</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                placeholder="Your country"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                placeholder="+1 234 567 890"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Product Interest *</label>
              <select
                value={formData.productInterest}
                onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#DC2626] focus:border-transparent bg-white"
                required
              >
                <option value="">Select product</option>
                <option value="PP Woven Bags">PP Woven Bags</option>
                <option value="BOPP Laminated Bags">BOPP Laminated Bags</option>
                <option value="PP Woven Fabric">PP Woven Fabric</option>
                <option value="Block Bottom Bags">Block Bottom Bags</option>
                <option value="Pinch Bottom Bags">Pinch Bottom Bags</option>
                <option value="D-Cut Carry Bags">D-Cut Carry Bags</option>
                <option value="Open Mouth Bags">Open Mouth Bags</option>
                <option value="Valve Bags">Valve Bags</option>
                <option value="Custom Printed Bags">Custom Printed Bags</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#DC2626] focus:border-transparent resize-none"
              rows={3}
              placeholder="Describe your requirements (quantity, size, printing, delivery timeline...)"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="text-xs font-medium text-gray-700">
              Attachments <span className="text-gray-400">(up to {MAX_FILES} files, 20MB each)</span>
            </label>
            <div
              className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-[#DC2626] transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">
                <span className="text-[#DC2626] font-medium">Click to upload</span> - Images, PDFs, Docs, ZIP
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.zip"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.name)}
                      <span className="truncate max-w-[180px]">{file.name}</span>
                      <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                    </div>
                    <button type="button" onClick={() => removeFile(index)} className="p-1 hover:bg-gray-200 rounded-full">
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#DC2626] hover:bg-[#1A1A1A] text-white py-3 font-semibold rounded-lg"
          >
            {isSubmitting ? "Sending..." : "Send Inquiry"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-xs text-center text-gray-400">
            Or visit our <a href="/inquiries" className="text-[#DC2626] underline">full inquiry page</a> for detailed specifications
          </p>
        </form>
      </div>
    </div>
  );
}

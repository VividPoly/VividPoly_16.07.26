import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";
import { ArrowLeft, Package, ShoppingCart, ArrowRight } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

// Static product types data (same as Products page)
const productTypes: Record<string, {
  id: string;
  name: string;
  code: string;
  image: string;
  description: string;
  keywords: string[];
  gallery?: string[];
}> = {

  "woven-fabric": {
    id: "woven-fabric",
    name: "PP Woven Fabrics (Coated/Uncoated)",
    code: "WF",
    image: "/media/pp-woven-fabric-rolls_6c53c692.jpg",
    description: "Industrial-grade PP woven fabric rolls available in coated and uncoated variants. Perfect for manufacturing bags, tarpaulins, and ground covers. Custom GSM (40-200), width, and weave patterns available. UV stabilized options for outdoor applications.",
    keywords: ["PP woven fabric", "polypropylene fabric", "woven fabric rolls", "coated fabric"]
  },
  "open-mouth-pp-bags": {
    id: "open-mouth-pp-bags",
    name: "Open Mouth PP Bags",
    code: "OMPB",
    image: "/media/front_d62a94b3.webp",
    description: "Open Mouth PP Bags are the most versatile and widely used packaging solution for bulk commodities. These bags feature an open top for easy filling and can be closed using stitching, heat sealing, or tying. Available in multiple colors and sizes.",
    keywords: ["open mouth bags", "PP woven bags", "bulk packaging", "grain bags"],
    gallery: [
      "/media/front_d62a94b3.webp",
      "/media/left-quarter_bf663005.webp",
      "/media/right-quarter_7b0fb600.webp",
      "/media/side_ced45ecb.webp",
      "/media/high-angle_d449fd4d.webp"
    ]
  },
  "bopp-open-mouth": {
    id: "bopp-open-mouth",
    name: "BOPP Open Mouth Bags",
    code: "BOMPB",
    image: "/media/front_8ddcc50d.webp",
    description: "BOPP Open Mouth Bags combine the strength of PP woven fabric with the visual appeal of BOPP lamination. High-gloss or matte finish provides excellent printability for premium branding. Ideal for products requiring attractive retail presentation.",
    keywords: ["BOPP open mouth bags", "laminated bags", "premium packaging", "printed bags"],
    gallery: [
      "/media/front_8ddcc50d.webp",
      "/media/left-quarter_c1e3cd15.webp"
    ]
  },
  "pp-woven-bags": {
    id: "pp-woven-bags",
    name: "PP Woven Bags",
    code: "WPP",
    image: "/products/pp-woven-bag-white.jpg",
    description: "Versatile polypropylene woven bags for agricultural, industrial, and commercial packaging. Available in various sizes from 10kg to 50kg capacity with excellent load-bearing strength. Custom printing and lamination options available.",
    keywords: ["PP woven bags", "polypropylene bags", "woven sacks", "bulk packaging bags"]
  },
  "bopp-laminated": {
    id: "bopp-laminated",
    name: "BOPP Laminated Bags",
    code: "PLWPP",
    image: "/products/photos/bopp-front.webp",
    description: "Premium BOPP laminated PP woven bags with high-definition printing. Biaxially oriented polypropylene film provides superior clarity, moisture barrier, and vibrant graphics for brand visibility. Ideal for retail packaging.",
    keywords: ["BOPP laminated bags", "printed woven bags", "laminated PP bags", "branded packaging"]
  },
  "pinch-bottom": {
    id: "pinch-bottom",
    name: "Pinch Bottom Bags",
    code: "PLWPP-PBB",
    image: "/media/black_5ce3cc67.webp",
    description: "Innovative pinch bottom closure bags ideal for cement, chemicals, and fertilizers. Self-sealing design ensures dust-proof packaging with excellent stacking stability and easy filling on automated lines.",
    keywords: ["pinch bottom bags", "cement bags", "valve bags", "self-sealing bags"],
    gallery: [
      "/media/black_5ce3cc67.webp",
      "/media/green_1a6a2120.webp",
      "/media/yellow_e72be445.webp",
      "/media/red_b94f0550.webp",
      "/media/white_e8ca4330.webp"
    ]
  },
  "pinch-bottom-bags": {
    id: "pinch-bottom-bags",
    name: "Pinch Bottom Bags",
    code: "PBB",
    image: "/media/black_5ce3cc67.webp",
    description: "Pinch Bottom Bags feature a unique bottom closure formed by pinching and sealing the fabric layers together. Ideal for automated filling and provides excellent stacking stability.",
    keywords: ["pinch bottom bags", "automated filling bags", "pet food bags", "animal feed bags"],
    gallery: [
      "/media/black_5ce3cc67.webp",
      "/media/green_1a6a2120.webp",
      "/media/yellow_e72be445.webp",
      "/media/red_b94f0550.webp",
      "/media/white_e8ca4330.webp"
    ]
  },
  "bopp-pinch-bottom": {
    id: "bopp-pinch-bottom",
    name: "BOPP Pinch Bottom Bags",
    code: "BPBB",
    image: "/media/yellow_e72be445.webp",
    description: "BOPP Pinch Bottom Bags offer the efficiency of pinch bottom construction with the premium appearance of BOPP lamination. Perfect for automated filling lines where brand presentation matters.",
    keywords: ["BOPP pinch bottom bags", "laminated pinch bags", "premium pet food bags"],
    gallery: [
      "/media/yellow_e72be445.webp",
      "/media/black_5ce3cc67.webp",
      "/media/green_1a6a2120.webp",
      "/media/red_b94f0550.webp",
      "/media/white_e8ca4330.webp"
    ]
  },
  "block-bottom": {
    id: "block-bottom",
    name: "Block Bottom Bags",
    code: "BBB",
    image: "/media/red_ebf5c122.webp",
    description: "Square block bottom bags providing superior shelf appeal and stability. Ideal for retail packaging of rice, flour, sugar, and pet food. Flat bottom allows upright display and efficient stacking. Available in multiple colors and custom printing options for brand visibility.",
    keywords: ["block bottom bags", "square bottom bags", "retail packaging", "standing bags"],
    gallery: [
      "/media/red_ebf5c122.webp",
      "/media/green_d7a7ca49.webp",
      "/media/white_7de41d86.webp",
      "/media/black_a8720d19.webp",
      "/media/yellow_57abafb0.webp"
    ]
  },
  "gusseted-bags": {
    id: "gusseted-bags",
    name: "Bottom Gusset Bags",
    code: "GUS",
    image: "/media/white_01c10dbf.webp",
    description: "Expandable gusseted bags for medium to large volume packaging. Bottom gussets provide increased capacity while maintaining compact storage when empty. Available in various sizes and colors.",
    keywords: ["gusseted bags", "expandable bags", "bottom gusset bags", "bulk storage bags"],
    gallery: [
      "/media/white_01c10dbf.webp",
      "/media/black_6a63e1fb.webp"
    ]
  },
  "bottom-gusset-bags": {
    id: "bottom-gusset-bags",
    name: "Bottom Gusset Bags",
    code: "BGB",
    image: "/media/white_01c10dbf.webp",
    description: "Bottom Gusset Bags feature an expandable gusset at the bottom that increases the bag's capacity and allows it to stand more stably when filled. Popular for products that require extra volume or better presentation.",
    keywords: ["bottom gusset bags", "expandable bags", "standing bags", "bulk packaging"],
    gallery: [
      "/media/white_01c10dbf.webp",
      "/media/black_6a63e1fb.webp"
    ]
  },
  "bopp-top-bottom-stitched": {
    id: "bopp-top-bottom-stitched",
    name: "BOPP Top and Bottom Stitched",
    code: "BTBS",
    image: "/media/yellow_6449aaaa.webp",
    description: "BOPP Top and Bottom Stitched Bags offer the premium appearance of BOPP lamination with the security of double-stitched construction. Ideal for products requiring both visual appeal and robust packaging.",
    keywords: ["BOPP stitched bags", "laminated bags", "top bottom stitched", "premium packaging"],
    gallery: [
      "/media/yellow_6449aaaa.webp"
    ]
  },
  "bopp-bottom-gusset": {
    id: "bopp-bottom-gusset",
    name: "BOPP Bottom Gusset Bags",
    code: "BBGB",
    image: "/media/white_01c10dbf.webp",
    description: "BOPP Bottom Gusset Bags feature an expandable gusset at the bottom combined with premium BOPP lamination. This design provides increased capacity with attractive retail presentation.",
    keywords: ["BOPP gusset bags", "laminated gusset bags", "premium packaging", "expandable bags"],
    gallery: [
      "/media/white_01c10dbf.webp",
      "/media/black_6a63e1fb.webp"
    ]
  },
  "shopping-bags": {
    id: "shopping-bags",
    name: "PP Woven Shopping Bags",
    code: "RSB",
    image: "/media/red_f3abe28e.webp",
    description: "Eco-friendly reusable PP woven shopping bags with reinforced handles. Custom printed promotional bags for retail, supermarkets, and brand marketing campaigns. 100% recyclable.",
    keywords: ["PP shopping bags", "reusable bags", "promotional bags", "eco-friendly bags"],
    gallery: [
      "/media/red_f3abe28e.webp",
      "/media/white_7a860d84.webp",
      "/media/green_ff7904ce.webp",
      "/media/yellow_0561786e.webp",
      "/media/black_7a4ae74e.webp"
    ]
  },
  "d-cut-pp-bags": {
    id: "d-cut-pp-bags",
    name: "D-Cut PP Woven Bags",
    code: "DCB",
    image: "/media/red_f3abe28e.webp",
    description: "D-Cut PP Woven Bags feature integrated die-cut handles for easy carrying. Perfect for retail, promotional, and grocery applications with full-color printing options.",
    keywords: ["D-cut bags", "PP woven bags", "shopping bags", "die-cut handle bags"],
    gallery: [
      "/media/red_f3abe28e.webp",
      "/media/white_7a860d84.webp",
      "/media/green_ff7904ce.webp",
      "/media/yellow_0561786e.webp",
      "/media/black_7a4ae74e.webp"
    ]
  },
  "bopp-d-cut": {
    id: "bopp-d-cut",
    name: "BOPP D-Cut Bags",
    code: "BDCB",
    image: "/media/green_ff7904ce.webp",
    description: "BOPP D-Cut Bags combine the convenience of die-cut handles with the premium appearance of BOPP lamination. Perfect for retail and promotional applications where brand image is paramount.",
    keywords: ["BOPP D-cut bags", "laminated shopping bags", "premium retail bags", "promotional bags"],
    gallery: [
      "/media/green_ff7904ce.webp",
      "/media/yellow_0561786e.webp",
      "/media/black_7a4ae74e.webp",
      "/media/red_f3abe28e.webp",
      "/media/white_7a860d84.webp"
    ]
  },

  "valve-bags": {
    id: "valve-bags",
    name: "Valve Type Bags",
    code: "VLV",
    image: "/products/valve-bag-cement.jpg",
    description: "Industrial valve bags designed for automated filling lines. Self-closing valve ensures dust-free packaging for cement, chemicals, minerals, and powdered products. Available in various capacities.",
    keywords: ["valve bags", "industrial packaging", "cement valve bags", "automated filling bags"]
  },
  "courier-bags": {
    id: "courier-bags",
    name: "Courier & E-commerce Bags",
    code: "CRB",
    image: "/media/courier-bags_a12d5fd4.jpg",
    description: "Tamper-evident PP woven courier bags for e-commerce and logistics. Secure closure, tear-resistant construction, and custom printing for brand identity. Lightweight yet durable.",
    keywords: ["courier bags", "e-commerce packaging", "delivery bags", "tamper-evident bags"]
  }
};

// Helper to get first image from images JSON string or plain path
function getFirstImage(images: string | null): string | null {
  if (!images) return null;
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    if (typeof parsed === 'string') return parsed;
    return null;
  } catch {
    // If not valid JSON, treat as single image path
    return images.startsWith('/') ? images : null;
  }
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { data: dbProduct, isLoading } = trpc.products.bySlug.useQuery({ slug: slug || "" });
  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => toast.success("Added to cart!"),
    onError: () => toast.error("Failed to add to cart"),
  });

  // Check if we have a static product type for this slug
  const staticProduct = slug ? productTypes[slug] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Use database product if available, otherwise use static product type
  const product = dbProduct || staticProduct;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-4">Product Not Found</h1>
          <Link href="/products">
            <button className="bg-[#DC2626] text-white px-6 py-3 rounded hover:bg-[#005A5F] transition-colors inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine if this is a database product or static product
  const isDbProduct = dbProduct !== null && dbProduct !== undefined;
  const productName = isDbProduct ? (dbProduct as any).name : (product as any).name;
  const productDescription = isDbProduct 
    ? ((dbProduct as any).fullDescription || (dbProduct as any).shortDescription) 
    : (product as any).description;
  const productImage = isDbProduct 
    ? getFirstImage((dbProduct as any).images) 
    : (product as any).image;
  const productPrice = isDbProduct ? (dbProduct as any).price : null;
  const productSpecifications = isDbProduct ? (dbProduct as any).specifications : null;
  const productMinOrder = isDbProduct ? (dbProduct as any).minOrderQuantity : null;
  const productId = isDbProduct ? (dbProduct as any).id : null;
  const productCode = !isDbProduct ? (product as any).code : null;
  const productGallery = !isDbProduct ? (staticProduct as any)?.gallery as string[] | undefined : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-[#f8fafa] py-4 border-b">
          <div className="container">
            <Link href="/products">
              <button className="text-[#DC2626] hover:text-[#1A1A1A] inline-flex items-center font-medium">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
              </button>
            </Link>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="bg-white rounded-xl h-96 flex items-center justify-center overflow-hidden shadow-xl border border-gray-100">
                {productGallery && productGallery.length > 0 ? (
                  <img src={productGallery[selectedImageIndex]} alt={productName} className="w-full h-full object-contain p-4" />
                ) : productImage ? (
                  <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                ) : (
                  <Package className="h-32 w-32 text-gray-300" />
                )}
              </div>
              {/* Gallery Thumbnails */}
              {productGallery && productGallery.length > 1 && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {productGallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === selectedImageIndex ? 'border-[#DC2626] shadow-md' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={img} alt={`${productName} view ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                {productName}
                {productCode && <span className="text-gray-400 text-xl ml-2">({productCode})</span>}
              </h1>
              {productPrice && (
                <p className="text-2xl font-bold text-[#DC2626] mb-4">
                  ${Number(productPrice).toFixed(2)} {productMinOrder && <span className="text-gray-500 text-lg font-normal">/ min. {productMinOrder} units</span>}
                </p>
              )}
              <p className="text-lg text-gray-600 mb-6">{productDescription}</p>

              {productSpecifications && (
                <Card className="mb-6 border-0 shadow-lg overflow-hidden">
                  <div className="h-1 bg-[#DC2626]"></div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-[#1A1A1A] mb-3">Specifications</h3>
                    <p className="text-gray-600 whitespace-pre-line">{productSpecifications}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-wrap gap-4">
                {isAuthenticated && productId && (
                  <button 
                    onClick={() => addToCart.mutate({ productId: productId, quantity: 1 })}
                    disabled={addToCart.isPending}
                    className="bg-[#DC2626] text-white px-6 py-3 rounded hover:bg-[#005A5F] transition-colors inline-flex items-center disabled:opacity-50"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {addToCart.isPending ? "Adding..." : "Add to Cart"}
                  </button>
                )}
                <Link href="/inquiries">
                  <button className="border-2 border-[#DC2626] text-[#DC2626] px-6 py-3 rounded hover:bg-[#DC2626] hover:text-white transition-colors inline-flex items-center">
                    Request Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products CTA */}
        <section className="py-12 bg-[#f8fafa]">
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Explore More Products</h2>
            <p className="text-gray-600 mb-6">Discover our full range of PP woven packaging solutions</p>
            <Link href="/products">
              <button className="bg-[#DC2626] text-white px-6 py-3 rounded hover:bg-[#005A5F] transition-colors inline-flex items-center">
                View All Products
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

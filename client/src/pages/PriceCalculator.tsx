import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { 
  Calculator, 
  Package, 
  ArrowRight,
  Info,
  CheckCircle,
  AlertCircle,
  Truck,
  FileText
} from "lucide-react";

// Product types with base pricing (indicative only)
const productTypes = [
  { id: "pp-woven-bags", name: "PP Woven Bags", basePrice: 0.15, unit: "bag" },
  { id: "bopp-laminated-bags", name: "BOPP Laminated Bags", basePrice: 0.25, unit: "bag" },
  { id: "pp-woven-fabric", name: "PP Woven Fabric", basePrice: 0.80, unit: "meter" },

];

// Size multipliers
const sizeMultipliers: Record<string, number> = {
  "small": 0.8,    // < 30cm
  "medium": 1.0,   // 30-60cm
  "large": 1.3,    // 60-100cm
  "jumbo": 1.8,    // > 100cm
};

// GSM multipliers
const gsmMultipliers: Record<string, number> = {
  "40-50": 0.8,
  "50-70": 1.0,
  "70-90": 1.2,
  "90-120": 1.5,
  "120+": 1.8,
};

// Printing multipliers
const printingMultipliers: Record<string, number> = {
  "none": 1.0,
  "1-color": 1.1,
  "2-color": 1.2,
  "3-color": 1.3,
  "4-color": 1.4,
  "full-color": 1.6,
  "bopp-lamination": 1.8,
};

// Quantity discounts
const getQuantityDiscount = (qty: number): number => {
  if (qty >= 100000) return 0.85;
  if (qty >= 50000) return 0.90;
  if (qty >= 25000) return 0.93;
  if (qty >= 10000) return 0.95;
  if (qty >= 5000) return 0.97;
  return 1.0;
};

export default function PriceCalculator() {
  const [formData, setFormData] = useState({
    productType: "",
    width: "",
    height: "",
    gusset: "",
    gsmRange: "",
    printing: "",
    quantity: "",
  });

  const [showEstimate, setShowEstimate] = useState(false);

  // Calculate estimated price
  const estimate = useMemo(() => {
    if (!formData.productType || !formData.quantity) return null;

    const product = productTypes.find(p => p.id === formData.productType);
    if (!product) return null;

    const qty = parseInt(formData.quantity) || 0;
    if (qty < 1000) return null;

    // Calculate size category
    const maxDimension = Math.max(
      parseFloat(formData.width) || 0,
      parseFloat(formData.height) || 0
    );
    let sizeCategory = "medium";
    if (maxDimension > 0 && maxDimension < 30) sizeCategory = "small";
    else if (maxDimension >= 60 && maxDimension < 100) sizeCategory = "large";
    else if (maxDimension >= 100) sizeCategory = "jumbo";

    const sizeMult = sizeMultipliers[sizeCategory];
    const gsmMult = gsmMultipliers[formData.gsmRange] || 1.0;
    const printMult = printingMultipliers[formData.printing] || 1.0;
    const qtyDiscount = getQuantityDiscount(qty);

    const unitPrice = product.basePrice * sizeMult * gsmMult * printMult * qtyDiscount;
    const totalPrice = unitPrice * qty;

    return {
      unitPrice: unitPrice.toFixed(3),
      totalPrice: totalPrice.toFixed(2),
      quantity: qty,
      product: product.name,
      unit: product.unit,
      discount: Math.round((1 - qtyDiscount) * 100),
    };
  }, [formData]);

  const handleCalculate = () => {
    if (estimate) {
      setShowEstimate(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1A1A1A] to-[#DC2626] text-white py-12">
        <div className="container">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span>Price Calculator</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
              <Calculator className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Instant Price Calculator</h1>
              <p className="text-white/80">Get estimated pricing for your PP woven packaging requirements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calculator Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Product Specifications
                </h2>

                <div className="space-y-6">
                  {/* Product Type */}
                  <div>
                    <Label htmlFor="productType" className="text-[#1A1A1A] font-medium">Product Type *</Label>
                    <select
                      id="productType"
                      value={formData.productType}
                      onChange={(e) => {
                        setFormData({...formData, productType: e.target.value});
                        setShowEstimate(false);
                      }}
                      className="mt-1 w-full h-10 px-3 rounded-md border border-gray-300 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] bg-white text-gray-900"
                    >
                      <option value="">Select product type</option>
                      {productTypes.map((product) => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Dimensions */}
                  <div>
                    <Label className="text-[#1A1A1A] font-medium mb-3 block">Bag Dimensions (cm)</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="width" className="text-sm text-gray-600">Width</Label>
                        <Input
                          id="width"
                          type="number"
                          value={formData.width}
                          onChange={(e) => {
                            setFormData({...formData, width: e.target.value});
                            setShowEstimate(false);
                          }}
                          placeholder="e.g., 50"
                          className="mt-1 border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height" className="text-sm text-gray-600">Height</Label>
                        <Input
                          id="height"
                          type="number"
                          value={formData.height}
                          onChange={(e) => {
                            setFormData({...formData, height: e.target.value});
                            setShowEstimate(false);
                          }}
                          placeholder="e.g., 80"
                          className="mt-1 border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gusset" className="text-sm text-gray-600">Gusset</Label>
                        <Input
                          id="gusset"
                          type="number"
                          value={formData.gusset}
                          onChange={(e) => {
                            setFormData({...formData, gusset: e.target.value});
                            setShowEstimate(false);
                          }}
                          placeholder="e.g., 15"
                          className="mt-1 border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* GSM Range */}
                  <div>
                    <Label htmlFor="gsmRange" className="text-[#1A1A1A] font-medium">GSM Weight Range</Label>
                    <select
                      id="gsmRange"
                      value={formData.gsmRange}
                      onChange={(e) => {
                        setFormData({...formData, gsmRange: e.target.value});
                        setShowEstimate(false);
                      }}
                      className="mt-1 w-full h-10 px-3 rounded-md border border-gray-300 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] bg-white text-gray-900"
                    >
                      <option value="">Select GSM range</option>
                      <option value="40-50">40-50 GSM (Light)</option>
                      <option value="50-70">50-70 GSM (Standard)</option>
                      <option value="70-90">70-90 GSM (Medium)</option>
                      <option value="90-120">90-120 GSM (Heavy)</option>
                      <option value="120+">120+ GSM (Extra Heavy)</option>
                    </select>
                  </div>

                  {/* Printing */}
                  <div>
                    <Label htmlFor="printing" className="text-[#1A1A1A] font-medium">Printing Options</Label>
                    <select
                      id="printing"
                      value={formData.printing}
                      onChange={(e) => {
                        setFormData({...formData, printing: e.target.value});
                        setShowEstimate(false);
                      }}
                      className="mt-1 w-full h-10 px-3 rounded-md border border-gray-300 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] bg-white text-gray-900"
                    >
                      <option value="">Select printing option</option>
                      <option value="none">No Printing (Plain)</option>
                      <option value="1-color">1 Color Flexo</option>
                      <option value="2-color">2 Color Flexo</option>
                      <option value="3-color">3 Color Flexo</option>
                      <option value="4-color">4 Color Flexo</option>
                      <option value="full-color">Full Color (5+ Colors)</option>
                      <option value="bopp-lamination">BOPP Lamination (Photo Quality)</option>
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <Label htmlFor="quantity" className="text-[#1A1A1A] font-medium">Order Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => {
                        setFormData({...formData, quantity: e.target.value});
                        setShowEstimate(false);
                      }}
                      placeholder="Minimum 1,000 units"
                      className="mt-1 border-gray-300 focus:border-[#DC2626] focus:ring-[#DC2626]"
                    />
                    <p className="text-sm text-gray-500 mt-1">Minimum order: 1,000 units. Higher quantities get better pricing.</p>
                  </div>

                  {/* Calculate Button */}
                  <Button 
                    onClick={handleCalculate}
                    disabled={!formData.productType || !formData.quantity || parseInt(formData.quantity) < 1000}
                    className="w-full bg-[#DC2626] hover:bg-[#005a63] h-12 text-lg"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Estimate
                  </Button>
                </div>
              </div>
            </div>

            {/* Estimate Results */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
                <h3 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Price Estimate
                </h3>

                {showEstimate && estimate ? (
                  <div className="space-y-4">
                    <div className="bg-[#DC2626]/5 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Estimated Unit Price</div>
                      <div className="text-3xl font-bold text-[#DC2626]">
                        ${estimate.unitPrice}
                        <span className="text-base font-normal text-gray-500">/{estimate.unit}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Estimated Total</div>
                      <div className="text-2xl font-bold text-[#1A1A1A]">
                        ${estimate.totalPrice}
                      </div>
                      <div className="text-sm text-gray-500">
                        for {estimate.quantity.toLocaleString()} {estimate.unit}s
                      </div>
                    </div>

                    {estimate.discount > 0 && (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">{estimate.discount}% volume discount applied!</span>
                      </div>
                    )}

                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg mb-4">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">
                          This is an indicative estimate only. Final pricing depends on specifications, shipping destination, and current material costs.
                        </p>
                      </div>

                      <Button asChild className="w-full bg-[#DC2626] hover:bg-[#005a63]">
                        <Link href="/inquiries">
                          Get Accurate Quote <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Fill in the specifications</p>
                    <p className="text-sm text-gray-400">Your estimate will appear here</p>
                  </div>
                )}
              </div>

              {/* Volume Discounts Info */}
              <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
                <h3 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Volume Discounts
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">5,000+ units</span>
                    <span className="font-medium text-green-600">3% off</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">10,000+ units</span>
                    <span className="font-medium text-green-600">5% off</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">25,000+ units</span>
                    <span className="font-medium text-green-600">7% off</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">50,000+ units</span>
                    <span className="font-medium text-green-600">10% off</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">100,000+ units</span>
                    <span className="font-medium text-green-600">15% off</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6 text-center">How Pricing Works</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="font-semibold text-[#1A1A1A] mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#DC2626]" />
                  Factors Affecting Price
                </h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Bag size and dimensions</li>
                  <li>• Material weight (GSM)</li>
                  <li>• Printing colors and quality</li>
                  <li>• Order quantity</li>
                  <li>• Customization requirements</li>
                  <li>• Shipping destination</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="font-semibold text-[#1A1A1A] mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#DC2626]" />
                  What's Included
                </h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Factory-direct pricing</li>
                  <li>• Quality inspection</li>
                  <li>• Export documentation</li>
                  <li>• Flexible payment terms</li>
                  <li>• Dedicated account manager</li>
                  <li>• Sample production available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-[#DC2626]">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need a Detailed Quotation?</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Contact our export team for accurate pricing based on your exact specifications and shipping requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-[#DC2626] hover:bg-gray-100">
              <Link href="/inquiries">
                Request Detailed Quote <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/contact">
                Contact Sales Team
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

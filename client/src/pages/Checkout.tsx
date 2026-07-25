import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

export default function Checkout() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  
  const { data: cartItems } = trpc.cart.list.useQuery(undefined, { enabled: isAuthenticated });
  
  const [formData, setFormData] = useState({
    shippingName: "",
    shippingEmail: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingCountry: "",
    shippingPostalCode: "",
    notes: ""
  });

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Order placed successfully! Order #${data.orderNumber}`);
      utils.cart.list.invalidate();
      setLocation("/account");
    },
    onError: () => toast.error("Failed to place order"),
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login to Checkout</h1>
          <a href={getLoginUrl()}><Button>Login</Button></a>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = cartItems?.reduce((sum, item) => sum + (Number(item.product?.price || 0) * item.quantity), 0) || 0;
  const tax = subtotal * 0.1;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartItems?.length) return;
    
    createOrder.mutate({
      items: JSON.stringify(cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.product?.price || 0),
        name: item.product?.name
      }))),
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      ...formData
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-primary text-white py-12">
          <div className="container"><h1 className="text-4xl font-bold">Checkout</h1></div>
        </section>

        <section className="py-16">
          <div className="container">
            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shippingName">Full Name *</Label>
                          <Input id="shippingName" value={formData.shippingName} onChange={(e) => setFormData({...formData, shippingName: e.target.value})} required />
                        </div>
                        <div>
                          <Label htmlFor="shippingEmail">Email *</Label>
                          <Input id="shippingEmail" type="email" value={formData.shippingEmail} onChange={(e) => setFormData({...formData, shippingEmail: e.target.value})} required />
                        </div>
                        <div>
                          <Label htmlFor="shippingPhone">Phone *</Label>
                          <Input id="shippingPhone" value={formData.shippingPhone} onChange={(e) => setFormData({...formData, shippingPhone: e.target.value})} required />
                        </div>
                        <div>
                          <Label htmlFor="shippingCountry">Country *</Label>
                          <Input id="shippingCountry" value={formData.shippingCountry} onChange={(e) => setFormData({...formData, shippingCountry: e.target.value})} required />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="shippingAddress">Address *</Label>
                          <Textarea id="shippingAddress" value={formData.shippingAddress} onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})} required />
                        </div>
                        <div>
                          <Label htmlFor="shippingCity">City *</Label>
                          <Input id="shippingCity" value={formData.shippingCity} onChange={(e) => setFormData({...formData, shippingCity: e.target.value})} required />
                        </div>
                        <div>
                          <Label htmlFor="shippingState">State/Province</Label>
                          <Input id="shippingState" value={formData.shippingState} onChange={(e) => setFormData({...formData, shippingState: e.target.value})} />
                        </div>
                        <div>
                          <Label htmlFor="shippingPostalCode">Postal Code</Label>
                          <Input id="shippingPostalCode" value={formData.shippingPostalCode} onChange={(e) => setFormData({...formData, shippingPostalCode: e.target.value})} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">Order Notes (Optional)</h2>
                      <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={3} placeholder="Special instructions for your order" />
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                      <div className="space-y-3 mb-4 text-sm">
                        {cartItems?.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.product?.name} x {item.quantity}</span>
                            <span>${(Number(item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span></div>
                      </div>
                      <div className="border-t pt-4 mt-4 mb-6">
                        <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                      </div>
                      <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" disabled={createOrder.isPending || !cartItems?.length}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        {createOrder.isPending ? "Processing..." : "Place Order"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

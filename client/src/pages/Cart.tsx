import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { ShoppingCart, Trash2, Plus, Minus, Package } from "lucide-react";
import { toast } from "sonner";

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  
  const { data: cartItems, isLoading } = trpc.cart.list.useQuery(undefined, { enabled: isAuthenticated });
  
  const updateQuantity = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => utils.cart.list.invalidate(),
  });
  
  const removeItem = trpc.cart.remove.useMutation({
    onSuccess: () => {
      utils.cart.list.invalidate();
      toast.success("Item removed from cart");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Please Login to View Cart</h1>
          <a href={getLoginUrl()}><Button>Login</Button></a>
        </main>
        <Footer />
      </div>
    );
  }

  const total = cartItems?.reduce((sum, item) => sum + (Number(item.product?.price || 0) * item.quantity), 0) || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-primary text-white py-12">
          <div className="container">
            <h1 className="text-4xl font-bold">Shopping Cart</h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted rounded"></div>)}
              </div>
            ) : cartItems && cartItems.length > 0 ? (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-primary rounded flex items-center justify-center flex-shrink-0">
                          <Package className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold">{item.product?.name}</h3>
                          <p className="text-muted-foreground text-sm">${Number(item.product?.price || 0).toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => updateQuantity.mutate({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" onClick={() => updateQuantity.mutate({ id: item.id, quantity: item.quantity + 1 })}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${(Number(item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeItem.mutate({ id: item.id })}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div>
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
                        <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>Calculated at checkout</span></div>
                      </div>
                      <div className="border-t pt-4 mb-6">
                        <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                      </div>
                      <Button className="w-full bg-secondary hover:bg-secondary/90" onClick={() => setLocation("/checkout")}>
                        Proceed to Checkout
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link href="/products"><Button>Browse Products</Button></Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

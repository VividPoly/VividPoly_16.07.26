import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { User, Package, ShoppingBag, LogOut } from "lucide-react";

export default function Account() {
  const { user, isAuthenticated, logout } = useAuth();
  const { data: orders, isLoading } = trpc.orders.myOrders.useQuery(undefined, { enabled: isAuthenticated });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <User className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Please Login to View Account</h1>
          <a href={getLoginUrl()}><Button>Login</Button></a>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-purple-100 text-purple-800";
      case "shipped": return "bg-indigo-100 text-indigo-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-primary text-white py-12">
          <div className="container">
            <h1 className="text-4xl font-bold">My Account</h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" /> Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{user?.name || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user?.email || "Not set"}</p>
                      </div>
                      <Button variant="outline" className="w-full mt-4" onClick={() => logout()}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" /> Order History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted rounded"></div>)}
                      </div>
                    ) : orders && orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <Card key={order.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-bold">Order #{order.orderNumber}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                  <p className="font-bold mt-2">${Number(order.total).toFixed(2)}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">No orders yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

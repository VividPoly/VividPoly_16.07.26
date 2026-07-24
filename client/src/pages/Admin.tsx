import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { ShieldAlert, Package, ShoppingBag, MessageSquare, Users } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  
  const { data: orders } = trpc.orders.all.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: inquiries } = trpc.contact.list.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  
  const updateOrderStatus = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      utils.orders.all.invalidate();
      toast.success("Order status updated");
    },
  });

  const updateInquiryStatus = trpc.contact.updateStatus.useMutation({
    onSuccess: () => {
      utils.contact.list.invalidate();
      toast.success("Inquiry status updated");
    },
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <ShieldAlert className="h-16 w-16 text-destructive/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
          <Link href="/"><Button>Go Home</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800",
      quoted: "bg-purple-100 text-purple-800",
      converted: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-primary text-white py-12">
          <div className="container">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{orders?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-secondary" />
                  <p className="text-2xl font-bold">{inquiries?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Inquiries</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{orders?.filter(o => o.status === "pending").length || 0}</p>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-secondary" />
                  <p className="text-2xl font-bold">{inquiries?.filter(i => i.status === "new").length || 0}</p>
                  <p className="text-sm text-muted-foreground">New Inquiries</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="orders">
              <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders && orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <Card key={order.id}>
                            <CardContent className="p-4">
                              <div className="flex flex-wrap justify-between items-start gap-4">
                                <div>
                                  <p className="font-bold">Order #{order.orderNumber}</p>
                                  <p className="text-sm text-muted-foreground">{order.shippingName} - {order.shippingEmail}</p>
                                  <p className="text-sm text-muted-foreground">{order.shippingCity}, {order.shippingCountry}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg">${Number(order.total).toFixed(2)}</p>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                  <div className="mt-2">
                                    <select 
                                      className="text-sm border rounded p-1"
                                      value={order.status}
                                      onChange={(e) => updateOrderStatus.mutate({ id: order.id, status: e.target.value as any })}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="confirmed">Confirmed</option>
                                      <option value="processing">Processing</option>
                                      <option value="shipped">Shipped</option>
                                      <option value="delivered">Delivered</option>
                                      <option value="cancelled">Cancelled</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No orders yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inquiries" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Inquiries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {inquiries && inquiries.length > 0 ? (
                      <div className="space-y-4">
                        {inquiries.map((inquiry) => (
                          <Card key={inquiry.id}>
                            <CardContent className="p-4">
                              <div className="flex flex-wrap justify-between items-start gap-4">
                                <div className="flex-1">
                                  <p className="font-bold">{inquiry.name}</p>
                                  <p className="text-sm text-muted-foreground">{inquiry.email} {inquiry.phone && `| ${inquiry.phone}`}</p>
                                  {inquiry.company && <p className="text-sm text-muted-foreground">{inquiry.company}</p>}
                                  <p className="mt-2 text-sm">{inquiry.message}</p>
                                  <p className="text-xs text-muted-foreground mt-2">{new Date(inquiry.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                                    {inquiry.status}
                                  </span>
                                  <div className="mt-2">
                                    <select 
                                      className="text-sm border rounded p-1"
                                      value={inquiry.status}
                                      onChange={(e) => updateInquiryStatus.mutate({ id: inquiry.id, status: e.target.value as any })}
                                    >
                                      <option value="new">New</option>
                                      <option value="contacted">Contacted</option>
                                      <option value="quoted">Quoted</option>
                                      <option value="converted">Converted</option>
                                      <option value="closed">Closed</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No inquiries yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

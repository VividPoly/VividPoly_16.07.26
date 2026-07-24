import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// Lazy load pages for better performance
import { lazy, Suspense } from "react";

const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const ProductCategory = lazy(() => import("./pages/ProductCategory"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Certificates = lazy(() => import("./pages/Certificates"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Account = lazy(() => import("./pages/Account"));
const Admin = lazy(() => import("./pages/Admin"));
const QualityAssurance = lazy(() => import("./pages/QualityAssurance"));
const Recyclable = lazy(() => import("./pages/Recyclable"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Careers = lazy(() => import("./pages/Careers"));
const IndustryDetail = lazy(() => import("./pages/IndustryDetail"));
const Industries = lazy(() => import("./pages/Industries"));
const Inquiries = lazy(() => import("./pages/Inquiries"));
const AdminInquiries = lazy(() => import("./pages/AdminInquiries"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const PriceCalculator = lazy(() => import("./pages/PriceCalculator"));
const ProductByUse = lazy(() => import("./pages/ProductByUse"));
import WhatsAppButton from "./components/WhatsAppButton";
import InquireButton from "./components/InquireButton";
import InquiryPopup from "./components/InquiryPopup";
import { LanguageBanner } from "./components/LanguageBanner";
import ThemeSwitcher from "./components/ThemeSwitcher";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/products" component={Products} />
        <Route path="/products/:slug" component={ProductCategory} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/certificates" component={Certificates} />
        <Route path="/contact" component={Contact} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/account" component={Account} />
        <Route path="/admin" component={Admin} />
        <Route path="/quality-assurance" component={QualityAssurance} />
        <Route path="/recyclable" component={Recyclable} />
        <Route path="/testimonials" component={Testimonials} />
        <Route path="/careers" component={Careers} />
        <Route path="/industries" component={Industries} />
        <Route path="/industry/:slug" component={IndustryDetail} />
        <Route path="/inquiries" component={Inquiries} />
        <Route path="/admin/inquiries" component={AdminInquiries} />
        <Route path="/order-history" component={OrderHistory} />
        <Route path="/price-calculator" component={PriceCalculator} />
        <Route path="/product-by-use" component={ProductByUse} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <InquireButton />
          <InquiryPopup />
          <LanguageBanner />
          <WhatsAppButton />
          <ThemeSwitcher />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

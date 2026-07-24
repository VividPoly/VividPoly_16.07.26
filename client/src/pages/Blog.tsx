import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Calendar, ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead, pageSEO } from "@/components/SEOHead";
import { useState, useEffect } from "react";

function useCurrentLanguage() {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vividpoly-lang") || "en";
    }
    return "en";
  });

  useEffect(() => {
    const handleStorage = () => {
      setLang(localStorage.getItem("vividpoly-lang") || "en");
    };
    window.addEventListener("storage", handleStorage);
    // Also listen for custom event dispatched by Header language switcher
    window.addEventListener("vividpoly-lang-change", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("vividpoly-lang-change", handleStorage);
    };
  }, []);

  return lang;
}

export default function Blog() {
  const language = useCurrentLanguage();
  const { data: posts, isLoading } = trpc.blog.list.useQuery({ language });

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead {...pageSEO.blog} canonicalPath="/blog" />
      <Header />
      <main className="flex-1">
        {/* Hero Section - L&T Style */}
        <section className="relative py-20 bg-[#1A1A1A] overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src="/factory/factory-floor.jpg" alt="Background" className="w-full h-full object-cover" />
          </div>
          <div className="container relative z-10">
            <h2 className="text-3xl md:text-4xl font-normal text-white mb-2">SUSTAINABILITY</h2>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">BLOG</h1>
            <p className="text-xl text-white/80 max-w-3xl">
              Insights, news, and updates from the PP woven packaging industry
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full group overflow-hidden">
                      <div className="h-48 bg-gradient-to-br from-[#DC2626] to-[#1A1A1A] flex items-center justify-center overflow-hidden">
                        {post.coverImage ? (
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <Leaf className="h-16 w-16 text-[#DC2626]" />
                        )}
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                        </div>
                        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#DC2626] transition-colors">{post.title}</h3>
                        <p className="text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>
                        <span className="text-[#DC2626] font-medium flex items-center">
                          Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">Blog Coming Soon</h3>
                <p className="text-gray-600">We're preparing insightful content. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section - L&T Style */}
        <section className="py-16 bg-[#DC2626]">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
              <p className="text-white/80 mb-8">Subscribe to our newsletter for the latest industry insights.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input type="email" placeholder="Enter your email" className="px-6 py-3 rounded bg-white text-[#1A1A1A] w-full sm:w-80" />
                <Button className="btn-primary">Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import { ArrowLeft, ArrowRight, Calendar, User, Leaf, Share2, Clock, ChevronRight, Send } from "lucide-react";
import { toast } from "sonner";

function SocialShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : "";
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mr-1">
        <Share2 className="h-4 w-4" /> Share:
      </span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300"
        title="Share on Facebook"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/10 text-black hover:bg-black hover:text-white transition-all duration-300"
        title="Share on X (Twitter)"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all duration-300"
        title="Share on LinkedIn"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300"
        title="Share on WhatsApp"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <button
        onClick={() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${copied ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        title="Copy link"
      >
        {copied ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
        )}
      </button>
    </div>
  );
}

function QuickInquirySidebar() {
  const [submitted, setSubmitted] = useState(false);
  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Inquiry sent successfully!");
    },
    onError: () => toast.error("Failed to send. Please try again."),
  });

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h4 className="font-bold text-green-800 mb-1">Thank You!</h4>
        <p className="text-sm text-green-700">We'll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-[#DC2626] to-[#B91C1C] p-5">
        <h3 className="text-lg font-bold text-white">Quick Inquiry</h3>
        <p className="text-white/80 text-xs mt-1">Get a response within 24 hours</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          submitContact.mutate({
            name: fd.get("qi_name") as string,
            email: fd.get("qi_email") as string,
            phone: (fd.get("qi_phone") as string) || undefined,
            message: fd.get("qi_message") as string,
            source: "Quick Inquiry - Blog sidebar",
            pageUrl: window.location.href,
          });
        }}
        className="p-5 space-y-3"
      >
        <div>
          <Label htmlFor="qi_name" className="text-xs font-medium text-gray-700">Name *</Label>
          <Input id="qi_name" name="qi_name" required placeholder="Your name" className="mt-1 h-9 text-sm" />
        </div>
        <div>
          <Label htmlFor="qi_email" className="text-xs font-medium text-gray-700">Email *</Label>
          <Input id="qi_email" name="qi_email" type="email" required placeholder="your@email.com" className="mt-1 h-9 text-sm" />
        </div>
        <div>
          <Label htmlFor="qi_phone" className="text-xs font-medium text-gray-700">Phone</Label>
          <Input id="qi_phone" name="qi_phone" placeholder="+91 XXXXX XXXXX" className="mt-1 h-9 text-sm" />
        </div>
        <div>
          <Label htmlFor="qi_message" className="text-xs font-medium text-gray-700">Message *</Label>
          <Textarea id="qi_message" name="qi_message" rows={3} required placeholder="How can we help?" className="mt-1 text-sm" />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm"
          disabled={submitContact.isPending}
        >
          <Send className="mr-2 h-3.5 w-3.5" />
          {submitContact.isPending ? "Sending..." : "Submit Inquiry"}
        </Button>
      </form>
    </div>
  );
}

function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const language = useCurrentLanguage();
  const { data: posts } = trpc.blog.list.useQuery({ language });
  const related = posts?.filter((p: any) => p.slug !== currentSlug).slice(0, 3);

  if (!related || related.length === 0) return null;

  const gridCols = related.length === 1
    ? "max-w-sm mx-auto"
    : related.length === 2
      ? "grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto";

  return (
    <section className="py-10 sm:py-16 bg-[#F8F8F8]">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[#DC2626] font-semibold text-sm uppercase tracking-wide mb-2">Keep Reading</p>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1A1A1A]">Related Articles</h3>
        </div>
        <div className={`${gridCols} gap-5 sm:gap-6`}>
          {related.map((article: any) => (
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="h-44 overflow-hidden relative">
                  {article.coverImage ? (
                    <img loading="lazy" decoding="async" src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#DC2626] via-[#991B1B] to-[#1A1A1A] flex items-center justify-center">
                      <Leaf className="h-10 w-10 text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-xs text-[#DC2626] font-medium mb-2">
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <h4 className="font-bold text-[#1A1A1A] text-sm line-clamp-2 group-hover:text-[#DC2626] transition-colors">{article.title}</h4>
                  {article.excerpt && <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex-1">{article.excerpt}</p>}
                  <div className="flex items-center text-[#DC2626] font-semibold text-xs mt-3 pt-3 border-t border-gray-100">
                    Read Article
                    <ArrowRight className="ml-1.5 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const language = useCurrentLanguage();
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug: slug || "", language });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="w-full h-[400px] bg-gray-200 animate-pulse" />
          <div className="container py-12">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-px bg-gray-200 my-8"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="h-10 w-10 text-gray-300" />
            </div>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-3">Post Not Found</h1>
            <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Link href="/blog">
              <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={(post as any).seoTitle || `${post.title} | VividPoly`}
        description={(post as any).seoDescription || post.excerpt || post.title}
        canonicalPath={`/blog/${slug}`}
      />
      <Header />
      <main className="flex-1">
        {/* Hero Banner with Cover Image */}
        {post.coverImage ? (
          <section className="relative w-full h-[250px] sm:h-[300px] md:h-[450px] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12">
              <div className="container">
                {/* Breadcrumb - hidden on very small screens */}
                <nav className="hidden sm:flex items-center gap-2 text-white/70 text-sm mb-4">
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                  <ChevronRight className="h-3 w-3" />
                  <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-white/90 truncate max-w-[200px]">{post.title}</span>
                </nav>
                <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-tight">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-3 sm:mt-4 text-white/80 text-xs sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  {post.author && (
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {post.author}
                    </span>
                  )}
                  {(post as any).readTime && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {(post as any).readTime} min read
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="relative w-full bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] py-12 sm:py-16 md:py-24">
            <div className="container">
              <nav className="hidden sm:flex items-center gap-2 text-white/60 text-sm mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-white/80 truncate max-w-[200px]">{post.title}</span>
              </nav>
              <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-tight">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-3 sm:mt-4 text-white/70 text-xs sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                {post.author && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {post.author}
                  </span>
                )}
                {(post as any).readTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {(post as any).readTime} min read
                  </span>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Content + Sidebar */}
        <section className="py-8 sm:py-12 bg-white">
          <div className="container px-4 sm:px-6">
            <div className="grid lg:grid-cols-[1fr_300px] gap-8 lg:gap-12 max-w-6xl mx-auto">
              {/* Main Content */}
              <div className="min-w-0">
                {/* Share Bar */}
                <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
                  <SocialShareButtons title={post.title} slug={slug || ""} />
                </div>

                {/* Article Content */}
                <div
                  className="prose prose-sm sm:prose-lg max-w-none prose-headings:text-[#1A1A1A] prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#DC2626] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md prose-strong:text-[#1A1A1A] prose-blockquote:border-l-[#DC2626] prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Bottom Share */}
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                  <SocialShareButtons title={post.title} slug={slug || ""} />
                </div>

                {/* Back to Blog */}
                <div className="mt-6 sm:mt-8">
                  <Link href="/blog">
                    <Button variant="outline" className="border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white text-sm">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Articles
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Sidebar - shows below content on mobile */}
              <aside className="lg:block">
                <div className="sticky top-8 space-y-6">
                  <QuickInquirySidebar />
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        <RelatedArticles currentSlug={slug || ""} />
      </main>
      <Footer />
    </div>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Calendar, ArrowRight, Leaf, Search, X, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead, pageSEO } from "@/components/SEOHead";
import { useState, useEffect, useMemo } from "react";

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
    window.addEventListener("vividpoly-lang-change", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("vividpoly-lang-change", handleStorage);
    };
  }, []);

  return lang;
}

type SortOption = "newest" | "oldest" | "az";
const PAGE_SIZE = 9;

function splitTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  if (typeof tags === "string") return tags.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
}

// Strip HTML so the search matches the words a reader sees, not markup.
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ");
}

export default function Blog() {
  const language = useCurrentLanguage();
  const { data: posts, isLoading } = trpc.blog.list.useQuery({ language });

  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  // All tags that appear across the posts, for the filter chips.
  const allTags = useMemo(() => {
    const set = new Set<string>();
    (posts || []).forEach((p: any) => splitTags(p.tags).forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  // Reset to the first page whenever the filters change.
  useEffect(() => {
    setPage(1);
  }, [search, activeTags, sort]);

  const filtered = useMemo(() => {
    let list = [...(posts || [])];

    // Full-text search across title, excerpt, body, tags and category.
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p: any) => {
        const haystack = [
          p.title,
          p.excerpt,
          p.category,
          splitTags(p.tags).join(" "),
          p.content ? stripHtml(p.content) : "",
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    // Tag filter: a post must carry every selected tag.
    if (activeTags.length > 0) {
      list = list.filter((p: any) => {
        const tags = splitTags(p.tags).map((t) => t.toLowerCase());
        return activeTags.every((t) => tags.includes(t.toLowerCase()));
      });
    }

    // Sort.
    list.sort((a: any, b: any) => {
      if (sort === "az") return String(a.title).localeCompare(String(b.title));
      const da = new Date(a.publishedAt || a.createdAt).getTime();
      const db = new Date(b.publishedAt || b.createdAt).getTime();
      return sort === "oldest" ? da - db : db - da;
    });

    return list;
  }, [posts, search, activeTags, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setActiveTags([]);
    setSort("newest");
  };

  const hasActiveFilters = search.trim() !== "" || activeTags.length > 0 || sort !== "newest";

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
            {/* Toolbar: search + sort */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles by title, content or tag..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-500 whitespace-nowrap">Sort by</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white text-gray-700"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="az">Title (A–Z)</option>
                </select>
              </div>
            </div>

            {/* Tag filter chips */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="inline-flex items-center gap-1 text-sm text-gray-500 mr-1">
                  <TagIcon className="h-4 w-4" /> Tags:
                </span>
                {allTags.map((tag) => {
                  const active = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        active
                          ? "bg-[#DC2626] text-white border-[#DC2626]"
                          : "bg-white text-gray-600 border-gray-300 hover:border-[#DC2626] hover:text-[#DC2626]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm text-gray-500 hover:text-[#DC2626]"
                  >
                    <X className="h-3.5 w-3.5" /> Clear
                  </button>
                )}
              </div>
            )}

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
            ) : pageItems.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-6">
                  Showing {pageItems.length} of {filtered.length} article{filtered.length === 1 ? "" : "s"}
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pageItems.map((post: any) => (
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
                          {splitTags(post.tags).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {splitTags(post.tags).slice(0, 3).map((t) => (
                                <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                              ))}
                            </div>
                          )}
                          <span className="text-[#DC2626] font-medium flex items-center">
                            Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          n === page
                            ? "bg-[#DC2626] text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:border-[#DC2626]"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <Button
                      variant="outline"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : posts && posts.length > 0 ? (
              // Posts exist but none match the current filters.
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">No matching articles</h3>
                <p className="text-gray-600 mb-6">Try a different search term or clear the filters.</p>
                <Button onClick={clearFilters} className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">Clear filters</Button>
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

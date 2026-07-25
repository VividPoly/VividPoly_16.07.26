import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Calendar, ArrowRight, Leaf, Search, X, Tag as TagIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead, pageSEO } from "@/components/SEOHead";
import { useState, useEffect, useMemo } from "react";
import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";

type SortOption = "newest" | "oldest" | "az";
const PAGE_SIZE = 9;

function splitTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  if (typeof tags === "string") return tags.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
}

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

  const allTags = useMemo(() => {
    const set = new Set<string>();
    (posts || []).forEach((p: any) => splitTags(p.tags).forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  useEffect(() => {
    setPage(1);
  }, [search, activeTags, sort]);

  const filtered = useMemo(() => {
    let list = [...(posts || [])];

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

    if (activeTags.length > 0) {
      list = list.filter((p: any) => {
        const tags = splitTags(p.tags).map((t) => t.toLowerCase());
        return activeTags.every((t) => tags.includes(t.toLowerCase()));
      });
    }

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
        {/* Hero Section */}
        <section className="relative py-14 sm:py-20 md:py-24 bg-[#1A1A1A] overflow-hidden">
          <div className="absolute inset-0 opacity-15">
            <img loading="lazy" decoding="async" src="/factory/factory-floor.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />
          <div className="container px-4 sm:px-6 relative z-10">
            <p className="text-[#DC2626] font-semibold mb-2 sm:mb-3 tracking-wide uppercase text-xs sm:text-sm">Our Blog</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
              Industry <span className="text-[#DC2626]">Insights</span>
            </h1>
            <p className="text-sm sm:text-lg text-white/60 max-w-2xl">
              Expert knowledge, latest trends, and innovations in PP woven packaging solutions
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-14 bg-[#F9FAFB]">
          <div className="container px-4 sm:px-6">
            {/* Search & Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-8 sm:mb-10">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] outline-none bg-white text-gray-700 text-sm"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="az">Title (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Tag filter chips */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400 mr-1 uppercase tracking-wide font-medium">
                    <TagIcon className="h-3.5 w-3.5" /> Filter:
                  </span>
                  {allTags.map((tag) => {
                    const active = activeTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                          active
                            ? "bg-[#DC2626] text-white border-[#DC2626] shadow-sm shadow-[#DC2626]/20"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#DC2626] hover:text-[#DC2626] hover:bg-[#DC2626]/5"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-[#DC2626] hover:bg-red-50 transition-all"
                    >
                      <X className="h-3.5 w-3.5" /> Clear all
                    </button>
                  )}
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="h-56 bg-gray-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded-full w-1/3" />
                      <div className="h-6 bg-gray-200 rounded-lg w-full" />
                      <div className="h-4 bg-gray-200 rounded-lg w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : pageItems.length > 0 ? (
              <>
                <p className="text-sm text-gray-400 mb-6 font-medium">
                  Showing {pageItems.length} of {filtered.length} article{filtered.length === 1 ? "" : "s"}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 max-w-6xl mx-auto">
                  {pageItems.map((post: any) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <article className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-400 hover:-translate-y-1 h-full flex flex-col">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          {post.coverImage ? (
                            <>
                              <img
                                loading="lazy"
                                decoding="async"
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#DC2626] via-[#991B1B] to-[#1A1A1A] flex items-center justify-center">
                              <Leaf className="h-10 w-10 text-white/30" />
                            </div>
                          )}
                          {/* Category badge */}
                          {post.category && (
                            <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#DC2626] text-[11px] font-semibold rounded-full">
                              {post.category}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                          {/* Meta */}
                          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            {post.author && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {post.author}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="font-bold text-[#1A1A1A] text-base mb-2 group-hover:text-[#DC2626] transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="text-gray-500 text-sm line-clamp-2 mb-3 flex-1">
                              {post.excerpt}
                            </p>
                          )}

                          {/* Tags */}
                          {splitTags(post.tags).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {splitTags(post.tags).slice(0, 3).map((t) => (
                                <span key={t} className="text-[11px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-100 font-medium">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Read More */}
                          <div className="flex items-center text-[#DC2626] font-semibold text-sm mt-auto pt-3 border-t border-gray-50">
                            Read Article
                            <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-14">
                    <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="rounded-lg border-gray-200 hover:border-[#DC2626] hover:text-[#DC2626]"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                          n === page
                            ? "bg-[#DC2626] text-white shadow-md shadow-[#DC2626]/30"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-[#DC2626] hover:text-[#DC2626]"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <Button
                      variant="outline"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="rounded-lg border-gray-200 hover:border-[#DC2626] hover:text-[#DC2626]"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : posts && posts.length > 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">No matching articles</h3>
                <p className="text-gray-500 mb-6">Try a different search term or clear the filters.</p>
                <Button onClick={clearFilters} className="bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg">
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">Blog Coming Soon</h3>
                <p className="text-gray-500">We're preparing insightful content. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-12 sm:py-20 bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,#DC2626_0%,transparent_50%)]" />
          </div>
          <div className="container px-4 sm:px-6 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-[#DC2626] font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wide">Newsletter</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Stay Updated</h2>
              <p className="text-white/60 mb-6 sm:mb-8 text-sm sm:text-base">Subscribe to our newsletter for the latest industry insights and product updates.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626] outline-none transition-all"
                />
                <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl px-6 py-3.5 shadow-lg shadow-[#DC2626]/30">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

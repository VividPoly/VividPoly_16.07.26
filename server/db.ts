// Data layer backed by Supabase (Postgres). Blogs and contact inquiries are
// stored in Supabase; the remaining catalog data (products, certificates,
// cart, orders, testimonials, users) is not database-backed in this deployment
// and returns empty results, matching the previous no-database behavior.
import { getSupabase, isSupabaseConfigured } from "./supabase";
import {
  InsertUser,
  type User,
  type ProductCategory,
  type Product,
  type BlogPost,
  type Certificate,
  type ContactInquiry,
  type CartItem,
  type Order,
  type Testimonial,
} from "../drizzle/schema";

// The tRPC API addresses blog posts by numeric id, but Supabase uses uuids.
// We derive a stable numeric id from each uuid (FNV-1a) and remember the
// reverse mapping so update/delete-by-id can resolve the original uuid.
const idCache = new Map<number, string>();

function hashId(uuid: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < uuid.length; i++) {
    h ^= uuid.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const n = h >>> 0;
  idCache.set(n, uuid);
  return n;
}

async function resolveUuid(id: number): Promise<string | undefined> {
  const cached = idCache.get(id);
  if (cached) return cached;
  // Cache miss (e.g. after a restart): rebuild the map from the table.
  const supabase = getSupabase();
  if (!supabase) return undefined;
  const { data } = await supabase.from("blogs").select("id");
  (data || []).forEach((row: any) => hashId(row.id));
  return idCache.get(id);
}

function tagsToString(tags: unknown): string | null {
  if (Array.isArray(tags)) return tags.join(", ");
  if (typeof tags === "string") return tags;
  return null;
}

function tagsToArray(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags as string[];
  if (typeof tags === "string" && tags.trim()) {
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

function mapBlog(row: any, language = "en"): BlogPost {
  const bp: BlogPost = {
    id: hashId(row.id),
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? null,
    content: row.body ?? "",
    coverImage: row.cover_image_url ?? null,
    author: row.author ?? "VividPoly Team",
    category: row.category ?? null,
    tags: tagsToString(row.tags),
    seoTitle: row.seo_title ?? null,
    seoDescription: row.seo_description ?? null,
    readTime: row.read_time ?? null,
    language: language || "en",
    parentId: null,
    published: row.published ?? true,
    publishedAt: row.created_at ?? null,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? row.created_at ?? new Date().toISOString(),
  };
  return applyTranslation(bp, row, language);
}

// Translations live in the `translations` jsonb column keyed by language code,
// e.g. { "hi": { title, excerpt, body, seo_title, seo_description } }.
function applyTranslation(bp: BlogPost, row: any, language?: string): BlogPost {
  if (!language || language === "en") return bp;
  const all = row.translations;
  if (all && typeof all === "object" && all[language]) {
    const tr = all[language];
    return {
      ...bp,
      language,
      title: tr.title ?? bp.title,
      excerpt: tr.excerpt ?? bp.excerpt,
      content: tr.body ?? tr.content ?? bp.content,
      category: tr.category ?? bp.category,
      readTime: tr.readTime ?? tr.read_time ?? bp.readTime,
      seoTitle: tr.seo_title ?? tr.seoTitle ?? bp.seoTitle,
      seoDescription: tr.seo_description ?? tr.seoDescription ?? bp.seoDescription,
    };
  }
  return bp;
}

function mapInquiry(row: any): ContactInquiry {
  return {
    id: hashId(row.id),
    name: row.name ?? null,
    email: row.email ?? null,
    phone: row.phone ?? null,
    company: row.company ?? null,
    country: row.country ?? null,
    productInterest: row.product_interest ?? null,
    message: row.message ?? null,
    status: row.status ?? "new",
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? row.created_at ?? new Date().toISOString(),
  };
}

// Exposed for callers that previously probed database availability.
export async function getDb() {
  return isSupabaseConfigured() ? getSupabase() : null;
}

// ---------------------------------------------------------------------------
// Users (not database-backed in this deployment)
// ---------------------------------------------------------------------------
export async function upsertUser(_user: InsertUser): Promise<void> {
  // No user table in Supabase for the public site; sign-in state is transient.
  return;
}

export async function getUserByOpenId(_openId: string): Promise<User | undefined> {
  return undefined;
}

// ---------------------------------------------------------------------------
// Product catalog (static content on the site; no database rows)
// ---------------------------------------------------------------------------
export async function getAllProductCategories(): Promise<ProductCategory[]> {
  return [];
}

export async function getProductCategoryBySlug(_slug: string): Promise<ProductCategory | undefined> {
  return undefined;
}

export async function getAllProducts(): Promise<Product[]> {
  return [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return [];
}

export async function getProductsByCategory(_categoryId: number): Promise<Product[]> {
  return [];
}

export async function getProductBySlug(_slug: string): Promise<Product | undefined> {
  return undefined;
}

export async function getProductById(_id: number): Promise<Product | undefined> {
  return undefined;
}

// ---------------------------------------------------------------------------
// Blog posts (Supabase-backed)
// ---------------------------------------------------------------------------
export async function getPublishedBlogPosts(language?: string): Promise<BlogPost[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const lang = language || "en";
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[Supabase] getPublishedBlogPosts failed:", error.message);
    return [];
  }
  return (data || []).map((row) => mapBlog(row, lang));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const supabase = getSupabase();
  if (!supabase) return undefined;
  const { data, error } = await supabase.from("blogs").select("*").eq("slug", slug).limit(1).maybeSingle();
  if (error) {
    console.warn("[Supabase] getBlogPostBySlug failed:", error.message);
    return undefined;
  }
  return data ? mapBlog(data) : undefined;
}

export async function getBlogPostTranslation(parentId: number, language: string): Promise<BlogPost | undefined> {
  // Translations are stored inline (jsonb) on each post rather than as separate
  // rows, so resolve the source post by its numeric id and apply the language.
  const supabase = getSupabase();
  if (!supabase) return undefined;
  const uuid = await resolveUuid(parentId);
  if (!uuid) return undefined;
  const { data } = await supabase.from("blogs").select("*").eq("id", uuid).limit(1).maybeSingle();
  if (!data) return undefined;
  const translated = mapBlog(data, language);
  // Only report a translation when one actually exists for this language.
  const all = (data as any).translations;
  if (all && typeof all === "object" && all[language]) return translated;
  return undefined;
}

export async function getAllBlogPosts(language?: string): Promise<BlogPost[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[Supabase] getAllBlogPosts failed:", error.message);
    return [];
  }
  return (data || []).map((row) => mapBlog(row, language || "en"));
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  author?: string;
  category?: string;
  tags?: string;
  seoTitle?: string;
  seoDescription?: string;
  readTime?: string;
  language?: string;
  parentId?: number;
  published?: boolean;
  publishedAt?: Date;
}): Promise<BlogPost | undefined> {
  const supabase = getSupabase();
  if (!supabase) return undefined;
  const row: Record<string, unknown> = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt ?? null,
    body: data.content,
    cover_image_url: data.coverImage ?? null,
    category: data.category ?? null,
    tags: tagsToArray(data.tags),
    read_time: data.readTime ?? null,
    seo_title: data.seoTitle ?? null,
    seo_description: data.seoDescription ?? null,
    published: data.published ?? false,
  };
  const { data: inserted, error } = await supabase.from("blogs").insert(row).select("*").limit(1).maybeSingle();
  if (error) {
    console.warn("[Supabase] createBlogPost failed:", error.message);
    return undefined;
  }
  return inserted ? mapBlog(inserted, data.language || "en") : undefined;
}

export async function updateBlogPost(id: number, data: Partial<{
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  readTime: string;
  language: string;
  parentId: number;
  published: boolean;
  publishedAt: Date;
}>): Promise<BlogPost | undefined> {
  const supabase = getSupabase();
  if (!supabase) return undefined;
  const uuid = await resolveUuid(id);
  if (!uuid) return undefined;
  const row: Record<string, unknown> = {};
  if (data.title !== undefined) row.title = data.title;
  if (data.slug !== undefined) row.slug = data.slug;
  if (data.excerpt !== undefined) row.excerpt = data.excerpt;
  if (data.content !== undefined) row.body = data.content;
  if (data.coverImage !== undefined) row.cover_image_url = data.coverImage;
  if (data.category !== undefined) row.category = data.category;
  if (data.tags !== undefined) row.tags = tagsToArray(data.tags);
  if (data.readTime !== undefined) row.read_time = data.readTime;
  if (data.seoTitle !== undefined) row.seo_title = data.seoTitle;
  if (data.seoDescription !== undefined) row.seo_description = data.seoDescription;
  if (data.published !== undefined) row.published = data.published;
  const { data: updated, error } = await supabase.from("blogs").update(row).eq("id", uuid).select("*").limit(1).maybeSingle();
  if (error) {
    console.warn("[Supabase] updateBlogPost failed:", error.message);
    return undefined;
  }
  return updated ? mapBlog(updated, data.language || "en") : undefined;
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const uuid = await resolveUuid(id);
  if (!uuid) return false;
  const { error } = await supabase.from("blogs").delete().eq("id", uuid);
  if (error) {
    console.warn("[Supabase] deleteBlogPost failed:", error.message);
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Certificates (static content on the site; no database rows)
// ---------------------------------------------------------------------------
export async function getAllCertificates(): Promise<Certificate[]> {
  return [];
}

// ---------------------------------------------------------------------------
// Contact inquiries (Supabase-backed)
// ---------------------------------------------------------------------------
export async function createContactInquiry(inquiry: {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  country?: string | null;
  productInterest?: string | null;
  quantity?: string | null;
  message?: string | null;
  attachments?: string | null;
  status?: string | null;
  notes?: string | null;
  source?: string | null;
}) {
  const supabase = getSupabase();
  if (!supabase) {
    // Non-fatal: the router still sends the email notification.
    console.warn("[Supabase] createContactInquiry skipped: not configured");
    return { skipped: true };
  }
  // Fold quantity into the message so no information is lost (the table has no
  // dedicated quantity column).
  const message = inquiry.quantity
    ? `${inquiry.message ?? ""}\n\nQuantity: ${inquiry.quantity}`.trim()
    : inquiry.message ?? null;
  const row = {
    name: inquiry.name ?? null,
    email: inquiry.email ?? null,
    phone: inquiry.phone ?? null,
    company: inquiry.company ?? null,
    country: inquiry.country ?? null,
    product_interest: inquiry.productInterest ?? null,
    message,
    source: inquiry.source ?? "website",
    status: inquiry.status ?? "new",
  };
  const { error } = await supabase.from("contact_inquiries").insert(row);
  if (error) {
    console.warn("[Supabase] createContactInquiry failed:", error.message);
  }
  return { success: !error };
}

export async function getAllContactInquiries(): Promise<ContactInquiry[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("contact_inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[Supabase] getAllContactInquiries failed:", error.message);
    return [];
  }
  return (data || []).map(mapInquiry);
}

export async function getContactInquiriesByEmail(email: string): Promise<ContactInquiry[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("contact_inquiries")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[Supabase] getContactInquiriesByEmail failed:", error.message);
    return [];
  }
  return (data || []).map(mapInquiry);
}

export async function updateContactInquiryStatus(id: number, status: ContactInquiry["status"], _notes?: string) {
  const supabase = getSupabase();
  if (!supabase) return { skipped: true };
  // Resolve the numeric id back to the row's uuid.
  let uuid = idCache.get(id);
  if (!uuid) {
    const { data } = await supabase.from("contact_inquiries").select("id");
    (data || []).forEach((row: any) => hashId(row.id));
    uuid = idCache.get(id);
  }
  if (!uuid) return { skipped: true };
  const { error } = await supabase.from("contact_inquiries").update({ status }).eq("id", uuid);
  return { success: !error };
}

// ---------------------------------------------------------------------------
// Cart (not database-backed in this deployment)
// ---------------------------------------------------------------------------
export async function getCartItemsByUserId(_userId: number): Promise<CartItem[]> {
  return [];
}

export async function addToCart(_item: Omit<CartItem, "id" | "createdAt" | "updatedAt">) {
  throw new Error("Cart is not available");
}

export async function updateCartItemQuantity(_id: number, _quantity: number) {
  throw new Error("Cart is not available");
}

export async function removeFromCart(_id: number, _userId: number) {
  throw new Error("Cart is not available");
}

export async function clearCart(_userId: number) {
  return { success: true };
}

// ---------------------------------------------------------------------------
// Orders (not database-backed in this deployment)
// ---------------------------------------------------------------------------
export async function createOrder(_order: Omit<Order, "id" | "createdAt" | "updatedAt">) {
  throw new Error("Orders are not available");
}

export async function getOrdersByUserId(_userId: number): Promise<Order[]> {
  return [];
}

export async function getAllOrders(): Promise<Order[]> {
  return [];
}

export async function getOrderById(_id: number): Promise<Order | undefined> {
  return undefined;
}

export async function updateOrderStatus(_id: number, _status: Order["status"]) {
  throw new Error("Orders are not available");
}

// ---------------------------------------------------------------------------
// Testimonials (static content on the site; no database rows)
// ---------------------------------------------------------------------------
export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  return [];
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return [];
}

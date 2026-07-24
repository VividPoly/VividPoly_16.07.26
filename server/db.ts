import { eq, desc, and, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  productCategories,
  products,
  blogPosts,
  certificates,
  contactInquiries,
  cartItems,
  orders,
  testimonials,
  type ProductCategory,
  type Product,
  type BlogPost,
  type Certificate,
  type ContactInquiry,
  type CartItem,
  type Order,
  type Testimonial,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product Categories
export async function getAllProductCategories(): Promise<ProductCategory[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productCategories).orderBy(productCategories.displayOrder, productCategories.name);
}

export async function getProductCategoryBySlug(slug: string): Promise<ProductCategory | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(productCategories).where(eq(productCategories.slug, slug)).limit(1);
  return result[0];
}

// Products
export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).orderBy(products.displayOrder, products.name);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(products)
    .where(eq(products.featured, true))
    .orderBy(products.displayOrder, products.name)
    .limit(6);
}

export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(products)
    .where(eq(products.categoryId, categoryId))
    .orderBy(products.displayOrder, products.name);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result[0];
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

// Blog Posts
export async function getPublishedBlogPosts(language?: string): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  const lang = language || "en";
  return db.select().from(blogPosts).where(and(eq(blogPosts.published, true), eq(blogPosts.language, lang))).orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result[0];
}

export async function getBlogPostTranslation(parentId: number, language: string): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(and(eq(blogPosts.parentId, parentId), eq(blogPosts.language, language))).limit(1);
  return result[0];
}

export async function getAllBlogPosts(language?: string): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  if (language) {
    return db.select().from(blogPosts).where(eq(blogPosts.language, language)).orderBy(desc(blogPosts.createdAt));
  }
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
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
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(blogPosts).values({
    ...data,
    language: data.language || "en",
    published: data.published ?? false,
    publishedAt: data.published ? (data.publishedAt || new Date()) : undefined,
  });
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, data.slug)).limit(1);
  return result[0];
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
  const db = await getDb();
  if (!db) return undefined;
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result[0];
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return true;
}

// Certificates
export async function getAllCertificates(): Promise<Certificate[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(certificates).orderBy(certificates.displayOrder, certificates.name);
}

// Contact Inquiries
export async function createContactInquiry(inquiry: Omit<ContactInquiry, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contactInquiries).values(inquiry);
  return result;
}

export async function getAllContactInquiries(): Promise<ContactInquiry[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
}

export async function getContactInquiriesByEmail(email: string): Promise<ContactInquiry[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactInquiries).where(eq(contactInquiries.email, email)).orderBy(desc(contactInquiries.createdAt));
}

export async function updateContactInquiryStatus(id: number, status: ContactInquiry["status"], notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: any = { status };
  if (notes !== undefined) {
    updateData.notes = notes;
  }
  return db.update(contactInquiries).set(updateData).where(eq(contactInquiries.id, id));
}

// Cart Items
export async function getCartItemsByUserId(userId: number): Promise<CartItem[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cartItems).where(eq(cartItems.userId, userId)).orderBy(desc(cartItems.createdAt));
}

export async function addToCart(item: Omit<CartItem, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if item already exists in cart
  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, item.userId), eq(cartItems.productId, item.productId)))
    .limit(1);

  if (existing.length > 0) {
    // Update quantity
    return db
      .update(cartItems)
      .set({ quantity: existing[0].quantity + item.quantity })
      .where(eq(cartItems.id, existing[0].id));
  } else {
    // Insert new item
    return db.insert(cartItems).values(item);
  }
}

export async function updateCartItemQuantity(id: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
}

export async function removeFromCart(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(cartItems).where(and(eq(cartItems.id, id), eq(cartItems.userId, userId)));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// Orders
export async function createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(order);
  return result;
}

export async function getOrdersByUserId(userId: number): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getAllOrders(): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result[0];
}

export async function updateOrderStatus(id: number, status: Order["status"]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(orders).set({ status }).where(eq(orders.id, id));
}

// Testimonials
export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.featured, true))
    .orderBy(testimonials.displayOrder, testimonials.name);
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).orderBy(testimonials.displayOrder, testimonials.name);
}

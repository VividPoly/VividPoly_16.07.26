// Plain TypeScript types for the app's data shapes. (Drizzle/MySQL was replaced
// by Supabase; these types keep the rest of the codebase's imports working.)

export type User = {
  id: number;
  openId: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  loginMethod: string | null;
  lastSignedIn: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};
export type InsertUser = Partial<User> & { openId: string };

export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
};
export type InsertProductCategory = Partial<ProductCategory>;

export type Product = {
  id: number;
  name: string;
  slug: string;
  categoryId: number | null;
  description: string | null;
  imageUrl: string | null;
  featured: boolean;
};
export type InsertProduct = Partial<Product>;

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  author: string;
  category: string | null;
  tags: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  readTime?: string | null;
  language: string;
  parentId: number | null;
  published: boolean;
  publishedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};
export type InsertBlogPost = Partial<BlogPost>;

export type Certificate = {
  id: number;
  name: string;
  imageUrl: string | null;
  fileUrl: string | null;
};
export type InsertCertificate = Partial<Certificate>;

export type ContactInquiry = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  country: string | null;
  productInterest: string | null;
  message: string | null;
  status: "new" | "in_progress" | "closed" | string;
  createdAt: Date | string;
  updatedAt: Date | string;
};
export type InsertContactInquiry = Partial<ContactInquiry>;

export type CartItem = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  customization: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};
export type InsertCartItem = Partial<CartItem>;

export type Order = {
  id: number;
  userId: number;
  orderNumber: string;
  items: string;
  subtotal: string | number;
  tax: string | number;
  shipping: string | number;
  total: string | number;
  status: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string | null;
  shippingCountry: string;
  shippingPostalCode: string | null;
  notes: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};
export type InsertOrder = Partial<Order>;

export type Testimonial = {
  id: number;
  name: string;
  company: string | null;
  quote: string;
  rating: number;
  featured: boolean;
};
export type InsertTestimonial = Partial<Testimonial>;

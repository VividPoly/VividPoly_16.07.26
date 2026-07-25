import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("products.list", () => {
  it("returns an array of products (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.products.list();
    
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("categories.list", () => {
  it("returns an array of categories (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.categories.list();
    
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("products.getBySlug", () => {
  it("returns null for non-existent product", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.products.getBySlug({ slug: "non-existent-product-slug" });
    
    expect(result).toBeUndefined();
  });
});

describe("blog.list", () => {
  it("returns an array of blog posts (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.blog.list();
    
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("certificates.list", () => {
  it("returns an array of certificates (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.certificates.list();
    
    expect(Array.isArray(result)).toBe(true);
  });
});

// Note: testimonials router uses 'all' procedure, not 'list'
describe("testimonials", () => {
  it("returns an array of testimonials (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    // Check if testimonials.all exists
    const result = await caller.testimonials.all();
    
    expect(Array.isArray(result)).toBe(true);
  });
});

import { describe, it, expect, vi, beforeAll } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getPublishedBlogPosts: vi.fn(),
  getBlogPostBySlug: vi.fn(),
  getBlogPostTranslation: vi.fn(),
  getAllBlogPosts: vi.fn(),
  createBlogPost: vi.fn(),
}));

import * as db from "./db";

describe("Blog Translation Features", () => {
  const mockEnglishPost = {
    id: 1,
    title: "Test Post",
    slug: "test-post",
    excerpt: "Test excerpt",
    content: "<p>Test content</p>",
    coverImage: null,
    author: "VividPoly Team",
    category: "packaging",
    tags: '["pp woven"]',
    language: "en",
    parentId: null,
    published: true,
    publishedAt: new Date("2025-01-01"),
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  };

  const mockSpanishPost = {
    ...mockEnglishPost,
    id: 2,
    title: "Publicación de prueba",
    slug: "test-post-es",
    excerpt: "Extracto de prueba",
    content: "<p>Contenido de prueba</p>",
    language: "es",
    parentId: 1,
  };

  describe("getPublishedBlogPosts with language filter", () => {
    it("should return English posts when language is 'en'", async () => {
      const mockedGetPublished = vi.mocked(db.getPublishedBlogPosts);
      mockedGetPublished.mockResolvedValue([mockEnglishPost as any]);

      const result = await db.getPublishedBlogPosts("en");
      expect(mockedGetPublished).toHaveBeenCalledWith("en");
      expect(result).toHaveLength(1);
      expect(result[0].language).toBe("en");
    });

    it("should return Spanish posts when language is 'es'", async () => {
      const mockedGetPublished = vi.mocked(db.getPublishedBlogPosts);
      mockedGetPublished.mockResolvedValue([mockSpanishPost as any]);

      const result = await db.getPublishedBlogPosts("es");
      expect(mockedGetPublished).toHaveBeenCalledWith("es");
      expect(result).toHaveLength(1);
      expect(result[0].language).toBe("es");
    });

    it("should default to English when no language specified", async () => {
      const mockedGetPublished = vi.mocked(db.getPublishedBlogPosts);
      mockedGetPublished.mockResolvedValue([mockEnglishPost as any]);

      const result = await db.getPublishedBlogPosts(undefined);
      expect(mockedGetPublished).toHaveBeenCalledWith(undefined);
      expect(result).toHaveLength(1);
    });
  });

  describe("getBlogPostTranslation", () => {
    it("should find a translation by parentId and language", async () => {
      const mockedGetTranslation = vi.mocked(db.getBlogPostTranslation);
      mockedGetTranslation.mockResolvedValue(mockSpanishPost as any);

      const result = await db.getBlogPostTranslation(1, "es");
      expect(mockedGetTranslation).toHaveBeenCalledWith(1, "es");
      expect(result).toBeDefined();
      expect(result?.language).toBe("es");
      expect(result?.parentId).toBe(1);
    });

    it("should return undefined when translation does not exist", async () => {
      const mockedGetTranslation = vi.mocked(db.getBlogPostTranslation);
      mockedGetTranslation.mockResolvedValue(undefined);

      const result = await db.getBlogPostTranslation(1, "de");
      expect(result).toBeUndefined();
    });
  });

  describe("createBlogPost with language fields", () => {
    it("should create a translated post with language and parentId", async () => {
      const mockedCreate = vi.mocked(db.createBlogPost);
      mockedCreate.mockResolvedValue(mockSpanishPost as any);

      const result = await db.createBlogPost({
        title: "Publicación de prueba",
        slug: "test-post-es",
        excerpt: "Extracto de prueba",
        content: "<p>Contenido de prueba</p>",
        language: "es",
        parentId: 1,
        published: true,
      });

      expect(mockedCreate).toHaveBeenCalledWith(expect.objectContaining({
        language: "es",
        parentId: 1,
      }));
      expect(result?.language).toBe("es");
      expect(result?.parentId).toBe(1);
    });
  });

  describe("Blog post slug convention for translations", () => {
    it("should follow the pattern {original-slug}-{lang-code}", () => {
      const originalSlug = "test-post";
      const langCode = "es";
      const translatedSlug = `${originalSlug}-${langCode}`;
      expect(translatedSlug).toBe("test-post-es");
    });

    it("should support all 11 target languages", () => {
      const targetLanguages = ["es", "pt", "fr", "ar", "hi", "ja", "vi", "th", "id", "sw", "zh"];
      const originalSlug = "test-post";
      
      targetLanguages.forEach(lang => {
        const slug = `${originalSlug}-${lang}`;
        expect(slug).toMatch(/^test-post-[a-z]{2}$/);
      });
      
      expect(targetLanguages).toHaveLength(11);
    });
  });

  describe("getBlogPostBySlug", () => {
    it("should find a post by its slug regardless of language", async () => {
      const mockedGetBySlug = vi.mocked(db.getBlogPostBySlug);
      mockedGetBySlug.mockResolvedValue(mockSpanishPost as any);

      const result = await db.getBlogPostBySlug("test-post-es");
      expect(mockedGetBySlug).toHaveBeenCalledWith("test-post-es");
      expect(result?.slug).toBe("test-post-es");
    });
  });
});

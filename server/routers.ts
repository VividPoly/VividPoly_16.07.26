import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { CHATBOT_SYSTEM_PROMPT } from "./chatbot-knowledge";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Product Categories
  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllProductCategories();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getProductCategoryBySlug(input.slug);
      }),
  }),

  // Products
  products: router({
    list: publicProcedure.query(async () => {
      return await db.getAllProducts();
    }),
    featured: publicProcedure.query(async () => {
      return await db.getFeaturedProducts();
    }),
    byCategory: publicProcedure
      .input(z.object({ categoryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductsByCategory(input.categoryId);
      }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getProductBySlug(input.slug);
      }),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const product = await db.getProductBySlug(input.slug);
        return product ?? null;
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductById(input.id);
      }),
  }),

  // Blog
  blog: router({
    list: publicProcedure
      .input(z.object({ language: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getPublishedBlogPosts(input?.language);
      }),
    published: publicProcedure
      .input(z.object({ language: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getPublishedBlogPosts(input?.language);
      }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getBlogPostBySlug(input.slug);
      }),
    getTranslation: publicProcedure
      .input(z.object({ parentId: z.number(), language: z.string() }))
      .query(async ({ input }) => {
        return await db.getBlogPostTranslation(input.parentId, input.language);
      }),
    all: adminProcedure.query(async () => {
      return await db.getAllBlogPosts();
    }),
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        coverImage: z.string().optional(),
        author: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        readTime: z.string().optional(),
        language: z.string().optional(),
        parentId: z.number().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createBlogPost(input);
      }),
    translate: adminProcedure
      .input(z.object({
        postId: z.number(),
        targetLanguage: z.string(),
      }))
      .mutation(async ({ input }) => {
        const post = await db.getAllBlogPosts();
        const sourcePost = post.find(p => p.id === input.postId);
        if (!sourcePost) throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });

        // Check if translation already exists
        const existing = await db.getBlogPostTranslation(sourcePost.id, input.targetLanguage);
        if (existing) return existing;

        const langNames: Record<string, string> = {
          es: "Spanish", fr: "French", pt: "Portuguese", ar: "Arabic",
          hi: "Hindi", zh: "Chinese (Simplified)", de: "German", ja: "Japanese", vi: "Vietnamese"
        };
        const langName = langNames[input.targetLanguage] || input.targetLanguage;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: `You are a professional translator specializing in industrial/manufacturing content. Translate the following blog post into ${langName}. Maintain the HTML formatting. Return a JSON object with fields: title, excerpt, content (HTML). Keep brand names like "VividPoly" and technical terms unchanged. Do NOT mention BRC or BRCGS certificates.` },
            { role: "user", content: JSON.stringify({ title: sourcePost.title, excerpt: sourcePost.excerpt, content: sourcePost.content }) },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "blog_translation",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Translated title" },
                  excerpt: { type: "string", description: "Translated excerpt" },
                  content: { type: "string", description: "Translated HTML content" },
                },
                required: ["title", "excerpt", "content"],
                additionalProperties: false,
              },
            },
          },
        });

        const rawContent = response.choices[0].message.content;
        const translated = JSON.parse((typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent)) || "{}");
        const slug = `${sourcePost.slug}-${input.targetLanguage}`;

        const created = await db.createBlogPost({
          title: translated.title,
          slug,
          excerpt: translated.excerpt,
          content: translated.content,
          coverImage: sourcePost.coverImage || undefined,
          author: sourcePost.author,
          category: sourcePost.category || undefined,
          tags: sourcePost.tags || undefined,
          language: input.targetLanguage,
          parentId: sourcePost.id,
          published: true,
          publishedAt: new Date(),
        });
        return created;
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        coverImage: z.string().optional(),
        author: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        readTime: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        if (data.published) {
          (data as any).publishedAt = new Date();
        }
        return await db.updateBlogPost(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteBlogPost(input.id);
      }),
  }),

  // Certificates
  certificates: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCertificates();
    }),
  }),

  // Contact
  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Valid email is required"),
          phone: z.string().optional(),
          company: z.string().optional(),
          country: z.string().optional(),
          subject: z.string().optional(),
          productInterest: z.string().optional(),
          quantity: z.string().optional(),
          message: z.string().min(10, "Message must be at least 10 characters"),
          attachments: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Determine if this is from Contact Us page or Inquiry page
        const isContactForm = !!input.subject;
        const formType = isContactForm ? 'Contact Us' : 'Quote Request';
        
        // Save to database
        await db.createContactInquiry({
          name: input.name,
          email: input.email,
          phone: input.phone || null,
          company: input.company || null,
          country: input.country || null,
          productInterest: input.productInterest || input.subject || null,
          quantity: input.quantity || null,
          message: input.message,
          attachments: input.attachments ? JSON.stringify(input.attachments) : null,
          status: "new",
          notes: null,
        });

        // Send email notification to info@vividpoly.com
        const attachmentLinks = input.attachments && input.attachments.length > 0
          ? `\n\n📎 Attachments:\n${input.attachments.map((url, i) => `${i + 1}. ${url}`).join('\n')}`
          : '';

        let emailContent: string;
        
        if (isContactForm) {
          // Contact Us form email
          emailContent = `
📬 New Contact Message from VividPoly Website

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Contact Details:
• Name: ${input.name}
• Email: ${input.email}
• Phone: ${input.phone || 'Not provided'}
• Company: ${input.company || 'Not provided'}

📝 Subject: ${input.subject}

💬 Message:
${input.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please respond to this message within 24 hours.
Reply directly to: ${input.email}
          `.trim();
        } else {
          // Quote Request form email
          emailContent = `
📬 New Quote Request from VividPoly Website

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Contact Details:
• Name: ${input.name}
• Email: ${input.email}
• Phone: ${input.phone || 'Not provided'}
• Company: ${input.company || 'Not provided'}
• Country: ${input.country || 'Not provided'}

📦 Product Interest:
• Product: ${input.productInterest || 'Not specified'}
• Quantity: ${input.quantity || 'Not specified'}

💬 Requirements:
${input.message}${attachmentLinks}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please respond to this inquiry within 24 hours.
Reply directly to: ${input.email}
          `.trim();
        }

        // Send notification (this will notify the owner)
        await notifyOwner({
          title: `🆕 ${formType}: ${input.name}${input.country ? ` from ${input.country}` : ''}`,
          content: emailContent,
        });

        return { success: true };
      }),
    list: adminProcedure.query(async () => {
      return await db.getAllContactInquiries();
    }),
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["new", "contacted", "quoted", "converted", "closed"]),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.updateContactInquiryStatus(input.id, input.status, input.notes);
        return { success: true };
      }),
    // Get inquiries for logged-in user
    getUserInquiries: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user.email) return [];
      return await db.getContactInquiriesByEmail(ctx.user.email);
    }),
  }),

  // Cart
  cart: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const items = await db.getCartItemsByUserId(ctx.user.id);
      // Fetch product details for each cart item
      const itemsWithProducts = await Promise.all(
        items.map(async item => {
          const product = await db.getProductById(item.productId);
          return { ...item, product };
        })
      );
      return itemsWithProducts;
    }),
    add: protectedProcedure
      .input(
        z.object({
          productId: z.number(),
          quantity: z.number().min(1),
          customization: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.addToCart({
          userId: ctx.user.id,
          productId: input.productId,
          quantity: input.quantity,
          customization: input.customization || null,
        });
        return { success: true };
      }),
    updateQuantity: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          quantity: z.number().min(1),
        })
      )
      .mutation(async ({ input }) => {
        await db.updateCartItemQuantity(input.id, input.quantity);
        return { success: true };
      }),
    remove: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeFromCart(input.id, ctx.user.id);
        return { success: true };
      }),
    clear: protectedProcedure.mutation(async ({ ctx }) => {
      await db.clearCart(ctx.user.id);
      return { success: true };
    }),
  }),

  // Orders
  orders: router({
    create: protectedProcedure
      .input(
        z.object({
          items: z.string(), // JSON string
          subtotal: z.string(),
          tax: z.string(),
          shipping: z.string(),
          total: z.string(),
          shippingName: z.string(),
          shippingEmail: z.string().email(),
          shippingPhone: z.string(),
          shippingAddress: z.string(),
          shippingCity: z.string(),
          shippingState: z.string().optional(),
          shippingCountry: z.string(),
          shippingPostalCode: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Generate order number
        const orderNumber = `VP${Date.now()}${Math.floor(Math.random() * 1000)}`;
        
        await db.createOrder({
          userId: ctx.user.id,
          orderNumber,
          items: input.items,
          subtotal: input.subtotal,
          tax: input.tax,
          shipping: input.shipping,
          total: input.total,
          shippingName: input.shippingName,
          shippingEmail: input.shippingEmail,
          shippingPhone: input.shippingPhone,
          shippingAddress: input.shippingAddress,
          shippingCity: input.shippingCity,
          shippingState: input.shippingState || null,
          shippingCountry: input.shippingCountry,
          shippingPostalCode: input.shippingPostalCode || null,
          notes: input.notes || null,
          status: "pending",
        });

        // Clear cart after order
        await db.clearCart(ctx.user.id);

        return { success: true, orderNumber };
      }),
    myOrders: protectedProcedure.query(async ({ ctx }) => {
      return await db.getOrdersByUserId(ctx.user.id);
    }),
    all: adminProcedure.query(async () => {
      return await db.getAllOrders();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.id);
        if (!order) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
        }
        // Check if user owns the order or is admin
        if (order.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        return order;
      }),
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
        })
      )
      .mutation(async ({ input }) => {
        await db.updateOrderStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // Testimonials
  testimonials: router({
    featured: publicProcedure.query(async () => {
      return await db.getFeaturedTestimonials();
    }),
    all: publicProcedure.query(async () => {
      return await db.getAllTestimonials();
    }),
  }),

  // AI Chatbot
  chatbot: router({
    chat: publicProcedure
      .input(
        z.object({
          message: z.string().min(1, "Message is required"),
          history: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const systemPrompt = CHATBOT_SYSTEM_PROMPT;

        const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
          { role: "system", content: systemPrompt },
        ];

        // Add conversation history
        if (input.history && input.history.length > 0) {
          // Keep last 10 messages for context
          const recentHistory = input.history.slice(-10);
          for (const msg of recentHistory) {
            messages.push({ role: msg.role, content: msg.content });
          }
        }

        // Add current user message
        messages.push({ role: "user", content: input.message });

        try {
          const response = await invokeLLM({ messages });
          const rawContent = response.choices[0]?.message?.content;
          const assistantMessage = typeof rawContent === 'string' 
            ? rawContent 
            : "I apologize, but I couldn't process your request. Please try again or contact our support team.";
          
          return {
            success: true,
            message: assistantMessage,
          };
        } catch (error) {
          console.error("Chatbot error:", error);
          return {
            success: false,
            message: "I'm having trouble connecting right now. Please try again later or contact us directly at info@vividpoly.com",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

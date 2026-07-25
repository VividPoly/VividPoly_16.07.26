import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock the database module. createContactInquiry resolves to { success } —
// the router relies on that flag to know the lead was actually stored.
vi.mock("./db", () => ({
  createContactInquiry: vi.fn().mockResolvedValue({ success: true }),
  getAllContactInquiries: vi.fn().mockResolvedValue([]),
  updateContactInquiryStatus: vi.fn().mockResolvedValue({}),
}));

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

describe("contact.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits inquiry form successfully (Quote Request)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      company: "Test Company",
      country: "United States",
      productInterest: "PP Woven Bags",
      quantity: "10,000 bags",
      message: "I need a quote for PP woven bags for agricultural use.",
    });

    expect(result).toMatchObject({ success: true, stored: true });
  });

  it("submits contact form successfully (Contact Us)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+9876543210",
      company: "Another Company",
      subject: "General Inquiry",
      message: "I would like to know more about your company and products.",
    });

    expect(result).toMatchObject({ success: true, stored: true });
  });

  it("submits inquiry with attachments", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Bob Wilson",
      email: "bob@example.com",
      message: "Please see attached design files for our custom bag requirements.",
      attachments: [
        "https://storage.example.com/file1.pdf",
        "https://storage.example.com/file2.png",
      ],
    });

    expect(result).toMatchObject({ success: true, stored: true });
  });

  it("rejects submission with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "invalid-email",
        message: "This should fail validation.",
      })
    ).rejects.toThrow();
  });

  it("rejects submission with short message", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "test@example.com",
        message: "Short",
      })
    ).rejects.toThrow();
  });

  it("rejects submission without name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "",
        email: "test@example.com",
        message: "This message has a valid length for testing.",
      })
    ).rejects.toThrow();
  });

  // Regression: with neither Supabase nor Odoo configured the enquiry reaches
  // nobody. It used to return success anyway, so the visitor saw a thank-you
  // page for a lead that had silently vanished.
  it("fails loudly when the lead cannot be stored or sent to the CRM", async () => {
    const dbModule = await import("./db");
    vi.mocked(dbModule.createContactInquiry).mockResolvedValueOnce({ skipped: true } as never);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Lost Lead",
        email: "lost@example.com",
        message: "This enquiry must not be reported as delivered.",
      })
    ).rejects.toThrow(/could not record your enquiry/i);
  });
});

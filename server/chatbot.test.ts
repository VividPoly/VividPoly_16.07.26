import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: "Hello! I'm VividPoly's AI assistant. We manufacture premium PP woven bags. How can I help you today?",
        },
      },
    ],
  }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("chatbot.chat", () => {
  it("returns a response for a simple message", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.chat({
      message: "What products do you offer?",
    });

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("message");
    expect(typeof result.message).toBe("string");
    expect(result.message.length).toBeGreaterThan(0);
  });

  it("accepts conversation history", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.chat({
      message: "Tell me more about cement bags",
      history: [
        { role: "user", content: "What products do you offer?" },
        { role: "assistant", content: "We offer BOPP laminated bags, cement bags, valve bags, and more." },
      ],
    });

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("message");
    expect(typeof result.message).toBe("string");
  });

  it("validates empty message input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.chatbot.chat({
        message: "",
      })
    ).rejects.toThrow();
  });
});

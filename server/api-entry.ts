// Vercel serverless entry for the API. The Vite client is served as static
// files from dist/public (see vercel.json); every /api/* request is routed here
// and handled by the same tRPC router, upload, OAuth and storage endpoints the
// standalone Express server uses. This keeps the exact app behaviour on Vercel
// without a long-running server.
import express, { type Request, type Response } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import multer from "multer";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { registerOAuthRoutes } from "./_core/oauth";
import { registerStorageProxy } from "./_core/storageProxy";
import { storagePut } from "./storage";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

app.post("/api/upload", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const originalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileKey = `inquiries/${timestamp}-${randomSuffix}-${originalName}`;
    const { url } = await storagePut(fileKey, req.file.buffer, req.file.mimetype);
    res.json({ url, key: fileKey });
  } catch (error) {
    console.error("[Upload] Error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

registerStorageProxy(app);
registerOAuthRoutes(app);

app.use(
  "/api/trpc",
  createExpressMiddleware({ router: appRouter, createContext }),
);

export default app;

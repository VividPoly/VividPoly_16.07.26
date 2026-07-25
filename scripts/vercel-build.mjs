/**
 * Vercel Build Output API post-build script.
 *
 * After `vite build` outputs to dist/public and esbuild bundles
 * server/api-entry.ts, this script arranges everything into the
 * .vercel/output/ directory format that Vercel expects:
 *
 *   .vercel/output/
 *     config.json                          ← routing config
 *     static/                              ← all client assets
 *     functions/
 *       api/[...path].func/
 *         index.js                         ← bundled Express handler
 *         .vc-config.json                  ← runtime config
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const out = path.resolve(root, ".vercel/output");

// ── Helpers ──────────────────────────────────────────────────────────────────

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  mkdirp(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

// ── 1. Clean and recreate .vercel/output ─────────────────────────────────────

fs.rmSync(out, { recursive: true, force: true });
mkdirp(out);

// ── 2. Write top-level config.json ───────────────────────────────────────────

const config = {
  version: 3,
  routes: [
    // Route all /api/* requests to the serverless function FIRST
    {
      src: "/api/(.*)",
      dest: "/api/[...path]",
    },
    // Then handle static files from the filesystem
    { handle: "filesystem" },
    // SPA fallback for all other routes
    { src: "/(.*)", dest: "/index.html" },
  ],
};
fs.writeFileSync(
  path.join(out, "config.json"),
  JSON.stringify(config, null, 2)
);

// ── 3. Copy static files ─────────────────────────────────────────────────────

const staticSrc = path.resolve(root, "dist/public");
const staticDest = path.join(out, "static");
copyDir(staticSrc, staticDest);
console.log("✓ Copied static files to .vercel/output/static/");

// ── 4. Bundle api-entry.ts into the function directory ───────────────────────

const funcDir = path.join(out, "functions/api/[...path].func");
mkdirp(funcDir);

execSync(
  `npx esbuild server/api-entry.ts --platform=node --bundle --format=cjs --outfile="${funcDir}/index.js"`,
  { cwd: root, stdio: "inherit" }
);

// Write .vc-config.json for the function runtime
fs.writeFileSync(
  path.join(funcDir, ".vc-config.json"),
  JSON.stringify({ runtime: "nodejs20.x", handler: "index.js", launcherType: "Nodejs" }, null, 2)
);

console.log("✓ Bundled serverless function to .vercel/output/functions/api/[...path].func/");
console.log("✓ Vercel Build Output API structure ready.");

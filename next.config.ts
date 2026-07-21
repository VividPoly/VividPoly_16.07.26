import type { NextConfig } from "next";
import os from "os";

/** LAN IPs so phones/tablets on the same Wi‑Fi can load the dev preview. */
function getLanOrigins(): string[] {
  const origins = new Set<string>(["localhost", "127.0.0.1"]);
  const nets = os.networkInterfaces();
  for (const iface of Object.values(nets)) {
    if (!iface) continue;
    for (const cfg of iface) {
      const isV4 = cfg.family === "IPv4" || cfg.family === 4;
      if (isV4 && !cfg.internal) {
        origins.add(cfg.address);
      }
    }
  }
  return [...origins];
}

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: false,
  allowedDevOrigins: getLanOrigins(),
  // The public site is a single-page app that drives clean paths
  // (/blog, /about, /product/:id, …) via history.pushState. On a direct load
  // or refresh of one of those paths there is no matching file route, so serve
  // the root page and let the client restore the screen from the pathname.
  // Returned as an array => applied after filesystem routes (/api/*, static
  // files, the root page), so real routes are never rewritten.
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/',
      },
    ];
  },
};

export default nextConfig;

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
};

export default nextConfig;

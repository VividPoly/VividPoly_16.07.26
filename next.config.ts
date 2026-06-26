import type { NextConfig } from "next";
import os from "os";

/** LAN IPs so phones on the same Wi‑Fi can load the dev preview. */
function getLanOrigins(): string[] {
  const origins: string[] = [];
  const nets = os.networkInterfaces();
  for (const iface of Object.values(nets)) {
    if (!iface) continue;
    for (const cfg of iface) {
      if (cfg.family === "IPv4" && !cfg.internal) {
        origins.push(cfg.address);
      }
    }
  }
  return origins;
}

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: false,
  allowedDevOrigins: getLanOrigins(),
};

export default nextConfig;

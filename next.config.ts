import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare's image binding is unavailable in the Vercel runtime.
  images: { unoptimized: Boolean(process.env.VERCEL || process.env.NITRO_PRESET) },
};

export default nextConfig;

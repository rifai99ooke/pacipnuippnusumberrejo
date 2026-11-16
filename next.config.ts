import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uetnforktvieiwoapemh.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;

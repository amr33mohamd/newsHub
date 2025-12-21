import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    // Ignore test files during production build
    ignoreDuringBuilds: false,
    dirs: ['src/app', 'src/components', 'src/contexts', 'src/hooks', 'src/lib', 'src/types'],
  },
  typescript: {
    // Ignore test files during type checking in build
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

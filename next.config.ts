import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow mobile devices on local network to access dev server
  allowedDevOrigins: ['192.168.1.3', '192.168.1.0/24'],

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },
};

export default nextConfig;

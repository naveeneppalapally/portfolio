import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export — no server needed, served directly from Cloudflare Pages CDN
  output: 'export',

  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    // Static export requires unoptimized images (no Image Optimization server)
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'myhomesolar-api.solarsmart-energies.workers.dev' },
    ],
  },

  // Bake the API URL into the static bundle at build time
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      'https://myhomesolar-api.solarsmart-energies.workers.dev',
  },
};

export default nextConfig;

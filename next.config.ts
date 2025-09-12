import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'dev.strapi.zymptek.com' },
    ],
  },
};

export default nextConfig;

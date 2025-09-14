import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'dev.strapi.zymptek.com' },
      { hostname: 'strapi.zymptek.com' },
      { hostname: 'localhost' },
    ],
  },
};

export default nextConfig;

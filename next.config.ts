import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {},

  // Required for Docker/Railway runtime image
  output: 'standalone',

  // Production optimizations
  reactStrictMode: true,

  productionBrowserSourceMaps: false,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 100],
    minimumCacheTTL: 60,
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  // Experimental optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      '@radix-ui/react-select',
      'framer-motion',
      'date-fns',
    ],
  },

  async headers() {
    return [
      {
        source: '/robots.txt',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }],
      },
      {
        source: '/sitemap.xml',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }],
      },
    ];
  },

  // Webpack optimizations for production
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      // Split large libraries into separate chunks
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Three.js related
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'three',
              priority: 10,
            },
            // Charts
            recharts: {
              test: /[\\/]node_modules[\\/]recharts[\\/]/,
              name: 'recharts',
              priority: 8,
            },
            // Radix UI
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix',
              priority: 7,
            },
            // Other large libraries
            libs: {
              test: /[\\/]node_modules[\\/](framer-motion|gsap|html2canvas)[\\/]/,
              name: 'libs',
              priority: 6,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;

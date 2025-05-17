/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['v0.blob.vercel-storage.com', 'hebbkx1anhila5yf.public.blob.vercel-storage.com', 'blob.v0.dev'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Set a reasonable cache TTL for better performance
    minimumCacheTTL: 60,
    // Use Next.js image optimization
    unoptimized: false,
  },
  // Remove the optimizeCss experimental feature that requires critters
  experimental: {
    // optimizeCss: true, // Removing this line as it requires critters
    optimizePackageImports: ['framer-motion', 'lucide-react', 'recharts'],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Add headers for better image caching
  async headers() {
    return [
      {
        source: '/:path*.(jpg|jpeg|png|webp|avif|gif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=31536000',
          },
        ],
      },
    ];
  },
  // Add webpack configuration to improve image handling
  webpack(config) {
    // Optimize image loading
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 8 * 1024, // 8kb - inline small images as data URLs
        },
      },
    });
    
    return config;
  },
}

export default nextConfig

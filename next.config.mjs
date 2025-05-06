/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['v0.blob.vercel-storage.com', 'hebbkx1anhila5yf.public.blob.vercel-storage.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Disable image optimization caching
    minimumCacheTTL: 0,
    // Disable static image imports caching
    disableStaticImages: true,
  },
  // Remove the optimizeCss experimental feature that requires critters
  experimental: {
    // optimizeCss: true, // Removing this line as it requires critters
    optimizePackageImports: ['framer-motion', 'lucide-react', 'recharts'],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Add headers to prevent caching of images
  async headers() {
    return [
      {
        source: '/:path*/(.jpg|.jpeg|.png|.webp|.avif|.gif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
}

export default nextConfig

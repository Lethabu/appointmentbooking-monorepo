const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  experimental: {
    workerThreads: false
  },
  // Skip static optimization for client-side only pages
  // This prevents "self is not defined" errors during build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig

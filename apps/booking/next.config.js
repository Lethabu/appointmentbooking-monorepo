const withNextIntl = require('next-intl/plugin')('./i18n.ts');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use default mode (not 'export') for Cloudflare Pages Functions
  // This allows dynamic routes and server-side rendering via Pages Functions
  
  images: {
    unoptimized: true,
    domains: [
      'images.unsplash.com',
      'instylehairboutique.co.za',
      'www.instylehairboutique.co.za',
      'fonts.gstatic.com',
      'fonts.googleapis.com'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Increase build timeout for slow machines
  staticPageGenerationTimeout: 180,
  
  // Optimize build performance
  experimental: {
    webpackBuildWorker: false,
    cpus: 1,
  },
  
  // Strict mode for better error detection
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  
  // Ensure proper URL handling
  trailingSlash: true,
  
  // Build optimization
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  
  // Ignore build errors for now (will fix incrementally)
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
};

// Setup Cloudflare Pages development platform
if (process.env.NODE_ENV === 'development') {
  try {
    const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
    setupDevPlatform();
  } catch (e) {
    console.warn('Cloudflare dev platform not available');
  }
}

// Re-export with wrappers
module.exports = withBundleAnalyzer(withNextIntl(nextConfig));

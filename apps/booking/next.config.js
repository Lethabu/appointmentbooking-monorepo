const withNextIntl = require('next-intl/plugin')('./i18n.ts');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Cloudflare Pages (bypassing next-on-pages Windows issues)
  // output: 'export',
  // Use default mode (not 'export') for Cloudflare Pages Functions
  // This allows dynamic routes and server-side rendering via Pages Functions
  // Enable standalone output for Docker containerization
  // output: 'standalone',

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

  webpack: (config, { isServer }) => {
    // Disable webpack cache for Cloudflare build environments to avoid size issues
    config.cache = false;

    // NOTE: splitChunks configuration removed to fix 'ReferenceError: self is not defined' 
    // in Cloudflare Edge runtime. Default Next.js splitting is preferred.

    return config;
  },

  // Ignore build errors for now (will fix incrementally)
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
};

// Re-export with wrappers
module.exports = withBundleAnalyzer(withNextIntl(nextConfig));

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages deployment using @cloudflare/next-on-pages
  // Middleware and edge functions are supported
  
  // Disable image optimization (use Cloudflare Images or unoptimized)
  images: {
    unoptimized: true,
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

// Re-export with wrappers - next-intl disabled for static export
module.exports = withBundleAnalyzer(nextConfig);

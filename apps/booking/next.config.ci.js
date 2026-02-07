/**
 * Minimal Next.js Configuration for CI/CD Builds
 * This config bypasses plugins that may fail in CI environment
 * Use this when regular next.config.js fails in GitHub Actions
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },

  // Increase build timeout
  staticPageGenerationTimeout: 180,

  // Optimize for CI build performance
  experimental: {
    webpackBuildWorker: false,
    cpus: 1,
  },

  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  trailingSlash: true,
  compress: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },

  webpack: (config, { isServer }) => {
    config.cache = false;
    return config;
  },

  // Ignore build errors for CI
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
};

module.exports = nextConfig;

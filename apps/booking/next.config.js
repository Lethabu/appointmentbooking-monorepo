// Validate environment variables at build time
/*
try {
  require('./lib/env.ts');
} catch (error) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}
*/

const withNextIntl = require('next-intl/plugin')('./i18n.ts');

// Bundle analyzer configuration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Import webpack for DefinePlugin
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  trailingSlash: false,
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    webpackBuildWorker: true,
  },
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
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  eslint: {
    ignoreDuringBuilds: false
  }
};

// Setup Cloudflare Pages development platform
if (process.env.NODE_ENV === 'development') {
  const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
  setupDevPlatform();
}

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));

// Note: next.config.js webpack customization happens here
// The original webpack config was mutating the object passed to module.exports
// However, next-intl wraps the config.
// We need to move the webpack property INTO the nextConfig object *before* wrapping it,
// OR ensure the next-intl plugin preserves it. 
// next-intl plugin generally merges configs.
// Let's refactor the webpack config into the nextConfig object above for clarity and safety.

nextConfig.webpack = (config, { isServer, dev }) => {
  if (!config.externals) {
    config.externals = [];
  }
  config.externals.push('whatwg-fetch');

  // Provide fallbacks for server-side rendering
  if (isServer) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
  }

  // Production optimizations
  if (!dev) {
    // Enable webpack optimizations for better tree shaking
    config.optimization = {
      ...config.optimization,
      // Minimize bundle size
      minimize: true,
      // Remove unused exports
      usedExports: true,
      // Enable side effects optimization
      sideEffects: true,
    };

    // Add performance hints - increase limits to suppress warnings
    config.performance = {
      hints: false, // Disable performance warnings
      maxEntrypointSize: 2000000, // 2MB
      maxAssetSize: 2000000, // 2MB
    };
  }

  if (isServer) {
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
      /A Node.js API is used \(process.versions at line: 35\) which is not supported in the Edge Runtime/,
      /A Node.js API is used \(process.version at line: 24\) which is not supported in the Edge Runtime/,
    ];
  }

  return config;
};

// Re-export with wrappers
module.exports = withBundleAnalyzer(withNextIntl(nextConfig));

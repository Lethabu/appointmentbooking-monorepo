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
  // Memory and build optimization settings
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    webpackBuildWorker: true,
    // Increase memory limits for large builds
    largePageDataBytes: 128 * 1024, // 128KB
  },
  // Build caching for better memory efficiency
  onDemandEntries: {
    // Keep static pages in memory for less time
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Optimize webpack for memory efficiency
  modularizeImports: {
    '@radix-ui/react-dialog': {
      transform: '@radix-ui/react-dialog/{{member}}',
    },
    '@radix-ui/react-dropdown-menu': {
      transform: '@radix-ui/react-dropdown-menu/{{member}}',
    },
    '@radix-ui/react-tabs': {
      transform: '@radix-ui/react-tabs/{{member}}',
    },
    '@radix-ui/react-toast': {
      transform: '@radix-ui/react-toast/{{member}}',
    },
    '@radix-ui/react-select': {
      transform: '@radix-ui/react-select/{{member}}',
    },
    lucide: {
      transform: 'lucide-react/{{member}}',
    },
    '@tanstack/react-table': {
      transform: '@tanstack/react-table/{{member}}',
    },
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
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
};

// Setup Cloudflare Pages development platform
if (process.env.NODE_ENV === 'development') {
  const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
  setupDevPlatform();
}

// Enhanced security headers
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

// Add security headers to nextConfig
nextConfig.headers = async function () {
  return [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ];
};

// Add webpack configuration to nextConfig
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
      crypto: false,
    };
  }

  // Edge runtime polyfills
  if (!isServer) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: false,
      net: false,
      tls: false,
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

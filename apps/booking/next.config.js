// Validate environment variables at build time
/*
try {
  require('./lib/env.ts');
} catch (error) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}
*/

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
  poweredByHeader: false, // Remove X-Powered-By header for security
  // Removed static export to allow API routes to work
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    webpackBuildWorker: true,
    // Firebase libraries cause "self is not defined" error - removed for now
    // To use Firebase, import it conditionally on client-side only
    // serverComponentsExternalPackages: [
    //   'firebase',
    //   'firebase/app',
    //   'firebase/auth',
    //   'firebase/firestore',
    // ],
  },
  // Disable static optimization to prevent SSR issues
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  images: {
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
  async headers() {
    return [
      {
        source: '/tenants/:tenant/:asset*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'X-Content-Type-Options', value: 'nosniff' }
        ]
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/tenants/:tenant/:asset*',
        destination: '/tenants/:tenant/:asset*'
      },
      // API routes redirect to Cloudflare Worker
      {
        source: '/api/:path*',
        destination: 'https://www.instylehairboutique.co.za/api/:path*'
      }
    ];
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  }
};

module.exports = nextConfig;

nextConfig.webpack = (config, { isServer, dev }) => {
  if (isServer) {
    if (!config.externals) {
      config.externals = [];
    }
    config.externals.push('whatwg-fetch');

    // Temporarily remove client-side libraries from externals for server-side rendering
    // config.externals.push({
    //   'firebase': 'firebase',
    //   'firebase/app': 'firebase/app',
    //   'firebase/auth': 'firebase/auth',
    //   'firebase/firestore': 'firebase/firestore',
    //   '@stripe/stripe-js': '@stripe/stripe-js',
    //   '@stripe/react-stripe-js': '@stripe/react-stripe-js',
    //   '@paystack/inline-js': '@paystack/inline-js',
    //   'posthog-js': 'posthog-js',
    //   'convex': 'convex',
    // });

    // Define browser globals for server-side rendering
    if (!config.plugins) {
      config.plugins = [];
    }
    config.plugins.push(
      new webpack.DefinePlugin({
        'self': 'globalThis',
        'window': 'globalThis',
        'document': 'globalThis',
        'navigator': '{}',
      })
    );

    // Add a simpler approach - use a custom plugin to define globals
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.beforeCompile.tap('DefineBrowserGlobals', () => {
          if (typeof global !== 'undefined') {
            global.self = global.self || globalThis;
            global.window = global.window || globalThis;
            global.document = global.document || {};
            global.navigator = global.navigator || {};
          }
        });
      }
    });
  }

  // Provide fallbacks for server-side rendering
  if (isServer) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };

    // Provide browser globals for server-side rendering
    config.resolve.fallback = {
      ...config.resolve.fallback,
      self: false,
      window: false,
      document: false,
      navigator: false,
    };
  }

  // Production optimizations
  if (!dev) {
    // Enable webpack optimizations for better tree shaking
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Separate vendor chunks for better caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Separate React and related libraries
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|@react|@radix-ui)[\\/]/,
            name: 'react-vendor',
            chunks: 'all',
            priority: 20,
          },
          // Separate UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](@headlessui|@heroicons|lucide-react|framer-motion)[\\/]/,
            name: 'ui-vendor',
            chunks: 'all',
            priority: 15,
          },
          // Separate large libraries
          heavy: {
            test: /[\\/]node_modules[\\/](recharts|convex|ai|@google)[\\/]/,
            name: 'heavy-vendor',
            chunks: 'all',
            priority: 5,
          },
        },
      },
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

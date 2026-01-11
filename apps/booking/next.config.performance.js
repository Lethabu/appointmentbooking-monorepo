// Performance-optimized Next.js configuration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = require('next-intl/plugin')('./i18n.ts');

// Performance configuration
const nextConfig = {
    reactStrictMode: true,
    compress: true,
    trailingSlash: false,
    poweredByHeader: false,

    // Production optimizations
    experimental: {
        optimizeCss: true,
        scrollRestoration: true,
        webpackBuildWorker: true,
        // Enable modern JavaScript features
        esmExternals: 'loose',
        serverMinification: true,
        // Optimize images
        optimizePackageImports: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            'framer-motion',
            'lucide-react',
            'recharts',
        ],
    },

    // Image optimization
    images: {
        unoptimized: false, // Enable optimization
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 86400,
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        domains: [
            'images.unsplash.com',
            'instylehairboutique.co.za',
            'www.instylehairboutique.co.za',
            'fonts.gstatic.com',
            'fonts.googleapis.com'
        ],
    },

    // Compiler optimizations
    swcMinify: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
        // Enable React optimization
        reactRemoveProperties: process.env.NODE_ENV === 'production',
    },

    // Bundle splitting configuration
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Optimize bundle splitting
        config.optimization = {
            ...config.optimization,
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    // Vendor libraries - separate chunks for better caching
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        priority: 10,
                    },
                    // UI components - separate Radix UI and other UI libraries
                    ui: {
                        test: /[\\/]node_modules[\\/](@radix-ui|@headlessui|framer-motion)[\\/]/,
                        name: 'ui',
                        chunks: 'all',
                        priority: 20,
                    },
                    // Heavy libraries - separate AI/ML and chart libraries
                    ai: {
                        test: /[\\/]node_modules[\\/](@ai-sdk|@google|openai)[\\/]/,
                        name: 'ai',
                        chunks: 'all',
                        priority: 30,
                    },
                    charts: {
                        test: /[\\/]node_modules[\\/](recharts|@tanstack)[\\/]/,
                        name: 'charts',
                        chunks: 'all',
                        priority: 30,
                    },
                    // Common chunk for frequently used utilities
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 5,
                        reuseExistingChunk: true,
                    },
                },
            },
            // Optimize module IDs for better tree shaking
            moduleIds: 'deterministic',
            // Optimize runtime chunks
            runtimeChunk: {
                name: 'runtime',
            },
            // Enable side effects optimization
            sideEffects: true,
        };

        // Performance hints
        if (!dev) {
            config.performance = {
                hints: 'warning',
                maxEntrypointSize: 600000, // 600KB
                maxAssetSize: 1000000, // 1MB
            };
        }

        // Optimize resolve fallbacks for server-side rendering
        if (isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                os: false,
            };
        }

        // Add bundle size warnings for development
        if (dev && !isServer) {
            config.plugins.push(
                new webpack.DefinePlugin({
                    'process.env.BUNDLE_ANALYZER': JSON.stringify(false),
                })
            );
        }

        return config;
    },

    // Headers for performance
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                ],
            },
            {
                source: '/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ],
            },
        ];
    },

    // Redirects for performance
    async redirects() {
        return [
            {
                source: '/book',
                destination: '/book/instylehairboutique',
                permanent: true,
            },
        ];
    },

    // ESLint configuration
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
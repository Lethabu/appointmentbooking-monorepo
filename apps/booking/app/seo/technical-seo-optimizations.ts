/**
 * Advanced SEO Technical Optimizations
 * Comprehensive technical SEO implementation for appointmentbooking.co.za
 */

export interface TechnicalSEOAudit {
    category: string;
    issues: SEOIssue[];
    score: number;
    priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface SEOIssue {
    id: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
    solution: string;
    status: 'pending' | 'in-progress' | 'completed';
}

export interface CoreWebVitalsConfig {
    lcp: {
        threshold: number; // seconds
        current: number;
        target: number;
        optimization: string[];
    };
    fid: {
        threshold: number; // milliseconds
        current: number;
        target: number;
        optimization: string[];
    };
    cls: {
        threshold: number;
        current: number;
        target: number;
        optimization: string[];
    };
}

export interface StructuredDataConfig {
    type: string;
    schema: Record<string, any>;
    pages: string[];
    priority: 'high' | 'medium' | 'low';
}

export interface InternalLinkingStrategy {
    topicCluster: string;
    pillarContent: string;
    supportingContent: string[];
    internalLinks: InternalLink[];
}

export interface InternalLink {
    from: string;
    to: string;
    anchorText: string;
    context: string;
    weight: number;
}

// Technical SEO Audit Results
export const TECHNICAL_SEO_AUDIT: TechnicalSEOAudit[] = [
    {
        category: 'Core Web Vitals',
        score: 72,
        priority: 'critical',
        issues: [
            {
                id: 'lcp-performance',
                title: 'Largest Contentful Paint (LCP) Performance',
                description: 'LCP times are above optimal threshold, affecting search rankings',
                impact: 'high',
                effort: 'medium',
                solution: 'Implement image optimization, lazy loading, and CDN optimization',
                status: 'pending'
            },
            {
                id: 'cumulative-layout-shift',
                title: 'Cumulative Layout Shift (CLS) Issues',
                description: 'Layout shifts detected during page load affecting user experience',
                impact: 'high',
                effort: 'medium',
                solution: 'Add explicit dimensions to images and ads, avoid inserting content above existing content',
                status: 'pending'
            },
            {
                id: 'first-input-delay',
                title: 'First Input Delay (FID) Optimization',
                description: 'JavaScript execution delays affecting interactivity',
                impact: 'medium',
                effort: 'high',
                solution: 'Code splitting, reduce JavaScript bundle size, optimize third-party scripts',
                status: 'pending'
            }
        ]
    },
    {
        category: 'Mobile Performance',
        score: 68,
        priority: 'high',
        issues: [
            {
                id: 'mobile-page-speed',
                title: 'Mobile Page Speed Issues',
                description: 'Mobile page load times exceed optimal performance thresholds',
                impact: 'high',
                effort: 'medium',
                solution: 'Implement AMP, optimize images for mobile, reduce server response time',
                status: 'pending'
            },
            {
                id: 'mobile-usability',
                title: 'Mobile Usability Issues',
                description: 'Touch targets and font sizes not optimized for mobile devices',
                impact: 'medium',
                effort: 'low',
                solution: 'Increase touch target sizes, improve font readability, fix viewport issues',
                status: 'pending'
            }
        ]
    },
    {
        category: 'Indexation',
        score: 85,
        priority: 'high',
        issues: [
            {
                id: 'duplicate-content',
                title: 'Duplicate Content Detection',
                description: 'Multiple pages with similar content affecting search visibility',
                impact: 'medium',
                effort: 'medium',
                solution: 'Implement canonical tags, consolidate similar content, use proper redirects',
                status: 'pending'
            },
            {
                id: 'crawl-errors',
                title: 'Crawl Errors and Blocked Resources',
                description: 'Search engine crawlers blocked by robots.txt or returning errors',
                impact: 'medium',
                effort: 'low',
                solution: 'Update robots.txt, fix broken links, resolve server errors',
                status: 'pending'
            }
        ]
    },
    {
        category: 'Structured Data',
        score: 45,
        priority: 'high',
        issues: [
            {
                id: 'missing-structured-data',
                title: 'Missing Structured Data Markup',
                description: 'Key pages lack structured data for rich snippets',
                impact: 'high',
                effort: 'medium',
                solution: 'Implement LocalBusiness, Service, FAQ, and Review structured data',
                status: 'pending'
            },
            {
                id: 'structured-data-errors',
                title: 'Structured Data Validation Errors',
                description: 'Implemented structured data contains validation errors',
                impact: 'medium',
                effort: 'low',
                solution: 'Fix JSON-LD syntax errors, validate against Google Structured Data Testing Tool',
                status: 'pending'
            }
        ]
    },
    {
        category: 'Internal Linking',
        score: 60,
        priority: 'medium',
        issues: [
            {
                id: 'weak-internal-linking',
                title: 'Weak Internal Linking Structure',
                description: 'Insufficient internal links between related content',
                impact: 'medium',
                effort: 'medium',
                solution: 'Implement topic cluster strategy, add contextual internal links',
                status: 'pending'
            },
            {
                id: 'orphan-pages',
                title: 'Orphan Pages Detection',
                description: 'Pages with no internal links pointing to them',
                impact: 'medium',
                effort: 'low',
                solution: 'Add internal links from relevant pages, update navigation menus',
                status: 'pending'
            }
        ]
    }
];

// Core Web Vitals Optimization Configuration
export const CORE_WEB_VITALS_CONFIG: CoreWebVitalsConfig = {
    lcp: {
        threshold: 2.5, // seconds (good threshold)
        current: 3.2,
        target: 2.0,
        optimization: [
            'Implement next/image with proper sizing',
            'Use WebP format for images',
            'Enable Brotli compression',
            'Optimize critical CSS delivery',
            'Preload critical resources',
            'Use CDN for static assets',
            'Minimize render-blocking JavaScript',
            'Implement service worker for caching'
        ]
    },
    fid: {
        threshold: 100, // milliseconds (good threshold)
        current: 180,
        target: 50,
        optimization: [
            'Split JavaScript bundles',
            'Remove unused JavaScript',
            'Optimize third-party scripts',
            'Implement code splitting',
            'Use Web Workers for heavy computations',
            'Optimize event handlers',
            'Defer non-critical JavaScript',
            'Implement lazy loading for components'
        ]
    },
    cls: {
        threshold: 0.1, // (good threshold)
        current: 0.25,
        target: 0.05,
        optimization: [
            'Add explicit dimensions to images',
            'Reserve space for ads and embeds',
            'Avoid inserting content above existing content',
            'Use transform animations instead of properties that trigger layout',
            'Set font-display: swap to prevent FOIT',
            'Add size attributes to images and videos',
            'Initialize ads with empty divs of known size'
        ]
    }
};

// Structured Data Implementation
export const STRUCTURED_DATA_CONFIGS: StructuredDataConfig[] = [
    {
        type: 'LocalBusiness',
        schema: {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Appointment Booking South Africa",
            "description": "South Africa's leading appointment booking platform for beauty, wellness, and professional services",
            "url": "https://appointmentbooking.co.za",
            "telephone": "+27-11-123-4567",
            "email": "info@appointmentbooking.co.za",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Business Street",
                "addressLocality": "Johannesburg",
                "addressRegion": "Gauteng",
                "postalCode": "2000",
                "addressCountry": "ZA"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": -26.2041,
                "longitude": 28.0473
            },
            "openingHours": "Mo-Su 08:00-18:00",
            "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "PayFast", "Yoco", "Paystack"],
            "currencies": "ZAR",
            "priceRange": "$$",
            "areaServed": [
                {
                    "@type": "City",
                    "name": "Johannesburg"
                },
                {
                    "@type": "City",
                    "name": "Cape Town"
                },
                {
                    "@type": "City",
                    "name": "Durban"
                },
                {
                    "@type": "City",
                    "name": "Pretoria"
                }
            ]
        },
        pages: ['/', '/about', '/contact', '/locations/*'],
        priority: 'high'
    },
    {
        type: 'Service',
        schema: {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "{{serviceName}}",
            "description": "{{serviceDescription}}",
            "provider": {
                "@type": "LocalBusiness",
                "name": "Appointment Booking South Africa"
            },
            "areaServed": "South Africa",
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "{{serviceCategory}}",
                "itemListElement": "{{serviceOptions}}"
            }
        },
        pages: ['/services/*', '/book/*'],
        priority: 'high'
    },
    {
        type: 'FAQ',
        schema: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": "{{faqQuestions}}"
        },
        pages: ['/faq', '/help', '/support'],
        priority: 'medium'
    },
    {
        type: 'Review',
        schema: {
            "@context": "https://schema.org",
            "@type": "Review",
            "itemReviewed": {
                "@type": "LocalBusiness",
                "name": "Appointment Booking South Africa"
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "4.8",
                "bestRating": "5"
            },
            "author": {
                "@type": "Person",
                "name": "{{reviewerName}}"
            },
            "reviewBody": "{{reviewContent}}"
        },
        pages: ['/reviews', '/testimonials'],
        priority: 'medium'
    },
    {
        type: 'BreadcrumbList',
        schema: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": "{{breadcrumbItems}}"
        },
        pages: ['/*'],
        priority: 'medium'
    },
    {
        type: 'Organization',
        schema: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Appointment Booking South Africa",
            "url": "https://appointmentbooking.co.za",
            "logo": "https://appointmentbooking.co.za/logo.png",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+27-11-123-4567",
                "contactType": "Customer Service",
                "availableLanguage": ["English", "Afrikaans", "Zulu"]
            },
            "sameAs": [
                "https://www.facebook.com/appointmentbooking.co.za",
                "https://www.instagram.com/appointmentbooking.co.za",
                "https://www.linkedin.com/company/appointmentbooking-co-za"
            ]
        },
        pages: ['/', '/about'],
        priority: 'medium'
    }
];

// Internal Linking Strategy with Topic Clusters
export const INTERNAL_LINKING_STRATEGY: InternalLinkingStrategy[] = [
    {
        topicCluster: 'Hair Care',
        pillarContent: '/guides/complete-hair-care-guide-south-africa',
        supportingContent: [
            '/blog/hair-care-tips-summer',
            '/blog/hair-care-tips-winter',
            '/blog/hair-care-african-hair',
            '/blog/hair-care-humid-climate',
            '/blog/hair-care-dry-climate',
            '/services/hair-treatments',
            '/services/hair-styling'
        ],
        internalLinks: [
            {
                from: '/guides/complete-hair-care-guide-south-africa',
                to: '/blog/hair-care-tips-summer',
                anchorText: 'summer hair care tips',
                context: 'summer-specific hair care advice',
                weight: 1.0
            },
            {
                from: '/guides/complete-hair-care-guide-south-africa',
                to: '/blog/hair-care-tips-winter',
                anchorText: 'winter hair care routine',
                context: 'winter hair care strategies',
                weight: 1.0
            },
            {
                from: '/blog/hair-care-tips-summer',
                to: '/services/hair-treatments',
                anchorText: 'professional hair treatments',
                context: 'professional treatment options',
                weight: 0.8
            },
            {
                from: '/blog/hair-care-african-hair',
                to: '/services/hair-styling',
                anchorText: 'professional hair styling services',
                context: 'styling services for African hair',
                weight: 0.9
            }
        ]
    },
    {
        topicCluster: 'Beauty Services',
        pillarContent: '/guides/beauty-services-guide-south-africa',
        supportingContent: [
            '/blog/facial-treatments-guide',
            '/blog/manicure-pedicure-guide',
            '/blog/massage-therapy-guide',
            '/blog/beauty-treatment-preparation',
            '/services/facial-treatments',
            '/services/nail-care',
            '/services/massage-therapy'
        ],
        internalLinks: [
            {
                from: '/guides/beauty-services-guide-south-africa',
                to: '/blog/facial-treatments-guide',
                anchorText: 'facial treatments',
                context: 'comprehensive facial treatment information',
                weight: 1.0
            },
            {
                from: '/blog/facial-treatments-guide',
                to: '/services/facial-treatments',
                anchorText: 'book facial treatment',
                context: 'professional facial services',
                weight: 0.9
            },
            {
                from: '/blog/beauty-treatment-preparation',
                to: '/services/facial-treatments',
                anchorText: 'professional beauty treatments',
                context: 'treatment preparation and booking',
                weight: 0.8
            }
        ]
    },
    {
        topicCluster: 'Local Business',
        pillarContent: '/locations/south-africa-beauty-businesses',
        supportingContent: [
            '/locations/cape-town',
            '/locations/johannesburg',
            '/locations/durban',
            '/locations/pretoria',
            '/blog/beauty-business-cape-town',
            '/blog/beauty-business-johannesburg'
        ],
        internalLinks: [
            {
                from: '/locations/south-africa-beauty-businesses',
                to: '/locations/cape-town',
                anchorText: 'Cape Town beauty salons',
                context: 'local Cape Town business directory',
                weight: 1.0
            },
            {
                from: '/locations/cape-town',
                to: '/blog/beauty-business-cape-town',
                anchorText: 'Cape Town beauty business insights',
                context: 'local market analysis',
                weight: 0.7
            },
            {
                from: '/locations/johannesburg',
                to: '/blog/beauty-business-johannesburg',
                anchorText: 'Johannesburg beauty market',
                context: 'Johannesburg market information',
                weight: 0.7
            }
        ]
    }
];

// XML Sitemap Configuration
export const XML_SITEMAP_CONFIG = {
    sitemaps: [
        {
            name: 'main-sitemap',
            url: '/sitemap.xml',
            sections: ['pages', 'services', 'locations', 'blog'],
            priority: 1.0,
            changefreq: 'weekly'
        },
        {
            name: 'blog-sitemap',
            url: '/sitemap-blog.xml',
            sections: ['blog'],
            priority: 0.8,
            changefreq: 'daily'
        },
        {
            name: 'services-sitemap',
            url: '/sitemap-services.xml',
            sections: ['services'],
            priority: 0.9,
            changefreq: 'weekly'
        },
        {
            name: 'locations-sitemap',
            url: '/sitemap-locations.xml',
            sections: ['locations'],
            priority: 0.7,
            changefreq: 'monthly'
        }
    ],

    pageConfiguration: {
        'homepage': {
            priority: 1.0,
            changefreq: 'weekly',
            lastmod: 'auto'
        },
        'service-pages': {
            priority: 0.9,
            changefreq: 'weekly',
            lastmod: 'auto'
        },
        'location-pages': {
            priority: 0.8,
            changefreq: 'monthly',
            lastmod: 'auto'
        },
        'blog-pages': {
            priority: 0.7,
            changefreq: 'daily',
            lastmod: 'auto'
        },
        'guide-pages': {
            priority: 0.8,
            changefreq: 'monthly',
            lastmod: 'auto'
        }
    }
};

// Robots.txt Configuration
export const ROBOTS_TXT_CONFIG = {
    userAgent: '*',
    allow: [
        '/',
        '/services/*',
        '/locations/*',
        '/blog/*',
        '/guides/*',
        '/api/*',
        '/_next/*',
        '/images/*',
        '/css/*',
        '/js/*'
    ],
    disallow: [
        '/admin/*',
        '/dashboard/*',
        '/private/*',
        '/temp/*',
        '/test/*',
        '/dev/*',
        '/*?*', // Disallow URLs with query parameters
        '/search',
        '/login',
        '/register',
        '/cart',
        '/checkout'
    ],
    crawlDelay: 1,
    sitemap: [
        'https://appointmentbooking.co.za/sitemap.xml',
        'https://appointmentbooking.co.za/sitemap-blog.xml',
        'https://appointmentbooking.co.za/sitemap-services.xml',
        'https://appointmentbooking.co.za/sitemap-locations.xml'
    ]
};

// Voice Search Optimization
export const VOICE_SEARCH_OPTIMIZATION = {
    naturalLanguageKeywords: [
        {
            query: "book hair salon appointment near me",
            optimizedContent: "Book hair salon appointments online in your area. Find and book with top-rated hair stylists and salons near you.",
            targetPages: ['/services/hair-salon', '/locations/*']
        },
        {
            query: "best hair salon in Cape Town",
            optimizedContent: "Discover the best hair salons in Cape Town. Book appointments with professional stylists and beauty experts.",
            targetPages: ['/locations/cape-town']
        },
        {
            query: "hair treatment for damaged hair",
            optimizedContent: "Professional hair treatments for damaged hair. Restore your hair's health with our expert treatments.",
            targetPages: ['/services/hair-treatments', '/guides/hair-repair-guide']
        },
        {
            query: "how to book beauty appointment online",
            optimizedContent: "Easy online booking for beauty appointments. Book hair, nail, facial, and wellness services in just a few clicks.",
            targetPages: ['/how-it-works', '/book']
        },
        {
            query: "affordable hair salon Johannesburg",
            optimizedContent: "Find affordable hair salons in Johannesburg. Quality services at competitive prices.",
            targetPages: ['/locations/johannesburg']
        }
    ],

    conversationalContent: {
        faqFormat: [
            {
                question: "How do I book an appointment online?",
                answer: "Booking an appointment is simple! Just visit our website, select your desired service, choose a convenient time, and complete your booking. You'll receive instant confirmation via email and SMS."
            },
            {
                question: "What hair services are available?",
                answer: "We offer a comprehensive range of hair services including cuts, styling, coloring, treatments, braiding, and extensions. Each salon offers different specializations, so browse our service catalog to find exactly what you're looking for."
            },
            {
                question: "Can I cancel or reschedule my appointment?",
                answer: "Yes, you can easily cancel or reschedule your appointment through our platform or by contacting the salon directly. Most salons require at least 24 hours notice for cancellations."
            },
            {
                question: "Do you have salons in my area?",
                answer: "We have partnered salons across South Africa including Cape Town, Johannesburg, Durban, and Pretoria. Use our location search to find salons near you."
            }
        ]
    },

    featuredSnippetOptimization: {
        paragraphFormat: {
            target: "How to choose the right hair salon",
            content: "Choosing the right hair salon involves considering factors like the salon's specialization, stylist experience, customer reviews, location convenience, and pricing. Look for salons that specialize in your hair type and desired services, read customer reviews, and consider booking a consultation first."
        },
        listFormat: {
            target: "Benefits of professional hair treatments",
            content: "Professional hair treatments offer multiple benefits: 1) Deep nourishment and moisture restoration, 2) Damage repair and strength improvement, 3) Enhanced shine and manageability, 4) Protection against future damage, 5) Customized solutions for your specific hair needs."
        },
        tableFormat: {
            target: "Hair salon services comparison",
            content: "Hair Salon Services Comparison: Hair Cut - Basic styling and trimming, Hair Color - Professional coloring and highlighting, Hair Treatment - Deep conditioning and repair, Hair Styling - Event and occasion styling, Hair Extensions - Length and volume enhancement."
        }
    }
};

// Mobile-First Indexing Optimization
export const MOBILE_FIRST_INDEXING = {
    mobileOptimization: {
        responsiveDesign: {
            viewport: 'width=device-width, initial-scale=1.0',
            breakpoints: ['320px', '768px', '1024px', '1440px'],
            touchTargets: 'minimum 44px',
            fontSize: 'minimum 16px for readability'
        },
        performance: {
            mobilePageSpeed: 'target < 3 seconds',
            mobileUsability: '100% mobile-friendly pages',
            AMPImplementation: 'critical pages AMP-optimized'
        }
    },

    mobileContentStrategy: {
        priorityContent: [
            'Service booking pages',
            'Location finder',
            'Contact information',
            'Customer reviews',
            'Service descriptions'
        ],
        mobileUX: [
            'Single-column layouts',
            'Large tap targets',
            'Simplified navigation',
            'Fast-loading images',
            'Minimal form fields'
        ]
    },

    mobileSEO: {
        localMobile: {
            nearMeSearches: true,
            googleMyBusiness: 'optimized for mobile',
            mobileSpecificKeywords: true
        },
        voiceMobile: {
            conversationalKeywords: true,
            featuredSnippets: true,
            questionBasedContent: true
        }
    }
};

// Page Speed Optimization
export const PAGE_SPEED_OPTIMIZATION = {
    imageOptimization: {
        formats: ['WebP', 'AVIF', 'JPEG'],
        compression: 'lossless',
        lazyLoading: 'enabled',
        responsiveImages: 'enabled',
        nextImageOptimization: 'enabled'
    },
    codeOptimization: {
        javascript: {
            minification: 'enabled',
            treeShaking: 'enabled',
            codeSplitting: 'enabled',
            bundleAnalysis: 'enabled'
        },
        css: {
            minification: 'enabled',
            criticalCSS: 'enabled',
            unusedCSS: 'removed'
        }
    },
    caching: {
        browser: 'max-age=31536000',
        serviceWorker: 'enabled',
        cdn: 'global-edge-locations',
        api: 'redis-caching'
    },
    serverOptimization: {
        compression: 'Brotli + Gzip',
        http2: 'enabled',
        serverSideRendering: 'enabled',
        apiOptimization: 'graphql + rest'
    }
};

const TECHNICAL_SEO_OPTIMIZATIONS = {
    TECHNICAL_SEO_AUDIT,
    CORE_WEB_VITALS_CONFIG,
    STRUCTURED_DATA_CONFIGS,
    INTERNAL_LINKING_STRATEGY,
    XML_SITEMAP_CONFIG,
    ROBOTS_TXT_CONFIG,
    VOICE_SEARCH_OPTIMIZATION,
    MOBILE_FIRST_INDEXING,
    PAGE_SPEED_OPTIMIZATION
};

export default TECHNICAL_SEO_OPTIMIZATIONS;
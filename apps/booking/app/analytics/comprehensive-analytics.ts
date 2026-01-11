/**
 * Comprehensive Analytics and Performance Tracking System
 * Advanced SEO analytics, content performance, and business intelligence
 */

export interface SEOAnalytics {
    keywordRankings: {
        keyword: string;
        position: number;
        previousPosition: number;
        searchVolume: number;
        difficulty: number;
        url: string;
        lastUpdated: Date;
    }[];
    organicTrafficGrowth: {
        month: string;
        organicSessions: number;
        organicUsers: number;
        organicPageViews: number;
        bounceRate: number;
        avgSessionDuration: number;
        organicConversionRate: number;
    }[];
    localSearchPerformance: {
        city: string;
        localRankings: {
            keyword: string;
            position: number;
            mapPackPosition?: number;
        }[];
        googleMyBusinessViews: number;
        googleMyBusinessClicks: number;
        directionRequests: number;
        phoneCalls: number;
    }[];
    technicalSEO: {
        coreWebVitals: {
            lcp: number; // Largest Contentful Paint
            fid: number; // First Input Delay
            cls: number; // Cumulative Layout Shift
        };
        pageSpeed: {
            desktop: number;
            mobile: number;
        };
        indexationStatus: {
            indexedPages: number;
            totalPages: number;
            crawlErrors: number;
        };
        schemaMarkup: {
            implementedSchemas: string[];
            validationErrors: number;
            richSnippetsCount: number;
        };
    };
}

export interface ContentAnalytics {
    topPerformingContent: {
        url: string;
        title: string;
        type: 'blog' | 'guide' | 'video' | 'landing-page';
        views: number;
        uniqueVisitors: number;
        avgTimeOnPage: number;
        bounceRate: number;
        socialShares: number;
        backlinks: number;
        organicTraffic: number;
        conversionRate: number;
    }[];
    contentEngagement: {
        contentType: string;
        totalViews: number;
        avgEngagementTime: number;
        socialShares: number;
        comments: number;
        conversionRate: number;
    }[];
    leadMagnetPerformance: {
        leadMagnetId: string;
        title: string;
        downloads: number;
        conversionRate: number;
        emailCaptureRate: number;
        followUpConversion: number;
        revenueGenerated: number;
    }[];
    contentGaps: {
        targetKeyword: string;
        currentPosition: number;
        estimatedTraffic: number;
        contentNeeded: string[];
        priority: 'high' | 'medium' | 'low';
    }[];
}

export interface BusinessAnalytics {
    appointmentMetrics: {
        totalAppointments: number;
        completedAppointments: number;
        cancelledAppointments: number;
        noShowAppointments: number;
        completionRate: number;
        cancellationRate: number;
        noShowRate: number;
    };
    revenueMetrics: {
        totalRevenue: number;
        revenueGrowth: number;
        avgAppointmentValue: number;
        revenuePerSession: number;
        conversionRate: number;
        customerLifetimeValue: number;
    };
    customerAnalytics: {
        newCustomers: number;
        returningCustomers: number;
        customerRetentionRate: number;
        avgSessionsPerCustomer: number;
        customerAcquisitionCost: number;
        netPromoterScore: number;
    };
    servicePerformance: {
        serviceName: string;
        bookings: number;
        revenue: number;
        avgRating: number;
        completionRate: number;
        repeatBookingRate: number;
    }[];
}

export interface CompetitorAnalytics {
    keywordGaps: {
        keyword: string;
        competitorRanking: number;
        ourRanking: number;
        opportunity: 'high' | 'medium' | 'low';
        estimatedTraffic: number;
    }[];
    contentGaps: {
        topic: string;
        competitorContentUrls: string[];
        ourContentUrls: string[];
        contentGap: number;
        priority: 'high' | 'medium' | 'low';
    }[];
    backlinkGaps: {
        domain: string;
        competitorBacklinks: number;
        ourBacklinks: number;
        domainRating: number;
        opportunity: 'high' | 'medium' | 'low';
    }[];
}

export interface ConversionFunnel {
    stage: string;
    visitors: number;
    conversionRate: number;
    dropOffRate: number;
    revenue: number;
    optimizationRecommendations: string[];
}

// Advanced Analytics Configuration
export const ANALYTICS_CONFIG = {
    trackingEvents: {
        // SEO Tracking
        'organic_search': {
            category: 'SEO',
            action: 'Organic Traffic',
            label: 'Search Engine'
        },
        'local_search': {
            category: 'Local SEO',
            action: 'Local Search',
            label: 'Google My Business'
        },
        'keyword_click': {
            category: 'SEO',
            action: 'Keyword Click',
            label: 'Search Results'
        },

        // Content Engagement
        'content_view': {
            category: 'Content',
            action: 'Page View',
            label: 'Content Engagement'
        },
        'lead_magnet_download': {
            category: 'Lead Generation',
            action: 'Download',
            label: 'Lead Magnet'
        },
        'email_signup': {
            category: 'Lead Generation',
            action: 'Sign Up',
            label: 'Email Capture'
        },
        'content_share': {
            category: 'Content',
            action: 'Share',
            label: 'Social Media'
        },

        // Booking Funnel
        'booking_start': {
            category: 'Conversion',
            action: 'Booking Funnel',
            label: 'Start'
        },
        'service_selection': {
            category: 'Conversion',
            action: 'Booking Funnel',
            label: 'Service Selected'
        },
        'appointment_booked': {
            category: 'Conversion',
            action: 'Booking Complete',
            label: 'Success'
        },
        'booking_abandoned': {
            category: 'Conversion',
            action: 'Booking Abandoned',
            label: 'Exit'
        },

        // Local Business Actions
        'phone_call': {
            category: 'Local Action',
            action: 'Phone Call',
            label: 'Contact'
        },
        'direction_request': {
            category: 'Local Action',
            action: 'Directions',
            label: 'Visit Intent'
        },
        'website_visit': {
            category: 'Local Action',
            action: 'Website Visit',
            label: 'GMB Click'
        }
    },

    kpiTargets: {
        // SEO KPIs
        organicTrafficGrowth: '40%', // 6 months
        keywordRankings: {
            top3: '25 keywords',
            top10: '100 keywords',
            top50: '500 keywords'
        },
        localSearch: {
            top3LocalRankings: '15 keywords',
            googleMyBusinessViews: '50% increase'
        },

        // Content KPIs
        contentEngagement: '25% increase',
        leadGeneration: '30% increase',
        contentShares: '50% increase',

        // Conversion KPIs
        organicConversionRate: '15% increase',
        bookingConversionRate: '20% increase',
        customerLifetimeValue: '25% increase',

        // Business KPIs
        revenueGrowth: '35% annual',
        customerRetention: '80%'
    }
};

// Performance Monitoring Dashboards
export const DASHBOARD_CONFIGS = {
    executiveDashboard: {
        title: 'Executive Overview',
        refreshInterval: 'hourly',
        widgets: [
            {
                id: 'organic-traffic',
                type: 'line-chart',
                title: 'Organic Traffic Growth',
                dataSource: 'seoAnalytics.organicTrafficGrowth',
                timeRange: '6 months'
            },
            {
                id: 'keyword-rankings',
                type: 'ranking-table',
                title: 'Top Keyword Rankings',
                dataSource: 'seoAnalytics.keywordRankings',
                limit: 20
            },
            {
                id: 'revenue-overview',
                type: 'kpi-cards',
                title: 'Revenue Metrics',
                dataSource: 'businessAnalytics.revenueMetrics'
            },
            {
                id: 'conversion-funnel',
                type: 'funnel-chart',
                title: 'Booking Conversion Funnel',
                dataSource: 'conversionFunnel'
            }
        ]
    },

    seoDashboard: {
        title: 'SEO Performance',
        refreshInterval: 'daily',
        widgets: [
            {
                id: 'keyword-positions',
                type: 'position-chart',
                title: 'Keyword Position Tracking',
                dataSource: 'seoAnalytics.keywordRankings'
            },
            {
                id: 'local-search-performance',
                type: 'city-map',
                title: 'Local Search Performance',
                dataSource: 'seoAnalytics.localSearchPerformance'
            },
            {
                id: 'technical-seo',
                type: 'score-cards',
                title: 'Technical SEO Health',
                dataSource: 'seoAnalytics.technicalSEO'
            },
            {
                id: 'content-performance',
                type: 'performance-table',
                title: 'Content Performance',
                dataSource: 'contentAnalytics.topPerformingContent'
            }
        ]
    },

    contentDashboard: {
        title: 'Content Marketing',
        refreshInterval: 'daily',
        widgets: [
            {
                id: 'content-engagement',
                type: 'engagement-chart',
                title: 'Content Engagement Trends',
                dataSource: 'contentAnalytics.contentEngagement'
            },
            {
                id: 'lead-magnet-performance',
                type: 'conversion-table',
                title: 'Lead Magnet Performance',
                dataSource: 'contentAnalytics.leadMagnetPerformance'
            },
            {
                id: 'content-gaps',
                type: 'gap-analysis',
                title: 'Content Gap Analysis',
                dataSource: 'contentAnalytics.contentGaps'
            },
            {
                id: 'social-sharing',
                type: 'social-stats',
                title: 'Social Media Performance',
                dataSource: 'contentAnalytics.topPerformingContent'
            }
        ]
    },

    businessIntelligence: {
        title: 'Business Intelligence',
        refreshInterval: 'hourly',
        widgets: [
            {
                id: 'appointment-metrics',
                type: 'appointment-stats',
                title: 'Appointment Performance',
                dataSource: 'businessAnalytics.appointmentMetrics'
            },
            {
                id: 'service-performance',
                type: 'service-table',
                title: 'Service Performance',
                dataSource: 'businessAnalytics.servicePerformance'
            },
            {
                id: 'customer-analytics',
                type: 'customer-insights',
                title: 'Customer Insights',
                dataSource: 'businessAnalytics.customerAnalytics'
            },
            {
                id: 'competitor-analysis',
                type: 'competitor-table',
                title: 'Competitive Analysis',
                dataSource: 'competitorAnalytics'
            }
        ]
    }
};

// A/B Testing Framework
export const AB_TESTING_CONFIG = {
    activeTests: [
        {
            id: 'landing-page-headline',
            name: 'Landing Page Headline Test',
            description: 'Testing different headlines for better conversion',
            variants: [
                {
                    id: 'control',
                    name: 'Original Headline',
                    traffic: 50,
                    conversionRate: 0,
                    visitors: 0
                },
                {
                    id: 'variant-a',
                    name: 'Benefit-Focused Headline',
                    traffic: 25,
                    conversionRate: 0,
                    visitors: 0
                },
                {
                    id: 'variant-b',
                    name: 'Urgency-Driven Headline',
                    traffic: 25,
                    conversionRate: 0,
                    visitors: 0
                }
            ],
            successMetric: 'booking_conversion_rate',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            status: 'running'
        },
        {
            id: 'cta-button-design',
            name: 'CTA Button Design Test',
            description: 'Testing different CTA button designs and copy',
            variants: [
                {
                    id: 'control',
                    name: 'Original Button',
                    traffic: 33.33,
                    conversionRate: 0,
                    visitors: 0
                },
                {
                    id: 'variant-a',
                    name: 'Action-Oriented Button',
                    traffic: 33.33,
                    conversionRate: 0,
                    visitors: 0
                },
                {
                    id: 'variant-b',
                    name: 'Value-Proposition Button',
                    traffic: 33.33,
                    conversionRate: 0,
                    visitors: 0
                }
            ],
            successMetric: 'click_through_rate',
            startDate: new Date(),
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
            status: 'running'
        }
    ],

    testingFramework: {
        minimumSampleSize: 1000,
        confidenceLevel: 95,
        statisticalSignificance: 0.05,
        testDuration: '14 days',
        trafficAllocation: {
            min: 10,
            max: 50
        }
    }
};

// Attribution Modeling
export const ATTRIBUTION_CONFIG = {
    models: {
        firstTouch: {
            name: 'First Touch Attribution',
            description: 'Credits 100% to the first interaction',
            weight: 0.4
        },
        lastTouch: {
            name: 'Last Touch Attribution',
            description: 'Credits 100% to the last interaction',
            weight: 0.3
        },
        linear: {
            name: 'Linear Attribution',
            description: 'Distributes credit equally across all touchpoints',
            weight: 0.2
        },
        timeDecay: {
            name: 'Time Decay Attribution',
            description: 'Gives more credit to recent interactions',
            weight: 0.1
        }
    },

    touchpointTypes: [
        'organic_search',
        'paid_search',
        'social_media',
        'email_marketing',
        'direct_visit',
        'referral',
        'content_engagement',
        'local_search'
    ],

    conversionEvents: [
        'newsletter_signup',
        'lead_magnet_download',
        'booking_request',
        'appointment_completed',
        'service_purchase',
        'referral_generated'
    ]
};

// Real-time Monitoring
export const MONITORING_CONFIG = {
    alerts: [
        {
            id: 'organic-traffic-drop',
            name: 'Organic Traffic Drop Alert',
            condition: 'organicTrafficChange < -20%',
            severity: 'high',
            action: 'immediate_notification',
            channels: ['email', 'slack', 'sms']
        },
        {
            id: 'keyword-ranking-loss',
            name: 'Major Keyword Ranking Loss',
            condition: 'keywordPositionChange > 10 positions',
            severity: 'medium',
            action: 'daily_digest',
            channels: ['email']
        },
        {
            id: 'conversion-rate-drop',
            name: 'Conversion Rate Drop',
            condition: 'conversionRateChange < -15%',
            severity: 'high',
            action: 'immediate_notification',
            channels: ['email', 'slack']
        },
        {
            id: 'page-speed-issues',
            name: 'Page Speed Performance Issues',
            condition: 'pageLoadTime > 3 seconds',
            severity: 'medium',
            action: 'immediate_notification',
            channels: ['email', 'slack']
        }
    ],

    monitoringFrequency: {
        realTime: ['conversion_rate', 'page_speed', 'uptime'],
        hourly: ['organic_traffic', 'keyword_rankings', 'social_mentions'],
        daily: ['content_performance', 'competitor_analysis', 'technical_seo'],
        weekly: ['comprehensive_report', 'strategic_recommendations']
    }
};

const COMPREHENSIVE_ANALYTICS = {
    ANALYTICS_CONFIG,
    DASHBOARD_CONFIGS,
    AB_TESTING_CONFIG,
    ATTRIBUTION_CONFIG,
    MONITORING_CONFIG
};

export default COMPREHENSIVE_ANALYTICS;
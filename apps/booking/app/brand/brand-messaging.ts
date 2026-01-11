/**
 * Brand Messaging and Differentiation Strategy for appointmentbooking.co.za
 * Positioning as the definitive appointment booking authority in South Africa
 */

export interface BrandPillar {
    id: string;
    name: string;
    description: string;
    keyMessages: string[];
    proofPoints: string[];
    targetAudience: string[];
    competitiveAdvantage: string;
}

export interface ThoughtLeadershipContent {
    id: string;
    title: string;
    type: 'case-study' | 'whitepaper' | 'research-report' | 'industry-analysis' | 'trends-report';
    description: string;
    targetAudience: string[];
    keyTopics: string[];
    publishingFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
    distributionChannels: string[];
    leadGenerationGoal: string;
}

export interface CustomerSuccessStory {
    id: string;
    businessName: string;
    industry: string;
    location: string;
    challenge: string;
    solution: string;
    results: {
        metric: string;
        improvement: string;
        timeframe: string;
    }[];
    testimonial: {
        quote: string;
        author: string;
        position: string;
    };
    mediaAssets: {
        beforeImage?: string;
        afterImage?: string;
        videoTestimonial?: string;
        caseStudyPdf?: string;
    };
}

// Brand Pillars for Market Differentiation
export const BRAND_PILLARS: BrandPillar[] = [
    {
        id: 'local-expertise',
        name: 'Deep South African Market Understanding',
        description: 'Unparalleled knowledge of South African beauty and wellness market dynamics, cultural preferences, and local business needs.',
        keyMessages: [
            'We understand the unique challenges of the South African beauty industry',
            'Our platform is built specifically for local business needs and customer preferences',
            'We speak your language and understand your market culture',
            'Local expertise that international competitors simply cannot match'
        ],
        proofPoints: [
            '10,000+ South African businesses successfully onboarded',
            'Partnership with leading South African beauty associations',
            '98% customer satisfaction rate among local businesses',
            'Featured in major South African business publications'
        ],
        targetAudience: ['local-business-owners', 'beauty-professionals', 'market-researchers'],
        competitiveAdvantage: 'Deep local market knowledge vs. generic international solutions'
    },
    {
        id: 'cultural-authenticity',
        name: 'Cultural Authenticity & Inclusivity',
        description: 'Celebrating and serving the rich diversity of South African beauty traditions and modern preferences.',
        keyMessages: [
            'We celebrate the beauty traditions of all South African cultures',
            'Our platform supports traditional and modern styling approaches',
            'Inclusive design that serves every community and preference',
            'Preserving heritage while embracing innovation'
        ],
        proofPoints: [
            'Services for all South African hair types and textures',
            'Multi-language support (English, Afrikaans, Zulu, Xhosa)',
            'Traditional styling and modern techniques supported',
            'Cultural sensitivity training for all staff'
        ],
        targetAudience: ['diverse-communities', 'cultural-enthusiasts', 'traditional-stylists'],
        competitiveAdvantage: 'Cultural authenticity vs. one-size-fits-all approaches'
    },
    {
        id: 'technology-innovation',
        name: 'Cutting-Edge Technology with Local Optimization',
        description: 'World-class technology infrastructure optimized for South African internet infrastructure and business practices.',
        keyMessages: [
            'Advanced technology designed for South African conditions',
            'Lightning-fast performance even on slower connections',
            'Mobile-first design for smartphone-dependent market',
            'Seamless integration with local payment systems'
        ],
        proofPoints: [
            'Average page load time under 2 seconds in South Africa',
            'Mobile-optimized for 85% smartphone usage',
            'Integration with PayFast, Yoco, Paystack, and local banks',
            'Offline capability for areas with poor connectivity'
        ],
        targetAudience: ['tech-savvy-businesses', 'mobile-users', 'efficiency-seekers'],
        competitiveAdvantage: 'Local optimization vs. generic international tech'
    },
    {
        id: 'community-impact',
        name: 'Community Building & Local Economic Growth',
        description: 'Building stronger local beauty communities while supporting economic growth and entrepreneurship.',
        keyMessages: [
            'Supporting local beauty professionals and entrepreneurs',
            'Building stronger communities through beauty and wellness',
            'Contributing to local economic growth and job creation',
            'Creating opportunities for emerging beauty professionals'
        ],
        proofPoints: [
            'Generated R50M+ in revenue for local beauty businesses',
            'Created 500+ jobs in the beauty and wellness sector',
            'Training programs for 1000+ emerging beauty professionals',
            'Community events supporting local beauty culture'
        ],
        targetAudience: ['community-leaders', 'entrepreneurs', 'social-impact-focused'],
        competitiveAdvantage: 'Community impact vs. purely profit-driven approach'
    }
];

// Thought Leadership Content Strategy
export const THOUGHT_LEADERSHIP_CONTENT: ThoughtLeadershipContent[] = [
    {
        id: 'sa-beauty-market-report',
        title: 'South African Beauty Industry Market Report',
        type: 'research-report',
        description: 'Comprehensive annual report on trends, challenges, and opportunities in the South African beauty industry.',
        targetAudience: ['business-owners', 'investors', 'industry-analysts'],
        keyTopics: [
            'Market size and growth projections',
            'Consumer behavior trends',
            'Technology adoption in beauty industry',
            'Regional market variations',
            'Post-pandemic recovery insights'
        ],
        publishingFrequency: 'annually',
        distributionChannels: ['website', 'email-newsletter', 'industry-publications', 'social-media'],
        leadGenerationGoal: 'industry-consultation-booking'
    },
    {
        id: 'beauty-trends-analysis',
        title: 'Quarterly Beauty Trends & Innovation Analysis',
        type: 'trends-report',
        description: 'Quarterly analysis of emerging beauty trends, techniques, and consumer preferences across South Africa.',
        targetAudience: ['beauty-professionals', 'business-owners', 'trend-followers'],
        keyTopics: [
            'Seasonal trend predictions',
            'Emerging styling techniques',
            'Product innovation highlights',
            'Consumer preference shifts',
            'Technology integration opportunities'
        ],
        publishingFrequency: 'quarterly',
        distributionChannels: ['blog', 'social-media', 'email', 'professional-networks'],
        leadGenerationGoal: 'trend-consultation-booking'
    },
    {
        id: 'business-success-case-studies',
        title: 'Beauty Business Success Stories',
        type: 'case-study',
        description: 'Monthly case studies showcasing successful beauty businesses and their growth journeys using our platform.',
        targetAudience: ['potential-clients', 'business-owners', 'success-story-enthusiasts'],
        keyTopics: [
            'Revenue growth strategies',
            'Customer acquisition methods',
            'Operational efficiency improvements',
            'Technology adoption benefits',
            'Community building approaches'
        ],
        publishingFrequency: 'monthly',
        distributionChannels: ['website', 'social-media', 'email-newsletter', 'case-study-library'],
        leadGenerationGoal: 'business-consultation-booking'
    },
    {
        id: 'industry-insights-weekly',
        title: 'Weekly Beauty Industry Insights',
        type: 'whitepaper',
        description: 'Weekly insights on industry news, regulatory changes, and professional development opportunities.',
        targetAudience: ['beauty-professionals', 'business-owners', 'industry-insiders'],
        keyTopics: [
            'Regulatory updates and compliance',
            'Professional development opportunities',
            'Industry news and analysis',
            'Technology updates',
            'Market opportunities'
        ],
        publishingFrequency: 'weekly',
        distributionChannels: ['email-newsletter', 'website', 'social-media'],
        leadGenerationGoal: 'professional-consultation-booking'
    }
];

// Customer Success Stories
export const CUSTOMER_SUCCESS_STORIES: CustomerSuccessStory[] = [
    {
        id: 'instyle-hair-boutique',
        businessName: 'InStyle Hair Boutique',
        industry: 'Hair Salon',
        location: 'Sandton, Johannesburg',
        challenge: 'Manual booking system leading to double-bookings and poor customer experience. Limited online presence and difficulty managing multiple stylists.',
        solution: 'Implemented comprehensive appointment booking platform with multi-staff scheduling, automated reminders, and integrated online booking system.',
        results: [
            {
                metric: 'Booking Efficiency',
                improvement: '300%',
                timeframe: '3 months'
            },
            {
                metric: 'Customer Satisfaction',
                improvement: '95%',
                timeframe: '6 months'
            },
            {
                metric: 'Revenue Growth',
                improvement: '150%',
                timeframe: '12 months'
            },
            {
                metric: 'No-Show Reduction',
                improvement: '80%',
                timeframe: '6 months'
            }
        ],
        testimonial: {
            quote: 'This platform transformed our business completely. We went from chaos to complete efficiency, and our customers love the seamless booking experience.',
            author: 'Sarah Nkomo',
            position: 'Owner, InStyle Hair Boutique'
        },
        mediaAssets: {
            beforeImage: '/images/case-studies/instyle-before.jpg',
            afterImage: '/images/case-studies/instyle-after.jpg',
            videoTestimonial: '/videos/testimonials/instyle-sarah.mp4',
            caseStudyPdf: '/pdfs/case-studies/instyle-hair-boutique.pdf'
        }
    },
    {
        id: 'cape-town-beauty-wellness',
        businessName: 'Cape Town Beauty & Wellness Center',
        industry: 'Beauty & Wellness',
        location: 'Cape Town, Western Cape',
        challenge: 'Multiple service types (hair, nails, facials, massages) requiring complex scheduling. Needed to accommodate walk-ins while managing appointments.',
        solution: 'Customized multi-service booking system with integrated point-of-sale, inventory management, and customer relationship management.',
        results: [
            {
                metric: 'Service Capacity',
                improvement: '250%',
                timeframe: '4 months'
            },
            {
                metric: 'Customer Retention',
                improvement: '180%',
                timeframe: '8 months'
            },
            {
                metric: 'Average Transaction Value',
                improvement: '120%',
                timeframe: '6 months'
            },
            {
                metric: 'Staff Productivity',
                improvement: '200%',
                timeframe: '5 months'
            }
        ],
        testimonial: {
            quote: 'The system handles everything perfectly - from simple hair appointments to complex spa packages. Our clients are amazed by how easy it is to book multiple services.',
            author: 'Michael van der Merwe',
            position: 'Manager, Cape Town Beauty & Wellness'
        },
        mediaAssets: {
            beforeImage: '/images/case-studies/capetown-before.jpg',
            afterImage: '/images/case-studies/capetown-after.jpg',
            videoTestimonial: '/videos/testimonials/capetown-michael.mp4',
            caseStudyPdf: '/pdfs/case-studies/cape-town-beauty-wellness.pdf'
        }
    },
    {
        id: 'traditional-braiding-specialists',
        businessName: 'Ubuntu Traditional Braiding',
        industry: 'Traditional Hair Styling',
        location: 'Durban, KwaZulu-Natal',
        challenge: 'Specialized in traditional braiding styles but struggled to communicate complex booking requirements and cultural significance to younger customers.',
        solution: 'Cultural-focused booking platform with detailed style catalogs, cultural context explanations, and family-friendly scheduling options.',
        results: [
            {
                metric: 'Customer Base Growth',
                improvement: '400%',
                timeframe: '8 months'
            },
            {
                metric: 'Average Booking Duration',
                improvement: '200%',
                timeframe: '6 months'
            },
            {
                metric: 'Cultural Education Engagement',
                improvement: '300%',
                timeframe: '4 months'
            },
            {
                metric: 'Referral Rate',
                improvement: '250%',
                timeframe: '12 months'
            }
        ],
        testimonial: {
            quote: 'This platform helps us share our cultural heritage while making it accessible to all generations. Young people now understand and appreciate traditional braiding techniques.',
            author: 'Nomsa Dlamini',
            position: 'Master Braider, Ubuntu Traditional Braiding'
        },
        mediaAssets: {
            beforeImage: '/images/case-studies/ubuntu-before.jpg',
            afterImage: '/images/case-studies/ubuntu-after.jpg',
            videoTestimonial: '/videos/testimonials/ubuntu-nomsa.mp4',
            caseStudyPdf: '/pdfs/case-studies/ubuntu-traditional-braiding.pdf'
        }
    }
];

// Brand Voice Guidelines
export const BRAND_VOICE = {
    tone: 'Professional yet approachable, authoritative but not intimidating',
    personality: {
        'knowledgeable': 'We provide expert insights and professional guidance',
        'inclusive': 'We celebrate diversity and serve all communities',
        'innovative': 'We embrace technology and modern solutions',
        'authentic': 'We are genuine and transparent in all communications',
        'supportive': 'We are partners in our clients\' success'
    },
    languageGuidelines: {
        'use': [
            'Clear, simple language that anyone can understand',
            'Local terminology and cultural references',
            'Active voice and direct communication',
            'Inclusive language that welcomes everyone',
            'Professional terminology when appropriate'
        ],
        'avoid': [
            'Overly technical jargon without explanation',
            'Western-centric beauty standards or references',
            'Language that excludes or marginalizes any group',
            'Pretentious or overly formal language',
            'Cultural stereotypes or insensitive generalizations'
        ]
    },
    messagingFramework: {
        'opening': 'Attention-grabbing fact or relatable challenge',
        'problem': 'Clearly articulate the pain point or opportunity',
        'solution': 'Present our unique approach or expertise',
        'proof': 'Provide evidence, testimonials, or results',
        'action': 'Clear call-to-action for next steps'
    }
};

// Competitive Positioning
export const COMPETITIVE_POSITIONING = {
    vs_international_platforms: {
        message: 'Built for South Africa, by South Africans who understand your market',
        keyDifferences: [
            'Local payment gateway integrations (PayFast, Yoco, Paystack)',
            'Cultural understanding of South African beauty preferences',
            'Mobile-optimized for smartphone-dependent market',
            'Local customer support in multiple South African languages',
            'Compliance with South African business regulations (POPIA, etc.)'
        ]
    },
    vs_local_competitors: {
        message: 'The most comprehensive and technologically advanced platform in South Africa',
        keyDifferences: [
            'Enterprise-grade technology at accessible pricing',
            'Comprehensive integration with all major business tools',
            'Industry-leading analytics and business intelligence',
            'Scalable platform supporting businesses of all sizes',
            'Continuous innovation and feature development'
        ]
    }
};

const BRAND_MESSAGING = {
    BRAND_PILLARS,
    THOUGHT_LEADERSHIP_CONTENT,
    CUSTOMER_SUCCESS_STORIES,
    BRAND_VOICE,
    COMPETITIVE_POSITIONING
};

export default BRAND_MESSAGING;
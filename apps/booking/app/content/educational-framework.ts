/**
 * Educational Content Framework for appointmentbooking.co.za
 * Comprehensive content strategy for establishing thought leadership
 */

export interface ContentCategory {
    id: string;
    name: string;
    description: string;
    slug: string;
    targetKeywords: string[];
    contentTypes: ContentType[];
    priority: 'high' | 'medium' | 'low';
    targetAudience: string[];
    seasonalContent?: boolean;
}

export interface ContentType {
    type: 'blog' | 'guide' | 'video' | 'infographic' | 'quiz' | 'calculator' | 'checklist';
    title: string;
    description: string;
    targetKeywords: string[];
    targetWordCount?: number;
    leadMagnet?: boolean;
    callToAction: string;
}

export interface LeadMagnet {
    id: string;
    title: string;
    description: string;
    type: 'pdf' | 'video' | 'interactive' | 'template' | 'checklist';
    targetAudience: string[];
    conversionGoal: string;
    valueProposition: string;
    emailCaptureRequired: boolean;
    followUpSequence: string[];
}

// Content Categories for South African Beauty Market
export const CONTENT_CATEGORIES: ContentCategory[] = [
    {
        id: 'hair-care-basics',
        name: 'Hair Care Fundamentals',
        description: 'Essential hair care knowledge for South African climate and hair types',
        slug: 'hair-care-basics',
        targetKeywords: [
            'hair care tips south africa',
            'hair care for african hair',
            'hair care in humid climate',
            'hair care routine south africa',
            'best hair products south africa'
        ],
        contentTypes: [
            {
                type: 'guide',
                title: 'Complete Guide to Hair Care in South Africa',
                description: 'Comprehensive guide covering hair care routines, products, and techniques for South African climate conditions',
                targetKeywords: ['hair care guide', 'south africa hair care', 'african hair care'],
                targetWordCount: 3000,
                leadMagnet: true,
                callToAction: 'Download our Free Hair Care Guide'
            },
            {
                type: 'blog',
                title: 'Understanding Your Hair Type: A South African Perspective',
                description: 'Learn to identify and care for your specific hair type in South African climate conditions',
                targetKeywords: ['hair type identification', 'hair care south africa', 'hair type guide'],
                targetWordCount: 1500,
                callToAction: 'Book a Free Hair Consultation'
            },
            {
                type: 'quiz',
                title: 'Find Your Perfect Hair Care Routine',
                description: 'Interactive quiz to determine your personalized hair care routine',
                targetKeywords: ['hair care quiz', 'personalized hair care', 'hair routine finder'],
                leadMagnet: true,
                callToAction: 'Get Your Custom Hair Care Plan'
            }
        ],
        priority: 'high',
        targetAudience: ['general-consumers', 'hair-enthusiasts', 'first-time-hair-care'],
        seasonalContent: true
    },
    {
        id: 'seasonal-hair-care',
        name: 'Seasonal Hair Care',
        description: 'Tailored hair care advice for South African seasons and weather patterns',
        slug: 'seasonal-hair-care',
        targetKeywords: [
            'summer hair care south africa',
            'winter hair care south africa',
            'humid weather hair care',
            'dry season hair care',
            'hair care seasons'
        ],
        contentTypes: [
            {
                type: 'blog',
                title: 'Summer Hair Care: Protecting Your Hair in the South African Sun',
                description: 'Essential summer hair care tips for protection against UV, humidity, and chlorine',
                targetKeywords: ['summer hair care', 'hair protection sun', 'humid weather hair'],
                targetWordCount: 1200,
                callToAction: 'Book a Summer Hair Treatment'
            },
            {
                type: 'guide',
                title: 'Winter Hair Care Guide: Combatting Dryness and Damage',
                description: 'Complete winter hair care routine for South African winters',
                targetKeywords: ['winter hair care', 'dry hair winter', 'hair moisture winter'],
                targetWordCount: 2000,
                leadMagnet: true,
                callToAction: 'Download Winter Hair Care Checklist'
            }
        ],
        priority: 'high',
        targetAudience: ['general-consumers', 'busy-professionals', 'outdoor-enthusiasts'],
        seasonalContent: true
    },
    {
        id: 'styling-techniques',
        name: 'Hair Styling Mastery',
        description: 'Professional styling techniques and tutorials for all hair types',
        slug: 'styling-techniques',
        targetKeywords: [
            'hair styling techniques',
            'professional hair styling',
            'easy hair styles',
            'hair styling tutorials',
            'quick hair styling'
        ],
        contentTypes: [
            {
                type: 'video',
                title: '5-Minute Professional Hair Styling Tutorial',
                description: 'Step-by-step video guide for quick professional styling at home',
                targetKeywords: ['quick hair styling', 'easy hair styles', 'professional hair tutorial'],
                callToAction: 'Book a Styling Session'
            },
            {
                type: 'infographic',
                title: 'Hair Styling Tools Guide: What You Need and How to Use Them',
                description: 'Visual guide to essential hair styling tools and their proper usage',
                targetKeywords: ['hair styling tools', 'styling equipment guide', 'hair tools'],
                leadMagnet: true,
                callToAction: 'Download Styling Tools Checklist'
            }
        ],
        priority: 'medium',
        targetAudience: ['style-enthusiasts', 'busy-professionals', 'beginner-stylists'],
        seasonalContent: false
    },
    {
        id: 'salon-services',
        name: 'Salon Services & Treatments',
        description: 'Educational content about salon services, treatments, and professional care',
        slug: 'salon-services',
        targetKeywords: [
            'salon services south africa',
            'hair treatments',
            'professional hair care',
            'salon appointments',
            'hair salon services'
        ],
        contentTypes: [
            {
                type: 'guide',
                title: 'Complete Guide to Salon Services: What to Expect and How to Prepare',
                description: 'Comprehensive guide to salon services, treatments, and preparation tips',
                targetKeywords: ['salon services guide', 'what to expect salon', 'salon preparation'],
                targetWordCount: 2500,
                callToAction: 'Book Your Salon Appointment'
            },
            {
                type: 'blog',
                title: 'Hair Treatments 101: Which Treatment is Right for You?',
                description: 'Educational guide to different hair treatments and their benefits',
                targetKeywords: ['hair treatments', 'hair treatment guide', 'salon treatments'],
                callToAction: 'Book a Treatment Consultation'
            }
        ],
        priority: 'high',
        targetAudience: ['potential-clients', 'first-time-salon-visitors', 'treatment-seekers'],
        seasonalContent: false
    },
    {
        id: 'cultural-hair-care',
        name: 'Cultural Hair Care Traditions',
        description: 'Celebrating and preserving South African hair care traditions and techniques',
        slug: 'cultural-hair-care',
        targetKeywords: [
            'south african hair traditions',
            'cultural hair care',
            'traditional hair styling',
            'african hair traditions',
            'hair care culture'
        ],
        contentTypes: [
            {
                type: 'blog',
                title: 'Preserving South African Hair Care Traditions',
                description: 'Exploring traditional South African hair care methods and their modern applications',
                targetKeywords: ['south african hair traditions', 'traditional hair care', 'cultural hair styling'],
                targetWordCount: 1800,
                callToAction: 'Explore Traditional Styling Services'
            },
            {
                type: 'video',
                title: 'Traditional Braiding Techniques: A Cultural Journey',
                description: 'Educational video showcasing traditional South African braiding techniques',
                targetKeywords: ['traditional braiding', 'cultural hair styling', 'african braiding'],
                callToAction: 'Book a Traditional Styling Session'
            }
        ],
        priority: 'medium',
        targetAudience: ['cultural-enthusiasts', 'traditional-styling-seekers', 'heritage-minded'],
        seasonalContent: false
    }
];

// Lead Magnets for Content Marketing
export const LEAD_MAGNETS: LeadMagnet[] = [
    {
        id: 'hair-care-guide',
        title: 'Ultimate Hair Care Guide for South African Climate',
        description: 'Complete 50-page guide covering hair care routines, product recommendations, and seasonal tips specifically for South African hair types and climate conditions.',
        type: 'pdf',
        targetAudience: ['general-consumers', 'hair-care-beginners', 'climate-concerned'],
        conversionGoal: 'newsletter-signup',
        valueProposition: 'Get professional hair care advice tailored to South African conditions',
        emailCaptureRequired: true,
        followUpSequence: [
            'welcome-email',
            'hair-care-tips-series',
            'seasonal-care-reminders',
            'salon-service-recommendations'
        ]
    },
    {
        id: 'style-finder-quiz',
        title: 'Find Your Perfect Hairstyle Quiz',
        description: 'Interactive quiz that analyzes your face shape, hair type, lifestyle, and preferences to recommend the perfect hairstyles and styling routines.',
        type: 'interactive',
        targetAudience: ['style-seekers', 'transformation-interested', 'decision-helpers'],
        conversionGoal: 'style-consultation-booking',
        valueProposition: 'Get personalized hairstyle recommendations from professionals',
        emailCaptureRequired: true,
        followUpSequence: [
            'quiz-results-email',
            'recommended-styles-showcase',
            'styling-tips-series',
            'book-consultation-reminder'
        ]
    },
    {
        id: 'seasonal-care-checklist',
        title: 'Seasonal Hair Care Checklist Pack',
        description: 'Downloadable checklists for each season with specific hair care tasks, product recommendations, and appointment reminders.',
        type: 'checklist',
        targetAudience: ['organized-individuals', 'routine-followers', 'seasonal-planners'],
        conversionGoal: 'seasonal-appointment-booking',
        valueProposition: 'Never forget essential hair care tasks with our seasonal checklists',
        emailCaptureRequired: true,
        followUpSequence: [
            'checklist-download-confirmation',
            'seasonal-tips-email',
            'product-recommendations',
            'appointment-reminders'
        ]
    },
    {
        id: 'salon-preparation-guide',
        title: 'Salon Preparation & Aftercare Guide',
        description: 'Comprehensive guide on how to prepare for salon appointments and maintain results at home, including questions to ask and red flags to watch for.',
        type: 'pdf',
        targetAudience: ['first-time-salon-visitors', 'preparation-minded', 'aftercare-focused'],
        conversionGoal: 'salon-appointment-booking',
        valueProposition: 'Make the most of your salon visits with professional preparation tips',
        emailCaptureRequired: true,
        followUpSequence: [
            'guide-download-confirmation',
            'salon-appointment-reminder',
            'aftercare-tips-series',
            'service-recommendations'
        ]
    },
    {
        id: 'styling-tools-calculator',
        title: 'Hair Styling Tools ROI Calculator',
        description: 'Interactive calculator that helps determine which styling tools to invest in based on usage frequency, salon costs, and personal preferences.',
        type: 'interactive',
        targetAudience: ['budget-conscious', 'investment-planners', 'cost-analysts'],
        conversionGoal: 'styling-consultation-booking',
        valueProposition: 'Make informed decisions about styling tool investments',
        emailCaptureRequired: false,
        followUpSequence: [
            'calculator-results-email',
            'tool-recommendations',
            'styling-tutorial-offer',
            'professional-consultation-promo'
        ]
    }
];

// Content Calendar Templates
export const CONTENT_CALENDAR_TEMPLATE = {
    monthly: {
        blog_posts: 8,
        guides: 2,
        videos: 4,
        infographics: 2,
        quizzes: 1,
        social_media_posts: 60
    },
    weekly: {
        monday: 'motivational-hair-tips',
        tuesday: 'tutorial-tuesday',
        wednesday: 'wellness-wednesday',
        thursday: 'transformation-thursday',
        friday: 'faq-friday',
        saturday: 'salon-spotlight',
        sunday: 'self-care-sunday'
    }
};

// SEO Content Strategy
export const SEO_CONTENT_STRATEGY = {
    primary_keywords: [
        'hair salon appointments south africa',
        'beauty salon booking online',
        'hair salon cape town',
        'beauty salon johannesburg',
        'hair salon durban'
    ],
    long_tail_keywords: [
        'book hair salon appointment online cape town',
        'best hair salon for african hair johannesburg',
        'professional hair styling services durban',
        'affordable beauty salon appointments pretoria',
        'hair treatment salon near me south africa'
    ],
    local_keywords: [
        'hair salon near me',
        'beauty salon near me',
        'hair stylist near me',
        'beauty salon open now',
        'hair salon appointments today'
    ]
};

const EDUCATIONAL_FRAMEWORK = {
    CONTENT_CATEGORIES,
    LEAD_MAGNETS,
    CONTENT_CALENDAR_TEMPLATE,
    SEO_CONTENT_STRATEGY
};

export default EDUCATIONAL_FRAMEWORK;
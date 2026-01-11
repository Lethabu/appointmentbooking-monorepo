/**
 * South African Market-Specific Content Strategy
 * Tailored content addressing local concerns, culture, and preferences
 */

export interface SAClimateContent {
    season: string;
    months: string[];
    climateChallenges: string[];
    hairCareConcerns: string[];
    contentTopics: ContentTopic[];
    productRecommendations: string[];
    appointmentServices: string[];
}

export interface ContentTopic {
    id: string;
    title: string;
    description: string;
    targetKeywords: string[];
    contentType: 'blog' | 'guide' | 'video' | 'infographic';
    urgencyLevel: 'high' | 'medium' | 'low';
    targetAudience: string[];
}

export interface CulturalContent {
    tradition: string;
    region: string;
    significance: string;
    modernRelevance: string;
    contentTopics: ContentTopic[];
    services: string[];
    keyMessages: string[];
}

export interface LocalEventContent {
    event: string;
    date: string;
    relevance: string;
    contentStrategy: string[];
    hashtags: string[];
    visualAssets: string[];
}

// South African Climate-Based Content Strategy
export const SA_CLIMATE_CONTENT: SAClimateContent[] = [
    {
        season: 'Summer',
        months: ['December', 'January', 'February'],
        climateChallenges: [
            'Extreme heat and UV exposure',
            'High humidity levels',
            'Chlorine exposure from swimming',
            'Salt water exposure from coastal areas',
            'Sweat and oil production increase'
        ],
        hairCareConcerns: [
            'UV damage and color fading',
            'Humidity causing frizz and volume loss',
            'Chlorine turning hair green or brittle',
            'Increased scalp issues from sweating',
            'Product buildup from heat and humidity'
        ],
        contentTopics: [
            {
                id: 'summer-hair-protection',
                title: 'Ultimate Summer Hair Protection Guide for South Africa',
                description: 'Comprehensive guide to protecting hair from summer sun, chlorine, and humidity',
                targetKeywords: [
                    'summer hair protection south africa',
                    'hair care summer humidity',
                    'chlorine hair protection tips',
                    'uv hair damage prevention'
                ],
                contentType: 'guide',
                urgencyLevel: 'high',
                targetAudience: ['general-consumers', 'swimming-enthusiasts', 'outdoor-workers']
            },
            {
                id: 'humidity-hair-management',
                title: 'Beat the Humidity: Managing Frizzy Hair in South African Summers',
                description: 'Specific techniques and products for managing humidity-induced frizz',
                targetKeywords: [
                    'humidity hair frizz control',
                    'anti frizz hair tips south africa',
                    'summer hair styling humidity'
                ],
                contentType: 'video',
                urgencyLevel: 'high',
                targetAudience: ['frizzy-hair-strugglers', 'humidity-affected', 'style-maintainers']
            },
            {
                id: 'summer-hair-color-protection',
                title: 'Preserving Hair Color Through South African Summer',
                description: 'Protecting colored hair from sun, chlorine, and salt water damage',
                targetKeywords: [
                    'hair color protection summer',
                    'colored hair chlorine protection',
                    'summer hair color preservation'
                ],
                contentType: 'blog',
                urgencyLevel: 'medium',
                targetAudience: ['colored-hair', 'pool-swimmers', 'beach-goers']
            }
        ],
        productRecommendations: [
            'UV protection hair sprays',
            'Sulfate-free shampoos for chlorine protection',
            'Anti-frizz serums and creams',
            'Deep conditioning treatments',
            'Heat protection sprays for styling'
        ],
        appointmentServices: [
            'Pre-summer hair treatment packages',
            'Color protection treatments',
            'Humidity-resistant styling services',
            'Scalp cleansing and cooling treatments',
            'Protective braid and style services'
        ]
    },
    {
        season: 'Winter',
        months: ['June', 'July', 'August'],
        climateChallenges: [
            'Dry air and low humidity',
            'Indoor heating effects',
            'Cold wind exposure',
            'Less frequent washing',
            'Static electricity buildup'
        ],
        hairCareConcerns: [
            'Extreme dryness and brittleness',
            'Dandruff and scalp issues',
            'Increased breakage and split ends',
            'Lack of moisture and shine',
            'Difficulty maintaining styles'
        ],
        contentTopics: [
            {
                id: 'winter-moisture-routine',
                title: 'Winter Hair Care Routine: Combatting South African Winter Dryness',
                description: 'Essential winter hair care routine for South African climate conditions',
                targetKeywords: [
                    'winter hair care south africa',
                    'dry hair winter treatment',
                    'winter hair moisture routine'
                ],
                contentType: 'guide',
                urgencyLevel: 'high',
                targetAudience: ['dry-hair-strugglers', 'winter-care', 'moisture-seekers']
            },
            {
                id: 'winter-hair-treatments',
                title: 'Essential Winter Hair Treatments for South African Hair',
                description: 'Professional treatments and home care for winter hair health',
                targetKeywords: [
                    'winter hair treatments',
                    'dry hair winter solutions',
                    'hair moisture treatments south africa'
                ],
                contentType: 'blog',
                urgencyLevel: 'medium',
                targetAudience: ['treatment-seekers', 'dry-hair', 'professional-care']
            },
            {
                id: 'winter-styling-tips',
                title: 'Winter Hair Styling: Maintaining Volume in Dry Conditions',
                description: 'Styling techniques for voluminous hair during dry winter months',
                targetKeywords: [
                    'winter hair styling tips',
                    'volume hair dry weather',
                    'winter hair styling south africa'
                ],
                contentType: 'video',
                urgencyLevel: 'medium',
                targetAudience: ['volume-seekers', 'style-maintainers', 'dry-weather']
            }
        ],
        productRecommendations: [
            'Deep conditioning masks',
            'Moisturizing shampoos and conditioners',
            'Leave-in treatments and oils',
            'Anti-static sprays',
            'Gentle sulfate-free cleansers'
        ],
        appointmentServices: [
            'Intensive moisture treatments',
            'Scalp therapy sessions',
            'Deep conditioning services',
            'Protein treatments for strength',
            'Hydrating hair masks'
        ]
    },
    {
        season: 'Spring/Autumn',
        months: ['March', 'April', 'May', 'September', 'October', 'November'],
        climateChallenges: [
            'Transitional weather patterns',
            'Variable humidity levels',
            'Pollen and allergen exposure',
            'Temperature fluctuations',
            'Seasonal hair shedding'
        ],
        hairCareConcerns: [
            'Adaptation to changing conditions',
            'Allergic reactions and scalp sensitivity',
            'Hair loss and shedding concerns',
            'Product transition needs',
            'Seasonal adjustment difficulties'
        ],
        contentTopics: [
            {
                id: 'seasonal-transition-care',
                title: 'Transitioning Your Hair Care: Spring to Summer in South Africa',
                description: 'Guide for adjusting hair care routine during seasonal transitions',
                targetKeywords: [
                    'seasonal hair care transition',
                    'spring hair care south africa',
                    'seasonal hair adjustments'
                ],
                contentType: 'blog',
                urgencyLevel: 'medium',
                targetAudience: ['routine-adjusters', 'seasonal-changes', 'hair-health-focused']
            },
            {
                id: 'allergy-friendly-hair-care',
                title: 'Allergy-Friendly Hair Care for South African Spring',
                description: 'Hair care tips for managing seasonal allergies and sensitivities',
                targetKeywords: [
                    'allergy friendly hair care',
                    'seasonal hair allergies',
                    'sensitive scalp spring care'
                ],
                contentType: 'infographic',
                urgencyLevel: 'medium',
                targetAudience: ['allergy-sufferers', 'sensitive-scalp', 'health-conscious']
            }
        ],
        productRecommendations: [
            'Gentle, hypoallergenic products',
            'Scalp soothing treatments',
            'Lightweight moisturizers',
            'Allergy-friendly styling products',
            'Clarifying shampoos for buildup'
        ],
        appointmentServices: [
            'Scalp health assessments',
            'Gentle cleansing treatments',
            'Allergy-friendly services',
            'Seasonal adjustment consultations',
            'Hair health evaluations'
        ]
    }
];

// Cultural Hair Care Traditions Content
export const CULTURAL_CONTENT: CulturalContent[] = [
    {
        tradition: 'Traditional Braiding',
        region: 'Nationwide',
        significance: 'Cultural expression, practical hair management, and community bonding',
        modernRelevance: 'Maintaining cultural identity while adapting to contemporary lifestyles',
        contentTopics: [
            {
                id: 'traditional-braiding-history',
                title: 'The Art of Traditional South African Braiding',
                description: 'Exploring the rich history and cultural significance of traditional braiding techniques',
                targetKeywords: [
                    'traditional south african braiding',
                    'cultural hair braiding significance',
                    'south african braiding history'
                ],
                contentType: 'blog',
                urgencyLevel: 'low',
                targetAudience: ['cultural-enthusiasts', 'traditional-stylists', 'heritage-minded']
            },
            {
                id: 'modern-traditional-braiding',
                title: 'Traditional Braiding for Modern Life: Adapting Ancient Techniques',
                description: 'How traditional braiding techniques can be adapted for contemporary lifestyles',
                targetKeywords: [
                    'modern traditional braiding',
                    'traditional braiding contemporary',
                    'cultural braiding modern adaptation'
                ],
                contentType: 'video',
                urgencyLevel: 'medium',
                targetAudience: ['style-adapters', 'traditional-lovers', 'cultural-pride']
            },
            {
                id: 'braiding-techniques-guide',
                title: 'Complete Guide to Traditional South African Braiding Techniques',
                description: 'Step-by-step guide to various traditional braiding patterns and styles',
                targetKeywords: [
                    'traditional braiding techniques',
                    'south african braiding patterns',
                    'cultural braiding guide'
                ],
                contentType: 'guide',
                urgencyLevel: 'medium',
                targetAudience: ['learning-stylists', 'technique-enthusiasts', 'cultural-learners']
            }
        ],
        services: [
            'Traditional braiding consultations',
            'Cultural styling sessions',
            'Braiding technique workshops',
            'Heritage hair care services',
            'Community braiding events'
        ],
        keyMessages: [
            'Preserving cultural heritage through hair styling',
            'Traditional techniques adapted for modern life',
            'Celebrating diversity in beauty practices',
            'Community and cultural connection through styling'
        ]
    },
    {
        tradition: 'Xhosa Hair Traditions',
        region: 'Eastern Cape, Western Cape',
        significance: 'Spiritual connection, age-based identity markers, and ceremonial importance',
        modernRelevance: 'Maintaining spiritual and cultural connections in contemporary society',
        contentTopics: [
            {
                id: 'xhosa-hair-traditions',
                title: 'Xhosa Hair Traditions: Spirituality and Identity in Hairstyles',
                description: 'Exploring the spiritual and cultural significance of Xhosa hair traditions',
                targetKeywords: [
                    'xhosa hair traditions',
                    'xhosacultural hair significance',
                    'spiritual hair traditions south africa'
                ],
                contentType: 'blog',
                urgencyLevel: 'low',
                targetAudience: ['cultural-learners', 'spiritual-minded', 'heritage-enthusiasts']
            }
        ],
        services: [
            'Cultural hair consultations',
            'Traditional Xhosa styling',
            'Cultural education sessions',
            'Ceremonial hair services'
        ],
        keyMessages: [
            'Honoring spiritual traditions through hair',
            'Cultural identity preservation',
            'Educational and respectful styling approaches'
        ]
    },
    {
        tradition: 'Zulu Hair Traditions',
        region: 'KwaZulu-Natal',
        significance: 'Status indicators, marital status markers, and tribal identity',
        modernRelevance: 'Connecting with ancestral heritage and maintaining cultural pride',
        contentTopics: [
            {
                id: 'zulu-hair-traditions',
                title: 'Zulu Hair Traditions: Heritage and Identity in Traditional Styling',
                description: 'Understanding the cultural significance of Zulu hair styling traditions',
                targetKeywords: [
                    'zulu hair traditions',
                    'zulu cultural hair significance',
                    'traditional zulu hairstyles'
                ],
                contentType: 'blog',
                urgencyLevel: 'low',
                targetAudience: ['cultural-learners', 'zulu-heritage', 'traditional-enthusiasts']
            }
        ],
        services: [
            'Traditional Zulu styling',
            'Cultural hair education',
            'Heritage preservation services'
        ],
        keyMessages: [
            'Celebrating Zulu heritage',
            'Cultural pride through traditional styling',
            'Educational appreciation of traditions'
        ]
    },
    {
        tradition: 'Afrikaner Hair Traditions',
        region: 'Western Cape, Northern Cape, Free State',
        significance: 'Practical hair management for agricultural lifestyle, European influences',
        modernRelevance: 'Blending European techniques with South African practical needs',
        contentTopics: [
            {
                id: 'afrikaner-hair-traditions',
                title: 'Afrikaner Hair Traditions: Practical Heritage in Styling',
                description: 'Exploring practical hair care traditions in Afrikaner culture',
                targetKeywords: [
                    'afrikaner hair traditions',
                    'afrikaans hair culture',
                    'practical hair care traditions'
                ],
                contentType: 'blog',
                urgencyLevel: 'low',
                targetAudience: ['cultural-learners', 'afrikaner-heritage', 'practical-styling']
            }
        ],
        services: [
            'Practical styling consultations',
            'Heritage hair education',
            'Traditional technique workshops'
        ],
        keyMessages: [
            'Practical heritage in hair care',
            'Cultural adaptation and evolution',
            'Respect for diverse traditions'
        ]
    }
];

// Local Events and Festivals Content Strategy
export const LOCAL_EVENTS_CONTENT: LocalEventContent[] = [
    {
        event: 'Heritage Day (24 September)',
        date: 'September 24',
        relevance: 'Celebrating diverse South African cultures and traditions',
        contentStrategy: [
            'Multi-cultural hair styling features',
            'Traditional vs modern interpretation posts',
            'Community celebration content',
            'Cultural pride and identity themes'
        ],
        hashtags: ['#HeritageDay', '#ProudlySouthAfrican', '#CulturalPride', '#HairHeritage'],
        visualAssets: ['cultural-hairstyles-collage', 'traditional-modern-comparison', 'community-celebration']
    },
    {
        event: 'Springbok Rugby Tests',
        date: 'Various dates throughout year',
        relevance: 'National pride and sporting culture connection',
        contentStrategy: [
            'Game day hair styling inspiration',
            'Green and gold themed content',
            'Sports-friendly hair tips',
            'Team spirit and national pride themes'
        ],
        hashtags: ['#Springboks', '#RugbyDay', '#ProudlySouthAfrican', '#GreenAndGold'],
        visualAssets: ['green-gold-hairstyles', 'sports-friendly-styling', 'rugby-day-mood']
    },
    {
        event: 'Cape Town Minstrel Carnival',
        date: 'January 2',
        relevance: 'Cape Town cultural celebration with unique styling traditions',
        contentStrategy: [
            'Minstrel-inspired styling content',
            'Colorful and festive hair themes',
            'Cape Town cultural celebration',
            'Musical and artistic expression themes'
        ],
        hashtags: ['#MinstrelCarnival', '#CapeTownCulture', '#KaapseKlopse', '#ColorfulHair'],
        visualAssets: ['colorful-minstrel-styling', 'carnival-hairstyles', 'festive-color-inspiration']
    },
    {
        event: 'Diwali Celebrations',
        date: 'October/November (varies)',
        relevance: 'Indian South African cultural celebration with traditional styling',
        contentStrategy: [
            'Traditional Indian-inspired hairstyles',
            'Festive and elegant styling themes',
            'Cultural celebration content',
            'Beautiful and ornate styling inspiration'
        ],
        hashtags: ['#Diwali', '#FestivalOfLights', '#IndianHeritage', '#CulturalCelebration'],
        visualAssets: ['diwali-inspired-styling', 'elegant-festival-hair', 'traditional-indian-hairstyles']
    },
    {
        event: 'Freedom Day (27 April)',
        date: 'April 27',
        relevance: 'Celebrating democracy and freedom in South Africa',
        contentStrategy: [
            'Freedom and self-expression themes',
            'Modern South African identity',
            'Democratic values in beauty',
            'Individual expression and choice'
        ],
        hashtags: ['#FreedomDay', '#Democracy', '#SelfExpression', '#ProudlySouthAfrican'],
        visualAssets: ['freedom-inspired-styling', 'modern-south-african-identity', 'democratic-beauty']
    }
];

// Multi-Language Content Strategy
export const MULTILINGUAL_CONTENT = {
    languages: [
        {
            code: 'en',
            name: 'English',
            targetAudience: 'English-speaking South Africans (60% of population)',
            contentStrategy: [
                'Primary content in English',
                'Formal and professional tone',
                'International accessibility',
                'Business and professional focus'
            ]
        },
        {
            code: 'af',
            name: 'Afrikaans',
            targetAudience: 'Afrikaans-speaking South Africans (13% of population)',
            contentStrategy: [
                'Secondary content in Afrikaans',
                'Warm and community-focused tone',
                'Local and cultural emphasis',
                'Heritage and tradition focus'
            ]
        },
        {
            code: 'zu',
            name: 'Zulu',
            targetAudience: 'Zulu-speaking South Africans (22% of population)',
            contentStrategy: [
                'Community-focused content in Zulu',
                'Cultural and traditional emphasis',
                'Family and community values',
                'Traditional and modern balance'
            ]
        },
        {
            code: 'xh',
            name: 'Xhosa',
            targetAudience: 'Xhosa-speaking South Africans (16% of population)',
            contentStrategy: [
                'Cultural heritage content in Xhosa',
                'Traditional knowledge emphasis',
                'Community and spiritual values',
                'Cultural pride and identity'
            ]
        }
    ],

    contentPriorities: {
        high: ['English homepage', 'booking system', 'service descriptions', 'contact information'],
        medium: ['blog content', 'educational materials', 'customer testimonials', 'social media'],
        low: ['marketing materials', 'event content', 'community posts', 'seasonal campaigns']
    },

    translationStrategy: {
        priorityPages: [
            'Homepage and main navigation',
            'Service booking pages',
            'Contact and location information',
            'Customer testimonials',
            'FAQ sections'
        ],
        culturalAdaptation: [
            'Visual representation diversity',
            'Cultural sensitivity in language',
            'Local examples and references',
            'Cultural celebration integration'
        ]
    }
};

// Local Regulatory and Compliance Content
export const REGULATORY_CONTENT = [
    {
        topic: 'POPIA Compliance',
        title: 'Understanding POPIA: Your Data Rights in Hair and Beauty Services',
        description: 'Comprehensive guide to POPIA regulations affecting beauty businesses and customer data',
        targetAudience: ['business-owners', 'privacy-conscious', 'legal-compliance'],
        keyMessages: [
            'Your data is protected under South African law',
            'Businesses must be transparent about data usage',
            'You have rights regarding your personal information',
            'Compliance ensures trust and security'
        ]
    },
    {
        topic: 'Health Regulations',
        title: 'Health and Safety in Beauty Services: What You Need to Know',
        description: 'Guide to health regulations and safety standards in South African beauty services',
        targetAudience: ['business-owners', 'health-conscious-clients', 'compliance-focused'],
        keyMessages: [
            'Health and safety are paramount',
            'Regulated practices protect customers',
            'Professional standards ensure quality',
            'Safety protocols are regularly updated'
        ]
    },
    {
        topic: 'Professional Standards',
        title: 'Professional Beauty Standards in South Africa',
        description: 'Overview of professional standards and certification requirements',
        targetAudience: ['professionals', 'business-owners', 'quality-focused'],
        keyMessages: [
            'Professional standards ensure quality',
            'Certified professionals provide better service',
            'Continuous education maintains expertise',
            'Industry standards benefit everyone'
        ]
    }
];

// Water Quality and Climate Considerations
export const WATER_QUALITY_CONTENT = [
    {
        region: 'Cape Town',
        challenges: ['Hard water', 'Seasonal water restrictions', 'Coastal salt exposure'],
        contentTopics: [
            'Hard water hair care solutions',
            'Water conservation hair care tips',
            'Salt water protection for hair'
        ]
    },
    {
        region: 'Johannesburg',
        challenges: ['Hard water', 'High altitude', 'Air pollution'],
        contentTopics: [
            'Altitude hair care adjustments',
            'Pollution protection for hair',
            'Hard water mineral buildup removal'
        ]
    },
    {
        region: 'Durban',
        challenges: ['Humidity', 'Coastal conditions', 'High rainfall'],
        contentTopics: [
            'Humidity management techniques',
            'Coastal hair care strategies',
            'Moisture protection methods'
        ]
    }
];

const SA_MARKET_STRATEGY = {
    SA_CLIMATE_CONTENT,
    CULTURAL_CONTENT,
    LOCAL_EVENTS_CONTENT,
    MULTILINGUAL_CONTENT,
    REGULATORY_CONTENT,
    WATER_QUALITY_CONTENT
};

export default SA_MARKET_STRATEGY;
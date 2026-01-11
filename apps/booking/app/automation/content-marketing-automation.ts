/**
 * Content Marketing Automation and Distribution System
 * Automated content distribution, email marketing, and social media automation
 */

export interface AutomationWorkflow {
    id: string;
    name: string;
    type: 'email' | 'social' | 'content' | 'lead-nurture';
    trigger: {
        event: string;
        conditions: Record<string, any>;
        delay?: number;
    };
    actions: AutomationAction[];
    targetAudience: string[];
    status: 'active' | 'paused' | 'draft';
    performance: {
        totalSent: number;
        openRate: number;
        clickRate: number;
        conversionRate: number;
        lastRun: Date;
    };
}

export interface AutomationAction {
    type: 'send-email' | 'post-social' | 'create-content' | 'update-lead-score' | 'trigger-campaign';
    config: Record<string, any>;
    order: number;
}

export interface EmailCampaign {
    id: string;
    name: string;
    subject: string;
    template: string;
    audience: string[];
    schedule: {
        sendDate: Date;
        timezone: string;
        frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    };
    personalization: {
        variables: string[];
        rules: string[];
    };
    a_b_test?: {
        variant: string;
        testPercentage: number;
        successMetric: string;
    };
}

export interface SocialMediaAutomation {
    platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';
    content: {
        text: string;
        hashtags: string[];
        media: string[];
        links: string[];
    };
    schedule: {
        optimalTimes: string[];
        frequency: string;
        timezone: string;
    };
    engagement: {
        autoReply: boolean;
        responseTemplates: string[];
        escalationRules: string[];
    };
}

export interface ContentDistribution {
    channel: string;
    content: {
        type: 'blog' | 'video' | 'infographic' | 'guide' | 'social-post';
        url: string;
        title: string;
        description: string;
        tags: string[];
    };
    optimization: {
        seoKeywords: string[];
        socialHashtags: string[];
        targetAudience: string[];
        distributionTime: Date;
    };
    tracking: {
        clicks: number;
        shares: number;
        conversions: number;
        reach: number;
    };
}

// Email Marketing Automation Workflows
export const EMAIL_AUTOMATION_WORKFLOWS: AutomationWorkflow[] = [
    {
        id: 'welcome-series',
        name: 'Welcome Email Series',
        type: 'lead-nurture',
        trigger: {
            event: 'newsletter_signup',
            conditions: {
                source: 'website',
                optInDate: { $gte: '7 days ago' }
            },
            delay: 0
        },
        actions: [
            {
                type: 'send-email',
                config: {
                    template: 'welcome-email-1',
                    subject: 'Welcome to South Africa\'s Premier Booking Platform!',
                    delay: 0
                },
                order: 1
            },
            {
                type: 'send-email',
                config: {
                    template: 'welcome-email-2',
                    subject: 'Discover Hair Care Secrets for South African Climate',
                    delay: 3 * 24 * 60 * 60 * 1000 // 3 days
                },
                order: 2
            },
            {
                type: 'send-email',
                config: {
                    template: 'welcome-email-3',
                    subject: 'Book Your First Appointment - Special Offer!',
                    delay: 7 * 24 * 60 * 60 * 1000 // 7 days
                },
                order: 3
            }
        ],
        targetAudience: ['new-subscribers', 'website-visitors', 'lead-magnet-downloaders'],
        status: 'active',
        performance: {
            totalSent: 0,
            openRate: 0,
            clickRate: 0,
            conversionRate: 0,
            lastRun: new Date()
        }
    },
    {
        id: 'seasonal-care-reminders',
        name: 'Seasonal Hair Care Reminders',
        type: 'email',
        trigger: {
            event: 'seasonal_transition',
            conditions: {
                season: ['summer', 'winter', 'spring', 'autumn'],
                lastReminder: { $lt: '30 days ago' }
            }
        },
        actions: [
            {
                type: 'send-email',
                config: {
                    template: 'seasonal-care-reminder',
                    subject: 'Time to Adapt Your Hair Care for {{season}}',
                    personalization: true
                },
                order: 1
            },
            {
                type: 'update-lead-score',
                config: {
                    score: 5,
                    reason: 'seasonal_engagement'
                },
                order: 2
            }
        ],
        targetAudience: ['active-subscribers', 'previous-customers', 'engaged-users'],
        status: 'active',
        performance: {
            totalSent: 0,
            openRate: 0,
            clickRate: 0,
            conversionRate: 0,
            lastRun: new Date()
        }
    },
    {
        id: 'booking-abandonment-recovery',
        name: 'Booking Abandonment Recovery',
        type: 'email',
        trigger: {
            event: 'booking_abandoned',
            conditions: {
                stage: ['service-selection', 'appointment-time', 'customer-details'],
                abandonTime: { $gte: '10 minutes ago' }
            },
            delay: 60 * 60 * 1000 // 1 hour
        },
        actions: [
            {
                type: 'send-email',
                config: {
                    template: 'booking-recovery-1',
                    subject: 'Did You Forget Something? Complete Your Booking in 2 Clicks',
                    urgency: true
                },
                order: 1
            },
            {
                type: 'send-email',
                config: {
                    template: 'booking-recovery-2',
                    subject: 'Still Thinking? Here\'s 10% Off Your First Booking',
                    incentive: '10% discount code'
                },
                order: 2
            },
            {
                type: 'trigger-campaign',
                config: {
                    campaign: 'social-media-retargeting',
                    audience: 'booking-abandoners'
                },
                order: 3
            }
        ],
        targetAudience: ['booking-abandoners', 'recent-visitors', 'warm-leads'],
        status: 'active',
        performance: {
            totalSent: 0,
            openRate: 0,
            clickRate: 0,
            conversionRate: 0,
            lastRun: new Date()
        }
    },
    {
        id: 'post-appointment-follow-up',
        name: 'Post-Appointment Follow-up',
        type: 'email',
        trigger: {
            event: 'appointment_completed',
            conditions: {
                completedAt: { $lt: '2 hours ago' }
            },
            delay: 24 * 60 * 60 * 1000 // 24 hours
        },
        actions: [
            {
                type: 'send-email',
                config: {
                    template: 'post-appointment-thanks',
                    subject: 'Thank You for Your Visit! How Was Your Experience?'
                },
                order: 1
            },
            {
                type: 'send-email',
                config: {
                    template: 'aftercare-instructions',
                    subject: 'Maximize Your Results: Essential Aftercare Tips',
                    ifSatisfaction: 'high'
                },
                order: 2
            },
            {
                type: 'send-email',
                config: {
                    template: 'feedback-request',
                    subject: 'Help Us Improve: Share Your Experience',
                    ifSatisfaction: 'low'
                },
                order: 2
            }
        ],
        targetAudience: ['recent-customers', 'completed-appointments', 'service-recipients'],
        status: 'active',
        performance: {
            totalSent: 0,
            openRate: 0,
            clickRate: 0,
            conversionRate: 0,
            lastRun: new Date()
        }
    }
];

// Social Media Automation Content
export const SOCIAL_MEDIA_AUTOMATION: SocialMediaAutomation[] = [
    {
        platform: 'facebook',
        content: {
            text: '💫 Transform your hair with our professional styling services! Book your appointment today and discover the difference expert care makes. #HairGoals #SouthAfrica #BeautyServices',
            hashtags: ['#HairGoals', '#BeautyServices', '#SouthAfrica', '#HairSalon', '#ProfessionalStyling', '#HairCare'],
            media: ['featured-styling-image.jpg'],
            links: ['https://appointmentbooking.co.za/book']
        },
        schedule: {
            optimalTimes: ['08:00', '12:00', '18:00', '20:00'],
            frequency: '2 posts per day',
            timezone: 'Africa/Johannesburg'
        },
        engagement: {
            autoReply: true,
            responseTemplates: [
                'Thank you for your interest! You can book online at {{booking_link}}',
                'We\'d love to help! Check out our services and book at {{booking_link}}',
                'Hello! Ready to transform your look? Book at {{booking_link}}'
            ],
            escalationRules: [
                'If customer asks about pricing → send pricing info',
                'If customer has complaints → escalate to support team',
                'If customer requests specific stylist → transfer to booking team'
            ]
        }
    },
    {
        platform: 'instagram',
        content: {
            text: 'Swipe to see the amazing transformations our clients achieve! ✨ Book your appointment and be our next success story. Link in bio! #HairTransformation #BeforeAndAfter #BeautyGoals',
            hashtags: ['#HairTransformation', '#BeforeAndAfter', '#BeautyGoals', '#HairSalon', '#SouthAfrica', '#StyleInspo', '#HairCare'],
            media: ['transformation-carousel-1.jpg', 'transformation-carousel-2.jpg', 'transformation-carousel-3.jpg'],
            links: ['https://appointmentbooking.co.za/instagram-book']
        },
        schedule: {
            optimalTimes: ['11:00', '14:00', '17:00', '19:00'],
            frequency: '1 post per day + 3-5 stories',
            timezone: 'Africa/Johannesburg'
        },
        engagement: {
            autoReply: true,
            responseTemplates: [
                'Thank you! DM us to book your appointment 💫',
                'We\'d love to create your transformation! Book at {{link_in_bio}}',
                'Amazing, right? Book your appointment through the link in our bio!'
            ],
            escalationRules: [
                'If DM contains booking request → provide booking link',
                'If DM contains complaint → escalate to customer service',
                'If DM asks about specific services → provide service catalog'
            ]
        }
    },
    {
        platform: 'twitter',
        content: {
            text: 'Quick hair tip: Regular deep conditioning treatments can reduce breakage by up to 80%! 🌟 Book your treatment today. #HairTips #BeautyTips #SouthAfrica',
            hashtags: ['#HairTips', '#BeautyTips', '#SouthAfrica', '#HairCare', '#ProfessionalCare'],
            media: ['hair-tip-infographic.jpg'],
            links: ['https://appointmentbooking.co.za/tips-book']
        },
        schedule: {
            optimalTimes: ['09:00', '13:00', '16:00', '20:00'],
            frequency: '3-4 tweets per day',
            timezone: 'Africa/Johannesburg'
        },
        engagement: {
            autoReply: true,
            responseTemplates: [
                'Thanks for the follow! Book your appointment at {{booking_link}}',
                'Great question! Here\'s our booking link: {{booking_link}}'
            ],
            escalationRules: [
                'If tweet contains complaint → escalate to support',
                'If tweet asks for recommendations → provide booking link',
                'If tweet is positive feedback → thank and engage'
            ]
        }
    }
];

// Content Calendar Automation
export const CONTENT_CALENDAR_AUTOMATION = {
    weekly_schedule: {
        monday: {
            content: 'Motivational Monday Hair Tips',
            format: 'blog-post',
            automation: {
                publish_time: '09:00',
                social_distribution: true,
                email_newsletter: true
            }
        },
        tuesday: {
            content: 'Tutorial Tuesday (Video Content)',
            format: 'video',
            automation: {
                publish_time: '14:00',
                social_distribution: true,
                email_digest: false
            }
        },
        wednesday: {
            content: 'Wellness Wednesday (Health Tips)',
            format: 'infographic',
            automation: {
                publish_time: '11:00',
                social_distribution: true,
                email_newsletter: true
            }
        },
        thursday: {
            content: 'Transformation Thursday (Before/After)',
            format: 'image-carousel',
            automation: {
                publish_time: '17:00',
                social_distribution: true,
                email_newsletter: false
            }
        },
        friday: {
            content: 'FAQ Friday (Answer Common Questions)',
            format: 'blog-post',
            automation: {
                publish_time: '10:00',
                social_distribution: true,
                email_newsletter: true
            }
        },
        saturday: {
            content: 'Salon Spotlight (Feature Local Business)',
            format: 'case-study',
            automation: {
                publish_time: '15:00',
                social_distribution: true,
                email_newsletter: true
            }
        },
        sunday: {
            content: 'Self-Care Sunday (Relaxation Tips)',
            format: 'blog-post',
            automation: {
                publish_time: '19:00',
                social_distribution: true,
                email_newsletter: false
            }
        }
    },

    seasonal_content: {
        summer: {
            themes: ['UV protection', 'Humidity management', 'Swimming hair care', 'Beach hair tips'],
            frequency: 'increased',
            automation: {
                climate_alerts: true,
                product_recommendations: true,
                appointment_scheduling: true
            }
        },
        winter: {
            themes: ['Moisture retention', 'Static control', 'Dry scalp care', 'Indoor heating effects'],
            frequency: 'increased',
            automation: {
                climate_alerts: true,
                treatment_scheduling: true,
                product_recommendations: true
            }
        }
    },

    event_triggered_content: {
        holidays: {
            heritage_day: {
                content: 'Celebrating South African Hair Traditions',
                automation: true,
                timing: '1 week before',
                distribution: 'all_channels'
            },
            freedom_day: {
                content: 'Freedom to Choose Your Perfect Style',
                automation: true,
                timing: '1 week before',
                distribution: 'all_channels'
            }
        },
        weather_alerts: {
            extreme_heat: {
                content: 'Heat Wave Hair Protection Guide',
                automation: true,
                trigger: 'temperature > 35°C',
                timing: 'immediate',
                distribution: 'social_media_email'
            },
            high_humidity: {
                content: 'Humidity Hair Care Emergency Tips',
                automation: true,
                trigger: 'humidity > 80%',
                timing: 'immediate',
                distribution: 'social_media'
            }
        }
    }
};

// Lead Scoring and Nurture Automation
export const LEAD_NURTURE_AUTOMATION = {
    scoring_criteria: {
        website_visits: {
            homepage: 1,
            services_page: 2,
            booking_page: 3,
            blog_posts: 1,
            case_studies: 2
        },
        content_engagement: {
            email_opens: 1,
            email_clicks: 3,
            social_shares: 2,
            video_watches: 2,
            guide_downloads: 5
        },
        booking_behavior: {
            appointment_views: 3,
            booking_starts: 5,
            booking_completions: 10,
            no_shows: -5,
            cancellations: -3
        }
    },

    nurture_tracks: {
        cold_leads: {
            score_range: '0-20',
            content: ['educational_blog_posts', 'hair_care_tips', 'product_recommendations'],
            frequency: 'weekly',
            duration: '4 weeks'
        },
        warm_leads: {
            score_range: '21-50',
            content: ['case_studies', 'special_offers', 'booking_invitations'],
            frequency: 'every_3_days',
            duration: '6 weeks'
        },
        hot_leads: {
            score_range: '51-100',
            content: ['personalized_offers', 'direct_booking_invitations', 'consultation_offers'],
            frequency: 'daily',
            duration: '2 weeks'
        }
    },

    behavioral_triggers: {
        page_view_triggers: {
            'pricing_page': {
                action: 'send_pricing_comparison',
                delay: 0
            },
            'about_us_page': {
                action: 'add_to_trust_building_sequence',
                delay: 24 * 60 * 60 * 1000
            },
            'contact_page': {
                action: 'send_contact_preference_survey',
                delay: 2 * 60 * 60 * 1000
            }
        },
        time_based_triggers: {
            '1_hour_on_site': {
                action: 'send_live_chat_invitation',
                delay: 0
            },
            '3_page_views': {
                action: 'add_high_interest_segment',
                delay: 0
            },
            'return_visitor_3_days': {
                action: 'send_return_visitor_offer',
                delay: 0
            }
        }
    }
};

// Retargeting Campaign Automation
export const RETARGETING_AUTOMATION = {
    audiences: {
        website_visitors: {
            conditions: ['visited_site', 'not_converted'],
            duration: '30 days',
            content: ['service_highlights', 'testimonials', 'special_offers']
        },
        service_viewers: {
            conditions: ['viewed_specific_service', 'not_booked'],
            duration: '14 days',
            content: ['service_details', 'before_after', 'pricing_info']
        },
        cart_abandoners: {
            conditions: ['started_booking', 'abandoned_at_checkout'],
            duration: '7 days',
            content: ['booking_reminder', 'discount_offer', 'urgency_messaging']
        },
        past_customers: {
            conditions: ['completed_appointment', 'not_booked_recently'],
            duration: '60 days',
            content: ['new_services', 'loyalty_rewards', 'referral_program']
        }
    },

    campaign_sequences: {
        facebook_retargeting: [
            {
                delay: 0,
                content: 'dynamic_ad_service_viewed',
                audience: 'service_viewers'
            },
            {
                delay: 3,
                content: 'dynamic_ad_testimonial',
                audience: 'service_viewers'
            },
            {
                delay: 7,
                content: 'dynamic_ad_special_offer',
                audience: 'service_viewers'
            }
        ],
        google_retargeting: [
            {
                delay: 1,
                content: 'search_ad_brand_terms',
                audience: 'all_visitors'
            },
            {
                delay: 7,
                content: 'search_ad_service_terms',
                audience: 'service_viewers'
            }
        ]
    }
};

// Performance Monitoring and Optimization
export const AUTOMATION_PERFORMANCE = {
    key_metrics: {
        email_automation: {
            open_rate: 'target: >25%',
            click_rate: 'target: >5%',
            conversion_rate: 'target: >3%',
            unsubscribe_rate: 'target: <2%'
        },
        social_automation: {
            engagement_rate: 'target: >3%',
            reach_rate: 'target: >10%',
            click_through_rate: 'target: >2%',
            follower_growth: 'target: >5% monthly'
        },
        content_automation: {
            publish_consistency: 'target: 100%',
            distribution_reach: 'target: >80%',
            content_performance: 'target: >70% avg engagement'
        }
    },

    optimization_triggers: {
        low_performance: {
            trigger: 'open_rate < 15%',
            action: 'test_new_subject_lines'
        },
        high_unsubscribe: {
            trigger: 'unsubscribe_rate > 3%',
            action: 'review_content_frequency'
        },
        low_engagement: {
            trigger: 'click_rate < 2%',
            action: 'optimize_cta_buttons'
        }
    },

    ai_optimization: {
        send_time_optimization: {
            enabled: true,
            learning_period: '30 days',
            update_frequency: 'weekly'
        },
        content_optimization: {
            enabled: true,
            performance_tracking: 'real_time',
            automatic_improvements: true
        },
        audience_segmentation: {
            enabled: true,
            auto_segments: true,
            dynamic_content: true
        }
    }
};

const CONTENT_MARKETING_AUTOMATION = {
    EMAIL_AUTOMATION_WORKFLOWS,
    SOCIAL_MEDIA_AUTOMATION,
    CONTENT_CALENDAR_AUTOMATION,
    LEAD_NURTURE_AUTOMATION,
    RETARGETING_AUTOMATION,
    AUTOMATION_PERFORMANCE
};

export default CONTENT_MARKETING_AUTOMATION;
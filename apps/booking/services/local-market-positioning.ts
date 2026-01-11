// Local Market Positioning and Cultural Adaptation System
// South African market-specific features for competitive differentiation

import { createClient } from '@supabase/supabase-js';

export interface SALocalization {
    languages: {
        primary: 'English';
        secondary: ['Afrikaans', 'Zulu', 'Xhosa'];
        support: 'Limited' | 'Full' | 'AI-Powered';
    };

    culturalAdaptations: {
        businessHours: SALocalBusinessHours;
        publicHolidays: SAPublicHolidays[];
        paymentMethods: SAPaymentMethods;
        businessPractices: LocalBusinessPractices;
        culturalConsiderations: string[];
    };

    marketSpecificFeatures: {
        taxCalculation: SATaxCalculator;
        appointmentTypes: LocalAppointmentTypes;
        industryVerticals: SAIndustryVerticals;
        localIntegrations: LocalIntegrations;
    };
}

export interface SALocalBusinessHours {
    standard: {
        monday: { open: string; close: string; };
        tuesday: { open: string; close: string; };
        wednesday: { open: string; close: string; };
        thursday: { open: string; close: string; };
        friday: { open: string; close: string; };
        saturday: { open: string; close: string; };
        sunday: { open: string; close: string; };
    };
    variations: {
        capeTown: { weekendHours: string; };
        johannesburg: { peakHours: string[]; };
        durban: { seasonalAdjustments: boolean; };
    };
}

export interface SAPublicHolidays {
    name: string;
    date: string;
    type: 'fixed' | 'variable';
    province?: string[];
    description: string;
}

export interface SAPaymentMethods {
    card: {
        visa: boolean;
        mastercard: boolean;
        amex: boolean;
        diners: boolean;
    };
    eft: {
        standard: boolean;
        instant: boolean;
        scheduled: boolean;
    };
    mobile: {
        snapScan: boolean;
        zapper: boolean;
        payFast: boolean;
        ozow: boolean;
    };
    cash: boolean;
    bankTransfer: boolean;
}

export interface LocalBusinessPractices {
    appointmentTypes: {
        walkIns: boolean;
        scheduledOnly: boolean;
        emergencySlots: boolean;
        groupBookings: boolean;
    };
    communication: {
        preferredMethod: 'whatsapp' | 'sms' | 'email' | 'phone';
        languagePreference: string[];
        culturalSensitivity: string[];
    };
    payment: {
        deposits: boolean;
        fullPayment: boolean;
        paymentTerms: string;
        currency: 'ZAR';
    };
}

export interface SATaxCalculator {
    vat: {
        rate: number; // 15%
        inclusive: boolean;
        calculationMethod: 'add' | 'inclusive';
    };
    tips: {
        standard: number; // 10-15%
        serviceCharge: boolean;
    };
    discounts: {
        senior: number; // 10%
        student: number; // 5%
        local: number; // 5%
    };
}

export interface LocalAppointmentTypes {
    beauty: {
        individual: boolean;
        group: boolean;
        party: boolean;
        wedding: boolean;
        corporate: boolean;
    };
    healthcare: {
        consultation: boolean;
        treatment: boolean;
        followUp: boolean;
        emergency: boolean;
    };
    fitness: {
        personal: boolean;
        groupClass: boolean;
        workshop: boolean;
        assessment: boolean;
    };
}

export interface SAIndustryVerticals {
    beauty: {
        hairSalon: boolean;
        nailStudio: boolean;
        spa: boolean;
        barbershop: boolean;
        beautyClinic: boolean;
    };
    healthcare: {
        generalPractice: boolean;
        specialist: boolean;
        dental: boolean;
        physiotherapy: boolean;
        psychology: boolean;
    };
    fitness: {
        gym: boolean;
        yogaStudio: boolean;
        pilatesStudio: boolean;
        personalTrainer: boolean;
        sportsClub: boolean;
    };
    professional: {
        consulting: boolean;
        legal: boolean;
        accounting: boolean;
        realEstate: boolean;
    };
}

export interface LocalIntegrations {
    whatsappBusiness: {
        api: boolean;
        templates: boolean;
        automation: boolean;
    };
    southAfricanBanks: {
        fnb: boolean;
        standardBank: boolean;
        absa: boolean;
        nedbank: boolean;
        capitec: boolean;
    };
    localPaymentGateways: {
        payFast: boolean;
        ozow: boolean;
        yoco: boolean;
        peachPayments: boolean;
    };
    businessDirectories: {
        googleMyBusiness: boolean;
        facebookBusiness: boolean;
        localDirectories: boolean;
    };
}

export class LocalMarketPositioningManager {
    private supabase: any;

    constructor(supabaseUrl: string, supabaseKey: string) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    /**
     * Configure South African localization for tenant
     */
    async configureSALocalization(
        tenantId: string,
        localizationConfig: Partial<SALocalization>
    ): Promise<SALocalization> {
        try {
            const fullLocalization: SALocalization = {
                languages: {
                    primary: 'English',
                    secondary: ['Afrikaans', 'Zulu', 'Xhosa'],
                    support: 'AI-Powered',
                    ...localizationConfig.languages
                },
                culturalAdaptations: {
                    businessHours: this.getDefaultBusinessHours(),
                    publicHolidays: this.getSAPublicHolidays(),
                    paymentMethods: this.getDefaultPaymentMethods(),
                    businessPractices: this.getDefaultBusinessPractices(),
                    culturalConsiderations: [
                        'Respect for diverse cultural backgrounds',
                        'Multilingual communication support',
                        'Cultural sensitivity in scheduling',
                        'Local holiday awareness',
                        'Traditional and modern appointment preferences'
                    ],
                    ...localizationConfig.culturalAdaptations
                },
                marketSpecificFeatures: {
                    taxCalculation: this.getDefaultTaxCalculator(),
                    appointmentTypes: this.getDefaultAppointmentTypes(),
                    industryVerticals: this.getDefaultIndustryVerticals(),
                    localIntegrations: this.getDefaultLocalIntegrations(),
                    ...localizationConfig.marketSpecificFeatures
                }
            };

            // Update tenant configuration
            const { error } = await this.supabase
                .from('tenant_configurations')
                .update({
                    localization: fullLocalization,
                    updated_at: new Date().toISOString()
                })
                .eq('tenant_id', tenantId);

            if (error) {
                throw new Error('Failed to update localization configuration');
            }

            return fullLocalization;
        } catch (error) {
            console.error('Error configuring SA localization:', error);
            throw error;
        }
    }

    /**
     * Get South African public holidays
     */
    getSAPublicHolidays(): SAPublicHolidays[] {
        return [
            {
                name: 'New Year\'s Day',
                date: '01-01',
                type: 'fixed',
                description: 'Celebration of the new year'
            },
            {
                name: 'Human Rights Day',
                date: '03-21',
                type: 'fixed',
                description: 'Commemorating the Sharpeville massacre and human rights'
            },
            {
                name: 'Good Friday',
                date: 'variable',
                type: 'variable',
                description: 'Friday before Easter Sunday'
            },
            {
                name: 'Family Day',
                date: 'variable',
                type: 'variable',
                description: 'Monday after Easter Sunday'
            },
            {
                name: 'Freedom Day',
                date: '04-27',
                type: 'fixed',
                description: 'Celebrating South Africa\'s first democratic elections'
            },
            {
                name: 'Workers\' Day',
                date: '05-01',
                type: 'fixed',
                description: 'International Workers\' Day'
            },
            {
                name: 'Youth Day',
                date: '06-16',
                type: 'fixed',
                description: 'Commemorating the Soweto uprising'
            },
            {
                name: 'Women\'s Day',
                date: '08-09',
                type: 'fixed',
                description: 'National Women\'s Day'
            },
            {
                name: 'Heritage Day',
                date: '09-24',
                type: 'fixed',
                description: 'Celebrating South African cultural diversity'
            },
            {
                name: 'Day of Reconciliation',
                date: '12-16',
                type: 'fixed',
                description: 'Building national unity and reconciliation'
            },
            {
                name: 'Christmas Day',
                date: '12-25',
                type: 'fixed',
                description: 'Christmas celebration'
            },
            {
                name: 'Day of Goodwill',
                date: '12-26',
                type: 'fixed',
                description: 'Boxing Day / Day of Goodwill'
            }
        ];
    }

    /**
     * Get default South African business hours
     */
    getDefaultBusinessHours(): SALocalBusinessHours {
        return {
            standard: {
                monday: { open: '08:00', close: '17:00' },
                tuesday: { open: '08:00', close: '17:00' },
                wednesday: { open: '08:00', close: '17:00' },
                thursday: { open: '08:00', close: '17:00' },
                friday: { open: '08:00', close: '17:00' },
                saturday: { open: '08:00', close: '15:00' },
                sunday: { open: '09:00', close: '13:00' }
            },
            variations: {
                capeTown: { weekendHours: '09:00-14:00' },
                johannesburg: { peakHours: ['08:00-10:00', '16:00-18:00'] },
                durban: { seasonalAdjustments: true }
            }
        };
    }

    /**
     * Get default South African payment methods
     */
    getDefaultPaymentMethods(): SAPaymentMethods {
        return {
            card: {
                visa: true,
                mastercard: true,
                amex: true,
                diners: true
            },
            eft: {
                standard: true,
                instant: true,
                scheduled: true
            },
            mobile: {
                snapScan: true,
                zapper: true,
                payFast: true,
                ozow: true
            },
            cash: true,
            bankTransfer: true
        };
    }

    /**
     * Get default South African business practices
     */
    getDefaultBusinessPractices(): LocalBusinessPractices {
        return {
            appointmentTypes: {
                walkIns: true,
                scheduledOnly: false,
                emergencySlots: true,
                groupBookings: true
            },
            communication: {
                preferredMethod: 'whatsapp',
                languagePreference: ['English', 'Afrikaans'],
                culturalSensitivity: [
                    'Respect for traditional healing practices',
                    'Understanding of Ubuntu philosophy',
                    'Acknowledgment of diverse family structures',
                    'Sensitivity to economic realities'
                ]
            },
            payment: {
                deposits: false,
                fullPayment: true,
                paymentTerms: 'Payment on completion of service',
                currency: 'ZAR'
            }
        };
    }

    /**
     * Get default South African tax calculator
     */
    getDefaultTaxCalculator(): SATaxCalculator {
        return {
            vat: {
                rate: 15, // 15% VAT
                inclusive: true,
                calculationMethod: 'inclusive'
            },
            tips: {
                standard: 10, // 10% standard tip
                serviceCharge: false
            },
            discounts: {
                senior: 10, // 10% senior discount
                student: 5, // 5% student discount
                local: 5 // 5% local resident discount
            }
        };
    }

    /**
     * Get default local appointment types
     */
    getDefaultAppointmentTypes(): LocalAppointmentTypes {
        return {
            beauty: {
                individual: true,
                group: true,
                party: true,
                wedding: true,
                corporate: true
            },
            healthcare: {
                consultation: true,
                treatment: true,
                followUp: true,
                emergency: true
            },
            fitness: {
                personal: true,
                groupClass: true,
                workshop: true,
                assessment: true
            }
        };
    }

    /**
     * Get default South African industry verticals
     */
    getDefaultIndustryVerticals(): SAIndustryVerticals {
        return {
            beauty: {
                hairSalon: true,
                nailStudio: true,
                spa: true,
                barbershop: true,
                beautyClinic: true
            },
            healthcare: {
                generalPractice: true,
                specialist: true,
                dental: true,
                physiotherapy: true,
                psychology: true
            },
            fitness: {
                gym: true,
                yogaStudio: true,
                pilatesStudio: true,
                personalTrainer: true,
                sportsClub: true
            },
            professional: {
                consulting: true,
                legal: true,
                accounting: true,
                realEstate: true
            }
        };
    }

    /**
     * Get default local integrations
     */
    getDefaultLocalIntegrations(): LocalIntegrations {
        return {
            whatsappBusiness: {
                api: true,
                templates: true,
                automation: true
            },
            southAfricanBanks: {
                fnb: true,
                standardBank: true,
                absa: true,
                nedbank: true,
                capitec: true
            },
            localPaymentGateways: {
                payFast: true,
                ozow: true,
                yoco: true,
                peachPayments: true
            },
            businessDirectories: {
                googleMyBusiness: true,
                facebookBusiness: true,
                localDirectories: true
            }
        };
    }

    /**
     * Generate South African-specific booking features
     */
    async generateSABookingFeatures(tenantId: string): Promise<any> {
        try {
            const features = {
                multilingual: {
                    languages: ['English', 'Afrikaans', 'Zulu', 'Xhosa'],
                    autoTranslate: true,
                    culturalAdaptation: true
                },
                localHolidays: {
                    autoSchedule: true,
                    businessClosure: true,
                    alternativeBooking: true
                },
                paymentOptimization: {
                    localMethods: true,
                    mobilePayments: true,
                    eftSupport: true,
                    cashAccepted: true
                },
                culturalAdaptations: {
                    respectTraditional: true,
                    ubuntuPhilosophy: true,
                    diverseFamilyStructures: true,
                    economicSensitivity: true
                },
                businessHours: {
                    standardSA: true,
                    flexibleWeekends: true,
                    publicHolidayHandling: true,
                    peakHourOptimization: true
                }
            };

            return features;
        } catch (error) {
            console.error('Error generating SA booking features:', error);
            throw error;
        }
    }

    /**
     * Calculate South African taxes and fees
     */
    calculateSATaxes(basePrice: number, options: {
        includeVat?: boolean;
        tipPercentage?: number;
        applyDiscounts?: {
            senior?: boolean;
            student?: boolean;
            local?: boolean;
        };
    } = {}): {
        basePrice: number;
        vat: number;
        tip: number;
        discount: number;
        total: number;
        breakdown: any;
    } {
        const { includeVat = true, tipPercentage = 0, applyDiscounts = {} } = options;

        let finalPrice = basePrice;
        let vatAmount = 0;
        let tipAmount = 0;
        let discountAmount = 0;

        // Calculate VAT (15%)
        if (includeVat) {
            vatAmount = Math.round(basePrice * 0.15 * 100) / 100;
            finalPrice += vatAmount;
        }

        // Calculate tip
        if (tipPercentage > 0) {
            tipAmount = Math.round(basePrice * (tipPercentage / 100) * 100) / 100;
            finalPrice += tipAmount;
        }

        // Calculate discounts
        if (applyDiscounts.senior) {
            discountAmount += Math.round(basePrice * 0.10 * 100) / 100;
        }
        if (applyDiscounts.student) {
            discountAmount += Math.round(basePrice * 0.05 * 100) / 100;
        }
        if (applyDiscounts.local) {
            discountAmount += Math.round(basePrice * 0.05 * 100) / 100;
        }

        finalPrice -= discountAmount;

        return {
            basePrice,
            vat: vatAmount,
            tip: tipAmount,
            discount: discountAmount,
            total: Math.round(finalPrice * 100) / 100,
            breakdown: {
                originalPrice: basePrice,
                vatRate: '15%',
                vatAmount,
                tipPercentage,
                tipAmount,
                discounts: applyDiscounts,
                discountAmount,
                finalTotal: Math.round(finalPrice * 100) / 100
            }
        };
    }

    /**
     * Get cultural recommendations for South African market
     */
    getCulturalRecommendations(industry: string): string[] {
        const recommendations: Record<string, string[]> = {
            beauty: [
                'Acknowledge diverse hair types and textures',
                'Respect traditional African beauty practices',
                'Offer services for various cultural celebrations',
                'Consider Ubuntu philosophy in customer service',
                'Provide pricing options for different economic groups'
            ],
            healthcare: [
                'Integrate traditional and modern healing approaches',
                'Respect for traditional healers and medicine',
                'Multilingual medical terminology support',
                'Cultural sensitivity in treatment approaches',
                'Community-based healthcare considerations'
            ],
            fitness: [
                'Include traditional African exercises and movements',
                'Respect for different body types and cultural norms',
                'Community-based fitness approaches',
                'Outdoor and nature-based activities',
                'Group fitness that celebrates diversity'
            ],
            professional: [
                'Ubuntu-based relationship building',
                'Respect for hierarchical business relationships',
                'Understanding of extended family business dynamics',
                'Flexible meeting scheduling for family obligations',
                'Cultural节日 considerations in business planning'
            ]
        };

        return recommendations[industry] || recommendations.professional;
    }

    /**
     * Generate South African market positioning content
     */
    generateMarketPositioningContent(tenantId: string, industry: string): any {
        return {
            valueProposition: {
                primary: 'South Africa\'s Most Trusted Appointment Booking Platform',
                secondary: 'Built for South African Businesses, Celebrating Our Diversity',
                cultural: 'Honoring Ubuntu - "I am because we are"'
            },
            uniqueSellingPoints: [
                'POPIA Compliant - Your Data Stays in South Africa',
                'Multilingual Support (English, Afrikaans, Zulu, Xhosa)',
                'Local Payment Methods (EFT, Mobile Payments, Cash)',
                'Cultural Sensitivity and Ubuntu Philosophy',
                'South African Public Holiday Awareness',
                'Local Business Hour Optimization',
                'Mobile-First for South African Connectivity',
                'Affordable Pricing for Local Businesses'
            ],
            competitiveAdvantages: [
                'Only platform built specifically for SA market',
                'Deep cultural understanding and adaptation',
                'Local payment method integration',
                'South African privacy law compliance',
                'Multilingual AI-powered customer support',
                'Local business directory integration',
                'Ubuntu-inspired customer service philosophy'
            ],
            testimonials: {
                localBusiness: 'Finally, a platform that understands our South African business needs!',
                culturalAdaptation: 'The multilingual support and cultural sensitivity make all the difference.',
                compliance: 'POPIA compliance gives our customers confidence in their data security.'
            },
            marketSpecificFeatures: {
                payment: 'Accept all South African payment methods',
                language: 'Communicate in your customers\' preferred language',
                culture: 'Built with Ubuntu philosophy and cultural respect',
                compliance: 'Fully POPIA compliant for peace of mind'
            }
        };
    }

    /**
     * Calculate market penetration strategy for South Africa
     */
    calculateMarketPenetrationStrategy(): any {
        return {
            targetMarkets: {
                primary: 'Gauteng (Johannesburg, Pretoria)',
                secondary: 'Western Cape (Cape Town)',
                tertiary: 'KwaZulu-Natal (Durban)',
                emerging: 'Eastern Cape, Free State'
            },
            industryPriorities: [
                'Beauty & Wellness (highest adoption)',
                'Healthcare (growing demand)',
                'Fitness & Recreation (expanding)',
                'Professional Services (steady growth)'
            ],
            localizationStrategy: {
                language: 'Start with English, expand to Afrikaans, Zulu, Xhosa',
                payments: 'Integrate all major SA payment methods',
                culture: 'Embed Ubuntu philosophy throughout platform',
                compliance: 'Lead with POPIA compliance as trust differentiator'
            },
            competitivePositioning: {
                againstGlobal: 'Local expertise + cultural understanding',
                againstLocal: 'Advanced AI + enterprise features',
                uniqueValue: 'Only platform built specifically for SA market'
            }
        };
    }

    /**
     * Generate South African business directory integrations
     */
    async generateDirectoryIntegrations(tenantId: string): Promise<any> {
        return {
            googleMyBusiness: {
                enabled: true,
                syncAppointments: true,
                customerReviews: true,
                businessInfo: true
            },
            facebookBusiness: {
                enabled: true,
                appointmentBooking: true,
                customerMessaging: true,
                eventPromotion: true
            },
            localDirectories: {
                sapages: true,
                cylex: true,
                hotfrog: true,
                southAfricanBusiness: true
            },
            industrySpecific: {
                beauty: ['salonfinder.co.za', 'spa-guide.co.za'],
                healthcare: ['healthcare.co.za', 'medical-directory.co.za'],
                fitness: ['fitness-centers.co.za', 'gym-directory.co.za']
            }
        };
    }
}

export default LocalMarketPositioningManager;
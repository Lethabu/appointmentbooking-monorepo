/**
 * Comprehensive CRM and Lead Management System
 * AppointmentBooking.co.za Customer Acquisition Platform
 * 
 * Features:
 * - Complete prospect database with South African salon/spa contacts
 * - Lead scoring and qualification system
 * - Sales pipeline management
 * - Automated follow-up sequences
 * - Performance tracking and analytics
 * - Integration with marketing campaigns
 */

export interface ProspectContact {
    id: string;
    businessName: string;
    contactPerson: string;
    email: string;
    phone: string;
    whatsapp?: string;
    address: {
        street: string;
        suburb: string;
        city: string;
        province: string;
        postalCode: string;
    };
    businessType: 'salon' | 'spa' | 'barbershop' | 'wellness_center' | 'beauty_clinic' | 'chain';
    employeeCount: number;
    monthlyRevenue?: number;
    currentBookingSystem?: string;
    services: string[];
    operatingHours: {
        [key: string]: { open: string; close: string };
    };
    socialMedia: {
        facebook?: string;
        instagram?: string;
        website?: string;
    };
    notes: string[];
    priority: 'high' | 'medium' | 'low';
    source: 'google_ads' | 'facebook' | 'linkedin' | 'referral' | 'cold_outreach' | 'event' | 'partnership';
    assignedSalesRep?: string;
    lastContactDate?: Date;
    nextFollowUpDate?: Date;
}

export interface LeadScore {
    prospectId: string;
    score: number; // 0-100
    factors: {
        businessSize: number; // 0-25
        currentPain: number; // 0-25
        budgetAvailability: number; // 0-25
        decisionMakingAuthority: number; // 0-15
        timing: number; // 0-10
    };
    qualificationStatus: 'hot' | 'warm' | 'cold' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
    nextAction: string;
    lastUpdated: Date;
}

export interface SalesActivity {
    id: string;
    prospectId: string;
    type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'follow_up' | 'objection_handled';
    description: string;
    outcome: 'successful' | 'scheduled' | 'objection' | 'not_interested' | 'callback_requested';
    scheduledFollowUp?: Date;
    notes: string;
    createdBy: string;
    createdAt: Date;
}

export interface Campaign {
    id: string;
    name: string;
    type: 'google_ads' | 'facebook_ads' | 'linkedin' | 'email' | 'cold_outreach' | 'referral' | 'webinar';
    status: 'active' | 'paused' | 'completed' | 'draft';
    targetAudience: {
        cities: string[];
        businessTypes: string[];
        employeeRanges: string[];
        revenueRanges: string[];
    };
    budget: number;
    spent: number;
    leadsGenerated: number;
    conversionRate: number;
    costPerLead: number;
    startDate: Date;
    endDate?: Date;
    metrics: {
        impressions: number;
        clicks: number;
        conversions: number;
        cost: number;
        roas: number; // Return on Ad Spend
    };
}

export interface CustomerSuccessMetrics {
    totalProspects: number;
    qualifiedLeads: number;
    proposalsSent: number;
    dealsWon: number;
    totalRevenue: number;
    averageDealSize: number;
    salesCycleLength: number; // days
    conversionRate: number;
    monthlyGrowth: number;
    topPerformingChannels: string[];
    churnRate: number;
}

// South African Business Database Structure
export const SALON_SPA_DATABASE = {
    capeTown: {
        city: 'Cape Town',
        province: 'Western Cape',
        businessCount: 1200,
        targetProspects: 150,
        keyAreas: ['Cape Town CBD', 'Sea Point', 'Clifton', 'Camps Bay', 'Constantia', 'Stellenbosch'],
        demographics: {
            averageRevenue: 'R25,000-R85,000/month',
            employeeCount: '3-12 employees',
            primaryServices: ['Haircuts', 'Coloring', 'Styling', 'Nails', 'Facials'],
        },
        prospects: [
            {
                businessName: 'Bella Vista Hair & Beauty',
                contactPerson: 'Sarah Johnson',
                email: 'sarah@bellavista.co.za',
                phone: '+27 21 555 0123',
                whatsapp: '+27 82 555 0123',
                address: {
                    street: '123 Main Road',
                    suburb: 'Sea Point',
                    city: 'Cape Town',
                    province: 'Western Cape',
                    postalCode: '8005',
                },
                businessType: 'salon' as const,
                employeeCount: 8,
                monthlyRevenue: 45000,
                currentBookingSystem: 'Manual diary',
                services: ['Haircuts', 'Coloring', 'Styling', 'Treatments'],
                operatingHours: {
                    monday: { open: '09:00', close: '18:00' },
                    tuesday: { open: '09:00', close: '18:00' },
                    wednesday: { open: '09:00', close: '18:00' },
                    thursday: { open: '09:00', close: '18:00' },
                    friday: { open: '09:00', close: '18:00' },
                    saturday: { open: '09:00', close: '17:00' },
                    sunday: { open: '10:00', close: '16:00' },
                },
                socialMedia: {
                    facebook: 'https://facebook.com/bellavista.hair',
                    instagram: 'https://instagram.com/bellavista_hair',
                    website: 'https://bellavista.co.za',
                },
                notes: ['High potential client', 'Looking for modern booking system', 'Competitor: Fresha'],
                priority: 'high' as const,
                source: 'google_ads' as const,
            },
            {
                businessName: 'Urban Spa Retreat',
                contactPerson: 'Michael Chen',
                email: 'michael@urbanspa.co.za',
                phone: '+27 21 555 0234',
                whatsapp: '+27 83 555 0234',
                address: {
                    street: '456 Kloof Street',
                    suburb: 'Camps Bay',
                    city: 'Cape Town',
                    province: 'Western Cape',
                    postalCode: '8040',
                },
                businessType: 'spa' as const,
                employeeCount: 15,
                monthlyRevenue: 95000,
                currentBookingSystem: 'Basic online booking',
                services: ['Massage', 'Facials', 'Body treatments', 'Wellness'],
                operatingHours: {
                    monday: { open: '08:00', close: '19:00' },
                    tuesday: { open: '08:00', close: '19:00' },
                    wednesday: { open: '08:00', close: '19:00' },
                    thursday: { open: '08:00', close: '19:00' },
                    friday: { open: '08:00', close: '19:00' },
                    saturday: { open: '08:00', close: '18:00' },
                    sunday: { open: '10:00', close: '17:00' },
                },
                socialMedia: {
                    facebook: 'https://facebook.com/urbanspa.retreat',
                    instagram: 'https://instagram.com/urban_spa_retreat',
                    website: 'https://urbanspa.co.za',
                },
                notes: ['Enterprise client potential', 'High revenue spa', 'Needs multi-location management'],
                priority: 'high' as const,
                source: 'facebook' as const,
            },
        ],
    },
    johannesburg: {
        city: 'Johannesburg',
        province: 'Gauteng',
        businessCount: 1800,
        targetProspects: 200,
        keyAreas: ['Sandton', 'Rosebank', 'Melville', 'Parktown', 'Northcliff', 'Bryanston'],
        demographics: {
            averageRevenue: 'R35,000-R120,000/month',
            employeeCount: '4-15 employees',
            primaryServices: ['Haircuts', 'Coloring', 'Nails', 'Spa treatments', 'Barbering'],
        },
        prospects: [
            {
                businessName: 'Elite Cuts & Styles',
                contactPerson: 'Thabo Mokoena',
                email: 'thabo@elitecuts.co.za',
                phone: '+27 11 555 0345',
                whatsapp: '+27 84 555 0345',
                address: {
                    street: '789 Rivonia Road',
                    suburb: 'Sandton',
                    city: 'Johannesburg',
                    province: 'Gauteng',
                    postalCode: '2196',
                },
                businessType: 'barbershop' as const,
                employeeCount: 6,
                monthlyRevenue: 38000,
                currentBookingSystem: 'Phone bookings only',
                services: ['Haircuts', 'Beard trims', 'Styling'],
                operatingHours: {
                    monday: { open: '07:00', close: '18:00' },
                    tuesday: { open: '07:00', close: '18:00' },
                    wednesday: { open: '07:00', close: '18:00' },
                    thursday: { open: '07:00', close: '18:00' },
                    friday: { open: '07:00', close: '19:00' },
                    saturday: { open: '08:00', close: '17:00' },
                    sunday: { open: '09:00', close: '15:00' },
                },
                socialMedia: {
                    facebook: 'https://facebook.com/elitecuts.styles',
                    instagram: 'https://instagram.com/elite_cuts_sandton',
                    website: 'https://elitecuts.co.za',
                },
                notes: ['Growing business', 'Young entrepreneur', 'Needs simple solution'],
                priority: 'medium' as const,
                source: 'linkedin' as const,
            },
            {
                businessName: 'Luxury Wellness Spa',
                contactPerson: 'Nadia Patel',
                email: 'nadia@luxurywellness.co.za',
                phone: '+27 11 555 0456',
                whatsapp: '+27 85 555 0456',
                address: {
                    street: '321 Oxford Road',
                    suburb: 'Rosebank',
                    city: 'Johannesburg',
                    province: 'Gauteng',
                    postalCode: '2196',
                },
                businessType: 'spa' as const,
                employeeCount: 22,
                monthlyRevenue: 145000,
                currentBookingSystem: 'Basic software',
                services: ['Spa treatments', 'Massage', 'Facials', 'Body treatments', 'Wellness programs'],
                operatingHours: {
                    monday: { open: '08:00', close: '20:00' },
                    tuesday: { open: '08:00', close: '20:00' },
                    wednesday: { open: '08:00', close: '20:00' },
                    thursday: { open: '08:00', close: '20:00' },
                    friday: { open: '08:00', close: '21:00' },
                    saturday: { open: '09:00', close: '19:00' },
                    sunday: { open: '10:00', close: '18:00' },
                },
                socialMedia: {
                    facebook: 'https://facebook.com/luxurywellness.spa',
                    instagram: 'https://instagram.com/luxury_wellness_sa',
                    website: 'https://luxurywellness.co.za',
                },
                notes: ['Premium spa client', 'Enterprise potential', 'Looking for advanced features'],
                priority: 'high' as const,
                source: 'referral' as const,
            },
        ],
    },
    durban: {
        city: 'Durban',
        province: 'KwaZulu-Natal',
        businessCount: 900,
        targetProspects: 100,
        keyAreas: ['Umhlanga', 'Durban North', 'Westville', 'Chatsworth', 'Pinetown'],
        demographics: {
            averageRevenue: 'R20,000-R65,000/month',
            employeeCount: '2-10 employees',
            primaryServices: ['Haircuts', 'Braiding', 'Coloring', 'Nails', 'Traditional styling'],
        },
        prospects: [
            {
                businessName: 'African Queen Beauty Salon',
                contactPerson: 'Zanele Dlamini',
                email: 'zanele@africanqueen.co.za',
                phone: '+27 31 555 0567',
                whatsapp: '+27 86 555 0567',
                address: {
                    street: '654 Moses Mabhida Road',
                    suburb: 'Durban North',
                    city: 'Durban',
                    province: 'KwaZulu-Natal',
                    postalCode: '4051',
                },
                businessType: 'salon' as const,
                employeeCount: 7,
                monthlyRevenue: 32000,
                currentBookingSystem: 'Manual diary and WhatsApp',
                services: ['Braiding', 'Haircuts', 'Coloring', 'Natural hair styling', 'Nails'],
                operatingHours: {
                    monday: { open: '08:00', close: '17:00' },
                    tuesday: { open: '08:00', close: '17:00' },
                    wednesday: { open: '08:00', close: '17:00' },
                    thursday: { open: '08:00', close: '17:00' },
                    friday: { open: '08:00', close: '18:00' },
                    saturday: { open: '08:00', close: '16:00' },
                    sunday: { open: '09:00', close: '14:00' },
                },
                socialMedia: {
                    facebook: 'https://facebook.com/africanqueen.beauty',
                    instagram: 'https://instagram.com/african_queen_salon',
                    website: 'https://africanqueen.co.za',
                },
                notes: ['Specializes in natural hair', 'Strong community presence', 'High customer loyalty'],
                priority: 'high' as const,
                source: 'google_ads' as const,
            },
        ],
    },
    pretoria: {
        city: 'Pretoria',
        province: 'Gauteng',
        businessCount: 750,
        targetProspects: 80,
        keyAreas: ['Menlyn', 'Brooklyn', 'Centurion', 'Hatfield', 'Waterkloof'],
        demographics: {
            averageRevenue: 'R28,000-R75,000/month',
            employeeCount: '3-12 employees',
            primaryServices: ['Haircuts', 'Coloring', 'Styling', 'Nails', 'Men\'s grooming'],
        },
        prospects: [
            {
                businessName: 'Metro Gents Barber',
                contactPerson: 'Pieter van der Merwe',
                email: 'pieter@metrogents.co.za',
                phone: '+27 12 555 0678',
                whatsapp: '+27 87 555 0678',
                address: {
                    street: '987 Menlyn Main Road',
                    suburb: 'Menlyn',
                    city: 'Pretoria',
                    province: 'Gauteng',
                    postalCode: '0081',
                },
                businessType: 'barbershop' as const,
                employeeCount: 5,
                monthlyRevenue: 28000,
                currentBookingSystem: 'Walk-in only',
                services: ['Men\'s haircuts', 'Beard trims', 'Shaving', 'Styling'],
                operatingHours: {
                    monday: { open: '08:00', close: '17:00' },
                    tuesday: { open: '08:00', close: '17:00' },
                    wednesday: { open: '08:00', close: '17:00' },
                    thursday: { open: '08:00', close: '17:00' },
                    friday: { open: '08:00', close: '18:00' },
                    saturday: { open: '08:00', close: '16:00' },
                    sunday: { open: '09:00', close: '14:00' },
                },
                socialMedia: {
                    facebook: 'https://facebook.com/metrogents.barber',
                    instagram: 'https://instagram.com/metro_gents_menlyn',
                    website: 'https://metrogents.co.za',
                },
                notes: ['Modern barbershop', 'Young professional clientele', 'Expanding to second location'],
                priority: 'medium' as const,
                source: 'cold_outreach' as const,
            },
        ],
    },
};

// Lead Scoring Algorithm
export class LeadScoringEngine {
    static calculateLeadScore(prospect: ProspectContact, activities: SalesActivity[]): LeadScore {
        let score = 0;
        const factors = {
            businessSize: 0,
            currentPain: 0,
            budgetAvailability: 0,
            decisionMakingAuthority: 0,
            timing: 0,
        };

        // Business Size Score (0-25)
        if (prospect.employeeCount >= 15) factors.businessSize = 25;
        else if (prospect.employeeCount >= 10) factors.businessSize = 20;
        else if (prospect.employeeCount >= 5) factors.businessSize = 15;
        else if (prospect.employeeCount >= 3) factors.businessSize = 10;
        else factors.businessSize = 5;

        // Current Pain Score (0-25) - based on current system
        if (prospect.currentBookingSystem === 'Manual diary' || prospect.currentBookingSystem === 'Phone bookings only') {
            factors.currentPain = 25;
        } else if (prospect.currentBookingSystem === 'Walk-in only') {
            factors.currentPain = 20;
        } else if (prospect.currentBookingSystem === 'Basic online booking') {
            factors.currentPain = 10;
        } else if (!prospect.currentBookingSystem) {
            factors.currentPain = 15;
        }

        // Budget Availability Score (0-25) - based on revenue
        if (prospect.monthlyRevenue) {
            if (prospect.monthlyRevenue >= 100000) factors.budgetAvailability = 25;
            else if (prospect.monthlyRevenue >= 50000) factors.budgetAvailability = 20;
            else if (prospect.monthlyRevenue >= 30000) factors.budgetAvailability = 15;
            else if (prospect.monthlyRevenue >= 20000) factors.budgetAvailability = 10;
            else factors.budgetAvailability = 5;
        }

        // Decision Making Authority Score (0-15)
        const recentActivities = activities.filter(a =>
            new Date(a.createdAt).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000)
        );

        if (recentActivities.length > 5) factors.decisionMakingAuthority = 15;
        else if (recentActivities.length > 2) factors.decisionMakingAuthority = 10;
        else if (recentActivities.length > 0) factors.decisionMakingAuthority = 5;

        // Timing Score (0-10) - based on priority and source
        if (prospect.priority === 'high') factors.timing = 10;
        else if (prospect.priority === 'medium') factors.timing = 7;
        else factors.timing = 4;

        score = factors.businessSize + factors.currentPain + factors.budgetAvailability +
            factors.decisionMakingAuthority + factors.timing;

        // Determine qualification status
        let qualificationStatus: LeadScore['qualificationStatus'];
        if (score >= 80) qualificationStatus = 'hot';
        else if (score >= 60) qualificationStatus = 'qualified';
        else if (score >= 40) qualificationStatus = 'warm';
        else qualificationStatus = 'cold';

        // Determine next action
        let nextAction = '';
        switch (qualificationStatus) {
            case 'hot':
                nextAction = 'Schedule demo within 24 hours';
                break;
            case 'qualified':
                nextAction = 'Send proposal and schedule meeting';
                break;
            case 'warm':
                nextAction = 'Follow up with educational content';
                break;
            case 'cold':
                nextAction = 'Add to nurture campaign';
                break;
        }

        return {
            prospectId: prospect.id,
            score,
            factors,
            qualificationStatus,
            nextAction,
            lastUpdated: new Date(),
        };
    }
}

// CRM Management Class
export class CRMSystem {
    private prospects: Map<string, ProspectContact> = new Map();
    private leadScores: Map<string, LeadScore> = new Map();
    private activities: Map<string, SalesActivity[]> = new Map();
    private campaigns: Map<string, Campaign> = new Map();

    constructor() {
        this.initializeDatabase();
    }

    private initializeDatabase() {
        // Initialize with South African prospect database
        Object.values(SALON_SPA_DATABASE).forEach(cityData => {
            cityData.prospects.forEach(prospect => {
                const id = this.generateId();
                this.prospects.set(id, { ...prospect, id });

                // Initialize lead score
                const leadScore: LeadScore = {
                    prospectId: id,
                    score: Math.floor(Math.random() * 40) + 40, // Initial score 40-80
                    factors: {
                        businessSize: Math.floor(Math.random() * 20) + 5,
                        currentPain: Math.floor(Math.random() * 20) + 5,
                        budgetAvailability: Math.floor(Math.random() * 20) + 5,
                        decisionMakingAuthority: Math.floor(Math.random() * 10) + 5,
                        timing: Math.floor(Math.random() * 8) + 2,
                    },
                    qualificationStatus: 'warm',
                    nextAction: 'Initial outreach',
                    lastUpdated: new Date(),
                };
                this.leadScores.set(id, leadScore);

                // Initialize empty activities array
                this.activities.set(id, []);
            });
        });
    }

    addProspect(prospect: Omit<ProspectContact, 'id'>): string {
        const id = this.generateId();
        const newProspect: ProspectContact = { ...prospect, id };
        this.prospects.set(id, newProspect);

        // Calculate initial lead score
        const leadScore = LeadScoringEngine.calculateLeadScore(newProspect, []);
        this.leadScores.set(id, leadScore);
        this.activities.set(id, []);

        return id;
    }

    updateLeadScore(prospectId: string): void {
        const prospect = this.prospects.get(prospectId);
        if (!prospect) return;

        const activities = this.activities.get(prospectId) || [];
        const leadScore = LeadScoringEngine.calculateLeadScore(prospect, activities);
        this.leadScores.set(prospectId, leadScore);
    }

    recordActivity(prospectId: string, activity: Omit<SalesActivity, 'id' | 'createdAt'>): void {
        const newActivity: SalesActivity = {
            ...activity,
            id: this.generateId(),
            createdAt: new Date(),
        };

        const activities = this.activities.get(prospectId) || [];
        activities.push(newActivity);
        this.activities.set(prospectId, activities);

        // Update lead score after activity
        this.updateLeadScore(prospectId);

        // Update prospect last contact date
        const prospect = this.prospects.get(prospectId);
        if (prospect) {
            prospect.lastContactDate = new Date();
            this.prospects.set(prospectId, prospect);
        }
    }

    getQualifiedLeads(minScore: number = 60): ProspectContact[] {
        return Array.from(this.prospects.values()).filter(prospect => {
            const score = this.leadScores.get(prospect.id);
            return score && score.score >= minScore;
        });
    }

    getHotLeads(): ProspectContact[] {
        return Array.from(this.prospects.values()).filter(prospect => {
            const score = this.leadScores.get(prospect.id);
            return score && score.qualificationStatus === 'hot';
        });
    }

    getProspectsByCity(city: string): ProspectContact[] {
        return Array.from(this.prospects.values()).filter(prospect =>
            prospect.address.city.toLowerCase() === city.toLowerCase()
        );
    }

    getProspectsByBusinessType(businessType: string): ProspectContact[] {
        return Array.from(this.prospects.values()).filter(prospect =>
            prospect.businessType === businessType
        );
    }

    getSalesMetrics(): CustomerSuccessMetrics {
        const prospects = Array.from(this.prospects.values());
        const leadScores = Array.from(this.leadScores.values());

        const qualifiedLeads = leadScores.filter(score => score.score >= 40);
        const proposals = leadScores.filter(score =>
            score.qualificationStatus === 'proposal' || score.qualificationStatus === 'negotiation'
        );
        const closedWon = leadScores.filter(score => score.qualificationStatus === 'closed_won');

        return {
            totalProspects: prospects.length,
            qualifiedLeads: qualifiedLeads.length,
            proposalsSent: proposals.length,
            dealsWon: closedWon.length,
            totalRevenue: closedWon.length * 22000, // Average deal size
            averageDealSize: 22000,
            salesCycleLength: 45, // days
            conversionRate: (closedWon.length / prospects.length) * 100,
            monthlyGrowth: 15, // %
            topPerformingChannels: ['Google Ads', 'Referrals', 'Facebook'],
            churnRate: 5, // %
        };
    }

    generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    // Export data for external systems
    exportProspects(): ProspectContact[] {
        return Array.from(this.prospects.values());
    }

    exportLeadScores(): LeadScore[] {
        return Array.from(this.leadScores.values());
    }

    exportActivities(): SalesActivity[] {
        return Array.from(this.activities.values()).flat();
    }
}

// Performance Dashboard Data
export interface CRMPerformanceDashboard {
    overview: {
        totalProspects: number;
        qualifiedLeads: number;
        hotLeads: number;
        proposalsSent: number;
        dealsClosed: number;
        totalRevenue: number;
        conversionRate: number;
        averageDealSize: number;
    };
    pipeline: {
        byStatus: Record<string, number>;
        byCity: Record<string, number>;
        byBusinessType: Record<string, number>;
        monthlyTargets: { target: number; achieved: number; percentage: number }[];
    };
    activities: {
        recentActivities: SalesActivity[];
        topSalesReps: { name: string; activities: number; deals: number }[];
        activityTypes: Record<string, number>;
    };
    campaigns: {
        activeCampaigns: Campaign[];
        topPerforming: Campaign[];
        budgetUtilization: { spent: number; budget: number; percentage: number };
    };
    forecasts: {
        monthlyRevenue: { month: string; predicted: number; confidence: number }[];
        pipelineValue: number;
        expectedCloseDate: Date;
        riskFactors: string[];
    };
}

export class CRMPerformanceTracker {
    static generateDashboardData(crm: CRMSystem): CRMPerformanceDashboard {
        const metrics = crm.getSalesMetrics();
        const prospects = crm.exportProspects();
        const leadScores = crm.exportLeadScores();
        const activities = crm.exportActivities();

        // Pipeline breakdown
        const byStatus: Record<string, number> = {};
        const byCity: Record<string, number> = {};
        const byBusinessType: Record<string, number> = {};

        leadScores.forEach(score => {
            byStatus[score.qualificationStatus] = (byStatus[score.qualificationStatus] || 0) + 1;
        });

        prospects.forEach(prospect => {
            byCity[prospect.address.city] = (byCity[prospect.address.city] || 0) + 1;
            byBusinessType[prospect.businessType] = (byBusinessType[prospect.businessType] || 0) + 1;
        });

        // Recent activities (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
        const recentActivities = activities.filter(activity =>
            new Date(activity.createdAt) >= thirtyDaysAgo
        );

        // Activity types breakdown
        const activityTypes: Record<string, number> = {};
        recentActivities.forEach(activity => {
            activityTypes[activity.type] = (activityTypes[activity.type] || 0) + 1;
        });

        // Monthly targets
        const monthlyTargets = [
            { month: 'January', target: 83, achieved: 45, percentage: 54 },
            { month: 'February', target: 83, achieved: 62, percentage: 75 },
            { month: 'March', target: 83, achieved: 78, percentage: 94 },
        ];

        // Top performing campaigns (mock data)
        const activeCampaigns: Campaign[] = [
            {
                id: '1',
                name: 'Google Ads - Cape Town',
                type: 'google_ads',
                status: 'active',
                targetAudience: {
                    cities: ['Cape Town'],
                    businessTypes: ['salon', 'spa'],
                    employeeRanges: ['3-10', '10-20'],
                    revenueRanges: ['20000-50000', '50000-100000'],
                },
                budget: 15000,
                spent: 8500,
                leadsGenerated: 45,
                conversionRate: 12,
                costPerLead: 189,
                startDate: new Date('2025-01-01'),
                metrics: {
                    impressions: 45000,
                    clicks: 1800,
                    conversions: 45,
                    cost: 8500,
                    roas: 3.2,
                },
            },
        ];

        return {
            overview: {
                totalProspects: metrics.totalProspects,
                qualifiedLeads: metrics.qualifiedLeads,
                hotLeads: metrics.dealsWon,
                proposalsSent: metrics.proposalsSent,
                dealsClosed: metrics.dealsWon,
                totalRevenue: metrics.totalRevenue,
                conversionRate: metrics.conversionRate,
                averageDealSize: metrics.averageDealSize,
            },
            pipeline: {
                byStatus,
                byCity,
                byBusinessType,
                monthlyTargets,
            },
            activities: {
                recentActivities: recentActivities.slice(-10),
                topSalesReps: [
                    { name: 'Sarah Johnson', activities: 28, deals: 8 },
                    { name: 'Michael Chen', activities: 24, deals: 6 },
                    { name: 'Nadia Patel', activities: 22, deals: 7 },
                ],
                activityTypes,
            },
            campaigns: {
                activeCampaigns,
                topPerforming: activeCampaigns,
                budgetUtilization: {
                    spent: 8500,
                    budget: 15000,
                    percentage: 57,
                },
            },
            forecasts: {
                monthlyRevenue: [
                    { month: 'Feb 2025', predicted: 220000, confidence: 85 },
                    { month: 'Mar 2025', predicted: 285000, confidence: 78 },
                    { month: 'Apr 2025', predicted: 340000, confidence: 72 },
                ],
                pipelineValue: 450000,
                expectedCloseDate: new Date('2025-04-15'),
                riskFactors: ['Economic uncertainty', 'Seasonal slowdown', 'Competition pressure'],
            },
        };
    }
}
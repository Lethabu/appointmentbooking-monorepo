/**
 * Enterprise Sales & Account Management System
 * AppointmentBooking.co.za Enterprise Client Success Platform
 * 
 * Features:
 * - Enterprise sales process for large salon chains and spa groups
 * - Account management and customer success systems
 * - Custom onboarding and implementation services
 * - Quarterly business review processes
 * - Executive sponsorship programs
 * - Multi-location management and governance
 * - Enterprise reporting and analytics
 * - White-label and custom branding options
 */

export interface EnterpriseClient {
    clientId: string;
    companyName: string;
    businessType: 'salon_chain' | 'spa_group' | 'beauty_enterprise' | 'wellness_corporate';
    headquarters: Address;
    locations: BusinessLocation[];
    corporateStructure: CorporateStructure;
    keyContacts: KeyContact[];
    contractDetails: EnterpriseContract;
    implementation: ImplementationPlan;
    successMetrics: SuccessMetrics;
    accountManager: string;
    executiveSponsor?: string;
    status: 'prospect' | 'negotiation' | 'contracted' | 'implementing' | 'live' | 'expanding' | 'at_risk' | 'renewal';
    onboardingStartDate?: Date;
    goLiveDate?: Date;
    lastQBRDate?: Date;
    nextQBRDate?: Date;
}

export interface Address {
    street: string;
    suburb: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
}

export interface BusinessLocation {
    locationId: string;
    locationName: string;
    address: Address;
    manager: string;
    staffCount: number;
    monthlyRevenue: number;
    services: string[];
    status: 'active' | 'planned' | 'closed';
    implementationStatus: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
}

export interface CorporateStructure {
    parentCompany?: string;
    subsidiaries: string[];
    legalEntity: string;
    taxNumber: string;
    industryClassification: string;
    employeeCount: number;
    annualRevenue: number;
    creditRating: string;
    riskProfile: 'low' | 'medium' | 'high';
}

export interface KeyContact {
    contactId: string;
    firstName: string;
    lastName: string;
    title: string;
    department: string;
    email: string;
    phone: string;
    mobile?: string;
    whatsapp?: string;
    linkedIn?: string;
    role: 'decision_maker' | 'influencer' | 'user' | 'technical' | 'finance' | 'legal';
    influence: number; // 1-10 scale
    relationshipStrength: number; // 1-10 scale
    lastContactDate?: Date;
    preferredCommunication: 'email' | 'phone' | 'whatsapp' | 'teams' | 'slack';
}

export interface EnterpriseContract {
    contractId: string;
    startDate: Date;
    endDate: Date;
    term: number; // months
    autoRenewal: boolean;
    renewalNoticePeriod: number; // months
    value: number;
    currency: 'ZAR';
    billingFrequency: 'monthly' | 'quarterly' | 'annual';
    paymentTerms: string;
    pricing: EnterprisePricing;
    sla: ServiceLevelAgreement;
    customTerms: string[];
    attachments: ContractAttachment[];
}

export interface EnterprisePricing {
    basePrice: number;
    locationBasedPricing: LocationPricing[];
    volumeDiscounts: VolumeDiscount[];
    customFeatures: CustomFeaturePricing[];
    implementationFee: number;
    trainingFee: number;
    supportFee: number;
}

export interface LocationPricing {
    locationType: 'headquarters' | 'major_location' | 'standard_location' | 'small_location';
    pricePerLocation: number;
    minimumLocations: number;
    maximumLocations?: number;
}

export interface VolumeDiscount {
    threshold: number; // number of locations
    discountPercentage: number;
    description: string;
}

export interface CustomFeaturePricing {
    featureName: string;
    description: string;
    pricingModel: 'per_location' | 'flat_fee' | 'per_user' | 'usage_based';
    price: number;
    minimum?: number;
    maximum?: number;
}

export interface ServiceLevelAgreement {
    availability: number; // percentage
    responseTime: {
        critical: number; // hours
        high: number; // hours
        medium: number; // hours
        low: number; // hours
    };
    resolutionTime: {
        critical: number; // hours
        high: number; // hours
        medium: number; // hours
        low: number; // hours
    };
    supportHours: string;
    escalationProcess: EscalationLevel[];
    penalties: SLAPenalty[];
}

export interface EscalationLevel {
    level: number;
    role: string;
    timeframe: number; // hours
    contactMethod: string;
}

export interface SLAPenalty {
    breachType: string;
    penaltyType: 'credit' | 'discount' | 'refund';
    value: number;
    conditions: string[];
}

export interface ContractAttachment {
    attachmentId: string;
    filename: string;
    fileType: string;
    uploadDate: Date;
    category: 'contract' | 'proposal' | 'legal' | 'technical' | 'financial';
}

export interface ImplementationPlan {
    planId: string;
    phases: ImplementationPhase[];
    timeline: ImplementationTimeline;
    resources: ImplementationResource[];
    milestones: ImplementationMilestone[];
    risks: ImplementationRisk[];
    dependencies: ImplementationDependency[];
    successCriteria: string[];
}

export interface ImplementationPhase {
    phaseId: string;
    phaseName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: 'planned' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
    tasks: ImplementationTask[];
    deliverables: string[];
    completionCriteria: string[];
}

export interface ImplementationTask {
    taskId: string;
    taskName: string;
    description: string;
    assignee: string;
    startDate: Date;
    endDate: Date;
    status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
    priority: 'low' | 'medium' | 'high' | 'critical';
    dependencies: string[];
    estimatedHours: number;
    actualHours?: number;
}

export interface ImplementationTimeline {
    totalDuration: number; // weeks
    criticalPath: string[];
    bufferTime: number; // weeks
    keyDates: KeyDate[];
}

export interface KeyDate {
    date: Date;
    event: string;
    importance: 'critical' | 'important' | 'milestone';
}

export interface ImplementationResource {
    resourceId: string;
    resourceName: string;
    role: 'project_manager' | 'technical_lead' | 'consultant' | 'developer' | 'trainer' | 'support';
    allocation: number; // percentage
    availability: DateRange[];
    rate: number;
    currency: 'ZAR';
}

export interface DateRange {
    startDate: Date;
    endDate: Date;
    availability: 'full' | 'partial' | 'unavailable';
}

export interface ImplementationMilestone {
    milestoneId: string;
    milestoneName: string;
    description: string;
    targetDate: Date;
    actualDate?: Date;
    status: 'pending' | 'achieved' | 'missed' | 'at_risk';
    criteria: string[];
}

export interface ImplementationRisk {
    riskId: string;
    riskName: string;
    description: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigationStrategy: string;
    owner: string;
    status: 'identified' | 'monitoring' | 'mitigated' | 'realized';
}

export interface ImplementationDependency {
    dependencyId: string;
    description: string;
    type: 'technical' | 'resource' | 'approval' | 'external';
    dependentOn: string;
    impact: string;
    mitigation: string;
}

export interface SuccessMetrics {
    clientId: string;
    businessMetrics: BusinessMetrics;
    adoptionMetrics: AdoptionMetrics;
    satisfactionMetrics: SatisfactionMetrics;
    financialMetrics: FinancialMetrics;
    operationalMetrics: OperationalMetrics;
    lastUpdated: Date;
}

export interface BusinessMetrics {
    revenueGrowth: number; // percentage
    costSavings: number;
    timeSavings: number; // hours per month
    efficiencyImprovement: number; // percentage
    errorReduction: number; // percentage
    customerSatisfactionScore: number; // 1-10
    netPromoterScore: number; // -100 to 100
}

export interface AdoptionMetrics {
    userAdoptionRate: number; // percentage
    featureUtilization: FeatureUtilization[];
    trainingCompletion: number; // percentage
    supportTicketVolume: number;
    selfServiceAdoption: number; // percentage
}

export interface FeatureUtilization {
    featureName: string;
    usagePercentage: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    lastUsed: Date;
}

export interface SatisfactionMetrics {
    overallSatisfaction: number; // 1-10
    productSatisfaction: number; // 1-10
    supportSatisfaction: number; // 1-10
    implementationSatisfaction: number; // 1-10
    likelihoodToRecommend: number; // 1-10
    feedback: ClientFeedback[];
}

export interface ClientFeedback {
    feedbackId: string;
    date: Date;
    category: 'product' | 'support' | 'implementation' | 'billing' | 'general';
    rating: number; // 1-10
    comment: string;
    response?: string;
    status: 'open' | 'responded' | 'resolved' | 'closed';
}

export interface FinancialMetrics {
    contractValue: number;
    realizedValue: number; // actual value delivered
    roi: number; // percentage
    costAvoidance: number;
    revenueAttribution: number;
    expansionRevenue: number; // additional revenue from this client
}

export interface OperationalMetrics {
    systemUptime: number; // percentage
    averageResponseTime: number; // seconds
    supportResolutionTime: number; // hours
    dataAccuracy: number; // percentage
    processAutomation: number; // percentage
}

export interface AccountManager {
    managerId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    region: string;
    tier: 'junior' | 'senior' | 'principal' | 'director';
    specializations: string[];
    clients: string[]; // client IDs
    certifications: string[];
    performanceMetrics: AccountManagerMetrics;
}

export interface AccountManagerMetrics {
    totalClients: number;
    totalContractValue: number;
    averageClientSatisfaction: number;
    retentionRate: number; // percentage
    expansionRate: number; // percentage
    responseTime: number; // hours
    qbrCompletionRate: number; // percentage
}

export interface QuarterlyBusinessReview {
    qbrId: string;
    clientId: string;
    quarter: string; // e.g., "2025-Q1"
    scheduledDate: Date;
    actualDate?: Date;
    attendees: QBRAttendee[];
    agenda: QBRAgendaItem[];
    objectives: string[];
    keyMetrics: QBRMetrics;
    achievements: QBRAchievement[];
    challenges: QBRChallenge[];
    actionItems: QBRActionItem[];
    nextSteps: QBRNextStep[];
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    feedback: QBRFeedback;
}

export interface QBRAttendee {
    attendeeId: string;
    name: string;
    title: string;
    company: string;
    role: 'host' | 'participant' | 'observer';
    participation: 'active' | 'passive';
}

export interface QBRAgendaItem {
    itemId: string;
    topic: string;
    duration: number; // minutes
    presenter: string;
    objective: string;
    status: 'planned' | 'presented' | 'deferred';
}

export interface QBRMetrics {
    businessOutcomes: BusinessOutcome[];
    adoptionMetrics: AdoptionMetric[];
    satisfactionMetrics: SatisfactionMetric[];
    roiMetrics: ROIMetric[];
    usageMetrics: UsageMetric[];
}

export interface BusinessOutcome {
    metric: string;
    baseline: number;
    current: number;
    target: number;
    achievement: number; // percentage
    trend: 'improving' | 'stable' | 'declining';
}

export interface AdoptionMetric {
    metric: string;
    previousQuarter: number;
    currentQuarter: number;
    improvement: number; // percentage
    benchmark: number;
    status: 'exceeding' | 'meeting' | 'below';
}

export interface SatisfactionMetric {
    metric: string;
    score: number; // 1-10
    previousScore: number;
    change: number;
    industryBenchmark: number;
}

export interface ROIMetric {
    investment: number;
    returns: number;
    roi: number; // percentage
    paybackPeriod: number; // months
}

export interface UsageMetric {
    metric: string;
    usage: number;
    capacity: number;
    utilization: number; // percentage
    trend: 'increasing' | 'stable' | 'decreasing';
}

export interface QBRAchievement {
    achievementId: string;
    category: 'business' | 'technical' | 'operational' | 'strategic';
    description: string;
    impact: string;
    date: Date;
    recognition: string;
}

export interface QBRChallenge {
    challengeId: string;
    category: 'technical' | 'operational' | 'resource' | 'strategic';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'identified' | 'investigating' | 'resolving' | 'resolved';
    owner: string;
    resolution: string;
    targetDate?: Date;
}

export interface QBRActionItem {
    actionId: string;
    description: string;
    owner: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    dueDate: Date;
    completionDate?: Date;
    notes: string;
}

export interface QBRNextStep {
    stepId: string;
    description: string;
    owner: string;
    targetDate: Date;
    category: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
}

export interface QBRFeedback {
    overallRating: number; // 1-10
    contentRating: number; // 1-10
    presentationRating: number; // 1-10
    actionItemsRating: number; // 1-10
    improvements: string[];
    futureTopics: string[];
    additionalComments: string;
}

export interface ExecutiveSponsor {
    sponsorId: string;
    firstName: string;
    lastName: string;
    title: string;
    department: string;
    email: string;
    phone: string;
    linkedIn?: string;
    clientRelationships: ExecutiveRelationship[];
    involvement: SponsorInvolvement;
    performanceMetrics: SponsorMetrics;
}

export interface ExecutiveRelationship {
    clientId: string;
    relationshipType: 'strategic' | 'operational' | 'technical' | 'financial';
    strength: number; // 1-10
    lastInteraction: Date;
    influence: number; // 1-10
    objectives: string[];
}

export interface SponsorInvolvement {
    qbrParticipation: number; // percentage
    strategicPlanning: boolean;
    escalations: number;
    businessReviews: number;
    executiveBriefings: number;
}

export interface SponsorMetrics {
    totalClients: number;
    totalContractValue: number;
    relationshipStrength: number; // average 1-10
    clientSatisfaction: number; // average 1-10
    retentionRate: number; // percentage
    expansionRate: number; // percentage
}

// ENTERPRISE SALES & ACCOUNT MANAGEMENT SYSTEM
export class EnterpriseSalesAccountManagement {
    private clients: Map<string, EnterpriseClient> = new Map();
    private accountManagers: Map<string, AccountManager> = new Map();
    private executiveSponsors: Map<string, ExecutiveSponsor> = new Map();
    private qbrs: Map<string, QuarterlyBusinessReview> = new Map();

    constructor() {
        this.initializeDefaultData();
    }

    private initializeDefaultData() {
        // Initialize with sample enterprise clients
        const sampleClients: EnterpriseClient[] = [
            {
                clientId: 'enterprise-001',
                companyName: 'Bella Vida Spa Group',
                businessType: 'spa_group',
                headquarters: {
                    street: '123 Sandton Drive',
                    suburb: 'Sandhurst',
                    city: 'Johannesburg',
                    province: 'Gauteng',
                    postalCode: '2196',
                    country: 'South Africa'
                },
                locations: [
                    {
                        locationId: 'loc-001',
                        locationName: 'Bella Vida Sandhurst (HQ)',
                        address: {
                            street: '123 Sandton Drive',
                            suburb: 'Sandhurst',
                            city: 'Johannesburg',
                            province: 'Gauteng',
                            postalCode: '2196',
                            country: 'South Africa'
                        },
                        manager: 'Thandi Mokoena',
                        staffCount: 25,
                        monthlyRevenue: 180000,
                        services: ['Spa Treatments', 'Massage', 'Facials', 'Wellness Programs'],
                        status: 'active',
                        implementationStatus: 'completed'
                    },
                    {
                        locationId: 'loc-002',
                        locationName: 'Bella Vida Cape Town',
                        address: {
                            street: '456 V&A Waterfront',
                            suburb: 'Waterfront',
                            city: 'Cape Town',
                            province: 'Western Cape',
                            postalCode: '8002',
                            country: 'South Africa'
                        },
                        manager: 'Sarah Johnson',
                        staffCount: 18,
                        monthlyRevenue: 145000,
                        services: ['Spa Treatments', 'Massage', 'Beauty Services'],
                        status: 'active',
                        implementationStatus: 'completed'
                    }
                ],
                corporateStructure: {
                    parentCompany: undefined,
                    subsidiaries: ['Bella Vida Eastern Cape (Pty) Ltd'],
                    legalEntity: 'Bella Vida Spa Group (Pty) Ltd',
                    taxNumber: '9123456789',
                    industryClassification: 'Spa and Wellness Services',
                    employeeCount: 85,
                    annualRevenue: 2400000,
                    creditRating: 'AA',
                    riskProfile: 'low'
                },
                keyContacts: [
                    {
                        contactId: 'contact-001',
                        firstName: 'Michael',
                        lastName: 'van der Merwe',
                        title: 'CEO',
                        department: 'Executive',
                        email: 'michael@bellavida.co.za',
                        phone: '+27 11 555 0123',
                        mobile: '+27 82 555 0123',
                        role: 'decision_maker',
                        influence: 10,
                        relationshipStrength: 9,
                        preferredCommunication: 'email'
                    },
                    {
                        contactId: 'contact-002',
                        firstName: 'Priya',
                        lastName: 'Patel',
                        title: 'Operations Director',
                        department: 'Operations',
                        email: 'priya@bellavida.co.za',
                        phone: '+27 11 555 0234',
                        mobile: '+27 83 555 0234',
                        role: 'influencer',
                        influence: 8,
                        relationshipStrength: 8,
                        preferredCommunication: 'phone'
                    }
                ],
                contractDetails: {
                    contractId: 'contract-001',
                    startDate: new Date('2024-08-01'),
                    endDate: new Date('2027-07-31'),
                    term: 36,
                    autoRenewal: true,
                    renewalNoticePeriod: 6,
                    value: 450000,
                    currency: 'ZAR',
                    billingFrequency: 'monthly',
                    paymentTerms: 'Net 30 days',
                    pricing: {
                        basePrice: 12500,
                        locationBasedPricing: [
                            { locationType: 'headquarters', pricePerLocation: 15000, minimumLocations: 1, maximumLocations: 1 },
                            { locationType: 'major_location', pricePerLocation: 12000, minimumLocations: 2, maximumLocations: 10 },
                            { locationType: 'standard_location', pricePerLocation: 8000, minimumLocations: 0 }
                        ],
                        volumeDiscounts: [
                            { threshold: 5, discountPercentage: 10, description: '5+ locations' },
                            { threshold: 10, discountPercentage: 15, description: '10+ locations' }
                        ],
                        customFeatures: [
                            { featureName: 'White Label Portal', description: 'Custom branded customer portal', pricingModel: 'flat_fee', price: 25000 },
                            { featureName: 'Advanced Analytics', description: 'Custom reporting and analytics', pricingModel: 'per_location', price: 1500 }
                        ],
                        implementationFee: 75000,
                        trainingFee: 25000,
                        supportFee: 5000
                    },
                    sla: {
                        availability: 99.9,
                        responseTime: { critical: 1, high: 4, medium: 8, low: 24 },
                        resolutionTime: { critical: 4, high: 24, medium: 72, low: 168 },
                        supportHours: '24/7',
                        escalationProcess: [
                            { level: 1, role: 'Support Agent', timeframe: 1, contactMethod: 'phone' },
                            { level: 2, role: 'Senior Support', timeframe: 2, contactMethod: 'phone' },
                            { level: 3, role: 'Engineering Manager', timeframe: 4, contactMethod: 'phone' },
                            { level: 4, role: 'CTO', timeframe: 8, contactMethod: 'phone' }
                        ],
                        penalties: [
                            { breachType: 'Availability < 99.5%', penaltyType: 'credit', value: 10, conditions: ['Monthly availability report'] }
                        ]
                    },
                    customTerms: [
                        'Custom reporting dashboard for executive team',
                        'Dedicated account manager with backup',
                        'Quarterly strategic planning sessions',
                        'Priority feature requests consideration'
                    ],
                    attachments: []
                },
                implementation: {
                    planId: 'impl-001',
                    phases: [
                        {
                            phaseId: 'phase-001',
                            phaseName: 'Discovery and Planning',
                            description: 'Initial assessment and requirements gathering',
                            startDate: new Date('2024-06-01'),
                            endDate: new Date('2024-06-30'),
                            status: 'completed',
                            tasks: [],
                            deliverables: ['Requirements Document', 'Project Plan', 'Resource Allocation'],
                            completionCriteria: ['Requirements approved', 'Project plan signed off']
                        }
                    ],
                    timeline: {
                        totalDuration: 12,
                        criticalPath: ['discovery', 'technical_setup', 'data_migration', 'training', 'go_live'],
                        bufferTime: 2,
                        keyDates: [
                            { date: new Date('2024-07-15'), event: 'Technical Setup Complete', importance: 'critical' },
                            { date: new Date('2024-07-30'), event: 'Data Migration Complete', importance: 'critical' }
                        ]
                    },
                    resources: [],
                    milestones: [],
                    risks: [],
                    dependencies: [],
                    successCriteria: [
                        'All locations live within 90 days',
                        'Zero critical issues at go-live',
                        '100% staff training completion',
                        'System availability > 99.9%'
                    ]
                },
                successMetrics: {
                    clientId: 'enterprise-001',
                    businessMetrics: {
                        revenueGrowth: 23,
                        costSavings: 180000,
                        timeSavings: 240,
                        efficiencyImprovement: 35,
                        errorReduction: 78,
                        customerSatisfactionScore: 8.7,
                        netPromoterScore: 67
                    },
                    adoptionMetrics: {
                        userAdoptionRate: 94,
                        featureUtilization: [
                            { featureName: 'Online Booking', usagePercentage: 98, trend: 'stable', lastUsed: new Date() },
                            { featureName: 'Customer Management', usagePercentage: 92, trend: 'increasing', lastUsed: new Date() },
                            { featureName: 'Reporting', usagePercentage: 85, trend: 'increasing', lastUsed: new Date() }
                        ],
                        trainingCompletion: 100,
                        supportTicketVolume: 12,
                        selfServiceAdoption: 76
                    },
                    satisfactionMetrics: {
                        overallSatisfaction: 8.7,
                        productSatisfaction: 8.9,
                        supportSatisfaction: 8.5,
                        implementationSatisfaction: 9.2,
                        likelihoodToRecommend: 9.1,
                        feedback: []
                    },
                    financialMetrics: {
                        contractValue: 450000,
                        realizedValue: 520000,
                        roi: 115,
                        costAvoidance: 180000,
                        revenueAttribution: 85000,
                        expansionRevenue: 125000
                    },
                    operationalMetrics: {
                        systemUptime: 99.94,
                        averageResponseTime: 0.8,
                        supportResolutionTime: 3.2,
                        dataAccuracy: 99.8,
                        processAutomation: 87
                    },
                    lastUpdated: new Date()
                },
                accountManager: 'am-001',
                executiveSponsor: 'es-001',
                status: 'live',
                goLiveDate: new Date('2024-08-15'),
                lastQBRDate: new Date('2024-11-15'),
                nextQBRDate: new Date('2025-02-15')
            }
        ];

        sampleClients.forEach(client => {
            this.clients.set(client.clientId, client);
        });

        // Initialize account managers
        const sampleAccountManagers: AccountManager[] = [
            {
                managerId: 'am-001',
                firstName: 'Nadia',
                lastName: 'Johnson',
                email: 'nadia@appointmentbooking.co.za',
                phone: '+27 11 555 0789',
                region: 'Gauteng',
                tier: 'senior',
                specializations: ['Spa Groups', 'Multi-location', 'Enterprise'],
                clients: ['enterprise-001'],
                certifications: ['Enterprise Sales Professional', 'Customer Success Manager'],
                performanceMetrics: {
                    totalClients: 8,
                    totalContractValue: 2850000,
                    averageClientSatisfaction: 8.9,
                    retentionRate: 95,
                    expansionRate: 78,
                    responseTime: 2.1,
                    qbrCompletionRate: 100
                }
            }
        ];

        sampleAccountManagers.forEach(manager => {
            this.accountManagers.set(manager.managerId, manager);
        });

        // Initialize executive sponsors
        const sampleExecutiveSponsors: ExecutiveSponsor[] = [
            {
                sponsorId: 'es-001',
                firstName: 'David',
                lastName: 'Chen',
                title: 'VP of Enterprise Sales',
                department: 'Sales',
                email: 'david@appointmentbooking.co.za',
                phone: '+27 11 555 0901',
                linkedIn: 'https://linkedin.com/in/davidchen-enterprise',
                clientRelationships: [
                    {
                        clientId: 'enterprise-001',
                        relationshipType: 'strategic',
                        strength: 9,
                        lastInteraction: new Date('2024-11-20'),
                        influence: 9,
                        objectives: ['Strategic growth planning', 'Executive alignment', 'Expansion opportunities']
                    }
                ],
                involvement: {
                    qbrParticipation: 100,
                    strategicPlanning: true,
                    escalations: 1,
                    businessReviews: 4,
                    executiveBriefings: 2
                },
                performanceMetrics: {
                    totalClients: 12,
                    totalContractValue: 6200000,
                    relationshipStrength: 8.7,
                    clientSatisfaction: 9.2,
                    retentionRate: 98,
                    expansionRate: 85
                }
            }
        ];

        sampleExecutiveSponsors.forEach(sponsor => {
            this.executiveSponsors.set(sponsor.sponsorId, sponsor);
        });
    }

    // CLIENT MANAGEMENT
    createEnterpriseClient(client: EnterpriseClient): string {
        this.clients.set(client.clientId, client);
        return client.clientId;
    }

    getEnterpriseClient(clientId: string): EnterpriseClient | undefined {
        return this.clients.get(clientId);
    }

    getAllEnterpriseClients(): EnterpriseClient[] {
        return Array.from(this.clients.values());
    }

    updateClientStatus(clientId: string, status: EnterpriseClient['status']): boolean {
        const client = this.clients.get(clientId);
        if (!client) return false;

        client.status = status;
        this.clients.set(clientId, client);
        return true;
    }

    // ACCOUNT MANAGEMENT
    assignAccountManager(clientId: string, managerId: string): boolean {
        const client = this.clients.get(clientId);
        const manager = this.accountManagers.get(managerId);

        if (!client || !manager) return false;

        client.accountManager = managerId;
        manager.clients.push(clientId);

        this.clients.set(clientId, client);
        this.accountManagers.set(managerId, manager);

        return true;
    }

    assignExecutiveSponsor(clientId: string, sponsorId: string): boolean {
        const client = this.clients.get(clientId);
        const sponsor = this.executiveSponsors.get(sponsorId);

        if (!client || !sponsor) return false;

        client.executiveSponsor = sponsorId;
        sponsor.clientRelationships.push({
            clientId,
            relationshipType: 'strategic',
            strength: 5,
            lastInteraction: new Date(),
            influence: 5,
            objectives: []
        });

        this.clients.set(clientId, client);
        this.executiveSponsors.set(sponsorId, sponsor);

        return true;
    }

    getAccountManager(managerId: string): AccountManager | undefined {
        return this.accountManagers.get(managerId);
    }

    getAccountManagerClients(managerId: string): EnterpriseClient[] {
        const manager = this.accountManagers.get(managerId);
        if (!manager) return [];

        return manager.clients.map((clientId: string) => this.clients.get(clientId)).filter(Boolean) as EnterpriseClient[];
    }

    // QBR MANAGEMENT
    scheduleQBR(clientId: string, quarter: string, scheduledDate: Date): string {
        const qbrId = `qbr-${Date.now()}`;
        const client = this.clients.get(clientId);

        if (!client) throw new Error('Client not found');

        const qbr: QuarterlyBusinessReview = {
            qbrId,
            clientId,
            quarter,
            scheduledDate,
            attendees: [],
            agenda: [],
            objectives: [],
            keyMetrics: {
                businessOutcomes: [],
                adoptionMetrics: [],
                satisfactionMetrics: [],
                roiMetrics: [],
                usageMetrics: []
            },
            achievements: [],
            challenges: [],
            actionItems: [],
            nextSteps: [],
            status: 'scheduled',
            feedback: {
                overallRating: 0,
                contentRating: 0,
                presentationRating: 0,
                actionItemsRating: 0,
                improvements: [],
                futureTopics: [],
                additionalComments: ''
            }
        };

        this.qbrs.set(qbrId, qbr);
        client.nextQBRDate = scheduledDate;
        this.clients.set(clientId, client);

        return qbrId;
    }

    getQBR(qbrId: string): QuarterlyBusinessReview | undefined {
        return this.qbrs.get(qbrId);
    }

    getClientQBRs(clientId: string): QuarterlyBusinessReview[] {
        return Array.from(this.qbrs.values()).filter(qbr => qbr.clientId === clientId);
    }

    completeQBR(qbrId: string, results: Partial<QuarterlyBusinessReview>): boolean {
        const qbr = this.qbrs.get(qbrId);
        if (!qbr) return false;

        // Update QBR with results
        Object.assign(qbr, results);
        qbr.status = 'completed';
        qbr.actualDate = new Date();

        this.qbrs.set(qbrId, qbr);

        // Update client with completion
        const client = this.clients.get(qbr.clientId);
        if (client) {
            client.lastQBRDate = qbr.actualDate;
            this.clients.set(qbr.clientId, client);
        }

        return true;
    }

    // IMPLEMENTATION MANAGEMENT
    createImplementationPlan(clientId: string, plan: ImplementationPlan): string {
        const client = this.clients.get(clientId);
        if (!client) throw new Error('Client not found');

        client.implementation = plan;
        this.clients.set(clientId, client);

        return plan.planId;
    }

    updateImplementationPhase(clientId: string, phaseId: string, updates: Partial<ImplementationPhase>): boolean {
        const client = this.clients.get(clientId);
        if (!client) return false;

        const phase = client.implementation.phases.find(p => p.phaseId === phaseId);
        if (!phase) return false;

        Object.assign(phase, updates);
        this.clients.set(clientId, client);

        return true;
    }

    // SUCCESS METRICS
    updateSuccessMetrics(clientId: string, metrics: SuccessMetrics): boolean {
        const client = this.clients.get(clientId);
        if (!client) return false;

        client.successMetrics = metrics;
        this.clients.set(clientId, client);

        return true;
    }

    getClientSuccessMetrics(clientId: string): SuccessMetrics | undefined {
        const client = this.clients.get(clientId);
        return client?.successMetrics;
    }

    // ANALYTICS AND REPORTING
    generateEnterpriseDashboard(): EnterpriseDashboard {
        const clients = Array.from(this.clients.values());
        const accountManagers = Array.from(this.accountManagers.values());
        const executiveSponsors = Array.from(this.executiveSponsors.values());

        return {
            overview: {
                totalClients: clients.length,
                activeClients: clients.filter(c => c.status === 'live').length,
                totalContractValue: clients.reduce((sum, c) => sum + c.contractDetails.value, 0),
                averageContractValue: clients.length > 0 ? clients.reduce((sum, c) => sum + c.contractDetails.value, 0) / clients.length : 0,
                totalLocations: clients.reduce((sum, c) => sum + c.locations.length, 0),
                totalRevenue: clients.reduce((sum, c) => sum + c.locations.reduce((locSum, loc) => locSum + loc.monthlyRevenue, 0), 0) * 12
            },
            clientStatus: {
                prospect: clients.filter(c => c.status === 'prospect').length,
                negotiation: clients.filter(c => c.status === 'negotiation').length,
                contracted: clients.filter(c => c.status === 'contracted').length,
                implementing: clients.filter(c => c.status === 'implementing').length,
                live: clients.filter(c => c.status === 'live').length,
                expanding: clients.filter(c => c.status === 'expanding').length,
                atRisk: clients.filter(c => c.status === 'at_risk').length,
                renewal: clients.filter(c => c.status === 'renewal').length
            },
            accountManagerPerformance: accountManagers.map(manager => ({
                managerId: manager.managerId,
                name: `${manager.firstName} ${manager.lastName}`,
                totalClients: manager.performanceMetrics.totalClients,
                totalContractValue: manager.performanceMetrics.totalContractValue,
                clientSatisfaction: manager.performanceMetrics.averageClientSatisfaction,
                retentionRate: manager.performanceMetrics.retentionRate,
                expansionRate: manager.performanceMetrics.expansionRate
            })),
            executiveSponsorPerformance: executiveSponsors.map(sponsor => ({
                sponsorId: sponsor.sponsorId,
                name: `${sponsor.firstName} ${sponsor.lastName}`,
                totalClients: sponsor.performanceMetrics.totalClients,
                totalContractValue: sponsor.performanceMetrics.totalContractValue,
                relationshipStrength: sponsor.performanceMetrics.relationshipStrength,
                retentionRate: sponsor.performanceMetrics.retentionRate,
                expansionRate: sponsor.performanceMetrics.expansionRate
            })),
            implementationStatus: {
                notStarted: clients.filter(c => c.implementation.phases.length === 0).length,
                inProgress: clients.filter(c => c.implementation.phases.some(p => p.status === 'in_progress')).length,
                completed: clients.filter(c => c.implementation.phases.every(p => p.status === 'completed')).length,
                onHold: clients.filter(c => c.implementation.phases.some(p => p.status === 'on_hold')).length
            },
            qbrMetrics: {
                totalQBRs: this.qbrs.size,
                upcomingQBRs: Array.from(this.qbrs.values()).filter(qbr => qbr.status === 'scheduled').length,
                completedQBRs: Array.from(this.qbrs.values()).filter(qbr => qbr.status === 'completed').length,
                averageRating: this.calculateAverageQBRRating()
            },
            riskAnalysis: this.generateRiskAnalysis(clients)
        };
    }

    generateRiskAnalysis(clients: EnterpriseClient[]): RiskAnalysis {
        const atRiskClients = clients.filter(c => c.status === 'at_risk');
        const renewalClients = clients.filter(c => c.status === 'renewal');
        const implementationRisks = clients.filter(c => c.implementation.phases.some(p => p.status === 'on_hold'));

        return {
            totalAtRisk: atRiskClients.length,
            totalRenewalValue: renewalClients.reduce((sum, c) => sum + c.contractDetails.value, 0),
            implementationDelays: implementationRisks.length,
            keyRisks: [
                ...atRiskClients.map(client => ({
                    clientId: client.clientId,
                    clientName: client.companyName,
                    riskType: 'client_satisfaction',
                    severity: 'high' as const,
                    description: 'Client satisfaction metrics below threshold',
                    mitigation: 'Increase account management engagement and address specific concerns'
                })),
                ...renewalClients.map(client => ({
                    clientId: client.clientId,
                    clientName: client.companyName,
                    riskType: 'contract_renewal',
                    severity: 'medium' as const,
                    description: 'Contract renewal within 6 months',
                    mitigation: 'Schedule strategic planning session and demonstrate ROI'
                }))
            ],
            recommendations: [
                'Implement proactive outreach for at-risk clients',
                'Accelerate implementation timelines for delayed projects',
                'Increase QBR frequency for strategic clients',
                'Develop early renewal engagement strategy'
            ]
        };
    }

    private calculateAverageQBRRating(): number {
        const completedQBRs = Array.from(this.qbrs.values()).filter(qbr => qbr.status === 'completed');
        if (completedQBRs.length === 0) return 0;

        const totalRating = completedQBRs.reduce((sum, qbr) => sum + qbr.feedback.overallRating, 0);
        return totalRating / completedQBRs.length;
    }

    // GROWTH OPPORTUNITIES
    identifyExpansionOpportunities(): ExpansionOpportunity[] {
        const clients = Array.from(this.clients.values());
        const opportunities: ExpansionOpportunity[] = [];

        clients.forEach(client => {
            // Location expansion opportunities
            const locations = client.locations.filter(loc => loc.status === 'active');
            if (locations.length > 1) {
                opportunities.push({
                    opportunityId: `expansion-${client.clientId}`,
                    clientId: client.clientId,
                    type: 'location_expansion',
                    description: `Expand to ${Math.floor(locations.length * 0.5)} additional locations`,
                    potentialValue: locations.length * 8000 * 12, // Estimated annual value
                    probability: 75,
                    timeframe: '6-12 months',
                    nextActions: [
                        'Schedule strategic planning session',
                        'Present expansion business case',
                        'Develop implementation timeline'
                    ]
                });
            }

            // Feature upgrade opportunities
            const currentFeatures = client.contractDetails.pricing.customFeatures.length;
            if (currentFeatures < 3) {
                opportunities.push({
                    opportunityId: `features-${client.clientId}`,
                    clientId: client.clientId,
                    type: 'feature_upgrade',
                    description: 'Upgrade to premium features and advanced analytics',
                    potentialValue: 50000, // Estimated additional annual value
                    probability: 85,
                    timeframe: '3-6 months',
                    nextActions: [
                        'Demonstrate feature benefits',
                        'Provide ROI analysis',
                        'Schedule product demonstration'
                    ]
                });
            }

            // Service expansion opportunities
            if (client.businessType === 'salon_chain' && !client.locations.some(loc => loc.services.includes('spa'))) {
                opportunities.push({
                    opportunityId: `services-${client.clientId}`,
                    clientId: client.clientId,
                    type: 'service_expansion',
                    description: 'Add spa services to existing salon locations',
                    potentialValue: 120000, // Estimated annual value
                    probability: 60,
                    timeframe: '9-15 months',
                    nextActions: [
                        'Conduct market analysis',
                        'Present spa services opportunity',
                        'Develop pilot program proposal'
                    ]
                });
            }
        });

        return opportunities;
    }
}

// TYPES FOR DASHBOARD AND REPORTING
export interface EnterpriseDashboard {
    overview: {
        totalClients: number;
        activeClients: number;
        totalContractValue: number;
        averageContractValue: number;
        totalLocations: number;
        totalRevenue: number;
    };
    clientStatus: {
        [key: string]: number;
    };
    accountManagerPerformance: {
        managerId: string;
        name: string;
        totalClients: number;
        totalContractValue: number;
        clientSatisfaction: number;
        retentionRate: number;
        expansionRate: number;
    }[];
    executiveSponsorPerformance: {
        sponsorId: string;
        name: string;
        totalClients: number;
        totalContractValue: number;
        relationshipStrength: number;
        retentionRate: number;
        expansionRate: number;
    }[];
    implementationStatus: {
        notStarted: number;
        inProgress: number;
        completed: number;
        onHold: number;
    };
    qbrMetrics: {
        totalQBRs: number;
        upcomingQBRs: number;
        completedQBRs: number;
        averageRating: number;
    };
    riskAnalysis: RiskAnalysis;
}

export interface RiskAnalysis {
    totalAtRisk: number;
    totalRenewalValue: number;
    implementationDelays: number;
    keyRisks: {
        clientId: string;
        clientName: string;
        riskType: string;
        severity: 'low' | 'medium' | 'high';
        description: string;
        mitigation: string;
    }[];
    recommendations: string[];
}

export interface ExpansionOpportunity {
    opportunityId: string;
    clientId: string;
    type: 'location_expansion' | 'feature_upgrade' | 'service_expansion' | 'contract_renewal' | 'strategic_partnership';
    description: string;
    potentialValue: number;
    probability: number;
    timeframe: string;
    nextActions: string[];
}

// MAIN EXPORT
export class ComprehensiveEnterpriseSystem {
    private system: EnterpriseSalesAccountManagement;

    constructor() {
        this.system = new EnterpriseSalesAccountManagement();
    }

    // Public API
    createEnterpriseClient(client: EnterpriseClient): string {
        return this.system.createEnterpriseClient(client);
    }

    getEnterpriseClient(clientId: string): EnterpriseClient | undefined {
        return this.system.getEnterpriseClient(clientId);
    }

    scheduleQBR(clientId: string, quarter: string, date: Date): string {
        return this.system.scheduleQBR(clientId, quarter, date);
    }

    getEnterpriseDashboard(): EnterpriseDashboard {
        return this.system.generateEnterpriseDashboard();
    }

    identifyExpansionOpportunities(): ExpansionOpportunity[] {
        return this.system.identifyExpansionOpportunities();
    }

    // Launch enterprise program
    async launchEnterpriseProgram(): Promise<EnterpriseLaunchResults> {
        const results: EnterpriseLaunchResults = {
            clientsCreated: [],
            accountManagersAssigned: [],
            executiveSponsorsAssigned: [],
            qbrsScheduled: [],
            implementationsStarted: [],
            overall: {
                totalClients: 0,
                totalContractValue: 0,
                totalLocations: 0,
                estimatedAnnualRevenue: 0
            }
        };

        // Get all enterprise clients
        const clients = this.system.getAllEnterpriseClients();

        clients.forEach(client => {
            results.clientsCreated.push({
                clientId: client.clientId,
                companyName: client.companyName,
                status: 'created'
            });

            // Calculate totals
            results.overall.totalClients++;
            results.overall.totalContractValue += client.contractDetails.value;
            results.overall.totalLocations += client.locations.length;
        });

        results.overall.estimatedAnnualRevenue = results.overall.totalContractValue;

        return results;
    }
}

export interface EnterpriseLaunchResults {
    clientsCreated: {
        clientId: string;
        companyName: string;
        status: string;
    }[];
    accountManagersAssigned: {
        clientId: string;
        managerId: string;
        managerName: string;
    }[];
    executiveSponsorsAssigned: {
        clientId: string;
        sponsorId: string;
        sponsorName: string;
    }[];
    qbrsScheduled: {
        clientId: string;
        qbrId: string;
        scheduledDate: Date;
    }[];
    implementationsStarted: {
        clientId: string;
        implementationId: string;
        status: string;
    }[];
    overall: {
        totalClients: number;
        totalContractValue: number;
        totalLocations: number;
        estimatedAnnualRevenue: number;
    };
}
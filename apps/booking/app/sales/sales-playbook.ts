/**
 * Simplified Sales Playbook & Training Materials
 * AppointmentBooking.co.za Customer Acquisition Strategy
 */

export interface SalesMethodology {
    id: string;
    name: string;
    steps: SalesStep[];
    applicableScenarios: string[];
    successRate: number;
    averageSalesCycle: number;
}

export interface SalesStep {
    stepNumber: number;
    name: string;
    description: string;
    objectives: string[];
    keyQuestions: string[];
    duration: number;
    deliverables: string[];
    successCriteria: string[];
}

export interface ValueProposition {
    businessType: string;
    targetPain: string;
    solution: string;
    benefits: string[];
    roi: {
        timeSaved: string;
        revenueIncrease: string;
        costReduction: string;
        efficiency: string;
    };
    proofPoints: {
        statistic: string;
        caseStudy: string;
        testimonial: string;
    };
    competitiveAdvantages: string[];
}

export interface ObjectionHandling {
    objection: string;
    category: string;
    response: {
        acknowledge: string;
        question: string;
        respond: string;
        validate: string;
    };
    proof: string[];
    examples: string[];
}

export interface PricingStrategy {
    package: string;
    price: number;
    features: string[];
    targetBusiness: string;
    positioning: string;
    negotiation: {
        floor: number;
        ceiling: number;
        concessions: string[];
    };
}

// COMPREHENSIVE SALES METHODOLOGY
export const APPOINTMENTBOOKING_SALES_METHODOLOGY: SalesMethodology = {
    id: 'ab-sales-method',
    name: 'AB Solution-Focused Selling',
    steps: [
        {
            stepNumber: 1,
            name: 'Research & Qualification',
            description: 'Comprehensive research on prospect business and initial qualification',
            objectives: [
                'Understand business model and operations',
                'Identify current pain points',
                'Assess decision-making authority',
                'Determine budget and timeline'
            ],
            keyQuestions: [
                'How do you currently manage appointments?',
                'What challenges do you face with your current system?',
                'Who else is involved in technology decisions?',
                'What would an ideal solution look like for you?'
            ],
            duration: 30,
            deliverables: [
                'Business profile completed',
                'Pain points identified',
                'Decision makers mapped',
                'Budget confirmed'
            ],
            successCriteria: [
                'Complete prospect profile',
                'Minimum 3 pain points identified',
                'Decision maker contacted',
                'Budget range established'
            ]
        }
    ],
    applicableScenarios: ['All business types', 'B2B sales', 'Software solutions'],
    successRate: 75,
    averageSalesCycle: 21
};

// VALUE PROPOSITIONS BY BUSINESS TYPE
export const VALUE_PROPOSITIONS: ValueProposition[] = [
    {
        businessType: 'salon',
        targetPain: 'Manual appointment booking leading to double-bookings, no-shows, and lost revenue',
        solution: 'Automated booking system with SMS reminders, online payments, and staff management',
        benefits: [
            'Reduce no-shows by 60% with automated reminders',
            'Increase revenue by 25% through better time management',
            'Save 15 hours per week on administrative tasks',
            'Improve customer satisfaction with online booking',
            'Prevent double-bookings with real-time availability',
            'Accept payments online to reduce no-shows'
        ],
        roi: {
            timeSaved: '15 hours/week = R3,750/month in staff time savings',
            revenueIncrease: '25% increase = R11,250/month additional revenue',
            costReduction: 'Reduce no-shows by 60% = R4,500/month recovered revenue',
            efficiency: 'Streamlined operations = 40% improvement in efficiency'
        },
        proofPoints: {
            statistic: 'South African salons lose R18,000/month on average to no-shows and double-bookings',
            caseStudy: 'Bella Vista Hair & Beauty increased revenue by 32% in first 3 months',
            testimonial: 'Our no-shows dropped from 20% to 8% in the first month - Sarah Johnson, Bella Vista'
        },
        competitiveAdvantages: [
            'Only solution designed specifically for South African beauty businesses',
            'Integration with local payment methods (EFT, SnapScan)',
            'WhatsApp integration for local communication preferences',
            'POPIA compliance built-in for South African privacy laws'
        ]
    }
];

// OBJECTION HANDLING SCRIPTS
export const OBJECTION_HANDLING: ObjectionHandling[] = [
    {
        objection: "It's too expensive",
        category: 'price',
        response: {
            acknowledge: "I understand cost is a concern, and I want to make sure you're seeing the full picture here.",
            question: "Can I ask what you're currently spending on lost revenue from no-shows and double-bookings?",
            respond: "Most salons lose between R15,000-R25,000 monthly to booking issues. Our system pays for itself in the first month by recovering just half of that lost revenue. Plus, you're getting time savings worth R3,000+ monthly in staff efficiency.",
            validate: "Does that ROI calculation help you see the value beyond just the monthly fee?"
        },
        proof: [
            "Average client recovers 300% ROI in first 6 months",
            "Most salons break even within 30 days",
            "No other solution offers this level of local expertise"
        ],
        examples: [
            "Bella Vista Hair recovered R18,000 in lost revenue in month one",
            "Urban Spa increased revenue by R45,000 in first 6 weeks"
        ]
    }
];

// PRICING STRATEGIES
export const PRICING_STRATEGY: PricingStrategy[] = [
    {
        package: 'Starter',
        price: 299,
        features: [
            'Up to 2 staff members',
            'Basic booking system',
            'SMS reminders',
            'Basic reporting',
            'Email support',
            'WhatsApp integration'
        ],
        targetBusiness: 'Single chair barbershops, small salons',
        positioning: 'Perfect for businesses just getting started with online booking',
        negotiation: {
            floor: 249,
            ceiling: 350,
            concessions: ['Free setup', 'First month free', 'Training included']
        }
    },
    {
        package: 'Professional',
        price: 599,
        features: [
            'Up to 10 staff members',
            'Advanced booking system',
            'SMS & Email reminders',
            'Payment processing',
            'Advanced reporting',
            'Priority support',
            'Custom branding',
            'Multi-location support'
        ],
        targetBusiness: 'Medium salons, spas with multiple therapists',
        positioning: 'Most popular choice for growing beauty businesses',
        negotiation: {
            floor: 499,
            ceiling: 699,
            concessions: ['Quarterly billing discount', 'Annual contract discount', 'Custom integrations']
        }
    }
];

// SALES PLAYBOOK CLASS
export class SalesPlaybook {
    private methodology: SalesMethodology;
    private valuePropositions: ValueProposition[];
    private objectionHandling: ObjectionHandling[];
    private pricingStrategy: PricingStrategy[];

    constructor() {
        this.methodology = APPOINTMENTBOOKING_SALES_METHODOLOGY;
        this.valuePropositions = VALUE_PROPOSITIONS;
        this.objectionHandling = OBJECTION_HANDLING;
        this.pricingStrategy = PRICING_STRATEGY;
    }

    getMethodology(): SalesMethodology {
        return this.methodology;
    }

    getValueProposition(businessType: string): ValueProposition | undefined {
        return this.valuePropositions.find(vp => vp.businessType === businessType);
    }

    getObjectionResponse(objection: string): ObjectionHandling | undefined {
        return this.objectionHandling.find(oh =>
            oh.objection.toLowerCase().includes(objection.toLowerCase()) ||
            objection.toLowerCase().includes(oh.objection.toLowerCase())
        );
    }

    getPricingPackage(packageName: string): PricingStrategy | undefined {
        return this.pricingStrategy.find(ps => ps.package === packageName);
    }

    generateOnboardingPlan(salesRep: any): string[] {
        return [
            'Week 1: Complete AB Sales Fundamentals training',
            'Week 2: Shadow experienced sales rep',
            'Week 3: Conduct supervised demos',
            'Week 4: First independent sales with review',
            'Month 2: Advanced training certification',
            'Month 3: Enterprise sales training'
        ];
    }
}
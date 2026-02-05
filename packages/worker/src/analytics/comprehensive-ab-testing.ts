// Comprehensive A/B Testing Framework
// Provides automated A/B testing for all customer touchpoints and conversion funnels

import { ApiError } from '../errors';
import { logger } from '../logger';

export interface ABTestConfig {
    id: string;
    name: string;
    description: string;
    type: 'conversion' | 'revenue' | 'user_experience' | 'pricing' | 'feature';
    status: 'draft' | 'running' | 'paused' | 'completed' | 'archived';
    hypothesis: string;
    primaryMetric: string;
    secondaryMetrics: string[];
    trafficAllocation: TrafficAllocation;
    targeting: TestTargeting;
    variants: ABTestVariant[];
    duration: {
        minimum: number; // hours
        maximum: number; // hours
        startDate: Date;
        endDate?: Date;
    };
    sampleSize: SampleSizeCalculation;
    significance: StatisticalConfig;
    autoOptimization: AutoOptimizationConfig;
    segments: TestSegment[];
    createdAt: Date;
    createdBy: string;
}

export interface TrafficAllocation {
    control: number; // 0-100 percentage
    variants: { [variantId: string]: number };
    total: number; // should equal 100
}

export interface TestTargeting {
    userTypes: ('new' | 'returning' | 'all')[];
    devices: ('mobile' | 'desktop' | 'tablet' | 'all')[];
    locations: string[];
    timeFrames: TimeFrame[];
    userProperties: Record<string, any>;
    excludeConditions: Record<string, any>;
}

export interface TimeFrame {
    start: string; // HH:mm format
    end: string;
    days: number[]; // 0=Sunday, 1=Monday, etc.
}

export interface ABTestVariant {
    id: string;
    name: string;
    description: string;
    config: Record<string, any>; // Specific to test type
    trafficPercentage: number;
    isControl: boolean;
    features: string[];
    metadata: Record<string, any>;
}

export interface SampleSizeCalculation {
    required: number;
    current: number;
    perVariant: Record<string, number>;
    confidence: number;
    power: number;
    minimumDetectableEffect: number;
}

export interface StatisticalConfig {
    confidenceLevel: number; // 0.95 for 95%
    significanceThreshold: number; // 0.05
    testMethod: 'frequentist' | 'bayesian';
    multipleComparisonCorrection: 'bonferroni' | 'fdr' | 'none';
    sequentialTesting: boolean;
}

export interface AutoOptimizationConfig {
    enabled: boolean;
    stopConditions: StopCondition[];
    winnerSelection: WinnerSelectionConfig;
    optimizationFrequency: number; // hours
    riskTolerance: 'low' | 'medium' | 'high';
}

export interface StopCondition {
    type: 'significance_reached' | 'sample_size_reached' | 'time_limit' | 'negative_impact' | 'performance_threshold';
    threshold: number;
    comparison: '>' | '<' | '=' | '>=' | '<=';
}

export interface WinnerSelectionConfig {
    primaryMetricOnly: boolean;
    considerSecondaryMetrics: boolean;
    minimumDataPoints: number;
    winnerThreshold: number; // minimum improvement required
    holdoutPercentage: number; // percentage to keep in control
}

export interface TestSegment {
    id: string;
    name: string;
    criteria: Record<string, any>;
    trafficPercentage: number;
    isControlSegment: boolean;
}

export interface ABTestResult {
    testId: string;
    timestamp: Date;
    status: 'in_progress' | 'completed' | 'stopped';
    winner?: string;
    results: VariantResults[];
    statisticalSignificance: StatisticalSignificance;
    businessImpact: BusinessImpact;
    recommendations: string[];
    nextSteps: string[];
}

export interface VariantResults {
    variantId: string;
    variantName: string;
    trafficAllocated: number;
    visitors: number;
    conversions: number;
    conversionRate: number;
    confidenceInterval: [number, number];
    pValue: number;
    relativeImprovement: number;
    absoluteImprovement: number;
}

export interface StatisticalSignificance {
    isSignificant: boolean;
    pValue: number;
    confidenceLevel: number;
    effectSize: number;
    power: number;
    sampleSize: number;
}

export interface BusinessImpact {
    estimatedRevenueImpact: number;
    estimatedConversionImpact: number;
    riskAssessment: 'low' | 'medium' | 'high';
    rolloutRecommendation: 'immediate' | 'gradual' | 'further_testing' | 'revert';
}

export class ComprehensiveABTestingFramework {
    private tests: Map<string, ABTestConfig> = new Map();
    private results: Map<string, ABTestResult> = new Map();
    private activeTests: Map<string, TestExecution> = new Map();
    private statisticalEngine: StatisticalAnalysisEngine;
    private optimizationEngine: AutoOptimizationEngine;
    private testAssignment: TestAssignmentEngine;
    private readonly MAX_CONCURRENT_TESTS = 20;
    private readonly MIN_TEST_DURATION = 24; // hours

    constructor() {
        this.statisticalEngine = new StatisticalAnalysisEngine();
        this.optimizationEngine = new AutoOptimizationEngine(this);
        this.testAssignment = new TestAssignmentEngine();
        this.initializeDefaultTests();
        this.startOptimizationLoop();
    }

    /**
     * Initialize comprehensive A/B testing framework with default test configurations
     */
    private initializeDefaultTests() {
        const defaultTests: ABTestConfig[] = [
            // Conversion Optimization Tests
            {
                id: 'booking_flow_optimization',
                name: 'Booking Flow Optimization',
                description: 'Test streamlined vs detailed booking flow for conversion improvement',
                type: 'conversion',
                status: 'draft',
                hypothesis: 'A simplified booking flow will increase conversion rates by at least 15%',
                primaryMetric: 'booking_completion_rate',
                secondaryMetrics: ['time_to_booking', 'form_abandonment_rate', 'customer_satisfaction'],
                trafficAllocation: {
                    control: 50,
                    variants: {
                        'simplified_flow': 30,
                        'detailed_flow': 20
                    },
                    total: 100
                },
                targeting: {
                    userTypes: ['all'],
                    devices: ['all'],
                    locations: ['ZA'],
                    timeFrames: [],
                    userProperties: {},
                    excludeConditions: {}
                },
                variants: [
                    {
                        id: 'control',
                        name: 'Current Flow',
                        description: 'Existing booking flow',
                        config: { flowType: 'current' },
                        trafficPercentage: 50,
                        isControl: true,
                        features: ['current_ui', 'current_validation'],
                        metadata: { version: '1.0', testType: 'flow_optimization' }
                    },
                    {
                        id: 'simplified_flow',
                        name: 'Simplified Flow',
                        description: 'Reduced steps and simplified validation',
                        config: { flowType: 'simplified' },
                        trafficPercentage: 30,
                        isControl: false,
                        features: ['reduced_steps', 'inline_validation', 'progress_indicator'],
                        metadata: { version: '1.0', testType: 'flow_optimization' }
                    },
                    {
                        id: 'detailed_flow',
                        name: 'Detailed Flow',
                        description: 'More information and customization options',
                        config: { flowType: 'detailed' },
                        trafficPercentage: 20,
                        isControl: false,
                        features: ['more_options', 'detailed_descriptions', 'customization'],
                        metadata: { version: '1.0', testType: 'flow_optimization' }
                    }
                ],
                duration: {
                    minimum: 72,
                    maximum: 168,
                    startDate: new Date()
                },
                sampleSize: {
                    required: 5000,
                    current: 0,
                    perVariant: { 'control': 2500, 'simplified_flow': 1500, 'detailed_flow': 1000 },
                    confidence: 0.95,
                    power: 0.8,
                    minimumDetectableEffect: 0.15
                },
                significance: {
                    confidenceLevel: 0.95,
                    significanceThreshold: 0.05,
                    testMethod: 'frequentist',
                    multipleComparisonCorrection: 'bonferroni',
                    sequentialTesting: true
                },
                autoOptimization: {
                    enabled: true,
                    stopConditions: [
                        { type: 'significance_reached', threshold: 0.95, comparison: '>=' },
                        { type: 'sample_size_reached', threshold: 5000, comparison: '>=' },
                        { type: 'negative_impact', threshold: -0.1, comparison: '<=' }
                    ],
                    winnerSelection: {
                        primaryMetricOnly: false,
                        considerSecondaryMetrics: true,
                        minimumDataPoints: 100,
                        winnerThreshold: 0.1,
                        holdoutPercentage: 10
                    },
                    optimizationFrequency: 6,
                    riskTolerance: 'medium'
                },
                segments: [
                    {
                        id: 'all_users',
                        name: 'All Users',
                        criteria: {},
                        trafficPercentage: 100,
                        isControlSegment: true
                    }
                ],
                createdAt: new Date(),
                createdBy: 'system'
            },

            // Pricing Strategy Tests
            {
                id: 'dynamic_pricing_test',
                name: 'Dynamic Pricing Optimization',
                description: 'Test dynamic pricing vs fixed pricing for revenue optimization',
                type: 'pricing',
                status: 'draft',
                hypothesis: 'Dynamic pricing based on demand will increase revenue by at least 20%',
                primaryMetric: 'revenue_per_visitor',
                secondaryMetrics: ['conversion_rate', 'average_booking_value', 'customer_satisfaction'],
                trafficAllocation: {
                    control: 50,
                    variants: {
                        'dynamic_pricing': 50
                    },
                    total: 100
                },
                targeting: {
                    userTypes: ['all'],
                    devices: ['all'],
                    locations: ['ZA'],
                    timeFrames: [
                        { start: '09:00', end: '17:00', days: [1, 2, 3, 4, 5] }, // Weekdays
                        { start: '09:00', end: '15:00', days: [6] } // Saturday
                    ],
                    userProperties: {},
                    excludeConditions: {}
                },
                variants: [
                    {
                        id: 'control',
                        name: 'Fixed Pricing',
                        description: 'Current fixed pricing model',
                        config: { pricingModel: 'fixed' },
                        trafficPercentage: 50,
                        isControl: true,
                        features: ['current_pricing', 'standard_discounts'],
                        metadata: { version: '1.0', testType: 'pricing_optimization' }
                    },
                    {
                        id: 'dynamic_pricing',
                        name: 'Dynamic Pricing',
                        description: 'Demand-based dynamic pricing',
                        config: {
                            pricingModel: 'dynamic',
                            algorithm: 'demand_based',
                            adjustmentFactor: 0.3
                        },
                        trafficPercentage: 50,
                        isControl: false,
                        features: ['demand_pricing', 'peak_surcharge', 'off_peak_discount'],
                        metadata: { version: '1.0', testType: 'pricing_optimization' }
                    }
                ],
                duration: {
                    minimum: 168, // 1 week
                    maximum: 720, // 30 days
                    startDate: new Date()
                },
                sampleSize: {
                    required: 10000,
                    current: 0,
                    perVariant: { 'control': 5000, 'dynamic_pricing': 5000 },
                    confidence: 0.95,
                    power: 0.8,
                    minimumDetectableEffect: 0.2
                },
                significance: {
                    confidenceLevel: 0.95,
                    significanceThreshold: 0.05,
                    testMethod: 'bayesian',
                    multipleComparisonCorrection: 'none',
                    sequentialTesting: true
                },
                autoOptimization: {
                    enabled: true,
                    stopConditions: [
                        { type: 'significance_reached', threshold: 0.95, comparison: '>=' },
                        { type: 'sample_size_reached', threshold: 10000, comparison: '>=' },
                        { type: 'negative_impact', threshold: -0.15, comparison: '<=' }
                    ],
                    winnerSelection: {
                        primaryMetricOnly: true,
                        considerSecondaryMetrics: true,
                        minimumDataPoints: 500,
                        winnerThreshold: 0.15,
                        holdoutPercentage: 20
                    },
                    optimizationFrequency: 24,
                    riskTolerance: 'low'
                },
                segments: [
                    {
                        id: 'peak_hours',
                        name: 'Peak Hours',
                        criteria: { timeSlot: 'peak' },
                        trafficPercentage: 60,
                        isControlSegment: false
                    },
                    {
                        id: 'off_peak',
                        name: 'Off-Peak Hours',
                        criteria: { timeSlot: 'off_peak' },
                        trafficPercentage: 40,
                        isControlSegment: false
                    }
                ],
                createdAt: new Date(),
                createdBy: 'system'
            },

            // User Experience Tests
            {
                id: 'mobile_ux_optimization',
                name: 'Mobile UX Optimization',
                description: 'Test mobile-specific UX improvements for better engagement',
                type: 'user_experience',
                status: 'draft',
                hypothesis: 'Mobile-optimized interface will increase mobile conversion by 25%',
                primaryMetric: 'mobile_conversion_rate',
                secondaryMetrics: ['mobile_bounce_rate', 'mobile_session_duration', 'mobile_page_load_time'],
                trafficAllocation: {
                    control: 50,
                    variants: {
                        'mobile_optimized': 50
                    },
                    total: 100
                },
                targeting: {
                    userTypes: ['all'],
                    devices: ['mobile'],
                    locations: ['ZA'],
                    timeFrames: [],
                    userProperties: {},
                    excludeConditions: {}
                },
                variants: [
                    {
                        id: 'control',
                        name: 'Current Mobile UI',
                        description: 'Current mobile interface',
                        config: { uiVersion: 'current' },
                        trafficPercentage: 50,
                        isControl: true,
                        features: ['current_design', 'standard_navigation'],
                        metadata: { version: '1.0', testType: 'mobile_ux' }
                    },
                    {
                        id: 'mobile_optimized',
                        name: 'Optimized Mobile UI',
                        description: 'Mobile-first optimized interface',
                        config: {
                            uiVersion: 'optimized',
                            optimizations: ['larger_touch_targets', 'swipe_gestures', 'improved_forms']
                        },
                        trafficPercentage: 50,
                        isControl: false,
                        features: ['mobile_first', 'touch_optimized', 'swipe_navigation'],
                        metadata: { version: '1.0', testType: 'mobile_ux' }
                    }
                ],
                duration: {
                    minimum: 96,
                    maximum: 336,
                    startDate: new Date()
                },
                sampleSize: {
                    required: 3000,
                    current: 0,
                    perVariant: { 'control': 1500, 'mobile_optimized': 1500 },
                    confidence: 0.95,
                    power: 0.8,
                    minimumDetectableEffect: 0.25
                },
                significance: {
                    confidenceLevel: 0.95,
                    significanceThreshold: 0.05,
                    testMethod: 'frequentist',
                    multipleComparisonCorrection: 'none',
                    sequentialTesting: true
                },
                autoOptimization: {
                    enabled: true,
                    stopConditions: [
                        { type: 'significance_reached', threshold: 0.95, comparison: '>=' },
                        { type: 'sample_size_reached', threshold: 3000, comparison: '>=' },
                        { type: 'negative_impact', threshold: -0.1, comparison: '<=' }
                    ],
                    winnerSelection: {
                        primaryMetricOnly: false,
                        considerSecondaryMetrics: true,
                        minimumDataPoints: 200,
                        winnerThreshold: 0.2,
                        holdoutPercentage: 15
                    },
                    optimizationFrequency: 12,
                    riskTolerance: 'medium'
                },
                segments: [
                    {
                        id: 'ios_users',
                        name: 'iOS Users',
                        criteria: { platform: 'ios' },
                        trafficPercentage: 60,
                        isControlSegment: false
                    },
                    {
                        id: 'android_users',
                        name: 'Android Users',
                        criteria: { platform: 'android' },
                        trafficPercentage: 40,
                        isControlSegment: false
                    }
                ],
                createdAt: new Date(),
                createdBy: 'system'
            },

            // Feature Testing
            {
                id: 'google_calendar_integration',
                name: 'Google Calendar Integration',
                description: 'Test Google Calendar integration for improved user experience',
                type: 'feature',
                status: 'draft',
                hypothesis: 'Google Calendar integration will increase booking completion by 30%',
                primaryMetric: 'booking_completion_rate',
                secondaryMetrics: ['calendar_sync_rate', 'user_engagement', 'support_tickets'],
                trafficAllocation: {
                    control: 70,
                    variants: {
                        'google_calendar': 30
                    },
                    total: 100
                },
                targeting: {
                    userTypes: ['new', 'returning'],
                    devices: ['desktop', 'mobile'],
                    locations: ['ZA'],
                    timeFrames: [],
                    userProperties: { hasGoogleAccount: true },
                    excludeConditions: {}
                },
                variants: [
                    {
                        id: 'control',
                        name: 'No Calendar Integration',
                        description: 'Current booking without calendar integration',
                        config: { calendarIntegration: false },
                        trafficPercentage: 70,
                        isControl: true,
                        features: ['email_confirmations', 'manual_reminders'],
                        metadata: { version: '1.0', testType: 'calendar_integration' }
                    },
                    {
                        id: 'google_calendar',
                        name: 'Google Calendar Integration',
                        description: 'Automatic Google Calendar sync',
                        config: {
                            calendarIntegration: true,
                            provider: 'google',
                            autoSync: true,
                            reminders: true
                        },
                        trafficPercentage: 30,
                        isControl: false,
                        features: ['google_sync', 'auto_reminders', 'calendar_view'],
                        metadata: { version: '1.0', testType: 'calendar_integration' }
                    }
                ],
                duration: {
                    minimum: 120,
                    maximum: 480,
                    startDate: new Date()
                },
                sampleSize: {
                    required: 2000,
                    current: 0,
                    perVariant: { 'control': 1400, 'google_calendar': 600 },
                    confidence: 0.95,
                    power: 0.8,
                    minimumDetectableEffect: 0.3
                },
                significance: {
                    confidenceLevel: 0.95,
                    significanceThreshold: 0.05,
                    testMethod: 'frequentist',
                    multipleComparisonCorrection: 'none',
                    sequentialTesting: true
                },
                autoOptimization: {
                    enabled: true,
                    stopConditions: [
                        { type: 'significance_reached', threshold: 0.95, comparison: '>=' },
                        { type: 'sample_size_reached', threshold: 2000, comparison: '>=' },
                        { type: 'performance_threshold', threshold: 0.8, comparison: '<=' }
                    ],
                    winnerSelection: {
                        primaryMetricOnly: true,
                        considerSecondaryMetrics: true,
                        minimumDataPoints: 100,
                        winnerThreshold: 0.25,
                        holdoutPercentage: 20
                    },
                    optimizationFrequency: 24,
                    riskTolerance: 'high'
                },
                segments: [
                    {
                        id: 'business_users',
                        name: 'Business Users',
                        criteria: { userType: 'business' },
                        trafficPercentage: 40,
                        isControlSegment: false
                    },
                    {
                        id: 'individual_users',
                        name: 'Individual Users',
                        criteria: { userType: 'individual' },
                        trafficPercentage: 60,
                        isControlSegment: false
                    }
                ],
                createdAt: new Date(),
                createdBy: 'system'
            },

            // Revenue Optimization Tests
            {
                id: 'upselling_optimization',
                name: 'Upselling Strategy Optimization',
                description: 'Test different upselling approaches for revenue maximization',
                type: 'revenue',
                status: 'draft',
                hypothesis: 'Personalized upselling will increase average order value by 35%',
                primaryMetric: 'average_order_value',
                secondaryMetrics: ['upsell_conversion_rate', 'customer_satisfaction', 'return_rate'],
                trafficAllocation: {
                    control: 33.33,
                    variants: {
                        'personalized_upsell': 33.33,
                        'bundle_offer': 33.34
                    },
                    total: 100
                },
                targeting: {
                    userTypes: ['all'],
                    devices: ['all'],
                    locations: ['ZA'],
                    timeFrames: [],
                    userProperties: {},
                    excludeConditions: {}
                },
                variants: [
                    {
                        id: 'control',
                        name: 'Current Upselling',
                        description: 'Current upselling approach',
                        config: { upsellType: 'current' },
                        trafficPercentage: 33.33,
                        isControl: true,
                        features: ['standard_upsell', 'basic_recommendations'],
                        metadata: { version: '1.0', testType: 'upselling_optimization' }
                    },
                    {
                        id: 'personalized_upsell',
                        name: 'Personalized Upselling',
                        description: 'AI-powered personalized upselling',
                        config: {
                            upsellType: 'personalized',
                            algorithm: 'ai_powered',
                            personalization: 'behavior_based'
                        },
                        trafficPercentage: 33.33,
                        isControl: false,
                        features: ['ai_recommendations', 'behavior_analysis', 'dynamic_pricing'],
                        metadata: { version: '1.0', testType: 'upselling_optimization' }
                    },
                    {
                        id: 'bundle_offer',
                        name: 'Bundle Offers',
                        description: 'Service bundle promotions',
                        config: {
                            upsellType: 'bundle',
                            offerType: 'service_bundles',
                            discount: 0.15
                        },
                        trafficPercentage: 33.34,
                        isControl: false,
                        features: ['bundle_discounts', 'package_deals', 'value_proposition'],
                        metadata: { version: '1.0', testType: 'upselling_optimization' }
                    }
                ],
                duration: {
                    minimum: 168,
                    maximum: 504,
                    startDate: new Date()
                },
                sampleSize: {
                    required: 6000,
                    current: 0,
                    perVariant: { 'control': 2000, 'personalized_upsell': 2000, 'bundle_offer': 2000 },
                    confidence: 0.95,
                    power: 0.8,
                    minimumDetectableEffect: 0.35
                },
                significance: {
                    confidenceLevel: 0.95,
                    significanceThreshold: 0.05,
                    testMethod: 'bayesian',
                    multipleComparisonCorrection: 'fdr',
                    sequentialTesting: true
                },
                autoOptimization: {
                    enabled: true,
                    stopConditions: [
                        { type: 'significance_reached', threshold: 0.95, comparison: '>=' },
                        { type: 'sample_size_reached', threshold: 6000, comparison: '>=' },
                        { type: 'negative_impact', threshold: -0.2, comparison: '<=' }
                    ],
                    winnerSelection: {
                        primaryMetricOnly: false,
                        considerSecondaryMetrics: true,
                        minimumDataPoints: 300,
                        winnerThreshold: 0.3,
                        holdoutPercentage: 15
                    },
                    optimizationFrequency: 12,
                    riskTolerance: 'medium'
                },
                segments: [
                    {
                        id: 'high_value_customers',
                        name: 'High-Value Customers',
                        criteria: { lifetimeValue: '>1000' },
                        trafficPercentage: 30,
                        isControlSegment: false
                    },
                    {
                        id: 'regular_customers',
                        name: 'Regular Customers',
                        criteria: { lifetimeValue: '100-1000' },
                        trafficPercentage: 50,
                        isControlSegment: false
                    },
                    {
                        id: 'new_customers',
                        name: 'New Customers',
                        criteria: { lifetimeValue: '<100' },
                        trafficPercentage: 20,
                        isControlSegment: false
                    }
                ],
                createdAt: new Date(),
                createdBy: 'system'
            }
        ];

        defaultTests.forEach(test => {
            this.tests.set(test.id, test);
        });

        logger.info('Initialized comprehensive A/B testing framework', {
            testCount: defaultTests.length,
            maxConcurrentTests: this.MAX_CONCURRENT_TESTS
        });
    }

    /**
     * Start automated optimization loop
     */
    private startOptimizationLoop() {
        setInterval(async () => {
            try {
                await this.optimizationEngine.checkForWinners();
                await this.optimizeTestPerformance();
                await this.analyzeTestResults();
            } catch (error) {
                logger.error('Error in A/B testing optimization loop', { error });
            }
        }, 3600000); // Every hour
    }

    /**
     * Create new A/B test
     */
    async createTest(testConfig: Omit<ABTestConfig, 'id' | 'createdAt' | 'createdBy'>): Promise<string> {
        const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const test: ABTestConfig = {
            ...testConfig,
            id: testId,
            createdAt: new Date(),
            createdBy: 'user'
        };

        // Validate test configuration
        await this.validateTestConfiguration(test);

        this.tests.set(testId, test);

        logger.info('A/B test created', {
            testId,
            name: test.name,
            type: test.type
        });

        return testId;
    }

    /**
     * Start A/B test
     */
    async startTest(testId: string): Promise<boolean> {
        const test = this.tests.get(testId);
        if (!test) {
            throw new ApiError(404, 'Test not found');
        }

        if (test.status !== 'draft') {
            throw new ApiError(400, 'Test can only be started from draft status');
        }

        // Check concurrent test limits
        const activeTests = Array.from(this.activeTests.values());
        if (activeTests.length >= this.MAX_CONCURRENT_TESTS) {
            throw new ApiError(429, 'Maximum concurrent tests limit reached');
        }

        // Update test status
        test.status = 'running';
        test.duration.startDate = new Date();

        // Initialize test execution
        const execution = new TestExecution(test);
        this.activeTests.set(testId, execution);

        logger.info('A/B test started', { testId, name: test.name });
        return true;
    }

    /**
     * Assign user to test variant
     */
    async assignUserToTest(userId: string, testId: string, userContext: any): Promise<string | null> {
        const test = this.tests.get(testId);
        if (!test || test.status !== 'running') {
            return null;
        }

        const execution = this.activeTests.get(testId);
        if (!execution) {
            return null;
        }

        // Check if user meets targeting criteria
        if (!this.testAssignment.matchesTargeting(userContext, test.targeting)) {
            return null;
        }

        // Check if user should be excluded
        if (this.testAssignment.shouldExclude(userContext, test.targeting.excludeConditions)) {
            return null;
        }

        // Assign variant based on traffic allocation and user ID hash
        const variantId = this.testAssignment.assignVariant(userId, test);

        if (variantId) {
            execution.recordAssignment(userId, variantId);
            logger.debug('User assigned to test variant', { userId, testId, variantId });
        }

        return variantId;
    }

    /**
     * Record conversion event
     */
    async recordConversion(userId: string, testId: string, variantId: string, conversionValue?: number): Promise<void> {
        const execution = this.activeTests.get(testId);
        if (!execution) {
            return;
        }

        execution.recordConversion(userId, variantId, conversionValue);

        logger.debug('Conversion recorded', { userId, testId, variantId, conversionValue });
    }

    /**
     * Get test results
     */
    async getTestResults(testId: string): Promise<ABTestResult | null> {
        const test = this.tests.get(testId);
        if (!test) {
            return null;
        }

        const execution = this.activeTests.get(testId);
        if (!execution) {
            return null;
        }

        // Calculate statistical significance
        const statisticalSignificance = await this.statisticalEngine.calculateSignificance(
            execution.getResults(),
            test.significance
        );

        // Calculate business impact
        const businessImpact = await this.calculateBusinessImpact(execution.getResults(), test);

        // Determine winner
        const winner = this.determineWinner(execution.getResults(), statisticalSignificance);

        // Generate recommendations
        const recommendations = this.generateRecommendations(test, statisticalSignificance, businessImpact);

        const result: ABTestResult = {
            testId,
            timestamp: new Date(),
            status: test.status === 'running' ? 'in_progress' : 'completed',
            winner,
            results: execution.getResults(),
            statisticalSignificance,
            businessImpact,
            recommendations,
            nextSteps: this.generateNextSteps(test, winner, statisticalSignificance)
        };

        this.results.set(testId, result);
        return result;
    }

    /**
     * Validate test configuration
     */
    private async validateTestConfiguration(test: ABTestConfig): Promise<void> {
        // Validate traffic allocation sums to 100%
        const totalAllocation = test.trafficAllocation.control +
            Object.values(test.trafficAllocation.variants).reduce((sum, val) => sum + val, 0);

        if (Math.abs(totalAllocation - 100) > 0.01) {
            throw new ApiError(400, 'Traffic allocation must sum to 100%');
        }

        // Validate sample size calculation
        if (test.sampleSize.required < 100) {
            throw new ApiError(400, 'Minimum sample size is 100');
        }

        // Validate duration
        if (test.duration.minimum < this.MIN_TEST_DURATION) {
            throw new ApiError(400, `Minimum test duration is ${this.MIN_TEST_DURATION} hours`);
        }

        // Validate statistical significance settings
        if (test.significance.confidenceLevel < 0.8 || test.significance.confidenceLevel >= 1) {
            throw new ApiError(400, 'Confidence level must be between 0.8 and 1');
        }
    }

    /**
     * Calculate business impact
     */
    private async calculateBusinessImpact(results: VariantResults[], test: ABTestConfig): Promise<BusinessImpact> {
        const controlResult = results.find(r => r.variantId === 'control');
        if (!controlResult) {
            return {
                estimatedRevenueImpact: 0,
                estimatedConversionImpact: 0,
                riskAssessment: 'high',
                rolloutRecommendation: 'further_testing'
            };
        }

        const bestVariant = results.reduce((best, current) =>
            current.conversionRate > best.conversionRate ? current : best
        );

        const conversionImprovement = bestVariant.conversionRate - controlResult.conversionRate;
        const revenueImprovement = conversionImprovement * 10000; // Mock calculation

        // Risk assessment based on statistical significance and sample size
        let riskAssessment: 'low' | 'medium' | 'high' = 'medium';
        if (bestVariant.pValue < 0.01 && bestVariant.visitors > 1000) {
            riskAssessment = 'low';
        } else if (bestVariant.pValue > 0.05 || bestVariant.visitors < 500) {
            riskAssessment = 'high';
        }

        // Rollout recommendation
        let rolloutRecommendation: 'immediate' | 'gradual' | 'further_testing' | 'revert';
        if (conversionImprovement > 0.2 && riskAssessment === 'low') {
            rolloutRecommendation = 'immediate';
        } else if (conversionImprovement > 0.1 && riskAssessment !== 'high') {
            rolloutRecommendation = 'gradual';
        } else if (conversionImprovement < 0) {
            rolloutRecommendation = 'revert';
        } else {
            rolloutRecommendation = 'further_testing';
        }

        return {
            estimatedRevenueImpact: revenueImprovement,
            estimatedConversionImpact: conversionImprovement,
            riskAssessment,
            rolloutRecommendation
        };
    }

    /**
     * Determine test winner
     */
    private determineWinner(results: VariantResults[], significance: StatisticalSignificance): string | undefined {
        if (!significance.isSignificant) {
            return undefined;
        }

        const controlResult = results.find(r => r.variantId === 'control');
        if (!controlResult) {
            return undefined;
        }

        const winningVariant = results.reduce((best, current) => {
            if (current.variantId === 'control') return best;

            const improvement = current.conversionRate - controlResult.conversionRate;
            const bestImprovement = best.conversionRate - controlResult.conversionRate;

            return improvement > bestImprovement ? current : best;
        });

        return winningVariant.variantId;
    }

    /**
     * Generate test recommendations
     */
    private generateRecommendations(test: ABTestConfig, significance: StatisticalSignificance, impact: BusinessImpact): string[] {
        const recommendations: string[] = [];

        if (significance.isSignificant) {
            recommendations.push('Test reached statistical significance');

            if (impact.rolloutRecommendation === 'immediate') {
                recommendations.push('Recommend immediate rollout due to strong positive results');
            } else if (impact.rolloutRecommendation === 'gradual') {
                recommendations.push('Recommend gradual rollout with monitoring');
            }
        } else {
            recommendations.push('Test did not reach statistical significance - continue testing');
        }

        if (impact.riskAssessment === 'high') {
            recommendations.push('High risk assessment - consider additional testing before rollout');
        }

        if (test.type === 'pricing' && significance.isSignificant) {
            recommendations.push('Pricing test results should be validated across different customer segments');
        }

        return recommendations;
    }

    /**
     * Generate next steps
     */
    private generateNextSteps(test: ABTestConfig, winner: string | undefined, significance: StatisticalSignificance): string[] {
        const nextSteps: string[] = [];

        if (winner) {
            nextSteps.push(`Implement winner variant: ${winner}`);
            nextSteps.push('Monitor performance after implementation');
        }

        if (!significance.isSignificant) {
            nextSteps.push('Continue test to reach statistical significance');
            nextSteps.push('Consider increasing sample size or test duration');
        }

        if (test.autoOptimization.enabled) {
            nextSteps.push('Automated optimization will continue monitoring results');
        }

        nextSteps.push('Document learnings for future tests');
        nextSteps.push('Plan follow-up tests based on results');

        return nextSteps;
    }

    /**
     * Optimize test performance
     */
    private async optimizeTestPerformance() {
        for (const [testId, execution] of this.activeTests) {
            // Check if test should be stopped
            const shouldStop = await this.shouldStopTest(testId, execution);
            if (shouldStop) {
                await this.stopTest(testId, 'auto_optimization');
            }

            // Optimize traffic allocation if needed
            await this.optimizeTrafficAllocation(testId, execution);
        }
    }

    /**
     * Check if test should be stopped
     */
    private async shouldStopTest(testId: string, execution: TestExecution): Promise<boolean> {
        const test = this.tests.get(testId);
        if (!test || !test.autoOptimization.enabled) {
            return false;
        }

        const results = execution.getResults();
        const significance = await this.statisticalEngine.calculateSignificance(results, test.significance);

        // Check stop conditions
        for (const condition of test.autoOptimization.stopConditions) {
            switch (condition.type) {
                case 'significance_reached':
                    if (significance.isSignificant && this.compareValues(significance.confidenceLevel, condition.threshold, condition.comparison)) {
                        return true;
                    }
                    break;
                case 'sample_size_reached':
                    const totalSample = results.reduce((sum, r) => sum + r.visitors, 0);
                    if (this.compareValues(totalSample, condition.threshold, condition.comparison)) {
                        return true;
                    }
                    break;
                case 'negative_impact':
                    const controlResult = results.find(r => r.variantId === 'control');
                    if (controlResult) {
                        const worstVariant = results.reduce((worst, current) =>
                            current.conversionRate < worst.conversionRate ? current : worst
                        );
                        const impact = (worstVariant.conversionRate - controlResult.conversionRate) / controlResult.conversionRate;
                        if (this.compareValues(impact, condition.threshold, condition.comparison)) {
                            return true;
                        }
                    }
                    break;
            }
        }

        return false;
    }

    private compareValues(value: number, threshold: number, comparison: string): boolean {
        switch (comparison) {
            case '>': return value > threshold;
            case '<': return value < threshold;
            case '=': return value === threshold;
            case '>=': return value >= threshold;
            case '<=': return value <= threshold;
            default: return false;
        }
    }

    /**
     * Stop test
     */
    private async stopTest(testId: string, reason: string): Promise<void> {
        const test = this.tests.get(testId);
        if (!test) return;

        test.status = 'completed';
        test.duration.endDate = new Date();

        const execution = this.activeTests.get(testId);
        if (execution) {
            execution.markCompleted();
            this.activeTests.delete(testId);
        }

        logger.info('A/B test stopped', { testId, reason });
    }

    /**
     * Optimize traffic allocation
     */
    private async optimizeTrafficAllocation(testId: string, execution: TestExecution): Promise<void> {
        // Implementation would dynamically adjust traffic allocation based on performance
        // This is a simplified version
    }

    /**
     * Analyze test results
     */
    private async analyzeTestResults(): Promise<void> {
        // Implementation would perform deep analysis of all test results
        // and generate insights for future tests
    }

    /**
     * Get active tests
     */
    getActiveTests(): ABTestConfig[] {
        return Array.from(this.tests.values()).filter(test => test.status === 'running');
    }

    /**
     * Get test by ID
     */
    getTest(testId: string): ABTestConfig | undefined {
        return this.tests.get(testId);
    }

    /**
     * Get all tests
     */
    getAllTests(): ABTestConfig[] {
        return Array.from(this.tests.values());
    }
}

// Supporting classes for the framework

class TestExecution {
    private assignments: Map<string, string> = new Map(); // userId -> variantId
    private conversions: Map<string, { variantId: string; timestamp: Date; value?: number }[]> = new Map();
    private startTime: Date;
    private completed: boolean = false;

    constructor(private test: ABTestConfig) {
        this.startTime = new Date();
    }

    recordAssignment(userId: string, variantId: string): void {
        this.assignments.set(userId, variantId);
    }

    recordConversion(userId: string, variantId: string, value?: number): void {
        const conversions = this.conversions.get(userId) || [];
        conversions.push({ variantId, timestamp: new Date(), value });
        this.conversions.set(userId, conversions);
    }

    getResults(): VariantResults[] {
        const variantMap: Map<string, { visitors: Set<string>; conversions: number; totalValue: number }> = new Map();

        // Initialize variants
        for (const variant of this.test.variants) {
            variantMap.set(variant.id, { visitors: new Set(), conversions: 0, totalValue: 0 });
        }

        // Count visitors per variant
        for (const [userId, variantId] of this.assignments) {
            const variantData = variantMap.get(variantId);
            if (variantData) {
                variantData.visitors.add(userId);
            }
        }

        // Count conversions per variant
        for (const [userId, userConversions] of this.conversions) {
            const variantId = this.assignments.get(userId);
            if (variantId) {
                const variantData = variantMap.get(variantId);
                if (variantData) {
                    variantData.conversions += userConversions.length;
                    variantData.totalValue += userConversions.reduce((sum, conv) => sum + (conv.value || 0), 0);
                }
            }
        }

        // Convert to results
        return Array.from(variantMap.entries()).map(([variantId, data]) => {
            const variant = this.test.variants.find(v => v.id === variantId)!;
            const visitors = data.visitors.size;
            const conversions = data.conversions;
            const conversionRate = visitors > 0 ? conversions / visitors : 0;

            return {
                variantId,
                variantName: variant.name,
                trafficAllocated: variant.trafficPercentage,
                visitors,
                conversions,
                conversionRate,
                confidenceInterval: [Math.max(0, conversionRate - 0.05), Math.min(1, conversionRate + 0.05)],
                pValue: 0.05, // Simplified
                relativeImprovement: 0, // Would calculate relative to control
                absoluteImprovement: 0 // Would calculate absolute improvement
            };
        });
    }

    markCompleted(): void {
        this.completed = true;
    }

    isCompleted(): boolean {
        return this.completed;
    }
}

class StatisticalAnalysisEngine {
    async calculateSignificance(results: VariantResults[], config: StatisticalConfig): Promise<StatisticalSignificance> {
        // Simplified statistical calculation
        const controlResult = results.find(r => r.variantId === 'control');
        if (!controlResult) {
            return {
                isSignificant: false,
                pValue: 1.0,
                confidenceLevel: config.confidenceLevel,
                effectSize: 0,
                power: 0.8,
                sampleSize: results.reduce((sum, r) => sum + r.visitors, 0)
            };
        }

        const bestVariant = results.reduce((best, current) =>
            current.conversionRate > best.conversionRate ? current : best
        );

        const improvement = bestVariant.conversionRate - controlResult.conversionRate;
        const isSignificant = improvement > 0.05 && bestVariant.pValue < config.significanceThreshold;

        return {
            isSignificant,
            pValue: bestVariant.pValue,
            confidenceLevel: config.confidenceLevel,
            effectSize: improvement,
            power: 0.8,
            sampleSize: results.reduce((sum, r) => sum + r.visitors, 0)
        };
    }
}

class AutoOptimizationEngine {
    constructor(private framework: ComprehensiveABTestingFramework) { }

    async checkForWinners(): Promise<void> {
        // Implementation would check all running tests for winners
        // and automatically stop tests that have reached conclusions
    }
}

class TestAssignmentEngine {
    matchesTargeting(userContext: any, targeting: TestTargeting): boolean {
        // Check user types
        if (targeting.userTypes.length > 0 && !targeting.userTypes.includes('all')) {
            if (!targeting.userTypes.includes(userContext.userType)) {
                return false;
            }
        }

        // Check devices
        if (targeting.devices.length > 0 && !targeting.devices.includes('all')) {
            if (!targeting.devices.includes(userContext.device)) {
                return false;
            }
        }

        // Check locations
        if (targeting.locations.length > 0 && !targeting.locations.includes(userContext.location)) {
            return false;
        }

        // Check time frames
        if (targeting.timeFrames.length > 0) {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            const currentDay = now.getDay();

            const matchesTimeFrame = targeting.timeFrames.some(timeFrame => {
                return timeFrame.days.includes(currentDay) &&
                    currentTime >= timeFrame.start &&
                    currentTime <= timeFrame.end;
            });

            if (!matchesTimeFrame) {
                return false;
            }
        }

        // Check user properties
        for (const [key, value] of Object.entries(targeting.userProperties)) {
            if (userContext[key] !== value) {
                return false;
            }
        }

        return true;
    }

    shouldExclude(userContext: any, excludeConditions: Record<string, any>): boolean {
        for (const [key, value] of Object.entries(excludeConditions)) {
            if (userContext[key] === value) {
                return true;
            }
        }
        return false;
    }

    assignVariant(userId: string, test: ABTestConfig): string | null {
        // Hash user ID to determine assignment
        const hash = this.hashUserId(userId);
        const percentage = (hash % 10000) / 100; // 0-100 range

        let cumulativePercentage = 0;

        // Check control first
        if (percentage < test.trafficAllocation.control) {
            return 'control';
        }
        cumulativePercentage += test.trafficAllocation.control;

        // Check variants
        for (const [variantId, allocation] of Object.entries(test.trafficAllocation.variants)) {
            if (percentage >= cumulativePercentage && percentage < cumulativePercentage + allocation) {
                return variantId;
            }
            cumulativePercentage += allocation;
        }

        return null;
    }

    private hashUserId(userId: string): number {
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
}

export default ComprehensiveABTestingFramework;
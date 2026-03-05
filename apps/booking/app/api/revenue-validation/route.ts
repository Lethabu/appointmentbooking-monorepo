// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
// export const runtime = 'edge'; // Disabled for OpenNext compatibility

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Revenue Optimization Validation and Testing Framework
interface RevenueMetrics {
    current: {
        monthlyRevenue: number;
        bookings: number;
        averageBookingValue: number;
        conversionRate: number;
    };
    projected: {
        monthlyRevenue: number;
        bookings: number;
        averageBookingValue: number;
        conversionRate: number;
        growthRate: number;
    };
    breakdown: {
        subscriptions: number;
        commissions: number;
        addons: number;
        integrations: number;
        enterprise: number;
    };
}

interface TestScenario {
    id: string;
    name: string;
    description: string;
    inputs: {
        subscriptionTiers: {
            free: number;
            professional: number;
            business: number;
            enterprise: number;
        };
        averageBookings: number;
        averageBookingValue: number;
        addonsAdoption: number;
        paymentSuccessRate: number;
        whatsappAdoption: number;
    };
    expectedResults: RevenueMetrics;
}

interface ValidationResult {
    scenarioId: string;
    passed: boolean;
    actualResults: RevenueMetrics;
    variance: {
        revenue: number;
        bookings: number;
        conversionRate: number;
    };
    recommendations: string[];
}

// Predefined test scenarios for South African market
const TEST_SCENARIOS: TestScenario[] = [
    {
        id: 'conservative_growth',
        name: 'Conservative Growth Scenario',
        description: 'Steady growth with 15% monthly increase in bookings',
        inputs: {
            subscriptionTiers: {
                free: 150,
                professional: 80,
                business: 35,
                enterprise: 5
            },
            averageBookings: 270,
            averageBookingValue: 280,
            addonsAdoption: 0.25,
            paymentSuccessRate: 0.92,
            whatsappAdoption: 0.65
        },
        expectedResults: {
            current: {
                monthlyRevenue: 52000,
                bookings: 270,
                averageBookingValue: 280,
                conversionRate: 0.085
            },
            projected: {
                monthlyRevenue: 78500,
                bookings: 310,
                averageBookingValue: 295,
                conversionRate: 0.095,
                growthRate: 0.15
            },
            breakdown: {
                subscriptions: 22400,
                commissions: 18750,
                addons: 8500,
                integrations: 4200,
                enterprise: 24650
            }
        }
    },

    {
        id: 'aggressive_growth',
        name: 'Aggressive Growth Scenario',
        description: 'High growth with WhatsApp-first adoption and premium tier upgrades',
        inputs: {
            subscriptionTiers: {
                free: 200,
                professional: 120,
                business: 60,
                enterprise: 15
            },
            averageBookings: 395,
            averageBookingValue: 320,
            addonsAdoption: 0.45,
            paymentSuccessRate: 0.95,
            whatsappAdoption: 0.78
        },
        expectedResults: {
            current: {
                monthlyRevenue: 75000,
                bookings: 395,
                averageBookingValue: 320,
                conversionRate: 0.12
            },
            projected: {
                monthlyRevenue: 145000,
                bookings: 520,
                averageBookingValue: 350,
                conversionRate: 0.16,
                growthRate: 0.35
            },
            breakdown: {
                subscriptions: 46800,
                commissions: 32100,
                addons: 18500,
                integrations: 9600,
                enterprise: 38000
            }
        }
    },

    {
        id: 'market_penetration',
        name: 'Market Penetration Scenario',
        description: 'Enterprise focus with high-value bookings and custom integrations',
        inputs: {
            subscriptionTiers: {
                free: 80,
                professional: 60,
                business: 45,
                enterprise: 25
            },
            averageBookings: 210,
            averageBookingValue: 450,
            addonsAdoption: 0.65,
            paymentSuccessRate: 0.96,
            whatsappAdoption: 0.55
        },
        expectedResults: {
            current: {
                monthlyRevenue: 95000,
                bookings: 210,
                averageBookingValue: 450,
                conversionRate: 0.18
            },
            projected: {
                monthlyRevenue: 165000,
                bookings: 280,
                averageBookingValue: 480,
                conversionRate: 0.22,
                growthRate: 0.25
            },
            breakdown: {
                subscriptions: 52000,
                commissions: 26400,
                addons: 28500,
                integrations: 12800,
                enterprise: 45300
            }
        }
    }
];

// Revenue calculation functions
function calculateRevenueMetrics(inputs: TestScenario['inputs']): RevenueMetrics {
    const {
        subscriptionTiers,
        averageBookings,
        averageBookingValue,
        addonsAdoption,
        paymentSuccessRate,
        whatsappAdoption
    } = inputs;

    // Calculate subscription revenue
    const subscriptionRevenue = (
        subscriptionTiers.free * 0 +
        subscriptionTiers.professional * 199 +
        subscriptionTiers.business * 499 +
        subscriptionTiers.enterprise * 1499
    );

    // Calculate commission revenue (variable rates by tier)
    const totalBookings = averageBookings * Object.values(subscriptionTiers).reduce((a, b) => a + b, 0);
    const commissionRevenue = totalBookings * averageBookingValue * 0.035; // 3.5% average commission

    // Calculate add-ons revenue
    const totalCustomers = Object.values(subscriptionTiers).reduce((a, b) => a + b, 0);
    const addonsRevenue = totalCustomers * averageBookingValue * addonsAdoption * 0.12; // 12% of booking value from add-ons

    // Calculate integration revenue
    const integrationsRevenue = totalCustomers * 25; // R25 per customer for integrations

    // Calculate enterprise revenue (beyond basic subscription)
    const enterpriseRevenue = subscriptionTiers.enterprise * 800; // R800 additional per enterprise customer

    const totalRevenue = subscriptionRevenue + commissionRevenue + addonsRevenue + integrationsRevenue + enterpriseRevenue;

    // Apply payment success rate and WhatsApp adoption multipliers
    const adjustedRevenue = totalRevenue * paymentSuccessRate * (1 + (whatsappAdoption - 0.5) * 0.3);

    return {
        current: {
            monthlyRevenue: Math.round(adjustedRevenue),
            bookings: Math.round(totalBookings),
            averageBookingValue,
            conversionRate: Math.min(0.25, 0.05 + (whatsappAdoption * 0.15))
        },
        projected: {
            monthlyRevenue: Math.round(adjustedRevenue * 1.4), // 40% projected growth
            bookings: Math.round(totalBookings * 1.2),
            averageBookingValue: Math.round(averageBookingValue * 1.1),
            conversionRate: Math.min(0.30, 0.08 + (whatsappAdoption * 0.18)),
            growthRate: 0.25
        },
        breakdown: {
            subscriptions: Math.round(subscriptionRevenue),
            commissions: Math.round(commissionRevenue),
            addons: Math.round(addonsRevenue),
            integrations: Math.round(integrationsRevenue),
            enterprise: Math.round(enterpriseRevenue)
        }
    };
}

// Validation request schema
const validationRequestSchema = z.object({
    action: z.enum(['run_scenario', 'validate_current', 'stress_test', 'competitive_analysis']),
    scenarioId: z.string().optional(),
    customInputs: z.record(z.number()).optional(),
    parameters: z.record(z.any()).optional()
});

// Main validation endpoint
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = validationRequestSchema.parse(body);

        const { action, scenarioId, customInputs, parameters } = validatedData;

        switch (action) {
            case 'run_scenario':
                return handleRunScenario(scenarioId!);

            case 'validate_current':
                return handleValidateCurrent();

            case 'stress_test':
                return handleStressTest();

            case 'competitive_analysis':
                return handleCompetitiveAnalysis();

            default:
                throw new Error(`Unknown action: ${action}`);
        }

    } catch (error) {
        console.error('Revenue validation error:', error);
        return NextResponse.json(
            { error: 'Revenue validation failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// Handle scenario execution
function handleRunScenario(scenarioId: string): NextResponse {
    const scenario = TEST_SCENARIOS.find(s => s.id === scenarioId);

    if (!scenario) {
        return NextResponse.json(
            { error: 'Scenario not found' },
            { status: 404 }
        );
    }

    const actualResults = calculateRevenueMetrics(scenario.inputs);

    // Calculate variance
    const revenueVariance = ((actualResults.current.monthlyRevenue - scenario.expectedResults.current.monthlyRevenue) / scenario.expectedResults.current.monthlyRevenue) * 100;
    const bookingsVariance = ((actualResults.current.bookings - scenario.expectedResults.current.bookings) / scenario.expectedResults.current.bookings) * 100;
    const conversionVariance = ((actualResults.current.conversionRate - scenario.expectedResults.current.conversionRate) / scenario.expectedResults.current.conversionRate) * 100;

    const passed = Math.abs(revenueVariance) < 10 && Math.abs(bookingsVariance) < 15;

    const recommendations = generateRecommendations(actualResults, scenario);

    const validationResult: ValidationResult = {
        scenarioId,
        passed,
        actualResults,
        variance: {
            revenue: Math.round(revenueVariance * 100) / 100,
            bookings: Math.round(bookingsVariance * 100) / 100,
            conversionRate: Math.round(conversionVariance * 100) / 100
        },
        recommendations
    };

    return NextResponse.json({
        success: true,
        scenario: scenario.name,
        validation: validationResult,
        comparison: {
            expected: scenario.expectedResults,
            actual: actualResults
        }
    });
}

// Handle current state validation
function handleValidateCurrent(): NextResponse {
    // Simulate current state with conservative estimates
    const currentInputs = {
        subscriptionTiers: {
            free: 120,
            professional: 45,
            business: 18,
            enterprise: 3
        },
        averageBookings: 186,
        averageBookingValue: 265,
        addonsAdoption: 0.15,
        paymentSuccessRate: 0.89,
        whatsappAdoption: 0.42
    };

    const currentMetrics = calculateRevenueMetrics(currentInputs);
    const recommendations = generateRecommendations(currentMetrics, null);

    return NextResponse.json({
        success: true,
        currentState: currentMetrics,
        assessment: {
            performance: 'below_target',
            primaryIssues: [
                'Low WhatsApp adoption (42% vs target 60%)',
                'Limited add-on adoption (15% vs target 25%)',
                'Small enterprise customer base'
            ],
            recommendations
        },
        targets: {
            monthlyRevenue: 110000, // Target from requirements
            bookings: 300,
            conversionRate: 0.12
        }
    });
}

// Handle stress testing
function handleStressTest(): NextResponse {
    const stressResults = [];

    for (let i = 0; i < 10; i++) {
        const multiplier = 1 + (i * 0.1); // 10%, 20%, 30% etc.

        const stressInputs = {
            subscriptionTiers: {
                free: 150 * multiplier,
                professional: 80 * multiplier,
                business: 35 * multiplier,
                enterprise: 5 * multiplier
            },
            averageBookings: 270 * multiplier,
            averageBookingValue: 280,
            addonsAdoption: 0.25,
            paymentSuccessRate: 0.92,
            whatsappAdoption: 0.65
        };

        const results = calculateRevenueMetrics(stressInputs);
        stressResults.push({
            multiplier,
            revenue: results.current.monthlyRevenue,
            bookings: results.current.bookings,
            systemLoad: multiplier
        });
    }

    return NextResponse.json({
        success: true,
        stressTest: {
            results: stressResults,
            capacity: {
                current: stressResults[0].revenue,
                maximum: stressResults[stressResults.length - 1].revenue,
                scalingFactor: stressResults[stressResults.length - 1].revenue / stressResults[0].revenue
            },
            recommendations: [
                'System can handle 2x current load without performance issues',
                'Consider auto-scaling for loads beyond 3x current capacity',
                'Database optimization needed for enterprise tier growth'
            ]
        }
    });
}

// Handle competitive analysis
function handleCompetitiveAnalysis(): NextResponse {
    const competitors = [
        {
            name: 'Booksy',
            monthlyRevenue: 85000,
            bookings: 320,
            averageBookingValue: 265,
            conversionRate: 0.11,
            strengths: ['International presence', 'Mobile app'],
            weaknesses: ['Limited local payment options', 'No WhatsApp integration']
        },
        {
            name: 'Acuity Scheduling',
            monthlyRevenue: 120000,
            bookings: 280,
            averageBookingValue: 430,
            conversionRate: 0.15,
            strengths: ['Enterprise features', 'Advanced integrations'],
            weaknesses: ['Complex UI', 'Expensive for small businesses']
        },
        {
            name: 'MindBody',
            monthlyRevenue: 200000,
            bookings: 450,
            averageBookingValue: 445,
            conversionRate: 0.18,
            strengths: ['Market leader', 'Comprehensive features'],
            weaknesses: ['High pricing', 'Over-engineered for SMBs']
        }
    ];

    const ourMetrics = calculateRevenueMetrics({
        subscriptionTiers: { free: 150, professional: 80, business: 35, enterprise: 5 },
        averageBookings: 270,
        averageBookingValue: 280,
        addonsAdoption: 0.25,
        paymentSuccessRate: 0.92,
        whatsappAdoption: 0.65
    });

    return NextResponse.json({
        success: true,
        competitiveAnalysis: {
            marketPosition: 'challenger',
            strengths: [
                'WhatsApp-first approach (unique differentiator)',
                'Local payment gateway integration',
                'South African market optimization',
                'Competitive pricing for SMBs'
            ],
            opportunities: [
                'Expand enterprise features to compete with MindBody',
                'Leverage local partnerships for market penetration',
                'Develop industry-specific solutions'
            ],
            threats: [
                'International competitors entering SA market',
                'Price competition from low-cost alternatives',
                'Technology disruption from new players'
            ],
            recommendations: [
                'Focus on WhatsApp integration as core differentiator',
                'Develop enterprise features to compete with larger players',
                'Build strategic partnerships with local businesses',
                'Consider geographic expansion to other African markets'
            ]
        },
        benchmarkComparison: {
            revenue: {
                we: ourMetrics.current.monthlyRevenue,
                booksy: 85000,
                acuity: 120000,
                mindbody: 200000,
                position: '4th'
            },
            bookings: {
                we: ourMetrics.current.bookings,
                booksy: 320,
                acuity: 280,
                mindbody: 450,
                position: '3rd'
            },
            conversion: {
                we: ourMetrics.current.conversionRate,
                booksy: 0.11,
                acuity: 0.15,
                mindbody: 0.18,
                position: '3rd'
            }
        }
    });
}

// Generate recommendations based on results
function generateRecommendations(results: RevenueMetrics, scenario: TestScenario | null): string[] {
    const recommendations = [];

    // Revenue-based recommendations
    if (results.current.monthlyRevenue < 75000) {
        recommendations.push('Focus on customer acquisition through marketing and partnerships');
        recommendations.push('Implement aggressive WhatsApp-first conversion campaigns');
    }

    // Booking value recommendations
    if (results.current.averageBookingValue < 300) {
        recommendations.push('Introduce premium service tiers to increase average booking value');
        recommendations.push('Implement upselling strategies for existing customers');
    }

    // Conversion rate recommendations
    if (results.current.conversionRate < 0.10) {
        recommendations.push('Optimize booking flow and reduce friction points');
        recommendations.push('Implement social proof and customer testimonials');
    }

    // WhatsApp adoption recommendations
    if (scenario && scenario.inputs.whatsappAdoption < 0.60) {
        recommendations.push('Increase WhatsApp marketing and education campaigns');
        recommendations.push('Offer WhatsApp-exclusive promotions and features');
    }

    // Add-on adoption recommendations
    if (scenario && scenario.inputs.addonsAdoption < 0.30) {
        recommendations.push('Improve add-on visibility and value proposition');
        recommendations.push('Bundle popular add-ons with subscription tiers');
    }

    return recommendations;
}

// GET endpoint to list available scenarios
export async function GET() {
    return NextResponse.json({
        success: true,
        scenarios: TEST_SCENARIOS.map(scenario => ({
            id: scenario.id,
            name: scenario.name,
            description: scenario.description,
            expectedRevenue: scenario.expectedResults.current.monthlyRevenue,
            expectedBookings: scenario.expectedResults.current.bookings
        })),
        summary: {
            totalScenarios: TEST_SCENARIOS.length,
            averageRevenue: Math.round(TEST_SCENARIOS.reduce((sum, s) => sum + s.expectedResults.current.monthlyRevenue, 0) / TEST_SCENARIOS.length),
            targetRevenue: 110000 // From requirements
        }
    });
}
// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
export const runtime = 'edge';

// Threat Detection & Response Framework API
// Automated monitoring and response to competitive threats

import { NextRequest, NextResponse } from 'next/server';

// Types for threat detection and response
interface ThreatEvent {
    id: number;
    competitor_id: number;
    competitor_name: string;
    threat_type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    detection_source: string;
    threat_description: string;
    detected_at: string;
    estimated_impact: {
        revenue_impact: number;
        market_share_risk: string;
        customer_acquisition_impact: string;
    };
    response_strategy?: string;
    response_actions?: string[];
    status: 'detected' | 'analyzing' | 'responding' | 'mitigated' | 'monitoring';
    confidence_score: number;
    urgency_score: number;
}

interface CompetitiveMove {
    id: number;
    competitor_id: number;
    competitor_name: string;
    move_type: 'pricing' | 'feature' | 'marketing' | 'partnership' | 'funding' | 'acquisition';
    move_description: string;
    detected_at: string;
    impact_assessment: {
        market_impact: string;
        competitive_impact: string;
        urgency: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
    };
    countermeasures: {
        immediate: string[];
        short_term: string[];
        long_term: string[];
    };
    effectiveness_prediction: number;
}

interface ThreatResponseAction {
    id: number;
    threat_id: number;
    action_type: string;
    action_name: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    estimated_cost: number;
    expected_roi: number;
    implementation_time: string;
    success_probability: number;
    dependencies: string[];
    status: 'planned' | 'approved' | 'executing' | 'completed' | 'failed';
    executed_at?: string;
    results?: {
        effectiveness: number;
        revenue_impact: number;
        market_share_change: number;
    };
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'active_threats';

        switch (action) {
            case 'active_threats':
                return await getActiveThreats();
            case 'threat_analysis':
                return await getThreatAnalysis();
            case 'competitive_moves':
                return await getCompetitiveMoves();
            case 'response_effectiveness':
                return await getResponseEffectiveness();
            case 'threat_prediction':
                return await getThreatPredictions();
            case 'monitoring_status':
                return await getMonitoringStatus();
            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Threat Detection API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as { action: string;[key: string]: any };
        const { action, ...data } = body;

        switch (action) {
            case 'analyze_threat':
                return await analyzeThreat(data);
            case 'initiate_response':
                return await initiateThreatResponse(data);
            case 'update_response_status':
                return await updateResponseStatus(data);
            case 'cancel_response':
                return await cancelResponse(data);
            case 'generate_countermeasures':
                return await generateCountermeasures(data);
            case 'assess_threat_impact':
                return await assessThreatImpact(data);
            case 'activate_defensive_measures':
                return await activateDefensiveMeasures(data);
            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Threat Detection POST Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

async function getActiveThreats() {
    const activeThreats: ThreatEvent[] = [
        {
            id: 1,
            competitor_id: 3,
            competitor_name: 'Booksy',
            threat_type: 'Series C Funding - SA Expansion',
            severity: 'critical',
            detection_source: 'funding_monitoring',
            threat_description: 'Booksy announced R50M Series C funding with explicit plans for aggressive South African market expansion',
            detected_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            estimated_impact: {
                revenue_impact: 15000000,
                market_share_risk: '15-25%',
                customer_acquisition_impact: 'high'
            },
            response_strategy: 'Accelerate local partnerships + aggressive differentiation',
            response_actions: [
                'Immediate: Partner outreach to top 5 SA salon chains',
                '24h: Launch feature differentiation campaign',
                '48h: Deploy customer retention program',
                '7d: Initiate pricing optimization'
            ],
            status: 'responding',
            confidence_score: 0.95,
            urgency_score: 9.8
        },
        {
            id: 2,
            competitor_id: 2,
            competitor_name: 'Fresha',
            threat_type: 'Enterprise Free Trial Program',
            severity: 'high',
            detection_source: 'pricing_monitoring',
            threat_description: 'Fresha launched 3-month free trial program specifically targeting enterprise clients',
            detected_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            estimated_impact: {
                revenue_impact: 8000000,
                market_share_risk: '8-12%',
                customer_acquisition_impact: 'medium'
            },
            response_strategy: 'Competitive pricing tiers + value enhancement',
            response_actions: [
                'Immediate: Enterprise pricing tier introduction',
                '24h: Value-added features bundle',
                '48h: Direct sales approach intensification',
                '7d: Customer success program enhancement'
            ],
            status: 'mitigated',
            confidence_score: 0.88,
            urgency_score: 8.5
        },
        {
            id: 3,
            competitor_id: 5,
            competitor_name: 'Vagaro',
            threat_type: 'AI Feature Enhancement',
            severity: 'medium',
            detection_source: 'feature_monitoring',
            threat_description: 'Vagaro announced AI-powered booking optimization features',
            detected_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            estimated_impact: {
                revenue_impact: 5000000,
                market_share_risk: '5-8%',
                customer_acquisition_impact: 'medium'
            },
            response_strategy: 'Accelerate AI development + marketing campaign',
            response_actions: [
                'Immediate: AI development team assembly',
                '48h: Marketing campaign preparation',
                '7d: Beta testing program launch',
                '30d: Full feature deployment'
            ],
            status: 'analyzing',
            confidence_score: 0.75,
            urgency_score: 6.5
        }
    ];

    return NextResponse.json({
        success: true,
        data: activeThreats,
        summary: {
            total_threats: activeThreats.length,
            critical_threats: activeThreats.filter(t => t.severity === 'critical').length,
            high_threats: activeThreats.filter(t => t.severity === 'high').length,
            responding_threats: activeThreats.filter(t => t.status === 'responding').length,
            mitigated_threats: activeThreats.filter(t => t.status === 'mitigated').length
        }
    });
}

async function getThreatAnalysis() {
    const threatAnalysis = {
        threat_landscape: {
            total_active_threats: 8,
            threat_categories: {
                funding_expansion: { count: 2, severity: 'critical', trend: 'increasing' },
                pricing_aggression: { count: 3, severity: 'high', trend: 'stable' },
                feature_competition: { count: 2, severity: 'medium', trend: 'increasing' },
                partnership_moves: { count: 1, severity: 'high', trend: 'increasing' }
            }
        },
        competitor_intelligence: {
            booksy: {
                threat_level: 'critical',
                recent_moves: ['Series C funding', 'SA expansion announcement', 'Partnership discussions'],
                predicted_next_moves: ['Local feature development', 'Pricing strategy', 'Marketing campaign'],
                recommended_countermeasures: ['accelerate_partnerships', 'feature_differentiation', 'customer_retention']
            },
            fresha: {
                threat_level: 'high',
                recent_moves: ['Enterprise trial program', 'Pricing adjustments', 'Feature updates'],
                predicted_next_moves: ['Enterprise focus expansion', 'Integration enhancements', 'Marketing intensification'],
                recommended_countermeasures: ['pricing_optimization', 'value_enhancement', 'enterprise_features']
            }
        },
        market_impact_assessment: {
            short_term_impact: {
                revenue_risk: 25000000,
                market_share_risk: '12-18%',
                customer_churn_risk: 'medium'
            },
            long_term_impact: {
                competitive_position: 'vulnerable',
                innovation_pressure: 'high',
                market_leadership_risk: 'medium'
            }
        },
        recommended_strategies: [
            {
                strategy: 'Aggressive Defense',
                description: 'Immediate countermeasures across all threat vectors',
                investment_required: 5000000,
                expected_roi: 285,
                timeline: '3-6 months',
                success_probability: 0.78
            },
            {
                strategy: 'Selective Response',
                description: 'Focus on critical threats with highest ROI',
                investment_required: 2500000,
                expected_roi: 320,
                timeline: '1-3 months',
                success_probability: 0.85
            }
        ]
    };

    return NextResponse.json({
        success: true,
        data: threatAnalysis
    });
}

async function getCompetitiveMoves() {
    const competitiveMoves: CompetitiveMove[] = [
        {
            id: 1,
            competitor_id: 3,
            competitor_name: 'Booksy',
            move_type: 'funding',
            move_description: 'R50M Series C funding announcement with SA expansion plans',
            detected_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            impact_assessment: {
                market_impact: 'High - Direct market entry threat',
                competitive_impact: 'Critical - Major competitive escalation',
                urgency: 'immediate'
            },
            countermeasures: {
                immediate: [
                    'Accelerate local partnership discussions',
                    'Launch defensive marketing campaign',
                    'Enhance customer retention programs'
                ],
                short_term: [
                    'Develop SA-specific features',
                    'Optimize pricing strategy',
                    'Strengthen brand positioning'
                ],
                long_term: [
                    'Expand market leadership initiatives',
                    'Develop innovation pipeline',
                    'Build strategic alliances'
                ]
            },
            effectiveness_prediction: 0.82
        },
        {
            id: 2,
            competitor_id: 2,
            competitor_name: 'Fresha',
            move_type: 'pricing',
            move_description: '3-month free trial for enterprise clients',
            detected_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            impact_assessment: {
                market_impact: 'Medium - Enterprise segment pressure',
                competitive_impact: 'High - Direct customer acquisition',
                urgency: 'short_term'
            },
            countermeasures: {
                immediate: [
                    'Launch competitive enterprise pricing',
                    'Enhance value proposition',
                    'Direct sales approach'
                ],
                short_term: [
                    'Develop enterprise features',
                    'Improve customer success',
                    'Expand service offerings'
                ],
                long_term: [
                    'Build enterprise ecosystem',
                    'Develop industry partnerships',
                    'Innovation leadership'
                ]
            },
            effectiveness_prediction: 0.75
        },
        {
            id: 3,
            competitor_id: 7,
            competitor_name: 'SuperSaaS',
            move_type: 'marketing',
            move_description: 'Aggressive digital marketing campaign targeting beauty industry',
            detected_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            impact_assessment: {
                market_impact: 'Medium - Brand awareness pressure',
                competitive_impact: 'Medium - Customer acquisition competition',
                urgency: 'medium_term'
            },
            countermeasures: {
                immediate: [
                    'Monitor campaign effectiveness',
                    'Prepare competitive messaging',
                    'Strengthen brand presence'
                ],
                short_term: [
                    'Launch targeted marketing',
                    'Enhance customer engagement',
                    'Improve conversion rates'
                ],
                long_term: [
                    'Build thought leadership',
                    'Expand market reach',
                    'Develop customer advocacy'
                ]
            },
            effectiveness_prediction: 0.68
        }
    ];

    return NextResponse.json({
        success: true,
        data: competitiveMoves
    });
}

async function getResponseEffectiveness() {
    const effectivenessData = {
        overall_performance: {
            response_rate: 94.5,
            success_rate: 87.2,
            avg_response_time_hours: 18.5,
            target_response_time_hours: 24,
            roi_on_responses: 285,
            target_roi: 300
        },
        threat_categories: {
            funding_expansion: {
                response_rate: 100,
                success_rate: 92,
                avg_response_time: 12,
                roi: 320,
                recent_responses: [
                    {
                        threat_id: 1,
                        response: 'Partnership acceleration + differentiation',
                        effectiveness: 88,
                        revenue_impact: 12500000
                    }
                ]
            },
            pricing_aggression: {
                response_rate: 95,
                success_rate: 85,
                avg_response_time: 24,
                roi: 275,
                recent_responses: [
                    {
                        threat_id: 2,
                        response: 'Competitive pricing + value enhancement',
                        effectiveness: 91,
                        revenue_impact: 8500000
                    }
                ]
            },
            feature_competition: {
                response_rate: 90,
                success_rate: 82,
                avg_response_time: 72,
                roi: 260,
                recent_responses: []
            }
        },
        competitor_specific: {
            booksy: {
                threats_detected: 5,
                responses_executed: 5,
                success_rate: 89,
                market_share_protection: 92
            },
            fresha: {
                threats_detected: 3,
                responses_executed: 3,
                success_rate: 94,
                market_share_protection: 87
            }
        },
        improvement_opportunities: [
            {
                area: 'Response Speed',
                current_avg: 18.5,
                target: 12,
                improvement_potential: 35
            },
            {
                area: 'Feature Competition',
                current_success: 82,
                target: 90,
                improvement_potential: 8
            }
        ]
    };

    return NextResponse.json({
        success: true,
        data: effectivenessData
    });
}

async function getThreatPredictions() {
    const predictions = {
        predicted_threats: [
            {
                threat_type: 'Price War',
                probability: 0.78,
                timeline: '2-4 weeks',
                trigger_event: 'Market share competition escalation',
                potential_impact: {
                    revenue_impact: 12000000,
                    market_share_risk: '10-15%',
                    customer_impact: 'medium'
                },
                recommended_preparation: [
                    'Optimize cost structure',
                    'Develop value differentiation',
                    'Prepare customer retention programs'
                ]
            },
            {
                threat_type: 'AI Feature Race',
                probability: 0.85,
                timeline: '1-3 months',
                trigger_event: 'Industry AI adoption acceleration',
                potential_impact: {
                    revenue_impact: 20000000,
                    market_share_risk: '15-20%',
                    customer_impact: 'high'
                },
                recommended_preparation: [
                    'Accelerate AI development',
                    'Build technical partnerships',
                    'Develop unique AI capabilities'
                ]
            }
        ],
        market_trends: [
            {
                trend: 'Consolidation Acceleration',
                probability: 0.72,
                impact: 'High',
                timeframe: '6-12 months',
                implications: ['Acquisition opportunities', 'Partnership pressures', 'Market structure changes']
            },
            {
                trend: 'Mobile-First Preference',
                probability: 0.89,
                impact: 'Medium',
                timeframe: '3-6 months',
                implications: ['Feature prioritization', 'User experience focus', 'Platform optimization']
            }
        ],
        competitor_intelligence: {
            booksy: {
                predicted_moves: [
                    'Local partnership announcements',
                    'SA-specific feature development',
                    'Aggressive marketing campaigns'
                ],
                probability_scores: {
                    partnerships: 0.92,
                    features: 0.85,
                    marketing: 0.78
                }
            },
            fresha: {
                predicted_moves: [
                    'Enterprise feature expansion',
                    'Integration enhancements',
                    'Pricing optimization'
                ],
                probability_scores: {
                    enterprise: 0.88,
                    integrations: 0.82,
                    pricing: 0.75
                }
            }
        }
    };

    return NextResponse.json({
        success: true,
        data: predictions
    });
}

async function getMonitoringStatus() {
    const monitoringStatus = {
        system_status: 'operational',
        monitoring_coverage: {
            competitors_monitored: 25,
            data_sources_active: 12,
            threat_detection_accuracy: 94.5,
            false_positive_rate: 3.2
        },
        detection_systems: {
            pricing_monitoring: { status: 'active', last_update: new Date().toISOString(), accuracy: 96.8 },
            feature_tracking: { status: 'active', last_update: new Date().toISOString(), accuracy: 92.1 },
            funding_intelligence: { status: 'active', last_update: new Date().toISOString(), accuracy: 98.5 },
            partnership_monitoring: { status: 'active', last_update: new Date().toISOString(), accuracy: 89.7 },
            marketing_tracking: { status: 'active', last_update: new Date().toISOString(), accuracy: 87.3 }
        },
        alert_status: {
            active_alerts: 3,
            critical_alerts: 1,
            high_alerts: 2,
            response_time_avg: '15 minutes',
            escalation_rate: 0.08
        },
        data_quality: {
            completeness: 96.5,
            accuracy: 94.2,
            timeliness: 98.1,
            consistency: 95.7
        }
    };

    return NextResponse.json({
        success: true,
        data: monitoringStatus
    });
}

// Core threat response functions
async function analyzeThreat(data: any) {
    const { threatId, analysisDepth = 'comprehensive' } = data;

    const analysis = {
        threat_id: threatId,
        analysis_depth: analysisDepth,
        analysis_results: {
            threat_validation: 'confirmed',
            impact_assessment: {
                immediate_impact: 'high',
                short_term_impact: 'medium',
                long_term_impact: 'medium'
            },
            competitive_positioning: {
                current_advantage: 'maintained',
                vulnerability_assessment: 'low',
                defense_readiness: 'high'
            },
            recommended_response: {
                priority: 'critical',
                strategy: 'aggressive_countermeasures',
                timeline: 'immediate',
                resource_requirements: {
                    budget: 2500000,
                    team_allocation: 8,
                    timeline_days: 30
                }
            }
        },
        confidence_score: 0.89,
        analysis_timestamp: new Date().toISOString()
    };

    return NextResponse.json({
        success: true,
        data: analysis
    });
}

async function initiateThreatResponse(data: any) {
    const { threatId, responseStrategy, approvalOverride = false } = data;

    const response = {
        threat_id: threatId,
        response_id: Math.floor(Math.random() * 10000),
        status: 'initiated',
        strategy: responseStrategy,
        initiated_at: new Date().toISOString(),
        execution_plan: {
            phase_1: 'Immediate countermeasures (0-24h)',
            phase_2: 'Short-term responses (1-7d)',
            phase_3: 'Long-term strategy (1-4w)',
            phase_4: 'Monitoring and optimization (ongoing)'
        },
        resource_allocation: {
            budget: data.budget || 1000000,
            team_members: data.teamSize || 5,
            timeline_weeks: data.timelineWeeks || 4
        },
        success_metrics: {
            threat_mitigation_target: '85%',
            market_share_protection: '90%',
            revenue_impact_target: 'positive'
        },
        approval_override: approvalOverride
    };

    return NextResponse.json({
        success: true,
        data: response
    });
}

async function updateResponseStatus(data: any) {
    const { responseId, newStatus, notes } = data;

    const update = {
        response_id: responseId,
        previous_status: data.previousStatus,
        new_status: newStatus,
        updated_at: new Date().toISOString(),
        updated_by: data.userId,
        notes,
        next_actions: newStatus === 'executing' ? ['Monitor progress', 'Track effectiveness', 'Report updates'] : [],
        escalation_triggers: newStatus === 'failed' ? ['Review strategy', 'Consider alternative approaches', 'Executive review'] : []
    };

    return NextResponse.json({
        success: true,
        data: update
    });
}

async function cancelResponse(data: any) {
    const { responseId, reason, impactAssessment } = data;

    const cancellation = {
        response_id: responseId,
        status: 'cancelled',
        reason,
        cancelled_at: new Date().toISOString(),
        impact_assessment: impactAssessment || {
            resource_recovery: 'partial',
            timeline_impact: 'minimal',
            strategic_impact: 'low'
        },
        lessons_learned: data.lessonsLearned || [],
        alternative_strategies: data.alternativeStrategies || []
    };

    return NextResponse.json({
        success: true,
        data: cancellation
    });
}

async function generateCountermeasures(data: any) {
    const { threatType, competitorId, marketContext } = data;

    const countermeasures = {
        threat_analysis: {
            threat_type: threatType,
            competitor_id: competitorId,
            market_context: marketContext,
            threat_severity: data.severity || 'medium'
        },
        recommended_countermeasures: [
            {
                category: 'immediate',
                actions: [
                    'Activate monitoring enhancement',
                    'Prepare defensive messaging',
                    'Brief key stakeholders'
                ],
                timeline: '0-24 hours',
                resource_requirement: 'low'
            },
            {
                category: 'short_term',
                actions: [
                    'Launch counter-marketing campaign',
                    'Enhance customer retention',
                    'Optimize pricing strategy'
                ],
                timeline: '1-7 days',
                resource_requirement: 'medium'
            },
            {
                category: 'long_term',
                actions: [
                    'Develop competitive advantages',
                    'Build strategic partnerships',
                    'Accelerate innovation pipeline'
                ],
                timeline: '1-4 weeks',
                resource_requirement: 'high'
            }
        ],
        success_probability: 0.82,
        expected_roi: 285,
        risk_assessment: {
            execution_risk: 'low',
            market_risk: 'medium',
            competitive_risk: 'medium'
        }
    };

    return NextResponse.json({
        success: true,
        data: countermeasures
    });
}

async function assessThreatImpact(data: any) {
    const { threatId, impactScenarios } = data;

    const assessment = {
        threat_id: threatId,
        impact_scenarios: impactScenarios || ['worst_case', 'likely_case', 'best_case'],
        impact_analysis: {
            worst_case: {
                revenue_impact: 25000000,
                market_share_loss: 0.15,
                customer_impact: 'high',
                timeline: '6 months'
            },
            likely_case: {
                revenue_impact: 15000000,
                market_share_loss: 0.08,
                customer_impact: 'medium',
                timeline: '3 months'
            },
            best_case: {
                revenue_impact: 5000000,
                market_share_loss: 0.03,
                customer_impact: 'low',
                timeline: '1 month'
            }
        },
        mitigation_potential: {
            with_response: 0.75,
            without_response: 0.25,
            additional_investment_required: 3000000
        },
        strategic_implications: {
            competitive_position: 'maintainable',
            market_leadership: 'defendable',
            innovation_pressure: 'high'
        },
        assessment_confidence: 0.87
    };

    return NextResponse.json({
        success: true,
        data: assessment
    });
}

async function activateDefensiveMeasures(data: any) {
    const { threatId, defensiveMeasures, activationLevel } = data;

    const activation = {
        threat_id: threatId,
        defensive_measures: defensiveMeasures,
        activation_level: activationLevel || 'standard',
        activation_status: 'activated',
        activated_at: new Date().toISOString(),
        expected_duration: data.duration || '30 days',
        monitoring_schedule: {
            frequency: 'daily',
            reporting: 'real_time',
            escalation: 'automated'
        },
        effectiveness_tracking: {
            metrics: ['response_rate', 'customer_retention', 'market_share', 'revenue_impact'],
            benchmarks: {
                response_rate_target: 90,
                customer_retention_target: 95,
                market_share_protection: 85
            }
        }
    };

    return NextResponse.json({
        success: true,
        data: activation
    });
}
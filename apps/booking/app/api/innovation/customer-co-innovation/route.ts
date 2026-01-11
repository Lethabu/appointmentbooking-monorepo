// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getCustomerFeedback, getCustomerNeedsAnalysis } from '@/lib/customer-feedback';

interface CustomerCoInnovationSession {
    id: string;
    innovation_idea_id: string;
    customer_id: string;
    business_type: string;
    session_type: 'feedback_loop' | 'prototyping' | 'testing' | 'validation';
    status: 'scheduled' | 'active' | 'completed' | 'cancelled';
    feedback_data: {
        feature_rating: number;
        usability_score: number;
        business_impact: number;
        implementation_priority: number;
        comments: string[];
        suggestions: string[];
    };
    prototyping_data: {
        prototype_version: string;
        features_tested: string[];
        user_journey: any;
        pain_points: string[];
        improvement_areas: string[];
    };
    validation_results: {
        success_criteria_met: boolean;
        customer_satisfaction: number;
        business_readiness: number;
        technical_feasibility: number;
        market_timing: number;
    };
    created_at: string;
    updated_at: string;
    scheduled_date: string;
    completed_date?: string;
}

interface RapidPrototypingRequest {
    idea_id: string;
    customer_segment: string;
    prototype_type: 'concept' | 'wireframe' | 'interactive' | 'functional';
    features_to_test: string[];
    success_criteria: string[];
    timeline_days: number;
    customer_involvement_level: 'low' | 'medium' | 'high';
}

class CustomerCoInnovationEngine {
    private activeSessions: Map<string, CustomerCoInnovationSession> = new Map();

    async createFeedbackLoop(ideaId: string, customerSegment: string): Promise<CustomerCoInnovationSession> {
        const sessionId = this.generateSessionId();

        // Get customer feedback data for this segment
        const feedbackData = await getCustomerFeedback();
        const segmentFeedback = feedbackData.feedback_data.filter(
            feedback => feedback.business_type === customerSegment
        );

        const session: CustomerCoInnovationSession = {
            id: sessionId,
            innovation_idea_id: ideaId,
            customer_id: segmentFeedback[0]?.customer_id || 'demo_customer',
            business_type: customerSegment,
            session_type: 'feedback_loop',
            status: 'scheduled',
            feedback_data: {
                feature_rating: 0,
                usability_score: 0,
                business_impact: 0,
                implementation_priority: 0,
                comments: [],
                suggestions: []
            },
            prototyping_data: {
                prototype_version: 'v1.0',
                features_tested: [],
                user_journey: {},
                pain_points: [],
                improvement_areas: []
            },
            validation_results: {
                success_criteria_met: false,
                customer_satisfaction: 0,
                business_readiness: 0,
                technical_feasibility: 0,
                market_timing: 0
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        };

        this.activeSessions.set(sessionId, session);
        return session;
    }

    async initiateRapidPrototyping(request: RapidPrototypingRequest): Promise<{
        prototype_id: string;
        estimated_completion: string;
        customer_involvement_plan: any;
        development_stages: any[];
    }> {
        const prototypeId = this.generatePrototypeId();

        // Generate development stages based on prototype type
        const stages = this.generateDevelopmentStages(request);

        // Create customer involvement plan
        const involvementPlan = this.createCustomerInvolvementPlan(request);

        const estimatedCompletion = new Date(
            Date.now() + request.timeline_days * 24 * 60 * 60 * 1000
        ).toISOString();

        return {
            prototype_id: prototypeId,
            estimated_completion: estimatedCompletion,
            customer_involvement_plan: involvementPlan,
            development_stages: stages
        };
    }

    async collectCustomerFeedback(sessionId: string, feedback: any): Promise<CustomerCoInnovationSession> {
        const session = this.activeSessions.get(sessionId);

        if (!session) {
            throw new Error('Session not found');
        }

        // Update session with new feedback
        session.feedback_data = {
            ...session.feedback_data,
            ...feedback,
            comments: [...session.feedback_data.comments, ...(feedback.comments || [])],
            suggestions: [...session.feedback_data.suggestions, ...(feedback.suggestions || [])]
        };

        session.updated_at = new Date().toISOString();

        // Auto-analyze feedback and suggest improvements
        const insights = await this.analyzeFeedback(session);
        session.feedback_data.suggestions.push(...insights);

        this.activeSessions.set(sessionId, session);
        return session;
    }

    async validatePrototype(sessionId: string, validationData: any): Promise<CustomerCoInnovationSession> {
        const session = this.activeSessions.get(sessionId);

        if (!session) {
            throw new Error('Session not found');
        }

        // Update validation results
        session.validation_results = {
            ...session.validation_results,
            ...validationData,
            success_criteria_met: this.evaluateSuccessCriteria(session, validationData)
        };

        session.status = 'completed';
        session.completed_date = new Date().toISOString();
        session.updated_at = new Date().toISOString();

        this.activeSessions.set(sessionId, session);
        return session;
    }

    async getCustomerInnovationInsights(customerSegment?: string): Promise<{
        total_sessions: number;
        satisfaction_score: number;
        top_feature_requests: any[];
        innovation_opportunities: any[];
        customer_readiness: number;
    }> {
        const sessions = Array.from(this.activeSessions.values());

        // Filter by customer segment if specified
        const relevantSessions = customerSegment
            ? sessions.filter(s => s.business_type === customerSegment)
            : sessions;

        // Calculate metrics
        const totalSessions = relevantSessions.length;
        const avgSatisfaction = relevantSessions.reduce(
            (sum, s) => sum + s.validation_results.customer_satisfaction, 0
        ) / Math.max(totalSessions, 1);

        // Aggregate feature requests
        const allRequests = relevantSessions.flatMap(s => s.feedback_data.suggestions);
        const requestCounts = allRequests.reduce((acc, request) => {
            acc[request] = (acc[request] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topRequests = Object.entries(requestCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([request, count]) => ({ request, count }));

        // Calculate innovation opportunities
        const opportunities = relevantSessions
            .filter(s => s.validation_results.success_criteria_met)
            .map(s => ({
                opportunity: s.innovation_idea_id,
                customer_satisfaction: s.validation_results.customer_satisfaction,
                business_readiness: s.validation_results.business_readiness
            }));

        // Customer readiness score
        const customerReadiness = relevantSessions.reduce(
            (sum, s) => sum + s.validation_results.business_readiness, 0
        ) / Math.max(totalSessions, 1);

        return {
            total_sessions: totalSessions,
            satisfaction_score: avgSatisfaction,
            top_feature_requests: topRequests,
            innovation_opportunities: opportunities,
            customer_readiness: customerReadiness
        };
    }

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generatePrototypeId(): string {
        return `prototype_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateDevelopmentStages(request: RapidPrototypingRequest): any[] {
        const baseStages = {
            'concept': [
                { name: 'Concept Definition', duration_days: 2, deliverables: ['Concept document', 'User stories'] },
                { name: 'Design Mockups', duration_days: 3, deliverables: ['Wireframes', 'User flow'] },
                { name: 'Customer Review', duration_days: 1, deliverables: ['Feedback collection', 'Revisions'] }
            ],
            'wireframe': [
                { name: 'Wireframe Creation', duration_days: 3, deliverables: ['Wireframes', 'Interaction design'] },
                { name: 'Customer Testing', duration_days: 2, deliverables: ['Usability testing', 'Feedback analysis'] },
                { name: 'Iteration', duration_days: 2, deliverables: ['Revised wireframes', 'Approval'] }
            ],
            'interactive': [
                { name: 'Prototype Development', duration_days: 5, deliverables: ['Interactive prototype', 'Navigation'] },
                { name: 'Customer Validation', duration_days: 3, deliverables: ['User testing', 'Performance metrics'] },
                { name: 'Optimization', duration_days: 2, deliverables: ['Performance improvements', 'Final approval'] }
            ],
            'functional': [
                { name: 'Core Development', duration_days: 7, deliverables: ['MVP features', 'Core functionality'] },
                { name: 'Integration Testing', duration_days: 3, deliverables: ['System integration', 'Customer testing'] },
                { name: 'Deployment Prep', duration_days: 2, deliverables: ['Production readiness', 'Launch plan'] }
            ]
        };

        return baseStages[request.prototype_type] || baseStages['concept'];
    }

    private createCustomerInvolvementPlan(request: RapidPrototypingRequest): any {
        const involvementLevels = {
            'low': {
                activities: ['Initial feedback', 'Final approval'],
                frequency: 'Weekly check-ins',
                commitment: '2-3 hours per week'
            },
            'medium': {
                activities: ['Design review', 'Testing sessions', 'Feedback iterations'],
                frequency: 'Twice weekly',
                commitment: '4-5 hours per week'
            },
            'high': {
                activities: ['Co-design', 'Daily standups', 'Real-time testing', 'Feature prioritization'],
                frequency: 'Daily collaboration',
                commitment: '8-10 hours per week'
            }
        };

        return {
            involvement_level: request.customer_involvement_level,
            plan: involvementLevels[request.customer_involvement_level],
            expected_outcomes: this.getExpectedOutcomes(request),
            success_metrics: this.getSuccessMetrics(request)
        };
    }

    private getExpectedOutcomes(request: RapidPrototypingRequest): string[] {
        const outcomes = {
            'concept': ['Clear feature definition', 'User validation', 'Development roadmap'],
            'wireframe': ['Validated user experience', 'Interaction clarity', 'Technical feasibility'],
            'interactive': ['Functional validation', 'Performance feedback', 'User adoption prediction'],
            'functional': ['Production-ready feature', 'Customer satisfaction', 'Market readiness']
        };

        return outcomes[request.prototype_type] || outcomes['concept'];
    }

    private getSuccessMetrics(request: RapidPrototypingRequest): string[] {
        return [
            'Customer satisfaction score > 4.0/5.0',
            'Feature adoption rate > 80%',
            'User engagement increase > 25%',
            'Business impact validation',
            'Technical feasibility confirmed'
        ];
    }

    private async analyzeFeedback(session: CustomerCoInnovationSession): Promise<string[]> {
        const insights: string[] = [];

        // Analyze feedback patterns
        if (session.feedback_data.feature_rating < 3.0) {
            insights.push('Consider simplifying core features based on low rating');
        }

        if (session.feedback_data.usability_score < 3.5) {
            insights.push('Focus on user experience improvements for better usability');
        }

        if (session.validation_results.customer_satisfaction < 4.0) {
            insights.push('Enhance customer value proposition to improve satisfaction');
        }

        // Suggest improvements based on business type
        const businessImprovements = this.getBusinessTypeImprovements(session.business_type);
        insights.push(...businessImprovements);

        return insights;
    }

    private getBusinessTypeImprovements(businessType: string): string[] {
        const improvements = {
            'salon': ['Mobile-first design', 'Quick booking flow', 'Staff management integration'],
            'spa': ['Wellness tracking', 'Package management', 'Relaxation-focused UI'],
            'mobile_service': ['Location services', 'Route optimization', 'Mobile payments'],
            'beauty_center': ['Multi-location support', 'Enterprise features', 'Advanced analytics'],
            'nail_salon': ['Design gallery', 'Color matching', 'Appointment sequencing']
        };

        return improvements[businessType as keyof typeof improvements] || ['General UX improvements'];
    }

    private evaluateSuccessCriteria(session: CustomerCoInnovationSession, validationData: any): boolean {
        // Evaluate if all success criteria are met
        return (
            validationData.customer_satisfaction >= 4.0 &&
            validationData.business_readiness >= 4.0 &&
            validationData.technical_feasibility >= 4.0 &&
            session.feedback_data.usability_score >= 3.5
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const customerSegment = searchParams.get('segment');

        const engine = new CustomerCoInnovationEngine();

        if (action === 'insights') {
            const insights = await engine.getCustomerInnovationInsights(customerSegment || undefined);

            return NextResponse.json({
                success: true,
                data: insights
            });
        }

        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'INVALID_ACTION',
                    message: 'Invalid action specified'
                }
            },
            { status: 400 }
        );
    } catch (error) {
        console.error('Error in customer co-innovation:', error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'CO_INNOVATION_ERROR',
                    message: 'Failed to process customer co-innovation request'
                }
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as { action: string;[key: string]: any };
        const { action, ...data } = body;

        const engine = new CustomerCoInnovationEngine();

        switch (action) {
            case 'create_feedback_loop':
                const session = await engine.createFeedbackLoop(data.idea_id, data.customer_segment);
                return NextResponse.json({
                    success: true,
                    data: session
                });

            case 'initiate_prototyping':
                const prototype = await engine.initiateRapidPrototyping(data as RapidPrototypingRequest);
                return NextResponse.json({
                    success: true,
                    data: prototype
                });

            case 'collect_feedback':
                const updatedSession = await engine.collectCustomerFeedback(data.session_id, data.feedback);
                return NextResponse.json({
                    success: true,
                    data: updatedSession
                });

            case 'validate_prototype':
                const validatedSession = await engine.validatePrototype(data.session_id, data.validation);
                return NextResponse.json({
                    success: true,
                    data: validatedSession
                });

            default:
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: 'INVALID_ACTION',
                            message: 'Invalid action specified'
                        }
                    },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in customer co-innovation POST:', error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'CO_INNOVATION_ERROR',
                    message: 'Failed to process customer co-innovation request'
                }
            },
            { status: 500 }
        );
    }
}
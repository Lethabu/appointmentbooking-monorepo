/**
 * Competitive Intelligence System Integration
 * Connects innovation pipeline with existing competitive intelligence data
 */

interface CompetitorData {
    id: string;
    name: string;
    market_share: number;
    features: string[];
    features_missing: string[];
    pricing_strategy: string;
    pricing_weakness?: string;
    technology_gap?: string;
    innovation_frequency: number;
    last_innovation_date: string;
    threat_level: 'low' | 'medium' | 'high' | 'critical';
    market_position: number;
    financial_strength: number;
    technology_maturity: number;
    customer_satisfaction: number;
    partnerships: string[];
    weaknesses: string[];
    opportunities: string[];
}

interface MarketOpportunity {
    id: string;
    title: string;
    description: string;
    market_size: number;
    addressable_market: number;
    growth_rate: number;
    competition_level: 'low' | 'medium' | 'high';
    barrier_to_entry: 'low' | 'medium' | 'high';
    time_to_market: number; // months
    required_investment: number;
    expected_revenue: number;
    roi_projection: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    feasibility_score: number;
    strategic_alignment: number;
    created_at: string;
    source: 'competitive_analysis' | 'market_research' | 'customer_feedback' | 'technology_trend';
}

interface CompetitiveThreat {
    id: string;
    competitor_name: string;
    threat_type: 'product_launch' | 'pricing_strategy' | 'partnership' | 'technology_advancement' | 'market_expansion';
    description: string;
    impact_level: 'low' | 'medium' | 'high' | 'critical';
    urgency_level: 'low' | 'medium' | 'high' | 'critical';
    detection_date: string;
    estimated_execution_date: string;
    potential_revenue_impact: number;
    market_share_impact: number;
    customer_impact_score: number;
    response_strategy?: string;
    innovation_opportunities: string[];
    status: 'detected' | 'analyzing' | 'responding' | 'mitigated' | 'resolved';
}

export class CompetitiveIntelligenceIntegration {
    private apiBaseUrl: string;

    constructor(apiBaseUrl: string = 'https://your-domain.workers.dev') {
        this.apiBaseUrl = apiBaseUrl;
    }

    async getCompetitiveIntelligenceData(): Promise<{
        competitors: CompetitorData[];
        opportunities: MarketOpportunity[];
        threats: CompetitiveThreat[];
        market_trends: any;
        summary: any;
    }> {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/competitive-intelligence`);

            if (!response.ok) {
                throw new Error(`Failed to fetch competitive intelligence: ${response.statusText}`);
            }

            const apiResponse = await response.json();

            // Type guard to ensure data structure
            if (apiResponse && typeof apiResponse === 'object' && 'data' in apiResponse) {
                return apiResponse.data as {
                    competitors: CompetitorData[];
                    opportunities: MarketOpportunity[];
                    threats: CompetitiveThreat[];
                    market_trends: any;
                    summary: any;
                };
            }

            // Fallback to mock data if API response structure is unexpected
            return this.getMockCompetitiveData();

        } catch (error) {
            console.error('Error fetching competitive intelligence data:', error);

            // Return mock data for development
            return this.getMockCompetitiveData();
        }
    }

    private getMockCompetitiveData(): {
        competitors: CompetitorData[];
        opportunities: MarketOpportunity[];
        threats: CompetitiveThreat[];
        market_trends: any;
        summary: any;
    } {
        return {
            competitors: [
                {
                    id: 'comp_1',
                    name: 'Booksy',
                    market_share: 5.2,
                    features: ['Online booking', 'Calendar sync', 'Payment processing', 'Customer management'],
                    features_missing: ['AI recommendations', 'Mobile app', 'Real-time analytics', 'AR try-on'],
                    pricing_strategy: 'Freemium',
                    pricing_weakness: 'Limited premium features',
                    technology_gap: 'AI-powered matching',
                    innovation_frequency: 0.3,
                    last_innovation_date: '2024-11-15',
                    threat_level: 'high',
                    market_position: 1,
                    financial_strength: 8,
                    technology_maturity: 7,
                    customer_satisfaction: 4.2,
                    partnerships: ['Stripe', 'Google Calendar'],
                    weaknesses: ['Limited AI features', 'No AR capabilities'],
                    opportunities: ['Mobile-first approach', 'AI integration', 'Enterprise features']
                },
                {
                    id: 'comp_2',
                    name: 'Fresha',
                    market_share: 3.8,
                    features: ['Booking system', 'Staff management', 'Inventory tracking', 'Marketing tools'],
                    features_missing: ['Predictive analytics', 'Customer behavior insights', 'Automated scheduling'],
                    pricing_strategy: 'Tiered pricing',
                    pricing_weakness: 'Expensive enterprise tier',
                    technology_gap: 'Predictive AI',
                    innovation_frequency: 0.25,
                    last_innovation_date: '2024-10-22',
                    threat_level: 'medium',
                    market_position: 2,
                    financial_strength: 7,
                    technology_maturity: 6,
                    customer_satisfaction: 4.0,
                    partnerships: ['PayPal', 'Square'],
                    weaknesses: ['Complex pricing', 'Limited analytics'],
                    opportunities: ['Simplified pricing', 'Enhanced analytics', 'Mobile optimization']
                },
                {
                    id: 'comp_3',
                    name: 'Vagaro',
                    market_share: 2.1,
                    features: ['Point of sale', 'Customer loyalty', 'Marketing campaigns', 'Analytics'],
                    features_missing: ['Mobile-first design', 'AI recommendations', 'Integration marketplace'],
                    pricing_strategy: 'Monthly subscription',
                    pricing_weakness: 'No free tier',
                    technology_gap: 'Modern mobile experience',
                    innovation_frequency: 0.2,
                    last_innovation_date: '2024-09-18',
                    threat_level: 'medium',
                    market_position: 3,
                    financial_strength: 6,
                    technology_maturity: 5,
                    customer_satisfaction: 3.8,
                    partnerships: ['QuickBooks', 'Mailchimp'],
                    weaknesses: ['Outdated interface', 'Limited integrations'],
                    opportunities: ['Modern UI/UX', 'API marketplace', 'Mobile optimization']
                }
            ],

            opportunities: [
                {
                    id: 'opp_1',
                    title: 'Mobile Beauty Service Platform',
                    description: 'Comprehensive mobile beauty services booking and management platform',
                    market_size: 300000000, // R300M
                    addressable_market: 150000000, // R150M
                    growth_rate: 0.25,
                    competition_level: 'medium',
                    barrier_to_entry: 'medium',
                    time_to_market: 6,
                    required_investment: 5000000, // R5M
                    expected_revenue: 30000000, // R30M annually
                    roi_projection: 450,
                    priority: 'critical',
                    feasibility_score: 85,
                    strategic_alignment: 95,
                    created_at: '2024-12-15',
                    source: 'market_research'
                },
                {
                    id: 'opp_2',
                    title: 'AI-Powered Service Matching',
                    description: 'Machine learning system for optimal service-provider matching',
                    market_size: 800000000, // R800M
                    addressable_market: 400000000, // R400M
                    growth_rate: 0.35,
                    competition_level: 'high',
                    barrier_to_entry: 'high',
                    time_to_market: 12,
                    required_investment: 10000000, // R10M
                    expected_revenue: 40000000, // R40M annually
                    roi_projection: 350,
                    priority: 'high',
                    feasibility_score: 75,
                    strategic_alignment: 90,
                    created_at: '2024-12-10',
                    source: 'technology_trend'
                },
                {
                    id: 'opp_3',
                    title: 'Small Salon Solution',
                    description: 'Simplified, affordable solution for small beauty businesses',
                    market_size: 560000000, // R560M
                    addressable_market: 280000000, // R280M
                    growth_rate: 0.20,
                    competition_level: 'low',
                    barrier_to_entry: 'low',
                    time_to_market: 9,
                    required_investment: 3000000, // R3M
                    expected_revenue: 28000000, // R28M annually
                    roi_projection: 650,
                    priority: 'high',
                    feasibility_score: 90,
                    strategic_alignment: 85,
                    created_at: '2024-12-12',
                    source: 'customer_feedback'
                }
            ],

            threats: [
                {
                    id: 'threat_1',
                    competitor_name: 'Booksy',
                    threat_type: 'product_launch',
                    description: 'Upcoming AI-powered booking assistant launch',
                    impact_level: 'high',
                    urgency_level: 'high',
                    detection_date: '2024-12-20',
                    estimated_execution_date: '2025-02-15',
                    potential_revenue_impact: 15000000,
                    market_share_impact: 2.5,
                    customer_impact_score: 8,
                    status: 'detected',
                    innovation_opportunities: [
                        'Develop superior AI assistant',
                        'Partner with AI technology providers',
                        'Accelerate AI feature development'
                    ]
                },
                {
                    id: 'threat_2',
                    competitor_name: 'Fresha',
                    threat_type: 'partnership',
                    description: 'Strategic partnership with major SA beauty retailer',
                    impact_level: 'medium',
                    urgency_level: 'medium',
                    detection_date: '2024-12-18',
                    estimated_execution_date: '2025-01-30',
                    potential_revenue_impact: 8000000,
                    market_share_impact: 1.2,
                    customer_impact_score: 6,
                    status: 'analyzing',
                    innovation_opportunities: [
                        'Exclusive partnership strategy',
                        'Retail integration platform',
                        'Customer experience enhancement'
                    ]
                }
            ],

            market_trends: {
                mobile_adoption_rate: 0.78,
                ai_adoption_rate: 0.65,
                sustainability_focus: 0.72,
                wellness_integration: 0.58,
                ar_vr_adoption: 0.42,
                subscription_model: 0.85,
                personalization_demand: 0.91,
                instant_gratification: 0.88,
                social_commerce: 0.67,
                voice_commerce: 0.34
            },

            summary: {
                total_competitors: 25,
                active_threats: 8,
                market_opportunities: 15,
                innovation_gaps: 12,
                competitive_advantages: 7,
                strategic_priorities: 5
            }
        };
    }

    async getMarketTrends(): Promise<any> {
        const data = await this.getCompetitiveIntelligenceData();
        return data.market_trends;
    }

    async getCompetitorAnalysis(competitorId?: string): Promise<CompetitorData[]> {
        const data = await this.getCompetitiveIntelligenceData();

        if (competitorId) {
            return data.competitors.filter(c => c.id === competitorId);
        }

        return data.competitors;
    }

    async getMarketOpportunities(): Promise<MarketOpportunity[]> {
        const data = await this.getCompetitiveIntelligenceData();
        return data.opportunities.sort((a, b) => b.roi_projection - a.roi_projection);
    }

    async getCompetitiveThreats(): Promise<CompetitiveThreat[]> {
        const data = await this.getCompetitiveIntelligenceData();
        return data.threats.filter(t => t.status !== 'resolved');
    }

    async analyzeCompetitorGaps(): Promise<Array<{
        competitor: string;
        gaps: string[];
        opportunities: string[];
        innovation_priority: number;
    }>> {
        const competitors = await this.getCompetitorAnalysis();

        return competitors.map(competitor => {
            const gaps = competitor.features_missing;
            const opportunities = competitor.opportunities;

            // Calculate innovation priority based on multiple factors
            const priorityScore = (
                (competitor.market_share * 0.3) +
                (competitor.threat_level === 'critical' ? 30 :
                    competitor.threat_level === 'high' ? 20 :
                        competitor.threat_level === 'medium' ? 10 : 5) +
                (gaps.length * 5) +
                (competitor.innovation_frequency * 10)
            );

            return {
                competitor: competitor.name,
                gaps,
                opportunities,
                innovation_priority: Math.min(100, priorityScore)
            };
        }).sort((a, b) => b.innovation_priority - a.innovation_priority);
    }

    async generateCompetitiveInnovationIdeas(): Promise<Array<{
        idea: string;
        source_competitor: string;
        gap_addressed: string;
        competitive_advantage: number;
        implementation_complexity: 'low' | 'medium' | 'high';
        time_to_market: number;
    }>> {
        const gaps = await this.analyzeCompetitorGaps();
        const ideas = [];

        for (const gapAnalysis of gaps) {
            for (const gap of gapAnalysis.gaps) {
                // Generate innovation idea based on gap
                let idea = '';
                let complexity: 'low' | 'medium' | 'high' = 'medium';
                let timeToMarket = 6;

                if (gap.toLowerCase().includes('ai') || gap.toLowerCase().includes('machine learning')) {
                    idea = `Advanced AI-powered ${gap.replace('AI ', '').replace('machine learning ', '')}`;
                    complexity = 'high';
                    timeToMarket = 12;
                } else if (gap.toLowerCase().includes('mobile')) {
                    idea = `Mobile-first ${gap.replace('mobile ', '').replace('Mobile ', '')}`;
                    complexity = 'medium';
                    timeToMarket = 8;
                } else if (gap.toLowerCase().includes('analytics') || gap.toLowerCase().includes('reporting')) {
                    idea = `Real-time ${gap.replace('analytics ', '').replace('reporting ', '')} analytics`;
                    complexity = 'medium';
                    timeToMarket = 6;
                } else {
                    idea = `Enhanced ${gap} with advanced capabilities`;
                    complexity = 'low';
                    timeToMarket = 4;
                }

                ideas.push({
                    idea,
                    source_competitor: gapAnalysis.competitor,
                    gap_addressed: gap,
                    competitive_advantage: Math.min(95, 70 + gapAnalysis.innovation_priority * 0.25),
                    implementation_complexity: complexity,
                    time_to_market: timeToMarket
                });
            }
        }

        return ideas.sort((a, b) => b.competitive_advantage - a.competitive_advantage);
    }

    async getInnovationThreats(): Promise<CompetitiveThreat[]> {
        const threats = await this.getCompetitiveThreats();

        // Filter for innovation-related threats
        return threats.filter(threat =>
            threat.threat_type === 'product_launch' ||
            threat.threat_type === 'technology_advancement' ||
            threat.innovation_opportunities.length > 0
        );
    }

    async getMarketExpansionOpportunities(): Promise<Array<{
        opportunity: string;
        market_size: number;
        competition_level: string;
        strategic_value: number;
        expansion_complexity: 'low' | 'medium' | 'high';
    }>> {
        const data = await this.getCompetitiveIntelligenceData();

        return data.opportunities
            .filter(opp => opp.priority === 'high' || opp.priority === 'critical')
            .map(opp => ({
                opportunity: opp.title,
                market_size: opp.market_size,
                competition_level: opp.competition_level,
                strategic_value: (opp.feasibility_score + opp.strategic_alignment) / 2,
                expansion_complexity: opp.barrier_to_entry as 'low' | 'medium' | 'high'
            }))
            .sort((a, b) => b.strategic_value - a.strategic_value);
    }
}

// Export singleton instance
export const competitiveIntelligenceIntegration = new CompetitiveIntelligenceIntegration();
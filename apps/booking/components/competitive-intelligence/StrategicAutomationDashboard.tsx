'use client';

import React, { useState, useEffect } from 'react';
import {
    Activity,
    Target,
    TrendingUp,
    AlertTriangle,
    Zap,
    Shield,
    DollarSign,
    Users,
    Brain,
    BarChart3,
    Clock,
    CheckCircle,
    XCircle,
    Play,
    Pause,
    Settings,
    Eye,
    Rocket,
    Award
} from 'lucide-react';

// Types for the dashboard data
interface AutomationMetrics {
    responseTimeAvg: number;
    successRate: number;
    activeResponses: number;
    threatsNeutralized: number;
    opportunitiesCaptured: number;
    marketShareChange: string;
    revenueImpact: number;
    customerAcquisition: number;
    roi: number;
    dominanceScore: number;
}

interface ActiveResponse {
    id: number;
    type: 'pricing' | 'marketing' | 'feature' | 'partnership';
    name: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: 'executing' | 'approved' | 'pending' | 'completed';
    progress: number;
    competitor?: string;
    target?: string;
    budget?: number;
    estimatedCompletion?: string;
}

interface ThreatResponse {
    threat: string;
    competitor: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    responseStrategy: string;
    effectiveness: number;
    status: 'active' | 'mitigated' | 'monitoring';
}

interface Opportunity {
    id: number;
    name: string;
    marketSize: number;
    competition: 'low' | 'medium' | 'high';
    urgency: 'critical' | 'high' | 'medium' | 'low';
    investment: number;
    potential: number;
    roi: number;
    timeline: string;
    progress: number;
}

interface AIRecommendation {
    id: number;
    situation: string;
    confidence: number;
    actions: string[];
    outcomes: {
        marketShareProtection?: string;
        revenuePotential?: number;
        riskLevel: string;
    };
    status: 'pending' | 'approved' | 'implemented';
}

export default function StrategicAutomationDashboard() {
    const [metrics, setMetrics] = useState<AutomationMetrics | null>(null);
    const [activeResponses, setActiveResponses] = useState<ActiveResponse[]>([]);
    const [threatResponses, setThreatResponses] = useState<ThreatResponse[]>([]);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
    const [selectedTab, setSelectedTab] = useState<'overview' | 'responses' | 'threats' | 'opportunities' | 'ai' | 'analytics'>('overview');
    const [systemStatus, setSystemStatus] = useState<'operational' | 'warning' | 'critical'>('operational');

    // Fetch dashboard data
    useEffect(() => {
        fetchDashboardData();
        // Set up real-time updates every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch automation metrics
            const metricsResponse = await fetch('/api/automated-response-engine?action=performance-metrics');
            const metricsData = await metricsResponse.json() as { success: boolean; data: AutomationMetrics };
            if (metricsData.success) setMetrics(metricsData.data);

            // Fetch active responses
            const responsesResponse = await fetch('/api/automated-response-engine?action=active-actions');
            const responsesData = await responsesResponse.json() as { success: boolean; data: ActiveResponse[] };
            if (responsesData.success) setActiveResponses(responsesData.data);

            // Fetch threat responses
            const threatsResponse = await fetch('/api/automated-response-engine?action=threat-responses');
            const threatsData = await threatsResponse.json() as { success: boolean; data: ThreatResponse[] };
            if (threatsData.success) setThreatResponses(threatsData.data);

            // Fetch opportunities
            const opportunitiesResponse = await fetch('/api/automated-response-engine?action=opportunities');
            const opportunitiesData = await opportunitiesResponse.json() as { success: boolean; data: Opportunity[] };
            if (opportunitiesData.success) setOpportunities(opportunitiesData.data);

            // Fetch AI recommendations
            const aiResponse = await fetch('/api/automated-response-engine?action=ai-recommendations');
            const aiData = await aiResponse.json() as { success: boolean; data: AIRecommendation[] };
            if (aiData.success) setAiRecommendations(aiData.data);

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setSystemStatus('warning');
        }
    };

    const executeResponse = async (responseId: number) => {
        try {
            const response = await fetch('/api/automated-response-engine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'execute-response',
                    actionId: responseId
                })
            });
            const data = await response.json() as { success: boolean };
            if (data.success) {
                fetchDashboardData(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to execute response:', error);
        }
    };

    const approveRecommendation = async (recommendationId: number) => {
        try {
            const response = await fetch('/api/automated-response-engine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'approve-action',
                    actionId: recommendationId,
                    approver: 'executive@appointmentbooking.co.za'
                })
            });
            const data = await response.json() as { success: boolean };
            if (data.success) {
                fetchDashboardData(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to approve recommendation:', error);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'text-red-600 bg-red-50 border-red-200';
            case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'executing': return 'text-blue-600 bg-blue-50';
            case 'approved': return 'text-green-600 bg-green-50';
            case 'pending': return 'text-yellow-600 bg-yellow-50';
            case 'completed': return 'text-gray-600 bg-gray-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Responses</p>
                            <p className="text-3xl font-bold text-blue-600">{metrics?.activeResponses || 0}</p>
                            <p className="text-sm text-gray-500 mt-1">Real-time execution</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Zap className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Success Rate</p>
                            <p className="text-3xl font-bold text-green-600">{metrics?.successRate || 0}%</p>
                            <p className="text-sm text-gray-500 mt-1">Target: 90%</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <Target className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                            <p className="text-3xl font-bold text-orange-600">{metrics?.responseTimeAvg || 0}m</p>
                            <p className="text-sm text-gray-500 mt-1">Target: 24h</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                            <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Market Dominance</p>
                            <p className="text-3xl font-bold text-purple-600">{metrics?.dominanceScore || 0}%</p>
                            <p className="text-sm text-gray-500 mt-1">+2.3% this month</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Award className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${systemStatus === 'operational' ? 'bg-green-500' : systemStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-medium capitalize">{systemStatus}</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{metrics?.threatsNeutralized || 0}</p>
                        <p className="text-sm text-gray-600">Threats Neutralized</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{metrics?.opportunitiesCaptured || 0}</p>
                        <p className="text-sm text-gray-600">Opportunities Captured</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">R{(metrics?.revenueImpact || 0 / 1000000).toFixed(1)}M</p>
                        <p className="text-sm text-gray-600">Revenue Impact</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderActiveResponses = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Active Response Actions</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Rocket className="h-4 w-4 inline mr-2" />
                    Launch New Response
                </button>
            </div>

            <div className="space-y-4">
                {activeResponses.map((response) => (
                    <div key={response.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h4 className="text-lg font-medium text-gray-900">{response.name}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(response.priority)}`}>
                                        {response.priority}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(response.status)}`}>
                                        {response.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Type</p>
                                        <p className="font-medium capitalize">{response.type}</p>
                                    </div>
                                    {response.competitor && (
                                        <div>
                                            <p className="text-sm text-gray-600">Target Competitor</p>
                                            <p className="font-medium">{response.competitor}</p>
                                        </div>
                                    )}
                                    {response.budget && (
                                        <div>
                                            <p className="text-sm text-gray-600">Budget</p>
                                            <p className="font-medium">R{response.budget.toLocaleString()}</p>
                                        </div>
                                    )}
                                    {response.estimatedCompletion && (
                                        <div>
                                            <p className="text-sm text-gray-600">Est. Completion</p>
                                            <p className="font-medium">{new Date(response.estimatedCompletion).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>

                                {response.status === 'executing' && (
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                            <span>Progress</span>
                                            <span>{response.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${response.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                                {response.status === 'approved' && (
                                    <button
                                        onClick={() => executeResponse(response.id)}
                                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                    >
                                        <Play className="h-4 w-4 inline mr-1" />
                                        Execute
                                    </button>
                                )}
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Eye className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Settings className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderThreatResponses = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Competitive Threat Responses</h3>

            <div className="space-y-4">
                {threatResponses.map((threat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    <h4 className="text-lg font-medium text-gray-900">{threat.threat}</h4>
                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                        {threat.severity}
                                    </span>
                                    <span className="text-sm text-gray-500">by {threat.competitor}</span>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">Response Strategy:</p>
                                    <p className="text-gray-900">{threat.responseStrategy}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Effectiveness Score</p>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{ width: `${threat.effectiveness}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium">{threat.effectiveness}%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(threat.status)}`}>
                                            {threat.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Mitigation</p>
                                        <p className="text-sm font-medium text-green-600">
                                            {threat.status === 'mitigated' ? 'Complete' : 'In Progress'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderOpportunities = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Market Opportunities</h3>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Target className="h-4 w-4 inline mr-2" />
                    Capture Opportunity
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {opportunities.map((opportunity) => (
                    <div key={opportunity.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-2">{opportunity.name}</h4>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(opportunity.urgency)}`}>
                                        {opportunity.urgency}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                                        {opportunity.competition} competition
                                    </span>
                                </div>
                            </div>
                            <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-600">Market Size</p>
                                <p className="font-semibold">R{(opportunity.marketSize / 1000000).toFixed(0)}M</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Investment</p>
                                <p className="font-semibold">R{(opportunity.investment / 1000000).toFixed(1)}M</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Potential Revenue</p>
                                <p className="font-semibold text-green-600">R{(opportunity.potential / 1000000).toFixed(0)}M</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">ROI</p>
                                <p className="font-semibold text-blue-600">{opportunity.roi}%</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{opportunity.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${opportunity.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">Timeline: {opportunity.timeline}</p>
                            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                                Accelerate
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAIRecommendations = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">AI Strategic Recommendations</h3>
                <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <span className="text-sm text-gray-600">Powered by Advanced AI</span>
                </div>
            </div>

            <div className="space-y-4">
                {aiRecommendations.map((recommendation) => (
                    <div key={recommendation.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                    <h4 className="text-lg font-medium text-gray-900">{recommendation.situation}</h4>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            <span className="text-sm font-medium text-purple-600">
                                                {(recommendation.confidence * 100).toFixed(0)}% confidence
                                            </span>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recommendation.status)}`}>
                                            {recommendation.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">Recommended Actions:</p>
                                    <ul className="space-y-1">
                                        {recommendation.actions.map((action, index) => (
                                            <li key={index} className="flex items-center space-x-2 text-sm text-gray-900">
                                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                <span>{action}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {recommendation.outcomes.marketShareProtection && (
                                        <div>
                                            <p className="text-sm text-gray-600">Market Share Protection</p>
                                            <p className="font-medium text-green-600">{recommendation.outcomes.marketShareProtection}</p>
                                        </div>
                                    )}
                                    {recommendation.outcomes.revenuePotential && (
                                        <div>
                                            <p className="text-sm text-gray-600">Revenue Potential</p>
                                            <p className="font-medium text-blue-600">
                                                R{(recommendation.outcomes.revenuePotential / 1000000).toFixed(1)}M
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-600">Risk Level</p>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${recommendation.outcomes.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                                            recommendation.outcomes.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {recommendation.outcomes.riskLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {recommendation.status === 'pending' && (
                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => approveRecommendation(recommendation.id)}
                                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                    >
                                        Approve
                                    </button>
                                    <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                                        Review
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Shield className="h-8 w-8 text-blue-600" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Strategic Automation Dashboard</h1>
                                <p className="text-sm text-gray-600">Automated Competitive Response Engine</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">Executive Control Center</p>
                                <p className="text-xs text-gray-600">
                                    Last Updated: {new Date().toLocaleString()}
                                </p>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Settings className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: BarChart3 },
                            { id: 'responses', label: 'Active Responses', icon: Zap },
                            { id: 'threats', label: 'Threat Responses', icon: Shield },
                            { id: 'opportunities', label: 'Opportunities', icon: Target },
                            { id: 'ai', label: 'AI Recommendations', icon: Brain },
                            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedTab(tab.id as any)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${selectedTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {selectedTab === 'overview' && renderOverview()}
                {selectedTab === 'responses' && renderActiveResponses()}
                {selectedTab === 'threats' && renderThreatResponses()}
                {selectedTab === 'opportunities' && renderOpportunities()}
                {selectedTab === 'ai' && renderAIRecommendations()}
                {selectedTab === 'analytics' && (
                    <div className="text-center py-12">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
                        <p className="text-gray-600">Detailed performance analytics and ROI tracking coming soon</p>
                    </div>
                )}
            </div>
        </div>
    );
}
// Strategic Automation Dashboard
// Executive control interface for automated competitive response engine

'use client';

import {
    Activity,
    AlertTriangle,
    Target,
    Zap,
    TrendingUp,
    Shield,
    Brain,
    Rocket,
    DollarSign,
    Users,
    BarChart3,
    Settings,
    Play,
    Pause,
    RotateCcw,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Gauge
} from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Interface definitions for dashboard data
interface ThreatDetectionStatus {
    total_rules: number;
    active_rules: number;
    threats_detected_today: number;
    response_time_average: string;
    automation_level: string;
    success_rate: number;
}

interface ActiveThreat {
    id: number;
    threat_type: string;
    source_competitor: string;
    threat_severity: 'low' | 'medium' | 'high' | 'critical';
    detection_timestamp: string;
    automated_response_status: 'triggered' | 'executing' | 'completed' | 'failed' | 'pending_approval';
    response_effectiveness: number;
}

interface OpportunityCapture {
    id: number;
    opportunity_type: string;
    opportunity_source: string;
    estimated_value: number;
    capture_probability: number;
    deployment_status: 'identifying' | 'analyzing' | 'capturing' | 'securing' | 'integrating';
    market_share_gain: number;
}

interface PerformanceMetrics {
    response_time_improvement: number;
    automation_effectiveness: number;
    competitive_advantage_maintained: number;
    market_share_protection: number;
    roi_on_automated_responses: number;
    threats_managed: number;
    opportunities_captured: number;
    automated_responses: number;
    market_share_impact: string;
}

interface StrategicAutomationDashboardProps {
    className?: string;
}

export default function StrategicAutomationDashboard({ className }: StrategicAutomationDashboardProps) {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [threatData, setThreatData] = useState<ThreatDetectionStatus | null>(null);
    const [activeThreats, setActiveThreats] = useState<ActiveThreat[]>([]);
    const [opportunities, setOpportunities] = useState<OpportunityCapture[]>([]);
    const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
    const [automationStatus, setAutomationStatus] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('overview');

    // API functions
    const fetchDashboardOverview = useCallback(async () => {
        try {
            const response = await fetch('/api/competitive-response-engine?action=response_overview');
            const data = await response.json() as { data: any };
            setDashboardData(data.data);
        } catch (error) {
            console.error('Error fetching dashboard overview:', error);
        }
    }, []);

    const fetchThreatDetection = useCallback(async () => {
        try {
            const response = await fetch('/api/competitive-response-engine?action=threat_detection');
            const data = await response.json() as { data: any[] };
            // Transform to match interface
            setThreatData({
                total_rules: data.data?.length || 0,
                active_rules: data.data?.filter((rule: any) => rule.status === 'active').length || 0,
                threats_detected_today: dashboardData?.current_metrics?.threats_detected_today || 0,
                response_time_average: dashboardData?.performance_indicators?.response_time_average || '0 hours',
                automation_level: dashboardData?.automation_level || 'basic',
                success_rate: dashboardData?.performance_indicators?.success_rate || 0
            });
        } catch (error) {
            console.error('Error fetching threat detection:', error);
        }
    }, [dashboardData]);

    const fetchActiveThreats = useCallback(async () => {
        try {
            const response = await fetch('/api/competitive-response-engine?action=active_threats');
            const data = await response.json() as { data: ActiveThreat[] };
            setActiveThreats(data.data || []);
        } catch (error) {
            console.error('Error fetching active threats:', error);
        }
    }, []);

    const fetchOpportunities = useCallback(async () => {
        try {
            const response = await fetch('/api/competitive-response-engine?action=opportunity_capture');
            const data = await response.json() as { data: OpportunityCapture[] };
            setOpportunities(data.data || []);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
        }
    }, []);

    const fetchPerformanceMetrics = useCallback(async () => {
        try {
            const response = await fetch('/api/competitive-response-engine?action=response_performance');
            const data = await response.json() as { data: { overall_metrics: PerformanceMetrics } };
            setPerformanceMetrics(data.data?.overall_metrics || null);
        } catch (error) {
            console.error('Error fetching performance metrics:', error);
        }
    }, []);

    const fetchAutomationStatus = useCallback(async () => {
        try {
            const response = await fetch('/api/competitive-response-engine?action=automation_status');
            const data = await response.json() as { data: any };
            setAutomationStatus(data.data || null);
        } catch (error) {
            console.error('Error fetching automation status:', error);
        }
    }, []);

    // Control functions
    const deployAutomatedResponse = async (threatId: number, responseStrategy?: string) => {
        try {
            const response = await fetch('/api/competitive-response-engine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'deploy_automated_response',
                    threatId,
                    responseStrategy: responseStrategy || 'comprehensive_counter_strategy'
                })
            });
            const data = await response.json() as { success: boolean };
            if (data.success) {
                await fetchActiveThreats();
                await fetchDashboardOverview();
            }
        } catch (error) {
            console.error('Error deploying automated response:', error);
        }
    };

    const captureMarketOpportunity = async (opportunityId: number, timelineAcceleration = false) => {
        try {
            const response = await fetch('/api/competitive-response-engine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'capture_market_opportunity',
                    opportunityId,
                    timelineAcceleration
                })
            });
            const data = await response.json() as { success: boolean };
            if (data.success) {
                await fetchOpportunities();
                await fetchDashboardOverview();
            }
        } catch (error) {
            console.error('Error capturing market opportunity:', error);
        }
    };

    const triggerPricingAdjustment = async (adjustmentType: string, targetCompetitors: string[], adjustmentMagnitude: string) => {
        try {
            const response = await fetch('/api/competitive-response-engine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'trigger_pricing_adjustment',
                    adjustmentType,
                    targetCompetitors,
                    adjustmentMagnitude,
                    autoApproval: true
                })
            });
            const data = await response.json() as { success: boolean };
            if (data.success) {
                await fetchDashboardOverview();
            }
        } catch (error) {
            console.error('Error triggering pricing adjustment:', error);
        }
    };

    const generateResponseReport = async (reportType = 'comprehensive', timeframe = '30_days') => {
        try {
            const response = await fetch('/api/competitive-response-engine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'generate_response_report',
                    reportType,
                    timeframe,
                    includeRecommendations: true
                })
            });
            const data = await response.json() as { success: boolean; data: any };
            if (data.success) {
                // Create download link for report
                const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `competitive-response-report-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error generating response report:', error);
        }
    };

    // Initialize data
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchDashboardOverview(),
                fetchThreatDetection(),
                fetchActiveThreats(),
                fetchOpportunities(),
                fetchPerformanceMetrics(),
                fetchAutomationStatus()
            ]);
            setIsLoading(false);
        };

        loadData();

        // Set up real-time updates every 30 seconds
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, [fetchDashboardOverview, fetchThreatDetection, fetchActiveThreats, fetchOpportunities, fetchPerformanceMetrics, fetchAutomationStatus]);

    // Helper functions
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'destructive';
            case 'high': return 'destructive';
            case 'medium': return 'secondary';
            case 'low': return 'outline';
            default: return 'outline';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'executing': return <Activity className="h-4 w-4" />;
            case 'completed': return <CheckCircle className="h-4 w-4" />;
            case 'failed': return <XCircle className="h-4 w-4" />;
            case 'pending_approval': return <Clock className="h-4 w-4" />;
            default: return <AlertTriangle className="h-4 w-4" />;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(1)}%`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-lg font-medium">Loading Strategic Automation Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-gray-50 p-6 ${className}`}>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Strategic Automation Dashboard</h1>
                        <p className="text-gray-600 mt-1">Executive Control Interface for Automated Competitive Response</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="px-3 py-1">
                            <Activity className="h-4 w-4 mr-1" />
                            {dashboardData?.system_status || 'Operational'}
                        </Badge>
                        <Button
                            onClick={() => generateResponseReport()}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Generate Report
                        </Button>
                    </div>
                </div>

                {/* Executive Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                            <Zap className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{performanceMetrics?.response_time_improvement || 0}%</div>
                            <p className="text-xs text-green-600">
                                {dashboardData?.performance_indicators?.response_time_average || '0 hours'} average
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                            <Target className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{performanceMetrics?.automation_effectiveness || 0}%</div>
                            <p className="text-xs text-green-600">
                                {dashboardData?.performance_indicators?.success_rate || 0}% effectiveness
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Market Protection</CardTitle>
                            <Shield className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{performanceMetrics?.market_share_protection || 0}%</div>
                            <p className="text-xs text-purple-600">
                                {performanceMetrics?.market_share_impact || '+0%'} impact
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">ROI</CardTitle>
                            <DollarSign className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{performanceMetrics?.roi_on_automated_responses || 0}%</div>
                            <p className="text-xs text-yellow-600">
                                Return on automated responses
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Dashboard Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="threats">Threat Management</TabsTrigger>
                        <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="controls">Controls</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Brain className="h-5 w-5 mr-2" />
                                        Automation Status
                                    </CardTitle>
                                    <CardDescription>Current automation levels and system health</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {automationStatus?.automation_levels && Object.entries(automationStatus.automation_levels).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <span className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                                            <Badge variant="outline">{String(value)}</Badge>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Rocket className="h-5 w-5 mr-2" />
                                        Strategic Insights
                                    </CardTitle>
                                    <CardDescription>AI-powered strategic intelligence</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {dashboardData?.strategic_insights?.map((insight: string, index: number) => (
                                            <Alert key={index}>
                                                <TrendingUp className="h-4 w-4" />
                                                <AlertDescription>{insight}</AlertDescription>
                                            </Alert>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Gauge className="h-5 w-5 mr-2" />
                                    Competitive Position
                                </CardTitle>
                                <CardDescription>Real-time competitive advantage metrics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Market Leadership</span>
                                            <span className="text-sm text-gray-600">{dashboardData?.competitive_position?.market_leadership_score || 0}</span>
                                        </div>
                                        <Progress value={dashboardData?.competitive_position?.market_leadership_score || 0} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Response Advantage</span>
                                            <span className="text-sm text-gray-600">{dashboardData?.competitive_position?.response_advantage_index || 0}</span>
                                        </div>
                                        <Progress value={dashboardData?.competitive_position?.response_advantage_index || 0} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Automation Effectiveness</span>
                                            <span className="text-sm text-gray-600">{dashboardData?.competitive_position?.automation_effectiveness || 0}</span>
                                        </div>
                                        <Progress value={dashboardData?.competitive_position?.automation_effectiveness || 0} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Domination Progress</span>
                                            <span className="text-sm text-gray-600">{dashboardData?.competitive_position?.domination_progress || 0}%</span>
                                        </div>
                                        <Progress value={dashboardData?.competitive_position?.domination_progress || 0} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Threat Management Tab */}
                    <TabsContent value="threats" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <AlertTriangle className="h-5 w-5 mr-2" />
                                    Active Threats
                                </CardTitle>
                                <CardDescription>Current competitive threats requiring automated response</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {activeThreats.map((threat) => (
                                        <div key={threat.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                {getStatusIcon(threat.automated_response_status)}
                                                <div>
                                                    <div className="font-medium">{threat.source_competitor} - {threat.threat_type}</div>
                                                    <div className="text-sm text-gray-600">
                                                        Detected: {new Date(threat.detection_timestamp).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant={getSeverityColor(threat.threat_severity)}>
                                                    {threat.threat_severity}
                                                </Badge>
                                                {threat.automated_response_status === 'pending_approval' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => deployAutomatedResponse(threat.id)}
                                                    >
                                                        <Play className="h-4 w-4 mr-1" />
                                                        Deploy Response
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Threat Detection Rules</CardTitle>
                                <CardDescription>Automated threat detection configuration</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{threatData?.total_rules || 0}</div>
                                        <div className="text-sm text-gray-600">Total Rules</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">{threatData?.active_rules || 0}</div>
                                        <div className="text-sm text-gray-600">Active Rules</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">{threatData?.threats_detected_today || 0}</div>
                                        <div className="text-sm text-gray-600">Detected Today</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Opportunities Tab */}
                    <TabsContent value="opportunities" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Target className="h-5 w-5 mr-2" />
                                    Market Opportunities
                                </CardTitle>
                                <CardDescription>Identified opportunities for competitive advantage</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {opportunities.map((opportunity) => (
                                        <div key={opportunity.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div>
                                                    <div className="font-medium">{opportunity.opportunity_source}</div>
                                                    <div className="text-sm text-gray-600">
                                                        Value: {formatCurrency(opportunity.estimated_value)} •
                                                        Success: {formatPercentage(opportunity.capture_probability)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline">{opportunity.deployment_status.replace(/_/g, ' ')}</Badge>
                                                <Button
                                                    size="sm"
                                                    onClick={() => captureMarketOpportunity(opportunity.id)}
                                                >
                                                    <Rocket className="h-4 w-4 mr-1" />
                                                    Capture
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Performance Tab */}
                    <TabsContent value="performance" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <BarChart3 className="h-5 w-5 mr-2" />
                                        Performance Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Response Time Improvement</span>
                                            <span className="font-medium">{performanceMetrics?.response_time_improvement || 0}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Automation Effectiveness</span>
                                            <span className="font-medium">{performanceMetrics?.automation_effectiveness || 0}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Competitive Advantage</span>
                                            <span className="font-medium">{performanceMetrics?.competitive_advantage_maintained || 0}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Market Share Protection</span>
                                            <span className="font-medium">{performanceMetrics?.market_share_protection || 0}%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Users className="h-5 w-5 mr-2" />
                                        Activity Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">{performanceMetrics?.threats_managed || 0}</div>
                                            <div className="text-sm text-gray-600">Threats Managed</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">{performanceMetrics?.opportunities_captured || 0}</div>
                                            <div className="text-sm text-gray-600">Opportunities Captured</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">{performanceMetrics?.automated_responses || 0}</div>
                                            <div className="text-sm text-gray-600">Automated Responses</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-600">{performanceMetrics?.roi_on_automated_responses || 0}%</div>
                                            <div className="text-sm text-gray-600">ROI</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Controls Tab */}
                    <TabsContent value="controls" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Settings className="h-5 w-5 mr-2" />
                                        Quick Actions
                                    </CardTitle>
                                    <CardDescription>Execute immediate strategic responses</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button
                                        className="w-full"
                                        onClick={() => triggerPricingAdjustment('competitive_response', ['fresha', 'booksy'], 'moderate')}
                                    >
                                        <DollarSign className="h-4 w-4 mr-2" />
                                        Trigger Pricing Adjustment
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => generateResponseReport()}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Generate Strategic Report
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => window.location.reload()}
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Refresh Dashboard
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Eye className="h-5 w-5 mr-2" />
                                        System Status
                                    </CardTitle>
                                    <CardDescription>Real-time system health and capabilities</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {dashboardData?.response_capabilities && Object.entries(dashboardData.response_capabilities).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <span className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                                            <Badge variant={String(value) === 'active' || String(value) === 'real_time' ? 'default' : 'secondary'}>
                                                {String(value)}
                                            </Badge>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Strategic Actions</CardTitle>
                                <CardDescription>Pre-configured automated responses ready for deployment</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {dashboardData?.upcoming_actions?.map((action: string, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center">
                                                <Rocket className="h-4 w-4 text-blue-600 mr-2" />
                                                <span className="text-sm font-medium">{action}</span>
                                            </div>
                                            <Button size="sm" variant="outline">
                                                Deploy
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
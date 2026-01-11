'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
// Alert component not available, using div instead
import {
    BarChart3,
    TrendingUp,
    Users,
    Target,
    Zap,
    Globe,
    Shield,
    Brain,
    DollarSign,
    MapPin,
    Award,
    AlertTriangle,
    CheckCircle,
    Clock,
    Play,
    RefreshCw
} from 'lucide-react';

interface MarketExpansionData {
    geographicExpansion: {
        territories: any[];
        progress: number;
        totalInvestment: number;
        expectedROI: number;
    };
    marketDominance: {
        competitorDisplacement: {
            totalCustomersAcquired: number;
        };
        marketShare: {
            current: number;
            target: number;
        };
        eliminationRate: number;
        strategicPosition: string;
        industryInfluence: {
            standardsCreated: number;
        };
    };
    customerAcquisition: {
        totalCustomers: number;
        monthlyGrowth: number;
        acquisitionCost: number;
        viralCoefficient: number;
        conversionRate: number;
    };
    strategicControl: {
        industryInfluence: number;
        regulatoryAccess: number;
        standardSetting: number;
        pricingPower: number;
    };
    performance: {
        overallProgress: number;
        totalRevenue: number;
        roi: number;
        marketPosition: string;
    };
}

export function ExecutiveExpansionDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [data, setData] = useState<MarketExpansionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    useEffect(() => {
        loadDashboardData();
        const interval = setInterval(loadDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            const [geographicRes, dominanceRes, acquisitionRes, controlRes] = await Promise.all([
                fetch('/api/market-expansion/geographic-engine?action=all-territories'),
                fetch('/api/market-expansion/dominance-engine?action=dominance-progress'),
                fetch('/api/market-expansion/acquisition-engine?action=acquisition-metrics'),
                fetch('/api/market-expansion/control-framework?action=control-metrics')
            ]);

            const [geographic, dominance, acquisition, control] = await Promise.all([
                geographicRes.json(),
                dominanceRes.json(),
                acquisitionRes.json(),
                controlRes.json()
            ]) as [{ data: any }, { data: any }, { data: any }, { data: any }];

            setData({
                geographicExpansion: {
                    territories: geographic.data?.territories || [],
                    progress: 68.5,
                    totalInvestment: 12500000,
                    expectedROI: 450
                },
                marketDominance: dominance.data?.progress || {
                    overallProgress: 68.5,
                    marketShare: { current: 8.5, target: 35.0 },
                    competitorDisplacement: { totalCustomersAcquired: 8940 },
                    industryInfluence: { standardsCreated: 8 }
                },
                customerAcquisition: acquisition.data?.metrics?.overall || {
                    totalCustomers: 2470,
                    monthlyGrowth: 18.7,
                    acquisitionCost: 1850,
                    conversionRate: 32.5
                },
                strategicControl: control.data?.metrics?.overallControl || {
                    industryInfluence: 85.7,
                    regulatoryAccess: 92.3,
                    standardSetting: 89.1,
                    pricingPower: 73.2
                },
                performance: {
                    overallProgress: 68.5,
                    totalRevenue: 15600000,
                    roi: 485,
                    marketPosition: 'Emerging Leader'
                }
            });

            setLastUpdate(new Date());
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const executeStrategy = async (strategy: string) => {
        try {
            console.log(`Executing strategy: ${strategy}`);
            await loadDashboardData();
        } catch (error) {
            console.error('Strategy execution failed:', error);
        }
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading Market Expansion Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Market Expansion Command Center</h1>
                    <p className="text-muted-foreground">
                        Strategic control and performance monitoring for market dominance
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Last Updated: {lastUpdate.toLocaleTimeString()}</span>
                    </Badge>
                    <Button onClick={loadDashboardData} disabled={loading} size="sm">
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.performance.overallProgress}%</div>
                        <Progress value={data?.performance.overallProgress} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">Target: 100% by Q2 2026</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Market Share</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.marketDominance.marketShare.current}%</div>
                        <div className="flex items-center space-x-2 mt-2">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-500">+{((data?.marketDominance.marketShare.current || 0) / 35 * 100).toFixed(1)}% of target</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Target: 35% market share</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.customerAcquisition.totalCustomers.toLocaleString()}</div>
                        <div className="flex items-center space-x-2 mt-2">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-500">+{data?.customerAcquisition.monthlyGrowth}% this month</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Target: 5,000 customers</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expected ROI</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.performance.roi}%</div>
                        <div className="flex items-center space-x-2 mt-2">
                            <Award className="h-3 w-3 text-blue-500" />
                            <span className="text-xs text-blue-500">Above industry average</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Target: 500%+ ROI</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="geographic">Geographic</TabsTrigger>
                    <TabsTrigger value="dominance">Dominance</TabsTrigger>
                    <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
                    <TabsTrigger value="control">Strategic Control</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Market Position Overview</CardTitle>
                                <CardDescription>Current strategic position and progress</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Market Position</span>
                                        <Badge variant="secondary">{data?.performance.marketPosition}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Industry Influence</span>
                                        <span className="text-sm">{data?.strategicControl.industryInfluence}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Regulatory Access</span>
                                        <span className="text-sm">{data?.strategicControl.regulatoryAccess}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Standard Setting</span>
                                        <span className="text-sm">{data?.strategicControl.standardSetting}%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Strategic Actions</CardTitle>
                                <CardDescription>Execute high-impact market expansion strategies</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button onClick={() => executeStrategy('aggressive-expansion')} className="w-full justify-start">
                                    <Zap className="h-4 w-4 mr-2" />
                                    Launch Aggressive Expansion
                                </Button>
                                <Button onClick={() => executeStrategy('competitor-elimination')} variant="outline" className="w-full justify-start">
                                    <Target className="h-4 w-4 mr-2" />
                                    Execute Competitor Elimination
                                </Button>
                                <Button onClick={() => executeStrategy('viral-campaign')} variant="outline" className="w-full justify-start">
                                    <Users className="h-4 w-4 mr-2" />
                                    Activate Viral Growth Campaign
                                </Button>
                                <Button onClick={() => executeStrategy('standard-setting')} variant="outline" className="w-full justify-start">
                                    <Award className="h-4 w-4 mr-2" />
                                    Implement Industry Standards
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Strategic Alerts</CardTitle>
                            <CardDescription>Important market expansion notifications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                        <span className="font-semibold text-yellow-800">Market Opportunity Detected</span>
                                    </div>
                                    <p className="text-sm text-yellow-700 mt-2">
                                        High-value acquisition opportunity identified in KwaZulu-Natal market.
                                        Estimated ROI: 320% within 6 months.
                                    </p>
                                </div>
                                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="font-semibold text-green-800">Competitive Advantage Achieved</span>
                                    </div>
                                    <p className="text-sm text-green-700 mt-2">
                                        New industry standard for POPIA compliance has been adopted by 45% of market participants.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="geographic" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {data?.geographicExpansion.territories.map((territory, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{territory.province}</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Investment: R{(territory.investment / 1000000).toFixed(1)}M
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Opportunity Score</span>
                                        <span className="text-sm font-medium">{territory.opportunity}/100</span>
                                    </div>
                                    <Progress value={territory.opportunity} />
                                    <div className="flex justify-between">
                                        <span className="text-sm">Expected ROI</span>
                                        <span className="text-sm font-medium text-green-600">{territory.roi}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Timeline</span>
                                        <span className="text-sm">{territory.timeline} days</span>
                                    </div>
                                    <Button size="sm" className="w-full mt-3">
                                        <Play className="h-3 w-3 mr-1" />
                                        Enter Market
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="dominance" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Competitive Displacement</CardTitle>
                                <CardDescription>Market share capture from competitors</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Customers Acquired</span>
                                        <span className="text-sm font-medium">
                                            {data?.marketDominance.competitorDisplacement.totalCustomersAcquired.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Displacement Rate</span>
                                        <span className="text-sm font-medium">73.2%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Market Share Progress</span>
                                        <span className="text-sm font-medium">
                                            {data?.marketDominance.marketShare.current}% → {data?.marketDominance.marketShare.target}%
                                        </span>
                                    </div>
                                </div>
                                <Progress value={(data?.marketDominance.marketShare.current || 0) / (data?.marketDominance.marketShare.target || 1) * 100} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Industry Influence</CardTitle>
                                <CardDescription>Standards creation and regulatory influence</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Standards Created</span>
                                        <span className="text-sm font-medium">
                                            {data?.marketDominance.industryInfluence.standardsCreated}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Associations Joined</span>
                                        <span className="text-sm font-medium">5</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Thought Leadership Score</span>
                                        <span className="text-sm font-medium">85.2%</span>
                                    </div>
                                </div>
                                <Button size="sm" className="w-full mt-3">
                                    <Award className="h-3 w-3 mr-1" />
                                    Create New Standard
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="acquisition" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Metrics</CardTitle>
                                <CardDescription>Current acquisition performance</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Total Customers</span>
                                        <span className="text-sm font-medium">{data?.customerAcquisition.totalCustomers.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Monthly Growth</span>
                                        <span className="text-sm font-medium text-green-600">+{data?.customerAcquisition.monthlyGrowth}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Acquisition Cost</span>
                                        <span className="text-sm font-medium">R{data?.customerAcquisition.acquisitionCost.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Conversion Rate</span>
                                        <span className="text-sm font-medium">{data?.customerAcquisition.conversionRate}%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Viral Growth</CardTitle>
                                <CardDescription>Organic growth mechanisms</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Viral Coefficient</span>
                                        <span className="text-sm font-medium">2.3</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Referral Rate</span>
                                        <span className="text-sm font-medium">32.8%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Social Reach</span>
                                        <span className="text-sm font-medium">45,000</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Partnership Referrals</span>
                                        <span className="text-sm font-medium">320</span>
                                    </div>
                                </div>
                                <Button size="sm" className="w-full mt-3">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Launch Viral Campaign
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Enterprise Targeting</CardTitle>
                                <CardDescription>Large customer acquisition</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Enterprise Deals</span>
                                        <span className="text-sm font-medium">45</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Total Deal Value</span>
                                        <span className="text-sm font-medium">R6.8M</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Average Deal Size</span>
                                        <span className="text-sm font-medium">R180k</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Close Rate</span>
                                        <span className="text-sm font-medium">65%</span>
                                    </div>
                                </div>
                                <Button size="sm" className="w-full mt-3">
                                    <Users className="h-3 w-3 mr-1" />
                                    Target Enterprise
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="control" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Strategic Control Metrics</CardTitle>
                                <CardDescription>Market influence and control indicators</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Industry Influence</span>
                                            <span className="text-sm font-medium">{data?.strategicControl.industryInfluence}%</span>
                                        </div>
                                        <Progress value={data?.strategicControl.industryInfluence} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Regulatory Access</span>
                                            <span className="text-sm font-medium">{data?.strategicControl.regulatoryAccess}%</span>
                                        </div>
                                        <Progress value={data?.strategicControl.regulatoryAccess} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Standard Setting</span>
                                            <span className="text-sm font-medium">{data?.strategicControl.standardSetting}%</span>
                                        </div>
                                        <Progress value={data?.strategicControl.standardSetting} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Pricing Power</span>
                                            <span className="text-sm font-medium">{data?.strategicControl.pricingPower}%</span>
                                        </div>
                                        <Progress value={data?.strategicControl.pricingPower} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Control Mechanisms</CardTitle>
                                <CardDescription>Strategic tools and frameworks</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2 border rounded">
                                        <div className="flex items-center space-x-2">
                                            <Shield className="h-4 w-4" />
                                            <span className="text-sm">Industry Standards</span>
                                        </div>
                                        <Badge variant="secondary">Active</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-2 border rounded">
                                        <div className="flex items-center space-x-2">
                                            <Brain className="h-4 w-4" />
                                            <span className="text-sm">Market Intelligence</span>
                                        </div>
                                        <Badge variant="secondary">Monopoly</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-2 border rounded">
                                        <div className="flex items-center space-x-2">
                                            <Globe className="h-4 w-4" />
                                            <span className="text-sm">Regulatory Influence</span>
                                        </div>
                                        <Badge variant="secondary">High</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-2 border rounded">
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="h-4 w-4" />
                                            <span className="text-sm">Strategic Pricing</span>
                                        </div>
                                        <Badge variant="secondary">Controlled</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
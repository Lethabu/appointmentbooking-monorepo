// ========================================
// STRATEGIC INTELLIGENCE DASHBOARD
// Executive Competitive Intelligence Interface
// South African Beauty Services Market Focus
// ========================================

'use client';

import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Target,
    Users,
    DollarSign,
    Eye,
    Shield,
    Award,
    Calendar,
    Clock,
    MapPin,
    Smartphone,
    Brain,
    Zap
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';

interface DashboardData {
    marketOverview: {
        totalMarketSize: string;
        growthRate: number;
        marketShare: number;
        competitiveIntensity: string;
    };
    opportunities: {
        high: number;
        medium: number;
        emerging: number;
        totalValue: number;
    };
    threats: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    competitors: {
        total: number;
        direct: number;
        indirect: number;
        marketLeaders: string[];
    };
    kpis: {
        marketShare: number;
        growthRate: number;
        customerSatisfaction: number;
        competitivePosition: number;
    };
}

const StrategicIntelligenceDashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        // Simulate API call to fetch dashboard data
        const fetchDashboardData = async () => {
            setLoading(true);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock dashboard data
            const mockData: DashboardData = {
                marketOverview: {
                    totalMarketSize: 'R2.8B',
                    growthRate: 11,
                    marketShare: 0.2,
                    competitiveIntensity: 'High'
                },
                opportunities: {
                    high: 3,
                    medium: 7,
                    emerging: 12,
                    totalValue: 147000000
                },
                threats: {
                    critical: 1,
                    high: 3,
                    medium: 5,
                    low: 8
                },
                competitors: {
                    total: 25,
                    direct: 8,
                    indirect: 17,
                    marketLeaders: ['Booksy', 'Fresha', 'Vagaro']
                },
                kpis: {
                    marketShare: 0.2,
                    growthRate: 15,
                    customerSatisfaction: 4.3,
                    competitivePosition: 7.2
                }
            };

            setDashboardData(mockData);
            setLoading(false);
            setLastUpdated(new Date());
        };

        fetchDashboardData();
    }, []);

    // Market size data for charts
    const marketSegmentsData = [
        { name: 'Hair Salons Premium', value: 1200, color: '#8884d8' },
        { name: 'Beauty Salons General', value: 800, color: '#82ca9d' },
        { name: 'Spa & Wellness', value: 600, color: '#ffc658' },
        { name: 'Nail Salons', value: 400, color: '#ff7300' },
        { name: 'Mobile Beauty', value: 300, color: '#00c4ff' },
        { name: 'Others', value: 500, color: '#8dd1e1' }
    ];

    // Competitive positioning data
    const competitivePositionData = [
        { subject: 'Market Share', appointmentbooking: 2, booksy: 8, fresha: 6, vagaro: 5, fullMark: 10 },
        { subject: 'Product Features', appointmentbooking: 7, booksy: 9, fresha: 8, vagaro: 7, fullMark: 10 },
        { subject: 'Pricing', appointmentbooking: 8, booksy: 6, fresha: 5, vagaro: 7, fullMark: 10 },
        { subject: 'User Experience', appointmentbooking: 8, booksy: 7, fresha: 6, vagaro: 6, fullMark: 10 },
        { subject: 'Innovation', appointmentbooking: 6, booksy: 8, fresha: 7, vagaro: 5, fullMark: 10 },
        { subject: 'Local Presence', appointmentbooking: 9, booksy: 4, fresha: 3, vagaro: 2, fullMark: 10 }
    ];

    // Market trends data
    const marketTrendsData = [
        { month: 'Jan', marketSize: 2800, ourGrowth: 2.1 },
        { month: 'Feb', marketSize: 2850, ourGrowth: 2.3 },
        { month: 'Mar', marketSize: 2900, ourGrowth: 2.5 },
        { month: 'Apr', marketSize: 2950, ourGrowth: 2.8 },
        { month: 'May', marketSize: 3010, ourGrowth: 3.1 },
        { month: 'Jun', marketSize: 3070, ourGrowth: 3.4 }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading Strategic Intelligence...</p>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <div className="text-center text-white">
                    <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-400" />
                    <p className="text-xl">Failed to load dashboard data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            {/* Header */}
            <div className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Brain className="h-8 w-8 text-blue-400" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Strategic Intelligence Dashboard</h1>
                            <p className="text-slate-400">South African Beauty Services Market Analysis</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm text-slate-400">Last Updated</p>
                            <p className="text-white font-medium">{lastUpdated.toLocaleString()}</p>
                        </div>
                        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                            Live Data
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-slate-800/30 border-b border-slate-700">
                <div className="px-6">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Market Overview', icon: TrendingUp },
                            { id: 'competitors', label: 'Competitive Analysis', icon: Users },
                            { id: 'opportunities', label: 'Market Opportunities', icon: Target },
                            { id: 'threats', label: 'Threat Assessment', icon: Shield },
                            { id: 'trends', label: 'Market Trends', icon: Zap }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? 'border-blue-400 text-blue-400'
                                            : 'border-transparent text-slate-400 hover:text-slate-300'
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
            <div className="p-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard
                                title="Total Market Size"
                                value={dashboardData.marketOverview.totalMarketSize}
                                change={dashboardData.marketOverview.growthRate}
                                icon={DollarSign}
                                color="blue"
                                trend="up"
                            />
                            <MetricCard
                                title="Our Market Share"
                                value={`${dashboardData.marketOverview.marketShare}%`}
                                change={0.05}
                                icon={Award}
                                color="green"
                                trend="up"
                            />
                            <MetricCard
                                title="Active Competitors"
                                value={dashboardData.competitors.total.toString()}
                                change={2}
                                icon={Users}
                                color="orange"
                                trend="stable"
                            />
                            <MetricCard
                                title="High-Priority Opportunities"
                                value={dashboardData.opportunities.high.toString()}
                                change={1}
                                icon={Target}
                                color="purple"
                                trend="up"
                            />
                        </div>

                        {/* Market Segments Chart */}
                        <div className="bg-slate-800/50 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <MapPin className="h-5 w-5 mr-2 text-blue-400" />
                                Market Segments Breakdown
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={marketSegmentsData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {marketSegmentsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`R${value}M`, 'Market Size']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Market Trends */}
                        <div className="bg-slate-800/50 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                                Market Growth Trends
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={marketTrendsData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="month" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                                        labelStyle={{ color: '#F3F4F6' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="marketSize"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        name="Market Size (R Million)"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="ourGrowth"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        name="Our Growth Rate (%)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {activeTab === 'competitors' && (
                    <div className="space-y-6">
                        {/* Competitive Position Radar */}
                        <div className="bg-slate-800/50 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <Eye className="h-5 w-5 mr-2 text-blue-400" />
                                Competitive Position Analysis
                            </h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <RadarChart data={competitivePositionData}>
                                    <PolarGrid stroke="#374151" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF' }} />
                                    <PolarRadiusAxis
                                        angle={90}
                                        domain={[0, 10]}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    />
                                    <Radar
                                        name="AppointmentBooking"
                                        dataKey="appointmentbooking"
                                        stroke="#3B82F6"
                                        fill="#3B82F6"
                                        fillOpacity={0.1}
                                        strokeWidth={2}
                                    />
                                    <Radar
                                        name="Booksy"
                                        dataKey="booksy"
                                        stroke="#EF4444"
                                        fill="#EF4444"
                                        fillOpacity={0.1}
                                        strokeWidth={2}
                                    />
                                    <Radar
                                        name="Fresha"
                                        dataKey="fresha"
                                        stroke="#10B981"
                                        fill="#10B981"
                                        fillOpacity={0.1}
                                        strokeWidth={2}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Competitor Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-slate-800/50 rounded-lg p-6">
                                <h4 className="text-lg font-semibold mb-4">Market Leaders</h4>
                                <div className="space-y-3">
                                    {dashboardData.competitors.marketLeaders.map((leader, index) => (
                                        <div key={leader} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                                            <span className="font-medium">#{index + 1} {leader}</span>
                                            <span className="text-red-400 text-sm">High Threat</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-800/50 rounded-lg p-6">
                                <h4 className="text-lg font-semibold mb-4">Competitive Intelligence</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Direct Competitors</span>
                                        <span className="font-semibold">{dashboardData.competitors.direct}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Indirect Competitors</span>
                                        <span className="font-semibold">{dashboardData.competitors.indirect}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Market Concentration</span>
                                        <span className="font-semibold text-orange-400">Fragmented</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Competitive Intensity</span>
                                        <span className="font-semibold text-red-400">{dashboardData.marketOverview.competitiveIntensity}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'opportunities' && (
                    <div className="space-y-6">
                        {/* Opportunity Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                                <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                                <h4 className="text-2xl font-bold text-green-400">{dashboardData.opportunities.high}</h4>
                                <p className="text-slate-400">High Priority</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                                <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                                <h4 className="text-2xl font-bold text-yellow-400">{dashboardData.opportunities.medium}</h4>
                                <p className="text-slate-400">Medium Priority</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                                <Smartphone className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                                <h4 className="text-2xl font-bold text-blue-400">{dashboardData.opportunities.emerging}</h4>
                                <p className="text-slate-400">Emerging</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                                <DollarSign className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                                <h4 className="text-2xl font-bold text-purple-400">
                                    R{(dashboardData.opportunities.totalValue / 1000000).toFixed(0)}M
                                </h4>
                                <p className="text-slate-400">Total Value</p>
                            </div>
                        </div>

                        {/* Top Opportunities */}
                        <div className="bg-slate-800/50 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Top Market Opportunities</h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        title: 'Mobile Beauty Service Platform',
                                        description: 'First comprehensive platform for on-demand mobile beauty services',
                                        value: 'R30M',
                                        timeline: '6 months',
                                        roi: '45%',
                                        priority: 'Critical',
                                        color: 'green'
                                    },
                                    {
                                        title: 'AI-Powered Service Matching',
                                        description: 'Intelligent matching system connecting customers with optimal services',
                                        value: 'R40M',
                                        timeline: '12 months',
                                        roi: '35%',
                                        priority: 'High',
                                        color: 'yellow'
                                    },
                                    {
                                        title: 'Small Salon Solution',
                                        description: 'Affordable platform for salons with 1-5 employees',
                                        value: 'R28M',
                                        timeline: '9 months',
                                        roi: '65%',
                                        priority: 'High',
                                        color: 'blue'
                                    }
                                ].map((opportunity, index) => (
                                    <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-lg">{opportunity.title}</h4>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${opportunity.color === 'green' ? 'bg-green-500/20 text-green-400' :
                                                    opportunity.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {opportunity.priority}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 mb-3">{opportunity.description}</p>
                                        <div className="flex justify-between items-center text-sm">
                                            <span>Value: <strong>{opportunity.value}</strong></span>
                                            <span>Timeline: <strong>{opportunity.timeline}</strong></span>
                                            <span>ROI: <strong className="text-green-400">{opportunity.roi}</strong></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'threats' && (
                    <div className="space-y-6">
                        {/* Threat Assessment Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                                <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                                <h4 className="text-2xl font-bold text-red-400">{dashboardData.threats.critical}</h4>
                                <p className="text-slate-400">Critical Threats</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                                <Shield className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                                <h4 className="text-2xl font-bold text-orange-400">{dashboardData.threats.high}</h4>
                                <p className="text-slate-400">High Threats</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                                <Eye className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                                <h4 className="text-2xl font-bold text-yellow-400">{dashboardData.threats.medium}</h4>
                                <p className="text-slate-400">Medium Threats</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                                <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                                <h4 className="text-2xl font-bold text-blue-400">{dashboardData.threats.low}</h4>
                                <p className="text-slate-400">Low Threats</p>
                            </div>
                        </div>

                        {/* Critical Threats Detail */}
                        <div className="bg-slate-800/50 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4 text-red-400">Critical Threats Requiring Immediate Action</h3>
                            <div className="space-y-4">
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-red-400">Booksy Market Expansion</h4>
                                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Immediate</span>
                                    </div>
                                    <p className="text-slate-400 mb-2">
                                        Booksy is planning aggressive expansion into South African market with localized features and partnerships.
                                    </p>
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Impact: <strong className="text-red-400">Revenue Loss</strong></span>
                                        <span>Mitigation: <strong>Accelerate local partnerships</strong></span>
                                    </div>
                                </div>

                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-orange-400">Fresha Pricing Strategy</h4>
                                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">Short Term</span>
                                    </div>
                                    <p className="text-slate-400 mb-2">
                                        Fresha implementing aggressive pricing in SA market with 3-month free trials for enterprise clients.
                                    </p>
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Impact: <strong className="text-orange-400">Customer Acquisition</strong></span>
                                        <span>Mitigation: <strong>Competitive pricing tiers</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'trends' && (
                    <div className="space-y-6">
                        {/* Market Trends Analysis */}
                        <div className="bg-slate-800/50 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Emerging Market Trends</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-green-400">Growth Opportunities</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center">
                                            <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
                                            Mobile beauty services (+25% growth)
                                        </li>
                                        <li className="flex items-center">
                                            <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
                                            AI-powered service matching
                                        </li>
                                        <li className="flex items-center">
                                            <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
                                            Subscription-based beauty services
                                        </li>
                                        <li className="flex items-center">
                                            <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
                                            Men's grooming market expansion
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-red-400">Market Challenges</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center">
                                            <TrendingDown className="h-4 w-4 text-red-400 mr-2" />
                                            Economic pressure on discretionary spending
                                        </li>
                                        <li className="flex items-center">
                                            <TrendingDown className="h-4 w-4 text-red-400 mr-2" />
                                            Increased competition from international players
                                        </li>
                                        <li className="flex items-center">
                                            <TrendingDown className="h-4 w-4 text-red-400 mr-2" />
                                            Technology adoption barriers for traditional salons
                                        </li>
                                        <li className="flex items-center">
                                            <TrendingDown className="h-4 w-4 text-red-400 mr-2" />
                                            Regulatory changes in beauty industry
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Strategic Recommendations */}
                        <div className="bg-slate-800/50 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Strategic Recommendations</h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        priority: 'Urgent',
                                        title: 'Develop Mobile Beauty Platform',
                                        description: 'Launch mobile-first booking platform to capture emerging market segment',
                                        timeline: '6 months',
                                        investment: 'R5M',
                                        impact: 'R30M revenue potential'
                                    },
                                    {
                                        priority: 'High',
                                        title: 'AI Service Matching Implementation',
                                        description: 'Deploy machine learning for intelligent service recommendations',
                                        timeline: '12 months',
                                        investment: 'R10M',
                                        impact: '30% customer satisfaction increase'
                                    },
                                    {
                                        priority: 'High',
                                        title: 'Small Salon Affordable Tier',
                                        description: 'Create budget-friendly solution for small salons (1-5 employees)',
                                        timeline: '3 months',
                                        investment: 'R500K',
                                        impact: '40% market expansion'
                                    }
                                ].map((rec, index) => (
                                    <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold">{rec.title}</h4>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${rec.priority === 'Urgent' ? 'bg-red-500/20 text-red-400' :
                                                    rec.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {rec.priority}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-3">{rec.description}</p>
                                        <div className="flex justify-between items-center text-xs text-slate-500">
                                            <span>Timeline: {rec.timeline}</span>
                                            <span>Investment: {rec.investment}</span>
                                            <span>Impact: {rec.impact}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Metric Card Component
interface MetricCardProps {
    title: string;
    value: string;
    change: number;
    icon: React.ComponentType<any>;
    color: 'blue' | 'green' | 'orange' | 'purple';
    trend: 'up' | 'down' | 'stable';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color, trend }) => {
    const colorClasses = {
        blue: 'text-blue-400 bg-blue-500/10',
        green: 'text-green-400 bg-green-500/10',
        orange: 'text-orange-400 bg-orange-500/10',
        purple: 'text-purple-400 bg-purple-500/10'
    };

    const trendIcons = {
        up: TrendingUp,
        down: TrendingDown,
        stable: () => <div className="h-4 w-4 bg-slate-400 rounded-full" />
    };

    const TrendIcon = trendIcons[trend];
    const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400';

    return (
        <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className={`flex items-center ${trendColor}`}>
                    <TrendIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{Math.abs(change)}%</span>
                </div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    );
};

export default StrategicIntelligenceDashboard;
/**
 * SEO & Content Strategy Performance Dashboard
 * Comprehensive monitoring and success metrics for content strategy and SEO initiatives
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar
} from 'recharts';

interface DashboardMetrics {
    seoPerformance: {
        organicTrafficGrowth: number;
        keywordRankings: {
            top3: number;
            top10: number;
            top50: number;
        };
        localSearchRankings: number;
        technicalSeoScore: number;
        contentEngagementRate: number;
    };
    contentMetrics: {
        totalContentPieces: number;
        contentViews: number;
        leadMagnetDownloads: number;
        emailCaptureRate: number;
        socialShares: number;
    };
    businessMetrics: {
        organicConversions: number;
        revenueFromOrganic: number;
        customerAcquisitionCost: number;
        customerLifetimeValue: number;
        conversionRate: number;
    };
    campaignPerformance: {
        emailOpenRate: number;
        emailClickRate: number;
        socialEngagementRate: number;
        retargetingConversions: number;
    };
}

interface SuccessMetrics {
    target: number;
    current: number;
    status: 'achieved' | 'on-track' | 'at-risk' | 'behind';
    progress: number;
}

interface CampaignData {
    name: string;
    organicTraffic: number;
    conversions: number;
    revenue: number;
    engagement: number;
}

interface ContentPerformanceData {
    title: string;
    type: string;
    views: number;
    engagement: number;
    conversions: number;
    publishDate: string;
}

interface KeywordRankingData {
    keyword: string;
    position: number;
    previousPosition: number;
    searchVolume: number;
    difficulty: number;
    url: string;
}

export default function SEOCONTENTSTRATEGYDashboard() {
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        seoPerformance: {
            organicTrafficGrowth: 0,
            keywordRankings: {
                top3: 0,
                top10: 0,
                top50: 0
            },
            localSearchRankings: 0,
            technicalSeoScore: 0,
            contentEngagementRate: 0
        },
        contentMetrics: {
            totalContentPieces: 0,
            contentViews: 0,
            leadMagnetDownloads: 0,
            emailCaptureRate: 0,
            socialShares: 0
        },
        businessMetrics: {
            organicConversions: 0,
            revenueFromOrganic: 0,
            customerAcquisitionCost: 0,
            customerLifetimeValue: 0,
            conversionRate: 0
        },
        campaignPerformance: {
            emailOpenRate: 0,
            emailClickRate: 0,
            socialEngagementRate: 0,
            retargetingConversions: 0
        }
    });

    const [successTargets, setSuccessTargets] = useState<Record<string, SuccessMetrics>>({
        organicTrafficGrowth: {
            target: 40,
            current: 0,
            status: 'on-track',
            progress: 0
        },
        keywordRankings: {
            target: 25,
            current: 0,
            status: 'on-track',
            progress: 0
        },
        contentEngagement: {
            target: 25,
            current: 0,
            status: 'on-track',
            progress: 0
        },
        organicConversionRate: {
            target: 15,
            current: 0,
            status: 'on-track',
            progress: 0
        },
        localSearchRankings: {
            target: 15,
            current: 0,
            status: 'on-track',
            progress: 0
        }
    });

    const [campaignData, setCampaignData] = useState<CampaignData[]>([]);
    const [contentPerformance, setContentPerformance] = useState<ContentPerformanceData[]>([]);
    const [keywordRankings, setKeywordRankings] = useState<KeywordRankingData[]>([]);
    const [timeRange, setTimeRange] = useState('6months');

    useEffect(() => {
        // Simulate loading dashboard data
        loadDashboardData();
    }, [timeRange]);

    const loadDashboardData = () => {
        // Simulate API call with realistic data
        setTimeout(() => {
            setMetrics({
                seoPerformance: {
                    organicTrafficGrowth: 35.2,
                    keywordRankings: {
                        top3: 18,
                        top10: 67,
                        top50: 234
                    },
                    localSearchRankings: 12,
                    technicalSeoScore: 87,
                    contentEngagementRate: 28.5
                },
                contentMetrics: {
                    totalContentPieces: 156,
                    contentViews: 89432,
                    leadMagnetDownloads: 2847,
                    emailCaptureRate: 31.8,
                    socialShares: 5429
                },
                businessMetrics: {
                    organicConversions: 1247,
                    revenueFromOrganic: 187350,
                    customerAcquisitionCost: 45.20,
                    customerLifetimeValue: 285.60,
                    conversionRate: 18.3
                },
                campaignPerformance: {
                    emailOpenRate: 26.4,
                    emailClickRate: 5.8,
                    socialEngagementRate: 4.2,
                    retargetingConversions: 183
                }
            });

            setSuccessTargets({
                organicTrafficGrowth: {
                    target: 40,
                    current: 35.2,
                    status: 'on-track',
                    progress: 88
                },
                keywordRankings: {
                    target: 25,
                    current: 18,
                    status: 'on-track',
                    progress: 72
                },
                contentEngagement: {
                    target: 25,
                    current: 28.5,
                    status: 'achieved',
                    progress: 114
                },
                organicConversionRate: {
                    target: 15,
                    current: 18.3,
                    status: 'achieved',
                    progress: 122
                },
                localSearchRankings: {
                    target: 15,
                    current: 12,
                    status: 'on-track',
                    progress: 80
                }
            });

            setCampaignData([
                {
                    name: 'Summer Hair Care Campaign',
                    organicTraffic: 12450,
                    conversions: 234,
                    revenue: 45200,
                    engagement: 32.1
                },
                {
                    name: 'Local SEO Optimization',
                    organicTraffic: 8750,
                    conversions: 189,
                    revenue: 35100,
                    engagement: 28.4
                },
                {
                    name: 'Content Marketing Hub',
                    organicTraffic: 15600,
                    conversions: 312,
                    revenue: 58900,
                    engagement: 41.2
                },
                {
                    name: 'Lead Magnet Campaign',
                    organicTraffic: 6800,
                    conversions: 167,
                    revenue: 28900,
                    engagement: 24.7
                },
                {
                    name: 'Brand Authority Building',
                    organicTraffic: 9200,
                    conversions: 145,
                    revenue: 32100,
                    engagement: 19.8
                }
            ]);

            setContentPerformance([
                {
                    title: 'Complete Hair Care Guide for South Africa',
                    type: 'Guide',
                    views: 12500,
                    engagement: 68.4,
                    conversions: 234,
                    publishDate: '2024-01-15'
                },
                {
                    title: 'Summer Hair Protection Tips',
                    type: 'Blog Post',
                    views: 8900,
                    engagement: 45.2,
                    conversions: 156,
                    publishDate: '2024-01-20'
                },
                {
                    title: 'Find Your Perfect Hairstyle Quiz',
                    type: 'Interactive',
                    views: 6700,
                    engagement: 72.1,
                    conversions: 289,
                    publishDate: '2024-01-25'
                },
                {
                    title: 'Cape Town Beauty Salon Directory',
                    type: 'Landing Page',
                    views: 15600,
                    engagement: 34.8,
                    conversions: 198,
                    publishDate: '2024-01-30'
                },
                {
                    title: 'Traditional Braiding Techniques',
                    type: 'Video',
                    views: 9800,
                    engagement: 56.3,
                    conversions: 145,
                    publishDate: '2024-02-05'
                }
            ]);

            setKeywordRankings([
                {
                    keyword: 'hair salon appointments cape town',
                    position: 3,
                    previousPosition: 7,
                    searchVolume: 2400,
                    difficulty: 65,
                    url: '/locations/cape-town'
                },
                {
                    keyword: 'beauty salon booking online',
                    position: 2,
                    previousPosition: 5,
                    searchVolume: 1800,
                    difficulty: 58,
                    url: '/services/beauty-treatments'
                },
                {
                    keyword: 'hair salon johannesburg',
                    position: 4,
                    previousPosition: 6,
                    searchVolume: 3200,
                    difficulty: 72,
                    url: '/locations/johannesburg'
                },
                {
                    keyword: 'professional hair treatments',
                    position: 6,
                    previousPosition: 12,
                    searchVolume: 1600,
                    difficulty: 45,
                    url: '/services/hair-treatments'
                },
                {
                    keyword: 'beauty services online booking',
                    position: 1,
                    previousPosition: 3,
                    searchVolume: 2100,
                    difficulty: 52,
                    url: '/book'
                }
            ]);
        }, 1000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'achieved': return 'text-green-600 bg-green-100';
            case 'on-track': return 'text-blue-600 bg-blue-100';
            case 'at-risk': return 'text-yellow-600 bg-yellow-100';
            case 'behind': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const formatCurrency = (amount: number) => `R${amount.toLocaleString()}`;
    const formatPercentage = (value: number) => `${value}%`;

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">SEO & Content Strategy Dashboard</h1>
                    <p className="text-gray-600 mt-1">Comprehensive performance monitoring for appointmentbooking.co.za</p>
                </div>
                <div className="flex items-center space-x-4">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="1month">Last Month</option>
                        <option value="3months">Last 3 Months</option>
                        <option value="6months">Last 6 Months</option>
                        <option value="1year">Last Year</option>
                    </select>
                    <div className="text-sm text-gray-500">
                        Last updated: {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Success Metrics Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Success Metrics Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.entries(successTargets).map(([key, metric]) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-sm font-medium text-gray-600 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(metric.status)}`}>
                                    {metric.status}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                {metric.current}{key.includes('Rate') || key.includes('Engagement') || key.includes('Growth') ? '%' : ''}
                            </div>
                            <div className="text-sm text-gray-500 mb-2">
                                Target: {metric.target}{key.includes('Rate') || key.includes('Engagement') || key.includes('Growth') ? '%' : ''}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${metric.progress >= 100 ? 'bg-green-500' :
                                            metric.progress >= 75 ? 'bg-blue-500' :
                                                metric.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${Math.min(metric.progress, 100)}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {metric.progress}% of target
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-gray-600">Organic Traffic Growth</h3>
                        <div className="text-green-500">📈</div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {formatPercentage(metrics.seoPerformance.organicTrafficGrowth)}
                    </div>
                    <p className="text-sm text-green-600">+12.3% from last period</p>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-gray-600">Top 3 Keyword Rankings</h3>
                        <div className="text-blue-500">🎯</div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {metrics.seoPerformance.keywordRankings.top3}
                    </div>
                    <p className="text-sm text-blue-600">+5 from last period</p>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-gray-600">Content Engagement</h3>
                        <div className="text-purple-500">💬</div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {formatPercentage(metrics.seoPerformance.contentEngagementRate)}
                    </div>
                    <p className="text-sm text-purple-600">+8.7% from last period</p>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-purple-500 rounded-full" style={{ width: '114%' }}></div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-gray-600">Organic Revenue</h3>
                        <div className="text-green-500">💰</div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {formatCurrency(metrics.businessMetrics.revenueFromOrganic)}
                    </div>
                    <p className="text-sm text-green-600">+24.1% from last period</p>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                </div>
            </div>

            {/* Campaign Performance */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Performance</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Traffic & Conversions by Campaign</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={campaignData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                        fontSize={12}
                                    />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            name === 'conversions' ? value : formatCurrency(value as number),
                                            name === 'organicTraffic' ? 'Traffic' :
                                                name === 'conversions' ? 'Conversions' : 'Revenue'
                                        ]}
                                    />
                                    <Bar dataKey="organicTraffic" fill="#3B82F6" name="organicTraffic" />
                                    <Bar dataKey="conversions" fill="#10B981" name="conversions" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Campaign Revenue Performance</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={campaignData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="revenue"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {campaignData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Performance */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Content</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Content Title</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Views</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Engagement</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Conversions</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Published</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contentPerformance.map((content, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium text-gray-900">{content.title}</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                            {content.type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{content.views.toLocaleString()}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{ width: `${content.engagement}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600">{content.engagement}%</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{content.conversions}</td>
                                    <td className="py-3 px-4 text-gray-500">{new Date(content.publishDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Keyword Rankings */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Keyword Rankings Progress</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Keyword</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Current Position</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Previous Position</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Change</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Search Volume</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Difficulty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {keywordRankings.map((keyword, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium text-gray-900">{keyword.keyword}</td>
                                    <td className="py-3 px-4">
                                        <span className="font-semibold text-blue-600">#{keyword.position}</span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-500">#{keyword.previousPosition}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-sm font-medium ${keyword.position < keyword.previousPosition ? 'text-green-600' :
                                                keyword.position > keyword.previousPosition ? 'text-red-600' : 'text-gray-600'
                                            }`}>
                                            {keyword.position < keyword.previousPosition ? '↑' :
                                                keyword.position > keyword.previousPosition ? '↓' : '→'}
                                            {Math.abs(keyword.position - keyword.previousPosition)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{keyword.searchVolume.toLocaleString()}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                <div
                                                    className={`h-2 rounded-full ${keyword.difficulty < 30 ? 'bg-green-500' :
                                                            keyword.difficulty < 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${keyword.difficulty}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600">{keyword.difficulty}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Lead Magnet Downloads</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {metrics.contentMetrics.leadMagnetDownloads.toLocaleString()}
                    </div>
                    <p className="text-sm text-green-600">+15.2% this month</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Email Capture Rate</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatPercentage(metrics.contentMetrics.emailCaptureRate)}
                    </div>
                    <p className="text-sm text-blue-600">Above industry average</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Social Shares</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {metrics.contentMetrics.socialShares.toLocaleString()}
                    </div>
                    <p className="text-sm text-purple-600">+22.8% this month</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">CAC vs LTV Ratio</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        1:6.3
                    </div>
                    <p className="text-sm text-green-600">Excellent ratio</p>
                </div>
            </div>
        </div>
    );
}
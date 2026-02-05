'use client';

import { useEffect, useState } from 'react';

import ModernSalonDashboard from '../../components/modern-salon-dashboard';

interface Booking {
    id: string;
    user_name: string;
    user_email: string;
    user_phone: string;
    service_name: string;
    scheduled_time: number;
    status: string;
    payment_status: string;
    created_at: number;
}

interface DashboardStats {
    totalAppointments: number;
    confirmedAppointments: number;
    pendingAppointments: number;
    upcomingBookings: Booking[];
    totalRevenue: number;
    activeServices: number;
    recentAppointments: Booking[];
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all');

    const TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

    useEffect(() => {
        async function loadDashboard() {
            try {
                setLoading(true);
                const response = await fetch(`/api/dashboard?tenantId=${TENANT_ID}`);
                if (!response.ok) throw new Error('Failed to load dashboard');
                const data = await response.json();
                setStats(data.statistics);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
        const interval = setInterval(loadDashboard, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(amount / 100);
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            confirmed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            cancelled: 'bg-red-100 text-red-800',
            completed: 'bg-blue-100 text-blue-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Dashboard</h2>
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">No data available</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">InStyle Hair Boutique</h1>
                    <p className="text-gray-600">Salon Management Dashboard</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                            Total Appointments
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</div>
                        <p className="text-sm text-gray-500 mt-2">All time bookings</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                            Confirmed
                        </div>
                        <div className="text-3xl font-bold text-green-600">{stats.confirmedAppointments}</div>
                        <p className="text-sm text-gray-500 mt-2">Scheduled bookings</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                            Pending
                        </div>
                        <div className="text-3xl font-bold text-yellow-600">{stats.pendingAppointments}</div>
                        <p className="text-sm text-gray-500 mt-2">Awaiting confirmation</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                            Total Revenue
                        </div>
                        <div className="text-3xl font-bold text-blue-600">
                            {formatCurrency(stats.totalRevenue)}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">From confirmed bookings</p>
                    </div>
                </div>

                {/* Upcoming Bookings Section */}
                <div className="bg-white rounded-lg shadow mb-12">
                    <div className="border-b border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900">Upcoming Bookings</h2>
                        <p className="text-gray-600 mt-1">Next 10 scheduled appointments</p>
                    </div>

                    {/* Bookings Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Client
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Service
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Payment
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Contact
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {stats.recentAppointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No upcoming bookings
                                        </td>
                                    </tr>
                                ) : (
                                    stats.recentAppointments.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">
                                                    {booking.user_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {booking.service_name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {formatDate(booking.scheduled_time)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.payment_status)}`}>
                                                    {booking.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">
                                                    <a href={`tel:${booking.user_phone}`} className="text-primary hover:underline">
                                                        {booking.user_phone}
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                                📅 New Booking
                            </button>
                            <button className="w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                ⚙️ Manage Schedule
                            </button>
                            <button className="w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                📊 View Reports
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Services</h3>
                        <div className="text-4xl font-bold text-primary mb-2">{stats.activeServices}</div>
                        <p className="text-gray-600">Services available for booking</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-green-700 font-semibold">All Systems Operational</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Last updated: just now</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

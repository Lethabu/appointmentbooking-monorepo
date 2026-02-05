// Waitlist Management System for Fully Booked Time Slots
// File: apps/booking/components/booking/WaitlistManager.tsx

'use client';

import {
    Clock,
    Users,
    Bell,
    AlertCircle,
    CheckCircle,
    X,
    Calendar,
    Phone,
    Mail,
    Star,
    TrendingUp,
    UserPlus,
    Zap
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface WaitlistEntry {
    id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    requestedDate: string;
    requestedTime: string;
    serviceIds: string[];
    priority: number;
    status: 'active' | 'notified' | 'booked' | 'expired' | 'cancelled';
    notificationCount: number;
    lastNotified: Date | null;
    expiresAt: Date;
    preferences: {
        flexibleDates: boolean;
        flexibleTimes: boolean;
        preferredStaff: string[];
        communicationMethod: 'email' | 'sms' | 'both';
    };
    createdAt: Date;
    metadata: Record<string, any>;
}

interface WaitlistSlot {
    date: string;
    time: string;
    serviceId: string;
    currentBookings: number;
    maxCapacity: number;
    waitlistCount: number;
    nextAvailable: string | null;
}

interface WaitlistNotification {
    id: string;
    waitlistEntryId: string;
    type: 'slot_available' | 'partial_available' | 'cancellation';
    message: string;
    sentAt: Date;
    acknowledged: boolean;
    expiresAt: Date;
}

// Mock waitlist data
const generateMockWaitlist = (): WaitlistEntry[] => {
    return [
        {
            id: 'wl_001',
            customerId: 'cust_001',
            customerName: 'Sarah Johnson',
            customerEmail: 'sarah.johnson@email.com',
            customerPhone: '+27 82 123 4567',
            requestedDate: '2025-01-15',
            requestedTime: '14:00',
            serviceIds: ['service_haircut', 'service_styling'],
            priority: 1,
            status: 'active',
            notificationCount: 0,
            lastNotified: null,
            expiresAt: new Date('2025-01-20T23:59:59'),
            preferences: {
                flexibleDates: true,
                flexibleTimes: false,
                preferredStaff: ['staff_sarah', 'staff_michael'],
                communicationMethod: 'both'
            },
            createdAt: new Date('2025-01-05T10:30:00'),
            metadata: {
                source: 'website',
                referralCode: 'WELCOME10'
            }
        },
        {
            id: 'wl_002',
            customerId: 'cust_002',
            customerName: 'Michael Chen',
            customerEmail: 'michael.chen@email.com',
            customerPhone: '+27 83 987 6543',
            requestedDate: '2025-01-16',
            requestedTime: '10:30',
            serviceIds: ['service_color'],
            priority: 2,
            status: 'active',
            notificationCount: 1,
            lastNotified: new Date('2025-01-06T09:00:00'),
            expiresAt: new Date('2025-01-25T23:59:59'),
            preferences: {
                flexibleDates: false,
                flexibleTimes: true,
                preferredStaff: ['staff_emma'],
                communicationMethod: 'email'
            },
            createdAt: new Date('2025-01-06T14:15:00'),
            metadata: {
                source: 'mobile_app',
                customerTier: 'gold'
            }
        },
        {
            id: 'wl_003',
            customerId: 'cust_003',
            customerName: 'Emma Williams',
            customerEmail: 'emma.williams@email.com',
            customerPhone: '+27 84 555 7890',
            requestedDate: '2025-01-17',
            requestedTime: '16:00',
            serviceIds: ['service_bridal'],
            priority: 3,
            status: 'notified',
            notificationCount: 2,
            lastNotified: new Date('2025-01-07T11:30:00'),
            expiresAt: new Date('2025-01-22T23:59:59'),
            preferences: {
                flexibleDates: true,
                flexibleTimes: true,
                preferredStaff: [],
                communicationMethod: 'sms'
            },
            createdAt: new Date('2025-01-07T09:45:00'),
            metadata: {
                source: 'phone_call',
                specialRequests: 'Bridal package consultation'
            }
        }
    ];
};

// Waitlist entry component
function WaitlistEntryCard({
    entry,
    onNotify,
    onCancel,
    onAccept,
    timeToExpiry
}: {
    entry: WaitlistEntry;
    onNotify: (entryId: string) => void;
    onCancel: (entryId: string) => void;
    onAccept: (entryId: string) => void;
    timeToExpiry: string;
}) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-blue-100 text-blue-800';
            case 'notified': return 'bg-yellow-100 text-yellow-800';
            case 'booked': return 'bg-green-100 text-green-800';
            case 'expired': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityIcon = (priority: number) => {
        if (priority <= 1) return <Star className="w-4 h-4 text-yellow-500" />;
        if (priority <= 3) return <TrendingUp className="w-4 h-4 text-blue-500" />;
        return <Users className="w-4 h-4 text-gray-500" />;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {getPriorityIcon(entry.priority)}
                    <div>
                        <h3 className="font-semibold text-gray-900">{entry.customerName}</h3>
                        <p className="text-sm text-gray-600">Priority #{entry.priority}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                </span>
            </div>

            {/* Request Details */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Requested: {entry.requestedDate} at {entry.requestedTime}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{entry.customerEmail}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{entry.customerPhone}</span>
                </div>
            </div>

            {/* Preferences */}
            <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preferences</h4>
                <div className="flex flex-wrap gap-2">
                    {entry.preferences.flexibleDates && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Flexible Dates
                        </span>
                    )}
                    {entry.preferences.flexibleTimes && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Flexible Times
                        </span>
                    )}
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {entry.preferences.communicationMethod.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Notification Status */}
            {entry.notificationCount > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-yellow-800">
                        <Bell className="w-4 h-4" />
                        <span>Notified {entry.notificationCount} time{entry.notificationCount > 1 ? 's' : ''}</span>
                        {entry.lastNotified && (
                            <span className="text-yellow-600">
                                (Last: {entry.lastNotified.toLocaleDateString()})
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                    Expires: {timeToExpiry}
                </div>

                <div className="flex gap-2">
                    {entry.status === 'active' && (
                        <>
                            <button
                                onClick={() => onNotify(entry.id)}
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                            >
                                Notify
                            </button>
                            <button
                                onClick={() => onCancel(entry.id)}
                                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </>
                    )}

                    {entry.status === 'notified' && (
                        <>
                            <button
                                onClick={() => onAccept(entry.id)}
                                className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                            >
                                Accept Booking
                            </button>
                            <button
                                onClick={() => onCancel(entry.id)}
                                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                            >
                                Decline
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// Waitlist statistics component
function WaitlistStats({ waitlistEntries }: { waitlistEntries: WaitlistEntry[] }) {
    const activeEntries = waitlistEntries.filter(e => e.status === 'active').length;
    const notifiedEntries = waitlistEntries.filter(e => e.status === 'notified').length;
    const totalEntries = waitlistEntries.length;
    const avgWaitTime = waitlistEntries.length > 0
        ? Math.round(waitlistEntries.reduce((sum, e) => {
            const daysSinceCreated = Math.floor((Date.now() - e.createdAt.getTime()) / (1000 * 60 * 60 * 24));
            return sum + daysSinceCreated;
        }, 0) / waitlistEntries.length)
        : 0;

    const stats = [
        {
            label: 'Active Waitlist',
            value: activeEntries,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Pending Response',
            value: notifiedEntries,
            icon: Bell,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            label: 'Total Entries',
            value: totalEntries,
            icon: UserPlus,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            label: 'Avg Wait Time',
            value: `${avgWaitTime}d`,
            icon: Clock,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <div key={index} className={`${stat.bgColor} rounded-lg p-4 border border-gray-200`}>
                    <div className="flex items-center gap-3">
                        <div className={`${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Filter and search component
function WaitlistFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    dateFilter,
    onDateChange
}: {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    statusFilter: string;
    onStatusChange: (status: string) => void;
    dateFilter: string;
    onDateChange: (date: string) => void;
}) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="notified">Notified</option>
                <option value="booked">Booked</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
            </select>

            <input
                type="date"
                value={dateFilter}
                onChange={(e) => onDateChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
        </div>
    );
}

// Main component
export default function WaitlistManager() {
    const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Load waitlist entries
    useEffect(() => {
        const loadWaitlist = async () => {
            setLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                const entries = generateMockWaitlist();
                setWaitlistEntries(entries);
            } catch (error) {
                console.error('Failed to load waitlist:', error);
            } finally {
                setLoading(false);
            }
        };

        loadWaitlist();
    }, []);

    // Filter entries
    const filteredEntries = waitlistEntries.filter(entry => {
        const matchesSearch = !searchTerm ||
            entry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !statusFilter || entry.status === statusFilter;

        const matchesDate = !dateFilter || entry.requestedDate === dateFilter;

        return matchesSearch && matchesStatus && matchesDate;
    });

    // Handle actions
    const handleNotify = (entryId: string) => {
        setWaitlistEntries(prev => prev.map(entry =>
            entry.id === entryId
                ? {
                    ...entry,
                    notificationCount: entry.notificationCount + 1,
                    lastNotified: new Date(),
                    status: 'notified'
                }
                : entry
        ));

        // TODO: Send notification
        console.log('Notifying entry:', entryId);
    };

    const handleCancel = (entryId: string) => {
        setWaitlistEntries(prev => prev.map(entry =>
            entry.id === entryId
                ? { ...entry, status: 'cancelled' }
                : entry
        ));
    };

    const handleAccept = (entryId: string) => {
        setWaitlistEntries(prev => prev.map(entry =>
            entry.id === entryId
                ? { ...entry, status: 'booked' }
                : entry
        ));

        // TODO: Create booking from waitlist entry
        console.log('Creating booking from waitlist:', entryId);
    };

    // Calculate time to expiry
    const getTimeToExpiry = (expiresAt: Date) => {
        const now = new Date();
        const diff = expiresAt.getTime() - now.getTime();

        if (diff <= 0) return 'Expired';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h`;
        return 'Less than 1h';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading waitlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Waitlist Management</h2>
                    <p className="text-gray-600">
                        Manage customer waitlist for fully booked time slots
                    </p>
                </div>

                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Add to Waitlist
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Auto-Match
                    </button>
                </div>
            </div>

            {/* Statistics */}
            <WaitlistStats waitlistEntries={waitlistEntries} />

            {/* Filters */}
            <WaitlistFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                dateFilter={dateFilter}
                onDateChange={setDateFilter}
            />

            {/* Waitlist Entries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry) => (
                        <WaitlistEntryCard
                            key={entry.id}
                            entry={entry}
                            onNotify={handleNotify}
                            onCancel={handleCancel}
                            onAccept={handleAccept}
                            timeToExpiry={getTimeToExpiry(entry.expiresAt)}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No waitlist entries found</h3>
                        <p className="text-gray-600">
                            {searchTerm || statusFilter || dateFilter
                                ? 'Try adjusting your filters to see more entries.'
                                : 'No customers are currently on the waitlist.'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <Bell className="w-5 h-5 text-blue-600" />
                        <div className="text-left">
                            <div className="font-medium text-gray-900">Send Reminders</div>
                            <div className="text-sm text-gray-600">Remind active entries</div>
                        </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div className="text-left">
                            <div className="font-medium text-gray-900">Priority Sort</div>
                            <div className="text-sm text-gray-600">Reorder by priority</div>
                        </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div className="text-left">
                            <div className="font-medium text-gray-900">Availability Check</div>
                            <div className="text-sm text-gray-600">Find matching slots</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
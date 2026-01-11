// Recurring Appointment Booking System
// File: apps/booking/components/booking/RecurringAppointments.tsx

'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    RotateCcw,
    Edit3,
    Trash2,
    Plus,
    CheckCircle,
    AlertCircle,
    Settings,
    Users,
    DollarSign,
    TrendingUp,
    Pause,
    Play,
    Copy,
    ChevronDown,
    ChevronUp,
    Filter,
    Search,
    Download,
    Upload,
    X
} from 'lucide-react';

interface RecurringPattern {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
    interval: number; // every X days/weeks/months
    daysOfWeek?: number[]; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    endType: 'never' | 'after_occurrences' | 'on_date';
    endAfterOccurrences?: number;
    endDate?: string;
}

interface RecurringAppointment {
    id: string;
    seriesId: string;
    masterAppointmentId: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceIds: string[];
    serviceNames: string[];
    staffId: string;
    staffName: string;
    totalAmount: number;
    depositAmount: number;

    // Schedule details
    startDate: string;
    endDate?: string;
    startTime: string;
    duration: number;
    timezone: string;

    // Pattern
    pattern: RecurringPattern;

    // Status
    status: 'active' | 'paused' | 'completed' | 'cancelled';
    totalOccurrences: number;
    completedOccurrences: number;
    skippedOccurrences: number;
    nextOccurrence: string | null;

    // Payment
    paymentStatus: 'full_upfront' | 'installments' | 'per_appointment';
    installmentAmount?: number;
    installmentFrequency?: string;

    // Metadata
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    notes?: string;
    tags: string[];
}

interface Occurrence {
    id: string;
    seriesId: string;
    occurrenceNumber: number;
    scheduledDate: string;
    scheduledTime: string;
    status: 'scheduled' | 'completed' | 'skipped' | 'cancelled' | 'rescheduled';
    actualDate?: string;
    actualTime?: string;
    staffId?: string;
    staffName?: string;
    notes?: string;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    amount: number;
    discountApplied?: number;
}

// Mock recurring appointment data
const generateMockRecurringAppointments = (): RecurringAppointment[] => {
    return [
        {
            id: 'rec_001',
            seriesId: 'series_001',
            masterAppointmentId: 'appt_001',
            customerId: 'cust_001',
            customerName: 'Sarah Johnson',
            customerEmail: 'sarah.johnson@email.com',
            customerPhone: '+27 82 123 4567',
            serviceIds: ['service_haircut'],
            serviceNames: ['Monthly Haircut'],
            staffId: 'staff_sarah',
            staffName: 'Sarah Williams',
            totalAmount: 15000,
            depositAmount: 5000,

            startDate: '2025-01-15',
            endDate: '2025-12-15',
            startTime: '10:00',
            duration: 60,
            timezone: 'Africa/Johannesburg',

            pattern: {
                frequency: 'monthly',
                interval: 1,
                dayOfMonth: 15,
                endType: 'on_date',
                endDate: '2025-12-15'
            },

            status: 'active',
            totalOccurrences: 12,
            completedOccurrences: 2,
            skippedOccurrences: 0,
            nextOccurrence: '2025-03-15T10:00:00Z',

            paymentStatus: 'full_upfront',

            createdAt: '2025-01-15T09:00:00Z',
            updatedAt: '2025-01-15T09:00:00Z',
            createdBy: 'system',
            notes: 'Regular monthly haircut appointment',
            tags: ['haircut', 'monthly', 'regular']
        },
        {
            id: 'rec_002',
            seriesId: 'series_002',
            masterAppointmentId: 'appt_002',
            customerId: 'cust_002',
            customerName: 'Michael Chen',
            customerEmail: 'michael.chen@email.com',
            customerPhone: '+27 83 987 6543',
            serviceIds: ['service_facial', 'service_massage'],
            serviceNames: ['Weekly Facial', 'Weekly Massage'],
            staffId: 'staff_emma',
            staffName: 'Emma Wilson',
            totalAmount: 25000,
            depositAmount: 0,

            startDate: '2025-02-01',
            startTime: '14:30',
            duration: 120,
            timezone: 'Africa/Johannesburg',

            pattern: {
                frequency: 'weekly',
                interval: 1,
                daysOfWeek: [1], // Monday
                endType: 'after_occurrences',
                endAfterOccurrences: 26 // 6 months
            },

            status: 'active',
            totalOccurrences: 26,
            completedOccurrences: 1,
            skippedOccurrences: 0,
            nextOccurrence: '2025-02-08T14:30:00Z',

            paymentStatus: 'per_appointment',
            installmentAmount: 25000,
            installmentFrequency: 'weekly',

            createdAt: '2025-02-01T10:00:00Z',
            updatedAt: '2025-02-01T10:00:00Z',
            createdBy: 'customer',
            notes: 'Wellness package - facial and massage combo',
            tags: ['wellness', 'weekly', 'combo']
        }
    ];
};

// Pattern configuration component
function PatternConfigurator({
    pattern,
    onChange,
    startDate
}: {
    pattern: RecurringPattern;
    onChange: (pattern: RecurringPattern) => void;
    startDate: string;
}) {
    const frequencyOptions = [
        { value: 'daily', label: 'Daily', icon: '📅' },
        { value: 'weekly', label: 'Weekly', icon: '📆' },
        { value: 'biweekly', label: 'Bi-weekly', icon: '🔄' },
        { value: 'monthly', label: 'Monthly', icon: '🗓️' },
        { value: 'custom', label: 'Custom', icon: '⚙️' }
    ];

    const dayOptions = [
        { value: 0, label: 'Sunday' },
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday' }
    ];

    const handleFrequencyChange = (frequency: RecurringPattern['frequency']) => {
        onChange({
            ...pattern,
            frequency,
            interval: frequency === 'biweekly' ? 2 : 1
        });
    };

    return (
        <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Recurring Pattern</h4>

            {/* Frequency Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Frequency
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {frequencyOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleFrequencyChange(option.value as RecurringPattern['frequency'])}
                            className={`
                                p-4 border-2 rounded-lg text-center transition-all
                                ${pattern.frequency === option.value
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                            `}
                        >
                            <div className="text-2xl mb-2">{option.icon}</div>
                            <div className="text-sm font-medium">{option.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Interval */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repeat Every
                </label>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        min="1"
                        max="12"
                        value={pattern.interval}
                        onChange={(e) => onChange({
                            ...pattern,
                            interval: parseInt(e.target.value) || 1
                        })}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <span className="text-gray-600">
                        {pattern.frequency === 'daily' ? 'day(s)' :
                            pattern.frequency === 'weekly' ? 'week(s)' :
                                pattern.frequency === 'biweekly' ? 'week(s)' :
                                    pattern.frequency === 'monthly' ? 'month(s)' :
                                        'period(s)'}
                    </span>
                </div>
            </div>

            {/* Days of Week (for weekly patterns) */}
            {pattern.frequency === 'weekly' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Days of Week
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {dayOptions.map((day) => (
                            <button
                                key={day.value}
                                onClick={() => {
                                    const days = pattern.daysOfWeek || [];
                                    const newDays = days.includes(day.value)
                                        ? days.filter(d => d !== day.value)
                                        : [...days, day.value];
                                    onChange({
                                        ...pattern,
                                        daysOfWeek: newDays.sort()
                                    });
                                }}
                                className={`
                                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                                    ${(pattern.daysOfWeek || []).includes(day.value)
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }
                                `}
                            >
                                {day.label.substring(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Day of Month (for monthly patterns) */}
            {pattern.frequency === 'monthly' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Day of Month
                    </label>
                    <select
                        value={pattern.dayOfMonth || 1}
                        onChange={(e) => onChange({
                            ...pattern,
                            dayOfMonth: parseInt(e.target.value)
                        })}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* End Conditions */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    End After
                </label>
                <div className="space-y-3">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="endType"
                            value="never"
                            checked={pattern.endType === 'never'}
                            onChange={(e) => onChange({
                                ...pattern,
                                endType: e.target.value as RecurringPattern['endType']
                            })}
                            className="mr-3"
                        />
                        <span>No end date (ongoing)</span>
                    </label>

                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="endType"
                            value="after_occurrences"
                            checked={pattern.endType === 'after_occurrences'}
                            onChange={(e) => onChange({
                                ...pattern,
                                endType: e.target.value as RecurringPattern['endType']
                            })}
                            className="mr-3"
                        />
                        <span>After </span>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={pattern.endAfterOccurrences || 1}
                            onChange={(e) => onChange({
                                ...pattern,
                                endAfterOccurrences: parseInt(e.target.value) || 1
                            })}
                            className="w-20 mx-2 px-2 py-1 border border-gray-300 rounded"
                        />
                        <span>occurrences</span>
                    </label>

                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="endType"
                            value="on_date"
                            checked={pattern.endType === 'on_date'}
                            onChange={(e) => onChange({
                                ...pattern,
                                endType: e.target.value as RecurringPattern['endType']
                            })}
                            className="mr-3"
                        />
                        <span>On date: </span>
                        <input
                            type="date"
                            value={pattern.endDate || ''}
                            onChange={(e) => onChange({
                                ...pattern,
                                endDate: e.target.value
                            })}
                            min={startDate}
                            className="ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}

// Recurring appointment card component
function RecurringAppointmentCard({
    appointment,
    onEdit,
    onPause,
    onResume,
    onCancel,
    onViewDetails
}: {
    appointment: RecurringAppointment;
    onEdit: (id: string) => void;
    onPause: (id: string) => void;
    onResume: (id: string) => void;
    onCancel: (id: string) => void;
    onViewDetails: (id: string) => void;
}) {
    const progressPercentage = (appointment.completedOccurrences / appointment.totalOccurrences) * 100;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'paused': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatPattern = (pattern: RecurringPattern) => {
        const frequencyMap = {
            daily: 'Daily',
            weekly: 'Weekly',
            biweekly: 'Bi-weekly',
            monthly: 'Monthly',
            custom: 'Custom'
        };

        let patternText = frequencyMap[pattern.frequency];

        if (pattern.interval > 1) {
            patternText = `Every ${pattern.interval} ${pattern.frequency}s`;
        }

        return patternText;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {appointment.serviceNames.join(', ')}
                    </h3>
                    <p className="text-gray-600">{appointment.customerName}</p>
                    <div className="flex items-center gap-4 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                            {formatPattern(appointment.pattern)}
                        </span>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                        R{(appointment.totalAmount / 100).toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Value</div>
                </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{appointment.completedOccurrences} / {appointment.totalOccurrences} appointments</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                    <span className="text-gray-500">Start Date:</span>
                    <div className="font-medium">{new Date(appointment.startDate).toLocaleDateString()}</div>
                </div>
                <div>
                    <span className="text-gray-500">Next Appointment:</span>
                    <div className="font-medium">
                        {appointment.nextOccurrence
                            ? new Date(appointment.nextOccurrence).toLocaleDateString()
                            : 'Not scheduled'
                        }
                    </div>
                </div>
                <div>
                    <span className="text-gray-500">Staff:</span>
                    <div className="font-medium">{appointment.staffName}</div>
                </div>
                <div>
                    <span className="text-gray-500">Payment:</span>
                    <div className="font-medium">
                        {appointment.paymentStatus === 'full_upfront' ? 'Upfront' :
                            appointment.paymentStatus === 'installments' ? 'Installments' :
                                'Per Appointment'}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                    <button
                        onClick={() => onViewDetails(appointment.id)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => onEdit(appointment.id)}
                        className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-1"
                    >
                        <Edit3 className="w-3 h-3" />
                        Edit
                    </button>
                </div>

                <div className="flex gap-2">
                    {appointment.status === 'active' ? (
                        <button
                            onClick={() => onPause(appointment.id)}
                            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors flex items-center gap-1"
                        >
                            <Pause className="w-3 h-3" />
                            Pause
                        </button>
                    ) : appointment.status === 'paused' ? (
                        <button
                            onClick={() => onResume(appointment.id)}
                            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-1"
                        >
                            <Play className="w-3 h-3" />
                            Resume
                        </button>
                    ) : null}

                    <button
                        onClick={() => onCancel(appointment.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                    >
                        <Trash2 className="w-3 h-3" />
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// Create recurring appointment form
function CreateRecurringForm({
    isOpen,
    onClose,
    onSave
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (appointment: Partial<RecurringAppointment>) => void;
}) {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        serviceIds: [] as string[],
        staffId: '',
        startDate: '',
        startTime: '',
        duration: 60,
        pattern: {
            frequency: 'monthly' as RecurringPattern['frequency'],
            interval: 1,
            dayOfMonth: 15,
            endType: 'on_date' as RecurringPattern['endType'],
            endDate: '',
            endAfterOccurrences: 12
        },
        paymentStatus: 'full_upfront' as RecurringAppointment['paymentStatus'],
        notes: ''
    });

    const handleSave = () => {
        const newAppointment: Partial<RecurringAppointment> = {
            ...formData,
            id: `rec_${Date.now()}`,
            seriesId: `series_${Date.now()}`,
            masterAppointmentId: `appt_${Date.now()}`,
            totalOccurrences: formData.pattern.endType === 'after_occurrences'
                ? formData.pattern.endAfterOccurrences
                : 100, // Reasonable default
            completedOccurrences: 0,
            skippedOccurrences: 0,
            nextOccurrence: `${formData.startDate}T${formData.startTime}:00Z`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'user',
            tags: []
        };

        onSave(newAppointment);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Create Recurring Appointment</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Customer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Customer Name *
                            </label>
                            <input
                                type="text"
                                value={formData.customerName}
                                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter customer name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Customer Email *
                            </label>
                            <input
                                type="email"
                                value={formData.customerEmail}
                                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter customer email"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Customer Phone *
                            </label>
                            <input
                                type="tel"
                                value={formData.customerPhone}
                                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter customer phone"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Staff Member *
                            </label>
                            <select
                                value={formData.staffId}
                                onChange={(e) => setFormData(prev => ({ ...prev, staffId: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Select staff member</option>
                                <option value="staff_sarah">Sarah Williams</option>
                                <option value="staff_emma">Emma Wilson</option>
                                <option value="staff_michael">Michael Chen</option>
                            </select>
                        </div>
                    </div>

                    {/* Schedule Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Time *
                            </label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duration (minutes)
                            </label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Pattern Configuration */}
                    <PatternConfigurator
                        pattern={formData.pattern}
                        onChange={(pattern) => setFormData(prev => ({
                            ...prev,
                            pattern: {
                                ...pattern,
                                dayOfMonth: pattern.dayOfMonth ?? 1,
                                daysOfWeek: pattern.daysOfWeek ?? [],
                                endAfterOccurrences: pattern.endAfterOccurrences ?? 1,
                                endDate: pattern.endDate ?? ''
                            }
                        }))}
                        startDate={formData.startDate}
                    />

                    {/* Payment Settings */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Method
                        </label>
                        <select
                            value={formData.paymentStatus}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                paymentStatus: e.target.value as RecurringAppointment['paymentStatus']
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="full_upfront">Pay Full Amount Upfront</option>
                            <option value="installments">Pay in Installments</option>
                            <option value="per_appointment">Pay Per Appointment</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Add any special notes or instructions..."
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        Create Recurring Appointment
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main component
export default function RecurringAppointments() {
    const [appointments, setAppointments] = useState<RecurringAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Load recurring appointments
    useEffect(() => {
        const loadAppointments = async () => {
            setLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                const data = generateMockRecurringAppointments();
                setAppointments(data);
            } catch (error) {
                console.error('Failed to load recurring appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAppointments();
    }, []);

    // Filter appointments
    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = !searchTerm ||
            appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.serviceNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = !filterStatus || appointment.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Handle actions
    const handleEdit = (id: string) => {
        console.log('Edit appointment:', id);
        // TODO: Open edit form
    };

    const handlePause = (id: string) => {
        setAppointments(prev => prev.map(apt =>
            apt.id === id ? { ...apt, status: 'paused' as const } : apt
        ));
    };

    const handleResume = (id: string) => {
        setAppointments(prev => prev.map(apt =>
            apt.id === id ? { ...apt, status: 'active' as const } : apt
        ));
    };

    const handleCancel = (id: string) => {
        setAppointments(prev => prev.map(apt =>
            apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
        ));
    };

    const handleViewDetails = (id: string) => {
        console.log('View details:', id);
        // TODO: Open details modal
    };

    const handleCreate = (newAppointment: Partial<RecurringAppointment>) => {
        setAppointments(prev => [...prev, newAppointment as RecurringAppointment]);
    };

    // Statistics
    const stats = {
        total: appointments.length,
        active: appointments.filter(a => a.status === 'active').length,
        paused: appointments.filter(a => a.status === 'paused').length,
        totalValue: appointments.reduce((sum, a) => sum + a.totalAmount, 0)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading recurring appointments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Recurring Appointments</h2>
                    <p className="text-gray-600">
                        Manage recurring appointment series and patterns
                    </p>
                </div>

                <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create Recurring
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                        <RotateCcw className="w-8 h-8 text-blue-600" />
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total Series</div>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                            <div className="text-sm text-gray-600">Active</div>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-3">
                        <Pause className="w-8 h-8 text-yellow-600" />
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.paused}</div>
                            <div className="text-sm text-gray-600">Paused</div>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-purple-600" />
                        <div>
                            <div className="text-2xl font-bold text-gray-900">R{(stats.totalValue / 100).toFixed(0)}</div>
                            <div className="text-sm text-gray-600">Total Value</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search appointments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Appointments Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                        <RecurringAppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            onEdit={handleEdit}
                            onPause={handlePause}
                            onResume={handleResume}
                            onCancel={handleCancel}
                            onViewDetails={handleViewDetails}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <RotateCcw className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No recurring appointments found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || filterStatus
                                ? 'Try adjusting your search or filters.'
                                : 'Get started by creating your first recurring appointment.'
                            }
                        </p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                            Create Recurring Appointment
                        </button>
                    </div>
                )}
            </div>

            {/* Create Form Modal */}
            <CreateRecurringForm
                isOpen={showCreateForm}
                onClose={() => setShowCreateForm(false)}
                onSave={handleCreate}
            />
        </div>
    );
}
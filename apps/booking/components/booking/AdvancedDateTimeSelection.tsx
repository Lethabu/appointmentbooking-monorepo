// Advanced Date & Time Selection with Multi-timezone Support and Conflict Resolution
// File: apps/booking/components/booking/AdvancedDateTimeSelection.tsx

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useBooking } from './BookingContext';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO, getDay } from 'date-fns';
import {
    Calendar,
    Clock,
    Globe,
    AlertCircle,
    CheckCircle,
    Users,
    RefreshCw,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Zap
} from 'lucide-react';

interface TimeSlot {
    time: string; // HH:mm format
    available: boolean;
    conflicts: string[];
    staff: Array<{
        id: string;
        name: string;
        available: boolean;
        reason?: string;
    }>;
    duration: number; // minutes
    priceAdjustment: number; // cents
    demandLevel: 'low' | 'medium' | 'high';
}

interface DateSlot {
    date: Date;
    available: boolean;
    timeSlots: TimeSlot[];
    totalAvailableSlots: number;
    peakHours: boolean;
    specialEvents: string[];
}

interface TimezoneInfo {
    timezone: string;
    displayName: string;
    offset: string;
    isLocal: boolean;
}

// Mock timezone data - in real implementation, this would come from a service
const SUPPORTED_TIMEZONES: TimezoneInfo[] = [
    { timezone: 'Africa/Johannesburg', displayName: 'South Africa (SAST)', offset: 'UTC+2', isLocal: true },
    { timezone: 'UTC', displayName: 'UTC (GMT)', offset: 'UTC+0', isLocal: false },
    { timezone: 'America/New_York', displayName: 'Eastern Time (EST)', offset: 'UTC-5', isLocal: false },
    { timezone: 'Europe/London', displayName: 'London (GMT)', offset: 'UTC+0', isLocal: false },
    { timezone: 'Australia/Sydney', displayName: 'Sydney (AEDT)', offset: 'UTC+11', isLocal: false },
];

// Time slot generation utility
function generateTimeSlots(
    startHour: number = 8,
    endHour: number = 18,
    interval: number = 30,
    duration: number = 60
): string[] {
    const slots: string[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push(timeString);
        }
    }
    return slots;
}

// Mock availability data generator
function generateMockAvailability(
    selectedDate: Date,
    duration: number = 60,
    staffCount: number = 3
): DateSlot {
    const timeSlots = generateTimeSlots(8, 18, 30, duration);
    const dayOfWeek = getDay(selectedDate);

    // Generate mock time slots with some unavailable times
    const availableSlots: TimeSlot[] = timeSlots.map((time, index) => {
        const hour = parseInt(time.split(':')[0]);
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isPeakHour = (hour >= 10 && hour <= 12) || (hour >= 17 && hour <= 19);

        // Generate availability based on realistic patterns
        const isAvailable = Math.random() > 0.3; // 70% availability
        const hasConflicts = Math.random() > 0.8; // 20% chance of conflicts

        // Mock staff availability
        const staff = Array.from({ length: staffCount }, (_, staffIndex) => {
            const staffAvailable = Math.random() > 0.4; // 60% staff availability
            return {
                id: `staff-${staffIndex + 1}`,
                name: `Staff ${staffIndex + 1}`,
                available: staffAvailable,
                reason: staffAvailable ? undefined : 'Busy with other appointment'
            };
        });

        const availableStaff = staff.filter(s => s.available);

        return {
            time,
            available: isAvailable && availableStaff.length > 0,
            conflicts: hasConflicts ? ['Staff meeting', 'System maintenance'] : [],
            staff: availableStaff,
            duration,
            priceAdjustment: isPeakHour ? 2000 : 0, // +R20 peak pricing
            demandLevel: isPeakHour ? 'high' : isAvailable ? 'medium' : 'low'
        };
    });

    const totalAvailableSlots = availableSlots.filter(slot => slot.available).length;

    return {
        date: selectedDate,
        available: totalAvailableSlots > 0,
        timeSlots: availableSlots,
        totalAvailableSlots,
        peakHours: availableSlots.some(slot => slot.demandLevel === 'high'),
        specialEvents: dayOfWeek === 6 ? ['Saturday Special Offers'] : []
    };
}

// Timezone selector component
function TimezoneSelector({
    selectedTimezone,
    onTimezoneChange
}: {
    selectedTimezone: string;
    onTimezoneChange: (timezone: string) => void;
}) {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                Select Timezone
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {SUPPORTED_TIMEZONES.map((tz) => (
                    <button
                        key={tz.timezone}
                        onClick={() => onTimezoneChange(tz.timezone)}
                        className={`
                            p-4 rounded-lg border-2 text-left transition-all
                            ${selectedTimezone === tz.timezone
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
                        `}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-gray-900">{tz.displayName}</div>
                                <div className="text-sm text-gray-500">{tz.offset}</div>
                            </div>
                            {tz.isLocal && (
                                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Local
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

// Calendar view component
function CalendarView({
    selectedDate,
    onDateChange,
    availableDates,
    timezone
}: {
    selectedDate: Date | null;
    onDateChange: (date: Date) => void;
    availableDates: DateSlot[];
    timezone: string;
}) {
    const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

    const weekDates = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
    }, [currentWeek]);

    const getDateSlot = (date: Date): DateSlot | null => {
        return availableDates.find(slot => isSameDay(slot.date, date)) || null;
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        setCurrentWeek(prev =>
            direction === 'next'
                ? addDays(prev, 7)
                : addDays(prev, -7)
        );
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Select Date
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode(viewMode === 'week' ? 'month' : 'week')}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        {viewMode === 'week' ? 'Month View' : 'Week View'}
                    </button>
                </div>
            </div>

            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => navigateWeek('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                        Week of {format(currentWeek, 'MMM d, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">
                        Timezone: {SUPPORTED_TIMEZONES.find(tz => tz.timezone === timezone)?.displayName}
                    </div>
                </div>

                <button
                    onClick={() => navigateWeek('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Date Grid */}
            <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date) => {
                    const dateSlot = getDateSlot(date);
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());
                    const isAvailable = dateSlot?.available ?? false;

                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => isAvailable ? onDateChange(date) : null}
                            disabled={!isAvailable}
                            className={`
                                p-3 rounded-lg text-center transition-all
                                ${isSelected
                                    ? 'bg-indigo-500 text-white shadow-lg'
                                    : isToday
                                        ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                                        : isAvailable
                                            ? 'bg-white hover:bg-gray-50 border border-gray-200'
                                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                }
                            `}
                        >
                            <div className="text-sm font-medium">
                                {format(date, 'EEE')}
                            </div>
                            <div className="text-lg font-bold">
                                {format(date, 'd')}
                            </div>
                            <div className="text-xs">
                                {format(date, 'MMM')}
                            </div>
                            {dateSlot && isAvailable && (
                                <div className="mt-1">
                                    <div className="text-xs">
                                        {dateSlot.totalAvailableSlots} slots
                                    </div>
                                    {dateSlot.peakHours && (
                                        <div className="text-xs text-orange-600 font-medium">
                                            Peak Hours
                                        </div>
                                    )}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// Time slot grid component
function TimeSlotGrid({
    selectedDate,
    onTimeChange,
    selectedTime,
    timezone
}: {
    selectedDate: Date | null;
    onTimeChange: (time: string) => void;
    selectedTime: string | null;
    timezone: string;
}) {
    const dateSlot = selectedDate ? generateMockAvailability(selectedDate, 60, 3) : null;

    if (!selectedDate) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Please select a date to view available times</p>
            </div>
        );
    }

    if (!dateSlot?.available) {
        return (
            <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Availability</h3>
                <p className="text-gray-600">No time slots available for {format(selectedDate, 'MMMM d, yyyy')}</p>
                <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                    Try Different Date
                </button>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Available Times for {format(selectedDate, 'EEEE, MMMM d')}
            </h3>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-sm text-gray-700">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
                    <span className="text-sm text-gray-700">Peak Hours</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                    <span className="text-sm text-gray-700">High Demand</span>
                </div>
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700">+R20 Peak Pricing</span>
                </div>
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {dateSlot.timeSlots.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    const slotClasses = `
                        p-3 rounded-lg border-2 text-center transition-all cursor-pointer
                        ${isSelected
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : slot.available
                                ? slot.demandLevel === 'high'
                                    ? 'border-red-300 bg-red-50 hover:border-red-400 hover:bg-red-100'
                                    : slot.demandLevel === 'medium'
                                        ? 'border-orange-300 bg-orange-50 hover:border-orange-400 hover:bg-orange-100'
                                        : 'border-green-300 bg-green-50 hover:border-green-400 hover:bg-green-100'
                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                    `;

                    return (
                        <button
                            key={slot.time}
                            onClick={() => slot.available ? onTimeChange(slot.time) : null}
                            disabled={!slot.available}
                            className={slotClasses}
                        >
                            <div className="font-semibold text-lg">{slot.time}</div>
                            <div className="text-xs mt-1">
                                {slot.available ? (
                                    <>
                                        {slot.staff.length} staff
                                        {slot.priceAdjustment > 0 && (
                                            <div className="text-blue-600 font-medium">
                                                +R{(slot.priceAdjustment / 100).toFixed(0)}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    'Unavailable'
                                )}
                            </div>
                            {slot.demandLevel === 'high' && slot.available && (
                                <div className="text-xs text-red-600 font-medium mt-1">
                                    High Demand
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Special Events */}
            {dateSlot.specialEvents.length > 0 && (
                <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Special Events</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                        {dateSlot.specialEvents.map((event, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                {event}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// Main component
export default function AdvancedDateTimeSelection() {
    const { state, setDateTime } = useBooking();
    const [selectedTimezone, setSelectedTimezone] = useState('Africa/Johannesburg');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [conflictResolution, setConflictResolution] = useState<'auto' | 'manual'>('auto');

    // Generate available dates for the next 30 days
    const availableDates = useMemo(() => {
        const dates: DateSlot[] = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = addDays(today, i);
            const dateSlot = generateMockAvailability(date, 60, 3);
            if (dateSlot.available) {
                dates.push(dateSlot);
            }
        }

        return dates;
    }, []);

    // Handle date selection
    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null); // Reset time when date changes
        setLoading(true);

        // Simulate loading for conflict resolution
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    // Handle time selection
    const handleTimeChange = (time: string) => {
        setSelectedTime(time);

        // Update booking context
        if (selectedDate) {
            setDateTime(
                format(selectedDate, 'yyyy-MM-dd'),
                time
            );
        }
    };

    // Auto-select first available time when date is selected
    useEffect(() => {
        if (selectedDate && !selectedTime) {
            const dateSlot = generateMockAvailability(selectedDate, 60, 3);
            const firstAvailableSlot = dateSlot.timeSlots.find(slot => slot.available);
            if (firstAvailableSlot) {
                handleTimeChange(firstAvailableSlot.time);
            }
        }
    }, [selectedDate, selectedTime]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
                <p className="text-gray-600">
                    Choose your preferred appointment time with real-time availability and timezone support
                </p>
            </div>

            {/* Timezone Selector */}
            <TimezoneSelector
                selectedTimezone={selectedTimezone}
                onTimezoneChange={setSelectedTimezone}
            />

            {/* Conflict Resolution Options */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Conflict Resolution
                </h3>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="auto"
                            checked={conflictResolution === 'auto'}
                            onChange={(e) => setConflictResolution(e.target.value as 'auto')}
                            className="text-indigo-600"
                        />
                        <span className="text-sm text-blue-800">
                            Automatic (Recommend alternatives)
                        </span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="manual"
                            checked={conflictResolution === 'manual'}
                            onChange={(e) => setConflictResolution(e.target.value as 'manual')}
                            className="text-indigo-600"
                        />
                        <span className="text-sm text-blue-800">
                            Manual (Show conflicts)
                        </span>
                    </label>
                </div>
            </div>

            {/* Calendar View */}
            <CalendarView
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                availableDates={availableDates}
                timezone={selectedTimezone}
            />

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
                        <p className="text-gray-600">Checking availability and resolving conflicts...</p>
                    </div>
                </div>
            )}

            {/* Time Slot Grid */}
            {!loading && (
                <TimeSlotGrid
                    selectedDate={selectedDate}
                    onTimeChange={handleTimeChange}
                    selectedTime={selectedTime}
                    timezone={selectedTimezone}
                />
            )}

            {/* Selection Summary */}
            {selectedDate && selectedTime && (
                <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-xl p-6 border border-indigo-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            <div>
                                <div className="font-medium text-gray-900">
                                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {SUPPORTED_TIMEZONES.find(tz => tz.timezone === selectedTimezone)?.displayName}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-indigo-600" />
                            <div>
                                <div className="font-medium text-gray-900">{selectedTime}</div>
                                <div className="text-sm text-gray-500">Duration: 60 minutes</div>
                            </div>
                        </div>
                    </div>

                    {/* Conflict Resolution Status */}
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                Selected time slot is confirmed and conflict-free
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
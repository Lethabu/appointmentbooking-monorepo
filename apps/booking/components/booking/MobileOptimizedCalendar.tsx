'use client';

import { ChevronLeft, ChevronRight, Calendar, Clock, Check, AlertCircle } from 'lucide-react';
import React, { useState, useCallback } from 'react';

interface TimeSlot {
    time: string;
    available: boolean;
    reason?: string;
    popular?: boolean;
}

interface MobileOptimizedCalendarProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    selectedTime: string;
    onTimeSelect: (time: string) => void;
    availableSlots: TimeSlot[];
    loading?: boolean;
    error?: string | null;
    businessHours: {
        [key: string]: { start: string | null; end: string | null };
    };
    showUrgencyIndicators?: boolean;
}

const BUSINESS_HOURS = {
    monday: { start: '09:00', end: '17:00' },
    tuesday: { start: '09:00', end: '17:00' },
    wednesday: { start: '09:00', end: '17:00' },
    thursday: { start: '09:00', end: '17:00' },
    friday: { start: '09:00', end: '17:00' },
    saturday: { start: '08:00', end: '16:00' },
    sunday: { start: null, end: null }, // Closed
};

export default function MobileOptimizedCalendar({
    selectedDate,
    onDateChange,
    selectedTime,
    onTimeSelect,
    availableSlots,
    loading = false,
    error = null,
    businessHours = BUSINESS_HOURS,
    showUrgencyIndicators = true,
}: MobileOptimizedCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [announcement, setAnnouncement] = useState('');

    // Generate calendar days
    const generateCalendarDays = useCallback(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dateString = date.toISOString().split('T')[0];
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.getTime() === today.getTime();
            const isPast = date < today;
            const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
            const isClosed = !businessHours[dayOfWeek].start;
            const isBookable = isCurrentMonth && !isPast && !isClosed;

            days.push({
                date,
                dateString,
                isCurrentMonth,
                isToday,
                isPast,
                isClosed,
                isBookable,
            });
        }

        return days;
    }, [currentMonth, businessHours]);

    const handleDateSelect = (dateString: string, isBookable: boolean) => {
        if (!isBookable) return;

        onDateChange(dateString);
        setAnnouncement(`Date ${new Date(dateString).toLocaleDateString()} selected. Please choose a time slot.`);

        // Announce to screen readers
        const announcementElement = document.getElementById('calendar-announcement');
        if (announcementElement) {
            announcementElement.textContent = announcement;
        }
    };

    const handleTimeSelect = (time: string, available: boolean) => {
        if (!available) return;

        onTimeSelect(time);
        setAnnouncement(`Time ${time} selected for ${new Date(selectedDate).toLocaleDateString()}.`);

        // Announce to screen readers
        const announcementElement = document.getElementById('calendar-announcement');
        if (announcementElement) {
            announcementElement.textContent = announcement;
        }
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
        setCurrentMonth(newMonth);
    };

    const formatTimeSlot = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getUrgencyIndicator = (time: string) => {
        if (!showUrgencyIndicators) return null;

        // Simulate urgency based on time proximity to now or popular slots
        const now = new Date();
        const [hours, minutes] = time.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);

        const hoursDiff = (slotTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 2 && hoursDiff > 0) {
            return { type: 'urgent', text: 'Hurry!', color: 'text-red-600' };
        } else if (hoursDiff < 24 && hoursDiff > 0) {
            return { type: 'limited', text: 'Limited', color: 'text-orange-600' };
        }

        return null;
    };

    const calendarDays = generateCalendarDays();
    const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Screen Reader Announcements */}
            <div
                id="calendar-announcement"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {announcement}
            </div>

            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigateMonth('prev')}
                        className="p-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors touch-manipulation"
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <h2 className="text-xl font-bold" aria-live="polite">
                        {monthYear}
                    </h2>

                    <button
                        onClick={() => navigateMonth('next')}
                        className="p-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors touch-manipulation"
                        aria-label="Next month"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex items-center text-blue-100">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="text-sm">Select your appointment date</span>
                </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div
                        key={day}
                        className="p-3 text-center text-sm font-semibold text-gray-600"
                        aria-label={day}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                    const isSelected = day.dateString === selectedDate;

                    return (
                        <button
                            key={index}
                            onClick={() => handleDateSelect(day.dateString, day.isBookable)}
                            disabled={!day.isBookable}
                            className={`
                aspect-square flex items-center justify-center text-lg font-medium transition-all duration-200 touch-manipulation
                ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${day.isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}
                ${isSelected ? 'bg-blue-500 text-white' : ''}
                ${day.isPast || day.isClosed ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100'}
                ${!day.isBookable ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
                            aria-label={`${day.date.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}${!day.isBookable ? ' - Not available' : ''}`}
                            aria-pressed={isSelected}
                        >
                            {day.date.getDate()}
                            {day.isToday && !isSelected && (
                                <div className="absolute w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Business Hours Info */}
            <div className="p-4 bg-gray-50 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                        <span className="font-medium">Weekdays:</span> 9:00 AM - 5:00 PM
                    </div>
                    <div>
                        <span className="font-medium">Saturday:</span> 8:00 AM - 4:00 PM
                    </div>
                    <div className="md:col-span-2 text-red-600">
                        <span className="font-medium">Sunday:</span> Closed
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border-t">
                    <div className="flex items-center text-red-800">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Error</span>
                    </div>
                    <p className="text-red-700 mt-1 text-sm">{error}</p>
                </div>
            )}

            {/* Time Selection */}
            {selectedDate && !error && (
                <div className="p-6 border-t">
                    <div className="flex items-center mb-4">
                        <Clock className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Available Times for {new Date(selectedDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </h3>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-3 text-gray-600">Loading available times...</span>
                        </div>
                    ) : availableSlots.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-700 text-sm">
                                No available time slots for this date. Please select another date.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {availableSlots.map((slot) => {
                                const urgency = getUrgencyIndicator(slot.time);
                                const isSelected = selectedTime === slot.time;

                                return (
                                    <button
                                        key={slot.time}
                                        onClick={() => handleTimeSelect(slot.time, slot.available)}
                                        disabled={!slot.available}
                                        className={`
                      relative p-4 rounded-xl border-2 font-medium text-sm transition-all duration-300 touch-manipulation min-h-[44px]
                      ${isSelected
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : slot.available
                                                    ? 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }
                      ${slot.popular ? 'ring-1 ring-orange-300' : ''}
                    `}
                                        aria-pressed={isSelected}
                                        aria-describedby={`time-${slot.time}-description`}
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="font-semibold">{formatTimeSlot(slot.time)}</span>
                                            {urgency && (
                                                <span className={`text-xs ${urgency.color} font-medium mt-1`}>
                                                    {urgency.text}
                                                </span>
                                            )}
                                        </div>

                                        {!slot.available && slot.reason && (
                                            <span id={`time-${slot.time}-description`} className="sr-only">
                                                {slot.reason}
                                            </span>
                                        )}

                                        {isSelected && (
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" aria-hidden="true" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Selection Summary */}
            {selectedDate && selectedTime && (
                <div className="p-6 bg-green-50 border-t">
                    <div className="flex items-center text-green-800">
                        <Check className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Appointment Selected</span>
                    </div>
                    <p className="text-green-700 mt-1">
                        {new Date(selectedDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })} at {formatTimeSlot(selectedTime)}
                    </p>
                </div>
            )}
        </div>
    );
}
// Step 2: Date & Time Selection
// File: apps/booking/components/booking/Step2DateTime.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useBooking, formatDuration } from './BookingContext';

interface TimeSlot {
    time: string;
    available: boolean;
    reason?: string;
}

// Business hours configuration - moved outside component for stability
const businessHours = {
    monday: { start: '09:00', end: '17:00' },
    tuesday: { start: '09:00', end: '17:00' },
    wednesday: { start: '09:00', end: '17:00' },
    thursday: { start: '09:00', end: '17:00' },
    friday: { start: '09:00', end: '17:00' },
    saturday: { start: '08:00', end: '16:00' },
    sunday: { start: null, end: null }, // Closed
};

export default function Step2DateTime() {
    const { state, setDateTime } = useBooking();
    const [selectedDate, setSelectedDate] = useState(state.selectedDate || '');
    const [selectedTime, setSelectedTime] = useState(state.selectedTime || '');
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Get maximum date (3 months from now)
    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        return maxDate.toISOString().split('T')[0];
    };

    // Check if date is valid (not Sunday, not in past)
    const isDateValid = (dateString: string): boolean => {
        const date = new Date(dateString);
        const dayOfWeek = date.getDay();

        // Sunday = 0
        if (dayOfWeek === 0) return false;

        // Check if in past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return false;

        return true;
    };

    // Generate default time slots (30-minute intervals)
    const generateDefaultSlots = useCallback((dateString: string): TimeSlot[] => {
        const date = new Date(dateString);
        const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()] as keyof typeof businessHours;
        const hours = businessHours[dayOfWeek];

        if (!hours.start || !hours.end) {
            return [];
        }

        const slots: TimeSlot[] = [];
        const [startHour, startMin] = hours.start.split(':').map(Number);
        const [endHour, endMin] = hours.end.split(':').map(Number);

        let currentHour = startHour;
        let currentMin = startMin;

        while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
            const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

            slots.push({
                time: timeString,
                available: true,
            });

            // Increment by 30 minutes
            currentMin += 30;
            if (currentMin >= 60) {
                currentMin = 0;
                currentHour += 1;
            }
        }

        return slots;
    }, []);

    // Fetch available time slots from Worker API when date changes
    useEffect(() => {
        if (!selectedDate) {
            setAvailableSlots([]);
            return;
        }

        if (!isDateValid(selectedDate)) {
            setError('Selected date is not available. We are closed on Sundays.');
            setAvailableSlots([]);
            return;
        }

        async function fetchAvailability() {
            try {
                setLoading(true);
                setError(null);

                const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
                const serviceId = state.selectedServices[0]?.id; // Use first service for availability

                if (!serviceId) {
                    setAvailableSlots(generateDefaultSlots(selectedDate));
                    return;
                }

                // Call Worker availability API at /api/tenant/:tenantId/availability
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
                const date = new Date(selectedDate).toISOString().split('T')[0]; // Ensure YYYY-MM-DD format

                const response = await fetch(
                    `${apiUrl}/api/tenant/${tenantId}/availability?date=${date}&serviceId=${serviceId}`,
                    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
                );

                if (!response.ok) {
                    throw new Error(`Availability API error: ${response.status}`);
                }

                const data = await (response.json() as Promise<any>);

                // Convert ISO datetime slots from Worker API to TimeSlot format
                if (data.slots && Array.isArray(data.slots)) {
                    const formattedSlots: TimeSlot[] = data.slots.map((slot: any) => ({
                        time: new Date(slot.start).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: false }),
                        available: true,
                        reason: undefined
                    }));
                    setAvailableSlots(formattedSlots);
                } else {
                    setAvailableSlots(generateDefaultSlots(selectedDate));
                }
            } catch (err) {
                console.error('Error fetching availability from Worker API:', err);
                // Fallback to default slots if API fails
                setAvailableSlots(generateDefaultSlots(selectedDate));
            } finally {
                setLoading(false);
            }
        }

        fetchAvailability();
    }, [selectedDate, state.selectedServices, generateDefaultSlots]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        setSelectedTime(''); // Reset time when date changes
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setDateTime(selectedDate, time);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-ZA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Date & Time</h2>
            <p className="text-gray-600 mb-6">
                Select your preferred appointment date and time
            </p>

            {/* Selected Services Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 font-semibold mb-2">Selected Services:</p>
                <div className="space-y-1">
                    {state.selectedServices.map((service) => (
                        <p key={service.id} className="text-sm text-blue-700">
                            • {service.name} ({formatDuration(service.durationMinutes)})
                        </p>
                    ))}
                </div>
            </div>

            {/* Date Picker */}
            <div className="mb-6">
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Date
                </label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson focus:border-crimson"
                />
                {selectedDate && (
                    <p className="text-sm text-gray-600 mt-2">
                        {formatDate(selectedDate)}
                    </p>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Time Slots */}
            {selectedDate && !error && (
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Time
                    </label>

                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crimson"></div>
                        </div>
                    ) : availableSlots.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-700 text-sm">
                                No available time slots for this date. Please select another date.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {availableSlots.map((slot) => (
                                <button
                                    key={slot.time}
                                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                                    disabled={!slot.available}
                                    className={`
                    px-4 py-3 rounded-lg font-medium text-sm transition-all
                    ${selectedTime === slot.time
                                            ? 'bg-crimson text-white ring-2 ring-crimson ring-offset-2'
                                            : slot.available
                                                ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-crimson hover:bg-crimson hover:bg-opacity-10'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }
                  `}
                                    title={!slot.available ? slot.reason : undefined}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Selection Summary */}
            {selectedDate && selectedTime && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-semibold mb-1">✓ Appointment Time Selected</p>
                    <p className="text-green-700 text-sm">
                        {formatDate(selectedDate)} at {selectedTime}
                    </p>
                </div>
            )}

            {/* Business Hours Info */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Business Hours:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Monday - Friday: 09:00 - 17:00</div>
                    <div>Saturday: 08:00 - 16:00</div>
                    <div className="col-span-2 text-red-600">Sunday: Closed</div>
                </div>
            </div>
        </div>
    );
}

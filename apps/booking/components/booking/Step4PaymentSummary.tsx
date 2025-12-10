// Step 4: Payment Summary
// File: apps/booking/components/booking/Step4PaymentSummary.tsx

'use client';

import React, { useState } from 'react';
import { useBooking, formatPrice, formatDuration } from './BookingContext';

export default function Step4PaymentSummary() {
    const { state, setBookingConfirmation, nextStep } = useBooking();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmitBooking = async () => {
        try {
            setSubmitting(true);
            setError(null);

            const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

            // Prepare booking data
            const bookingData = {
                tenantId,
                serviceId: state.selectedServices[0].id, // Primary service
                customer: {
                    name: state.customerDetails!.name,
                    email: state.customerDetails!.email,
                    phone: state.customerDetails!.phone,
                },
                scheduledTime: `${state.selectedDate}T${state.selectedTime}:00Z`,
                notes: state.customerDetails!.notes || '',
            };

            // Submit booking
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to create booking');
            }

            const result = await response.json();

            // Save booking ID and move to confirmation
            setBookingConfirmation(result.booking.id);
            nextStep();
        } catch (err) {
            console.error('Booking error:', err);
            setError(err instanceof Error ? err.message : 'Failed to create booking. Please try again.');
        } finally {
            setSubmitting(false);
        }
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Summary</h2>
            <p className="text-gray-600 mb-6">
                Please review your booking details before confirming
            </p>

            {/* Booking Details Card */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
                {/* Services */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Services</h3>
                    <div className="space-y-3">
                        {state.selectedServices.map((service) => (
                            <div key={service.id} className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800">{service.name}</p>
                                    <p className="text-sm text-gray-600">{formatDuration(service.durationMinutes)}</p>
                                </div>
                                <p className="font-semibold text-gray-800">{formatPrice(service.price)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Date & Time */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Appointment</h3>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 mr-2 text-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatDate(state.selectedDate!)}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 mr-2 text-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{state.selectedTime}</span>
                        </div>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Your Details</h3>
                    <div className="space-y-2 text-gray-700">
                        <p><strong>Name:</strong> {state.customerDetails?.name}</p>
                        <p><strong>Email:</strong> {state.customerDetails?.email}</p>
                        <p><strong>Phone:</strong> {state.customerDetails?.phone}</p>
                        {state.customerDetails?.notes && (
                            <p><strong>Notes:</strong> {state.customerDetails.notes}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-crimson bg-opacity-5 border-2 border-crimson rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Details</h3>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-gray-700">
                        <span>Total Service Price:</span>
                        <span className="font-semibold">{formatPrice(state.totalPrice)}</span>
                    </div>

                    <div className="flex items-center justify-between text-crimson">
                        <span className="font-semibold">Booking Fee (20%):</span>
                        <span className="font-bold text-lg">{formatPrice(state.bookingFee)}</span>
                    </div>

                    <div className="flex items-center justify-between text-gray-700">
                        <span>Remaining Balance:</span>
                        <span className="font-semibold">{formatPrice(state.remainingBalance)}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-crimson">
                    <p className="text-sm text-gray-700 mb-2">
                        <strong>How Payment Works:</strong>
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Pay <strong className="text-crimson">{formatPrice(state.bookingFee)}</strong> booking fee now to secure your appointment</li>
                        <li>Pay remaining <strong>{formatPrice(state.remainingBalance)}</strong> at the salon</li>
                        <li>Booking fee is non-refundable but can be rescheduled</li>
                    </ul>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-600 font-semibold">Error</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                onClick={handleSubmitBooking}
                disabled={submitting}
                className={`
          w-full py-4 rounded-lg font-bold text-lg transition-all
          ${submitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-crimson text-white hover:bg-crimson-dark shadow-lg hover:shadow-xl'
                    }
        `}
            >
                {submitting ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </span>
                ) : (
                    `Confirm Booking & Pay ${formatPrice(state.bookingFee)}`
                )}
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-4">
                By confirming, you agree to our{' '}
                <a href="/terms" className="text-crimson hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-crimson hover:underline">Privacy Policy</a>
            </p>
        </div>
    );
}

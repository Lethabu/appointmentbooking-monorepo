// Step 5: Confirmation
// File: apps/booking/components/booking/Step5Confirmation.tsx

'use client';

import React from 'react';
import { useBooking, formatPrice, formatDuration } from './BookingContext';

export default function Step5Confirmation() {
    const { state, resetWizard } = useBooking();

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-ZA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const whatsappNumber = '+27699171527';
    const whatsappMessage = encodeURIComponent(
        `Hi! I've just booked an appointment for ${formatDate(state.selectedDate!)} at ${state.selectedTime}. Booking ID: ${state.bookingId}`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <div className="text-center">
            {/* Success Icon */}
            <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>

            {/* Success Message */}
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed! 🎉</h2>
            <p className="text-gray-600 mb-8">
                Your appointment has been successfully booked
            </p>

            {/* Booking Reference */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 inline-block">
                <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                <p className="text-2xl font-mono font-bold text-crimson">{state.bookingId?.slice(0, 8).toUpperCase()}</p>
            </div>

            {/* Booking Details */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6 text-left">
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Appointment Details</h3>

                {/* Services */}
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Services</p>
                    {state.selectedServices.map((service) => (
                        <div key={service.id} className="flex items-center justify-between mb-2">
                            <span className="text-gray-700">{service.name}</span>
                            <span className="text-gray-600 text-sm">{formatDuration(service.durationMinutes)}</span>
                        </div>
                    ))}
                </div>

                {/* Date & Time */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-500 uppercase mb-2">When</p>
                    <p className="text-gray-800 font-semibold">{formatDate(state.selectedDate!)}</p>
                    <p className="text-gray-600">{state.selectedTime}</p>
                </div>

                {/* Payment */}
                <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Payment</p>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Booking Fee Paid:</span>
                            <span className="font-semibold text-green-600">{formatPrice(state.bookingFee)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Pay at Salon:</span>
                            <span className="font-semibold text-gray-800">{formatPrice(state.remainingBalance)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* WhatsApp Confirmation */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-green-800 mb-3">Get Instant Confirmation</h3>
                <p className="text-green-700 text-sm mb-4">
                    Click below to confirm your booking via WhatsApp and receive appointment reminders
                </p>
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
                >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Confirm on WhatsApp
                </a>
            </div>

            {/* Email Confirmation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                    📧 A confirmation email has been sent to <strong>{state.customerDetails?.email}</strong>
                </p>
            </div>

            {/* What's Next */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 text-left">
                <h3 className="text-lg font-bold text-gray-800 mb-3">What Happens Next?</h3>
                <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-crimson text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</span>
                        <span>You&apos;ll receive a confirmation message on WhatsApp</span>
                    </li>
                    <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-crimson text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</span>
                        <span>We&apos;ll send you a reminder 24 hours before your appointment</span>
                    </li>
                    <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-crimson text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</span>
                        <span>Arrive 5-10 minutes early and pay the remaining balance at the salon</span>
                    </li>
                </ol>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => window.print()}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                    Print Confirmation
                </button>
                <button
                    onClick={resetWizard}
                    className="flex-1 px-6 py-3 bg-crimson text-white rounded-lg font-semibold hover:bg-crimson-dark transition-all"
                >
                    Book Another Appointment
                </button>
            </div>

            {/* Support */}
            <div className="mt-8 text-sm text-gray-600">
                <p>Need to reschedule or have questions?</p>
                <p className="mt-1">
                    Contact us on WhatsApp:{' '}
                    <a href={`https://wa.me/${whatsappNumber}`} className="text-crimson hover:underline font-semibold">
                        +27 69 917 1527
                    </a>
                </p>
            </div>
        </div>
    );
}

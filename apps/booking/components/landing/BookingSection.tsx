import React from 'react';

import BookingWizard from '../booking/BookingWizard';

/**
 * Booking section component that wraps the booking wizard
 * Provides a dedicated section for appointment booking with branded styling
 */
export const BookingSection: React.FC = () => {
    return (
        <section
            id="booking"
            className="py-20 bg-gradient-to-br from-[#C0392B] to-[#5D2E0C] text-white"
            role="region"
            aria-labelledby="booking-heading"
        >
            <div className="container mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-12">
                    <h2 id="booking-heading" className="text-3xl md:text-4xl font-bold font-serif mb-4">
                        Book Your Appointment
                    </h2>
                    <p className="text-white/80 max-w-2xl mx-auto">
                        Ready to transform your look? Select your service below.
                    </p>
                </div>

                {/* Booking wizard container */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto text-gray-800">
                    <div className="p-2 md:p-6">
                        <BookingWizard />
                    </div>
                </div>

                {/* Additional booking info */}
                <div className="mt-12 text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-6 text-white/80">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full" aria-hidden="true"></div>
                            <span className="text-sm">Instant confirmation</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full" aria-hidden="true"></div>
                            <span className="text-sm">Flexible rescheduling</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full" aria-hidden="true"></div>
                            <span className="text-sm">Professional service</span>
                        </div>
                    </div>
                </div>

                {/* Emergency contact */}
                <div className="mt-8 text-center">
                    <p className="text-white/60 text-sm">
                        Need immediate assistance? Call us at{' '}
                        <a
                            href="tel:+27699171527"
                            className="text-white hover:underline font-medium"
                            aria-label="Call us at +27 69 917 1527"
                        >
                            +27 69 917 1527
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default BookingSection;
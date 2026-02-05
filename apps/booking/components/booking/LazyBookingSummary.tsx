// Lazy-loaded booking summary component
"use client";

import { motion } from 'framer-motion';
import { memo } from 'react';

interface BookingSummaryProps {
    data: {
        selectedService: any;
        selectedDate: string | null;
        selectedTime: string | null;
        customerDetails: {
            name: string;
            email: string;
            phone: string;
        };
    };
    onUpdate: (updates: any) => void;
}

// Memoize summary item for performance
const SummaryItem = memo(({ label, value, isHighlighted = false }: {
    label: string;
    value: string;
    isHighlighted?: boolean;
}) => (
    <div className="flex justify-between">
        <span className="text-gray-600">{label}:</span>
        <span className={`font-semibold ${isHighlighted ? 'text-purple-600' : 'text-gray-900'}`}>
            {value}
        </span>
    </div>
));

SummaryItem.displayName = 'SummaryItem';

export function BookingSummary({ data }: BookingSummaryProps) {
    const { selectedService, selectedDate, selectedTime, customerDetails } = data;

    if (!selectedService) {
        return (
            <div className="text-center py-8 text-gray-500">
                Please complete the previous steps to view your booking summary.
            </div>
        );
    }

    return (
        <motion.div
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Booking Summary
            </h3>

            <div className="space-y-4">
                <SummaryItem label="Service" value={selectedService.name} />
                <SummaryItem label="Date" value={selectedDate || 'Not selected'} />
                <SummaryItem label="Time" value={selectedTime || 'Not selected'} />
                <SummaryItem label="Customer" value={customerDetails.name} />
                <SummaryItem label="Email" value={customerDetails.email} />
                <SummaryItem label="Phone" value={customerDetails.phone} />

                <hr className="my-4 border-purple-200" />

                <SummaryItem
                    label="Total"
                    value={`R${selectedService.price}`}
                    isHighlighted
                />
            </div>

            <div className="mt-6 p-4 bg-white rounded-xl border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2">What&apos;s Next?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• You&apos;ll receive a confirmation email shortly</li>
                    <li>• Please arrive 10 minutes early for your appointment</li>
                    <li>• Cancellations must be made 24 hours in advance</li>
                </ul>
            </div>
        </motion.div>
    );
}
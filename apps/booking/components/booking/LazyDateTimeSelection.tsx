// Lazy-loaded date and time selection component
"use client";

import { motion } from 'framer-motion';
import { memo } from 'react';

interface DateTimeSelectionProps {
    data: {
        selectedDate: string | null;
        selectedTime: string | null;
    };
    onUpdate: (updates: any) => void;
}

// Memoize for performance
const TimeSlotButton = memo(({ time, isSelected, onSelect }: {
    time: string;
    isSelected: boolean;
    onSelect: (time: string) => void;
}) => (
    <motion.button
        onClick={() => onSelect(time)}
        className={`p-3 rounded-xl border-2 transition-all duration-300 ${isSelected
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-purple-300'
            }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        {time}
    </motion.button>
));

TimeSlotButton.displayName = 'TimeSlotButton';

export function DateTimeSelection({ data, onUpdate }: DateTimeSelectionProps) {
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    ];

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ selectedDate: e.target.value, selectedTime: null });
    };

    const handleTimeSelect = (time: string) => {
        onUpdate({ selectedTime: time });
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Select Date
                </h3>
                <input
                    type="date"
                    onChange={handleDateChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            {data.selectedDate && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Select Time
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {timeSlots.map((time) => (
                            <TimeSlotButton
                                key={time}
                                time={time}
                                isSelected={data.selectedTime === time}
                                onSelect={handleTimeSelect}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
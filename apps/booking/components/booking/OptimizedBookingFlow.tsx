// Performance-optimized lazy-loaded booking page
"use client";

import { motion } from 'framer-motion';
import { lazy, Suspense, useState } from 'react';

import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load heavy components
const LazyServiceSelection = lazy(() =>
    import('./LazyServiceSelection').then(module => ({
        default: module.ServiceSelection
    }))
);

const LazyDateTimeSelection = lazy(() =>
    import('./LazyDateTimeSelection').then(module => ({
        default: module.DateTimeSelection
    }))
);

const LazyCustomerDetails = lazy(() =>
    import('./LazyCustomerDetails').then(module => ({
        default: module.CustomerDetails
    }))
);

const LazyBookingSummary = lazy(() =>
    import('./LazyBookingSummary').then(module => ({
        default: module.BookingSummary
    }))
);

// Optimized icons - tree shake only what's needed
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface BookingData {
    selectedService: any;
    selectedDate: string | null;
    selectedTime: string | null;
    customerDetails: {
        name: string;
        email: string;
        phone: string;
    };
}

interface OptimizedBookingFlowProps {
    onComplete: (data: BookingData) => void;
}

export default function OptimizedBookingFlow({ onComplete }: OptimizedBookingFlowProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState<BookingData>({
        selectedService: null,
        selectedDate: null,
        selectedTime: null,
        customerDetails: {
            name: '',
            email: '',
            phone: '',
        }
    });

    const steps = [
        { number: 1, title: 'Select Service', component: LazyServiceSelection },
        { number: 2, title: 'Pick Date & Time', component: LazyDateTimeSelection },
        { number: 3, title: 'Your Details', component: LazyCustomerDetails },
        { number: 4, title: 'Confirm', component: LazyBookingSummary },
    ];

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return bookingData.selectedService !== null;
            case 2:
                return bookingData.selectedDate !== null && bookingData.selectedTime !== null;
            case 3:
                return (
                    bookingData.customerDetails.name &&
                    bookingData.customerDetails.email &&
                    bookingData.customerDetails.phone
                );
            case 4:
                return true;
            default:
                return false;
        }
    };

    const updateBookingData = (updates: Partial<BookingData>) => {
        setBookingData(prev => ({ ...prev, ...updates }));
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                    <motion.div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${currentStep >= step.number
                            ? 'bg-purple-500 border-purple-500 text-white'
                            : 'border-gray-300 text-gray-400'
                            }`}
                        whileHover={{ scale: 1.05 }}
                    >
                        {currentStep > step.number ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            <span className="text-sm font-semibold">{step.number}</span>
                        )}
                    </motion.div>
                    {index < steps.length - 1 && (
                        <motion.div
                            className={`w-12 h-0.5 mx-2 transition-all duration-300 ${currentStep > step.number ? 'bg-purple-500' : 'bg-gray-300'
                                }`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: currentStep > step.number ? 1 : 0 }}
                        />
                    )}
                </div>
            ))}
        </div>
    );

    const CurrentStepComponent = steps[currentStep - 1].component;
    const currentStepTitle = steps[currentStep - 1].title;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <StepIndicator />

                    <motion.div
                        className="bg-white rounded-3xl shadow-xl p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {currentStepTitle}
                            </h2>
                        </div>

                        <div className="mb-8">
                            <Suspense
                                fallback={
                                    <div className="flex items-center justify-center py-12">
                                        <LoadingSpinner />
                                    </div>
                                }
                            >
                                <CurrentStepComponent
                                    data={bookingData}
                                    onUpdate={updateBookingData}
                                />
                            </Suspense>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                                disabled={currentStep === 1}
                                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Back
                            </button>

                            <motion.button
                                onClick={() => {
                                    if (currentStep < 4) {
                                        setCurrentStep(currentStep + 1);
                                    } else {
                                        onComplete(bookingData);
                                    }
                                }}
                                disabled={!canProceed()}
                                className="flex items-center gap-2 bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {currentStep < 4 ? 'Continue' : 'Confirm Booking'}
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
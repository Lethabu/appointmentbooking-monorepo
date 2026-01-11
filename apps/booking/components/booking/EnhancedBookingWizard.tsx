// Enhanced Booking Wizard with Advanced Features
// File: apps/booking/components/booking/EnhancedBookingWizard.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useBooking } from './BookingContext';
import { Service } from './BookingContext';
import EnhancedServiceSelection from './EnhancedServiceSelection';
import AdvancedDateTimeSelection from './AdvancedDateTimeSelection';
import EnhancedCustomerDetails from './EnhancedCustomerDetails';
import AdvancedPaymentSummary from './AdvancedPaymentSummary';
import EnhancedConfirmation from './EnhancedConfirmation';
import { Calendar, Clock, User, CreditCard, CheckCircle } from 'lucide-react';

// Enhanced progress indicator with validation states
function EnhancedProgressIndicator() {
    const { state, canProceedToNextStep } = useBooking();
    const [validationStates, setValidationStates] = useState<Record<number, 'idle' | 'valid' | 'invalid'>>({
        1: 'idle', // idle, valid, invalid
        2: 'idle',
        3: 'idle',
        4: 'idle',
        5: 'idle'
    });

    const steps = [
        {
            number: 1,
            label: 'Services',
            icon: CheckCircle,
            description: 'Select services & staff'
        },
        {
            number: 2,
            label: 'Date & Time',
            icon: Calendar,
            description: 'Choose availability'
        },
        {
            number: 3,
            label: 'Details',
            icon: User,
            description: 'Customer information'
        },
        {
            number: 4,
            label: 'Payment',
            icon: CreditCard,
            description: 'Payment & preferences'
        },
        {
            number: 5,
            label: 'Confirm',
            icon: CheckCircle,
            description: 'Review & confirm'
        },
    ];

    useEffect(() => {
        // Update validation states based on current step
        const newStates = { ...validationStates };
        for (let i = 1; i <= 5; i++) {
            if (i < state.currentStep) {
                (newStates as any)[i] = 'valid';
            } else if (i === state.currentStep) {
                (newStates as any)[i] = canProceedToNextStep() ? 'valid' : 'invalid';
            } else {
                (newStates as any)[i] = 'idle';
            }
        }
        setValidationStates(newStates);
    }, [state.currentStep, canProceedToNextStep]);

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${((state.currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = state.currentStep === step.number;
                    const isCompleted = state.currentStep > step.number;
                    const validationState = validationStates[step.number as keyof typeof validationStates];

                    return (
                        <div key={step.number} className="flex flex-col items-center z-10">
                            {/* Step Circle */}
                            <div
                                className={`
                                    w-12 h-12 rounded-full flex items-center justify-center font-semibold
                                    transition-all duration-300 border-2
                                    ${isActive
                                        ? 'bg-indigo-500 border-indigo-500 text-white scale-110 shadow-lg'
                                        : isCompleted
                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : 'bg-white border-gray-300 text-gray-400'
                                    }
                                    ${validationState === 'valid' && 'ring-2 ring-emerald-300'}
                                    ${validationState === 'invalid' && isActive && 'ring-2 ring-red-300'}
                                `}
                            >
                                {isCompleted ? (
                                    <Icon className="w-6 h-6" />
                                ) : (
                                    step.number
                                )}
                            </div>

                            {/* Step Labels */}
                            <div className="text-center mt-3">
                                <span className={`text-sm font-medium block ${isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-gray-500'
                                    }`}>
                                    {step.label}
                                </span>
                                <span className="text-xs text-gray-400 block mt-1">
                                    {step.description}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Enhanced navigation with smart validation
function EnhancedNavigation() {
    const { state, nextStep, previousStep, canProceedToNextStep } = useBooking();
    // const { toast } = useToast(); // TODO: Add toast implementation
    const [toast] = useState({
        title: (title: string) => ({ description: title }),
        variant: 'default'
    });

    const handleNext = () => {
        if (!canProceedToNextStep()) {
            console.log("Validation Error: Please complete all required fields before proceeding.");
            return;
        }
        nextStep();
    };

    return (
        <div className="flex justify-between items-center mt-8 p-4 bg-gray-50 rounded-lg">
            <button
                onClick={previousStep}
                disabled={state.currentStep === 1}
                className={`
                    px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2
                    ${state.currentStep === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm'
                    }
                `}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
            </button>

            <div className="flex items-center gap-4">
                {/* Step Counter */}
                <span className="text-sm text-gray-500">
                    Step {state.currentStep} of 5
                </span>

                {/* Progress Bar */}
                <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(state.currentStep / 5) * 100}%` }}
                    />
                </div>
            </div>

            {state.currentStep < 5 && (
                <button
                    onClick={handleNext}
                    disabled={!canProceedToNextStep()}
                    className={`
                        px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2
                        ${canProceedToNextStep()
                            ? 'bg-gradient-to-r from-indigo-500 to-emerald-500 text-white hover:shadow-lg transform hover:scale-105'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
}

// Smart step content with error handling
function StepContent() {
    const { state } = useBooking();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setError(null); // Clear errors when step changes
    }, [state.currentStep]);

    try {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 min-h-[600px]">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-800">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Error</span>
                        </div>
                        <p className="text-red-700 mt-1">{error}</p>
                    </div>
                )}

                {state.currentStep === 1 && <EnhancedServiceSelection />}
                {state.currentStep === 2 && <AdvancedDateTimeSelection />}
                {state.currentStep === 3 && <EnhancedCustomerDetails />}
                {state.currentStep === 4 && <AdvancedPaymentSummary />}
                {state.currentStep === 5 && <EnhancedConfirmation />}
            </div>
        );
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
                    <p className="text-gray-600 mb-4">{error || 'Please try again'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }
}

// Main enhanced wizard component
export default function EnhancedBookingWizard() {
    const { state } = useBooking();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate initial loading
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading booking system...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Book Your Appointment
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Experience our enhanced booking system with real-time availability,
                        multi-timezone support, and smart conflict resolution.
                    </p>
                </div>

                {/* Progress Indicator */}
                <EnhancedProgressIndicator />

                {/* Step Content */}
                <StepContent />

                {/* Navigation */}
                <EnhancedNavigation />

                {/* Footer Info */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>🔒 Your information is secure and encrypted • ⚡ Real-time availability • 🌍 Multi-timezone support</p>
                </div>
            </div>
        </div>
    );
}
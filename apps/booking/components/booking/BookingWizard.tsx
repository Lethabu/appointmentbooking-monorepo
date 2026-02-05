// Booking Wizard Main Component
// File: apps/booking/components/booking/BookingWizard.tsx

'use client';

import React from 'react';

import { BookingProvider, useBooking } from './BookingContext';
import Step1ServiceSelection from './Step1ServiceSelection';
import Step2DateTime from './Step2DateTime';
import Step3CustomerDetails from './Step3CustomerDetails';
import Step4PaymentSummary from './Step4PaymentSummary';
import Step5Confirmation from './Step5Confirmation';

// Progress Indicator Component
function ProgressIndicator() {
    const { state } = useBooking();
    const steps = [
        { number: 1, label: 'Services' },
        { number: 2, label: 'Date & Time' },
        { number: 3, label: 'Details' },
        { number: 4, label: 'Payment' },
        { number: 5, label: 'Confirm' },
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        {/* Step Circle */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  transition-all duration-300
                  ${state.currentStep === step.number
                                        ? 'bg-crimson text-white scale-110'
                                        : state.currentStep > step.number
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }
                `}
                            >
                                {state.currentStep > step.number ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    step.number
                                )}
                            </div>
                            <span className="text-xs mt-2 text-gray-600">{step.label}</span>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div
                                className={`
                  flex-1 h-1 mx-2 transition-all duration-300
                  ${state.currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'}
                `}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

// Navigation Buttons Component
function NavigationButtons() {
    const { state, nextStep, previousStep, canProceedToNextStep } = useBooking();

    return (
        <div className="flex justify-between mt-8">
            <button
                onClick={previousStep}
                disabled={state.currentStep === 1}
                className={`
          px-6 py-3 rounded-lg font-semibold transition-all
          ${state.currentStep === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
        `}
            >
                ← Back
            </button>

            {state.currentStep < 5 && (
                <button
                    onClick={nextStep}
                    disabled={!canProceedToNextStep()}
                    className={`
            px-6 py-3 rounded-lg font-semibold transition-all
            ${canProceedToNextStep()
                            ? 'bg-crimson text-white hover:bg-crimson-dark'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
          `}
                >
                    Next →
                </button>
            )}
        </div>
    );
}

// Main Wizard Content
function WizardContent() {
    const { state } = useBooking();

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Progress Indicator */}
            <ProgressIndicator />

            {/* Step Content */}
            <div className="bg-white rounded-lg shadow-lg p-8 min-h-[500px]">
                {state.currentStep === 1 && <Step1ServiceSelection />}
                {state.currentStep === 2 && <Step2DateTime />}
                {state.currentStep === 3 && <Step3CustomerDetails />}
                {state.currentStep === 4 && <Step4PaymentSummary />}
                {state.currentStep === 5 && <Step5Confirmation />}
            </div>

            {/* Navigation Buttons */}
            {state.currentStep < 5 && <NavigationButtons />}
        </div>
    );
}

// Main Export with Provider
export default function BookingWizard() {
    return (
        <BookingProvider>
            <div className="min-h-screen bg-gray-50 py-12">
                <WizardContent />
            </div>
        </BookingProvider>
    );
}

// Booking Wizard Context - State Management
// File: apps/booking/components/booking/BookingContext.tsx

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Service {
    id: string;
    name: string;
    description: string;
    shortDescription?: string;
    price: number; // in cents
    priceType?: 'fixed' | 'hourly' | 'package' | 'tiered';
    durationMinutes: number;
    setupTimeMinutes?: number;
    cleanupTimeMinutes?: number;
    category?: string;
    subcategory?: string;
    serviceType?: 'appointment' | 'package' | 'membership';
    isPackage?: boolean;
    packageIncludes?: string[];
    pricingTiers?: Array<{
        name: string;
        price: number;
        minQuantity?: number;
        maxQuantity?: number;
        description?: string;
    }>;
    requiresDeposit?: boolean;
    depositPercentage?: number;
    maxClientsPerSession?: number;
    popularityScore?: number;
    imageUrls?: string[];
    isActive?: boolean;
    isFeatured?: boolean;
    tags?: string[];
    availableStaff?: Array<{
        id: string;
        name: string;
        role: string;
        rating: number;
        specialties: string[];
        profileImageUrl?: string;
    }>;
}

export interface CustomerDetails {
    name: string;
    email: string;
    phone: string;
    notes?: string;
}

export interface BookingState {
    // Step 1: Service Selection
    selectedServices: Service[];

    // Step 2: Date/Time
    selectedDate: string | null; // YYYY-MM-DD
    selectedTime: string | null; // HH:MM

    // Step 3: Customer Details
    customerDetails: CustomerDetails | null;

    // Step 4: Payment (calculated)
    totalPrice: number;
    bookingFee: number;
    remainingBalance: number;

    // Step 5: Confirmation
    bookingId: string | null;
    confirmed: boolean;

    // Wizard state
    currentStep: number;
}

interface BookingContextType {
    state: BookingState;

    // Actions
    setSelectedServices: (services: Service[]) => void;
    addService: (service: Service) => void;
    removeService: (serviceId: string) => void;
    setDateTime: (date: string, time: string) => void;
    setCustomerDetails: (details: CustomerDetails) => void;
    setBookingConfirmation: (bookingId: string) => void;

    // Navigation
    nextStep: () => void;
    previousStep: () => void;
    goToStep: (step: number) => void;
    resetWizard: () => void;

    // Validation
    canProceedToNextStep: () => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialState: BookingState = {
    selectedServices: [],
    selectedDate: null,
    selectedTime: null,
    customerDetails: null,
    totalPrice: 0,
    bookingFee: 0,
    remainingBalance: 0,
    bookingId: null,
    confirmed: false,
    currentStep: 1,
};

export function BookingProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<BookingState>(initialState);

    // Calculate totals whenever services change
    const calculateTotals = (services: Service[]) => {
        const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
        const bookingFee = Math.max(totalPrice * 0.2, 5000); // 20% or R50 minimum
        const remainingBalance = totalPrice - bookingFee;

        return { totalPrice, bookingFee, remainingBalance };
    };

    // Actions
    const setSelectedServices = (services: Service[]) => {
        const totals = calculateTotals(services);
        setState(prev => ({
            ...prev,
            selectedServices: services,
            ...totals,
        }));
    };

    const addService = (service: Service) => {
        const newServices = [...state.selectedServices, service];
        setSelectedServices(newServices);
    };

    const removeService = (serviceId: string) => {
        const newServices = state.selectedServices.filter(s => s.id !== serviceId);
        setSelectedServices(newServices);
    };

    const setDateTime = (date: string, time: string) => {
        setState(prev => ({
            ...prev,
            selectedDate: date,
            selectedTime: time,
        }));
    };

    const setCustomerDetails = (details: CustomerDetails) => {
        setState(prev => ({
            ...prev,
            customerDetails: details,
        }));
    };

    const setBookingConfirmation = (bookingId: string) => {
        setState(prev => ({
            ...prev,
            bookingId,
            confirmed: true,
        }));
    };

    // Navigation
    const nextStep = () => {
        if (canProceedToNextStep()) {
            setState(prev => ({
                ...prev,
                currentStep: Math.min(prev.currentStep + 1, 5),
            }));
        }
    };

    const previousStep = () => {
        setState(prev => ({
            ...prev,
            currentStep: Math.max(prev.currentStep - 1, 1),
        }));
    };

    const goToStep = (step: number) => {
        if (step >= 1 && step <= 5) {
            setState(prev => ({ ...prev, currentStep: step }));
        }
    };

    const resetWizard = () => {
        setState(initialState);
    };

    // Validation
    const canProceedToNextStep = (): boolean => {
        switch (state.currentStep) {
            case 1: // Service selection
                return state.selectedServices.length > 0;

            case 2: // Date/time selection
                return !!state.selectedDate && !!state.selectedTime;

            case 3: // Customer details
                return !!(
                    state.customerDetails?.name &&
                    state.customerDetails?.email &&
                    state.customerDetails?.phone
                );

            case 4: // Payment summary (always can proceed)
                return true;

            case 5: // Confirmation (final step)
                return false;

            default:
                return false;
        }
    };

    const value: BookingContextType = {
        state,
        setSelectedServices,
        addService,
        removeService,
        setDateTime,
        setCustomerDetails,
        setBookingConfirmation,
        nextStep,
        previousStep,
        goToStep,
        resetWizard,
        canProceedToNextStep,
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
}

// Custom hook
export function useBooking() {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}

// Helper functions
export function formatPrice(priceInCents: number): string {
    return `R${(priceInCents / 100).toFixed(2)}`;
}

export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
}

export function getTotalDuration(services: Service[]): number {
    return services.reduce((sum, service) => sum + service.durationMinutes, 0);
}

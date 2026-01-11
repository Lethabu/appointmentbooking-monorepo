'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Check, Star, Shield, Users, Clock, Calendar, MapPin, Phone, Mail, AlertCircle, Loader2, Heart } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Enhanced Service Interface
interface Service {
    id: string;
    name: string;
    description: string;
    price_cents: number;
    durationMinutes: number;
    category?: string;
    imageUrl?: string;
    popular?: boolean;
}

// Booking State Interface
interface BookingState {
    step: number;
    selectedService: Service | null;
    selectedDate: string;
    selectedTime: string;
    customerDetails: {
        name: string;
        email: string;
        phone: string;
        notes?: string;
    };
    paymentMethod: string;
}

// Social Proof Data Interface
interface SocialProof {
    totalBookings: number;
    averageRating: number;
    recentBookings: Array<{
        id: string;
        serviceName: string;
        customerName: string;
        date: string;
        rating: number;
    }>;
    testimonials: Array<{
        id: string;
        customerName: string;
        rating: number;
        comment: string;
        serviceName: string;
        imageUrl?: string;
    }>;
}

interface UnifiedBookingFlowProps {
    services: Service[];
    salonId: string;
    salonName: string;
    tenantId: string;
    showSocialProof?: boolean;
    showTrustSignals?: boolean;
}

const BUSINESS_HOURS = {
    monday: { start: '09:00', end: '17:00' },
    tuesday: { start: '09:00', end: '17:00' },
    wednesday: { start: '09:00', end: '17:00' },
    thursday: { start: '09:00', end: '17:00' },
    friday: { start: '09:00', end: '17:00' },
    saturday: { start: '08:00', end: '16:00' },
    sunday: { start: null, end: null }, // Closed
};

export default function UnifiedBookingFlow({
    services,
    salonId,
    salonName,
    tenantId,
    showSocialProof = true,
    showTrustSignals = true,
}: UnifiedBookingFlowProps) {
    const supabase = createClientComponentClient();
    const [bookingState, setBookingState] = useState<BookingState>({
        step: 1,
        selectedService: null,
        selectedDate: '',
        selectedTime: '',
        customerDetails: {
            name: '',
            email: '',
            phone: '',
            notes: '',
        },
        paymentMethod: 'card',
    });

    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [socialProof, setSocialProof] = useState<SocialProof | null>(null);

    // Fetch social proof data
    useEffect(() => {
        if (showSocialProof) {
            fetchSocialProof();
        }
    }, [tenantId, showSocialProof]);

    const fetchSocialProof = async () => {
        try {
            // Simulate social proof data - in real implementation, fetch from database
            const mockSocialProof: SocialProof = {
                totalBookings: 1247,
                averageRating: 4.8,
                recentBookings: [
                    { id: '1', serviceName: 'Premium Cut & Style', customerName: 'Sarah M.', date: '2 hours ago', rating: 5 },
                    { id: '2', serviceName: 'Color & Highlights', customerName: 'Emma L.', date: '5 hours ago', rating: 5 },
                    { id: '3', serviceName: 'Keratin Treatment', customerName: 'Jessica K.', date: '1 day ago', rating: 5 },
                ],
                testimonials: [
                    {
                        id: '1',
                        customerName: 'Sarah Johnson',
                        rating: 5,
                        comment: 'Absolutely amazing experience! The staff was professional and the results exceeded my expectations.',
                        serviceName: 'Premium Cut & Style',
                    },
                    {
                        id: '2',
                        customerName: 'Emma Williams',
                        rating: 5,
                        comment: 'Best salon in the area! Love my new color and the service was exceptional.',
                        serviceName: 'Color & Highlights',
                    },
                    {
                        id: '3',
                        customerName: 'Jessica Brown',
                        rating: 5,
                        comment: 'The keratin treatment transformed my hair. Highly recommend!',
                        serviceName: 'Keratin Treatment',
                    },
                ],
            };
            setSocialProof(mockSocialProof);
        } catch (error) {
            console.error('Error fetching social proof:', error);
        }
    };

    // Generate available time slots
    const generateTimeSlots = useCallback((date: string): string[] => {
        const selectedDate = new Date(date);
        const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][selectedDate.getDay()] as keyof typeof BUSINESS_HOURS;
        const hours = BUSINESS_HOURS[dayOfWeek];

        if (!hours.start || !hours.end) {
            return [];
        }

        const slots: string[] = [];
        const [startHour, startMin] = hours.start.split(':').map(Number);
        const [endHour, endMin] = hours.end.split(':').map(Number);

        let currentHour = startHour;
        let currentMin = startMin;

        while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
            const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
            slots.push(timeString);

            currentMin += 30;
            if (currentMin >= 60) {
                currentMin = 0;
                currentHour += 1;
            }
        }

        return slots;
    }, []);

    // Validate form fields
    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return bookingState.selectedService !== null;
            case 2:
                return bookingState.selectedDate !== '' && bookingState.selectedTime !== '';
            case 3:
                return (
                    bookingState.customerDetails.name.trim() !== '' &&
                    bookingState.customerDetails.email.trim() !== '' &&
                    bookingState.customerDetails.phone.trim() !== '' &&
                    isValidEmail(bookingState.customerDetails.email)
                );
            case 4:
                return true;
            default:
                return false;
        }
    };

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleServiceSelect = (service: Service) => {
        setBookingState(prev => ({ ...prev, selectedService: service, step: 2 }));
    };

    const handleDateChange = (date: string) => {
        setBookingState(prev => ({ ...prev, selectedDate: date, selectedTime: '' }));
        setAvailableSlots(generateTimeSlots(date));
    };

    const handleTimeSelect = (time: string) => {
        setBookingState(prev => ({ ...prev, selectedTime: time }));
    };

    const handleCustomerDetailsChange = (field: string, value: string) => {
        setBookingState(prev => ({
            ...prev,
            customerDetails: { ...prev.customerDetails, [field]: value },
        }));
    };

    const handleNext = () => {
        if (validateStep(bookingState.step)) {
            setBookingState(prev => ({ ...prev, step: prev.step + 1 }));
        }
    };

    const handleBack = () => {
        setBookingState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) return;

        setSubmitting(true);
        setError(null);

        try {
            const bookingData = {
                serviceId: bookingState.selectedService?.id,
                salonId,
                scheduledDate: bookingState.selectedDate,
                scheduledTime: bookingState.selectedTime,
                customerDetails: bookingState.customerDetails,
                paymentMethod: bookingState.paymentMethod,
            };

            // Simulate API call - replace with actual implementation
            await new Promise(resolve => setTimeout(resolve, 2000));

            setBookingState(prev => ({ ...prev, step: 5 }));
        } catch (error) {
            setError('Failed to submit booking. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Step indicator component with accessibility
    const StepIndicator = () => {
        const steps = [
            { number: 1, title: 'Select Service', completed: bookingState.step > 1 },
            { number: 2, title: 'Date & Time', completed: bookingState.step > 2 },
            { number: 3, title: 'Your Details', completed: bookingState.step > 3 },
            { number: 4, title: 'Confirm', completed: bookingState.step > 4 },
        ];

        return (
            <nav aria-label="Booking progress" className="mb-8">
                <ol className="flex items-center justify-center">
                    {steps.map((step, index) => (
                        <li key={step.number} className="flex items-center">
                            <div
                                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${step.completed
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : bookingState.step === step.number
                                        ? 'bg-blue-500 border-blue-500 text-white'
                                        : 'border-gray-300 text-gray-400'
                                    }`}
                                aria-current={bookingState.step === step.number ? 'step' : undefined}
                            >
                                {step.completed ? (
                                    <Check className="w-6 h-6" aria-hidden="true" />
                                ) : (
                                    <span className="text-sm font-semibold" aria-label={`Step ${step.number}: ${step.title}`}>
                                        {step.number}
                                    </span>
                                )}
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`w-16 h-0.5 mx-4 transition-all duration-300 ${step.completed ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                    aria-hidden="true"
                                />
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        );
    };

    // Social Proof Component
    const SocialProofSection = () => {
        if (!socialProof) return null;

        return (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Users className="w-6 h-6 text-blue-600 mr-2" />
                            <span className="text-2xl font-bold text-gray-900">{socialProof.totalBookings.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-600">Happy Clients</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Star className="w-6 h-6 text-yellow-500 mr-2" />
                            <span className="text-2xl font-bold text-gray-900">{socialProof.averageRating}</span>
                        </div>
                        <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Heart className="w-6 h-6 text-red-500 mr-2" />
                            <span className="text-sm font-semibold text-green-600">98% Recommend</span>
                        </div>
                        <p className="text-sm text-gray-600">Client Satisfaction</p>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Bookings</h4>
                    <div className="space-y-2">
                        {socialProof.recentBookings.slice(0, 3).map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                    <span className="text-gray-700">{booking.customerName} booked {booking.serviceName}</span>
                                </div>
                                <span className="text-gray-500">{booking.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Trust Signals Component
    const TrustSignals = () => {
        if (!showTrustSignals) return null;

        return (
            <div className="flex items-center justify-center space-x-6 mb-8">
                <div className="flex items-center text-green-600">
                    <Shield className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <div className="flex items-center text-blue-600">
                    <Check className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">100% Satisfaction</span>
                </div>
                <div className="flex items-center text-purple-600">
                    <Users className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Licensed Professionals</span>
                </div>
            </div>
        );
    };

    // Service Selection Step
    const ServiceSelectionStep = () => (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Service</h2>
            <p className="text-gray-600 mb-6">Select from our premium salon services</p>

            <div className="grid gap-4">
                {services.map((service) => (
                    <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-lg min-h-[120px] ${bookingState.selectedService?.id === service.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                            }`}
                        aria-describedby={`service-${service.id}-description`}
                    >
                        {service.popular && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                Most Popular
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{service.name}</h3>
                                <p id={`service-${service.id}-description`} className="text-sm text-gray-600 mb-2">
                                    {service.description}
                                </p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {Math.floor(service.durationMinutes / 60)}h {service.durationMinutes % 60}m
                                </div>
                            </div>
                            <div className="text-right ml-4">
                                <div className="text-2xl font-bold text-blue-600">
                                    R{(service.price_cents / 100).toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {bookingState.selectedService?.id === service.id && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" aria-hidden="true" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );

    // Date & Time Selection Step
    const DateTimeSelectionStep = () => {
        const today = new Date().toISOString().split('T')[0];
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        const maxDateString = maxDate.toISOString().split('T')[0];

        return (
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
                <p className="text-gray-600 mb-6">Choose your preferred appointment slot</p>

                {/* Selected Service Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 font-semibold mb-1">Selected Service:</p>
                    <p className="text-blue-700">{bookingState.selectedService?.name}</p>
                </div>

                {/* Date Selection */}
                <div className="mb-6">
                    <label htmlFor="appointment-date" className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Date
                    </label>
                    <input
                        id="appointment-date"
                        type="date"
                        value={bookingState.selectedDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        min={today}
                        max={maxDateString}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                        aria-describedby="date-help"
                    />
                    <p id="date-help" className="text-sm text-gray-600 mt-2">
                        Choose from available dates (Closed on Sundays)
                    </p>
                </div>

                {/* Time Selection */}
                {bookingState.selectedDate && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Available Times
                        </label>
                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                <span className="ml-2">Loading available times...</span>
                            </div>
                        ) : availableSlots.length === 0 ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-700">No available time slots for this date. Please select another date.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {availableSlots.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => handleTimeSelect(time)}
                                        className={`p-4 rounded-xl border-2 font-medium transition-all duration-300 min-h-[44px] ${bookingState.selectedTime === time
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                        aria-pressed={bookingState.selectedTime === time}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Selection Summary */}
                {bookingState.selectedDate && bookingState.selectedTime && (
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center text-green-800">
                            <Check className="w-5 h-5 mr-2" />
                            <span className="font-semibold">Appointment Selected</span>
                        </div>
                        <p className="text-green-700 mt-1">
                            {new Date(bookingState.selectedDate).toLocaleDateString('en-ZA', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })} at {bookingState.selectedTime}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    // Customer Details Step
    const CustomerDetailsStep = () => (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Details</h2>
            <p className="text-gray-600 mb-6">Please provide your contact information</p>

            <div className="space-y-6">
                <div>
                    <label htmlFor="customer-name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <input
                        id="customer-name"
                        type="text"
                        value={bookingState.customerDetails.name}
                        onChange={(e) => handleCustomerDetailsChange('name', e.target.value)}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 text-lg ${bookingState.customerDetails.name && !bookingState.customerDetails.name.trim()
                            ? 'border-red-500'
                            : 'border-gray-300'
                            }`}
                        placeholder="Enter your full name"
                        required
                        aria-describedby="name-error"
                    />
                    {bookingState.customerDetails.name && !bookingState.customerDetails.name.trim() && (
                        <p id="name-error" className="text-red-500 text-sm mt-1">Name is required</p>
                    )}
                </div>

                <div>
                    <label htmlFor="customer-email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                    </label>
                    <input
                        id="customer-email"
                        type="email"
                        value={bookingState.customerDetails.email}
                        onChange={(e) => handleCustomerDetailsChange('email', e.target.value)}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 text-lg ${bookingState.customerDetails.email && !isValidEmail(bookingState.customerDetails.email)
                            ? 'border-red-500'
                            : 'border-gray-300'
                            }`}
                        placeholder="your@email.com"
                        required
                        aria-describedby="email-error"
                    />
                    {bookingState.customerDetails.email && !isValidEmail(bookingState.customerDetails.email) && (
                        <p id="email-error" className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
                    )}
                </div>

                <div>
                    <label htmlFor="customer-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                    </label>
                    <input
                        id="customer-phone"
                        type="tel"
                        value={bookingState.customerDetails.phone}
                        onChange={(e) => handleCustomerDetailsChange('phone', e.target.value)}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 text-lg ${bookingState.customerDetails.phone && !bookingState.customerDetails.phone.trim()
                            ? 'border-red-500'
                            : 'border-gray-300'
                            }`}
                        placeholder="+27 12 345 6789"
                        required
                        aria-describedby="phone-error"
                    />
                    {bookingState.customerDetails.phone && !bookingState.customerDetails.phone.trim() && (
                        <p id="phone-error" className="text-red-500 text-sm mt-1">Phone number is required</p>
                    )}
                </div>

                <div>
                    <label htmlFor="customer-notes" className="block text-sm font-semibold text-gray-700 mb-2">
                        Special Requests (Optional)
                    </label>
                    <textarea
                        id="customer-notes"
                        value={bookingState.customerDetails.notes}
                        onChange={(e) => handleCustomerDetailsChange('notes', e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg"
                        rows={3}
                        placeholder="Any special requests or notes for your appointment"
                    />
                </div>
            </div>
        </div>
    );

    // Confirmation Step
    const ConfirmationStep = () => (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Booking</h2>
            <p className="text-gray-600 mb-6">Please review your appointment details</p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h3>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-semibold">{bookingState.selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold">
                            {new Date(bookingState.selectedDate).toLocaleDateString('en-ZA')}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-semibold">{bookingState.selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold">
                            {Math.floor((bookingState.selectedService?.durationMinutes || 0) / 60)}h {(bookingState.selectedService?.durationMinutes || 0) % 60}m
                        </span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total:</span>
                        <span className="text-blue-600">
                            R{((bookingState.selectedService?.price_cents || 0) / 100).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Customer Details Summary */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-2">
                    <div className="flex items-center">
                        <Mail className="w-4 h-4 text-blue-600 mr-2" />
                        <span>{bookingState.customerDetails.name}</span>
                    </div>
                    <div className="flex items-center">
                        <Mail className="w-4 h-4 text-blue-600 mr-2" />
                        <span>{bookingState.customerDetails.email}</span>
                    </div>
                    <div className="flex items-center">
                        <Phone className="w-4 h-4 text-blue-600 mr-2" />
                        <span>{bookingState.customerDetails.phone}</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center text-red-800">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Error</span>
                    </div>
                    <p className="text-red-700 mt-1">{error}</p>
                </div>
            )}
        </div>
    );

    // Success Step
    const SuccessStep = () => (
        <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
                Thank you for booking with {salonName}. We have sent a confirmation email to {bookingState.customerDetails.email}.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">What&apos;s Next?</h3>
                <ul className="text-green-700 text-left space-y-2">
                    <li>• You will receive a confirmation email shortly</li>
                    <li>• We will send you a reminder 24 hours before your appointment</li>
                    <li>• You can reschedule up to 2 hours before your appointment</li>
                </ul>
            </div>

            <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
                Book Another Appointment
            </button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
                <p className="text-gray-600">Professional salon services at {salonName}</p>
            </div>

            {/* Social Proof */}
            {showSocialProof && <SocialProofSection />}

            {/* Trust Signals */}
            <TrustSignals />

            {/* Step Indicator */}
            <StepIndicator />

            {/* Main Content */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
                {bookingState.step === 1 && <ServiceSelectionStep />}
                {bookingState.step === 2 && <DateTimeSelectionStep />}
                {bookingState.step === 3 && <CustomerDetailsStep />}
                {bookingState.step === 4 && <ConfirmationStep />}
                {bookingState.step === 5 && <SuccessStep />}
            </div>

            {/* Navigation */}
            {bookingState.step < 5 && (
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={bookingState.step === 1}
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Go to previous step"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                    </button>

                    <button
                        onClick={bookingState.step === 4 ? handleSubmit : handleNext}
                        disabled={!validateStep(bookingState.step) || submitting}
                        className="flex items-center gap-2 bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={bookingState.step === 4 ? 'Confirm booking' : 'Continue to next step'}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {bookingState.step === 4 ? 'Confirming...' : 'Processing...'}
                            </>
                        ) : (
                            <>
                                {bookingState.step === 4 ? 'Confirm Booking' : 'Continue'}
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
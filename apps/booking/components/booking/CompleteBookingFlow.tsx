'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Clock, User, Check, ChevronRight, ChevronLeft, MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration_minutes: number;
}

interface TimeSlot {
    time: string;
    available: boolean;
}

interface TenantConfig {
    contact?: {
        phone?: string;
        whatsapp?: string;
        email?: string;
        address?: string;
        google_maps_url?: string;
        google_maps_embed?: string;
    };
    socials?: {
        facebook?: string;
        instagram?: string;
        tiktok?: string;
        whatsapp?: string;
    };
    branding?: {
        primary_color?: string;
        secondary_color?: string;
    };
    payment?: {
        booking_fee_percentage?: number;
        booking_fee_minimum?: number;
    };
}

export default function CompleteBookingFlow({ embedded = false }: { embedded?: boolean }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [tenantConfig, setTenantConfig] = useState<TenantConfig>({});
    const [loading, setLoading] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState('');

    // Fetch services on mount
    useEffect(() => {
        fetchServices();
        fetchTenantConfig();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch('/api/public/services');
            const data = await response.json();
            setServices(data.services || []);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchTenantConfig = async () => {
        try {
            const response = await fetch('/api/tenant?slug=instylehairboutique');
            const data = await response.json();
            if (data.config) {
                setTenantConfig(typeof data.config === 'string' ? JSON.parse(data.config) : data.config);
            }
        } catch (error) {
            console.error('Error fetching tenant config:', error);
        }
    };

    // Fetch available time slots when date is selected
    useEffect(() => {
        if (selectedDate && selectedService) {
            fetchTimeSlots(selectedDate, selectedService.id);
        }
    }, [selectedDate, selectedService]);

    const fetchTimeSlots = async (date: string, serviceId: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/availability?date=${date}&serviceId=${serviceId}`);
            const data = await response.json();
            setTimeSlots(data.slots || generateDefaultSlots());
        } catch (error) {
            console.error('Error fetching time slots:', error);
            setTimeSlots(generateDefaultSlots());
        } finally {
            setLoading(false);
        }
    };

    const generateDefaultSlots = (): TimeSlot[] => {
        const slots = [];
        for (let hour = 9; hour <= 16; hour++) {
            slots.push({ time: `${hour.toString().padStart(2, '0')}:00`, available: true });
            if (hour < 16) {
                slots.push({ time: `${hour.toString().padStart(2, '0')}:30`, available: true });
            }
        }
        return slots;
    };

    const calculateBookingFee = () => {
        if (!selectedService) return 0;
        const percentage = tenantConfig.payment?.booking_fee_percentage || 20;
        const minimum = tenantConfig.payment?.booking_fee_minimum || 5000;
        const fee = Math.max((selectedService.price * percentage) / 100, minimum);
        return Math.round(fee);
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const bookingFee = calculateBookingFee();
            const response = await fetch('/api/payments/paystack/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: bookingFee,
                    email: customerDetails.email,
                    metadata: {
                        service_id: selectedService?.id,
                        service_name: selectedService?.name,
                        scheduled_date: selectedDate,
                        scheduled_time: selectedTime,
                        customer_name: customerDetails.name,
                        customer_phone: customerDetails.phone,
                    },
                }),
            });

            const data = await response.json();
            if (data.authorization_url) {
                setPaymentUrl(data.authorization_url);
                setCurrentStep(5);
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            alert('Failed to create payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const sendWhatsAppConfirmation = () => {
        const whatsappNumber = tenantConfig.contact?.whatsapp?.replace(/\D/g, '') || '27699171527';
        const message = encodeURIComponent(
            `Hi! I've booked:\n` +
            `Service: ${selectedService?.name}\n` +
            `Date: ${selectedDate}\n` +
            `Time: ${selectedTime}\n` +
            `Name: ${customerDetails.name}\n` +
            `Phone: ${customerDetails.phone}`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1: return selectedService !== null;
            case 2: return selectedDate !== '' && selectedTime !== '';
            case 3: return customerDetails.name && customerDetails.email && customerDetails.phone;
            case 4: return true;
            default: return false;
        }
    };

    const steps = [
        { number: 1, title: 'Select Service' },
        { number: 2, title: 'Choose Date & Time' },
        { number: 3, title: 'Your Details' },
        { number: 4, title: 'Payment' },
    ];

    const primaryColor = tenantConfig.branding?.primary_color || '#8B4513';

    return (
        <div className={embedded ? "w-full" : "min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"}>
            {/* Header with Contact Info - Only show if not embedded */}
            {!embedded && (
                <div className="bg-white shadow-sm border-b">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Image
                                    src="/logos/instyle-logo.png"
                                    alt="InStyle Hair Boutique Logo"
                                    width={120}
                                    height={120}
                                    priority
                                    className="w-20 h-20 md:w-28 md:h-28 object-contain"
                                />
                                <div>
                                    <h1 className="text-xl md:text-2xl font-bold" style={{ color: primaryColor }}>InStyle Hair Boutique</h1>
                                    <p className="text-xs md:text-sm text-gray-600">{tenantConfig.contact?.address}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 items-center">
                                {tenantConfig.contact?.phone && (
                                    <a href={`tel:${tenantConfig.contact.phone}`} className="flex items-center gap-2 text-sm hover:text-purple-600">
                                        <Phone className="w-4 h-4" />
                                        {tenantConfig.contact.phone}
                                    </a>
                                )}
                                {tenantConfig.contact?.email && (
                                    <a href={`mailto:${tenantConfig.contact.email}`} className="flex items-center gap-2 text-sm hover:text-purple-600">
                                        <Mail className="w-4 h-4" />
                                        {tenantConfig.contact.email}
                                    </a>
                                )}
                                <div className="flex gap-3">
                                    {tenantConfig.socials?.whatsapp && (
                                        <a href={tenantConfig.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">
                                            <FaWhatsapp className="w-5 h-5" />
                                        </a>
                                    )}
                                    {tenantConfig.socials?.instagram && (
                                        <a href={tenantConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                                            <Instagram className="w-5 h-5" />
                                        </a>
                                    )}
                                    {tenantConfig.socials?.facebook && (
                                        <a href={tenantConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                            <Facebook className="w-5 h-5" />
                                        </a>
                                    )}
                                    {tenantConfig.socials?.tiktok && (
                                        <a href={tenantConfig.socials.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-700">
                                            <FaTiktok className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={embedded ? "w-full" : "container mx-auto px-4 py-8"}>
                <div className="max-w-4xl mx-auto">
                    {/* Step Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${currentStep >= step.number
                                        ? 'border-purple-500 text-white'
                                        : 'border-gray-300 text-gray-400'
                                        }`}
                                    style={currentStep >= step.number ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                                >
                                    {currentStep > step.number ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <span className="text-sm font-semibold">{step.number}</span>
                                    )}
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`w-12 h-0.5 mx-2 transition-all duration-300 ${currentStep > step.number ? 'bg-purple-500' : 'bg-gray-300'
                                            }`}
                                        style={currentStep > step.number ? { backgroundColor: primaryColor } : {}}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {steps[currentStep - 1]?.title}
                            </h2>
                        </div>

                        <div className="mb-8">
                            {/* Step 1: Select Service */}
                            {currentStep === 1 && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {services.map((service) => (
                                        <div
                                            key={service.id}
                                            onClick={() => setSelectedService(service)}
                                            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedService?.id === service.id
                                                ? 'bg-purple-50'
                                                : 'border-gray-200 hover:border-purple-300'
                                                }`}
                                            style={selectedService?.id === service.id ? { borderColor: primaryColor } : {}}
                                        >
                                            <div className="mb-4">
                                                <h3 className="font-semibold text-lg text-gray-900">{service.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                                                        R{(service.price / 100).toFixed(2)}
                                                    </span>
                                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {service.duration_minutes}min
                                                    </span>
                                                </div>
                                                {selectedService?.id === service.id && (
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                                                        <Check className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Step 2: Select Date & Time */}
                            {currentStep === 2 && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                    {selectedDate && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
                                            {loading ? (
                                                <div className="text-center py-8">Loading available slots...</div>
                                            ) : (
                                                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                                    {timeSlots.map((slot) => (
                                                        <button
                                                            key={slot.time}
                                                            onClick={() => slot.available && setSelectedTime(slot.time)}
                                                            disabled={!slot.available}
                                                            className={`p-3 rounded-xl border-2 transition-all duration-300 ${selectedTime === slot.time
                                                                ? 'bg-purple-50 text-purple-700'
                                                                : slot.available
                                                                    ? 'border-gray-200 hover:border-purple-300'
                                                                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                                }`}
                                                            style={selectedTime === slot.time ? { borderColor: primaryColor, color: primaryColor } : {}}
                                                        >
                                                            {slot.time}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Customer Details */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={customerDetails.name}
                                            onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={customerDetails.email}
                                            onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number (WhatsApp) *
                                        </label>
                                        <input
                                            type="tel"
                                            value={customerDetails.phone}
                                            onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="+27 12 345 6789"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Payment Summary */}
                            {currentStep === 4 && (
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h3>
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Service:</span>
                                            <span className="font-semibold">{selectedService?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date:</span>
                                            <span className="font-semibold">{selectedDate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Time:</span>
                                            <span className="font-semibold">{selectedTime}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Duration:</span>
                                            <span className="font-semibold">{selectedService?.duration_minutes} minutes</span>
                                        </div>
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between text-lg">
                                                <span className="text-gray-600">Total Service Price:</span>
                                                <span className="font-semibold">R{selectedService ? (selectedService.price / 100).toFixed(2) : '0.00'}</span>
                                            </div>
                                            <div className="flex justify-between text-xl font-bold mt-2" style={{ color: primaryColor }}>
                                                <span>Booking Fee (20%):</span>
                                                <span>R{(calculateBookingFee() / 100).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 mb-6">
                                        <p className="text-sm text-gray-600">
                                            <strong>Note:</strong> You&apos;ll pay a booking fee of R{(calculateBookingFee() / 100).toFixed(2)} now to secure your appointment.
                                            The remaining balance of R{selectedService ? ((selectedService.price - calculateBookingFee()) / 100).toFixed(2) : '0.00'} will be paid at the salon.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className="w-full text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {loading ? 'Processing...' : `Pay Booking Fee - R${(calculateBookingFee() / 100).toFixed(2)}`}
                                    </button>
                                </div>
                            )}

                            {/* Step 5: Payment & Confirmation */}
                            {currentStep === 5 && paymentUrl && (
                                <div className="text-center space-y-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <Check className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Complete Your Payment</h3>
                                    <p className="text-gray-600">
                                        Click the button below to complete your booking fee payment securely via PayStack.
                                    </p>
                                    <a
                                        href={paymentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        Complete Payment
                                    </a>
                                    <div className="mt-8 pt-8 border-t">
                                        <p className="text-gray-600 mb-4">After payment, confirm your booking via WhatsApp:</p>
                                        <button
                                            onClick={sendWhatsAppConfirmation}
                                            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-all"
                                        >
                                            <FaWhatsapp className="w-5 h-5" />
                                            Confirm on WhatsApp
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        {currentStep < 5 && (
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                                    disabled={currentStep === 1}
                                    className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Back
                                </button>

                                <button
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    disabled={!canProceed()}
                                    className="flex items-center gap-2 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    {currentStep < 4 ? 'Continue' : 'Proceed to Payment'}
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Google Maps Section */}
                    {tenantConfig.contact?.google_maps_embed && (
                        <div className="mt-8 bg-white rounded-3xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-6 h-6" style={{ color: primaryColor }} />
                                Find Us
                            </h3>
                            <div className="aspect-video rounded-xl overflow-hidden">
                                <iframe
                                    src={tenantConfig.contact.google_maps_embed}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                            {tenantConfig.contact.google_maps_url && (
                                <a
                                    href={tenantConfig.contact.google_maps_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-4 text-purple-600 hover:text-purple-700 font-semibold"
                                >
                                    Open in Google Maps →
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

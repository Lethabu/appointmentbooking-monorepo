// Enhanced Confirmation with Booking Details, Reminders, and Next Steps
// File: apps/booking/components/booking/EnhancedConfirmation.tsx

'use client';

import {
    CheckCircle,
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    MapPin,
    CreditCard,
    Download,
    Share2,
    Star,
    Gift,
    Bell,
    MessageCircle,
    FileText,
    ArrowRight,
    Copy,
    ExternalLink,
    CalendarPlus,
    AlertCircle,
    Zap,
    Shield,
    Award,
    Heart
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { useBooking , formatPrice, formatDuration } from './BookingContext';


interface BookingConfirmation {
    id: string;
    appointmentNumber: string;
    bookingDate: string;
    bookingTime: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    totalAmount: number;
    depositAmount: number;
    paymentStatus: 'paid' | 'pending' | 'failed';
    confirmationSent: boolean;
    reminders: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
}

interface ReminderSchedule {
    type: 'email' | 'sms' | 'push';
    timing: string; // e.g., "24 hours before", "2 hours before"
    scheduled: boolean;
    sent: boolean;
}

// Mock booking confirmation data
const generateBookingConfirmation = (): BookingConfirmation => {
    const now = new Date();
    const bookingId = `BK${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    return {
        id: crypto.randomUUID(),
        appointmentNumber: bookingId,
        bookingDate: now.toISOString().split('T')[0],
        bookingTime: '14:00',
        status: 'confirmed',
        totalAmount: 0, // Will be set from state
        depositAmount: 0, // Will be set from state
        paymentStatus: 'paid',
        confirmationSent: false,
        reminders: {
            email: true,
            sms: true,
            push: true
        }
    };
};

// Reminder schedule component
function ReminderSchedule({
    reminders,
    onToggleReminder
}: {
    reminders: ReminderSchedule[];
    onToggleReminder: (type: 'email' | 'sms' | 'push', enabled: boolean) => void;
}) {
    return (
        <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 mb-3">Notification Preferences</h4>
            <p className="text-sm text-gray-600 mb-4">
                Choose how you&apos;d like to receive booking reminders and updates
            </p>

            <div className="space-y-3">
                {reminders.map((reminder) => {
                    const iconMap = {
                        email: <Mail className="w-5 h-5" />,
                        sms: <Phone className="w-5 h-5" />,
                        push: <Bell className="w-5 h-5" />
                    };

                    const colorMap = {
                        email: 'text-blue-600',
                        sms: 'text-green-600',
                        push: 'text-purple-600'
                    };

                    return (
                        <div key={reminder.type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`${colorMap[reminder.type]}`}>
                                    {iconMap[reminder.type]}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 capitalize">
                                        {reminder.type} Notifications
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {reminder.timing}
                                    </div>
                                </div>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={reminder.scheduled}
                                    onChange={(e) => onToggleReminder(reminder.type, e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Booking details card component
function BookingDetailsCard({
    confirmation,
    bookingDetails
}: {
    confirmation: BookingConfirmation;
    bookingDetails: any;
}) {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Booking Confirmed!</h3>
                        <p className="text-emerald-100">Your appointment has been successfully booked</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div>
                        <div className="text-sm text-emerald-100">Appointment Number</div>
                        <div className="text-lg font-mono font-bold">{confirmation.appointmentNumber}</div>
                    </div>
                    <button
                        onClick={() => navigator.clipboard.writeText(confirmation.appointmentNumber)}
                        className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                        <Copy className="w-4 h-4" />
                        Copy
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Service Details */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Service Details</h4>
                    <div className="space-y-3">
                        {bookingDetails.services.map((service: any, index: number) => (
                            <div key={index} className="flex justify-between items-start">
                                <div>
                                    <div className="font-medium text-gray-900">{service.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {formatDuration(service.duration)} • {service.staff}
                                    </div>
                                </div>
                                <div className="font-semibold text-gray-900">
                                    {formatPrice(service.price)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Date & Time */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        Date & Time
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <div>
                                <div className="font-medium text-blue-900">
                                    {new Date(bookingDetails.date).toLocaleDateString('en-ZA', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="text-sm text-blue-600">Appointment Date</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                            <Clock className="w-5 h-5 text-purple-600" />
                            <div>
                                <div className="font-medium text-purple-900">
                                    {bookingDetails.time}
                                </div>
                                <div className="text-sm text-purple-600">
                                    Duration: {formatDuration(bookingDetails.totalDuration)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Details */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-600" />
                        Customer Details
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-gray-500" />
                                <div>
                                    <div className="font-medium text-gray-900">{bookingDetails.customerName}</div>
                                    <div className="text-sm text-gray-600">Customer Name</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <div>
                                    <div className="font-medium text-gray-900">{bookingDetails.customerEmail}</div>
                                    <div className="text-sm text-gray-600">Email Address</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <div>
                                    <div className="font-medium text-gray-900">{bookingDetails.customerPhone}</div>
                                    <div className="text-sm text-gray-600">Phone Number</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-indigo-600" />
                        Payment Summary
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-semibold text-gray-900">{formatPrice(bookingDetails.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Deposit Paid:</span>
                            <span className="font-semibold text-green-600">{formatPrice(bookingDetails.depositAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Balance Due:</span>
                            <span className="font-semibold text-gray-900">{formatPrice(bookingDetails.balanceDue)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                Payment confirmed
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Action buttons component
function ActionButtons({
    bookingNumber,
    onDownloadConfirmation,
    onShareBooking,
    onAddToCalendar,
    onContactUs
}: {
    bookingNumber: string;
    onDownloadConfirmation: () => void;
    onShareBooking: () => void;
    onAddToCalendar: () => void;
    onContactUs: () => void;
}) {
    return (
        <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Next Steps</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={onDownloadConfirmation}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Download className="w-5 h-5 text-indigo-600" />
                    <div className="text-left">
                        <div className="font-medium text-gray-900">Download Confirmation</div>
                        <div className="text-sm text-gray-600">PDF receipt & details</div>
                    </div>
                </button>

                <button
                    onClick={onShareBooking}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Share2 className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                        <div className="font-medium text-gray-900">Share Booking</div>
                        <div className="text-sm text-gray-600">Send to friend/family</div>
                    </div>
                </button>

                <button
                    onClick={onAddToCalendar}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <CalendarPlus className="w-5 h-5 text-green-600" />
                    <div className="text-left">
                        <div className="font-medium text-gray-900">Add to Calendar</div>
                        <div className="text-sm text-gray-600">Google, Outlook, Apple</div>
                    </div>
                </button>

                <button
                    onClick={onContactUs}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    <div className="text-left">
                        <div className="font-medium text-gray-900">Contact Support</div>
                        <div className="text-sm text-gray-600">Need help? We&apos;re here!</div>
                    </div>
                </button>
            </div>
        </div>
    );
}

// Loyalty rewards component
function LoyaltyRewards({
    bookingAmount,
    earnedPoints,
    nextTierProgress
}: {
    bookingAmount: number;
    earnedPoints: number;
    nextTierProgress: number;
}) {
    const rewards = [
        { points: 100, reward: 'R10 off next booking', icon: Gift },
        { points: 250, reward: 'R25 off next booking', icon: Star },
        { points: 500, reward: 'R50 off next booking', icon: Award },
        { points: 1000, reward: 'R100 off next booking', icon: Heart }
    ];

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                Loyalty Rewards
            </h4>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Points earned from this booking:</span>
                    <span className="font-bold text-purple-600">+{earnedPoints}</span>
                </div>

                <div className="w-full bg-purple-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${nextTierProgress}%` }}
                    />
                </div>

                <div className="text-sm text-gray-600">
                    {nextTierProgress < 100 ? (
                        `${100 - nextTierProgress}% to next reward tier`
                    ) : (
                        '🎉 Congratulations! You\'ve reached the next tier!'
                    )}
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Available Rewards:</div>
                    {rewards.map((reward, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <reward.icon className="w-4 h-4 text-purple-600" />
                            <span className="text-gray-700">{reward.points} points:</span>
                            <span className="font-medium text-purple-700">{reward.reward}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Important information component
function ImportantInformation() {
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h4 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Important Information
            </h4>

            <div className="space-y-3 text-sm text-amber-800">
                <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="font-medium">Arrive 15 minutes early</div>
                        <div>Please arrive 15 minutes before your appointment time for check-in</div>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="font-medium">Cancellation Policy</div>
                        <div>Cancellations must be made at least 24 hours in advance</div>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="font-medium">What to Bring</div>
                        <div>Valid ID, confirmation email, and any relevant medical information</div>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="font-medium">Health & Safety</div>
                        <div>Please inform us of any allergies or health conditions</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main component
export default function EnhancedConfirmation() {
    const { state, setBookingConfirmation } = useBooking();
    const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize confirmation
    useEffect(() => {
        const initConfirmation = async () => {
            setLoading(true);
            try {
                // Generate booking confirmation
                const bookingConfirmation = generateBookingConfirmation();
                bookingConfirmation.totalAmount = state.totalPrice;
                bookingConfirmation.depositAmount = state.bookingFee;

                setConfirmation(bookingConfirmation);
                setBookingConfirmation(bookingConfirmation.id);

                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('Failed to generate confirmation:', error);
            } finally {
                setLoading(false);
            }
        };

        initConfirmation();
    }, [state, setBookingConfirmation]);

    // Mock reminder schedules
    const [reminders, setReminders] = useState<ReminderSchedule[]>([
        { type: 'email', timing: '24 hours before', scheduled: true, sent: false },
        { type: 'sms', timing: '2 hours before', scheduled: true, sent: false },
        { type: 'push', timing: '30 minutes before', scheduled: true, sent: false }
    ]);

    const handleToggleReminder = (type: 'email' | 'sms' | 'push', enabled: boolean) => {
        setReminders(prev => prev.map(reminder =>
            reminder.type === type
                ? { ...reminder, scheduled: enabled }
                : reminder
        ));
    };

    const handleDownloadConfirmation = () => {
        // TODO: Generate and download PDF confirmation
        console.log('Downloading confirmation PDF...');
    };

    const handleShareBooking = () => {
        // TODO: Implement sharing functionality
        if (confirmation) {
            navigator.share?.({
                title: 'Appointment Booking Confirmation',
                text: `My appointment is confirmed for ${confirmation.appointmentNumber}`,
                url: window.location.href
            });
        }
    };

    const handleAddToCalendar = () => {
        // TODO: Generate calendar invite
        console.log('Adding to calendar...');
    };

    const handleContactUs = () => {
        // TODO: Open contact modal or redirect to contact page
        console.log('Opening contact support...');
    };

    if (loading || !confirmation) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Generating your confirmation...</p>
                </div>
            </div>
        );
    }

    // Mock booking details
    const bookingDetails = {
        services: state.selectedServices.map(service => ({
            name: service.name,
            price: service.price,
            duration: service.durationMinutes,
            staff: 'Assigned Staff'
        })),
        totalDuration: state.selectedServices.reduce((sum, service) => sum + service.durationMinutes, 0),
        date: state.selectedDate,
        time: state.selectedTime,
        customerName: state.customerDetails?.name || 'Customer',
        customerEmail: state.customerDetails?.email || 'customer@example.com',
        customerPhone: state.customerDetails?.phone || '082 123 4567',
        totalAmount: state.totalPrice,
        depositAmount: state.bookingFee,
        balanceDue: state.totalPrice - state.bookingFee
    };

    const earnedPoints = Math.floor(state.totalPrice / 100);
    const nextTierProgress = (earnedPoints % 250) / 250 * 100;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Your appointment has been successfully booked. We&apos;ve sent a confirmation email with all the details.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Booking Details */}
                <div className="lg:col-span-2 space-y-6">
                    <BookingDetailsCard
                        confirmation={confirmation}
                        bookingDetails={bookingDetails}
                    />

                    {/* Reminder Preferences */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <ReminderSchedule
                            reminders={reminders}
                            onToggleReminder={handleToggleReminder}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <ActionButtons
                            bookingNumber={confirmation.appointmentNumber}
                            onDownloadConfirmation={handleDownloadConfirmation}
                            onShareBooking={handleShareBooking}
                            onAddToCalendar={handleAddToCalendar}
                            onContactUs={handleContactUs}
                        />
                    </div>
                </div>

                {/* Right Column - Additional Information */}
                <div className="space-y-6">
                    {/* Loyalty Rewards */}
                    <LoyaltyRewards
                        bookingAmount={bookingDetails.totalAmount}
                        earnedPoints={earnedPoints}
                        nextTierProgress={nextTierProgress}
                    />

                    {/* Important Information */}
                    <ImportantInformation />

                    {/* Contact Information */}
                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                        <h4 className="font-semibold text-blue-900 mb-4">Need Help?</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-blue-800">
                                <Phone className="w-4 h-4" />
                                <span>+27 11 123 4567</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-800">
                                <Mail className="w-4 h-4" />
                                <span>support@appointmentbooking.co.za</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-800">
                                <Clock className="w-4 h-4" />
                                <span>Mon-Fri: 8AM-6PM, Sat: 9AM-3PM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="text-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
                <h3 className="text-xl font-bold mb-2">Thank you for choosing us!</h3>
                <p className="text-indigo-100 mb-4">
                    We look forward to providing you with an exceptional experience.
                </p>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Book Another Appointment
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
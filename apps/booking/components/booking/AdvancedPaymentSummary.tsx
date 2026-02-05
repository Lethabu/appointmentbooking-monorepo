// Advanced Payment Summary with South African Payment Gateways and Installment Options
// File: apps/booking/components/booking/AdvancedPaymentSummary.tsx

'use client';

import {
    CreditCard,
    Shield,
    Clock,
    CheckCircle,
    AlertCircle,
    Info,
    Gift,
    Star,
    DollarSign,
    Calendar,
    Phone,
    Mail,
    MapPin,
    Percent,
    Zap,
    Award,
    Smartphone,
    Lock
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { useBooking , formatPrice, getTotalDuration } from './BookingContext';


interface PaymentMethod {
    id: string;
    name: string;
    type: 'card' | 'bank_transfer' | 'mobile' | 'crypto' | 'wallet';
    logo: string;
    description: string;
    processingTime: string;
    fees: {
        fixed: number; // in cents
        percentage: number; // as decimal
    };
    supportedCurrencies: string[];
    installmentOptions: boolean;
    instantConfirmation: boolean;
    securityFeatures: string[];
}

interface InstallmentOption {
    id: string;
    name: string;
    periods: number;
    monthlyAmount: number;
    totalAmount: number;
    processingFee: number;
    interestRate: number;
    eligibilityCriteria: string[];
}

interface BookingSummary {
    services: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        duration: number;
        staff: string;
    }>;
    subtotal: number;
    discounts: Array<{
        type: string;
        amount: number;
        description: string;
        code?: string;
    }>;
    taxes: Array<{
        type: string;
        amount: number;
        rate: number;
        description: string;
    }>;
    fees: Array<{
        type: string;
        amount: number;
        description: string;
    }>;
    total: number;
    depositRequired: number;
    balanceDue: number;
}

// South African payment methods
const SA_PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 'payfast',
        name: 'PayFast',
        type: 'card',
        logo: '/images/payments/payfast-logo.png',
        description: 'Secure card payments with 3D Secure',
        processingTime: 'Instant',
        fees: {
            fixed: 0,
            percentage: 0.029 // 2.9%
        },
        supportedCurrencies: ['ZAR'],
        installmentOptions: true,
        instantConfirmation: true,
        securityFeatures: ['3D Secure', 'PCI DSS', 'Fraud Protection']
    },
    {
        id: 'ozow',
        name: 'Ozow',
        type: 'bank_transfer',
        logo: '/images/payments/ozow-logo.png',
        description: 'Instant EFT payments from all major banks',
        processingTime: 'Instant',
        fees: {
            fixed: 150, // R1.50
            percentage: 0
        },
        supportedCurrencies: ['ZAR'],
        installmentOptions: false,
        instantConfirmation: true,
        securityFeatures: ['Bank Authentication', 'Instant Verification']
    },
    {
        id: 'yoco',
        name: 'Yoco',
        type: 'card',
        logo: '/images/payments/yoco-logo.png',
        description: 'Modern card processing for businesses',
        processingTime: 'Instant',
        fees: {
            fixed: 0,
            percentage: 0.025 // 2.5%
        },
        supportedCurrencies: ['ZAR'],
        installmentOptions: true,
        instantConfirmation: true,
        securityFeatures: ['3D Secure', 'Tokenization', 'Fraud Detection']
    },
    {
        id: 'peach',
        name: 'Peach Payments',
        type: 'card',
        logo: '/images/payments/peach-logo.png',
        description: 'Omnichannel payment platform',
        processingTime: 'Instant',
        fees: {
            fixed: 0,
            percentage: 0.028 // 2.8%
        },
        supportedCurrencies: ['ZAR', 'USD', 'EUR'],
        installmentOptions: true,
        instantConfirmation: true,
        securityFeatures: ['3D Secure', 'Tokenization', 'ML Fraud Detection']
    },
    {
        id: 'flutterwave',
        name: 'Flutterwave',
        type: 'mobile',
        logo: '/images/payments/flutterwave-logo.png',
        description: 'Mobile money and card payments',
        processingTime: 'Instant',
        fees: {
            fixed: 0,
            percentage: 0.032 // 3.2%
        },
        supportedCurrencies: ['ZAR', 'USD', 'EUR', 'GBP'],
        installmentOptions: true,
        instantConfirmation: true,
        securityFeatures: ['3D Secure', 'Tokenization', 'Geo-fencing']
    },
    {
        id: 'btc',
        name: 'Bitcoin',
        type: 'crypto',
        logo: '/images/payments/bitcoin-logo.png',
        description: 'Pay with Bitcoin cryptocurrency',
        processingTime: '10-60 minutes',
        fees: {
            fixed: 0,
            percentage: 0.005 // 0.5%
        },
        supportedCurrencies: ['BTC', 'ZAR'],
        installmentOptions: false,
        instantConfirmation: false,
        securityFeatures: ['Blockchain', 'Immutable', 'Decentralized']
    },
    {
        id: 'snapscan',
        name: 'SnapScan',
        type: 'mobile',
        logo: '/images/payments/snapscan-logo.png',
        description: 'Scan & pay with your mobile phone',
        processingTime: 'Instant',
        fees: {
            fixed: 0,
            percentage: 0.025 // 2.5%
        },
        supportedCurrencies: ['ZAR'],
        installmentOptions: false,
        instantConfirmation: true,
        securityFeatures: ['QR Code', 'Real-time Verification']
    },
    {
        id: 'airtime',
        name: 'Airtime',
        type: 'wallet',
        logo: '/images/payments/airtime-logo.png',
        description: 'Pay using mobile airtime',
        processingTime: 'Instant',
        fees: {
            fixed: 0,
            percentage: 0.05 // 5%
        },
        supportedCurrencies: ['ZAR'],
        installmentOptions: false,
        instantConfirmation: true,
        securityFeatures: ['PIN Authentication', 'SMS Verification']
    }
];

// Installment options for qualifying bookings
const INSTALLMENT_OPTIONS: InstallmentOption[] = [
    {
        id: 'payfast_2',
        name: 'PayFast 2-Pay',
        periods: 2,
        monthlyAmount: 0,
        totalAmount: 0,
        processingFee: 250, // R2.50
        interestRate: 0,
        eligibilityCriteria: ['Minimum R200', 'Credit card payment']
    },
    {
        id: 'ozow_3',
        name: 'Ozow 3-Pay',
        periods: 3,
        monthlyAmount: 0,
        totalAmount: 0,
        processingFee: 500, // R5.00
        interestRate: 0,
        eligibilityCriteria: ['Minimum R500', 'Bank account verification']
    },
    {
        id: 'peach_6',
        name: 'Peach 6-Month',
        periods: 6,
        monthlyAmount: 0,
        totalAmount: 0,
        processingFee: 1500, // R15.00
        interestRate: 0.015, // 1.5% monthly
        eligibilityCriteria: ['Minimum R1000', 'Credit check required']
    },
    {
        id: 'peach_12',
        name: 'Peach 12-Month',
        periods: 12,
        monthlyAmount: 0,
        totalAmount: 0,
        processingFee: 2500, // R25.00
        interestRate: 0.018, // 1.8% monthly
        eligibilityCriteria: ['Minimum R2000', 'Credit check required', 'Income verification']
    }
];

// Pricing breakdown component
function PricingBreakdown({
    booking,
    discountCodes
}: {
    booking: BookingSummary;
    discountCodes: string[];
}) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Booking Summary</h3>

            {/* Services */}
            <div className="space-y-3">
                {booking.services.map((service, index) => (
                    <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="font-medium text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-500">
                                {service.quantity} × {formatPrice(service.price)} • {service.duration} min
                            </div>
                            <div className="text-sm text-gray-600">Staff: {service.staff}</div>
                        </div>
                        <div className="font-semibold text-gray-900">
                            {formatPrice(service.price * service.quantity)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Subtotal */}
            <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatPrice(booking.subtotal)}</span>
                </div>
            </div>

            {/* Discounts */}
            {booking.discounts.length > 0 && (
                <div className="space-y-2">
                    {booking.discounts.map((discount, index) => (
                        <div key={index} className="flex justify-between items-center text-green-600">
                            <span>{discount.description}</span>
                            <span>-{formatPrice(discount.amount)}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Fees */}
            {booking.fees.length > 0 && (
                <div className="space-y-2">
                    {booking.fees.map((fee, index) => (
                        <div key={index} className="flex justify-between items-center text-gray-600">
                            <span>{fee.description}</span>
                            <span>{formatPrice(fee.amount)}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Taxes */}
            {booking.taxes.length > 0 && (
                <div className="space-y-2">
                    {booking.taxes.map((tax, index) => (
                        <div key={index} className="flex justify-between items-center text-gray-600">
                            <span>{tax.description}</span>
                            <span>{formatPrice(tax.amount)}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Total */}
            <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-indigo-600">{formatPrice(booking.total)}</span>
                </div>
            </div>

            {/* Deposit Information */}
            {booking.depositRequired > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-yellow-900">Deposit Required</h4>
                            <p className="text-sm text-yellow-800 mt-1">
                                A deposit of {formatPrice(booking.depositRequired)} is required to secure your booking.
                                The remaining balance of {formatPrice(booking.balanceDue)} is due at your appointment.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Payment method selector
function PaymentMethodSelector({
    methods,
    selectedMethod,
    onSelect,
    amount,
    installmentOptions
}: {
    methods: PaymentMethod[];
    selectedMethod: string;
    onSelect: (methodId: string) => void;
    amount: number;
    installmentOptions: boolean;
}) {
    const calculateFees = (method: PaymentMethod, amount: number) => {
        const fixedFee = method.fees.fixed;
        const percentageFee = amount * method.fees.percentage;
        return fixedFee + percentageFee;
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Payment Method</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {methods.map((method) => {
                    const fees = calculateFees(method, amount);
                    const totalAmount = amount + fees;

                    return (
                        <div
                            key={method.id}
                            onClick={() => onSelect(method.id)}
                            className={`
                                border-2 rounded-lg p-4 cursor-pointer transition-all
                                ${selectedMethod === method.id
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                            `}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                                        {/* Payment method icon */}
                                        {method.type === 'card' && <CreditCard className="w-6 h-6 text-indigo-600" />}
                                        {method.type === 'bank_transfer' && <DollarSign className="w-6 h-6 text-green-600" />}
                                        {method.type === 'mobile' && <Smartphone className="w-6 h-6 text-blue-600" />}
                                        {method.type === 'crypto' && <Zap className="w-6 h-6 text-orange-600" />}
                                        {method.type === 'wallet' && <Phone className="w-6 h-6 text-purple-600" />}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{method.name}</h4>
                                        <p className="text-sm text-gray-600">{method.description}</p>
                                    </div>
                                </div>

                                {selectedMethod === method.id && (
                                    <CheckCircle className="w-5 h-5 text-indigo-500" />
                                )}
                            </div>

                            {/* Features */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {method.processingTime}
                                    </span>
                                    {method.instantConfirmation && (
                                        <span className="flex items-center gap-1 text-green-600">
                                            <Zap className="w-3 h-3" />
                                            Instant
                                        </span>
                                    )}
                                    {method.installmentOptions && installmentOptions && (
                                        <span className="flex items-center gap-1 text-blue-600">
                                            <Calendar className="w-3 h-3" />
                                            Installments
                                        </span>
                                    )}
                                </div>

                                {/* Fees */}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Processing fee:</span>
                                    <span className="font-medium text-gray-900">{formatPrice(fees)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Total amount:</span>
                                    <span className="font-semibold text-gray-900">{formatPrice(totalAmount)}</span>
                                </div>
                            </div>

                            {/* Security features */}
                            <div className="mt-3 flex flex-wrap gap-1">
                                {method.securityFeatures.map((feature, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Installment options selector
function InstallmentSelector({
    options,
    selectedOption,
    onSelect,
    totalAmount
}: {
    options: InstallmentOption[];
    selectedOption: string;
    onSelect: (optionId: string) => void;
    totalAmount: number;
}) {
    const calculateInstallmentOptions = () => {
        return options.map(option => {
            const monthlyAmount = (totalAmount + option.processingFee) / option.periods;
            const totalAmountWithFees = totalAmount + option.processingFee;

            return {
                ...option,
                monthlyAmount,
                totalAmount: totalAmountWithFees
            };
        });
    };

    const calculatedOptions = calculateInstallmentOptions();

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Installment Options</h3>
            <p className="text-sm text-gray-600">
                Split your payment into manageable installments. Available for qualifying bookings over R200.
            </p>

            <div className="space-y-3">
                {calculatedOptions.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => onSelect(option.id)}
                        className={`
                            border-2 rounded-lg p-4 cursor-pointer transition-all
                            ${selectedOption === option.id
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
                        `}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-semibold text-gray-900">{option.name}</h4>
                                <p className="text-sm text-gray-600">
                                    {option.periods} payments of {formatPrice(option.monthlyAmount)}
                                </p>
                            </div>
                            {selectedOption === option.id && (
                                <CheckCircle className="w-5 h-5 text-indigo-500" />
                            )}
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total amount:</span>
                                <span className="font-medium">{formatPrice(option.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Processing fee:</span>
                                <span className="font-medium">{formatPrice(option.processingFee)}</span>
                            </div>
                            {option.interestRate > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Interest rate:</span>
                                    <span className="font-medium">{(option.interestRate * 100).toFixed(1)}% monthly</span>
                                </div>
                            )}
                        </div>

                        {/* Eligibility criteria */}
                        <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-2">Eligibility:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                                {option.eligibilityCriteria.map((criteria, index) => (
                                    <li key={index} className="flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        {criteria}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Discount code application
function DiscountCodeApplication({
    codes,
    appliedCodes,
    onApplyCode,
    onRemoveCode
}: {
    codes: string[];
    appliedCodes: string[];
    onApplyCode: (code: string) => void;
    onRemoveCode: (code: string) => void;
}) {
    const [newCode, setNewCode] = useState('');

    const handleApplyCode = () => {
        if (newCode.trim()) {
            onApplyCode(newCode.trim().toUpperCase());
            setNewCode('');
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Discount Codes</h3>

            {/* Applied codes */}
            {appliedCodes.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Applied Codes:</h4>
                    {appliedCodes.map((code) => (
                        <div key={code} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <Gift className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-green-900">{code}</span>
                            </div>
                            <button
                                onClick={() => onRemoveCode(code)}
                                className="text-red-600 hover:text-red-700 text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Available codes */}
            <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Available Codes:</h4>
                <div className="flex flex-wrap gap-2">
                    {codes.filter(code => !appliedCodes.includes(code)).map((code) => (
                        <button
                            key={code}
                            onClick={() => onApplyCode(code)}
                            className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                        >
                            {code}
                        </button>
                    ))}
                </div>
            </div>

            {/* Apply new code */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="Enter discount code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-200"
                />
                <button
                    onClick={handleApplyCode}
                    disabled={!newCode.trim()}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}

// Main component
export default function AdvancedPaymentSummary() {
    const { state } = useBooking();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedInstallmentOption, setSelectedInstallmentOption] = useState('');
    const [appliedDiscountCodes, setAppliedDiscountCodes] = useState<string[]>([]);
    const [installmentMode, setInstallmentMode] = useState(false);
    const [loading, setLoading] = useState(false);

    // Mock discount codes
    const availableDiscountCodes = ['WELCOME10', 'FIRST20', 'LOYALTY15', 'REFERRAL25'];

    // Generate booking summary from state
    const bookingSummary: BookingSummary = {
        services: state.selectedServices.map(service => ({
            id: service.id,
            name: service.name,
            price: service.price,
            quantity: 1,
            duration: service.durationMinutes,
            staff: 'Available Staff' // TODO: Get from selected staff
        })),
        subtotal: state.totalPrice,
        discounts: [], // TODO: Calculate based on applied codes
        taxes: [
            {
                type: 'VAT',
                amount: state.totalPrice * 0.15, // 15% VAT
                rate: 0.15,
                description: 'Value Added Tax (15%)'
            }
        ],
        fees: [
            {
                type: 'Booking Fee',
                amount: state.bookingFee,
                description: 'Service booking and processing fee'
            }
        ],
        total: state.totalPrice + (state.totalPrice * 0.15) + state.bookingFee,
        depositRequired: Math.max(state.totalPrice * 0.1, 5000), // 10% or R50 minimum
        balanceDue: 0
    };

    bookingSummary.balanceDue = bookingSummary.total - bookingSummary.depositRequired;

    // Calculate discounts
    bookingSummary.discounts = appliedDiscountCodes.map(code => {
        const discountMap: Record<string, { type: string; amount: number; description: string; code: string }> = {
            'WELCOME10': { type: 'percentage', amount: bookingSummary.subtotal * 0.1, description: 'Welcome Discount (10%)', code },
            'FIRST20': { type: 'percentage', amount: bookingSummary.subtotal * 0.2, description: 'First-Time Customer (20%)', code },
            'LOYALTY15': { type: 'percentage', amount: bookingSummary.subtotal * 0.15, description: 'Loyalty Discount (15%)', code },
            'REFERRAL25': { type: 'percentage', amount: bookingSummary.subtotal * 0.25, description: 'Referral Bonus (25%)', code }
        };
        return discountMap[code] || { type: 'fixed', amount: 0, description: 'Discount', code };
    });

    // Handle payment method selection
    const handlePaymentMethodSelect = (methodId: string) => {
        setSelectedPaymentMethod(methodId);
        const method = SA_PAYMENT_METHODS.find(m => m.id === methodId);

        // Enable installment mode if method supports it and amount qualifies
        if (method?.installmentOptions && bookingSummary.total >= 20000) {
            setInstallmentMode(true);
        } else {
            setInstallmentMode(false);
            setSelectedInstallmentOption('');
        }
    };

    // Handle discount code application
    const handleApplyDiscountCode = (code: string) => {
        if (!appliedDiscountCodes.includes(code)) {
            setAppliedDiscountCodes(prev => [...prev, code]);
        }
    };

    // Handle discount code removal
    const handleRemoveDiscountCode = (code: string) => {
        setAppliedDiscountCodes(prev => prev.filter(c => c !== code));
    };

    // Handle payment submission
    const handlePaymentSubmit = async () => {
        if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            return;
        }

        setLoading(true);
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // TODO: Integrate with actual payment gateway
            console.log('Processing payment...', {
                paymentMethod: selectedPaymentMethod,
                installmentOption: selectedInstallmentOption,
                amount: bookingSummary.total,
                booking: bookingSummary
            });

            alert('Payment processed successfully! Booking confirmed.');
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const selectedMethod = SA_PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod);
    const installmentOptions = INSTALLMENT_OPTIONS.filter(option =>
        selectedMethod?.installmentOptions &&
        bookingSummary.total >= 20000 &&
        option.id.startsWith(selectedMethod?.id.split('_')[0] || '')
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment & Summary</h2>
                <p className="text-gray-600">
                    Complete your booking with secure payment options and installment plans
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Summary & Payment */}
                <div className="space-y-6">
                    {/* Pricing Breakdown */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <PricingBreakdown
                            booking={bookingSummary}
                            discountCodes={availableDiscountCodes}
                        />
                    </div>

                    {/* Discount Codes */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <DiscountCodeApplication
                            codes={availableDiscountCodes}
                            appliedCodes={appliedDiscountCodes}
                            onApplyCode={handleApplyDiscountCode}
                            onRemoveCode={handleRemoveDiscountCode}
                        />
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <PaymentMethodSelector
                            methods={SA_PAYMENT_METHODS}
                            selectedMethod={selectedPaymentMethod}
                            onSelect={handlePaymentMethodSelect}
                            amount={bookingSummary.total}
                            installmentOptions={installmentMode}
                        />
                    </div>

                    {/* Installment Options */}
                    {installmentMode && installmentOptions.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <InstallmentSelector
                                options={installmentOptions}
                                selectedOption={selectedInstallmentOption}
                                onSelect={setSelectedInstallmentOption}
                                totalAmount={bookingSummary.total}
                            />
                        </div>
                    )}
                </div>

                {/* Right Column - Security & Terms */}
                <div className="space-y-6">
                    {/* Security Information */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-600" />
                            Secure Payment
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Lock className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-700">256-bit SSL encryption</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-700">PCI DSS compliant</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Award className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-700">Fraud protection included</span>
                            </div>
                        </div>
                    </div>

                    {/* Loyalty Benefits */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-purple-600" />
                            Loyalty Benefits
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Earn loyalty points:</span>
                                <span className="font-semibold text-purple-600">
                                    +{Math.floor(bookingSummary.total / 100)} points
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Next tier discount:</span>
                                <span className="text-sm text-gray-600">
                                    {(Math.floor(bookingSummary.total / 1000) * 10)}% off next booking
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <p>
                                • Deposits are non-refundable within 24 hours of appointment
                            </p>
                            <p>
                                • Cancellations must be made at least 24 hours in advance
                            </p>
                            <p>
                                • Installment payments subject to credit approval
                            </p>
                            <p>
                                • All prices include VAT where applicable
                            </p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-700">+27 11 123 4567</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-700">support@appointmentbooking.co.za</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-700">Mon-Fri: 8AM-6PM, Sat: 9AM-3PM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Button */}
            <div className="text-center">
                <button
                    onClick={handlePaymentSubmit}
                    disabled={!selectedPaymentMethod || loading}
                    className={`
                        px-8 py-4 rounded-lg font-semibold text-lg transition-all
                        ${selectedPaymentMethod && !loading
                            ? 'bg-gradient-to-r from-indigo-500 to-emerald-500 text-white hover:shadow-lg transform hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                    `}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Processing Payment...
                        </div>
                    ) : (
                        `Pay ${formatPrice(bookingSummary.total)}`
                    )}
                </button>

                {!selectedPaymentMethod && (
                    <p className="text-sm text-gray-500 mt-2">
                        Please select a payment method to continue
                    </p>
                )}
            </div>
        </div>
    );
}
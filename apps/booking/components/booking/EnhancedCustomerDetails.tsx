// Enhanced Customer Details with Advanced Validation and Profile Management
// File: apps/booking/components/booking/EnhancedCustomerDetails.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useBooking } from './BookingContext';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Clock,
    Shield,
    Heart,
    AlertCircle,
    CheckCircle,
    Camera,
    Star,
    Zap,
    Gift,
    Info
} from 'lucide-react';

interface CustomerPreferences {
    preferredStaff: string[];
    preferredTimes: string[];
    communicationMethods: string[];
    specialRequests: string[];
    allergies: string[];
    medicalConditions: string[];
    accessibilityNeeds: string[];
}

interface CustomerProfile {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    alternativePhone?: string;
    whatsappNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country: string;
    marketingOptIn: boolean;
    smsOptIn: boolean;
    whatsappOptIn: boolean;
    preferences: CustomerPreferences;
    isReturning: boolean;
    customerTier: 'regular' | 'silver' | 'gold' | 'platinum';
    totalBookings: number;
    averageRating: number;
    loyaltyPoints: number;
}

// Validation functions
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

const validateSouthAfricanPhone = (phone: string): boolean => {
    // South African phone number validation
    const saPhoneRegex = /^(\+27|0)[0-9]{9}$/;
    return saPhoneRegex.test(phone.replace(/\s/g, ''));
};

// Form field component with validation
function FormField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    required = false,
    placeholder,
    error,
    icon,
    validation,
    disabled = false
}: {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    placeholder?: string;
    error?: string;
    icon?: React.ReactNode;
    validation?: (value: string) => boolean;
    disabled?: boolean;
}) {
    const [isValid, setIsValid] = useState(true);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (touched && validation) {
            setIsValid(validation(value));
        }
    }, [value, touched, validation]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        onChange(e.target.value);
        setTouched(true);
    };

    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                {icon}
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                onBlur={() => setTouched(true)}
                placeholder={placeholder}
                disabled={disabled}
                className={`
                    w-full px-4 py-3 border rounded-lg transition-all
                    ${error || (touched && !isValid)
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                    }
                    ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'}
                `}
            />
            {error && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
            {touched && !isValid && !error && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    Invalid {label.toLowerCase()}
                </div>
            )}
            {touched && isValid && value && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Valid
                </div>
            )}
        </div>
    );
}

// Customer tier badge component
function CustomerTierBadge({ tier }: { tier: CustomerProfile['customerTier'] }) {
    const tierConfig = {
        regular: { color: 'bg-gray-100 text-gray-800', label: 'Regular', icon: User },
        silver: { color: 'bg-gray-100 text-gray-800', label: 'Silver', icon: Star },
        gold: { color: 'bg-yellow-100 text-yellow-800', label: 'Gold', icon: Star },
        platinum: { color: 'bg-purple-100 text-purple-800', label: 'Platinum', icon: Star }
    };

    const config = tierConfig[tier];
    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
            <Icon className="w-4 h-4" />
            {config.label} Member
        </div>
    );
}

// Marketing preferences component
function MarketingPreferences({
    preferences,
    onChange
}: {
    preferences: CustomerProfile['marketingOptIn'];
    onChange: (type: 'marketing' | 'sms' | 'whatsapp', value: boolean) => void;
}) {
    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Communication Preferences
            </h4>
            <div className="space-y-3">
                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={preferences}
                        onChange={(e) => onChange('marketing', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div>
                        <div className="font-medium text-gray-900">Email Marketing</div>
                        <div className="text-sm text-gray-500">
                            Receive updates about new services, special offers, and promotions
                        </div>
                    </div>
                </label>
            </div>
        </div>
    );
}

// Special requests and medical information
function SpecialRequests({
    preferences,
    onChange
}: {
    preferences: CustomerProfile['preferences'];
    onChange: (field: keyof CustomerPreferences, value: string | string[]) => void;
}) {
    const [newRequest, setNewRequest] = useState('');
    const [newAllergy, setNewAllergy] = useState('');
    const [newMedical, setNewMedical] = useState('');

    const addRequest = () => {
        if (newRequest.trim()) {
            const updated = [...preferences.specialRequests, newRequest.trim()];
            onChange('specialRequests', updated);
            setNewRequest('');
        }
    };

    const removeRequest = (index: number) => {
        const updated = preferences.specialRequests.filter((_, i) => i !== index);
        onChange('specialRequests', updated);
    };

    const addAllergy = () => {
        if (newAllergy.trim()) {
            const updated = [...preferences.allergies, newAllergy.trim()];
            onChange('allergies', updated);
            setNewAllergy('');
        }
    };

    const removeAllergy = (index: number) => {
        const updated = preferences.allergies.filter((_, i) => i !== index);
        onChange('allergies', updated);
    };

    const addMedical = () => {
        if (newMedical.trim()) {
            const updated = [...preferences.medicalConditions, newMedical.trim()];
            onChange('medicalConditions', updated);
            setNewMedical('');
        }
    };

    const removeMedical = (index: number) => {
        const updated = preferences.medicalConditions.filter((_, i) => i !== index);
        onChange('medicalConditions', updated);
    };

    return (
        <div className="space-y-6">
            {/* Special Requests */}
            <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    Special Requests
                </h4>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newRequest}
                            onChange={(e) => setNewRequest(e.target.value)}
                            placeholder="Add a special request..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-200"
                        />
                        <button
                            onClick={addRequest}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                    {preferences.specialRequests.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {preferences.specialRequests.map((request, index) => (
                                <div key={index} className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    {request}
                                    <button
                                        onClick={() => removeRequest(index)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Allergies */}
            <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Allergies
                </h4>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            placeholder="Add an allergy..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-200"
                        />
                        <button
                            onClick={addAllergy}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                    {preferences.allergies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {preferences.allergies.map((allergy, index) => (
                                <div key={index} className="bg-orange-50 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3" />
                                    {allergy}
                                    <button
                                        onClick={() => removeAllergy(index)}
                                        className="text-orange-600 hover:text-orange-800"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Medical Conditions */}
            <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-500" />
                    Medical Conditions
                </h4>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMedical}
                            onChange={(e) => setNewMedical(e.target.value)}
                            placeholder="Add a medical condition..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-200"
                        />
                        <button
                            onClick={addMedical}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                    {preferences.medicalConditions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {preferences.medicalConditions.map((condition, index) => (
                                <div key={index} className="bg-red-50 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    <Shield className="w-3 h-3" />
                                    {condition}
                                    <button
                                        onClick={() => removeMedical(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Main component
export default function EnhancedCustomerDetails() {
    const { state, setCustomerDetails } = useBooking();
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Initialize customer profile
    const [profile, setProfile] = useState<CustomerProfile>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        alternativePhone: '',
        whatsappNumber: '',
        dateOfBirth: '',
        gender: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'South Africa',
        marketingOptIn: true,
        smsOptIn: false,
        whatsappOptIn: false,
        preferences: {
            preferredStaff: [],
            preferredTimes: [],
            communicationMethods: [],
            specialRequests: [],
            allergies: [],
            medicalConditions: [],
            accessibilityNeeds: []
        },
        isReturning: false,
        customerTier: 'regular',
        totalBookings: 0,
        averageRating: 0,
        loyaltyPoints: 0
    });

    // Load existing customer data if available
    useEffect(() => {
        const loadCustomerData = async () => {
            if (state.customerDetails) {
                setLoading(true);
                try {
                    // Simulate API call to load customer data
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // Mock loading existing data
                    setProfile(prev => ({
                        ...prev,
                        ...state.customerDetails,
                        isReturning: true,
                        customerTier: 'silver',
                        totalBookings: 5,
                        averageRating: 4.5,
                        loyaltyPoints: 250
                    }));
                } catch (error) {
                    console.error('Failed to load customer data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadCustomerData();
    }, [state.customerDetails]);

    // Validate form
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!profile.firstName.trim()) {
            errors.firstName = 'First name is required';
        }

        if (!profile.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }

        if (!profile.email.trim()) {
            errors.email = 'Email is required';
        } else if (!validateEmail(profile.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!profile.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!validateSouthAfricanPhone(profile.phone)) {
            errors.phone = 'Please enter a valid South African phone number';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle field updates
    const updateProfile = (field: keyof CustomerProfile, value: any) => {
        setProfile(prev => ({ ...prev, [field]: value }));

        // Clear validation error when field is updated
        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Handle preference updates
    const updatePreference = (field: keyof CustomerPreferences, value: string | string[]) => {
        setProfile(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [field]: value
            }
        }));
    };

    // Handle marketing preference updates
    const updateMarketingOptIn = (type: 'marketing' | 'sms' | 'whatsapp', value: boolean) => {
        const fieldMap = {
            marketing: 'marketingOptIn' as const,
            sms: 'smsOptIn' as const,
            whatsapp: 'whatsappOptIn' as const
        };
        updateProfile(fieldMap[type], value);
    };

    // Update booking context when form is valid
    useEffect(() => {
        if (validateForm()) {
            setCustomerDetails({
                name: `${profile.firstName} ${profile.lastName}`.trim(),
                email: profile.email,
                phone: profile.phone,
                notes: profile.preferences.specialRequests.join('; ')
            });
        }
    }, [profile]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Information</h2>
                <p className="text-gray-600">
                    {profile.isReturning
                        ? `Welcome back, ${profile.firstName}! We have ${profile.totalBookings} appointments on record.`
                        : 'Please provide your contact details to complete your booking.'
                    }
                </p>
            </div>

            {/* Customer Status Banner */}
            {profile.isReturning && (
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {profile.firstName} {profile.lastName}
                                </h3>
                                <div className="flex items-center gap-4 mt-1">
                                    <CustomerTierBadge tier={profile.customerTier} />
                                    <span className="text-sm text-gray-600">
                                        {profile.totalBookings} bookings
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {profile.loyaltyPoints} loyalty points
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            {profile.averageRating.toFixed(1)} rating
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-600" />
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="First Name"
                            name="firstName"
                            value={profile.firstName}
                            onChange={(value) => updateProfile('firstName', value)}
                            required
                            placeholder="Enter your first name"
                            error={validationErrors.firstName}
                            icon={<User className="w-4 h-4" />}
                        />

                        <FormField
                            label="Last Name"
                            name="lastName"
                            value={profile.lastName}
                            onChange={(value) => updateProfile('lastName', value)}
                            required
                            placeholder="Enter your last name"
                            error={validationErrors.lastName}
                            icon={<User className="w-4 h-4" />}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="Email Address"
                            name="email"
                            type="email"
                            value={profile.email}
                            onChange={(value) => updateProfile('email', value)}
                            required
                            placeholder="Enter your email address"
                            error={validationErrors.email}
                            icon={<Mail className="w-4 h-4" />}
                            validation={validateEmail}
                        />

                        <FormField
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            value={profile.phone}
                            onChange={(value) => updateProfile('phone', value)}
                            required
                            placeholder="e.g. 082 123 4567"
                            error={validationErrors.phone}
                            icon={<Phone className="w-4 h-4" />}
                            validation={validateSouthAfricanPhone}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="Alternative Phone"
                            name="alternativePhone"
                            type="tel"
                            value={profile.alternativePhone || ''}
                            onChange={(value) => updateProfile('alternativePhone', value)}
                            placeholder="Alternative phone number"
                            icon={<Phone className="w-4 h-4" />}
                        />

                        <FormField
                            label="WhatsApp Number"
                            name="whatsappNumber"
                            type="tel"
                            value={profile.whatsappNumber || ''}
                            onChange={(value) => updateProfile('whatsappNumber', value)}
                            placeholder="WhatsApp number"
                            icon={<Phone className="w-4 h-4" />}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={profile.dateOfBirth || ''}
                            onChange={(value) => updateProfile('dateOfBirth', value)}
                            placeholder="Select your date of birth"
                            icon={<Clock className="w-4 h-4" />}
                        />

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <User className="w-4 h-4" />
                                Gender
                            </label>
                            <select
                                value={profile.gender || ''}
                                onChange={(e) => updateProfile('gender', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-200"
                            >
                                <option value="">Prefer not to say</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                        Address Information
                    </h3>

                    <FormField
                        label="Street Address"
                        name="streetAddress"
                        value={profile.streetAddress || ''}
                        onChange={(value) => updateProfile('streetAddress', value)}
                        placeholder="Enter your street address"
                        icon={<MapPin className="w-4 h-4" />}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="City"
                            name="city"
                            value={profile.city || ''}
                            onChange={(value) => updateProfile('city', value)}
                            placeholder="Enter your city"
                            icon={<MapPin className="w-4 h-4" />}
                        />

                        <FormField
                            label="State/Province"
                            name="state"
                            value={profile.state || ''}
                            onChange={(value) => updateProfile('state', value)}
                            placeholder="Enter your state"
                            icon={<MapPin className="w-4 h-4" />}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="Postal Code"
                            name="postalCode"
                            value={profile.postalCode || ''}
                            onChange={(value) => updateProfile('postalCode', value)}
                            placeholder="Enter your postal code"
                            icon={<MapPin className="w-4 h-4" />}
                        />

                        <FormField
                            label="Country"
                            name="country"
                            value={profile.country}
                            onChange={(value) => updateProfile('country', value)}
                            placeholder="Enter your country"
                            icon={<MapPin className="w-4 h-4" />}
                        />
                    </div>
                </div>
            </div>

            {/* Marketing Preferences */}
            <MarketingPreferences
                preferences={profile.marketingOptIn}
                onChange={updateMarketingOptIn}
            />

            {/* Special Requests and Medical Information */}
            <SpecialRequests
                preferences={profile.preferences}
                onChange={updatePreference}
            />

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Privacy & Data Protection</h4>
                        <p className="text-sm text-blue-800">
                            Your personal information is protected and will only be used for booking purposes and communication about your appointments.
                            We comply with POPIA (Protection of Personal Information Act) and never share your data with third parties without consent.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
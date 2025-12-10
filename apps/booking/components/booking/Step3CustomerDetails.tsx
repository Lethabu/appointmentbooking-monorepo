// Step 3: Customer Details Form
// File: apps/booking/components/booking/Step3CustomerDetails.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useBooking, CustomerDetails } from './BookingContext';

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
}

export default function Step3CustomerDetails() {
    const { state, setCustomerDetails } = useBooking();

    const [formData, setFormData] = useState<CustomerDetails>({
        name: state.customerDetails?.name || '',
        email: state.customerDetails?.email || '',
        phone: state.customerDetails?.phone || '',
        notes: state.customerDetails?.notes || '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Validation rules
    const validateField = (name: keyof CustomerDetails, value: string): string | undefined => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return undefined;

            case 'email':
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return undefined;

            case 'phone':
                if (!value.trim()) return 'Phone number is required';
                // South African phone number format
                const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
                const cleanPhone = value.replace(/\s/g, '');
                if (!phoneRegex.test(cleanPhone)) {
                    return 'Please enter a valid South African phone number (e.g., 0821234567)';
                }
                return undefined;

            case 'notes':
                if (value.length > 500) return 'Notes must be less than 500 characters';
                return undefined;

            default:
                return undefined;
        }
    };

    // Validate all fields
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        (Object.keys(formData) as Array<keyof CustomerDetails>).forEach((key) => {
            const error = validateField(key, formData[key] || '');
            if (error) newErrors[key] = error;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle field change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Validate on change if field has been touched
        if (touched[name]) {
            const error = validateField(name as keyof CustomerDetails, value);
            setErrors((prev) => ({
                ...prev,
                [name]: error,
            }));
        }
    };

    // Handle field blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        const error = validateField(name as keyof CustomerDetails, value);
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    // Update context when form is valid
    useEffect(() => {
        if (validateForm()) {
            setCustomerDetails(formData);
        }
    }, [formData]);

    // Format phone number as user types
    const formatPhoneNumber = (value: string): string => {
        const cleaned = value.replace(/\D/g, '');

        if (cleaned.startsWith('27')) {
            // International format
            return `+${cleaned}`;
        } else if (cleaned.startsWith('0')) {
            // Local format
            return cleaned;
        }

        return value;
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Details</h2>
            <p className="text-gray-600 mb-6">
                Please provide your contact information for the appointment
            </p>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Name Field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g., Jane Doe"
                        className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-crimson focus:border-crimson
              ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}
            `}
                        aria-invalid={errors.name && touched.name ? 'true' : 'false'}
                        aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                    />
                    {errors.name && touched.name && (
                        <p id="name-error" className="mt-1 text-sm text-red-600">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g., jane@example.com"
                        className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-crimson focus:border-crimson
              ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'}
            `}
                        aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                        aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                    />
                    {errors.email && touched.email && (
                        <p id="email-error" className="mt-1 text-sm text-red-600">
                            {errors.email}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        We&apos;ll send your booking confirmation to this email
                    </p>
                </div>

                {/* Phone Field */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g., 0821234567"
                        className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-crimson focus:border-crimson
              ${errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'}
            `}
                        aria-invalid={errors.phone && touched.phone ? 'true' : 'false'}
                        aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && touched.phone && (
                        <p id="phone-error" className="mt-1 text-sm text-red-600">
                            {errors.phone}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        We&apos;ll send appointment reminders via WhatsApp
                    </p>
                </div>

                {/* Notes Field (Optional) */}
                <div>
                    <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                        Additional Notes <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={4}
                        placeholder="Any special requests or information we should know..."
                        className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-crimson focus:border-crimson resize-none
              ${errors.notes && touched.notes ? 'border-red-500' : 'border-gray-300'}
            `}
                        aria-invalid={errors.notes && touched.notes ? 'true' : 'false'}
                        aria-describedby={errors.notes && touched.notes ? 'notes-error' : undefined}
                    />
                    {errors.notes && touched.notes && (
                        <p id="notes-error" className="mt-1 text-sm text-red-600">
                            {errors.notes}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        {formData.notes?.length || 0}/500 characters
                    </p>
                </div>

                {/* Form Validation Summary */}
                {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600 text-sm font-semibold mb-2">
                            Please fix the following errors:
                        </p>
                        <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
                            {Object.entries(errors).map(([field, error]) => (
                                <li key={field}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Success Indicator */}
                {Object.keys(errors).length === 0 && formData.name && formData.email && formData.phone && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 font-semibold">
                            ✓ All details look good! You can proceed to the next step.
                        </p>
                    </div>
                )}
            </form>

            {/* Privacy Notice */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-800">
                    <strong>Privacy Notice:</strong> Your information is protected under POPIA (Protection of Personal Information Act).
                    We will only use your details to manage your appointment and send you booking confirmations.
                    You can request access to or deletion of your data at any time.
                </p>
            </div>
        </div>
    );
}

// Lazy-loaded customer details form component
"use client";

import { memo } from 'react';
import { motion } from 'framer-motion';

interface CustomerDetailsProps {
    data: {
        customerDetails: {
            name: string;
            email: string;
            phone: string;
        };
    };
    onUpdate: (updates: any) => void;
}

// Memoize form inputs for performance
const FormInput = memo(({
    label,
    type,
    value,
    onChange,
    placeholder,
    required = false
}: {
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    required?: boolean;
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && '*'}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            placeholder={placeholder}
            required={required}
        />
    </div>
));

FormInput.displayName = 'FormInput';

export function CustomerDetails({ data, onUpdate }: CustomerDetailsProps) {
    const { customerDetails } = data;

    const updateCustomerDetails = (field: string, value: string) => {
        onUpdate({
            customerDetails: {
                ...customerDetails,
                [field]: value
            }
        });
    };

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <FormInput
                label="Full Name"
                type="text"
                value={customerDetails.name}
                onChange={(value) => updateCustomerDetails('name', value)}
                placeholder="Enter your full name"
                required
            />

            <FormInput
                label="Email Address"
                type="email"
                value={customerDetails.email}
                onChange={(value) => updateCustomerDetails('email', value)}
                placeholder="Enter your email"
                required
            />

            <FormInput
                label="Phone Number"
                type="tel"
                value={customerDetails.phone}
                onChange={(value) => updateCustomerDetails('phone', value)}
                placeholder="+27 12 345 6789"
                required
            />
        </motion.div>
    );
}
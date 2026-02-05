'use client';

import { AlertCircle } from 'lucide-react';
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helpText?: string;
    icon?: React.ElementType;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({
        label,
        error,
        helpText,
        icon: Icon,
        iconPosition = 'left',
        fullWidth = true,
        required = false,
        className = '',
        id,
        ...props
    }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const helpTextId = helpText ? `${inputId}-help` : undefined;
        const errorId = error ? `${inputId}-error` : undefined;

        const baseClasses = [
            'w-full px-4 py-3 border rounded-xl transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
            'placeholder-gray-400',
            'touch-manipulation min-h-[44px]', // Ensures 44px minimum touch target
        ];

        const errorClasses = error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300';

        const iconClasses = Icon
            ? iconPosition === 'left'
                ? 'pl-12'
                : 'pr-12'
            : '';

        const classes = [
            ...baseClasses,
            errorClasses,
            iconClasses,
            className,
        ].join(' ');

        return (
            <div className={fullWidth ? 'w-full' : ''}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        {label}
                        {required && (
                            <span className="text-red-500 ml-1" aria-label="required">*</span>
                        )}
                    </label>
                )}

                <div className="relative">
                    {Icon && iconPosition === 'left' && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon className={`w-5 h-5 ${error ? 'text-red-400' : 'text-gray-400'}`} aria-hidden="true" />
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={classes}
                        aria-invalid={!!error}
                        aria-describedby={[
                            helpTextId,
                            errorId
                        ].filter(Boolean).join(' ') || undefined}
                        required={required}
                        {...props}
                    />

                    {Icon && iconPosition === 'right' && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Icon className={`w-5 h-5 ${error ? 'text-red-400' : 'text-gray-400'}`} aria-hidden="true" />
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mt-2 flex items-center text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                        <p id={errorId} className="text-sm">
                            {error}
                        </p>
                    </div>
                )}

                {helpText && !error && (
                    <p id={helpTextId} className="mt-2 text-sm text-gray-600">
                        {helpText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
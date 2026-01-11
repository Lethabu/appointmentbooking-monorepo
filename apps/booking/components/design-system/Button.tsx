'use client';

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    icon?: React.ElementType;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        loading = false,
        icon: Icon,
        iconPosition = 'left',
        fullWidth = false,
        disabled,
        className = '',
        children,
        ...props
    }, ref) => {
        const baseClasses = [
            'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
            'touch-manipulation min-h-[44px]', // Ensures 44px minimum touch target
        ];

        const variantClasses = {
            primary: [
                'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
                'focus:ring-blue-500',
            ],
            secondary: [
                'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
                'focus:ring-gray-500',
            ],
            outline: [
                'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 active:bg-blue-100',
                'focus:ring-blue-500',
            ],
            ghost: [
                'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100',
                'focus:ring-gray-500',
            ],
            danger: [
                'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
                'focus:ring-red-500',
            ],
        };

        const sizeClasses = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
            xl: 'px-10 py-5 text-xl',
        };

        const classes = [
            ...baseClasses,
            ...variantClasses[variant],
            ...sizeClasses[size],
            fullWidth ? 'w-full' : '',
            className,
        ].join(' ');

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={classes}
                aria-disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                        <span className="sr-only">Loading...</span>
                        {children}
                    </>
                ) : (
                    <>
                        {Icon && iconPosition === 'left' && (
                            <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                        )}
                        {children}
                        {Icon && iconPosition === 'right' && (
                            <Icon className="w-4 h-4 ml-2" aria-hidden="true" />
                        )}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
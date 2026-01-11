'use client';

import React, { forwardRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outlined' | 'filled';
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    hover?: boolean;
    clickable?: boolean;
    children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({
        variant = 'default',
        padding = 'md',
        hover = false,
        clickable = false,
        className = '',
        children,
        ...props
    }, ref) => {
        const baseClasses = [
            'rounded-2xl transition-all duration-200',
        ];

        const variantClasses = {
            default: 'bg-white shadow-sm',
            elevated: 'bg-white shadow-lg',
            outlined: 'bg-white border-2 border-gray-200',
            filled: 'bg-gray-50',
        };

        const paddingClasses = {
            none: '',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
            xl: 'p-10',
        };

        const interactiveClasses = [
            clickable ? 'cursor-pointer hover:shadow-md active:scale-98' : '',
            hover ? 'hover:shadow-md' : '',
        ].join(' ');

        const classes = [
            ...baseClasses,
            ...variantClasses[variant],
            ...paddingClasses[padding],
            interactiveClasses,
            className,
        ].join(' ');

        return (
            <div
                ref={ref}
                className={classes}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export default Card;
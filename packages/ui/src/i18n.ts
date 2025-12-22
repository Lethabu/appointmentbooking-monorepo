import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'af', 'zu'] as const;
export const localePrefix = 'always'; // Default

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales, localePrefix });

// Translation Keys Structure for TypeScript safety
export type BookingTranslations = {
    greeting: string;
    select_service: string;
    select_time: string;
    payment_deposit_required: string;
    confirm_booking: string;
};

import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'af', 'zu'] as const;
export const localePrefix = 'always'; // Default

const navigation = createNavigation({ locales, localePrefix });

// Export navigation functions with proper typing
export const Link = navigation.Link;
export const redirect = navigation.redirect as any;
export const usePathname = navigation.usePathname;
export const useRouter = navigation.useRouter as any;

// Translation Keys Structure for TypeScript safety
export type BookingTranslations = {
    greeting: string;
    select_service: string;
    select_time: string;
    payment_deposit_required: string;
    confirm_booking: string;
};

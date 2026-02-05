import { Metadata } from 'next';

import BookingWizard from '@/components/booking/BookingWizard';

export const metadata: Metadata = {
    title: 'Book Appointment | InStyle Hair Boutique',
    description: 'Book your hair appointment at InStyle Hair Boutique. Quick and easy online booking for all our premium services.',
};

export default function NewBookingPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <BookingWizard />
        </div>
    );
}

export const runtime = 'edge';

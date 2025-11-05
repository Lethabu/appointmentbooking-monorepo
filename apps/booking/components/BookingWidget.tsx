'use client';

import { trackEvent } from '@repo/ui/analytics';

export default function BookingWidget() {
  const handleBookingClick = () => {
    trackEvent('BookingCreated', { 
      timestamp: new Date().toISOString(),
      source: 'booking_widget'
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Book an Appointment</h3>
      <button 
        onClick={handleBookingClick}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Book Now
      </button>
    </div>
  );
}
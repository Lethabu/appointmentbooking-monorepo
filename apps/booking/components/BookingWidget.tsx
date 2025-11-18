'use client';

// Mock analytics function
const trackEvent = (event: string, data: any) => {
  console.log('Analytics:', event, data);
};

interface BookingWidgetProps {
  tenant: string;
  salonId: string;
}

export default function BookingWidget({ tenant, salonId }: BookingWidgetProps) {
  const handleBookingClick = () => {
    trackEvent('BookingCreated', { 
      timestamp: new Date().toISOString(),
      source: 'booking_widget',
      tenant,
      salonId,
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
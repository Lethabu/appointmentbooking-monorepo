import React from 'react';

export interface BookingWidgetProps {
    tenantId: string;
    serviceId?: string;
    onSuccess?: (bookingId: string) => void;
    className?: string;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({
    tenantId,
    serviceId,
    onSuccess,
    className = '',
}) => {
    return (
        <div className={`p-6 border rounded-2xl shadow-sm bg-white ${className}`}>
            <h3 className="text-xl font-bold mb-4">Book an Appointment</h3>
            <p className="text-gray-600 mb-6">
                Ready to schedule your service for tenant <span className="font-mono">{tenantId}</span>?
            </p>

            {/* 
          In a real-world scenario, this would render a date/time picker 
          and call the booking API. For Phase 1, we provide the UI structure.
      */}

            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>Select a Time</span>
                    <span className="font-semibold text-blue-600">Friday, Oct 24</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                        <button
                            key={time}
                            className="py-2 px-3 text-sm font-medium border border-gray-100 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:shadow-sm transition-all text-gray-700"
                            onClick={() => onSuccess?.(`mock-${Date.now()}`)}
                        >
                            {time}
                        </button>
                    ))}
                </div>

                {!serviceId && (
                    <select className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option>Consultation (30 min)</option>
                        <option>Full Service (1 hour)</option>
                        <option>Quick Session (15 min)</option>
                    </select>
                )}

                <button
                    className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                    onClick={() => alert(`Strategic Booking Pulse: Searching experts for tenant ${tenantId}...`)}
                >
                    Schedule Now
                </button>
            </div>

            <p className="mt-4 text-xs text-center text-gray-400">
                Powered by Appointment Booking Cloud
            </p>
        </div>
    );
};

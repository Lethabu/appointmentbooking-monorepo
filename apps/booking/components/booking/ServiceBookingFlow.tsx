'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number; // in cents
  isActive: boolean;
  price_cents?: number; // For compatibility
  duration?: number; // For compatibility
  description?: string; // For compatibility
}

export default function ServiceBookingFlow() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (cents: number) => `R${(cents / 100).toFixed(0)}`;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tenant?slug=instylehairboutique`);
        if (response.ok) {
          const data = await response.json();
          setServices(data.services || []);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookingPayment = async () => {
    if (
      !selectedService ||
      !customerDetails.name ||
      !customerDetails.email ||
      !selectedDate ||
      !selectedTime
    ) {
      alert('Please fill in all details');
      return;
    }

    setIsProcessing(true);

    try {
      // First create the booking
      const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
          name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          serviceId: selectedService.id,
          scheduledTime: `${selectedDate}T${selectedTime}:00Z`,
          notes: `Booking for ${selectedService.name}`,
        }),
      });

      const bookingData = await bookingResponse.json();
      
      if (!bookingData.success) {
        throw new Error('Failed to create booking');
      }

      // Then create PayStack payment
      const response = await fetch('/api/paystack/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedService.price || selectedService.price_cents || 0,
          email: customerDetails.email,
          phone: customerDetails.phone,
          appointmentId: bookingData.appointmentId,
          items: [
            {
              id: selectedService.id,
              name: selectedService.name,
              price_cents: selectedService.price || selectedService.price_cents || 0,
              quantity: 1,
              type: 'service',
            },
          ],
          tenantId: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
          bookingDetails: {
            service_id: selectedService.id,
            customer: customerDetails,
            date: selectedDate,
            time: selectedTime,
          },
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to PayStack
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create payment');
      }
    } catch (error) {
      console.error('Booking payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-purple-600">
          Book Your Service
        </h1>
        <p className="text-gray-600">
          Choose a service and pay securely with PayStack
        </p>
      </div>

      {/* Service Selection */}
      <Card>
        <CardHeader>
          <CardTitle>1. Select Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedService?.id === service.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedService(service)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description || 'Professional hair service'}</p>
                  <Badge variant="outline">{service.durationMinutes || service.duration || 60} minutes</Badge>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-600">
                    {formatPrice(service.price || service.price_cents || 0)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Customer Details */}
      {selectedService && (
        <Card>
          <CardHeader>
            <CardTitle>2. Your Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Full Name"
              value={customerDetails.name}
              onChange={(e) =>
                setCustomerDetails({ ...customerDetails, name: e.target.value })
              }
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={customerDetails.email}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  email: e.target.value,
                })
              }
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={customerDetails.phone}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  phone: e.target.value,
                })
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Date & Time Selection */}
      {selectedService && customerDetails.name && (
        <Card>
          <CardHeader>
            <CardTitle>3. Select Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <select
              className="w-full p-2 border rounded-md"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">Select Time</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
            </select>
          </CardContent>
        </Card>
      )}

      {/* Payment Summary */}
      {selectedService && selectedDate && selectedTime && (
        <Card>
          <CardHeader>
            <CardTitle>4. Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Service:</span>
                <span>{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-purple-600">
                  {formatPrice(selectedService.price || selectedService.price_cents || 0)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleBookingPayment}
              disabled={isProcessing}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
              {isProcessing
                ? 'Processing...'
                : `Pay ${formatPrice(selectedService.price || selectedService.price_cents || 0)} with PayStack`}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

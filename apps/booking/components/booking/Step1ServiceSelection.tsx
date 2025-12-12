// Step 1: Service Selection
// File: apps/booking/components/booking/Step1ServiceSelection.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useBooking, Service, formatPrice, formatDuration, getTotalDuration } from './BookingContext';

export default function Step1ServiceSelection() {
    const { state, addService, removeService } = useBooking();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch services from API
    useEffect(() => {
        async function fetchServices() {
            try {
                setLoading(true);
                const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
                const response = await fetch(`/api/public/services?tenantId=${tenantId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch services');
                }

                const data = await response.json();
                setServices(data.services || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load services');
            } finally {
                setLoading(false);
            }
        }

        fetchServices();
    }, []);

    const isServiceSelected = (serviceId: string) => {
        return state.selectedServices.some(s => s.id === serviceId);
    };

    const handleServiceToggle = (service: Service) => {
        if (isServiceSelected(service.id)) {
            removeService(service.id);
        } else {
            addService(service);
        }
    };

    // Service images mapping (static until DB support)
    const serviceImages: Record<string, string> = {
        'Middle & Side Installation': '/images/services/middle-side.jpg',
        'Maphondo & Lines Installation': '/images/services/maphondo.jpg',
        'Soft Glam Makeup': '/images/services/makeup.jpg',
        'Gel Maphondo Styling': '/images/services/gel-maphondo.jpg',
        'Frontal Ponytail Installation': '/images/services/ponytail.jpg',
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crimson"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-semibold">Error loading services</p>
                <p className="text-red-500 text-sm mt-2">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Services</h2>
            <p className="text-gray-600 mb-6">Choose one or more services for your appointment</p>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {services.map((service) => {
                    const selected = isServiceSelected(service.id);

                    return (
                        <div
                            key={service.id}
                            onClick={() => handleServiceToggle(service)}
                            className={`
                relative border-2 rounded-lg p-4 cursor-pointer transition-all
                ${selected
                                    ? 'border-crimson bg-crimson bg-opacity-5'
                                    : 'border-gray-200 hover:border-crimson hover:shadow-md'
                                }
              `}
                        >
                            {/* Selection Checkmark */}
                            {selected && (
                                <div className="absolute top-4 right-4 w-6 h-6 bg-crimson rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}

                            {/* Service Image (if available) */}
                            {serviceImages[service.name] && (
                                <div className="mb-3 h-32 bg-gray-100 rounded-lg overflow-hidden">
                                    <Image
                                        src={serviceImages[service.name]}
                                        alt={service.name}
                                        width={400}
                                        height={128}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}

                            {/* Service Details */}
                            <h3 className="font-semibold text-lg text-gray-800 mb-2">{service.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{service.description}</p>

                            <div className="flex items-center justify-between">
                                <span className="text-crimson font-bold text-lg">{formatPrice(service.price)}</span>
                                <span className="text-gray-500 text-sm">{formatDuration(service.durationMinutes)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Selection Summary */}
            {state.selectedServices.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Your Selection</h3>

                    <div className="space-y-2 mb-4">
                        {state.selectedServices.map((service) => (
                            <div key={service.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">{service.name}</span>
                                <span className="text-gray-600">{formatPrice(service.price)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-300 pt-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-800">Total Duration:</span>
                            <span className="text-gray-700">{formatDuration(getTotalDuration(state.selectedServices))}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-800">Total Price:</span>
                            <span className="text-crimson font-bold text-xl">{formatPrice(state.totalPrice)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {state.selectedServices.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <p className="text-blue-600">Please select at least one service to continue</p>
                </div>
            )}
        </div>
    );
}

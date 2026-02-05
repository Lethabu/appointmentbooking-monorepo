'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';

import MultiStepBooking from './MultiStepBooking';

interface Service {
    id: string;
    name: string;
    price_cents: number;
}

export default function ServiceBookingFlow() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClientComponentClient();

    useEffect(() => {
        async function fetchServices() {
            try {
                // Fetch services for the instyle tenant
                const { data, error } = await supabase
                    .from('services')
                    .select('id, name, price')
                    .eq('tenant_id', 'instyle'); // Assuming 'instyle' is the tenant slug

                if (error) throw error;
                if (data) {
                    // Transform data to match Service interface expectations
                    const transformedData = data.map(service => ({
                        ...service,
                        price_cents: service.price // price is already in cents in database
                    }));
                    setServices(transformedData);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchServices();
    }, [supabase]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading services...</div>
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">No services available at this time.</div>
            </div>
        );
    }

    return (
        <MultiStepBooking
            services={services}
            salonId="instyle-salon" // This would need to be fetched properly
            tenant="instylehairboutique"
            salonName="InStyle Hair Boutique"
        />
    );
}

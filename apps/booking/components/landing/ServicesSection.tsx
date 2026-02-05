import { Clock } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface Service {
    id: string;
    name: string;
    description: string;
    price: number; // in cents
    duration_minutes: number;
}

interface ServicesSectionProps {
    services: Service[];
    onNavigate: (section: string) => void;
}

/**
 * Services section component displaying available hair services
 * Features service cards with pricing and booking CTAs
 */
export const ServicesSection: React.FC<ServicesSectionProps> = ({
    services,
    onNavigate,
}) => {
    /**
     * Get service image based on service name
     * @param name - Service name to match against patterns
     * @returns Image URL for the service
     */
    const getServiceImage = (name: string): string => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('install')) {
            return "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80";
        }
        if (lowerName.includes('maphondo') || lowerName.includes('braid')) {
            return "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80";
        }
        if (lowerName.includes('makeup') || lowerName.includes('glam')) {
            return "https://images.unsplash.com/photo-1487412947132-232984567455?auto=format&fit=crop&w=800&q=80";
        }
        if (lowerName.includes('ponytail')) {
            return "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80";
        }
        return "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80";
    };

    /**
     * Get service badge based on service name
     * @param name - Service name to match against patterns
     * @returns Badge text or null
     */
    const getServiceBadge = (name: string): string | null => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('middle') || lowerName.includes('side')) {
            return "Popular";
        }
        if (lowerName.includes('maphondo')) {
            return "Signature";
        }
        if (lowerName.includes('frontal')) {
            return "Premium";
        }
        return null;
    };

    /**
     * Format service price from cents to Rands
     * @param priceInCents - Price in cents
     * @returns Formatted price string
     */
    const formatPrice = (priceInCents: number): string => {
        return `R${(priceInCents / 100).toFixed(0)}`;
    };

    return (
        <section id="services" className="py-20 bg-white" role="region" aria-labelledby="services-heading">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 id="services-heading" className="text-3xl md:text-4xl font-bold font-serif mb-4 text-gray-900">
                        Our Premium Services
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Professional hair treatments and styling services tailored to your unique needs.
                    </p>
                </div>

                {/* Services grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const badge = getServiceBadge(service.name);
                        const imageUrl = getServiceImage(service.name);

                        return (
                            <article
                                key={service.id || index}
                                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                            >
                                {/* Service image */}
                                <div className="relative h-64 overflow-hidden">
                                    {badge && (
                                        <div className="absolute top-4 right-4 z-10 bg-[#1B1B1B] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            {badge}
                                        </div>
                                    )}
                                    <Image
                                        src={imageUrl}
                                        alt={`${service.name} service illustration`}
                                        width={500}
                                        height={400}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Service details */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-gray-900">{service.name}</h3>
                                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{service.description}</p>

                                    {/* Price and duration */}
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-2xl font-bold text-crimson-primary">
                                            {formatPrice(service.price)}
                                        </span>
                                        <div className="flex items-center gap-1 text-amber-500 text-sm">
                                            <Clock className="w-4 h-4" aria-hidden="true" />
                                            <span className="font-medium">{service.duration_minutes}m</span>
                                        </div>
                                    </div>

                                    {/* Booking CTA */}
                                    <button
                                        onClick={() => onNavigate('booking')}
                                        className="w-full py-3 rounded-xl font-semibold border-2 border-crimson-primary text-crimson-primary hover:bg-crimson-primary hover:text-white transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-crimson-primary focus:ring-opacity-50"
                                        aria-label={`Book ${service.name} appointment`}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
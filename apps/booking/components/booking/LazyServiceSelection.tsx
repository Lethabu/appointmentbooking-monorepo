// Lazy-loaded service selection component
"use client";

import { motion } from 'framer-motion';
import { Clock, Check } from 'lucide-react';

// Optimized icons - only import what's needed
import { Scissors, Palette, Sparkles } from 'lucide-react';
import { memo } from 'react';

interface Service {
    id: number;
    name: string;
    duration: string;
    price: number;
    description: string;
    icon: any;
    popular?: boolean;
}

interface ServiceSelectionProps {
    data: {
        selectedService: Service | null;
    };
    onUpdate: (updates: any) => void;
}

// Memoize for performance
const ServiceCard = memo(({ service, isSelected, onSelect }: {
    service: Service;
    isSelected: boolean;
    onSelect: (service: Service) => void;
}) => (
    <motion.div
        onClick={() => onSelect(service)}
        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${isSelected
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
    >
        {service.popular && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Popular
            </div>
        )}
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <service.icon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
                <h3 className="font-semibold text-lg text-gray-900">
                    {service.name}
                </h3>
                <p className="text-sm text-gray-600">{service.description}</p>
            </div>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-purple-600">
                    R{service.price}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {service.duration}
                </span>
            </div>
            {isSelected && (
                <motion.div
                    className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Check className="w-4 h-4 text-white" />
                </motion.div>
            )}
        </div>
    </motion.div>
));

ServiceCard.displayName = 'ServiceCard';

export function ServiceSelection({ data, onUpdate }: ServiceSelectionProps) {
    const services: Service[] = [
        {
            id: 1,
            name: 'Premium Cut & Style',
            duration: '60 min',
            price: 250,
            description: 'Professional haircut with styling',
            icon: Scissors,
            popular: true,
        },
        {
            id: 2,
            name: 'Color & Highlights',
            duration: '120 min',
            price: 450,
            description: 'Full color service with highlights',
            icon: Palette,
        },
        {
            id: 3,
            name: 'Keratin Treatment',
            duration: '150 min',
            price: 380,
            description: 'Smoothing treatment',
            icon: Sparkles,
        },
    ];

    const handleServiceSelect = (service: Service) => {
        onUpdate({ selectedService: service });
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
                <ServiceCard
                    key={service.id}
                    service={service}
                    isSelected={data.selectedService?.id === service.id}
                    onSelect={handleServiceSelect}
                />
            ))}
        </div>
    );
}
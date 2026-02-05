// Enhanced Service Selection with Dynamic Pricing and Advanced Features
// File: apps/booking/components/booking/EnhancedServiceSelection.tsx

'use client';

import {
    Star,
    Clock,
    Users,
    Heart,
    Zap,
    Shield,
    Sparkles,
    Calendar,
    Filter,
    Search,
    Plus,
    Minus,
    Info
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { useBooking, Service , formatPrice, formatDuration, getTotalDuration } from './BookingContext';

import { useToast } from '@/hooks/use-toast';

// Local enhanced Service interface for display purposes
interface EnhancedService {
    id: string;
    name: string;
    description: string;
    shortDescription?: string;
    price: number;
    priceType?: string;
    durationMinutes: number;
    setupTimeMinutes?: number;
    cleanupTimeMinutes?: number;
    category: string;
    subcategory?: string;
    serviceType?: string;
    isPackage?: boolean;
    packageIncludes?: string[];
    pricingTiers?: Array<{ name: string; price: number; minQuantity?: number; maxQuantity?: number; description?: string }>;
    requiresDeposit?: boolean;
    depositPercentage?: number;
    maxClientsPerSession?: number;
    popularityScore?: number;
    imageUrls?: string[];
    isActive?: boolean;
    isFeatured?: boolean;
    tags?: string[];
    availableStaff?: Array<{ id: string; name: string; role: string; rating: number; specialties: string[]; profileImageUrl?: string }>;
}

interface ServiceCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    services: Service[];
}

// Enhanced service card with dynamic pricing and features
function ServiceCard({
    service,
    isSelected,
    onToggle,
    quantity,
    onQuantityChange
}: {
    service: EnhancedService;
    isSelected: boolean;
    onToggle: (service: EnhancedService) => void;
    quantity: number;
    onQuantityChange: (serviceId: string, quantity: number) => void;
}) {
    const { toast } = useToast();

    const handleToggle = () => {
        if (service.maxClientsPerSession === 1 && isSelected) {
            onToggle(service);
        } else if (!isSelected) {
            onToggle(service);
        }
    };

    const handleQuantityChange = (delta: number) => {
        const maxClients = service.maxClientsPerSession ?? 10;
        const newQuantity = Math.max(1, Math.min(maxClients, quantity + delta));
        onQuantityChange(service.id, newQuantity);
    };

    const getEffectivePrice = () => {
        if (service.priceType === 'tiered' && service.pricingTiers.length > 0) {
            const tier = service.pricingTiers.find(t =>
                (!t.minQuantity || quantity >= t.minQuantity) &&
                (!t.maxQuantity || quantity <= t.maxQuantity)
            );
            return tier?.price || service.price;
        }
        return service.price * quantity;
    };

    const totalDuration = getTotalDuration([{ ...service, durationMinutes: service.durationMinutes }]);
    const isAvailable = service.isActive && service.availableStaff.length > 0;

    return (
        <div className={`
            relative bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg
            ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'}
            ${!isAvailable ? 'opacity-60' : ''}
        `}>
            {/* Featured Badge */}
            {service.isFeatured && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Popular
                </div>
            )}

            {/* Package Badge */}
            {service.isPackage && (
                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Package
                </div>
            )}

            <div className="p-6">
                {/* Service Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{service.shortDescription}</p>

                        {/* Duration and Setup */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDuration(service.durationMinutes)}
                            </div>
                            {service.setupTimeMinutes > 0 && (
                                <div className="flex items-center gap-1">
                                    <Zap className="w-4 h-4" />
                                    +{formatDuration(service.setupTimeMinutes)} setup
                                </div>
                            )}
                            {service.cleanupTimeMinutes > 0 && (
                                <div className="flex items-center gap-1">
                                    <Shield className="w-4 h-4" />
                                    +{formatDuration(service.cleanupTimeMinutes)} cleanup
                                </div>
                            )}
                        </div>

                        {/* Package Includes */}
                        {service.isPackage && service.packageIncludes.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Package Includes:</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    {service.packageIncludes.slice(0, 3).map((item, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                                            {item}
                                        </li>
                                    ))}
                                    {service.packageIncludes.length > 3 && (
                                        <li className="text-indigo-600 font-medium">
                                            +{service.packageIncludes.length - 3} more items
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Available Staff */}
                        {service.availableStaff.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Available Staff:</h4>
                                <div className="flex items-center gap-2">
                                    {service.availableStaff.slice(0, 3).map((staff) => (
                                        <div key={staff.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                            {staff.profileImageUrl ? (
                                                <img
                                                    src={staff.profileImageUrl}
                                                    alt={staff.name}
                                                    className="w-6 h-6 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-medium text-indigo-600">
                                                        {staff.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-xs font-medium text-gray-700">{staff.name}</div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                    <span className="text-xs text-gray-500">{staff.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {service.availableStaff.length > 3 && (
                                        <span className="text-xs text-gray-500">
                                            +{service.availableStaff.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Price and Selection */}
                    <div className="text-right ml-6">
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                            {formatPrice(getEffectivePrice())}
                        </div>
                        {service.priceType === 'hourly' && (
                            <div className="text-xs text-gray-500 mb-2">per hour</div>
                        )}
                        {service.priceType === 'tiered' && service.pricingTiers.length > 0 && (
                            <div className="text-xs text-gray-500 mb-2">
                                {service.pricingTiers.length} pricing tiers
                            </div>
                        )}

                        {/* Quantity Selector */}
                        {service.maxClientsPerSession > 1 && (
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= service.maxClientsPerSession}
                                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Selection Toggle */}
                        <button
                            onClick={handleToggle}
                            disabled={!isAvailable}
                            className={`
                                px-4 py-2 rounded-lg font-medium text-sm transition-all
                                ${isSelected
                                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                                    : isAvailable
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                }
                            `}
                        >
                            {isSelected ? 'Selected' : 'Add Service'}
                        </button>
                    </div>
                </div>

                {/* Service Tags */}
                {service.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {service.tags.slice(0, 4).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Deposit Notice */}
                {service.requiresDeposit && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Info className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                            Requires {service.depositPercentage}% deposit ({formatPrice(service.price * service.depositPercentage / 100)})
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

// Category filter component
function CategoryFilter({
    categories,
    selectedCategory,
    onCategoryChange
}: {
    categories: ServiceCategory[];
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
}) {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => onCategoryChange('all')}
                    className={`
                        px-4 py-2 rounded-lg font-medium transition-all
                        ${selectedCategory === 'all'
                            ? 'bg-indigo-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                    `}
                >
                    All Services
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        className={`
                            px-4 py-2 rounded-lg font-medium transition-all
                            ${selectedCategory === category.id
                                ? 'bg-indigo-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                        `}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Search component
function ServiceSearch({
    searchTerm,
    onSearchChange
}: {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}) {
    return (
        <div className="mb-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>
        </div>
    );
}

// Main component
export default function EnhancedServiceSelection() {
    const { state, setSelectedServices, addService, removeService } = useBooking();
    const { toast } = useToast();

    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    // Load services from API
    useEffect(() => {
        const loadServices = async () => {
            try {
                setLoading(true);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data - replace with actual API call
                const mockCategories: ServiceCategory[] = [
                    {
                        id: 'hair-styling',
                        name: 'Hair Styling',
                        description: 'Professional hair styling services',
                        icon: '✂️',
                        services: [
                            {
                                id: 'haircut-basic',
                                name: 'Basic Haircut',
                                description: 'Professional haircut with styling consultation',
                                shortDescription: 'Professional haircut with consultation',
                                price: 15000,
                                priceType: 'fixed',
                                durationMinutes: 60,
                                setupTimeMinutes: 10,
                                cleanupTimeMinutes: 5,
                                category: 'Hair Styling',
                                subcategory: 'Basic Cuts',
                                serviceType: 'appointment',
                                isPackage: false,
                                packageIncludes: [],
                                pricingTiers: [],
                                requiresDeposit: false,
                                depositPercentage: 0,
                                maxClientsPerSession: 1,
                                popularityScore: 95,
                                imageUrls: [],
                                isActive: true,
                                isFeatured: true,
                                tags: ['Popular', 'Basic', 'Consultation'],
                                availableStaff: [
                                    {
                                        id: 'staff-1',
                                        name: 'Sarah Johnson',
                                        role: 'Senior Stylist',
                                        rating: 4.8,
                                        specialties: ['Color', 'Cuts', 'Styling']
                                    }
                                ]
                            },
                            {
                                id: 'haircut-premium',
                                name: 'Premium Haircut & Style',
                                description: 'Luxury haircut with premium styling products',
                                shortDescription: 'Luxury haircut with premium products',
                                price: 25000,
                                priceType: 'fixed',
                                durationMinutes: 90,
                                setupTimeMinutes: 15,
                                cleanupTimeMinutes: 10,
                                category: 'Hair Styling',
                                subcategory: 'Premium Cuts',
                                serviceType: 'appointment',
                                isPackage: false,
                                packageIncludes: [],
                                pricingTiers: [
                                    {
                                        name: 'Standard',
                                        price: 25000,
                                        description: 'Premium haircut with styling'
                                    },
                                    {
                                        name: 'VIP',
                                        price: 35000,
                                        minQuantity: 1,
                                        description: 'VIP service with consultation'
                                    }
                                ],
                                requiresDeposit: true,
                                depositPercentage: 25,
                                maxClientsPerSession: 2,
                                popularityScore: 88,
                                imageUrls: [],
                                isActive: true,
                                isFeatured: true,
                                tags: ['Premium', 'VIP', 'Luxury'],
                                availableStaff: [
                                    {
                                        id: 'staff-2',
                                        name: 'Michael Chen',
                                        role: 'Master Stylist',
                                        rating: 4.9,
                                        specialties: ['Premium Cuts', 'Color', 'Styling']
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'packages',
                        name: 'Service Packages',
                        description: 'Bundled services for complete experiences',
                        icon: '📦',
                        services: [
                            {
                                id: 'bridal-package',
                                name: 'Bridal Beauty Package',
                                description: 'Complete bridal beauty package including hair, makeup, and skincare',
                                shortDescription: 'Complete bridal beauty experience',
                                price: 50000,
                                priceType: 'package',
                                durationMinutes: 240,
                                setupTimeMinutes: 30,
                                cleanupTimeMinutes: 15,
                                category: 'Packages',
                                subcategory: 'Bridal',
                                serviceType: 'package',
                                isPackage: true,
                                packageIncludes: [
                                    'Bridal Hair Styling',
                                    'Professional Makeup Application',
                                    'Skincare Treatment',
                                    'Trial Session',
                                    'Touch-up Kit'
                                ],
                                pricingTiers: [],
                                requiresDeposit: true,
                                depositPercentage: 50,
                                maxClientsPerSession: 1,
                                popularityScore: 92,
                                imageUrls: [],
                                isActive: true,
                                isFeatured: true,
                                tags: ['Bridal', 'Complete', 'Premium'],
                                availableStaff: [
                                    {
                                        id: 'staff-3',
                                        name: 'Emma Williams',
                                        role: 'Bridal Specialist',
                                        rating: 4.9,
                                        specialties: ['Bridal', 'Makeup', 'Hair']
                                    }
                                ]
                            }
                        ]
                    }
                ];

                setCategories(mockCategories);
            } catch (error) {
                toast({
                    title: "Error loading services",
                    description: "Unable to load services. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, [toast]);

    const handleToggleService = (service: EnhancedService) => {
        const isSelected = state.selectedServices.some(s => s.id === service.id);

        if (isSelected) {
            removeService(service.id);
            toast({
                title: "Service removed",
                description: `${service.name} removed from booking`,
            });
        } else {
            addService(service as Service);
            toast({
                title: "Service added",
                description: `${service.name} added to booking`,
            });
        }
    };

    const handleQuantityChange = (serviceId: string, quantity: number) => {
        setQuantities(prev => ({ ...prev, [serviceId]: quantity }));
    };

    const getServiceQuantity = (serviceId: string) => {
        return quantities[serviceId] || 1;
    };

    // Filter services based on category and search term
    const getFilteredServices = () => {
        let services: EnhancedService[] = [];

        if (selectedCategory === 'all') {
            services = categories.flatMap(cat => cat.services);
        } else {
            const category = categories.find(cat => cat.id === selectedCategory);
            services = category?.services || [];
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            services = services.filter(service =>
                service.name.toLowerCase().includes(term) ||
                service.description.toLowerCase().includes(term) ||
                service.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }

        return services;
    };

    const filteredServices = getFilteredServices();
    const selectedServices = state.selectedServices;
    const totalPrice = selectedServices.reduce((sum, service) => {
        const quantity = getServiceQuantity(service.id);
        return sum + (service.price * quantity);
    }, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Services</h2>
                <p className="text-gray-600">
                    Choose from our range of professional services with dynamic pricing and real-time availability
                </p>
            </div>

            {/* Search */}
            <ServiceSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

            {/* Category Filter */}
            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            {/* Service Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredServices.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        isSelected={selectedServices.some(s => s.id === service.id)}
                        onToggle={handleToggleService}
                        quantity={getServiceQuantity(service.id)}
                        onQuantityChange={handleQuantityChange}
                    />
                ))}
            </div>

            {/* No results */}
            {filteredServices.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Search className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                    <p className="text-gray-600">
                        Try adjusting your search terms or category filter
                    </p>
                </div>
            )}

            {/* Selection Summary */}
            {selectedServices.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-xl p-6 border border-indigo-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Services Summary</h3>
                    <div className="space-y-3">
                        {selectedServices.map((service) => {
                            const quantity = getServiceQuantity(service.id);
                            return (
                                <div key={service.id} className="flex justify-between items-center">
                                    <div>
                                        <span className="font-medium text-gray-900">{service.name}</span>
                                        {quantity > 1 && (
                                            <span className="text-sm text-gray-500 ml-2">×{quantity}</span>
                                        )}
                                        <div className="text-sm text-gray-500">
                                            {formatDuration(service.durationMinutes)} • {service.category}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-900">
                                            {formatPrice(service.price * quantity)}
                                        </div>
                                        <button
                                            onClick={() => handleToggleService(service)}
                                            className="text-sm text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="border-t border-indigo-200 mt-4 pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-indigo-600">
                                {formatPrice(totalPrice)}
                            </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            Total duration: {formatDuration(getTotalDuration(selectedServices))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
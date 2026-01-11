/**
 * SEO Configuration for appointmentbooking.co.za
 * Comprehensive SEO optimization for South African appointment booking market
 */

export interface SEOConfig {
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
    openGraph: {
        title: string;
        description: string;
        url: string;
        image: string;
        type: string;
        siteName: string;
        locale: string;
    };
    twitter: {
        card: string;
        site: string;
        creator: string;
    };
    localBusiness: {
        name: string;
        address: {
            street: string;
            city: string;
            province: string;
            postalCode: string;
            country: string;
        };
        geo: {
            latitude: number;
            longitude: number;
        };
        phone: string;
        email: string;
        url: string;
        businessType: string;
        openingHours: string[];
        priceRange: string;
        paymentAccepted: string[];
        currencies: string[];
    };
    serviceArea: {
        cities: string[];
        regions: string[];
    };
}

// South African Business Schema Configuration
export const SA_BUSINESS_SCHEMA = {
    localBusiness: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Appointment Booking Platform",
        "description": "South Africa's leading appointment booking platform for beauty, wellness, and professional services",
        "url": "https://appointmentbooking.co.za",
        "telephone": "+27-11-123-4567",
        "email": "info@appointmentbooking.co.za",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Business Street",
            "addressLocality": "Johannesburg",
            "addressRegion": "Gauteng",
            "postalCode": "2000",
            "addressCountry": "ZA"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -26.2041,
            "longitude": 28.0473
        },
        "areaServed": [
            {
                "@type": "City",
                "name": "Johannesburg"
            },
            {
                "@type": "City",
                "name": "Cape Town"
            },
            {
                "@type": "City",
                "name": "Durban"
            },
            {
                "@type": "City",
                "name": "Pretoria"
            }
        ],
        "serviceType": [
            "Hair Salon Appointments",
            "Beauty Treatments",
            "Wellness Services",
            "Professional Consultations"
        ],
        "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "PayFast", "Yoco", "Paystack"],
        "currencies": "ZAR",
        "openingHours": "Mo-Su 08:00-18:00"
    },
    organization: {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Appointment Booking South Africa",
        "url": "https://appointmentbooking.co.za",
        "logo": "https://appointmentbooking.co.za/logo.png",
        "sameAs": [
            "https://www.facebook.com/appointmentbooking.co.za",
            "https://www.instagram.com/appointmentbooking.co.za",
            "https://www.linkedin.com/company/appointmentbooking-co-za"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+27-11-123-4567",
            "contactType": "Customer Service",
            "availableLanguage": ["English", "Afrikaans", "Zulu"]
        }
    }
};

// Location-specific SEO configurations
export const CITY_CONFIGS: Record<string, SEOConfig> = {
    "cape-town": {
        title: "Cape Town Hair Salon Appointments | Book Beauty Services Online",
        description: "Book hair salon appointments in Cape Town online. Find the best hair salons, beauty treatments, and wellness services. Quick, easy booking with instant confirmation.",
        keywords: [
            "cape town hair salon appointments",
            "cape town beauty appointments",
            "cape town hair salon bookings",
            "cape town beauty services online",
            "cape town wellness appointments"
        ],
        canonical: "https://appointmentbooking.co.za/locations/cape-town",
        openGraph: {
            title: "Cape Town Hair Salon Appointments | Book Beauty Services Online",
            description: "Book hair salon appointments in Cape Town online. Find the best hair salons, beauty treatments, and wellness services.",
            url: "https://appointmentbooking.co.za/locations/cape-town",
            image: "https://appointmentbooking.co.za/images/cape-town-og-image.jpg",
            type: "website",
            siteName: "Appointment Booking South Africa",
            locale: "en_ZA"
        },
        twitter: {
            card: "summary_large_image",
            site: "@appointmentbookingsa",
            creator: "@appointmentbookingsa"
        },
        localBusiness: {
            name: "Appointment Booking Cape Town",
            address: {
                street: "123 V&A Waterfront",
                city: "Cape Town",
                province: "Western Cape",
                postalCode: "8002",
                country: "ZA"
            },
            geo: {
                latitude: -33.9249,
                longitude: 18.4241
            },
            phone: "+27-21-123-4567",
            email: "capetown@appointmentbooking.co.za",
            url: "https://appointmentbooking.co.za/locations/cape-town",
            businessType: "Appointment Booking Service",
            openingHours: ["Mo-Su 08:00-18:00"],
            priceRange: "$$",
            paymentAccepted: ["Cash", "Credit Card", "Debit Card", "PayFast", "Yoco", "Paystack"],
            currencies: ["ZAR"]
        },
        serviceArea: {
            cities: ["Cape Town", "Stellenbosch", "Paarl", "Somerset West"],
            regions: ["Western Cape", "Cape Town Metro"]
        }
    },
    "johannesburg": {
        title: "Johannesburg Hair Salon Appointments | Book Beauty Services Online",
        description: "Book hair salon appointments in Johannesburg online. Find the best hair salons, beauty treatments, and wellness services. Quick, easy booking with instant confirmation.",
        keywords: [
            "johannesburg hair salon appointments",
            "johannesburg beauty appointments",
            "johannesburg hair salon bookings",
            "johannesburg beauty services online",
            "johannesburg wellness appointments"
        ],
        canonical: "https://appointmentbooking.co.za/locations/johannesburg",
        openGraph: {
            title: "Johannesburg Hair Salon Appointments | Book Beauty Services Online",
            description: "Book hair salon appointments in Johannesburg online. Find the best hair salons, beauty treatments, and wellness services.",
            url: "https://appointmentbooking.co.za/locations/johannesburg",
            image: "https://appointmentbooking.co.za/images/johannesburg-og-image.jpg",
            type: "website",
            siteName: "Appointment Booking South Africa",
            locale: "en_ZA"
        },
        twitter: {
            card: "summary_large_image",
            site: "@appointmentbookingsa",
            creator: "@appointmentbookingsa"
        },
        localBusiness: {
            name: "Appointment Booking Johannesburg",
            address: {
                street: "456 Sandton City",
                city: "Johannesburg",
                province: "Gauteng",
                postalCode: "2196",
                country: "ZA"
            },
            geo: {
                latitude: -26.2041,
                longitude: 28.0473
            },
            phone: "+27-11-123-4567",
            email: "johannesburg@appointmentbooking.co.za",
            url: "https://appointmentbooking.co.za/locations/johannesburg",
            businessType: "Appointment Booking Service",
            openingHours: ["Mo-Su 08:00-18:00"],
            priceRange: "$$",
            paymentAccepted: ["Cash", "Credit Card", "Debit Card", "PayFast", "Yoco", "Paystack"],
            currencies: ["ZAR"]
        },
        serviceArea: {
            cities: ["Johannesburg", "Sandton", "Pretoria", "Randburg", "Roodepoort"],
            regions: ["Gauteng", "Johannesburg Metro", "Pretoria Metro"]
        }
    },
    "durban": {
        title: "Durban Hair Salon Appointments | Book Beauty Services Online",
        description: "Book hair salon appointments in Durban online. Find the best hair salons, beauty treatments, and wellness services. Quick, easy booking with instant confirmation.",
        keywords: [
            "durban hair salon appointments",
            "durban beauty appointments",
            "durban hair salon bookings",
            "durban beauty services online",
            "durban wellness appointments"
        ],
        canonical: "https://appointmentbooking.co.za/locations/durban",
        openGraph: {
            title: "Durban Hair Salon Appointments | Book Beauty Services Online",
            description: "Book hair salon appointments in Durban online. Find the best hair salons, beauty treatments, and wellness services.",
            url: "https://appointmentbooking.co.za/locations/durban",
            image: "https://appointmentbooking.co.za/images/durban-og-image.jpg",
            type: "website",
            siteName: "Appointment Booking South Africa",
            locale: "en_ZA"
        },
        twitter: {
            card: "summary_large_image",
            site: "@appointmentbookingsa",
            creator: "@appointmentbookingsa"
        },
        localBusiness: {
            name: "Appointment Booking Durban",
            address: {
                street: "789 Umhlanga Rocks",
                city: "Durban",
                province: "KwaZulu-Natal",
                postalCode: "4320",
                country: "ZA"
            },
            geo: {
                latitude: -29.8587,
                longitude: 31.0218
            },
            phone: "+27-31-123-4567",
            email: "durban@appointmentbooking.co.za",
            url: "https://appointmentbooking.co.za/locations/durban",
            businessType: "Appointment Booking Service",
            openingHours: ["Mo-Su 08:00-18:00"],
            priceRange: "$$",
            paymentAccepted: ["Cash", "Credit Card", "Debit Card", "PayFast", "Yoco", "Paystack"],
            currencies: ["ZAR"]
        },
        serviceArea: {
            cities: ["Durban", "Pietermaritzburg", "Newcastle", "Richards Bay"],
            regions: ["KwaZulu-Natal", "Durban Metro"]
        }
    },
    "pretoria": {
        title: "Pretoria Hair Salon Appointments | Book Beauty Services Online",
        description: "Book hair salon appointments in Pretoria online. Find the best hair salons, beauty treatments, and wellness services. Quick, easy booking with instant confirmation.",
        keywords: [
            "pretoria hair salon appointments",
            "pretoria beauty appointments",
            "pretoria hair salon bookings",
            "pretoria beauty services online",
            "pretoria wellness appointments"
        ],
        canonical: "https://appointmentbooking.co.za/locations/pretoria",
        openGraph: {
            title: "Pretoria Hair Salon Appointments | Book Beauty Services Online",
            description: "Book hair salon appointments in Pretoria online. Find the best hair salons, beauty treatments, and wellness services.",
            url: "https://appointmentbooking.co.za/locations/pretoria",
            image: "https://appointmentbooking.co.za/images/pretoria-og-image.jpg",
            type: "website",
            siteName: "Appointment Booking South Africa",
            locale: "en_ZA"
        },
        twitter: {
            card: "summary_large_image",
            site: "@appointmentbookingsa",
            creator: "@appointmentbookingsa"
        },
        localBusiness: {
            name: "Appointment Booking Pretoria",
            address: {
                street: "321 Menlyn Park",
                city: "Pretoria",
                province: "Gauteng",
                postalCode: "0081",
                country: "ZA"
            },
            geo: {
                latitude: -25.7479,
                longitude: 28.2293
            },
            phone: "+27-12-123-4567",
            email: "pretoria@appointmentbooking.co.za",
            url: "https://appointmentbooking.co.za/locations/pretoria",
            businessType: "Appointment Booking Service",
            openingHours: ["Mo-Su 08:00-18:00"],
            priceRange: "$$",
            paymentAccepted: ["Cash", "Credit Card", "Debit Card", "PayFast", "Yoco", "Paystack"],
            currencies: ["ZAR"]
        },
        serviceArea: {
            cities: ["Pretoria", "Centurion", "Hatfield", "Menlyn", "Brooklyn"],
            regions: ["Gauteng", "Pretoria Metro"]
        }
    }
};

// Service-specific SEO configurations
export const SERVICE_CONFIGS = {
    "hair-salon": {
        title: "Hair Salon Appointments | Book Your Hair Cut & Styling Online",
        description: "Book hair salon appointments online. Choose from professional hair cuts, styling, coloring, and treatments. Find top-rated salons near you.",
        keywords: [
            "hair salon appointments",
            "hair cut booking",
            "hair styling appointments",
            "hair color appointments",
            "hair treatment booking"
        ]
    },
    "beauty-treatments": {
        title: "Beauty Treatment Appointments | Book Facials, Manicures & More",
        description: "Book beauty treatment appointments online. Facials, manicures, pedicures, massages and more. Professional beauty services at your fingertips.",
        keywords: [
            "beauty treatment appointments",
            "facial appointments",
            "manicure booking",
            "pedicure appointments",
            "massage therapy booking"
        ]
    },
    "wellness-services": {
        title: "Wellness Service Appointments | Book Health & Beauty Services",
        description: "Book wellness service appointments online. Health consultations, therapy sessions, and holistic treatments. Professional wellness services.",
        keywords: [
            "wellness service appointments",
            "therapy appointments",
            "health consultation booking",
            "holistic treatment appointments",
            "wellness center booking"
        ]
    }
};

const SEO_CONFIG = {
    SA_BUSINESS_SCHEMA,
    CITY_CONFIGS,
    SERVICE_CONFIGS
};

export default SEO_CONFIG;
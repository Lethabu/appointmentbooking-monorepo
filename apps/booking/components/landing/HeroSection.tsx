import React from 'react';
import { Calendar, ShoppingBag } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

interface HeroSectionProps {
    onNavigate: (section: string) => void;
}

/**
 * Hero section component for the InStyle landing page
 * Features the main call-to-action and value proposition
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
    return (
        <section id="home" className="relative pt-20 pb-32 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-3xl bg-crimson-100 opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-3xl bg-neutral-200 opacity-20"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                {/* Main headline */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-6 leading-tight text-gray-900">
                    Transform Your Look With <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-crimson)] to-[var(--neutral-900)]">
                        Premium Hair Services
                    </span>
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Experience the finest hair treatments, extensions, and styling from South Africa&apos;s leading boutique.
                    Where elegance meets expertise.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    {/* Primary CTA - Book Appointment */}
                    <button
                        onClick={() => onNavigate('booking')}
                        className="px-8 py-4 rounded-full text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2 bg-crimson-primary hover:bg-crimson-dark focus:outline-none focus:ring-2 focus:ring-crimson-primary focus:ring-opacity-50"
                        aria-label="Book your appointment now"
                    >
                        <Calendar className="w-5 h-5" aria-hidden="true" />
                        Book Appointment
                    </button>

                    {/* Secondary CTA - Shop Products */}
                    <button
                        onClick={() => onNavigate('products')}
                        className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-crimson-primary text-crimson-primary hover:bg-crimson-primary hover:text-white transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-crimson-primary focus:ring-opacity-50"
                        aria-label="Shop premium hair products"
                    >
                        <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                        Shop Products
                    </button>

                    {/* WhatsApp CTA */}
                    <a
                        href="https://wa.me/27699171527"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-opacity-50"
                        aria-label="Chat with us on WhatsApp"
                    >
                        <FaWhatsapp className="w-5 h-5" aria-hidden="true" />
                        Chat on WhatsApp
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
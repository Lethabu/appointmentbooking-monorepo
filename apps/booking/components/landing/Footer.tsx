import React from 'react';
import Image from 'next/image';
import {
    MapPin,
    Phone,
    Mail,
    Instagram,
    Facebook
} from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

interface FooterProps {
    onNavigate: (section: string) => void;
}

/**
 * Footer component for the InStyle landing page
 * Contains contact information, quick links, and social media
 */
export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    const quickLinks = ['Home', 'Services', 'Products', 'Gallery', 'Book Now'];
    const services = ['Installations', 'Styling', 'Coloring', 'Treatments', 'Braiding'];
    const socialIcons = [
        { Icon: Instagram, href: '#', label: 'Instagram' },
        { Icon: Facebook, href: '#', label: 'Facebook' },
        { Icon: FaTiktok, href: '#', label: 'TikTok' }
    ];

    return (
        <footer className="bg-[var(--neutral-900)] text-white pt-20 pb-10" role="contentinfo">
            <div className="container mx-auto px-4">
                {/* Footer content grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8">
                                <Image
                                    src="/logos/instyle-logo.png"
                                    alt="InStyle Logo"
                                    fill
                                    className="object-contain brightness-0 invert"
                                />
                            </div>
                            <span className="text-xl font-bold font-serif">InStyle</span>
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed">
                            Premium hair services and products in South Africa. Transforming looks with expertise and care since 2023.
                        </p>

                        {/* Social media links */}
                        <div className="flex gap-4">
                            {socialIcons.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-crimson-primary transition-colors focus:outline-none focus:ring-2 focus:ring-crimson-primary focus:ring-opacity-50"
                                    aria-label={`Follow us on ${label}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Icon className="w-5 h-5" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            {quickLinks.map((item) => (
                                <li key={item}>
                                    <button
                                        onClick={() => onNavigate(item.toLowerCase().replace(' ', ''))}
                                        className="hover:text-crimson-primary transition-colors focus:outline-none focus:text-crimson-primary"
                                    >
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Services</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            {services.map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="hover:text-[#C0392B] transition-colors focus:outline-none focus:text-[#C0392B]"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact information */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-crimson-primary shrink-0 mt-0.5" aria-hidden="true" />
                                <span>Cape Town, South Africa</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-crimson-primary shrink-0" aria-hidden="true" />
                                <a
                                    href="tel:+27699171527"
                                    className="hover:text-white transition-colors focus:outline-none focus:text-white"
                                    aria-label="Call +27 69 917 1527"
                                >
                                    +27 69 917 1527
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-crimson-primary shrink-0" aria-hidden="true" />
                                <a
                                    href="mailto:info@instylehairboutique.co.za"
                                    className="hover:text-white transition-colors focus:outline-none focus:text-white"
                                    aria-label="Send email to info@instylehairboutique.co.za"
                                >
                                    info@instylehairboutique.co.za
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} InStyle Hair Boutique. All rights reserved.
                        </p>

                        {/* Legal links */}
                        <div className="flex gap-6 text-sm text-gray-500">
                            <a
                                href="#"
                                className="hover:text-white transition-colors focus:outline-none focus:text-white"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="hover:text-white transition-colors focus:outline-none focus:text-white"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="hover:text-white transition-colors focus:outline-none focus:text-white"
                            >
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
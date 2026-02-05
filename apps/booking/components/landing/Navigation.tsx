import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface NavigationProps {
    onNavigate: (section: string) => void;
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
    onNavigate,
    isMenuOpen,
    setIsMenuOpen,
}) => {
    const navItems = ['Home', 'Services', 'Products', 'Gallery', 'Testimonials'];

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
                        <div className="relative w-14 h-14 md:w-20 md:h-20">
                            <Image
                                src="/logos/instyle-logo.png"
                                alt="InStyle Logo"
                                width={80}
                                height={80}
                                className="object-contain w-full h-full"
                            />
                        </div>
                        <span className="text-2xl md:text-3xl font-bold font-serif leading-none text-crimson-primary">
                            InStyle <br className="hidden md:block" /> <span className="text-sm md:text-lg font-sans font-normal text-gray-600 block md:inline">Hair Boutique</span>
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => onNavigate(item.toLowerCase())}
                                className="text-sm font-medium hover:text-crimson-primary transition-colors uppercase tracking-wide"
                            >
                                {item}
                            </button>
                        ))}
                        <button
                            onClick={() => onNavigate('booking')}
                            className="px-6 py-2.5 rounded-full text-white font-medium transition-transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl bg-crimson-primary hover:bg-crimson-dark"
                        >
                            Book Now
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg py-4 px-4 flex flex-col gap-4">
                    {navItems.map((item) => (
                        <button
                            key={item}
                            onClick={() => onNavigate(item.toLowerCase())}
                            className="text-left py-2 font-medium border-b border-gray-100"
                        >
                            {item}
                        </button>
                    ))}
                    <button
                        onClick={() => onNavigate('booking')}
                        className="w-full py-3 rounded-lg text-white font-bold text-center mt-2 bg-crimson-primary hover:bg-crimson-dark"
                    >
                        Book Appointment
                    </button>
                </div>
            )}
        </header>
    );
};
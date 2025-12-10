'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Calendar, ShoppingBag, Star, Clock, MapPin, Phone, Mail,
    Heart, ShoppingCart, Menu, X, Check, ArrowRight, Instagram, Facebook
} from 'lucide-react';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';
import CompleteBookingFlow from '@/components/booking/CompleteBookingFlow';

// Brand Colors
const colors = {
    primary: '#8B4513',    // Saddle Brown
    secondary: '#D2691E',  // Chocolate
    accent: '#F59E0B',     // Amber/Gold
    dark: '#1F2937',
    light: '#FFFFFF',
    bg: '#FDF8F6'          // Warm off-white
};

export default function InStyleLandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [showBooking, setShowBooking] = useState(false);

    // Scroll to section handler
    const scrollToSection = (id: string) => {
        setIsMenuOpen(false);
        if (id === 'booking') {
            setShowBooking(true);
            // Wait for state update then scroll
            setTimeout(() => {
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            return;
        }
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
    };

    return (
        <div className="min-h-screen font-sans text-gray-800 overflow-x-hidden" style={{ backgroundColor: colors.bg }}>

            {/* Navigation */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
                            <div className="relative w-14 h-14 md:w-20 md:h-20">
                                <Image
                                    src="/logos/instyle-logo.png"
                                    alt="InStyle Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="text-2xl md:text-3xl font-bold font-serif leading-none" style={{ color: colors.primary }}>
                                InStyle<br className="hidden md:block" /> <span className="text-sm md:text-lg font-sans font-normal text-gray-600 block md:inline">Hair Boutique</span>
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {['Home', 'Services', 'Products', 'Gallery', 'Testimonials'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="text-sm font-medium hover:text-[#8B4513] transition-colors uppercase tracking-wide"
                                >
                                    {item}
                                </button>
                            ))}
                            <button
                                onClick={() => scrollToSection('booking')}
                                className="px-6 py-2.5 rounded-full text-white font-medium transition-transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                                style={{ backgroundColor: colors.primary }}
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
                        {['Home', 'Services', 'Products', 'Gallery', 'Testimonials'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase())}
                                className="text-left py-2 font-medium border-b border-gray-100"
                            >
                                {item}
                            </button>
                        ))}
                        <button
                            onClick={() => scrollToSection('booking')}
                            className="w-full py-3 rounded-lg text-white font-bold text-center mt-2"
                            style={{ backgroundColor: colors.primary }}
                        >
                            Book Appointment
                        </button>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section id="home" className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-3xl" style={{ background: `radial-gradient(${colors.primary}, transparent 70%)` }}></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-3xl" style={{ background: `radial-gradient(${colors.secondary}, transparent 70%)` }}></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-6 leading-tight text-gray-900">
                        Transform Your Look With <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B4513] to-[#D2691E]">
                            Premium Hair Services
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Experience the finest hair treatments, extensions, and styling from South Africa&apos;s leading boutique.
                        Where elegance meets expertise.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => scrollToSection('booking')}
                            className="px-8 py-4 rounded-full text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                            style={{ backgroundColor: colors.primary }}
                        >
                            <Calendar className="w-5 h-5" />
                            Book Appointment
                        </button>
                        <button
                            onClick={() => scrollToSection('products')}
                            className="px-8 py-4 rounded-full font-semibold text-lg border-2 hover:bg-[#8B4513] hover:text-white transition-all flex items-center justify-center gap-2"
                            style={{ borderColor: colors.primary, color: colors.primary }}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Shop Products
                        </button>
                        <a
                            href="https://wa.me/27699171527"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E]"
                        >
                            <FaWhatsapp className="w-5 h-5" />
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-gray-900">Our Premium Services</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Professional hair treatments and styling services tailored to your unique needs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Premium Installations",
                                price: "From R300",
                                desc: "Expert installation for middle & side parts, closures, and frontals.",
                                image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
                                badge: "Popular"
                            },
                            {
                                title: "Traditional Styling",
                                price: "From R350",
                                desc: "Maphondo, lines, and intricate traditional patterns with modern flair.",
                                image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80",
                                badge: "Signature"
                            },
                            {
                                title: "Soft Glam Makeup",
                                price: "R450",
                                desc: "Professional makeup application perfect for any special occasion.",
                                image: "https://images.unsplash.com/photo-1487412947132-232984567455?auto=format&fit=crop&w=800&q=80",
                                badge: "New"
                            }
                        ].map((service, i) => (
                            <div key={i} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute top-4 right-4 z-10 bg-[#D2691E] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {service.badge}
                                    </div>
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        width={500}
                                        height={400}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                                    <p className="text-gray-600 mb-4 text-sm">{service.desc}</p>
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-2xl font-bold" style={{ color: colors.primary }}>{service.price}</span>
                                        <div className="flex items-center gap-1 text-amber-500 text-sm">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="font-medium">5.0</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => scrollToSection('booking')}
                                        className="w-full py-3 rounded-xl font-semibold border-2 transition-all hover:text-white flex items-center justify-center gap-2"
                                        style={{ borderColor: colors.primary, color: colors.primary }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = colors.primary;
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = colors.primary;
                                        }}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-20 bg-[#FDF8F6]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-gray-900">Premium Hair Products</h2>
                            <p className="text-gray-600">Shop our curated selection of professional hair care.</p>
                        </div>
                        <Link
                            href="/book/instylehairboutique/shop"
                            className="text-[#8B4513] font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                        >
                            View All Products <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "Luxury Hair Oil", price: "R150", img: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80" },
                            { name: "Styling Gel", price: "R85", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80" },
                            { name: "Deep Conditioner", price: "R110", img: "https://images.unsplash.com/photo-1571781565036-d3f7595ca814?auto=format&fit=crop&w=500&q=80" },
                            { name: "Edge Control", price: "R75", img: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&w=500&q=80" }
                        ].map((product, i) => (
                            <div key={i} className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all group">
                                <div className="relative h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                                    <Image
                                        src={product.img}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <button className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all translate-y-10 group-hover:translate-y-0 z-10">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-[#8B4513]">{product.price}</span>
                                    <button className="p-2 rounded-full bg-gray-50 hover:bg-[#8B4513] hover:text-white transition-colors">
                                        <ShoppingCart className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-gray-900">Client Love</h2>
                        <p className="text-gray-600">Don&apos;t just take our word for it.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Sarah M.", text: "The best hair salon experience I've ever had! My extensions look so natural.", role: "Regular Client" },
                            { name: "Zoe K.", text: "I've been coming to Instyle for over a year. Always impressed with the detail.", role: "VIP Client" },
                            { name: "Amanda T.", text: "The coloring service is exceptional! They created the perfect shade for me.", role: "New Client" }
                        ].map((t, i) => (
                            <div key={i} className="bg-[#FDF8F6] p-8 rounded-2xl relative">
                                <div className="text-6xl text-[#8B4513] opacity-10 absolute top-4 left-4 font-serif">&quot;</div>
                                <p className="text-gray-600 italic mb-6 relative z-10">{t.text}</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-[#8B4513]">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Booking Section - Embeds CompleteBookingFlow */}
            <section id="booking" className="py-20 bg-gradient-to-br from-[#8B4513] to-[#5D2E0C] text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Book Your Appointment</h2>
                        <p className="text-white/80 max-w-2xl mx-auto">Ready to transform your look? Select your service below.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto text-gray-800">
                        {/* We render the booking flow here, but we need to make sure it fits well */}
                        <div className="p-2 md:p-6">
                            <CompleteBookingFlow embedded={true} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#1F2937] text-white pt-20 pb-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="relative w-8 h-8">
                                    <Image src="/logos/instyle-logo.png" alt="Logo" fill className="object-contain brightness-0 invert" />
                                </div>
                                <span className="text-xl font-bold font-serif">InStyle</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Premium hair services and products in South Africa. Transforming looks with expertise and care since 2023.
                            </p>
                            <div className="flex gap-4">
                                {[Instagram, Facebook, FaTiktok].map((Icon, i) => (
                                    <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#8B4513] transition-colors">
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                {['Home', 'Services', 'Products', 'Gallery', 'Book Now'].map(item => (
                                    <li key={item}><a href="#" className="hover:text-[#8B4513] transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-6">Services</h3>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                {['Installations', 'Styling', 'Coloring', 'Treatments', 'Braiding'].map(item => (
                                    <li key={item}><a href="#" className="hover:text-[#8B4513] transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-[#8B4513] shrink-0" />
                                    <span>Cape Town, South Africa</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-[#8B4513] shrink-0" />
                                    <span>+27 69 917 1527</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-[#8B4513] shrink-0" />
                                    <span>info@instylehairboutique.co.za</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                        <p>&copy; {new Date().getFullYear()} InStyle Hair Boutique. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

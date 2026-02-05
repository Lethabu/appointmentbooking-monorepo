'use client';

/* eslint-disable react/no-unescaped-entities */

import {
    Calendar, ShoppingBag, Star, Clock, MapPin, Phone, Mail,
    Heart, ShoppingCart, Menu, X, Check, ArrowRight, Instagram, Facebook, MessageCircle, Send, Bot
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';

import { useAI } from '../../../../packages/ui/src/store';

import BookingWizard from '@/components/booking/BookingWizard';

// Using CSS Variables for Consistent Branding

interface Service {
    id: string;
    name: string;
    description: string;
    price: number; // in cents or rands depending on API, usually cents in DB but API might return formatted? 
    // Looking at BookingWizard, it expects price in cents (divides by 100).
    duration_minutes: number;
    category?: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number; // in cents
    image_url?: string;
}

interface Props {
    services?: Service[];
    products?: Product[];
    config?: any;
}

export default function InStyleLandingPage({ services = [], products = [], config }: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [showBooking, setShowBooking] = useState(false);
    const [showAIChat, setShowAIChat] = useState(false);
    const [chatMessage, setChatMessage] = useState('');

    // AI Chat hooks
    const { aiConversations, isAiTyping, addAiConversation, setAiTyping } = useAI();

    // AI Chat handlers
    const handleSendMessage = async () => {
        if (!chatMessage.trim()) return;

        const userMessage = chatMessage.trim();
        setChatMessage('');

        // Add user message to conversation
        addAiConversation({
            id: crypto.randomUUID(),
            query: userMessage,
            response: '',
            timestamp: Date.now(),
            resolved: false
        });

        setAiTyping(true);

        try {
            // Call AI endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: aiConversations.map(c => ({ role: c.query ? 'user' : 'model', content: c.query || c.response }))
                })
            });

            const data = await response.json() as { response: string; error?: string };

            if (data.response) {
                addAiConversation({
                    id: crypto.randomUUID(),
                    query: '',
                    response: data.response,
                    timestamp: Date.now(),
                    resolved: true
                });
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error(error);
            addAiConversation({
                id: crypto.randomUUID(),
                query: '',
                response: 'I apologize, but I\'m having trouble connecting right now. Please call us at +27 69 917 1527 to speak with our team directly.',
                timestamp: Date.now(),
                resolved: false
            });
        } finally {
            setAiTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

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

    // Helper to get image for service based on name (since DB might not have images)
    const getServiceImage = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('install')) return "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80";
        if (lowerName.includes('maphondo') || lowerName.includes('braid')) return "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80";
        if (lowerName.includes('makeup') || lowerName.includes('glam')) return "https://images.unsplash.com/photo-1487412947132-232984567455?auto=format&fit=crop&w=800&q=80";
        if (lowerName.includes('ponytail')) return "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80";
        return "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80"; // Default
    };

    // Helper to get badge
    const getServiceBadge = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('middle') || lowerName.includes('side')) return "Popular";
        if (lowerName.includes('maphondo')) return "Signature";
        if (lowerName.includes('frontal')) return "Premium";
        return null;
    };

    // Use passed services or fallback to a default list if empty (to avoid empty page during dev)
    const displayServices = services;

    const displayProducts = products;

    return (
        <div className="min-h-screen font-sans text-gray-800 overflow-x-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>

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
                            <span className="text-2xl md:text-3xl font-bold font-serif leading-none text-crimson-primary">
                                InStyle<br className="hidden md:block" /> <span className="text-sm md:text-lg font-sans font-normal text-gray-600 block md:inline">Hair Boutique</span>
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {['Home', 'Services', 'Products', 'Gallery', 'Testimonials'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="text-sm font-medium hover:text-crimson-primary transition-colors uppercase tracking-wide"
                                >
                                    {item}
                                </button>
                            ))}
                            <button
                                onClick={() => scrollToSection('booking')}
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
                            className="w-full py-3 rounded-lg text-white font-bold text-center mt-2 bg-crimson-primary hover:bg-crimson-dark"
                        >
                            Book Appointment
                        </button>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section id="home" className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-3xl bg-crimson-100 opacity-30"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-3xl bg-neutral-200 opacity-20"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-6 leading-tight text-gray-900">
                        Transform Your Look With <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-crimson)] to-[var(--neutral-900)]">
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
                            className="px-8 py-4 rounded-full text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2 bg-crimson-primary hover:bg-crimson-dark"
                        >
                            <Calendar className="w-5 h-5" />
                            Book Appointment
                        </button>
                        <button
                            onClick={() => scrollToSection('products')}
                            className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-crimson-primary text-crimson-primary hover:bg-crimson-primary hover:text-white transition-all flex items-center justify-center gap-2"
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
                        {displayServices.map((service, i) => {
                            const badge = getServiceBadge(service.name);
                            return (
                                <div key={service.id || i} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                    <div className="relative h-64 overflow-hidden">
                                        {badge && (
                                            <div className="absolute top-4 right-4 z-10 bg-[#1B1B1B] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                {badge}
                                            </div>
                                        )}
                                        <Image
                                            src={getServiceImage(service.name)}
                                            alt={service.name}
                                            width={500}
                                            height={400}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2 text-gray-900">{service.name}</h3>
                                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{service.description}</p>
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-2xl font-bold text-crimson-primary">
                                                R{(service.price / 100).toFixed(0)}
                                            </span>
                                            <div className="flex items-center gap-1 text-amber-500 text-sm">
                                                <Clock className="w-4 h-4" />
                                                <span className="font-medium">{service.duration_minutes}m</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => scrollToSection('booking')}
                                            className="w-full py-3 rounded-xl font-semibold border-2 border-crimson-primary text-crimson-primary hover:bg-crimson-primary hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-20 bg-[#F9F9F9]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-gray-900">Premium Hair Products</h2>
                            <p className="text-gray-600">Shop our curated selection of professional hair care.</p>
                        </div>
                        <Link
                            href="/book/instylehairboutique/shop"
                            className="text-crimson-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                        >
                            View All Products <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayProducts.map((product, i) => (
                            <div key={product.id || i} className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all group">
                                <div className="relative h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                                    <Image
                                        src={product.image_url || "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80"}
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
                                    <span className="font-bold text-crimson-primary">R{(product.price / 100).toFixed(0)}</span>
                                    <button className="p-2 rounded-full bg-gray-50 hover:bg-[#C0392B] hover:text-white transition-colors">
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
                            <div key={i} className="bg-[#F9F9F9] p-8 rounded-2xl relative">
                                <div className="text-6xl text-crimson-primary opacity-10 absolute top-4 left-4 font-serif">&quot;</div>
                                <p className="text-gray-600 italic mb-6 relative z-10">{t.text}</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-crimson-primary">
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

            {/* Booking Section - Embeds BookingWizard */}
            <section id="booking" className="py-20 bg-gradient-to-br from-[#C0392B] to-[#5D2E0C] text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Book Your Appointment</h2>
                        <p className="text-white/80 max-w-2xl mx-auto">Ready to transform your look? Select your service below.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto text-gray-800">
                        {/* We render the booking flow here, but we need to make sure it fits well */}
                        <div className="p-2 md:p-6">
                            <BookingWizard />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[var(--neutral-900)] text-white pt-20 pb-10">
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
                                    <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-crimson-primary transition-colors">
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                {['Home', 'Services', 'Products', 'Gallery', 'Book Now'].map(item => (
                                    <li key={item}><a href="#" className="hover:text-crimson-primary transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-6">Services</h3>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                {['Installations', 'Styling', 'Coloring', 'Treatments', 'Braiding'].map(item => (
                                    <li key={item}><a href="#" className="hover:text-[#C0392B] transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-crimson-primary shrink-0" />
                                    <span>Cape Town, South Africa</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-crimson-primary shrink-0" />
                                    <span>+27 69 917 1527</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-crimson-primary shrink-0" />
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

            {/* AI Chat Floating Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setShowAIChat(!showAIChat)}
                    className="w-16 h-16 bg-gradient-to-r from-crimson-primary to-crimson-light rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 flex items-center justify-center text-white"
                >
                    <Bot className="w-8 h-8" />
                </button>
            </div>

            {/* AI Chat Interface */}
            {showAIChat && (
                <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-crimson-primary to-crimson-light text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Nia</h3>
                                <p className="text-sm opacity-90">AI Hair Stylist Assistant</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAIChat(false)}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                        <div className="space-y-4">
                            {/* Welcome Message */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-crimson-primary rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm max-w-[80%]">
                                    <p className="text-gray-800 text-sm">
                                        👋 Hi! I'm Nia, your AI hair stylist assistant. I can help you learn about our services, find the perfect style, or answer any questions about InStyle Hair Boutique. How can I assist you today?
                                    </p>
                                </div>
                            </div>

                            {/* User Messages */}
                            {aiConversations.filter((conv: any) => conv.query).map((conv: any) => (
                                <div key={conv.id} className="flex items-start gap-3 justify-end">
                                    <div className="bg-crimson-primary text-white rounded-2xl px-4 py-3 shadow-sm max-w-[80%]">
                                        <p className="text-sm">{conv.query}</p>
                                    </div>
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-bold text-gray-600">You</span>
                                    </div>
                                </div>
                            ))}

                            {/* AI Responses */}
                            {aiConversations.filter((conv: any) => conv.response).map((conv: any) => (
                                <div key={`response-${conv.id}`} className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-crimson-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm max-w-[80%]">
                                        <p className="text-gray-800 text-sm">{conv.response}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isAiTyping && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-crimson-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="border-t border-gray-200 p-4 bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me about our services..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-crimson-primary focus:border-transparent outline-none text-sm"
                                disabled={isAiTyping}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!chatMessage.trim() || isAiTyping}
                                className="px-4 py-3 bg-crimson-primary text-white rounded-xl hover:bg-crimson-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Powered by AI • Ask about services, pricing, or booking
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

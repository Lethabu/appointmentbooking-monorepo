// Booking request interface
interface BookingRequest {
    tenantId: string;
    name: string;
    email: string;
    phone: string;
    serviceId: string;
    scheduledTime: string;
    notes?: string;
}

import { getAvailability } from './availability';
import { handleDashboardBookings } from './dashboard-endpoint';
import { handleDashboardSSE } from './dashboard-stream';

// Small helpers used by the lightweight shop renderer
function escapeHtml(input: any) {
    if (!input && input !== 0) return '';
    return String(input)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatPrice(priceCents: number | null | undefined, currency: string | null | undefined) {
    try {
        const cents = Number(priceCents) || 0;
        const cur = currency || 'ZAR';
        // assume priceCents stored as integer cents, convert to decimal
        const amount = (cents / 100).toFixed(2);
        return `${cur} ${amount}`;
    } catch (e) {
        return '';
    }
}

// Cloudflare Worker for InStyle landing page
export default {
    async fetch(request: Request, env: any) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Serve a lightweight shop page directly from the Worker when the Pages origin
        // is unreachable (avoids Cloudflare 530). This renders a minimal product grid
        // by querying D1 so users can still browse products while routing is fixed.
        if (!path.startsWith('/api') && (path === '/shop' || path.startsWith('/book/instylehairboutique/shop'))) {
            try {
                // Query up to 50 active products
                const productsStmt = env.DB.prepare(`
                    SELECT p.id, p.name, p.price, p.short_description, p.images
                    FROM products p
                    WHERE p.is_active = 1
                    ORDER BY p.created_at DESC
                    LIMIT 50
                `);

                const productsResult = await productsStmt.all();
                const products = (productsResult && productsResult.results) || [];

                const productCards = products.map((p: any) => {
                    let imageUrl = '';
                    try {
                        if (p.images) {
                            const images = JSON.parse(p.images);
                            imageUrl = Array.isArray(images) && images.length > 0 ? images[0] : '';
                        }
                    } catch (e) {
                        // Images field may not be valid JSON
                    }
                    return `
                    <div style="width:220px;margin:12px;border-radius:12px;overflow:hidden;border:1px solid #eee;">
                        <div style="height:160px;background:#f8f8f8;display:flex;align-items:center;justify-content:center;">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(p.name)}" style="max-height:100%;max-width:100%;"/>` : '<div style="color:#999">No image</div>'}</div>
                        <div style="padding:12px;font-family:Inter,system-ui,sans-serif;">
                            <h3 style="margin:0 0 8px;font-size:15px">${escapeHtml(p.name)}</h3>
                            <p style="margin:0 0 8px;color:#666;font-size:13px">${escapeHtml(p.short_description || '')}</p>
                            <div style="font-weight:700">${formatPrice(p.price, 'ZAR')}</div>
                        </div>
                    </div>
                `;
                }).join('');

                const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Shop — InStyle</title><style>body{font-family:Inter,system-ui,Arial,sans-serif;background:#fff;color:#111} .grid{display:flex;flex-wrap:wrap;gap:12px;max-width:1200px;margin:24px auto;justify-content:flex-start;padding:12px}</style></head><body><header style="padding:20px;text-align:center;background:#fff;border-bottom:1px solid #f0f0f0"><h1 style="margin:0">InStyle Shop</h1><h2 style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">Shop products</h2><p style="margin:6px 0 0;color:#666">Browse products — booking still available at /book</p></header><main><div class="grid">${productCards}</div></main></body></html>`;

                return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
            } catch (err) {
                console.error('Shop renderer error:', err);
                // If shop renderer fails, return a minimal error response instead of proxying
                return new Response('<html><body><h1>Shop Unavailable</h1><p>Sorry, the shop is temporarily unavailable.</p></body></html>', {
                    status: 503,
                    headers: { 'content-type': 'text/html; charset=utf-8' }
                });
            }
        }

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle preflight OPTIONS
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Root route - serve InStyle landing page with updated branding
        if (path === '/' || path === '/instyle' || path === '/instylehairboutique' || path === '/book/instylehairboutique') {
            const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InStyle Hair Boutique | Premium Hair Services Cape Town</title>
    <meta name="description" content="InStyle Hair Boutique - Premium hair installations, styling, and products in Cape Town. Transform your look with our expert services.">
    <script src="https://cdn.tailwindcss.com"><\/script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#C0392B',
                        secondary: '#1B1B1B',
                        accent: '#F9F9F9'
                    }
                }
            }
        }
    <\/script>
    <style>
        .bg-gradient-radial {
            background: radial-gradient(circle, var(--tw-gradient-stops));
        }
    <\/style>
<\/head>
<body class="bg-gradient-to-br from-gray-50 via-white to-gray-50 font-sans">
    <div class="min-h-screen">
        <!-- Navigation -->
        <nav class="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
            <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="#" class="text-2xl font-serif font-bold text-gray-900 tracking-tighter">InStyle<span class="text-primary">.<\/span><\/a>
                <div class="hidden md:flex gap-8 items-center text-sm font-medium text-gray-600">
                    <a href="#services-grid" class="hover:text-primary transition-colors">Services<\/a>
                    <a href="#portfolio" class="hover:text-primary transition-colors">Portfolio<\/a>
                    <a href="#reviews" class="hover:text-primary transition-colors">Reviews<\/a>
                    <a href="https://shop.instylehairboutique.co.za" class="hover:text-primary transition-colors">Shop<\/a>
                    <a href="#booking" class="px-6 py-2 bg-primary text-white rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl">Book Now<\/a>
                <\/div>
            <\/div>
        <\/nav>

        <!-- Hero Section -->
        <div class="relative pt-32 pb-32 px-4 overflow-hidden bg-gray-50">
            <div class="absolute inset-0 z-0 opacity-10">
                <div class="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl bg-gradient-radial from-primary to-transparent"><\/div>
                <div class="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl bg-gradient-radial from-secondary to-transparent"><\/div>
            <\/div>
            <div class="container mx-auto max-w-5xl relative z-10 text-center">
                <span class="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 tracking-wide uppercase">New Collection Available<\/span>
                <h1 class="text-5xl md:text-7xl font-bold font-serif mb-8 text-gray-900 leading-tight">
                    Where Elegance<br>
                    <span class="bg-gradient-to-r from-primary to-red-800 bg-clip-text text-transparent">Meets Expertise<\/span>
                <\/h1>
                <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                    South Africa's premier destination for luxury wigs, precision styling, and premium hair treatments. Elevate your look with InStyle.
                <\/p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="#booking" class="px-8 py-4 bg-primary text-white font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                        <span>📅 Book Appointment<\/span>
                    <\/a>
                    <a href="/shop" class="px-8 py-4 bg-white text-gray-900 border border-gray-200 font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 hover:border-gray-300 flex items-center justify-center gap-2">
                        <span>🛍️ Shop Collection<\/span>
                    <\/a>
                <\/div>
            <\/div>
        <\/div>

        <!-- Trust Signals / Why Choose Us -->
        <div class="py-16 bg-white border-b border-gray-50">
            <div class="container mx-auto px-6">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div class="p-4">
                        <div class="text-4xl mb-4">✨<\/div>
                        <h3 class="font-bold text-gray-900 mb-2">Premium Quality<\/h3>
                        <p class="text-gray-500 text-sm">100% Virgin Human Hair<\/p>
                    <\/div>
                    <div class="p-4">
                        <div class="text-4xl mb-4">👩‍🎨<\/div>
                        <h3 class="font-bold text-gray-900 mb-2">Expert Stylists<\/h3>
                        <p class="text-gray-500 text-sm">Certified Professionals<\/p>
                    <\/div>
                    <div class="p-4">
                        <div class="text-4xl mb-4">💳<\/div>
                        <h3 class="font-bold text-gray-900 mb-2">Secure Payment<\/h3>
                        <p class="text-gray-500 text-sm">Safe & Easy Transactions<\/p>
                    <\/div>
                    <div class="p-4">
                        <div class="text-4xl mb-4">🚀<\/div>
                        <h3 class="font-bold text-gray-900 mb-2">Fast Service<\/h3>
                        <p class="text-gray-500 text-sm">Efficient Booking & Delivery<\/p>
                    <\/div>
                <\/div>
            <\/div>
        <\/div>

        <!-- Services Section -->
        <div id="services-grid-section" class="py-24 bg-white">
            <div class="container mx-auto px-6">
                <div class="text-center mb-16">
                    <span class="text-primary font-semibold tracking-wider uppercase text-sm">Our Menu<\/span>
                    <h2 class="text-3xl md:text-5xl font-bold font-serif my-4 text-gray-900">Premium Services<\/h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">Discover our range of professional treatments designed to protect and enhance your natural beauty.<\/p>
                <\/div>
                <div id="services-grid" class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Services will be loaded here via JS -->
                    <div class="text-center py-12 col-span-3">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"><\/div>
                        <p class="mt-4 text-gray-500 font-medium">Curating our service menu...<\/p>
                    <\/div>
                <\/div>
            <\/div>
        <\/div>

        <!-- Portfolio Placeholder -->
        <div id="portfolio" class="py-24 bg-gray-50">
            <div class="container mx-auto px-6">
                <div class="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div class="mb-6 md:mb-0">
                        <span class="text-primary font-semibold tracking-wider uppercase text-sm">Our Work<\/span>
                        <h2 class="text-3xl md:text-4xl font-bold font-serif mt-2 text-gray-900">Recent Transformations<\/h2>
                    <\/div>
                    <a href="https://instagram.com" target="_blank" class="text-gray-900 font-semibold border-b-2 border-primary hover:text-primary transition-colors">View Instagram Gallery →<\/a>
                <\/div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    <!-- Placeholder Images -->
                    <div class="aspect-square bg-gray-200 rounded-2xl overflow-hidden hover:opacity-90 transition-opacity relative group">
                        <div class="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">Bobs<\/div>
                     <\/div>
                    <div class="aspect-square bg-gray-200 rounded-2xl overflow-hidden hover:opacity-90 transition-opacity relative group">
                        <div class="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">Curls<\/div>
                    <\/div>
                    <div class="aspect-square bg-gray-200 rounded-2xl overflow-hidden hover:opacity-90 transition-opacity relative group">
                        <div class="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">Installs<\/div>
                    <\/div>
                    <div class="aspect-square bg-gray-200 rounded-2xl overflow-hidden hover:opacity-90 transition-opacity relative group">
                        <div class="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">Color<\/div>
                    <\/div>
                <\/div>
            <\/div>
        <\/div>

        <!-- Booking Section -->
        <div id="booking" class="py-24 bg-secondary text-white relative overflow-hidden">
            <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')]"><\/div>
            <div class="container mx-auto px-6 relative z-10">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span class="text-primary font-semibold tracking-wider uppercase text-sm">Reservations<\/span>
                        <h2 class="text-4xl md:text-5xl font-bold font-serif my-6 leading-tight">Book Your <br>Experience Today<\/h2>
                        <p class="text-gray-400 text-lg mb-8 leading-relaxed">
                            Join our exclusive client list. Please select your preferred date and service. 
                            For complex coloring or bridal services, please contact us directly.
                        <\/p>
                        <div class="space-y-4">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary text-xl">📍<\/div>
                                <div>
                                    <p class="font-bold">Visit Us<\/p>
                                    <p class="text-gray-400 text-sm">Cape Town, South Africa<\/p>
                                <\/div>
                            <\/div>
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary text-xl">💬<\/div>
                                <div>
                                    <p class="font-bold">Quick Chat<\/p>
                                    <p class="text-gray-400 text-sm">+27 69 917 1527<\/p>
                                <\/div>
                            <\/div>
                        <\/div>
                    <\/div>

                    <div class="bg-white rounded-3xl shadow-2xl p-8 text-gray-800">
                        <h3 class="text-2xl font-bold mb-6 text-gray-900">Secure Your Slot<\/h3>
                        <form id="booking-form" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" id="name" placeholder="Full Name" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
                                <input type="tel" id="phone" placeholder="Phone" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
                            <\/div>
                            <input type="email" id="email" placeholder="Email Address" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
                            <select id="service" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none">
                                <option value="">Loading Services...<\/option>
                            <\/select>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="date" id="date" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
                                <select id="time" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
                                    <option value="">Select Time<\/option>
                                    <option value="09:00">09:00 AM<\/option>
                                    <option value="10:00">10:00 AM<\/option>
                                    <option value="11:00">11:00 AM<\/option>
                                    <option value="12:00">12:00 PM<\/option>
                                    <option value="14:00">02:00 PM<\/option>
                                    <option value="15:00">03:00 PM<\/option>
                                    <option value="16:00">04:00 PM<\/option>
                                <\/select>
                            <\/div>
                            <textarea id="notes" rows="2" placeholder="Special Requests (Optional)" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"><\/textarea>
                            <button type="submit" class="w-full bg-primary text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">Confirm Appointment<\/button>
                        <\/form>
                    <\/div>
                <\/div>
            <\/div>
        <\/div>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800">
            <div class="container mx-auto px-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div class="col-span-1 md:col-span-1">
                        <h3 class="text-2xl font-serif font-bold mb-6 text-white">InStyle<span class="text-primary">.<\/span><\/h3>
                        <p class="text-gray-400 text-sm leading-relaxed mb-6">
                            Redefining beauty standards with premium quality hair and exceptional service. Your confidence is our masterpiece.
                        <\/p>
                        <div class="flex gap-4">
                            <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">📸<\/a>
                            <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">📘<\/a>
                            <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">🎵<\/a>
                        <\/div>
                    <\/div>
                    <div>
                        <h4 class="font-bold mb-6 text-gray-200">Services<\/h4>
                        <ul class="space-y-3 text-sm text-gray-400">
                            <li><a href="#" class="hover:text-primary transition-colors">Wig Installation<\/a><\/li>
                            <li><a href="#" class="hover:text-primary transition-colors">Custom Styling<\/a><\/li>
                            <li><a href="#" class="hover:text-primary transition-colors">Treatments<\/a><\/li>
                            <li><a href="#" class="hover:text-primary transition-colors">Bridal Packages<\/a><\/li>
                        <\/ul>
                    <\/div>
                    <div>
                        <h4 class="font-bold mb-6 text-gray-200">Shop<\/h4>
                        <ul class="space-y-3 text-sm text-gray-400">
                            <li><a href="/shop?cat=wigs" class="hover:text-primary transition-colors">Premium Wigs<\/a><\/li>
                            <li><a href="/shop?cat=bundles" class="hover:text-primary transition-colors">Hair Bundles<\/a><\/li>
                            <li><a href="/shop?cat=accessories" class="hover:text-primary transition-colors">Accessories<\/a><\/li>
                            <li><a href="#" class="hover:text-primary transition-colors">Gift Cards<\/a><\/li>
                        <\/ul>
                    <\/div>
                    <div>
                        <h4 class="font-bold mb-6 text-gray-200">Contact<\/h4>
                        <ul class="space-y-3 text-sm text-gray-400">
                            <li class="flex items-center gap-3"><span class="text-primary">📞<\/span> +27 69 917 1527<\/li>
                            <li class="flex items-center gap-3"><span class="text-primary">📧<\/span> info@instylehairboutique.co.za<\/li>
                            <li class="flex items-center gap-3"><span class="text-primary">📍<\/span> Cape Town, SA<\/li>
                        <\/ul>
                    <\/div>
                <\/div>
                <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; 2025 InStyle Hair Boutique. All rights reserved.<\/p>
                    <div class="flex gap-6 mt-4 md:mt-0">
                        <a href="#" class="hover:text-white transition-colors">Privacy Policy<\/a>
                        <a href="#" class="hover:text-white transition-colors">Terms of Service<\/a>
                    <\/div>
                <\/div>
            <\/div>
        <\/footer>
    <\/div>
    <script>
        const TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
        async function loadServices() {
            try {
                const response = await fetch('/api/tenant?slug=instylehairboutique');
                const data = await response.json();
                const grid = document.getElementById('services-grid');
                const select = document.getElementById('service');
                grid.innerHTML = '';
                select.innerHTML = '<option value="">Select a Service<\/option>';
                data.services.forEach(service => {
                    const card = document.createElement('div');
                    card.className = 'bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100';
                    const html = '<div class="p-6"><span class="text-xs font-semibold text-secondary">' + (service.category || 'Hair Service') + '<\/span><h3 class="text-xl font-bold mt-2 mb-2 text-gray-900">' + service.name + '<\/h3><p class="text-sm text-gray-600 mb-4">' + (service.description || '') + '<\/p><div class="flex items-center justify-between"><span class="text-2xl font-bold text-primary">R' + (service.price / 100).toFixed(0) + '<\/span><span class="text-sm text-gray-500">' + service.duration_minutes + ' min<\/span><\/div><\/div>';
                    card.innerHTML = html;
                    grid.appendChild(card);
                    const option = document.createElement('option');
                    option.value = service.id;
                    option.textContent = service.name + ' - R' + (service.price / 100).toFixed(0);
                    select.appendChild(option);
                });
            } catch (error) {
                console.error('Error loading services:', error);
                document.getElementById('services-grid').innerHTML = '<p class="text-center col-span-3 text-gray-500">Unable to load services. Please try again later.<\/p>';
            }
        }
        document.getElementById('booking-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.textContent = 'Booking...';
            btn.disabled = true;
            try {
                const response = await fetch('/api/book', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tenantId: TENANT_ID,
                        name: document.getElementById('name').value,
                        email: document.getElementById('email').value,
                        phone: document.getElementById('phone').value,
                        serviceId: document.getElementById('service').value,
                        scheduledTime: document.getElementById('date').value + 'T' + document.getElementById('time').value + ':00Z',
                        notes: document.getElementById('notes').value
                    })
                });
                const result = await response.json();
                if (result.success) {
                    alert('🎉 Booking successful! We will contact you to confirm your appointment.');
                    e.target.reset();
                } else {
                    alert('❌ Booking failed. Please try again or call us directly.');
                }
            } catch (error) {
                alert('❌ Booking failed. Please try again or call us directly.');
            } finally {
                btn.textContent = 'Confirm Booking';
                btn.disabled = false;
            }
        });
        document.getElementById('date').min = new Date().toISOString().split('T')[0];
        loadServices();
    <\/script>
<\/body>
<\/html>`;
            return new Response(html, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'public, max-age=300',
                    ...corsHeaders
                }
            });
        }

        // Handle API routes
        if (path.startsWith('/api/')) {
            return handleApiRoute(request, env);
        }

        // Default not found for other paths
        return new Response('Not found', { status: 404 });
    }
};

// API Route Handler
async function handleApiRoute(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        // Dashboard SSE stream - real-time updates (polling inside worker)
        if (path === '/api/dashboard/stream') {
            return handleDashboardSSE(request, env, corsHeaders);
        }

        // Dashboard bookings endpoint - Get 2024+ bookings for dashboard UI
        if (path === '/api/dashboard/bookings') {
            return handleDashboardBookings(request, env, corsHeaders);
        }

        // Tenant endpoint - Get tenant info and services
        if (path === '/api/tenant') {
            const slug = url.searchParams.get('slug');

            if (!slug) {
                return new Response(JSON.stringify({ error: 'Slug parameter required' }), {
                    status: 400,
                    headers: corsHeaders
                });
            }

            // Fetch tenant data
            const tenant = await env.DB.prepare(
                'SELECT * FROM tenants WHERE slug = ?'
            ).bind(slug).first();

            if (!tenant) {
                return new Response(JSON.stringify({ error: 'Tenant not found' }), {
                    status: 404,
                    headers: corsHeaders
                });
            }

            // Fetch services for this tenant
            const servicesResult = await env.DB.prepare(
                'SELECT * FROM services WHERE tenant_id = ? AND is_active = 1 ORDER BY created_at ASC'
            ).bind(tenant.id).all();

            return new Response(JSON.stringify({
                tenant,
                services: servicesResult.results || []
            }), {
                headers: corsHeaders
            });
        }

        // Book endpoint - Create new booking
        if (path === '/api/book' && request.method === 'POST') {
            const bodyData = await request.json();
            const body = bodyData as BookingRequest;
            const { tenantId, name, email, phone, serviceId, scheduledTime, notes } = body;

            // Validate required fields
            if (!tenantId || !name || !email || !phone || !serviceId || !scheduledTime) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Missing required fields'
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }

            const now = Math.floor(Date.now() / 1000);
            let userId = crypto.randomUUID();

            try {
                // 1. Check if user exists (by email) or create new
                const existingUser = await env.DB.prepare(
                    'SELECT id FROM users WHERE tenant_id = ? AND email = ?'
                ).bind(tenantId, email).first();

                if (existingUser) {
                    userId = existingUser.id;
                    // Optional: Update phone/name if changed? keeping simple for now
                } else {
                    // Create new user
                    await env.DB.prepare(`
                        INSERT INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `).bind(userId, tenantId, name, email, phone, now, now).run();
                }

                // 2. Create appointment
                const bookingId = crypto.randomUUID();

                // Convert ISO time to unix timestamp if needed, or store as is if schema allows
                // Schema says scheduled_time is INTEGER (unix timestamp)
                const scheduledTimestamp = Math.floor(new Date(scheduledTime).getTime() / 1000);

                await env.DB.prepare(`
                    INSERT INTO appointments (id, tenant_id, user_id, service_id, scheduled_time, notes, status, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)
                `).bind(
                    bookingId,
                    tenantId,
                    userId,
                    serviceId,
                    scheduledTimestamp,
                    notes || '',
                    now,
                    now
                ).run();

                return new Response(JSON.stringify({
                    success: true,
                    bookingId,
                    message: 'Booking created successfully'
                }), {
                    headers: corsHeaders
                });

            } catch (err) {
                console.error('Booking error:', err);
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Failed to create booking',
                    details: err instanceof Error ? err.message : String(err)
                }), { status: 500, headers: corsHeaders });
            }
        }

        // Dashboard endpoint - Get tenant statistics
        if (path === '/api/dashboard') {
            const tenantId = url.searchParams.get('tenantId');

            if (!tenantId) {
                return new Response(JSON.stringify({ error: 'TenantId parameter required' }), {
                    status: 400,
                    headers: corsHeaders
                });
            }

            // Fetch tenant
            const tenant = await env.DB.prepare(
                'SELECT * FROM tenants WHERE id = ?'
            ).bind(tenantId).first();

            if (!tenant) {
                return new Response(JSON.stringify({ error: 'Tenant not found' }), {
                    status: 404,
                    headers: corsHeaders
                });
            }

            // Get total appointments count
            const totalAppointmentsResult = await env.DB.prepare(
                'SELECT COUNT(*) as count FROM appointments WHERE tenant_id = ?'
            ).bind(tenantId).first();
            const totalAppointments = totalAppointmentsResult?.count || 0;

            // Get confirmed appointments count
            const confirmedAppointmentsResult = await env.DB.prepare(
                'SELECT COUNT(*) as count FROM appointments WHERE tenant_id = ? AND status = ?'
            ).bind(tenantId, 'confirmed').first();
            const confirmedAppointments = confirmedAppointmentsResult?.count || 0;

            // Get pending appointments count
            const pendingAppointmentsResult = await env.DB.prepare(
                'SELECT COUNT(*) as count FROM appointments WHERE tenant_id = ? AND status = ?'
            ).bind(tenantId, 'pending').first();
            const pendingAppointments = pendingAppointmentsResult?.count || 0;

            // Get active services count
            const activeServicesResult = await env.DB.prepare(
                'SELECT COUNT(*) as count FROM services WHERE tenant_id = ? AND is_active = 1'
            ).bind(tenantId).first();
            const activeServices = activeServicesResult?.count || 0;

            // Get recent appointments with user and service details
            const recentAppointmentsResult = await env.DB.prepare(`
                SELECT 
                    a.id,
                    a.tenant_id,
                    u.name as user_name,
                    u.email as user_email,
                    u.phone as user_phone,
                    s.name as service_name,
                    a.scheduled_time,
                    a.status,
                    a.payment_status,
                    a.created_at
                FROM appointments a
                LEFT JOIN users u ON a.user_id = u.id
                LEFT JOIN services s ON a.service_id = s.id
                WHERE a.tenant_id = ?
                ORDER BY a.scheduled_time DESC
                LIMIT 10
            `).bind(tenantId).all();

            // Calculate total revenue from confirmed appointments
            const revenueResult = await env.DB.prepare(`
                SELECT COALESCE(SUM(s.price), 0) as total
                FROM appointments a
                LEFT JOIN services s ON a.service_id = s.id
                WHERE a.tenant_id = ? AND a.status = 'confirmed'
            `).bind(tenantId).first();
            const totalRevenue = revenueResult?.total || 0;

            return new Response(JSON.stringify({
                tenant: {
                    id: tenant.id,
                    name: tenant.name,
                    slug: tenant.slug
                },
                statistics: {
                    totalAppointments,
                    confirmedAppointments,
                    pendingAppointments,
                    totalRevenue,
                    activeServices
                },
                recentAppointments: recentAppointmentsResult.results || []
            }), {
                headers: corsHeaders
            });
        }

        // Health check endpoint
        if (path === '/api/health') {
            try {
                // Simple database connectivity check
                const dbCheck = await env.DB.prepare('SELECT 1 as health').first();

                return new Response(JSON.stringify({
                    status: 'healthy',
                    timestamp: new Date().toISOString(),
                    services: {
                        database: dbCheck ? 'operational' : 'degraded',
                        worker: 'operational'
                    },
                    version: 'e9ebc0e1-d799-4160-8747-7621f42d49ed'
                }), {
                    headers: corsHeaders
                });
            } catch (error) {
                return new Response(JSON.stringify({
                    status: 'unhealthy',
                    timestamp: new Date().toISOString(),
                    error: error instanceof Error ? error.message : 'Unknown error'
                }), {
                    status: 503,
                    headers: corsHeaders
                });
            }
        }

        // Public services endpoint
        if (path === '/api/public/services') {
            const tenantId = url.searchParams.get('tenantId');

            if (!tenantId) {
                return new Response(JSON.stringify({ error: 'TenantId required' }), {
                    status: 400,
                    headers: corsHeaders
                });
            }

            const servicesResult = await env.DB.prepare(
                'SELECT * FROM services WHERE tenant_id = ? AND is_active = 1 ORDER BY created_at ASC'
            ).bind(tenantId).all();

            return new Response(JSON.stringify({
                services: servicesResult.results || []
            }), {
                headers: corsHeaders
            });
        }

        // Products endpoint - Get products for the shop
        if (path === '/api/products') {
            try {
                const categorySlug = url.searchParams.get('category');
                let query = `
                    SELECT p.*, c.name as category_name, c.slug as category_slug 
                    FROM products p
                    LEFT JOIN product_categories c ON p.category_id = c.id
                    WHERE p.is_active = 1
                `;

                const params: any[] = [];

                if (categorySlug && categorySlug !== 'all') {
                    query += ` AND c.slug = ?`;
                    params.push(categorySlug);
                }

                query += ` ORDER BY p.created_at DESC LIMIT 100`;

                const stmt = env.DB.prepare(query);
                const productsResult = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();

                return new Response(JSON.stringify({
                    products: productsResult.results || []
                }), {
                    headers: corsHeaders
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
                    status: 500,
                    headers: corsHeaders
                });
            }
        }

        // Availability endpoint - compute available slots for a tenant on a date
        if (path.startsWith('/api/tenant/') && path.endsWith('/availability') && request.method === 'GET') {
            try {
                // path example: /api/tenant/<tenantId>/availability
                const segments = path.split('/').filter(Boolean);
                const tenantId = segments[2];
                const date = url.searchParams.get('date');
                const serviceId = url.searchParams.get('serviceId');

                if (!tenantId || !date || !serviceId) {
                    return new Response(JSON.stringify({ error: 'tenantId, date and serviceId are required' }), { status: 400, headers: corsHeaders });
                }

                const service = await env.DB.prepare('SELECT duration_minutes FROM services WHERE id = ?').bind(serviceId).first();
                if (!service) {
                    return new Response(JSON.stringify({ error: 'Service not found' }), { status: 404, headers: corsHeaders });
                }

                const slots = await getAvailability(env.DB, tenantId, date, service.duration_minutes || 60);
                return new Response(JSON.stringify({ slots }), { headers: corsHeaders });
            } catch (err) {
                console.error('Availability error:', err);
                return new Response(JSON.stringify({ error: 'Failed to calculate availability', details: err instanceof Error ? err.message : String(err) }), { status: 500, headers: corsHeaders });
            }
        }

        // Tenant schedules endpoint - create/duplicate schedules
        if (path.startsWith('/api/tenant/') && path.endsWith('/schedules') && request.method === 'POST') {
            try {
                // path example: /api/tenant/<tenantId>/schedules
                const segments = path.split('/').filter(Boolean); // ['api','tenant','<tenantId>','schedules']
                const tenantId = segments[2];
                if (!tenantId) {
                    return new Response(JSON.stringify({ success: false, error: 'tenantId missing in path' }), { status: 400, headers: corsHeaders });
                }

                const body = await request.json() as any;
                const { staffNames, schedule, serviceId } = body || {};
                const targets = (Array.isArray(staffNames) && staffNames.length > 0) ? staffNames : [null];

                for (const staffName of targets) {
                    for (const slot of schedule || []) {
                        await env.DB.prepare(`
                            INSERT INTO staff_schedules (id, tenant_id, staff_name, service_id, start_time, end_time, day_of_week, created_at, updated_at)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `).bind(
                            crypto.randomUUID(),
                            tenantId,
                            staffName,
                            serviceId,
                            slot.start,
                            slot.end,
                            slot.day,
                            Math.floor(Date.now() / 1000),
                            Math.floor(Date.now() / 1000)
                        ).run();
                    }
                }

                return new Response(JSON.stringify({ success: true, message: `Schedule updated for ${targets.length} staff members` }), { headers: corsHeaders });
            } catch (err) {
                console.error('Schedules error:', err);
                return new Response(JSON.stringify({ success: false, error: 'Failed to create schedules', details: err instanceof Error ? err.message : String(err) }), { status: 500, headers: corsHeaders });
            }
        }


        // API endpoint not found
        return new Response(JSON.stringify({ error: 'API endpoint not found' }), {
            status: 404,
            headers: corsHeaders
        });

    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

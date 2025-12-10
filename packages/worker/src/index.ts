// Root route - serve InStyle landing page with updated branding
if (path === '/' || path === '/instyle' || path === '/instylehairboutique' || path === '/book/instylehairboutique') {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InStyle Hair Boutique | Premium Hair Services Cape Town</title>
    <meta name="description" content="InStyle Hair Boutique - Premium hair installations, styling, and products in Cape Town. Transform your look with our expert services.">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#8B4513',
                        secondary: '#D2691E',
                        accent: '#F59E0B'
                    }
                }
            }
        }
    </script>
    <style>
        .bg-gradient-radial {
            background: radial-gradient(circle, var(--tw-gradient-stops));
        }
    </style>
</head>
<body class="bg-gradient-to-br from-orange-50 via-amber-50 to-stone-50 font-sans">
    <div class="min-h-screen">
        <!-- Hero Section -->
        <div class="relative pt-20 pb-32 px-4 overflow-hidden">
            <div class="absolute inset-0 z-0 opacity-10">
                <div class="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl bg-gradient-radial from-primary to-transparent"></div>
                <div class="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl bg-gradient-radial from-secondary to-transparent"></div>
            </div>
            <div class="container mx-auto max-w-4xl relative z-10 text-center">
                <h1 class="text-4xl md:text-6xl font-bold font-serif mb-6 text-gray-900">
                    Transform Your Look With<br>
                    <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Premium Hair Services</span>
                </h1>
                <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                    Experience the finest hair treatments, extensions, and styling from South Africa's leading boutique. Where elegance meets expertise.
                </p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="#booking" class="px-8 py-4 bg-primary text-white font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">📅 Book Appointment</a>
                    <a href="https://wa.me/27699171527" target="_blank" class="px-8 py-4 bg-green-600 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">💬 Chat on WhatsApp</a>
                </div>
            </div>
        </div>
        <!-- Services Section -->
        <div class="py-20 bg-white">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold font-serif mb-4 text-gray-900">Our Premium Services</h2>
                    <p class="text-gray-600">Professional hair treatments tailored to your unique needs</p>
                </div>
                <div id="services-grid" class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="text-center py-8">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p class="mt-4 text-gray-500">Loading services...</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- Booking Section -->
        <div id="booking" class="py-20 bg-gradient-to-br from-primary to-amber-900 text-white">
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold font-serif mb-4">Book Your Appointment</h2>
                    <p class="text-white/80 max-w-2xl mx-auto">Ready to transform your look? Fill in the form below.</p>
                </div>
                <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto text-gray-800">
                    <form id="booking-form" class="space-y-4">
                        <input type="text" id="name" placeholder="Full Name" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent">
                        <input type="email" id="email" placeholder="Email" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent">
                        <input type="tel" id="phone" placeholder="Phone Number" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent">
                        <select id="service" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value="">Select a Service</option>
                        </select>
                        <input type="date" id="date" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent">
                        <select id="time" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value="">Select Time</option>
                            <option value="09:00">09:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="15:00">03:00 PM</option>
                            <option value="16:00">04:00 PM</option>
                        </select>
                        <textarea id="notes" rows="3" placeholder="Special Requests (Optional)" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
                        <button type="submit" class="w-full bg-primary text-white py-4 px-6 rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg">Confirm Booking</button>
                    </form>
                </div>
            </div>
        </div>
        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-12">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 class="text-xl font-bold mb-4 text-secondary">InStyle Hair Boutique</h3>
                        <p class="text-gray-400 text-sm">Premium hair services and products in Cape Town.</p>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold mb-4">Contact</h3>
                        <p class="text-gray-400 text-sm">📞 +27 69 917 1527</p>
                        <p class="text-gray-400 text-sm">📧 info@instylehairboutique.co.za</p>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold mb-4">Follow Us</h3>
                        <div class="flex gap-4">
                            <a href="#" class="text-gray-400 hover:text-primary transition-colors">Instagram</a>
                            <a href="#" class="text-gray-400 hover:text-primary transition-colors">Facebook</a>
                        </div>
                    </div>
                </div>
                <div class="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; 2024 InStyle Hair Boutique. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
    <script>
        const TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
        async function loadServices() {
            try {
                const response = await fetch('/api/tenant?slug=instylehairboutique');
                const data = await response.json();
                const grid = document.getElementById('services-grid');
                const select = document.getElementById('service');
                grid.innerHTML = '';
                select.innerHTML = '<option value="">Select a Service</option>';
                data.services.forEach(service => {
                    const card = document.createElement('div');
                    card.className = 'bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100';
                    card.innerHTML = \`<div class="p-6"><span class="text-xs font-semibold text-secondary">\${service.category || 'Hair Service'}</span><h3 class="text-xl font-bold mt-2 mb-2 text-gray-900">\${service.name}</h3><p class="text-sm text-gray-600 mb-4">\${service.description || ''}</p><div class="flex items-center justify-between"><span class="text-2xl font-bold text-primary">R\${(service.price / 100).toFixed(0)}</span><span class="text-sm text-gray-500">\${service.duration_minutes} min</span></div></div>\`;
                    grid.appendChild(card);
                    const option = document.createElement('option');
                    option.value = service.id;
                    option.textContent = \`\${service.name} - R\${(service.price / 100).toFixed(0)}\`;
                    select.appendChild(option);
                });
            } catch (error) {
                console.error('Error loading services:', error);
                document.getElementById('services-grid').innerHTML = '<p class="text-center col-span-3 text-gray-500">Unable to load services. Please try again later.</p>';
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
                        scheduledTime: \`\${document.getElementById('date').value}T\${document.getElementById('time').value}:00Z\`,
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
    </script>
</body>
</html>`;
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      ...corsHeaders
    }
  });
}

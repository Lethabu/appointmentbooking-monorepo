// Service Worker for Performance Optimization and Caching
const CACHE_NAME = 'booking-app-v1.0.0';
const RUNTIME_CACHE = 'runtime-cache-v1';
const STATIC_CACHE = 'static-cache-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/offline',
    '/manifest.json',
    '/favicon.ico',
    // Add other critical assets
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
    /^\/api\/services/,
    /^\/api\/employees/,
    /^\/api\/availability/,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Failed to cache static assets', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle different types of requests with appropriate caching strategies
    if (isStaticAsset(request)) {
        // Static assets - Cache First strategy
        event.respondWith(cacheFirst(request));
    } else if (isAPIRequest(request)) {
        // API requests - Network First with cache fallback
        event.respondWith(networkFirst(request));
    } else if (isPageRequest(request)) {
        // Page requests - Stale While Revalidate
        event.respondWith(staleWhileRevalidate(request));
    } else {
        // Default - Network First
        event.respondWith(networkFirst(request));
    }
});

// Cache First strategy - for static assets
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('Cache First failed:', error);
        return new Response('Network error', { status: 503 });
    }
}

// Network First strategy - for API requests
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok && isAPIRequest(request)) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            const offlinePage = await caches.match('/offline');
            if (offlinePage) {
                return offlinePage;
            }
        }

        return new Response('Network error and no cache available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Stale While Revalidate strategy - for pages
async function staleWhileRevalidate(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cachedResponse = await cache.match(request);

    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch((error) => {
        console.error('Network request failed:', error);
    });

    // Return cached version immediately if available, otherwise wait for network
    return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticAsset(request) {
    const url = new URL(request.url);
    return (
        url.pathname.startsWith('/_next/') ||
        url.pathname.startsWith('/static/') ||
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
    );
}

function isAPIRequest(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/api/');
}

function isPageRequest(request) {
    return request.mode === 'navigate' && !isAPIRequest(request);
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync-booking') {
        console.log('Service Worker: Background sync booking data');
        event.waitUntil(syncBookingData());
    }
});

async function syncBookingData() {
    try {
        // Get pending bookings from IndexedDB or cache
        const pendingBookings = await getPendingBookings();

        for (const booking of pendingBookings) {
            try {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(booking),
                });

                if (response.ok) {
                    await removePendingBooking(booking.id);
                }
            } catch (error) {
                console.error('Failed to sync booking:', error);
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Performance monitoring in service worker
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_CACHE_STATUS') {
        getCacheStatus().then((status) => {
            event.ports[0].postMessage(status);
        });
    }
});

async function getCacheStatus() {
    const cacheNames = await caches.keys();
    const cacheStatus = {};

    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        cacheStatus[cacheName] = keys.length;
    }

    return {
        caches: cacheStatus,
        timestamp: Date.now(),
    };
}

// Push notification handling
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            data: data.data,
            actions: [
                {
                    action: 'open',
                    title: 'Open App',
                },
                {
                    action: 'close',
                    title: 'Close',
                },
            ],
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('Service Worker: Loaded and ready');
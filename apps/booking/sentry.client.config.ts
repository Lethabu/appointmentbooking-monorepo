import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1, // 10% of transactions for client-side

    // Release tracking
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

    // User context (automatically captures user ID if authenticated)
    beforeSend(event, hint) {
        // Filter out sensitive data
        if (event.request) {
            delete event.request.cookies;
            delete event.request.headers?.authorization;
            delete event.request.headers?.['x-api-key'];
        }
        return event;
    },

    // Ignore known errors
    ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'NetworkError when attempting to fetch resource', // Common network issues
        'The operation was aborted', // AbortController errors
    ],

    // Configure which URLs to track
    allowUrls: [
        /https?:\/\/.*\.instylehairboutique\.co\.za/,
        /https?:\/\/localhost/,
        // Add other allowed domains as needed
    ],

    // Only trace specific routes to reduce data
    tracePropagationTargets: [
        'instylehairboutique.co.za',
        'localhost'
    ],

    // Performance monitoring for specific components
    integrations: [
        Sentry.browserTracingIntegration(),
    ],
});

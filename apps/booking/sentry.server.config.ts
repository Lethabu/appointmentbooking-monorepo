import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1, // Lower sample rate for server-side to control costs

    // Release tracking
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

    // Server-specific integrations
    integrations: [
        Sentry.httpIntegration(), // HTTP request tracing
        Sentry.consoleIntegration(), // Console log capture
    ],

    // Before sending events to Sentry
    beforeSend(event, hint) {
        // Filter sensitive server data
        if (event.request) {
            // Remove headers that might contain sensitive data
            const headers = event.request.headers;
            if (headers) {
                delete headers.authorization;
                delete headers['x-api-key'];
                delete headers['x-auth-token'];
                delete headers.cookie;
            }

            // Don't capture request body for performance and privacy
            if (event.request.data) {
                event.request.data = '[FILTERED - Request body removed for privacy]';
            }
        }

        // Add context tags
        if (event.tags) {
            // These will help with filtering and alerting
            event.tags.tenant = 'instyle';
            event.tags.service = 'booking-app';
        }

        return event;
    },

    // Ignore common non-actionable errors
    ignoreErrors: [
        'ECONNREFUSED', // Connection refused - network issues
        'ENOTFOUND', // DNS resolution failed
        'ETIMEDOUT', // Request timeout
        'Aborted', // Request aborted
        /^Error: fetch failed$/, // Generic fetch errors
        /^TypeError: fetch failed$/, // Fetch failures
    ],

    // Custom error sampling based on error type
    beforeSendTransaction(event) {
        // Only sample a small percentage of performance transactions
        // to control costs while maintaining observability
        if (Math.random() > 0.05) { // 5% sampling rate for transactions
            return null;
        }
        return event;
    },
});

// Export for use in API routes
export { Sentry };

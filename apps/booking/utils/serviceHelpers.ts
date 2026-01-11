/**
 * Utility functions for service-related operations
 */

/**
 * Get service image based on service name
 * @param name - Service name to match against patterns
 * @returns Image URL for the service
 */
export const getServiceImage = (name: string): string => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('install')) {
        return "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80";
    }

    if (lowerName.includes('maphondo') || lowerName.includes('braid')) {
        return "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80";
    }

    if (lowerName.includes('makeup') || lowerName.includes('glam')) {
        return "https://images.unsplash.com/photo-1487412947132-232984567455?auto=format&fit=crop&w=800&q=80";
    }

    if (lowerName.includes('ponytail')) {
        return "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80";
    }

    // Default image for unknown services
    return "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80";
};

/**
 * Get service badge based on service name
 * @param name - Service name to match against patterns
 * @returns Badge text or null
 */
export const getServiceBadge = (name: string): string | null => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('middle') || lowerName.includes('side')) {
        return "Popular";
    }

    if (lowerName.includes('maphondo')) {
        return "Signature";
    }

    if (lowerName.includes('frontal')) {
        return "Premium";
    }

    return null;
};

/**
 * Format service price from cents to Rands
 * @param priceInCents - Price in cents
 * @returns Formatted price string
 */
export const formatServicePrice = (priceInCents: number): string => {
    return `R${(priceInCents / 100).toFixed(0)}`;
};

/**
 * Format product price from cents to Rands
 * @param priceInCents - Price in cents
 * @returns Formatted price string
 */
export const formatProductPrice = (priceInCents: number): string => {
    return `R${(priceInCents / 100).toFixed(0)}`;
};
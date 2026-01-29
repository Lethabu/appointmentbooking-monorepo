// packages/worker/src/cache-layer.ts
// Simple in-memory cache layer for Cloudflare Workers
// Reduces database queries for frequently accessed data

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

class WorkerCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Get item from cache if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set item in cache with TTL
   */
  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  /**
   * Clear expired entries (can be called periodically)
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size (for monitoring)
   */
  size(): number {
    return this.cache.size;
  }
}

// Singleton instance for the Worker
export const workerCache = new WorkerCache();

/**
 * Cache wrapper for database query results
 * Usage: await cachedQuery('key', ttlMs, async () => queryFn())
 */
export async function cachedQuery<T>(
  cacheKey: string,
  ttlMs: number,
  queryFn: () => Promise<T>
): Promise<T> {
  // Try cache first
  const cached = workerCache.get<T>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // Execute query
  const result = await queryFn();

  // Store in cache
  workerCache.set(cacheKey, result, ttlMs);

  return result;
}

/**
 * Cache key generator for pricing tiers
 */
export function pricingCacheKey(countryCode: string): string {
  return `pricing:${countryCode}:v1`;
}

/**
 * Cache key generator for impact metrics
 */
export function impactMetricsCacheKey(tenantId: string): string {
  return `impact:${tenantId}:v1`;
}

/**
 * Cache key generator for formalization scores
 */
export function formalizationCacheKey(tenantId: string): string {
  return `formalization:${tenantId}:v1`;
}

/**
 * Cache invalidation helper
 */
export function invalidateCache(pattern: string): void {
  for (const key of Array.from(workerCache['cache'].keys())) {
    if (key.includes(pattern)) {
      workerCache['cache'].delete(key);
    }
  }
}

/**
 * Cache health check
 */
export function getCacheStats(): {
  size: number;
  health: string;
} {
  return {
    size: workerCache.size(),
    health: workerCache.size() > 1000 ? 'WARN_HIGH_MEMORY' : 'HEALTHY',
  };
}

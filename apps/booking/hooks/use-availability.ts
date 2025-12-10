/**
 * React hook for employee availability - Edge Runtime Compatible
 * Complies with Constitution: No Context Principle (max 3 files per task)
 * No forbidden libraries, uses native fetch
 */

import { useState, useEffect, useCallback } from 'react';

// Types matching the availability API response
export interface AvailabilitySlot {
  start: string;
  end: string;
  available: boolean;
  duration_minutes: number;
}

export interface AvailabilityData {
  employeeId: string;
  date: string;
  slots: AvailabilitySlot[];
  working_hours: {
    start: number;
    end: number;
    day_of_week: number;
  };
  last_updated: number;
  has_individual_schedule: boolean;
}

export interface UseAvailabilityReturn {
  data: AvailabilityData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch employee availability with auto-refresh
 * Stateless architecture for horizontal scaling
 */
export function useAvailability(
  employeeId: string | null,
  date: string | null,
  options: {
    autoRefresh?: boolean;
    refreshInterval?: number;
    maxRetries?: number;
  } = {}
): UseAvailabilityReturn {
  const {
    autoRefresh = true,
    refreshInterval = 30 * 1000, // 30 seconds (matches SuperSaaS polling)
    maxRetries = 3
  } = options;

  const [data, setData] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Fetch availability from API
  const fetchAvailability = useCallback(async () => {
    if (!employeeId || !date) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
      const url = new URL(`${apiBaseUrl}/api/availability`);
      url.searchParams.set('employeeId', employeeId);
      url.searchParams.set('date', date);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        // Keep simple for Edge Runtime compatibility (no AbortController)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));

        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before trying again.');
        } else if (response.status === 404) {
          throw new Error('Employee not found or unavailable.');
        } else if (response.status >= 500) {
          throw new Error('Server temporarily unavailable. Please try again later.');
        } else {
          throw new Error(errorData.error || `Request failed: ${response.status}`);
        }
      }

      const availabilityData: AvailabilityData = await response.json();
      setData(availabilityData);
      setRetryCount(0); // Reset retry count on success

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load availability';
      setError(errorMessage);
      console.error('Availability fetch error:', err);

      // Auto-retry logic for transient failures
      if (retryCount < maxRetries && (
        errorMessage.includes('temporarily unavailable') ||
        errorMessage.includes('fetch')
      )) {
        setRetryCount(prev => prev + 1);
        setTimeout(fetchAvailability, 1000 * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      setLoading(false);
    }
  }, [employeeId, date, retryCount, maxRetries]);

  // Trigger refetch function
  const refetch = useCallback(() => {
    setError(null);
    fetchAvailability();
  }, [fetchAvailability]);

  // Initial fetch and auto-refresh effect
  useEffect(() => {
    if (!employeeId || !date) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    fetchAvailability();

    let intervalId: NodeJS.Timeout | null = null;

    if (autoRefresh) {
      intervalId = setInterval(fetchAvailability, refreshInterval);
    }

    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [employeeId, date, autoRefresh, refreshInterval, fetchAvailability]);

  return {
    data,
    loading,
    error,
    refetch
  };
}

/**
 * Hook to check specific slot availability
 * Optimized for performance with memoization
 */
export function useSlotAvailability(
  employeeId: string | null,
  startTime: string | null,
  endTime: string | null
): boolean | null {
  const [availability] = useState<Map<string, boolean>>(new Map());

  // This would typically use the main availability hook
  // Simplified version for this implementation
  const date = startTime ? new Date(startTime).toISOString().split('T')[0] : null;
  const { data, loading } = useAvailability(employeeId, date, { autoRefresh: false });

  useEffect(() => {
    if (data && startTime && endTime) {
      const slot = data.slots.find(
        s => s.start === startTime && s.end === endTime
      );

      if (slot) {
        availability.set(`${employeeId}-${startTime}-${endTime}`, slot.available);
      }
    }
  }, [data, employeeId, startTime, endTime, availability]);

  if (!startTime || !endTime || loading) {
    return null;
  }

  return availability.get(`${employeeId}-${startTime}-${endTime}`) ?? null;
}

/**
 * Utility hook to get next available slot
 * Helps with user experience by suggesting alternatives
 */
export function useNextAvailableSlot(employeeId: string | null, date: string | null): string | null {
  const { data } = useAvailability(employeeId, date, { autoRefresh: false });

  if (!data || data.slots.length === 0) {
    return null;
  }

  // Find next available slot
  const now = new Date();
  const nextSlot = data.slots
    .filter(slot => slot.available && new Date(slot.start) > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0];

  return nextSlot?.start || null;
}

'use client';

import { useEffect, useState } from 'react';

interface MobileBookingAnalytics {
    sessionId: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    bookingStarted: boolean;
    bookingCompleted: boolean;
    stepReached: number;
    timeSpent: number;
    errors: string[];
    performanceMetrics: {
        loadTime: number;
        interactionLatency: number;
        formSubmissionTime: number;
    };
    funnelSteps: {
        step: string;
        timestamp: number;
        duration: number;
        success: boolean;
        error?: string;
    }[];
}

interface BookingFunnelEvent {
    event: 'step_view' | 'step_complete' | 'step_error' | 'booking_complete' | 'booking_abandon';
    step: number;
    stepName: string;
    timestamp: number;
    data?: Record<string, any>;
}

class MobileBookingAnalyticsTracker {
    private sessionData: MobileBookingAnalytics;
    private events: BookingFunnelEvent[] = [];
    private startTime: number;

    constructor() {
        this.startTime = Date.now();
        this.sessionData = {
            sessionId: this.generateSessionId(),
            deviceType: this.detectDeviceType(),
            bookingStarted: false,
            bookingCompleted: false,
            stepReached: 0,
            timeSpent: 0,
            errors: [],
            performanceMetrics: {
                loadTime: 0,
                interactionLatency: 0,
                formSubmissionTime: 0,
            },
            funnelSteps: [],
        };
    }

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
        if (typeof window === 'undefined') return 'desktop';

        const userAgent = navigator.userAgent;
        const screenWidth = window.screen.width;

        if (/iPad|Android.*tablet/i.test(userAgent) || (screenWidth >= 768 && screenWidth < 1024)) {
            return 'tablet';
        } else if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile/i.test(userAgent) || screenWidth < 768) {
            return 'mobile';
        }

        return 'desktop';
    }

    private measureLoadTime(): number {
        if (typeof window === 'undefined' || !window.performance) return 0;

        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return navigation ? navigation.loadEventEnd - navigation.fetchStart : 0;
    }

    private measureInteractionLatency(action: string): number {
        const start = performance.now();
        const latency = performance.now() - start;
        this.sessionData.performanceMetrics.interactionLatency = Math.max(
            this.sessionData.performanceMetrics.interactionLatency,
            latency
        );
        return latency;
    }

    public trackStepView(step: number, stepName: string): void {
        const timestamp = Date.now();
        const stepStartTime = timestamp - this.startTime;

        this.events.push({
            event: 'step_view',
            step,
            stepName,
            timestamp,
        });

        this.sessionData.stepReached = Math.max(this.sessionData.stepReached, step);

        if (!this.sessionData.bookingStarted) {
            this.sessionData.bookingStarted = true;
            this.sessionData.performanceMetrics.loadTime = this.measureLoadTime();
        }

        this.sessionData.funnelSteps.push({
            step: stepName,
            timestamp,
            duration: stepStartTime,
            success: true,
        });
    }

    public trackStepComplete(step: number, stepName: string, duration: number): void {
        const timestamp = Date.now();

        this.events.push({
            event: 'step_complete',
            step,
            stepName,
            timestamp,
        });

        // Update the funnel step
        const existingStepIndex = this.sessionData.funnelSteps.findIndex(s => s.step === stepName);
        if (existingStepIndex >= 0) {
            this.sessionData.funnelSteps[existingStepIndex] = {
                step: stepName,
                timestamp,
                duration,
                success: true,
            };
        }
    }

    public trackStepError(step: number, stepName: string, error: string): void {
        const timestamp = Date.now();

        this.events.push({
            event: 'step_error',
            step,
            stepName,
            timestamp,
            data: { error },
        });

        this.sessionData.errors.push(`${stepName}: ${error}`);

        // Update the funnel step as failed
        const existingStepIndex = this.sessionData.funnelSteps.findIndex(s => s.step === stepName);
        if (existingStepIndex >= 0) {
            this.sessionData.funnelSteps[existingStepIndex] = {
                step: stepName,
                timestamp,
                duration: 0,
                success: false,
                error,
            };
        }
    }

    public trackBookingComplete(): void {
        const timestamp = Date.now();

        this.events.push({
            event: 'booking_complete',
            step: 5,
            stepName: 'completion',
            timestamp,
        });

        this.sessionData.bookingCompleted = true;
        this.sessionData.timeSpent = timestamp - this.startTime;
    }

    public trackBookingAbandon(reason?: string): void {
        const timestamp = Date.now();

        this.events.push({
            event: 'booking_abandon',
            step: this.sessionData.stepReached,
            stepName: 'abandonment',
            timestamp,
            data: { reason },
        });

        this.sessionData.timeSpent = timestamp - this.startTime;
    }

    public getSessionData(): MobileBookingAnalytics {
        return { ...this.sessionData };
    }

    public getConversionRate(): number {
        return this.sessionData.bookingStarted
            ? (this.sessionData.bookingCompleted ? 1 : 0)
            : 0;
    }

    public getStepCompletionRate(step: number): number {
        const stepEvents = this.events.filter(e => e.step === step);
        const completedEvents = stepEvents.filter(e => e.event === 'step_complete');

        return stepEvents.length > 0 ? completedEvents.length / stepEvents.length : 0;
    }

    public getAverageTimeToComplete(step: number): number {
        const completedSteps = this.sessionData.funnelSteps.filter(s =>
            s.step.toLowerCase().includes(step.toString()) && s.success
        );

        return completedSteps.length > 0
            ? completedSteps.reduce((sum, step) => sum + step.duration, 0) / completedSteps.length
            : 0;
    }

    public getDropOffRate(): number {
        if (!this.sessionData.bookingStarted) return 0;
        return this.sessionData.bookingCompleted ? 0 : 1;
    }

    public getErrorRate(): number {
        const totalSteps = this.sessionData.funnelSteps.length;
        const errorSteps = this.sessionData.funnelSteps.filter(s => !s.success).length;

        return totalSteps > 0 ? errorSteps / totalSteps : 0;
    }

    public async sendAnalytics(endpoint: string = '/api/analytics'): Promise<void> {
        try {
            await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionData: this.sessionData,
                    events: this.events,
                    deviceInfo: {
                        userAgent: navigator.userAgent,
                        screenSize: `${window.screen.width}x${window.screen.height}`,
                        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
                        pixelRatio: window.devicePixelRatio,
                        touchSupport: 'ontouchstart' in window,
                    },
                }),
            });
        } catch (error) {
            console.error('Failed to send analytics:', error);
        }
    }
}

// React Hook for Mobile Booking Analytics
export function useMobileBookingAnalytics() {
    const [analytics] = useState(() => new MobileBookingAnalyticsTracker());
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden);
        };

        const handleBeforeUnload = () => {
            analytics.trackBookingAbandon('page_unload');
            analytics.sendAnalytics();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [analytics]);

    // Auto-send analytics periodically
    useEffect(() => {
        const interval = setInterval(() => {
            if (analytics.getSessionData().bookingStarted && !analytics.getSessionData().bookingCompleted) {
                analytics.sendAnalytics();
            }
        }, 30000); // Send every 30 seconds

        return () => clearInterval(interval);
    }, [analytics]);

    return {
        trackStepView: analytics.trackStepView.bind(analytics),
        trackStepComplete: analytics.trackStepComplete.bind(analytics),
        trackStepError: analytics.trackStepError.bind(analytics),
        trackBookingComplete: analytics.trackBookingComplete.bind(analytics),
        trackBookingAbandon: analytics.trackBookingAbandon.bind(analytics),
        getConversionRate: analytics.getConversionRate.bind(analytics),
        getStepCompletionRate: analytics.getStepCompletionRate.bind(analytics),
        getAverageTimeToComplete: analytics.getAverageTimeToComplete.bind(analytics),
        getDropOffRate: analytics.getDropOffRate.bind(analytics),
        getErrorRate: analytics.getErrorRate.bind(analytics),
        getSessionData: analytics.getSessionData.bind(analytics),
        isVisible,
    };
}

// Utility functions for testing
export const createMockAnalyticsSession = (): MobileBookingAnalytics => {
    return {
        sessionId: 'mock_session_123',
        deviceType: 'mobile',
        bookingStarted: true,
        bookingCompleted: true,
        stepReached: 5,
        timeSpent: 180000, // 3 minutes
        errors: [],
        performanceMetrics: {
            loadTime: 1500,
            interactionLatency: 200,
            formSubmissionTime: 800,
        },
        funnelSteps: [
            { step: 'service_selection', timestamp: Date.now(), duration: 15000, success: true },
            { step: 'date_time_selection', timestamp: Date.now(), duration: 30000, success: true },
            { step: 'customer_details', timestamp: Date.now(), duration: 45000, success: true },
            { step: 'confirmation', timestamp: Date.now(), duration: 20000, success: true },
            { step: 'completion', timestamp: Date.now(), duration: 1000, success: true },
        ],
    };
};

export const calculateMobileMetrics = (sessions: MobileBookingAnalytics[]) => {
    const totalSessions = sessions.length;
    const completedBookings = sessions.filter(s => s.bookingCompleted).length;
    const conversionRate = totalSessions > 0 ? completedBookings / totalSessions : 0;

    const averageTimeToComplete = sessions
        .filter(s => s.bookingCompleted)
        .reduce((sum, s) => sum + s.timeSpent, 0) / completedBookings || 0;

    const stepDropOffRates = [1, 2, 3, 4].map(step => {
        const reachedStep = sessions.filter(s => s.stepReached >= step).length;
        const reachedNextStep = sessions.filter(s => s.stepReached >= step + 1).length;
        return reachedStep > 0 ? (reachedStep - reachedNextStep) / reachedStep : 0;
    });

    const errorRates = sessions.map(s => s.errors.length / Math.max(s.funnelSteps.length, 1));
    const averageErrorRate = errorRates.reduce((sum, rate) => sum + rate, 0) / errorRates.length || 0;

    return {
        conversionRate,
        averageTimeToComplete,
        stepDropOffRates,
        averageErrorRate,
        totalSessions,
        completedBookings,
    };
};
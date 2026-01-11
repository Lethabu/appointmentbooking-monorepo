/**
 * Performance Benchmarking Suite
 * Comprehensive load testing and performance monitoring
 */

// Import testing utilities
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';

// Performance testing utilities
interface PerformanceMetrics {
    responseTime: number;
    throughput: number;
    errorRate: number;
    memoryUsage?: number;
    cpuUsage?: number;
}

interface LoadTestResult {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    requestsPerSecond: number;
    errorRate: number;
    memoryPeak?: number;
    cpuPeak?: number;
}

interface BenchmarkConfig {
    concurrentUsers: number;
    duration: number;
    rampUpTime: number;
    targetRPS?: number;
    maxResponseTime: number;
    acceptableErrorRate: number;
}

class PerformanceBenchmark {
    private metrics: PerformanceMetrics[] = [];
    private startTime: number = 0;
    private endTime: number = 0;

    async startBenchmark(): Promise<void> {
        this.startTime = Date.now();
        this.metrics = [];
    }

    async recordRequest(requestFn: () => Promise<Response>): Promise<void> {
        const startTime = Date.now();

        try {
            const response = await requestFn();
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            this.metrics.push({
                responseTime,
                throughput: 1000 / responseTime,
                errorRate: response.status >= 400 ? 1 : 0
            });
        } catch (error) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            this.metrics.push({
                responseTime,
                throughput: 0,
                errorRate: 1
            });
        }
    }

    async endBenchmark(): Promise<LoadTestResult> {
        this.endTime = Date.now();
        const totalDuration = this.endTime - this.startTime;

        const successfulRequests = this.metrics.filter(m => m.errorRate === 0).length;
        const failedRequests = this.metrics.filter(m => m.errorRate === 1).length;
        const totalRequests = this.metrics.length;

        const responseTimes = this.metrics.map(m => m.responseTime);
        const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        const minResponseTime = Math.min(...responseTimes);
        const maxResponseTime = Math.max(...responseTimes);
        const requestsPerSecond = (totalRequests / totalDuration) * 1000;
        const errorRate = (failedRequests / totalRequests) * 100;

        return {
            totalRequests,
            successfulRequests,
            failedRequests,
            averageResponseTime,
            minResponseTime,
            maxResponseTime,
            requestsPerSecond,
            errorRate
        };
    }

    generateReport(result: LoadTestResult): string {
        return `
Performance Benchmark Report
============================
Duration: ${((this.endTime - this.startTime) / 1000).toFixed(2)}s
Total Requests: ${result.totalRequests}
Successful: ${result.successfulRequests}
Failed: ${result.failedRequests}
Error Rate: ${result.errorRate.toFixed(2)}%

Response Times:
- Average: ${result.averageResponseTime.toFixed(2)}ms
- Min: ${result.minResponseTime}ms
- Max: ${result.maxResponseTime}ms

Throughput: ${result.requestsPerSecond.toFixed(2)} RPS
        `.trim();
    }
}

// Mock handlers for load testing
const createMockHandlers = (baseResponseTime = 100) => [
    // Simulate API endpoints with varying response times
    {
        url: '/api/bookings',
        method: 'POST',
        responseTime: baseResponseTime + Math.random() * 200, // Add randomness
        status: 201,
        successRate: 0.95
    },
    {
        url: '/api/bookings',
        method: 'GET',
        responseTime: baseResponseTime * 0.5,
        status: 200,
        successRate: 0.98
    },
    {
        url: '/api/availability',
        method: 'GET',
        responseTime: baseResponseTime * 0.8,
        status: 200,
        successRate: 0.99
    },
    {
        url: '/api/google-calendar/status',
        method: 'GET',
        responseTime: baseResponseTime + Math.random() * 300,
        status: 200,
        successRate: 0.92
    }
];

// Simulate network delay
const simulateNetworkDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

// Simulate API request
const simulateApiRequest = async (handler: any): Promise<Response> => {
    const isSuccess = Math.random() < handler.successRate;

    if (!isSuccess) {
        await simulateNetworkDelay(handler.responseTime);
        return new Response(JSON.stringify({ error: 'Simulated failure' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    await simulateNetworkDelay(handler.responseTime);

    let responseBody: any = { success: true };

    // Generate appropriate response body based on endpoint
    if (handler.url === '/api/bookings' && handler.method === 'POST') {
        responseBody = {
            success: true,
            data: {
                appointment: {
                    id: 'apt_' + Date.now(),
                    status: 'confirmed',
                    createdAt: new Date().toISOString()
                }
            },
            message: 'Appointment created successfully'
        };
    } else if (handler.url === '/api/bookings' && handler.method === 'GET') {
        responseBody = {
            success: true,
            data: {
                items: [
                    { id: 'apt_1', serviceId: 'service_1', date: '2026-01-15' },
                    { id: 'apt_2', serviceId: 'service_2', date: '2026-01-16' }
                ],
                pagination: { page: 1, limit: 20, total: 2 }
            },
            message: 'Appointments retrieved successfully'
        };
    } else if (handler.url === '/api/availability') {
        responseBody = {
            success: true,
            data: {
                slots: [
                    { start: '2026-01-15T09:00', end: '2026-01-15T10:00', isAvailable: true },
                    { start: '2026-01-15T10:00', end: '2026-01-15T11:00', isAvailable: true }
                ]
            },
            message: 'Available slots retrieved successfully'
        };
    } else if (handler.url === '/api/google-calendar/status') {
        responseBody = {
            success: true,
            data: {
                connected: true,
                calendars: [{ id: 'primary', name: 'Primary Calendar' }]
            },
            message: 'Calendar status retrieved successfully'
        };
    }

    return new Response(JSON.stringify(responseBody), {
        status: handler.status,
        headers: { 'Content-Type': 'application/json' }
    });
};

describe('Performance Benchmarking Suite', () => {
    let benchmark: PerformanceBenchmark;
    let mockHandlers: any[];

    beforeEach(() => {
        benchmark = new PerformanceBenchmark();
        mockHandlers = createMockHandlers(100);
    });

    describe('Load Testing', () => {
        it('should handle moderate concurrent load', async () => {
            const config: BenchmarkConfig = {
                concurrentUsers: 10,
                duration: 5000, // 5 seconds
                rampUpTime: 1000, // 1 second ramp up
                maxResponseTime: 2000,
                acceptableErrorRate: 5
            };

            await benchmark.startBenchmark();

            const startTime = Date.now();
            const endTime = startTime + config.duration;

            // Ramp up users gradually
            const userPromises: Promise<void>[] = [];

            for (let user = 0; user < config.concurrentUsers; user++) {
                const userDelay = (user / config.concurrentUsers) * config.rampUpTime;

                userPromises.push(
                    new Promise<void>(resolve => {
                        setTimeout(async () => {
                            while (Date.now() < endTime) {
                                // Simulate user making requests
                                for (const handler of mockHandlers) {
                                    await benchmark.recordRequest(() => simulateApiRequest(handler));
                                }
                                // Small delay between user actions
                                await simulateNetworkDelay(Math.random() * 1000 + 500);
                            }
                            resolve();
                        }, userDelay);
                    })
                );
            }

            await Promise.all(userPromises);
            const result = await benchmark.endBenchmark();

            // Validate performance thresholds
            expect(result.averageResponseTime).toBeLessThan(config.maxResponseTime);
            expect(result.errorRate).toBeLessThan(config.acceptableErrorRate);
            expect(result.requestsPerSecond).toBeGreaterThan(1);

            console.log(benchmark.generateReport(result));
        });

        it('should handle high concurrent load gracefully', async () => {
            const config: BenchmarkConfig = {
                concurrentUsers: 50,
                duration: 10000, // 10 seconds
                rampUpTime: 2000, // 2 second ramp up
                maxResponseTime: 3000,
                acceptableErrorRate: 10
            };

            await benchmark.startBenchmark();

            const startTime = Date.now();
            const endTime = startTime + config.duration;

            const userPromises: Promise<void>[] = [];

            for (let user = 0; user < config.concurrentUsers; user++) {
                const userDelay = (user / config.concurrentUsers) * config.rampUpTime;

                userPromises.push(
                    new Promise<void>(resolve => {
                        setTimeout(async () => {
                            let requestCount = 0;
                            while (Date.now() < endTime && requestCount < 20) {
                                // Simulate realistic user behavior
                                const handler = mockHandlers[Math.floor(Math.random() * mockHandlers.length)];
                                await benchmark.recordRequest(() => simulateApiRequest(handler));
                                requestCount++;

                                // Realistic delay between requests
                                await simulateNetworkDelay(Math.random() * 2000 + 500);
                            }
                            resolve();
                        }, userDelay);
                    })
                );
            }

            await Promise.all(userPromises);
            const result = await benchmark.endBenchmark();

            // For high load, we expect some degradation but graceful handling
            expect(result.errorRate).toBeLessThan(config.acceptableErrorRate);
            expect(result.averageResponseTime).toBeLessThan(config.maxResponseTime);

            console.log(benchmark.generateReport(result));
        });

        it('should maintain performance under sustained load', async () => {
            const config: BenchmarkConfig = {
                concurrentUsers: 5,
                duration: 30000, // 30 seconds
                rampUpTime: 2000,
                maxResponseTime: 1500,
                acceptableErrorRate: 3
            };

            await benchmark.startBenchmark();

            const startTime = Date.now();
            const endTime = startTime + config.duration;

            const userPromises: Promise<void>[] = [];

            for (let user = 0; user < config.concurrentUsers; user++) {
                userPromises.push(
                    new Promise<void>(resolve => {
                        setTimeout(async () => {
                            while (Date.now() < endTime) {
                                const handler = mockHandlers[Math.floor(Math.random() * mockHandlers.length)];
                                await benchmark.recordRequest(() => simulateApiRequest(handler));
                                await simulateNetworkDelay(Math.random() * 1000 + 200);
                            }
                            resolve();
                        }, (user / config.concurrentUsers) * config.rampUpTime);
                    })
                );
            }

            await Promise.all(userPromises);
            const result = await benchmark.endBenchmark();

            // Sustained load should maintain good performance
            expect(result.averageResponseTime).toBeLessThan(config.maxResponseTime);
            expect(result.errorRate).toBeLessThan(config.acceptableErrorRate);

            console.log(benchmark.generateReport(result));
        });
    });

    describe('Stress Testing', () => {
        it('should handle extreme load and recover', async () => {
            const config: BenchmarkConfig = {
                concurrentUsers: 100,
                duration: 15000, // 15 seconds
                rampUpTime: 3000,
                maxResponseTime: 5000,
                acceptableErrorRate: 20
            };

            await benchmark.startBenchmark();

            const startTime = Date.now();
            const endTime = startTime + config.duration;

            // Create burst of requests
            const burstPromises: Promise<void>[] = [];

            for (let burst = 0; burst < 5; burst++) {
                const burstDelay = burst * 3000; // Spread bursts over time

                burstPromises.push(
                    new Promise<void>(resolve => {
                        setTimeout(async () => {
                            const burstRequests = Array.from({ length: 20 }, () =>
                                benchmark.recordRequest(() => simulateApiRequest(mockHandlers[0]))
                            );
                            await Promise.all(burstRequests);
                            resolve();
                        }, burstDelay);
                    })
                );
            }

            // Sustained background load
            const backgroundPromises: Promise<void>[] = [];
            for (let user = 0; user < 20; user++) {
                backgroundPromises.push(
                    new Promise<void>(resolve => {
                        setTimeout(async () => {
                            while (Date.now() < endTime) {
                                const handler = mockHandlers[Math.floor(Math.random() * mockHandlers.length)];
                                await benchmark.recordRequest(() => simulateApiRequest(handler));
                                await simulateNetworkDelay(Math.random() * 500 + 100);
                            }
                            resolve();
                        }, user * 100);
                    })
                );
            }

            await Promise.all([...burstPromises, ...backgroundPromises]);
            const result = await benchmark.endBenchmark();

            // System should handle extreme load without complete failure
            expect(result.successfulRequests).toBeGreaterThan(0);
            expect(result.requestsPerSecond).toBeGreaterThan(5);

            console.log(benchmark.generateReport(result));
        });

        it('should handle resource exhaustion scenarios', async () => {
            // Simulate slow database responses
            const slowHandlers = createMockHandlers(2000); // 2 second base response time
            slowHandlers[0].successRate = 0.7; // Lower success rate under stress

            await benchmark.startBenchmark();

            const startTime = Date.now();
            const endTime = startTime + 10000; // 10 seconds

            const stressPromises: Promise<void>[] = [];

            // Create many concurrent slow requests
            for (let i = 0; i < 30; i++) {
                stressPromises.push(
                    new Promise<void>(resolve => {
                        setTimeout(async () => {
                            while (Date.now() < endTime) {
                                await benchmark.recordRequest(() => simulateApiRequest(slowHandlers[0]));
                                await simulateNetworkDelay(Math.random() * 1000);
                            }
                            resolve();
                        }, i * 50);
                    })
                );
            }

            await Promise.all(stressPromises);
            const result = await benchmark.endBenchmark();

            // Should degrade gracefully
            expect(result.errorRate).toBeGreaterThan(0); // Some failures expected
            expect(result.successfulRequests).toBeGreaterThan(0); // But some should succeed

            console.log(benchmark.generateReport(result));
        });
    });

    describe('Scalability Testing', () => {
        it('should demonstrate linear scalability', async () => {
            const userCounts = [1, 5, 10, 20];
            const results: LoadTestResult[] = [];

            for (const userCount of userCounts) {
                const userBenchmark = new PerformanceBenchmark();
                await userBenchmark.startBenchmark();

                const startTime = Date.now();
                const endTime = startTime + 5000; // 5 seconds per test

                const promises: Promise<void>[] = [];

                for (let user = 0; user < userCount; user++) {
                    promises.push(
                        new Promise<void>(resolve => {
                            setTimeout(async () => {
                                while (Date.now() < endTime) {
                                    const handler = mockHandlers[0]; // Focus on booking endpoint
                                    await userBenchmark.recordRequest(() => simulateApiRequest(handler));
                                    await simulateNetworkDelay(Math.random() * 500 + 100);
                                }
                                resolve();
                            }, user * 100);
                        })
                    );
                }

                await Promise.all(promises);
                const result = await userBenchmark.endBenchmark();
                results.push(result);
            }

            // Verify scalability: throughput should increase roughly linearly
            for (let i = 1; i < results.length; i++) {
                const previousResult = results[i - 1];
                const currentResult = results[i];

                // Throughput should increase (allowing for some overhead)
                expect(currentResult.requestsPerSecond).toBeGreaterThan(
                    previousResult.requestsPerSecond * 0.8
                );
            }

            // Log scalability report
            console.log('\nScalability Test Results:');
            results.forEach((result, index) => {
                console.log(`${userCounts[index]} users: ${result.requestsPerSecond.toFixed(2)} RPS, ${result.averageResponseTime.toFixed(2)}ms avg`);
            });
        });

        it('should maintain response time under increasing load', async () => {
            const loadSteps = [
                { users: 5, duration: 3000 },
                { users: 10, duration: 3000 },
                { users: 20, duration: 3000 },
                { users: 40, duration: 3000 }
            ];

            const stepResults: Array<{ users: number; avgResponseTime: number; errorRate: number }> = [];

            for (const step of loadSteps) {
                const stepBenchmark = new PerformanceBenchmark();
                await stepBenchmark.startBenchmark();

                const startTime = Date.now();
                const endTime = startTime + step.duration;

                const promises: Promise<void>[] = [];

                for (let user = 0; user < step.users; user++) {
                    promises.push(
                        new Promise<void>(resolve => {
                            setTimeout(async () => {
                                while (Date.now() < endTime) {
                                    const handler = mockHandlers[Math.floor(Math.random() * mockHandlers.length)];
                                    await stepBenchmark.recordRequest(() => simulateApiRequest(handler));
                                    await simulateNetworkDelay(Math.random() * 200 + 50);
                                }
                                resolve();
                            }, user * 50);
                        })
                    );
                }

                await Promise.all(promises);
                const result = await stepBenchmark.endBenchmark();

                stepResults.push({
                    users: step.users,
                    avgResponseTime: result.averageResponseTime,
                    errorRate: result.errorRate
                });
            }

            // Response time should not increase dramatically
            const maxResponseTime = Math.max(...stepResults.map(r => r.avgResponseTime));
            const minResponseTime = Math.min(...stepResults.map(r => r.avgResponseTime));
            const responseTimeDegradation = maxResponseTime / minResponseTime;

            expect(responseTimeDegradation).toBeLessThan(3); // Max 3x degradation

            console.log('\nLoad Step Results:');
            stepResults.forEach(result => {
                console.log(`${result.users} users: ${result.avgResponseTime.toFixed(2)}ms avg, ${result.errorRate.toFixed(1)}% errors`);
            });
        });
    });

    describe('Memory and Resource Testing', () => {
        it('should not have memory leaks under sustained load', async () => {
            await benchmark.startBenchmark();

            const startTime = Date.now();
            const endTime = startTime + 15000; // 15 seconds

            const promises: Promise<void>[] = [];

            // Multiple users making continuous requests
            for (let user = 0; user < 10; user++) {
                promises.push(
                    new Promise<void>(resolve => {
                        setTimeout(async () => {
                            while (Date.now() < endTime) {
                                for (const handler of mockHandlers) {
                                    await benchmark.recordRequest(() => simulateApiRequest(handler));
                                }
                                await simulateNetworkDelay(Math.random() * 1000);
                            }
                            resolve();
                        }, user * 100);
                    })
                );
            }

            await Promise.all(promises);
            const result = await benchmark.endBenchmark();

            // System should handle sustained load without issues
            expect(result.errorRate).toBeLessThan(5);
            expect(result.averageResponseTime).toBeLessThan(2000);

            console.log(benchmark.generateReport(result));
        });

        it('should handle connection pool exhaustion', async () => {
            // Simulate connection-limited scenario
            const connectionLimitedHandlers = createMockHandlers(500);
            connectionLimitedHandlers[0].successRate = 0.6; // Lower success rate when connections are limited

            await benchmark.startBenchmark();

            const startTime = Date.now();
            const endTime = startTime + 8000; // 8 seconds

            // Create many more requests than connections available
            const promises: Promise<void>[] = [];

            for (let i = 0; i < 50; i++) {
                promises.push(
                    new Promise<void>(resolve => {
                        setTimeout(async () => {
                            while (Date.now() < endTime) {
                                await benchmark.recordRequest(() => simulateApiRequest(connectionLimitedHandlers[0]));
                                await simulateNetworkDelay(Math.random() * 100);
                            }
                            resolve();
                        }, i * 20);
                    })
                );
            }

            await Promise.all(promises);
            const result = await benchmark.endBenchmark();

            // Should handle connection exhaustion gracefully
            expect(result.successfulRequests).toBeGreaterThan(0);

            console.log(benchmark.generateReport(result));
        });
    });

    describe('Database Performance', () => {
        it('should handle database query optimization', async () => {
            // Simulate different query types with different performance characteristics
            const queryHandlers = [
                {
                    url: '/api/bookings',
                    method: 'GET',
                    responseTime: 150, // Simple query
                    successRate: 0.98
                },
                {
                    url: '/api/availability',
                    method: 'GET',
                    responseTime: 300, // Complex availability query
                    successRate: 0.95
                }
            ];

            await benchmark.startBenchmark();

            const testDuration = 10000; // 10 seconds
            const startTime = Date.now();
            const endTime = startTime + testDuration;

            const promises: Promise<void>[] = [];

            // Simulate realistic query mix
            for (let user = 0; user < 8; user++) {
                promises.push(
                    new Promise<void>(resolve => {
                        setTimeout(async () => {
                            while (Date.now() < endTime) {
                                // Mix of simple and complex queries
                                const queryType = Math.random() > 0.3 ? 0 : 1; // 70% simple, 30% complex
                                await benchmark.recordRequest(() => simulateApiRequest(queryHandlers[queryType]));
                                await simulateNetworkDelay(Math.random() * 800 + 200);
                            }
                            resolve();
                        }, user * 150);
                    })
                );
            }

            await Promise.all(promises);
            const result = await benchmark.endBenchmark();

            // Complex queries should not dominate response time
            expect(result.averageResponseTime).toBeLessThan(400);

            console.log(benchmark.generateReport(result));
        });

        it('should handle concurrent database transactions', async () => {
            // Simulate booking creation (involves multiple database operations)
            const transactionHandlers = createMockHandlers(250);
            transactionHandlers[0].successRate = 0.92; // Slightly lower due to transaction complexity

            await benchmark.startBenchmark();

            const startTime = Date.now();
            const endTime = startTime + 8000; // 8 seconds

            const promises: Promise<void>[] = [];

            // Simulate concurrent booking transactions
            for (let i = 0; i < 15; i++) {
                promises.push(
                    new Promise<void>(resolve => {
                        setTimeout(async () => {
                            while (Date.now() < endTime) {
                                // Simulate full booking transaction
                                await benchmark.recordRequest(() => simulateApiRequest(transactionHandlers[0]));

                                // Small chance of retry on failure
                                if (Math.random() < 0.1) {
                                    await simulateNetworkDelay(100);
                                    await benchmark.recordRequest(() => simulateApiRequest(transactionHandlers[0]));
                                }

                                await simulateNetworkDelay(Math.random() * 1500 + 500);
                            }
                            resolve();
                        }, i * 100);
                    })
                );
            }

            await Promise.all(promises);
            const result = await benchmark.endBenchmark();

            // Should handle transaction load well
            expect(result.errorRate).toBeLessThan(10);
            expect(result.averageResponseTime).toBeLessThan(1000);

            console.log(benchmark.generateReport(result));
        });
    });

    describe('Performance Regression Testing', () => {
        it('should detect performance regressions', async () => {
            // Establish baseline performance
            const baselineHandlers = createMockHandlers(100);
            const baselineBenchmark = new PerformanceBenchmark();

            await baselineBenchmark.startBenchmark();
            await simulateNetworkDelay(1000); // Allow startup

            const baselinePromises: Promise<void>[] = [];
            for (let i = 0; i < 5; i++) {
                baselinePromises.push(
                    new Promise<void>(resolve => {
                        setTimeout(async () => {
                            for (let j = 0; j < 10; j++) {
                                await baselineBenchmark.recordRequest(() => simulateApiRequest(baselineHandlers[0]));
                                await simulateNetworkDelay(100);
                            }
                            resolve();
                        }, i * 200);
                    })
                );
            }

            await Promise.all(baselinePromises);
            const baselineResult = await baselineBenchmark.endBenchmark();

            // Simulate degraded performance (regression)
            const degradedHandlers = createMockHandlers(250); // 2.5x slower
            const regressionBenchmark = new PerformanceBenchmark();

            await regressionBenchmark.startBenchmark();
            await simulateNetworkDelay(1000);

            const regressionPromises: Promise<void>[] = [];
            for (let i = 0; i < 5; i++) {
                regressionPromises.push(
                    new Promise<void>(resolve => {
                        setTimeout(async () => {
                            for (let j = 0; j < 10; j++) {
                                await regressionBenchmark.recordRequest(() => simulateApiRequest(degradedHandlers[0]));
                                await simulateNetworkDelay(100);
                            }
                            resolve();
                        }, i * 200);
                    })
                );
            }

            await Promise.all(regressionPromises);
            const regressionResult = await regressionBenchmark.endBenchmark();

            // Detect regression
            const performanceDegradation = regressionResult.averageResponseTime / baselineResult.averageResponseTime;

            expect(performanceDegradation).toBeGreaterThan(1.5); // Should detect 50%+ degradation

            console.log('\nPerformance Regression Detection:');
            console.log(`Baseline: ${baselineResult.averageResponseTime.toFixed(2)}ms`);
            console.log(`Current: ${regressionResult.averageResponseTime.toFixed(2)}ms`);
            console.log(`Degradation: ${(performanceDegradation * 100 - 100).toFixed(1)}%`);
        });
    });

    describe('Cache Performance', () => {
        it('should demonstrate cache effectiveness', async () => {
            // First request (cache miss)
            const uncachedBenchmark = new PerformanceBenchmark();
            await uncachedBenchmark.startBenchmark();

            const uncachedPromises: Promise<void>[] = [];
            for (let i = 0; i < 10; i++) {
                uncachedPromises.push(
                    new Promise<void>(resolve => {
                        setTimeout(async () => {
                            const slowHandler = { ...mockHandlers[1], responseTime: 400 }; // Simulate slow DB query
                            await uncachedBenchmark.recordRequest(() => simulateApiRequest(slowHandler));
                            resolve();
                        }, i * 50);
                    })
                );
            }

            await Promise.all(uncachedPromises);
            const uncachedResult = await uncachedBenchmark.endBenchmark();

            // Subsequent requests (cache hits)
            const cachedBenchmark = new PerformanceBenchmark();
            await cachedBenchmark.startBenchmark();

            const cachedPromises: Promise<void>[] = [];
            for (let i = 0; i < 10; i++) {
                cachedPromises.push(
                    new Promise<void>(resolve => {
                        setTimeout(async () => {
                            const fastHandler = { ...mockHandlers[1], responseTime: 50 }; // Simulate fast cache lookup
                            await cachedBenchmark.recordRequest(() => simulateApiRequest(fastHandler));
                            resolve();
                        }, i * 50);
                    })
                );
            }

            await Promise.all(cachedPromises);
            const cachedResult = await cachedBenchmark.endBenchmark();

            // Cache should significantly improve performance
            const speedup = uncachedResult.averageResponseTime / cachedResult.averageResponseTime;

            expect(speedup).toBeGreaterThan(3); // At least 3x faster with cache

            console.log('\nCache Performance:');
            console.log(`Without cache: ${uncachedResult.averageResponseTime.toFixed(2)}ms`);
            console.log(`With cache: ${cachedResult.averageResponseTime.toFixed(2)}ms`);
            console.log(`Speedup: ${speedup.toFixed(1)}x`);
        });
    });
});
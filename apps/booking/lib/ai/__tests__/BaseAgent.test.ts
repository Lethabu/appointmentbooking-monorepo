// Unit Tests: BaseAgent
// File: apps/booking/lib/ai/__tests__/BaseAgent.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseAgent, AgentConfig } from '../BaseAgent';

// Mock OpenAI
vi.mock('openai', () => ({
    default: vi.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: vi.fn().mockResolvedValue({
                    choices: [{
                        message: { content: 'Test response' },
                        finish_reason: 'stop',
                    }],
                }),
            },
        },
    })),
}));

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
    }),
}));

describe('BaseAgent', () => {
    let testConfig: AgentConfig;
    let agent: BaseAgent;

    beforeEach(() => {
        testConfig = {
            name: 'TestAgent',
            role: 'Test Assistant',
            personality: 'Helpful and friendly',
            systemPrompt: 'You are a test agent',
            temperature: 0.7,
            maxTokens: 500,
        };

        agent = new BaseAgent(testConfig);
    });

    describe('Initialization', () => {
        it('should initialize with config', () => {
            expect(agent.config.name).toBe('TestAgent');
            expect(agent.config.role).toBe('Test Assistant');
            expect(agent.config.temperature).toBe(0.7);
        });

        it('should use default values for optional config', () => {
            const minimalConfig: AgentConfig = {
                name: 'Minimal',
                role: 'Test',
                personality: 'Test',
                systemPrompt: 'Test',
            };

            const minimalAgent = new BaseAgent(minimalConfig);
            expect(minimalAgent.config.temperature).toBe(0.7);
            expect(minimalAgent.config.maxTokens).toBe(500);
            expect(minimalAgent.config.model).toBe('gpt-4-turbo-preview');
        });
    });

    describe('Chat', () => {
        it('should process a message and return a response', async () => {
            const response = await agent.chat('user123', 'Hello');

            expect(response).toHaveProperty('message');
            expect(response.message).toBe('Test response');
            expect(response).toHaveProperty('confidence');
        });

        it('should include context in the message', async () => {
            const context = { lastBooking: '2024-12-01' };
            const response = await agent.chat('user123', 'Hello', context);

            expect(response).toHaveProperty('message');
        });

        it('should handle errors gracefully', async () => {
            // Mock OpenAI to throw error
            vi.mocked(agent['openai'].chat.completions.create).mockRejectedValueOnce(
                new Error('API Error')
            );

            await expect(agent.chat('user123', 'Hello')).rejects.toThrow('Failed to process message');
        });
    });

    describe('Memory Management', () => {
        it('should save message to memory', async () => {
            await agent.saveMemory('user123', {
                role: 'user',
                content: 'Test message',
                timestamp: new Date(),
            });

            // Verify insert was called
            expect(agent['supabase'].from).toHaveBeenCalledWith('ai_conversations');
        });

        it('should retrieve conversation history', async () => {
            const history = await agent.getMemory('user123');

            expect(history).toHaveProperty('userId');
            expect(history.userId).toBe('user123');
            expect(history).toHaveProperty('messages');
            expect(Array.isArray(history.messages)).toBe(true);
        });

        it('should clear memory for a user', async () => {
            await agent.clearMemory('user123');

            // Verify delete was called
            expect(agent['supabase'].from).toHaveBeenCalledWith('ai_conversations');
        });
    });

    describe('Action Parsing', () => {
        it('should parse action from message', () => {
            const message = 'Please book [ACTION:CREATE_BOOKING:{"date":"2024-12-15"}]';
            const action = agent['parseAction'](message);

            expect(action).toBeDefined();
            expect(action?.type).toBe('CREATE_BOOKING');
            expect(action?.params).toEqual({ date: '2024-12-15' });
        });

        it('should return undefined for message without action', () => {
            const message = 'Just a regular message';
            const action = agent['parseAction'](message);

            expect(action).toBeUndefined();
        });

        it('should handle malformed action gracefully', () => {
            const message = '[ACTION:INVALID:not-json]';
            const action = agent['parseAction'](message);

            expect(action).toBeUndefined();
        });
    });

    describe('Confidence Calculation', () => {
        it('should return high confidence for stop finish reason', () => {
            const completion = {
                choices: [{
                    message: { content: 'Test' },
                    finish_reason: 'stop' as const,
                }],
            } as any;

            const confidence = agent['calculateConfidence'](completion);
            expect(confidence).toBe(0.9);
        });

        it('should return medium confidence for length finish reason', () => {
            const completion = {
                choices: [{
                    message: { content: 'Test' },
                    finish_reason: 'length' as const,
                }],
            } as any;

            const confidence = agent['calculateConfidence'](completion);
            expect(confidence).toBe(0.6);
        });

        it('should return low confidence for other finish reasons', () => {
            const completion = {
                choices: [{
                    message: { content: 'Test' },
                    finish_reason: 'content_filter' as const,
                }],
            } as any;

            const confidence = agent['calculateConfidence'](completion);
            expect(confidence).toBe(0.5);
        });
    });

    describe('Action Execution', () => {
        it('should throw error for unimplemented action', async () => {
            await expect(
                agent.executeAction('UNKNOWN_ACTION', {})
            ).rejects.toThrow('Action UNKNOWN_ACTION not implemented');
        });
    });

    describe('Statistics', () => {
        it('should return agent statistics', async () => {
            const stats = await agent.getStats();

            expect(stats).toHaveProperty('totalConversations');
            expect(stats).toHaveProperty('totalMessages');
            expect(stats).toHaveProperty('avgMessagesPerConversation');
            expect(stats).toHaveProperty('avgResponseTime');
        });

        it('should filter statistics by date range', async () => {
            const startDate = new Date('2024-12-01');
            const endDate = new Date('2024-12-31');

            const stats = await agent.getStats(startDate, endDate);

            expect(stats).toHaveProperty('totalConversations');
        });
    });
});

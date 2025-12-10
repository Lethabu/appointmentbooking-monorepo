// Base AI Agent Framework
// File: apps/booking/lib/ai/BaseAgent.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Types
export interface AgentConfig {
    name: string;
    role: string;
    personality: string;
    systemPrompt: string;
    temperature?: number;
    maxTokens?: number;
    model?: string;
}

export interface ConversationMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}

export interface ConversationHistory {
    userId: string;
    messages: ConversationMessage[];
    metadata?: Record<string, any>;
}

export interface AgentResponse {
    message: string;
    action?: {
        type: string;
        params: any;
    };
    confidence?: number;
}

// Base Agent Class
export class BaseAgent {
    protected config: AgentConfig;
    protected gemini: GoogleGenerativeAI;
    protected supabase: ReturnType<typeof createClient>;

    constructor(config: AgentConfig) {
        this.config = {
            temperature: 0.7,
            maxTokens: 2048,
            model: 'gemini-1.5-flash', // Fast and cost-effective
            ...config,
        };

        // Initialize Google Gemini
        this.gemini = new GoogleGenerativeAI(
            process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY!
        );

        // Initialize Supabase for memory
        this.supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    }

    /**
     * Main chat method - processes user message and returns response
     */
    async chat(
        userId: string,
        message: string,
        context?: Record<string, any>
    ): Promise<AgentResponse> {
        try {
            // Get conversation history
            const history = await this.getMemory(userId);

            // Build conversation for Gemini
            const conversationHistory = history.messages.map((m) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            }));

            // Add context to system prompt if provided
            let systemPrompt = this.config.systemPrompt;
            if (context) {
                systemPrompt += `\n\nContext: ${JSON.stringify(context)}`;
            }

            // Initialize Gemini model
            const model = this.gemini.getGenerativeModel({
                model: this.config.model!,
                generationConfig: {
                    temperature: this.config.temperature,
                    maxOutputTokens: this.config.maxTokens,
                },
                systemInstruction: systemPrompt,
            });

            // Start chat with history
            const chat = model.startChat({
                history: conversationHistory,
            });

            // Send message and get response
            const result = await chat.sendMessage(message);
            const responseMessage = result.response.text();

            // Save conversation to memory
            await this.saveMemory(userId, {
                role: 'user',
                content: message,
                timestamp: new Date(),
            });

            await this.saveMemory(userId, {
                role: 'assistant',
                content: responseMessage,
                timestamp: new Date(),
            });

            // Parse response for actions
            const action = this.parseAction(responseMessage);

            return {
                message: responseMessage,
                action,
                confidence: 0.9, // Gemini is generally confident
            };
        } catch (error) {
            console.error('Agent chat error:', error);
            throw new Error('Failed to process message');
        }
    }

    /**
     * Get conversation history from Supabase
     */
    async getMemory(userId: string): Promise<ConversationHistory> {
        try {
            const { data, error } = await this.supabase
                .from('ai_conversations')
                .select('*')
                .eq('user_id', userId)
                .eq('agent_name', this.config.name)
                .order('created_at', { ascending: true })
                .limit(10); // Last 10 messages

            if (error) throw error;

            const messages: ConversationMessage[] = (data || []).map((row: any) => ({
                role: row.role,
                content: row.content,
                timestamp: new Date(row.created_at),
            }));

            return {
                userId,
                messages,
            };
        } catch (error) {
            console.error('Get memory error:', error);
            return {
                userId,
                messages: [],
            };
        }
    }

    /**
     * Save message to conversation history
     */
    async saveMemory(
        userId: string,
        message: ConversationMessage
    ): Promise<void> {
        try {
            await this.supabase.from('ai_conversations').insert({
                user_id: userId,
                agent_name: this.config.name,
                role: message.role,
                content: message.content,
                created_at: (message.timestamp || new Date()).toISOString(),
            } as any);
        } catch (error) {
            console.error('Save memory error:', error);
            // Don't throw - memory save failure shouldn't break the flow
        }
    }

    /**
     * Parse action from AI response
     * Actions are formatted as: [ACTION:type:params]
     */
    protected parseAction(message: string): AgentResponse['action'] {
        const actionRegex = /\[ACTION:(\w+):(.+?)\]/;
        const match = message.match(actionRegex);

        if (match) {
            try {
                return {
                    type: match[1],
                    params: JSON.parse(match[2]),
                };
            } catch (error) {
                console.error('Action parse error:', error);
            }
        }

        return undefined;
    }

    /**
     * Execute an action (to be overridden by specific agents)
     */
    async executeAction(
        action: string,
        params: any
    ): Promise<any> {
        throw new Error(`Action ${action} not implemented for ${this.config.name}`);
    }

    /**
     * Clear conversation history for a user
     */
    async clearMemory(userId: string): Promise<void> {
        try {
            await this.supabase
                .from('ai_conversations')
                .delete()
                .eq('user_id', userId)
                .eq('agent_name', this.config.name);
        } catch (error) {
            console.error('Clear memory error:', error);
        }
    }

    /**
     * Get agent statistics
     */
    async getStats(startDate?: Date, endDate?: Date): Promise<{
        totalConversations: number;
        totalMessages: number;
        avgMessagesPerConversation: number;
        avgResponseTime: number;
    }> {
        try {
            const query = this.supabase
                .from('ai_conversations')
                .select('*')
                .eq('agent_name', this.config.name);

            if (startDate) {
                query.gte('created_at', startDate.toISOString());
            }
            if (endDate) {
                query.lte('created_at', endDate.toISOString());
            }

            const { data, error } = await query;

            if (error) throw error;

            const uniqueUsers = new Set(data?.map((row: any) => row.user_id)).size;
            const totalMessages = data?.length || 0;

            return {
                totalConversations: uniqueUsers,
                totalMessages,
                avgMessagesPerConversation: uniqueUsers > 0 ? totalMessages / uniqueUsers : 0,
                avgResponseTime: 0, // TODO: Calculate from timestamps
            };
        } catch (error) {
            console.error('Get stats error:', error);
            return {
                totalConversations: 0,
                totalMessages: 0,
                avgMessagesPerConversation: 0,
                avgResponseTime: 0,
            };
        }
    }
}

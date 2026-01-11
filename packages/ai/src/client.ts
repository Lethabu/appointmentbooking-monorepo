import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

/**
 * Configuration for AI client initialization
 */
export interface AIConfig {
    /** Google AI API key for Gemini models */
    googleApiKey?: string;
    /** OpenAI API key for GPT models */
    openAIApiKey?: string;
}

/**
 * Supported AI providers
 */
export type AIProvider = 'google' | 'openai';

/**
 * AI client configuration constants
 */
const AI_MODELS = {
    google: 'gemini-pro',
    openai: 'gpt-3.5-turbo',
} as const;

/**
 * Custom error for AI provider issues
 */
export class AIProviderError extends Error {
    constructor(provider: AIProvider, message: string) {
        super(`AI Provider Error [${provider}]: ${message}`);
        this.name = 'AIProviderError';
    }
}

/**
 * Factory class for managing AI service clients
 * Supports multiple providers (Google Gemini, OpenAI) with fallback capabilities
 */
export class AIClient {
    private googleClient?: GoogleGenerativeAI;
    private openAIClient?: OpenAI;

    /**
     * Initialize AI client with configuration
     * @param config - Configuration object with API keys
     */
    constructor(config: AIConfig) {
        if (config.googleApiKey) {
            this.googleClient = new GoogleGenerativeAI(config.googleApiKey);
        }
        if (config.openAIApiKey) {
            this.openAIClient = new OpenAI({ apiKey: config.openAIApiKey });
        }
    }

    /**
     * Generate text using specified AI provider
     * @param prompt - Input text prompt
     * @param provider - AI provider to use (defaults to 'google')
     * @returns Generated text response
     * @throws {AIProviderError} When provider is not configured or available
     */
    async generateText(prompt: string, provider: AIProvider = 'google'): Promise<string> {
        if (provider === 'google' && this.googleClient) {
            const model = this.googleClient.getGenerativeModel({ model: AI_MODELS.google });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }

        if (provider === 'openai' && this.openAIClient) {
            const chatCompletion = await this.openAIClient.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: AI_MODELS.openai,
            });
            return chatCompletion.choices[0]?.message?.content || '';
        }

        throw new AIProviderError(
            provider,
            'Provider not configured or available. Please check your API keys.'
        );
    }

    /**
     * Check if a specific provider is available
     * @param provider - AI provider to check
     * @returns true if provider is available
     */
    isProviderAvailable(provider: AIProvider): boolean {
        switch (provider) {
            case 'google':
                return !!this.googleClient;
            case 'openai':
                return !!this.openAIClient;
            default:
                return false;
        }
    }
}

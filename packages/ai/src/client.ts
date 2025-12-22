import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// simple factory or wrapper
export class AIClient {
    private googleClient?: GoogleGenerativeAI;
    private openAIClient?: OpenAI;

    constructor(config: { googleApiKey?: string; openAIApiKey?: string }) {
        if (config.googleApiKey) {
            this.googleClient = new GoogleGenerativeAI(config.googleApiKey);
        }
        if (config.openAIApiKey) {
            this.openAIClient = new OpenAI({ apiKey: config.openAIApiKey });
        }
    }

    async generateText(prompt: string, provider: 'google' | 'openai' = 'google'): Promise<string> {
        if (provider === 'google' && this.googleClient) {
            const model = this.googleClient.getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }

        if (provider === 'openai' && this.openAIClient) {
            const chatCompletion = await this.openAIClient.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'gpt-3.5-turbo',
            });
            return chatCompletion.choices[0].message.content || '';
        }

        throw new Error(`Provider ${provider} not configured or available.`);
    }
}

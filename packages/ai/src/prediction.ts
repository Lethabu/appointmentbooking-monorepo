import { AIClient } from './client';
import { z } from 'zod';

// Input schema for prediction
export const PredictionInputSchema = z.object({
    customerName: z.string(),
    bookingHistory: z.array(z.object({
        date: z.string(),
        status: z.enum(['completed', 'cancelled', 'no-show']),
    })),
    appointmentDetails: z.object({
        service: z.string(),
        date: z.string(),
        time: z.string(),
        price: z.number(),
    }),
});

export type PredictionInput = z.infer<typeof PredictionInputSchema>;

export class PredictionEngine {
    private aiClient: AIClient;

    constructor(apiKey: string) {
        // Defaulting to Google for costs/availability in this demo
        this.aiClient = new AIClient({ googleApiKey: apiKey });
    }

    async predictNoShowRisk(input: PredictionInput): Promise<{ riskScore: number; reason: string }> {
        const prompt = `
      Analyze the risk of a "no-show" for this appointment based on the following data:
      
      Customer: ${input.customerName}
      History: ${JSON.stringify(input.bookingHistory)}
      Appointment: ${JSON.stringify(input.appointmentDetails)}
      
      Return a JSON object with:
      - riskScore: a number between 0 (low risk) and 100 (high risk)
      - reason: a short explanation based on history and trends.
      
      JSON ONLY.
    `;

        try {
            const responseText = await this.aiClient.generateText(prompt, 'google');
            // Naive cleanup of code blocks if Gemini returns markdown
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(cleanJson);

            return {
                riskScore: result.riskScore || 0,
                reason: result.reason || 'Analysis failed',
            };
        } catch (error) {
            console.error('Prediction failed:', error);
            return { riskScore: 0, reason: 'AI Service Unavailable' };
        }
    }
}

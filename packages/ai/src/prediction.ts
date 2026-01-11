import { AIClient, AIProviderError } from './client';
import { z } from 'zod';

/**
 * Booking history entry schema
 */
const BookingHistorySchema = z.object({
    date: z.string(),
    status: z.enum(['completed', 'cancelled', 'no-show']),
});

/**
 * Appointment details schema
 */
const AppointmentDetailsSchema = z.object({
    service: z.string(),
    date: z.string(),
    time: z.string(),
    price: z.number(),
});

/**
 * Input schema for prediction
 */
export const PredictionInputSchema = z.object({
    customerName: z.string().min(1, 'Customer name is required'),
    bookingHistory: z.array(BookingHistorySchema).default([]),
    appointmentDetails: AppointmentDetailsSchema,
});

/**
 * Type inference for prediction input
 */
export type PredictionInput = z.infer<typeof PredictionInputSchema>;

/**
 * Prediction result interface
 */
export interface PredictionResult {
    /** Risk score between 0 (low) and 100 (high) */
    riskScore: number;
    /** Explanation for the risk assessment */
    reason: string;
}

/**
 * Custom error for prediction service issues
 */
export class PredictionError extends Error {
    constructor(message: string, public readonly cause?: unknown) {
        super(`Prediction Error: ${message}`);
        this.name = 'PredictionError';
    }
}

/**
 * Constants for prediction service
 */
const PREDICTION_CONSTANTS = {
    DEFAULT_RISK_SCORE: 0,
    DEFAULT_REASON: 'Unable to assess risk - AI service unavailable',
    JSON_CLEANUP_REGEX: /```json|```/g,
} as const;

/**
 * AI-powered prediction engine for customer no-show risk assessment
 * Uses machine learning to analyze booking patterns and predict likelihood of no-shows
 */
export class PredictionEngine {
    private readonly aiClient: AIClient;

    /**
     * Initialize prediction engine with AI client
     * @param apiKey - Google AI API key for Gemini models
     */
    constructor(apiKey: string) {
        if (!apiKey?.trim()) {
            throw new Error('API key is required for PredictionEngine initialization');
        }

        // Defaulting to Google for costs/availability in this demo
        this.aiClient = new AIClient({ googleApiKey: apiKey });
    }

    /**
     * Predict no-show risk for a customer appointment
     * @param input - Customer and appointment data for analysis
     * @returns Prediction result with risk score and reasoning
     * @throws {PredictionError} When prediction analysis fails
     */
    async predictNoShowRisk(input: PredictionInput): Promise<PredictionResult> {
        try {
            // Validate input
            const validatedInput = PredictionInputSchema.parse(input);

            const prompt = this.buildAnalysisPrompt(validatedInput);
            const responseText = await this.aiClient.generateText(prompt, 'google');

            const result = this.parseAIResponse(responseText);

            return {
                riskScore: Math.max(0, Math.min(100, Number(result.riskScore) || PREDICTION_CONSTANTS.DEFAULT_RISK_SCORE)),
                reason: String(result.reason) || PREDICTION_CONSTANTS.DEFAULT_REASON,
            };
        } catch (error) {
            // Log error for debugging (in production, use proper logging service)
            console.error('Prediction analysis failed:', {
                error: error instanceof Error ? error.message : String(error),
                customerName: input.customerName,
                service: input.appointmentDetails?.service,
            });

            // Return safe default on failure
            if (error instanceof z.ZodError) {
                throw new PredictionError('Invalid input data provided', error);
            }

            if (error instanceof AIProviderError) {
                throw new PredictionError('AI service configuration issue', error);
            }

            return {
                riskScore: PREDICTION_CONSTANTS.DEFAULT_RISK_SCORE,
                reason: PREDICTION_CONSTANTS.DEFAULT_REASON,
            };
        }
    }

    /**
     * Build analysis prompt for AI service
     * @param input - Validated prediction input
     * @returns Formatted prompt for AI analysis
     */
    private buildAnalysisPrompt(input: PredictionInput): string {
        return `
      Analyze the risk of a "no-show" for this appointment based on the following data:
      
      Customer: ${input.customerName}
      History: ${JSON.stringify(input.bookingHistory, null, 2)}
      Appointment: ${JSON.stringify(input.appointmentDetails, null, 2)}
      
      Consider factors such as:
      - Previous booking patterns and completion rates
      - Service type and duration
      - Booking timing and advance notice
      - Historical no-show patterns
      
      Return a JSON object with:
      - riskScore: a number between 0 (low risk) and 100 (high risk)
      - reason: a short explanation based on history and trends.
      
      JSON ONLY - no markdown formatting.
    `;
    }

    /**
     * Parse and validate AI response
     * @param responseText - Raw AI response
     * @returns Parsed result object
     */
    private parseAIResponse(responseText: string): Record<string, unknown> {
        // Clean up code blocks if AI returns markdown
        const cleanJson = responseText
            .replace(PREDICTION_CONSTANTS.JSON_CLEANUP_REGEX, '')
            .trim();

        try {
            return JSON.parse(cleanJson);
        } catch (parseError) {
            throw new PredictionError(
                `Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
                { responseText, parseError }
            );
        }
    }
}

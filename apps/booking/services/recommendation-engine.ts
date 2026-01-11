// Intelligent Service Recommendation Engine
// Advanced AI-powered service recommendations for competitive differentiation

import { GoogleGenerativeAI } from '@google/generative-ai';
import { CustomerProfile, Service, BusinessContext, ServiceRecommendation } from '../types';

export class ServiceRecommendationEngine {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    /**
     * Generate personalized service recommendations for a customer
     */
    async generateRecommendations(
        customerProfile: CustomerProfile,
        businessContext: BusinessContext,
        currentServices: Service[]
    ): Promise<ServiceRecommendation[]> {
        try {
            // Get customer history analysis
            const historyAnalysis = await this.analyzeCustomerHistory(customerProfile, businessContext);

            // Get seasonal and trending recommendations
            const seasonalRecommendations = await this.getSeasonalRecommendations(businessContext);

            // Generate AI-powered recommendations
            const aiRecommendations = await this.generateAIRecommendations(
                customerProfile,
                businessContext,
                currentServices,
                { historyAnalysis, seasonalRecommendations }
            );

            // Score and rank recommendations
            const scoredRecommendations = await this.scoreAndRankRecommendations(
                aiRecommendations,
                customerProfile,
                businessContext
            );

            return scoredRecommendations.slice(0, 5); // Return top 5 recommendations
        } catch (error) {
            console.error('Error generating service recommendations:', error);
            return [];
        }
    }

    /**
     * Analyze customer booking history for patterns and preferences
     */
    private async analyzeCustomerHistory(
        customerProfile: CustomerProfile,
        businessContext: BusinessContext
    ): Promise<any> {
        const prompt = `
      Analyze this customer's booking history and identify patterns:
      
      Customer Profile:
      - Total bookings: ${customerProfile.history.totalBookings}
      - Total spent: R${customerProfile.history.totalSpent}
      - Average booking value: R${customerProfile.history.averageBookingValue}
      - Last visit: ${customerProfile.history.lastVisit}
      - Favorite services: ${customerProfile.history.favoriteServices.join(', ')}
      - Booking frequency: ${customerProfile.history.bookingFrequency}
      - Preferred services: ${customerProfile.preferences.preferredServices.join(', ')}
      - Price sensitivity: ${customerProfile.preferences.priceSensitivity}
      - Loyalty tier: ${customerProfile.preferences.loyaltyTier}
      
      Business Context:
      - Industry: ${businessContext.industry}
      - Available services: ${businessContext.services.length}
      
      Identify:
      1. Booking patterns and preferences
      2. Potential service gaps
      3. Upselling opportunities
      4. Seasonal trends
      5. Price point analysis
      
      Provide insights in JSON format with confidence scores.
    `;

        const result = await this.model.generateContent(prompt);
        const response = result.response.text();

        try {
            return JSON.parse(response);
        } catch {
            return { insights: [], confidence: 0.7 };
        }
    }

    /**
     * Get seasonal and trending service recommendations
     */
    private async getSeasonalRecommendations(businessContext: BusinessContext): Promise<Service[]> {
        const currentMonth = new Date().getMonth();
        const season = this.getSeason(currentMonth);

        const seasonalServices = businessContext.services.filter(service => {
            if (service.seasonalAvailability) {
                const start = new Date(service.seasonalAvailability.start);
                const end = new Date(service.seasonalAvailability.end);
                const now = new Date();
                return now >= start && now <= end;
            }

            // Industry-specific seasonal logic
            switch (businessContext.industry) {
                case 'beauty':
                    return this.getBeautySeasonalServices(season, service);
                case 'healthcare':
                    return this.getHealthcareSeasonalServices(season, service);
                case 'fitness':
                    return this.getFitnessSeasonalServices(season, service);
                default:
                    return service.isPopular;
            }
        });

        return seasonalServices.slice(0, 10);
    }

    /**
     * Generate AI-powered service recommendations
     */
    private async generateAIRecommendations(
        customerProfile: CustomerProfile,
        businessContext: BusinessContext,
        currentServices: Service[],
        context: any
    ): Promise<Service[]> {
        const prompt = `
      Generate personalized service recommendations for this customer:
      
      Customer Analysis: ${JSON.stringify(context.historyAnalysis)}
      Seasonal Context: ${context.seasonalRecommendations.length} relevant seasonal services
      
      Available Services:
      ${businessContext.services.map(s => `- ${s.name} (${s.category}): R${s.price} - ${s.description}`).join('\n')}
      
      Customer Preferences:
      - Price sensitivity: ${customerProfile.preferences.priceSensitivity}
      - Loyalty tier: ${customerProfile.preferences.loyaltyTier}
      - Preferred services: ${customerProfile.preferences.preferredServices.join(', ')}
      - Special requests: ${customerProfile.preferences.specialRequests.join(', ')}
      
      Business Context:
      - Industry: ${businessContext.industry}
      - Location considerations: ${businessContext.localizations.culturalConsiderations.join(', ')}
      
      Generate 10 most relevant service recommendations considering:
      1. Customer's booking history and preferences
      2. Seasonal relevance and trends
      3. Price point alignment with sensitivity
      4. Potential upselling opportunities
      5. Service combinations and packages
      6. Cultural and local preferences
      
      Return service names that best match these criteria.
    `;

        const result = await this.model.generateContent(prompt);
        const response = result.response.text();

        // Parse service names from AI response
        const serviceNames = this.extractServiceNames(response);
        const recommendedServices = businessContext.services.filter(service =>
            serviceNames.some(name =>
                service.name.toLowerCase().includes(name.toLowerCase()) ||
                name.toLowerCase().includes(service.name.toLowerCase())
            )
        );

        return recommendedServices;
    }

    /**
     * Score and rank recommendations based on multiple factors
     */
    private async scoreAndRankRecommendations(
        services: Service[],
        customerProfile: CustomerProfile,
        businessContext: BusinessContext
    ): Promise<ServiceRecommendation[]> {
        const recommendations: ServiceRecommendation[] = [];

        for (const service of services) {
            const recommendation = await this.calculateRecommendationScore(
                service,
                customerProfile,
                businessContext
            );
            recommendations.push(recommendation);
        }

        return recommendations.sort((a, b) => b.confidenceScore - a.confidenceScore);
    }

    /**
     * Calculate recommendation score for a service
     */
    private async calculateRecommendationScore(
        service: Service,
        customerProfile: CustomerProfile,
        businessContext: BusinessContext
    ): Promise<ServiceRecommendation> {
        let score = 0;
        const matchFactors: string[] = [];

        // Historical preference score (40% weight)
        if (customerProfile.history.favoriteServices.includes(service.name)) {
            score += 40;
            matchFactors.push('favorite_service');
        }

        // Price sensitivity alignment (25% weight)
        const priceAlignment = this.calculatePriceAlignment(service.price, customerProfile);
        score += priceAlignment * 25;
        matchFactors.push('price_alignment');

        // Loyalty tier compatibility (20% weight)
        const loyaltyBonus = this.getLoyaltyTierBonus(customerProfile.preferences.loyaltyTier, service);
        score += loyaltyBonus * 20;
        matchFactors.push('loyalty_bonus');

        // Service category affinity (10% weight)
        const categoryAffinity = this.calculateCategoryAffinity(service, customerProfile);
        score += categoryAffinity * 10;
        matchFactors.push('category_affinity');

        // Popularity and trends (5% weight)
        if (service.isPopular) {
            score += 5;
            matchFactors.push('popular_service');
        }

        // Normalize score to 0-100
        const confidenceScore = Math.min(score, 100);

        return {
            serviceId: service.id,
            confidenceScore,
            reasoning: this.generateRecommendationReasoning(service, customerProfile, matchFactors),
            matchFactors,
            priceRange: {
                min: service.price * 0.8,
                max: service.price * 1.2
            },
            urgency: this.determineUrgency(service, customerProfile),
            seasonalRelevance: this.calculateSeasonalRelevance(service, businessContext),
            customerAffinity: this.calculateCustomerAffinity(service, customerProfile)
        };
    }

    /**
     * Generate reasoning for recommendation
     */
    private generateRecommendationReasoning(
        service: Service,
        customerProfile: CustomerProfile,
        matchFactors: string[]
    ): string {
        const reasons: string[] = [];

        if (matchFactors.includes('favorite_service')) {
            reasons.push('Based on your previous bookings, you loved this service');
        }

        if (matchFactors.includes('price_alignment')) {
            reasons.push('Priced perfectly within your preferred range');
        }

        if (matchFactors.includes('loyalty_bonus')) {
            reasons.push(`Special pricing for our ${customerProfile.preferences.loyaltyTier} tier customers`);
        }

        if (matchFactors.includes('category_affinity')) {
            reasons.push('Matches your preferred service categories');
        }

        if (matchFactors.includes('popular_service')) {
            reasons.push('Highly requested by customers with similar preferences');
        }

        return reasons.join('. ') || `Perfect match for your preferences and needs.`;
    }

    // Helper methods
    private getSeason(month: number): 'spring' | 'summer' | 'autumn' | 'winter' {
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'winter';
        if (month >= 8 && month <= 10) return 'spring'; // Southern hemisphere
        return 'summer';
    }

    private getBeautySeasonalServices(season: string, service: Service): boolean {
        const seasonalMap: Record<string, string[]> = {
            spring: ['color', 'highlights', 'cut', 'style'],
            summer: ['color', 'treatment', 'style', 'facial'],
            autumn: ['treatment', 'color', 'style'],
            winter: ['treatment', 'facial', 'massage']
        };

        const keywords = seasonalMap[season] || [];
        return keywords.some((keyword: string) =>
            service.name.toLowerCase().includes(keyword) ||
            (service.description && service.description.toLowerCase().includes(keyword))
        );
    }

    private getHealthcareSeasonalServices(season: string, service: Service): boolean {
        return service.name.toLowerCase().includes('checkup') ||
            service.name.toLowerCase().includes('consultation');
    }

    private getFitnessSeasonalServices(season: string, service: Service): boolean {
        return (service.category && service.category.toLowerCase().includes('personal training')) ||
            service.name.toLowerCase().includes('assessment');
    }

    private extractServiceNames(response: string): string[] {
        // Extract service names from AI response
        const lines = response.split('\n');
        const serviceNames: string[] = [];

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                serviceNames.push(trimmed.substring(1).trim());
            }
        }

        return serviceNames;
    }

    private calculatePriceAlignment(price: number, customerProfile: CustomerProfile): number {
        const avgSpend = customerProfile.history.averageBookingValue;
        const ratio = price / avgSpend;

        if (ratio >= 0.8 && ratio <= 1.2) return 1; // Perfect alignment
        if (ratio >= 0.6 && ratio <= 1.5) return 0.8; // Good alignment
        if (ratio >= 0.4 && ratio <= 2.0) return 0.6; // Acceptable alignment
        return 0.3; // Poor alignment
    }

    private getLoyaltyTierBonus(tier: string, service: Service): number {
        const bonusMap: Record<string, number> = {
            bronze: service.isPopular ? 1 : 0.8,
            silver: service.isPopular ? 1 : 0.9,
            gold: 1,
            platinum: 1
        };
        return bonusMap[tier] || 0.8;
    }

    private calculateCategoryAffinity(service: Service, customerProfile: CustomerProfile): number {
        const preferredServices = customerProfile.preferences.preferredServices;
        return preferredServices.some(pref =>
            service.name.toLowerCase().includes(pref.toLowerCase())
        ) ? 1 : 0.5;
    }

    private determineUrgency(service: Service, customerProfile: CustomerProfile): 'low' | 'medium' | 'high' {
        if (customerProfile.history.lastVisit) {
            const daysSinceLastVisit = Math.floor(
                (Date.now() - new Date(customerProfile.history.lastVisit).getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysSinceLastVisit > 90) return 'high';
            if (daysSinceLastVisit > 60) return 'medium';
        }

        return service.isPopular ? 'medium' : 'low';
    }

    private calculateSeasonalRelevance(service: Service, businessContext: BusinessContext): number {
        if (service.seasonalAvailability) {
            const now = new Date();
            const start = new Date(service.seasonalAvailability.start);
            const end = new Date(service.seasonalAvailability.end);

            if (now >= start && now <= end) return 1;
            return 0.3;
        }

        return service.isPopular ? 0.8 : 0.5;
    }

    private calculateCustomerAffinity(service: Service, customerProfile: CustomerProfile): number {
        let affinity = 0;

        // Check service name similarity with preferences
        const nameMatch = customerProfile.preferences.preferredServices.some(pref =>
            service.name.toLowerCase().includes(pref.toLowerCase())
        );
        if (nameMatch) affinity += 0.4;

        // Check category affinity
        const categoryAffinity = this.calculateCategoryAffinity(service, customerProfile);
        affinity += categoryAffinity * 0.3;

        // Check price alignment
        const priceAlignment = this.calculatePriceAlignment(service.price, customerProfile);
        affinity += priceAlignment * 0.3;

        return Math.min(affinity, 1);
    }
}

export default ServiceRecommendationEngine;
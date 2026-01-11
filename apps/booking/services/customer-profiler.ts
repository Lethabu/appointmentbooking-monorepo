// Customer Profiling and Personalization Engine
// Advanced customer intelligence for competitive differentiation

import { GoogleGenerativeAI } from '@google/generative-ai';
import { CustomerProfile, BusinessContext, Service, Product } from '../types';

export class CustomerProfiler {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    /**
     * Create or update comprehensive customer profile
     */
    async createCustomerProfile(
        customerData: {
            phone: string;
            email?: string;
            name?: string;
            tenantId: string;
        },
        bookingHistory: any[],
        businessContext: BusinessContext
    ): Promise<CustomerProfile> {
        try {
            // Analyze booking history
            const historyAnalysis = await this.analyzeBookingHistory(bookingHistory, businessContext);

            // Generate AI insights
            const aiInsights = await this.generateAIInsights(customerData, historyAnalysis, businessContext);

            // Create demographic profile
            const demographics = await this.createDemographicProfile(customerData, businessContext);

            // Analyze preferences and behaviors
            const preferences = await this.analyzePreferences(bookingHistory, businessContext);

            // Calculate customer value and loyalty metrics
            const loyaltyMetrics = this.calculateLoyaltyMetrics(bookingHistory);

            // Generate predictive insights
            const predictiveInsights = await this.generatePredictiveInsights(
                customerData,
                historyAnalysis,
                businessContext
            );

            const profile: CustomerProfile = {
                id: this.generateCustomerId(customerData.phone, customerData.tenantId),
                phone: customerData.phone,
                email: customerData.email,
                name: customerData.name,
                tenantId: customerData.tenantId,
                demographics,
                preferences,
                history: {
                    totalBookings: bookingHistory.length,
                    totalSpent: historyAnalysis.totalSpent,
                    averageBookingValue: historyAnalysis.averageBookingValue,
                    lastVisit: historyAnalysis.lastVisit,
                    favoriteServices: historyAnalysis.favoriteServices,
                    bookingFrequency: this.determineBookingFrequency(bookingHistory)
                },
                aiInsights: predictiveInsights,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            return profile;
        } catch (error) {
            console.error('Error creating customer profile:', error);
            throw new Error('Failed to create customer profile');
        }
    }

    /**
     * Update existing customer profile with new data
     */
    async updateCustomerProfile(
        existingProfile: CustomerProfile,
        newBookingData: any,
        businessContext: BusinessContext
    ): Promise<CustomerProfile> {
        try {
            // Analyze new booking data
            const newInsights = await this.analyzeBookingHistory([newBookingData], businessContext);

            // Update historical data
            const updatedHistory = {
                totalBookings: existingProfile.history.totalBookings + 1,
                totalSpent: existingProfile.history.totalSpent + newBookingData.price,
                averageBookingValue: (existingProfile.history.totalSpent + newBookingData.price) / (existingProfile.history.totalBookings + 1),
                lastVisit: new Date(),
                favoriteServices: this.updateFavoriteServices(
                    existingProfile.history.favoriteServices,
                    newBookingData.service_name
                ),
                bookingFrequency: this.determineBookingFrequency([...Array(existingProfile.history.totalBookings + 1)])
            };

            // Generate updated AI insights
            const updatedAIInsights = await this.generateUpdatedAIInsights(
                existingProfile,
                newBookingData,
                businessContext
            );

            return {
                ...existingProfile,
                history: updatedHistory,
                aiInsights: updatedAIInsights,
                updatedAt: new Date()
            };
        } catch (error) {
            console.error('Error updating customer profile:', error);
            throw new Error('Failed to update customer profile');
        }
    }

    /**
     * Generate personalized recommendations based on customer profile
     */
    async generatePersonalizedRecommendations(
        customerProfile: CustomerProfile,
        availableServices: Service[],
        availableProducts: Product[],
        businessContext: BusinessContext
    ): Promise<{
        services: Service[];
        products: Product[];
        marketing: string[];
        nextActions: string[];
    }> {
        try {
            // Generate service recommendations
            const serviceRecommendations = await this.recommendServices(
                customerProfile,
                availableServices,
                businessContext
            );

            // Generate product recommendations
            const productRecommendations = await this.recommendProducts(
                customerProfile,
                availableProducts,
                availableServices
            );

            // Generate personalized marketing messages
            const marketingMessages = await this.generateMarketingMessages(
                customerProfile,
                businessContext
            );

            // Generate next best actions
            const nextActions = await this.generateNextActions(
                customerProfile,
                businessContext
            );

            return {
                services: serviceRecommendations,
                products: productRecommendations,
                marketing: marketingMessages,
                nextActions
            };
        } catch (error) {
            console.error('Error generating personalized recommendations:', error);
            return {
                services: [],
                products: [],
                marketing: [],
                nextActions: []
            };
        }
    }

    /**
     * Analyze booking history for patterns and insights
     */
    private async analyzeBookingHistory(
        bookingHistory: any[],
        businessContext: BusinessContext
    ): Promise<any> {
        if (bookingHistory.length === 0) {
            return {
                totalSpent: 0,
                averageBookingValue: 0,
                lastVisit: null,
                favoriteServices: [],
                servicePreferences: {},
                spendingPatterns: {},
                seasonalTrends: {},
                staffPreferences: {}
            };
        }

        // Calculate basic metrics
        const totalSpent = bookingHistory.reduce((sum, booking) => sum + (booking.price || 0), 0);
        const averageBookingValue = totalSpent / bookingHistory.length;
        const lastVisit = new Date(Math.max(...bookingHistory.map(b => new Date(b.created_at || b.datetime).getTime())));

        // Analyze service preferences
        const servicePreferences = this.analyzeServicePreferences(bookingHistory);

        // Analyze spending patterns
        const spendingPatterns = this.analyzeSpendingPatterns(bookingHistory);

        // Analyze seasonal trends
        const seasonalTrends = this.analyzeSeasonalTrends(bookingHistory);

        // Analyze staff preferences
        const staffPreferences = this.analyzeStaffPreferences(bookingHistory);

        // Generate AI insights using Google AI
        const aiInsights = await this.generateHistoricalAIInsights(bookingHistory, businessContext);

        return {
            totalSpent,
            averageBookingValue,
            lastVisit,
            favoriteServices: servicePreferences.topServices,
            servicePreferences,
            spendingPatterns,
            seasonalTrends,
            staffPreferences,
            aiInsights
        };
    }

    /**
     * Generate AI-powered insights from customer data
     */
    private async generateAIInsights(
        customerData: any,
        historyAnalysis: any,
        businessContext: BusinessContext
    ): Promise<any> {
        const prompt = `
      Generate AI-powered customer insights based on this data:
      
      Customer Data:
      - Phone: ${customerData.phone}
      - Email: ${customerData.email || 'Not provided'}
      - Name: ${customerData.name || 'Not provided'}
      - Tenant: ${customerData.tenantId}
      
      Booking History:
      - Total bookings: ${historyAnalysis.totalBookings || 0}
      - Total spent: R${historyAnalysis.totalSpent || 0}
      - Average value: R${historyAnalysis.averageBookingValue || 0}
      - Last visit: ${historyAnalysis.lastVisit || 'Never'}
      - Favorite services: ${historyAnalysis.favoriteServices?.join(', ') || 'None'}
      
      Business Context:
      - Industry: ${businessContext.industry}
      - Average service price: R${this.calculateAverageServicePrice(businessContext.services)}
      - Customer lifetime value estimate: R${this.estimateCustomerLifetimeValue(historyAnalysis)}
      
      Generate insights for:
      1. Customer lifetime value prediction
      2. Churn risk assessment (0-1 scale)
      3. Next visit prediction (date)
      4. Recommended services based on history
      5. Optimal booking times
      6. Pricing sensitivity analysis
      7. Loyalty program tier recommendation
      
      Return JSON with confidence scores.
    `;

        const result = await this.model.generateContent(prompt);
        const response = result.response.text();

        try {
            const insights = JSON.parse(response);
            return {
                predictedNeeds: insights.recommendedServices || [],
                churnRisk: insights.churnRisk || 0.3,
                lifetimeValue: insights.customerLifetimeValue || historyAnalysis.totalSpent,
                nextVisitPrediction: new Date(insights.nextVisitPrediction || Date.now() + (30 * 24 * 60 * 60 * 1000)),
                recommendedServices: insights.recommendedServices || [],
                optimalBookingTimes: insights.optimalTimes || []
            };
        } catch {
            // Fallback insights if AI parsing fails
            return {
                predictedNeeds: historyAnalysis.favoriteServices || [],
                churnRisk: 0.3,
                lifetimeValue: historyAnalysis.totalSpent,
                nextVisitPrediction: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)),
                recommendedServices: historyAnalysis.favoriteServices || [],
                optimalBookingTimes: ['10:00', '14:00', '16:00']
            };
        }
    }

    /**
     * Create demographic profile based on available data
     */
    private async createDemographicProfile(
        customerData: any,
        businessContext: BusinessContext
    ): Promise<any> {
        // Analyze phone number for location hints
        const locationHint = this.extractLocationFromPhone(customerData.phone);

        // Infer language preference from business context
        const languageHint = this.inferLanguagePreference(customerData, businessContext);

        return {
            location: locationHint,
            language: languageHint,
            preferredContact: this.determinePreferredContact(customerData)
        };
    }

    /**
     * Analyze customer preferences and behaviors
     */
    private async analyzePreferences(
        bookingHistory: any[],
        businessContext: BusinessContext
    ): Promise<any> {
        if (bookingHistory.length === 0) {
            return {
                preferredServices: [],
                preferredStylists: [],
                timePreferences: [],
                priceSensitivity: 'medium',
                loyaltyTier: 'bronze',
                specialRequests: []
            };
        }

        // Analyze service preferences
        const preferredServices = this.extractPreferredServices(bookingHistory);

        // Analyze staff preferences
        const preferredStylists = this.extractPreferredStylists(bookingHistory);

        // Analyze time preferences
        const timePreferences = this.extractTimePreferences(bookingHistory);

        // Determine price sensitivity
        const priceSensitivity = this.determinePriceSensitivity(bookingHistory);

        // Calculate loyalty tier
        const loyaltyTier = this.calculateLoyaltyTier(bookingHistory);

        return {
            preferredServices,
            preferredStylists,
            timePreferences,
            priceSensitivity,
            loyaltyTier,
            specialRequests: this.extractSpecialRequests(bookingHistory)
        };
    }

    /**
     * Calculate loyalty metrics and scores
     */
    private calculateLoyaltyMetrics(bookingHistory: any[]): any {
        if (bookingHistory.length === 0) {
            return {
                loyaltyScore: 0,
                retentionProbability: 0.5,
                referralLikelihood: 0.3
            };
        }

        const recency = this.calculateRecencyScore(bookingHistory);
        const frequency = this.calculateFrequencyScore(bookingHistory);
        const monetary = this.calculateMonetaryScore(bookingHistory);

        const loyaltyScore = (recency + frequency + monetary) / 3;
        const retentionProbability = this.calculateRetentionProbability(bookingHistory, loyaltyScore);
        const referralLikelihood = this.calculateReferralLikelihood(bookingHistory, loyaltyScore);

        return {
            loyaltyScore,
            retentionProbability,
            referralLikelihood
        };
    }

    /**
     * Generate predictive insights using AI
     */
    private async generatePredictiveInsights(
        customerData: any,
        historyAnalysis: any,
        businessContext: BusinessContext
    ): Promise<any> {
        const daysSinceLastVisit = historyAnalysis.lastVisit
            ? Math.floor((Date.now() - new Date(historyAnalysis.lastVisit).getTime()) / (1000 * 60 * 60 * 24))
            : 365;

        // Predict churn risk based on recency
        let churnRisk = 0.1; // Base churn risk
        if (daysSinceLastVisit > 90) churnRisk += 0.4;
        if (daysSinceLastVisit > 180) churnRisk += 0.3;
        if (daysSinceLastVisit > 365) churnRisk += 0.2;

        // Predict next visit based on historical frequency
        const avgDaysBetweenVisits = this.calculateAverageDaysBetweenVisits(historyAnalysis);
        const nextVisitPrediction = new Date(Date.now() + (avgDaysBetweenVisits * 24 * 60 * 60 * 1000));

        // Calculate lifetime value
        const monthlyValue = historyAnalysis.totalSpent / Math.max(daysSinceLastVisit / 30, 1);
        const lifetimeValue = monthlyValue * 12; // Estimate yearly value

        // Generate recommended services
        const recommendedServices = historyAnalysis.favoriteServices?.slice(0, 3) || [];

        // Generate optimal booking times
        const optimalBookingTimes = this.extractOptimalTimes(historyAnalysis);

        return {
            predictedNeeds: recommendedServices,
            churnRisk: Math.min(churnRisk, 1),
            lifetimeValue,
            nextVisitPrediction,
            recommendedServices,
            optimalBookingTimes
        };
    }

    /**
     * Recommend services based on customer profile
     */
    private async recommendServices(
        customerProfile: CustomerProfile,
        availableServices: Service[],
        businessContext: BusinessContext
    ): Promise<Service[]> {
        // Score services based on customer preferences
        const scoredServices = availableServices.map(service => {
            let score = 0;

            // Score based on favorite services
            if (customerProfile.history.favoriteServices.includes(service.name)) {
                score += 50;
            }

            // Score based on preferred services
            if (customerProfile.preferences.preferredServices.includes(service.name)) {
                score += 30;
            }

            // Score based on price sensitivity
            const priceAlignment = this.calculatePriceAlignment(service.price, customerProfile);
            score += priceAlignment * 20;

            // Score based on AI insights
            if (customerProfile.aiInsights.recommendedServices.includes(service.name)) {
                score += 40;
            }

            // Score based on loyalty tier
            const loyaltyBonus = this.getLoyaltyTierServiceBonus(
                customerProfile.preferences.loyaltyTier,
                service
            );
            score += loyaltyBonus;

            return { service, score };
        });

        // Sort by score and return top recommendations
        return scoredServices
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(item => item.service);
    }

    /**
     * Recommend products based on customer profile
     */
    private async recommendProducts(
        customerProfile: CustomerProfile,
        availableProducts: Product[],
        services: Service[]
    ): Promise<Product[]> {
        // This is a simplified implementation
        // In reality, you'd have more sophisticated product recommendation logic
        return availableProducts
            .filter(product => product.price <= customerProfile.history.averageBookingValue * 0.5)
            .slice(0, 3);
    }

    /**
     * Generate personalized marketing messages
     */
    private async generateMarketingMessages(
        customerProfile: CustomerProfile,
        businessContext: BusinessContext
    ): Promise<string[]> {
        const messages: string[] = [];

        // Loyalty tier messages
        const tierMessages = {
            bronze: 'Welcome to our loyalty program! Book 3 more services to reach Silver tier.',
            silver: 'Thank you for your continued loyalty! Enjoy 5% off your next booking.',
            gold: 'Gold member special: Book any premium service and receive a complimentary treatment.',
            platinum: 'Platinum member exclusive: Priority booking and 10% off all services.'
        };

        messages.push(tierMessages[customerProfile.preferences.loyaltyTier]);

        // Service-based messages
        if (customerProfile.history.favoriteServices.length > 0) {
            messages.push(`We noticed you love ${customerProfile.history.favoriteServices[0]}. Try our new variation!`);
        }

        // Time-based messages
        const daysSinceLastVisit = Math.floor(
            (Date.now() - new Date(customerProfile.history.lastVisit).getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastVisit > 30) {
            messages.push('We miss you! Come back for 15% off your next booking.');
        }

        return messages;
    }

    /**
     * Generate next best actions
     */
    private async generateNextActions(
        customerProfile: CustomerProfile,
        businessContext: BusinessContext
    ): Promise<string[]> {
        const actions: string[] = [];

        // Churn prevention actions
        if (customerProfile.aiInsights.churnRisk > 0.6) {
            actions.push('Schedule a follow-up call to understand customer concerns');
            actions.push('Offer a special discount to encourage return visit');
        }

        // Upselling actions
        if (customerProfile.preferences.loyaltyTier === 'gold' || customerProfile.preferences.loyaltyTier === 'platinum') {
            actions.push('Recommend premium services based on loyalty tier');
        }

        // Retention actions
        if (customerProfile.history.totalBookings > 5) {
            actions.push('Invite customer to refer friends for rewards');
        }

        return actions;
    }

    // Helper methods
    private generateCustomerId(phone: string, tenantId: string): string {
        return `${tenantId}_${phone.replace(/\D/g, '')}`;
    }

    private analyzeServicePreferences(bookingHistory: any[]): any {
        const serviceCounts: Record<string, number> = {};
        bookingHistory.forEach(booking => {
            const serviceName = booking.service_name || 'Unknown';
            serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
        });

        const sortedServices = Object.entries(serviceCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([service]) => service);

        return {
            topServices: sortedServices.slice(0, 5),
            serviceCounts
        };
    }

    private analyzeSpendingPatterns(bookingHistory: any[]): any {
        const spendingByMonth: Record<string, number> = {};
        bookingHistory.forEach(booking => {
            const month = new Date(booking.created_at || booking.datetime).toISOString().substring(0, 7);
            spendingByMonth[month] = (spendingByMonth[month] || 0) + (booking.price || 0);
        });

        return { spendingByMonth };
    }

    private analyzeSeasonalTrends(bookingHistory: any[]): any {
        const monthlyBookings: Record<string, number> = {};
        bookingHistory.forEach(booking => {
            const month = new Date(booking.created_at || booking.datetime).getMonth();
            monthlyBookings[month] = (monthlyBookings[month] || 0) + 1;
        });

        return { monthlyBookings };
    }

    private analyzeStaffPreferences(bookingHistory: any[]): any {
        const staffCounts: Record<string, number> = {};
        bookingHistory.forEach(booking => {
            const staffName = booking.staff_name || 'Unknown';
            staffCounts[staffName] = (staffCounts[staffName] || 0) + 1;
        });

        return {
            topStaff: Object.entries(staffCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([staff]) => staff)
        };
    }

    private async generateHistoricalAIInsights(bookingHistory: any[], businessContext: BusinessContext): Promise<any> {
        // Simplified AI insights generation
        return {
            insights: [],
            confidence: 0.7
        };
    }

    private extractLocationFromPhone(phone: string): string {
        // Simple location extraction from South African phone numbers
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.startsWith('27')) {
            const areaCode = cleanPhone.substring(2, 4);
            const locationMap: Record<string, string> = {
                '11': 'Johannesburg',
                '12': 'Pretoria',
                '21': 'Cape Town',
                '31': 'Durban'
            };
            return locationMap[areaCode] || 'South Africa';
        }
        return 'Unknown';
    }

    private inferLanguagePreference(customerData: any, businessContext: BusinessContext): 'en' | 'af' | 'zu' | 'xh' {
        // Simple language inference based on location or business context
        const location = this.extractLocationFromPhone(customerData.phone);
        if (location.includes('Cape Town')) return 'af';
        return 'en';
    }

    private determinePreferredContact(customerData: any): 'whatsapp' | 'sms' | 'email' | 'phone' {
        // Determine preferred contact method based on available data
        if (customerData.phone) return 'whatsapp';
        if (customerData.email) return 'email';
        return 'phone';
    }

    private extractPreferredServices(bookingHistory: any[]): string[] {
        const serviceCounts: Record<string, number> = {};
        bookingHistory.forEach(booking => {
            const serviceName = booking.service_name || 'Unknown';
            serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
        });

        return Object.entries(serviceCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([service]) => service);
    }

    private extractPreferredStylists(bookingHistory: any[]): string[] {
        const staffCounts: Record<string, number> = {};
        bookingHistory.forEach(booking => {
            const staffName = booking.staff_name || 'Unknown';
            staffCounts[staffName] = (staffCounts[staffName] || 0) + 1;
        });

        return Object.entries(staffCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([staff]) => staff);
    }

    private extractTimePreferences(bookingHistory: any[]): string[] {
        const timeCounts: Record<string, number> = {};
        bookingHistory.forEach(booking => {
            const time = booking.time || 'Unknown';
            timeCounts[time] = (timeCounts[time] || 0) + 1;
        });

        return Object.entries(timeCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([time]) => time);
    }

    private determinePriceSensitivity(bookingHistory: any[]): 'low' | 'medium' | 'high' {
        if (bookingHistory.length === 0) return 'medium';

        const avgSpending = bookingHistory.reduce((sum, booking) => sum + (booking.price || 0), 0) / bookingHistory.length;

        // This is a simplified calculation - in reality, you'd compare to market averages
        if (avgSpending > 500) return 'high';
        if (avgSpending > 200) return 'medium';
        return 'low';
    }

    private calculateLoyaltyTier(bookingHistory: any[]): 'bronze' | 'silver' | 'gold' | 'platinum' {
        const totalSpent = bookingHistory.reduce((sum, booking) => sum + (booking.price || 0), 0);
        const totalBookings = bookingHistory.length;

        if (totalSpent > 5000 || totalBookings > 20) return 'platinum';
        if (totalSpent > 2000 || totalBookings > 10) return 'gold';
        if (totalSpent > 500 || totalBookings > 3) return 'silver';
        return 'bronze';
    }

    private extractSpecialRequests(bookingHistory: any[]): string[] {
        const requests: string[] = [];
        bookingHistory.forEach(booking => {
            if (booking.notes) {
                requests.push(booking.notes);
            }
        });
        return requests.slice(0, 5);
    }

    private calculateRecencyScore(bookingHistory: any[]): number {
        if (bookingHistory.length === 0) return 0;

        const lastBooking = new Date(Math.max(...bookingHistory.map(b => new Date(b.created_at || b.datetime).getTime())));
        const daysSinceLastBooking = Math.floor((Date.now() - lastBooking.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceLastBooking <= 30) return 1;
        if (daysSinceLastBooking <= 90) return 0.7;
        if (daysSinceLastBooking <= 180) return 0.4;
        return 0.1;
    }

    private calculateFrequencyScore(bookingHistory: any[]): number {
        const totalBookings = bookingHistory.length;
        if (totalBookings >= 10) return 1;
        if (totalBookings >= 5) return 0.8;
        if (totalBookings >= 2) return 0.5;
        return 0.2;
    }

    private calculateMonetaryScore(bookingHistory: any[]): number {
        const totalSpent = bookingHistory.reduce((sum, booking) => sum + (booking.price || 0), 0);
        if (totalSpent >= 2000) return 1;
        if (totalSpent >= 1000) return 0.8;
        if (totalSpent >= 500) return 0.5;
        return 0.2;
    }

    private calculateRetentionProbability(bookingHistory: any[], loyaltyScore: number): number {
        return Math.min(loyaltyScore + 0.2, 1); // Simplified retention probability
    }

    private calculateReferralLikelihood(bookingHistory: any[], loyaltyScore: number): number {
        return Math.min(loyaltyScore * 0.8, 1); // Simplified referral likelihood
    }

    private calculateAverageDaysBetweenVisits(historyAnalysis: any): number {
        if (!historyAnalysis.lastVisit || historyAnalysis.totalBookings <= 1) return 30;
        return 30; // Simplified - in reality, calculate from actual booking dates
    }

    private calculateAverageServicePrice(services: Service[]): number {
        if (services.length === 0) return 0;
        const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
        return totalPrice / services.length;
    }

    private estimateCustomerLifetimeValue(historyAnalysis: any): number {
        const avgBookingValue = historyAnalysis.averageBookingValue || 0;
        const yearlyVisits = 12; // Estimate
        return avgBookingValue * yearlyVisits;
    }

    private extractOptimalTimes(historyAnalysis: any): string[] {
        return historyAnalysis.timePreferences || ['10:00', '14:00', '16:00'];
    }

    private calculatePriceAlignment(price: number, customerProfile: CustomerProfile): number {
        const avgSpend = customerProfile.history.averageBookingValue;
        const ratio = price / avgSpend;

        if (ratio >= 0.8 && ratio <= 1.2) return 1;
        if (ratio >= 0.6 && ratio <= 1.5) return 0.8;
        if (ratio >= 0.4 && ratio <= 2.0) return 0.6;
        return 0.3;
    }

    private getLoyaltyTierServiceBonus(tier: string, service: Service): number {
        const bonusMap: Record<string, number> = {
            bronze: service.isPopular ? 1 : 0.8,
            silver: service.isPopular ? 1 : 0.9,
            gold: 1,
            platinum: 1.1
        };
        return bonusMap[tier] || 0.8;
    }

    private determineBookingFrequency(bookingHistory: any[]): 'weekly' | 'monthly' | 'quarterly' | 'annually' {
        const totalBookings = bookingHistory.length;
        if (totalBookings >= 52) return 'weekly';
        if (totalBookings >= 12) return 'monthly';
        if (totalBookings >= 4) return 'quarterly';
        return 'annually';
    }

    private updateFavoriteServices(existingFavorites: string[], newService: string): string[] {
        const updated = [...existingFavorites];
        const index = updated.indexOf(newService);
        if (index > -1) {
            // Move to front if already exists
            updated.splice(index, 1);
            updated.unshift(newService);
        } else {
            // Add to front if new
            updated.unshift(newService);
        }
        return updated.slice(0, 5); // Keep top 5
    }

    private async generateUpdatedAIInsights(
        existingProfile: CustomerProfile,
        newBookingData: any,
        businessContext: BusinessContext
    ): Promise<any> {
        // Simplified update of AI insights
        return {
            ...existingProfile.aiInsights,
            churnRisk: Math.max(0, existingProfile.aiInsights.churnRisk - 0.1), // Reduce churn risk with new booking
            lifetimeValue: existingProfile.aiInsights.lifetimeValue + newBookingData.price
        };
    }
}

export default CustomerProfiler;
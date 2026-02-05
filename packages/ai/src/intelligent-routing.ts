/**
 * Intelligent Ticket Routing and Multi-Channel Support System
 * Handles priority-based assignment and multi-channel integration
 */

import { z } from 'zod';

import { customerSupportAI } from './customer-support-ai';

// Multi-Channel Support Types
export interface ChannelMessage {
    id: string;
    channel: 'chat' | 'email' | 'phone' | 'whatsapp' | 'social';
    customerId: string;
    ticketId: string;
    message: string;
    timestamp: Date;
    status: 'received' | 'processed' | 'responded' | 'escalated';
    metadata: {
        source: string;
        priority: 'low' | 'medium' | 'high' | 'critical';
        customerTier: 'basic' | 'premium' | 'vip';
        issueCategory: string;
        urgency: number; // 1-10 scale
    };
}

export interface SupportAgent {
    id: string;
    name: string;
    email: string;
    skills: string[];
    availability: 'available' | 'busy' | 'away' | 'offline';
    currentLoad: number; // Number of active tickets
    maxLoad: number;
    performance: {
        firstContactResolution: number;
        avgResponseTime: number;
        customerSatisfaction: number;
        ticketsResolved: number;
    };
    specializations: string[];
    language: string[];
    timezone: string;
}

export interface RoutingRule {
    id: string;
    name: string;
    priority: number;
    conditions: {
        category?: string[];
        priority?: ('low' | 'medium' | 'high' | 'critical')[];
        customerTier?: ('basic' | 'premium' | 'vip')[];
        language?: string[];
        timeOfDay?: {
            start: string;
            end: string;
        };
        issueComplexity?: ('simple' | 'moderate' | 'complex')[];
    };
    actions: {
        assignTo?: string; // agent ID
        assignToTeam?: string;
        autoResolve?: boolean;
        escalateTo?: string;
        priorityBoost?: number;
    };
}

export class IntelligentTicketRouting {
    private agents: Map<string, SupportAgent> = new Map();
    private routingRules: RoutingRule[] = [];
    private messageQueue: ChannelMessage[] = [];

    constructor() {
        this.initializeAgents();
        this.initializeRoutingRules();
    }

    /**
     * Intelligent Message Processing and Routing
     */
    async processMessage(message: Omit<ChannelMessage, 'id' | 'timestamp' | 'status'>): Promise<{
        ticketId: string;
        assignedAgent?: string;
        routingDecision: {
            primary: string;
            fallback: string[];
            confidence: number;
            reasoning: string;
        };
        estimatedResponseTime: number;
        priority: string;
    }> {
        // Create ticket from message
        const ticketId = this.generateTicketId();

        // Classify message using AI
        const classification = await this.classifyChannelMessage(message);

        // Apply routing rules
        const routingDecision = await this.determineRouting(classification);

        // Find best agent
        const assignedAgent = await this.findBestAgent(routingDecision, classification);

        // Calculate response time
        const estimatedResponseTime = this.calculateResponseTime(classification, assignedAgent);

        return {
            ticketId,
            assignedAgent,
            routingDecision,
            estimatedResponseTime,
            priority: classification.priority,
        };
    }

    /**
     * Multi-Channel Integration Manager
     */
    async handleMultiChannelMessage(message: ChannelMessage): Promise<{
        response: string;
        channel: string;
        escalation: boolean;
        nextActions: string[];
    }> {
        // Process message based on channel characteristics
        switch (message.channel) {
            case 'chat':
                return await this.handleChatMessage(message);
            case 'email':
                return await this.handleEmailMessage(message);
            case 'phone':
                return await this.handlePhoneMessage(message);
            case 'whatsapp':
                return await this.handleWhatsAppMessage(message);
            case 'social':
                return await this.handleSocialMediaMessage(message);
            default:
                throw new Error(`Unsupported channel: ${message.channel}`);
        }
    }

    /**
     * Proactive Support Automation
     */
    async initiateProactiveSupport(): Promise<{
        triggers: Array<{
            type: 'inactivity' | 'error' | 'abandonment' | 'performance';
            customerId: string;
            message: string;
            actions: string[];
        }>;
        automatedResponses: string[];
        escalationAlerts: string[];
    }> {
        const proactiveTriggers = await this.analyzeProactiveTriggers();
        const automatedResponses = await this.generateProactiveResponses(proactiveTriggers);

        return {
            triggers: proactiveTriggers,
            automatedResponses,
            escalationAlerts: await this.generateEscalationAlerts(proactiveTriggers),
        };
    }

    /**
     * Self-Service Knowledge Base Integration
     */
    async generateKnowledgeBaseResponse(query: string, context: any): Promise<{
        response: string;
        confidence: number;
        relatedArticles: Array<{
            title: string;
            url: string;
            relevance: number;
        }>;
        requiresHuman: boolean;
        suggestedActions: string[];
    }> {
        const knowledgePrompt = `
      Generate a comprehensive self-service response for this customer query:
      
      Query: ${query}
      Context: ${JSON.stringify(context, null, 2)}
      
      Provide:
      1. Clear, helpful response
      2. Step-by-step instructions if applicable
      3. Related articles for further reading
      4. Confidence level (0-100%)
      5. Whether human escalation is needed
      6. Suggested next actions
      
      Focus on appointmentbooking.co.za specific solutions.
    `;

        try {
            const result = await customerSupportAI.generateFirstContactResponse(
                {
                    id: 'kb_query',
                    customerId: context.customerId,
                    priority: 'low',
                    category: 'general',
                    subject: query,
                    message: query,
                    status: 'open',
                    firstContactResolution: false,
                    responseTime: 0,
                    customerSatisfaction: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                []
            );

            return {
                response: result.response,
                confidence: result.confidence,
                relatedArticles: await this.findRelatedArticles(query),
                requiresHuman: result.escalationNeeded,
                suggestedActions: result.suggestedActions,
            };
        } catch (error) {
            console.error('Knowledge base response error:', error);
            return {
                response: "I couldn't find specific information for your query. Please contact our support team for personalized assistance.",
                confidence: 0.3,
                relatedArticles: [],
                requiresHuman: true,
                suggestedActions: ['contact_support', 'browse_faq'],
            };
        }
    }

    // Private Methods
    private async classifyChannelMessage(message: Omit<ChannelMessage, 'id' | 'timestamp' | 'status'>): Promise<{
        category: string;
        priority: string;
        complexity: 'simple' | 'moderate' | 'complex';
        sentiment: 'positive' | 'neutral' | 'negative';
        urgency: number;
        requiresEscalation: boolean;
    }> {
        // AI-powered classification based on channel and content
        const sentimentAnalysis = await this.analyzeSentiment(message.message);
        const urgencyScore = this.calculateUrgency(message.message, message.metadata);

        return {
            category: this.determineCategory(message.message),
            priority: this.determinePriority(message.metadata.priority, urgencyScore),
            complexity: this.determineComplexity(message.message),
            sentiment: sentimentAnalysis,
            urgency: urgencyScore,
            requiresEscalation: urgencyScore > 8 || sentimentAnalysis === 'negative',
        };
    }

    private async determineRouting(classification: any): Promise<{
        primary: string;
        fallback: string[];
        confidence: number;
        reasoning: string;
    }> {
        // Apply routing rules
        const matchedRules = this.routingRules
            .filter(rule => this.ruleMatches(rule, classification))
            .sort((a, b) => b.priority - a.priority);

        if (matchedRules.length > 0) {
            const primaryRule = matchedRules[0];
            return {
                primary: primaryRule.actions.assignToTeam || 'general_support',
                fallback: ['tier_2_support', 'specialist_support'],
                confidence: 0.9,
                reasoning: `Matched rule: ${primaryRule.name}`,
            };
        }

        return {
            primary: 'general_support',
            fallback: ['tier_2_support'],
            confidence: 0.7,
            reasoning: 'Default routing to general support',
        };
    }

    private async findBestAgent(routingDecision: any, classification: any): Promise<string | undefined> {
        const availableAgents = Array.from(this.agents.values())
            .filter(agent => agent.availability === 'available' && agent.currentLoad < agent.maxLoad)
            .filter(agent => this.agentMatches(agent, classification))
            .sort((a, b) => this.calculateAgentScore(b) - this.calculateAgentScore(a));

        return availableAgents[0]?.id;
    }

    private calculateResponseTime(classification: any, assignedAgent?: string): number {
        let baseTime = 2; // 2 minutes base

        // Adjust based on priority
        const priorityMultipliers = {
            'low': 1.5,
            'medium': 1.0,
            'high': 0.5,
            'critical': 0.25,
        };

        baseTime *= priorityMultipliers[classification.priority as keyof typeof priorityMultipliers] || 1.0;

        // Adjust based on complexity
        const complexityMultipliers: Record<string, number> = {
            'simple': 0.8,
            'moderate': 1.0,
            'complex': 1.5,
        };

        baseTime *= complexityMultipliers[classification.complexity] || 1.0;

        return Math.max(0.5, Math.min(baseTime, 10));
    }

    // Channel-Specific Handlers
    private async handleChatMessage(message: ChannelMessage): Promise<{
        response: string;
        channel: string;
        escalation: boolean;
        nextActions: string[];
    }> {
        const kbResponse = await this.generateKnowledgeBaseResponse(message.message, {
            customerId: message.customerId,
            channel: 'chat',
        });

        return {
            response: `💬 ${kbResponse.response}`,
            channel: 'chat',
            escalation: kbResponse.requiresHuman,
            nextActions: kbResponse.suggestedActions,
        };
    }

    private async handleEmailMessage(message: ChannelMessage): Promise<{
        response: string;
        channel: string;
        escalation: boolean;
        nextActions: string[];
    }> {
        const kbResponse = await this.generateKnowledgeBaseResponse(message.message, {
            customerId: message.customerId,
            channel: 'email',
        });

        return {
            response: `📧 Dear Customer,\n\n${kbResponse.response}\n\nBest regards,\nAppointment Booking Support`,
            channel: 'email',
            escalation: kbResponse.requiresHuman,
            nextActions: [...kbResponse.suggestedActions, 'schedule_follow_up'],
        };
    }

    private async handlePhoneMessage(message: ChannelMessage): Promise<{
        response: string;
        channel: string;
        escalation: boolean;
        nextActions: string[];
    }> {
        // Phone messages are typically more urgent
        const urgentResponse = "Thank you for calling! We've noted your concern and will have a specialist contact you within 15 minutes. Your ticket reference is: ";

        return {
            response: urgentResponse,
            channel: 'phone',
            escalation: true,
            nextActions: ['assign_to_phone_specialist', 'send_sms_confirmation'],
        };
    }

    private async handleWhatsAppMessage(message: ChannelMessage): Promise<{
        response: string;
        channel: string;
        escalation: boolean;
        nextActions: string[];
    }> {
        const kbResponse = await this.generateKnowledgeBaseResponse(message.message, {
            customerId: message.customerId,
            channel: 'whatsapp',
        });

        return {
            response: `👋 ${kbResponse.response}`,
            channel: 'whatsapp',
            escalation: kbResponse.requiresHuman,
            nextActions: [...kbResponse.suggestedActions, 'offer_voice_call'],
        };
    }

    private async handleSocialMediaMessage(message: ChannelMessage): Promise<{
        response: string;
        channel: string;
        escalation: boolean;
        nextActions: string[];
    }> {
        // Social media requires more public-friendly responses
        const response = "Thanks for reaching out! We've received your message and will respond privately with help. Please check your DMs or email us directly.";

        return {
            response,
            channel: 'social',
            escalation: false,
            nextActions: ['send_private_message', 'log_social_interaction'],
        };
    }

    // Helper Methods
    private generateTicketId(): string {
        return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private async analyzeSentiment(message: string): Promise<'positive' | 'neutral' | 'negative'> {
        // Simplified sentiment analysis
        const negativeWords = ['angry', 'frustrated', 'terrible', 'awful', 'hate', 'worst', 'horrible'];
        const positiveWords = ['great', 'excellent', 'love', 'amazing', 'wonderful', 'perfect', 'awesome'];

        const lowerMessage = message.toLowerCase();

        if (negativeWords.some(word => lowerMessage.includes(word))) return 'negative';
        if (positiveWords.some(word => lowerMessage.includes(word))) return 'positive';
        return 'neutral';
    }

    private calculateUrgency(message: string, metadata: any): number {
        let urgency = 3; // base urgency

        // Keywords that indicate urgency
        const urgentKeywords = ['urgent', 'asap', 'immediately', 'emergency', 'critical', 'now'];
        const mediumKeywords = ['soon', 'quickly', 'priority', 'important'];

        const lowerMessage = message.toLowerCase();

        if (urgentKeywords.some(keyword => lowerMessage.includes(keyword))) urgency += 4;
        if (mediumKeywords.some(keyword => lowerMessage.includes(keyword))) urgency += 2;

        // Adjust based on customer tier
        const tierMultipliers = { basic: 1, premium: 1.2, vip: 1.5 };
        urgency *= tierMultipliers[metadata.customerTier as keyof typeof tierMultipliers] || 1;

        return Math.min(urgency, 10);
    }

    private determineCategory(message: string): string {
        const categories = {
            booking: ['appointment', 'schedule', 'book', 'reschedule', 'cancel'],
            payment: ['payment', 'billing', 'charge', 'refund', 'invoice'],
            technical: ['error', 'bug', 'issue', 'problem', 'not working'],
            account: ['account', 'profile', 'login', 'password', 'register'],
        };

        const lowerMessage = message.toLowerCase();
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                return category;
            }
        }
        return 'general';
    }

    private determinePriority(metadataPriority: string, urgencyScore: number): string {
        if (metadataPriority === 'critical' || urgencyScore >= 8) return 'critical';
        if (metadataPriority === 'high' || urgencyScore >= 6) return 'high';
        if (metadataPriority === 'medium' || urgencyScore >= 4) return 'medium';
        return 'low';
    }

    private determineComplexity(message: string): 'simple' | 'moderate' | 'complex' {
        const complexIndicators = ['integration', 'custom', 'development', 'configuration', 'multiple'];
        const simpleIndicators = ['simple', 'quick', 'basic', 'just', 'only'];

        const lowerMessage = message.toLowerCase();

        if (complexIndicators.some(indicator => lowerMessage.includes(indicator))) return 'complex';
        if (simpleIndicators.some(indicator => lowerMessage.includes(indicator))) return 'simple';
        return 'moderate';
    }

    private ruleMatches(rule: RoutingRule, classification: any): boolean {
        // Check if rule conditions match the classification
        return true; // Simplified - implement full rule matching logic
    }

    private agentMatches(agent: SupportAgent, classification: any): boolean {
        return agent.skills.includes(classification.category);
    }

    private calculateAgentScore(agent: SupportAgent): number {
        const performanceScore = (
            agent.performance.firstContactResolution * 0.4 +
            (1 - agent.performance.avgResponseTime / 10) * 0.3 +
            agent.performance.customerSatisfaction * 0.3
        );

        const loadScore = 1 - (agent.currentLoad / agent.maxLoad);

        return performanceScore * 0.7 + loadScore * 0.3;
    }

    private async analyzeProactiveTriggers(): Promise<Array<{
        type: 'inactivity' | 'error' | 'abandonment' | 'performance';
        customerId: string;
        message: string;
        actions: string[];
    }>> {
        return [
            {
                type: 'abandonment',
                customerId: 'customer_123',
                message: 'Customer started booking but didn\'t complete. Send helpful reminder.',
                actions: ['send_booking_reminder', 'offer_assistance'],
            },
            {
                type: 'error',
                customerId: 'customer_456',
                message: 'Customer experienced payment error. Proactively offer support.',
                actions: ['send_payment_help', 'offer_alternate_payment'],
            },
        ];
    }

    private async generateProactiveResponses(triggers: any[]): Promise<string[]> {
        return [
            'Hi! We noticed you might need help with your booking. Here\'s a quick tip...',
            'We see you had a payment issue. Here\'s how to resolve it...',
        ];
    }

    private async generateEscalationAlerts(triggers: any[]): Promise<string[]> {
        return [
            'VIP customer abandonment alert: Customer_123',
            'Payment error cluster detected: 3 customers affected',
        ];
    }

    private async findRelatedArticles(query: string): Promise<Array<{ title: string; url: string; relevance: number }>> {
        return [
            { title: 'How to Book Your First Appointment', url: '/help/booking-guide', relevance: 0.9 },
            { title: 'Payment Troubleshooting', url: '/help/payment-issues', relevance: 0.8 },
        ];
    }

    private initializeAgents(): void {
        const agents: SupportAgent[] = [
            {
                id: 'agent_001',
                name: 'Sarah Johnson',
                email: 'sarah@appointmentbooking.co.za',
                skills: ['booking', 'account', 'general'],
                availability: 'available',
                currentLoad: 2,
                maxLoad: 8,
                performance: {
                    firstContactResolution: 0.95,
                    avgResponseTime: 1.2,
                    customerSatisfaction: 4.8,
                    ticketsResolved: 1250,
                },
                specializations: ['booking', 'scheduling'],
                language: ['en', 'af'],
                timezone: 'Africa/Johannesburg',
            },
            {
                id: 'agent_002',
                name: 'Mike Chen',
                email: 'mike@appointmentbooking.co.za',
                skills: ['payment', 'technical', 'booking'],
                availability: 'available',
                currentLoad: 1,
                maxLoad: 6,
                performance: {
                    firstContactResolution: 0.92,
                    avgResponseTime: 1.8,
                    customerSatisfaction: 4.6,
                    ticketsResolved: 980,
                },
                specializations: ['payment', 'technical'],
                language: ['en'],
                timezone: 'Africa/Johannesburg',
            },
        ];

        agents.forEach(agent => this.agents.set(agent.id, agent));
    }

    private initializeRoutingRules(): void {
        this.routingRules = [
            {
                id: 'rule_001',
                name: 'Critical Payment Issues',
                priority: 100,
                conditions: {
                    category: ['payment'],
                    priority: ['critical', 'high'],
                },
                actions: {
                    assignToTeam: 'payment_specialists',
                    priorityBoost: 5,
                },
            },
            {
                id: 'rule_002',
                name: 'VIP Customer Routing',
                priority: 90,
                conditions: {
                    customerTier: ['vip'],
                },
                actions: {
                    assignToTeam: 'vip_support',
                    priorityBoost: 3,
                },
            },
        ];
    }
}

// Export singleton instance
export const ticketRouting = new IntelligentTicketRouting();
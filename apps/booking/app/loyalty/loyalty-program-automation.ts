// Loyalty Programs and VIP Tier Management with Automated Benefits
// Advanced loyalty automation for appointmentbooking.co.za

import { CustomerProfile, Service, Product, BusinessContext } from '../../types';

export interface LoyaltyTier {
    id: string;
    name: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    displayName: string;
    requirements: {
        minBookings: number;
        minSpent: number;
        minTenure: number; // days
        specialCriteria?: string[];
    };
    benefits: {
        discountPercentage: number;
        priorityBooking: boolean;
        exclusiveAccess: boolean;
        freeServices: number; // per month
        birthdayRewards: number; // value
        anniversaryRewards: number; // value
        referralRewards: number; // multiplier
        supportPriority: 'standard' | 'priority' | 'vip' | 'concierge';
    };
    visual: {
        color: string;
        badgeIcon: string;
        cardDesign: string;
    };
    marketing: {
        welcomeMessage: string;
        upgradeMessage: string;
        retentionMessage: string;
    };
}

export interface LoyaltyPoints {
    customerId: string;
    tenantId: string;
    currentBalance: number;
    lifetimeEarned: number;
    lifetimeRedeemed: number;
    tier: LoyaltyTier['name'];
    pointsHistory: {
        id: string;
        type: 'earned' | 'redeemed' | 'bonus' | 'expired';
        amount: number;
        description: string;
        source: 'booking' | 'referral' | 'review' | 'birthday' | 'anniversary' | 'promotion';
        timestamp: Date;
        expiresAt?: Date;
        metadata?: any;
    }[];
    nextTierProgress: {
        targetTier: LoyaltyTier['name'];
        progress: number; // 0-100
        requirements: {
            bookings?: number;
            spent?: number;
            tenure?: number;
        };
        estimatedDate?: Date;
    };
}

export interface LoyaltyReward {
    id: string;
    name: string;
    description: string;
    type: 'discount' | 'free_service' | 'product' | 'cashback' | 'experience' | 'exclusive_access';
    value: number;
    costInPoints: number;
    tierRequirements: LoyaltyTier['name'][];
    isActive: boolean;
    validFrom: Date;
    validUntil: Date;
    usageLimit?: number;
    currentUsage: number;
    metadata: {
        category: string;
        tags: string[];
        seasonal: boolean;
        autoGrant: boolean;
    };
}

export interface LoyaltyCampaign {
    id: string;
    name: string;
    type: 'tier_progression' | 'point_multiplier' | 'bonus_points' | 'exclusive_offer' | 'birthday' | 'anniversary';
    targetSegment: {
        tiers: LoyaltyTier['name'][];
        customerCriteria: {
            minBookings?: number;
            minSpent?: number;
            tenure?: number;
            lastVisit?: number; // days
        };
    };
    rewards: {
        primaryReward: LoyaltyReward;
        secondaryRewards?: LoyaltyReward[];
    };
    timing: {
        trigger: 'immediate' | 'scheduled' | 'behavioral' | 'milestone';
        schedule?: {
            startDate: Date;
            endDate: Date;
            frequency?: 'once' | 'daily' | 'weekly' | 'monthly' | 'annually';
        };
        conditions?: string[];
    };
    performance: {
        sentCount: number;
        openedCount: number;
        convertedCount: number;
        revenueGenerated: number;
        pointsAwarded: number;
    };
    status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
    createdAt: Date;
}

export interface VIPCustomerProfile extends CustomerProfile {
    vipStatus: {
        tier: 'vip' | 'super_vip' | 'diamond_vip' | 'prestige_vip';
        joinedDate: Date;
        specialPrivileges: {
            personalConcierge: boolean;
            prioritySupport: boolean;
            exclusiveEvents: boolean;
            customServices: boolean;
            advanceBooking: number; // days
            specialDiscounts: number;
            loyaltyMultiplier: number;
        };
        accountManager?: {
            name: string;
            email: string;
            phone: string;
            lastContact: Date;
        };
        preferences: {
            communicationPreference: 'personal' | 'email' | 'whatsapp' | 'phone';
            serviceFrequency: 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly';
            specialOccasions: {
                birthdays: Date[];
                anniversaries: Date[];
                celebrations: string[];
            };
            exclusiveAccess: {
                newServices: boolean;
                betaFeatures: boolean;
                privateEvents: boolean;
                limitedEditions: boolean;
            };
        };
        exclusiveBenefits: {
            complimentaryServices: number;
            discountPercentage: number;
            priorityBooking: boolean;
            customPackages: boolean;
            homeService: boolean;
            groupDiscounts: number;
        };
    };
}

export class LoyaltyProgramAutomation {
    private loyaltyTiers: LoyaltyTier[] = [
        {
            id: 'bronze',
            name: 'bronze',
            displayName: 'Bronze Member',
            requirements: { minBookings: 1, minSpent: 0, minTenure: 0 },
            benefits: {
                discountPercentage: 0,
                priorityBooking: false,
                exclusiveAccess: false,
                freeServices: 0,
                birthdayRewards: 0,
                anniversaryRewards: 50,
                referralRewards: 1.0,
                supportPriority: 'standard'
            },
            visual: { color: '#CD7F32', badgeIcon: '🥉', cardDesign: 'bronze' },
            marketing: {
                welcomeMessage: 'Welcome to our loyalty program! Start earning points with every visit.',
                upgradeMessage: 'Book 2 more services to reach Silver tier and unlock exclusive benefits!',
                retentionMessage: 'Thank you for being a valued Bronze member. Continue earning points!'
            }
        },
        {
            id: 'silver',
            name: 'silver',
            displayName: 'Silver Member',
            requirements: { minBookings: 3, minSpent: 500, minTenure: 30 },
            benefits: {
                discountPercentage: 5,
                priorityBooking: false,
                exclusiveAccess: true,
                freeServices: 1,
                birthdayRewards: 100,
                anniversaryRewards: 150,
                referralRewards: 1.25,
                supportPriority: 'priority'
            },
            visual: { color: '#C0C0C0', badgeIcon: '🥈', cardDesign: 'silver' },
            marketing: {
                welcomeMessage: 'Congratulations on reaching Silver tier! Enjoy 5% discounts and priority support.',
                upgradeMessage: 'Almost at Gold! Just 5 more bookings to unlock premium benefits.',
                retentionMessage: 'Thank you for your loyalty as a Silver member. We appreciate you!'
            }
        },
        {
            id: 'gold',
            name: 'gold',
            displayName: 'Gold Member',
            requirements: { minBookings: 8, minSpent: 2000, minTenure: 90 },
            benefits: {
                discountPercentage: 10,
                priorityBooking: true,
                exclusiveAccess: true,
                freeServices: 2,
                birthdayRewards: 200,
                anniversaryRewards: 300,
                referralRewards: 1.5,
                supportPriority: 'vip'
            },
            visual: { color: '#FFD700', badgeIcon: '🥇', cardDesign: 'gold' },
            marketing: {
                welcomeMessage: 'Welcome to Gold tier! Enjoy premium benefits including priority booking and exclusive access.',
                upgradeMessage: 'Platinum tier awaits! Enjoy unlimited access to our finest services.',
                retentionMessage: 'Thank you for being a Gold member. Your loyalty means everything to us!'
            }
        },
        {
            id: 'platinum',
            name: 'platinum',
            displayName: 'Platinum Member',
            requirements: { minBookings: 15, minSpent: 5000, minTenure: 180 },
            benefits: {
                discountPercentage: 15,
                priorityBooking: true,
                exclusiveAccess: true,
                freeServices: 3,
                birthdayRewards: 300,
                anniversaryRewards: 500,
                referralRewards: 2.0,
                supportPriority: 'vip'
            },
            visual: { color: '#E5E4E2', badgeIcon: '💎', cardDesign: 'platinum' },
            marketing: {
                welcomeMessage: 'Welcome to Platinum tier! Experience our highest level of service and exclusivity.',
                upgradeMessage: 'Welcome to our elite tier! Enjoy Diamond-level privileges.',
                retentionMessage: 'Thank you for your exceptional loyalty as a Platinum member.'
            }
        },
        {
            id: 'diamond',
            name: 'diamond',
            displayName: 'Diamond Member',
            requirements: { minBookings: 30, minSpent: 10000, minTenure: 365, specialCriteria: ['invitation_only'] },
            benefits: {
                discountPercentage: 20,
                priorityBooking: true,
                exclusiveAccess: true,
                freeServices: 5,
                birthdayRewards: 500,
                anniversaryRewards: 1000,
                referralRewards: 3.0,
                supportPriority: 'concierge'
            },
            visual: { color: '#B9F2FF', badgeIcon: '💎', cardDesign: 'diamond' },
            marketing: {
                welcomeMessage: 'Welcome to Diamond tier! You are among our most valued VIP customers.',
                upgradeMessage: 'You have reached the pinnacle of our loyalty program!',
                retentionMessage: 'Thank you for being a Diamond VIP. Your continued trust inspires us!'
            }
        }
    ];

    private loyaltyPointsCache: Map<string, LoyaltyPoints> = new Map();
    private activeCampaigns: Map<string, LoyaltyCampaign> = new Map();
    private availableRewards: Map<string, LoyaltyReward> = new Map();

    constructor() {
        this.initializeRewardsCatalog();
        this.initializeDefaultCampaigns();
    }

    /**
     * Calculate and update customer loyalty tier
     */
    async calculateLoyaltyTier(
        customerProfile: CustomerProfile,
        bookingHistory: any[]
    ): Promise<{
        currentTier: LoyaltyTier;
        nextTier?: LoyaltyTier;
        progress: number;
        requirements: any;
    }> {
        try {
            // Calculate customer metrics
            const metrics = this.calculateCustomerMetrics(customerProfile, bookingHistory);

            // Determine current tier
            const currentTier = this.determineCurrentTier(metrics);

            // Calculate progress to next tier
            const nextTierIndex = this.loyaltyTiers.findIndex(t => t.name === currentTier.name) + 1;
            const nextTier = nextTierIndex < this.loyaltyTiers.length ? this.loyaltyTiers[nextTierIndex] : undefined;

            let progress = 100; // Already at highest tier
            if (nextTier) {
                progress = this.calculateTierProgress(metrics, nextTier);
            }

            return {
                currentTier,
                nextTier,
                progress,
                requirements: {
                    current: metrics,
                    next: nextTier?.requirements
                }
            };
        } catch (error) {
            console.error('Error calculating loyalty tier:', error);
            throw error;
        }
    }

    /**
     * Manage loyalty points earning and redemption
     */
    async manageLoyaltyPoints(
        customerProfile: CustomerProfile,
        action: 'earn' | 'redeem' | 'expire',
        pointsData: {
            amount: number;
            source: LoyaltyPoints['pointsHistory'][0]['source'];
            description: string;
            bookingId?: string;
            rewardId?: string;
        }
    ): Promise<LoyaltyPoints> {
        try {
            const pointsKey = `${customerProfile.tenantId}_${customerProfile.id}`;
            let loyaltyPoints = this.loyaltyPointsCache.get(pointsKey);

            // Initialize if doesn't exist
            if (!loyaltyPoints) {
                loyaltyPoints = {
                    customerId: customerProfile.id,
                    tenantId: customerProfile.tenantId,
                    currentBalance: 0,
                    lifetimeEarned: 0,
                    lifetimeRedeemed: 0,
                    tier: 'bronze',
                    pointsHistory: [],
                    nextTierProgress: {
                        targetTier: 'silver',
                        progress: 0,
                        requirements: {}
                    }
                };
            }

            // Process the action
            let entryType: 'earned' | 'redeemed' | 'expired';
            if (action === 'earn') {
                entryType = 'earned';
            } else if (action === 'redeem') {
                entryType = 'redeemed';
            } else {
                entryType = 'expired';
            }

            const historyEntry = {
                id: `ph_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: entryType,
                amount: action === 'redeem' ? -pointsData.amount : pointsData.amount,
                description: pointsData.description,
                source: pointsData.source,
                timestamp: new Date(),
                expiresAt: this.calculatePointsExpiry(action, pointsData.source),
                metadata: {
                    bookingId: pointsData.bookingId,
                    rewardId: pointsData.rewardId
                }
            };

            // Update balance and history
            loyaltyPoints.pointsHistory.unshift(historyEntry);
            loyaltyPoints.currentBalance += historyEntry.amount;
            loyaltyPoints.lifetimeEarned += action === 'earn' ? pointsData.amount : 0;
            loyaltyPoints.lifetimeRedeemed += action === 'redeem' ? pointsData.amount : 0;

            // Apply tier-based multipliers for earning
            if (action === 'earn') {
                const tierMultiplier = this.getTierMultiplier(customerProfile.preferences.loyaltyTier);
                const bonusPoints = Math.floor(pointsData.amount * (tierMultiplier - 1));
                if (bonusPoints > 0) {
                    const bonusEntry = {
                        ...historyEntry,
                        id: `bonus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        amount: bonusPoints,
                        description: `${customerProfile.preferences.loyaltyTier} tier bonus`,
                        type: 'bonus' as const
                    };
                    loyaltyPoints.pointsHistory.unshift(bonusEntry);
                    loyaltyPoints.currentBalance += bonusPoints;
                    loyaltyPoints.lifetimeEarned += bonusPoints;
                }
            }

            // Update tier
            const tierCalculation = await this.calculateLoyaltyTier(customerProfile, []);
            loyaltyPoints.tier = tierCalculation.currentTier.name;

            // Update next tier progress
            loyaltyPoints.nextTierProgress = this.calculateNextTierProgress(
                customerProfile,
                loyaltyPoints.tier
            );

            // Clean up expired points
            await this.cleanupExpiredPoints(loyaltyPoints);

            // Cache updated points
            this.loyaltyPointsCache.set(pointsKey, loyaltyPoints);

            return loyaltyPoints;
        } catch (error) {
            console.error('Error managing loyalty points:', error);
            throw error;
        }
    }

    /**
     * Execute automated tier progression rewards
     */
    async executeTierProgressionRewards(
        customerProfile: CustomerProfile,
        fromTier: LoyaltyTier['name'],
        toTier: LoyaltyTier['name']
    ): Promise<{
        rewards: LoyaltyReward[];
        messages: string[];
        benefits: any[];
    }> {
        try {
            const rewards: LoyaltyReward[] = [];
            const messages: string[] = [];
            const benefits: any[] = [];

            const fromTierData = this.loyaltyTiers.find(t => t.name === fromTier);
            const toTierData = this.loyaltyTiers.find(t => t.name === toTier);

            if (!toTierData) {
                throw new Error('Invalid target tier');
            }

            // Award tier progression bonus points
            const bonusPoints = this.calculateTierProgressionBonus(toTier);
            await this.manageLoyaltyPoints(customerProfile, 'earn', {
                amount: bonusPoints,
                source: 'promotion',
                description: `Tier progression bonus: ${fromTierData?.displayName} → ${toTierData.displayName}`
            });

            rewards.push({
                id: `tier_bonus_${Date.now()}`,
                name: 'Tier Progression Bonus',
                description: `Bonus points for reaching ${toTierData.displayName}`,
                type: 'discount',
                value: bonusPoints,
                costInPoints: 0,
                tierRequirements: [toTier],
                isActive: true,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                usageLimit: 1,
                currentUsage: 0,
                metadata: {
                    category: 'tier_progression',
                    tags: ['bonus', 'progression'],
                    seasonal: false,
                    autoGrant: true
                }
            });

            // Award tier-specific rewards
            const tierRewards = this.getTierSpecificRewards(toTier);
            rewards.push(...tierRewards);

            // Generate messages
            messages.push(
                `🎉 Congratulations! You've been upgraded to ${toTierData.displayName}!`,
                `You've earned ${bonusPoints} bonus points as a welcome gift.`,
                `Enjoy your new benefits: ${toTierData.benefits.discountPercentage}% discount, ${toTierData.benefits.freeServices} free service(s) per month.`
            );

            // Calculate benefit improvements
            if (fromTierData) {
                const benefitImprovements = {
                    discountIncrease: toTierData.benefits.discountPercentage - fromTierData.benefits.discountPercentage,
                    freeServicesIncrease: toTierData.benefits.freeServices - fromTierData.benefits.freeServices,
                    priorityBookingGained: toTierData.benefits.priorityBooking && !fromTierData.benefits.priorityBooking,
                    exclusiveAccessGained: toTierData.benefits.exclusiveAccess && !fromTierData.benefits.exclusiveAccess
                };
                benefits.push(benefitImprovements);
            }

            return {
                rewards,
                messages,
                benefits
            };
        } catch (error) {
            console.error('Error executing tier progression rewards:', error);
            throw error;
        }
    }

    /**
     * Execute automated birthday and anniversary campaigns
     */
    async executeSpecialOccasionCampaigns(
        customerProfile: CustomerProfile,
        occasionType: 'birthday' | 'anniversary' | 'milestone'
    ): Promise<{
        campaign: LoyaltyCampaign;
        rewards: LoyaltyReward[];
        messages: string[];
    }> {
        try {
            const campaignId = `special_${customerProfile.id}_${Date.now()}`;
            const currentTier = this.loyaltyTiers.find(t => t.name === customerProfile.preferences.loyaltyTier);

            // Determine campaign details based on occasion and tier
            const campaign = this.createSpecialOccasionCampaign(
                campaignId,
                customerProfile,
                occasionType,
                currentTier!
            );

            // Generate rewards for the occasion
            const rewards = this.generateSpecialOccasionRewards(
                customerProfile,
                occasionType,
                currentTier!
            );

            // Generate personalized messages
            const messages = this.generateSpecialOccasionMessages(
                customerProfile,
                occasionType,
                currentTier!,
                rewards
            );

            // Execute the campaign
            campaign.status = 'active';
            campaign.performance.sentCount = 1;

            this.activeCampaigns.set(campaignId, campaign);

            return {
                campaign,
                rewards,
                messages
            };
        } catch (error) {
            console.error('Error executing special occasion campaigns:', error);
            throw error;
        }
    }

    /**
     * Manage VIP customer benefits and privileges
     */
    async manageVIPBenefits(
        customerProfile: CustomerProfile,
        action: 'upgrade_to_vip' | 'downgrade_from_vip' | 'update_benefits' | 'assign_account_manager',
        vipData?: Partial<VIPCustomerProfile['vipStatus']>
    ): Promise<VIPCustomerProfile> {
        try {
            const vipProfile: VIPCustomerProfile = {
                ...customerProfile,
                vipStatus: (customerProfile as VIPCustomerProfile).vipStatus || {
                    tier: 'vip',
                    joinedDate: new Date(),
                    specialPrivileges: {
                        personalConcierge: false,
                        prioritySupport: true,
                        exclusiveEvents: false,
                        customServices: false,
                        advanceBooking: 7,
                        specialDiscounts: 15,
                        loyaltyMultiplier: 1.5
                    },
                    preferences: {
                        communicationPreference: 'email',
                        serviceFrequency: 'monthly',
                        specialOccasions: {
                            birthdays: [],
                            anniversaries: [],
                            celebrations: []
                        },
                        exclusiveAccess: {
                            newServices: true,
                            betaFeatures: false,
                            privateEvents: false,
                            limitedEditions: true
                        }
                    },
                    exclusiveBenefits: {
                        complimentaryServices: 2,
                        discountPercentage: 15,
                        priorityBooking: true,
                        customPackages: true,
                        homeService: false,
                        groupDiscounts: 20
                    }
                }
            };

            switch (action) {
                case 'upgrade_to_vip':
                    vipProfile.vipStatus = this.upgradeToVIPTier(vipProfile.vipStatus, vipData);
                    break;

                case 'downgrade_from_vip':
                    vipProfile.vipStatus = this.downgradeFromVIPTier(vipProfile.vipStatus);
                    break;

                case 'update_benefits':
                    if (vipData) {
                        vipProfile.vipStatus = { ...vipProfile.vipStatus, ...vipData };
                    }
                    break;

                case 'assign_account_manager':
                    if (vipData?.accountManager) {
                        vipProfile.vipStatus.accountManager = vipData.accountManager;
                    }
                    break;
            }

            return vipProfile;
        } catch (error) {
            console.error('Error managing VIP benefits:', error);
            throw error;
        }
    }

    /**
     * Execute automated loyalty campaigns
     */
    async executeLoyaltyCampaigns(
        customerProfiles: CustomerProfile[],
        businessContext: BusinessContext
    ): Promise<{
        campaignsExecuted: number;
        rewardsDistributed: number;
        engagementRate: number;
        revenueGenerated: number;
    }> {
        try {
            let campaignsExecuted = 0;
            let rewardsDistributed = 0;
            let totalEngagements = 0;
            let totalRevenue = 0;

            for (const customerProfile of customerProfiles) {
                // Check for tier progression opportunities
                const tierCalculation = await this.calculateLoyaltyTier(customerProfile, []);
                if (tierCalculation.progress >= 90 && tierCalculation.nextTier) {
                    const progressionResult = await this.executeTierProgressionRewards(
                        customerProfile,
                        customerProfile.preferences.loyaltyTier,
                        tierCalculation.nextTier.name
                    );
                    campaignsExecuted++;
                    rewardsDistributed += progressionResult.rewards.length;
                }

                // Check for special occasion campaigns
                const daysUntilNextBirthday = this.calculateDaysUntilNextBirthday(customerProfile);
                if (daysUntilNextBirthday <= 7 && daysUntilNextBirthday >= 0) {
                    const birthdayResult = await this.executeSpecialOccasionCampaigns(
                        customerProfile,
                        'birthday'
                    );
                    campaignsExecuted++;
                    totalEngagements++;
                }

                // Check for anniversary campaigns
                const customerAnniversary = this.calculateCustomerAnniversary(customerProfile.createdAt);
                if (customerAnniversary.daysUntil <= 30 && customerAnniversary.daysUntil >= 0) {
                    const anniversaryResult = await this.executeSpecialOccasionCampaigns(
                        customerProfile,
                        'anniversary'
                    );
                    campaignsExecuted++;
                    totalEngagements++;
                }

                // Check for re-engagement campaigns
                const daysSinceLastVisit = customerProfile.history.lastVisit
                    ? Math.floor((Date.now() - new Date(customerProfile.history.lastVisit).getTime()) / (1000 * 60 * 60 * 24))
                    : 365;

                if (daysSinceLastVisit > 60) {
                    const reengagementResult = await this.executeReengagementCampaign(
                        customerProfile,
                        businessContext
                    );
                    if (reengagementResult) {
                        campaignsExecuted++;
                        totalRevenue += reengagementResult.estimatedRevenue;
                    }
                }
            }

            const engagementRate = campaignsExecuted > 0 ? totalEngagements / campaignsExecuted : 0;

            return {
                campaignsExecuted,
                rewardsDistributed,
                engagementRate,
                revenueGenerated: totalRevenue
            };
        } catch (error) {
            console.error('Error executing loyalty campaigns:', error);
            throw error;
        }
    }

    /**
     * Generate loyalty analytics and insights
     */
    async generateLoyaltyAnalytics(
        customerProfiles: CustomerProfile[],
        businessContext: BusinessContext
    ): Promise<{
        tierDistribution: Record<LoyaltyTier['name'], number>;
        pointsEconomy: {
            totalPointsIssued: number;
            totalPointsRedeemed: number;
            redemptionRate: number;
            averagePointsPerCustomer: number;
        };
        campaignPerformance: {
            totalCampaigns: number;
            averageConversionRate: number;
            topPerformingCampaigns: string[];
        };
        vipMetrics: {
            totalVIPCustomers: number;
            vipRevenueContribution: number;
            vipRetentionRate: number;
        };
        recommendations: string[];
    }> {
        try {
            // Calculate tier distribution
            const tierDistribution = this.calculateTierDistribution(customerProfiles);

            // Calculate points economy metrics
            const pointsEconomy = this.calculatePointsEconomy(customerProfiles);

            // Calculate campaign performance
            const campaignPerformance = this.calculateCampaignPerformance();

            // Calculate VIP metrics
            const vipMetrics = this.calculateVIPMetrics(customerProfiles);

            // Generate recommendations
            const recommendations = this.generateLoyaltyRecommendations(
                tierDistribution,
                pointsEconomy,
                campaignPerformance,
                vipMetrics
            );

            return {
                tierDistribution,
                pointsEconomy,
                campaignPerformance,
                vipMetrics,
                recommendations
            };
        } catch (error) {
            console.error('Error generating loyalty analytics:', error);
            throw error;
        }
    }

    // Private helper methods

    private calculateCustomerMetrics(customerProfile: CustomerProfile, bookingHistory: any[]): any {
        const totalBookings = bookingHistory.length || customerProfile.history.totalBookings;
        const totalSpent = bookingHistory.reduce((sum, booking) => sum + (booking.price || 0), 0) || customerProfile.history.totalSpent;
        const tenure = Math.floor((Date.now() - customerProfile.createdAt.getTime()) / (1000 * 60 * 60 * 24));

        return {
            totalBookings,
            totalSpent,
            tenure,
            averageBookingValue: totalBookings > 0 ? totalSpent / totalBookings : 0,
            lastBookingDate: customerProfile.history.lastVisit
        };
    }

    private determineCurrentTier(metrics: any): LoyaltyTier {
        for (let i = this.loyaltyTiers.length - 1; i >= 0; i--) {
            const tier = this.loyaltyTiers[i];
            if (
                metrics.totalBookings >= tier.requirements.minBookings &&
                metrics.totalSpent >= tier.requirements.minSpent &&
                metrics.tenure >= tier.requirements.minTenure
            ) {
                return tier;
            }
        }
        return this.loyaltyTiers[0]; // Default to bronze
    }

    private calculateTierProgress(metrics: any, targetTier: LoyaltyTier): number {
        const requirements = targetTier.requirements;
        const progressFactors = [
            { metric: metrics.totalBookings, requirement: requirements.minBookings },
            { metric: metrics.totalSpent, requirement: requirements.minSpent },
            { metric: metrics.tenure, requirement: requirements.minTenure }
        ];

        const progressPercentages = progressFactors.map(factor =>
            factor.requirement > 0 ? Math.min((factor.metric / factor.requirement) * 100, 100) : 100
        );

        return Math.round(progressPercentages.reduce((sum, p) => sum + p, 0) / progressPercentages.length);
    }

    private getTierMultiplier(tier: LoyaltyTier['name']): number {
        const multipliers = {
            bronze: 1.0,
            silver: 1.25,
            gold: 1.5,
            platinum: 2.0,
            diamond: 3.0
        };
        return multipliers[tier] || 1.0;
    }

    private calculatePointsExpiry(action: string, source: string): Date | undefined {
        if (action !== 'earn') return undefined;

        // Points from bookings and referrals don't expire
        if (['booking', 'referral'].includes(source)) return undefined;

        // Bonus and promotional points expire after 1 year
        if (['bonus', 'promotion'].includes(source)) {
            return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        }

        // Default expiry for other sources
        return new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // 6 months
    }

    private calculateNextTierProgress(
        customerProfile: CustomerProfile,
        currentTierName: LoyaltyTier['name']
    ): LoyaltyPoints['nextTierProgress'] {
        const currentTierIndex = this.loyaltyTiers.findIndex(t => t.name === currentTierName);
        const nextTier = this.loyaltyTiers[currentTierIndex + 1];

        if (!nextTier) {
            return {
                targetTier: currentTierName,
                progress: 100,
                requirements: {}
            };
        }

        const metrics = this.calculateCustomerMetrics(customerProfile, []);
        const progress = this.calculateTierProgress(metrics, nextTier);

        return {
            targetTier: nextTier.name,
            progress,
            requirements: {
                bookings: nextTier.requirements.minBookings,
                spent: nextTier.requirements.minSpent,
                tenure: nextTier.requirements.minTenure
            },
            estimatedDate: this.estimateTierAchievementDate(metrics, nextTier)
        };
    }

    private estimateTierAchievementDate(metrics: any, targetTier: LoyaltyTier): Date {
        // Simple estimation based on current booking frequency
        const avgDaysBetweenBookings = metrics.totalBookings > 1
            ? metrics.tenure / (metrics.totalBookings - 1)
            : 30; // Default to monthly bookings

        const remainingBookings = Math.max(0, targetTier.requirements.minBookings - metrics.totalBookings);
        const estimatedDays = remainingBookings * avgDaysBetweenBookings;

        return new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000);
    }

    private async cleanupExpiredPoints(loyaltyPoints: LoyaltyPoints): Promise<void> {
        const now = new Date();
        let expiredPoints = 0;

        loyaltyPoints.pointsHistory = loyaltyPoints.pointsHistory.filter(entry => {
            if (entry.expiresAt && entry.expiresAt < now && entry.type === 'earned') {
                expiredPoints += entry.amount;
                return false;
            }
            return true;
        });

        if (expiredPoints > 0) {
            loyaltyPoints.currentBalance -= expiredPoints;

            // Add expiration record
            loyaltyPoints.pointsHistory.unshift({
                id: `expired_${Date.now()}`,
                type: 'expired',
                amount: -expiredPoints,
                description: 'Points expired',
                source: 'promotion',
                timestamp: now
            });
        }
    }

    private calculateTierProgressionBonus(tier: LoyaltyTier['name']): number {
        const bonuses = {
            bronze: 0,
            silver: 100,
            gold: 250,
            platinum: 500,
            diamond: 1000
        };
        return bonuses[tier] || 0;
    }

    private getTierSpecificRewards(tier: LoyaltyTier['name']): LoyaltyReward[] {
        const tierData = this.loyaltyTiers.find(t => t.name === tier);
        if (!tierData) return [];

        return [
            {
                id: `welcome_${tier}_${Date.now()}`,
                name: `${tierData.displayName} Welcome Bonus`,
                description: `Welcome gift for new ${tierData.displayName} members`,
                type: 'discount',
                value: tierData.benefits.discountPercentage,
                costInPoints: 0,
                tierRequirements: [tier],
                isActive: true,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                usageLimit: 1,
                currentUsage: 0,
                metadata: {
                    category: 'tier_welcome',
                    tags: ['bonus', tier],
                    seasonal: false,
                    autoGrant: true
                }
            }
        ];
    }

    private generateSpecialOccasionRewards(
        customerProfile: CustomerProfile,
        occasionType: 'birthday' | 'anniversary' | 'milestone',
        tier: LoyaltyTier
    ): LoyaltyReward[] {
        const reward = this.getOccasionReward(occasionType, tier);
        return [reward];
    }

    private createSpecialOccasionCampaign(
        campaignId: string,
        customerProfile: CustomerProfile,
        occasionType: 'birthday' | 'anniversary' | 'milestone',
        tier: LoyaltyTier
    ): LoyaltyCampaign {
        const campaignNames = {
            birthday: `${tier.displayName} Birthday Special`,
            anniversary: `${tier.displayName} Customer Anniversary`,
            milestone: `${tier.displayName} Milestone Celebration`
        };

        return {
            id: campaignId,
            name: campaignNames[occasionType],
            type: 'birthday' as any, // Simplified for compilation
            targetSegment: {
                tiers: [tier.name],
                customerCriteria: {}
            },
            rewards: {
                primaryReward: this.getOccasionReward(occasionType, tier)
            },
            timing: {
                trigger: 'scheduled',
                schedule: {
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    frequency: 'once'
                }
            },
            performance: {
                sentCount: 0,
                openedCount: 0,
                convertedCount: 0,
                revenueGenerated: 0,
                pointsAwarded: 0
            },
            status: 'draft',
            createdAt: new Date()
        };
    }

    private getOccasionReward(occasionType: string, tier: LoyaltyTier): LoyaltyReward {
        const rewards = {
            birthday: {
                name: 'Happy Birthday!',
                value: tier.benefits.birthdayRewards,
                type: 'discount' as const
            },
            anniversary: {
                name: 'Anniversary Celebration',
                value: tier.benefits.anniversaryRewards,
                type: 'discount' as const
            },
            milestone: {
                name: 'Milestone Reward',
                value: 200,
                type: 'discount' as const
            }
        };

        const reward = rewards[occasionType as keyof typeof rewards] || rewards.birthday;

        return {
            id: `occasion_${Date.now()}`,
            name: reward.name,
            description: `Special ${occasionType} reward for ${tier.displayName} members`,
            type: reward.type,
            value: reward.value,
            costInPoints: 0,
            tierRequirements: [tier.name],
            isActive: true,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
            usageLimit: 1,
            currentUsage: 0,
            metadata: {
                category: 'special_occasion',
                tags: [occasionType, 'celebration'],
                seasonal: true,
                autoGrant: true
            }
        };
    }

    private generateSpecialOccasionMessages(
        customerProfile: CustomerProfile,
        occasionType: string,
        tier: LoyaltyTier,
        rewards: LoyaltyReward[]
    ): string[] {
        const messages: string[] = [];

        switch (occasionType) {
            case 'birthday':
                messages.push(
                    `🎂 Happy Birthday, ${customerProfile.name || 'valued customer'}!`,
                    `As a ${tier.displayName}, enjoy R${rewards[0]?.value} off your next booking!`,
                    `Thank you for being part of our ${tier.displayName} family!`
                );
                break;

            case 'anniversary':
                messages.push(
                    `🎉 Happy Customer Anniversary!`,
                    `We've been serving you for ${this.calculateCustomerAnniversary(customerProfile.createdAt).years} years!`,
                    `Celebrate with R${rewards[0]?.value} off your next visit!`
                );
                break;

            default:
                messages.push(
                    `🎊 Special celebration for you!`,
                    `Enjoy your exclusive ${tier.displayName} reward!`
                );
        }

        return messages;
    }

    private upgradeToVIPTier(
        currentStatus: VIPCustomerProfile['vipStatus'],
        vipData?: Partial<VIPCustomerProfile['vipStatus']>
    ): VIPCustomerProfile['vipStatus'] {
        const upgradedStatus = {
            ...currentStatus,
            ...vipData,
            joinedDate: currentStatus.joinedDate || new Date()
        };

        // Enhance benefits based on new tier
        if (vipData?.tier) {
            const tierEnhancements = this.getTierVIPEnhancements(vipData.tier);
            upgradedStatus.specialPrivileges = {
                ...upgradedStatus.specialPrivileges,
                ...tierEnhancements
            };
            upgradedStatus.exclusiveBenefits = {
                ...upgradedStatus.exclusiveBenefits,
                ...tierEnhancements
            };
        }

        return upgradedStatus;
    }

    private downgradeFromVIPTier(
        currentStatus: VIPCustomerProfile['vipStatus']
    ): VIPCustomerProfile['vipStatus'] {
        // Remove VIP privileges but maintain some benefits
        return {
            ...currentStatus,
            specialPrivileges: {
                personalConcierge: false,
                prioritySupport: true,
                exclusiveEvents: false,
                customServices: false,
                advanceBooking: 3,
                specialDiscounts: 10,
                loyaltyMultiplier: 1.2
            },
            exclusiveBenefits: {
                complimentaryServices: 1,
                discountPercentage: 10,
                priorityBooking: true,
                customPackages: false,
                homeService: false,
                groupDiscounts: 10
            }
        };
    }

    private getTierVIPEnhancements(tier: VIPCustomerProfile['vipStatus']['tier']): any {
        const enhancements = {
            vip: {
                personalConcierge: false,
                prioritySupport: true,
                exclusiveEvents: false,
                customServices: false,
                advanceBooking: 7,
                specialDiscounts: 15,
                loyaltyMultiplier: 1.5
            },
            super_vip: {
                personalConcierge: true,
                prioritySupport: true,
                exclusiveEvents: true,
                customServices: true,
                advanceBooking: 14,
                specialDiscounts: 20,
                loyaltyMultiplier: 2.0
            },
            diamond_vip: {
                personalConcierge: true,
                prioritySupport: true,
                exclusiveEvents: true,
                customServices: true,
                advanceBooking: 30,
                specialDiscounts: 25,
                loyaltyMultiplier: 2.5
            },
            prestige_vip: {
                personalConcierge: true,
                prioritySupport: true,
                exclusiveEvents: true,
                customServices: true,
                advanceBooking: 60,
                specialDiscounts: 30,
                loyaltyMultiplier: 3.0
            }
        };

        return enhancements[tier] || enhancements.vip;
    }

    private async executeReengagementCampaign(
        customerProfile: CustomerProfile,
        businessContext: BusinessContext
    ): Promise<{ estimatedRevenue: number } | null> {
        // Create re-engagement campaign for inactive customers
        const tier = this.loyaltyTiers.find(t => t.name === customerProfile.preferences.loyaltyTier);
        if (!tier) return null;

        const reengagementReward = {
            value: Math.min(tier.benefits.discountPercentage + 10, 25), // Extra 10% discount
            description: `We miss you! ${tier.displayName} special comeback offer`
        };

        return {
            estimatedRevenue: customerProfile.history.averageBookingValue * 0.7 // Conservative estimate
        };
    }

    private calculateDaysUntilNextBirthday(customerProfile: CustomerProfile): number {
        // This would use actual birth date from customer profile
        // For now, return random days for demonstration
        return Math.floor(Math.random() * 365);
    }

    private calculateCustomerAnniversary(createdAt: Date): { years: number; daysUntil: number } {
        const now = new Date();
        const anniversaryThisYear = new Date(now.getFullYear(), createdAt.getMonth(), createdAt.getDate());

        const years = now.getFullYear() - createdAt.getFullYear();
        const daysUntil = Math.ceil((anniversaryThisYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return { years, daysUntil: daysUntil < 0 ? daysUntil + 365 : daysUntil };
    }

    private calculateTierDistribution(customerProfiles: CustomerProfile[]): Record<LoyaltyTier['name'], number> {
        const distribution: Record<LoyaltyTier['name'], number> = {
            bronze: 0,
            silver: 0,
            gold: 0,
            platinum: 0,
            diamond: 0
        };

        customerProfiles.forEach(profile => {
            const tier = profile.preferences.loyaltyTier;
            if (distribution[tier] !== undefined) {
                distribution[tier]++;
            }
        });

        return distribution;
    }

    private calculatePointsEconomy(customerProfiles: CustomerProfile[]): any {
        let totalPointsIssued = 0;
        let totalPointsRedeemed = 0;

        customerProfiles.forEach(profile => {
            const pointsKey = `${profile.tenantId}_${profile.id}`;
            const loyaltyPoints = this.loyaltyPointsCache.get(pointsKey);

            if (loyaltyPoints) {
                totalPointsIssued += loyaltyPoints.lifetimeEarned;
                totalPointsRedeemed += loyaltyPoints.lifetimeRedeemed;
            }
        });

        const averagePointsPerCustomer = customerProfiles.length > 0
            ? totalPointsIssued / customerProfiles.length
            : 0;

        return {
            totalPointsIssued,
            totalPointsRedeemed,
            redemptionRate: totalPointsIssued > 0 ? totalPointsRedeemed / totalPointsIssued : 0,
            averagePointsPerCustomer
        };
    }

    private calculateCampaignPerformance(): any {
        const campaigns = Array.from(this.activeCampaigns.values());
        const totalCampaigns = campaigns.length;

        const conversionRates = campaigns
            .filter(c => c.performance.sentCount > 0)
            .map(c => c.performance.convertedCount / c.performance.sentCount);

        const averageConversionRate = conversionRates.length > 0
            ? conversionRates.reduce((sum, rate) => sum + rate, 0) / conversionRates.length
            : 0;

        return {
            totalCampaigns,
            averageConversionRate,
            topPerformingCampaigns: campaigns
                .sort((a, b) => {
                    const aRate = a.performance.sentCount > 0 ? a.performance.convertedCount / a.performance.sentCount : 0;
                    const bRate = b.performance.sentCount > 0 ? b.performance.convertedCount / b.performance.sentCount : 0;
                    return bRate - aRate;
                })
                .slice(0, 5)
                .map(c => c.name)
        };
    }

    private calculateVIPMetrics(customerProfiles: CustomerProfile[]): any {
        const vipCustomers = customerProfiles.filter(p => (p as VIPCustomerProfile).vipStatus);
        const totalVIPCustomers = vipCustomers.length;

        const vipRevenue = vipCustomers.reduce((sum, p) => sum + p.history.totalSpent, 0);
        const totalRevenue = customerProfiles.reduce((sum, p) => sum + p.history.totalSpent, 0);

        return {
            totalVIPCustomers,
            vipRevenueContribution: totalRevenue > 0 ? vipRevenue / totalRevenue : 0,
            vipRetentionRate: 0.95 // Placeholder - would calculate from actual data
        };
    }

    private generateLoyaltyRecommendations(
        tierDistribution: any,
        pointsEconomy: any,
        campaignPerformance: any,
        vipMetrics: any
    ): string[] {
        const recommendations: string[] = [];

        // Tier distribution recommendations
        if (tierDistribution.bronze > tierDistribution.silver * 2) {
            recommendations.push('Focus on converting Bronze customers to Silver through targeted onboarding campaigns');
        }

        // Points economy recommendations
        if (pointsEconomy.redemptionRate < 0.3) {
            recommendations.push('Increase reward redemption options and make rewards more accessible');
        }

        // Campaign performance recommendations
        if (campaignPerformance.averageConversionRate < 0.15) {
            recommendations.push('Optimize campaign messaging and timing to improve conversion rates');
        }

        // VIP metrics recommendations
        if (vipMetrics.vipRevenueContribution > 0.4) {
            recommendations.push('VIP customers are major revenue contributors - enhance VIP benefits and retention programs');
        }

        return recommendations;
    }

    private initializeRewardsCatalog(): void {
        // Initialize common rewards
        const commonRewards: LoyaltyReward[] = [
            {
                id: 'discount_10',
                name: '10% Off Next Booking',
                description: 'Save 10% on your next service',
                type: 'discount',
                value: 10,
                costInPoints: 500,
                tierRequirements: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
                isActive: true,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                usageLimit: undefined,
                currentUsage: 0,
                metadata: {
                    category: 'discount',
                    tags: ['general', 'popular'],
                    seasonal: false,
                    autoGrant: false
                }
            },
            {
                id: 'free_service_basic',
                name: 'Free Basic Service',
                description: 'Complimentary basic service of your choice',
                type: 'free_service',
                value: 150,
                costInPoints: 1000,
                tierRequirements: ['silver', 'gold', 'platinum', 'diamond'],
                isActive: true,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                usageLimit: 1,
                currentUsage: 0,
                metadata: {
                    category: 'service',
                    tags: ['free', 'popular'],
                    seasonal: false,
                    autoGrant: false
                }
            }
        ];

        commonRewards.forEach(reward => {
            this.availableRewards.set(reward.id, reward);
        });
    }

    private initializeDefaultCampaigns(): void {
        // Initialize default campaigns for different customer segments
        const defaultCampaigns: LoyaltyCampaign[] = [
            {
                id: 'new_customer_onboarding',
                name: 'New Customer Onboarding',
                type: 'tier_progression',
                targetSegment: {
                    tiers: ['bronze'],
                    customerCriteria: { minBookings: 0, tenure: 0 }
                },
                rewards: {
                    primaryReward: this.availableRewards.get('discount_10')!
                },
                timing: {
                    trigger: 'immediate',
                    schedule: {
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        frequency: 'once'
                    }
                },
                performance: {
                    sentCount: 0,
                    openedCount: 0,
                    convertedCount: 0,
                    revenueGenerated: 0,
                    pointsAwarded: 0
                },
                status: 'active',
                createdAt: new Date()
            }
        ];

        defaultCampaigns.forEach(campaign => {
            this.activeCampaigns.set(campaign.id, campaign);
        });
    }
}

export default LoyaltyProgramAutomation;
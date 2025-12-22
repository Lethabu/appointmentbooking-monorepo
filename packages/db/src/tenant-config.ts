// ========================================
// MIND-BODY COMMERCE TENANT CONFIGURATION V13
// ========================================

import { sql } from 'drizzle-orm';

// Tenant Industry Types
export enum IndustryType {
    SALON = 'salon',
    SPA = 'spa',
    WELLNESS = 'wellness',
    CLINIC = 'clinic',
    FITNESS = 'fitness',
    BEAUTY = 'beauty'
}

// Module Types (can be enabled/disabled per tenant)
export enum ModuleType {
    BOOKING = 'booking',
    ECOMMERCE = 'ecommerce',
    SOCIAL = 'social',
    WELLNESS = 'wellness',
    ANALYTICS = 'analytics',
    MARKETING = 'marketing'
}

// Default configurations for each industry type
export const IndustryDefaults = {
    [IndustryType.SALON]: {
        enabledModules: [ModuleType.BOOKING, ModuleType.ECOMMERCE, ModuleType.SOCIAL],
        moduleConfig: {
            social: { platforms: ['instagram', 'tiktok'] },
            wellness: { moodTracking: false, crisisDetection: false }
        }
    },
    [IndustryType.SPA]: {
        enabledModules: [ModuleType.BOOKING, ModuleType.ECOMMERCE, ModuleType.SOCIAL, ModuleType.WELLNESS],
        moduleConfig: {
            social: { platforms: ['instagram', 'facebook'] },
            wellness: { moodTracking: true, crisisDetection: false }
        }
    },
    [IndustryType.WELLNESS]: {
        enabledModules: [ModuleType.BOOKING, ModuleType.ECOMMERCE, ModuleType.SOCIAL, ModuleType.WELLNESS, ModuleType.ANALYTICS],
        moduleConfig: {
            social: { platforms: ['instagram', 'facebook', 'tiktok'] },
            wellness: { moodTracking: true, crisisDetection: true, therapistMonitoring: true }
        }
    },
    [IndustryType.CLINIC]: {
        enabledModules: [ModuleType.BOOKING, ModuleType.WELLNESS, ModuleType.ANALYTICS],
        moduleConfig: {
            wellness: { moodTracking: true, crisisDetection: true, therapistMonitoring: true },
            booking: { requiresIntake: true }
        }
    },
    [IndustryType.FITNESS]: {
        enabledModules: [ModuleType.BOOKING, ModuleType.ECOMMERCE, ModuleType.SOCIAL],
        moduleConfig: {
            social: { platforms: ['instagram', 'tiktok'] },
            booking: { classBooking: true }
        }
    },
    [IndustryType.BEAUTY]: {
        enabledModules: [ModuleType.BOOKING, ModuleType.ECOMMERCE, ModuleType.SOCIAL],
        moduleConfig: {
            social: { platforms: ['instagram', 'tiktok'] },
            ecommerce: { productBundles: true }
        }
    }
} as const;

// Module-specific feature flags
export interface ModuleConfig {
    // Booking module
    booking?: {
        requiresIntake?: boolean;
        classBooking?: boolean;
        payWhatYouCan?: boolean;
    };

    // Ecommerce module
    ecommerce?: {
        productBundles?: boolean;
        inventoryTracking?: boolean;
    };

    // Social module
    social?: {
        platforms?: readonly string[];
        viralAlerts?: boolean;
        creatorPayouts?: boolean;
    };

    // Wellness module
    wellness?: {
        moodTracking?: boolean;
        crisisDetection?: boolean;
        therapistMonitoring?: boolean;
        payWhatYouCan?: boolean;
    };

    // Analytics module
    analytics?: {
        roiTracking?: boolean;
        conversionAttribution?: boolean;
    };
}

// Complete tenant configuration interface
export interface TenantConfig {
    id: string;
    industryType: IndustryType;
    enabledModules: readonly ModuleType[];
    moduleConfig: ModuleConfig;
    currency: string;
    paymentConfig: Record<string, any>;
    features: {
        whiteLabel: boolean;
        customDomain: boolean;
        apiAccess: boolean;
    };
}

// Module availability checker
export class ModuleManager {
    private config: TenantConfig;

    constructor(config: TenantConfig) {
        this.config = config;
    }

    // Check if a module is enabled for this tenant
    isModuleEnabled(module: ModuleType): boolean {
        return this.config.enabledModules.includes(module);
    }

    // Get module-specific configuration
    getModuleConfig<T extends keyof ModuleConfig>(module: ModuleType): ModuleConfig[T] | undefined {
        const moduleKey = module.toLowerCase() as T;
        return this.config.moduleConfig[moduleKey];
    }

    // Check if a specific feature is enabled
    isFeatureEnabled(module: ModuleType, feature: string): boolean {
        const moduleConfig = this.getModuleConfig(module);
        if (!moduleConfig) return false;

        return (moduleConfig as any)[feature] === true;
    }

    // Get supported platforms for social module
    getSupportedPlatforms(): readonly string[] {
        const socialConfig = this.getModuleConfig(ModuleType.SOCIAL);
        if (socialConfig && 'platforms' in socialConfig && socialConfig.platforms) {
            return socialConfig.platforms;
        }
        return [];
    }

    // Get social config safely
    getSocialConfig() {
        return this.getModuleConfig(ModuleType.SOCIAL);
    }

    // Check if wellness features are enabled
    isWellnessEnabled(): boolean {
        return this.isModuleEnabled(ModuleType.WELLNESS);
    }

    // Check if mood tracking is enabled
    isMoodTrackingEnabled(): boolean {
        return this.isFeatureEnabled(ModuleType.WELLNESS, 'moodTracking');
    }

    // Check if crisis detection is enabled
    isCrisisDetectionEnabled(): boolean {
        return this.isFeatureEnabled(ModuleType.WELLNESS, 'crisisDetection');
    }

    // Check if social commerce is enabled
    isSocialCommerceEnabled(): boolean {
        return this.isModuleEnabled(ModuleType.SOCIAL);
    }
}

// Tenant configuration factory
export class TenantConfigFactory {
    static createDefault(industryType: IndustryType, tenantId: string): TenantConfig {
        const defaults = IndustryDefaults[industryType];

        return {
            id: tenantId,
            industryType,
            enabledModules: [...defaults.enabledModules],
            moduleConfig: { ...defaults.moduleConfig },
            currency: 'ZAR',
            paymentConfig: {},
            features: {
                whiteLabel: false,
                customDomain: false,
                apiAccess: false
            }
        };
    }

    static createFromExisting(config: Partial<TenantConfig>): TenantConfig {
        const industryType = config.industryType || IndustryType.SALON;
        const defaults = IndustryDefaults[industryType];

        return {
            id: config.id || '',
            industryType,
            enabledModules: config.enabledModules || [...defaults.enabledModules],
            moduleConfig: { ...defaults.moduleConfig, ...config.moduleConfig },
            currency: config.currency || 'ZAR',
            paymentConfig: config.paymentConfig || {},
            features: config.features || {
                whiteLabel: false,
                customDomain: false,
                apiAccess: false
            }
        };
    }
}

// Types are exported above with their declarations

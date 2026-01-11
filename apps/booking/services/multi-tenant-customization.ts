// Multi-Tenant Customization Enhancement System
// Advanced white-label capabilities for competitive differentiation

import { createClient } from '@supabase/supabase-js';

export interface AdvancedTenantConfig {
    id: string;
    tenantId: string;
    branding: {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        logoUrl: string;
        faviconUrl: string;
        customCSS?: string;
        theme: 'light' | 'dark' | 'auto';
        customFonts?: {
            primary: string;
            secondary: string;
        };
        customCSSVariables?: Record<string, string>;
    };

    features: {
        aiAssistant: boolean;
        analytics: boolean;
        ecommerce: boolean;
        loyaltyProgram: boolean;
        multiLocation: boolean;
        customDomain: boolean;
        advancedBooking: boolean;
        inventoryManagement: boolean;
    };

    localization: {
        language: 'en' | 'af' | 'zu' | 'xh';
        currency: 'ZAR' | 'USD' | 'EUR';
        dateFormat: string;
        timeFormat: string;
        businessHours: any;
        timezone: string;
        publicHolidays: string[];
    };

    industry: {
        type: 'beauty' | 'healthcare' | 'fitness' | 'professional' | 'automotive' | 'retail' | 'hospitality';
        template: IndustryTemplate;
        customizations: IndustrySpecificFeatures;
        complianceRequirements: string[];
    };

    domain: {
        customDomain?: string;
        subdomain?: string;
        sslStatus: 'pending' | 'active' | 'failed';
        dnsStatus: 'pending' | 'active' | 'failed';
        verificationStatus: 'pending' | 'verified' | 'failed';
    };

    permissions: {
        roleBasedAccess: boolean;
        customRoles: string[];
        apiAccess: boolean;
        webhookAccess: boolean;
        dataExport: boolean;
    };
}

export interface IndustryTemplate {
    id: string;
    name: string;
    industry: string;
    description: string;
    features: string[];
    colorSchemes: ColorScheme[];
    layouts: LayoutConfig[];
    defaultServices: any[];
    customFields: CustomField[];
}

export interface ColorScheme {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
}

export interface LayoutConfig {
    name: string;
    sections: LayoutSection[];
    responsive: boolean;
    customCSS?: string;
}

export interface LayoutSection {
    id: string;
    type: 'hero' | 'services' | 'about' | 'contact' | 'testimonials' | 'gallery' | 'custom';
    title: string;
    content: any;
    order: number;
    visible: boolean;
    customHTML?: string;
}

export interface CustomField {
    name: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
    required: boolean;
    options?: string[];
    validation?: string;
    defaultValue?: any;
}

export interface IndustrySpecificFeatures {
    [key: string]: any;
}

export class MultiTenantCustomizationManager {
    private supabase: any;

    constructor(supabaseUrl: string, supabaseKey: string) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    /**
     * Create advanced tenant configuration
     */
    async createAdvancedTenantConfig(
        tenantId: string,
        config: Partial<AdvancedTenantConfig>
    ): Promise<AdvancedTenantConfig> {
        try {
            const fullConfig: AdvancedTenantConfig = {
                id: this.generateConfigId(),
                tenantId,
                branding: {
                    primaryColor: '#6366f1',
                    secondaryColor: '#8b5cf6',
                    accentColor: '#f59e0b',
                    logoUrl: '/default-logo.png',
                    faviconUrl: '/default-favicon.ico',
                    theme: 'light',
                    customFonts: {
                        primary: 'Inter',
                        secondary: 'Roboto'
                    },
                    customCSSVariables: {},
                    ...config.branding
                },
                features: {
                    aiAssistant: true,
                    analytics: true,
                    ecommerce: false,
                    loyaltyProgram: false,
                    multiLocation: false,
                    customDomain: false,
                    advancedBooking: true,
                    inventoryManagement: false,
                    ...config.features
                },
                localization: {
                    language: 'en',
                    currency: 'ZAR',
                    dateFormat: 'DD/MM/YYYY',
                    timeFormat: '24h',
                    businessHours: {},
                    timezone: 'Africa/Johannesburg',
                    publicHolidays: [],
                    ...config.localization
                },
                industry: {
                    type: 'beauty',
                    template: (await this.getIndustryTemplate('beauty')) || {} as IndustryTemplate,
                    customizations: {},
                    complianceRequirements: [],
                    ...config.industry
                },
                domain: {
                    sslStatus: 'pending',
                    dnsStatus: 'pending',
                    verificationStatus: 'pending',
                    ...config.domain
                },
                permissions: {
                    roleBasedAccess: true,
                    customRoles: ['admin', 'staff', 'customer'],
                    apiAccess: false,
                    webhookAccess: false,
                    dataExport: true,
                    ...config.permissions
                }
            };

            const { data, error } = await this.supabase
                .from('tenant_configurations')
                .insert(fullConfig)
                .select()
                .single();

            if (error) {
                console.error('Error creating tenant configuration:', error);
                throw new Error('Failed to create tenant configuration');
            }

            return data;
        } catch (error) {
            console.error('Multi-tenant customization error:', error);
            throw error;
        }
    }

    /**
     * Update tenant configuration
     */
    async updateTenantConfig(
        tenantId: string,
        updates: Partial<AdvancedTenantConfig>
    ): Promise<AdvancedTenantConfig> {
        try {
            const { data, error } = await this.supabase
                .from('tenant_configurations')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('tenant_id', tenantId)
                .select()
                .single();

            if (error) {
                throw new Error('Failed to update tenant configuration');
            }

            return data;
        } catch (error) {
            console.error('Error updating tenant configuration:', error);
            throw error;
        }
    }

    /**
     * Generate industry-specific templates
     */
    async generateIndustryTemplates(): Promise<IndustryTemplate[]> {
        const templates: IndustryTemplate[] = [
            {
                id: 'beauty_salon',
                name: 'Beauty Salon Pro',
                industry: 'beauty',
                description: 'Complete beauty salon management with service packages, staff scheduling, and product sales',
                features: [
                    'Service packages and bundles',
                    'Staff specialization tracking',
                    'Product inventory integration',
                    'Treatment duration management',
                    'Client history and preferences',
                    'Seasonal promotions'
                ],
                colorSchemes: [
                    {
                        name: 'Elegant Pink',
                        primary: '#ec4899',
                        secondary: '#f472b6',
                        accent: '#fbbf24',
                        background: '#fef7f7',
                        surface: '#ffffff',
                        text: '#1f2937',
                        muted: '#6b7280'
                    },
                    {
                        name: 'Classic Gold',
                        primary: '#f59e0b',
                        secondary: '#fbbf24',
                        accent: '#ec4899',
                        background: '#fffbeb',
                        surface: '#ffffff',
                        text: '#1f2937',
                        muted: '#6b7280'
                    }
                ],
                layouts: [
                    {
                        name: 'Classic Layout',
                        sections: [
                            {
                                id: 'hero',
                                type: 'hero',
                                title: 'Welcome to Our Beauty Salon',
                                content: { subtitle: 'Professional beauty services', cta: 'Book Now' },
                                order: 1,
                                visible: true
                            },
                            {
                                id: 'services',
                                type: 'services',
                                title: 'Our Services',
                                content: {},
                                order: 2,
                                visible: true
                            },
                            {
                                id: 'about',
                                type: 'about',
                                title: 'About Us',
                                content: {},
                                order: 3,
                                visible: true
                            },
                            {
                                id: 'contact',
                                type: 'contact',
                                title: 'Contact Us',
                                content: {},
                                order: 4,
                                visible: true
                            }
                        ],
                        responsive: true
                    }
                ],
                defaultServices: [
                    {
                        name: 'Hair Cut & Style',
                        category: 'Hair',
                        duration: 60,
                        price: 250,
                        description: 'Professional haircut and styling'
                    },
                    {
                        name: 'Manicure',
                        category: 'Nails',
                        duration: 45,
                        price: 150,
                        description: 'Complete manicure service'
                    },
                    {
                        name: 'Facial Treatment',
                        category: 'Skincare',
                        duration: 90,
                        price: 350,
                        description: 'Deep cleansing facial treatment'
                    }
                ],
                customFields: [
                    {
                        name: 'preferred_stylist',
                        type: 'select',
                        required: false,
                        options: ['Any', 'Sarah Johnson', 'Mike Chen', 'Emma Davis'],
                        validation: 'max_length:50'
                    },
                    {
                        name: 'hair_type',
                        type: 'select',
                        required: false,
                        options: ['Straight', 'Wavy', 'Curly', 'Coily'],
                        validation: 'max_length:20'
                    }
                ]
            },
            {
                id: 'healthcare_clinic',
                name: 'Healthcare Clinic',
                industry: 'healthcare',
                description: 'Medical appointment management with patient records and insurance handling',
                features: [
                    'Patient medical history',
                    'Insurance verification',
                    'Appointment reminders',
                    'Prescription management',
                    'Medical alerts and warnings',
                    'HIPAA compliance tools'
                ],
                colorSchemes: [
                    {
                        name: 'Medical Blue',
                        primary: '#3b82f6',
                        secondary: '#60a5fa',
                        accent: '#10b981',
                        background: '#f8fafc',
                        surface: '#ffffff',
                        text: '#1f2937',
                        muted: '#6b7280'
                    }
                ],
                layouts: [
                    {
                        name: 'Professional Layout',
                        sections: [
                            {
                                id: 'hero',
                                type: 'hero',
                                title: 'Quality Healthcare Services',
                                content: { subtitle: 'Your health is our priority', cta: 'Schedule Appointment' },
                                order: 1,
                                visible: true
                            },
                            {
                                id: 'services',
                                type: 'services',
                                title: 'Medical Services',
                                content: {},
                                order: 2,
                                visible: true
                            },
                            {
                                id: 'about',
                                type: 'about',
                                title: 'About Our Clinic',
                                content: {},
                                order: 3,
                                visible: true
                            },
                            {
                                id: 'contact',
                                type: 'contact',
                                title: 'Contact Information',
                                content: {},
                                order: 4,
                                visible: true
                            }
                        ],
                        responsive: true
                    }
                ],
                defaultServices: [
                    {
                        name: 'General Consultation',
                        category: 'General Medicine',
                        duration: 30,
                        price: 400,
                        description: 'General health consultation'
                    },
                    {
                        name: 'Annual Checkup',
                        category: 'Preventive Care',
                        duration: 60,
                        price: 600,
                        description: 'Comprehensive annual health checkup'
                    }
                ],
                customFields: [
                    {
                        name: 'insurance_provider',
                        type: 'text',
                        required: false,
                        validation: 'max_length:100'
                    },
                    {
                        name: 'medical_alerts',
                        type: 'text',
                        required: false,
                        validation: 'max_length:200'
                    }
                ]
            },
            {
                id: 'fitness_center',
                name: 'Fitness Center',
                industry: 'fitness',
                description: 'Gym and fitness class management with trainer assignments and membership tracking',
                features: [
                    'Class scheduling and capacity',
                    'Trainer assignment',
                    'Membership tiers',
                    'Progress tracking',
                    'Workout plan management',
                    'Nutrition guidance'
                ],
                colorSchemes: [
                    {
                        name: 'Energetic Green',
                        primary: '#10b981',
                        secondary: '#34d399',
                        accent: '#f59e0b',
                        background: '#f0fdf4',
                        surface: '#ffffff',
                        text: '#1f2937',
                        muted: '#6b7280'
                    }
                ],
                layouts: [
                    {
                        name: 'Dynamic Layout',
                        sections: [
                            {
                                id: 'hero',
                                type: 'hero',
                                title: 'Transform Your Fitness',
                                content: { subtitle: 'Join our fitness community', cta: 'Start Today' },
                                order: 1,
                                visible: true
                            },
                            {
                                id: 'services',
                                type: 'services',
                                title: 'Fitness Programs',
                                content: {},
                                order: 2,
                                visible: true
                            },
                            {
                                id: 'gallery',
                                type: 'gallery',
                                title: 'Our Facility',
                                content: {},
                                order: 3,
                                visible: true
                            },
                            {
                                id: 'contact',
                                type: 'contact',
                                title: 'Get Started',
                                content: {},
                                order: 4,
                                visible: true
                            }
                        ],
                        responsive: true
                    }
                ],
                defaultServices: [
                    {
                        name: 'Personal Training',
                        category: 'Personal Training',
                        duration: 60,
                        price: 300,
                        description: 'One-on-one personal training session'
                    },
                    {
                        name: 'Group Fitness Class',
                        category: 'Group Classes',
                        duration: 45,
                        price: 80,
                        description: 'High-energy group fitness class'
                    }
                ],
                customFields: [
                    {
                        name: 'fitness_goal',
                        type: 'select',
                        required: false,
                        options: ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General Fitness'],
                        validation: 'max_length:50'
                    },
                    {
                        name: 'experience_level',
                        type: 'select',
                        required: false,
                        options: ['Beginner', 'Intermediate', 'Advanced'],
                        validation: 'max_length:20'
                    }
                ]
            }
        ];

        return templates;
    }

    /**
     * Apply industry template to tenant
     */
    async applyIndustryTemplate(
        tenantId: string,
        templateId: string
    ): Promise<AdvancedTenantConfig> {
        try {
            const template = await this.getIndustryTemplate(templateId);
            if (!template) {
                throw new Error('Template not found');
            }

            const updates = {
                industry: {
                    type: template.industry as any,
                    template,
                    customizations: {},
                    complianceRequirements: []
                },
                branding: {
                    primaryColor: template.colorSchemes[0]?.primary || '#6366f1',
                    secondaryColor: template.colorSchemes[0]?.secondary || '#8b5cf6',
                    accentColor: template.colorSchemes[0]?.accent || '#f59e0b',
                    logoUrl: '/default-logo.png',
                    faviconUrl: '/default-favicon.ico',
                    theme: 'light' as const
                }
            };

            return await this.updateTenantConfig(tenantId, updates);
        } catch (error) {
            console.error('Error applying industry template:', error);
            throw error;
        }
    }

    /**
     * Generate custom domain configuration
     */
    async configureCustomDomain(
        tenantId: string,
        domain: string
    ): Promise<{ domain: string; status: string; instructions: string[] }> {
        try {
            // Update tenant configuration
            await this.updateTenantConfig(tenantId, {
                domain: {
                    customDomain: domain,
                    sslStatus: 'pending',
                    dnsStatus: 'pending',
                    verificationStatus: 'pending'
                },
                features: {
                    aiAssistant: true,
                    analytics: true,
                    ecommerce: false,
                    loyaltyProgram: false,
                    multiLocation: false,
                    customDomain: true,
                    advancedBooking: true,
                    inventoryManagement: false
                }
            });

            // Generate DNS instructions
            const instructions = [
                `Add a CNAME record: www.${domain} → appointmentbooking.co.za`,
                `Add an A record: ${domain} → 192.168.1.1`,
                `Wait for DNS propagation (24-48 hours)`,
                `SSL certificate will be automatically provisioned`
            ];

            return {
                domain,
                status: 'pending',
                instructions
            };
        } catch (error) {
            console.error('Error configuring custom domain:', error);
            throw error;
        }
    }

    /**
     * Generate tenant-specific CSS
     */
    generateTenantCSS(config: AdvancedTenantConfig): string {
        const { branding } = config;

        return `
      :root {
        --primary-color: ${branding.primaryColor};
        --secondary-color: ${branding.secondaryColor};
        --accent-color: ${branding.accentColor};
        --background-color: ${branding.customCSSVariables?.background || '#ffffff'};
        --surface-color: ${branding.customCSSVariables?.surface || '#f8fafc'};
        --text-color: ${branding.customCSSVariables?.text || '#1f2937'};
        --muted-color: ${branding.customCSSVariables?.muted || '#6b7280'};
      }

      .bg-primary { background-color: var(--primary-color); }
      .bg-secondary { background-color: var(--secondary-color); }
      .bg-accent { background-color: var(--accent-color); }
      
      .text-primary { color: var(--primary-color); }
      .text-secondary { color: var(--secondary-color); }
      .text-accent { color: var(--accent-color); }
      
      .border-primary { border-color: var(--primary-color); }
      .border-secondary { border-color: var(--secondary-color); }
      .border-accent { border-color: var(--accent-color); }
      
      .hover\\:bg-primary:hover { background-color: var(--primary-color); }
      .hover\\:text-primary:hover { color: var(--primary-color); }
      
      ${branding.customCSS || ''}
    `;
    }

    /**
     * Validate tenant configuration
     */
    validateTenantConfig(config: Partial<AdvancedTenantConfig>): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    } {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validate required fields
        if (!config.branding?.primaryColor) {
            errors.push('Primary color is required');
        }

        if (!config.branding?.logoUrl) {
            warnings.push('Logo URL should be provided for better branding');
        }

        if (config.features?.customDomain && !config.domain?.customDomain) {
            warnings.push('Custom domain feature enabled but no domain specified');
        }

        if (config.localization?.currency === 'ZAR' && config.localization?.language !== 'en') {
            warnings.push('ZAR currency with non-English language may need localization');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    // Helper methods
    private generateConfigId(): string {
        return `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private async getIndustryTemplate(templateId: string): Promise<IndustryTemplate | null> {
        const templates = await this.generateIndustryTemplates();
        return templates.find(t => t.id === templateId) || null;
    }

    /**
     * Export tenant configuration
     */
    async exportTenantConfig(tenantId: string): Promise<any> {
        try {
            const { data, error } = await this.supabase
                .from('tenant_configurations')
                .select('*')
                .eq('tenant_id', tenantId)
                .single();

            if (error) {
                throw new Error('Failed to export configuration');
            }

            return {
                exportedAt: new Date().toISOString(),
                version: '1.0',
                configuration: data
            };
        } catch (error) {
            console.error('Error exporting tenant configuration:', error);
            throw error;
        }
    }

    /**
     * Import tenant configuration
     */
    async importTenantConfig(
        tenantId: string,
        configData: any
    ): Promise<AdvancedTenantConfig> {
        try {
            const config = configData.configuration;
            delete config.id; // Remove ID to create new record
            delete config.tenant_id;

            return await this.createAdvancedTenantConfig(tenantId, config);
        } catch (error) {
            console.error('Error importing tenant configuration:', error);
            throw error;
        }
    }
}

export default MultiTenantCustomizationManager;
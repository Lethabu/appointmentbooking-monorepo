import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ========================================
// COMPETITIVE INTELLIGENCE SYSTEM
// ========================================

// Competitor profiles - comprehensive competitor database
export const competitors = sqliteTable('competitors', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    companyType: text('company_type').notNull(), // 'direct', 'indirect', 'substitute'
    businessModel: text('business_model').notNull(), // 'saas', 'marketplace', 'traditional', 'hybrid'

    // Company Information
    website: text('website'),
    domainAge: integer('domain_age'), // Days since domain registration
    companySize: text('company_size'), // 'startup', 'sme', 'enterprise'
    foundedYear: integer('founded_year'),
    headquarters: text('headquarters'),
    targetMarket: text('target_market'), // 'beauty_salons', 'wellness', 'healthcare', etc.

    // Financial & Business Metrics
    estimatedRevenue: integer('estimated_revenue'), // Monthly revenue in ZAR
    fundingStatus: text('funding_status'), // 'bootstrapped', 'seed', 'series_a', 'series_b', 'profitability'
    totalFunding: integer('total_funding'), // In ZAR
    employeeCount: integer('employee_count'),

    // Market Position
    marketShare: decimal('market_share'), // Percentage as decimal (0.15 = 15%)
    marketPresence: text('market_presence'), // 'local', 'regional', 'national', 'international'
    primaryMarkets: text('primary_markets', { mode: 'json' }).$type<string[]>(), // ['south_africa', 'africa']

    // Technology & Product
    techStack: text('tech_stack', { mode: 'json' }).$type<string[]>(),
    productComplexity: text('product_complexity'), // 'simple', 'moderate', 'complex'
    keyFeatures: text('key_features', { mode: 'json' }).$type<string[]>(),
    integrations: text('integrations', { mode: 'json' }).$type<string[]>(),

    // Monitoring & Analysis
    monitoringStatus: text('monitoring_status').default('active'), // 'active', 'inactive', 'archived'
    lastAnalyzed: integer('last_analyzed', { mode: 'timestamp' }),
    threatLevel: text('threat_level').default('low'), // 'low', 'medium', 'high', 'critical'
    strategicImportance: text('strategic_importance').default('medium'), // 'low', 'medium', 'high'

    // POPIA Compliance
    dataSource: text('data_source').notNull(), // 'public_website', 'social_media', 'industry_reports'
    dataCollectionDate: integer('data_collection_date', { mode: 'timestamp' }).notNull(),
    lastUpdated: integer('last_updated', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
    companyTypeIdx: index('competitors_company_type_idx').on(table.companyType),
    businessModelIdx: index('competitors_business_model_idx').on(table.businessModel),
    threatLevelIdx: index('competitors_threat_level_idx').on(table.threatLevel),
    marketShareIdx: index('competitors_market_share_idx').on(table.marketShare),
}));

// Competitor pricing analysis
export const competitorPricing = sqliteTable('competitor_pricing', {
    id: text('id').primaryKey(),
    competitorId: text('competitor_id').notNull().references(() => competitors.id, { onDelete: 'cascade' }),

    // Pricing Models
    pricingModel: text('pricing_model').notNull(), // 'freemium', 'subscription', 'transaction_fee', 'flat_rate'
    basePrice: integer('base_price'), // Monthly base price in cents
    priceRange: text('price_range'), // 'R99-R299', 'R500-R1000'
    currency: text('currency').default('ZAR'),

    // Feature Tiers
    freeTier: integer('free_tier'), // Boolean or features count
    starterTier: integer('starter_tier'), // Price in cents
    professionalTier: integer('professional_tier'), // Price in cents
    enterpriseTier: integer('enterprise_tier'), // Price in cents

    // Additional Fees
    setupFee: integer('setup_fee'), // One-time setup fee in cents
    transactionFee: decimal('transaction_fee'), // Percentage as decimal
    supportFee: integer('support_fee'), // Monthly support cost in cents

    // Pricing Strategy
    pricingStrategy: text('pricing_strategy'), // 'competitive', 'premium', 'value', 'loss_leader'
    discountOffers: text('discount_offers', { mode: 'json' }).$type<string[]>(), // ['first_month_free', 'annual_discount']

    // Market Positioning
    pricePositioning: text('price_positioning'), // 'budget', 'mid_market', 'premium'
    valueProposition: text('value_proposition'),

    // Data Quality
    dataSource: text('data_source').notNull(),
    confidence: text('confidence').default('medium'), // 'low', 'medium', 'high'
    lastVerified: integer('last_verified', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
    competitorIdx: index('competitor_pricing_competitor_idx').on(table.competitorId),
    pricingModelIdx: index('competitor_pricing_model_idx').on(table.pricingModel),
    pricePositioningIdx: index('competitor_pricing_position_idx').on(table.pricePositioning),
}));

// Market segments and opportunities
export const marketSegments = sqliteTable('market_segments', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),

    // Market Size & Value
    totalMarketSize: integer('total_market_size'), // Total addressable market in ZAR
    serviceableMarket: integer('serviceable_market'), // Serviceable addressable market in ZAR
    obtainableMarket: integer('obtainable_market'), // Serviceable obtainable market in ZAR

    // Geographic Coverage
    primaryRegions: text('primary_regions', { mode: 'json' }).$type<string[]>(), // ['western_cape', 'gauteng']
    secondaryRegions: text('secondary_regions', { mode: 'json' }).$type<string[]>(),

    // Demographics
    targetAgeGroups: text('target_age_groups', { mode: 'json' }).$type<string[]>(), // ['18-25', '26-35', '36-45']
    incomeLevels: text('income_levels', { mode: 'json' }).$type<string[]>(), // ['low', 'middle', 'high']
    businessSizes: text('business_sizes', { mode: 'json' }).$type<string[]>(), // ['solo', 'small', 'medium', 'enterprise']

    // Market Characteristics
    growthRate: decimal('growth_rate'), // Annual growth rate as decimal
    competitionLevel: text('competition_level'), // 'low', 'medium', 'high'
    marketMaturity: text('market_maturity'), // 'emerging', 'growing', 'mature', 'declining'

    // Opportunity Metrics
    opportunityScore: integer('opportunity_score'), // 1-100 scoring
    entryBarrier: text('entry_barrier'), // 'low', 'medium', 'high'
    timeToMarket: text('time_to_market'), // '3_months', '6_months', '12_months', '18_months'

    // Strategic Value
    strategicPriority: text('strategic_priority').default('medium'), // 'low', 'medium', 'high'
    roiPotential: decimal('roi_potential'), // Expected ROI as decimal
    riskLevel: text('risk_level'), // 'low', 'medium', 'high'

    // Data Sources & Analysis
    dataSource: text('data_source').notNull(),
    confidence: text('confidence').default('medium'),
    lastAnalyzed: integer('last_analyzed', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
    competitionIdx: index('market_segments_competition_idx').on(table.competitionLevel),
    maturityIdx: index('market_segments_maturity_idx').on(table.marketMaturity),
    priorityIdx: index('market_segments_priority_idx').on(table.strategicPriority),
    scoreIdx: index('market_segments_score_idx').on(table.opportunityScore),
}));

// Competitor feature analysis
export const competitorFeatures = sqliteTable('competitor_features', {
    id: text('id').primaryKey(),
    competitorId: text('competitor_id').notNull().references(() => competitors.id, { onDelete: 'cascade' }),

    // Feature Information
    featureName: text('feature_name').notNull(),
    featureCategory: text('feature_category').notNull(), // 'booking', 'payments', 'analytics', 'integrations', 'mobile'
    featureType: text('feature_type').notNull(), // 'core', 'premium', 'add_on', 'beta'

    // Feature Details
    description: text('description'),
    implementation: text('implementation'), // 'native', 'third_party', 'api'
    quality: text('quality'), // 'basic', 'good', 'excellent'
    userExperience: text('user_experience'), // 'poor', 'fair', 'good', 'excellent'

    // Competitive Analysis
    competitiveAdvantage: text('competitive_advantage'), // 'none', 'slight', 'significant'
    marketDifferentiator: integer('market_differentiator', { mode: 'boolean' }).default(false),
    innovationLevel: text('innovation_level'), // 'me_too', 'improved', 'innovative', 'breakthrough'

    // Usage & Adoption
    adoptionRate: decimal('adoption_rate'), // Estimated adoption rate as decimal
    userFeedback: text('user_feedback'), // 'negative', 'neutral', 'positive'
    supportQuality: text('support_quality'), // 'poor', 'fair', 'good', 'excellent'

    // Technical Details
    techComplexity: text('tech_complexity'), // 'simple', 'moderate', 'complex'
    integrationDifficulty: text('integration_difficulty'), // 'easy', 'moderate', 'difficult'
    maintenanceBurden: text('maintenance_burden'), // 'low', 'medium', 'high'

    // Analysis Metadata
    dataSource: text('data_source').notNull(),
    confidence: text('confidence').default('medium'),
    lastVerified: integer('last_verified', { mode: 'timestamp' }),
    analyst: text('analyst'), // Who analyzed this feature
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
    competitorIdx: index('competitor_features_competitor_idx').on(table.competitorId),
    categoryIdx: index('competitor_features_category_idx').on(table.featureCategory),
    typeIdx: index('competitor_features_type_idx').on(table.featureType),
    advantageIdx: index('competitor_features_advantage_idx').on(table.competitiveAdvantage),
}));

// Market intelligence reports
export const marketReports = sqliteTable('market_reports', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    reportType: text('report_type').notNull(), // 'competitive_analysis', 'market_overview', 'threat_assessment', 'opportunity_analysis'

    // Report Content
    executiveSummary: text('executive_summary'),
    keyFindings: text('key_findings', { mode: 'json' }).$type<string[]>(),
    recommendations: text('recommendations', { mode: 'json' }).$type<string[]>(),
    detailedAnalysis: text('detailed_analysis'),

    // Report Scope
    scope: text('scope'), // 'full_market', 'specific_segment', 'competitor_focus'
    targetCompetitors: text('target_competitors', { mode: 'json' }).$type<string[]>(),
    marketSegments: text('market_segments', { mode: 'json' }).$type<string[]>(),
    geographicScope: text('geographic_scope'), // 'national', 'regional', 'local'

    // Data & Analysis
    dataSources: text('data_sources', { mode: 'json' }).$type<string[]>(),
    methodology: text('methodology'),
    analysisDate: integer('analysis_date', { mode: 'timestamp' }).notNull(),
    confidenceLevel: text('confidence_level').default('medium'), // 'low', 'medium', 'high'

    // Report Metadata
    author: text('author').notNull(),
    reviewer: text('reviewer'),
    status: text('status').default('draft'), // 'draft', 'review', 'approved', 'published', 'archived'
    priority: text('priority').default('medium'), // 'low', 'medium', 'high', 'urgent'

    // Distribution
    distributionList: text('distribution_list', { mode: 'json' }).$type<string[]>(),
    classification: text('classification').default('internal'), // 'internal', 'confidential', 'restricted'

    // Scheduling
    nextReview: integer('next_review', { mode: 'timestamp' }),
    frequency: text('frequency'), // 'weekly', 'monthly', 'quarterly', 'annually'

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
    typeIdx: index('market_reports_type_idx').on(table.reportType),
    statusIdx: index('market_reports_status_idx').on(table.status),
    priorityIdx: index('market_reports_priority_idx').on(table.priority),
    authorIdx: index('market_reports_author_idx').on(table.author),
}));

// Competitive threats and alerts
export const competitiveThreats = sqliteTable('competitive_threats', {
    id: text('id').primaryKey(),
    threatId: text('threat_id').notNull().unique(), // Human-readable threat ID

    // Threat Classification
    threatType: text('threat_type').notNull(), // 'pricing_change', 'feature_launch', 'partnership', 'funding', 'acquisition'
    severity: text('severity').notNull(), // 'low', 'medium', 'high', 'critical'
    category: text('category').notNull(), // 'immediate', 'strategic', 'market', 'technological'

    // Threat Details
    title: text('title').notNull(),
    description: text('description').notNull(),
    potentialImpact: text('potential_impact'), // 'revenue_loss', 'market_share', 'customer_churn', 'competitive_disadvantage'

    // Source Information
    sourceCompetitorId: text('source_competitor_id').references(() => competitors.id),
    sourceType: text('source_type').notNull(), // 'direct_observation', 'industry_report', 'media_coverage', 'customer_feedback'
    sourceReliability: text('source_reliability').default('medium'), // 'low', 'medium', 'high'

    // Timeline & Urgency
    detectedAt: integer('detected_at', { mode: 'timestamp' }).notNull(),
    threatTimeline: text('threat_timeline'), // 'immediate', 'short_term', 'medium_term', 'long_term'
    urgencyScore: integer('urgency_score'), // 1-10 urgency score

    // Impact Assessment
    estimatedImpact: text('estimated_impact'), // 'minimal', 'moderate', 'significant', 'severe'
    affectedAreas: text('affected_areas', { mode: 'json' }).$type<string[]>(), // ['pricing', 'features', 'market_position']
    mitigationComplexity: text('mitigation_complexity'), // 'simple', 'moderate', 'complex', 'requires_strategic_shift'

    // Response Actions
    recommendedActions: text('recommended_actions', { mode: 'json' }).$type<string[]>(),
    actionOwner: text('action_owner'), // Who should lead response
    actionDeadline: integer('action_deadline', { mode: 'timestamp' }),

    // Tracking
    status: text('status').default('active'), // 'active', 'monitoring', 'mitigated', 'resolved', 'dismissed'
    monitoringFrequency: text('monitoring_frequency'), // 'daily', 'weekly', 'monthly'
    lastUpdate: integer('last_update', { mode: 'timestamp' }).default(sql`(unixepoch())`),

    // Notification Settings
    alertLevel: text('alert_level').default('medium'), // 'low', 'medium', 'high'
    stakeholders: text('stakeholders', { mode: 'json' }).$type<string[]>(),
    notificationSent: integer('notification_sent', { mode: 'boolean' }).default(false),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
    severityIdx: index('competitive_threats_severity_idx').on(table.severity),
    typeIdx: index('competitive_threats_type_idx').on(table.threatType),
    statusIdx: index('competitive_threats_status_idx').on(table.status),
    urgencyIdx: index('competitive_threats_urgency_idx').on(table.urgencyScore),
    competitorIdx: index('competitive_threats_competitor_idx').on(table.sourceCompetitorId),
}));

// Market opportunities tracking
export const marketOpportunities = sqliteTable('market_opportunities', {
    id: text('id').primaryKey(),
    opportunityId: text('opportunity_id').notNull().unique(),

    // Opportunity Details
    title: text('title').notNull(),
    description: text('description').notNull(),
    opportunityType: text('opportunity_type').notNull(), // 'market_gap', 'competitor_weakness', 'technology_trend', 'regulatory_change'

    // Market Analysis
    targetMarket: text('target_market').notNull(),
    marketSize: integer('market_size'), // Potential market size in ZAR
    addressableMarket: integer('addressable_market'), // Realistic addressable portion in ZAR

    // Competitive Landscape
    competitionLevel: text('competition_level').notNull(), // 'none', 'low', 'medium', 'high'
    keyCompetitors: text('key_competitors', { mode: 'json' }).$type<string[]>(),
    competitiveAdvantage: text('competitive_advantage'),
    barriersToEntry: text('barriers_to_entry'), // 'low', 'medium', 'high'

    // Financial Projections
    revenuePotential: integer('revenue_potential'), // Annual revenue potential in ZAR
    investmentRequired: integer('investment_required'), // Investment needed in ZAR
    paybackPeriod: text('payback_period'), // '6_months', '12_months', '18_months', '24_months'
    roiEstimate: decimal('roi_estimate'), // Expected ROI as decimal

    // Strategic Value
    strategicImportance: text('strategic_importance').default('medium'), // 'low', 'medium', 'high', 'critical'
    alignmentWithStrategy: text('alignment_with_strategy'), // 'poor', 'fair', 'good', 'excellent'
    riskLevel: text('risk_level').default('medium'), // 'low', 'medium', 'high'

    // Implementation
    implementationComplexity: text('implementation_complexity'), // 'simple', 'moderate', 'complex'
    timeToMarket: text('time_to_market'), // '3_months', '6_months', '12_months', '18_months'
    resourceRequirements: text('resource_requirements', { mode: 'json' }).$type<{
        developers: number;
        designers: number;
        marketing: number;
        budget: number;
    }>(),

    // Priority & Action
    priorityScore: integer('priority_score'), // 1-100 scoring
    recommendedAction: text('recommended_action'),
    nextSteps: text('next_steps', { mode: 'json' }).$type<string[]>(),
    actionOwner: text('action_owner'),

    // Validation
    validationStatus: text('validation_status').default('hypothesis'), // 'hypothesis', 'researching', 'validated', 'rejected'
    confidenceLevel: text('confidence_level').default('medium'), // 'low', 'medium', 'high'
    dataSources: text('data_sources', { mode: 'json' }).$type<string[]>(),

    // Timeline
    identifiedAt: integer('identified_at', { mode: 'timestamp' }).notNull(),
    targetLaunchDate: integer('target_launch_date', { mode: 'timestamp' }),
    reviewDate: integer('review_date', { mode: 'timestamp' }),

    // Status Tracking
    status: text('status').default('identified'), // 'identified', 'analyzing', 'planning', 'in_progress', 'launched', 'completed', 'abandoned'
    lastUpdate: integer('last_update', { mode: 'timestamp' }).default(sql`(unixepoch())`),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
    typeIdx: index('market_opportunities_type_idx').on(table.opportunityType),
    statusIdx: index('market_opportunities_status_idx').on(table.status),
    priorityIdx: index('market_opportunities_priority_idx').on(table.priorityScore),
    competitionIdx: index('market_opportunities_competition_idx').on(table.competitionLevel),
}));

// Automated monitoring jobs and data collection
export const monitoringJobs = sqliteTable('monitoring_jobs', {
    id: text('id').primaryKey(),
    jobName: text('job_name').notNull(),
    jobType: text('job_type').notNull(), // 'competitor_tracking', 'pricing_monitor', 'feature_analysis', 'news_monitoring'

    // Job Configuration
    targetUrl: text('target_url'),
    competitorId: text('competitor_id').references(() => competitors.id),
    jobFrequency: text('job_frequency').notNull(), // 'hourly', 'daily', 'weekly', 'monthly'
    isActive: integer('is_active', { mode: 'boolean' }).default(true),

    // Data Collection
    dataPoints: text('data_points', { mode: 'json' }).$type<string[]>(), // What to collect
    extractionRules: text('extraction_rules', { mode: 'json' }).$type<Record<string, any>>(),
    validationRules: text('validation_rules', { mode: 'json' }).$type<Record<string, any>>(),

    // Scheduling
    lastRun: integer('last_run', { mode: 'timestamp' }),
    nextRun: integer('next_run', { mode: 'timestamp' }),
    runCount: integer('run_count').default(0),
    failureCount: integer('failure_count').default(0),

    // Performance Metrics
    avgExecutionTime: integer('avg_execution_time'), // Average execution time in milliseconds
    successRate: decimal('success_rate'), // Success rate as decimal
    lastError: text('last_error'),
    lastErrorAt: integer('last_error_at', { mode: 'timestamp' }),

    // Alerts & Notifications
    alertOnFailure: integer('alert_on_failure', { mode: 'boolean' }).default(true),
    alertThreshold: integer('alert_threshold').default(3), // Failures before alerting

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
    typeIdx: index('monitoring_jobs_type_idx').on(table.jobType),
    frequencyIdx: index('monitoring_jobs_frequency_idx').on(table.jobFrequency),
    activeIdx: index('monitoring_jobs_active_idx').on(table.isActive),
    competitorIdx: index('monitoring_jobs_competitor_idx').on(table.competitorId),
}));

// Executive dashboard metrics and KPIs
export const executiveMetrics = sqliteTable('executive_metrics', {
    id: text('id').primaryKey(),
    metricName: text('metric_name').notNull(),
    metricCategory: text('metric_category').notNull(), // 'competitive_position', 'market_health', 'threat_level', 'opportunity_pipeline'

    // Metric Value
    currentValue: text('current_value'), // Can be numeric, percentage, or text
    previousValue: text('previous_value'),
    targetValue: text('target_value'),
    unit: text('unit'), // 'percentage', 'currency', 'count', 'score'

    // Trend Analysis
    trend: text('trend'), // 'improving', 'declining', 'stable', 'volatile'
    trendDirection: text('trend_direction'), // 'up', 'down', 'flat'
    changePercentage: decimal('change_percentage'), // Change as percentage

    // Context & Analysis
    context: text('context'),
    interpretation: text('interpretation'),
    keyDrivers: text('key_drivers', { mode: 'json' }).$type<string[]>(),

    // Strategic Implications
    strategicImpact: text('strategic_impact'), // 'low', 'medium', 'high', 'critical'
    recommendedAction: text('recommended_action'),
    priority: text('priority').default('medium'), // 'low', 'medium', 'high', 'urgent'

    // Data Quality
    dataSource: text('data_source').notNull(),
    calculationMethod: text('calculation_method'),
    confidence: text('confidence').default('medium'), // 'low', 'medium', 'high'
    lastCalculated: integer('last_calculated', { mode: 'timestamp' }).notNull(),

    // Reporting
    displayOrder: integer('display_order'), // For dashboard ordering
    isVisible: integer('is_visible', { mode: 'boolean' }).default(true),
    alertThreshold: text('alert_threshold'), // When to trigger alerts

    // Time Period
    period: text('period').notNull(), // 'daily', 'weekly', 'monthly', 'quarterly', 'annual'
    periodStart: integer('period_start', { mode: 'timestamp' }).notNull(),
    periodEnd: integer('period_end', { mode: 'timestamp' }).notNull(),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
    categoryIdx: index('executive_metrics_category_idx').on(table.metricCategory),
    priorityIdx: index('executive_metrics_priority_idx').on(table.priority),
    periodIdx: index('executive_metrics_period_idx').on(table.period),
    trendIdx: index('executive_metrics_trend_idx').on(table.trend),
}));

// Helper function for decimal types (since SQLite doesn't have native decimal)
function decimal(column: string) {
    return text(column); // Store as text to preserve precision
}
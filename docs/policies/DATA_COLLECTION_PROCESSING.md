# Data Collection & Processing Procedures

## Executive Summary

This document establishes comprehensive procedures for data collection and processing within our appointment booking platform, ensuring compliance with GDPR, POPIA, and other applicable privacy regulations. These procedures integrate with our Cloudflare infrastructure and existing authentication systems.

**Effective Date**: January 1, 2026  
**Version**: 1.0.0  
**Next Review**: March 24, 2026  
**Owner**: Data Protection Officer  
**Approved By**: Chief Executive Officer

## 1. Data Collection Framework

### 1.1 Collection Principles

#### 1.1.1 Data Minimization

**Principle**: Collect only data that is necessary, adequate, and relevant for specified purposes.

**Implementation**:

```typescript
interface DataMinimizationRule {
  purpose: string;
  requiredFields: string[];
  optionalFields: string[];
  prohibitedFields: string[];
  collectionMethod: 'user_input' | 'automated' | 'third_party';
  retentionBasis: string;
}

const minimizationRules: DataMinimizationRule[] = [
  {
    purpose: 'account_creation',
    requiredFields: ['email', 'name'],
    optionalFields: ['phone_number', 'profile_picture'],
    prohibitedFields: ['date_of_birth', 'religion', 'political_opinion'],
    collectionMethod: 'user_input',
    retentionBasis: 'contract_performance'
  },
  {
    purpose: 'appointment_booking',
    requiredFields: ['email', 'service_selection'],
    optionalFields: ['special_requirements', 'preferred_employee'],
    prohibitedFields: ['medical_history', 'financial_information'],
    collectionMethod: 'user_input',
    retentionBasis: 'contract_performance'
  }
];
```

#### 1.1.2 Purpose Limitation

**Principle**: Use collected data only for specified, explicit, and legitimate purposes.

**Purpose Categories**:

1. **Primary Purposes** (Contract Performance):
   - Account creation and authentication
   - Service delivery and booking management
   - Payment processing and financial records
   - Customer support and communications

2. **Secondary Purposes** (Legitimate Interest):
   - Security monitoring and fraud prevention
   - Analytics and business intelligence
   - Service improvement and development
   - Network security and threat detection

3. **Optional Purposes** (Consent):
   - Marketing communications
   - Third-party integrations
   - Optional service features
   - Enhanced personalization

#### 1.1.3 Accuracy and Quality

**Principle**: Ensure data is accurate, complete, and up-to-date.

**Quality Assurance Measures**:

```typescript
interface DataQualityControls {
  validation: {
    format: string[];        // Email, phone, date validation
    range: string[];         // Price ranges, date ranges
    completeness: string[];  // Required field checks
  };
  verification: {
    emailVerification: boolean;
    phoneVerification: boolean;
    identityVerification: boolean;
  };
  updates: {
    selfServiceUpdates: boolean;
    adminUpdates: boolean;
    automaticUpdates: boolean;
  };
}

const qualityControls: DataQualityControls = {
  validation: {
    format: ['email', 'phone', 'date'],
    range: ['price', 'duration', 'quantity'],
    completeness: ['required_fields', 'profile_completion']
  },
  verification: {
    emailVerification: true,
    phoneVerification: false, // Optional
    identityVerification: false // Not required for booking
  },
  updates: {
    selfServiceUpdates: true,
    adminUpdates: true,
    automaticUpdates: false
  }
};
```

### 1.2 Data Collection Methods

#### 1.2.1 Direct Collection (User Input)

**Registration Process**:

```typescript
interface RegistrationData {
  // Required Information
  email: string;           // For account identification
  name: string;            // For personalization
  
  // Optional Information
  phoneNumber?: string;    // For appointment reminders
  profilePicture?: string; // For user interface
  
  // Derived Information
  tenantId: string;        // From subdomain or selection
  registrationSource: string; // Web, mobile, API
  userAgent: string;       // Device information
  ipAddress: string;       // Location and security
}

interface RegistrationValidation {
  email: {
    required: true;
    format: 'email';
    unique: true;
    verificationRequired: true;
  };
  name: {
    required: true;
    minLength: 2;
    maxLength: 100;
  };
  phoneNumber: {
    required: false;
    format: 'international';
    countryCode: 'auto-detect';
  };
}
```

**Booking Process**:

```typescript
interface BookingData {
  // Service Information
  serviceId: string;       // Selected service
  preferredEmployee?: string; // Employee preference
  scheduledTime: string;   // Appointment time
  
  // Customer Information
  customerName: string;    // For appointment
  customerEmail: string;   // For confirmation
  customerPhone?: string;  // For reminders
  
  // Additional Information
  notes?: string;          // Special requirements
  dietaryRestrictions?: string; // For certain services
  accessibilityNeeds?: string; // For facility planning
}

interface BookingValidation {
  serviceId: {
    required: true;
    type: 'uuid';
    mustExist: true;
  };
  scheduledTime: {
    required: true;
    format: 'iso-datetime';
    futureOnly: true;
    withinBusinessHours: true;
  };
  customerName: {
    required: true;
    minLength: 2;
    maxLength: 100;
  };
  customerEmail: {
    required: true;
    format: 'email';
    mustNotBeBlocked: true;
  };
}
```

#### 1.2.2 Automated Collection

**System-Generated Data**:

```typescript
interface AutomatedDataCollection {
  // Technical Data
  ipAddress: {
    purpose: 'security, geolocation, analytics';
    legalBasis: 'legitimate_interest';
    retention: '12 months';
    anonymization: 'after_6_months';
  };
  userAgent: {
    purpose: 'compatibility, analytics';
    legalBasis: 'legitimate_interest';
    retention: '24 months';
    anonymization: 'never'; // Needed for support
  };
  sessionData: {
    purpose: 'functionality, security';
    legalBasis: 'contract_performance';
    retention: 'session_duration';
    anonymization: 'immediately';
  };
  cookies: {
    essential: {
      purpose: 'functionality';
      legalBasis: 'contract_performance';
      retention: 'session';
    };
    analytics: {
      purpose: 'improvement';
      legalBasis: 'legitimate_interest';
      retention: '24 months';
      consentRequired: false;
    };
    marketing: {
      purpose: 'personalization';
      legalBasis: 'consent';
      retention: '12 months';
      consentRequired: true;
    };
  };
}
```

#### 1.2.3 Third-Party Collection

**Google OAuth Integration**:

```typescript
interface GoogleOAuthData {
  // Provided by Google
  googleId: string;        // Unique Google identifier
  email: string;           // Verified Google email
  name: string;            // Google profile name
  picture: string;         // Profile picture URL
  
  // Tokens (Restricted Data)
  accessToken: string;     // For API access
  refreshToken: string;    // For token refresh
  tokenExpiry: Date;       // Token expiration
  
  // Processing Information
  consentScope: string[];  // Granted permissions
  consentDate: Date;       // When consent was given
  lastUsed: Date;          // Last API access
}

interface OAuthConsent {
  scopes: {
    'openid': {
      purpose: 'authentication';
      required: true;
    };
    'email': {
      purpose: 'account_creation';
      required: true;
    };
    'profile': {
      purpose: 'personalization';
      required: false;
    };
    'https://www.googleapis.com/auth/calendar': {
      purpose: 'calendar_integration';
      required: false;
    };
  };
  withdrawal: {
    method: 'google_account_settings';
    effect: 'immediate';
    dataRetention: 'account_duration';
  };
}
```

### 1.3 Legal Basis Determination

#### 1.3.1 Contract Performance Analysis

**Contract-Based Processing**:

```typescript
interface ContractProcessing {
  activity: string;
  legalBasis: 'contract';
  necessityTest: {
    required: boolean;
    reason: string;
    alternatives: string[];
  };
  proportionalityTest: {
    dataMinimized: boolean;
    leastIntrusive: boolean;
    purposeAchieved: boolean;
  };
  safeguards: string[];
}

const contractActivities: ContractProcessing[] = [
  {
    activity: 'user_registration',
    legalBasis: 'contract',
    necessityTest: {
      required: true,
      reason: 'Account creation is necessary for service delivery',
      alternatives: ['guest_access', 'phone_booking']
    },
    proportionalityTest: {
      dataMinimized: true,
      leastIntrusive: true,
      purposeAchieved: true
    },
    safeguards: ['encryption', 'access_controls', 'audit_logging']
  },
  {
    activity: 'appointment_booking',
    legalBasis: 'contract',
    necessityTest: {
      required: true,
      reason: 'Booking data is essential for service delivery',
      alternatives: ['phone_booking_only']
    },
    proportionalityTest: {
      dataMinimized: true,
      leastIntrusive: true,
      purposeAchieved: true
    },
    safeguards: ['data_encryption', 'retention_limits', 'access_restrictions']
  }
];
```

#### 1.3.2 Legitimate Interest Assessment

**Legitimate Interest Framework**:

```typescript
interface LegitimateInterestAssessment {
  purpose: string;
  necessity: {
    businessNeed: string;
    purposeSpecificity: string;
    connectionToBusiness: string;
  };
  balancingTest: {
    ourInterests: {
      interest: string;
      importance: 'low' | 'medium' | 'high';
      justification: string;
    }[];
    dataSubjectRights: {
      right: string;
      impact: 'low' | 'medium' | 'high';
      mitigation: string;
    }[];
    overallAssessment: 'favors_us' | 'neutral' | 'favors_data_subject';
  };
  safeguards: string[];
  conclusion: 'proceed' | 'require_consent' | 'prohibit';
}

const legitimateInterestActivities: LegitimateInterestAssessment[] = [
  {
    purpose: 'security_monitoring',
    necessity: {
      businessNeed: 'Protect platform and users from security threats',
      purposeSpecificity: 'Monitor for unauthorized access, fraud, and abuse',
      connectionToBusiness: 'Essential for service reliability and user trust'
    },
    balancingTest: {
      ourInterests: [
        {
          interest: 'Security and fraud prevention',
          importance: 'high',
          justification: 'Critical for platform integrity'
        },
        {
          interest: 'User protection',
          importance: 'high',
          justification: 'Users expect secure service'
        }
      ],
      dataSubjectRights: [
        {
          right: 'Privacy and data protection',
          impact: 'low',
          mitigation: 'Data is aggregated and anonymized'
        }
      ],
      overallAssessment: 'favors_us'
    },
    safeguards: ['data_aggregation', 'anonymization', 'retention_limits', 'access_controls'],
    conclusion: 'proceed'
  }
];
```

### 1.4 Consent Management

#### 1.4.1 Consent Categories

**Granular Consent Structure**:

```typescript
interface ConsentCategory {
  id: string;
  name: string;
  description: string;
  purpose: string;
  legalBasis: 'consent';
  dataTypes: string[];
  processingActivities: string[];
  retention: string;
  withdrawalMethod: string;
  defaultState: boolean;
}

const consentCategories: ConsentCategory[] = [
  {
    id: 'essential_service',
    name: 'Essential Service Functionality',
    description: 'Required for basic platform operation',
    purpose: 'Service delivery and account management',
    legalBasis: 'consent',
    dataTypes: ['email', 'name', 'booking_data'],
    processingActivities: ['account_creation', 'booking_management', 'notifications'],
    retention: 'account_duration',
    withdrawalMethod: 'account_deletion',
    defaultState: true
  },
  {
    id: 'calendar_integration',
    name: 'Google Calendar Integration',
    description: 'Sync appointments with your Google Calendar',
    purpose: 'Calendar synchronization',
    legalBasis: 'consent',
    dataTypes: ['calendar_data', 'appointment_details'],
    processingActivities: ['calendar_sync', 'event_creation'],
    retention: 'integration_duration',
    withdrawalMethod: 'disconnect_calendar',
    defaultState: false
  },
  {
    id: 'marketing_communications',
    name: 'Marketing Communications',
    description: 'Promotional emails and special offers',
    purpose: 'Marketing and promotional communications',
    legalBasis: 'consent',
    dataTypes: ['email', 'preferences', 'interaction_history'],
    processingActivities: ['email_marketing', 'personalization', 'analytics'],
    retention: 'consent_duration',
    withdrawalMethod: 'unsubscribe_link',
    defaultState: false
  },
  {
    id: 'analytics_improvement',
    name: 'Service Analytics',
    description: 'Help us improve our services',
    purpose: 'Service improvement and analytics',
    legalBasis: 'consent',
    dataTypes: ['usage_data', 'performance_metrics'],
    processingActivities: ['analytics', 'a_testing', 'improvement'],
    retention: '24_months',
    withdrawalMethod: 'privacy_settings',
    defaultState: false
  }
];
```

#### 1.4.2 Consent Collection Implementation

**Cloudflare Worker Consent Handling**:

```typescript
// Cloudflare Worker for consent management
export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    
    // Consent collection endpoint
    if (url.pathname === '/api/consent') {
      if (request.method === 'POST') {
        return await handleConsentCollection(request, env);
      } else if (request.method === 'GET') {
        return await handleConsentRetrieval(request, env);
      }
    }
    
    // Consent withdrawal endpoint
    if (url.pathname.startsWith('/api/consent/withdraw')) {
      return await handleConsentWithdrawal(request, env);
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

async function handleConsentCollection(request: Request, env: any): Promise<Response> {
  const userData = await request.json();
  const { userId, tenantId, consents } = userData;
  
  // Validate consent request
  const consentValidation = validateConsents(consents);
  if (!consentValidation.valid) {
    return new Response(JSON.stringify({ error: 'Invalid consent data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Store consent record
  const consentRecord = {
    id: generateId(),
    userId,
    tenantId,
    consents,
    version: CONSENT_POLICY_VERSION,
    timestamp: new Date(),
    ipAddress: request.headers.get('CF-Connecting-IP'),
    userAgent: request.headers.get('User-Agent'),
    consentMethod: 'web_interface'
  };
  
  // Store in KV with tenant isolation
  await env.CONSENT_STORE.put(
    `${tenantId}:${userId}`,
    JSON.stringify(consentRecord)
  );
  
  // Update user preferences
  await updateUserPreferences(userId, tenantId, consents, env);
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleConsentWithdrawal(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const consentId = url.searchParams.get('id');
  const userId = url.searchParams.get('userId');
  const tenantId = url.searchParams.get('tenantId');
  
  if (!consentId || !userId || !tenantId) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Load existing consent
  const existingConsent = await env.CONSENT_STORE.get(`${tenantId}:${userId}`);
  if (!existingConsent) {
    return new Response(JSON.stringify({ error: 'Consent record not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Withdraw consent
  const consentData = JSON.parse(existingConsent);
  consentData.withdrawnAt = new Date();
  consentData.withdrawalMethod = 'user_request';
  
  // Update consent record
  await env.CONSENT_STORE.put(
    `${tenantId}:${userId}`,
    JSON.stringify(consentData)
  );
  
  // Process withdrawal effects
  await processConsentWithdrawal(userId, tenantId, consentId, env);
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

#### 1.4.3 Consent Record Keeping

**Consent Database Schema**:

```sql
CREATE TABLE user_consents (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    tenant_id TEXT NOT NULL REFERENCES tenants(id),
    consent_version TEXT NOT NULL,
    
    -- Consent categories (JSON)
    essential_service BOOLEAN DEFAULT TRUE,
    calendar_integration BOOLEAN DEFAULT FALSE,
    marketing_communications BOOLEAN DEFAULT FALSE,
    analytics_improvement BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    granted_at INTEGER,
    withdrawn_at INTEGER,
    withdrawal_method TEXT,
    consent_method TEXT, -- 'web_interface', 'api', 'email'
    ip_address TEXT,
    user_agent TEXT,
    
    -- Audit fields
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
);

-- Indexes for efficient querying
CREATE INDEX user_consents_user_tenant_idx ON user_consents(user_id, tenant_id);
CREATE INDEX user_consents_active_idx ON user_consents(tenant_id) WHERE withdrawn_at IS NULL;
CREATE INDEX user_consents_version_idx ON user_consents(consent_version);

-- Consent audit log
CREATE TABLE consent_audit_log (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    action TEXT NOT NULL, -- 'grant', 'withdraw', 'update'
    consent_category TEXT NOT NULL,
    old_value BOOLEAN,
    new_value BOOLEAN,
    reason TEXT,
    timestamp INTEGER DEFAULT (unixepoch())
);

CREATE INDEX consent_audit_user_tenant_idx ON consent_audit_log(user_id, tenant_id);
CREATE INDEX consent_audit_timestamp_idx ON consent_audit_log(timestamp);
```

## 2. Processing Procedures

### 2.1 Processing Authorization

#### 2.1.1 Pre-Processing Validation

**Validation Framework**:

```typescript
interface ProcessingValidation {
  authorization: {
    dataOwner: string;
    legalBasis: string;
    purpose: string;
    scope: string[];
  };
  compliance: {
    gdprCompliant: boolean;
    popiaCompliant: boolean;
    sectorSpecificCompliant: boolean;
  };
  technical: {
    accessControls: boolean;
    encryptionRequired: boolean;
    auditLogging: boolean;
    dataMinimization: boolean;
  };
  safeguards: string[];
}

async function validateProcessing(
  dataType: string,
  purpose: string,
  legalBasis: string,
  context: ProcessingContext
): Promise<ProcessingValidation> {
  // Check data ownership
  const dataOwner = await getDataOwner(dataType);
  if (!dataOwner) {
    throw new Error(`No data owner found for ${dataType}`);
  }
  
  // Validate legal basis
  const legalBasisValid = validateLegalBasis(legalBasis, dataType, purpose);
  if (!legalBasisValid) {
    throw new Error(`Invalid legal basis: ${legalBasis} for ${dataType}`);
  }
  
  // Check consent requirements
  const consentRequired = await checkConsentRequirement(dataType, context.userId);
  if (consentRequired && !context.hasConsent) {
    throw new Error(`Consent required for processing ${dataType}`);
  }
  
  // Verify access permissions
  const hasAccess = await verifyAccess(context.userId, dataType, purpose);
  if (!hasAccess) {
    throw new Error(`Insufficient permissions to process ${dataType}`);
  }
  
  return {
    authorization: {
      dataOwner,
      legalBasis,
      purpose,
      scope: await getProcessingScope(dataType, purpose)
    },
    compliance: {
      gdprCompliant: true,
      popiaCompliant: true,
      sectorSpecificCompliant: true
    },
    technical: {
      accessControls: true,
      encryptionRequired: isEncryptionRequired(dataType),
      auditLogging: true,
      dataMinimization: true
    },
    safeguards: await getSafeguards(dataType, purpose)
  };
}
```

#### 2.1.2 Processing Boundaries

**Boundary Enforcement**:

```typescript
interface ProcessingBoundary {
  dataTypes: string[];
  purposes: string[];
  legalBases: string[];
  locations: string[];
  retentionLimits: string;
  accessRestrictions: string[];
}

const processingBoundaries: ProcessingBoundary = {
  dataTypes: ['user_profile', 'appointments', 'payments', 'communications'],
  purposes: ['service_delivery', 'account_management', 'support', 'security'],
  legalBases: ['contract', 'legitimate_interest', 'consent', 'legal_obligation'],
  locations: ['eu', 'uk', 'south_africa', 'adequate_countries'],
  retentionLimits: {
    user_profile: 'account_duration_plus_30_days',
    appointments: '7_years',
    payments: '7_years',
    communications: '2_years'
  },
  accessRestrictions: ['role_based', 'tenant_isolated', 'purpose_limited']
};

// Boundary checking function
function checkProcessingBoundary(
  dataType: string,
  purpose: string,
  location: string
): boolean {
  const boundary = processingBoundaries;
  
  return (
    boundary.dataTypes.includes(dataType) &&
    boundary.purposes.includes(purpose) &&
    boundary.locations.includes(location)
  );
}
```

### 2.2 Cloudflare Workers Processing

#### 2.2.1 Secure Processing Implementation

**Worker Processing Pattern**:

```typescript
export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    
    // Extract context from request
    const context = await extractContext(request, env);
    
    try {
      // Validate processing authorization
      const validation = await validateProcessing(
        context.dataType,
        context.purpose,
        context.legalBasis,
        context
      );
      
      if (!validation) {
        return new Response('Unauthorized', { status: 403 });
      }
      
      // Log processing activity
      await logProcessingActivity({
        userId: context.userId,
        tenantId: context.tenantId,
        dataType: context.dataType,
        purpose: context.purpose,
        legalBasis: context.legalBasis,
        timestamp: new Date(),
        requestId: context.requestId
      });
      
      // Execute processing with safeguards
      const result = await executeProcessing(context, env, validation);
      
      // Log successful completion
      await logProcessingCompletion(context.requestId, result);
      
      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          'X-Processing-ID': context.requestId
        }
      });
      
    } catch (error) {
      // Log processing failure
      await logProcessingError(context.requestId, error);
      
      return new Response(JSON.stringify({
        error: 'Processing failed',
        requestId: context.requestId
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

async function executeProcessing(
  context: ProcessingContext,
  env: any,
  validation: ProcessingValidation
): Promise<any> {
  // Apply data minimization
  const minimizedData = await minimizeData(context.data, context.purpose);
  
  // Apply encryption if required
  const processedData = validation.technical.encryptionRequired
    ? await encryptSensitiveData(minimizedData, context.tenantId)
    : minimizedData;
  
  // Execute business logic with tenant isolation
  const result = await processWithTenantIsolation(
    processedData,
    context.tenantId,
    env
  );
  
  // Ensure audit trail
  await ensureAuditTrail(context.requestId, result);
  
  return result;
}
```

#### 2.2.2 Data Isolation and Security

**Tenant Isolation Implementation**:

```typescript
// Tenant isolation in processing
async function processWithTenantIsolation(
  data: any,
  tenantId: string,
  env: any
): Promise<any> {
  // Verify tenant access
  const tenant = await env.DB.prepare(
    'SELECT id, is_active FROM tenants WHERE id = ?'
  ).bind(tenantId).first();
  
  if (!tenant || !tenant.is_active) {
    throw new Error('Invalid or inactive tenant');
  }
  
  // Add tenant context to all database operations
  const db = env.DB;
  
  // Example: User data processing with tenant isolation
  const userData = await db.prepare(
    'SELECT id, email, name, role FROM users WHERE tenant_id = ? AND id = ?'
  ).bind(tenantId, data.userId).first();
  
  if (!userData) {
    throw new Error('User not found in tenant scope');
  }
  
  // Process data within tenant boundaries
  const processedData = {
    ...userData,
    tenantId,
    processedAt: new Date(),
    processingContext: 'tenant_isolated'
  };
  
  // Log tenant-scoped processing
  await logTenantProcessing(tenantId, data.userId, 'user_data_access');
  
  return processedData;
}
```

### 2.3 Data Quality Assurance

#### 2.3.1 Quality Monitoring

**Data Quality Framework**:

```typescript
interface DataQualityMetrics {
  completeness: {
    requiredFieldsPresent: number;
    totalRequiredFields: number;
    percentage: number;
  };
  accuracy: {
    formatValidation: boolean;
    rangeValidation: boolean;
    businessRuleValidation: boolean;
  };
  consistency: {
    crossFieldConsistency: boolean;
    historicalConsistency: boolean;
    externalConsistency: boolean;
  };
  timeliness: {
    lastUpdated: Date;
    freshnessScore: number;
    updateFrequency: string;
  };
  validity: {
    dataTypeCorrect: boolean;
    constraintsMet: boolean;
    referencesValid: boolean;
  };
}

async function assessDataQuality(
  data: any,
  dataType: string,
  tenantId: string
): Promise<DataQualityMetrics> {
  // Completeness check
  const requiredFields = await getRequiredFields(dataType);
  const presentFields = Object.keys(data).filter(field => 
    data[field] !== null && data[field] !== undefined
  );
  
  const completeness = {
    requiredFieldsPresent: presentFields.filter(field => 
      requiredFields.includes(field)
    ).length,
    totalRequiredFields: requiredFields.length,
    percentage: (presentFields.filter(field => requiredFields.includes(field)).length / requiredFields.length) * 100
  };
  
  // Accuracy validation
  const accuracy = await validateDataAccuracy(data, dataType);
  
  // Consistency checks
  const consistency = await validateDataConsistency(data, dataType, tenantId);
  
  // Timeliness assessment
  const timeliness = await assessDataTimeliness(data, dataType);
  
  // Validity verification
  const validity = await validateDataValidity(data, dataType);
  
  return {
    completeness,
    accuracy,
    consistency,
    timeliness,
    validity
  };
}
```

#### 2.3.2 Data Enrichment Procedures

**Enrichment Framework**:

```typescript
interface DataEnrichment {
  source: string;
  method: 'api' | 'database' | 'manual' | 'user_input';
  dataTypes: string[];
  frequency: 'on_demand' | 'scheduled' | 'real_time';
  consentRequired: boolean;
  safeguards: string[];
}

const enrichmentProcedures: DataEnrichment[] = [
  {
    source: 'google_oauth',
    method: 'api',
    dataTypes: ['profile_picture', 'name', 'email_verification'],
    frequency: 'on_demand',
    consentRequired: true,
    safeguards: ['scope_limitation', 'data_minimization']
  },
  {
    source: 'phone_validation',
    method: 'api',
    dataTypes: ['phone_number'],
    frequency: 'real_time',
    consentRequired: false,
    safeguards: ['temporary_storage', 'no_persistence']
  },
  {
    source: 'address_validation',
    method: 'api',
    dataTypes: ['address'],
    frequency: 'on_demand',
    consentRequired: false,
    safeguards: ['purpose_limited', 'retention_limits']
  }
];
```

## 3. Special Categories and Sensitive Data

### 3.1 Health-Related Information

#### 3.1.1 Limited Health Data Processing

**Health-Related Service Data**:

```typescript
interface HealthRelatedData {
  servicePreferences: {
    hair_treatment_types: string[];
    allergic_reactions: string[];
    scalp_conditions: string[];
    accessibility_needs: string[];
  };
  specialRequirements: {
    mobility_assistance: boolean;
    communication_assistance: boolean;
    dietary_restrictions: string[];
  };
  // Note: No explicit medical records or diagnoses stored
}

interface HealthDataSafeguards {
  encryption: {
    atRest: 'AES-256';
    inTransit: 'TLS-1.3';
    keyManagement: 'HSM';
  };
  accessControl: {
    roleBased: boolean;
    leastPrivilege: boolean;
    auditLogging: boolean;
    realTimeMonitoring: boolean;
  };
  retention: {
    purposeLimitation: boolean;
    automaticDeletion: boolean;
    backupSynchronization: boolean;
  };
  processing: {
    explicitConsent: boolean;
    purposeLimitation: boolean;
    dataMinimization: boolean;
  };
}

const healthDataSafeguards: HealthDataSafeguards = {
  encryption: {
    atRest: 'AES-256',
    inTransit: 'TLS-1.3',
    keyManagement: 'HSM'
  },
  accessControl: {
    roleBased: true,
    leastPrivilege: true,
    auditLogging: true,
    realTimeMonitoring: true
  },
  retention: {
    purposeLimitation: true,
    automaticDeletion: true,
    backupSynchronization: true
  },
  processing: {
    explicitConsent: true,
    purposeLimitation: true,
    dataMinimization: true
  }
};
```

#### 3.1.2 Consent for Health-Related Processing

**Enhanced Consent Requirements**:

```typescript
interface HealthDataConsent {
  categories: {
    service_preferences: {
      purpose: 'Service customization and safety';
      legalBasis: 'explicit_consent';
      withdrawal: 'immediate_effect';
      retention: 'service_duration';
    };
    special_requirements: {
      purpose: 'Accessibility and accommodation';
      legalBasis: 'explicit_consent';
      withdrawal: 'immediate_effect';
      retention: 'service_duration';
    };
    safety_information: {
      purpose: 'Health and safety protection';
      legalBasis: 'vital_interests';
      withdrawal: 'not_applicable';
      retention: 'regulatory_requirement';
    };
  };
  safeguards: string[];
  additionalRequirements: string[];
}

const healthDataConsent: HealthDataConsent = {
  categories: {
    service_preferences: {
      purpose: 'Service customization and safety',
      legalBasis: 'explicit_consent',
      withdrawal: 'immediate_effect',
      retention: 'service_duration'
    },
    special_requirements: {
      purpose: 'Accessibility and accommodation',
      legalBasis: 'explicit_consent',
      withdrawal: 'immediate_effect',
      retention: 'service_duration'
    },
    safety_information: {
      purpose: 'Health and safety protection',
      legalBasis: 'vital_interests',
      withdrawal: 'not_applicable',
      retention: 'regulatory_requirement'
    }
  },
  safeguards: [
    'enhanced_encryption',
    'restricted_access',
    'audit_logging',
    'regular_review',
    'secure_deletion'
  ],
  additionalRequirements: [
    'explicit_opt_in',
    'clear_information',
    'easy_withdrawal',
    'regular_confirmation'
  ]
};
```

### 3.2 Biometric and Sensitive Data

#### 3.2.1 Biometric Data Policy

**Current Policy**: No biometric data collection or processing.

**Future Considerations** (if implemented):

```typescript
interface BiometricDataPolicy {
  collection: {
    permitted: false;
    rationale: 'Not required for booking services';
    alternatives: ['password', 'token', 'biometric_derived'];
  };
  processing: {
    legalBasis: 'explicit_consent';
    purpose: 'authentication';
    safeguards: string[];
    retention: 'minimum_necessary';
  };
  storage: {
    encryption: 'required';
    location: 'secure_facility';
    access: 'restricted';
    backup: 'encrypted';
  };
  rights: {
    access: 'full';
    rectification: 'full';
    erasure: 'full';
    portability: 'full';
    objection: 'full';
  };
}
```

## 4. Processing Records and Documentation

### 4.1 Records of Processing Activities

#### 4.1.1 GDPR Article 30 Compliance

**Processing Register Schema**:

```sql
CREATE TABLE processing_activities (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id),
    
    -- Activity identification
    activity_name TEXT NOT NULL,
    activity_description TEXT NOT NULL,
    
    -- Purpose and legal basis
    purposes TEXT NOT NULL, -- JSON array
    legal_bases TEXT NOT NULL, -- JSON array
    
    -- Data categories and subjects
    data_categories TEXT NOT NULL, -- JSON array
    data_subjects TEXT NOT NULL, -- JSON array
    
    -- Recipients and transfers
    recipients TEXT, -- JSON array
    third_country_transfers TEXT, -- JSON array
    transfer_safeguards TEXT, -- JSON array
    
    -- Retention and security
    retention_period TEXT NOT NULL,
    security_measures TEXT NOT NULL, -- JSON array
    
    -- Metadata
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    reviewed_at INTEGER,
    review_status TEXT DEFAULT 'pending' -- 'pending', 'approved', 'rejected'
);

-- Indexes for efficient querying
CREATE INDEX processing_activities_tenant_idx ON processing_activities(tenant_id);
CREATE INDEX processing_activities_purpose_idx ON processing_activities(purposes);
CREATE INDEX processing_activities_legal_basis_idx ON processing_activities(legal_bases);
CREATE INDEX processing_activities_review_status_idx ON processing_activities(review_status);
```

#### 4.1.2 Processing Activity Documentation

**Documentation Template**:

```typescript
interface ProcessingActivity {
  id: string;
  name: string;
  description: string;
  
  // Purpose and legal basis
  purposes: {
    primary: string;
    secondary: string[];
    legitimateInterests?: string;
  };
  
  legalBases: {
    gdpr: string[]; // Article 6 bases
    popia: string[]; // Section 11 conditions
    other: string[];
  };
  
  // Data involved
  dataInvolved: {
    categories: string[];
    subjects: string[];
    specialCategories?: string[];
    sensitivity: 'low' | 'medium' | 'high' | 'very_high';
  };
  
  // Recipients and transfers
  recipients: {
    internal: string[];
    external: string[];
    processors: string[];
    thirdCountries?: string[];
  };
  
  // Retention and security
  retention: {
    period: string;
    justification: string;
    deletionMethod: string;
  };
  
  security: {
    technical: string[];
    organizational: string[];
    encryption: boolean;
    accessControls: boolean;
  };
  
  // Rights and safeguards
  rights: {
    access: boolean;
    rectification: boolean;
    erasure: boolean;
    portability: boolean;
    objection: boolean;
  };
  
  safeguards: string[];
  
  // Review and approval
  approval: {
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    approvedBy: string;
    approvedAt: Date;
    nextReview: Date;
  };
}
```

### 4.2 Processing Impact Assessment

#### 4.2.1 Privacy Impact Assessment Template

**PIA Framework**:

```typescript
interface PrivacyImpactAssessment {
  // Project information
  project: {
    name: string;
    description: string;
    owner: string;
    stakeholders: string[];
    timeline: string;
  };
  
  // Data processing details
  processing: {
    dataTypes: string[];
    processingMethods: string[];
    dataSources: string[];
    dataSubjects: string[];
    purposes: string[];
  };
  
  // Legal basis assessment
  legalBasis: {
    gdpr: {
      article6Basis: string;
      article9Basis?: string; // For special categories
      legitimateInterests?: string;
      consentRequired: boolean;
    };
    popia: {
      conditions: string[];
      processingType: string;
    };
  };
  
  // Risk assessment
  risks: {
    risksToRights: {
      risk: string;
      likelihood: 'low' | 'medium' | 'high';
      impact: 'low' | 'medium' | 'high';
      riskLevel: 'low' | 'medium' | 'high';
      mitigation: string[];
    }[];
    risksToFreedoms: {
      risk: string;
      likelihood: 'low' | 'medium' | 'high';
      impact: 'low' | 'medium' | 'high';
      riskLevel: 'low' | 'medium' | 'high';
      mitigation: string[];
    }[];
  };
  
  // Safeguards and controls
  safeguards: {
    technical: string[];
    organizational: string[];
    contractual: string[];
  };
  
  // Stakeholder consultation
  consultation: {
    dataSubjects: boolean;
    methodology: string;
    feedback: string;
    responses: string;
  };
  
  // Decision and approval
  decision: {
    proceed: boolean;
    conditions: string[];
    additionalSafeguards: string[];
    approvalRequired: string;
  };
  
  // Monitoring and review
  monitoring: {
    kpis: string[];
    reviewSchedule: string;
    escalationProcedures: string[];
  };
}
```

---

**Document Control**:

- **Classification**: Internal
- **Retention Period**: 7 years
- **Distribution**: Privacy team, legal, technical teams
- **Review Date**: March 24, 2026
- **Next Review**: June 24, 2026

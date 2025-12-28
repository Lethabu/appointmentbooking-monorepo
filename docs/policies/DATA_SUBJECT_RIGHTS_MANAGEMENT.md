# Data Subject Rights Management

## Executive Summary

This document establishes comprehensive procedures for managing data subject rights within our appointment booking platform, ensuring compliance with GDPR, POPIA, and other applicable privacy regulations. These procedures provide practical mechanisms for individuals to exercise their privacy rights while maintaining operational efficiency and legal compliance.

**Effective Date**: January 1, 2026  
**Version**: 1.0.0  
**Next Review**: March 24, 2026  
**Owner**: Data Protection Officer  
**Approved By**: Chief Executive Officer

## 1. Data Subject Rights Framework

### 1.1 Legal Framework and Scope

#### 1.1.1 GDPR Rights Framework

**GDPR Articles 12-22 Comprehensive Rights**:
```typescript
interface GDPRRightsFramework {
  article: string;
  right: string;
  description: string;
  responseTime: string;
  exceptions: string[];
  implementation: string;
}

const gdprRightsFramework: GDPRRightsFramework[] = [
  {
    article: 'Art. 12',
    right: 'Transparent Information',
    description: 'Right to transparent, clear and intelligible information',
    responseTime: 'immediate',
    exceptions: [],
    implementation: 'privacy_policy_and_notices'
  },
  {
    article: 'Art. 13-14',
    right: 'Right to be Informed',
    description: 'Right to be informed about data collection and processing',
    responseTime: 'at_time_of_collection',
    exceptions: ['Art. 14(5) - disproportionate effort'],
    implementation: 'privacy_notices_and_privacy_policy'
  },
  {
    article: 'Art. 15',
    right: 'Right of Access',
    description: 'Right to obtain confirmation and copy of personal data',
    responseTime: '1_month (extendable)',
    exceptions: ['trade_secrets', 'confidentiality'],
    implementation: 'data_export_functionality'
  },
  {
    article: 'Art. 16',
    right: 'Right to Rectification',
    description: 'Right to have inaccurate personal data corrected',
    responseTime: '1_month (extendable)',
    exceptions: ['public_interest', 'legal_claims'],
    implementation: 'self_service_profile_editing'
  },
  {
    article: 'Art. 17',
    right: 'Right to Erasure',
    description: 'Right to have personal data deleted ("right to be forgotten")',
    responseTime: '1_month (extendable)',
    exceptions: ['freedom_of_expression', 'legal_obligation', 'public_interest'],
    implementation: 'account_deletion_and_data_purging'
  },
  {
    article: 'Art. 18',
    right: 'Right to Restriction',
    description: 'Right to restrict processing of personal data',
    responseTime: '1_month (extendable)',
    exceptions: ['consent', 'legal_claims', 'public_interest'],
    implementation: 'processing_restriction_controls'
  },
  {
    article: 'Art. 19',
    right: 'Notification of Rectification/Erasure/Restriction',
    description: 'Right to be notified about rectification, erasure, or restriction',
    responseTime: '1_month',
    exceptions: ['impossible_or_disproportionate_effort'],
    implementation: 'automated_notification_system'
  },
  {
    article: 'Art. 20',
    right: 'Right to Data Portability',
    description: 'Right to receive personal data in structured, machine-readable format',
    responseTime: '1_month (extendable)',
    exceptions: ['public_interest', 'legal_claims'],
    implementation: 'data_export_and_portability_tools'
  },
  {
    article: 'Art. 21',
    right: 'Right to Object',
    description: 'Right to object to processing based on legitimate interests or public task',
    responseTime: 'immediate',
    exceptions: ['compelling_legitimate_grounds', 'legal_claims'],
    implementation: 'opt_out_and_objection_mechanisms'
  },
  {
    article: 'Art. 22',
    right: 'Automated Decision-Making',
    description: 'Right not to be subject to automated decision-making with legal effects',
    responseTime: 'before_decision',
    exceptions: ['explicit_consent', 'legal_authorization', 'vital_interests'],
    implementation: 'human_review_processes'
  }
];
```

#### 1.1.2 POPIA Rights Framework

**POPIA Chapter 9 Rights and Procedures**:
```typescript
interface POPIARightsFramework {
  section: string;
  right: string;
  description: string;
  responseTime: string;
  conditions: string[];
  implementation: string;
}

const popiaRightsFramework: POPIARightsFramework[] = [
  {
    section: 'Section 23',
    right: 'Right to be Informed',
    description: 'Right to be informed when personal information is collected',
    responseTime: 'at_time_of_collection',
    conditions: ['notify_before_collection', 'provide_processing_details'],
    implementation: 'privacy_notices_and_collection_notices'
  },
  {
    section: 'Section 24',
    right: 'Right of Access',
    description: 'Right to request confirmation of processing and access to personal information',
    responseTime: '1_month (extendable)',
    conditions: ['verify_identity', 'process_fee_payment'],
    implementation: 'data_access_portal'
  },
  {
    section: 'Section 25',
    right: 'Right to Correction, Deletion or Destruction',
    description: 'Right to request correction, deletion or destruction of personal information',
    responseTime: '1_month (extendable)',
    conditions: ['verify_identity', 'assess_legal_obligations'],
    implementation: 'data_management_portal'
  },
  {
    section: 'Section 26',
    right: 'Right to Object',
    description: 'Right to object to processing of personal information',
    responseTime: 'immediate',
    conditions: ['compelling_legitimate_grounds', 'freedom_of_expression'],
    implementation: 'objection_and_opt_out_system'
  },
  {
    section: 'Section 56',
    right: 'Complaint to Regulator',
    description: 'Right to complain to Information Regulator',
    responseTime: 'not_applicable',
    conditions: ['exhaust_internal_remedies', 'provide_complaint_details'],
    implementation: 'complaint_escalation_procedures'
  },
  {
    section: 'Section 57',
    right: 'Right to Destruction or Deletion',
    description: 'Right to request destruction or deletion of personal information',
    responseTime: '1_month (extendable)',
    conditions: ['no_legal_obligation_to_retain', 'reasonable_request'],
    implementation: 'secure_deletion_system'
  },
  {
    section: 'Section 58',
    right: 'Records of Processing',
    description: 'Right to information about processing activities',
    responseTime: '1_month (extendable)',
    conditions: ['reasonable_request', 'pay_processing_fee'],
    implementation: 'processing_activities_register'
  }
];
```

### 1.2 Rights Implementation Strategy

#### 1.2.1 Self-Service Portal Implementation

**Cloudflare Worker-Based Rights Portal**:
```typescript
// Data Subject Rights Portal Worker
export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Rights portal routes
    if (path.startsWith('/rights-portal/')) {
      if (path === '/rights-portal/access' && request.method === 'POST') {
        return await handleAccessRequest(request, env);
      }
      if (path === '/rights-portal/rectification' && request.method === 'POST') {
        return await handleRectificationRequest(request, env);
      }
      if (path === '/rights-portal/erasure' && request.method === 'POST') {
        return await handleErasureRequest(request, env);
      }
      if (path === '/rights-portal/portability' && request.method === 'POST') {
        return await handlePortabilityRequest(request, env);
      }
      if (path === '/rights-portal/objection' && request.method === 'POST') {
        return await handleObjectionRequest(request, env);
      }
      if (path === '/rights-portal/status' && request.method === 'GET') {
        return await handleStatusRequest(request, env);
      }
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

class DataSubjectRightsPortal {
  async handleAccessRequest(
    request: Request,
    env: any
  ): Promise<Response> {
    try {
      const userData = await request.json();
      const { email, tenantId, verificationCode } = userData;
      
      // Step 1: Verify identity
      const identityVerification = await this.verifyIdentity(
        email,
        tenantId,
        verificationCode
      );
      
      if (!identityVerification.verified) {
        return this.createErrorResponse('Identity verification failed', 400);
      }
      
      // Step 2: Gather user's personal data
      const userDataCollection = await this.gatherUserData(
        identityVerification.userId,
        tenantId
      );
      
      // Step 3: Format data for user
      const formattedData = await this.formatUserData(userDataCollection);
      
      // Step 4: Create secure download
      const downloadToken = await this.createSecureDownload(
        formattedData,
        identityVerification.userId
      );
      
      // Step 5: Log access request
      await this.logRightsRequest({
        type: 'access',
        userId: identityVerification.userId,
        tenantId: tenantId,
        status: 'completed',
        timestamp: new Date()
      });
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Your data has been prepared',
        downloadUrl: `/rights-portal/download/${downloadToken}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        dataSummary: {
          categories: formattedData.categories,
          totalItems: formattedData.totalItems,
          dataSize: formattedData.size
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      return this.createErrorResponse(error.message, 500);
    }
  }

  private async gatherUserData(
    userId: string,
    tenantId: string
  ): Promise<UserDataCollection> {
    const collection = {
      profile: await this.getUserProfile(userId, tenantId),
      appointments: await this.getUserAppointments(userId, tenantId),
      preferences: await this.getUserPreferences(userId, tenantId),
      communications: await this.getUserCommunications(userId, tenantId),
      analytics: await this.getUserAnalytics(userId, tenantId),
      oauth: await this.getOAuthData(userId, tenantId),
      metadata: await this.getUserMetadata(userId, tenantId)
    };
    
    return collection;
  }

  private async formatUserData(
    collection: UserDataCollection
  ): Promise<FormattedUserData> {
    return {
      profile: {
        email: collection.profile.email,
        name: collection.profile.name,
        createdAt: collection.profile.createdAt,
        lastLogin: collection.profile.lastLogin,
        status: collection.profile.status
      },
      appointments: collection.appointments.map(apt => ({
        id: apt.id,
        service: apt.serviceName,
        scheduledTime: apt.scheduledTime,
        status: apt.status,
        employee: apt.employeeName,
        notes: apt.notes
      })),
      preferences: {
        notifications: collection.preferences.notifications,
        privacy: collection.preferences.privacy,
        communication: collection.preferences.communication
      },
      communications: collection.communications.map(comm => ({
        type: comm.type,
        subject: comm.subject,
        timestamp: comm.timestamp,
        status: comm.status
      })),
      analytics: {
        usage: collection.analytics.usage,
        interactions: collection.analytics.interactions,
        preferences: collection.analytics.preferences
      },
      oauth: {
        providers: collection.oauth.providers,
        connectedServices: collection.oauth.connectedServices,
        lastSync: collection.oauth.lastSync
      },
      metadata: {
        dataRetention: collection.metadata.retention,
        processingPurposes: collection.metadata.purposes,
        legalBasis: collection.metadata.legalBasis
      },
      categories: [
        'profile',
        'appointments',
        'preferences',
        'communications',
        'analytics',
        'oauth',
        'metadata'
      ],
      totalItems: this.calculateTotalItems(collection),
      size: this.calculateDataSize(collection),
      generatedAt: new Date()
    };
  }
}
```

#### 1.2.2 Identity Verification System

**Multi-Layer Identity Verification**:
```typescript
interface IdentityVerification {
  method: 'email' | 'sms' | 'mfa' | 'document' | 'biometric';
  confidence: 'low' | 'medium' | 'high';
  verificationSteps: VerificationStep[];
  requirements: string[];
  exemptions: string[];
}

class IdentityVerificationSystem {
  async verifyIdentity(
    request: RightsRequest
  ): Promise<IdentityVerificationResult> {
    const verificationLevel = this.determineVerificationLevel(request);
    
    switch (verificationLevel) {
      case 'basic':
        return await this.performBasicVerification(request);
      case 'enhanced':
        return await this.performEnhancedVerification(request);
      case 'high':
        return await this.performHighVerification(request);
      default:
        throw new Error('Invalid verification level');
    }
  }

  private async performBasicVerification(
    request: RightsRequest
  ): Promise<IdentityVerificationResult> {
    // Email verification (for most data subject rights)
    const emailVerification = await this.verifyEmail(request);
    if (!emailVerification.verified) {
      return {
        verified: false,
        method: 'email',
        confidence: 'low',
        reason: 'Email verification failed'
      };
    }
    
    // Send verification code
    const verificationCode = await this.sendVerificationCode(request.email);
    
    return {
      verified: true,
      method: 'email',
      confidence: 'medium',
      verificationCode: verificationCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    };
  }

  private async performEnhancedVerification(
    request: RightsRequest
  ): Promise<IdentityVerificationResult> {
    // Enhanced verification for erasure and portability requests
    const basicResult = await this.performBasicVerification(request);
    
    // Additional verification steps
    const mfaVerification = await this.verifyMFA(request.userId);
    const securityQuestions = await this.verifySecurityQuestions(request);
    
    if (mfaVerification.verified || securityQuestions.verified) {
      return {
        ...basicResult,
        confidence: 'high',
        additionalVerification: {
          mfa: mfaVerification,
          securityQuestions: securityQuestions
        }
      };
    }
    
    return basicResult;
  }

  private async performHighVerification(
    request: RightsRequest
  ): Promise<IdentityVerificationResult> {
    // High verification for sensitive requests or high-risk scenarios
    const enhancedResult = await this.performEnhancedVerification(request);
    
    // Additional high-security verification
    const documentVerification = await this.verifyDocument(request);
    const biometricVerification = await this.verifyBiometric(request);
    
    if (documentVerification.verified || biometricVerification.verified) {
      return {
        ...enhancedResult,
        confidence: 'very_high',
        highSecurityVerification: {
          document: documentVerification,
          biometric: biometricVerification
        }
      };
    }
    
    return enhancedResult;
  }
}
```

## 2. Access Request Procedures

### 2.1 GDPR Article 15 Implementation

#### 2.1.1 Data Access Request Handling

**Comprehensive Access Request Processing**:
```typescript
interface DataAccessRequest {
  id: string;
  requester: {
    email: string;
    name: string;
    userId?: string;
    tenantId: string;
  };
  request: {
    type: 'full_access' | 'specific_data' | 'data_categories';
    categories?: string[];
    dataTypes?: string[];
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
  verification: {
    method: string;
    status: 'pending' | 'verified' | 'failed';
    completedAt?: Date;
  };
  processing: {
    status: 'pending' | 'processing' | 'completed' | 'rejected';
    startedAt?: Date;
    completedAt?: Date;
    assignedTo?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  };
  response: {
    format: 'json' | 'pdf' | 'csv' | 'xml';
    method: 'download' | 'email' | 'portal';
    data: any;
    summary: DataAccessSummary;
  };
}

class DataAccessProcessor {
  async processAccessRequest(
    request: DataAccessRequest
  ): Promise<DataAccessResult> {
    try {
      // Step 1: Validate request
      await this.validateAccessRequest(request);
      
      // Step 2: Verify identity
      const verification = await this.verifyRequesterIdentity(request);
      if (!verification.verified) {
        return this.rejectRequest(request, 'Identity verification failed');
      }
      
      // Step 3: Check for exemptions
      const exemptions = await this.checkAccessExemptions(request);
      if (exceptions.exist) {
        return this.rejectWithExemptions(request, exemptions);
      }
      
      // Step 4: Gather requested data
      const userData = await this.gatherRequestedData(request);
      
      // Step 5: Apply data minimization
      const minimizedData = this.applyDataMinimization(userData, request);
      
      // Step 6: Format response
      const formattedResponse = await this.formatAccessResponse(
        minimizedData,
        request.response.format
      );
      
      // Step 7: Create secure delivery
      const deliveryMethod = await this.createSecureDelivery(
        formattedResponse,
        request.requester,
        request.response.method
      );
      
      // Step 8: Log access request
      await this.logAccessRequest(request, formattedResponse);
      
      return {
        requestId: request.id,
        status: 'completed',
        data: formattedResponse,
        delivery: deliveryMethod,
        summary: this.generateAccessSummary(formattedResponse),
        timestamp: new Date()
      };
      
    } catch (error) {
      await this.logAccessError(request, error);
      return this.rejectRequest(request, error.message);
    }
  }

  private async gatherRequestedData(
    request: DataAccessRequest
  ): Promise<UserDataCollection> {
    const dataCollection: UserDataCollection = {};
    
    if (request.request.type === 'full_access') {
      // Gather all user data
      dataCollection.profile = await this.getUserProfile(request.requester);
      dataCollection.appointments = await this.getUserAppointments(request.requester);
      dataCollection.preferences = await this.getUserPreferences(request.requester);
      dataCollection.communications = await this.getUserCommunications(request.requester);
      dataCollection.analytics = await this.getUserAnalytics(request.requester);
      dataCollection.oauth = await this.getOAuthData(request.requester);
      dataCollection.security = await this.getSecurityData(request.requester);
      dataCollection.metadata = await this.getMetadata(request.requester);
      
    } else if (request.request.type === 'specific_data') {
      // Gather specific data types
      for (const dataType of request.request.dataTypes || []) {
        dataCollection[dataType] = await this.getSpecificData(
          dataType,
          request.requester,
          request.request.dateRange
        );
      }
      
    } else if (request.request.type === 'data_categories') {
      // Gather data by categories
      for (const category of request.request.categories || []) {
        dataCollection[category] = await this.getCategoryData(
          category,
          request.requester
        );
      }
    }
    
    return dataCollection;
  }

  private applyDataMinimization(
    data: UserDataCollection,
    request: DataAccessRequest
  ): UserDataCollection {
    const minimized = JSON.parse(JSON.stringify(data));
    
    // Remove third-party personal data
    this.removeThirdPartyData(minimized);
    
    // Remove confidential business information
    this.removeBusinessConfidentialData(minimized);
    
    // Remove other users' personal data
    this.removeOtherUsersData(minimized);
    
    // Remove system-generated data not related to the user
    this.removeSystemData(minimized);
    
    // Add processing information
    this.addProcessingInformation(minimized, request);
    
    return minimized;
  }

  private addProcessingInformation(
    data: UserDataCollection,
    request: DataAccessRequest
  ): void {
    (data as any).processingInfo = {
      purposes: this.getProcessingPurposes(data),
      legalBasis: this.getLegalBasis(data),
      retention: this.getRetentionPeriods(data),
      sources: this.getDataSources(data),
      recipients: this.getRecipients(data),
      transfers: this.getTransferInformation(data),
      automatedProcessing: this.getAutomatedProcessing(data),
      dataSubjectRights: this.getRightsInformation(data)
    };
  }
}
```

#### 2.1.2 Access Response Formats

**Structured Data Export**:
```typescript
interface StructuredAccessResponse {
  metadata: {
    exportDate: Date;
    requestId: string;
    requester: string;
    dataController: string;
    format: string;
    version: string;
  };
  personalData: {
    categories: { [key: string]: any };
    processingInfo: ProcessingInfo;
    rights: DataSubjectRightsInfo;
    contacts: ContactInfo;
  };
  technical: {
    dataSize: string;
    recordCount: number;
    categories: string[];
    lastUpdated: Date;
  };
  legal: {
    legalBasis: string[];
    retentionPeriods: { [key: string]: string };
    exemptions: string[];
    restrictions: string[];
  };
}

class StructuredDataExporter {
  async exportData(
    userData: UserDataCollection,
    format: 'json' | 'csv' | 'pdf' | 'xml'
  ): Promise<string> {
    const structuredResponse: StructuredAccessResponse = {
      metadata: {
        exportDate: new Date(),
        requestId: await this.generateRequestId(),
        requester: userData.profile.email,
        dataController: 'Appointment Booking Platform',
        format: format,
        version: '1.0'
      },
      personalData: {
        categories: this.categorizeData(userData),
        processingInfo: this.generateProcessingInfo(userData),
        rights: this.generateRightsInfo(),
        contacts: this.generateContactInfo()
      },
      technical: {
        dataSize: this.calculateDataSize(userData),
        recordCount: this.countRecords(userData),
        categories: Object.keys(userData),
        lastUpdated: new Date()
      },
      legal: {
        legalBasis: this.extractLegalBasis(userData),
        retentionPeriods: this.extractRetentionPeriods(userData),
        exemptions: [],
        restrictions: this.extractRestrictions(userData)
      }
    };
    
    switch (format) {
      case 'json':
        return JSON.stringify(structuredResponse, null, 2);
      case 'csv':
        return this.exportToCSV(structuredResponse);
      case 'pdf':
        return await this.exportToPDF(structuredResponse);
      case 'xml':
        return this.exportToXML(structuredResponse);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
}
```

### 2.2 Response Time Management

#### 2.2.1 Automated Timeline Tracking

**Timeline Management System**:
```typescript
interface AccessRequestTimeline {
  requestId: string;
  deadlines: {
    initial: Date;
    extension: Date;
    final: Date;
  };
  milestones: {
    received: Date;
    verified: Date;
    started: Date;
    completed: Date;
    delivered: Date;
  };
  extensions: {
    reason: string;
    grantedBy: string;
    newDeadline: Date;
    notified: boolean;
  }[];
  status: 'on_time' | 'at_risk' | 'overdue' | 'extended';
}

class TimelineManager {
  async trackAccessRequest(
    request: DataAccessRequest
  ): Promise<AccessRequestTimeline> {
    const now = new Date();
    const deadline = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const extensionDeadline = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days
    
    const timeline: AccessRequestTimeline = {
      requestId: request.id,
      deadlines: {
        initial: deadline,
        extension: extensionDeadline,
        final: extensionDeadline
      },
      milestones: {
        received: now,
        verified: new Date(), // Will be updated
        started: new Date(), // Will be updated
        completed: new Date(), // Will be updated
        delivered: new Date() // Will be updated
      },
      extensions: [],
      status: 'on_time'
    };
    
    // Set up monitoring
    await this.setupTimelineMonitoring(timeline);
    
    // Schedule reminders
    await this.scheduleReminders(timeline);
    
    return timeline;
  }

  async checkComplianceStatus(
    timeline: AccessRequestTimeline
  ): Promise<ComplianceStatus> {
    const now = new Date();
    const daysRemaining = Math.ceil(
      (timeline.deadlines.final.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    let status: 'compliant' | 'at_risk' | 'non_compliant' = 'compliant';
    let alerts: string[] = [];
    
    if (daysRemaining < 0) {
      status = 'non_compliant';
      alerts.push(`Request is ${Math.abs(daysRemaining)} days overdue`);
    } else if (daysRemaining <= 3) {
      status = 'at_risk';
      alerts.push(`Request is due in ${daysRemaining} days`);
    }
    
    if (timeline.status === 'overdue') {
      status = 'non_compliant';
      alerts.push('Request status is overdue');
    }
    
    return {
      status: status,
      daysRemaining: daysRemaining,
      alerts: alerts,
      nextAction: this.determineNextAction(status, daysRemaining),
      escalation: this.determineEscalation(status, daysRemaining)
    };
  }

  async requestExtension(
    requestId: string,
    reason: string,
    requestor: string
  ): Promise<ExtensionResult> {
    const timeline = await this.getTimeline(requestId);
    const currentDeadline = timeline.deadlines.final;
    const newDeadline = new Date(currentDeadline.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    // Create extension record
    const extension = {
      reason: reason,
      grantedBy: requestor,
      grantedAt: new Date(),
      newDeadline: newDeadline,
      notified: false
    };
    
    // Update timeline
    timeline.deadlines.final = newDeadline;
    timeline.extensions.push(extension);
    timeline.status = 'on_time'; // Reset status
    
    // Notify requester
    await this.notifyExtension(timeline.requestId, extension);
    
    // Update deadlines in system
    await this.updateDeadlines(timeline);
    
    return {
      granted: true,
      extension: extension,
      newDeadline: newDeadline,
      notificationSent: true
    };
  }
}
```

## 3. Rectification and Correction Procedures

### 3.1 GDPR Article 16 Implementation

#### 3.1.1 Self-Service Corrections

**User-Controlled Profile Management**:
```typescript
interface ProfileCorrection {
  userId: string;
  tenantId: string;
  corrections: {
    field: string;
    currentValue: any;
    newValue: any;
    reason: string;
    verificationRequired: boolean;
  }[];
  verification: {
    method: 'email' | 'sms' | 'mfa';
    required: boolean;
    completed: boolean;
  };
  approval: {
    required: boolean;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    approver?: string;
    approvedAt?: Date;
  };
  implementation: {
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    completedAt?: Date;
    cascadeUpdate: boolean;
  };
}

class ProfileCorrectionService {
  async processCorrectionRequest(
    request: ProfileCorrectionRequest
  ): Promise<CorrectionResult> {
    // Step 1: Validate corrections
    const validation = await this.validateCorrections(request);
    if (!validation.valid) {
      return this.rejectCorrections(request, validation.errors);
    }
    
    // Step 2: Check for approval requirements
    const approvalRequired = await this.checkApprovalRequirement(request);
    if (approvalRequired.required) {
      return this.requestApproval(request, approvalRequired);
    }
    
    // Step 3: Verify identity if required
    if (request.verification.required) {
      const verification = await this.verifyIdentity(request);
      if (!verification.verified) {
        return this.rejectCorrections(request, 'Identity verification failed');
      }
    }
    
    // Step 4: Implement corrections
    const implementation = await this.implementCorrections(request);
    
    // Step 5: Update related data if necessary
    if (request.implementation.cascadeUpdate) {
      await this.cascadeCorrections(request, implementation);
    }
    
    // Step 6: Notify third parties if required
    await this.notifyCorrections(request, implementation);
    
    // Step 7: Log corrections
    await this.logCorrections(request, implementation);
    
    return {
      requestId: request.id,
      status: 'completed',
      corrections: implementation.corrections,
      cascadeUpdates: implementation.cascadeUpdates,
      notifications: implementation.notifications,
      timestamp: new Date()
    };
  }

  private async implementCorrections(
    request: ProfileCorrectionRequest
  ): Promise<CorrectionImplementation> {
    const corrections: FieldCorrection[] = [];
    const cascadeUpdates: CascadeUpdate[] = [];
    const notifications: Notification[] = [];
    
    for (const correction of request.corrections) {
      try {
        // Implement correction
        const result = await this.updateField(
          correction.field,
          correction.currentValue,
          correction.newValue,
          request.userId,
          request.tenantId
        );
        
        corrections.push(result);
        
        // Check for cascade requirements
        const cascade = await this.assessCascadeUpdate(correction);
        if (cascade.required) {
          cascadeUpdates.push(cascade);
        }
        
        // Create notification if significant change
        if (correction.field === 'email' || correction.field === 'name') {
          notifications.push({
            type: 'profile_update',
            recipient: correction.newValue,
            channel: 'email',
            timestamp: new Date()
          });
        }
        
      } catch (error) {
        corrections.push({
          field: correction.field,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    return {
      corrections: corrections,
      cascadeUpdates: cascadeUpdates,
      notifications: notifications
    };
  }

  private async cascadeCorrections(
    request: ProfileCorrectionRequest,
    implementation: CorrectionImplementation
  ): Promise<void> {
    for (const cascade of implementation.cascadeUpdates) {
      switch (cascade.type) {
        case 'email_change':
          await this.updateEmailReferences(
            request.userId,
            cascade.oldValue,
            cascade.newValue
          );
          break;
          
        case 'name_change':
          await this.updateNameReferences(
            request.userId,
            cascade.oldValue,
            cascade.newValue
          );
          break;
          
        case 'address_change':
          await this.updateAddressReferences(
            request.userId,
            cascade.oldValue,
            cascade.newValue
          );
          break;
      }
    }
  }
}
```

#### 3.1.2 Admin-Assisted Corrections

**Administrative Correction Workflow**:
```typescript
interface AdminCorrectionRequest {
  id: string;
  requester: {
    userId: string;
    email: string;
    tenantId: string;
    role: string;
  };
  target: {
    userId: string;
    fields: string[];
  };
  corrections: {
    field: string;
    currentValue: any;
    requestedValue: any;
    reason: string;
    evidence?: string;
  }[];
  verification: {
    identityVerified: boolean;
    authorityVerified: boolean;
    reasonDocumented: boolean;
  };
  approval: {
    required: boolean;
    approvers: string[];
    status: 'pending' | 'approved' | 'rejected';
    decision?: {
      approver: string;
      decision: 'approved' | 'rejected';
      reason: string;
      timestamp: Date;
    };
  };
  audit: {
    requestSource: 'user_portal' | 'admin_portal' | 'support' | 'api';
    justification: string;
    impact: string;
    rollbackPlan: string;
  };
}

class AdminCorrectionService {
  async processAdminCorrection(
    request: AdminCorrectionRequest
  ): Promise<AdminCorrectionResult> {
    // Step 1: Verify administrator authority
    const authority = await this.verifyAdministratorAuthority(
      request.requester.userId,
      request.requester.role,
      'correction'
    );
    
    if (!authority.authorized) {
      throw new Error('Insufficient authority for correction request');
    }
    
    // Step 2: Verify target user exists
    const targetUser = await this.getUser(request.target.userId);
    if (!targetUser) {
      throw new Error('Target user not found');
    }
    
    // Step 3: Validate correction requests
    const validation = await this.validateAdminCorrections(request);
    if (!validation.valid) {
      return this.rejectAdminCorrections(request, validation.errors);
    }
    
    // Step 4: Check approval requirements
    const approvalRequired = await this.checkAdminApprovalRequirement(request);
    if (approvalRequired.required) {
      return this.requestAdminApproval(request, approvalRequired);
    }
    
    // Step 5: Create backup before changes
    const backup = await this.createUserBackup(request.target.userId);
    
    // Step 6: Implement corrections with audit trail
    const implementation = await this.implementAdminCorrections(request, backup);
    
    // Step 7: Verify corrections applied correctly
    const verification = await this.verifyCorrections(
      request.target.userId,
      request.corrections
    );
    
    if (!verification.successful) {
      // Rollback changes
      await this.rollbackUserData(backup);
      throw new Error('Correction verification failed - changes rolled back');
    }
    
    // Step 8: Notify affected parties
    await this.notifyAdminCorrections(request, implementation);
    
    // Step 9: Update audit trail
    await this.updateCorrectionAudit(request, implementation);
    
    return {
      requestId: request.id,
      status: 'completed',
      corrections: implementation.corrections,
      backupId: backup.id,
      verification: verification,
      notifications: implementation.notifications,
      timestamp: new Date()
    };
  }

  private async implementAdminCorrections(
    request: AdminCorrectionRequest,
    backup: UserBackup
  ): Promise<AdminCorrectionImplementation> {
    const corrections: AdminFieldCorrection[] = [];
    const notifications: AdminNotification[] = [];
    
    // Create audit session
    const auditSession = await this.createAuditSession(
      request.requester.userId,
      request.requester.role,
      'correction'
    );
    
    for (const correction of request.corrections) {
      try {
        // Create audit entry for each change
        await this.createAuditEntry(auditSession, {
          action: 'correction',
          field: correction.field,
          oldValue: correction.currentValue,
          newValue: correction.requestedValue,
          reason: correction.reason,
          timestamp: new Date()
        });
        
        // Apply correction
        const result = await this.updateUserField(
          request.target.userId,
          correction.field,
          correction.requestedValue,
          auditSession
        );
        
        corrections.push(result);
        
        // Create notifications for significant changes
        if (this.isSignificantChange(correction.field)) {
          notifications.push({
            type: 'admin_correction',
            recipient: request.target.userId,
            field: correction.field,
            change: {
              from: correction.currentValue,
              to: correction.requestedValue
            },
            timestamp: new Date()
          });
        }
        
      } catch (error) {
        corrections.push({
          field: correction.field,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    // Close audit session
    await this.closeAuditSession(auditSession);
    
    return {
      corrections: corrections,
      notifications: notifications,
      auditSession: auditSession.id
    };
  }
}
```

## 4. Erasure and Deletion Procedures

### 4.1 GDPR Article 17 Implementation

#### 4.1.1 Right to Erasure Processing

**Comprehensive Erasure Implementation**:
```typescript
interface ErasureRequest {
  id: string;
  requester: {
    userId: string;
    email: string;
    tenantId: string;
  };
  scope: {
    type: 'complete' | 'partial' | 'specific_data';
    dataCategories: string[];
    specificData?: {
      table: string;
      recordId: string;
      field: string;
    }[];
  };
  reason: string;
  legalBasis: 'consent_withdrawal' | 'no_longer_necessary' | 'objection' | 'unlawful_processing' | 'legal_obligation' | 'other';
  verification: {
    method: string;
    status: 'pending' | 'verified' | 'failed';
    completedAt?: Date;
  };
  assessment: {
    legalGrounds: LegalGround[];
    exceptions: ErasureException[];
    restrictions: ErasureRestriction[];
    recommendation: 'approve' | 'partial' | 'reject';
  };
  processing: {
    status: 'pending' | 'assessment' | 'approved' | 'rejected' | 'processing' | 'completed';
    assignedTo?: string;
    startedAt?: Date;
    completedAt?: Date;
  };
}

class ErasureProcessor {
  async processErasureRequest(
    request: ErasureRequest
  ): Promise<ErasureResult> {
    // Step 1: Verify request validity
    await this.validateErasureRequest(request);
    
    // Step 2: Assess legal grounds for erasure
    const legalAssessment = await this.assessLegalGrounds(request);
    
    // Step 3: Check for exceptions
    const exceptions = await this.checkErasureExceptions(request);
    
    // Step 4: Check for restrictions
    const restrictions = await this.checkErasureRestrictions(request);
    
    // Step 5: Make recommendation
    const recommendation = this.makeErasureRecommendation(
      legalAssessment,
      exceptions,
      restrictions
    );
    
    // Step 6: Update request with assessment
    request.assessment = {
      legalGrounds: legalAssessment,
      exceptions: exceptions,
      restrictions: restrictions,
      recommendation: recommendation
    };
    
    if (recommendation === 'reject') {
      return this.rejectErasureRequest(request, exceptions, restrictions);
    }
    
    // Step 7: Verify identity if required
    if (this.requiresVerification(request)) {
      const verification = await this.verifyIdentity(request);
      if (!verification.verified) {
        return this.rejectErasureRequest(request, [], [{
          type: 'verification_failed',
          reason: 'Identity verification failed'
        }]);
      }
    }
    
    // Step 8: Execute erasure
    const erasureResult = await this.executeErasure(request);
    
    // Step 9: Verify erasure completion
    const verification = await this.verifyErasure(erasureResult);
    
    // Step 10: Notify third parties
    await this.notifyThirdParties(request, erasureResult);
    
    // Step 11: Update records
    await this.updateErasureRecords(request, erasureResult);
    
    return {
      requestId: request.id,
      status: 'completed',
      recommendation: recommendation,
      erasure: erasureResult,
      verification: verification,
      notifications: true,
      timestamp: new Date()
    };
  }

  private async assessLegalGrounds(
    request: ErasureRequest
  ): Promise<LegalGround[]> {
    const grounds: LegalGround[] = [];
    
    switch (request.legalBasis) {
      case 'consent_withdrawal':
        // Check if consent was the legal basis for processing
        const consentBasis = await this.checkConsentBasis(request.requester);
        if (consentBasis.based) {
          grounds.push({
            type: 'consent_withdrawal',
            valid: true,
            evidence: consentBasis.evidence
          });
        }
        break;
        
      case 'no_longer_necessary':
        // Check if data is still necessary for original purpose
        const necessityAssessment = await this.assessNecessity(request);
        if (!necessityAssessment.necessary) {
          grounds.push({
            type: 'no_longer_necessary',
            valid: true,
            purpose: necessityAssessment.originalPurpose
          });
        }
        break;
        
      case 'objection':
        // Check if objection was raised based on legitimate interests
        const objectionAssessment = await this.assessObjection(request);
        if (objectionAssessment.valid) {
          grounds.push({
            type: 'objection',
            valid: true,
            interests: objectionAssessment.interests
          });
        }
        break;
        
      case 'unlawful_processing':
        // Check if processing was unlawful
        const lawfulnessAssessment = await this.assessLawfulness(request);
        if (!lawfulnessAssessment.lawful) {
          grounds.push({
            type: 'unlawful_processing',
            valid: true,
            violation: lawfulnessAssessment.violation
          });
        }
        break;
        
      case 'legal_obligation':
        // Check if data must be deleted due to legal obligation
        const legalObligationAssessment = await this.assessLegalObligations(request);
        if (legalObligationAssessment.obligation) {
          grounds.push({
            type: 'legal_obligation',
            valid: true,
            obligation: legalObligationAssessment.obligation
          });
        }
        break;
    }
    
    return grounds;
  }

  private makeErasureRecommendation(
    legalGrounds: LegalGround[],
    exceptions: ErasureException[],
    restrictions: ErasureRestriction[]
  ): 'approve' | 'partial' | 'reject' {
    // Check if any legal ground is valid
    const hasValidGround = legalGrounds.some(ground => ground.valid);
    if (!hasValidGround) {
      return 'reject';
    }
    
    // Check for absolute exceptions (complete rejection)
    const hasAbsoluteException = exceptions.some(exception => 
      exception.type === 'absolute' || exception.severity === 'absolute'
    );
    if (hasAbsoluteException) {
      return 'reject';
    }
    
    // Check for partial exceptions (partial approval)
    const hasPartialException = exceptions.some(exception => 
      exception.type === 'partial' || exception.severity === 'partial'
    );
    if (hasPartialException) {
      return 'partial';
    }
    
    // Check for restrictions
    const hasRestrictions = restrictions.length > 0;
    if (hasRestrictions) {
      return 'partial';
    }
    
    // Default to full approval
    return 'approve';
  }
}
```

#### 4.1.2 POPIA Erasure Compliance

**POPIA Section 57 Implementation**:
```typescript
interface POPIAErasureRequest {
  id: string;
  dataSubject: {
    identification: string;
    contactDetails: string;
    verificationMethod: string;
  };
  request: {
    type: 'destroy' | 'delete';
    personalInformation: {
      categories: string[];
      specificRecords?: string[];
    };
    reason: string;
    supportingEvidence?: string;
  };
  assessment: {
    reasonableRequest: boolean;
    excessiveRequest: boolean;
    legalObligation: LegalObligation[];
    publicInterest: PublicInterest[];
    legitimateInterests: LegitimateInterest[];
    recommendation: 'approve' | 'reject' | 'modify';
  };
  processing: {
    informationOfficerReview: boolean;
    legalReview: boolean;
    technicalAssessment: boolean;
    decision: 'approved' | 'rejected' | 'modified';
    conditions?: string[];
  };
}

class POPIAErasureProcessor {
  async processPOPIAErasure(
    request: POPIAErasureRequest
  ): Promise<POPIAErasureResult> {
    // POPIA Section 57: Right to destroy or delete personal information
    
    // Step 1: Verify data subject identification
    const identification = await this.verifyDataSubjectIdentification(
      request.dataSubject
    );
    if (!identification.verified) {
      return this.rejectPOPIARequest(request, 'Identification verification failed');
    }
    
    // Step 2: Assess if request is reasonable
    const reasonableness = await this.assessRequestReasonableness(request);
    request.assessment.reasonableRequest = reasonableness.reasonable;
    request.assessment.excessiveRequest = reasonableness.excessive;
    
    if (reasonableness.excessive) {
      return this.rejectPOPIARequest(request, 'Request is excessive or unfounded');
    }
    
    // Step 3: Check legal obligations to retain
    const legalObligations = await this.checkPOPIALegalObligations(request);
    request.assessment.legalObligation = legalObligations;
    
    // Step 4: Assess public interest
    const publicInterest = await this.assessPublicInterest(request);
    request.assessment.publicInterest = publicInterest;
    
    // Step 5: Assess legitimate interests
    const legitimateInterests = await this.assessLegitimateInterests(request);
    request.assessment.legitimateInterests = legitimateInterests;
    
    // Step 6: Make recommendation
    const recommendation = this.makePOPIARecommendation(
      request.assessment
    );
    request.assessment.recommendation = recommendation;
    
    // Step 7: Information Officer review
    const informationOfficerReview = await this.conductInformationOfficerReview(
      request
    );
    request.processing.informationOfficerReview = informationOfficerReview.completed;
    
    // Step 8: Decision making
    let decision: 'approved' | 'rejected' | 'modified';
    let conditions: string[] = [];
    
    if (recommendation === 'approve' && informationOfficerReview.approve) {
      decision = 'approved';
    } else if (legalObligations.length > 0 || publicInterest.length > 0) {
      decision = 'rejected';
    } else {
      decision = recommendation;
    }
    
    // Step 9: Execute decision
    let executionResult: ErasureExecutionResult;
    if (decision === 'approved') {
      executionResult = await this.executePOPIAErasure(request);
    } else {
      executionResult = {
        status: 'not_executed',
        reason: `Request ${decision}`,
        timestamp: new Date()
      };
    }
    
    // Step 10: Notify relevant parties
    await this.notifyPOPIADecision(request, decision, executionResult);
    
    // Step 11: Update records
    await this.updatePOPIARecords(request, decision, executionResult);
    
    return {
      requestId: request.id,
      decision: decision,
      conditions: conditions,
      execution: executionResult,
      informationOfficerReview: informationOfficerReview,
      notificationSent: true,
      timestamp: new Date()
    };
  }

  private makePOPIARecommendation(
    assessment: POPIAAssessment
  ): 'approve' | 'reject' | 'modify' {
    // Check if request is excessive
    if (assessment.excessiveRequest) {
      return 'reject';
    }
    
    // Check for absolute legal obligations
    const absoluteObligations = assessment.legalObligation.filter(
      obligation => obligation.type === 'absolute'
    );
    if (absoluteObligations.length > 0) {
      return 'reject';
    }
    
    // Check for absolute public interest
    const absolutePublicInterest = assessment.publicInterest.filter(
      interest => interest.type === 'absolute'
    );
    if (absolutePublicInterest.length > 0) {
      return 'reject';
    }
    
    // Check for conditional obligations
    const conditionalObligations = assessment.legalObligation.filter(
      obligation => obligation.type === 'conditional'
    );
    if (conditionalObligations.length > 0) {
      return 'modify';
    }
    
    // Default to approve
    return 'approve';
  }
}
```

## 5. Portability Procedures

### 5.1 GDPR Article 20 Implementation

#### 5.1.1 Data Portability Framework

**Structured Data Portability**:
```typescript
interface DataPortabilityRequest {
  id: string;
  requester: {
    userId: string;
    email: string;
    tenantId: string;
  };
  scope: {
    type: 'all_data' | 'provided_data' | 'observed_data' | 'inferred_data';
    dataCategories: string[];
    format: 'json' | 'csv' | 'xml' | 'pdf';
    recipient?: {
      type: 'self' | 'third_party';
      details?: string;
    };
  };
  assessment: {
    automatedProcessing: boolean;
    consentBased: boolean;
    contractBased: boolean;
    technicalFeasibility: boolean;
    recommendation: 'approve' | 'partial' | 'reject';
  };
  processing: {
    status: 'pending' | 'processing' | 'completed' | 'delivered';
    startedAt?: Date;
    completedAt?: Date;
    assignedTo?: string;
  };
}

class DataPortabilityService {
  async processPortabilityRequest(
    request: DataPortabilityRequest
  ): Promise<PortabilityResult> {
    // Step 1: Validate request
    await this.validatePortabilityRequest(request);
    
    // Step 2: Assess eligibility
    const eligibility = await this.assessPortabilityEligibility(request);
    request.assessment = eligibility;
    
    if (eligibility.recommendation === 'reject') {
      return this.rejectPortabilityRequest(request, eligibility);
    }
    
    // Step 3: Gather portable data
    const portableData = await this.gatherPortableData(request);
    
    // Step 4: Structure data according to standards
    const structuredData = await this.structurePortableData(
      portableData,
      request.scope.format
    );
    
    // Step 5: Apply data minimization
    const minimizedData = this.applyPortabilityMinimization(
      structuredData,
      request.scope
    );
    
    // Step 6: Create secure delivery
    const delivery = await this.createSecureDelivery(
      minimizedData,
      request.requester,
      request.scope.recipient
    );
    
    // Step 7: Log portability request
    await this.logPortabilityRequest(request, delivery);
    
    return {
      requestId: request.id,
      status: 'completed',
      data: minimizedData,
      delivery: delivery,
      summary: this.generatePortabilitySummary(minimizedData),
      timestamp: new Date()
    };
  }

  private async assessPortabilityEligibility(
    request: DataPortabilityRequest
  ): Promise<PortabilityEligibility> {
    // Check if data was provided by data subject
    const providedData = await this.identifyProvidedData(request.requester);
    
    // Check if processing is automated
    const automatedProcessing = await this.checkAutomatedProcessing(
      request.requester
    );
    
    // Check if processing is based on consent or contract
    const legalBasis = await this.checkLegalBasis(request.requester);
    
    // Check technical feasibility
    const technicalFeasibility = await this.assessTechnicalFeasibility(request);
    
    const recommendation = this.determinePortabilityRecommendation(
      providedData,
      automatedProcessing,
      legalBasis,
      technicalFeasibility
    );
    
    return {
      automatedProcessing: automatedProcessing.processed,
      consentBased: legalBasis.includes('consent'),
      contractBased: legalBasis.includes('contract'),
      technicalFeasibility: technicalFeasibility.feasible,
      recommendation: recommendation,
      dataCategories: providedData.categories,
      excludedData: automatedProcessing.excluded
    };
  }

  private async gatherPortableData(
    request: DataPortabilityRequest
  ): Promise<PortableDataCollection> {
    const dataCollection: PortableDataCollection = {};
    
    if (request.scope.type === 'all_data' || request.scope.dataCategories.includes('profile')) {
      dataCollection.profile = await this.getUserProfile(request.requester);
    }
    
    if (request.scope.type === 'all_data' || request.scope.dataCategories.includes('appointments')) {
      dataCollection.appointments = await this.getUserAppointments(request.requester);
    }
    
    if (request.scope.type === 'all_data' || request.scope.dataCategories.includes('preferences')) {
      dataCollection.preferences = await this.getUserPreferences(request.requester);
    }
    
    if (request.scope.type === 'all_data' || request.scope.dataCategories.includes('communications')) {
      dataCollection.communications = await this.getUserCommunications(request.requester);
    }
    
    // Add metadata about portability
    dataCollection.portability = {
      requestId: request.id,
      exportedAt: new Date(),
      dataController: 'Appointment Booking Platform',
      format: request.scope.format,
      categories: Object.keys(dataCollection).filter(key => key !== 'portability'),
      legalBasis: await this.getPortabilityLegalBasis(request.requester),
      purposes: await this.getPortabilityPurposes(request.requester),
      retention: await this.getPortabilityRetention(request.requester)
    };
    
    return dataCollection;
  }

  private applyPortabilityMinimization(
    data: PortableDataCollection,
    scope: PortabilityScope
  ): PortableDataCollection {
    const minimized = JSON.parse(JSON.stringify(data));
    
    // Remove data not provided by data subject
    this.removeNonProvidedData(minimized);
    
    // Remove inferred or derived data if not requested
    if (scope.type !== 'inferred_data') {
      this.removeInferredData(minimized);
    }
    
    // Remove data not processed automatically
    this.removeNonAutomatedData(minimized);
    
    // Remove other users' personal data
    this.removeOtherUsersData(minimized);
    
    // Remove confidential business information
    this.removeBusinessConfidentialData(minimized);
    
    return minimized;
  }
}
```

#### 5.1.2 Standard Format Export

**Machine-Readable Data Formats**:
```typescript
interface PortableDataFormat {
  json: {
    structure: 'application/json';
    schema: 'json_schema_1.0';
    encoding: 'utf-8';
    compression: 'none' | 'gzip';
  };
  csv: {
    structure: 'text/csv';
    delimiter: ',';
    encoding: 'utf-8';
    headers: boolean;
  };
  xml: {
    structure: 'application/xml';
    schema: 'xml_schema_1.0';
    encoding: 'utf-8';
    namespaces: boolean;
  };
}

class StandardFormatExporter {
  async exportToJSON(
    data: PortableDataCollection,
    options: JSONExportOptions
  ): Promise<string> {
    const exportData = {
      metadata: {
        format: 'json',
        version: '1.0',
        schema: 'https://example.com/portability-schema/v1',
        exportedAt: new Date().toISOString(),
        dataController: data.portability.dataController,
        legalBasis: data.portability.legalBasis,
        purposes: data.portability.purposes
      },
      personalData: {
        profile: data.profile,
        appointments: data.appointments,
        preferences: data.preferences,
        communications: data.communications
      },
      technical: {
        categories: data.portability.categories,
        recordCount: this.calculateRecordCount(data),
        dataSize: this.calculateDataSize(data)
      },
      legal: {
        rights: 'access_rectification_erasure_portability_objection',
        restrictions: 'none',
        retention: data.portability.retention
      }
    };
    
    return JSON.stringify(exportData, null, options.pretty ? 2 : 0);
  }

  async exportToCSV(
    data: PortableDataCollection,
    options: CSVExportOptions
  ): Promise<string> {
    const csvRows: string[] = [];
    
    // Add metadata as first row
    csvRows.push('Category,Field,Value,Description');
    csvRows.push('metadata,format,json,Data format');
    csvRows.push('metadata,version,1.0,Schema version');
    csvRows.push('metadata,exportedAt,' + new Date().toISOString() + ',Export timestamp');
    
    // Add profile data
    if (data.profile) {
      csvRows.push('profile,email,' + data.profile.email + ',User email address');
      csvRows.push('profile,name,' + (data.profile.name || '') + ',User display name');
      csvRows.push('profile,createdAt,' + data.profile.createdAt + ',Account creation date');
    }
    
    // Add appointments data
    if (data.appointments) {
      csvRows.push('appointments,totalCount,' + data.appointments.length + ',Total appointments');
      for (const appointment of data.appointments) {
        csvRows.push(`appointments,appointment_${appointment.id},${appointment.serviceName},Service booked`);
      }
    }
    
    // Add preferences data
    if (data.preferences) {
      csvRows.push('preferences,notifications,' + JSON.stringify(data.preferences.notifications) + ',Notification preferences');
      csvRows.push('preferences,privacy,' + JSON.stringify(data.preferences.privacy) + ',Privacy settings');
    }
    
    return csvRows.join('\n');
  }

  async exportToXML(
    data: PortableDataCollection,
    options: XMLExportOptions
  ): Promise<string> {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const schemaDeclaration = options.includeSchema ? 
      ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
      ' xsi:schemaLocation="https://example.com/portability-schema portability.xsd"' : '';
    
    const xmlBody = `
<PortableData${schemaDeclaration}>
  <Metadata>
    <Format>xml</Format>
    <Version>1.0</Version>
    <ExportedAt>${new Date().toISOString()}</ExportedAt>
>${data.port    <DataControllerability.dataController}</DataController>
    <LegalBasis>${data.portability.legalBasis}</LegalBasis>
    <Purposes>${data.portability.purposes}</Purposes>
  </Metadata>
  <PersonalData>
    ${this.generateProfileXML(data.profile)}
    ${this.generateAppointmentsXML(data.appointments)}
    ${this.generatePreferencesXML(data.preferences)}
    ${this.generateCommunicationsXML(data.communications)}
  </PersonalData>
  <Technical>
    <Categories>${data.portability.categories.join(',')}</Categories>
    <RecordCount>${this.calculateRecordCount(data)}</RecordCount>
    <DataSize>${this.calculateDataSize(data)}</DataSize>
  </Technical>
  <Legal>
    <Rights>access_rectification_erasure_portability_objection</Rights>
    <Restrictions>none</Restrictions>
    <Retention>${data.portability.retention}</Retention>
  </Legal>
</PortableData>`;
    
    return xmlHeader + xmlBody;
  }
}
```

## 6. Objection and Restriction Procedures

### 6.1 GDPR Article 21 Implementation

#### 6.1.1 Right to Object Processing

**Objection Handling Framework**:
```typescript
interface ObjectionRequest {
  id: string;
  requester: {
    userId: string;
    email: string;
    tenantId: string;
  };
  objection: {
    type: 'legitimate_interests' | 'public_task' | 'direct_marketing' | 'scientific_research' | 'historical_research' | 'statistics';
    processingActivity: string;
    grounds: string;
    specific: boolean;
  };
  assessment: {
    compellingLegitimateGrounds: CompellingGround[];
    balancingTest: BalancingTest;
    recommendation: 'uphold' | 'override' | 'partial';
  };
  processing: {
    status: 'pending' | 'assessing' | 'upheld' | 'overridden' | 'partial';
    decision: {
      outcome: 'objection_sustained' | 'objection_overruled' | 'processing_restricted';
      reason: string;
      decisionMaker: string;
      decidedAt: Date;
    };
  };
}

class ObjectionProcessor {
  async processObjection(
    request: ObjectionRequest
  ): Promise<ObjectionResult> {
    // Step 1: Validate objection
    await this.validateObjection(request);
    
    // Step 2: Identify processing activity
    const processingActivity = await this.identifyProcessingActivity(
      request.objection.processingActivity
    );
    
    // Step 3: Assess compelling legitimate grounds
    const compellingGrounds = await this.assessCompellingGrounds(request);
    request.assessment.compellingGrounds = compellingGrounds;
    
    // Step 4: Conduct balancing test
    const balancingTest = await this.conductBalancingTest(
      request,
      processingActivity
    );
    request.assessment.balancingTest = balancingTest;
    
    // Step 5: Make recommendation
    const recommendation = this.makeObjectionRecommendation(
      compellingGrounds,
      balancingTest
    );
    request.assessment.recommendation = recommendation;
    
    // Step 6: Make decision
    const decision = await this.makeObjectionDecision(request, recommendation);
    
    // Step 7: Implement decision
    const implementation = await this.implementObjectionDecision(
      request,
      decision
    );
    
    // Step 8: Notify requester
    await this.notifyObjectionDecision(request, decision, implementation);
    
    // Step 9: Update records
    await this.updateObjectionRecords(request, decision, implementation);
    
    return {
      requestId: request.id,
      status: 'completed',
      decision: decision,
      implementation: implementation,
      notificationSent: true,
      timestamp: new Date()
    };
  }

  private async conductBalancingTest(
    request: ObjectionRequest,
    processingActivity: ProcessingActivity
  ): Promise<BalancingTest> {
    const ourInterests = {
      businessNeed: processingActivity.businessNeed,

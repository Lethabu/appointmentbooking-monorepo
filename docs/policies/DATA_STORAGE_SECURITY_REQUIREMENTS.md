# Data Storage & Security Requirements

## Executive Summary

This document establishes comprehensive data storage and security requirements for our appointment booking platform deployed on Cloudflare infrastructure. These requirements ensure protection of personal data in accordance with GDPR, POPIA, and industry security standards while maintaining operational efficiency.

**Effective Date**: January 1, 2026  
**Version**: 1.0.0  
**Next Review**: March 24, 2026  
**Owner**: Chief Security Officer  
**Approved By**: Chief Executive Officer

## 1. Cloudflare Infrastructure Security

### 1.1 Cloudflare D1 Database Security

#### 1.1.1 Encryption Requirements

**Encryption at Rest**:

```sql
-- Cloudflare D1 provides built-in encryption
-- Additional application-level encryption for sensitive fields

-- Example: Encrypting OAuth tokens
CREATE TABLE user_oauth_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    tenant_id TEXT NOT NULL REFERENCES tenants(id),
    provider TEXT NOT NULL, -- 'google', 'microsoft', etc.
    encrypted_access_token TEXT NOT NULL,
    encrypted_refresh_token TEXT,
    token_expires_at INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
);

-- Index for efficient queries (encrypted data cannot be indexed directly)
CREATE INDEX user_oauth_tokens_user_tenant_idx ON user_oauth_tokens(user_id, tenant_id);
```

**Encryption Implementation**:

```typescript
// Cloudflare Worker encryption utilities
import { subtle } from 'crypto';

interface EncryptionConfig {
  algorithm: 'AES-GCM';
  keyLength: 256;
  ivLength: 12;
  tagLength: 128;
}

class DataEncryption {
  private config: EncryptionConfig = {
    algorithm: 'AES-GCM',
    keyLength: 256,
    ivLength: 12,
    tagLength: 128
  };

  async encrypt(plaintext: string, tenantId: string): Promise<string> {
    // Generate tenant-specific encryption key
    const key = await this.getTenantEncryptionKey(tenantId);
    
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(this.config.ivLength));
    
    // Encrypt data
    const encrypted = await subtle.encrypt(
      {
        name: this.config.algorithm,
        iv: iv,
        tagLength: this.config.tagLength
      },
      key,
      new TextEncoder().encode(plaintext)
    );
    
    // Combine IV + encrypted data + auth tag
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return this.base64Encode(combined);
  }

  async decrypt(encryptedData: string, tenantId: string): Promise<string> {
    const key = await this.getTenantEncryptionKey(tenantId);
    const combined = this.base64Decode(encryptedData);
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, this.config.ivLength);
    const encrypted = combined.slice(this.config.ivLength);
    
    // Decrypt data
    const decrypted = await subtle.decrypt(
      {
        name: this.config.algorithm,
        iv: iv,
        tagLength: this.config.tagLength
      },
      key,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  }

  private async getTenantEncryptionKey(tenantId: string): Promise<CryptoKey> {
    // Derive tenant-specific key from master key
    const masterKey = await subtle.importKey(
      'raw',
      new TextEncoder().encode(process.env.MASTER_ENCRYPTION_KEY),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    return await subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode(`tenant-${tenantId}`),
        iterations: 100000,
        hash: 'SHA-256'
      },
      masterKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
}
```

#### 1.1.2 Access Controls and Authentication

**Multi-Tenant Isolation**:

```typescript
// Tenant isolation in database queries
interface DatabaseContext {
  userId: string;
  tenantId: string;
  permissions: string[];
  sessionId: string;
}

class SecureDatabase {
  async query(
    query: string, 
    params: any[], 
    context: DatabaseContext
  ): Promise<any> {
    // Verify tenant access
    await this.verifyTenantAccess(context.tenantId, context.userId);
    
    // Add tenant isolation to query
    const isolatedQuery = this.addTenantIsolation(query, context.tenantId);
    
    // Execute with audit logging
    const result = await this.executeWithLogging(
      isolatedQuery, 
      params, 
      context
    );
    
    return result;
  }

  private addTenantIsolation(query: string, tenantId: string): string {
    // Ensure all queries include tenant isolation
    if (query.toLowerCase().includes('from') && 
        !query.toLowerCase().includes('tenant_id')) {
      // Add tenant filtering where appropriate
      // This is a simplified example - implement proper SQL parsing
      return query.replace(
        /FROM (\w+)/i, 
        `FROM $1 WHERE tenant_id = '${tenantId}'`
      );
    }
    return query;
  }
}
```

#### 1.1.3 Database Backup and Recovery

**Automated Backup Strategy**:

```typescript
interface BackupConfiguration {
  frequency: 'daily' | 'weekly' | 'monthly';
  retention: {
    daily: number;    // Keep daily backups for N days
    weekly: number;   // Keep weekly backups for N weeks
    monthly: number;  // Keep monthly backups for N months
  };
  encryption: {
    enabled: boolean;
    algorithm: string;
    keyManagement: string;
  };
  testing: {
    restoreTesting: boolean;
    frequency: string;
    validation: string[];
  };
}

const backupConfig: BackupConfiguration = {
  frequency: 'daily',
  retention: {
    daily: 7,
    weekly: 4,
    monthly: 12
  },
  encryption: {
    enabled: true,
    algorithm: 'AES-256-GCM',
    keyManagement: 'HSM'
  },
  testing: {
    restoreTesting: true,
    frequency: 'monthly',
    validation: ['integrity_check', 'data_validation', 'access_test']
  }
};

// Cloudflare D1 backup implementation
class DatabaseBackup {
  async createBackup(tenantId: string): Promise<BackupResult> {
    const timestamp = new Date().toISOString();
    const backupId = `backup-${tenantId}-${timestamp}`;
    
    // Export database with encryption
    const backupData = await this.exportDatabase(tenantId);
    const encryptedBackup = await this.encryptBackup(backupData, tenantId);
    
    // Store backup securely
    const storageResult = await this.storeBackup(backupId, encryptedBackup);
    
    // Verify backup integrity
    const integrityResult = await this.verifyBackupIntegrity(backupId);
    
    return {
      backupId,
      timestamp: new Date(),
      size: storageResult.size,
      encrypted: true,
      integrityHash: integrityResult.hash,
      status: 'completed'
    };
  }
}
```

### 1.2 Cloudflare R2 Storage Security

#### 1.2.1 Object-Level Security

**Bucket Configuration**:

```hcl
# R2 bucket with security policies
resource "cloudflare_r2_bucket" "user_data" {
  name = "user-data-${var.environment}"
  
  # Access control
  versioning {
    enabled = true
  }
  
  # Lifecycle policies
  lifecycle_rule {
    id     = "delete_old_versions"
    status = "Enabled"
    
    noncurrent_version_expiration {
      days = 90
    }
  }
  
  # CORS configuration
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT", "DELETE"]
    allowed_origins = var.allowed_origins
    expose_headers  = ["ETag", "x-amz-meta-custom-header"]
    max_age_seconds = 3600
  }
}

# Access policy
resource "cloudflare_r2_bucket_policy" "user_data_policy" {
  bucket_id     = cloudflare_r2_bucket.user_data.id
  policy        = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = ["arn:aws:iam::cloudflare:user/worker"]
        }
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::user-data-${var.environment}/*"
        ]
        Condition = {
          StringEquals = {
            "s3:x-amz-server-side-encryption" = "AES256"
          }
        }
      }
    ]
  })
}
```

**File Encryption and Access Control**:

```typescript
// R2 file security implementation
interface FileSecurityConfig {
  encryption: {
    algorithm: 'AES-256-GCM';
    keyManagement: 'tenant_specific';
  };
  access: {
    authentication: boolean;
    authorization: boolean;
    timeLimit: number;
  };
  privacy: {
    anonymousAccess: boolean;
    signedUrls: boolean;
    downloadLimit: number;
  };
}

class SecureFileStorage {
  async uploadFile(
    file: File, 
    userId: string, 
    tenantId: string,
    metadata: FileMetadata
  ): Promise<UploadResult> {
    // Validate file security
    await this.validateFileSecurity(file, metadata);
    
    // Generate tenant-specific encryption key
    const encryptionKey = await this.getTenantEncryptionKey(tenantId);
    
    // Encrypt file content
    const encryptedContent = await this.encryptFile(file, encryptionKey);
    
    // Generate secure filename
    const secureFilename = this.generateSecureFilename(file.name, tenantId);
    
    // Upload with metadata
    const result = await this.r2.putObject({
      Bucket: `user-data-${process.env.ENVIRONMENT}`,
      Key: `${tenantId}/${userId}/${secureFilename}`,
      Body: encryptedContent,
      ContentType: file.type,
      ServerSideEncryption: 'AES256',
      Metadata: {
        originalName: file.name,
        userId: userId,
        tenantId: tenantId,
        uploadedAt: new Date().toISOString(),
        contentHash: await this.generateContentHash(file)
      }
    });
    
    // Audit log upload
    await this.auditFileUpload({
      userId,
      tenantId,
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadId: result.key
    });
    
    return {
      success: true,
      fileId: result.key,
      url: await this.generateSignedUrl(result.key),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
  }
}
```

### 1.3 Cloudflare KV Security

#### 1.3.1 Key-Value Store Security

**KV Namespace Configuration**:

```hcl
# Secure KV namespace for session and configuration data
resource "cloudflare_workers_kv_namespace" "secure_data" {
  title = "secure-data-${var.environment}"
  
  # KV namespaces support encryption at rest automatically
}

# Access policy for KV namespace
resource "cloudflare_workers_kv" "secure_data" {
  namespace_id = cloudflare_workers_kv_namespace.secure_data.id
  
  # Data is automatically encrypted at rest by Cloudflare
  # Additional application-level encryption for sensitive data
}
```

**Secure KV Operations**:

```typescript
// Secure KV implementation
interface KVSecurityConfig {
  encryption: {
    applicationLevel: boolean;
    algorithm: string;
    keyDerivation: string;
  };
  access: {
    authenticationRequired: boolean;
    tenantIsolation: boolean;
    auditLogging: boolean;
  };
  limits: {
    maxValueSize: number;
    maxKeysPerRequest: number;
    rateLimitPerMinute: number;
  };
}

class SecureKV {
  constructor(
    private kv: KVNamespace,
    private encryption: DataEncryption
  ) {}

  async setSecure(
    key: string, 
    value: any, 
    tenantId: string,
    metadata?: KVMetadata
  ): Promise<void> {
    // Validate key and value
    this.validateKey(key);
    this.validateValue(value);
    
    // Encrypt value if it contains sensitive data
    const sensitiveData = this.detectSensitiveData(value);
    const processedValue = sensitiveData 
      ? await this.encryption.encrypt(JSON.stringify(value), tenantId)
      : JSON.stringify(value);
    
    // Add tenant context to metadata
    const enhancedMetadata = {
      ...metadata,
      tenantId: tenantId,
      encrypted: sensitiveData,
      createdAt: new Date().toISOString(),
      version: '1.0'
    };
    
    // Store with TTL if specified
    const options: any = {
      metadata: enhancedMetadata
    };
    
    if (metadata?.ttl) {
      options.expirationTtl = metadata.ttl;
    }
    
    await this.kv.put(key, processedValue, options);
    
    // Audit log
    await this.auditKVOperation('set', key, tenantId, metadata);
  }

  async getSecure(
    key: string, 
    tenantId: string
  ): Promise<any> {
    // Get value from KV
    const result = await this.kv.get(key, { type: 'text' });
    if (!result) {
      return null;
    }
    
    const { value, metadata } = JSON.parse(result);
    
    // Verify tenant access
    if (metadata.tenantId !== tenantId) {
      throw new Error('Tenant access denied');
    }
    
    // Decrypt if necessary
    if (metadata.encrypted) {
      const decryptedValue = await this.encryption.decrypt(value, tenantId);
      return JSON.parse(decryptedValue);
    }
    
    return value;
  }

  private validateKey(key: string): void {
    if (!key || typeof key !== 'string') {
      throw new Error('Invalid key');
    }
    
    // Key validation rules
    if (key.length > 512) {
      throw new Error('Key too long');
    }
    
    if (!/^[a-zA-Z0-9:_-]+$/.test(key)) {
      throw new Error('Invalid key characters');
    }
  }

  private validateValue(value: any): void {
    if (value === null || value === undefined) {
      throw new Error('Invalid value');
    }
    
    const jsonString = JSON.stringify(value);
    if (jsonString.length > 25 * 1024 * 1024) { // 25MB limit
      throw new Error('Value too large');
    }
  }
}
```

## 2. Access Control Framework

### 2.1 Authentication Requirements

#### 2.1.1 Multi-Factor Authentication (MFA)

**MFA Implementation**:

```typescript
interface MFAConfig {
  methods: {
    totp: {
      enabled: boolean;
      issuer: string;
      period: number; // 30 seconds
      digits: number; // 6 digits
    };
    email: {
      enabled: boolean;
      codeLength: number;
      expiryMinutes: number;
    };
    sms: {
      enabled: boolean;
      provider: string;
      codeLength: number;
      expiryMinutes: number;
    };
    backupCodes: {
      enabled: boolean;
      count: number;
      length: number;
    };
  };
  enforcement: {
    adminUsers: boolean;
    regularUsers: boolean;
    highRiskOperations: boolean;
  };
}

const mfaConfig: MFAConfig = {
  methods: {
    totp: {
      enabled: true,
      issuer: 'Appointment Booking Platform',
      period: 30,
      digits: 6
    },
    email: {
      enabled: true,
      codeLength: 6,
      expiryMinutes: 10
    },
    sms: {
      enabled: false, // Optional, privacy consideration
      provider: 'twilio',
      codeLength: 6,
      expiryMinutes: 10
    },
    backupCodes: {
      enabled: true,
      count: 10,
      length: 8
    }
  },
  enforcement: {
    adminUsers: true,
    regularUsers: false,
    highRiskOperations: true
  }
};

class MFAManager {
  async setupTOTP(userId: string, tenantId: string): Promise<MFASetupResult> {
    // Generate secret
    const secret = await this.generateTOTPSecret();
    
    // Generate QR code
    const qrCode = await this.generateQRCode(secret, userId);
    
    // Store secret securely (encrypted)
    await this.storeTOTPSecret(userId, tenantId, secret);
    
    return {
      secret: secret,
      qrCode: qrCode,
      backupCodes: await this.generateBackupCodes(userId)
    };
  }

  async verifyTOTP(userId: string, tenantId: string, token: string): Promise<boolean> {
    const secret = await this.getTOTPSecret(userId, tenantId);
    if (!secret) {
      return false;
    }
    
    // Validate token (considering time drift)
    const isValid = await this.validateTOTPToken(secret, token);
    
    // Log verification attempt
    await this.logMFAVerification(userId, 'totp', isValid);
    
    return isValid;
  }
}
```

#### 2.1.2 Session Management

**Secure Session Handling**:

```typescript
interface SessionConfig {
  duration: {
    inactive: number;      // 30 minutes
    absolute: number;      // 8 hours
    rememberMe: number;    // 30 days
  };
  security: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    encryption: boolean;
  };
  concurrent: {
    maxSessions: number;
    deviceTracking: boolean;
    ipValidation: boolean;
  };
}

class SecureSessionManager {
  async createSession(
    userId: string, 
    tenantId: string, 
    options: SessionOptions
  ): Promise<Session> {
    // Generate secure session ID
    const sessionId = await this.generateSecureSessionId();
    
    // Create session with security attributes
    const session: Session = {
      id: sessionId,
      userId: userId,
      tenantId: tenantId,
      createdAt: new Date(),
      lastActivity: new Date(),
      expiresAt: this.calculateExpiry(options),
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      deviceFingerprint: await this.generateDeviceFingerprint(options),
      isActive: true
    };
    
    // Store session securely
    await this.storeSession(session);
    
    // Set secure cookie
    await this.setSecureCookie(sessionId, options);
    
    // Audit session creation
    await this.auditSessionCreation(session);
    
    return session;
  }

  async validateSession(sessionId: string, context: RequestContext): Promise<SessionValidation> {
    // Retrieve session
    const session = await this.getSession(sessionId);
    if (!session) {
      return { valid: false, reason: 'session_not_found' };
    }
    
    // Check expiration
    if (session.expiresAt < new Date()) {
      await this.invalidateSession(sessionId);
      return { valid: false, reason: 'session_expired' };
    }
    
    // Validate device fingerprint
    if (session.deviceFingerprint !== await this.generateDeviceFingerprint(context)) {
      await this.invalidateSession(sessionId);
      await this.auditSessionAnomaly(sessionId, 'device_mismatch');
      return { valid: false, reason: 'device_mismatch' };
    }
    
    // Update activity
    await this.updateSessionActivity(sessionId);
    
    return { 
      valid: true, 
      session: session,
      warnings: await this.checkSessionWarnings(session)
    };
  }
}
```

### 2.2 Authorization Framework

#### 2.2.1 Role-Based Access Control (RBAC)

**Enhanced RBAC Implementation**:

```typescript
interface RBACConfig {
  roles: {
    [key: string]: {
      permissions: string[];
      resourceAccess: string[];
      dataAccess: string[];
      timeRestrictions?: string[];
      ipRestrictions?: string[];
    };
  };
  permissions: {
    [key: string]: {
      description: string;
      resource: string;
      actions: string[];
      conditions?: string[];
    };
  };
  separation: {
    duties: boolean;
    leastPrivilege: boolean;
    needToKnow: boolean;
  };
}

const rbacConfig: RBACConfig = {
  roles: {
    administrator: {
      permissions: ['*'],
      resourceAccess: ['all'],
      dataAccess: ['all'],
      timeRestrictions: ['business_hours'],
      ipRestrictions: ['office_ips']
    },
    staff: {
      permissions: [
        'appointment:create',
        'appointment:read',
        'appointment:update',
        'appointment:delete',
        'user:read',
        'service:read',
        'dashboard:view'
      ],
      resourceAccess: ['appointments', 'users', 'services'],
      dataAccess: ['tenant_data']
    },
    customer: {
      permissions: [
        'appointment:create',
        'appointment:read',
        'user:update_own',
        'service:read'
      ],
      resourceAccess: ['own_appointments', 'own_profile'],
      dataAccess: ['own_data']
    }
  },
  permissions: {
    'appointment:create': {
      description: 'Create new appointments',
      resource: 'appointments',
      actions: ['create'],
      conditions: ['tenant_isolation', 'schedule_validation']
    },
    'user:read': {
      description: 'Read user information',
      resource: 'users',
      actions: ['read'],
      conditions: ['tenant_isolation', 'data_minimization']
    }
  },
  separation: {
    duties: true,
    leastPrivilege: true,
    needToKnow: true
  }
};

class SecureRBAC {
  async checkPermission(
    userId: string,
    tenantId: string,
    permission: string,
    resource?: string,
    context?: PermissionContext
  ): Promise<boolean> {
    // Get user roles
    const userRoles = await this.getUserRoles(userId, tenantId);
    
    // Check each role
    for (const role of userRoles) {
      if (await this.hasRolePermission(role, permission, context)) {
        // Additional validation
        if (await this.validatePermissionContext(permission, context)) {
          return true;
        }
      }
    }
    
    // Log access attempt
    await this.logAccessAttempt(userId, tenantId, permission, false);
    
    return false;
  }

  private async hasRolePermission(
    role: string, 
    permission: string, 
    context?: PermissionContext
  ): Promise<boolean> {
    const roleConfig = rbacConfig.roles[role];
    if (!roleConfig) {
      return false;
    }
    
    // Check wildcard permission
    if (roleConfig.permissions.includes('*')) {
      return true;
    }
    
    // Check specific permission
    if (!roleConfig.permissions.includes(permission)) {
      return false;
    }
    
    // Check contextual conditions
    if (context) {
      return await this.validateContextualConditions(roleConfig, context);
    }
    
    return true;
  }
}
```

#### 2.2.2 Attribute-Based Access Control (ABAC)

**ABAC Implementation**:

```typescript
interface ABACPolicy {
  effect: 'permit' | 'deny';
  conditions: {
    subject: { [key: string]: any };
    resource: { [key: string]: any };
    action: { [key: string]: any };
    environment: { [key: string]: any };
  };
  obligations: string[];
  advice: string[];
}

class ABACEngine {
  async evaluateAccess(
    subject: Subject,
    resource: Resource,
    action: Action,
    environment: Environment
  ): Promise<AccessDecision> {
    const policies = await this.getApplicablePolicies(subject, resource, action);
    const decision = this.combineDecisions(policies);
    
    // Log access decision
    await this.logAccessDecision(subject, resource, action, decision);
    
    return decision;
  }

  private combineDecisions(policies: ABACPolicy[]): AccessDecision {
    // Deny overrides permit
    const hasDeny = policies.some(p => p.effect === 'deny');
    if (hasDeny) {
      return { effect: 'deny', reason: 'deny_policy_applies' };
    }
    
    const hasPermit = policies.some(p => p.effect === 'permit');
    if (hasPermit) {
      return { effect: 'permit', reason: 'permit_policy_applies' };
    }
    
    return { effect: 'deny', reason: 'no_applicable_policy' };
  }

  private async getApplicablePolicies(
    subject: Subject,
    resource: Resource,
    action: Action
  ): Promise<ABACPolicy[]> {
    // Evaluate policies based on subject, resource, action, and environment
    const policies = await this.loadPolicies();
    
    return policies.filter(policy => 
      this.evaluateConditions(policy.conditions, subject, resource, action, {})
    );
  }
}
```

## 3. Data Encryption Standards

### 3.1 Encryption Algorithms

#### 3.1.1 Required Algorithms

**Encryption Standard Matrix**:

```typescript
interface EncryptionStandard {
  dataType: string;
  algorithm: string;
  keyLength: number;
  mode: string;
  purpose: 'at_rest' | 'in_transit' | 'processing';
  compliance: string[];
}

const encryptionStandards: EncryptionStandard[] = [
  {
    dataType: 'oauth_tokens',
    algorithm: 'AES',
    keyLength: 256,
    mode: 'GCM',
    purpose: 'at_rest',
    compliance: ['GDPR', 'POPIA', 'FIPS-140-2']
  },
  {
    dataType: 'payment_references',
    algorithm: 'AES',
    keyLength: 256,
    mode: 'GCM',
    purpose: 'at_rest',
    compliance: ['PCI-DSS', 'GDPR', 'POPIA']
  },
  {
    dataType: 'personal_data',
    algorithm: 'AES',
    keyLength: 256,
    mode: 'GCM',
    purpose: 'at_rest',
    compliance: ['GDPR', 'POPIA']
  },
  {
    dataType: 'api_communication',
    algorithm: 'TLS',
    keyLength: 256,
    mode: '1.3',
    purpose: 'in_transit',
    compliance: ['GDPR', 'POPIA', 'NIST']
  },
  {
    dataType: 'session_data',
    algorithm: 'AES',
    keyLength: 256,
    mode: 'GCM',
    purpose: 'processing',
    compliance: ['GDPR', 'POPIA']
  }
];
```

#### 3.1.2 Key Management

**Key Management System**:

```typescript
interface KeyManagementConfig {
  generation: {
    algorithm: string;
    entropy: 'hardware' | 'software';
    randomness: 'crypto_random' | 'system_random';
  };
  storage: {
    location: 'hsm' | 'software' | 'cloud_kms';
    backup: boolean;
    redundancy: number;
  };
  rotation: {
    automatic: boolean;
    frequency: string;
    overlap: number; // days
  };
  access: {
    authentication: string[];
    authorization: string;
    audit: boolean;
  };
}

class KeyManagementSystem {
  async generateKey(
    tenantId: string,
    keyType: string,
    options: KeyGenerationOptions
  ): Promise<GeneratedKey> {
    // Generate cryptographically secure key
    const keyMaterial = await this.generateKeyMaterial(options);
    
    // Store key securely
    const keyId = await this.storeKey(keyMaterial, tenantId, keyType);
    
    // Set up rotation if enabled
    if (options.rotationEnabled) {
      await this.scheduleKeyRotation(keyId, options.rotationFrequency);
    }
    
    // Audit key generation
    await this.auditKeyGeneration(keyId, tenantId, keyType);
    
    return {
      keyId: keyId,
      algorithm: options.algorithm,
      keyLength: options.keyLength,
      createdAt: new Date(),
      tenantId: tenantId,
      status: 'active'
    };
  }

  async rotateKey(keyId: string): Promise<RotationResult> {
    // Get current key
    const currentKey = await this.getKey(keyId);
    
    // Generate new key
    const newKey = await this.generateKey(
      currentKey.tenantId,
      currentKey.type,
      currentKey.options
    );
    
    // Re-encrypt data with new key
    const reencryptionResult = await this.reencryptData(keyId, newKey.keyId);
    
    // Revoke old key
    await this.revokeKey(keyId);
    
    // Update key references
    await this.updateKeyReferences(keyId, newKey.keyId);
    
    return {
      oldKeyId: keyId,
      newKeyId: newKey.keyId,
      reencryptedItems: reencryptionResult.items,
      status: 'completed'
    };
  }
}
```

### 3.2 Transport Security

#### 3.2.1 TLS Configuration

**TLS Security Configuration**:

```typescript
interface TLSConfig {
  version: {
    minimum: '1.2';
    preferred: '1.3';
  };
  cipherSuites: {
    tls13: string[];
    tls12: string[];
    disabled: string[];
  };
  certificate: {
    type: 'letsencrypt' | 'custom' | 'cloudflare';
    validation: 'DV' | 'OV' | 'EV';
    keyAlgorithm: 'RSA' | 'ECDSA';
    keyLength: number;
  };
  hsts: {
    enabled: boolean;
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
}

const tlsConfig: TLSConfig = {
  version: {
    minimum: '1.2',
    preferred: '1.3'
  },
  cipherSuites: {
    tls13: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256',
      'TLS_AES_128_GCM_SHA256'
    ],
    tls12: [
      'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
      'TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305',
      'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256'
    ],
    disabled: [
      'TLS_RSA_WITH_AES_256_CBC_SHA',
      'TLS_RSA_WITH_AES_128_CBC_SHA',
      'TLS_RSA_WITH_3DES_EDE_CBC_SHA'
    ]
  },
  certificate: {
    type: 'cloudflare',
    validation: 'DV',
    keyAlgorithm: 'ECDSA',
    keyLength: 256
  },
  hsts: {
    enabled: true,
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
};
```

#### 3.2.2 API Security

**Secure API Implementation**:

```typescript
interface APISecurityConfig {
  authentication: {
    required: boolean;
    methods: string[];
    tokenFormat: string;
    tokenExpiry: number;
  };
  authorization: {
    required: boolean;
    scopeValidation: boolean;
    rateLimit: boolean;
  };
  inputValidation: {
    required: boolean;
    schemaValidation: boolean;
    sanitization: boolean;
  };
  outputValidation: {
    required: boolean;
    contentType: string;
    encoding: string;
  };
}

class SecureAPIGateway {
  async handleRequest(
    request: Request,
    context: APIContext
  ): Promise<Response> {
    // 1. Authentication
    const auth = await this.authenticateRequest(request, context);
    if (!auth.valid) {
      return this.createUnauthorizedResponse(auth.reason);
    }
    
    // 2. Authorization
    const permission = await this.checkPermission(auth.user, request, context);
    if (!permission.granted) {
      return this.createForbiddenResponse(permission.reason);
    }
    
    // 3. Input Validation
    const validation = await this.validateInput(request, context);
    if (!validation.valid) {
      return this.createBadRequestResponse(validation.errors);
    }
    
    // 4. Rate Limiting
    const rateLimit = await this.checkRateLimit(auth.user, request, context);
    if (!rateLimit.allowed) {
      return this.createTooManyRequestsResponse(rateLimit.retryAfter);
    }
    
    // 5. Process Request
    const result = await this.processRequest(request, context, auth);
    
    // 6. Output Validation
    const output = await this.validateOutput(result, context);
    
    // 7. Audit
    await this.auditRequest(auth.user, request, result, context);
    
    return this.createResponse(output, context);
  }
}
```

## 4. Data Residency and Location Policies

### 4.1 Geographic Data Placement

#### 4.1.1 Cloudflare Regional Configuration

**Regional Deployment Strategy**:

```typescript
interface RegionalConfig {
  primary: {
    region: 'eu-west' | 'us-east' | 'ap-southeast';
    dataCenter: string;
    backupRegion: string;
    latency: number;
  };
  compliance: {
    gdpr: 'eu-west';
    popia: 'eu-west' | 'us-east';
    ccpa: 'us-east';
  };
  performance: {
    cdn: boolean;
    edgeComputing: boolean;
    cacheStrategy: string;
  };
}

const regionalConfig: RegionalConfig = {
  primary: {
    region: 'eu-west',
    dataCenter: 'cloudflare-eu-west',
    backupRegion: 'eu-central',
    latency: 50 // milliseconds
  },
  compliance: {
    gdpr: 'eu-west',
    popia: 'eu-west',
    ccpa: 'us-east'
  },
  performance: {
    cdn: true,
    edgeComputing: true,
    cacheStrategy: 'intelligent'
  }
};
```

#### 4.1.2 Data Location Tracking

**Data Location Monitoring**:

```typescript
interface DataLocationTracking {
  [dataType: string]: {
    current: string;
    backup: string[];
    archival: string[];
    inTransit: string[];
    lastUpdated: Date;
  };
}

class DataLocationTracker {
  async trackDataLocation(
    dataId: string,
    dataType: string,
    operation: 'create' | 'read' | 'update' | 'delete' | 'backup' | 'restore'
  ): Promise<void> {
    const location = {
      dataId,
      dataType,
      operation,
      timestamp: new Date(),
      location: await this.getCurrentLocation(dataId),
      metadata: await this.getOperationMetadata(operation)
    };
    
    // Store location tracking record
    await this.storeLocationRecord(location);
    
    // Update data inventory
    await this.updateDataInventory(dataId, location);
    
    // Check compliance with location policies
    await this.validateLocationCompliance(location);
  }
}
```

### 4.2 Cross-Border Transfer Controls

#### 4.2.1 Transfer Authorization

**Transfer Authorization Framework**:

```typescript
interface TransferAuthorization {
  dataType: string;
  destination: string;
  purpose: string;
  legalBasis: string;
  safeguards: string[];
  approval: {
    status: 'pending' | 'approved' | 'denied';
    approvedBy: string;
    approvedAt: Date;
    conditions: string[];
  };
}

class TransferAuthorizationManager {
  async requestTransfer(
    dataId: string,
    destination: string,
    purpose: string,
    requestor: string
  ): Promise<TransferRequest> {
    // Check if transfer is allowed
    const allowed = await this.checkTransferAllowance(dataId, destination);
    if (!allowed.allowed) {
      throw new Error(`Transfer not allowed: ${allowed.reason}`);
    }
    
    // Assess transfer risks
    const riskAssessment = await this.assessTransferRisks(dataId, destination);
    
    // Apply safeguards
    const safeguards = await this.applyTransferSafeguards(dataId, destination);
    
    // Create transfer request
    const request: TransferRequest = {
      id: await this.generateTransferId(),
      dataId,
      destination,
      purpose,
      requestor,
      riskAssessment,
      safeguards,
      status: 'pending',
      createdAt: new Date()
    };
    
    // Store request
    await this.storeTransferRequest(request);
    
    // Notify approvers
    await this.notifyTransferApprovers(request);
    
    return request;
  }
}
```

## 5. Third-Party Data Sharing

### 5.1 Processor Agreements

#### 5.1.1 Data Processing Agreements (DPA)

**DPA Framework**:

```typescript
interface DPAFramework {
  template: {
    version: string;
    legalBasis: string[];
    standardClauses: boolean;
    additionalClauses: string[];
  };
  requirements: {
    security: string[];
    subProcessing: string[];
    dataSubjectRights: string[];
    breachNotification: string[];
  };
  monitoring: {
    auditRights: boolean;
    reviewFrequency: string;
    complianceChecks: string[];
  };
}

const dpaFramework: DPAFramework = {
  template: {
    version: '2021.0',
    legalBasis: ['GDPR', 'POPIA'],
    standardClauses: true,
    additionalClauses: [
      'cloudflare_specific',
      'multi_tenant_isolation',
      'zero_trust_security'
    ]
  },
  requirements: {
    security: [
      'encryption_at_rest',
      'encryption_in_transit',
      'access_controls',
      'audit_logging',
      'incident_response'
    ],
    subProcessing: [
      'notification_requirement',
      'approval_rights',
      'liability_transfer',
      'compliance_transfer'
    ],
    dataSubjectRights: [
      'access_cooperation',
      'rectification_support',
      'deletion_assistance',
      'portability_export'
    ],
    breachNotification: [
      'immediate_notification',
      'detailed_reporting',
      'cooperation_requirement',
      'remediation_support'
    ]
  },
  monitoring: {
    auditRights: true,
    reviewFrequency: 'annually',
    complianceChecks: [
      'security_assessment',
      'compliance_verification',
      'risk_evaluation'
    ]
  }
};

class DPAManager {
  async createDPA(
    processor: string,
    dataTypes: string[],
    purposes: string[]
  ): Promise<DPA> {
    // Generate DPA based on framework
    const dpa = await this.generateDPA(processor, dataTypes, purposes);
    
    // Customize clauses for processor
    const customizedDPA = await this.customizeDPA(dpa, processor);
    
    // Legal review
    const legalReview = await this.requestLegalReview(customizedDPA);
    
    // Execute DPA
    if (legalReview.approved) {
      const executedDPA = await this.executeDPA(customizedDPA);
      return executedDPA;
    } else {
      throw new Error(`DPA rejected: ${legalReview.reason}`);
    }
  }
}
```

#### 5.1.2 Cloudflare as Processor

**Cloudflare DPA Specifics**:

```typescript
interface CloudflareDPA {
  services: {
    cdn: boolean;
    dns: boolean;
    security: boolean;
    workers: boolean;
    storage: boolean;
    databases: boolean;
  };
  dataProcessing: {
    contentDelivery: boolean;
    securityFiltering: boolean;
    performanceOptimization: boolean;
    analyticsProcessing: boolean;
  };
  safeguards: {
    encryption: boolean;
    isolation: boolean;
    accessControls: boolean;
    auditLogging: boolean;
  };
  dataLocation: {
    primary: string[];
    backup: string[];
    processing: string[];
  };
}

const cloudflareDPA: CloudflareDPA = {
  services: {
    cdn: true,
    dns: true,
    security: true,
    workers: true,
    storage: true,
    databases: true
  },
  dataProcessing: {
    contentDelivery: true,
    securityFiltering: true,
    performanceOptimization: true,
    analyticsProcessing: true
  },
  safeguards: {
    encryption: true,
    isolation: true,
    accessControls: true,
    auditLogging: true
  },
  dataLocation: {
    primary: ['eu-west', 'eu-central'],
    backup: ['us-east', 'ap-southeast'],
    processing: ['eu-west', 'eu-central', 'us-east']
  }
};
```

### 5.2 Vendor Security Assessment

#### 5.2.1 Security Assessment Framework

**Vendor Security Evaluation**:

```typescript
interface VendorSecurityAssessment {
  vendor: string;
  assessment: {
    security: {
      certifications: string[];
      compliance: string[];
      policies: string[];
      procedures: string[];
    };
    technical: {
      encryption: string;
      accessControls: string;
      monitoring: string;
      incidentResponse: string;
    };
    operational: {
      staffTraining: string;
      backgroundChecks: string;
      physicalSecurity: string;
      businessContinuity: string;
    };
  };
  riskLevel: 'low' | 'medium' | 'high';
  approval: {
    status: 'pending' | 'approved' | 'conditional' | 'rejected';
    conditions?: string[];
    approvedBy: string;
    approvedAt: Date;
    expiryDate: Date;
  };
}

class VendorSecurityAssessment {
  async assessVendor(
    vendorName: string,
    dataTypes: string[],
    riskLevel: 'low' | 'medium' | 'high'
  ): Promise<VendorSecurityAssessment> {
    // Collect vendor security information
    const vendorInfo = await this.collectVendorInfo(vendorName);
    
    // Evaluate security controls
    const securityEvaluation = await this.evaluateSecurityControls(vendorInfo);
    
    // Assess compliance
    const complianceCheck = await this.checkCompliance(vendorInfo);
    
    // Evaluate technical controls
    const technicalEvaluation = await this.evaluateTechnicalControls(vendorInfo);
    
    // Calculate overall risk
    const riskScore = this.calculateRiskScore(
      securityEvaluation,
      complianceCheck,
      technicalEvaluation
    );
    
    // Determine approval status
    const approval = await this.determineApprovalStatus(
      riskScore,
      dataTypes,
      riskLevel
    );
    
    return {
      vendor: vendorName,
      assessment: {
        security: securityEvaluation,
        compliance: complianceCheck,
        technical: technicalEvaluation
      },
      riskLevel: this.mapRiskScoreToLevel(riskScore),
      approval
    };
  }
}
```

## 6. Security Monitoring and Incident Response

### 6.1 Real-time Security Monitoring

#### 6.1.1 Security Event Detection

**Security Monitoring Framework**:

```typescript
interface SecurityMonitoringConfig {
  events: {
    authentication: string[];
    authorization: string[];
    dataAccess: string[];
    systemEvents: string[];
    networkEvents: string[];
  };
  thresholds: {
    failedLogins: number;
    unusualAccess: number;
    dataExfiltration: number;
    systemAnomalies: number;
  };
  alerting: {
    immediate: string[];
    escalation: string[];
    reporting: string[];
  };
}

const securityMonitoringConfig: SecurityMonitoringConfig = {
  events: {
    authentication: [
      'failed_login',
      'multiple_failed_logins',
      'successful_login_from_new_device',
      'session_anomalies',
      'mfa_bypass_attempts'
    ],
    authorization: [
      'unauthorized_access_attempts',
      'privilege_escalation',
      'resource_access_violations',
      'permission_denials'
    ],
    dataAccess: [
      'bulk_data_access',
      'sensitive_data_access',
      'unusual_data_patterns',
      'data_export_attempts'
    ],
    systemEvents: [
      'system_availability_changes',
      'configuration_changes',
      'security_control_changes',
      'backup_failures'
    ],
    networkEvents: [
      'ddos_attempts',
      'suspicious_traffic',
      'unusual_geographic_access',
      'malicious_requests'
    ]
  },
  thresholds: {
    failedLogins: 5,
    unusualAccess: 3,
    dataExfiltration: 1,
    systemAnomalies: 2
  },
  alerting: {
    immediate: ['security_team', 'dpo'],
    escalation: ['management', 'legal'],
    reporting: ['audit_team', 'compliance']
  }
};

class SecurityMonitoringSystem {
  async monitorSecurityEvents(
    events: SecurityEvent[],
    context: MonitoringContext
  ): Promise<MonitoringResult> {
    const alerts: SecurityAlert[] = [];
    
    for (const event of events) {
      // Check against monitoring rules
      const ruleMatch = await this.checkMonitoringRules(event);
      if (ruleMatch.triggered) {
        // Assess severity
        const severity = await this.assessEventSeverity(event, ruleMatch);
        
        // Generate alert if needed
        if (severity.level >= severity.threshold) {
          const alert = await this.generateAlert(event, severity);
          alerts.push(alert);
        }
        
        // Log event
        await this.logSecurityEvent(event, ruleMatch, severity);
      }
    }
    
    // Process alerts
    await this.processAlerts(alerts);
    
    return {
      eventsProcessed: events.length,
      alertsGenerated: alerts.length,
      monitoringStatus: 'active'
    };
  }
}
```

#### 6.1.2 Anomaly Detection

**Anomaly Detection System**:

```typescript
interface AnomalyDetectionConfig {
  patterns: {
    userBehavior: {
      accessPatterns: string[];
      timePatterns: string[];
      locationPatterns: string[];
    };
    dataPatterns: {
      accessFrequency: string;
      dataVolume: string;
      dataTypes: string;
    };
    systemPatterns: {
      performance: string;
      resourceUsage: string;
      errorRates: string;
    };
  };
  algorithms: {
    statistical: string[];
    machineLearning: string[];
    rulesBased: string[];
  };
  response: {
    detectionThreshold: number;
    escalationRules: string[];
    autoResponse: string[];
  };
}

class AnomalyDetectionEngine {
  async detectAnomalies(
    userId: string,
    tenantId: string,
    timeframe: string
  ): Promise<AnomalyDetectionResult> {
    // Collect baseline data
    const baseline = await this.getUserBaseline(userId, tenantId, timeframe);
    
    // Collect current data
    const current = await this.getCurrentActivity(userId, tenantId);
    
    // Run anomaly detection algorithms
    const statisticalAnomalies = await this.runStatisticalAnalysis(baseline, current);
    const mlAnomalies = await this.runMLAnalysis(baseline, current);
    const ruleAnomalies = await this.runRuleAnalysis(current);
    
    // Combine results
    const anomalies = this.combineAnomalyResults(
      statisticalAnomalies,
      mlAnomalies,
      ruleAnomalies
    );
    
    // Assess significance
    const significantAnomalies = await this.assessAnomalySignificance(anomalies);
    
    return {
      userId,
      tenantId,
      timeframe,
      anomalies: significantAnomalies,
      riskScore: await this.calculateRiskScore(significantAnomalies),
      recommendations: await this.generateRecommendations(significantAnomalies)
    };
  }
}
```

### 6.2 Incident Response Procedures

#### 6.2.1 Incident Classification

**Incident Classification Matrix**:

```typescript
interface IncidentClassification {
  severity: 'low' | 'medium' | 'high' | 'critical';
  scope: 'single_user' | 'single_tenant' | 'multiple_tenants' | 'system_wide';
  type: 'security' | 'privacy' | 'availability' | 'integrity' | 'confidentiality';
  dataImpact: {
    personalData: boolean;
    sensitiveData: boolean;
    regulatedData: boolean;
    volume: 'minimal' | 'limited' | 'substantial' | 'mass';
  };
  notification: {
    internal: boolean;
    supervisoryAuthority: boolean;
    dataSubjects: boolean;
    timeframe: number; // hours
  };
}

class IncidentClassificationEngine {
  async classifyIncident(incidentData: IncidentData): Promise<IncidentClassification> {
    // Assess severity
    const severity = await this.assessIncidentSeverity(incidentData);
    
    // Determine scope
    const scope = await this.determineIncidentScope(incidentData);
    
    // Identify type
    const type = await this.identifyIncidentType(incidentData);
    
    // Assess data impact
    const dataImpact = await this.assessDataImpact(incidentData);
    
    // Determine notification requirements
    const notification = await this.determineNotificationRequirements(
      severity,
      scope,
      dataImpact
    );
    
    return {
      severity,
      scope,
      type,
      dataImpact,
      notification
    };
  }
}
```

#### 6.2.2 Response Procedures

**Automated Response Framework**:

```typescript
interface ResponseProcedures {
  immediate: {
    containment: string[];
    assessment: string[];
    notification: string[];
  };
  shortTerm: {
    investigation: string[];
    remediation: string[];
    communication: string[];
  };
  longTerm: {
    recovery: string[];
    lessons: string[];
    prevention: string[];
  };
}

class IncidentResponseSystem {
  async respondToIncident(
    incident: SecurityIncident,
    classification: IncidentClassification
  ): Promise<ResponsePlan> {
    // Create response plan based on classification
    const responsePlan = await this.createResponsePlan(classification);
    
    // Execute immediate response
    if (classification.severity === 'critical') {
      await this.executeImmediateResponse(incident, responsePlan.immediate);
    }
    
    // Start investigation
    await this.initiateInvestigation(incident);
    
    // Set up monitoring
    await this.setupIncidentMonitoring(incident);
    
    // Notify stakeholders
    await this.notifyStakeholders(incident, classification);
    
    return responsePlan;
  }
}
```

---

**Document Control**:

- **Classification**: Internal
- **Retention Period**: 7 years
- **Distribution**: Security team, technical teams, compliance
- **Review Date**: March 24, 2026
- **Next Review**: June 24, 2026

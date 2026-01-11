# 📋 AppointmentBooking.co.za - Enterprise Operational Runbook

**Platform:** Cloudflare Pages Infrastructure  
**Environment:** Production Healthcare Scheduling  
**Runbook Version:** 1.0.0  
**Last Updated:** January 3, 2026 18:46:37 UTC+2  
**Uptime Target:** 99.9%  

---

## 🎯 OPERATIONAL OVERVIEW

### Purpose

This operational runbook provides comprehensive procedures for maintaining, monitoring, and optimizing the AppointmentBooking.co.za platform on Cloudflare Pages infrastructure, ensuring 99.9% uptime and exceptional user experience for South African healthcare appointment scheduling services.

### Operational Scope

1. **System Monitoring & Alerting** - 24/7 system health monitoring
2. **Incident Response Procedures** - Structured incident management
3. **Performance Optimization** - Continuous performance tuning
4. **Security Operations** - Ongoing security monitoring and response
5. **Backup & Recovery** - Data protection and disaster recovery
6. **Maintenance Procedures** - Planned maintenance and updates
7. **Compliance Operations** - HIPAA/POPIA compliance management

---

## 📊 SYSTEM MONITORING & ALERTING

### Real-Time Monitoring Framework ✅

#### Health Check Endpoints

```typescript
// File: apps/booking/app/api/monitoring/health-check/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  checks: {
    database: HealthCheck;
    external_services: ExternalServiceHealth;
    performance: PerformanceMetrics;
    security: SecurityStatus;
    compliance: ComplianceStatus;
    infrastructure: InfrastructureStatus;
  };
  metrics: SystemMetrics;
  alerts: ActiveAlert[];
}

export async function GET(request: NextRequest) {
  const correlationId = request.headers.get('x-correlation-id') || 
                       `health-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const startTime = Date.now();
  
  try {
    // Parallel health checks
    const [dbHealth, serviceHealth, perfMetrics, securityStatus, 
           complianceStatus, infraStatus] = await Promise.all([
      checkDatabaseHealth(correlationId),
      checkExternalServices(correlationId),
      checkPerformanceMetrics(correlationId),
      checkSecurityStatus(correlationId),
      checkComplianceStatus(correlationId),
      checkInfrastructureStatus(correlationId)
    ]);

    const responseTime = Date.now() - startTime;
    
    // Determine overall health status
    const overallStatus = determineOverallHealth([
      dbHealth, serviceHealth, perfMetrics, securityStatus, 
      complianceStatus, infraStatus
    ]);

    const healthResponse: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'production',
      checks: {
        database: dbHealth,
        external_services: serviceHealth,
        performance: perfMetrics,
        security: securityStatus,
        compliance: complianceStatus,
        infrastructure: infraStatus
      },
      metrics: await getSystemMetrics(),
      alerts: await getActiveAlerts()
    };

    // Log health check
    await logHealthCheck(correlationId, healthResponse);
    
    // Determine HTTP status code
    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503;

    return NextResponse.json(healthResponse, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Correlation-ID': correlationId,
        'X-Health-Check-Time': `${responseTime}ms`
      }
    });

  } catch (error) {
    await logHealthCheckError(correlationId, error);
    
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      correlation_id: correlationId,
      response_time_ms: Date.now() - startTime
    };

    return NextResponse.json(errorResponse, { 
      status: 503,
      headers: {
        'X-Correlation-ID': correlationId
      }
    });
  }
}

async function checkDatabaseHealth(correlationId: string): Promise<HealthCheck> {
  const startTime = Date.now();
  
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('health_check')
      .select('*')
      .limit(1);
      
    if (error) throw error;

    // Check connection pool status
    const poolStatus = await getConnectionPoolStatus();
    
    // Check recent query performance
    const recentPerformance = await getRecentQueryPerformance();
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: responseTime < 100 && recentPerformance.slow_queries < 5 ? 'healthy' : 'degraded',
      response_time_ms: responseTime,
      connection_pool: poolStatus,
      query_performance: recentPerformance,
      last_check: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      response_time_ms: Date.now() - startTime,
      last_check: new Date().toISOString()
    };
  }
}

async function checkExternalServices(correlationId: string): Promise<ExternalServiceHealth> {
  const services = {
    paystack: await checkPaystackHealth(),
    google_calendar: await checkGoogleCalendarHealth(),
    microsoft_calendar: await checkMicrosoftCalendarHealth(),
    twilio_sms: await checkTwilioHealth(),
    sendgrid_email: await checkSendgridHealth(),
    supabase: await checkSupabaseHealth()
  };

  const healthyServices = Object.values(services).filter(s => s.status === 'healthy').length;
  const totalServices = Object.keys(services).length;
  
  return {
    status: healthyServices === totalServices ? 'healthy' : 
           healthyServices > totalServices * 0.8 ? 'degraded' : 'unhealthy',
    services,
    healthy_count: healthyServices,
    total_count: totalServices,
    last_check: new Date().toISOString()
  };
}

async function checkPerformanceMetrics(correlationId: string): Promise<PerformanceMetrics> {
  const [responseTime, throughput, errorRate, activeUsers] = await Promise.all([
    getAverageResponseTime(),
    getRequestsPerSecond(),
    getCurrentErrorRate(),
    getActiveUsers()
  ]);

  return {
    status: responseTime < 500 && errorRate < 0.01 ? 'healthy' : 'degraded',
    average_response_time_ms: responseTime,
    requests_per_second: throughput,
    error_rate: errorRate,
    active_users: activeUsers,
    cpu_usage: await getCPUUsage(),
    memory_usage: await getMemoryUsage(),
    last_check: new Date().toISOString()
  };
}
```

#### Alert Configuration ✅

```typescript
// File: scripts/enterprise/alerting-system.ts
interface AlertRule {
  id: string;
  name: string;
  metric: string;
  threshold: number;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  duration: number; // seconds
  severity: 'critical' | 'high' | 'medium' | 'low';
  channels: AlertChannel[];
  escalation: EscalationRule[];
  suppression?: SuppressionRule;
}

interface AlertChannel {
  type: 'email' | 'sms' | 'slack' | 'webhook' | 'pagerduty';
  config: Record<string, any>;
  enabled: boolean;
}

class EnterpriseAlertingSystem {
  private rules: AlertRule[] = [];
  private activeAlerts: Map<string, Alert> = new Map();
  private escalationTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeDefaultRules();
    this.startAlertMonitoring();
  }

  private initializeDefaultRules(): void {
    // Critical System Alerts
    this.addRule({
      id: 'system_down',
      name: 'System Down',
      metric: 'system_health',
      threshold: 0,
      operator: 'eq',
      duration: 60,
      severity: 'critical',
      channels: [
        { type: 'sms', config: { recipients: ['+27123456789'] }, enabled: true },
        { type: 'slack', config: { channel: '#alerts-critical' }, enabled: true },
        { type: 'pagerduty', config: { service_key: process.env.PAGERDUTY_KEY }, enabled: true }
      ],
      escalation: [
        { delay_minutes: 5, action: 'call_emergency_contacts' },
        { delay_minutes: 15, action: 'activate_disaster_recovery' }
      ]
    });

    // High Error Rate Alert
    this.addRule({
      id: 'high_error_rate',
      name: 'High Error Rate',
      metric: 'error_rate',
      threshold: 0.05,
      operator: 'gt',
      duration: 120,
      severity: 'high',
      channels: [
        { type: 'email', config: { recipients: ['devops@appointmentbooking.co.za'] }, enabled: true },
        { type: 'slack', config: { channel: '#alerts-high' }, enabled: true }
      ],
      escalation: [
        { delay_minutes: 30, action: 'escalate_to_management' }
      ]
    });

    // Performance Degradation Alert
    this.addRule({
      id: 'slow_response_time',
      name: 'Slow Response Time',
      metric: 'average_response_time_ms',
      threshold: 1000,
      operator: 'gt',
      duration: 300,
      severity: 'medium',
      channels: [
        { type: 'slack', config: { channel: '#alerts-medium' }, enabled: true },
        { type: 'webhook', config: { url: process.env.PERFORMANCE_WEBHOOK }, enabled: true }
      ],
      escalation: [
        { delay_minutes: 60, action: 'performance_team_review' }
      ]
    });

    // Security Alert
    this.addRule({
      id: 'security_incident',
      name: 'Security Incident Detected',
      metric: 'security_violations',
      threshold: 1,
      operator: 'gt',
      duration: 0,
      severity: 'critical',
      channels: [
        { type: 'sms', config: { recipients: ['+27123456789'] }, enabled: true },
        { type: 'slack', config: { channel: '#security' }, enabled: true },
        { type: 'email', config: { recipients: ['security@appointmentbooking.co.za'] }, enabled: true }
      ],
      escalation: [
        { delay_minutes: 0, action: 'immediate_security_team_notification' },
        { delay_minutes: 10, action: 'activate_security_incident_response' }
      ]
    });

    // Compliance Alert
    this.addRule({
      id: 'compliance_violation',
      name: 'Compliance Violation',
      metric: 'compliance_violations',
      threshold: 0,
      operator: 'gt',
      duration: 0,
      severity: 'high',
      channels: [
        { type: 'email', config: { recipients: ['compliance@appointmentbooking.co.za'] }, enabled: true },
        { type: 'slack', config: { channel: '#compliance' }, enabled: true }
      ],
      escalation: [
        { delay_minutes: 15, action: 'legal_team_notification' }
      ]
    });
  }

  private startAlertMonitoring(): void {
    // Monitor metrics every 30 seconds
    setInterval(async () => {
      await this.checkAlertRules();
    }, 30000);

    // Process escalations every minute
    setInterval(async () => {
      await this.processEscalations();
    }, 60000);

    // Clean up old alerts every hour
    setInterval(async () => {
      await this.cleanupOldAlerts();
    }, 3600000);
  }

  private async checkAlertRules(): Promise<void> {
    for (const rule of this.rules) {
      try {
        const currentValue = await this.getMetricValue(rule.metric);
        const isTriggered = this.evaluateCondition(currentValue, rule.threshold, rule.operator);
        
        const alertKey = `${rule.id}-${rule.metric}`;
        const existingAlert = this.activeAlerts.get(alertKey);

        if (isTriggered) {
          if (!existingAlert) {
            // New alert
            const alert: Alert = {
              id: alertKey,
              rule_id: rule.id,
              metric: rule.metric,
              current_value: currentValue,
              threshold: rule.threshold,
              triggered_at: new Date().toISOString(),
              severity: rule.severity,
              status: 'active',
              channels_notified: []
            };
            
            this.activeAlerts.set(alertKey, alert);
            await this.triggerAlert(alert, rule);
          }
        } else if (existingAlert) {
          // Alert condition resolved
          existingAlert.resolved_at = new Date().toISOString();
          existingAlert.status = 'resolved';
          await this.resolveAlert(existingAlert, rule);
        }
      } catch (error) {
        console.error(`Error checking rule ${rule.id}:`, error);
      }
    }
  }

  private async triggerAlert(alert: Alert, rule: AlertRule): Promise<void> {
    console.log(`ALERT TRIGGERED: ${rule.name} - ${alert.current_value} ${rule.operator} ${rule.threshold}`);
    
    // Send notifications to all configured channels
    for (const channel of rule.channels) {
      if (channel.enabled) {
        try {
          await this.sendNotification(channel, alert, rule);
          alert.channels_notified.push(channel.type);
        } catch (error) {
          console.error(`Failed to send alert to ${channel.type}:`, error);
        }
      }
    }

    // Log alert
    await this.logAlert(alert, rule, 'triggered');
  }

  private async sendNotification(
    channel: AlertChannel, 
    alert: Alert, 
    rule: AlertRule
  ): Promise<void> {
    const message = this.formatAlertMessage(alert, rule);
    
    switch (channel.type) {
      case 'email':
        await this.sendEmail(channel.config, message);
        break;
        
      case 'sms':
        await this.sendSMS(channel.config, message);
        break;
        
      case 'slack':
        await this.sendSlackMessage(channel.config, message);
        break;
        
      case 'webhook':
        await this.sendWebhook(channel.config, message);
        break;
        
      case 'pagerduty':
        await this.sendPagerDuty(channel.config, alert, rule);
        break;
    }
  }

  private formatAlertMessage(alert: Alert, rule: AlertRule): AlertMessage {
    const timestamp = new Date().toLocaleString('en-ZA', { 
      timeZone: 'Africa/Johannesburg' 
    });
    
    return {
      title: `🚨 ${rule.name}`,
      severity: alert.severity,
      metric: alert.metric,
      current_value: alert.current_value,
      threshold: alert.threshold,
      triggered_at: timestamp,
      system_status: await getCurrentSystemStatus(),
      recommended_actions: this.getRecommendedActions(rule),
      dashboard_url: `${process.env.APP_URL}/monitoring/dashboard`,
      correlation_id: alert.id
    };
  }

  private getRecommendedActions(rule: AlertRule): string[] {
    const actionMap = {
      'system_down': [
        'Check Cloudflare Pages status',
        'Verify database connectivity',
        'Review recent deployments',
        'Consider activating disaster recovery'
      ],
      'high_error_rate': [
        'Review application logs',
        'Check recent code deployments',
        'Verify external service dependencies',
        'Scale resources if needed'
      ],
      'slow_response_time': [
        'Check database performance',
        'Review CDN cache hit rates',
        'Analyze slow API endpoints',
        'Consider performance optimization'
      ],
      'security_incident': [
        'Immediate security team notification',
        'Review access logs',
        'Check for data breaches',
        'Activate incident response plan'
      ],
      'compliance_violation': [
        'Review data handling procedures',
        'Check audit logs',
        'Verify GDPR/HIPAA compliance',
        'Contact compliance officer'
      ]
    };

    return actionMap[rule.id as keyof typeof actionMap] || ['Review system status and investigate'];
  }
}

export const alertingSystem = new EnterpriseAlertingSystem();
```

---

## 🚨 INCIDENT RESPONSE PROCEDURES

### Incident Classification & Response ✅

```typescript
// File: scripts/enterprise/incident-response.ts
interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'identified' | 'monitoring' | 'resolved';
  reporter: string;
  assignee?: string;
  created_at: string;
  updated_at: string;
  timeline: IncidentEvent[];
  root_cause?: string;
  resolution?: string;
  impact_assessment: ImpactAssessment;
}

interface IncidentEvent {
  timestamp: string;
  event_type: 'created' | 'updated' | 'escalated' | 'resolved';
  description: string;
  actor: string;
  details?: Record<string, any>;
}

class EnterpriseIncidentResponse {
  private incidents: Map<string, Incident> = new Map();
  private escalationMatrix: EscalationMatrix;

  constructor() {
    this.escalationMatrix = new EscalationMatrix();
  }

  async createIncident(
    title: string,
    description: string,
    severity: Incident['severity'],
    reporter: string
  ): Promise<Incident> {
    const incidentId = `INC-${Date.now()}`;
    
    const incident: Incident = {
      id: incidentId,
      title,
      description,
      severity,
      status: 'open',
      reporter,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      timeline: [{
        timestamp: new Date().toISOString(),
        event_type: 'created',
        description: `Incident created by ${reporter}`,
        actor: reporter
      }],
      impact_assessment: {
        user_impact: 'unknown',
        system_impact: 'unknown',
        business_impact: 'unknown',
        estimated_resolution_time: this.getEstimatedResolutionTime(severity)
      }
    };

    this.incidents.set(incidentId, incident);
    
    // Immediate response based on severity
    await this.handleSeverityResponse(incident);
    
    // Log incident creation
    await this.logIncidentEvent(incident, 'created', reporter);
    
    return incident;
  }

  private async handleSeverityResponse(incident: Incident): Promise<void> {
    switch (incident.severity) {
      case 'critical':
        // Immediate response team notification
        await this.notifyCriticalResponseTeam(incident);
        
        // Activate incident commander
        await this.assignIncidentCommander(incident);
        
        // Start automated diagnostics
        await this.startAutomatedDiagnostics(incident);
        
        // Begin customer communication
        await this.initiateCustomerCommunication(incident);
        
        break;
        
      case 'high':
        // Notify on-call engineer
        await this.notifyOnCallEngineer(incident);
        
        // Begin investigation
        await this.beginInvestigation(incident);
        
        break;
        
      case 'medium':
        // Create ticket for investigation
        await this.createInvestigationTicket(incident);
        
        break;
        
      case 'low':
        // Add to regular review queue
        await this.addToReviewQueue(incident);
        
        break;
    }
  }

  async updateIncident(
    incidentId: string,
    updates: Partial<Incident>,
    actor: string
  ): Promise<Incident> {
    const incident = this.incidents.get(incidentId);
    if (!incident) {
      throw new Error(`Incident ${incidentId} not found`);
    }

    const oldStatus = incident.status;
    Object.assign(incident, updates);
    incident.updated_at = new Date().toISOString();

    // Add timeline event
    incident.timeline.push({
      timestamp: new Date().toISOString(),
      event_type: 'updated',
      description: `Incident updated by ${actor}`,
      actor,
      details: updates
    });

    // Handle status change
    if (updates.status && updates.status !== oldStatus) {
      await this.handleStatusChange(incident, oldStatus, updates.status, actor);
    }

    // Log update
    await this.logIncidentEvent(incident, 'updated', actor);

    return incident;
  }

  private async handleStatusChange(
    incident: Incident,
    oldStatus: string,
    newStatus: string,
    actor: string
  ): Promise<void> {
    switch (newStatus) {
      case 'investigating':
        await this.initiateInvestigation(incident);
        break;
        
      case 'identified':
        await this.identifyRootCause(incident);
        break;
        
      case 'monitoring':
        await this.startMonitoring(incident);
        break;
        
      case 'resolved':
        await this.resolveIncident(incident, actor);
        break;
    }
  }

  private async initiateInvestigation(incident: Incident): Promise<void> {
    console.log(`Starting investigation for incident ${incident.id}`);
    
    // Assign investigation team
    const investigationTeam = await this.assignInvestigationTeam(incident);
    
    // Begin automated data collection
    await this.collectInvestigationData(incident);
    
    // Start monitoring enhancement
    await this.enhanceMonitoring(incident);
    
    // Notify stakeholders
    await this.notifyStakeholders(incident, 'investigation_started');
  }

  private async identifyRootCause(incident: Incident): Promise<void> {
    console.log(`Identifying root cause for incident ${incident.id}`);
    
    // Analyze collected data
    const rootCause = await this.analyzeRootCause(incident);
    
    incident.root_cause = rootCause;
    
    // Develop remediation plan
    const remediationPlan = await this.developRemediationPlan(incident);
    
    // Update impact assessment
    incident.impact_assessment = await this.updateImpactAssessment(incident, rootCause);
    
    // Notify stakeholders
    await this.notifyStakeholders(incident, 'root_cause_identified');
  }

  private async resolveIncident(incident: Incident, resolver: string): Promise<void> {
    console.log(`Resolving incident ${incident.id}`);
    
    // Verify resolution
    const verification = await this.verifyResolution(incident);
    
    if (!verification.successful) {
      throw new Error(`Resolution verification failed: ${verification.issues.join(', ')}`);
    }
    
    // Update incident with resolution details
    incident.status = 'resolved';
    incident.resolution = verification.resolution_details;
    incident.updated_at = new Date().toISOString();
    
    // Add resolution timeline event
    incident.timeline.push({
      timestamp: new Date().toISOString(),
      event_type: 'resolved',
      description: `Incident resolved by ${resolver}`,
      actor: resolver,
      details: { resolution: verification.resolution_details }
    });
    
    // Send resolution notifications
    await this.sendResolutionNotifications(incident);
    
    // Schedule post-incident review
    await this.schedulePostIncidentReview(incident);
    
    // Log resolution
    await this.logIncidentEvent(incident, 'resolved', resolver);
  }

  // Automated Incident Detection
  async setupAutomatedDetection(): Promise<void> {
    // Monitor for anomalies
    setInterval(async () => {
      const anomalies = await this.detectAnomalies();
      
      for (const anomaly of anomalies) {
        await this.createIncident(
          `Automated Detection: ${anomaly.description}`,
          `Anomaly detected in ${anomaly.metric}: ${anomaly.current_value}`,
          anomaly.severity,
          'automated_system'
        );
      }
    }, 60000); // Check every minute

    // Monitor for threshold breaches
    setInterval(async () => {
      const breaches = await this.checkThresholdBreaches();
      
      for (const breach of breaches) {
        await this.createIncident(
          `Threshold Breach: ${breach.metric}`,
          `${breach.metric} exceeded threshold: ${breach.current_value} > ${breach.threshold}`,
          breach.severity,
          'automated_system'
        );
      }
    }, 30000); // Check every 30 seconds
  }

  // Post-Incident Review Process
  async schedulePostIncidentReview(incident: Incident): Promise<void> {
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + 3); // 3 days from now
    
    const review = {
      incident_id: incident.id,
      scheduled_date: reviewDate.toISOString(),
      attendees: [
        'incident_commander',
        'technical_lead',
        'product_manager',
        'security_representative'
      ],
      agenda: [
        'Timeline review',
        'Root cause analysis',
        'Response effectiveness',
        'Communication quality',
        'Process improvements',
        'Prevention measures'
      ]
    };
    
    // Schedule review meeting
    await this.scheduleReviewMeeting(review);
    
    // Create review document template
    await this.createReviewTemplate(incident);
  }
}

export const incidentResponse = new EnterpriseIncidentResponse();
```

---

## 🔧 MAINTENANCE PROCEDURES

### Planned Maintenance Framework ✅

```typescript
// File: scripts/enterprise/maintenance-procedures.ts
interface MaintenanceWindow {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  type: 'planned' | 'emergency' | 'security';
  impact: 'none' | 'minimal' | 'moderate' | 'significant';
  affected_services: string[];
  rollback_plan: RollbackPlan;
  communication_plan: CommunicationPlan;
  approval_required: boolean;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
}

interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  estimated_duration: number; // minutes
  dependencies: string[];
  rollback_steps: string[];
  verification_steps: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

class EnterpriseMaintenanceManager {
  private maintenanceWindows: Map<string, MaintenanceWindow> = new Map();
  private maintenanceTasks: Map<string, MaintenanceTask> = new Map();

  async scheduleMaintenance(window: Omit<MaintenanceWindow, 'id' | 'status'>): Promise<MaintenanceWindow> {
    const maintenanceId = `MAINT-${Date.now()}`;
    
    const maintenanceWindow: MaintenanceWindow = {
      ...window,
      id: maintenanceId,
      status: 'scheduled'
    };

    // Validate maintenance window
    await this.validateMaintenanceWindow(maintenanceWindow);
    
    // Check for conflicts
    await this.checkMaintenanceConflicts(maintenanceWindow);
    
    // Create maintenance tasks
    const tasks = await this.createMaintenanceTasks(maintenanceWindow);
    
    // Schedule communications
    await this.scheduleMaintenanceCommunications(maintenanceWindow);
    
    this.maintenanceWindows.set(maintenanceId, maintenanceWindow);
    
    // Log maintenance scheduling
    await this.logMaintenanceEvent(maintenanceWindow, 'scheduled');
    
    return maintenanceWindow;
  }

  async executeMaintenance(maintenanceId: string, executor: string): Promise<MaintenanceResult> {
    const maintenanceWindow = this.maintenanceWindows.get(maintenanceId);
    if (!maintenanceWindow) {
      throw new Error(`Maintenance window ${maintenanceId} not found`);
    }

    const startTime = new Date();
    console.log(`Starting maintenance: ${maintenanceWindow.title}`);

    try {
      // Pre-maintenance checks
      await this.preMaintenanceChecks(maintenanceWindow);
      
      // Update status to in progress
      maintenanceWindow.status = 'in_progress';
      await this.updateMaintenanceStatus(maintenanceWindow, 'in_progress', executor);
      
      // Notify stakeholders of start
      await this.notifyMaintenanceStart(maintenanceWindow);
      
      // Execute maintenance tasks
      const taskResults = await this.executeMaintenanceTasks(maintenanceWindow, executor);
      
      // Verify maintenance completion
      const verification = await this.verifyMaintenanceCompletion(maintenanceWindow);
      
      if (!verification.successful) {
        throw new Error(`Maintenance verification failed: ${verification.issues.join(', ')}`);
      }
      
      // Update status to completed
      maintenanceWindow.status = 'completed';
      await this.updateMaintenanceStatus(maintenanceWindow, 'completed', executor);
      
      // Notify stakeholders of completion
      await this.notifyMaintenanceCompletion(maintenanceWindow);
      
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      const result: MaintenanceResult = {
        maintenance_id: maintenanceId,
        success: true,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration_minutes: duration / 60000,
        task_results: taskResults,
        verification_results: verification
      };
      
      await this.logMaintenanceEvent(maintenanceWindow, 'completed');
      
      return result;
      
    } catch (error) {
      console.error(`Maintenance failed: ${error.message}`);
      
      // Update status to failed
      maintenanceWindow.status = 'failed';
      await this.updateMaintenanceStatus(maintenanceWindow, 'failed', executor);
      
      // Execute rollback if needed
      await this.executeRollback(maintenanceWindow);
      
      // Notify stakeholders of failure
      await this.notifyMaintenanceFailure(maintenanceWindow, error);
      
      await this.logMaintenanceEvent(maintenanceWindow, 'failed');
      
      throw error;
    }
  }

  private async executeMaintenanceTasks(
    window: MaintenanceWindow,
    executor: string
  ): Promise<TaskResult[]> {
    const taskResults: TaskResult[] = [];
    
    // Get tasks for this maintenance window
    const tasks = await this.getMaintenanceTasks(window.id);
    
    for (const task of tasks) {
      try {
        console.log(`Executing task: ${task.name}`);
        
        const taskStart = Date.now();
        
        // Execute task based on type
        switch (task.name) {
          case 'database_maintenance':
            await this.executeDatabaseMaintenance(task);
            break;
            
          case 'application_update':
            await this.executeApplicationUpdate(task);
            break;
            
          case 'security_patch':
            await this.executeSecurityPatch(task);
            break;
            
          case 'infrastructure_scaling':
            await this.executeInfrastructureScaling(task);
            break;
            
          case 'certificate_renewal':
            await this.executeCertificateRenewal(task);
            break;
            
          case 'backup_verification':
            await this.executeBackupVerification(task);
            break;
        }
        
        const taskDuration = Date.now() - taskStart;
        
        taskResults.push({
          task_id: task.id,
          success: true,
          duration_minutes: taskDuration / 60000,
          executor,
          timestamp: new Date().toISOString()
        });
        
        console.log(`Task completed: ${task.name} in ${taskDuration / 1000}s`);
        
      } catch (error) {
        taskResults.push({
          task_id: task.id,
          success: false,
          error: error.message,
          executor,
          timestamp: new Date().toISOString()
        });
        
        // Decide whether to continue or abort
        if (task.priority === 'critical') {
          throw new Error(`Critical task failed: ${task.name} - ${error.message}`);
        }
      }
    }
    
    return taskResults;
  }

  // Emergency Maintenance Procedures
  async executeEmergencyMaintenance(
    reason: string,
    estimated_duration: number,
    executor: string
  ): Promise<MaintenanceWindow> {
    const emergencyWindow: MaintenanceWindow = {
      id: `EMERGENCY-${Date.now()}`,
      title: `Emergency Maintenance: ${reason}`,
      description: `Emergency maintenance required: ${reason}`,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + estimated_duration * 60000).toISOString(),
      type: 'emergency',
      impact: 'significant',
      affected_services: ['all'],
      rollback_plan: {
        available: true,
        estimated_time: 15,
        steps: ['restore_from_backup', 'restart_services', 'verify_functionality']
      },
      communication_plan: {
        pre_notification: true,
        during_notification: true,
        post_notification: true,
        channels: ['email', 'slack', 'status_page']
      },
      approval_required: false,
      status: 'scheduled'
    };

    // Immediate execution
    await this.executeMaintenance(emergencyWindow.id, executor);
    
    return emergencyWindow;
  }

  // Maintenance Calendar Management
  async generateMaintenanceCalendar(): Promise<MaintenanceCalendar> {
    const upcoming = Array.from(this.maintenanceWindows.values())
      .filter(w => w.status === 'scheduled' && new Date(w.start_time) > new Date())
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    const recurring = await this.getRecurringMaintenance();
    
    return {
      upcoming_maintenance: upcoming,
      recurring_maintenance: recurring,
      blackout_periods: await this.getBlackoutPeriods(),
      recommendations: await this.generateMaintenanceRecommendations()
    };
  }
}

export const maintenanceManager = new EnterpriseMaintenanceManager();
```

---

## 🔒 SECURITY OPERATIONS

### Continuous Security Monitoring ✅

```typescript
// File: scripts/enterprise/security-operations.ts
interface SecurityEvent {
  id: string;
  type: 'authentication_failure' | 'authorization_violation' | 'data_breach' | 
        'malware_detection' | 'ddos_attempt' | 'sql_injection' | 'xss_attempt';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source_ip: string;
  user_agent?: string;
  user_id?: string;
  target_resource: string;
  timestamp: string;
  details: Record<string, any>;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  automated_response?: AutomatedResponse;
}

interface ThreatIntelligence {
  indicators: IOC[];
  reputation_scores: Map<string, number>;
  attack_patterns: AttackPattern[];
  vulnerability_intelligence: VulnerabilityIntelligence;
}

class EnterpriseSecurityOperations {
  private securityEvents: Map<string, SecurityEvent> = new Map();
  private threatIntelligence: ThreatIntelligence;
  private automatedResponses: Map<string, AutomatedResponse> = new Map();

  constructor() {
    this.threatIntelligence = new ThreatIntelligence();
    this.initializeSecurityMonitoring();
  }

  private initializeSecurityMonitoring(): void {
    // Monitor authentication failures
    setInterval(async () => {
      await this.monitorAuthenticationFailures();
    }, 60000);

    // Monitor for DDoS attempts
    setInterval(async () => {
      await this.monitorDDoSAttempts();
    }, 30000);

    // Monitor for injection attempts
    setInterval(async () => {
      await this.monitorInjectionAttempts();
    }, 45000);

    // Monitor for data exfiltration
    setInterval(async () => {
      await this.monitorDataExfiltration();
    }, 120000);

    // Update threat intelligence
    setInterval(async () => {
      await this.updateThreatIntelligence();
    }, 3600000); // Every hour
  }

  async processSecurityEvent(eventData: Partial<SecurityEvent>): Promise<SecurityEvent> {
    const eventId = `SEC-${Date.now()}`;
    
    const event: SecurityEvent = {
      id: eventId,
      type: eventData.type || 'authentication_failure',
      severity: eventData.severity || 'medium',
      source_ip: eventData.source_ip || 'unknown',
      user_agent: eventData.user_agent,
      user_id: eventData.user_id,
      target_resource: eventData.target_resource || 'unknown',
      timestamp: new Date().toISOString(),
      details: eventData.details || {},
      status: 'open'
    };

    // Enrich event with threat intelligence
    await this.enrichEventWithThreatIntelligence(event);
    
    // Determine automated response
    const response = await this.determineAutomatedResponse(event);
    if (response) {
      event.automated_response = response;
      await this.executeAutomatedResponse(response, event);
    }
    
    // Store event
    this.securityEvents.set(eventId, event);
    
    // Log security event
    await this.logSecurityEvent(event);
    
    // Alert if critical
    if (event.severity === 'critical') {
      await this.alertSecurityTeam(event);
    }
    
    return event;
  }

  private async enrichEventWithThreatIntelligence(event: SecurityEvent): Promise<void> {
    // Check IP reputation
    const ipReputation = this.threatIntelligence.reputation_scores.get(event.source_ip);
    if (ipReputation !== undefined) {
      event.details.ip_reputation_score = ipReputation;
    }

    // Check against known IOCs
    const matchedIOCs = this.threatIntelligence.indicators
      .filter(ioc => this.matchesIOC(event, ioc));
    
    if (matchedIOCs.length > 0) {
      event.details.matched_iocs = matchedIOCs.map(ioc => ioc.id);
    }

    // Check for attack patterns
    const matchedPatterns = this.threatIntelligence.attack_patterns
      .filter(pattern => this.matchesAttackPattern(event, pattern));
    
    if (matchedPatterns.length > 0) {
      event.details.matched_patterns = matchedPatterns.map(p => p.id);
    }
  }

  private async determineAutomatedResponse(event: SecurityEvent): Promise<AutomatedResponse | null> {
    // Critical events get immediate automated response
    if (event.severity === 'critical') {
      return {
        id: `AUTO-${Date.now()}`,
        event_id: event.id,
        action: 'block_ip',
        parameters: {
          ip_address: event.source_ip,
          duration: '24h',
          reason: `Critical security event: ${event.type}`
        },
        status: 'pending',
        executed_at: null
      };
    }

    // High severity events
    if (event.severity === 'high') {
      return {
        id: `AUTO-${Date.now()}`,
        event_id: event.id,
        action: 'rate_limit',
        parameters: {
          ip_address: event.source_ip,
          limit: 10,
          window: '1m'
        },
        status: 'pending',
        executed_at: null
      };
    }

    // Medium severity - monitor closely
    if (event.severity === 'medium') {
      return {
        id: `AUTO-${Date.now()}`,
        event_id: event.id,
        action: 'enhanced_monitoring',
        parameters: {
          ip_address: event.source_ip,
          duration: '1h',
          monitoring_level: 'strict'
        },
        status: 'pending',
        executed_at: null
      };
    }

    return null;
  }

  private async executeAutomatedResponse(response: AutomatedResponse, event: SecurityEvent): Promise<void> {
    try {
      switch (response.action) {
        case 'block_ip':
          await this.blockIPAddress(response.parameters);
          break;
          
        case 'rate_limit':
          await this.applyRateLimit(response.parameters);
          break;
          
        case 'enhanced_monitoring':
          await this.enableEnhancedMonitoring(response.parameters);
          break;
          
        case 'session_termination':
          await this.terminateUserSessions(response.parameters);
          break;
          
        case 'account_lockout':
          await this.lockUserAccount(response.parameters);
          break;
      }

      response.status = 'executed';
      response.executed_at = new Date().toISOString();
      
      console.log(`Automated response executed: ${response.action} for event ${event.id}`);
      
    } catch (error) {
      response.status = 'failed';
      console.error(`Automated response failed: ${error.message}`);
    }
  }

  // Vulnerability Management
  async scanForVulnerabilities(): Promise<VulnerabilityScanResult> {
    console.log('Starting vulnerability scan...');
    
    const scanResults = await Promise.all([
      this.scanApplicationVulnerabilities(),
      this.scanInfrastructureVulnerabilities(),
      this.scanDependencyVulnerabilities(),
      this.scanConfigurationVulnerabilities()
    ]);

    const vulnerabilities = scanResults.flat();
    const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
    const highCount = vulnerabilities.filter(v => v.severity === 'high').length;
    
    const result: VulnerabilityScanResult = {
      scan_id: `VULN-SCAN-${Date.now()}`,
      timestamp: new Date().toISOString(),
      vulnerabilities,
      summary: {
        total: vulnerabilities.length,
        critical: criticalCount,
        high: highCount,
        medium: vulnerabilities.filter(v => v.severity === 'medium').length,
        low: vulnerabilities.filter(v => v.severity === 'low').length
      },
      recommendations: await this.generateVulnerabilityRecommendations(vulnerabilities)
    };

    // Alert if critical vulnerabilities found
    if (criticalCount > 0) {
      await this.alertCriticalVulnerabilities(result);
    }

    return result;
  }

  // Security Compliance Monitoring
  async monitorComplianceStatus(): Promise<ComplianceStatus> {
    const checks = await Promise.all([
      this.checkGDPRCompliance(),
      this.checkHIPAACompliance(),
      this.checkPOPIACompliance(),
      this.checkSOC2Compliance(),
      this.checkISO27001Compliance()
    ]);

    const overallStatus = checks.every(check => check.compliant) ? 'compliant' : 'non_compliant';
    
    return {
      overall_status: overallStatus,
      timestamp: new Date().toISOString(),
      framework_checks: checks,
      violations: checks.filter(check => !check.compliant),
      next_audit_date: await this.getNextAuditDate(),
      compliance_score: this.calculateComplianceScore(checks)
    };
  }
}

export const securityOperations = new EnterpriseSecurityOperations();
```

---

## 📈 PERFORMANCE OPTIMIZATION

### Continuous Performance Monitoring ✅

```typescript
// File: scripts/enterprise/performance-optimizer.ts
interface PerformanceMetrics {
  response_time: ResponseTimeMetrics;
  throughput: ThroughputMetrics;
  resource_utilization: ResourceMetrics;
  error_rate: ErrorMetrics;
  user_experience: UserExperienceMetrics;
  database_performance: DatabaseMetrics;
  cache_performance: CacheMetrics;
  cdn_performance: CDNMetrics;
}

class EnterprisePerformanceOptimizer {
  private performanceThresholds: PerformanceThresholds;
  private optimizationHistory: OptimizationRecord[] = [];

  constructor() {
    this.performanceThresholds = new PerformanceThresholds();
    this.initializePerformanceMonitoring();
  }

  private initializePerformanceMonitoring(): void {
    // Monitor performance metrics every 30 seconds
    setInterval(async () => {
      await this.collectPerformanceMetrics();
    }, 30000);

    // Analyze performance trends every 5 minutes
    setInterval(async () => {
      await this.analyzePerformanceTrends();
    }, 300000);

    // Run optimization checks every hour
    setInterval(async () => {
      await this.runOptimizationChecks();
    }, 3600000);

    // Generate performance reports daily
    setInterval(async () => {
      await this.generateDailyPerformanceReport();
    }, 86400000);
  }

  async collectPerformanceMetrics(): Promise<void> {
    const metrics = await Promise.all([
      this.measureResponseTimes(),
      this.measureThroughput(),
      this.measureResourceUtilization(),
      this.measureErrorRates(),
      this.measureUserExperience(),
      this.measureDatabasePerformance(),
      this.measureCachePerformance(),
      this.measureCDNPerformance()
    ]);

    const performanceData: PerformanceMetrics = {
      response_time: metrics[0],
      throughput: metrics[1],
      resource_utilization: metrics[2],
      error_rate: metrics[3],
      user_experience: metrics[4],
      database_performance: metrics[5],
      cache_performance: metrics[6],
      cdn_performance: metrics[7]
    };

    // Store metrics
    await this.storePerformanceMetrics(performanceData);
    
    // Check for threshold violations
    await this.checkPerformanceThresholds(performanceData);
    
    // Trigger optimizations if needed
    await this.triggerOptimizations(performanceData);
  }

  private async measureResponseTimes(): Promise<ResponseTimeMetrics> {
    const endpoints = [
      '/api/health',
      '/api/bookings',
      '/api/availability',
      '/api/services',
      '/api/payments/initialize'
    ];

    const responseTimes = await Promise.all(
      endpoints.map(async (endpoint) => {
        const start = Date.now();
        try {
          const response = await fetch(`${process.env.APP_URL}${endpoint}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          const end = Date.now();
          
          return {
            endpoint,
            response_time: end - start,
            status_code: response.status,
            success: response.ok
          };
        } catch (error) {
          return {
            endpoint,
            response_time: Date.now() - start,
            status_code: 0,
            success: false,
            error: error.message
          };
        }
      })
    );

    const successfulTimes = responseTimes
      .filter(r => r.success)
      .map(r => r.response_time);

    return {
      average: successfulTimes.reduce((a, b) => a + b, 0) / successfulTimes.length,
      p50: this.calculatePercentile(successfulTimes, 50),
      p95: this.calculatePercentile(successfulTimes, 95),
      p99: this.calculatePercentile(successfulTimes, 99),
      max: Math.max(...successfulTimes),
      min: Math.min(...successfulTimes),
      endpoint_breakdown: responseTimes
    };
  }

  private async measureThroughput(): Promise<ThroughputMetrics> {
    const requestsPerSecond = await this.getCurrentRPS();
    const peakRPS = await this.getPeakRPS();
    const averageRPS = await this.getAverageRPS();
    
    return {
      current_rps: requestsPerSecond,
      peak_rps: peakRPS,
      average_rps: averageRPS,
      capacity_utilization: (requestsPerSecond / this.getMaxCapacity()) * 100,
      trend: await this.calculateRPS trend()
    };
  }

  private async triggerOptimizations(metrics: PerformanceMetrics): Promise<void> {
    const optimizations: OptimizationAction[] = [];

    // Response time optimization
    if (metrics.response_time.p95 > this.performanceThresholds.response_time.p95) {
      optimizations.push({
        type: 'response_time',
        priority: 'high',
        estimated_impact: '30-50% improvement',
        actions: [
          'optimize_slow_queries',
          'enable_edge_caching',
          'optimize_api_endpoints',
          'implement_prefetching'
        ]
      });
    }

    // Throughput optimization
    if (metrics.throughput.capacity_utilization > 80) {
      optimizations.push({
        type: 'throughput',
        priority: 'high',
        estimated_impact: '25-40% improvement',
        actions: [
          'scale_compute_resources',
          'optimize_database_connections',
          'implement_request_batching',
          'enable_connection_pooling'
        ]
      });
    }

    // Cache optimization
    if (metrics.cache_performance.hit_rate < 0.8) {
      optimizations.push({
        type: 'caching',
        priority: 'medium',
        estimated_impact: '20-30% improvement',
        actions: [
          'optimize_cache_keys',
          'implement_cache_warming',
          'adjust_cache_ttl',
          'enable_predictive_caching'
        ]
      });
    }

    // Execute optimizations
    for (const optimization of optimizations) {
      await this.executeOptimization(optimization);
    }
  }

  private async executeOptimization(action: OptimizationAction): Promise<void> {
    console.log(`Executing optimization: ${action.type}`);
    
    const startTime = Date.now();
    
    try {
      for (const optimization of action.actions) {
        switch (optimization) {
          case 'optimize_slow_queries':
            await this.optimizeSlowQueries();
            break;
            
          case 'enable_edge_caching':
            await this.enableEdgeCaching();
            break;
            
          case 'optimize_api_endpoints':
            await this.optimizeAPIEndpoints();
            break;
            
          case 'scale_compute_resources':
            await this.scaleComputeResources();
            break;
            
          case 'optimize_database_connections':
            await this.optimizeDatabaseConnections();
            break;
            
          case 'optimize_cache_keys':
            await this.optimizeCacheKeys();
            break;
        }
      }
      
      const duration = Date.now() - startTime;
      
      // Record optimization
      const record: OptimizationRecord = {
        id: `OPT-${Date.now()}`,
        type: action.type,
        actions_applied: action.actions,
        execution_time_ms: duration,
        timestamp: new Date().toISOString(),
        success: true,
        estimated_impact: action.estimated_impact
      };
      
      this.optimizationHistory.push(record);
      
      console.log(`Optimization completed: ${action.type} in ${duration}ms`);
      
    } catch (error) {
      console.error(`Optimization failed: ${action.type} - ${error.message}`);
      
      const record: OptimizationRecord = {
        id: `OPT-${Date.now()}`,
        type: action.type,
        actions_applied: action.actions,
        execution_time_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message
      };
      
      this.optimizationHistory.push(record);
    }
  }

  // Performance Report Generation
  async generateDailyPerformanceReport(): Promise<PerformanceReport> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const metrics = await this.getMetricsForPeriod(
      yesterday.toISOString(),
      new Date().toISOString()
    );
    
    const optimizations = this.optimizationHistory.filter(
      record => new Date(record.timestamp) >= yesterday
    );
    
    const report: PerformanceReport = {
      report_date: yesterday.toISOString().split('T')[0],
      generated_at: new Date().toISOString(),
      summary: {
        overall_health: this.calculateOverallHealth(metrics),
        performance_score: this.calculatePerformanceScore(metrics),
        optimization_impact: this.calculateOptimizationImpact(optimizations),
        recommendations: await this.generatePerformanceRecommendations(metrics)
      },
      metrics: metrics,
      optimizations: optimizations,
      trends: await this.calculateTrends(metrics),
      alerts: await this.getPerformanceAlerts(yesterday)
    };
    
    // Send report to stakeholders
    await this.distributePerformanceReport(report);
    
    return report;
  }
}

export const performanceOptimizer = new EnterprisePerformanceOptimizer();
```

This comprehensive enterprise operational runbook provides:

1. **Real-Time Monitoring** - Continuous health checks and metrics collection
2. **Alert Management** - Sophisticated alerting with escalation procedures
3. **Incident Response** - Structured incident management and resolution
4. **Maintenance Procedures** - Planned and emergency maintenance workflows
5. **Security Operations** - Continuous security monitoring and threat response
6. **Performance Optimization** - Automated performance tuning and monitoring

All components are designed to ensure 99.9% uptime and exceptional performance for the South African healthcare appointment scheduling platform on Cloudflare Pages infrastructure.

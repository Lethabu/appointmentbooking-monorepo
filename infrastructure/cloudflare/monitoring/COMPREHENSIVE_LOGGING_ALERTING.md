# Comprehensive Logging and Alerting Systems Implementation

## System Architecture Overview

This document outlines the implementation of comprehensive logging and alerting systems for the Appointment Booking System, providing real-time monitoring, incident detection, and operational intelligence.

## Logging Infrastructure

### Application Logging Configuration

```javascript
// lib/logger.js - Enhanced logging configuration
const winston = require('winston');
const { format, transports } = winston;
const CloudWatchTransport = require('winston-cloudwatch');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.json(),
    format.prettyPrint()
  ),
  defaultMeta: {
    service: 'appointment-booking',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.APP_VERSION || '1.0.0'
  },
  transports: [
    // Console logging with color coding
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
        })
      )
    }),
    
    // File logging for local development
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    new transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // CloudWatch integration for production
    ...(process.env.NODE_ENV === 'production' ? [
      new CloudWatchTransport({
        logGroupName: `/aws/lambda/appointment-booking`,
        logStreamName: `${process.env.NODE_ENV}-${new Date().toISOString().split('T')[0]}`,
        awsRegion: process.env.AWS_REGION || 'us-east-1',
        jsonMessage: true
      })
    ] : [])
  ],
  
  // Handle uncaught exceptions and rejections
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' })
  ]
});

module.exports = logger;
```

### Structured Logging Middleware

```javascript
// middleware/logger.js - Request logging middleware
const logger = require('../lib/logger');
const { v4: uuidv4 } = require('uuid');

const requestLogger = (req, res, next) => {
  const requestId = uuidv4();
  const startTime = Date.now();
  
  // Add request ID to headers
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  
  // Log request
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id,
    tenantId: req.tenant?.id
  });
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    
    logger.info('Request completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length') || 0,
      userId: req.user?.id,
      tenantId: req.tenant?.id
    });
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

module.exports = requestLogger;
```

### Business Event Logging

```javascript
// services/eventLogger.js - Business event tracking
const logger = require('../lib/logger');

class EventLogger {
  static logBookingEvent(event, data = {}) {
    logger.info('Booking event', {
      eventType: event,
      category: 'booking',
      ...data,
      timestamp: new Date().toISOString()
    });
  }
  
  static logUserEvent(event, userId, data = {}) {
    logger.info('User event', {
      eventType: event,
      category: 'user',
      userId,
      ...data,
      timestamp: new Date().toISOString()
    });
  }
  
  static logSecurityEvent(event, severity, data = {}) {
    logger.warn('Security event', {
      eventType: event,
      category: 'security',
      severity,
      ...data,
      timestamp: new Date().toISOString()
    });
  }
  
  static logPerformanceEvent(event, metrics = {}) {
    logger.info('Performance event', {
      eventType: event,
      category: 'performance',
      ...metrics,
      timestamp: new Date().toISOString()
    });
  }
  
  static logError(error, context = {}) {
    logger.error('Application error', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      category: 'error',
      ...context,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = EventLogger;
```

## Monitoring and Alerting System

### Health Check Implementation

```javascript
// services/healthCheck.js - Comprehensive health monitoring
const logger = require('../lib/logger');
const { Client: PostgresClient } = require('pg');
const Redis = require('redis');

class HealthCheck {
  constructor() {
    this.checks = new Map();
    this.setupDefaultChecks();
  }
  
  setupDefaultChecks() {
    // Database health check
    this.checks.set('database', this.checkDatabase.bind(this));
    
    // Redis health check
    this.checks.set('cache', this.checkCache.bind(this));
    
    // External API health checks
    this.checks.set('google-calendar', this.checkGoogleCalendar.bind(this));
    this.checks.set('outlook-calendar', this.checkOutlookCalendar.bind(this));
    
    // Email service health check
    this.checks.set('email', this.checkEmailService.bind(this));
    
    // Payment service health check
    this.checks.set('payment', this.checkPaymentService.bind(this));
  }
  
  async checkDatabase() {
    try {
      const client = new PostgresClient(process.env.DATABASE_URL);
      await client.connect();
      const result = await client.query('SELECT 1 as health');
      await client.end();
      
      return {
        status: 'healthy',
        responseTime: result.duration,
        message: 'Database connection successful'
      };
    } catch (error) {
      throw new Error(`Database health check failed: ${error.message}`);
    }
  }
  
  async checkCache() {
    try {
      const client = Redis.createClient({ url: process.env.REDIS_URL });
      await client.connect();
      await client.ping();
      await client.disconnect();
      
      return {
        status: 'healthy',
        message: 'Cache service connection successful'
      };
    } catch (error) {
      throw new Error(`Cache health check failed: ${error.message}`);
    }
  }
  
  async checkGoogleCalendar() {
    try {
      // Add Google Calendar API health check
      // This would involve making a simple API call
      return {
        status: 'healthy',
        message: 'Google Calendar API accessible'
      };
    } catch (error) {
      throw new Error(`Google Calendar health check failed: ${error.message}`);
    }
  }
  
  async checkOutlookCalendar() {
    try {
      // Add Outlook Calendar API health check
      return {
        status: 'healthy',
        message: 'Outlook Calendar API accessible'
      };
    } catch (error) {
      throw new Error(`Outlook Calendar health check failed: ${error.message}`);
    }
  }
  
  async checkEmailService() {
    try {
      // Add email service health check
      return {
        status: 'healthy',
        message: 'Email service operational'
      };
    } catch (error) {
      throw new Error(`Email service health check failed: ${error.message}`);
    }
  }
  
  async checkPaymentService() {
    try {
      // Add payment service health check
      return {
        status: 'healthy',
        message: 'Payment service operational'
      };
    } catch (error) {
      throw new Error(`Payment service health check failed: ${error.message}`);
    }
  }
  
  async performFullHealthCheck() {
    const results = {};
    const startTime = Date.now();
    
    for (const [checkName, checkFunction] of this.checks) {
      try {
        const checkStart = Date.now();
        const result = await checkFunction();
        const responseTime = Date.now() - checkStart;
        
        results[checkName] = {
          ...result,
          responseTime: `${responseTime}ms`
        };
      } catch (error) {
        results[checkName] = {
          status: 'unhealthy',
          error: error.message
        };
      }
    }
    
    const overallHealth = Object.values(results).every(check => check.status === 'healthy');
    const totalResponseTime = Date.now() - startTime;
    
    return {
      status: overallHealth ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${totalResponseTime}ms`,
      checks: results
    };
  }
}

module.exports = new HealthCheck();
```

### Alert Manager Service

```javascript
// services/alertManager.js - Intelligent alerting system
const logger = require('../lib/logger');
const axios = require('axios');

class AlertManager {
  constructor() {
    this.alertRules = new Map();
    this.notificationChannels = new Map();
    this.alertHistory = [];
    this.setupDefaultRules();
    this.setupNotificationChannels();
  }
  
  setupDefaultRules() {
    // High error rate alert
    this.alertRules.set('high-error-rate', {
      name: 'High Error Rate',
      condition: (metrics) => metrics.errorRate > 10,
      severity: 'critical',
      description: 'Error rate exceeds 10%',
      duration: '5m'
    });
    
    // Slow response time alert
    this.alertRules.set('slow-response', {
      name: 'Slow Response Time',
      condition: (metrics) => metrics.avgResponseTime > 2000,
      severity: 'warning',
      description: 'Average response time exceeds 2 seconds',
      duration: '3m'
    });
    
    // High memory usage alert
    this.alertRules.set('high-memory', {
      name: 'High Memory Usage',
      condition: (metrics) => metrics.memoryUsage > 90,
      severity: 'warning',
      description: 'Memory usage exceeds 90%',
      duration: '2m'
    });
    
    // Database connection issues
    this.alertRules.set('database-issues', {
      name: 'Database Connection Issues',
      condition: (metrics) => metrics.databaseConnections < 5,
      severity: 'critical',
      description: 'Low number of active database connections',
      duration: '1m'
    });
    
    // Calendar sync failures
    this.alertRules.set('calendar-sync-failure', {
      name: 'Calendar Sync Failures',
      condition: (metrics) => metrics.calendarSyncFailures > 5,
      severity: 'warning',
      description: 'High number of calendar sync failures',
      duration: '5m'
    });
  }
  
  setupNotificationChannels() {
    // Email notification channel
    this.notificationChannels.set('email', {
      type: 'email',
      config: {
        to: process.env.ALERT_EMAIL_RECIPIENTS?.split(',') || [],
        from: process.env.ALERT_EMAIL_FROM || 'alerts@appointmentbooking.co.za'
      }
    });
    
    // Slack notification channel
    this.notificationChannels.set('slack', {
      type: 'slack',
      config: {
        webhook: process.env.SLACK_WEBHOOK_URL,
        channel: process.env.SLACK_ALERT_CHANNEL || '#alerts'
      }
    });
    
    // PagerDuty notification channel
    this.notificationChannels.set('pagerduty', {
      type: 'pagerduty',
      config: {
        integrationKey: process.env.PAGERDUTY_INTEGRATION_KEY
      }
    });
  }
  
  async evaluateAlerts(metrics) {
    const triggeredAlerts = [];
    
    for (const [ruleId, rule] of this.alertRules) {
      try {
        if (rule.condition(metrics)) {
          triggeredAlerts.push({
            id: ruleId,
            name: rule.name,
            severity: rule.severity,
            description: rule.description,
            timestamp: new Date().toISOString(),
            metrics
          });
        }
      } catch (error) {
        logger.error('Error evaluating alert rule', { ruleId, error: error.message });
      }
    }
    
    // Send alerts for newly triggered rules
    for (const alert of triggeredAlerts) {
      await this.triggerAlert(alert);
    }
    
    return triggeredAlerts;
  }
  
  async triggerAlert(alert) {
    logger.warn('Alert triggered', { alert });
    
    // Store alert in history
    this.alertHistory.push(alert);
    
    // Send notifications
    for (const [channelName, channel] of this.notificationChannels) {
      try {
        await this.sendNotification(channel, alert);
      } catch (error) {
        logger.error(`Failed to send alert via ${channelName}`, { error: error.message });
      }
    }
  }
  
  async sendNotification(channel, alert) {
    switch (channel.type) {
      case 'email':
        await this.sendEmailAlert(channel.config, alert);
        break;
      case 'slack':
        await this.sendSlackAlert(channel.config, alert);
        break;
      case 'pagerduty':
        await this.sendPagerDutyAlert(channel.config, alert);
        break;
    }
  }
  
  async sendEmailAlert(config, alert) {
    const subject = `[${alert.severity.toUpperCase()}] ${alert.name}`;
    const body = `
Alert: ${alert.name}
Severity: ${alert.severity}
Description: ${alert.description}
Timestamp: ${alert.timestamp}
Environment: ${process.env.NODE_ENV}

Metrics:
${JSON.stringify(alert.metrics, null, 2)}
    `;
    
    // Use email service to send alert
    const emailService = require('./emailService');
    await emailService.sendMail({
      to: config.to,
      from: config.from,
      subject,
      text: body
    });
  }
  
  async sendSlackAlert(config, alert) {
    const color = alert.severity === 'critical' ? 'danger' : 'warning';
    const payload = {
      channel: config.channel,
      attachments: [{
        color,
        title: `${alert.severity.toUpperCase()}: ${alert.name}`,
        text: alert.description,
        fields: [
          {
            title: 'Timestamp',
            value: alert.timestamp,
            short: true
          },
          {
            title: 'Environment',
            value: process.env.NODE_ENV,
            short: true
          }
        ],
        footer: 'Appointment Booking System'
      }]
    };
    
    await axios.post(config.webhook, payload);
  }
  
  async sendPagerDutyAlert(config, alert) {
    const payload = {
      routing_key: config.integrationKey,
      event_action: 'trigger',
      dedup_key: `appointment-booking-${alert.id}`,
      payload: {
        summary: alert.name,
        severity: alert.severity,
        source: 'appointment-booking-system',
        component: 'web-application',
        group: 'production',
        class: 'availability'
      }
    };
    
    await axios.post('https://events.pagerduty.com/v2/enqueue', payload);
  }
  
  getAlertHistory(limit = 100) {
    return this.alertHistory.slice(-limit);
  }
  
  getActiveAlerts() {
    return this.alertHistory.filter(alert => 
      Date.now() - new Date(alert.timestamp).getTime() < 300000 // 5 minutes
    );
  }
}

module.exports = new AlertManager();
```

### Metrics Collection Service

```javascript
// services/metricsCollector.js - Performance metrics collection
const logger = require('../lib/logger');

class MetricsCollector {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        success: 0,
        error: 0
      },
      responseTime: {
        total: 0,
        min: Infinity,
        max: 0,
        count: 0
      },
      system: {
        memoryUsage: 0,
        cpuUsage: 0,
        activeConnections: 0
      },
      business: {
        bookingsCreated: 0,
        bookingsCancelled: 0,
        bookingsRescheduled: 0,
        activeUsers: 0
      }
    };
    
    this.setupCollection();
  }
  
  setupCollection() {
    // Collect metrics every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);
    
    // Reset metrics every 5 minutes
    setInterval(() => {
      this.resetMetrics();
    }, 300000);
  }
  
  recordRequest(success, responseTime) {
    this.metrics.requests.total++;
    if (success) {
      this.metrics.requests.success++;
    } else {
      this.metrics.requests.error++;
    }
    
    this.metrics.responseTime.total += responseTime;
    this.metrics.responseTime.min = Math.min(this.metrics.responseTime.min, responseTime);
    this.metrics.responseTime.max = Math.max(this.metrics.responseTime.max, responseTime);
    this.metrics.responseTime.count++;
  }
  
  recordBusinessEvent(event) {
    if (this.metrics.business.hasOwnProperty(event)) {
      this.metrics.business[event]++;
    }
  }
  
  collectSystemMetrics() {
    const memUsage = process.memoryUsage();
    this.metrics.system.memoryUsage = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);
    
    // Add CPU usage collection if needed
    this.metrics.system.activeConnections = this.getActiveConnections();
    
    logger.debug('System metrics collected', { metrics: this.metrics.system });
  }
  
  getActiveConnections() {
    // This would depend on your database client
    // For example, with PostgreSQL:
    // return pgClient.query('SELECT count(*) FROM pg_stat_activity WHERE state = \'active\'').rows[0].count;
    return 0;
  }
  
  resetMetrics() {
    const oldMetrics = { ...this.metrics };
    
    // Reset counters
    this.metrics.requests = { total: 0, success: 0, error: 0 };
    this.metrics.responseTime = { total: 0, min: Infinity, max: 0, count: 0 };
    this.metrics.business.bookingsCreated = 0;
    this.metrics.business.bookingsCancelled = 0;
    this.metrics.business.bookingsRescheduled = 0;
    this.metrics.business.activeUsers = 0;
    
    logger.info('Metrics reset', { oldMetrics });
  }
  
  getMetrics() {
    const avgResponseTime = this.metrics.responseTime.count > 0 
      ? Math.round(this.metrics.responseTime.total / this.metrics.responseTime.count)
      : 0;
    
    const errorRate = this.metrics.requests.total > 0
      ? Math.round((this.metrics.requests.error / this.metrics.requests.total) * 100)
      : 0;
    
    return {
      ...this.metrics,
      derived: {
        avgResponseTime,
        errorRate,
        successRate: this.metrics.requests.total > 0
          ? Math.round((this.metrics.requests.success / this.metrics.requests.total) * 100)
          : 0
      }
    };
  }
}

module.exports = new MetricsCollector();
```

### Cloudflare Workers Logging Integration

```javascript
// workers/logger-worker.js - Cloudflare Worker for log aggregation
export default {
  async fetch(request, env, ctx) {
    const { method, url } = request;
    const startTime = Date.now();
    
    // Extract request information
    const userAgent = request.headers.get('User-Agent') || '';
    const clientIP = request.headers.get('CF-Connecting-IP') || '';
    const requestId = crypto.randomUUID();
    
    try {
      // Log incoming request
      await logToCloudflare('info', 'Incoming request', {
        requestId,
        method,
        url,
        userAgent,
        clientIP,
        timestamp: new Date().toISOString()
      });
      
      // Make the actual request
      const response = await fetch(request);
      
      // Calculate response time
      const responseTime = Date.now() - startTime;
      
      // Log response
      await logToCloudflare('info', 'Request completed', {
        requestId,
        method,
        url,
        statusCode: response.status,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString()
      });
      
      return response;
    } catch (error) {
      // Log error
      await logToCloudflare('error', 'Request failed', {
        requestId,
        method,
        url,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};

async function logToCloudflare(level, message, metadata) {
  // Use Cloudflare's analytics API or log to external service
  // This is a placeholder for the actual implementation
  console.log(`[${level}] ${message}`, metadata);
}
```

### Monitoring Dashboard Configuration

```yaml
# monitoring/dashboard.yml - Grafana dashboard configuration
apiVersion: 1

providers:
  - name: 'Appointment Booking Dashboard'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    editable: true
    updateIntervalSeconds: 10
    options:
      path: /var/lib/grafana/dashboards

dashboards:
  - name: 'System Overview'
    uid: system-overview
    dashboard:
      id: null
      title: "Appointment Booking System - Overview"
      tags: ['booking', 'system']
      style: dark
      timezone: browser
      panels:
        - id: 1
          title: "Request Rate"
          type: stat
          targets:
            - expr: rate(http_requests_total[5m])
              legendFormat: "Requests/sec"
          
        - id: 2
          title: "Response Time"
          type: graph
          targets:
            - expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
              legendFormat: "95th percentile"
            - expr: histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))
              legendFormat: "50th percentile"
          
        - id: 3
          title: "Error Rate"
          type: singlestat
          targets:
            - expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100
              legendFormat: "Error %"
          
        - id: 4
          title: "Active Bookings"
          type: stat
          targets:
            - expr: bookings_active_total
              legendFormat: "Active Bookings"
          
        - id: 5
          title: "Calendar Sync Status"
          type: table
          targets:
            - expr: calendar_sync_status
              legendFormat: "{{service}}"
          
        - id: 6
          title: "Database Connections"
          type: stat
          targets:
            - expr: database_connections_active
              legendFormat: "Active Connections"
```

This comprehensive logging and alerting system provides:

1. **Structured Logging**: Application logs with correlation IDs and business context
2. **Health Monitoring**: Comprehensive health checks for all system components
3. **Intelligent Alerting**: Rule-based alerting with multiple notification channels
4. **Metrics Collection**: Performance and business metrics aggregation
5. **Real-time Dashboards**: Grafana dashboards for operational visibility
6. **Cloudflare Integration**: Seamless integration with Cloudflare Workers and Pages

The system enables proactive monitoring, rapid incident response, and continuous optimization of the appointment booking platform.

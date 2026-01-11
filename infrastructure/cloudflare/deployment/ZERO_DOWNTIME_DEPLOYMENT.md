# Zero-Downtime Deployment Implementation

## Overview

This document outlines the comprehensive zero-downtime deployment strategy for the Appointment Booking System, ensuring continuous service availability during deployments through blue-green, rolling, and canary deployment strategies.

## Deployment Strategy Architecture

### Blue-Green Deployment Implementation

```javascript
// services/deploymentManager.js - Blue-green deployment orchestration
const logger = require('../lib/logger');
const axios = require('axios');
const { exec } = require('child_process');

class DeploymentManager {
  constructor() {
    this.deploymentEnvironments = new Map();
    this.deploymentHistory = [];
    this.healthCheckService = require('./healthCheck');
    this.setupDeploymentEnvironments();
  }
  
  setupDeploymentEnvironments() {
    // Production environments
    this.deploymentEnvironments.set('production-blue', {
      name: 'production-blue',
      type: 'blue',
      active: true,
      url: 'https://appointmentbooking.co.za',
      healthCheck: '/api/health',
      trafficPercentage: 100
    });
    
    this.deploymentEnvironments.set('production-green', {
      name: 'production-green',
      type: 'green',
      active: false,
      url: 'https://green.appointmentbooking.co.za',
      healthCheck: '/api/health',
      trafficPercentage: 0
    });
    
    // Staging environments
    this.deploymentEnvironments.set('staging-blue', {
      name: 'staging-blue',
      type: 'blue',
      active: true,
      url: 'https://staging.appointmentbooking.co.za',
      healthCheck: '/api/health',
      trafficPercentage: 100
    });
    
    this.deploymentEnvironments.set('staging-green', {
      name: 'staging-green',
      type: 'green',
      active: false,
      url: 'https://green-staging.appointmentbooking.co.za',
      healthCheck: '/api/health',
      trafficPercentage: 0
    });
  }
  
  async executeBlueGreenDeployment(config) {
    const {
      environment = 'production',
      application,
      version,
      forceRollback = false,
      healthCheckTimeout = 300000 // 5 minutes
    } = config;
    
    const deploymentId = this.generateDeploymentId();
    const blueEnv = `${environment}-blue`;
    const greenEnv = `${environment}-green`;
    
    logger.info('Starting blue-green deployment', { 
      deploymentId, 
      environment, 
      application, 
      version 
    });
    
    try {
      // Step 1: Prepare green environment
      const greenEnvironment = this.deploymentEnvironments.get(greenEnv);
      logger.info('Preparing green environment', { deploymentId, greenEnv });
      
      await this.prepareEnvironment(greenEnvironment, {
        application,
        version,
        deploymentId
      });
      
      // Step 2: Deploy to green environment
      logger.info('Deploying to green environment', { deploymentId, greenEnv });
      
      const deploymentResult = await this.deployToEnvironment(greenEnvironment, {
        application,
        version,
        deploymentId
      });
      
      if (!deploymentResult.success) {
        throw new Error(`Green environment deployment failed: ${deploymentResult.error}`);
      }
      
      // Step 3: Run health checks on green environment
      logger.info('Running health checks on green environment', { deploymentId });
      
      const healthCheckResult = await this.runHealthChecks(greenEnvironment, healthCheckTimeout);
      
      if (!healthCheckResult.healthy) {
        throw new Error(`Green environment health check failed: ${healthCheckResult.error}`);
      }
      
      // Step 4: Run smoke tests
      logger.info('Running smoke tests', { deploymentId });
      
      const smokeTestResult = await this.runSmokeTests(greenEnvironment);
      
      if (!smokeTestResult.passed) {
        throw new Error(`Smoke tests failed: ${smokeTestResult.error}`);
      }
      
      // Step 5: Gradual traffic shift (if canary testing enabled)
      if (config.canaryTesting) {
        logger.info('Starting canary traffic shift', { deploymentId });
        
        const canaryResult = await this.executeCanaryDeployment(blueEnv, greenEnv, config);
        
        if (!canaryResult.success) {
          throw new Error(`Canary deployment failed: ${canaryResult.error}`);
        }
      }
      
      // Step 6: Complete traffic switch
      logger.info('Switching traffic to green environment', { deploymentId });
      
      await this.switchTraffic(blueEnv, greenEnv);
      
      // Step 7: Verify post-switch health
      logger.info('Verifying post-switch health', { deploymentId });
      
      const postSwitchHealth = await this.verifyPostSwitchHealth(blueEnv, greenEnv);
      
      if (!postSwitchHealth.successful) {
        if (forceRollback) {
          logger.warn('Initiating forced rollback', { deploymentId });
          await this.executeRollback(greenEnv, blueEnv);
          throw new Error('Forced rollback executed due to health check failure');
        } else {
          throw new Error(`Post-switch health verification failed: ${postSwitchHealth.error}`);
        }
      }
      
      // Step 8: Update environment states
      this.updateEnvironmentStates(blueEnv, greenEnv);
      
      // Step 9: Clean up old deployment
      await this.cleanupOldDeployment(blueEnv, deploymentId);
      
      const deploymentSummary = {
        deploymentId,
        success: true,
        environment,
        application,
        version,
        blueEnvironment: blueEnv,
        greenEnvironment: greenEnv,
        switchTime: new Date().toISOString(),
        totalDuration: Date.now() - new Date(deploymentResult.startTime).getTime(),
        healthChecks: healthCheckResult,
        smokeTests: smokeTestResult
      };
      
      this.deploymentHistory.push(deploymentSummary);
      
      logger.info('Blue-green deployment completed successfully', deploymentSummary);
      
      return deploymentSummary;
      
    } catch (error) {
      logger.error('Blue-green deployment failed', { deploymentId, error: error.message });
      
      // Attempt automatic rollback
      if (!forceRollback) {
        try {
          await this.executeRollback(greenEnv, blueEnv);
          logger.info('Automatic rollback completed', { deploymentId });
        } catch (rollbackError) {
          logger.error('Automatic rollback failed', { deploymentId, error: rollbackError.message });
        }
      }
      
      const failedDeployment = {
        deploymentId,
        success: false,
        error: error.message,
        environment,
        application,
        version,
        failureTime: new Date().toISOString()
      };
      
      this.deploymentHistory.push(failedDeployment);
      
      throw error;
    }
  }
  
  async prepareEnvironment(environment, deploymentConfig) {
    logger.info('Preparing environment for deployment', { 
      environment: environment.name, 
      config: deploymentConfig 
    });
    
    // Clear any existing deployments
    await this.clearEnvironment(environment);
    
    // Setup environment-specific configurations
    await this.setupEnvironmentConfig(environment, deploymentConfig);
    
    // Prepare database for deployment
    await this.prepareDatabase(environment, deploymentConfig);
    
    logger.info('Environment preparation completed', { environment: environment.name });
  }
  
  async deployToEnvironment(environment, deploymentConfig) {
    const startTime = new Date().toISOString();
    
    logger.info('Starting deployment to environment', { 
      environment: environment.name, 
      config: deploymentConfig 
    });
    
    try {
      // Build application
      const buildResult = await this.buildApplication(deploymentConfig.application, deploymentConfig.version);
      
      if (!buildResult.success) {
        throw new Error(`Build failed: ${buildResult.error}`);
      }
      
      // Deploy using Cloudflare Pages
      const deployResult = await this.deployToCloudflarePages(environment, buildResult);
      
      if (!deployResult.success) {
        throw new Error(`Deploy failed: ${deployResult.error}`);
      }
      
      // Wait for deployment to be ready
      await this.waitForDeploymentReady(environment);
      
      return {
        success: true,
        startTime,
        environment: environment.name,
        deploymentUrl: environment.url
      };
      
    } catch (error) {
      return {
        success: false,
        startTime,
        error: error.message,
        environment: environment.name
      };
    }
  }
  
  async runHealthChecks(environment, timeout = 300000) {
    logger.info('Running health checks', { environment: environment.name });
    
    const startTime = Date.now();
    const healthChecks = [
      this.checkBasicHealth(environment),
      this.checkDatabaseConnectivity(environment),
      this.checkExternalServices(environment),
      this.checkApplicationEndpoints(environment)
    ];
    
    try {
      const results = await Promise.allSettled(healthChecks);
      
      const allHealthy = results.every(result => 
        result.status === 'fulfilled' && result.value.healthy
      );
      
      const duration = Date.now() - startTime;
      
      return {
        healthy: allHealthy,
        duration: `${duration}ms`,
        checks: results.map((result, index) => ({
          check: ['basic', 'database', 'external', 'application'][index],
          status: result.status,
          result: result.value || { healthy: false, error: result.reason?.message }
        }))
      };
      
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        duration: `${Date.now() - startTime}ms`
      };
    }
  }
  
  async runSmokeTests(environment) {
    logger.info('Running smoke tests', { environment: environment.name });
    
    const smokeTests = [
      () => this.testBookingCreation(environment),
      () => this.testBookingCancellation(environment),
      () => this.testCalendarSync(environment),
      () => this.testUserAuthentication(environment),
      () => this.testPaymentProcessing(environment)
    ];
    
    const results = [];
    
    for (const test of smokeTests) {
      try {
        const result = await test();
        results.push({ test: test.name, passed: result.success, duration: result.duration });
      } catch (error) {
        results.push({ test: test.name, passed: false, error: error.message });
      }
    }
    
    const allPassed = results.every(result => result.passed);
    
    return {
      passed: allPassed,
      results,
      timestamp: new Date().toISOString()
    };
  }
  
  async executeCanaryDeployment(blueEnv, greenEnv, config) {
    const canarySteps = [
      { trafficPercentage: 5, duration: 300000 }, // 5 minutes
      { trafficPercentage: 25, duration: 600000 }, // 10 minutes
      { trafficPercentage: 50, duration: 900000 }, // 15 minutes
      { trafficPercentage: 100, duration: 600000 } // 10 minutes
    ];
    
    for (const step of canarySteps) {
      logger.info('Canary deployment step', { 
        blueEnv, 
        greenEnv, 
        trafficPercentage: step.trafficPercentage 
      });
      
      // Update traffic routing
      await this.updateTrafficRouting(blueEnv, greenEnv, step.trafficPercentage);
      
      // Monitor for issues during this step
      const monitoringResult = await this.monitorCanaryStep(blueEnv, greenEnv, step.duration);
      
      if (!monitoringResult.success) {
        return {
          success: false,
          error: `Canary step failed at ${step.trafficPercentage}%: ${monitoringResult.error}`,
          step: step.trafficPercentage
        };
      }
    }
    
    return { success: true };
  }
  
  async switchTraffic(blueEnv, greenEnv) {
    logger.info('Switching traffic to green environment', { blueEnv, greenEnv });
    
    // Update DNS routing
    await this.updateDNSRouting(blueEnv, greenEnv);
    
    // Update load balancer rules
    await this.updateLoadBalancer(blueEnv, greenEnv);
    
    // Update traffic manager
    await this.updateTrafficManager(blueEnv, greenEnv);
    
    logger.info('Traffic switch completed', { blueEnv, greenEnv });
  }
  
  async executeRollback(fromEnv, toEnv) {
    logger.info('Executing rollback', { fromEnv, toEnv });
    
    try {
      // Switch traffic back to previous environment
      await this.switchTraffic(fromEnv, toEnv);
      
      // Verify rollback health
      const healthResult = await this.verifyRollbackHealth(toEnv);
      
      if (!healthResult.healthy) {
        throw new Error(`Rollback health check failed: ${healthResult.error}`);
      }
      
      logger.info('Rollback completed successfully', { fromEnv, toEnv });
      
      return { success: true };
      
    } catch (error) {
      logger.error('Rollback failed', { fromEnv, toEnv, error: error.message });
      throw error;
    }
  }
  
  generateDeploymentId() {
    return `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  updateEnvironmentStates(blueEnv, greenEnv) {
    const blue = this.deploymentEnvironments.get(blueEnv);
    const green = this.deploymentEnvironments.get(greenEnv);
    
    // Swap active states
    const blueActive = blue.active;
    blue.active = green.active;
    green.active = blueActive;
    
    // Update traffic percentages
    const blueTraffic = blue.trafficPercentage;
    blue.trafficPercentage = green.trafficPercentage;
    green.trafficPercentage = blueTraffic;
    
    this.deploymentEnvironments.set(blueEnv, blue);
    this.deploymentEnvironments.set(greenEnv, green);
    
    logger.info('Environment states updated', { blueEnv, greenEnv, blue, green });
  }
}
```

### Rolling Deployment Implementation

```javascript
// services/rollingDeployment.js - Rolling deployment for gradual updates
const logger = require('../lib/logger');

class RollingDeployment {
  constructor() {
    this.deploymentConfig = {
      batchSize: 2, // Update 2 instances at a time
      batchDelay: 60000, // 1 minute between batches
      healthCheckTimeout: 300000, // 5 minutes
      maxFailureRate: 10, // 10% failure rate threshold
      rollbackThreshold: 5 // 5% error rate triggers rollback
    };
  }
  
  async executeRollingDeployment(config) {
    const {
      instances,
      application,
      version,
      environment = 'production'
    } = config;
    
    const deploymentId = this.generateDeploymentId();
    
    logger.info('Starting rolling deployment', { 
      deploymentId, 
      instanceCount: instances.length, 
      application, 
      version 
    });
    
    try {
      const batches = this.createBatches(instances, this.deploymentConfig.batchSize);
      const deploymentResults = [];
      
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        
        logger.info(`Processing batch ${batchIndex + 1}/${batches.length}`, { 
          deploymentId, 
          batchInstances: batch.map(i => i.id) 
        });
        
        // Deploy to batch
        const batchResult = await this.deployBatch(batch, application, version, deploymentId);
        deploymentResults.push(batchResult);
        
        if (!batchResult.success) {
          // Rollback entire deployment
          await this.rollbackRollingDeployment(deploymentResults, deploymentId);
          throw new Error(`Batch ${batchIndex + 1} deployment failed`);
        }
        
        // Health check batch
        const healthResult = await this.healthCheckBatch(batch, deploymentId);
        
        if (!healthResult.healthy) {
          // Rollback batch
          await this.rollbackBatch(batch, deploymentId);
          throw new Error(`Batch ${batchIndex + 1} health check failed`);
        }
        
        // Monitor batch performance
        const performanceResult = await this.monitorBatchPerformance(batch, deploymentId);
        
        if (performanceResult.errorRate > this.deploymentConfig.rollbackThreshold) {
          await this.rollbackBatch(batch, deploymentId);
          throw new Error(`Batch ${batchIndex + 1} performance degradation detected`);
        }
        
        // Wait before next batch (except for last batch)
        if (batchIndex < batches.length - 1) {
          logger.info('Waiting before next batch', { 
            deploymentId, 
            delay: this.deploymentConfig.batchDelay 
          });
          await this.sleep(this.deploymentConfig.batchDelay);
        }
      }
      
      const deploymentSummary = {
        deploymentId,
        success: true,
        application,
        version,
        environment,
        totalInstances: instances.length,
        batchesProcessed: batches.length,
        deploymentResults,
        completedAt: new Date().toISOString()
      };
      
      logger.info('Rolling deployment completed successfully', deploymentSummary);
      return deploymentSummary;
      
    } catch (error) {
      logger.error('Rolling deployment failed', { deploymentId, error: error.message });
      throw error;
    }
  }
  
  async deployBatch(batch, application, version, deploymentId) {
    logger.info('Deploying batch', { deploymentId, batchSize: batch.length });
    
    const deploymentPromises = batch.map(instance => 
      this.deployToInstance(instance, application, version, deploymentId)
    );
    
    const results = await Promise.allSettled(deploymentPromises);
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    return {
      success: failed === 0,
      successful,
      failed,
      results: results.map(result => 
        result.status === 'fulfilled' ? result.value : { error: result.reason.message }
      )
    };
  }
  
  async healthCheckBatch(batch, deploymentId) {
    logger.info('Health checking batch', { deploymentId, batchSize: batch.length });
    
    const healthCheckPromises = batch.map(instance => 
      this.healthCheckInstance(instance, deploymentId)
    );
    
    const results = await Promise.allSettled(healthCheckPromises);
    
    const healthyInstances = results.filter(result => 
      result.status === 'fulfilled' && result.value.healthy
    ).length;
    
    const totalInstances = batch.length;
    const healthyPercentage = (healthyInstances / totalInstances) * 100;
    
    return {
      healthy: healthyPercentage >= 90, // 90% must be healthy
      healthyInstances,
      totalInstances,
      healthyPercentage: `${healthyPercentage}%`,
      results: results.map(result => 
        result.status === 'fulfilled' ? result.value : { healthy: false, error: result.reason.message }
      )
    };
  }
  
  async monitorBatchPerformance(batch, deploymentId) {
    logger.info('Monitoring batch performance', { deploymentId, batchSize: batch.length });
    
    const monitoringDuration = 300000; // 5 minutes
    const monitoringInterval = 30000; // 30 seconds
    
    const metrics = {
      responseTimes: [],
      errorRates: [],
      throughput: [],
      resourceUsage: []
    };
    
    const monitoringStart = Date.now();
    
    while (Date.now() - monitoringStart < monitoringDuration) {
      const batchMetrics = await this.collectBatchMetrics(batch);
      
      metrics.responseTimes.push(batchMetrics.avgResponseTime);
      metrics.errorRates.push(batchMetrics.errorRate);
      metrics.throughput.push(batchMetrics.throughput);
      metrics.resourceUsage.push(batchMetrics.avgResourceUsage);
      
      await this.sleep(monitoringInterval);
    }
    
    const avgErrorRate = metrics.errorRates.reduce((sum, rate) => sum + rate, 0) / metrics.errorRates.length;
    
    return {
      errorRate: avgErrorRate,
      avgResponseTime: metrics.responseTimes.reduce((sum, time) => sum + time, 0) / metrics.responseTimes.length,
      avgThroughput: metrics.throughput.reduce((sum, throughput) => sum + throughput, 0) / metrics.throughput.length,
      avgResourceUsage: metrics.resourceUsage.reduce((sum, usage) => sum + usage, 0) / metrics.resourceUsage.length,
      monitoringDuration
    };
  }
  
  async rollbackBatch(batch, deploymentId) {
    logger.info('Rolling back batch', { deploymentId, batchSize: batch.length });
    
    const rollbackPromises = batch.map(instance => 
      this.rollbackInstance(instance, deploymentId)
    );
    
    const results = await Promise.allSettled(rollbackPromises);
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    logger.info('Batch rollback completed', { 
      deploymentId, 
      successful, 
      failed, 
      total: batch.length 
    });
    
    return { successful, failed };
  }
  
  createBatches(instances, batchSize) {
    const batches = [];
    
    for (let i = 0; i < instances.length; i += batchSize) {
      batches.push(instances.slice(i, i + batchSize));
    }
    
    return batches;
  }
  
  generateDeploymentId() {
    return `rolling-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Canary Deployment Implementation

```javascript
// services/canaryDeployment.js - Advanced canary deployment with traffic shaping
const logger = require('../lib/logger');

class CanaryDeployment {
  constructor() {
    this.canaryConfig = {
      steps: [
        { trafficPercentage: 1, duration: 600000 }, // 1% for 10 minutes
        { trafficPercentage: 5, duration: 900000 }, // 5% for 15 minutes
        { trafficPercentage: 25, duration: 1800000 }, // 25% for 30 minutes
        { trafficPercentage: 50, duration: 3600000 }, // 50% for 1 hour
        { trafficPercentage: 100, duration: 1800000 } // 100% for 30 minutes
      ],
      metricsThresholds: {
        errorRate: 2, // 2% error rate threshold
        responseTime: 2000, // 2 second response time threshold
        availability: 99.5 // 99.5% availability threshold
      }
    };
  }
  
  async executeCanaryDeployment(config) {
    const {
      baselineVersion,
      canaryVersion,
      environment = 'production',
      application
    } = config;
    
    const deploymentId = this.generateDeploymentId();
    
    logger.info('Starting canary deployment', { 
      deploymentId, 
      baselineVersion, 
      canaryVersion, 
      environment 
    });
    
    try {
      const canaryResults = [];
      
      for (let stepIndex = 0; stepIndex < this.canaryConfig.steps.length; stepIndex++) {
        const step = this.canaryConfig.steps[stepIndex];
        
        logger.info(`Canary step ${stepIndex + 1}/${this.canaryConfig.steps.length}`, { 
          deploymentId, 
          trafficPercentage: step.trafficPercentage,
          duration: step.duration 
        });
        
        // Update traffic routing
        await this.updateCanaryTraffic(step.trafficPercentage);
        
        // Monitor canary performance
        const monitoringResult = await this.monitorCanaryPerformance(
          step, 
          deploymentId
        );
        
        canaryResults.push({
          step: stepIndex + 1,
          trafficPercentage: step.trafficPercentage,
          monitoring: monitoringResult,
          timestamp: new Date().toISOString()
        });
        
        // Check if we should continue
        if (!this.shouldContinueCanary(monitoringResult)) {
          logger.warn('Canary deployment failed, initiating rollback', { 
            deploymentId, 
            step: stepIndex + 1 
          });
          
          await this.rollbackCanaryDeployment(deploymentId);
          throw new Error(`Canary deployment failed at step ${stepIndex + 1}`);
        }
        
        // Wait for step duration (except for last step)
        if (stepIndex < this.canaryConfig.steps.length - 1) {
          logger.info('Waiting for step duration', { 
            deploymentId, 
            duration: step.duration 
          });
          await this.sleep(step.duration);
        }
      }
      
      const canarySummary = {
        deploymentId,
        success: true,
        baselineVersion,
        canaryVersion,
        environment,
        application,
        steps: canaryResults,
        completedAt: new Date().toISOString()
      };
      
      logger.info('Canary deployment completed successfully', canarySummary);
      return canarySummary;
      
    } catch (error) {
      logger.error('Canary deployment failed', { deploymentId, error: error.message });
      throw error;
    }
  }
  
  async monitorCanaryPerformance(step, deploymentId) {
    logger.info('Monitoring canary performance', { 
      deploymentId, 
      trafficPercentage: step.trafficPercentage,
      duration: step.duration 
    });
    
    const monitoringStart = Date.now();
    const metrics = {
      errorRates: [],
      responseTimes: [],
      throughput: [],
      availability: []
    };
    
    while (Date.now() - monitoringStart < step.duration) {
      const currentMetrics = await this.collectCanaryMetrics();
      
      metrics.errorRates.push(currentMetrics.errorRate);
      metrics.responseTimes.push(currentMetrics.avgResponseTime);
      metrics.throughput.push(currentMetrics.throughput);
      metrics.availability.push(currentMetrics.availability);
      
      // Check thresholds continuously
      if (this.violatesThresholds(currentMetrics)) {
        logger.warn('Canary metrics violate thresholds', { 
          deploymentId, 
          metrics: currentMetrics 
        });
        
        return {
          success: false,
          reason: 'Threshold violation',
          metrics: currentMetrics,
          duration: Date.now() - monitoringStart
        };
      }
      
      await this.sleep(30000); // Check every 30 seconds
    }
    
    const avgMetrics = {
      errorRate: metrics.errorRates.reduce((sum, rate) => sum + rate, 0) / metrics.errorRates.length,
      avgResponseTime: metrics.responseTimes.reduce((sum, time) => sum + time, 0) / metrics.responseTimes.length,
      throughput: metrics.throughput.reduce((sum, t) => sum + t, 0) / metrics.throughput.length,
      availability: metrics.availability.reduce((sum, a) => sum + a, 0) / metrics.availability.length
    };
    
    return {
      success: true,
      metrics: avgMetrics,
      duration: Date.now() - monitoringStart,
      dataPoints: metrics.errorRates.length
    };
  }
  
  shouldContinueCanary(monitoringResult) {
    if (!monitoringResult.success) {
      return false;
    }
    
    const metrics = monitoringResult.metrics;
    const thresholds = this.canaryConfig.metricsThresholds;
    
    return (
      metrics.errorRate <= thresholds.errorRate &&
      metrics.avgResponseTime <= thresholds.responseTime &&
      metrics.availability >= thresholds.availability
    );
  }
  
  violatesThresholds(metrics) {
    const thresholds = this.canaryConfig.metricsThresholds;
    
    return (
      metrics.errorRate > thresholds.errorRate ||
      metrics.avgResponseTime > thresholds.responseTime ||
      metrics.availability < thresholds.availability
    );
  }
  
  async updateCanaryTraffic(percentage) {
    logger.info('Updating canary traffic routing', { trafficPercentage: percentage });
    
    // Update load balancer rules
    await this.updateLoadBalancerWeights(percentage);
    
    // Update CDN routing rules
    await this.updateCDNRouting(percentage);
    
    // Update DNS weighted routing
    await this.updateDNSWeights(percentage);
  }
  
  async rollbackCanaryDeployment(deploymentId) {
    logger.info('Rolling back canary deployment', { deploymentId });
    
    try {
      // Switch all traffic back to baseline
      await this.updateCanaryTraffic(0);
      
      // Verify rollback
      const rollbackResult = await this.verifyRollback();
      
      if (!rollbackResult.success) {
        throw new Error('Rollback verification failed');
      }
      
      logger.info('Canary deployment rollback completed', { deploymentId });
      
    } catch (error) {
      logger.error('Canary deployment rollback failed', { deploymentId, error: error.message });
      throw error;
    }
  }
  
  generateDeploymentId() {
    return `canary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Deployment Monitoring and Validation

```javascript
// services/deploymentMonitoring.js - Real-time deployment monitoring
const logger = require('../lib/logger');
const EventEmitter = require('events');

class DeploymentMonitoring extends EventEmitter {
  constructor() {
    super();
    this.activeDeployments = new Map();
    this.deploymentMetrics = new Map();
    this.setupMonitoring();
  }
  
  setupMonitoring() {
    // Monitor active deployments every 30 seconds
    setInterval(() => {
      this.monitorActiveDeployments();
    }, 30000);
    
    // Collect deployment metrics every minute
    setInterval(() => {
      this.collectDeploymentMetrics();
    }, 60000);
    
    // Generate deployment reports hourly
    setInterval(() => {
      this.generateDeploymentReport();
    }, 3600000);
  }
  
  startDeploymentMonitoring(deploymentId, deploymentConfig) {
    logger.info('Starting deployment monitoring', { deploymentId });
    
    const monitoringData = {
      deploymentId,
      config: deploymentConfig,
      startTime: new Date().toISOString(),
      status: 'monitoring',
      metrics: {
        healthChecks: [],
        performance: [],
        errorRates: [],
        availability: []
      },
      alerts: []
    };
    
    this.activeDeployments.set(deploymentId, monitoringData);
    this.emit('deploymentStarted', monitoringData);
    
    return monitoringData;
  }
  
  updateDeploymentMetrics(deploymentId, metrics) {
    const deployment = this.activeDeployments.get(deploymentId);
    
    if (!deployment) {
      logger.warn('Deployment not found for metrics update', { deploymentId });
      return;
    }
    
    // Update metrics
    deployment.metrics.healthChecks.push({
      timestamp: new Date().toISOString(),
      ...metrics.healthCheck
    });
    
    deployment.metrics.performance.push({
      timestamp: new Date().toISOString(),
      ...metrics.performance
    });
    
    deployment.metrics.errorRates.push({
      timestamp: new Date().toISOString(),
      ...metrics.errorRates
    });
    
    deployment.metrics.availability.push({
      timestamp: new Date().toISOString(),
      ...metrics.availability
    });
    
    // Check for alerts
    this.checkDeploymentAlerts(deployment, metrics);
    
    this.emit('metricsUpdated', { deploymentId, metrics });
  }
  
  checkDeploymentAlerts(deployment, metrics) {
    const alerts = [];
    
    // High error rate alert
    if (metrics.errorRates.rate > 10) {
      alerts.push({
        type: 'high_error_rate',
        severity: 'critical',
        message: `High error rate detected: ${metrics.errorRates.rate}%`,
        threshold: 10,
        current: metrics.errorRates.rate
      });
    }
    
    // Slow response time alert
    if (metrics.performance.avgResponseTime > 5000) {
      alerts.push({
        type: 'slow_response',
        severity: 'warning',
        message: `Slow response time detected: ${metrics.performance.avgResponseTime}ms`,
        threshold: 5000,
        current: metrics.performance.avgResponseTime
      });
    }
    
    // Low availability alert
    if (metrics.availability.percentage < 95) {
      alerts.push({
        type: 'low_availability',
        severity: 'critical',
        message: `Low availability detected: ${metrics.availability.percentage}%`,
        threshold: 95,
        current: metrics.availability.percentage
      });
    }
    
    if (alerts.length > 0) {
      deployment.alerts.push(...alerts);
      this.emit('deploymentAlert', { deploymentId: deployment.deploymentId, alerts });
    }
  }
  
  completeDeploymentMonitoring(deploymentId, success = true, error = null) {
    const deployment = this.activeDeployments.get(deploymentId);
    
    if (!deployment) {
      logger.warn('Deployment not found for completion', { deploymentId });
      return;
    }
    
    deployment.status = success ? 'completed' : 'failed';
    deployment.endTime = new Date().toISOString();
    deployment.duration = new Date(deployment.endTime) - new Date(deployment.startTime);
    
    if (error) {
      deployment.error = error;
    }
    
    this.emit('deploymentCompleted', deployment);
    
    // Move to historical data
    this.deploymentMetrics.set(deploymentId, deployment);
    this.activeDeployments.delete(deploymentId);
    
    logger.info('Deployment monitoring completed', { 
      deploymentId, 
      success, 
      duration: deployment.duration 
    });
    
    return deployment;
  }
  
  async monitorActiveDeployments() {
    for (const [deploymentId, deployment] of this.activeDeployments) {
      try {
        // Check deployment health
        const healthStatus = await this.checkDeploymentHealth(deployment);
        
        // Check deployment performance
        const performanceStatus = await this.checkDeploymentPerformance(deployment);
        
        // Update metrics
        this.updateDeploymentMetrics(deploymentId, {
          healthCheck: healthStatus,
          performance: performanceStatus,
          errorRates: await this.getErrorRates(deployment),
          availability: await this.getAvailability(deployment)
        });
        
      } catch (error) {
        logger.error('Error monitoring deployment', { deploymentId, error: error.message });
      }
    }
  }
  
  async generateDeploymentReport() {
    const report = {
      timestamp: new Date().toISOString(),
      period: 'last_hour',
      activeDeployments: this.activeDeployments.size,
      completedDeployments: this.deploymentMetrics.size,
      successRate: await this.calculateSuccessRate(),
      averageDuration: await this.calculateAverageDuration(),
      commonIssues: await this.identifyCommonIssues()
    };
    
    this.emit('deploymentReport', report);
    
    logger.info('Deployment report generated', report);
    
    return report;
  }
  
  async calculateSuccessRate() {
    const recentDeployments = Array.from(this.deploymentMetrics.values())
      .filter(d => new Date(d.startTime) > new Date(Date.now() - 3600000)); // Last hour
    
    if (recentDeployments.length === 0) return 100;
    
    const successful = recentDeployments.filter(d => d.status === 'completed').length;
    return Math.round((successful / recentDeployments.length) * 100);
  }
  
  async calculateAverageDuration() {
    const recentDeployments = Array.from(this.deploymentMetrics.values())
      .filter(d => d.status === 'completed' && d.duration)
      .slice(-20); // Last 20 deployments
    
    if (recentDeployments.length === 0) return 0;
    
    const totalDuration = recentDeployments.reduce((sum, d) => sum + d.duration, 0);
    return Math.round(totalDuration / recentDeployments.length);
  }
}

module.exports = new DeploymentMonitoring();
```

This comprehensive zero-downtime deployment implementation provides:

1. **Blue-Green Deployment**: Complete environment switching with health validation
2. **Rolling Deployment**: Gradual instance updates with batch monitoring
3. **Canary Deployment**: Progressive traffic shifting with metrics-based decisions
4. **Real-time Monitoring**: Continuous health and performance monitoring
5. **Automatic Rollback**: Intelligent rollback mechanisms based on failure detection
6. **Traffic Management**: Sophisticated traffic routing and load balancing
7. **Deployment Validation**: Comprehensive smoke testing and performance validation

The system ensures zero downtime during deployments while maintaining service quality and providing rapid recovery capabilities in case of issues.

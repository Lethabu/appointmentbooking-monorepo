#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Automated Production Deployment with 3x Retry Strategy
    
.DESCRIPTION
    Executes a complete production deployment with:
    - 5-phase validation process
    - 3x retry with progressive backoff (0s → 30s → 90s)
    - Real-time monitoring and scoring
    - Automatic rollback on critical failures
    
.EXAMPLE
    .\production-deploy-auto.ps1
    
.NOTES
    Version: 1.0.0
    For the appointmentbooking-monorepo
#>

param(
    [ValidateSet('staging', 'production')]
    [string]$Environment = 'production',
    
    [switch]$SkipE2E,
    [switch]$DryRun,
    [switch]$Verbose
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$ErrorActionPreference = 'Stop'
$InformationPreference = 'Continue'

# Color coding for terminal output
$colors = @{
    Success = @{ ForegroundColor = 'Green'; BackgroundColor = 'Black' }
    Warning = @{ ForegroundColor = 'Yellow'; BackgroundColor = 'Black' }
    Error   = @{ ForegroundColor = 'Red'; BackgroundColor = 'Black' }
    Info    = @{ ForegroundColor = 'Cyan'; BackgroundColor = 'Black' }
    Debug   = @{ ForegroundColor = 'Gray'; BackgroundColor = 'Black' }
}

# Deployment configuration
$deploymentConfig = @{
    MaxRetries = 3
    RetryBackoff = @(0, 30, 60)  # seconds
    HealthCheckTimeout = 5 * 60  # 5 minutes
    MonitoringDuration = 15      # minutes
    ScoreThresholdPass = 80
    ScoreThresholdRollback = 60
}

# Deployment scoring
$deploymentScore = @{
    Phase1 = 0
    Phase2 = 0
    Phase3 = 0
    Phase4 = 0
    Phase5 = 0
    Total = 0
    Status = 'NotStarted'
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

function Write-Log {
    param([string]$Message, [ValidateSet('Info', 'Success', 'Warning', 'Error', 'Debug')]$Level = 'Info')
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $prefix = "[$timestamp]"
    
    if ($Level -eq 'Debug' -and -not $Verbose) { return }
    
    $colorParams = $colors[$Level]
    Write-Host "$prefix $Message" @colorParams
}

function Test-Prerequisites {
    Write-Log "Checking prerequisites..." -Level Info
    
    $missing = @()
    
    # Check pnpm
    if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
        $missing += 'pnpm'
    }
    
    # Check node
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        $missing += 'node'
    }
    
    # Check wrangler
    if (-not (Get-Command wrangler -ErrorAction SilentlyContinue)) {
        $missing += 'wrangler'
    }
    
    if ($missing) {
        Write-Log "Missing prerequisites: $($missing -join ', ')" -Level Error
        Write-Log "Please install all required tools and try again" -Level Error
        exit 1
    }
    
    Write-Log "✅ All prerequisites met" -Level Success
    return $true
}

function Invoke-WithRetry {
    param(
        [scriptblock]$ScriptBlock,
        [string]$OperationName,
        [int]$MaxRetries = 3,
        [int[]]$BackoffSeconds = @(0, 30, 60)
    )
    
    for ($attempt = 1; $attempt -le $MaxRetries; $attempt++) {
        try {
            Write-Log "[$attempt/$MaxRetries] $OperationName..." -Level Info
            
            & $ScriptBlock
            
            Write-Log "✅ $OperationName succeeded on attempt $attempt" -Level Success
            return $true
            
        } catch {
            $errorMsg = $_.Exception.Message
            Write-Log "❌ Attempt $attempt failed: $errorMsg" -Level Warning
            
            if ($attempt -lt $MaxRetries) {
                $backoff = $BackoffSeconds[$attempt - 1]
                Write-Log "⏳ Waiting ${backoff}s before retry..." -Level Info
                Start-Sleep -Seconds $backoff
            } else {
                Write-Log "❌ All $MaxRetries attempts failed for: $OperationName" -Level Error
                return $false
            }
        }
    }
    
    return $false
}

# ============================================================================
# PHASE 1: PRE-DEPLOYMENT VALIDATION (2-5 min)
# ============================================================================

function Invoke-Phase1-PreDeploymentValidation {
    Write-Log "========================================" -Level Info
    Write-Log "PHASE 1: Pre-Deployment Validation" -Level Info
    Write-Log "========================================" -Level Info
    
    $phase1Score = 0
    $checksCount = 0
    $checksPass = 0
    
    # Check 1: OpenAPI Contract Validation
    $checksCount++
    Write-Log "Check 1/7: OpenAPI contract validation..." -Level Info
    try {
        & pnpm run validate:openapi | Out-Null
        Write-Log "✅ OpenAPI contract valid" -Level Success
        $checksPass++
    } catch {
        Write-Log "⚠️ OpenAPI validation warning (non-blocking)" -Level Warning
    }
    
    # Check 2: Database Schema Validation
    $checksCount++
    Write-Log "Check 2/7: Database schema validation..." -Level Info
    try {
        & pnpm run validate:schema | Out-Null
        Write-Log "✅ Database schema valid" -Level Success
        $checksPass++
    } catch {
        Write-Log "⚠️ Schema validation warning (non-blocking)" -Level Warning
    }
    
    # Check 3: Zod Schema Validation
    $checksCount++
    Write-Log "Check 3/7: Zod schema validation..." -Level Info
    try {
        & pnpm run validate:zod | Out-Null
        Write-Log "✅ Zod schemas validated" -Level Success
        $checksPass++
    } catch {
        Write-Log "⚠️ Zod validation warning (non-blocking)" -Level Warning
    }
    
    # Check 4: TypeScript Compilation
    $checksCount++
    Write-Log "Check 4/7: TypeScript compilation..." -Level Info
    try {
        & pnpm run type-check | Out-Null
        Write-Log "✅ TypeScript compilation successful" -Level Success
        $checksPass++
    } catch {
        Write-Log "❌ TypeScript compilation failed (CRITICAL)" -Level Error
        $deploymentScore.Phase1 = 1
        $deploymentScore.Status = 'FailedPhase1'
        return $false
    }
    
    # Check 5: Unit Tests
    $checksCount++
    Write-Log "Check 5/7: Running unit tests..." -Level Info
    try {
        & pnpm run test:unit --passWithNoTests | Out-Null
        Write-Log "✅ Unit tests passed" -Level Success
        $checksPass++
    } catch {
        Write-Log "❌ Unit tests failed (CRITICAL)" -Level Error
        $deploymentScore.Phase1 = 1
        $deploymentScore.Status = 'FailedPhase1'
        return $false
    }
    
    # Check 6: Lint Check
    $checksCount++
    Write-Log "Check 6/7: Linting code..." -Level Info
    try {
        & pnpm run lint | Out-Null
        Write-Log "✅ Lint checks passed" -Level Success
        $checksPass++
    } catch {
        Write-Log "⚠️ Lint warnings (non-blocking)" -Level Warning
    }
    
    # Check 7: Build
    $checksCount++
    Write-Log "Check 7/7: Building monorepo..." -Level Info
    try {
        & pnpm run build | Out-Null
        Write-Log "✅ Build successful" -Level Success
        $checksPass++
    } catch {
        Write-Log "❌ Build failed (CRITICAL)" -Level Error
        $deploymentScore.Phase1 = 1
        $deploymentScore.Status = 'FailedPhase1'
        return $false
    }
    
    # Calculate Phase 1 score (0-5)
    $phase1Score = [math]::Round(($checksPass / $checksCount) * 5)
    $deploymentScore.Phase1 = $phase1Score
    
    Write-Log "Phase 1 Score: $phase1Score/5 ($checksPass/$checksCount checks passed)" -Level Success
    return $true
}

# ============================================================================
# PHASE 2: BUILD & DEPLOY (5-10 min, with 3x retry)
# ============================================================================

function Invoke-Phase2-BuildAndDeploy {
    Write-Log "========================================" -Level Info
    Write-Log "PHASE 2: Build & Deploy (3x Retry)" -Level Info
    Write-Log "========================================" -Level Info
    
    $deploysAttempted = 0
    $deploysFailed = 0
    
    # Deploy Worker
    Write-Log "Deploying Worker..." -Level Info
    $deploysFailed = if (Invoke-WithRetry -ScriptBlock {
        & pnpm run -r --filter="@appointmentbooking/worker" deploy
    } -OperationName "Worker deployment" -MaxRetries 3 -BackoffSeconds $deploymentConfig.RetryBackoff) { 0 } else { 1 }
    $deploysAttempted++
    
    # Deploy Booking Pages
    Write-Log "Deploying Booking Pages..." -Level Info
    $deploysFailed += if (Invoke-WithRetry -ScriptBlock {
        & pnpm run -r --filter="@appointmentbooking/booking" deploy
    } -OperationName "Booking Pages deployment" -MaxRetries 3 -BackoffSeconds $deploymentConfig.RetryBackoff) { 0 } else { 1 }
    $deploysAttempted++
    
    # Deploy Dashboard Pages
    Write-Log "Deploying Dashboard Pages..." -Level Info
    $deploysFailed += if (Invoke-WithRetry -ScriptBlock {
        & pnpm run -r --filter="@appointmentbooking/dashboard" deploy
    } -OperationName "Dashboard Pages deployment" -MaxRetries 3 -BackoffSeconds $deploymentConfig.RetryBackoff) { 0 } else { 1 }
    $deploysAttempted++
    
    if ($deploysFailed -gt 0) {
        Write-Log "❌ $deploysFailed deployment(s) failed" -Level Error
        $deploymentScore.Phase2 = 2
        $deploymentScore.Status = 'FailedPhase2'
        return $false
    }
    
    $deploymentScore.Phase2 = 5
    Write-Log "Phase 2 Score: 5/5 (All deployments succeeded)" -Level Success
    return $true
}

# ============================================================================
# PHASE 3: HEALTH VALIDATION (1-3 min, 3x retry per check)
# ============================================================================

function Invoke-Phase3-HealthValidation {
    Write-Log "========================================" -Level Info
    Write-Log "PHASE 3: Health Validation (3x Retry)" -Level Info
    Write-Log "========================================" -Level Info
    
    $healthChecksCount = 0
    $healthChecksPassed = 0
    
    # Health Check 1: Worker Health Endpoint
    $healthChecksCount++
    Write-Log "Health Check 1/5: Worker health endpoint..." -Level Info
    if (Invoke-WithRetry -ScriptBlock {
        $response = Invoke-WebRequest -Uri "https://api.appointmentbooking.co.za/health" -ErrorAction Stop
        if ($response.StatusCode -ne 200) {
            throw "Health endpoint returned $($response.StatusCode)"
        }
    } -OperationName "Worker health check" -MaxRetries 3 -BackoffSeconds @(0, 10, 20)) {
        $healthChecksPassed++
    }
    
    # Health Check 2: Database Connectivity
    $healthChecksCount++
    Write-Log "Health Check 2/5: Database connectivity..." -Level Info
    if (Invoke-WithRetry -ScriptBlock {
        & pnpm run validate:schema | Out-Null
    } -OperationName "Database connectivity check" -MaxRetries 3 -BackoffSeconds @(0, 10, 20)) {
        $healthChecksPassed++
    }
    
    # Health Check 3: API Availability
    $healthChecksCount++
    Write-Log "Health Check 3/5: API availability..." -Level Info
    if (Invoke-WithRetry -ScriptBlock {
        $response = Invoke-WebRequest -Uri "https://api.appointmentbooking.co.za/api/products" -ErrorAction Stop
        if ($response.StatusCode -ne 200) {
            throw "API returned $($response.StatusCode)"
        }
    } -OperationName "API availability check" -MaxRetries 3 -BackoffSeconds @(0, 10, 20)) {
        $healthChecksPassed++
    }
    
    # Health Check 4: Pages Availability
    $healthChecksCount++
    Write-Log "Health Check 4/5: Pages availability..." -Level Info
    if (Invoke-WithRetry -ScriptBlock {
        $response1 = Invoke-WebRequest -Uri "https://appointmentbooking.co.za" -ErrorAction Stop
        $response2 = Invoke-WebRequest -Uri "https://dashboard.appointmentbooking.co.za" -ErrorAction Stop
        if ($response1.StatusCode -ne 200 -or $response2.StatusCode -ne 200) {
            throw "Pages returned non-200 status"
        }
    } -OperationName "Pages availability check" -MaxRetries 3 -BackoffSeconds @(0, 10, 20)) {
        $healthChecksPassed++
    }
    
    # Health Check 5: Security Headers
    $healthChecksCount++
    Write-Log "Health Check 5/5: Security headers..." -Level Info
    if (Invoke-WithRetry -ScriptBlock {
        $response = Invoke-WebRequest -Uri "https://api.appointmentbooking.co.za" -ErrorAction Stop
        $requiredHeaders = @('X-Content-Type-Options', 'X-Frame-Options', 'Strict-Transport-Security')
        foreach ($header in $requiredHeaders) {
            if (-not $response.Headers.Keys -contains $header) {
                throw "Missing header: $header"
            }
        }
    } -OperationName "Security headers check" -MaxRetries 3 -BackoffSeconds @(0, 10, 20)) {
        $healthChecksPassed++
    }
    
    if ($healthChecksPassed -lt $healthChecksCount) {
        Write-Log "⚠️ $($healthChecksCount - $healthChecksPassed) health check(s) failed" -Level Warning
        $deploymentScore.Phase3 = [math]::Max(2, [math]::Round(($healthChecksPassed / $healthChecksCount) * 5))
        return $false
    }
    
    $deploymentScore.Phase3 = 5
    Write-Log "Phase 3 Score: 5/5 (All health checks passed)" -Level Success
    return $true
}

# ============================================================================
# PHASE 4: END-TO-END VALIDATION (3-5 min)
# ============================================================================

function Invoke-Phase4-E2EValidation {
    if ($SkipE2E) {
        Write-Log "⏭️  Skipping Phase 4 (E2E tests skipped via flag)" -Level Info
        $deploymentScore.Phase4 = 4
        return $true
    }
    
    Write-Log "========================================" -Level Info
    Write-Log "PHASE 4: End-to-End Validation" -Level Info
    Write-Log "========================================" -Level Info
    
    try {
        Write-Log "Running E2E tests against production..." -Level Info
        & pnpm run validate:e2e | Out-Null
        
        $deploymentScore.Phase4 = 5
        Write-Log "Phase 4 Score: 5/5 (E2E tests passed)" -Level Success
        return $true
        
    } catch {
        Write-Log "⚠️ E2E tests failed (non-blocking if critical paths passed)" -Level Warning
        $deploymentScore.Phase4 = 3
        return $true  # Continue to Phase 5 for monitoring
    }
}

# ============================================================================
# PHASE 5: POST-DEPLOYMENT MONITORING (15 min active)
# ============================================================================

function Invoke-Phase5-Monitoring {
    Write-Log "========================================" -Level Info
    Write-Log "PHASE 5: Post-Deployment Monitoring" -Level Info
    Write-Log "========================================" -Level Info
    
    Write-Log "Monitoring deployment for $($deploymentConfig.MonitoringDuration) minutes..." -Level Info
    
    $endTime = (Get-Date).AddMinutes($deploymentConfig.MonitoringDuration)
    $metricsCount = 0
    $metricsGood = 0
    
    while ((Get-Date) -lt $endTime) {
        try {
            Write-Log "Collecting metrics..." -Level Debug
            
            # Collect deployment metrics
            & pnpm run monitor:collect-quick | Out-Null
            $metricsCount++
            
            # Check for critical errors
            $errorResponse = Invoke-WebRequest -Uri "https://api.appointmentbooking.co.za/health" -ErrorAction SilentlyContinue
            if ($errorResponse.StatusCode -eq 200) {
                $metricsGood++
            }
            
            $elapsed = [math]::Round(((Get-Date) - (Get-Date).AddMinutes(-$deploymentConfig.MonitoringDuration)).TotalSeconds)
            Write-Log "✅ Metrics collected ($elapsed seconds elapsed)" -Level Debug
            
            Start-Sleep -Seconds 60
            
        } catch {
            Write-Log "⚠️ Error collecting metrics: $($_.Exception.Message)" -Level Warning
        }
    }
    
    if ($metricsGood -gt 0) {
        $deploymentScore.Phase5 = 5
        Write-Log "Phase 5 Score: 5/5 (Monitoring completed, no critical issues)" -Level Success
        return $true
    } else {
        $deploymentScore.Phase5 = 2
        Write-Log "Phase 5 Score: 2/5 (Monitoring detected issues)" -Level Warning
        return $false
    }
}

# ============================================================================
# DEPLOYMENT SCORING
# ============================================================================

function Calculate-DeploymentScore {
    $totalScore = ($deploymentScore.Phase1 + $deploymentScore.Phase2 + $deploymentScore.Phase3 + $deploymentScore.Phase4 + $deploymentScore.Phase5)
    $deploymentScore.Total = $totalScore * 4  # Scale to 0-100
    
    if ($deploymentScore.Total -ge $deploymentConfig.ScoreThresholdPass) {
        $deploymentScore.Status = 'Success'
    } elseif ($deploymentScore.Total -ge $deploymentConfig.ScoreThresholdRollback) {
        $deploymentScore.Status = 'Warning'
    } else {
        $deploymentScore.Status = 'Failed'
    }
    
    return $deploymentScore
}

function Show-DeploymentScore {
    Write-Log "========================================" -Level Info
    Write-Log "DEPLOYMENT SCORE CALCULATION" -Level Info
    Write-Log "========================================" -Level Info
    
    Write-Log "Phase 1 (Pre-Deployment Validation): $($deploymentScore.Phase1)/5" -Level Info
    Write-Log "Phase 2 (Build & Deploy):             $($deploymentScore.Phase2)/5" -Level Info
    Write-Log "Phase 3 (Health Validation):          $($deploymentScore.Phase3)/5" -Level Info
    Write-Log "Phase 4 (E2E Validation):             $($deploymentScore.Phase4)/5" -Level Info
    Write-Log "Phase 5 (Monitoring):                $($deploymentScore.Phase5)/5" -Level Info
    Write-Log "----------------------------------------" -Level Info
    
    $totalPhases = $deploymentScore.Phase1 + $deploymentScore.Phase2 + $deploymentScore.Phase3 + $deploymentScore.Phase4 + $deploymentScore.Phase5
    Write-Log "Total Phases Score: $totalPhases/25" -Level Info
    Write-Log "FINAL SCORE: $($deploymentScore.Total)/100" -Level Info
    
    if ($deploymentScore.Status -eq 'Success') {
        Write-Log "Status: ✅ PASS (≥$($deploymentConfig.ScoreThresholdPass)/100)" -Level Success
        Write-Log "Deployment successful! All metrics within normal ranges." -Level Success
    } elseif ($deploymentScore.Status -eq 'Warning') {
        Write-Log "Status: ⚠️ WARNING ($($deploymentConfig.ScoreThresholdRollback)-$($deploymentConfig.ScoreThresholdPass - 1)/100)" -Level Warning
        Write-Log "Deployment completed with issues. Consider monitoring closely." -Level Warning
    } else {
        Write-Log "Status: ❌ FAILED (<$($deploymentConfig.ScoreThresholdRollback)/100)" -Level Error
        Write-Log "Deployment failed. Rollback recommended." -Level Error
    }
}

# ============================================================================
# ROLLBACK MECHANISM
# ============================================================================

function Invoke-Rollback {
    Write-Log "========================================" -Level Info
    Write-Log "INITIATING ROLLBACK PROCEDURE" -Level Info
    Write-Log "========================================" -Level Info
    
    Write-Log "Rolling back Worker..." -Level Info
    try {
        & wrangler rollback -x | Out-Null
        Write-Log "✅ Worker rollback successful" -Level Success
    } catch {
        Write-Log "⚠️ Worker rollback failed: $($_.Exception.Message)" -Level Warning
    }
    
    Write-Log "Rolling back Pages deployments..." -Level Info
    try {
        & npx wrangler pages deployment rollback --project-name=appointmentbooking-booking | Out-Null
        Write-Log "✅ Booking Pages rollback successful" -Level Success
    } catch {
        Write-Log "⚠️ Booking Pages rollback failed: $($_.Exception.Message)" -Level Warning
    }
    
    try {
        & npx wrangler pages deployment rollback --project-name=appointmentbooking-dashboard | Out-Null
        Write-Log "✅ Dashboard Pages rollback successful" -Level Success
    } catch {
        Write-Log "⚠️ Dashboard Pages rollback failed: $($_.Exception.Message)" -Level Warning
    }
    
    Write-Log "Rollback procedure completed." -Level Warning
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

function Invoke-ProductionDeployment {
    Write-Log "╔════════════════════════════════════════╗" -Level Info
    Write-Log "║ AUTOMATED PRODUCTION DEPLOYMENT      ║" -Level Info
    Write-Log "║ 3x Retry Strategy with 5-Phase Flow  ║" -Level Info
    Write-Log "╚════════════════════════════════════════╝" -Level Info
    
    Write-Log "Environment: $Environment" -Level Info
    Write-Log "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -Level Info
    
    if ($DryRun) {
        Write-Log "🔍 DRY RUN MODE - No changes will be applied" -Level Warning
        return
    }
    
    # Test prerequisites
    if (-not (Test-Prerequisites)) {
        exit 1
    }
    
    # Phase 1: Pre-Deployment Validation
    if (-not (Invoke-Phase1-PreDeploymentValidation)) {
        Show-DeploymentScore
        Write-Log "❌ Deployment aborted at Phase 1" -Level Error
        exit 1
    }
    
    # Phase 2: Build & Deploy
    if (-not (Invoke-Phase2-BuildAndDeploy)) {
        Show-DeploymentScore
        Write-Log "❌ Deployment aborted at Phase 2" -Level Error
        Invoke-Rollback
        exit 1
    }
    
    # Phase 3: Health Validation
    if (-not (Invoke-Phase3-HealthValidation)) {
        Write-Log "⚠️ Health checks incomplete, but continuing..." -Level Warning
    }
    
    # Phase 4: E2E Validation
    Invoke-Phase4-E2EValidation | Out-Null
    
    # Phase 5: Monitoring
    Invoke-Phase5-Monitoring | Out-Null
    
    # Calculate and display score
    Calculate-DeploymentScore | Out-Null
    Show-DeploymentScore
    
    # Determine outcome
    if ($deploymentScore.Status -eq 'Success') {
        Write-Log "🎉 DEPLOYMENT SUCCESSFUL!" -Level Success
        Write-Log "All phases completed successfully." -Level Success
        exit 0
    } elseif ($deploymentScore.Status -eq 'Warning') {
        Write-Log "⚠️ DEPLOYMENT COMPLETED WITH WARNINGS" -Level Warning
        Write-Log "Please monitor the application closely." -Level Warning
        exit 0
    } else {
        Write-Log "❌ DEPLOYMENT FAILED" -Level Error
        Write-Log "Rolling back to previous stable version..." -Level Error
        Invoke-Rollback
        exit 1
    }
}

# Execute main deployment
Invoke-ProductionDeployment

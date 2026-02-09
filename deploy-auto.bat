@echo off
REM ============================================================================
REM Automated Production Deployment - Windows Batch Launcher
REM ============================================================================
REM Usage: 
REM   deploy-auto.bat                - Full production deployment
REM   deploy-auto.bat staging          - Deploy to staging
REM   deploy-auto.bat skip-e2e         - Skip E2E tests
REM   deploy-auto.bat dry-run          - Dry run (no changes)
REM ============================================================================

setlocal enabledelayedexpansion

if "%1"=="" (
    echo Starting automated production deployment...
    node scripts/production-deploy-auto.js
) else if "%1"=="staging" (
    echo Starting automated staging deployment...
    set DEPLOY_ENV=staging
    node scripts/production-deploy-auto.js
) else if "%1"=="skip-e2e" (
    echo Starting deployment without E2E tests...
    node scripts/production-deploy-auto.js --skip-e2e
) else if "%1"=="dry-run" (
    echo Starting DRY RUN (no changes will be applied)...
    node scripts/production-deploy-auto.js --dry-run
) else if "%1"=="verbose" (
    echo Starting deployment with verbose logging...
    node scripts/production-deploy-auto.js --verbose
) else if "%1"=="help" (
    echo Automated Production Deployment Launcher
    echo.
    echo Usage: deploy-auto.bat [OPTION]
    echo.
    echo Options:
    echo   (empty)   Full production deployment
    echo   staging   Deploy to staging environment
    echo   skip-e2e  Skip E2E tests (faster)
    echo   dry-run   Show what would be deployed (no changes)
    echo   verbose   Show detailed logging
    echo   help      Show this help message
    echo.
) else (
    echo Unknown option: %1
    echo Run "deploy-auto.bat help" for usage information
    endlocal
    exit /b 1
)

endlocal

#!/bin/bash
################################################################################
# Automated Production Deployment - Unix/Linux/Mac Launcher
################################################################################
# Usage: 
#   ./deploy-auto.sh                - Full production deployment
#   ./deploy-auto.sh staging          - Deploy to staging
#   ./deploy-auto.sh skip-e2e         - Skip E2E tests
#   ./deploy-auto.sh dry-run          - Dry run (no changes)
################################################################################

set -e

case "$1" in
  "")
    echo "Starting automated production deployment..."
    node scripts/production-deploy-auto.js
    ;;
  "staging")
    echo "Starting automated staging deployment..."
    export DEPLOY_ENV=staging
    node scripts/production-deploy-auto.js
    ;;
  "skip-e2e")
    echo "Starting deployment without E2E tests..."
    node scripts/production-deploy-auto.js --skip-e2e
    ;;
  "dry-run")
    echo "Starting DRY RUN (no changes will be applied)..."
    node scripts/production-deploy-auto.js --dry-run
    ;;
  "verbose")
    echo "Starting deployment with verbose logging..."
    node scripts/production-deploy-auto.js --verbose
    ;;
  "help")
    echo "Automated Production Deployment Launcher"
    echo ""
    echo "Usage: ./deploy-auto.sh [OPTION]"
    echo ""
    echo "Options:"
    echo "  (empty)   Full production deployment"
    echo "  staging   Deploy to staging environment"
    echo "  skip-e2e  Skip E2E tests (faster)"
    echo "  dry-run   Show what would be deployed (no changes)"
    echo "  verbose   Show detailed logging"
    echo "  help      Show this help message"
    echo ""
    ;;
  *)
    echo "Unknown option: $1"
    echo "Run './deploy-auto.sh help' for usage information"
    exit 1
    ;;
esac

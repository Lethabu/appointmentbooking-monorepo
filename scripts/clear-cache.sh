#!/bin/bash
# Clear Cache and Free Disk Space for appointmentbooking-monorepo
# This script removes node_modules, build artifacts, caches, and temporary files

set -e

echo "=========================================="
echo "Cache & Disk Space Cleanup Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to calculate size
get_size() {
    if [ -d "$1" ]; then
        du -sh "$1" 2>/dev/null | cut -f1
    else
        echo "0"
    fi
}

# Function to format bytes to human readable
format_bytes() {
    local bytes=$1
    if [ "$bytes" -ge 1073741824 ]; then
        echo "$(echo "scale=2; $bytes/1073741824" | bc)GB"
    elif [ "$bytes" -ge 1048576 ]; then
        echo "$(echo "scale=2; $bytes/1048576" | bc)MB"
    elif [ "$bytes" -ge 1024 ]; then
        echo "$(echo "scale=2; $bytes/1024" | bc)KB"
    else
        echo "${bytes}B"
    fi
}

# Track total space freed
TOTAL_FREED=0

echo -e "${BLUE}📊 Initial Disk Usage${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Show root disk usage
ROOT_AVAILABLE=$(df -B1 / | tail -1 | awk '{print $4}')
echo "Root partition available: $(format_bytes $ROOT_AVAILABLE)"
echo ""

# List directories to be cleaned with their sizes
echo -e "${YELLOW}📁 Directories to be cleaned:${NC}"
echo ""

DIRS_TO_CLEAN=(
    "apps/booking/node_modules"
    "apps/dashboard/node_modules"
    "apps/marketing/node_modules"
    "apps/booking/.next"
    "apps/dashboard/.next"
    "apps/marketing/.next"
    "apps/booking/.turbo"
    "apps/dashboard/.turbo"
    "apps/marketing/.turbo"
    "apps/booking/.eslintcache"
    "apps/dashboard/.eslintcache"
    "apps/marketing/.eslintcache"
    "apps/booking/tsconfig.tsbuildinfo"
    "apps/dashboard/tsconfig.tsbuildinfo"
    "apps/marketing/tsconfig.tsbuildinfo"
    "apps/booking/coverage"
    "apps/booking/test-reports"
    "apps/booking/test-results"
    "apps/booking/.nyc_output"
    "node_modules"
    ".next"
    ".turbo"
    ".eslintcache"
    "packages/*/node_modules"
    "packages/*/.next"
    "packages/*/.turbo"
)

for dir in "${DIRS_TO_CLEAN[@]}"; do
    if [ -d "$dir" ]; then
        size=$(du -sb "$dir" 2>/dev/null | cut -f1)
        human_size=$(format_bytes $size)
        TOTAL_FREED=$((TOTAL_FREED + size))
        echo "  $dir: ${human_size}"
    fi
done

echo ""
echo -e "${YELLOW}🗑️  Cache directories to clear:${NC}"
echo ""

CACHES_TO_CLEAR=(
    "~/.npm"
    "~/.pnpm-store"
    "~/.cache/pnpm"
    "~/.cache/ms-playwright"
    "~/.cache/jest"
    "~/.cache/typescript"
    "~/Library/Caches/npm"  # macOS
    "~/Library/Caches/pnpm" # macOS
)

for cache in "${CACHES_TO_CLEAR[@]}"; do
    cache_expanded=${cache/#\~/$HOME}
    if [ -d "$cache_expanded" ]; then
        size=$(du -sb "$cache_expanded" 2>/dev/null | cut -f1)
        human_size=$(format_bytes $size)
        TOTAL_FREED=$((TOTAL_FREED + size))
        echo "  $cache: ${human_size}"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}Total space to be freed: $(format_bytes $TOTAL_FREED)${NC}"
echo ""

# Confirm before proceeding
read -p "Do you want to proceed with cleanup? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Cleanup cancelled${NC}"
    exit 0
fi

echo -e "${BLUE}🧹 Starting cleanup...${NC}"
echo ""

# Function to remove directory safely
remove_dir() {
    local dir=$1
    if [ -d "$dir" ]; then
        rm -rf "$dir"
        echo -e "${GREEN}✓ Removed:${NC} $dir"
    fi
}

# Function to clean cache
clean_cache() {
    local cache=$1
    local cache_expanded=${cache/#\~/$HOME}
    if [ -d "$cache_expanded" ]; then
        rm -rf "$cache_expanded"/*
        echo -e "${GREEN}✓ Cleared:${NC} $cache"
    fi
}

echo -e "${BLUE}🔧 Cleaning node_modules directories...${NC}"
echo ""

# Clean node_modules in all apps
remove_dir "apps/booking/node_modules"
remove_dir "apps/dashboard/node_modules"
remove_dir "apps/marketing/node_modules"

# Clean node_modules in packages
for pkg in packages/*/; do
    remove_dir "${pkg}node_modules"
done

# Clean root node_modules if exists
remove_dir "node_modules"

echo ""
echo -e "${BLUE}🔧 Cleaning build artifacts...${NC}"
echo ""

# Clean .next directories
remove_dir "apps/booking/.next"
remove_dir "apps/dashboard/.next"
remove_dir "apps/marketing/.next"
remove_dir ".next"

# Clean .turbo directories
remove_dir "apps/booking/.turbo"
remove_dir "apps/dashboard/.turbo"
remove_dir "apps/marketing/.turbo"
remove_dir ".turbo"

# Clean TypeScript build info
remove_dir "apps/booking/tsconfig.tsbuildinfo"
remove_dir "apps/dashboard/tsconfig.tsbuildinfo"
remove_dir "apps/marketing/tsconfig.tsbuildinfo"

# Clean test artifacts
remove_dir "apps/booking/coverage"
remove_dir "apps/booking/test-reports"
remove_dir "apps/booking/test-results"
remove_dir "apps/booking/.nyc_output"

# Clean ESLint cache
remove_dir "apps/booking/.eslintcache"
remove_dir "apps/dashboard/.eslintcache"
remove_dir "apps/marketing/.eslintcache"
remove_dir ".eslintcache"

echo ""
echo -e "${BLUE}🔧 Cleaning package manager caches...${NC}"
echo ""

# Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force 2>/dev/null || true

# Clean pnpm cache
echo "Cleaning pnpm cache..."
pnpm store prune 2>/dev/null || true

# Clean yarn cache
echo "Cleaning yarn cache..."
yarn cache clean 2>/dev/null || true

# Clean additional cache directories
clean_cache "~/.npm"
clean_cache "~/.pnpm-store"
clean_cache "~/.cache/pnpm"
clean_cache "~/.cache/ms-playwright"
clean_cache "~/.cache/jest"
clean_cache "~/.cache/typescript"
clean_cache "~/Library/Caches/npm"
clean_cache "~/Library/Caches/pnpm"

echo ""
echo -e "${BLUE}🔧 Cleaning log and temporary files...${NC}"
echo ""

# Clean log files
LOG_FILES=(
    "apps/booking/current-errors.log"
    "apps/booking/typescript-errors.log"
    "apps/booking/typescript-check.log"
    "apps/booking/test_output.txt"
    "apps/booking/lighthouse-report.json"
    "apps/booking/pages_build_log.txt"
    "apps/booking/pages_build_log_v2.txt"
    "apps/booking/booking_build_log.txt"
    "apps/booking/booking_build_log_v2.txt"
    "apps/booking/booking_build_log_v3.txt"
    "apps/booking/booking_build_log_v4.txt"
    "apps/booking/booking_build_log_v5.txt"
    "apps/booking/booking_build_log_v6.txt"
    "apps/booking/booking_build_log_v7.txt"
    "apps/booking/booking_build_log_v8.txt"
    "apps/booking/booking_lint_log.txt"
    "apps/booking/booking_lint_log_v2.txt"
    "apps/booking/build_log.txt"
    "apps/booking/build_log_cmd.txt"
    "deployment-log-*.txt"
    "deploy-output.txt"
)

for logfile in "${LOG_FILES[@]}"; do
    if ls $logfile >/dev/null 2>&1; then
        rm -f $logfile
        echo -e "${GREEN}✓ Removed:${NC} $logfile"
    fi
done

echo ""
echo -e "${BLUE}🔧 Cleaning temporary deployment files...${NC}"
echo ""

# Clean deployment artifacts
remove_dir "apps/booking/.vercel"
remove_dir ".vercel"
remove_dir "dist"
remove_dir "build"
remove_dir ".rts2-cache"

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Cleanup Complete${NC}"
echo "=========================================="
echo ""

# Final disk usage check
FINAL_AVAILABLE=$(df -B1 / | tail -1 | awk '{print $4}')
echo -e "${BLUE}📊 Final Disk Usage${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Root partition available: $(format_bytes $FINAL_AVAILABLE)"
echo ""
echo -e "${GREEN}✅ Monorepo structure verified:${NC}"
echo ""

# Verify critical directories still exist
CRITICAL_DIRS=(
    "apps/booking"
    "apps/dashboard"
    "apps/marketing"
    "packages"
    "scripts"
    "docs"
)

for dir in "${CRITICAL_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $dir"
    else
        echo -e "${RED}✗${NC} $dir - MISSING!"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}💡 Note: Run 'pnpm install' to restore node_modules${NC}"
echo "💡 Run 'pnpm build' to rebuild the application"
echo ""

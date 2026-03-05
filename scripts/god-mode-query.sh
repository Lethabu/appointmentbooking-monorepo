#!/bin/bash
# 🦅 God Mode D1 Query Bridge
# Sovereign Command Center - Direct Database Access
# 
# This script provides a safe bridge between VS Code Copilot and Cloudflare D1,
# enabling real-time production data queries without leaving the IDE.
# 
# Usage: ./scripts/god-mode-query.sh "SELECT * FROM bookings LIMIT 5"
# Usage: ./scripts/god-mode-query.sh "SELECT COUNT(*) as total FROM bookings WHERE status='confirmed'"

DB_NAME="appointmentbooking-db"
SQL_QUERY="$1"
ENVIRONMENT="${2:-remote}" # Default to remote production database

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
EAGLE='\U0001F985'
NC='\033[0m' # No Color

# Validation
if [ -z "$SQL_QUERY" ]; then
  echo -e "${RED}❌ Error: No query provided.${NC}"
  echo ""
  echo "Usage: $0 \"SQL_QUERY\" [local|remote]"
  echo ""
  echo "Examples:"
  echo "  $0 \"SELECT * FROM bookings LIMIT 5\""
  echo "  $0 \"SELECT COUNT(*) FROM tenant_config\" local"
  echo "  $0 \"SELECT * FROM bookings WHERE created_at > strftime('%s', 'now', '-7 days')\""
  exit 1
fi

# Safety check for destructive operations
if echo "$SQL_QUERY" | grep -iE "^\s*(DROP|DELETE|TRUNCATE|ALTER)" > /dev/null; then
  echo -e "${RED}⚠️  WARNING: Destructive operation detected!${NC}"
  echo -e "${YELLOW}Query: $SQL_QUERY${NC}"
  read -p "Are you sure you want to execute this? (type YES to confirm): " confirm
  if [ "$confirm" != "YES" ]; then
    echo -e "${YELLOW}Operation cancelled.${NC}"
    exit 0
  fi
fi

# Execute query
echo -e "${EAGLE} ${BLUE}Executing Sovereign Command on $DB_NAME ($ENVIRONMENT)...${NC}"
echo -e "${YELLOW}Query: $SQL_QUERY${NC}"
echo ""

if [ "$ENVIRONMENT" = "local" ]; then
  npx wrangler d1 execute "$DB_NAME" --local --command "$SQL_QUERY"
else
  npx wrangler d1 execute "$DB_NAME" --remote --command "$SQL_QUERY"
fi

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✅ Sovereign Command executed successfully${NC}"
else
  echo ""
  echo -e "${RED}❌ Sovereign Command failed with exit code $EXIT_CODE${NC}"
fi

exit $EXIT_CODE

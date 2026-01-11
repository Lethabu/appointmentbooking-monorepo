#!/bin/bash
pnpm install --no-frozen-lockfile
pnpm turbo run build --filter=@repo/db --filter=@repo/auth --filter=@repo/ai --filter=@repo/worker
pnpm run db:push --force
cd apps/booking && pnpm run dev --port 5000 --hostname 0.0.0.0

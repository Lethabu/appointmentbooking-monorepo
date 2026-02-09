# Follow-up Tasks After Workflow Fixes

## High Priority

### 1. Implement Full Library Functions
The following files are currently stub implementations and need full implementations:

- **apps/booking/lib/customer-feedback.ts**
  - Implement actual customer feedback retrieval from database
  - Add proper error handling
  - Add unit tests for both empty and populated states

- **apps/booking/lib/monetization-config.ts**
  - Implement tenant-specific monetization configuration
  - Connect to database or configuration service
  - Add unit tests for default and tenant-specific configs

- **apps/booking/lib/pricing-config.ts**
  - Implement dynamic pricing rule evaluation
  - Add promotional code validation logic
  - Implement commission calculation for different tenants
  - Add comprehensive unit tests

### 2. Fix Edge Runtime Compatibility
Some API routes fail during build due to edge runtime compatibility issues:

- **apps/booking/app/api/agent/instyle/route.ts**
  - Review for Node.js-specific APIs that aren't compatible with edge runtime
  - Replace or remove incompatible dependencies
  - Test with Cloudflare Workers environment

### 3. Add Tests for Stub Implementations
As noted in code review, the stub implementations should have tests:

```typescript
// Example test structure for customer-feedback.ts
describe('getCustomerFeedback', () => {
  it('should return empty array for non-existent customer', async () => {
    const feedback = await getCustomerFeedback('nonexistent');
    expect(feedback).toEqual([]);
  });
});
```

### 4. Consider Local Font Bundle
For better offline build support and faster load times:

- Bundle Inter font locally instead of relying on Google Fonts
- Update layout.tsx to use local font files
- Add font files to static assets

## Medium Priority

### 5. Environment File Management
Create proper environment file examples:

```bash
# Create CI-friendly env files
cp apps/booking/.env.example apps/booking/.env.ci
cp apps/dashboard/.env.example apps/dashboard/.env.ci
```

Update workflows to copy .env.ci to .env in CI environments.

### 6. Improve Turbo Cache Configuration
The worker package shows a warning about missing outputs:

```
WARNING  no output files found for task @repo/worker#build
```

Update turbo.json to specify correct output paths for worker package.

### 7. Workflow Optimization
- Add caching for pnpm store to speed up dependency installation
- Add caching for Next.js builds
- Consider using matrix strategy for parallel app builds

## Low Priority

### 8. Documentation
- Document the SKIP_ENV_VALIDATION pattern for new developers
- Update contribution guidelines with workflow testing procedures
- Add troubleshooting guide for common workflow errors

### 9. Monitoring
- Set up workflow failure notifications
- Add deployment success/failure metrics
- Create dashboard for CI/CD health monitoring

## Notes

These tasks are tracked separately from the workflow fixes. The workflow configuration is now correct and can execute successfully in CI environments. The above tasks relate to code quality, feature completeness, and optimization.

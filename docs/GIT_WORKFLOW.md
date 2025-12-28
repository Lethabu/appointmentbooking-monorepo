# Git Workflow & Development Guidelines

## Overview

This document establishes the enterprise-grade Git workflow for the Appointment Booking Monorepo, ensuring consistent, secure, and efficient development practices across all team members.

## Branch Strategy

We use a **Modified GitFlow** strategy optimized for our monorepo structure:

### Branch Types

#### Primary Branches

- **`main`** - Production-ready code
  - Protected and stable
  - Only deployable code
  - Requires 2 approvals for merges
  - Must pass all CI/CD checks

- **`staging`** - Pre-production testing
  - Integration testing environment
  - Beta releases and UAT
  - Requires 1 approval for merges
  - Must pass CI checks

- **`develop`** - Feature integration
  - Nightly builds and integration
  - Feature branch integration point
  - Requires 1 approval for merges
  - Basic CI checks required

#### Supporting Branches

- **`feature/`** - New features and enhancements
  - Format: `feature/feature-name`
  - Branch from: `develop`
  - Merge back: `develop`
  - Auto-deleted after merge

- **`bugfix/`** - Bug fixes for non-critical issues
  - Format: `bugfix/bug-description`
  - Branch from: `develop`
  - Merge back: `develop`
  - Auto-deleted after merge

- **`hotfix/`** - Critical production fixes
  - Format: `hotfix/issue-description`
  - Branch from: `main`
  - Merge back: `main` and `develop`
  - Manual deletion required

- **`release/`** - Release preparation
  - Format: `release/version-number`
  - Branch from: `develop`
  - Merge back: `main` and `develop`
  - Manual deletion required

## Workflow Process

### 1. Feature Development

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/feature-name

# Make changes
# ... development work ...

# Commit changes
git add .
git commit -m "feat: add new booking widget with validation

- Implement responsive booking form
- Add client-side validation
- Include loading states
- Update TypeScript interfaces"

# Push feature branch
git push origin feature/feature-name

# Create Pull Request
# Link to GitHub issue
# Request review from CODEOWNERS
```

### 2. Bug Fix Process

#### Non-Critical Bugs

```bash
git checkout develop
git pull origin develop
git checkout -b bugfix/issue-description

# Fix bug and test
git add .
git commit -m "fix: resolve booking form submission issue

- Fix validation error handling
- Add proper error messages
- Include regression tests"

git push origin bugfix/issue-description
```

#### Critical Production Bugs

```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# Emergency fix
git add .
git commit -m "hotfix: resolve payment processing failure

- Fix Stripe webhook handler
- Add error logging
- Implement retry mechanism
- Fixes #123"

# Deploy immediately after merge
git checkout main
git merge hotfix/critical-issue
git push origin main

# Also merge to develop
git checkout develop
git merge hotfix/critical-issue
git push origin develop
```

### 3. Release Process

```bash
# Create release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# Update version numbers
# Run final testing
# Update changelog

git add .
git commit -m "release: v1.2.0 - Enhanced booking system

Features:
- Multi-tenant support
- Advanced calendar integration
- Real-time notifications

Bug Fixes:
- Fixed payment processing
- Resolved scheduling conflicts

See CHANGELOG.md for details"

# Merge to main
git checkout main
git merge release/v1.2.0
git tag v1.2.0
git push origin main --tags

# Merge back to develop
git checkout develop
git merge release/v1.2.0
git push origin develop

# Clean up release branch
git branch -d release/v1.2.0
```

## Commit Message Conventions

We follow the **Conventional Commits** specification:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

#### Core Types

- **`feat`** - New feature
- **`fix`** - Bug fix
- **`docs`** - Documentation only changes
- **`style`** - Code style changes (formatting, missing semi-colons, etc.)
- **`refactor`** - Code change that neither fixes a bug nor adds a feature
- **`perf`** - Performance improvements
- **`test`** - Adding missing tests or correcting existing tests
- **`build`** - Changes that affect the build system or external dependencies
- **`ci`** - Changes to CI configuration files and scripts
- **`chore`** - Other changes that don't modify src or test files
- **`revert`** - Reverts a previous commit

#### Specialized Types

- **`security`** - Security vulnerability fixes
- **`db`** - Database schema or migration changes
- **`api`** - API endpoint changes
- **`ui`** - User interface changes
- **`deps`** - Dependency updates
- **`infra`** - Infrastructure changes

### Examples

```bash
# Feature with scope
git commit -m "feat(booking): add real-time availability checking

- Implement WebSocket connection for live updates
- Add optimistic UI updates
- Include error handling for connection failures

Closes #123"

# Bug fix with breaking change
git commit -m "fix(auth): resolve JWT token expiration

- Extend token lifetime to 24 hours
- Implement refresh token mechanism
- Update client-side token handling

BREAKING CHANGE: Update client applications to handle refresh tokens"

# Documentation update
git commit -m "docs(api): update authentication guide

- Add refresh token examples
- Include error response documentation
- Update code samples for new token format

Refs #456"

# Performance improvement
git commit -m "perf(db): optimize appointment query performance

- Add database indexes for tenant_id and appointment_date
- Implement query result caching
- Reduce N+1 query problems

Improves response time by 60%"
```

### Commit Message Guidelines

1. **Use imperative mood**: "Add feature" not "Added feature"
2. **Limit subject line to 50 characters**
3. **Use body to explain what and why, not how**
4. **Break lines at 72 characters in body**
5. **Reference issues and pull requests appropriately**
6. **Use BREAKING CHANGE prefix for breaking changes**

## Pull Request Guidelines

### PR Creation Process

1. **Ensure branch is up to date**

   ```bash
   git fetch origin
   git rebase origin/develop
   ```

2. **Run quality checks**

   ```bash
   pnpm run lint
   pnpm run type-check
   pnpm run test
   pnpm run build
   ```

3. **Create descriptive PR**
   - Clear title following commit conventions
   - Detailed description with context
   - Link to related issues
   - Include screenshots for UI changes
   - Add testing notes

### PR Templates

#### Feature PR Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] E2E tests pass

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots
(if applicable)

## Related Issues
Closes #(issue number)
```

#### Bug Fix PR Template

```markdown
## Issue Description
Description of the bug that was fixed.

## Root Cause
Explanation of what caused the bug.

## Solution
How the bug was fixed.

## Testing
- [ ] Reproduced the original bug
- [ ] Verified the fix works
- [ ] Ran regression tests
- [ ] Manual testing completed

## Checklist
- [ ] Bug fix maintains backward compatibility
- [ ] Added tests to prevent regression
- [ ] Documentation updated if needed
- [ ] No new warnings introduced

## Related Issues
Fixes #(issue number)
```

## Code Review Process

### Review Checklist

#### Functional Review

- [ ] Code solves the stated problem
- [ ] Logic is correct and efficient
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] Security considerations addressed

#### Technical Review

- [ ] Code follows style guidelines
- [ ] Architecture is sound
- [ ] Performance impact considered
- [ ] Scalability concerns addressed
- [ ] Dependencies are appropriate

#### Quality Review

- [ ] Tests are comprehensive
- [ ] Documentation is updated
- [ ] No code duplication
- [ ] Appropriate abstractions used
- [ ] Maintainability is good

### Review Response Times

- **Critical PRs**: 2 hours
- **Normal PRs**: 24 hours
- **Large PRs**: 48 hours
- **Documentation PRs**: 72 hours

## Merge Strategies

### Squash and Merge (Default)

- Consolidates commits into one
- Clean commit history
- Easy to revert entire feature
- Recommended for feature branches

### Rebase and Merge

- Preserves commit history
- Linear history
- Best for long-running feature branches
- Requires clean commit history

### Merge Commit

- Preserves all commits
- Maintains branch structure
- Can create messy history
- Only for special cases (release branches)

## Quality Gates

### Pre-Commit Checks

- ESLint validation
- Prettier formatting
- TypeScript type checking
- Basic unit tests
- Security scan for secrets

### Pre-Merge Checks

- All CI checks passing
- Code review approved
- Documentation updated
- Tests coverage > 80%
- Performance benchmarks met

### Post-Merge Actions

- Auto-delete feature branch
- Update project tracking
- Notify relevant teams
- Deploy to staging (if applicable)

## Emergency Procedures

### Production Incident Response

1. **Assess severity**
   - Critical: Data loss, security breach, complete outage
   - High: Major functionality broken, performance severely impacted
   - Medium: Minor functionality issues, non-critical bugs

2. **Create hotfix branch**

   ```bash
   git checkout main
   git checkout -b hotfix/critical-issue
   ```

3. **Implement fix with minimal changes**

4. **Fast-track review process**
   - 1 senior developer approval
   - Skip CI for emergency fixes (with justification)
   - Immediate merge to main

5. **Deploy and monitor**

6. **Post-incident review**

### Rollback Procedures

```bash
# Identify problematic commit
git log --oneline
git checkout <previous-commit-hash>

# Create rollback branch
git checkout -b rollback/rollback-reason

# Deploy rollback
# (Follow deployment procedures)

# Document rollback in CHANGELOG.md
```

## Tool Configuration

### Git Hooks Setup

```bash
# Install pre-commit hooks
npx husky install

# Set up commit message validation
npx husky add .husky/commit-msg 'npx commitlint --edit "$1"'

# Set up pre-push checks
npx husky add .husky/pre-push 'pnpm run type-check && pnpm run test'
```

### IDE Configuration

- VS Code extensions: ESLint, Prettier, GitLens
- Auto-formatting on save
- Git integration enabled
- TypeScript IntelliSense configured

## Monitoring and Metrics

### Repository Health Metrics

- PR review response time
- Merge frequency
- Code review coverage
- Test coverage trends
- Build success rate

### Team Performance Metrics

- Time from PR creation to merge
- Review turnaround time
- Bug detection rate
- Deployment frequency
- Rollback frequency

---

**Document Owner:** Development Team Lead  
**Last Updated:** December 2025  
**Next Review:** March 2026

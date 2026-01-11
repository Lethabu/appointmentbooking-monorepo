# 📋 Pull Request Template

## 📝 Description
<!-- Provide a clear and concise description of the changes -->

## 🎯 Type of Change
<!-- Check all that apply -->
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🧪 Test coverage improvement
- [ ] 🔧 Performance optimization
- [ ] 🎨 Code refactoring (no functional changes)
- [ ] 🏗️ Infrastructure/Build changes

## 🔍 Quality Checklist
<!-- Ensure all quality standards are met before submitting -->

### Code Quality

- [ ] Code follows the project's coding standards
- [ ] ESLint passes with no errors
- [ ] TypeScript compilation successful
- [ ] No console.log statements in production code
- [ ] Proper error handling implemented
- [ ] JSDoc comments added for public APIs
- [ ] Security best practices followed

### Testing

- [ ] Unit tests added/updated for new functionality
- [ ] Integration tests updated if applicable
- [ ] Manual testing completed for UI changes
- [ ] Test coverage maintained or improved

### Performance

- [ ] No unnecessary re-renders in React components
- [ ] Efficient database queries
- [ ] Bundle size impact considered
- [ ] Memory leaks prevented

### Security

- [ ] No sensitive data exposed in logs
- [ ] Input validation implemented
- [ ] Authentication/authorization verified
- [ ] API endpoints secured appropriately

## 🧪 Testing
<!-- Describe the testing approach and results -->

### Manual Testing
<!-- Describe manual testing performed -->
- [ ] Feature works as expected in development
- [ ] Edge cases handled properly
- [ ] Cross-browser compatibility verified (if applicable)
- [ ] Mobile responsiveness tested (if applicable)

### Automated Testing
<!-- Reference test results -->
- [ ] Unit tests: `npm run test` - ✅/❌
- [ ] Integration tests: `npm run test:integration` - ✅/❌
- [ ] E2E tests: `npm run test:e2e` - ✅/❌

## 📊 Metrics & Impact
<!-- Provide metrics and impact analysis -->

### Code Quality Metrics

- [ ] Lines of code changed: <!-- number -->
- [ ] Files modified: <!-- number -->
- [ ] New dependencies added: <!-- list -->
- [ ] Breaking changes: <!-- yes/no and description -->

### Performance Impact

- [ ] Load time impact: <!-- describe -->
- [ ] Memory usage impact: <!-- describe -->
- [ ] Database query impact: <!-- describe -->

## 🔗 Related Issues
<!-- Link to related issues -->
Closes #<!-- issue_number -->
Related to #<!-- issue_number -->

## 📸 Screenshots (if applicable)
<!-- Add screenshots for UI changes -->
<!-- ![Description](screenshot-url) -->

## 🚀 Deployment Checklist
<!-- Mark items as completed when ready for deployment -->

### Pre-deployment

- [ ] Code reviewed and approved
- [ ] Tests passing in CI/CD
- [ ] Environment variables updated
- [ ] Database migrations ready (if applicable)
- [ ] Documentation updated

### Post-deployment

- [ ] Smoke tests passed
- [ ] Monitoring alerts configured
- [ ] Rollback plan prepared
- [ ] Team notified of deployment

## 👥 Reviewers
<!-- Tag relevant reviewers -->
- [ ] @<!-- reviewer1 -->
- [ ] @<!-- reviewer2 -->
- [ ] @<!-- reviewer3 -->

## 📝 Additional Notes
<!-- Any additional information for reviewers -->

---

## 🔒 Security Review (For sensitive changes)
<!-- Complete if this PR involves security-sensitive changes -->

- [ ] Security implications considered
- [ ] Authentication mechanisms reviewed
- [ ] Data validation implemented
- [ ] Authorization checks in place
- [ ] Input sanitization verified
- [ ] Output encoding applied

## 🌐 Internationalization (For UI changes)
<!-- Complete if this PR involves user-facing text -->

- [ ] Text externalized for translation
- [ ] RTL support considered (if applicable)
- [ ] Cultural considerations addressed
- [ ] Date/time formatting appropriate

## ♿ Accessibility (For UI changes)
<!-- Complete if this PR involves UI changes -->

- [ ] ARIA labels added where needed
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG guidelines
- [ ] Screen reader compatibility tested
- [ ] Focus management appropriate

---

**By submitting this PR, I confirm that:**

- [ ] I have tested my changes thoroughly
- [ ] I understand the impact of these changes
- [ ] I have considered security implications
- [ ] I am ready for code review and deployment

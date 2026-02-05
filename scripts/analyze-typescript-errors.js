#!/usr/bin/env node

/**
 * TypeScript Error Analysis Script
 * Implements the "repeat 3 times" rule for comprehensive validation
 * 
 * This script systematically analyzes TypeScript compilation errors
 * and categorizes them for systematic resolution.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class TypeScriptErrorAnalyzer {
    constructor() {
        this.errorCategories = {
            CRITICAL: {
                name: 'Critical Compilation Failures',
                errors: [],
                description: 'Block deployment - must fix first'
            },
            HIGH: {
                name: 'High Priority Issues',
                errors: [],
                description: 'Significant functionality impact'
            },
            MEDIUM: {
                name: 'Medium Priority Issues',
                errors: [],
                description: 'Development workflow impact'
            },
            LOW: {
                name: 'Low Priority Issues',
                errors: [],
                description: 'Code quality and maintainability'
            }
        };

        this.packages = [
            'apps/booking',
            'apps/dashboard',
            'apps/marketing',
            'packages/services',
            'packages/ui',
            'packages/worker',
            'packages/db',
            'packages/auth',
            'packages/payments',
            'packages/ai'
        ];

        this.errorPatterns = {
            MISSING_MODULE: /Cannot find module/,
            REACT_TYPE_CONFLICT: /Type 'React\.ReactNode'/,
            UNKNOWN_PROPERTY: /Property '[^']+' does not exist/,
            IMPLICIT_ANY: /Parameter.*implicitly has an 'any' type/,
            DUPLICATE_IMPLEMENTATION: /Duplicate function implementation/,
            MISSING_INITIALIZER: /Property.*has no initializer/,
            TYPE_ASSIGNMENT: /Type '.*' is not assignable to type/,
            MODULE_RESOLUTION: /Cannot find name/,
            VERSION_CONFLICT: /@types\/react.*version/
        };
    }

    async analyze() {
        console.log('🔍 TypeScript Error Analysis - Phase 1: Comprehensive Error Analysis & Categorization');
        console.log('📋 Implementing "repeat 3 times" validation rule\n');

        // Phase 1.1: Collect all TypeScript errors
        const allErrors = await this.collectAllErrors();

        // Phase 1.2: Categorize errors by severity
        const categorizedErrors = this.categorizeErrors(allErrors);

        // Phase 1.3: Generate comprehensive report
        const report = this.generateReport(categorizedErrors);

        // Phase 1.4: Create action plan
        const actionPlan = this.createActionPlan(categorizedErrors);

        // Phase 1.5: Validate analysis (Repeat 1)
        const validation1 = this.validateAnalysis(categorizedErrors);

        // Phase 1.6: Cross-reference with dependencies (Repeat 2)
        const validation2 = this.crossReferenceDependencies(categorizedErrors);

        // Phase 1.7: Risk assessment (Repeat 3)
        const validation3 = this.assessRisk(categorizedErrors);

        // Save results
        this.saveResults({
            errors: categorizedErrors,
            report,
            actionPlan,
            validations: [validation1, validation2, validation3]
        });

        console.log('✅ Phase 1 Complete: Comprehensive Error Analysis & Categorization');
        return categorizedErrors;
    }

    async collectAllErrors() {
        console.log('📊 Phase 1.1: Collecting all TypeScript errors...');

        const allErrors = [];

        for (const pkg of this.packages) {
            const pkgPath = path.join(process.cwd(), pkg);
            if (!fs.existsSync(pkgPath)) {
                console.log(`⚠️  Package not found: ${pkg}`);
                continue;
            }

            try {
                console.log(`🔍 Analyzing ${pkg}...`);
                const errors = await this.getPackageErrors(pkg);
                allErrors.push(...errors);
            } catch (error) {
                console.log(`❌ Error analyzing ${pkg}: ${error.message}`);
            }
        }

        console.log(`📊 Total errors collected: ${allErrors.length}`);
        return allErrors;
    }

    async getPackageErrors(packagePath) {
        try {
            const result = execSync(
                `cd ${packagePath} && npx tsc --noEmit --skipLibCheck --pretty 2>&1`,
                { encoding: 'utf8', timeout: 30000 }
            );

            return this.parseErrors(result, packagePath);
        } catch (error) {
            // TypeScript compilation failed, parse stderr
            return this.parseErrors(error.stdout || error.stderr || '', packagePath);
        }
    }

    parseErrors(output, packagePath) {
        const lines = output.split('\n');
        const errors = [];
        let currentError = null;

        for (const line of lines) {
            const trimmed = line.trim();

            // Match TypeScript error format: file(line, column): error TSxxxx: message
            const errorMatch = trimmed.match(/^(.+)\((\d+),(\d+)\):\s*(error|warning)\s*TS(\d+):\s*(.+)$/);

            if (errorMatch) {
                if (currentError) {
                    errors.push(currentError);
                }

                currentError = {
                    file: errorMatch[1],
                    line: parseInt(errorMatch[2]),
                    column: parseInt(errorMatch[3]),
                    type: errorMatch[4],
                    code: errorMatch[5],
                    message: errorMatch[6],
                    package: packagePath,
                    category: this.categorizeErrorType(errorMatch[6]),
                    pattern: this.matchErrorPattern(errorMatch[6])
                };
            } else if (currentError && trimmed) {
                // Continue building multi-line error message
                currentError.message += ` ${  trimmed}`;
            }
        }

        if (currentError) {
            errors.push(currentError);
        }

        return errors;
    }

    categorizeErrorType(message) {
        // Critical errors that block compilation
        if (message.includes('Cannot find module') ||
            message.includes('Cannot find name') ||
            message.includes('Module not found')) {
            return 'CRITICAL';
        }

        // High priority - type system issues
        if (message.includes('Type') && message.includes('not assignable') ||
            message.includes('Property') && message.includes('does not exist') ||
            message.includes('implicitly has an \'any\' type')) {
            return 'HIGH';
        }

        // Medium priority - development workflow
        if (message.includes('Duplicate function implementation') ||
            message.includes('has no initializer') ||
            message.includes('version')) {
            return 'MEDIUM';
        }

        // Low priority - code quality
        return 'LOW';
    }

    matchErrorPattern(message) {
        for (const [patternName, regex] of Object.entries(this.errorPatterns)) {
            if (regex.test(message)) {
                return patternName;
            }
        }
        return 'UNKNOWN';
    }

    categorizeErrors(allErrors) {
        console.log('🏷️  Phase 1.2: Categorizing errors by severity...');

        const categorized = {
            CRITICAL: [],
            HIGH: [],
            MEDIUM: [],
            LOW: []
        };

        for (const error of allErrors) {
            categorized[error.category].push(error);
        }

        // Sort by package and frequency
        for (const category in categorized) {
            categorized[category].sort((a, b) => {
                if (a.package !== b.package) {
                    return a.package.localeCompare(b.package);
                }
                return b.message.length - a.message.length; // Longer messages first
            });
        }

        return categorized;
    }

    generateReport(categorizedErrors) {
        console.log('📋 Phase 1.3: Generating comprehensive report...');

        const totalErrors = Object.values(categorizedErrors).reduce((sum, errors) => sum + errors.length, 0);

        const report = {
            summary: {
                totalErrors,
                critical: categorizedErrors.CRITICAL.length,
                high: categorizedErrors.HIGH.length,
                medium: categorizedErrors.MEDIUM.length,
                low: categorizedErrors.LOW.length,
                packages: this.packages.length
            },
            byPackage: this.analyzeByPackage(categorizedErrors),
            byPattern: this.analyzeByPattern(categorizedErrors),
            topErrors: this.getTopErrors(categorizedErrors),
            recommendations: this.generateRecommendations(categorizedErrors)
        };

        return report;
    }

    analyzeByPackage(categorizedErrors) {
        const packageAnalysis = {};

        for (const pkg of this.packages) {
            const pkgErrors = Object.values(categorizedErrors).flat()
                .filter(error => error.package === pkg);

            if (pkgErrors.length > 0) {
                packageAnalysis[pkg] = {
                    total: pkgErrors.length,
                    critical: pkgErrors.filter(e => e.category === 'CRITICAL').length,
                    high: pkgErrors.filter(e => e.category === 'HIGH').length,
                    medium: pkgErrors.filter(e => e.category === 'MEDIUM').length,
                    low: pkgErrors.filter(e => e.category === 'LOW').length,
                    patterns: this.getPatternsForPackage(pkgErrors)
                };
            }
        }

        return packageAnalysis;
    }

    analyzeByPattern(categorizedErrors) {
        const patternAnalysis = {};

        for (const [category, errors] of Object.entries(categorizedErrors)) {
            for (const error of errors) {
                if (!patternAnalysis[error.pattern]) {
                    patternAnalysis[error.pattern] = {
                        count: 0,
                        categories: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
                        examples: []
                    };
                }

                patternAnalysis[error.pattern].count++;
                patternAnalysis[error.pattern].categories[category]++;

                if (patternAnalysis[error.pattern].examples.length < 3) {
                    patternAnalysis[error.pattern].examples.push({
                        file: error.file,
                        message: error.message,
                        package: error.package
                    });
                }
            }
        }

        return patternAnalysis;
    }

    getTopErrors(categorizedErrors) {
        const allErrors = Object.values(categorizedErrors).flat();
        const errorCounts = {};

        for (const error of allErrors) {
            const key = `${error.pattern}-${error.message.substring(0, 100)}`;
            if (!errorCounts[key]) {
                errorCounts[key] = {
                    count: 0,
                    example: error,
                    packages: new Set()
                };
            }
            errorCounts[key].count++;
            errorCounts[key].packages.add(error.package);
        }

        return Object.entries(errorCounts)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 10)
            .map(([key, data]) => ({
                pattern: data.example.pattern,
                message: data.example.message,
                count: data.count,
                packages: Array.from(data.packages)
            }));
    }

    generateRecommendations(categorizedErrors) {
        const recommendations = [];

        // Critical recommendations
        if (categorizedErrors.CRITICAL.length > 0) {
            recommendations.push({
                priority: 'CRITICAL',
                title: 'Fix Missing Module Imports',
                description: 'Resolve all "Cannot find module" errors first',
                estimatedEffort: '2-3 days',
                impact: 'Blocks deployment'
            });
        }

        // High priority recommendations
        if (categorizedErrors.HIGH.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                title: 'Resolve Type System Conflicts',
                description: 'Fix React type conflicts and property access issues',
                estimatedEffort: '1-2 days',
                impact: 'Affects core functionality'
            });
        }

        // Medium priority recommendations
        if (categorizedErrors.MEDIUM.length > 0) {
            recommendations.push({
                priority: 'MEDIUM',
                title: 'Fix Development Workflow Issues',
                description: 'Resolve duplicate implementations and missing initializers',
                estimatedEffort: '0.5-1 day',
                impact: 'Affects development experience'
            });
        }

        return recommendations;
    }

    createActionPlan(categorizedErrors) {
        console.log('🎯 Phase 1.4: Creating action plan...');

        const plan = {
            phases: [
                {
                    name: 'Phase 1: Critical Fixes',
                    priority: 'CRITICAL',
                    errors: categorizedErrors.CRITICAL.length,
                    tasks: this.generateCriticalTasks(categorizedErrors.CRITICAL),
                    estimatedDuration: '2-3 days'
                },
                {
                    name: 'Phase 2: High Priority Fixes',
                    priority: 'HIGH',
                    errors: categorizedErrors.HIGH.length,
                    tasks: this.generateHighTasks(categorizedErrors.HIGH),
                    estimatedDuration: '1-2 days'
                },
                {
                    name: 'Phase 3: Medium Priority Fixes',
                    priority: 'MEDIUM',
                    errors: categorizedErrors.MEDIUM.length,
                    tasks: this.generateMediumTasks(categorizedErrors.MEDIUM),
                    estimatedDuration: '0.5-1 day'
                },
                {
                    name: 'Phase 4: Low Priority Fixes',
                    priority: 'LOW',
                    errors: categorizedErrors.LOW.length,
                    tasks: this.generateLowTasks(categorizedErrors.LOW),
                    estimatedDuration: '0.25-0.5 day'
                }
            ],
            totalEstimatedDuration: '3.75-6.5 days'
        };

        return plan;
    }

    generateCriticalTasks(errors) {
        const tasks = [];
        const missingModules = errors.filter(e => e.pattern === 'MISSING_MODULE');
        const moduleResolution = errors.filter(e => e.pattern === 'MODULE_RESOLUTION');

        if (missingModules.length > 0) {
            tasks.push({
                title: 'Fix Missing Module Imports',
                description: `Resolve ${missingModules.length} missing module errors`,
                files: [...new Set(missingModules.map(e => e.file))],
                estimatedTime: '1-2 days'
            });
        }

        if (moduleResolution.length > 0) {
            tasks.push({
                title: 'Fix Module Resolution Issues',
                description: `Resolve ${moduleResolution.length} module resolution errors`,
                files: [...new Set(moduleResolution.map(e => e.file))],
                estimatedTime: '0.5-1 day'
            });
        }

        return tasks;
    }

    generateHighTasks(errors) {
        const tasks = [];
        const reactConflicts = errors.filter(e => e.pattern === 'REACT_TYPE_CONFLICT');
        const unknownProps = errors.filter(e => e.pattern === 'UNKNOWN_PROPERTY');

        if (reactConflicts.length > 0) {
            tasks.push({
                title: 'Resolve React Type Conflicts',
                description: `Fix ${reactConflicts.length} React type conflicts`,
                files: [...new Set(reactConflicts.map(e => e.file))],
                estimatedTime: '0.5-1 day'
            });
        }

        if (unknownProps.length > 0) {
            tasks.push({
                title: 'Fix Unknown Property Access',
                description: `Resolve ${unknownProps.length} property access errors`,
                files: [...new Set(unknownProps.map(e => e.file))],
                estimatedTime: '0.5-1 day'
            });
        }

        return tasks;
    }

    generateMediumTasks(errors) {
        const tasks = [];
        const duplicates = errors.filter(e => e.pattern === 'DUPLICATE_IMPLEMENTATION');
        const missingInit = errors.filter(e => e.pattern === 'MISSING_INITIALIZER');

        if (duplicates.length > 0) {
            tasks.push({
                title: 'Fix Duplicate Implementations',
                description: `Resolve ${duplicates.length} duplicate function implementations`,
                files: [...new Set(duplicates.map(e => e.file))],
                estimatedTime: '0.25-0.5 day'
            });
        }

        if (missingInit.length > 0) {
            tasks.push({
                title: 'Add Missing Property Initializers',
                description: `Add initializers for ${missingInit.length} properties`,
                files: [...new Set(missingInit.map(e => e.file))],
                estimatedTime: '0.25-0.5 day'
            });
        }

        return tasks;
    }

    generateLowTasks(errors) {
        return [{
            title: 'Code Quality Improvements',
            description: `Address ${errors.length} low-priority code quality issues`,
            estimatedTime: '0.25 day'
        }];
    }

    validateAnalysis(categorizedErrors) {
        console.log('✅ Phase 1.5: Validating analysis (Repeat 1)...');

        const validation = {
            totalErrors: Object.values(categorizedErrors).reduce((sum, errors) => sum + errors.length, 0),
            categoryDistribution: Object.fromEntries(
                Object.entries(categorizedErrors).map(([cat, errors]) => [cat, errors.length])
            ),
            packageCoverage: this.packages.filter(pkg =>
                Object.values(categorizedErrors).flat().some(e => e.package === pkg)
            ),
            patternCoverage: Object.keys(this.errorPatterns)
        };

        console.log(`📊 Validation 1 - Total errors: ${validation.totalErrors}`);
        console.log(`📊 Validation 1 - Categories: ${JSON.stringify(validation.categoryDistribution)}`);

        return validation;
    }

    crossReferenceDependencies(categorizedErrors) {
        console.log('🔗 Phase 1.6: Cross-referencing with dependencies (Repeat 2)...');

        const dependencyAnalysis = {
            packagesWithErrors: new Set(),
            sharedDependencies: {},
            errorClusters: {}
        };

        for (const [category, errors] of Object.entries(categorizedErrors)) {
            for (const error of errors) {
                dependencyAnalysis.packagesWithErrors.add(error.package);

                // Group errors by dependency patterns
                if (error.message.includes('react') || error.message.includes('React')) {
                    if (!dependencyAnalysis.sharedDependencies.react) {
                        dependencyAnalysis.sharedDependencies.react = [];
                    }
                    dependencyAnalysis.sharedDependencies.react.push(error);
                }

                if (error.message.includes('typescript') || error.message.includes('TypeScript')) {
                    if (!dependencyAnalysis.sharedDependencies.typescript) {
                        dependencyAnalysis.sharedDependencies.typescript = [];
                    }
                    dependencyAnalysis.sharedDependencies.typescript.push(error);
                }
            }
        }

        console.log(`🔗 Validation 2 - Packages with errors: ${dependencyAnalysis.packagesWithErrors.size}`);
        console.log(`🔗 Validation 2 - Shared dependency issues: ${Object.keys(dependencyAnalysis.sharedDependencies).length}`);

        return dependencyAnalysis;
    }

    assessRisk(categorizedErrors) {
        console.log('⚠️  Phase 1.7: Assessing risk (Repeat 3)...');

        const riskAssessment = {
            deploymentRisk: this.calculateDeploymentRisk(categorizedErrors),
            functionalityRisk: this.calculateFunctionalityRisk(categorizedErrors),
            developmentRisk: this.calculateDevelopmentRisk(categorizedErrors),
            overallRisk: 'HIGH'
        };

        // Calculate overall risk
        const criticalCount = categorizedErrors.CRITICAL.length;
        const highCount = categorizedErrors.HIGH.length;

        if (criticalCount > 50) {
            riskAssessment.overallRisk = 'CRITICAL';
        } else if (criticalCount > 20 || highCount > 100) {
            riskAssessment.overallRisk = 'HIGH';
        } else if (criticalCount > 5 || highCount > 50) {
            riskAssessment.overallRisk = 'MEDIUM';
        } else {
            riskAssessment.overallRisk = 'LOW';
        }

        console.log(`⚠️  Validation 3 - Overall risk level: ${riskAssessment.overallRisk}`);
        console.log(`⚠️  Validation 3 - Critical errors: ${criticalCount}, High errors: ${highCount}`);

        return riskAssessment;
    }

    calculateDeploymentRisk(categorizedErrors) {
        const critical = categorizedErrors.CRITICAL.length;
        const high = categorizedErrors.HIGH.length;

        if (critical > 0) return 'BLOCKING';
        if (high > 50) return 'HIGH';
        if (high > 20) return 'MEDIUM';
        return 'LOW';
    }

    calculateFunctionalityRisk(categorizedErrors) {
        const high = categorizedErrors.HIGH.length;
        const medium = categorizedErrors.MEDIUM.length;

        if (high > 100) return 'CRITICAL';
        if (high > 50 || medium > 100) return 'HIGH';
        if (high > 20 || medium > 50) return 'MEDIUM';
        return 'LOW';
    }

    calculateDevelopmentRisk(categorizedErrors) {
        const medium = categorizedErrors.MEDIUM.length;
        const low = categorizedErrors.LOW.length;

        if (medium > 50) return 'HIGH';
        if (medium > 20 || low > 100) return 'MEDIUM';
        return 'LOW';
    }

    getPatternsForPackage(pkgErrors) {
        const patterns = {};
        for (const error of pkgErrors) {
            patterns[error.pattern] = (patterns[error.pattern] || 0) + 1;
        }
        return patterns;
    }

    saveResults(results) {
        console.log('💾 Saving analysis results...');

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const outputDir = path.join(process.cwd(), 'analysis-results');

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Save detailed error analysis
        fs.writeFileSync(
            path.join(outputDir, `typescript-error-analysis-${timestamp}.json`),
            JSON.stringify(results, null, 2)
        );

        // Save summary report
        const summary = {
            timestamp,
            totalErrors: results.report.summary.totalErrors,
            criticalErrors: results.report.summary.critical,
            highErrors: results.report.summary.high,
            mediumErrors: results.report.summary.medium,
            lowErrors: results.report.summary.low,
            riskLevel: results.validations[2].overallRisk,
            estimatedFixTime: results.actionPlan.totalEstimatedDuration
        };

        fs.writeFileSync(
            path.join(outputDir, `error-summary-${timestamp}.json`),
            JSON.stringify(summary, null, 2)
        );

        // Generate markdown report
        const markdownReport = this.generateMarkdownReport(results);
        fs.writeFileSync(
            path.join(outputDir, `typescript-analysis-report-${timestamp}.md`),
            markdownReport
        );

        console.log(`📁 Results saved to: ${outputDir}`);
    }

    generateMarkdownReport(results) {
        const { report, actionPlan, validations } = results;

        return `# TypeScript Error Analysis Report

## Executive Summary

**Analysis Date**: ${new Date().toISOString()}
**Total Errors**: ${report.summary.totalErrors}
**Critical Errors**: ${report.summary.critical}
**High Priority**: ${report.summary.high}
**Medium Priority**: ${report.summary.medium}
**Low Priority**: ${report.summary.low}
**Risk Level**: ${validations[2].overallRisk}
**Estimated Fix Time**: ${actionPlan.totalEstimatedDuration}

## Error Distribution by Package

${Object.entries(report.byPackage).map(([pkg, data]) => `
### ${pkg}
- **Total**: ${data.total} errors
- **Critical**: ${data.critical}
- **High**: ${data.high}
- **Medium**: ${data.medium}
- **Low**: ${data.low}
- **Patterns**: ${Object.keys(data.patterns).join(', ')}
`).join('')}

## Top Error Patterns

${Object.entries(report.byPattern).map(([pattern, data]) => `
### ${pattern}
- **Count**: ${data.count}
- **Categories**: ${JSON.stringify(data.categories)}
- **Examples**: ${data.examples.length}
`).join('')}

## Action Plan

${actionPlan.phases.map((phase, index) => `
### ${phase.name}
- **Priority**: ${phase.priority}
- **Errors**: ${phase.errors}
- **Estimated Duration**: ${phase.estimatedDuration}
- **Tasks**: ${phase.tasks.length}
`).join('')}

## Recommendations

${report.recommendations.map(rec => `
### ${rec.priority}: ${rec.title}
- **Description**: ${rec.description}
- **Effort**: ${rec.estimatedEffort}
- **Impact**: ${rec.impact}
`).join('')}

## Validation Results

### Validation 1: Analysis Completeness
- **Total Errors**: ${validations[0].totalErrors}
- **Category Distribution**: ${JSON.stringify(validations[0].categoryDistribution)}

### Validation 2: Dependency Cross-Reference
- **Packages with Errors**: ${validations[1].packagesWithErrors.size}
- **Shared Dependencies**: ${Object.keys(validations[1].sharedDependencies).length}

### Validation 3: Risk Assessment
- **Overall Risk**: ${validations[2].overallRisk}
- **Deployment Risk**: ${validations[2].deploymentRisk}
- **Functionality Risk**: ${validations[2].functionalityRisk}
- **Development Risk**: ${validations[2].developmentRisk}

---
*Generated by TypeScript Error Analyzer with "repeat 3 times" validation rule*
`;
    }
}

// Run the analysis
async function main() {
    try {
        const analyzer = new TypeScriptErrorAnalyzer();
        await analyzer.analyze();
        console.log('\n🎉 TypeScript Error Analysis Complete!');
        console.log('📋 Proceed to Phase 2: Systematic Error Resolution');
    } catch (error) {
        console.error('❌ Analysis failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = TypeScriptErrorAnalyzer;
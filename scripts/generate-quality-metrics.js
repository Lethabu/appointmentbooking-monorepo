#!/usr/bin/env node

/**
 * Enterprise Code Quality Metrics Generator
 * Analyzes codebase for quality metrics and generates comprehensive reports
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

class QualityMetricsGenerator {
    constructor() {
        this.workspaceRoot = process.cwd();
        this.reportsDir = join(this.workspaceRoot, 'reports');
        this.ensureReportsDirectory();
    }

    ensureReportsDirectory() {
        if (!existsSync(this.reportsDir)) {
            mkdirSync(this.reportsDir, { recursive: true });
        }
    }

    /**
     * Run ESLint and capture violations
     */
    runESLint() {
        try {
            const output = execSync('pnpm run lint:report', {
                encoding: 'utf8',
                cwd: this.workspaceRoot
            });
            return this.parseESLintReport(output);
        } catch (error) {
            // ESLint might fail, but we can still get partial results
            return this.parseESLintReport(error.stdout || '');
        }
    }

    /**
     * Parse ESLint JSON report
     */
    parseESLintReport(output) {
        try {
            const reportPath = join(this.reportsDir, 'eslint-report.json');
            if (existsSync(reportPath)) {
                const report = JSON.parse(readFileSync(reportPath, 'utf8'));
                return this.processESLintResults(report);
            }
        } catch (error) {
            console.warn('Could not parse ESLint report:', error.message);
        }

        // Fallback: analyze stderr/stdout for basic metrics
        return this.analyzeBasicESLintOutput(output);
    }

    processESLintResults(report) {
        const results = report.results || [];
        const totalFiles = results.length;
        let totalErrors = 0;
        let totalWarnings = 0;
        const violationsByFile = {};
        const violationsByRule = {};

        results.forEach(fileResult => {
            const filePath = fileResult.filePath;
            const messages = fileResult.messages || [];

            const fileErrors = messages.filter(msg => msg.severity === 2).length;
            const fileWarnings = messages.filter(msg => msg.severity === 1).length;

            totalErrors += fileErrors;
            totalWarnings += fileWarnings;

            violationsByFile[filePath] = {
                errors: fileErrors,
                warnings: fileWarnings,
                messages: messages
            };

            messages.forEach(message => {
                const ruleId = message.ruleId || 'unknown';
                if (!violationsByRule[ruleId]) {
                    violationsByRule[ruleId] = { count: 0, severity: [], files: [] };
                }
                violationsByRule[ruleId].count++;
                violationsByRule[ruleId].severity.push(message.severity);
                if (!violationsByRule[ruleId].files.includes(filePath)) {
                    violationsByRule[ruleId].files.push(filePath);
                }
            });
        });

        return {
            summary: {
                totalFiles,
                totalErrors,
                totalWarnings,
                errorRate: totalFiles > 0 ? (totalErrors / totalFiles).toFixed(3) : 0,
                warningRate: totalFiles > 0 ? (totalWarnings / totalFiles).toFixed(3) : 0
            },
            violationsByFile,
            violationsByRule,
            timestamp: new Date().toISOString()
        };
    }

    analyzeBasicESLintOutput(output) {
        // Basic analysis of ESLint output
        const errorMatches = output.match(/✖ \d+ problem/g) || [];
        const totalProblems = errorMatches.length > 0 ?
            parseInt(errorMatches[0].match(/\d+/)[0]) : 0;

        return {
            summary: {
                totalFiles: 0,
                totalErrors: totalProblems,
                totalWarnings: 0,
                errorRate: 0,
                warningRate: 0
            },
            violationsByFile: {},
            violationsByRule: {},
            timestamp: new Date().toISOString(),
            note: 'Basic analysis - detailed parsing failed'
        };
    }

    /**
     * Calculate code complexity metrics
     */
    calculateComplexityMetrics() {
        const complexityMetrics = {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            halsteadMetrics: {},
            maintainabilityIndex: 0
        };

        try {
            // Use a simple approach to count complexity indicators
            const srcDirs = [
                'apps/booking/src',
                'apps/dashboard/src',
                'apps/marketing/src',
                'packages/*/src'
            ];

            let totalFunctions = 0;
            let totalComplexity = 0;

            srcDirs.forEach(pattern => {
                try {
                    const output = execSync(`find ${pattern} -name "*.ts" -o -name "*.tsx" | head -20`, {
                        encoding: 'utf8',
                        cwd: this.workspaceRoot
                    });

                    const files = output.split('\n').filter(f => f.trim());
                    files.forEach(file => {
                        if (existsSync(file)) {
                            const content = readFileSync(file, 'utf8');
                            const complexity = this.estimateFileComplexity(content);
                            totalFunctions += complexity.functionCount;
                            totalComplexity += complexity.complexity;
                        }
                    });
                } catch (error) {
                    // Pattern might not exist, continue
                }
            });

            complexityMetrics.cyclomaticComplexity = totalComplexity;
            complexityMetrics.averageComplexityPerFunction = totalFunctions > 0 ?
                (totalComplexity / totalFunctions).toFixed(2) : 0;

        } catch (error) {
            console.warn('Could not calculate complexity metrics:', error.message);
        }

        return complexityMetrics;
    }

    estimateFileComplexity(content) {
        // Simple complexity estimation based on control structures
        const complexityKeywords = [
            'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'catch',
            '&&', '||', '?', ':', 'try', 'finally'
        ];

        let complexity = 1; // Base complexity
        let functionCount = 0;

        complexityKeywords.forEach(keyword => {
            const matches = content.match(new RegExp(`\\b${keyword}\\b`, 'g'));
            if (matches) {
                complexity += matches.length;
            }
        });

        // Count functions
        const functionMatches = content.match(/function\s+\w+|=>\s*{|\w+\s*\([^)]*\)\s*{/g);
        if (functionMatches) {
            functionCount = functionMatches.length;
        }

        return { complexity, functionCount };
    }

    /**
     * Calculate test coverage metrics
     */
    calculateTestCoverage() {
        try {
            const coverageOutput = execSync('find . -name "coverage" -type d', {
                encoding: 'utf8',
                cwd: this.workspaceRoot
            });

            if (coverageOutput.trim()) {
                return {
                    hasCoverage: true,
                    coverageDirectories: coverageOutput.trim().split('\n'),
                    note: 'Coverage data found'
                };
            }
        } catch (error) {
            // No coverage data found
        }

        return {
            hasCoverage: false,
            coverageDirectories: [],
            note: 'No coverage data found'
        };
    }

    /**
     * Generate comprehensive quality report
     */
    generateQualityReport() {
        console.log('🔍 Analyzing code quality metrics...');

        const eslintMetrics = this.runESLint();
        const complexityMetrics = this.calculateComplexityMetrics();
        const testCoverage = this.calculateTestCoverage();

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                overallQuality: this.calculateOverallQuality(eslintMetrics, complexityMetrics),
                totalViolations: eslintMetrics.summary.totalErrors + eslintMetrics.summary.totalWarnings,
                criticalIssues: eslintMetrics.summary.totalErrors,
                recommendations: this.generateRecommendations(eslintMetrics, complexityMetrics)
            },
            eslint: eslintMetrics,
            complexity: complexityMetrics,
            testCoverage,
            trends: this.calculateTrends()
        };

        this.saveReport(report);
        this.printReport(report);

        return report;
    }

    calculateOverallQuality(eslintMetrics, complexityMetrics) {
        let score = 100;

        // Deduct points for ESLint violations
        score -= eslintMetrics.summary.totalErrors * 2;
        score -= eslintMetrics.summary.totalWarnings * 0.5;

        // Deduct points for high complexity
        if (complexityMetrics.averageComplexityPerFunction > 10) {
            score -= 20;
        } else if (complexityMetrics.averageComplexityPerFunction > 5) {
            score -= 10;
        }

        return Math.max(0, Math.min(100, score));
    }

    generateRecommendations(eslintMetrics, complexityMetrics) {
        const recommendations = [];

        if (eslintMetrics.summary.totalErrors > 0) {
            recommendations.push({
                priority: 'high',
                category: 'ESLint',
                message: `Fix ${eslintMetrics.summary.totalErrors} ESLint errors to improve code quality`,
                action: 'Run `npm run lint:fix` to auto-fix issues'
            });
        }

        if (complexityMetrics.averageComplexityPerFunction > 10) {
            recommendations.push({
                priority: 'medium',
                category: 'Complexity',
                message: `High function complexity detected (${complexityMetrics.averageComplexityPerFunction})`,
                action: 'Refactor complex functions to reduce cognitive load'
            });
        }

        if (Object.keys(eslintMetrics.violationsByRule).length > 5) {
            recommendations.push({
                priority: 'low',
                category: 'Code Standards',
                message: 'Multiple rule violations detected',
                action: 'Review and update ESLint configuration for consistency'
            });
        }

        return recommendations;
    }

    calculateTrends() {
        // Placeholder for trend analysis
        // In a real implementation, this would compare with previous reports
        return {
            previousReport: null,
            trend: 'stable',
            changes: []
        };
    }

    saveReport(report) {
        const reportPath = join(this.reportsDir, 'quality-metrics.json');
        writeFileSync(reportPath, JSON.stringify(report, null, 2));

        const htmlReportPath = join(this.reportsDir, 'quality-report.html');
        this.generateHTMLReport(report, htmlReportPath);
    }

    generateHTMLReport(report, outputPath) {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Quality Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f4f4f4; padding: 20px; border-radius: 5px; }
        .metric { margin: 10px 0; padding: 10px; border-left: 4px solid #007cba; }
        .error { border-left-color: #d32f2f; }
        .warning { border-left-color: #f57c00; }
        .good { border-left-color: #388e3c; }
        .recommendation { background: #fff3e0; padding: 15px; margin: 10px 0; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Code Quality Report</h1>
        <p>Generated: ${report.timestamp}</p>
        <p>Overall Quality Score: <strong>${report.summary.overallQuality}/100</strong></p>
    </div>

    <h2>ESLint Summary</h2>
    <div class="metric ${report.eslint.summary.totalErrors > 0 ? 'error' : 'good'}">
        <strong>Errors:</strong> ${report.eslint.summary.totalErrors}
    </div>
    <div class="metric ${report.eslint.summary.totalWarnings > 0 ? 'warning' : 'good'}">
        <strong>Warnings:</strong> ${report.eslint.summary.totalWarnings}
    </div>
    <div class="metric">
        <strong>Files Analyzed:</strong> ${report.eslint.summary.totalFiles}
    </div>

    <h2>Complexity Metrics</h2>
    <div class="metric">
        <strong>Total Complexity:</strong> ${report.complexity.cyclomaticComplexity}
    </div>
    <div class="metric">
        <strong>Average Complexity per Function:</strong> ${report.complexity.averageComplexityPerFunction}
    </div>

    <h2>Recommendations</h2>
    ${report.summary.recommendations.map(rec => `
        <div class="recommendation">
            <strong>${rec.priority.toUpperCase()}</strong> - ${rec.category}<br>
            ${rec.message}<br>
            <em>Action: ${rec.action}</em>
        </div>
    `).join('')}

    <h2>Top Rule Violations</h2>
    <table>
        <tr><th>Rule</th><th>Count</th><th>Severity</th></tr>
        ${Object.entries(report.eslint.violationsByRule)
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 10)
                .map(([rule, data]) => `
            <tr>
                <td>${rule}</td>
                <td>${data.count}</td>
                <td>${data.severity.includes(2) ? 'Error' : 'Warning'}</td>
            </tr>
          `).join('')}
    </table>
</body>
</html>`;

        writeFileSync(outputPath, html);
    }

    printReport(report) {
        console.log('\n📊 CODE QUALITY REPORT');
        console.log('='.repeat(50));
        console.log(`Overall Quality Score: ${report.summary.overallQuality}/100`);
        console.log(`Total Violations: ${report.summary.totalViolations}`);
        console.log(`Critical Issues: ${report.summary.criticalIssues}`);

        console.log('\n🔍 ESLint Metrics:');
        console.log(`  Errors: ${report.eslint.summary.totalErrors}`);
        console.log(`  Warnings: ${report.eslint.summary.totalWarnings}`);
        console.log(`  Files Analyzed: ${report.eslint.summary.totalFiles}`);

        console.log('\n🧠 Complexity Metrics:');
        console.log(`  Total Complexity: ${report.complexity.cyclomaticComplexity}`);
        console.log(`  Avg Complexity/Function: ${report.complexity.averageComplexityPerFunction}`);

        console.log('\n💡 Recommendations:');
        report.summary.recommendations.forEach((rec, index) => {
            console.log(`  ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`);
        });

        console.log(`\n📄 Full report saved to: ${this.reportsDir}/quality-report.html`);
    }
}

// Run the metrics generator
if (import.meta.url === `file://${process.argv[1]}`) {
    const generator = new QualityMetricsGenerator();
    generator.generateQualityReport();
}

export default QualityMetricsGenerator;
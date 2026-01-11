/**
 * Coverage Reporter
 * Generates detailed coverage reports for test analysis
 */

const fs = require('fs');
const path = require('path');

class CoverageReporter {
    constructor(globalConfig, options) {
        this.globalConfig = globalConfig;
        this.options = options;
        this.outputDirectory = options.outputDirectory || './coverage';
    }

    onRunComplete(contexts, results) {
        this.generateCoverageReport(results);
    }

    generateCoverageReport(results) {
        const coverageSummary = this.extractCoverageSummary(results);

        // Create detailed coverage report
        const report = {
            timestamp: new Date().toISOString(),
            summary: coverageSummary,
            totalTests: results.numTotalTests,
            passedTests: results.numPassedTests,
            failedTests: results.numFailedTests,
            skippedTests: results.numPendingTests,
            testFiles: results.testResults.map(result => ({
                name: result.name,
                assertionResults: result.assertionResults,
                coverage: result.coverage
            })),
            recommendations: this.generateRecommendations(coverageSummary)
        };

        // Ensure output directory exists
        if (!fs.existsSync(this.outputDirectory)) {
            fs.mkdirSync(this.outputDirectory, { recursive: true });
        }

        // Write detailed coverage report
        const reportPath = path.join(this.outputDirectory, 'coverage-summary.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        // Generate HTML summary report
        this.generateHTMLReport(report);

        console.log(`Coverage report generated: ${reportPath}`);
    }

    extractCoverageSummary(results) {
        if (!results.coverageMap) {
            return {
                lines: 0,
                functions: 0,
                statements: 0,
                branches: 0
            };
        }

        const summary = results.coverageMap.getCoverageSummary();
        return {
            lines: summary.lines.pct,
            functions: summary.functions.pct,
            statements: summary.statements.pct,
            branches: summary.branches.pct
        };
    }

    generateRecommendations(summary) {
        const recommendations = [];

        if (summary.lines < 80) {
            recommendations.push({
                type: 'coverage',
                priority: 'high',
                message: `Test coverage is ${summary.lines}%, consider adding more unit tests`,
                areas: ['unit tests', 'integration tests']
            });
        }

        if (summary.branches < 75) {
            recommendations.push({
                type: 'branch-coverage',
                priority: 'medium',
                message: `Branch coverage is ${summary.branches}%, add tests for edge cases`,
                areas: ['conditional logic', 'error handling']
            });
        }

        if (summary.functions < 85) {
            recommendations.push({
                type: 'function-coverage',
                priority: 'medium',
                message: `Function coverage is ${summary.functions}%, ensure all functions are tested`,
                areas: ['utility functions', 'helper methods']
            });
        }

        return recommendations;
    }

    generateHTMLReport(report) {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Coverage Report - Appointment Booking System</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
        .metric h3 { margin: 0; color: #333; }
        .metric .value { font-size: 2em; font-weight: bold; margin: 10px 0; }
        .good { color: #28a745; }
        .warning { color: #ffc107; }
        .danger { color: #dc3545; }
        .recommendations { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .recommendations h3 { color: #856404; margin-top: 0; }
        .test-files { margin-top: 20px; }
        .test-file { background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Test Coverage Report</h1>
        <p>Generated on: ${report.timestamp}</p>
        <p>Total Tests: ${report.totalTests} | Passed: ${report.passedTests} | Failed: ${report.failedTests} | Skipped: ${report.skippedTests}</p>
    </div>

    <div class="summary">
        <div class="metric">
            <h3>Lines</h3>
            <div class="value ${this.getCoverageClass(report.summary.lines)}">${report.summary.lines}%</div>
        </div>
        <div class="metric">
            <h3>Functions</h3>
            <div class="value ${this.getCoverageClass(report.summary.functions)}">${report.summary.functions}%</div>
        </div>
        <div class="metric">
            <h3>Statements</h3>
            <div class="value ${this.getCoverageClass(report.summary.statements)}">${report.summary.statements}%</div>
        </div>
        <div class="metric">
            <h3>Branches</h3>
            <div class="value ${this.getCoverageClass(report.summary.branches)}">${report.summary.branches}%</div>
        </div>
    </div>

    ${report.recommendations.length > 0 ? `
    <div class="recommendations">
        <h3>Recommendations</h3>
        <ul>
            ${report.recommendations.map(rec => `<li><strong>${rec.priority.toUpperCase()}:</strong> ${rec.message}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    <div class="test-files">
        <h3>Test Files</h3>
        ${report.testFiles.map(file => `
            <div class="test-file">
                <strong>${file.name}</strong>
                <p>Tests: ${file.assertionResults.filter(r => r.status === 'passed').length}/${file.assertionResults.length} passed</p>
            </div>
        `).join('')}
    </div>
</body>
</html>
        `;

        const htmlPath = path.join(this.outputDirectory, 'coverage-report.html');
        fs.writeFileSync(htmlPath, html);
    }

    getCoverageClass(percentage) {
        if (percentage >= 80) return 'good';
        if (percentage >= 60) return 'warning';
        return 'danger';
    }
}

module.exports = CoverageReporter;
const { chromium } = require('playwright');
const fs = require('fs');

class DetailedCustomerJourneyTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = {
      timestamp: new Date().toISOString(),
      overallScore: 0,
      journeySteps: [],
      issues: [],
      recommendations: [],
      screenshots: [],
      javascriptErrors: [],
      domAnalysis: {}
    };
    this.baseUrl = 'http://localhost:3000';
  }

  async initialize() {
    console.log('🚀 Initializing Detailed Customer Journey Test...');
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 500
    });
    this.page = await this.browser.newPage();
    
    // Set viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });
    
    // Capture console errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.testResults.javascriptErrors.push({
          message: msg.text(),
          timestamp: new Date().toISOString()
        });
        console.log('❌ JavaScript Error:', msg.text());
      }
    });

    // Capture page errors
    this.page.on('pageerror', error => {
      this.testResults.javascriptErrors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.log('❌ Page Error:', error.message);
    });
    
    console.log('✅ Browser initialized successfully');
  }

  async analyzeDOM() {
    console.log('\n🔍 Analyzing DOM Structure...');
    
    try {
      // Get all elements in the DOM
      const domAnalysis = await this.page.evaluate(() => {
        const analysis = {
          totalElements: document.querySelectorAll('*').length,
          bodyContent: document.body ? document.body.innerHTML.length : 0,
          reactRoot: document.getElementById('root') ? document.getElementById('root').innerHTML.length : 0,
          hasReactRoot: !!document.getElementById('root'),
          visibleElements: document.querySelectorAll('*:not([style*="display: none"]):not([style*="visibility: hidden"])').length,
          navigationElements: document.querySelectorAll('nav, header, [role="navigation"]').length,
          buttons: document.querySelectorAll('button, [role="button"]').length,
          links: document.querySelectorAll('a[href]').length,
          forms: document.querySelectorAll('form').length,
          inputs: document.querySelectorAll('input, select, textarea').length,
          headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
          paragraphs: document.querySelectorAll('p').length,
          divs: document.querySelectorAll('div').length,
          spans: document.querySelectorAll('span').length,
          scripts: document.querySelectorAll('script').length,
          stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
          reactComponents: document.querySelectorAll('[data-reactroot], [data-react-helmet]').length,
          errorElements: document.querySelectorAll('[class*="error"], [class*="Error"]').length,
          loadingElements: document.querySelectorAll('[class*="loading"], [class*="Loading"], [class*="spinner"]').length
        };

        // Get text content
        analysis.hasTextContent = document.body ? document.body.textContent.trim().length > 0 : false;
        analysis.textContentLength = document.body ? document.body.textContent.trim().length : 0;

        // Check for specific React app indicators
        analysis.hasReactApp = !!(
          document.querySelector('[data-reactroot]') ||
          document.querySelector('#root')?.innerHTML ||
          window.React ||
          window.__REACT_DEVTOOLS_GLOBAL_HOOK__
        );

        return analysis;
      });

      this.testResults.domAnalysis = domAnalysis;
      
      console.log('📊 DOM Analysis Results:');
      console.log(`   Total Elements: ${domAnalysis.totalElements}`);
      console.log(`   React Root Content: ${domAnalysis.reactRoot} characters`);
      console.log(`   Visible Elements: ${domAnalysis.visibleElements}`);
      console.log(`   Has React App: ${domAnalysis.hasReactApp}`);
      console.log(`   Text Content Length: ${domAnalysis.textContentLength}`);
      console.log(`   Navigation Elements: ${domAnalysis.navigationElements}`);
      console.log(`   Buttons: ${domAnalysis.buttons}`);
      console.log(`   Links: ${domAnalysis.links}`);
      console.log(`   Forms: ${domAnalysis.forms}`);
      console.log(`   JavaScript Errors: ${this.testResults.javascriptErrors.length}`);

      return domAnalysis;
      
    } catch (error) {
      console.log('❌ Error analyzing DOM:', error.message);
      this.testResults.issues.push(`DOM Analysis Error: ${error.message}`);
      return null;
    }
  }

  async testLandingPage() {
    console.log('\n📄 Testing Landing Page...');
    const step = {
      name: 'Landing Page',
      score: 0,
      issues: [],
      observations: []
    };

    try {
      // Navigate to landing page
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle', timeout: 10000 });
      await this.page.waitForTimeout(3000);

      // Take screenshot
      const screenshot = await this.page.screenshot({ 
        path: 'detailed_customer_journey_landing_page.png',
        fullPage: true 
      });
      this.testResults.screenshots.push('detailed_customer_journey_landing_page.png');

      // Analyze DOM
      const domAnalysis = await this.analyzeDOM();
      
      if (domAnalysis) {
        // Check if React app is loading
        if (domAnalysis.hasReactApp) {
          step.score += 30;
          step.observations.push('React app detected');
        } else {
          step.issues.push('React app not detected');
        }

        // Check for content
        if (domAnalysis.textContentLength > 100) {
          step.score += 25;
          step.observations.push(`Content found: ${domAnalysis.textContentLength} characters`);
        } else {
          step.issues.push(`Insufficient content: ${domAnalysis.textContentLength} characters`);
        }

        // Check for navigation
        if (domAnalysis.navigationElements > 0) {
          step.score += 20;
          step.observations.push(`${domAnalysis.navigationElements} navigation elements found`);
        } else {
          step.issues.push('No navigation elements found');
        }

        // Check for interactive elements
        if (domAnalysis.buttons > 0 || domAnalysis.links > 0) {
          step.score += 15;
          step.observations.push(`${domAnalysis.buttons} buttons, ${domAnalysis.links} links found`);
        } else {
          step.issues.push('No interactive elements found');
        }

        // Check for forms
        if (domAnalysis.forms > 0) {
          step.score += 10;
          step.observations.push(`${domAnalysis.forms} forms found`);
        } else {
          step.issues.push('No forms found');
        }
      }

      // Check page title
      const title = await this.page.title();
      step.observations.push(`Page title: ${title}`);
      if (title.toLowerCase().includes('unschooling')) {
        step.score += 10;
      } else {
        step.issues.push('Page title does not contain "Unschooling"');
      }

      console.log(`✅ Landing Page Score: ${step.score}/100`);
      
    } catch (error) {
      step.issues.push(`Error testing landing page: ${error.message}`);
      console.log(`❌ Landing Page Error: ${error.message}`);
    }

    this.testResults.journeySteps.push(step);
  }

  async testSpecificRoutes() {
    console.log('\n🧭 Testing Specific Routes...');
    const routes = [
      { path: '/', name: 'Home' },
      { path: '/child-profile', name: 'Child Profile' },
      { path: '/plans', name: 'Plans' },
      { path: '/login', name: 'Login' },
      { path: '/admin', name: 'Admin' }
    ];

    for (const route of routes) {
      console.log(`\n🔍 Testing route: ${route.path}`);
      try {
        await this.page.goto(`${this.baseUrl}${route.path}`, { 
          waitUntil: 'networkidle', 
          timeout: 10000 
        });
        await this.page.waitForTimeout(2000);

        // Take screenshot
        const screenshotName = `detailed_customer_journey_${route.name.toLowerCase().replace(' ', '_')}.png`;
        await this.page.screenshot({ 
          path: screenshotName,
          fullPage: true 
        });
        this.testResults.screenshots.push(screenshotName);

        // Analyze this route
        const domAnalysis = await this.page.evaluate(() => {
          return {
            path: window.location.pathname,
            hasContent: document.body.textContent.trim().length > 50,
            contentLength: document.body.textContent.trim().length,
            hasErrors: document.querySelectorAll('[class*="error"], [class*="Error"]').length > 0,
            hasLoading: document.querySelectorAll('[class*="loading"], [class*="Loading"]').length > 0,
            hasForms: document.querySelectorAll('form').length,
            hasButtons: document.querySelectorAll('button').length,
            hasInputs: document.querySelectorAll('input, select, textarea').length
          };
        });

        console.log(`   Content Length: ${domAnalysis.contentLength}`);
        console.log(`   Has Forms: ${domAnalysis.hasForms}`);
        console.log(`   Has Buttons: ${domAnalysis.hasButtons}`);
        console.log(`   Has Inputs: ${domAnalysis.hasInputs}`);
        console.log(`   Has Errors: ${domAnalysis.hasErrors}`);
        console.log(`   Has Loading: ${domAnalysis.hasLoading}`);

      } catch (error) {
        console.log(`   ❌ Error testing ${route.path}: ${error.message}`);
      }
    }
  }

  async testJavaScriptErrors() {
    console.log('\n🔍 Analyzing JavaScript Errors...');
    
    if (this.testResults.javascriptErrors.length > 0) {
      console.log(`❌ Found ${this.testResults.javascriptErrors.length} JavaScript errors:`);
      this.testResults.javascriptErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.message}`);
      });
    } else {
      console.log('✅ No JavaScript errors detected');
    }
  }

  calculateOverallScore() {
    const totalScore = this.testResults.journeySteps.reduce((sum, step) => sum + step.score, 0);
    const maxScore = this.testResults.journeySteps.length * 100;
    this.testResults.overallScore = Math.round((totalScore / maxScore) * 100);
  }

  generateRecommendations() {
    const recommendations = [];
    const domAnalysis = this.testResults.domAnalysis;

    if (this.testResults.javascriptErrors.length > 0) {
      recommendations.push('Fix JavaScript errors that are preventing proper rendering');
    }

    if (domAnalysis && !domAnalysis.hasReactApp) {
      recommendations.push('React app is not loading properly - check build configuration');
    }

    if (domAnalysis && domAnalysis.textContentLength < 100) {
      recommendations.push('App appears to be loading but content is not rendering');
    }

    if (domAnalysis && domAnalysis.navigationElements === 0) {
      recommendations.push('Add navigation elements for better user experience');
    }

    if (domAnalysis && domAnalysis.buttons === 0 && domAnalysis.links === 0) {
      recommendations.push('Add interactive elements (buttons, links) for user engagement');
    }

    this.testResults.recommendations = recommendations;
  }

  async generateReport() {
    console.log('\n📊 Generating Detailed Test Report...');
    
    this.calculateOverallScore();
    this.generateRecommendations();

    const report = {
      ...this.testResults,
      summary: {
        totalSteps: this.testResults.journeySteps.length,
        averageScore: Math.round(this.testResults.journeySteps.reduce((sum, step) => sum + step.score, 0) / this.testResults.journeySteps.length),
        totalIssues: this.testResults.journeySteps.reduce((sum, step) => sum + step.issues.length, 0),
        screenshotsTaken: this.testResults.screenshots.length,
        javascriptErrors: this.testResults.javascriptErrors.length
      }
    };

    // Save report to file
    const reportPath = 'detailed_customer_journey_test_report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = 'detailed_customer_journey_test_report.md';
    fs.writeFileSync(markdownPath, markdownReport);

    console.log(`✅ Detailed report generated: ${reportPath} and ${markdownPath}`);
    return report;
  }

  generateMarkdownReport(report) {
    let markdown = `# 🔍 Detailed Customer Journey Test Report\n\n`;
    markdown += `**Test Date**: ${new Date(report.timestamp).toLocaleString()}\n`;
    markdown += `**Overall Score**: ${report.overallScore}/100\n\n`;

    markdown += `## 📊 Executive Summary\n\n`;
    markdown += `- **Total Steps Tested**: ${report.summary.totalSteps}\n`;
    markdown += `- **Average Score**: ${report.summary.averageScore}/100\n`;
    markdown += `- **Total Issues Found**: ${report.summary.totalIssues}\n`;
    markdown += `- **Screenshots Taken**: ${report.summary.screenshotsTaken}\n`;
    markdown += `- **JavaScript Errors**: ${report.summary.javascriptErrors}\n\n`;

    markdown += `## 🔍 DOM Analysis\n\n`;
    if (report.domAnalysis) {
      markdown += `- **Total Elements**: ${report.domAnalysis.totalElements}\n`;
      markdown += `- **React Root Content**: ${report.domAnalysis.reactRoot} characters\n`;
      markdown += `- **Visible Elements**: ${report.domAnalysis.visibleElements}\n`;
      markdown += `- **Has React App**: ${report.domAnalysis.hasReactApp}\n`;
      markdown += `- **Text Content Length**: ${report.domAnalysis.textContentLength}\n`;
      markdown += `- **Navigation Elements**: ${report.domAnalysis.navigationElements}\n`;
      markdown += `- **Buttons**: ${report.domAnalysis.buttons}\n`;
      markdown += `- **Links**: ${report.domAnalysis.links}\n`;
      markdown += `- **Forms**: ${report.domAnalysis.forms}\n`;
      markdown += `- **Inputs**: ${report.domAnalysis.inputs}\n\n`;
    }

    markdown += `## 🎯 Journey Steps Analysis\n\n`;
    
    report.journeySteps.forEach((step, index) => {
      markdown += `### ${index + 1}. ${step.name}\n`;
      markdown += `**Score**: ${step.score}/100\n\n`;
      
      if (step.observations.length > 0) {
        markdown += `**✅ Observations**:\n`;
        step.observations.forEach(obs => {
          markdown += `- ${obs}\n`;
        });
        markdown += `\n`;
      }
      
      if (step.issues.length > 0) {
        markdown += `**❌ Issues**:\n`;
        step.issues.forEach(issue => {
          markdown += `- ${issue}\n`;
        });
        markdown += `\n`;
      }
    });

    if (report.javascriptErrors.length > 0) {
      markdown += `## ❌ JavaScript Errors\n\n`;
      report.javascriptErrors.forEach((error, index) => {
        markdown += `### Error ${index + 1}\n`;
        markdown += `**Message**: ${error.message}\n`;
        if (error.stack) {
          markdown += `**Stack**: \`\`\`\n${error.stack}\n\`\`\`\n`;
        }
        markdown += `**Timestamp**: ${error.timestamp}\n\n`;
      });
    }

    markdown += `## 🎯 Recommendations\n\n`;
    report.recommendations.forEach((rec, index) => {
      markdown += `${index + 1}. ${rec}\n`;
    });

    markdown += `\n## 📸 Screenshots\n\n`;
    report.screenshots.forEach(screenshot => {
      markdown += `- ${screenshot}\n`;
    });

    markdown += `\n## 🏆 Overall Assessment\n\n`;
    
    if (report.overallScore >= 90) {
      markdown += `**Grade: A+ (Excellent)** - Outstanding user experience with minimal issues.\n`;
    } else if (report.overallScore >= 80) {
      markdown += `**Grade: A (Very Good)** - Strong user experience with minor improvements needed.\n`;
    } else if (report.overallScore >= 70) {
      markdown += `**Grade: B (Good)** - Good foundation with some areas for improvement.\n`;
    } else if (report.overallScore >= 60) {
      markdown += `**Grade: C (Fair)** - Basic functionality works but needs significant improvements.\n`;
    } else {
      markdown += `**Grade: D (Poor)** - Major issues need to be addressed for a good user experience.\n`;
    }

    return markdown;
  }

  async runDetailedTest() {
    try {
      console.log('🎬 Starting Detailed Customer Journey Test...\n');
      
      await this.initialize();
      await this.testLandingPage();
      await this.testSpecificRoutes();
      await this.testJavaScriptErrors();
      
      const report = await this.generateReport();
      
      console.log('\n🎉 Detailed Customer Journey Test Complete!');
      console.log(`📊 Overall Score: ${report.overallScore}/100`);
      console.log(`📄 Report saved to: detailed_customer_journey_test_report.md`);
      console.log(`🔍 JavaScript Errors: ${report.summary.javascriptErrors}`);
      
      return report;
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the detailed test
async function runDetailedCustomerJourneyTest() {
  const tester = new DetailedCustomerJourneyTester();
  try {
    const results = await tester.runDetailedTest();
    console.log('\n✅ Detailed test completed successfully!');
    return results;
  } catch (error) {
    console.error('❌ Detailed test failed:', error);
    process.exit(1);
  }
}

// Export for use as module or run directly
if (require.main === module) {
  runDetailedCustomerJourneyTest();
}

module.exports = { DetailedCustomerJourneyTester, runDetailedCustomerJourneyTest };

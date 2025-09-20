const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class CustomerJourneyTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = {
      timestamp: new Date().toISOString(),
      overallScore: 0,
      journeySteps: [],
      issues: [],
      recommendations: [],
      screenshots: []
    };
    this.baseUrl = 'http://localhost:3000';
  }

  async initialize() {
    console.log('🚀 Initializing Customer Journey Test...');
    this.browser = await chromium.launch({ 
      headless: false, // Set to true for headless mode
      slowMo: 1000 // Slow down for better observation
    });
    this.page = await this.browser.newPage();
    
    // Set viewport for consistent testing
    await this.page.setViewportSize({ width: 1280, height: 720 });
    
    console.log('✅ Browser initialized successfully');
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
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle' });
      await this.page.waitForTimeout(2000);

      // Take screenshot
      const screenshot = await this.page.screenshot({ 
        path: 'customer_journey_landing_page.png',
        fullPage: true 
      });
      this.testResults.screenshots.push('customer_journey_landing_page.png');

      // Check page title
      const title = await this.page.title();
      step.observations.push(`Page title: ${title}`);
      if (title.toLowerCase().includes('unschooling')) {
        step.score += 20;
      } else {
        step.issues.push('Page title does not contain "Unschooling"');
      }

      // Check for key navigation elements
      const navElements = await this.page.locator('nav, header').count();
      if (navElements > 0) {
        step.score += 15;
        step.observations.push('Navigation elements found');
      } else {
        step.issues.push('No navigation elements found');
      }

      // Check for main content sections
      const heroSection = await this.page.locator('h1, .hero, [class*="hero"]').count();
      if (heroSection > 0) {
        step.score += 20;
        step.observations.push('Hero section found');
      } else {
        step.issues.push('No hero section found');
      }

      // Check for call-to-action buttons
      const ctaButtons = await this.page.locator('button, a[class*="btn"], [class*="cta"]').count();
      if (ctaButtons > 0) {
        step.score += 15;
        step.observations.push(`${ctaButtons} CTA buttons found`);
      } else {
        step.issues.push('No call-to-action buttons found');
      }

      // Check for signup/login options
      const authButtons = await this.page.locator('a[href*="login"], a[href*="signup"], button:has-text("Sign"), button:has-text("Login")').count();
      if (authButtons > 0) {
        step.score += 20;
        step.observations.push(`${authButtons} authentication buttons found`);
      } else {
        step.issues.push('No signup/login buttons found');
      }

      // Check for responsive design indicators
      const responsiveElements = await this.page.locator('[class*="responsive"], [class*="mobile"], [class*="tablet"]').count();
      if (responsiveElements > 0) {
        step.score += 10;
        step.observations.push('Responsive design elements found');
      }

      console.log(`✅ Landing Page Score: ${step.score}/100`);
      
    } catch (error) {
      step.issues.push(`Error testing landing page: ${error.message}`);
      console.log(`❌ Landing Page Error: ${error.message}`);
    }

    this.testResults.journeySteps.push(step);
  }

  async testNavigationAndContent() {
    console.log('\n🧭 Testing Navigation and Content...');
    const step = {
      name: 'Navigation & Content',
      score: 0,
      issues: [],
      observations: []
    };

    try {
      // Test navigation links
      const navLinks = await this.page.locator('nav a, header a').all();
      step.observations.push(`Found ${navLinks.length} navigation links`);

      if (navLinks.length > 0) {
        step.score += 25;
        
        // Test each navigation link
        for (let i = 0; i < Math.min(navLinks.length, 5); i++) {
          try {
            const link = navLinks[i];
            const href = await link.getAttribute('href');
            const text = await link.textContent();
            
            if (href && href !== '#') {
              step.observations.push(`Link: ${text} -> ${href}`);
              step.score += 5;
            }
          } catch (error) {
            step.issues.push(`Error testing navigation link ${i}: ${error.message}`);
          }
        }
      } else {
        step.issues.push('No navigation links found');
      }

      // Check for main content sections
      const contentSections = await this.page.locator('section, main, .content, [class*="section"]').count();
      if (contentSections > 0) {
        step.score += 20;
        step.observations.push(`${contentSections} content sections found`);
      } else {
        step.issues.push('No content sections found');
      }

      // Check for features or benefits section
      const featuresSection = await this.page.locator('[class*="feature"], [class*="benefit"], [class*="about"]').count();
      if (featuresSection > 0) {
        step.score += 15;
        step.observations.push('Features/benefits section found');
      }

      // Check for testimonials or social proof
      const testimonials = await this.page.locator('[class*="testimonial"], [class*="review"]').count();
      if (testimonials > 0) {
        step.score += 10;
        step.observations.push('Testimonials/social proof found');
      }

      // Check for pricing or plans section
      const pricingSection = await this.page.locator('[class*="pricing"], [class*="plan"]').count();
      if (pricingSection > 0) {
        step.score += 15;
        step.observations.push('Pricing/plans section found');
      }

      // Check for footer
      const footer = await this.page.locator('footer, [class*="footer"]').count();
      if (footer > 0) {
        step.score += 10;
        step.observations.push('Footer found');
      }

      console.log(`✅ Navigation & Content Score: ${step.score}/100`);
      
    } catch (error) {
      step.issues.push(`Error testing navigation: ${error.message}`);
      console.log(`❌ Navigation Error: ${error.message}`);
    }

    this.testResults.journeySteps.push(step);
  }

  async testAuthenticationFlow() {
    console.log('\n🔐 Testing Authentication Flow...');
    const step = {
      name: 'Authentication Flow',
      score: 0,
      issues: [],
      observations: []
    };

    try {
      // Look for login/signup buttons
      const loginButton = await this.page.locator('a[href*="login"], button:has-text("Login"), button:has-text("Sign In")').first();
      
      if (await loginButton.count() > 0) {
        step.score += 30;
        step.observations.push('Login button found');
        
        // Click login button
        await loginButton.click();
        await this.page.waitForTimeout(2000);

        // Take screenshot of login page
        const loginScreenshot = await this.page.screenshot({ 
          path: 'customer_journey_login_page.png',
          fullPage: true 
        });
        this.testResults.screenshots.push('customer_journey_login_page.png');

        // Check if we're on a login page
        const currentUrl = this.page.url();
        if (currentUrl.includes('login') || currentUrl.includes('auth')) {
          step.score += 25;
          step.observations.push('Successfully navigated to login page');
        } else {
          step.issues.push('Did not navigate to login page');
        }

        // Check for email/password fields
        const emailField = await this.page.locator('input[type="email"], input[name*="email"]').count();
        const passwordField = await this.page.locator('input[type="password"], input[name*="password"]').count();
        
        if (emailField > 0 && passwordField > 0) {
          step.score += 25;
          step.observations.push('Email and password fields found');
        } else {
          step.issues.push('Missing email or password fields');
        }

        // Check for signup option
        const signupLink = await this.page.locator('a[href*="signup"], button:has-text("Sign Up"), a:has-text("Create Account")').count();
        if (signupLink > 0) {
          step.score += 20;
          step.observations.push('Signup option found');
        } else {
          step.issues.push('No signup option found');
        }

      } else {
        step.issues.push('No login button found');
      }

      console.log(`✅ Authentication Flow Score: ${step.score}/100`);
      
    } catch (error) {
      step.issues.push(`Error testing authentication: ${error.message}`);
      console.log(`❌ Authentication Error: ${error.message}`);
    }

    this.testResults.journeySteps.push(step);
  }

  async testProfileCreation() {
    console.log('\n👶 Testing Profile Creation...');
    const step = {
      name: 'Profile Creation',
      score: 0,
      issues: [],
      observations: []
    };

    try {
      // Navigate to profile page (assuming it exists)
      await this.page.goto(`${this.baseUrl}/child-profile`, { waitUntil: 'networkidle' });
      await this.page.waitForTimeout(2000);

      // Take screenshot
      const profileScreenshot = await this.page.screenshot({ 
        path: 'customer_journey_profile_page.png',
        fullPage: true 
      });
      this.testResults.screenshots.push('customer_journey_profile_page.png');

      // Check for profile form
      const form = await this.page.locator('form').count();
      if (form > 0) {
        step.score += 20;
        step.observations.push('Profile form found');
      } else {
        step.issues.push('No profile form found');
      }

      // Check for child name field
      const nameField = await this.page.locator('input[name*="name"], input[placeholder*="name"]').count();
      if (nameField > 0) {
        step.score += 15;
        step.observations.push('Child name field found');
      } else {
        step.issues.push('No child name field found');
      }

      // Check for age field
      const ageField = await this.page.locator('input[name*="age"], select[name*="age"], input[type="number"]').count();
      if (ageField > 0) {
        step.score += 15;
        step.observations.push('Age field found');
      } else {
        step.issues.push('No age field found');
      }

      // Check for interests selection
      const interestsSection = await this.page.locator('[class*="interest"], [class*="hobby"], input[type="checkbox"]').count();
      if (interestsSection > 0) {
        step.score += 20;
        step.observations.push('Interests selection found');
      } else {
        step.issues.push('No interests selection found');
      }

      // Check for learning style selection
      const learningStyle = await this.page.locator('[class*="learning"], [class*="style"], select').count();
      if (learningStyle > 0) {
        step.score += 15;
        step.observations.push('Learning style selection found');
      } else {
        step.issues.push('No learning style selection found');
      }

      // Check for submit button
      const submitButton = await this.page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Create")').count();
      if (submitButton > 0) {
        step.score += 15;
        step.observations.push('Submit button found');
      } else {
        step.issues.push('No submit button found');
      }

      console.log(`✅ Profile Creation Score: ${step.score}/100`);
      
    } catch (error) {
      step.issues.push(`Error testing profile creation: ${error.message}`);
      console.log(`❌ Profile Creation Error: ${error.message}`);
    }

    this.testResults.journeySteps.push(step);
  }

  async testPlanGeneration() {
    console.log('\n📋 Testing Plan Generation...');
    const step = {
      name: 'Plan Generation',
      score: 0,
      issues: [],
      observations: []
    };

    try {
      // Navigate to plans page
      await this.page.goto(`${this.baseUrl}/plans`, { waitUntil: 'networkidle' });
      await this.page.waitForTimeout(2000);

      // Take screenshot
      const plansScreenshot = await this.page.screenshot({ 
        path: 'customer_journey_plans_page.png',
        fullPage: true 
      });
      this.testResults.screenshots.push('customer_journey_plans_page.png');

      // Check for plans content
      const plansContent = await this.page.locator('[class*="plan"], [class*="activity"], h1, h2, h3').count();
      if (plansContent > 0) {
        step.score += 30;
        step.observations.push('Plans content found');
      } else {
        step.issues.push('No plans content found');
      }

      // Check for activity cards or items
      const activityCards = await this.page.locator('[class*="card"], [class*="activity"], [class*="item"]').count();
      if (activityCards > 0) {
        step.score += 25;
        step.observations.push(`${activityCards} activity cards found`);
      } else {
        step.issues.push('No activity cards found');
      }

      // Check for loading states or placeholders
      const loadingElements = await this.page.locator('[class*="loading"], [class*="spinner"], [class*="skeleton"]').count();
      if (loadingElements > 0) {
        step.score += 15;
        step.observations.push('Loading states found');
      }

      // Check for error handling
      const errorElements = await this.page.locator('[class*="error"], [class*="alert"]').count();
      if (errorElements === 0) {
        step.score += 15;
        step.observations.push('No error states visible');
      } else {
        step.issues.push('Error states visible on page');
      }

      // Check for interactive elements
      const interactiveElements = await this.page.locator('button, a, [role="button"]').count();
      if (interactiveElements > 0) {
        step.score += 15;
        step.observations.push(`${interactiveElements} interactive elements found`);
      } else {
        step.issues.push('No interactive elements found');
      }

      console.log(`✅ Plan Generation Score: ${step.score}/100`);
      
    } catch (error) {
      step.issues.push(`Error testing plan generation: ${error.message}`);
      console.log(`❌ Plan Generation Error: ${error.message}`);
    }

    this.testResults.journeySteps.push(step);
  }

  async testResponsiveDesign() {
    console.log('\n📱 Testing Responsive Design...');
    const step = {
      name: 'Responsive Design',
      score: 0,
      issues: [],
      observations: []
    };

    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1280, height: 720 }
    ];

    try {
      for (const viewport of viewports) {
        await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
        await this.page.waitForTimeout(1000);

        // Take screenshot for each viewport
        const screenshot = await this.page.screenshot({ 
          path: `customer_journey_${viewport.name.toLowerCase()}.png`,
          fullPage: true 
        });
        this.testResults.screenshots.push(`customer_journey_${viewport.name.toLowerCase()}.png`);

        // Check if content is visible and properly sized
        const visibleElements = await this.page.locator('body *:visible').count();
        if (visibleElements > 10) {
          step.score += 10;
          step.observations.push(`${viewport.name}: ${visibleElements} visible elements`);
        } else {
          step.issues.push(`${viewport.name}: Too few visible elements (${visibleElements})`);
        }

        // Check for horizontal scroll (should not exist)
        const hasHorizontalScroll = await this.page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        if (!hasHorizontalScroll) {
          step.score += 5;
          step.observations.push(`${viewport.name}: No horizontal scroll`);
        } else {
          step.issues.push(`${viewport.name}: Has horizontal scroll`);
        }
      }

      console.log(`✅ Responsive Design Score: ${step.score}/100`);
      
    } catch (error) {
      step.issues.push(`Error testing responsive design: ${error.message}`);
      console.log(`❌ Responsive Design Error: ${error.message}`);
    }

    this.testResults.journeySteps.push(step);
  }

  calculateOverallScore() {
    const totalScore = this.testResults.journeySteps.reduce((sum, step) => sum + step.score, 0);
    const maxScore = this.testResults.journeySteps.length * 100;
    this.testResults.overallScore = Math.round((totalScore / maxScore) * 100);
  }

  generateRecommendations() {
    const recommendations = [];

    // Analyze issues and generate recommendations
    const allIssues = this.testResults.journeySteps.flatMap(step => step.issues);
    
    if (allIssues.some(issue => issue.includes('navigation'))) {
      recommendations.push('Improve navigation structure and ensure all links are functional');
    }
    
    if (allIssues.some(issue => issue.includes('authentication'))) {
      recommendations.push('Enhance authentication flow with clear signup/login options');
    }
    
    if (allIssues.some(issue => issue.includes('form'))) {
      recommendations.push('Optimize form design and ensure all required fields are present');
    }
    
    if (allIssues.some(issue => issue.includes('responsive'))) {
      recommendations.push('Fix responsive design issues for better mobile experience');
    }
    
    if (allIssues.some(issue => issue.includes('content'))) {
      recommendations.push('Add more engaging content and clear value propositions');
    }

    // Add general recommendations based on score
    if (this.testResults.overallScore < 70) {
      recommendations.push('Overall user experience needs significant improvement');
    } else if (this.testResults.overallScore < 85) {
      recommendations.push('Good foundation, focus on addressing specific issues');
    } else {
      recommendations.push('Excellent user experience, minor optimizations recommended');
    }

    this.testResults.recommendations = recommendations;
  }

  async generateReport() {
    console.log('\n📊 Generating Test Report...');
    
    this.calculateOverallScore();
    this.generateRecommendations();

    const report = {
      ...this.testResults,
      summary: {
        totalSteps: this.testResults.journeySteps.length,
        averageScore: Math.round(this.testResults.journeySteps.reduce((sum, step) => sum + step.score, 0) / this.testResults.journeySteps.length),
        totalIssues: this.testResults.journeySteps.reduce((sum, step) => sum + step.issues.length, 0),
        screenshotsTaken: this.testResults.screenshots.length
      }
    };

    // Save report to file
    const reportPath = 'customer_journey_test_report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = 'customer_journey_test_report.md';
    fs.writeFileSync(markdownPath, markdownReport);

    console.log(`✅ Report generated: ${reportPath} and ${markdownPath}`);
    return report;
  }

  generateMarkdownReport(report) {
    let markdown = `# 🚀 Customer Journey Test Report\n\n`;
    markdown += `**Test Date**: ${new Date(report.timestamp).toLocaleString()}\n`;
    markdown += `**Overall Score**: ${report.overallScore}/100\n\n`;

    markdown += `## 📊 Executive Summary\n\n`;
    markdown += `- **Total Steps Tested**: ${report.summary.totalSteps}\n`;
    markdown += `- **Average Score**: ${report.summary.averageScore}/100\n`;
    markdown += `- **Total Issues Found**: ${report.summary.totalIssues}\n`;
    markdown += `- **Screenshots Taken**: ${report.summary.screenshotsTaken}\n\n`;

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

  async runFullTest() {
    try {
      console.log('🎬 Starting Complete Customer Journey Test...\n');
      
      await this.initialize();
      await this.testLandingPage();
      await this.testNavigationAndContent();
      await this.testAuthenticationFlow();
      await this.testProfileCreation();
      await this.testPlanGeneration();
      await this.testResponsiveDesign();
      
      const report = await this.generateReport();
      
      console.log('\n🎉 Customer Journey Test Complete!');
      console.log(`📊 Overall Score: ${report.overallScore}/100`);
      console.log(`📄 Report saved to: customer_journey_test_report.md`);
      
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

// Run the test
async function runCustomerJourneyTest() {
  const tester = new CustomerJourneyTester();
  try {
    const results = await tester.runFullTest();
    console.log('\n✅ Test completed successfully!');
    return results;
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Export for use as module or run directly
if (require.main === module) {
  runCustomerJourneyTest();
}

module.exports = { CustomerJourneyTester, runCustomerJourneyTest };

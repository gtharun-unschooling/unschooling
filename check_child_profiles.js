const { chromium } = require('playwright');
const fs = require('fs');

class ChildProfileChecker {
  constructor() {
    this.browser = null;
    this.page = null;
    this.profileData = {
      timestamp: new Date().toISOString(),
      userInfo: null,
      childProfiles: [],
      profileStatus: {},
      totalProfiles: 0,
      issues: [],
      recommendations: []
    };
    this.baseUrl = 'http://localhost:3000';
  }

  async initialize() {
    console.log('🚀 Initializing Child Profile Checker...');
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 500
    });
    this.page = await this.browser.newPage();
    
    // Set viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });
    
    // Capture console logs
    this.page.on('console', msg => {
      if (msg.type() === 'log' || msg.type() === 'info') {
        console.log('📝 Console:', msg.text());
      } else if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });

    // Capture page errors
    this.page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
    });
    
    console.log('✅ Browser initialized successfully');
  }

  async checkUserLoginStatus() {
    console.log('\n🔐 Checking User Login Status...');
    
    try {
      // Navigate to the app
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle', timeout: 10000 });
      await this.page.waitForTimeout(3000);

      // Check if user is logged in by looking for authentication elements
      const loginButton = await this.page.$('a[href="/login"], button:has-text("Sign In"), button:has-text("Login")');
      const userMenu = await this.page.$('[data-testid="user-menu"], .user-menu, .profile-menu');
      const logoutButton = await this.page.$('button:has-text("Logout"), button:has-text("Sign Out")');

      if (loginButton && !userMenu) {
        console.log('❌ User is NOT logged in');
        this.profileData.userInfo = { status: 'not_logged_in' };
        return false;
      } else if (userMenu || logoutButton) {
        console.log('✅ User appears to be logged in');
        
        // Try to get user email or name
        const userEmail = await this.page.$eval('.user-email, .user-name, [data-testid="user-email"]', el => el.textContent).catch(() => null);
        const userDisplayName = await this.page.$eval('.user-display-name, .profile-name', el => el.textContent).catch(() => null);
        
        this.profileData.userInfo = {
          status: 'logged_in',
          email: userEmail,
          displayName: userDisplayName
        };
        
        console.log(`👤 User Email: ${userEmail || 'Not found'}`);
        console.log(`👤 Display Name: ${userDisplayName || 'Not found'}`);
        return true;
      } else {
        console.log('⚠️ Login status unclear - checking profile page directly');
        return await this.checkProfilePageDirectly();
      }
    } catch (error) {
      console.log(`❌ Error checking login status: ${error.message}`);
      this.profileData.issues.push(`Login check error: ${error.message}`);
      return false;
    }
  }

  async checkProfilePageDirectly() {
    console.log('\n👶 Checking Profile Page Directly...');
    
    try {
      // Navigate to child profile page
      await this.page.goto(`${this.baseUrl}/child-profile`, { waitUntil: 'networkidle', timeout: 10000 });
      await this.page.waitForTimeout(3000);

      // Check if we can access the profile page (indicates user is logged in)
      const profileForm = await this.page.$('form, .profile-form, [data-testid="profile-form"]');
      const childNameInput = await this.page.$('input[placeholder*="name"], input[name*="name"], #childName');
      
      if (profileForm || childNameInput) {
        console.log('✅ Profile page accessible - user is logged in');
        this.profileData.userInfo = { status: 'logged_in', source: 'profile_page_access' };
        return true;
      } else {
        console.log('❌ Profile page not accessible - user may not be logged in');
        this.profileData.userInfo = { status: 'not_logged_in', source: 'profile_page_blocked' };
        return false;
      }
    } catch (error) {
      console.log(`❌ Error checking profile page: ${error.message}`);
      this.profileData.issues.push(`Profile page check error: ${error.message}`);
      return false;
    }
  }

  async analyzeChildProfiles() {
    console.log('\n👶 Analyzing Child Profiles...');
    
    try {
      // Navigate to child profile page
      await this.page.goto(`${this.baseUrl}/child-profile`, { waitUntil: 'networkidle', timeout: 10000 });
      await this.page.waitForTimeout(3000);

      // Take screenshot
      await this.page.screenshot({ 
        path: 'child_profiles_analysis.png',
        fullPage: true 
      });

      // Look for child profile elements
      const profileAnalysis = await this.page.evaluate(() => {
        const analysis = {
          hasProfileForm: false,
          hasChildSelector: false,
          hasExistingProfiles: false,
          profileCount: 0,
          profileNames: [],
          formFields: {},
          debugInfo: {},
          errors: []
        };

        // Check for profile form
        const profileForm = document.querySelector('form, .profile-form, [data-testid="profile-form"]');
        if (profileForm) {
          analysis.hasProfileForm = true;
          
          // Check form fields
          const childNameInput = document.querySelector('input[placeholder*="name"], input[name*="name"], #childName');
          const ageInput = document.querySelector('input[type="range"], input[name*="age"], #age');
          const interestsSection = document.querySelector('[class*="interest"], [data-testid*="interest"]');
          const learningStyleSection = document.querySelector('[class*="learning"], [data-testid*="learning"]');
          const goalsSection = document.querySelector('[class*="goal"], [data-testid*="goal"]');
          const submitButton = document.querySelector('button[type="submit"], button:has-text("Create"), button:has-text("Generate")');
          
          analysis.formFields = {
            childName: !!childNameInput,
            age: !!ageInput,
            interests: !!interestsSection,
            learningStyle: !!learningStyleSection,
            goals: !!goalsSection,
            submitButton: !!submitButton
          };
        }

        // Check for child selector (existing profiles)
        const childSelector = document.querySelector('.child-selector, [class*="child-selector"], [data-testid*="child-selector"]');
        const childButtons = document.querySelectorAll('button:has-text("Child"), .child-button, [class*="child-button"]');
        const addChildButton = document.querySelector('button:has-text("Add"), button:has-text("New"), [class*="add-child"]');
        
        if (childSelector || childButtons.length > 0) {
          analysis.hasChildSelector = true;
          analysis.hasExistingProfiles = childButtons.length > 0;
          analysis.profileCount = childButtons.length;
          
          // Extract child names
          childButtons.forEach(button => {
            const name = button.textContent.trim();
            if (name && name !== 'Add' && name !== 'New') {
              analysis.profileNames.push(name);
            }
          });
        }

        // Check for debug information
        const debugSection = document.querySelector('.debug, [class*="debug"], [data-testid*="debug"]');
        if (debugSection) {
          analysis.debugInfo = {
            hasDebugSection: true,
            content: debugSection.textContent.substring(0, 500) // First 500 chars
          };
        }

        // Check for error messages
        const errorElements = document.querySelectorAll('.error, [class*="error"], .alert-danger, [class*="alert"]');
        errorElements.forEach(error => {
          const text = error.textContent.trim();
          if (text) {
            analysis.errors.push(text);
          }
        });

        return analysis;
      });

      this.profileData.childProfiles = profileAnalysis;
      this.profileData.totalProfiles = profileAnalysis.profileCount;

      console.log('📊 Profile Analysis Results:');
      console.log(`   Has Profile Form: ${profileAnalysis.hasProfileForm}`);
      console.log(`   Has Child Selector: ${profileAnalysis.hasChildSelector}`);
      console.log(`   Has Existing Profiles: ${profileAnalysis.hasExistingProfiles}`);
      console.log(`   Profile Count: ${profileAnalysis.profileCount}`);
      console.log(`   Profile Names: ${profileAnalysis.profileNames.join(', ') || 'None'}`);
      console.log(`   Form Fields Available:`, profileAnalysis.formFields);
      console.log(`   Errors Found: ${profileAnalysis.errors.length}`);

      if (profileAnalysis.errors.length > 0) {
        console.log('❌ Errors:');
        profileAnalysis.errors.forEach(error => console.log(`   - ${error}`));
      }

      return profileAnalysis;

    } catch (error) {
      console.log(`❌ Error analyzing child profiles: ${error.message}`);
      this.profileData.issues.push(`Profile analysis error: ${error.message}`);
      return null;
    }
  }

  async checkProfileStatus() {
    console.log('\n📊 Checking Profile Status...');
    
    const analysis = this.profileData.childProfiles;
    if (!analysis) {
      console.log('❌ No profile analysis available');
      return;
    }

    const status = {
      overall: 'unknown',
      issues: [],
      recommendations: []
    };

    // Check if user is logged in
    if (this.profileData.userInfo?.status !== 'logged_in') {
      status.overall = 'not_logged_in';
      status.issues.push('User is not logged in');
      status.recommendations.push('Please log in to access child profiles');
      this.profileData.profileStatus = status;
      return;
    }

    // Check profile form availability
    if (!analysis.hasProfileForm) {
      status.issues.push('Profile form not found');
      status.recommendations.push('Profile form may not be rendering properly');
    }

    // Check form fields
    const requiredFields = ['childName', 'age', 'interests', 'learningStyle', 'goals', 'submitButton'];
    const missingFields = requiredFields.filter(field => !analysis.formFields[field]);
    
    if (missingFields.length > 0) {
      status.issues.push(`Missing form fields: ${missingFields.join(', ')}`);
      status.recommendations.push('Form fields may not be rendering properly');
    }

    // Check existing profiles
    if (analysis.hasExistingProfiles) {
      status.overall = 'profiles_exist';
      console.log(`✅ Found ${analysis.profileCount} existing child profile(s)`);
      console.log(`👶 Child names: ${analysis.profileNames.join(', ')}`);
    } else if (analysis.hasProfileForm) {
      status.overall = 'no_profiles_but_form_available';
      console.log('⚠️ No existing profiles found, but profile form is available');
      status.recommendations.push('You can create your first child profile using the form');
    } else {
      status.overall = 'no_access';
      console.log('❌ Cannot access profile functionality');
    }

    // Check for errors
    if (analysis.errors.length > 0) {
      status.issues.push(`Found ${analysis.errors.length} error(s) on the page`);
      status.recommendations.push('Review and fix the errors shown on the page');
    }

    this.profileData.profileStatus = status;
  }

  generateRecommendations() {
    const recommendations = [];
    const status = this.profileData.profileStatus;

    if (status.overall === 'not_logged_in') {
      recommendations.push('🔐 Please log in to your account to access child profiles');
    } else if (status.overall === 'profiles_exist') {
      recommendations.push('✅ You have existing child profiles - you can view and manage them');
      recommendations.push('👶 Consider creating additional profiles for other children if needed');
    } else if (status.overall === 'no_profiles_but_form_available') {
      recommendations.push('👶 Create your first child profile using the form on the page');
      recommendations.push('📝 Fill in all required fields: name, age, interests, learning style, and goals');
    } else if (status.overall === 'no_access') {
      recommendations.push('🔧 There may be an issue with the profile page - try refreshing');
      recommendations.push('📞 Contact support if the issue persists');
    }

    if (status.issues.length > 0) {
      recommendations.push('🔧 Address the following issues:');
      status.issues.forEach(issue => recommendations.push(`   - ${issue}`));
    }

    this.profileData.recommendations = recommendations;
  }

  async generateReport() {
    console.log('\n📊 Generating Child Profile Report...');
    
    this.checkProfileStatus();
    this.generateRecommendations();

    const report = {
      ...this.profileData,
      summary: {
        userLoggedIn: this.profileData.userInfo?.status === 'logged_in',
        totalProfiles: this.profileData.totalProfiles,
        profileNames: this.profileData.childProfiles?.profileNames || [],
        hasFormAccess: this.profileData.childProfiles?.hasProfileForm || false,
        issuesFound: this.profileData.issues.length + (this.profileData.profileStatus?.issues?.length || 0),
        recommendationsCount: this.profileData.recommendations.length
      }
    };

    // Save report to file
    const reportPath = 'child_profiles_report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = 'child_profiles_report.md';
    fs.writeFileSync(markdownPath, markdownReport);

    console.log(`✅ Report generated: ${reportPath} and ${markdownPath}`);
    return report;
  }

  generateMarkdownReport(report) {
    let markdown = `# 👶 Child Profiles Status Report\n\n`;
    markdown += `**Report Date**: ${new Date(report.timestamp).toLocaleString()}\n\n`;

    markdown += `## 📊 Executive Summary\n\n`;
    markdown += `- **User Logged In**: ${report.summary.userLoggedIn ? '✅ Yes' : '❌ No'}\n`;
    markdown += `- **Total Child Profiles**: ${report.summary.totalProfiles}\n`;
    markdown += `- **Profile Names**: ${report.summary.profileNames.length > 0 ? report.summary.profileNames.join(', ') : 'None'}\n`;
    markdown += `- **Form Access**: ${report.summary.hasFormAccess ? '✅ Available' : '❌ Not Available'}\n`;
    markdown += `- **Issues Found**: ${report.summary.issuesFound}\n`;
    markdown += `- **Recommendations**: ${report.summary.recommendationsCount}\n\n`;

    if (report.userInfo) {
      markdown += `## 👤 User Information\n\n`;
      markdown += `- **Status**: ${report.userInfo.status}\n`;
      if (report.userInfo.email) markdown += `- **Email**: ${report.userInfo.email}\n`;
      if (report.userInfo.displayName) markdown += `- **Display Name**: ${report.userInfo.displayName}\n`;
      markdown += `\n`;
    }

    if (report.childProfiles) {
      markdown += `## 👶 Child Profiles Analysis\n\n`;
      markdown += `- **Has Profile Form**: ${report.childProfiles.hasProfileForm ? '✅ Yes' : '❌ No'}\n`;
      markdown += `- **Has Child Selector**: ${report.childProfiles.hasChildSelector ? '✅ Yes' : '❌ No'}\n`;
      markdown += `- **Has Existing Profiles**: ${report.childProfiles.hasExistingProfiles ? '✅ Yes' : '❌ No'}\n`;
      markdown += `- **Profile Count**: ${report.childProfiles.profileCount}\n`;
      
      if (report.childProfiles.profileNames.length > 0) {
        markdown += `- **Profile Names**:\n`;
        report.childProfiles.profileNames.forEach(name => {
          markdown += `  - ${name}\n`;
        });
      }
      
      markdown += `\n### Form Fields Status\n\n`;
      Object.entries(report.childProfiles.formFields).forEach(([field, available]) => {
        markdown += `- **${field}**: ${available ? '✅ Available' : '❌ Missing'}\n`;
      });
      
      if (report.childProfiles.errors.length > 0) {
        markdown += `\n### Errors Found\n\n`;
        report.childProfiles.errors.forEach(error => {
          markdown += `- ❌ ${error}\n`;
        });
      }
      
      markdown += `\n`;
    }

    if (report.profileStatus) {
      markdown += `## 📊 Profile Status\n\n`;
      markdown += `- **Overall Status**: ${report.profileStatus.overall}\n`;
      
      if (report.profileStatus.issues.length > 0) {
        markdown += `\n### Issues\n\n`;
        report.profileStatus.issues.forEach(issue => {
          markdown += `- ❌ ${issue}\n`;
        });
      }
      
      markdown += `\n`;
    }

    markdown += `## 🎯 Recommendations\n\n`;
    report.recommendations.forEach((rec, index) => {
      markdown += `${index + 1}. ${rec}\n`;
    });

    markdown += `\n## 📸 Screenshots\n\n`;
    markdown += `- child_profiles_analysis.png\n`;

    markdown += `\n## 🏆 Overall Assessment\n\n`;
    
    if (report.summary.userLoggedIn && report.summary.totalProfiles > 0) {
      markdown += `**Status: ✅ Good** - You have ${report.summary.totalProfiles} child profile(s) and can access the system.\n`;
    } else if (report.summary.userLoggedIn && report.summary.hasFormAccess) {
      markdown += `**Status: ⚠️ Ready to Create** - You're logged in and can create your first child profile.\n`;
    } else if (!report.summary.userLoggedIn) {
      markdown += `**Status: ❌ Not Logged In** - Please log in to access child profiles.\n`;
    } else {
      markdown += `**Status: ❌ Issues Found** - There are problems accessing the profile system.\n`;
    }

    return markdown;
  }

  async runProfileCheck() {
    try {
      console.log('🎬 Starting Child Profile Check...\n');
      
      await this.initialize();
      
      const isLoggedIn = await this.checkUserLoginStatus();
      
      if (isLoggedIn) {
        await this.analyzeChildProfiles();
      } else {
        console.log('⚠️ User not logged in - skipping profile analysis');
      }
      
      const report = await this.generateReport();
      
      console.log('\n🎉 Child Profile Check Complete!');
      console.log(`📊 User Logged In: ${report.summary.userLoggedIn ? '✅ Yes' : '❌ No'}`);
      console.log(`👶 Total Profiles: ${report.summary.totalProfiles}`);
      console.log(`📝 Profile Names: ${report.summary.profileNames.join(', ') || 'None'}`);
      console.log(`📄 Report saved to: child_profiles_report.md`);
      
      return report;
      
    } catch (error) {
      console.error('❌ Profile check failed:', error);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the profile check
async function runChildProfileCheck() {
  const checker = new ChildProfileChecker();
  try {
    const results = await checker.runProfileCheck();
    console.log('\n✅ Child profile check completed successfully!');
    return results;
  } catch (error) {
    console.error('❌ Child profile check failed:', error);
    process.exit(1);
  }
}

// Export for use as module or run directly
if (require.main === module) {
  runChildProfileCheck();
}

module.exports = { ChildProfileChecker, runChildProfileCheck };

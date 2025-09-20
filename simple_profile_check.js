const { chromium } = require('playwright');

async function checkChildProfiles() {
  console.log('🎬 Starting Simple Child Profile Check...\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  
  try {
    // Navigate to the app
    console.log('🌐 Navigating to the application...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(3000);

    // Check login status
    console.log('\n🔐 Checking Login Status...');
    const loginButton = await page.$('a[href="/login"], button:has-text("Sign In"), button:has-text("Login")');
    const userMenu = await page.$('[data-testid="user-menu"], .user-menu, .profile-menu');
    const logoutButton = await page.$('button:has-text("Logout"), button:has-text("Sign Out")');

    if (loginButton && !userMenu) {
      console.log('❌ User is NOT logged in');
      console.log('📝 To check child profiles, you need to log in first');
      console.log('🔗 Please visit: http://localhost:3000/login');
      return;
    } else if (userMenu || logoutButton) {
      console.log('✅ User appears to be logged in');
    }

    // Navigate to child profile page
    console.log('\n👶 Checking Child Profile Page...');
    await page.goto('http://localhost:3000/child-profile', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({ path: 'child_profile_page.png', fullPage: true });
    console.log('📸 Screenshot saved: child_profile_page.png');

    // Analyze the page
    const analysis = await page.evaluate(() => {
      const result = {
        hasProfileForm: false,
        hasChildSelector: false,
        profileCount: 0,
        profileNames: [],
        formFields: {},
        debugInfo: '',
        errors: []
      };

      // Check for profile form
      const profileForm = document.querySelector('form, .profile-form, [data-testid="profile-form"]');
      if (profileForm) {
        result.hasProfileForm = true;
        
        // Check form fields
        result.formFields = {
          childName: !!document.querySelector('input[placeholder*="name"], input[name*="name"], #childName'),
          age: !!document.querySelector('input[type="range"], input[name*="age"], #age'),
          interests: !!document.querySelector('[class*="interest"], [data-testid*="interest"]'),
          learningStyle: !!document.querySelector('[class*="learning"], [data-testid*="learning"]'),
          goals: !!document.querySelector('[class*="goal"], [data-testid*="goal"]'),
          submitButton: !!document.querySelector('button[type="submit"], button:has-text("Create"), button:has-text("Generate")')
        };
      }

      // Check for child selector (existing profiles)
      const childButtons = document.querySelectorAll('button:has-text("Child"), .child-button, [class*="child-button"]');
      const addChildButton = document.querySelector('button:has-text("Add"), button:has-text("New"), [class*="add-child"]');
      
      if (childButtons.length > 0 || addChildButton) {
        result.hasChildSelector = true;
        result.profileCount = childButtons.length;
        
        // Extract child names
        childButtons.forEach(button => {
          const name = button.textContent.trim();
          if (name && name !== 'Add' && name !== 'New') {
            result.profileNames.push(name);
          }
        });
      }

      // Check for debug information
      const debugSection = document.querySelector('.debug, [class*="debug"], [data-testid*="debug"]');
      if (debugSection) {
        result.debugInfo = debugSection.textContent.substring(0, 1000);
      }

      // Check for error messages
      const errorElements = document.querySelectorAll('.error, [class*="error"], .alert-danger, [class*="alert"]');
      errorElements.forEach(error => {
        const text = error.textContent.trim();
        if (text) {
          result.errors.push(text);
        }
      });

      return result;
    });

    // Display results
    console.log('\n📊 Child Profile Analysis Results:');
    console.log('=====================================');
    console.log(`✅ Has Profile Form: ${analysis.hasProfileForm ? 'Yes' : 'No'}`);
    console.log(`✅ Has Child Selector: ${analysis.hasChildSelector ? 'Yes' : 'No'}`);
    console.log(`👶 Profile Count: ${analysis.profileCount}`);
    console.log(`📝 Profile Names: ${analysis.profileNames.length > 0 ? analysis.profileNames.join(', ') : 'None'}`);
    
    console.log('\n📋 Form Fields Status:');
    Object.entries(analysis.formFields).forEach(([field, available]) => {
      console.log(`   ${field}: ${available ? '✅ Available' : '❌ Missing'}`);
    });

    if (analysis.errors.length > 0) {
      console.log('\n❌ Errors Found:');
      analysis.errors.forEach(error => console.log(`   - ${error}`));
    }

    if (analysis.debugInfo) {
      console.log('\n🔍 Debug Information:');
      console.log(analysis.debugInfo.substring(0, 500) + '...');
    }

    // Summary
    console.log('\n🎯 Summary:');
    if (analysis.profileCount > 0) {
      console.log(`✅ You have ${analysis.profileCount} child profile(s): ${analysis.profileNames.join(', ')}`);
    } else if (analysis.hasProfileForm) {
      console.log('⚠️ No existing profiles found, but you can create one using the form');
    } else {
      console.log('❌ Cannot access profile functionality');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

checkChildProfiles();

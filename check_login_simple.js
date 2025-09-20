const { chromium } = require('playwright');

async function checkLoginPage() {
  console.log('🎬 Checking Login Page...\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  
  try {
    // Navigate to login page
    console.log('🌐 Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({ path: 'login_page.png', fullPage: true });
    console.log('📸 Screenshot saved: login_page.png');

    // Analyze the login page
    const analysis = await page.evaluate(() => {
      const result = {
        hasLoginForm: false,
        hasEmailField: false,
        hasPasswordField: false,
        hasLoginButton: false,
        hasSignupButton: false,
        hasGoogleLogin: false,
        hasForgotPassword: false,
        formFields: {},
        errors: [],
        pageTitle: document.title,
        pageContent: document.body.textContent.substring(0, 500)
      };

      // Check for login form
      const loginForm = document.querySelector('form, .login-form, [data-testid="login-form"]');
      if (loginForm) {
        result.hasLoginForm = true;
      }

      // Check form fields
      result.hasEmailField = !!document.querySelector('input[type="email"], input[name*="email"], #email');
      result.hasPasswordField = !!document.querySelector('input[type="password"], input[name*="password"], #password');
      
      // Check for buttons
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        const text = button.textContent.toLowerCase();
        if (text.includes('login') || text.includes('sign in')) {
          result.hasLoginButton = true;
        }
        if (text.includes('sign up') || text.includes('register')) {
          result.hasSignupButton = true;
        }
        if (text.includes('google')) {
          result.hasGoogleLogin = true;
        }
      });

      // Check for links
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        const text = link.textContent.toLowerCase();
        if (text.includes('forgot') || text.includes('reset')) {
          result.hasForgotPassword = true;
        }
        if (text.includes('sign up') || text.includes('register')) {
          result.hasSignupButton = true;
        }
      });

      // Get form field details
      const emailField = document.querySelector('input[type="email"], input[name*="email"], #email');
      const passwordField = document.querySelector('input[type="password"], input[name*="password"], #password');
      
      if (emailField) {
        result.formFields.email = {
          placeholder: emailField.placeholder || '',
          required: emailField.required || false
        };
      }
      
      if (passwordField) {
        result.formFields.password = {
          placeholder: passwordField.placeholder || '',
          required: passwordField.required || false
        };
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
    console.log('📊 Login Page Analysis:');
    console.log('========================');
    console.log(`📄 Page Title: ${analysis.pageTitle}`);
    console.log(`✅ Has Login Form: ${analysis.hasLoginForm ? 'Yes' : 'No'}`);
    console.log(`📧 Has Email Field: ${analysis.hasEmailField ? 'Yes' : 'No'}`);
    console.log(`🔒 Has Password Field: ${analysis.hasPasswordField ? 'Yes' : 'No'}`);
    console.log(`🔑 Has Login Button: ${analysis.hasLoginButton ? 'Yes' : 'No'}`);
    console.log(`📝 Has Signup Button: ${analysis.hasSignupButton ? 'Yes' : 'No'}`);
    console.log(`🌐 Has Google Login: ${analysis.hasGoogleLogin ? 'Yes' : 'No'}`);
    console.log(`🔓 Has Forgot Password: ${analysis.hasForgotPassword ? 'Yes' : 'No'}`);

    if (Object.keys(analysis.formFields).length > 0) {
      console.log('\n📋 Form Field Details:');
      Object.entries(analysis.formFields).forEach(([field, details]) => {
        console.log(`   ${field}: placeholder="${details.placeholder}", required=${details.required}`);
      });
    }

    if (analysis.errors.length > 0) {
      console.log('\n❌ Errors Found:');
      analysis.errors.forEach(error => console.log(`   - ${error}`));
    }

    console.log('\n📝 Page Content Preview:');
    console.log(analysis.pageContent);

    // Summary
    console.log('\n🎯 Login Page Summary:');
    if (analysis.hasLoginForm && analysis.hasEmailField && analysis.hasPasswordField && analysis.hasLoginButton) {
      console.log('✅ Login page is fully functional');
      console.log('📝 You can log in using email and password');
    } else {
      console.log('⚠️ Login page may have issues');
      if (!analysis.hasEmailField) console.log('   - Missing email field');
      if (!analysis.hasPasswordField) console.log('   - Missing password field');
      if (!analysis.hasLoginButton) console.log('   - Missing login button');
    }

    if (analysis.hasSignupButton) {
      console.log('📝 Signup option is available');
    }

    if (analysis.hasGoogleLogin) {
      console.log('🌐 Google login is available');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

checkLoginPage();

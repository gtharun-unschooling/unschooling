const puppeteer = require('puppeteer');
const fs = require('fs');

async function testWithCookies() {
  console.log('🍪 Starting test with cookie-based authentication...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--auto-open-devtools-for-tabs']
  });
  
  const page = await browser.newPage();
  
  // Set page timeout
  page.setDefaultTimeout(10000); // 10 seconds timeout
  
  try {
    // Set up console log capture
    await page.evaluateOnNewDocument(() => {
      window.capturedLogs = [];
      const originalLog = console.log;
      console.log = function(...args) {
        const logEntry = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        window.capturedLogs.push(logEntry);
        originalLog.apply(console, args);
      };
    });
    
    // Navigate to home page first with timeout
    console.log('🏠 Navigating to home page...');
    try {
      await page.goto('http://localhost:3000/', { 
        waitUntil: 'networkidle0',
        timeout: 10000 
      });
    } catch (error) {
      console.log('⚠️ Navigation timeout, continuing anyway...');
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if already logged in
    console.log('🔍 Checking current login status...');
    const initialStatus = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      let hasSignInButton = false;
      let hasLogoutButton = false;
      
      buttons.forEach(btn => {
        const text = btn.textContent;
        if (text && text.includes('Sign In')) hasSignInButton = true;
        if (text && text.includes('Logout')) hasLogoutButton = true;
      });
      
      return {
        hasSignInButton,
        hasLogoutButton,
        localStorage: Object.keys(localStorage),
        sessionStorage: Object.keys(sessionStorage)
      };
    });
    
    console.log('🔍 Initial status:', initialStatus);
    
    if (initialStatus.hasSignInButton) {
      console.log('❌ Not logged in - need to log in first');
      console.log('💡 Please log in manually in the browser window');
      console.log('⏳ Waiting 15 seconds for manual login...');
      
      // Wait for manual login with timeout
      await new Promise(resolve => setTimeout(resolve, 15000));
      
      // Check status again
      const loginStatus = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        let hasSignInButton = false;
        let hasLogoutButton = false;
        
        buttons.forEach(btn => {
          const text = btn.textContent;
          if (text && text.includes('Sign In')) hasSignInButton = true;
          if (text && text.includes('Logout')) hasLogoutButton = true;
        });
        
        return {
          hasSignInButton,
          hasLogoutButton
        };
      });
      
      if (loginStatus.hasSignInButton) {
        console.log('❌ Still not logged in after 15 seconds');
        console.log('⏰ Test timeout - closing browser');
        await browser.close();
        return;
      }
      
      console.log('✅ Login detected!');
    } else {
      console.log('✅ Already logged in!');
    }
    
    // Now navigate to profile page with timeout
    console.log('📱 Navigating to profile page...');
    try {
      await page.goto('http://localhost:3000/profile', { 
        waitUntil: 'networkidle0',
        timeout: 10000 
      });
    } catch (error) {
      console.log('⚠️ Profile navigation timeout, continuing anyway...');
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take screenshot of profile page
    console.log('📸 Taking screenshot of profile page...');
    await page.screenshot({ 
      path: 'cookie_test_profile_page.png',
      fullPage: true 
    });
    
    // Check if we're logged in on profile page
    console.log('🔍 Checking login status on profile page...');
    const profileStatus = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      let hasSignInButton = false;
      let hasLogoutButton = false;
      let hasChildren = false;
      
      buttons.forEach(btn => {
        const text = btn.textContent;
        if (text && text.includes('Sign In')) hasSignInButton = true;
        if (text && text.includes('Logout')) hasLogoutButton = true;
        if (text && (text.includes('Tharun') || text.includes('YAshna') || text.includes('ii'))) hasChildren = true;
      });
      
      return {
        hasSignInButton,
        hasLogoutButton,
        hasChildren,
        pageTitle: document.title,
        url: window.location.href
      };
    });
    
    console.log('🔍 Profile page status:', profileStatus);
    
    if (profileStatus.hasSignInButton) {
      console.log('❌ Still showing sign in button on profile page');
      console.log('💡 This means the authentication state is not persisting');
      console.log('⏰ Test timeout - closing browser');
      await browser.close();
      return;
    }
    
    if (profileStatus.hasChildren) {
      console.log('✅ Found children - proceeding with test...');
      
      // Look for child selection buttons
      const childButtons = await page.$$('button');
      let selectedChild = false;
      
      for (const button of childButtons) {
        const text = await button.evaluate(btn => btn.textContent);
        if (text && (text.includes('Tharun') || text.includes('YAshna') || text.includes('ii'))) {
          console.log('👶 Selecting child:', text);
          await button.click();
          selectedChild = true;
          break;
        }
      }
      
      if (selectedChild) {
        // Wait for child selection with timeout
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Take screenshot after child selection
        console.log('📸 Taking screenshot after child selection...');
        await page.screenshot({ 
          path: 'cookie_test_child_selected.png',
          fullPage: true 
        });
        
        // Look for form elements
        console.log('📝 Looking for form elements...');
        const formElements = await page.evaluate(() => {
          const forms = document.querySelectorAll('form');
          const inputs = document.querySelectorAll('input');
          const buttons = document.querySelectorAll('button');
          
          return {
            forms: forms.length,
            inputs: inputs.length,
            buttons: buttons.length
          };
        });
        
        console.log('🔍 Form elements found:', formElements);
        
        // Look for submit button
        const submitButton = await page.$('button[type="submit"]');
        if (submitButton) {
          console.log('🚀 Found submit button, clicking it...');
          
          // Fill some form data first if needed
          const ageInput = await page.$('input[type="range"]');
          if (ageInput) {
            await ageInput.evaluate((el, value) => el.value = value, 5);
            console.log('✅ Age set to 5');
          }
          
          // Click submit
          await submitButton.click();
          console.log('✅ Form submitted');
          
          // Wait for plan generation with timeout
          console.log('⏳ Waiting for plan generation (10 seconds)...');
          await new Promise(resolve => setTimeout(resolve, 10000));
          
          // Take screenshot after submission
          console.log('📸 Taking screenshot after form submission...');
          await page.screenshot({ 
            path: 'cookie_test_after_submission.png',
            fullPage: true 
          });
          
          // Check current URL
          const currentUrl = page.url();
          console.log('📍 Current URL after submission:', currentUrl);
          
          // Check console logs
          console.log('🔍 Checking console logs...');
          const logs = await page.evaluate(() => {
            return window.capturedLogs || [];
          });
          
          console.log('📝 Console logs captured:', logs.length);
          logs.forEach((log, index) => {
            console.log(`${index + 1}: ${log}`);
          });
          
          // Save logs to file
          fs.writeFileSync('cookie_test_logs.txt', logs.join('\n'));
          console.log('💾 Console logs saved to cookie_test_logs.txt');
          
          // Look for the specific logs we need
          const hasDirectBackendLog = logs.some(log => log.includes('Direct backend response structure detected'));
          const has28TopicsLog = logs.some(log => log.includes('matched_topics length: 28'));
          
          console.log('🔍 Key logs found:');
          console.log('  - Direct backend structure:', hasDirectBackendLog ? '✅' : '❌');
          console.log('  - 28 topics:', has28TopicsLog ? '✅' : '❌');
          
        } else {
          console.log('❌ Submit button not found');
        }
      } else {
        console.log('❌ No child buttons found');
      }
    } else {
      console.log('❌ No children found');
    }
    
    console.log('✅ Cookie test completed!');
    console.log('📁 Screenshots saved:');
    console.log('  - cookie_test_profile_page.png');
    console.log('  - cookie_test_child_selected.png');
    console.log('  - cookie_test_after_submission.png');
    console.log('📝 Console logs saved to cookie_test_logs.txt');
    
    // Close browser after completion
    console.log('🔒 Closing browser...');
    await browser.close();
    
  } catch (error) {
    console.error('❌ Cookie test failed:', error);
    console.log('🔒 Closing browser due to error...');
    await browser.close();
  }
}

// Run the cookie test
testWithCookies().catch(console.error);

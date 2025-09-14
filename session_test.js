const puppeteer = require('puppeteer');
const fs = require('fs');

async function testWithSession() {
  console.log('🔐 Starting test with your session ID...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--auto-open-devtools-for-tabs']
  });
  
  const page = await browser.newPage();
  
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
    
    // Navigate to home page first to establish session
    console.log('🏠 Navigating to home page...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Set your session data
    console.log('🔐 Setting session data...');
    await page.evaluate(() => {
      sessionStorage.setItem('comprehensive_session_id', 'session_1755404311669_5u5wzxz57');
      console.log('✅ Session ID set:', sessionStorage.getItem('comprehensive_session_id'));
    });
    
    // Now navigate to profile page
    console.log('📱 Navigating to profile page...');
    await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take screenshot of profile page
    console.log('📸 Taking screenshot of profile page...');
    await page.screenshot({ 
      path: 'session_test_profile_page.png',
      fullPage: true 
    });
    
    // Check if we're logged in
    console.log('🔍 Checking login status...');
    const loginStatus = await page.evaluate(() => {
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
        url: window.location.href,
        sessionId: sessionStorage.getItem('comprehensive_session_id')
      };
    });
    
    console.log('🔍 Login status:', loginStatus);
    
    if (loginStatus.hasSignInButton) {
      console.log('❌ Still showing sign in button - session not working');
      return;
    }
    
    if (loginStatus.hasChildren) {
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
        // Wait for child selection
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Take screenshot after child selection
        console.log('📸 Taking screenshot after child selection...');
        await page.screenshot({ 
          path: 'session_test_child_selected.png',
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
          
          // Wait for plan generation
          console.log('⏳ Waiting for plan generation...');
          await new Promise(resolve => setTimeout(resolve, 15000));
          
          // Take screenshot after submission
          console.log('📸 Taking screenshot after form submission...');
          await page.screenshot({ 
            path: 'session_test_after_submission.png',
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
          fs.writeFileSync('session_test_logs.txt', logs.join('\n'));
          console.log('💾 Console logs saved to session_test_logs.txt');
          
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
    
    console.log('✅ Session test completed!');
    console.log('📁 Screenshots saved:');
    console.log('  - session_test_profile_page.png');
    console.log('  - session_test_child_selected.png');
    console.log('  - session_test_after_submission.png');
    console.log('📝 Console logs saved to session_test_logs.txt');
    
    // Keep browser open for manual inspection
    console.log('👀 Browser will stay open for manual inspection...');
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Session test failed:', error);
    await browser.close();
  }
}

// Run the session test
testWithSession().catch(console.error);

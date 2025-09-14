const puppeteer = require('puppeteer');
const fs = require('fs');

async function advancedTest() {
  console.log('🚀 Starting advanced test with React rendering detection...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--auto-open-devtools-for-tabs']
  });
  
  const page = await browser.newPage();
  
  // Set page timeout
  page.setDefaultTimeout(30000); // 30 seconds timeout
  
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
    
    // Navigate to home page first
    console.log('🏠 Navigating to home page...');
    await page.goto('http://localhost:3000/', { 
      waitUntil: 'networkidle0',
      timeout: 15000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if logged in
    console.log('🔍 Checking login status...');
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
    
    console.log('🔍 Login status:', loginStatus);
    
    if (loginStatus.hasSignInButton) {
      console.log('❌ Not logged in - please log in manually');
      console.log('⏳ Waiting 30 seconds for manual login...');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
    
    // Now navigate to child-profile page
    console.log('📱 Navigating to child-profile page...');
    await page.goto('http://localhost:3000/child-profile', { 
      waitUntil: 'networkidle0',
      timeout: 15000 
    });
    
    // Wait for React to fully render
    console.log('⏳ Waiting for React to fully render...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Take screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'advanced_test_page.png',
      fullPage: true 
    });
    
    // Advanced page analysis
    console.log('🔍 Performing advanced page analysis...');
    const pageAnalysis = await page.evaluate(() => {
      // Wait for any pending React renders
      return new Promise((resolve) => {
        setTimeout(() => {
          // Get all text content
          const bodyText = document.body.innerText;
          
          // Get all elements
          const allElements = document.querySelectorAll('*');
          const elementCounts = {};
          
          allElements.forEach(el => {
            const tagName = el.tagName.toLowerCase();
            elementCounts[tagName] = (elementCounts[tagName] || 0) + 1;
          });
          
          // Check for specific ProfileForm content
          const hasProfileFormTitle = bodyText.includes('Create Your Child') || bodyText.includes('Learning Journey');
          const hasProfileFormContent = bodyText.includes('Perfect Learning Journey') || bodyText.includes('personalized learning experience');
          
          // Look for child-related content
          const hasChildContent = bodyText.includes('Tharun') || bodyText.includes('YAshna') || bodyText.includes('ii') || bodyText.includes('Child');
          
          // Check for form elements
          const forms = document.querySelectorAll('form');
          const inputs = document.querySelectorAll('input');
          const buttons = document.querySelectorAll('button');
          
          // Check for React-specific attributes
          const hasReactAttributes = document.querySelector('[data-reactroot]') || document.querySelector('[data-testid]');
          
          // Check for any loading states
          const hasLoadingState = bodyText.includes('Loading') || bodyText.includes('loading') || document.querySelector('.loading');
          
          // Check for error states
          const hasErrorState = bodyText.includes('Error') || bodyText.includes('Failed') || bodyText.includes('Exception');
          
          // Get all button texts
          const buttonTexts = Array.from(buttons).map(btn => btn.textContent).filter(text => text && text.trim());
          
          // Get all div texts
          const divTexts = Array.from(document.querySelectorAll('div')).map(div => div.textContent).filter(text => text && text.trim() && text.length > 10);
          
          resolve({
            pageTitle: document.title,
            url: window.location.href,
            bodyText: bodyText.substring(0, 1000) + '...',
            elementCounts,
            hasProfileFormTitle,
            hasProfileFormContent,
            hasChildContent,
            hasReactAttributes,
            hasLoadingState,
            hasErrorState,
            forms: forms.length,
            inputs: inputs.length,
            buttons: buttons.length,
            buttonTexts: buttonTexts.slice(0, 20), // First 20 buttons
            divTexts: divTexts.slice(0, 20), // First 20 divs
            allText: bodyText
          });
        }, 2000); // Wait 2 more seconds for any pending renders
      });
    });
    
    console.log('🔍 Advanced page analysis:', pageAnalysis);
    
    // Save detailed analysis
    fs.writeFileSync('advanced_test_analysis.txt', JSON.stringify(pageAnalysis, null, 2));
    console.log('💾 Analysis saved to advanced_test_analysis.txt');
    
    // Check console for any errors
    console.log('🔍 Checking console for errors...');
    const logs = await page.evaluate(() => {
      return {
        errors: window.capturedLogs ? window.capturedLogs.filter(log => log.includes('Error') || log.includes('Failed') || log.includes('Exception')) : [],
        allLogs: window.capturedLogs || []
      };
    });
    
    console.log('📝 Console errors found:', logs.errors.length);
    logs.errors.forEach((error, index) => {
      console.log(`${index + 1}: ${error}`);
    });
    
    // Save console logs
    fs.writeFileSync('advanced_test_logs.txt', logs.allLogs.join('\n'));
    console.log('💾 Console logs saved to advanced_test_logs.txt');
    
    // If we found children, try to interact
    if (pageAnalysis.hasChildContent) {
      console.log('✅ Found child content - attempting interaction...');
      
      // Look for child buttons
      const childButtons = await page.$$('button');
      let selectedChild = false;
      
      for (const button of childButtons) {
        const text = await button.evaluate(btn => btn.textContent);
        if (text && (text.includes('Tharun') || text.includes('YAshna') || text.includes('ii'))) {
          console.log('👶 Found child button:', text);
          console.log('🖱️ Clicking child button...');
          await button.click();
          selectedChild = true;
          break;
        }
      }
      
      if (selectedChild) {
        console.log('✅ Child selected, waiting for form...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Take screenshot after selection
        await page.screenshot({ 
          path: 'advanced_test_child_selected.png',
          fullPage: true 
        });
        
        // Look for form elements
        const formElements = await page.evaluate(() => {
          const forms = document.querySelectorAll('form');
          const inputs = document.querySelectorAll('input');
          const submitButtons = document.querySelectorAll('button[type="submit"]');
          
          return {
            forms: forms.length,
            inputs: inputs.length,
            submitButtons: submitButtons.length
          };
        });
        
        console.log('🔍 Form elements after child selection:', formElements);
        
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
          console.log('⏳ Waiting for plan generation (15 seconds)...');
          await new Promise(resolve => setTimeout(resolve, 15000));
          
          // Take screenshot after submission
          await page.screenshot({ 
            path: 'advanced_test_after_submission.png',
            fullPage: true 
          });
          
          // Check current URL
          const currentUrl = page.url();
          console.log('📍 Current URL after submission:', currentUrl);
          
          // Check console logs for 28 topics
          const finalLogs = await page.evaluate(() => {
            return window.capturedLogs || [];
          });
          
          console.log('📝 Final console logs:', finalLogs.length);
          finalLogs.forEach((log, index) => {
            console.log(`${index + 1}: ${log}`);
          });
          
          // Save final logs
          fs.writeFileSync('advanced_test_final_logs.txt', finalLogs.join('\n'));
          
          // Look for the specific logs we need
          const hasDirectBackendLog = finalLogs.some(log => log.includes('Direct backend response structure detected'));
          const has28TopicsLog = finalLogs.some(log => log.includes('matched_topics length: 28'));
          
          console.log('🔍 Key logs found:');
          console.log('  - Direct backend structure:', hasDirectBackendLog ? '✅' : '❌');
          console.log('  - 28 topics:', has28TopicsLog ? '✅' : '❌');
          
        } else {
          console.log('❌ Submit button not found after child selection');
        }
      } else {
        console.log('❌ No child buttons found to click');
      }
    } else {
      console.log('❌ No child content found - ProfileForm not rendering properly');
    }
    
    console.log('✅ Advanced test completed!');
    console.log('📁 Files saved:');
    console.log('  - advanced_test_page.png');
    console.log('  - advanced_test_analysis.txt');
    console.log('  - advanced_test_logs.txt');
    if (pageAnalysis.hasChildContent) {
      console.log('  - advanced_test_child_selected.png');
      console.log('  - advanced_test_after_submission.png');
      console.log('  - advanced_test_final_logs.txt');
    }
    
    // Close browser
    await browser.close();
    
  } catch (error) {
    console.error('❌ Advanced test failed:', error);
    await browser.close();
  }
}

// Run the advanced test
advancedTest().catch(console.error);

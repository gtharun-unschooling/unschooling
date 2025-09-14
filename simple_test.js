const puppeteer = require('puppeteer');
const fs = require('fs');

async function simpleTest() {
  console.log('🧪 Starting simple test to check ProfileForm component...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--auto-open-devtools-for-tabs']
  });
  
  const page = await browser.newPage();
  
  // Set page timeout
  page.setDefaultTimeout(10000); // 10 seconds timeout
  
  try {
    // Navigate to home page first
    console.log('🏠 Navigating to home page...');
    await page.goto('http://localhost:3000/', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
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
      console.log('⏳ Waiting 20 seconds for manual login...');
      await new Promise(resolve => setTimeout(resolve, 20000));
    }
    
    // Now navigate to child-profile page
    console.log('📱 Navigating to child-profile page...');
    await page.goto('http://localhost:3000/child-profile', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'simple_test_page.png',
      fullPage: true 
    });
    
    // Check what's actually on the page
    console.log('🔍 Analyzing page content...');
    const pageContent = await page.evaluate(() => {
      // Get all text content
      const bodyText = document.body.innerText;
      
      // Get all elements
      const allElements = document.querySelectorAll('*');
      const elementCounts = {};
      
      allElements.forEach(el => {
        const tagName = el.tagName.toLowerCase();
        elementCounts[tagName] = (elementCounts[tagName] || 0) + 1;
      });
      
      // Check for specific content
      const hasProfileForm = bodyText.includes('Create Your Child') || bodyText.includes('Learning Journey');
      const hasBackButton = !!document.querySelector('button[onclick*="navigate"]') || !!document.querySelector('button:contains("Back")');
      const hasForm = !!document.querySelector('form');
      const hasInputs = document.querySelectorAll('input').length;
      const hasButtons = document.querySelectorAll('button').length;
      
      // Check for any React errors
      const hasReactError = bodyText.includes('Error') || bodyText.includes('Failed') || bodyText.includes('Exception');
      
      return {
        pageTitle: document.title,
        url: window.location.href,
        bodyText: bodyText.substring(0, 500) + '...',
        elementCounts,
        hasProfileForm,
        hasBackButton,
        hasForm,
        hasInputs,
        hasButtons,
        hasReactError,
        allText: bodyText
      };
    });
    
    console.log('🔍 Page content analysis:', pageContent);
    
    // Save detailed analysis
    fs.writeFileSync('simple_test_analysis.txt', JSON.stringify(pageContent, null, 2));
    console.log('💾 Analysis saved to simple_test_analysis.txt');
    
    // Check console for any errors
    console.log('🔍 Checking console for errors...');
    const logs = await page.evaluate(() => {
      return {
        errors: window.capturedLogs ? window.capturedLogs.filter(log => log.includes('Error') || log.includes('Failed')) : [],
        allLogs: window.capturedLogs || []
      };
    });
    
    console.log('📝 Console errors found:', logs.errors.length);
    logs.errors.forEach((error, index) => {
      console.log(`${index + 1}: ${error}`);
    });
    
    // Save console logs
    fs.writeFileSync('simple_test_logs.txt', logs.allLogs.join('\n'));
    console.log('💾 Console logs saved to simple_test_logs.txt');
    
    console.log('✅ Simple test completed!');
    console.log('📁 Files saved:');
    console.log('  - simple_test_page.png');
    console.log('  - simple_test_analysis.txt');
    console.log('  - simple_test_logs.txt');
    
    // Close browser
    await browser.close();
    
  } catch (error) {
    console.error('❌ Simple test failed:', error);
    await browser.close();
  }
}

// Run the simple test
simpleTest().catch(console.error);

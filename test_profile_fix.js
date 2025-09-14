const puppeteer = require('puppeteer');

async function testProfileFix() {
  console.log('🧪 Starting automated profile form test...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to profile page
    console.log('📱 Navigating to profile page...');
    await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle0' });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if user is already logged in
    console.log('🔍 Checking if user is logged in...');
    const isLoggedIn = await page.evaluate(() => {
      return document.querySelector('[data-testid="user-info"]') !== null || 
             document.querySelector('.user-email') !== null;
    });
    
    if (!isLoggedIn) {
      console.log('❌ User not logged in, cannot proceed with test');
      await browser.close();
      return;
    }
    
    console.log('✅ User is logged in, proceeding with test...');
    
    // Wait for children to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Select first child if available
    console.log('👶 Selecting first available child...');
    const childButton = await page.$('button[style*="background: rgb(78, 205, 196)"]');
    if (childButton) {
      await childButton.click();
      console.log('✅ Child selected');
    } else {
      console.log('⚠️ No child selected, using default');
    }
    
    // Fill form with test data
    console.log('📝 Filling form with test data...');
    
    // Set age to 5
    const ageSlider = await page.$('input[type="range"]');
    if (ageSlider) {
      await ageSlider.evaluate((el, value) => el.value = value, 5);
      console.log('✅ Age set to 5');
    }
    
    // Select interests
    const interestButtons = await page.$$('button[style*="background: linear-gradient"]');
    if (interestButtons.length > 0) {
             // Select first 3 interests
       for (let i = 0; i < Math.min(3, interestButtons.length); i++) {
         await interestButtons[i].click();
         await new Promise(resolve => setTimeout(resolve, 200));
       }
      console.log('✅ Interests selected');
    }
    
    // Select learning style
    const learningStyleButtons = await page.$$('button[style*="background: linear-gradient"]');
    if (learningStyleButtons.length > 0) {
      await learningStyleButtons[0].click();
      console.log('✅ Learning style selected');
    }
    
    // Select goals
    const goalButtons = await page.$$('button[style*="background: linear-gradient"]');
    if (goalButtons.length > 0) {
      await goalButtons[0].click();
      console.log('✅ Goals selected');
    }
    
    // Submit form
    console.log('🚀 Submitting form...');
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      console.log('✅ Form submitted');
    }
    
    // Wait for plan generation
    console.log('⏳ Waiting for plan generation...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Check console logs for matched_topics length
    console.log('🔍 Checking console logs for matched_topics...');
    const logs = await page.evaluate(() => {
      return window.consoleLogs || [];
    });
    
    // Also check if we're on the plan page
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    if (currentUrl.includes('customised-weekly-plan')) {
      console.log('✅ Successfully navigated to plan page');
      
      // Wait a bit more for data to load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check for matched_topics in the page
      const matchedTopicsCount = await page.evaluate(() => {
        // Look for matched_topics data in the page
        const scriptTags = document.querySelectorAll('script');
        for (const script of scriptTags) {
          if (script.textContent.includes('matched_topics')) {
            console.log('Found matched_topics in script:', script.textContent);
          }
        }
        
        // Check if there are any elements showing topic count
        const topicElements = document.querySelectorAll('[class*="topic"], [class*="Topic"]');
        return topicElements.length;
      });
      
      console.log('🔍 Topics found on page:', matchedTopicsCount);
      
    } else {
      console.log('❌ Failed to navigate to plan page');
    }
    
    // Wait for user to see results
    console.log('👀 Test completed. Check the browser for results.');
    console.log('Press Ctrl+C to close the browser...');
    
    // Keep browser open for manual inspection
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await browser.close();
  }
}

// Run the test
testProfileFix().catch(console.error);

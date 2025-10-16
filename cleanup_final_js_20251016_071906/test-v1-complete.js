const puppeteer = require('puppeteer');

async function testVersion1Complete() {
  console.log('🧪 TESTING VERSION 1 COMPLETE FUNCTIONALITY');
  console.log('============================================');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Error') || text.includes('error') || text.includes('Failed')) {
        console.log('❌ Console Error:', text);
      }
    });
    
    // Test 1: Homepage
    console.log('🏠 Testing Homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const homepageCheck = await page.evaluate(() => {
      const pageText = document.body.textContent;
      return {
        hasHeroSection: pageText.includes('Personalized Learning Journey'),
        hasNavigation: pageText.includes('What We Do') && pageText.includes('Pricing'),
        hasHowItWorks: pageText.includes('How It Works'),
        hasTestimonials: pageText.includes('What Parents Say'),
        pageLoads: true
      };
    });
    
    console.log('✅ Homepage:', JSON.stringify(homepageCheck, null, 2));
    
    // Test 2: Login Page
    console.log('🔐 Testing Login Page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const loginCheck = await page.evaluate(() => {
      const pageText = document.body.textContent;
      return {
        hasLoginForm: pageText.includes('Sign In') || pageText.includes('Continue with Google'),
        hasEmailField: document.querySelector('input[type="email"]') !== null,
        hasPasswordField: document.querySelector('input[type="password"]') !== null,
        pageLoads: true
      };
    });
    
    console.log('✅ Login Page:', JSON.stringify(loginCheck, null, 2));
    
    // Test 3: Login Functionality
    console.log('🔑 Testing Login Functionality...');
    await page.type('input[type="email"]', 'gtharun04@gmail.com');
    await page.type('input[type="password"]', '8500424835');
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const loginSuccess = await page.evaluate(() => {
      const pageText = document.body.textContent;
      return {
        isLoggedIn: pageText.includes('Dashboard') || pageText.includes('Tharun Guduguntla'),
        hasUserMenu: pageText.includes('Logout') || pageText.includes('Settings'),
        currentUrl: window.location.href
      };
    });
    
    console.log('✅ Login Success:', JSON.stringify(loginSuccess, null, 2));
    
    // Test 4: Dashboard
    console.log('📊 Testing Dashboard...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const dashboardCheck = await page.evaluate(() => {
      const pageText = document.body.textContent;
      return {
        hasDashboardContent: pageText.includes('Dashboard') || pageText.includes('Welcome'),
        hasNavigation: pageText.includes('Child Profile') || pageText.includes('Weekly Plan'),
        pageLoads: true
      };
    });
    
    console.log('✅ Dashboard:', JSON.stringify(dashboardCheck, null, 2));
    
    // Test 5: Profile Page
    console.log('👶 Testing Profile Page...');
    await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const profileCheck = await page.evaluate(() => {
      const pageText = document.body.textContent;
      return {
        hasProfileForm: pageText.includes('Child Profile') || pageText.includes('Add Child'),
        hasFormFields: pageText.includes('Child Name') || pageText.includes('Age'),
        pageLoads: true
      };
    });
    
    console.log('✅ Profile Page:', JSON.stringify(profileCheck, null, 2));
    
    // Test 6: Weekly Plan Page
    console.log('📅 Testing Weekly Plan Page...');
    await page.goto('http://localhost:3000/customised-weekly-plan', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const weeklyPlanCheck = await page.evaluate(() => {
      const pageText = document.body.textContent;
      return {
        hasPlanContent: pageText.includes('Weekly Plan') || pageText.includes('Learning Plan'),
        hasChildrenDropdown: document.querySelector('select') !== null,
        hasGenerateButton: pageText.includes('Generate') || pageText.includes('Create'),
        pageLoads: true
      };
    });
    
    console.log('✅ Weekly Plan Page:', JSON.stringify(weeklyPlanCheck, null, 2));
    
    // Test 7: What We Do Page
    console.log('🌟 Testing What We Do Page...');
    await page.goto('http://localhost:3000/what-we-do', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const whatWeDoCheck = await page.evaluate(() => {
      const pageText = document.body.textContent;
      return {
        hasContent: pageText.includes('What We Do') || pageText.includes('Learning'),
        hasWheel: pageText.includes('Real World Pathways') || pageText.includes('Growth'),
        pageLoads: true
      };
    });
    
    console.log('✅ What We Do Page:', JSON.stringify(whatWeDoCheck, null, 2));
    
    // Test 8: Niche Page (Finance)
    console.log('💰 Testing Finance Niche Page...');
    await page.goto('http://localhost:3000/niche/finance', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const nicheCheck = await page.evaluate(() => {
      const pageText = document.body.textContent;
      return {
        hasNicheContent: pageText.includes('Finance') || pageText.includes('Money'),
        hasTopics: pageText.includes('Topics') || pageText.includes('Activities'),
        hasBackButton: pageText.includes('←') || pageText.includes('Back'),
        pageLoads: true
      };
    });
    
    console.log('✅ Finance Niche Page:', JSON.stringify(nicheCheck, null, 2));
    
    // Test 9: Essential Growth Page
    console.log('🌱 Testing Essential Growth Page...');
    await page.goto('http://localhost:3000/essential-growth', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const essentialGrowthCheck = await page.evaluate(() => {
      const pageText = document.body.textContent;
      return {
        hasContent: pageText.includes('Essential Growth') || pageText.includes('Development'),
        hasPillars: pageText.includes('Play') || pageText.includes('Creativity'),
        pageLoads: true
      };
    });
    
    console.log('✅ Essential Growth Page:', JSON.stringify(essentialGrowthCheck, null, 2));
    
    // Test 10: Logout Functionality
    console.log('🚪 Testing Logout Functionality...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Try to find and click logout
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const logoutBtn = buttons.find(btn => btn.textContent.includes('Logout'));
      if (logoutBtn) {
        logoutBtn.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const logoutCheck = await page.evaluate(() => {
      const pageText = document.body.textContent;
      return {
        isLoggedOut: pageText.includes('Sign In') || pageText.includes('Login'),
        currentUrl: window.location.href
      };
    });
    
    console.log('✅ Logout:', JSON.stringify(logoutCheck, null, 2));
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'v1-complete-test-results.png',
      fullPage: true
    });
    
    console.log('✅ Screenshot saved as v1-complete-test-results.png');
    
    // Summary
    console.log('\n🎯 VERSION 1 COMPLETE TEST SUMMARY:');
    console.log('===================================');
    
    const allTests = {
      homepage: homepageCheck,
      login: loginCheck,
      loginSuccess: loginSuccess,
      dashboard: dashboardCheck,
      profile: profileCheck,
      weeklyPlan: weeklyPlanCheck,
      whatWeDo: whatWeDoCheck,
      niche: nicheCheck,
      essentialGrowth: essentialGrowthCheck,
      logout: logoutCheck
    };
    
    let passedTests = 0;
    let totalTests = 0;
    
    Object.entries(allTests).forEach(([testName, results]) => {
      totalTests++;
      const passed = Object.values(results).every(result => result === true);
      if (passed) passedTests++;
      console.log(`${passed ? '✅' : '❌'} ${testName}: ${passed ? 'PASSED' : 'FAILED'}`);
    });
    
    console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log('🎉 ALL TESTS PASSED! Version 1 is ready for production!');
    } else {
      console.log('⚠️ Some tests failed. Check the results above.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testVersion1Complete();


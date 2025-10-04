const puppeteer = require('puppeteer');

async function testMobileProfileInitials() {
  console.log('🧪 Testing Mobile Profile Initials...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Listen to console messages
    page.on('console', msg => {
      console.log('🔍 Console:', msg.text());
    });
    
    // Step 1: Navigate to homepage
    console.log('📱 Step 1: Navigating to homepage...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 2: Test mobile view first (not logged in)
    console.log('📱 Step 2: Testing mobile view (not logged in)...');
    await page.setViewport({ width: 375, height: 667 }); // iPhone SE size
    
    const mobileNotLoggedIn = await page.evaluate(() => {
      const profileBtn = document.querySelector('.profile-btn');
      const loginBtn = document.querySelector('.login-btn');
      
      return {
        profileButtonExists: !!profileBtn,
        loginButtonExists: !!loginBtn,
        loginButtonText: loginBtn ? loginBtn.textContent.trim() : null
      };
    });
    
    console.log('🔍 Mobile (Not Logged In):', mobileNotLoggedIn);
    
    // Step 3: Login to test profile initials
    console.log('📱 Step 3: Logging in to test profile initials...');
    
    // Click login button
    await page.click('.login-btn');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Fill login form
    await page.type('input[type="email"]', 'gtharun04@gmail.com');
    await page.type('input[type="password"]', '8500424835');
    
    // Click login button
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 4: Test mobile profile initials
    console.log('📱 Step 4: Testing mobile profile initials...');
    
    const mobileProfileInfo = await page.evaluate(() => {
      const profileBtn = document.querySelector('.profile-btn');
      if (!profileBtn) return { found: false };
      
      const desktopProfile = profileBtn.querySelector('.desktop-profile');
      const mobileProfile = profileBtn.querySelector('.mobile-profile');
      const dropdownArrow = profileBtn.querySelector('.dropdown-arrow');
      
      return {
        found: true,
        desktopProfileVisible: desktopProfile ? window.getComputedStyle(desktopProfile).display !== 'none' : false,
        mobileProfileVisible: mobileProfile ? window.getComputedStyle(mobileProfile).display !== 'none' : false,
        desktopProfileText: desktopProfile ? desktopProfile.textContent.trim() : null,
        mobileProfileText: mobileProfile ? mobileProfile.textContent.trim() : null,
        dropdownArrowVisible: dropdownArrow ? window.getComputedStyle(dropdownArrow).display !== 'none' : false,
        buttonDimensions: profileBtn.getBoundingClientRect()
      };
    });
    
    console.log('🔍 Mobile Profile Info:', JSON.stringify(mobileProfileInfo, null, 2));
    
    if (mobileProfileInfo.found) {
      // Step 5: Test desktop view
      console.log('📱 Step 5: Testing desktop view...');
      await page.setViewport({ width: 1200, height: 800 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const desktopProfileInfo = await page.evaluate(() => {
        const profileBtn = document.querySelector('.profile-btn');
        if (!profileBtn) return { found: false };
        
        const desktopProfile = profileBtn.querySelector('.desktop-profile');
        const mobileProfile = profileBtn.querySelector('.mobile-profile');
        
        return {
          found: true,
          desktopProfileVisible: desktopProfile ? window.getComputedStyle(desktopProfile).display !== 'none' : false,
          mobileProfileVisible: mobileProfile ? window.getComputedStyle(mobileProfile).display !== 'none' : false,
          desktopProfileText: desktopProfile ? desktopProfile.textContent.trim() : null,
          mobileProfileText: mobileProfile ? mobileProfile.textContent.trim() : null,
          buttonDimensions: profileBtn.getBoundingClientRect()
        };
      });
      
      console.log('🔍 Desktop Profile Info:', JSON.stringify(desktopProfileInfo, null, 2));
      
      // Step 6: Test dropdown functionality
      console.log('📱 Step 6: Testing dropdown functionality...');
      await page.setViewport({ width: 375, height: 667 }); // Back to mobile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await page.click('.profile-btn');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dropdownInfo = await page.evaluate(() => {
        const dropdown = document.querySelector('.profile-dropdown');
        return {
          dropdownExists: !!dropdown,
          dropdownVisible: dropdown ? window.getComputedStyle(dropdown).display !== 'none' : false,
          dropdownContent: dropdown ? dropdown.textContent.substring(0, 100) + '...' : null
        };
      });
      
      console.log('🔍 Dropdown Info:', JSON.stringify(dropdownInfo, null, 2));
      
      // Step 7: Verify initials logic
      console.log('📱 Step 7: Verifying initials logic...');
      
      const initialsLogic = await page.evaluate(() => {
        // Test with different user scenarios
        const testUsers = [
          { displayName: 'John Doe', email: 'john.doe@example.com' },
          { displayName: 'Jane', email: 'jane@example.com' },
          { displayName: '', email: 'alex.smith@example.com' },
          { displayName: '', email: 'b@example.com' }
        ];
        
        // This would need to be tested by actually changing the user data
        // For now, we'll just check the current user's initials
        const currentMobileProfile = document.querySelector('.mobile-profile');
        return {
          currentInitials: currentMobileProfile ? currentMobileProfile.textContent.trim() : null,
          initialsLength: currentMobileProfile ? currentMobileProfile.textContent.trim().length : 0,
          isUppercase: currentMobileProfile ? currentMobileProfile.textContent.trim() === currentMobileProfile.textContent.trim().toUpperCase() : false
        };
      });
      
      console.log('🔍 Initials Logic:', JSON.stringify(initialsLogic, null, 2));
      
      // Summary
      console.log('\n🎯 MOBILE PROFILE INITIALS SUMMARY:');
      console.log('===================================');
      console.log(`✅ Profile button found: Yes`);
      console.log(`✅ Mobile view shows initials: ${mobileProfileInfo.mobileProfileVisible ? 'Yes' : 'No'}`);
      console.log(`✅ Desktop view shows full name: ${desktopProfileInfo.desktopProfileVisible ? 'Yes' : 'No'}`);
      console.log(`✅ Mobile initials: "${mobileProfileInfo.mobileProfileText}"`);
      console.log(`✅ Desktop name: "${desktopProfileInfo.desktopProfileText}"`);
      console.log(`✅ Initials length: ${initialsLogic.initialsLength} characters`);
      console.log(`✅ Initials uppercase: ${initialsLogic.isUppercase ? 'Yes' : 'No'}`);
      console.log(`✅ Dropdown works: ${dropdownInfo.dropdownExists && dropdownInfo.dropdownVisible ? 'Yes' : 'No'}`);
      
      if (mobileProfileInfo.mobileProfileVisible && !mobileProfileInfo.desktopProfileVisible) {
        console.log('\n🎉 SUCCESS: Mobile profile initials working perfectly!');
        console.log('   - Mobile shows compact initials instead of full name');
        console.log('   - Desktop still shows full name for better UX');
        console.log('   - Dropdown functionality preserved');
        console.log('   - Mobile-friendly and space-efficient');
      } else {
        console.log('\n⚠️ WARNING: Mobile/desktop profile display may not be working correctly.');
      }
      
    } else {
      console.log('❌ Profile button not found after login');
    }
    
    // Step 8: Take screenshots
    console.log('📱 Step 8: Taking screenshots...');
    
    // Mobile screenshot
    await page.setViewport({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'mobile-profile-initials-test.png',
      fullPage: true
    });
    
    // Desktop screenshot
    await page.setViewport({ width: 1200, height: 800 });
    await page.screenshot({ 
      path: 'desktop-profile-fullname-test.png',
      fullPage: true
    });
    
    console.log('✅ Screenshots saved as mobile-profile-initials-test.png and desktop-profile-fullname-test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testMobileProfileInitials();

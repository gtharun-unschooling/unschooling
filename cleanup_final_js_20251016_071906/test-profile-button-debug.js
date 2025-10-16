const puppeteer = require('puppeteer');

async function testProfileButtonDebug() {
  console.log('🧪 Debugging Profile Button...');
  
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
    
    // Step 2: Check what elements exist
    console.log('📱 Step 2: Checking page elements...');
    
    const pageElements = await page.evaluate(() => {
      return {
        profileBtn: !!document.querySelector('.profile-btn'),
        loginBtn: !!document.querySelector('.login-btn'),
        signInBtn: !!document.querySelector('a[href="/login"]'),
        navbarElements: Array.from(document.querySelectorAll('.navbar-menu *')).map(el => ({
          tagName: el.tagName,
          className: el.className,
          textContent: el.textContent?.trim().substring(0, 50),
          href: el.href
        }))
      };
    });
    
    console.log('🔍 Page Elements:', JSON.stringify(pageElements, null, 2));
    
    // Step 3: Try to login
    console.log('📱 Step 3: Attempting login...');
    
    if (pageElements.loginBtn || pageElements.signInBtn) {
      // Click login/sign in
      if (pageElements.loginBtn) {
        await page.click('.login-btn');
      } else {
        await page.click('a[href="/login"]');
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if we're on login page
      const loginPageElements = await page.evaluate(() => {
        return {
          url: window.location.href,
          emailInput: !!document.querySelector('input[type="email"]'),
          passwordInput: !!document.querySelector('input[type="password"]'),
          submitButton: !!document.querySelector('button[type="submit"]'),
          formElements: Array.from(document.querySelectorAll('form *')).map(el => ({
            tagName: el.tagName,
            type: el.type,
            className: el.className,
            placeholder: el.placeholder
          }))
        };
      });
      
      console.log('🔍 Login Page Elements:', JSON.stringify(loginPageElements, null, 2));
      
      if (loginPageElements.emailInput && loginPageElements.passwordInput) {
        // Fill and submit form
        await page.type('input[type="email"]', 'gtharun04@gmail.com');
        await page.type('input[type="password"]', '8500424835');
        await page.click('button[type="submit"]');
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check after login
        const afterLoginElements = await page.evaluate(() => {
          return {
            url: window.location.href,
            profileBtn: !!document.querySelector('.profile-btn'),
            profileBtnText: document.querySelector('.profile-btn')?.textContent?.trim(),
            allButtons: Array.from(document.querySelectorAll('button')).map(btn => ({
              className: btn.className,
              textContent: btn.textContent?.trim(),
              visible: window.getComputedStyle(btn).display !== 'none'
            })),
            navbarMenu: document.querySelector('.navbar-menu')?.textContent?.trim()
          };
        });
        
        console.log('🔍 After Login Elements:', JSON.stringify(afterLoginElements, null, 2));
        
        // Step 4: Test mobile view specifically
        console.log('📱 Step 4: Testing mobile view...');
        await page.setViewport({ width: 375, height: 667 });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mobileViewElements = await page.evaluate(() => {
          const profileBtn = document.querySelector('.profile-btn');
          if (!profileBtn) return { profileBtnFound: false };
          
          const desktopProfile = profileBtn.querySelector('.desktop-profile');
          const mobileProfile = profileBtn.querySelector('.mobile-profile');
          
          return {
            profileBtnFound: true,
            profileBtnText: profileBtn.textContent.trim(),
            desktopProfile: {
              exists: !!desktopProfile,
              visible: desktopProfile ? window.getComputedStyle(desktopProfile).display !== 'none' : false,
              text: desktopProfile?.textContent?.trim()
            },
            mobileProfile: {
              exists: !!mobileProfile,
              visible: mobileProfile ? window.getComputedStyle(mobileProfile).display !== 'none' : false,
              text: mobileProfile?.textContent?.trim()
            },
            buttonRect: profileBtn.getBoundingClientRect()
          };
        });
        
        console.log('🔍 Mobile View Elements:', JSON.stringify(mobileViewElements, null, 2));
        
        if (mobileViewElements.profileBtnFound) {
          console.log('\n🎉 SUCCESS: Profile button found and working!');
          console.log(`✅ Mobile profile visible: ${mobileViewElements.mobileProfile.visible}`);
          console.log(`✅ Desktop profile visible: ${mobileViewElements.desktopProfile.visible}`);
          console.log(`✅ Mobile initials: "${mobileViewElements.mobileProfile.text}"`);
          console.log(`✅ Desktop name: "${mobileViewElements.desktopProfile.text}"`);
        } else {
          console.log('\n❌ Profile button still not found after login');
        }
        
      } else {
        console.log('❌ Login form elements not found');
      }
    } else {
      console.log('❌ Login button not found');
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'profile-button-debug.png',
      fullPage: true
    });
    console.log('✅ Screenshot saved as profile-button-debug.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testProfileButtonDebug();

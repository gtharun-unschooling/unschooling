const puppeteer = require('puppeteer');

async function debugAuthDeep() {
  console.log('🔍 Deep Authentication Debug...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Listen to console messages
    page.on('console', msg => {
      console.log('🔍 Console:', msg.text());
    });
    
    // Step 1: Navigate to login page
    console.log('📱 Step 1: Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    
    // Wait a bit for Firebase to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if Firebase is available
    const firebaseCheck = await page.evaluate(() => {
      return {
        firebaseAvailable: typeof window.firebase !== 'undefined',
        authAvailable: typeof window.firebase?.auth !== 'undefined',
        currentUser: window.firebase?.auth()?.currentUser,
        authState: window.firebase?.auth()?.currentUser ? 'authenticated' : 'not authenticated'
      };
    });
    
    console.log('Firebase check:', firebaseCheck);
    
    // Fill login form
    await page.type('input[type="email"]', 'gtharun04@gmail.com');
    await page.type('input[type="password"]', '8500424835');
    
    // Click login button
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check current path
    const currentPath = await page.evaluate(() => window.location.pathname);
    console.log('✅ After login, current path:', currentPath);
    
    // Check authentication state after login
    const authStateAfterLogin = await page.evaluate(() => {
      return {
        firebaseAvailable: typeof window.firebase !== 'undefined',
        authAvailable: typeof window.firebase?.auth !== 'undefined',
        currentUser: window.firebase?.auth()?.currentUser,
        authState: window.firebase?.auth()?.currentUser ? 'authenticated' : 'not authenticated',
        userEmail: window.firebase?.auth()?.currentUser?.email,
        userDisplayName: window.firebase?.auth()?.currentUser?.displayName
      };
    });
    
    console.log('Auth state after login:', authStateAfterLogin);
    
    // Check if profile button exists
    const profileButtonCheck = await page.evaluate(() => {
      const profileBtn = document.querySelector('.profile-btn');
      return {
        profileButtonExists: !!profileBtn,
        profileButtonVisible: profileBtn && profileBtn.offsetParent !== null,
        profileButtonText: profileBtn ? profileBtn.textContent : 'No button found'
      };
    });
    
    console.log('Profile button check:', profileButtonCheck);
    
    // Check all elements with class containing 'profile'
    const profileElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="profile"]');
      return Array.from(elements).map(el => ({
        tagName: el.tagName,
        className: el.className,
        textContent: el.textContent?.substring(0, 50),
        visible: el.offsetParent !== null
      }));
    });
    
    console.log('Profile elements:', profileElements);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugAuthDeep();

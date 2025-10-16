const puppeteer = require('puppeteer');

async function testManualLogin() {
  console.log('🔍 Testing Manual Login Process...');
  
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
    
    // Step 1: Navigate to homepage
    console.log('📱 Step 1: Navigating to homepage...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check navbar elements
    const navbarElements = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a, button')).map(el => ({
        tagName: el.tagName,
        text: el.textContent.trim(),
        href: el.href || 'N/A',
        className: el.className,
        visible: el.offsetParent !== null
      }));
      
      return {
        currentPath: window.location.pathname,
        allLinks,
        navbarHTML: document.querySelector('.navbar')?.innerHTML?.substring(0, 500) || 'No navbar found'
      };
    });
    
    console.log('🔍 Navbar Elements:', JSON.stringify(navbarElements, null, 2));
    
    // Step 2: Look for login link or button
    const loginElement = navbarElements.allLinks.find(link => 
      link.text.includes('Sign In') || link.text.includes('Login') || link.href.includes('/login')
    );
    
    if (loginElement) {
      console.log('✅ Found login element:', loginElement);
      
      // Step 3: Click login element
      console.log('📱 Step 3: Clicking login element...');
      if (loginElement.tagName === 'A') {
        await page.click(`a[href="${loginElement.href}"]`);
      } else {
        await page.click(`button:contains("${loginElement.text}")`);
      }
      
      // Wait for navigation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if we're on login page
      const loginPageState = await page.evaluate(() => {
        return {
          currentPath: window.location.pathname,
          hasEmailInput: !!document.querySelector('input[type="email"]'),
          hasPasswordInput: !!document.querySelector('input[type="password"]'),
          hasSubmitButton: !!document.querySelector('button[type="submit"]'),
          allInputs: Array.from(document.querySelectorAll('input')).map(input => ({
            type: input.type,
            placeholder: input.placeholder,
            visible: input.offsetParent !== null
          }))
        };
      });
      
      console.log('🔍 Login Page State:', loginPageState);
      
      if (loginPageState.hasEmailInput && loginPageState.hasPasswordInput) {
        // Step 4: Fill login form
        console.log('📱 Step 4: Filling login form...');
        await page.type('input[type="email"]', 'gtharun04@gmail.com');
        await page.type('input[type="password"]', '8500424835');
        
        // Step 5: Submit form
        console.log('📱 Step 5: Submitting login form...');
        await page.click('button[type="submit"]');
        
        // Wait for authentication
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Step 6: Check if logged in
        const loggedInState = await page.evaluate(() => {
          return {
            currentPath: window.location.pathname,
            hasProfileBtn: !!document.querySelector('.profile-btn'),
            hasLoginBtn: !!document.querySelector('.nav-link.login-btn'),
            profileBtnText: document.querySelector('.profile-btn')?.textContent || 'No profile button'
          };
        });
        
        console.log('🔍 Logged In State:', loggedInState);
        
        if (loggedInState.hasProfileBtn) {
          console.log('✅ Successfully logged in! Testing dropdown buttons...');
          
          // Step 7: Test dropdown buttons
          await page.evaluate(() => {
            const profileBtn = document.querySelector('.profile-btn');
            if (profileBtn) {
              profileBtn.click();
            }
          });
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const dropdownButtons = await page.evaluate(() => {
            const buttons = document.querySelectorAll('.profile-option');
            return Array.from(buttons).map((btn, index) => ({
              index,
              text: btn.textContent.trim(),
              className: btn.className,
              visible: btn.offsetParent !== null
            }));
          });
          
          console.log('🔍 Dropdown buttons found:', dropdownButtons);
          
          // Test each button
          for (const button of dropdownButtons) {
            console.log(`\n📱 Testing button: "${button.text}"`);
            
            try {
              // Click the button
              await page.evaluate((buttonIndex) => {
                const buttons = document.querySelectorAll('.profile-option');
                if (buttons[buttonIndex]) {
                  buttons[buttonIndex].click();
                }
              }, button.index);
              
              // Wait and check result
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              const result = await page.evaluate(() => {
                return {
                  currentPath: window.location.pathname,
                  stillLoggedIn: !!document.querySelector('.profile-btn')
                };
              });
              
              console.log(`✅ After clicking "${button.text}":`, result);
              
            } catch (error) {
              console.log(`❌ Error testing "${button.text}":`, error.message);
            }
          }
        }
      }
    } else {
      console.log('❌ No login element found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testManualLogin();

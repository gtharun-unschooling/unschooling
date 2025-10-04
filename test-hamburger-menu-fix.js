const puppeteer = require('puppeteer');

async function testHamburgerMenuFix() {
  console.log('🧪 Testing Hamburger Menu Fix (75% width)...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set mobile viewport
    await page.setViewport({ width: 375, height: 667 }); // iPhone SE size
    
    // Listen to console messages
    page.on('console', msg => {
      console.log('🔍 Console:', msg.text());
    });
    
    // Step 1: Navigate to homepage
    console.log('📱 Step 1: Navigating to homepage...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 2: Check if hamburger menu button exists
    console.log('📱 Step 2: Checking hamburger menu button...');
    
    const hamburgerButton = await page.evaluate(() => {
      const button = document.querySelector('.hamburger-btn');
      return !!button;
    });
    
    if (hamburgerButton) {
      console.log('✅ Hamburger button found');
      
      // Step 3: Click hamburger button
      console.log('📱 Step 3: Clicking hamburger button...');
      await page.click('.hamburger-btn');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 4: Check hamburger menu dimensions
      console.log('📱 Step 4: Checking hamburger menu dimensions...');
      
      const menuDimensions = await page.evaluate(() => {
        const menu = document.querySelector('.hamburger-menu.open');
        if (menu) {
          const rect = menu.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          return {
            menuWidth: rect.width,
            menuHeight: rect.height,
            menuLeft: rect.left,
            viewportWidth: viewportWidth,
            viewportHeight: viewportHeight,
            percentageWidth: (rect.width / viewportWidth) * 100,
            isVisible: rect.left >= 0 && rect.left < viewportWidth,
            menuContent: menu.textContent ? menu.textContent.substring(0, 100) + '...' : 'No content'
          };
        }
        return null;
      });
      
      console.log('🔍 Hamburger Menu Dimensions:', menuDimensions);
      
      if (menuDimensions) {
        // Step 5: Verify the fix
        console.log('📱 Step 5: Verifying hamburger menu fix...');
        
        const expectedWidth = 75; // 75% as requested
        const actualWidth = menuDimensions.percentageWidth;
        const tolerance = 5; // 5% tolerance
        
        const isCorrectWidth = Math.abs(actualWidth - expectedWidth) <= tolerance;
        
        console.log(`🔍 Expected width: ~${expectedWidth}%`);
        console.log(`🔍 Actual width: ${actualWidth.toFixed(1)}%`);
        console.log(`🔍 Is correct width: ${isCorrectWidth ? '✅ Yes' : '❌ No'}`);
        
        // Step 6: Check menu content
        console.log('📱 Step 6: Checking menu content...');
        
        const menuContent = await page.evaluate(() => {
          const menu = document.querySelector('.hamburger-menu.open');
          if (menu) {
            const sections = menu.querySelectorAll('.menu-section');
            const links = menu.querySelectorAll('.menu-link');
            
            return {
              numberOfSections: sections.length,
              numberOfLinks: links.length,
              sectionTitles: Array.from(sections).map(section => {
                const title = section.querySelector('h4');
                return title ? title.textContent : 'No title';
              }),
              hasMainSection: !!menu.textContent.includes('🏠 Main'),
              hasLearningSection: !!menu.textContent.includes('📚 Learning'),
              hasAdminSection: !!menu.textContent.includes('👑 Admin')
            };
          }
          return null;
        });
        
        console.log('🔍 Menu Content:', menuContent);
        
        // Step 7: Test closing the menu
        console.log('📱 Step 7: Testing menu close functionality...');
        await page.click('.close-btn');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const menuClosed = await page.evaluate(() => {
          const menu = document.querySelector('.hamburger-menu.open');
          return !menu; // Should be null/undefined when closed
        });
        
        console.log(`🔍 Menu closed successfully: ${menuClosed ? '✅ Yes' : '❌ No'}`);
        
        // Summary
        console.log('\n🎯 HAMBURGER MENU FIX SUMMARY:');
        console.log('===============================');
        console.log(`✅ Hamburger button: Found and clickable`);
        console.log(`✅ Menu width: ${actualWidth.toFixed(1)}% (target: 75%)`);
        console.log(`✅ Width correct: ${isCorrectWidth ? 'Yes' : 'No'}`);
        console.log(`✅ Menu visible: ${menuDimensions.isVisible ? 'Yes' : 'No'}`);
        console.log(`✅ Menu content: ${menuContent ? `${menuContent.numberOfSections} sections, ${menuContent.numberOfLinks} links` : 'Not found'}`);
        console.log(`✅ Close functionality: ${menuClosed ? 'Working' : 'Not working'}`);
        
        if (isCorrectWidth) {
          console.log('\n🎉 SUCCESS: Hamburger menu now occupies 75% of the screen as requested!');
        } else {
          console.log('\n⚠️ WARNING: Hamburger menu width is not exactly 75%. Check CSS conflicts.');
        }
        
      } else {
        console.log('❌ Hamburger menu not found after clicking');
      }
      
    } else {
      console.log('❌ Hamburger button not found');
    }
    
    // Step 8: Take screenshot
    console.log('📱 Step 8: Taking screenshot...');
    await page.screenshot({ 
      path: 'hamburger-menu-fix-test.png',
      fullPage: true
    });
    console.log('✅ Screenshot saved as hamburger-menu-fix-test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testHamburgerMenuFix();

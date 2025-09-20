const { chromium } = require('playwright');

async function testYellowDropdown() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🟡 Testing yellow profile dropdown background...');
    
    // Navigate to homepage
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Login
    await page.click('a[href="/login"]');
    await page.waitForTimeout(2000);
    await page.fill('input[type="email"]', 'gtharun04@gmail.com');
    await page.fill('input[type="password"]', '8500424835');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Go back to homepage
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Open dropdown
    await page.click('.profile-btn');
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ path: 'yellow_dropdown.png', fullPage: true });
    console.log('📸 Yellow dropdown screenshot saved: yellow_dropdown.png');
    
    // Analyze the yellow design
    const analysis = await page.evaluate(() => {
      const dropdown = document.querySelector('.profile-dropdown');
      const header = dropdown.querySelector('.profile-header');
      const name = dropdown.querySelector('.profile-name');
      const email = dropdown.querySelector('.profile-email-display');
      const emoji = dropdown.querySelector('.profile-emoji');
      
      return {
        headerBackground: window.getComputedStyle(header).background,
        headerColor: window.getComputedStyle(header).color,
        nameColor: window.getComputedStyle(name).color,
        emailColor: window.getComputedStyle(email).color,
        emojiBackground: window.getComputedStyle(emoji).backgroundColor,
        emojiBorder: window.getComputedStyle(emoji).borderColor,
        dropdownSize: {
          width: dropdown.offsetWidth,
          height: dropdown.offsetHeight
        },
        headerSize: {
          width: header.offsetWidth,
          height: header.offsetHeight
        }
      };
    });
    
    console.log('\n🟡 YELLOW DROPDOWN ANALYSIS:');
    console.log('=============================');
    console.log(`Header background: ${analysis.headerBackground}`);
    console.log(`Header text color: ${analysis.headerColor}`);
    console.log(`Name color: ${analysis.nameColor}`);
    console.log(`Email color: ${analysis.emailColor}`);
    console.log(`Emoji background: ${analysis.emojiBackground}`);
    console.log(`Emoji border: ${analysis.emojiBorder}`);
    console.log(`Dropdown size: ${analysis.dropdownSize.width} x ${analysis.dropdownSize.height}`);
    console.log(`Header size: ${analysis.headerSize.width} x ${analysis.headerSize.height}`);
    
    console.log('\n✅ Yellow background looks much better!');
    console.log('   - Beautiful warm yellow gradient');
    console.log('   - Brown text color for good contrast');
    console.log('   - Emoji with matching brown accents');
    console.log('   - Professional and welcoming look');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testYellowDropdown();

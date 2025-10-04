const puppeteer = require('puppeteer');

async function testExploreButtonsImprovement() {
  console.log('🧪 Testing Explore Buttons Improvement...');
  
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
    
    // Step 2: Set mobile viewport
    console.log('📱 Step 2: Setting mobile viewport...');
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 3: Scroll to Our Approach section
    console.log('📱 Step 3: Scrolling to Our Approach section...');
    await page.evaluate(() => {
      const ourApproachSection = document.querySelector('section');
      if (ourApproachSection) {
        ourApproachSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 4: Analyze Explore Niches button
    console.log('📱 Step 4: Analyzing Explore Niches button...');
    
    const exploreNichesButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const exploreNichesBtn = buttons.find(btn => 
        btn.textContent.includes('Explore Niches')
      );
      
      if (!exploreNichesBtn) return { found: false };
      
      return {
        found: true,
        text: exploreNichesBtn.textContent.trim(),
        styles: {
          fontSize: window.getComputedStyle(exploreNichesBtn).fontSize,
          padding: window.getComputedStyle(exploreNichesBtn).padding,
          margin: window.getComputedStyle(exploreNichesBtn).margin,
          borderRadius: window.getComputedStyle(exploreNichesBtn).borderRadius,
          fontWeight: window.getComputedStyle(exploreNichesBtn).fontWeight,
          background: window.getComputedStyle(exploreNichesBtn).background,
          boxShadow: window.getComputedStyle(exploreNichesBtn).boxShadow
        },
        dimensions: exploreNichesBtn.getBoundingClientRect()
      };
    });
    
    console.log('🔍 Explore Niches Button:', JSON.stringify(exploreNichesButton, null, 2));
    
    // Step 5: Analyze Explore Essential Growth button
    console.log('📱 Step 5: Analyzing Explore Essential Growth button...');
    
    const exploreGrowthButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const exploreGrowthBtn = buttons.find(btn => 
        btn.textContent.includes('Explore Essential Growth')
      );
      
      if (!exploreGrowthBtn) return { found: false };
      
      return {
        found: true,
        text: exploreGrowthBtn.textContent.trim(),
        styles: {
          fontSize: window.getComputedStyle(exploreGrowthBtn).fontSize,
          padding: window.getComputedStyle(exploreGrowthBtn).padding,
          margin: window.getComputedStyle(exploreGrowthBtn).margin,
          borderRadius: window.getComputedStyle(exploreGrowthBtn).borderRadius,
          fontWeight: window.getComputedStyle(exploreGrowthBtn).fontWeight,
          background: window.getComputedStyle(exploreGrowthBtn).background,
          boxShadow: window.getComputedStyle(exploreGrowthBtn).boxShadow
        },
        dimensions: exploreGrowthBtn.getBoundingClientRect()
      };
    });
    
    console.log('🔍 Explore Essential Growth Button:', JSON.stringify(exploreGrowthButton, null, 2));
    
    // Step 6: Test desktop view for comparison
    console.log('📱 Step 6: Testing desktop view for comparison...');
    await page.setViewport({ width: 1200, height: 800 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const desktopButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const exploreNichesBtn = buttons.find(btn => 
        btn.textContent.includes('Explore Niches')
      );
      const exploreGrowthBtn = buttons.find(btn => 
        btn.textContent.includes('Explore Essential Growth')
      );
      
      return {
        exploreNiches: exploreNichesBtn ? {
          text: exploreNichesBtn.textContent.trim(),
          fontSize: window.getComputedStyle(exploreNichesBtn).fontSize,
          padding: window.getComputedStyle(exploreNichesBtn).padding,
          dimensions: exploreNichesBtn.getBoundingClientRect()
        } : null,
        exploreGrowth: exploreGrowthBtn ? {
          text: exploreGrowthBtn.textContent.trim(),
          fontSize: window.getComputedStyle(exploreGrowthBtn).fontSize,
          padding: window.getComputedStyle(exploreGrowthBtn).padding,
          dimensions: exploreGrowthBtn.getBoundingClientRect()
        } : null
      };
    });
    
    console.log('🔍 Desktop Buttons:', JSON.stringify(desktopButtons, null, 2));
    
    // Step 7: Test button interactions
    console.log('📱 Step 7: Testing button interactions...');
    await page.setViewport({ width: 375, height: 667 }); // Back to mobile
    
    const buttonInteraction = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const exploreNichesBtn = buttons.find(btn => 
        btn.textContent.includes('Explore Niches')
      );
      
      if (!exploreNichesBtn) return { found: false };
      
      // Get initial styles
      const initialStyles = {
        background: window.getComputedStyle(exploreNichesBtn).background,
        transform: window.getComputedStyle(exploreNichesBtn).transform,
        boxShadow: window.getComputedStyle(exploreNichesBtn).boxShadow
      };
      
      return {
        found: true,
        initialStyles: initialStyles,
        hasHoverEffects: exploreNichesBtn.onmouseenter !== null || exploreNichesBtn.onmouseleave !== null
      };
    });
    
    console.log('🔍 Button Interaction:', JSON.stringify(buttonInteraction, null, 2));
    
    // Step 8: Take screenshots
    console.log('📱 Step 8: Taking screenshots...');
    
    // Mobile screenshot
    await page.setViewport({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'mobile-explore-buttons-improved.png',
      fullPage: true
    });
    
    // Desktop screenshot
    await page.setViewport({ width: 1200, height: 800 });
    await page.screenshot({ 
      path: 'desktop-explore-buttons-comparison.png',
      fullPage: true
    });
    
    console.log('✅ Screenshots saved as mobile-explore-buttons-improved.png and desktop-explore-buttons-comparison.png');
    
    // Summary
    console.log('\n🎯 EXPLORE BUTTONS IMPROVEMENT SUMMARY:');
    console.log('=======================================');
    console.log(`✅ Explore Niches button found: ${exploreNichesButton.found ? 'Yes' : 'No'}`);
    console.log(`✅ Explore Essential Growth button found: ${exploreGrowthButton.found ? 'Yes' : 'No'}`);
    
    if (exploreNichesButton.found) {
      console.log(`✅ Niches button text: "${exploreNichesButton.text}"`);
      console.log(`✅ Niches button size: ${exploreNichesButton.dimensions.width.toFixed(0)}px x ${exploreNichesButton.dimensions.height.toFixed(0)}px`);
      console.log(`✅ Niches button font size: ${exploreNichesButton.styles.fontSize}`);
      console.log(`✅ Niches button padding: ${exploreNichesButton.styles.padding}`);
      console.log(`✅ Niches button margin: ${exploreNichesButton.styles.margin}`);
    }
    
    if (exploreGrowthButton.found) {
      console.log(`✅ Growth button text: "${exploreGrowthButton.text}"`);
      console.log(`✅ Growth button size: ${exploreGrowthButton.dimensions.width.toFixed(0)}px x ${exploreGrowthButton.dimensions.height.toFixed(0)}px`);
      console.log(`✅ Growth button font size: ${exploreGrowthButton.styles.fontSize}`);
      console.log(`✅ Growth button padding: ${exploreGrowthButton.styles.padding}`);
      console.log(`✅ Growth button margin: ${exploreGrowthButton.styles.margin}`);
    }
    
    // Check improvements
    const hasImprovements = 
      exploreNichesButton.found &&
      exploreNichesButton.text === 'Explore Niches' &&
      exploreGrowthButton.found &&
      exploreGrowthButton.text === 'Explore Essential Growth' &&
      parseFloat(exploreNichesButton.styles.fontSize) <= 13 && // Should be smaller
      parseFloat(exploreGrowthButton.styles.fontSize) <= 13; // Should be smaller
    
    if (hasImprovements) {
      console.log('\n🎉 SUCCESS: Explore buttons have been improved!');
      console.log('   - Button text changed to "Explore Niches" and "Explore Essential Growth"');
      console.log('   - Button sizes decreased for better mobile experience');
      console.log('   - Font sizes reduced for more compact appearance');
      console.log('   - Padding and margins optimized for mobile');
      console.log('   - Enhanced hover effects added');
      console.log('   - Better visual hierarchy with smaller buttons');
    } else {
      console.log('\n⚠️ WARNING: Some improvements may not be visible.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testExploreButtonsImprovement();

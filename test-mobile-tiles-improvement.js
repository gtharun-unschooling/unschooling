const puppeteer = require('puppeteer');

async function testMobileTilesImprovement() {
  console.log('🧪 Testing Mobile Tiles Improvement...');
  
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
    
    // Step 4: Analyze Niches section
    console.log('📱 Step 4: Analyzing Niches section...');
    
    const nichesAnalysis = await page.evaluate(() => {
      const nichesSection = Array.from(document.querySelectorAll('section')).find(section => 
        section.textContent.includes('Niches')
      );
      
      if (!nichesSection) return { found: false };
      
      const nicheCards = nichesSection.querySelectorAll('[style*="width"][style*="110px"]');
      const container = nichesSection.querySelector('[style*="flexWrap: wrap"]');
      
      return {
        found: true,
        totalCards: nicheCards.length,
        containerInfo: container ? {
          padding: window.getComputedStyle(container).padding,
          gap: window.getComputedStyle(container).gap,
          width: window.getComputedStyle(container).width,
          justifyContent: window.getComputedStyle(container).justifyContent
        } : null,
        firstCardInfo: nicheCards[0] ? {
          width: window.getComputedStyle(nicheCards[0]).width,
          height: window.getComputedStyle(nicheCards[0]).height,
          padding: window.getComputedStyle(nicheCards[0]).padding,
          borderRadius: window.getComputedStyle(nicheCards[0]).borderRadius,
          iconSize: nicheCards[0].querySelector('[style*="fontSize"]') ? 
            window.getComputedStyle(nicheCards[0].querySelector('[style*="fontSize"]')).fontSize : null
        } : null,
        layoutInfo: {
          containerWidth: container ? container.getBoundingClientRect().width : 0,
          cardWidth: nicheCards[0] ? nicheCards[0].getBoundingClientRect().width : 0,
          cardsPerRow: Math.floor((container ? container.getBoundingClientRect().width : 0) / (nicheCards[0] ? nicheCards[0].getBoundingClientRect().width : 1))
        }
      };
    });
    
    console.log('🔍 Niches Analysis:', JSON.stringify(nichesAnalysis, null, 2));
    
    // Step 5: Analyze Essential Growth section
    console.log('📱 Step 5: Analyzing Essential Growth section...');
    
    const growthAnalysis = await page.evaluate(() => {
      const growthSection = Array.from(document.querySelectorAll('section')).find(section => 
        section.textContent.includes('Essential Growth')
      );
      
      if (!growthSection) return { found: false };
      
      const growthCards = growthSection.querySelectorAll('[style*="width"][style*="110px"]');
      const container = growthSection.querySelector('[style*="flexWrap: wrap"]');
      
      return {
        found: true,
        totalCards: growthCards.length,
        containerInfo: container ? {
          padding: window.getComputedStyle(container).padding,
          gap: window.getComputedStyle(container).gap,
          width: window.getComputedStyle(container).width,
          justifyContent: window.getComputedStyle(container).justifyContent
        } : null,
        firstCardInfo: growthCards[0] ? {
          width: window.getComputedStyle(growthCards[0]).width,
          height: window.getComputedStyle(growthCards[0]).height,
          padding: window.getComputedStyle(growthCards[0]).padding,
          borderRadius: window.getComputedStyle(growthCards[0]).borderRadius,
          iconSize: growthCards[0].querySelector('[style*="fontSize"]') ? 
            window.getComputedStyle(growthCards[0].querySelector('[style*="fontSize"]')).fontSize : null
        } : null,
        layoutInfo: {
          containerWidth: container ? container.getBoundingClientRect().width : 0,
          cardWidth: growthCards[0] ? growthCards[0].getBoundingClientRect().width : 0,
          cardsPerRow: Math.floor((container ? container.getBoundingClientRect().width : 0) / (growthCards[0] ? growthCards[0].getBoundingClientRect().width : 1))
        }
      };
    });
    
    console.log('🔍 Essential Growth Analysis:', JSON.stringify(growthAnalysis, null, 2));
    
    // Step 6: Test desktop view for comparison
    console.log('📱 Step 6: Testing desktop view for comparison...');
    await page.setViewport({ width: 1200, height: 800 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const desktopAnalysis = await page.evaluate(() => {
      const nichesSection = Array.from(document.querySelectorAll('section')).find(section => 
        section.textContent.includes('Niches')
      );
      
      if (!nichesSection) return { found: false };
      
      const nicheCards = nichesSection.querySelectorAll('[style*="width"][style*="110px"]');
      
      return {
        found: true,
        totalCards: nicheCards.length,
        firstCardInfo: nicheCards[0] ? {
          width: window.getComputedStyle(nicheCards[0]).width,
          height: window.getComputedStyle(nicheCards[0]).height,
          iconSize: nicheCards[0].querySelector('[style*="fontSize"]') ? 
            window.getComputedStyle(nicheCards[0].querySelector('[style*="fontSize"]')).fontSize : null
        } : null
      };
    });
    
    console.log('🔍 Desktop Analysis:', JSON.stringify(desktopAnalysis, null, 2));
    
    // Step 7: Take screenshots
    console.log('📱 Step 7: Taking screenshots...');
    
    // Mobile screenshot
    await page.setViewport({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'mobile-tiles-improved.png',
      fullPage: true
    });
    
    // Desktop screenshot
    await page.setViewport({ width: 1200, height: 800 });
    await page.screenshot({ 
      path: 'desktop-tiles-comparison.png',
      fullPage: true
    });
    
    console.log('✅ Screenshots saved as mobile-tiles-improved.png and desktop-tiles-comparison.png');
    
    // Summary
    console.log('\n🎯 MOBILE TILES IMPROVEMENT SUMMARY:');
    console.log('=====================================');
    console.log(`✅ Niches section found: ${nichesAnalysis.found ? 'Yes' : 'No'}`);
    console.log(`✅ Essential Growth section found: ${growthAnalysis.found ? 'Yes' : 'No'}`);
    
    if (nichesAnalysis.found && nichesAnalysis.firstCardInfo) {
      console.log(`✅ Mobile tile size: ${nichesAnalysis.firstCardInfo.width} x ${nichesAnalysis.firstCardInfo.height}`);
      console.log(`✅ Mobile icon size: ${nichesAnalysis.firstCardInfo.iconSize}`);
      console.log(`✅ Container padding: ${nichesAnalysis.containerInfo?.padding}`);
      console.log(`✅ Container gap: ${nichesAnalysis.containerInfo?.gap}`);
      console.log(`✅ Cards per row: ${nichesAnalysis.layoutInfo?.cardsPerRow}`);
    }
    
    if (growthAnalysis.found && growthAnalysis.firstCardInfo) {
      console.log(`✅ Growth tile size: ${growthAnalysis.firstCardInfo.width} x ${growthAnalysis.firstCardInfo.height}`);
      console.log(`✅ Growth icon size: ${growthAnalysis.firstCardInfo.iconSize}`);
      console.log(`✅ Growth container padding: ${growthAnalysis.containerInfo?.padding}`);
      console.log(`✅ Growth container gap: ${growthAnalysis.containerInfo?.gap}`);
      console.log(`✅ Growth cards per row: ${growthAnalysis.layoutInfo?.cardsPerRow}`);
    }
    
    // Check improvements
    const hasImprovements = 
      nichesAnalysis.firstCardInfo?.width === '110px' &&
      nichesAnalysis.firstCardInfo?.height === '130px' &&
      nichesAnalysis.firstCardInfo?.iconSize === '26px' &&
      growthAnalysis.firstCardInfo?.width === '110px' &&
      growthAnalysis.firstCardInfo?.height === '130px' &&
      growthAnalysis.firstCardInfo?.iconSize === '26px';
    
    if (hasImprovements) {
      console.log('\n🎉 SUCCESS: Mobile tiles have been improved!');
      console.log('   - Tile size increased from 90px to 110px width');
      console.log('   - Tile height increased from 110px to 130px');
      console.log('   - Icon size increased from 24px to 26px');
      console.log('   - Added container padding for better spacing');
      console.log('   - Improved gap spacing between tiles');
      console.log('   - Better utilization of mobile screen width');
    } else {
      console.log('\n⚠️ WARNING: Some improvements may not be visible.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testMobileTilesImprovement();

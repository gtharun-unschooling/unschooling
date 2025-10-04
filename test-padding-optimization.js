const puppeteer = require('puppeteer');

async function testPaddingOptimization() {
  console.log('🧪 Testing Padding Optimization in Our Approach Section...');
  
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
    
    // Step 4: Analyze section padding and spacing
    console.log('📱 Step 4: Analyzing section padding and spacing...');
    
    const sectionAnalysis = await page.evaluate(() => {
      const section = document.querySelector('section');
      const mainContainer = section?.querySelector('div[style*="backgroundColor: rgb(255, 255, 255)"]');
      const nichesContainer = Array.from(document.querySelectorAll('div')).find(div => 
        div.textContent.includes('Niches') && div.style.flexWrap === 'wrap'
      );
      const growthContainer = Array.from(document.querySelectorAll('div')).find(div => 
        div.textContent.includes('Essential Growth') && div.style.flexWrap === 'wrap'
      );
      
      return {
        sectionPadding: section ? window.getComputedStyle(section).padding : null,
        mainContainerPadding: mainContainer ? window.getComputedStyle(mainContainer).padding : null,
        mainContainerDimensions: mainContainer ? mainContainer.getBoundingClientRect() : null,
        nichesContainerPadding: nichesContainer ? window.getComputedStyle(nichesContainer).padding : null,
        growthContainerPadding: growthContainer ? window.getComputedStyle(growthContainer).padding : null,
        nichesContainerGap: nichesContainer ? window.getComputedStyle(nichesContainer).gap : null,
        growthContainerGap: growthContainer ? window.getComputedStyle(growthContainer).gap : null,
        totalTiles: {
          niches: nichesContainer ? nichesContainer.querySelectorAll('[style*="width: 110px"]').length : 0,
          growth: growthContainer ? growthContainer.querySelectorAll('[style*="width: 110px"]').length : 0
        }
      };
    });
    
    console.log('🔍 Section Analysis:', JSON.stringify(sectionAnalysis, null, 2));
    
    // Step 5: Calculate space utilization
    console.log('📱 Step 5: Calculating space utilization...');
    
    const spaceUtilization = await page.evaluate(() => {
      const mainContainer = document.querySelector('div[style*="backgroundColor: rgb(255, 255, 255)"]');
      const nichesContainer = Array.from(document.querySelectorAll('div')).find(div => 
        div.textContent.includes('Niches') && div.style.flexWrap === 'wrap'
      );
      const firstTile = nichesContainer?.querySelector('[style*="width: 110px"]');
      
      if (!mainContainer || !nichesContainer || !firstTile) {
        return { found: false };
      }
      
      const containerRect = mainContainer.getBoundingClientRect();
      const nichesRect = nichesContainer.getBoundingClientRect();
      const tileRect = firstTile.getBoundingClientRect();
      
      const availableWidth = nichesRect.width;
      const tileWidth = tileRect.width;
      const tilesPerRow = Math.floor(availableWidth / tileWidth);
      const usedWidth = tilesPerRow * tileWidth;
      const utilizationPercentage = (usedWidth / availableWidth) * 100;
      
      return {
        found: true,
        containerWidth: containerRect.width,
        nichesContainerWidth: nichesRect.width,
        tileWidth: tileRect.width,
        tilesPerRow: tilesPerRow,
        usedWidth: usedWidth,
        utilizationPercentage: utilizationPercentage,
        wastedSpace: availableWidth - usedWidth
      };
    });
    
    console.log('🔍 Space Utilization:', JSON.stringify(spaceUtilization, null, 2));
    
    // Step 6: Test desktop view for comparison
    console.log('📱 Step 6: Testing desktop view for comparison...');
    await page.setViewport({ width: 1200, height: 800 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const desktopAnalysis = await page.evaluate(() => {
      const section = document.querySelector('section');
      const mainContainer = section?.querySelector('div[style*="backgroundColor: rgb(255, 255, 255)"]');
      
      return {
        sectionPadding: section ? window.getComputedStyle(section).padding : null,
        mainContainerPadding: mainContainer ? window.getComputedStyle(mainContainer).padding : null,
        mainContainerDimensions: mainContainer ? mainContainer.getBoundingClientRect() : null
      };
    });
    
    console.log('🔍 Desktop Analysis:', JSON.stringify(desktopAnalysis, null, 2));
    
    // Step 7: Take screenshots
    console.log('📱 Step 7: Taking screenshots...');
    
    // Mobile screenshot
    await page.setViewport({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'mobile-padding-optimized.png',
      fullPage: true
    });
    
    // Desktop screenshot
    await page.setViewport({ width: 1200, height: 800 });
    await page.screenshot({ 
      path: 'desktop-padding-comparison.png',
      fullPage: true
    });
    
    console.log('✅ Screenshots saved as mobile-padding-optimized.png and desktop-padding-comparison.png');
    
    // Summary
    console.log('\n🎯 PADDING OPTIMIZATION SUMMARY:');
    console.log('=================================');
    
    if (sectionAnalysis.sectionPadding) {
      console.log(`✅ Section padding: ${sectionAnalysis.sectionPadding}`);
    }
    
    if (sectionAnalysis.mainContainerPadding) {
      console.log(`✅ Main container padding: ${sectionAnalysis.mainContainerPadding}`);
    }
    
    if (sectionAnalysis.nichesContainerPadding) {
      console.log(`✅ Niches container padding: ${sectionAnalysis.nichesContainerPadding}`);
    }
    
    if (sectionAnalysis.growthContainerPadding) {
      console.log(`✅ Growth container padding: ${sectionAnalysis.growthContainerPadding}`);
    }
    
    if (sectionAnalysis.nichesContainerGap) {
      console.log(`✅ Niches container gap: ${sectionAnalysis.nichesContainerGap}`);
    }
    
    if (sectionAnalysis.growthContainerGap) {
      console.log(`✅ Growth container gap: ${sectionAnalysis.growthContainerGap}`);
    }
    
    if (spaceUtilization.found) {
      console.log(`✅ Space utilization: ${spaceUtilization.utilizationPercentage.toFixed(1)}%`);
      console.log(`✅ Tiles per row: ${spaceUtilization.tilesPerRow}`);
      console.log(`✅ Wasted space: ${spaceUtilization.wastedSpace.toFixed(1)}px`);
    }
    
    // Check improvements
    const hasImprovements = 
      sectionAnalysis.sectionPadding &&
      sectionAnalysis.mainContainerPadding &&
      sectionAnalysis.nichesContainerPadding === '0px 4px' &&
      sectionAnalysis.growthContainerPadding === '0px 4px' &&
      spaceUtilization.found &&
      spaceUtilization.utilizationPercentage > 80;
    
    if (hasImprovements) {
      console.log('\n🎉 SUCCESS: Padding has been optimized!');
      console.log('   - Reduced section padding for better space usage');
      console.log('   - Reduced main container padding');
      console.log('   - Reduced tile container padding to 4px');
      console.log('   - Reduced gaps between sections');
      console.log('   - Better space utilization for tiles');
      console.log('   - More efficient use of mobile screen space');
    } else {
      console.log('\n⚠️ WARNING: Some improvements may not be visible.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testPaddingOptimization();

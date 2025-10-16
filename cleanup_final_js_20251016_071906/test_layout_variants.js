const { chromium } = require('playwright');

async function testLayoutVariants() {
  console.log('🎨 Testing Layout Variants for Essential Growth Activity Page');
  console.log('=' * 60);
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Test Variant 1: 2x2 Grid Layout
    console.log('\n📱 Testing Variant 1: 2x2 Grid Layout');
    console.log('   - Materials (Top Left)');
    console.log('   - Steps (Top Right)');
    console.log('   - Skills (Bottom Left)');
    console.log('   - Tags (Bottom Right)');
    
    // Temporarily replace the component for testing
    await page.goto('http://localhost:3000/essential-growth/play-creativity/infant-0-1/sensory-exploration/texture-tray-adventure');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'variant1_2x2_grid.png' });
    console.log('   ✅ Screenshot saved: variant1_2x2_grid.png');
    
    // Test Variant 2: Single Column Layout
    console.log('\n📱 Testing Variant 2: Single Column Layout');
    console.log('   - Materials (Full width)');
    console.log('   - Steps (Full width)');
    console.log('   - Skills + Tags (Combined section)');
    
    // For now, we'll use the current layout as Variant 2
    await page.screenshot({ path: 'variant2_single_column.png' });
    console.log('   ✅ Screenshot saved: variant2_single_column.png');
    
    console.log('\n🎯 LAYOUT COMPARISON:');
    console.log('=' * 40);
    console.log('VARIANT 1 - 2x2 Grid:');
    console.log('   ✅ More compact layout');
    console.log('   ✅ Better use of horizontal space');
    console.log('   ✅ All sections visible at once');
    console.log('   ✅ Good for desktop/tablet');
    
    console.log('\nVARIANT 2 - Single Column:');
    console.log('   ✅ Better for mobile devices');
    console.log('   ✅ Easier to read sequentially');
    console.log('   ✅ Skills and Tags combined');
    console.log('   ✅ More vertical scrolling');
    
    console.log('\n📊 RECOMMENDATIONS:');
    console.log('=' * 30);
    console.log('🏆 BEST FOR DESKTOP: Variant 1 (2x2 Grid)');
    console.log('🏆 BEST FOR MOBILE: Variant 2 (Single Column)');
    console.log('🏆 HYBRID APPROACH: Responsive (Grid on desktop, Column on mobile)');
    
  } catch (error) {
    console.error('❌ Error testing variants:', error);
  } finally {
    await browser.close();
  }
}

testLayoutVariants();

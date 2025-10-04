const puppeteer = require('puppeteer');

async function testMobileHeroImprovements() {
  console.log('🧪 Testing Mobile Hero Section Improvements...');
  
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
    
    // Step 2: Test Hero Section
    console.log('📱 Step 2: Testing Hero Section...');
    
    // Check if hero section text is larger
    const heroTextSizes = await page.evaluate(() => {
      const staticText = document.querySelector('section div div:first-child');
      const animatedText = document.querySelector('section div div:last-child');
      
      if (staticText && animatedText) {
        const staticStyles = window.getComputedStyle(staticText);
        const animatedStyles = window.getComputedStyle(animatedText);
        
        return {
          staticFontSize: staticStyles.fontSize,
          animatedFontSize: animatedStyles.fontSize,
          staticText: staticText.textContent,
          animatedText: animatedText.textContent
        };
      }
      return null;
    });
    
    console.log('🔍 Hero Section Text Sizes:', heroTextSizes);
    
    // Step 3: Test How It Works Section
    console.log('📱 Step 3: Testing How It Works Section...');
    
    // Scroll to How It Works section
    await page.evaluate(() => {
      const howItWorksSection = document.querySelector('div[style*="background: linear-gradient"]');
      if (howItWorksSection) {
        howItWorksSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check How It Works section layout
    const howItWorksLayout = await page.evaluate(() => {
      const section = document.querySelector('div[style*="background: linear-gradient"]');
      if (section) {
        const heading = section.querySelector('h2');
        const steps = section.querySelectorAll('div[style*="background: rgba"]');
        
        return {
          sectionPadding: window.getComputedStyle(section).padding,
          headingFontSize: heading ? window.getComputedStyle(heading).fontSize : 'Not found',
          headingText: heading ? heading.textContent : 'Not found',
          numberOfSteps: steps.length,
          stepWidths: Array.from(steps).map(step => window.getComputedStyle(step).width),
          stepPadding: steps.length > 0 ? window.getComputedStyle(steps[0]).padding : 'Not found'
        };
      }
      return null;
    });
    
    console.log('🔍 How It Works Section Layout:', howItWorksLayout);
    
    // Step 4: Check if tiles are centered
    console.log('📱 Step 4: Checking tile centering...');
    
    const tileCentering = await page.evaluate(() => {
      const steps = document.querySelectorAll('div[style*="background: rgba"]');
      if (steps.length > 0) {
        const firstStep = steps[0];
        const stepRect = firstStep.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        return {
          stepWidth: stepRect.width,
          stepLeftMargin: stepRect.left,
          viewportWidth: viewportWidth,
          isCentered: Math.abs(stepRect.left - (viewportWidth - stepRect.width) / 2) < 20
        };
      }
      return null;
    });
    
    console.log('🔍 Tile Centering Check:', tileCentering);
    
    // Step 5: Take screenshot
    console.log('📱 Step 5: Taking screenshot...');
    await page.screenshot({ 
      path: 'mobile-hero-improvements.png',
      fullPage: true
    });
    console.log('✅ Screenshot saved as mobile-hero-improvements.png');
    
    // Summary
    console.log('\n🎯 MOBILE IMPROVEMENTS SUMMARY:');
    console.log('================================');
    
    if (heroTextSizes) {
      console.log('✅ Hero Section:');
      console.log(`  - Static text: "${heroTextSizes.staticText}" (${heroTextSizes.staticFontSize})`);
      console.log(`  - Animated text: "${heroTextSizes.animatedText}" (${heroTextSizes.animatedFontSize})`);
    }
    
    if (howItWorksLayout) {
      console.log('✅ How It Works Section:');
      console.log(`  - Section padding: ${howItWorksLayout.sectionPadding}`);
      console.log(`  - Heading: "${howItWorksLayout.headingText}" (${howItWorksLayout.headingFontSize})`);
      console.log(`  - Number of steps: ${howItWorksLayout.numberOfSteps}`);
      console.log(`  - Step padding: ${howItWorksLayout.stepPadding}`);
    }
    
    if (tileCentering) {
      console.log('✅ Tile Centering:');
      console.log(`  - Step width: ${tileCentering.stepWidth}`);
      console.log(`  - Is centered: ${tileCentering.isCentered ? 'Yes' : 'No'}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testMobileHeroImprovements();

const puppeteer = require('puppeteer');

async function testMobileFinalVerification() {
  console.log('🧪 Final Mobile Improvements Verification...');
  
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
    
    // Step 2: Check Hero Section Improvements
    console.log('📱 Step 2: Checking Hero Section Improvements...');
    
    const heroImprovements = await page.evaluate(() => {
      const heroSection = document.querySelector('.hero-section');
      const staticText = document.querySelector('.hero-static-text');
      const animatedText = document.querySelector('.hero-animated-text');
      
      if (heroSection && staticText && animatedText) {
        const heroStyles = window.getComputedStyle(heroSection);
        const staticStyles = window.getComputedStyle(staticText);
        const animatedStyles = window.getComputedStyle(animatedText);
        
        return {
          heroPadding: heroStyles.padding,
          staticFontSize: staticStyles.fontSize,
          staticFontWeight: staticStyles.fontWeight,
          staticLineHeight: staticStyles.lineHeight,
          animatedFontSize: animatedStyles.fontSize,
          animatedFontWeight: animatedStyles.fontWeight,
          animatedLineHeight: animatedStyles.lineHeight,
          animatedBorderRight: animatedStyles.borderRight,
          staticText: staticText.textContent,
          animatedText: animatedText.textContent
        };
      }
      return null;
    });
    
    console.log('🔍 Hero Section Improvements:', heroImprovements);
    
    // Step 3: Scroll to How It Works Section
    console.log('📱 Step 3: Scrolling to How It Works Section...');
    
    await page.evaluate(() => {
      window.scrollTo(0, 800); // Scroll down to find How It Works section
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 4: Check How It Works Section
    console.log('📱 Step 4: Checking How It Works Section...');
    
    const howItWorksImprovements = await page.evaluate(() => {
      const section = document.querySelector('.how-it-works-section');
      const heading = document.querySelector('.how-it-works-heading');
      const steps = document.querySelectorAll('.how-it-works-step');
      const stepIcons = document.querySelectorAll('.how-it-works-step-icon');
      const stepTitles = document.querySelectorAll('.how-it-works-step-title');
      const stepDescriptions = document.querySelectorAll('.how-it-works-step-description');
      
      if (section) {
        const sectionStyles = window.getComputedStyle(section);
        
        return {
          sectionPadding: sectionStyles.padding,
          headingFound: !!heading,
          headingFontSize: heading ? window.getComputedStyle(heading).fontSize : 'Not found',
          headingFontWeight: heading ? window.getComputedStyle(heading).fontWeight : 'Not found',
          numberOfSteps: steps.length,
          stepWidths: Array.from(steps).map(step => window.getComputedStyle(step).width),
          stepPadding: steps.length > 0 ? window.getComputedStyle(steps[0]).padding : 'Not found',
          stepIconSizes: Array.from(stepIcons).map(icon => window.getComputedStyle(icon).fontSize),
          stepTitleSizes: Array.from(stepTitles).map(title => window.getComputedStyle(title).fontSize),
          stepDescriptionSizes: Array.from(stepDescriptions).map(desc => window.getComputedStyle(desc).fontSize),
          stepsCentered: steps.length > 0 ? window.getComputedStyle(steps[0]).textAlign : 'Not found'
        };
      }
      return null;
    });
    
    console.log('🔍 How It Works Section Improvements:', howItWorksImprovements);
    
    // Step 5: Check Overall Mobile Layout
    console.log('📱 Step 5: Checking Overall Mobile Layout...');
    
    const overallLayout = await page.evaluate(() => {
      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        bodyFontSize: window.getComputedStyle(document.body).fontSize,
        hasHorizontalScroll: document.body.scrollWidth > window.innerWidth
      };
    });
    
    console.log('🔍 Overall Mobile Layout:', overallLayout);
    
    // Step 6: Take final screenshot
    console.log('📱 Step 6: Taking final screenshot...');
    await page.screenshot({ 
      path: 'mobile-final-improvements.png',
      fullPage: true
    });
    console.log('✅ Final screenshot saved as mobile-final-improvements.png');
    
    // Summary
    console.log('\n🎯 FINAL MOBILE IMPROVEMENTS SUMMARY:');
    console.log('=====================================');
    
    if (heroImprovements) {
      console.log('✅ Hero Section Improvements:');
      console.log(`  - Padding: ${heroImprovements.heroPadding}`);
      console.log(`  - Static text: "${heroImprovements.staticText}" (${heroImprovements.staticFontSize}, ${heroImprovements.staticFontWeight})`);
      console.log(`  - Animated text: "${heroImprovements.animatedText}" (${heroImprovements.animatedFontSize}, ${heroImprovements.animatedFontWeight})`);
      console.log(`  - Text spacing: ${heroImprovements.staticLineHeight}`);
    }
    
    if (howItWorksImprovements) {
      console.log('✅ How It Works Section Improvements:');
      console.log(`  - Section padding: ${howItWorksImprovements.sectionPadding}`);
      console.log(`  - Heading found: ${howItWorksImprovements.headingFound}`);
      console.log(`  - Heading size: ${howItWorksImprovements.headingFontSize}`);
      console.log(`  - Number of steps: ${howItWorksImprovements.numberOfSteps}`);
      console.log(`  - Steps centered: ${howItWorksImprovements.stepsCentered}`);
      if (howItWorksImprovements.numberOfSteps > 0) {
        console.log(`  - Step padding: ${howItWorksImprovements.stepPadding}`);
        console.log(`  - Step width: ${howItWorksImprovements.stepWidths[0]}`);
        console.log(`  - Icon size: ${howItWorksImprovements.stepIconSizes[0]}`);
        console.log(`  - Title size: ${howItWorksImprovements.stepTitleSizes[0]}`);
        console.log(`  - Description size: ${howItWorksImprovements.stepDescriptionSizes[0]}`);
      }
    }
    
    console.log('✅ Overall Mobile Layout:');
    console.log(`  - Viewport: ${overallLayout.viewportWidth}x${overallLayout.viewportHeight}`);
    console.log(`  - Body font size: ${overallLayout.bodyFontSize}`);
    console.log(`  - No horizontal scroll: ${!overallLayout.hasHorizontalScroll}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testMobileFinalVerification();

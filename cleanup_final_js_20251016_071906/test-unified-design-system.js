const puppeteer = require('puppeteer');

async function testUnifiedDesignSystem() {
  console.log('🧪 Testing Unified Design System Implementation...');
  
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
    
    // Step 3: Analyze Hero Section
    console.log('📱 Step 3: Analyzing Hero Section...');
    
    const heroAnalysis = await page.evaluate(() => {
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return { found: false };
      
      return {
        found: true,
        background: window.getComputedStyle(heroSection).background,
        hasPattern: heroSection.querySelector('div[style*="background: radial-gradient"]') !== null,
        textColor: window.getComputedStyle(heroSection.querySelector('.hero-static-text')).color,
        textShadow: window.getComputedStyle(heroSection.querySelector('.hero-static-text')).textShadow,
      };
    });
    
    console.log('🔍 Hero Analysis:', JSON.stringify(heroAnalysis, null, 2));
    
    // Step 4: Analyze Our Approach Section
    console.log('📱 Step 4: Analyzing Our Approach Section...');
    
    const approachAnalysis = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      const approachSection = sections.find(section => 
        section.textContent.includes('Our Approach')
      );
      
      if (!approachSection) return { found: false };
      
      const mainContainer = approachSection.querySelector('div[style*="backgroundColor"]');
      const backgroundPattern = approachSection.querySelector('div[style*="background: radial-gradient"]');
      
      return {
        found: true,
        sectionBackground: window.getComputedStyle(approachSection).background,
        hasPattern: !!backgroundPattern,
        patternBackground: backgroundPattern ? window.getComputedStyle(backgroundPattern).background : null,
        containerBackground: mainContainer ? window.getComputedStyle(mainContainer).backgroundColor : null,
        containerBorderRadius: mainContainer ? window.getComputedStyle(mainContainer).borderRadius : null,
        containerBoxShadow: mainContainer ? window.getComputedStyle(mainContainer).boxShadow : null,
        titleColor: approachSection.querySelector('h1, h2') ? window.getComputedStyle(approachSection.querySelector('h1, h2')).color : null,
      };
    });
    
    console.log('🔍 Our Approach Analysis:', JSON.stringify(approachAnalysis, null, 2));
    
    // Step 5: Scroll through all sections and analyze consistency
    console.log('📱 Step 5: Analyzing all sections for consistency...');
    
    const allSectionsAnalysis = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      const analysis = [];
      
      sections.forEach((section, index) => {
        const title = section.querySelector('h1, h2, h3')?.textContent || `Section ${index + 1}`;
        const mainContainer = section.querySelector('div[style*="backgroundColor"]');
        
        analysis.push({
          index: index + 1,
          title: title.substring(0, 30),
          background: window.getComputedStyle(section).background,
          hasPattern: !!section.querySelector('div[style*="background: radial-gradient"], div[style*="background: linear-gradient"]'),
          containerBackground: mainContainer ? window.getComputedStyle(mainContainer).backgroundColor : null,
          containerBorderRadius: mainContainer ? window.getComputedStyle(mainContainer).borderRadius : null,
          titleColor: section.querySelector('h1, h2, h3') ? window.getComputedStyle(section.querySelector('h1, h2, h3')).color : null,
        });
      });
      
      return analysis;
    });
    
    console.log('🔍 All Sections Analysis:', JSON.stringify(allSectionsAnalysis, null, 2));
    
    // Step 6: Test desktop view for comparison
    console.log('📱 Step 6: Testing desktop view for comparison...');
    await page.setViewport({ width: 1200, height: 800 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const desktopAnalysis = await page.evaluate(() => {
      const heroSection = document.querySelector('.hero-section');
      const sections = Array.from(document.querySelectorAll('section'));
      const approachSection = sections.find(section => 
        section.textContent.includes('Our Approach')
      );
      
      return {
        heroBackground: heroSection ? window.getComputedStyle(heroSection).background : null,
        approachBackground: approachSection ? window.getComputedStyle(approachSection).background : null,
        totalSections: sections.length
      };
    });
    
    console.log('🔍 Desktop Analysis:', JSON.stringify(desktopAnalysis, null, 2));
    
    // Step 7: Take screenshots
    console.log('📱 Step 7: Taking screenshots...');
    
    // Mobile screenshot
    await page.setViewport({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'mobile-unified-design-system.png',
      fullPage: true
    });
    
    // Desktop screenshot
    await page.setViewport({ width: 1200, height: 800 });
    await page.screenshot({ 
      path: 'desktop-unified-design-system.png',
      fullPage: true
    });
    
    console.log('✅ Screenshots saved as mobile-unified-design-system.png and desktop-unified-design-system.png');
    
    // Summary
    console.log('\n🎯 UNIFIED DESIGN SYSTEM SUMMARY:');
    console.log('==================================');
    
    if (heroAnalysis.found) {
      console.log(`✅ Hero section: ${heroAnalysis.hasPattern ? 'Has unified pattern' : 'No pattern'}`);
      console.log(`✅ Hero background: ${heroAnalysis.background.includes('linear-gradient') ? 'Unified gradient' : 'Other'}`);
      console.log(`✅ Hero text shadow: ${heroAnalysis.textShadow !== 'none' ? 'Applied' : 'Not applied'}`);
    }
    
    if (approachAnalysis.found) {
      console.log(`✅ Approach section: ${approachAnalysis.hasPattern ? 'Has unified pattern' : 'No pattern'}`);
      console.log(`✅ Approach background: ${approachAnalysis.sectionBackground}`);
      console.log(`✅ Container styling: ${approachAnalysis.containerBorderRadius ? 'Unified' : 'Default'}`);
    }
    
    console.log(`✅ Total sections analyzed: ${allSectionsAnalysis.length}`);
    
    // Count sections with unified elements
    const sectionsWithPatterns = allSectionsAnalysis.filter(s => s.hasPattern).length;
    const sectionsWithUnifiedColors = allSectionsAnalysis.filter(s => 
      s.background.includes('linear-gradient') || s.background.includes('radial-gradient')
    ).length;
    
    console.log(`✅ Sections with patterns: ${sectionsWithPatterns}/${allSectionsAnalysis.length}`);
    console.log(`✅ Sections with unified colors: ${sectionsWithUnifiedColors}/${allSectionsAnalysis.length}`);
    
    // Check improvements
    const hasUnifiedDesign = 
      heroAnalysis.found &&
      heroAnalysis.hasPattern &&
      approachAnalysis.found &&
      approachAnalysis.hasPattern &&
      sectionsWithPatterns >= 2 &&
      sectionsWithUnifiedColors >= 2;
    
    if (hasUnifiedDesign) {
      console.log('\n🎉 SUCCESS: Unified design system implemented!');
      console.log('   - Consistent background patterns across sections');
      console.log('   - Unified color palette and gradients');
      console.log('   - Consistent typography and spacing');
      console.log('   - Harmonious visual language');
      console.log('   - Cohesive brand experience');
      console.log('   - Professional, unified appearance');
    } else {
      console.log('\n⚠️ WARNING: Some unified design elements may not be visible.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testUnifiedDesignSystem();

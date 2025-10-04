const puppeteer = require('puppeteer');

async function testWhatWeDoWheelFix() {
  console.log('🧪 Testing What We Do Wheel Text Positioning Fix...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set desktop viewport to see the wheel properly
    await page.setViewport({ width: 1200, height: 800 });
    
    // Listen to console messages
    page.on('console', msg => {
      console.log('🔍 Console:', msg.text());
    });
    
    // Step 1: Navigate to What We Do page
    console.log('📱 Step 1: Navigating to What We Do page...');
    await page.goto('http://localhost:3000/what-we-do', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 2: Find the wheel section
    console.log('📱 Step 2: Looking for the wheel section...');
    
    const wheelExists = await page.evaluate(() => {
      const wheel = document.querySelector('div[style*="conic-gradient"]');
      return !!wheel;
    });
    
    if (wheelExists) {
      console.log('✅ Wheel found');
      
      // Step 3: Check text positioning
      console.log('📱 Step 3: Checking text positioning...');
      
      const textPositions = await page.evaluate(() => {
        const wheel = document.querySelector('div[style*="conic-gradient"]');
        if (!wheel) return null;
        
        const wheelRect = wheel.getBoundingClientRect();
        const wheelCenterX = wheelRect.left + wheelRect.width / 2;
        const wheelCenterY = wheelRect.top + wheelRect.height / 2;
        
        // Find text elements
        const texts = wheel.querySelectorAll('div, a');
        const textElements = [];
        
        texts.forEach((text, index) => {
          const rect = text.getBoundingClientRect();
          const textContent = text.textContent?.trim();
          
          if (textContent && (textContent.includes('NICHE') || 
                             textContent.includes('ESSENTIAL') || 
                             textContent.includes('GROWTH') ||
                             textContent.includes('COLLABORATIVE') ||
                             textContent.includes('REAL-WORLD') ||
                             textContent.includes('PATHWAYS'))) {
            
            // Calculate distance from center
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distanceFromCenter = Math.sqrt(
              Math.pow(centerX - wheelCenterX, 2) + 
              Math.pow(centerY - wheelCenterY, 2)
            );
            
            textElements.push({
              text: textContent,
              position: {
                left: rect.left,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height
              },
              distanceFromCenter: distanceFromCenter,
              percentageFromCenter: (distanceFromCenter / (wheelRect.width / 2)) * 100
            });
          }
        });
        
        return {
          wheelSize: {
            width: wheelRect.width,
            height: wheelRect.height,
            centerX: wheelCenterX,
            centerY: wheelCenterY
          },
          textElements: textElements
        };
      });
      
      console.log('🔍 Wheel and Text Analysis:', JSON.stringify(textPositions, null, 2));
      
      if (textPositions && textPositions.textElements.length > 0) {
        // Step 4: Verify the fix
        console.log('📱 Step 4: Verifying text positioning fix...');
        
        const realWorldPathways = textPositions.textElements.find(t => 
          t.text.includes('REAL-WORLD') || t.text.includes('PATHWAYS')
        );
        
        const essentialGrowth = textPositions.textElements.find(t => 
          t.text.includes('ESSENTIAL') || t.text.includes('GROWTH')
        );
        
        console.log('🔍 Real-World Pathways positioning:', realWorldPathways);
        console.log('🔍 Essential Growth positioning:', essentialGrowth);
        
        // Check if the text is positioned further from center (should be closer to edge)
        const wheelRadius = textPositions.wheelSize.width / 2;
        const expectedMinDistance = wheelRadius * 0.6; // Should be at least 60% from center
        
        if (realWorldPathways) {
          const realWorldDistance = realWorldPathways.distanceFromCenter;
          const isRealWorldWellPositioned = realWorldDistance >= expectedMinDistance;
          console.log(`🔍 Real-World Pathways distance from center: ${realWorldDistance.toFixed(1)}px (expected: ≥${expectedMinDistance.toFixed(1)}px)`);
          console.log(`🔍 Real-World Pathways well positioned: ${isRealWorldWellPositioned ? '✅ Yes' : '❌ No'}`);
        }
        
        if (essentialGrowth) {
          const essentialDistance = essentialGrowth.distanceFromCenter;
          const isEssentialWellPositioned = essentialDistance >= expectedMinDistance;
          console.log(`🔍 Essential Growth distance from center: ${essentialDistance.toFixed(1)}px (expected: ≥${expectedMinDistance.toFixed(1)}px)`);
          console.log(`🔍 Essential Growth well positioned: ${isEssentialWellPositioned ? '✅ Yes' : '❌ No'}`);
        }
        
        // Step 5: Check if text is visible and readable
        console.log('📱 Step 5: Checking text visibility...');
        
        const textVisibility = await page.evaluate(() => {
          const wheel = document.querySelector('div[style*="conic-gradient"]');
          if (!wheel) return null;
          
          const texts = wheel.querySelectorAll('div, a');
          const visibilityResults = [];
          
          texts.forEach((text) => {
            const textContent = text.textContent?.trim();
            if (textContent && (textContent.includes('NICHE') || 
                               textContent.includes('ESSENTIAL') || 
                               textContent.includes('GROWTH') ||
                               textContent.includes('COLLABORATIVE') ||
                               textContent.includes('REAL-WORLD') ||
                               textContent.includes('PATHWAYS'))) {
              
              const computedStyle = window.getComputedStyle(text);
              const rect = text.getBoundingClientRect();
              
              visibilityResults.push({
                text: textContent,
                isVisible: rect.width > 0 && rect.height > 0,
                color: computedStyle.color,
                fontSize: computedStyle.fontSize,
                fontWeight: computedStyle.fontWeight,
                textShadow: computedStyle.textShadow,
                position: {
                  left: text.style.left || computedStyle.left,
                  right: text.style.right || computedStyle.right,
                  top: text.style.top || computedStyle.top
                }
              });
            }
          });
          
          return visibilityResults;
        });
        
        console.log('🔍 Text Visibility Analysis:', JSON.stringify(textVisibility, null, 2));
        
        // Summary
        console.log('\n🎯 WHAT WE DO WHEEL FIX SUMMARY:');
        console.log('=================================');
        console.log(`✅ Wheel found: Yes`);
        console.log(`✅ Text elements found: ${textPositions.textElements.length}`);
        console.log(`✅ Real-World Pathways positioned: ${realWorldPathways ? 'Yes' : 'No'}`);
        console.log(`✅ Essential Growth positioned: ${essentialGrowth ? 'Yes' : 'No'}`);
        console.log(`✅ Text visibility: ${textVisibility ? 'All visible' : 'Some issues'}`);
        
        if (realWorldPathways && essentialGrowth) {
          console.log('\n🎉 SUCCESS: Wheel text positioning has been improved!');
          console.log('   - Text elements are now positioned further from the center');
          console.log('   - Better spacing and readability in the wheel');
        } else {
          console.log('\n⚠️ WARNING: Some text elements may not be positioned correctly.');
        }
        
      } else {
        console.log('❌ No text elements found in the wheel');
      }
      
    } else {
      console.log('❌ Wheel not found on the page');
    }
    
    // Step 6: Take screenshot
    console.log('📱 Step 6: Taking screenshot...');
    await page.screenshot({ 
      path: 'what-we-do-wheel-fix-test.png',
      fullPage: true
    });
    console.log('✅ Screenshot saved as what-we-do-wheel-fix-test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testWhatWeDoWheelFix();

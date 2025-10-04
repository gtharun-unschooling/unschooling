const puppeteer = require('puppeteer');

async function testWhatWeDoDebug() {
  console.log('🧪 Debugging What We Do Page...');
  
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
    
    // Step 1: Navigate to What We Do page
    console.log('📱 Step 1: Navigating to What We Do page...');
    await page.goto('http://localhost:3000/what-we-do', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 2: Check page elements
    console.log('📱 Step 2: Checking page elements...');
    
    const pageAnalysis = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        h1Elements: Array.from(document.querySelectorAll('h1')).map(h1 => ({
          text: h1.textContent.trim(),
          styles: {
            fontSize: window.getComputedStyle(h1).fontSize,
            color: window.getComputedStyle(h1).color,
            background: window.getComputedStyle(h1.parentElement).background
          }
        })),
        buttons: Array.from(document.querySelectorAll('a, button')).map(btn => ({
          tagName: btn.tagName,
          text: btn.textContent.trim(),
          href: btn.href,
          className: btn.className,
          styles: {
            background: window.getComputedStyle(btn).background,
            borderRadius: window.getComputedStyle(btn).borderRadius,
            fontSize: window.getComputedStyle(btn).fontSize
          }
        })),
        sections: Array.from(document.querySelectorAll('div[style]')).filter(div => 
          div.style.background && div.style.background.includes('gradient')
        ).map(div => ({
          background: div.style.background,
          text: div.textContent.trim().substring(0, 100)
        }))
      };
    });
    
    console.log('🔍 Page Analysis:', JSON.stringify(pageAnalysis, null, 2));
    
    // Step 3: Look for the specific button
    console.log('📱 Step 3: Looking for the specific button...');
    
    const buttonSearch = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a'));
      const plansLinks = allLinks.filter(link => link.href.includes('/plans'));
      
      return {
        totalLinks: allLinks.length,
        plansLinks: plansLinks.length,
        plansLinkDetails: plansLinks.map(link => ({
          text: link.textContent.trim(),
          href: link.href,
          styles: {
            background: window.getComputedStyle(link).background,
            color: window.getComputedStyle(link).color,
            fontSize: window.getComputedStyle(link).fontSize,
            fontWeight: window.getComputedStyle(link).fontWeight,
            textTransform: window.getComputedStyle(link).textTransform,
            borderRadius: window.getComputedStyle(link).borderRadius,
            padding: window.getComputedStyle(link).padding,
            boxShadow: window.getComputedStyle(link).boxShadow
          },
          parentBackground: window.getComputedStyle(link.parentElement).background
        }))
      };
    });
    
    console.log('🔍 Button Search:', JSON.stringify(buttonSearch, null, 2));
    
    // Step 4: Check if there are any errors
    console.log('📱 Step 4: Checking for errors...');
    
    const errorCheck = await page.evaluate(() => {
      return {
        hasReactErrors: !!document.querySelector('[data-reactroot]'),
        consoleErrors: window.consoleErrors || [],
        bodyContent: document.body.textContent.substring(0, 500)
      };
    });
    
    console.log('🔍 Error Check:', JSON.stringify(errorCheck, null, 2));
    
    // Take screenshot
    await page.screenshot({ 
      path: 'what-we-do-debug.png',
      fullPage: true
    });
    console.log('✅ Screenshot saved as what-we-do-debug.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testWhatWeDoDebug();

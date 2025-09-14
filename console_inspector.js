const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function inspectConsole() {
  console.log('🔍 Starting console inspection...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--start-maximized',
      '--auto-open-devtools-for-tabs'
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to profile page
    console.log('📱 Navigating to profile page...');
    await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle0' });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot of initial page
    console.log('📸 Taking screenshot of initial page...');
    await page.screenshot({ 
      path: 'console_inspection_initial.png',
      fullPage: true 
    });
    
    // Open Developer Tools (if not already open)
    console.log('🔧 Opening Developer Tools...');
    await page.evaluate(() => {
      // Try to open dev tools
      if (window.chrome && window.chrome.webstore) {
        console.log('Chrome detected, attempting to open dev tools...');
      }
    });
    
    // Wait for dev tools to open
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot with dev tools
    console.log('📸 Taking screenshot with dev tools...');
    await page.screenshot({ 
      path: 'console_inspection_with_devtools.png',
      fullPage: true 
    });
    
    // Check if we can see any children
    console.log('👶 Checking for children...');
    const childrenInfo = await page.evaluate(() => {
      const childButtons = document.querySelectorAll('button');
      const childData = [];
      
      childButtons.forEach((btn, index) => {
        const style = window.getComputedStyle(btn);
        const text = btn.textContent;
        childData.push({
          index,
          text: text.substring(0, 50),
          backgroundColor: style.backgroundColor,
          isSelected: style.backgroundColor.includes('78, 205, 196') // Selected child color
        });
      });
      
      return childData;
    });
    
    console.log('🔍 Children found:', childrenInfo);
    
    // Try to select first child if available
    if (childrenInfo.length > 0) {
      console.log('👶 Attempting to select first child...');
      const childButton = await page.$('button');
      if (childButton) {
        await childButton.click();
        console.log('✅ Child button clicked');
        
        // Wait for selection
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Take screenshot after child selection
        console.log('📸 Taking screenshot after child selection...');
        await page.screenshot({ 
          path: 'console_inspection_child_selected.png',
          fullPage: true 
        });
      }
    }
    
    // Check console logs
    console.log('🔍 Setting up console log capture...');
    await page.evaluate(() => {
      window.capturedLogs = [];
      const originalLog = console.log;
      console.log = function(...args) {
        const logEntry = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        window.capturedLogs.push(logEntry);
        originalLog.apply(console, args);
      };
    });
    
    // Wait for any console activity
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get captured logs
    const logs = await page.evaluate(() => {
      return window.capturedLogs || [];
    });
    
    console.log('📝 Console logs captured:', logs.length);
    logs.forEach((log, index) => {
      console.log(`${index + 1}: ${log}`);
    });
    
    // Save logs to file
    fs.writeFileSync('console_logs.txt', logs.join('\n'));
    console.log('💾 Console logs saved to console_logs.txt');
    
    // Take final screenshot
    console.log('📸 Taking final screenshot...');
    await page.screenshot({ 
      path: 'console_inspection_final.png',
      fullPage: true 
    });
    
    console.log('✅ Console inspection completed!');
    console.log('📁 Screenshots saved:');
    console.log('  - console_inspection_initial.png');
    console.log('  - console_inspection_with_devtools.png');
    console.log('  - console_inspection_child_selected.png');
    console.log('  - console_inspection_final.png');
    console.log('📝 Console logs saved to console_logs.txt');
    
    // Keep browser open for manual inspection
    console.log('👀 Browser will stay open for manual inspection...');
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Console inspection failed:', error);
    await browser.close();
  }
}

// Run the console inspection
inspectConsole().catch(console.error);

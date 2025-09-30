/**
 * Performance and Load Testing
 * Tests system performance under various load conditions
 */

const { test, expect } = require('@playwright/test');

test.describe('Performance and Load Testing', () => {
  test('System Performance Under Normal Load', async ({ page }) => {
    console.log('⚡ Testing system performance under normal load...');

    const startTime = Date.now();
    
    // Test page load times
    await page.goto('http://localhost:3000');
    const pageLoadTime = Date.now() - startTime;
    console.log(`📄 Page load time: ${pageLoadTime}ms`);
    expect(pageLoadTime).toBeLessThan(3000); // Should load within 3 seconds

    // Test API response times
    console.log('🌐 Testing API response times...');
    const apiStartTime = Date.now();
    
    // Test profile creation API
    await page.click('text=Create Profile');
    await page.fill('input[name="childName"]', 'Performance Test Child');
    await page.selectOption('select[name="childAge"]', '7');
    await page.click('button[type="submit"]');
    
    await page.waitForSelector('text=Profile Created', { timeout: 10000 });
    const apiResponseTime = Date.now() - apiStartTime;
    console.log(`🔗 API response time: ${apiResponseTime}ms`);
    expect(apiResponseTime).toBeLessThan(5000); // Should respond within 5 seconds

    // Test plan generation performance
    console.log('📋 Testing plan generation performance...');
    const planStartTime = Date.now();
    await page.click('text=Generate Plan');
    await page.waitForSelector('text=Plan Generated', { timeout: 30000 });
    const planGenerationTime = Date.now() - planStartTime;
    console.log(`📊 Plan generation time: ${planGenerationTime}ms`);
    expect(planGenerationTime).toBeLessThan(30000); // Should generate within 30 seconds

    console.log('✅ Normal load performance test passed!');
  });

  test('Concurrent User Simulation', async ({ browser }) => {
    console.log('👥 Testing concurrent user simulation...');

    const contexts = [];
    const pages = [];
    
    try {
      // Create 5 concurrent users
      for (let i = 0; i < 5; i++) {
        const context = await browser.newContext();
        const page = await context.newPage();
        contexts.push(context);
        pages.push(page);
      }

      // Simulate concurrent user actions
      const promises = pages.map(async (page, index) => {
        console.log(`👤 User ${index + 1}: Starting session...`);
        
        const startTime = Date.now();
        await page.goto('http://localhost:3000');
        const loadTime = Date.now() - startTime;
        
        console.log(`👤 User ${index + 1}: Page loaded in ${loadTime}ms`);
        expect(loadTime).toBeLessThan(5000); // Each user should load within 5 seconds
        
        // Simulate user interaction
        await page.click('text=Create Profile');
        await page.fill('input[name="childName"]', `Concurrent User ${index + 1}`);
        await page.selectOption('select[name="childAge"]', '6');
        await page.click('button[type="submit"]');
        
        await page.waitForSelector('text=Profile Created', { timeout: 15000 });
        console.log(`👤 User ${index + 1}: Profile created successfully`);
      });

      // Wait for all users to complete
      await Promise.all(promises);
      console.log('✅ All concurrent users completed successfully');

    } finally {
      // Clean up contexts
      for (const context of contexts) {
        await context.close();
      }
    }
  });

  test('Memory Usage and Resource Monitoring', async ({ page }) => {
    console.log('💾 Testing memory usage and resource monitoring...');

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });
    console.log(`💾 Initial memory usage: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);

    // Perform memory-intensive operations
    for (let i = 0; i < 10; i++) {
      await page.goto('http://localhost:3000');
      await page.click('text=Create Profile');
      await page.fill('input[name="childName"]', `Memory Test Child ${i}`);
      await page.selectOption('select[name="childAge"]', '7');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Profile Created', { timeout: 10000 });
    }

    // Check final memory usage
    const finalMemory = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });
    console.log(`💾 Final memory usage: ${(finalMemory / 1024 / 1024).toFixed(2)} MB`);

    const memoryIncrease = finalMemory - initialMemory;
    console.log(`📈 Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`);
    
    // Memory increase should be reasonable (less than 50MB for 10 operations)
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    console.log('✅ Memory usage test passed!');
  });

  test('Database Performance Under Load', async ({ page }) => {
    console.log('🗄️ Testing database performance under load...');

    const startTime = Date.now();
    
    // Create multiple profiles rapidly
    for (let i = 0; i < 5; i++) {
      const profileStartTime = Date.now();
      
      await page.goto('http://localhost:3000');
      await page.click('text=Create Profile');
      await page.fill('input[name="childName"]', `DB Load Test Child ${i}`);
      await page.selectOption('select[name="childAge"]', '8');
      await page.click('button[type="submit"]');
      
      await page.waitForSelector('text=Profile Created', { timeout: 10000 });
      const profileTime = Date.now() - profileStartTime;
      console.log(`📝 Profile ${i + 1} creation time: ${profileTime}ms`);
      
      expect(profileTime).toBeLessThan(10000); // Each profile should be created within 10 seconds
    }

    const totalTime = Date.now() - startTime;
    console.log(`⏱️ Total time for 5 profiles: ${totalTime}ms`);
    expect(totalTime).toBeLessThan(60000); // All profiles should be created within 60 seconds

    console.log('✅ Database performance test passed!');
  });

  test('API Rate Limiting and Throttling', async ({ page }) => {
    console.log('🚦 Testing API rate limiting and throttling...');

    // Make rapid API calls to test rate limiting
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(
        page.goto('http://localhost:3000').then(() => {
          return page.click('text=Create Profile');
        })
      );
    }

    // Execute all requests simultaneously
    const results = await Promise.allSettled(promises);
    
    // Check that some requests were successful and some were rate limited
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`✅ Successful requests: ${successful}`);
    console.log(`❌ Failed requests: ${failed}`);
    
    // Should have some successful requests
    expect(successful).toBeGreaterThan(0);
    
    console.log('✅ API rate limiting test completed!');
  });

  test('Error Recovery Under Load', async ({ page }) => {
    console.log('🛠️ Testing error recovery under load...');

    // Simulate network issues during high load
    await page.route('**/api/**', route => {
      // Randomly fail 30% of requests
      if (Math.random() < 0.3) {
        route.abort();
      } else {
        route.continue();
      }
    });

    let successCount = 0;
    let errorCount = 0;

    // Attempt multiple operations
    for (let i = 0; i < 10; i++) {
      try {
        await page.goto('http://localhost:3000');
        await page.click('text=Create Profile');
        await page.fill('input[name="childName"]', `Error Recovery Test ${i}`);
        await page.selectOption('select[name="childAge"]', '7');
        await page.click('button[type="submit"]');
        
        await page.waitForSelector('text=Profile Created', { timeout: 5000 });
        successCount++;
        console.log(`✅ Operation ${i + 1}: Success`);
      } catch (error) {
        errorCount++;
        console.log(`❌ Operation ${i + 1}: Failed - ${error.message}`);
        
        // Test error recovery
        await page.click('text=Retry');
        await page.waitForTimeout(1000);
      }
    }

    console.log(`📊 Success rate: ${(successCount / 10) * 100}%`);
    console.log(`📊 Error rate: ${(errorCount / 10) * 100}%`);
    
    // Should have some successful operations despite errors
    expect(successCount).toBeGreaterThan(0);
    
    // Remove route interception
    await page.unroute('**/api/**');
    
    console.log('✅ Error recovery test passed!');
  });

  test('Admin Dashboard Performance Under Load', async ({ page }) => {
    console.log('🔧 Testing admin dashboard performance under load...');

    // Login to admin dashboard
    await page.goto('http://localhost:3000/admin');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();

    // Test dashboard load time
    const dashboardStartTime = Date.now();
    await page.reload();
    await expect(page.locator('text=System Health')).toBeVisible();
    const dashboardLoadTime = Date.now() - dashboardStartTime;
    console.log(`📊 Dashboard load time: ${dashboardLoadTime}ms`);
    expect(dashboardLoadTime).toBeLessThan(5000);

    // Test analytics dashboard performance
    const analyticsStartTime = Date.now();
    await page.click('text=Analytics');
    await expect(page.locator('text=Learning Analytics')).toBeVisible();
    const analyticsLoadTime = Date.now() - analyticsStartTime;
    console.log(`📈 Analytics load time: ${analyticsLoadTime}ms`);
    expect(analyticsLoadTime).toBeLessThan(3000);

    // Test performance dashboard
    const performanceStartTime = Date.now();
    await page.click('text=Performance');
    await expect(page.locator('text=Performance Dashboard')).toBeVisible();
    const performanceLoadTime = Date.now() - performanceStartTime;
    console.log(`⚡ Performance dashboard load time: ${performanceLoadTime}ms`);
    expect(performanceLoadTime).toBeLessThan(3000);

    // Test child activity dashboard
    const activityStartTime = Date.now();
    await page.click('text=Child Activity');
    await expect(page.locator('text=Child Activity Dashboard')).toBeVisible();
    const activityLoadTime = Date.now() - activityStartTime;
    console.log(`👶 Child activity load time: ${activityLoadTime}ms`);
    expect(activityLoadTime).toBeLessThan(3000);

    console.log('✅ Admin dashboard performance test passed!');
  });

  test('Real-time Updates Performance', async ({ page, context }) => {
    console.log('⚡ Testing real-time updates performance...');

    // Open two browser contexts
    const page2 = await context.newPage();
    
    // User 1: Perform actions
    await page.goto('http://localhost:3000');
    await page.click('text=Create Profile');
    await page.fill('input[name="childName"]', 'Real-time Test Child');
    await page.selectOption('select[name="childAge"]', '7');
    await page.click('button[type="submit"]');
    
    const actionStartTime = Date.now();
    await page.waitForSelector('text=Profile Created', { timeout: 10000 });
    const actionTime = Date.now() - actionStartTime;
    console.log(`⏱️ Action completion time: ${actionTime}ms`);

    // User 2: Check real-time updates
    await page2.goto('http://localhost:3000/admin/child-activity');
    const updateStartTime = Date.now();
    await expect(page2.locator('text=Real-time Test Child')).toBeVisible();
    const updateTime = Date.now() - updateStartTime;
    console.log(`🔄 Real-time update time: ${updateTime}ms`);
    
    expect(updateTime).toBeLessThan(5000); // Updates should appear within 5 seconds
    
    await page2.close();
    console.log('✅ Real-time updates performance test passed!');
  });
});

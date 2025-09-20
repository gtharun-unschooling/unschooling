/**
 * End-to-End User Journey Integration Tests
 * Tests complete user flows from registration to learning completion
 */

const { test, expect } = require('@playwright/test');

test.describe('Complete User Journey Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
  });

  test('Complete User Registration to Learning Journey', async ({ page }) => {
    console.log('🚀 Starting complete user journey test...');

    // Step 1: User Registration
    console.log('📝 Step 1: User Registration');
    await page.click('text=Sign Up');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    
    // Wait for registration completion
    await expect(page.locator('text=Welcome')).toBeVisible();
    console.log('✅ User registration completed');

    // Step 2: Profile Creation
    console.log('👤 Step 2: Profile Creation');
    await page.click('text=Create Profile');
    await page.fill('input[name="childName"]', 'Test Child');
    await page.selectOption('select[name="childAge"]', '7');
    await page.check('input[value="science"]');
    await page.check('input[value="art"]');
    await page.selectOption('select[name="learningStyle"]', 'visual');
    await page.click('button[type="submit"]');
    
    // Wait for profile creation
    await expect(page.locator('text=Profile Created')).toBeVisible();
    console.log('✅ Child profile created');

    // Step 3: Plan Generation
    console.log('📋 Step 3: Plan Generation');
    await page.click('text=Generate Plan');
    await page.waitForSelector('text=Plan Generated', { timeout: 30000 });
    await expect(page.locator('text=Weekly Plan')).toBeVisible();
    console.log('✅ Learning plan generated');

    // Step 4: Progress Tracking
    console.log('📊 Step 4: Progress Tracking');
    await page.click('text=Start Activity');
    await page.waitForTimeout(2000); // Simulate activity completion
    await page.click('text=Mark Complete');
    await expect(page.locator('text=Progress Updated')).toBeVisible();
    console.log('✅ Progress tracking working');

    // Step 5: Gamification
    console.log('🏆 Step 5: Gamification');
    await expect(page.locator('text=Achievement Unlocked')).toBeVisible();
    await expect(page.locator('text=Points Earned')).toBeVisible();
    console.log('✅ Gamification system working');

    // Step 6: Analytics Dashboard
    console.log('📈 Step 6: Analytics Dashboard');
    await page.click('text=View Progress');
    await expect(page.locator('text=Learning Analytics')).toBeVisible();
    await expect(page.locator('text=Progress Chart')).toBeVisible();
    console.log('✅ Analytics dashboard accessible');

    console.log('🎉 Complete user journey test passed!');
  });

  test('Admin Dashboard Integration Test', async ({ page }) => {
    console.log('🔧 Starting admin dashboard integration test...');

    // Admin Login
    console.log('🔐 Admin Login');
    await page.goto('http://localhost:3000/admin');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    console.log('✅ Admin login successful');

    // Test Analytics Integration
    console.log('📊 Testing Analytics Integration');
    await page.click('text=Analytics');
    await expect(page.locator('text=Learning Outcomes')).toBeVisible();
    await expect(page.locator('text=User Engagement')).toBeVisible();
    await expect(page.locator('text=Business Metrics')).toBeVisible();
    console.log('✅ Analytics integration working');

    // Test Performance Monitoring
    console.log('⚡ Testing Performance Monitoring');
    await page.click('text=Performance');
    await expect(page.locator('text=System Metrics')).toBeVisible();
    await expect(page.locator('text=Scalability Metrics')).toBeVisible();
    console.log('✅ Performance monitoring working');

    // Test Security Dashboard
    console.log('🔒 Testing Security Dashboard');
    await page.click('text=Security');
    await expect(page.locator('text=Data Encryption')).toBeVisible();
    await expect(page.locator('text=Access Control')).toBeVisible();
    console.log('✅ Security dashboard working');

    // Test Compliance Dashboard
    console.log('📋 Testing Compliance Dashboard');
    await page.click('text=Compliance');
    await expect(page.locator('text=Privacy Management')).toBeVisible();
    await expect(page.locator('text=Data Governance')).toBeVisible();
    console.log('✅ Compliance dashboard working');

    console.log('🎉 Admin dashboard integration test passed!');
  });

  test('Real-time Features Integration Test', async ({ page, context }) => {
    console.log('⚡ Starting real-time features integration test...');

    // Open two browser contexts to simulate multiple users
    const page2 = await context.newPage();
    
    // User 1: Create activity
    console.log('👤 User 1: Creating activity');
    await page.goto('http://localhost:3000');
    await page.click('text=Start Activity');
    await page.fill('textarea[name="activityNotes"]', 'Working on science experiment');
    await page.click('text=Save Progress');

    // User 2: Check real-time updates
    console.log('👤 User 2: Checking real-time updates');
    await page2.goto('http://localhost:3000/admin/child-activity');
    await expect(page2.locator('text=Working on science experiment')).toBeVisible();
    console.log('✅ Real-time updates working');

    // Test real-time analytics
    console.log('📊 Testing real-time analytics');
    await page.click('text=Complete Activity');
    await page2.reload();
    await expect(page2.locator('text=Activity Completed')).toBeVisible();
    console.log('✅ Real-time analytics working');

    await page2.close();
    console.log('🎉 Real-time features integration test passed!');
  });

  test('Cross-Feature Data Flow Test', async ({ page }) => {
    console.log('🔄 Starting cross-feature data flow test...');

    // Test data flow from profile to analytics
    console.log('📊 Testing profile to analytics data flow');
    await page.goto('http://localhost:3000');
    
    // Create profile with specific interests
    await page.click('text=Create Profile');
    await page.fill('input[name="childName"]', 'Data Flow Test Child');
    await page.selectOption('select[name="childAge"]', '8');
    await page.check('input[value="mathematics"]');
    await page.check('input[value="coding"]');
    await page.click('button[type="submit"]');

    // Generate plan
    await page.click('text=Generate Plan');
    await page.waitForSelector('text=Plan Generated', { timeout: 30000 });

    // Check analytics dashboard
    await page.goto('http://localhost:3000/admin/analytics');
    await expect(page.locator('text=Mathematics')).toBeVisible();
    await expect(page.locator('text=Coding')).toBeVisible();
    console.log('✅ Profile to analytics data flow working');

    // Test gamification integration
    console.log('🏆 Testing gamification integration');
    await page.goto('http://localhost:3000');
    await page.click('text=Start Activity');
    await page.waitForTimeout(1000);
    await page.click('text=Mark Complete');
    
    // Check gamification dashboard
    await page.goto('http://localhost:3000/admin/gamification');
    await expect(page.locator('text=Data Flow Test Child')).toBeVisible();
    await expect(page.locator('text=Points Earned')).toBeVisible();
    console.log('✅ Gamification integration working');

    console.log('🎉 Cross-feature data flow test passed!');
  });

  test('Error Handling and Recovery Test', async ({ page }) => {
    console.log('🛠️ Starting error handling and recovery test...');

    // Test network failure recovery
    console.log('🌐 Testing network failure recovery');
    await page.goto('http://localhost:3000');
    
    // Simulate network failure
    await page.route('**/api/**', route => route.abort());
    await page.click('text=Generate Plan');
    
    // Check error message
    await expect(page.locator('text=Network Error')).toBeVisible();
    await expect(page.locator('text=Retry')).toBeVisible();
    console.log('✅ Network error handling working');

    // Test recovery
    await page.unroute('**/api/**');
    await page.click('text=Retry');
    await page.waitForSelector('text=Plan Generated', { timeout: 30000 });
    console.log('✅ Network recovery working');

    // Test data validation
    console.log('✅ Testing data validation');
    await page.click('text=Create Profile');
    await page.fill('input[name="childName"]', ''); // Empty name
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Name is required')).toBeVisible();
    console.log('✅ Data validation working');

    console.log('🎉 Error handling and recovery test passed!');
  });
});

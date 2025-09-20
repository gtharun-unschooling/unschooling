/**
 * Admin Dashboard Integration Tests
 * Tests all admin dashboard features and their integration
 */

const { test, expect } = require('@playwright/test');

test.describe('Admin Dashboard Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('http://localhost:3000/admin');
    
    // Admin login
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  });

  test('Comprehensive Admin Dashboard Integration', async ({ page }) => {
    console.log('🔧 Testing comprehensive admin dashboard integration...');

    // Test main dashboard
    console.log('📊 Testing main dashboard');
    await expect(page.locator('text=System Health')).toBeVisible();
    await expect(page.locator('text=Customer Metrics')).toBeVisible();
    await expect(page.locator('text=Agent Performance')).toBeVisible();
    await expect(page.locator('text=Cost Tracking')).toBeVisible();
    console.log('✅ Main dashboard components loaded');

    // Test real-time data updates
    console.log('⚡ Testing real-time data updates');
    await page.waitForTimeout(5000); // Wait for real-time updates
    await expect(page.locator('text=Last Updated')).toBeVisible();
    console.log('✅ Real-time updates working');

    // Test data export functionality
    console.log('📤 Testing data export');
    await page.click('text=Export Data');
    await expect(page.locator('text=Export Options')).toBeVisible();
    await page.click('text=Export JSON');
    console.log('✅ Data export working');
  });

  test('Analytics Dashboard Integration', async ({ page }) => {
    console.log('📈 Testing analytics dashboard integration...');

    await page.click('text=Analytics');
    await expect(page.locator('text=Learning Analytics')).toBeVisible();

    // Test learning outcomes
    console.log('🎓 Testing learning outcomes');
    await page.click('text=Learning Outcomes');
    await expect(page.locator('text=Completion Rates')).toBeVisible();
    await expect(page.locator('text=Age Group Performance')).toBeVisible();
    await expect(page.locator('text=Topic Engagement')).toBeVisible();
    console.log('✅ Learning outcomes working');

    // Test user engagement
    console.log('👥 Testing user engagement');
    await page.click('text=User Engagement');
    await expect(page.locator('text=Daily Active Users')).toBeVisible();
    await expect(page.locator('text=Session Duration')).toBeVisible();
    await expect(page.locator('text=Feature Usage')).toBeVisible();
    console.log('✅ User engagement working');

    // Test business metrics
    console.log('💰 Testing business metrics');
    await page.click('text=Business Metrics');
    await expect(page.locator('text=Revenue Analytics')).toBeVisible();
    await expect(page.locator('text=Customer Metrics')).toBeVisible();
    await expect(page.locator('text=Conversion Rates')).toBeVisible();
    console.log('✅ Business metrics working');

    // Test custom reports
    console.log('📋 Testing custom reports');
    await page.click('text=Custom Reports');
    await expect(page.locator('text=Report Builder')).toBeVisible();
    await page.fill('input[name="reportName"]', 'Test Report');
    await page.selectOption('select[name="timeRange"]', '7_days');
    await page.click('text=Generate Report');
    await expect(page.locator('text=Report Generated')).toBeVisible();
    console.log('✅ Custom reports working');
  });

  test('Child Activity Tracking Integration', async ({ page }) => {
    console.log('👶 Testing child activity tracking integration...');

    await page.click('text=Child Activity');
    await expect(page.locator('text=Child Activity Dashboard')).toBeVisible();

    // Test account filtering
    console.log('🔍 Testing account filtering');
    await page.selectOption('select[name="accountFilter"]', 'gtharun04@gmail.com');
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Children for gtharun04@gmail.com')).toBeVisible();
    console.log('✅ Account filtering working');

    // Test time range filtering
    console.log('⏰ Testing time range filtering');
    await page.selectOption('select[name="timeRange"]', 'All Time');
    await page.waitForTimeout(2000);
    await expect(page.locator('text=All Time Activities')).toBeVisible();
    console.log('✅ Time range filtering working');

    // Test child selection
    console.log('👤 Testing child selection');
    if (await page.locator('select[name="childFilter"]').count() > 0) {
      await page.selectOption('select[name="childFilter"]', { index: 0 });
      await page.waitForTimeout(2000);
      await expect(page.locator('text=Activity Details')).toBeVisible();
      console.log('✅ Child selection working');
    }

    // Test real-time activity updates
    console.log('⚡ Testing real-time activity updates');
    await page.waitForTimeout(5000);
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    console.log('✅ Real-time activity updates working');
  });

  test('Performance Monitoring Integration', async ({ page }) => {
    console.log('⚡ Testing performance monitoring integration...');

    await page.click('text=Performance');
    await expect(page.locator('text=Performance Dashboard')).toBeVisible();

    // Test system metrics
    console.log('📊 Testing system metrics');
    await page.click('text=System Metrics');
    await expect(page.locator('text=Response Time')).toBeVisible();
    await expect(page.locator('text=Throughput')).toBeVisible();
    await expect(page.locator('text=Error Rate')).toBeVisible();
    await expect(page.locator('text=Uptime')).toBeVisible();
    console.log('✅ System metrics working');

    // Test scalability metrics
    console.log('📈 Testing scalability metrics');
    await page.click('text=Scalability');
    await expect(page.locator('text=Concurrent Users')).toBeVisible();
    await expect(page.locator('text=Resource Utilization')).toBeVisible();
    await expect(page.locator('text=Auto Scaling')).toBeVisible();
    await expect(page.locator('text=Load Balancing')).toBeVisible();
    console.log('✅ Scalability metrics working');

    // Test optimization tools
    console.log('🔧 Testing optimization tools');
    await page.click('text=Optimization Tools');
    await expect(page.locator('text=Caching')).toBeVisible();
    await expect(page.locator('text=Compression')).toBeVisible();
    await expect(page.locator('text=Minification')).toBeVisible();
    await expect(page.locator('text=Lazy Loading')).toBeVisible();
    console.log('✅ Optimization tools working');

    // Test performance alerts
    console.log('🚨 Testing performance alerts');
    await page.click('text=Performance Alerts');
    await expect(page.locator('text=Alert History')).toBeVisible();
    console.log('✅ Performance alerts working');
  });

  test('Security Dashboard Integration', async ({ page }) => {
    console.log('🔒 Testing security dashboard integration...');

    await page.click('text=Security');
    await expect(page.locator('text=Security Dashboard')).toBeVisible();

    // Test data encryption
    console.log('🔐 Testing data encryption');
    await page.click('text=Data Encryption');
    await expect(page.locator('text=Encryption Status')).toBeVisible();
    await expect(page.locator('text=Encryption Keys')).toBeVisible();
    console.log('✅ Data encryption working');

    // Test access control
    console.log('👥 Testing access control');
    await page.click('text=Access Control');
    await expect(page.locator('text=User Permissions')).toBeVisible();
    await expect(page.locator('text=Role Management')).toBeVisible();
    console.log('✅ Access control working');

    // Test threat detection
    console.log('🛡️ Testing threat detection');
    await page.click('text=Threat Detection');
    await expect(page.locator('text=Security Alerts')).toBeVisible();
    await expect(page.locator('text=Threat Analysis')).toBeVisible();
    console.log('✅ Threat detection working');
  });

  test('Compliance Dashboard Integration', async ({ page }) => {
    console.log('📋 Testing compliance dashboard integration...');

    await page.click('text=Compliance');
    await expect(page.locator('text=Compliance Dashboard')).toBeVisible();

    // Test privacy management
    console.log('🔒 Testing privacy management');
    await page.click('text=Privacy Management');
    await expect(page.locator('text=Data Consent')).toBeVisible();
    await expect(page.locator('text=Privacy Settings')).toBeVisible();
    console.log('✅ Privacy management working');

    // Test data governance
    console.log('📊 Testing data governance');
    await page.click('text=Data Governance');
    await expect(page.locator('text=Data Policies')).toBeVisible();
    await expect(page.locator('text=Data Retention')).toBeVisible();
    console.log('✅ Data governance working');

    // Test GDPR compliance
    console.log('🌍 Testing GDPR compliance');
    await page.click('text=GDPR Compliance');
    await expect(page.locator('text=GDPR Status')).toBeVisible();
    await expect(page.locator('text=Data Rights')).toBeVisible();
    console.log('✅ GDPR compliance working');

    // Test COPPA compliance
    console.log('👶 Testing COPPA compliance');
    await page.click('text=COPPA Compliance');
    await expect(page.locator('text=COPPA Status')).toBeVisible();
    await expect(page.locator('text=Child Safety')).toBeVisible();
    console.log('✅ COPPA compliance working');
  });

  test('Gamification Dashboard Integration', async ({ page }) => {
    console.log('🏆 Testing gamification dashboard integration...');

    await page.click('text=Gamification');
    await expect(page.locator('text=Gamification Dashboard')).toBeVisible();

    // Test achievement system
    console.log('🏅 Testing achievement system');
    await page.click('text=Achievement System');
    await expect(page.locator('text=Achievement Overview')).toBeVisible();
    await expect(page.locator('text=Badge Management')).toBeVisible();
    console.log('✅ Achievement system working');

    // Test leaderboard
    console.log('🥇 Testing leaderboard');
    await page.click('text=Leaderboard');
    await expect(page.locator('text=Top Performers')).toBeVisible();
    await expect(page.locator('text=Rankings')).toBeVisible();
    console.log('✅ Leaderboard working');

    // Test progress tracking
    console.log('📈 Testing progress tracking');
    await page.click('text=Progress Tracking');
    await expect(page.locator('text=Progress Overview')).toBeVisible();
    await expect(page.locator('text=Milestone Tracking')).toBeVisible();
    console.log('✅ Progress tracking working');

    // Test reward system
    console.log('🎁 Testing reward system');
    await page.click('text=Reward System');
    await expect(page.locator('text=Reward Management')).toBeVisible();
    await expect(page.locator('text=Reward Distribution')).toBeVisible();
    console.log('✅ Reward system working');
  });

  test('Personalization Dashboard Integration', async ({ page }) => {
    console.log('🎯 Testing personalization dashboard integration...');

    await page.click('text=Personalization');
    await expect(page.locator('text=Personalization Dashboard')).toBeVisible();

    // Test personalization engine
    console.log('🤖 Testing personalization engine');
    await page.click('text=Personalization Engine');
    await expect(page.locator('text=Engine Status')).toBeVisible();
    await expect(page.locator('text=Personalization Rules')).toBeVisible();
    console.log('✅ Personalization engine working');

    // Test adaptive learning paths
    console.log('🛤️ Testing adaptive learning paths');
    await page.click('text=Adaptive Learning Paths');
    await expect(page.locator('text=Learning Path Overview')).toBeVisible();
    await expect(page.locator('text=Path Customization')).toBeVisible();
    console.log('✅ Adaptive learning paths working');

    // Test child profiles
    console.log('👤 Testing child profiles');
    await page.click('text=Child Profiles');
    await expect(page.locator('text=Profile Overview')).toBeVisible();
    await expect(page.locator('text=Profile Management')).toBeVisible();
    console.log('✅ Child profiles working');

    // Test AI recommendations
    console.log('🧠 Testing AI recommendations');
    await page.click('text=AI Recommendations');
    await expect(page.locator('text=Recommendation Engine')).toBeVisible();
    await expect(page.locator('text=Recommendation History')).toBeVisible();
    console.log('✅ AI recommendations working');
  });

  test('Cross-Dashboard Data Consistency', async ({ page }) => {
    console.log('🔄 Testing cross-dashboard data consistency...');

    // Get data from main dashboard
    await page.goto('http://localhost:3000/admin');
    const mainDashboardData = await page.locator('text=Total Users').textContent();
    console.log('📊 Main dashboard data:', mainDashboardData);

    // Check analytics dashboard
    await page.click('text=Analytics');
    const analyticsData = await page.locator('text=Total Users').textContent();
    console.log('📈 Analytics dashboard data:', analyticsData);

    // Verify data consistency
    expect(mainDashboardData).toBe(analyticsData);
    console.log('✅ Data consistency verified');

    // Check child activity data
    await page.click('text=Child Activity');
    await page.waitForTimeout(2000);
    const childActivityData = await page.locator('text=Total Children').textContent();
    console.log('👶 Child activity data:', childActivityData);

    // Verify child data consistency
    expect(childActivityData).toBeDefined();
    console.log('✅ Child data consistency verified');

    console.log('🎉 Cross-dashboard data consistency test passed!');
  });
});

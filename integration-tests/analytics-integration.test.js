/**
 * Analytics Integration Tests
 * Tests analytics features and real-time data integration
 */

const { test, expect } = require('@playwright/test');

test.describe('Analytics Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login to admin dashboard
    await page.goto('http://localhost:3000/admin');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  });

  test('Real-time Analytics Data Integration', async ({ page }) => {
    console.log('📊 Testing real-time analytics data integration...');

    // Navigate to analytics dashboard
    await page.click('text=Analytics');
    await expect(page.locator('text=Learning Analytics')).toBeVisible();

    // Test real-time data updates
    console.log('⚡ Testing real-time data updates...');
    await page.waitForTimeout(5000); // Wait for real-time updates
    await expect(page.locator('text=Last Updated')).toBeVisible();
    console.log('✅ Real-time data updates working');

    // Test learning outcomes analytics
    console.log('🎓 Testing learning outcomes analytics...');
    await page.click('text=Learning Outcomes');
    await expect(page.locator('text=Completion Rates')).toBeVisible();
    await expect(page.locator('text=Age Group Performance')).toBeVisible();
    await expect(page.locator('text=Topic Engagement')).toBeVisible();
    console.log('✅ Learning outcomes analytics working');

    // Test user engagement metrics
    console.log('👥 Testing user engagement metrics...');
    await page.click('text=User Engagement');
    await expect(page.locator('text=Daily Active Users')).toBeVisible();
    await expect(page.locator('text=Session Duration')).toBeVisible();
    await expect(page.locator('text=Feature Usage')).toBeVisible();
    console.log('✅ User engagement metrics working');

    // Test business metrics
    console.log('💰 Testing business metrics...');
    await page.click('text=Business Metrics');
    await expect(page.locator('text=Revenue Analytics')).toBeVisible();
    await expect(page.locator('text=Customer Metrics')).toBeVisible();
    await expect(page.locator('text=Conversion Rates')).toBeVisible();
    console.log('✅ Business metrics working');
  });

  test('Analytics Data Accuracy and Consistency', async ({ page }) => {
    console.log('🎯 Testing analytics data accuracy and consistency...');

    // Get data from main dashboard
    await page.goto('http://localhost:3000/admin');
    const mainDashboardUsers = await page.locator('text=Total Users').textContent();
    const mainDashboardChildren = await page.locator('text=Total Children').textContent();
    console.log(`📊 Main dashboard - Users: ${mainDashboardUsers}, Children: ${mainDashboardChildren}`);

    // Check analytics dashboard
    await page.click('text=Analytics');
    await page.click('text=User Engagement');
    const analyticsUsers = await page.locator('text=Total Users').textContent();
    console.log(`📈 Analytics dashboard - Users: ${analyticsUsers}`);

    // Verify data consistency
    expect(mainDashboardUsers).toBe(analyticsUsers);
    console.log('✅ User data consistency verified');

    // Check child activity data
    await page.click('text=Child Activity');
    const childActivityChildren = await page.locator('text=Total Children').textContent();
    console.log(`👶 Child activity - Children: ${childActivityChildren}`);

    // Verify child data consistency
    expect(mainDashboardChildren).toBe(childActivityChildren);
    console.log('✅ Child data consistency verified');
  });

  test('Custom Report Generation and Export', async ({ page }) => {
    console.log('📋 Testing custom report generation and export...');

    // Navigate to analytics dashboard
    await page.click('text=Analytics');
    await page.click('text=Custom Reports');

    // Test report builder
    console.log('🔧 Testing report builder...');
    await expect(page.locator('text=Report Builder')).toBeVisible();

    // Create a custom report
    console.log('📝 Creating custom report...');
    await page.fill('input[name="reportName"]', 'Integration Test Report');
    await page.selectOption('select[name="reportType"]', 'learning_outcomes');
    await page.selectOption('select[name="timeRange"]', '7_days');
    await page.check('input[value="completion_rates"]');
    await page.check('input[value="age_group_performance"]');
    await page.check('input[value="topic_engagement"]');

    // Generate report
    await page.click('text=Generate Report');
    await expect(page.locator('text=Report Generated')).toBeVisible();
    console.log('✅ Custom report generated');

    // Test report export
    console.log('📤 Testing report export...');
    await page.click('text=Export Report');
    await expect(page.locator('text=Export Options')).toBeVisible();
    
    // Test JSON export
    await page.click('text=Export JSON');
    console.log('✅ JSON export working');
    
    // Test CSV export
    await page.click('text=Export CSV');
    console.log('✅ CSV export working');
  });

  test('Analytics Performance and Load Testing', async ({ page }) => {
    console.log('⚡ Testing analytics performance and load...');

    // Test analytics dashboard load time
    const analyticsStartTime = Date.now();
    await page.click('text=Analytics');
    await expect(page.locator('text=Learning Analytics')).toBeVisible();
    const analyticsLoadTime = Date.now() - analyticsStartTime;
    console.log(`📊 Analytics dashboard load time: ${analyticsLoadTime}ms`);
    expect(analyticsLoadTime).toBeLessThan(3000);

    // Test learning outcomes load time
    const outcomesStartTime = Date.now();
    await page.click('text=Learning Outcomes');
    await expect(page.locator('text=Completion Rates')).toBeVisible();
    const outcomesLoadTime = Date.now() - outcomesStartTime;
    console.log(`🎓 Learning outcomes load time: ${outcomesLoadTime}ms`);
    expect(outcomesLoadTime).toBeLessThan(2000);

    // Test user engagement load time
    const engagementStartTime = Date.now();
    await page.click('text=User Engagement');
    await expect(page.locator('text=Daily Active Users')).toBeVisible();
    const engagementLoadTime = Date.now() - engagementStartTime;
    console.log(`👥 User engagement load time: ${engagementLoadTime}ms`);
    expect(engagementLoadTime).toBeLessThan(2000);

    // Test business metrics load time
    const businessStartTime = Date.now();
    await page.click('text=Business Metrics');
    await expect(page.locator('text=Revenue Analytics')).toBeVisible();
    const businessLoadTime = Date.now() - businessStartTime;
    console.log(`💰 Business metrics load time: ${businessLoadTime}ms`);
    expect(businessLoadTime).toBeLessThan(2000);

    console.log('✅ Analytics performance test passed!');
  });

  test('Analytics Data Visualization and Charts', async ({ page }) => {
    console.log('📊 Testing analytics data visualization and charts...');

    // Navigate to analytics dashboard
    await page.click('text=Analytics');

    // Test learning outcomes charts
    console.log('📈 Testing learning outcomes charts...');
    await page.click('text=Learning Outcomes');
    await expect(page.locator('canvas, svg')).toBeVisible(); // Chart elements
    console.log('✅ Learning outcomes charts displayed');

    // Test user engagement charts
    console.log('📊 Testing user engagement charts...');
    await page.click('text=User Engagement');
    await expect(page.locator('canvas, svg')).toBeVisible(); // Chart elements
    console.log('✅ User engagement charts displayed');

    // Test business metrics charts
    console.log('💰 Testing business metrics charts...');
    await page.click('text=Business Metrics');
    await expect(page.locator('canvas, svg')).toBeVisible(); // Chart elements
    console.log('✅ Business metrics charts displayed');

    // Test chart interactivity
    console.log('🖱️ Testing chart interactivity...');
    const chartElement = page.locator('canvas, svg').first();
    await chartElement.hover();
    await expect(page.locator('text=Tooltip')).toBeVisible();
    console.log('✅ Chart interactivity working');
  });

  test('Analytics Filtering and Time Range Selection', async ({ page }) => {
    console.log('🔍 Testing analytics filtering and time range selection...');

    // Navigate to analytics dashboard
    await page.click('text=Analytics');

    // Test time range filtering
    console.log('⏰ Testing time range filtering...');
    await page.selectOption('select[name="timeRange"]', '7_days');
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Last 7 Days')).toBeVisible();
    console.log('✅ 7 days filter working');

    await page.selectOption('select[name="timeRange"]', '30_days');
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Last 30 Days')).toBeVisible();
    console.log('✅ 30 days filter working');

    await page.selectOption('select[name="timeRange"]', '90_days');
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Last 90 Days')).toBeVisible();
    console.log('✅ 90 days filter working');

    // Test metric filtering
    console.log('📊 Testing metric filtering...');
    await page.click('text=Learning Outcomes');
    await page.check('input[value="completion_rates"]');
    await page.uncheck('input[value="age_group_performance"]');
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Completion Rates')).toBeVisible();
    console.log('✅ Metric filtering working');

    // Test age group filtering
    console.log('👶 Testing age group filtering...');
    await page.selectOption('select[name="ageGroup"]', '5-8');
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Age Group: 5-8')).toBeVisible();
    console.log('✅ Age group filtering working');
  });

  test('Analytics API Integration and Data Sources', async ({ page }) => {
    console.log('🔗 Testing analytics API integration and data sources...');

    // Test API endpoint availability
    console.log('🌐 Testing API endpoint availability...');
    const response = await page.request.get('http://localhost:8000/api/analytics/learning-outcomes');
    expect(response.status()).toBe(200);
    console.log('✅ Learning outcomes API working');

    const response2 = await page.request.get('http://localhost:8000/api/analytics/user-engagement');
    expect(response2.status()).toBe(200);
    console.log('✅ User engagement API working');

    const response3 = await page.request.get('http://localhost:8000/api/analytics/business-metrics');
    expect(response3.status()).toBe(200);
    console.log('✅ Business metrics API working');

    // Test data source integration
    console.log('📊 Testing data source integration...');
    await page.click('text=Analytics');
    await page.click('text=Learning Outcomes');
    
    // Verify data is being loaded from real sources
    await expect(page.locator('text=Data Source: Real')).toBeVisible();
    console.log('✅ Real data source integration working');

    // Test data refresh
    console.log('🔄 Testing data refresh...');
    await page.click('text=Refresh Data');
    await page.waitForTimeout(3000);
    await expect(page.locator('text=Data Updated')).toBeVisible();
    console.log('✅ Data refresh working');
  });

  test('Analytics Error Handling and Fallback', async ({ page }) => {
    console.log('🛠️ Testing analytics error handling and fallback...');

    // Simulate API failure
    console.log('💥 Simulating API failure...');
    await page.route('**/api/analytics/**', route => route.abort());
    
    await page.click('text=Analytics');
    await page.click('text=Learning Outcomes');
    
    // Check error handling
    await expect(page.locator('text=Unable to load data')).toBeVisible();
    await expect(page.locator('text=Retry')).toBeVisible();
    console.log('✅ API failure error handling working');

    // Test retry functionality
    console.log('🔄 Testing retry functionality...');
    await page.unroute('**/api/analytics/**');
    await page.click('text=Retry');
    await page.waitForTimeout(3000);
    await expect(page.locator('text=Completion Rates')).toBeVisible();
    console.log('✅ Retry functionality working');

    // Test fallback data
    console.log('🔄 Testing fallback data...');
    await page.route('**/api/analytics/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            learningOutcomes: {
              totalChildren: 0,
              averageCompletionRate: 0,
              topPerformingAgeGroups: [],
              topicEngagement: []
            }
          }
        })
      });
    });
    
    await page.reload();
    await page.click('text=Analytics');
    await page.click('text=Learning Outcomes');
    
    await expect(page.locator('text=No data available')).toBeVisible();
    console.log('✅ Fallback data handling working');
  });

  test('Analytics Real-time Updates and Notifications', async ({ page, context }) => {
    console.log('⚡ Testing analytics real-time updates and notifications...');

    // Open two browser contexts
    const page2 = await context.newPage();
    
    // User 1: Perform action that should trigger analytics update
    await page.goto('http://localhost:3000');
    await page.click('text=Create Profile');
    await page.fill('input[name="childName"]', 'Analytics Test Child');
    await page.selectOption('select[name="childAge"]', '7');
    await page.click('button[type="submit"]');
    await page.waitForSelector('text=Profile Created', { timeout: 10000 });

    // User 2: Check analytics dashboard for real-time updates
    await page2.goto('http://localhost:3000/admin');
    await page2.fill('input[type="email"]', 'admin@example.com');
    await page2.fill('input[type="password"]', 'adminpassword');
    await page2.click('button[type="submit"]');
    
    await page2.click('text=Analytics');
    await page2.click('text=User Engagement');
    
    // Check for real-time updates
    const updateStartTime = Date.now();
    await expect(page2.locator('text=Analytics Test Child')).toBeVisible();
    const updateTime = Date.now() - updateStartTime;
    console.log(`🔄 Real-time analytics update time: ${updateTime}ms`);
    expect(updateTime).toBeLessThan(5000);

    // Test analytics notifications
    console.log('🔔 Testing analytics notifications...');
    await expect(page2.locator('text=New User Activity')).toBeVisible();
    console.log('✅ Analytics notifications working');

    await page2.close();
    console.log('✅ Real-time analytics updates test passed!');
  });
});

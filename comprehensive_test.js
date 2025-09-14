const { chromium } = require('playwright');

async function comprehensiveTest() {
    console.log('🚀 STARTING COMPREHENSIVE SYSTEM TEST');
    console.log('=' * 60);
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000 
    });
    
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    try {
        // Test 1: Frontend Loading
        console.log('\n📱 TEST 1: Frontend Loading');
        console.log('-' * 30);
        
        await page.goto('https://unschooling-464413.web.app');
        await page.waitForLoadState('networkidle');
        
        const title = await page.title();
        console.log(`✅ Frontend loaded successfully`);
        console.log(`📄 Page title: ${title}`);
        
        // Test 2: Navigation and UI Elements
        console.log('\n🧭 TEST 2: Navigation and UI Elements');
        console.log('-' * 30);
        
        // Check for main navigation elements
        const navbar = await page.locator('nav').first();
        if (await navbar.isVisible()) {
            console.log('✅ Navigation bar visible');
        }
        
        // Check for main content areas
        const mainContent = await page.locator('main, .main-content, #root').first();
        if (await mainContent.isVisible()) {
            console.log('✅ Main content area visible');
        }
        
        // Test 3: Profile Form Testing
        console.log('\n📝 TEST 3: Profile Form Testing');
        console.log('-' * 30);
        
        // Look for profile form or signup form
        const profileForm = await page.locator('form').first();
        if (await profileForm.isVisible()) {
            console.log('✅ Profile form found');
            
            // Fill out the form with test data
            const nameInput = await page.locator('input[name*="name"], input[placeholder*="name"]').first();
            if (await nameInput.isVisible()) {
                await nameInput.fill('Test Child');
                console.log('✅ Child name filled');
            }
            
            const ageInput = await page.locator('input[name*="age"], input[type="number"]').first();
            if (await ageInput.isVisible()) {
                await ageInput.fill('9');
                console.log('✅ Child age filled');
            }
            
            // Look for interests/checkboxes
            const interestCheckboxes = await page.locator('input[type="checkbox"]');
            const checkboxCount = await interestCheckboxes.count();
            if (checkboxCount > 0) {
                // Select first few interests
                for (let i = 0; i < Math.min(3, checkboxCount); i++) {
                    await interestCheckboxes.nth(i).check();
                }
                console.log(`✅ Selected ${Math.min(3, checkboxCount)} interests`);
            }
            
            // Look for submit button
            const submitButton = await page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Generate")').first();
            if (await submitButton.isVisible()) {
                console.log('✅ Submit button found');
                
                // Take screenshot before submission
                await page.screenshot({ path: 'test_before_submission.png' });
                console.log('📸 Screenshot taken: test_before_submission.png');
                
                // Click submit
                await submitButton.click();
                console.log('✅ Form submitted');
                
                // Wait for response
                await page.waitForTimeout(5000);
                
                // Take screenshot after submission
                await page.screenshot({ path: 'test_after_submission.png' });
                console.log('📸 Screenshot taken: test_after_submission.png');
            }
        } else {
            console.log('⚠️ No profile form found on main page');
        }
        
        // Test 4: Check for Results/Plan Display
        console.log('\n📊 TEST 4: Results/Plan Display');
        console.log('-' * 30);
        
        // Look for results or plan content
        const resultsSection = await page.locator('.results, .plan, .activities, .recommendations').first();
        if (await resultsSection.isVisible()) {
            console.log('✅ Results section visible');
            
            // Check for activities
            const activities = await page.locator('.activity, .preferred-activity, li').all();
            if (activities.length > 0) {
                console.log(`✅ Found ${activities.length} activities/recommendations`);
                
                // Get first few activities
                for (let i = 0; i < Math.min(5, activities.length); i++) {
                    const activityText = await activities[i].textContent();
                    console.log(`   ${i + 1}. ${activityText?.trim()}`);
                }
            }
        } else {
            console.log('⚠️ No results section found');
        }
        
        // Test 5: Backend API Direct Test
        console.log('\n🔧 TEST 5: Backend API Direct Test');
        console.log('-' * 30);
        
        // Test backend directly
        const backendResponse = await page.evaluate(async () => {
            try {
                const response = await fetch('https://llm-agents-790275794964.us-central1.run.app/api/generate-plan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': 'unschooling-api-key-2024',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        profile: {
                            child_name: 'Test Child',
                            child_age: 9,
                            interests: ['AI', 'Science', 'Entrepreneurship'],
                            learning_style: 'visual',
                            plan_type: 'hybrid'
                        }
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return {
                        status: 'success',
                        statusCode: response.status,
                        data: data
                    };
                } else {
                    return {
                        status: 'error',
                        statusCode: response.status,
                        error: await response.text()
                    };
                }
            } catch (error) {
                return {
                    status: 'error',
                    error: error.message
                };
            }
        });
        
        if (backendResponse.status === 'success') {
            console.log('✅ Backend API responding successfully');
            console.log(`📊 Status Code: ${backendResponse.statusCode}`);
            
            if (backendResponse.data?.data?.profile_analysis) {
                const profileAnalysis = backendResponse.data.data.profile_analysis;
                const activities = profileAnalysis.preferred_activities || [];
                const llmInsights = profileAnalysis.llm_insights || {};
                
                console.log(`📋 Preferred Activities: ${activities.length} items`);
                console.log(`🧠 LLM Insights: ${Object.keys(llmInsights).length} keys`);
                
                if (activities.length > 0) {
                    console.log('🎯 Sample Activities:');
                    activities.slice(0, 5).forEach((activity, i) => {
                        console.log(`   ${i + 1}. ${activity}`);
                    });
                }
                
                if (llmInsights.cognitive_assessment) {
                    const cognitive = llmInsights.cognitive_assessment;
                    console.log(`🧠 Cognitive Level: ${cognitive.level}`);
                    console.log(`💪 Strengths: ${cognitive.strengths?.length || 0} items`);
                }
            }
        } else {
            console.log('❌ Backend API error:', backendResponse.error);
        }
        
        // Test 6: Performance and Loading
        console.log('\n⚡ TEST 6: Performance and Loading');
        console.log('-' * 30);
        
        const performanceMetrics = await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                totalTime: navigation.loadEventEnd - navigation.fetchStart
            };
        });
        
        console.log(`⏱️ Load Time: ${performanceMetrics.loadTime}ms`);
        console.log(`⏱️ DOM Content Loaded: ${performanceMetrics.domContentLoaded}ms`);
        console.log(`⏱️ Total Time: ${performanceMetrics.totalTime}ms`);
        
        // Test 7: Responsive Design
        console.log('\n📱 TEST 7: Responsive Design');
        console.log('-' * 30);
        
        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'test_mobile_view.png' });
        console.log('📸 Mobile view screenshot: test_mobile_view.png');
        
        // Test tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'test_tablet_view.png' });
        console.log('📸 Tablet view screenshot: test_tablet_view.png');
        
        // Test desktop viewport
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'test_desktop_view.png' });
        console.log('📸 Desktop view screenshot: test_desktop_view.png');
        
        // Final comprehensive screenshot
        await page.screenshot({ path: 'test_final_comprehensive.png', fullPage: true });
        console.log('📸 Final comprehensive screenshot: test_final_comprehensive.png');
        
    } catch (error) {
        console.log('❌ Test Error:', error.message);
        await page.screenshot({ path: 'test_error.png' });
        console.log('📸 Error screenshot: test_error.png');
    } finally {
        await browser.close();
    }
    
    console.log('\n🎉 COMPREHENSIVE TEST COMPLETED');
    console.log('=' * 60);
    console.log('📸 Screenshots saved for review');
    console.log('📊 Check the console output above for detailed results');
}

comprehensiveTest().catch(console.error);

const { chromium } = require('playwright');

async function detailedUserJourneyTest() {
    console.log('🚀 STARTING DETAILED USER JOURNEY TEST');
    console.log('=' * 60);
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 2000 
    });
    
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    try {
        // Step 1: Load Frontend
        console.log('\n📱 STEP 1: Loading Frontend');
        console.log('-' * 30);
        
        await page.goto('https://unschooling-464413.web.app');
        await page.waitForLoadState('networkidle');
        
        const title = await page.title();
        console.log(`✅ Frontend loaded: ${title}`);
        
        // Take initial screenshot
        await page.screenshot({ path: 'journey_1_initial_load.png' });
        console.log('📸 Screenshot: journey_1_initial_load.png');
        
        // Step 2: Look for Navigation to Profile/Plans
        console.log('\n🧭 STEP 2: Navigation Analysis');
        console.log('-' * 30);
        
        // Look for navigation links
        const navLinks = await page.locator('nav a, .nav-link, [href*="plan"], [href*="profile"]').all();
        console.log(`🔍 Found ${navLinks.length} navigation links`);
        
        for (let i = 0; i < navLinks.length; i++) {
            const linkText = await navLinks[i].textContent();
            const linkHref = await navLinks[i].getAttribute('href');
            console.log(`   ${i + 1}. "${linkText}" -> ${linkHref}`);
        }
        
        // Step 3: Look for Profile/Plan Creation Buttons
        console.log('\n📝 STEP 3: Profile/Plan Creation');
        console.log('-' * 30);
        
        // Look for buttons that might lead to profile creation
        const buttons = await page.locator('button, .btn, [role="button"]').all();
        console.log(`🔍 Found ${buttons.length} buttons`);
        
        for (let i = 0; i < Math.min(10, buttons.length); i++) {
            const buttonText = await buttons[i].textContent();
            console.log(`   ${i + 1}. "${buttonText?.trim()}"`);
        }
        
        // Look for "Create Plan", "Get Started", "Start", etc.
        const startButtons = await page.locator('button:has-text("Create"), button:has-text("Start"), button:has-text("Get Started"), button:has-text("Begin")').all();
        
        if (startButtons.length > 0) {
            console.log(`✅ Found ${startButtons.length} start/create buttons`);
            
            // Click the first start button
            await startButtons[0].click();
            await page.waitForTimeout(3000);
            
            await page.screenshot({ path: 'journey_2_after_start_click.png' });
            console.log('📸 Screenshot: journey_2_after_start_click.png');
        } else {
            console.log('⚠️ No start/create buttons found');
        }
        
        // Step 4: Look for Profile Form
        console.log('\n📋 STEP 4: Profile Form Detection');
        console.log('-' * 30);
        
        // Look for forms
        const forms = await page.locator('form').all();
        console.log(`🔍 Found ${forms.length} forms`);
        
        if (forms.length > 0) {
            const form = forms[0];
            console.log('✅ Form found, analyzing fields...');
            
            // Look for input fields
            const inputs = await form.locator('input, select, textarea').all();
            console.log(`🔍 Found ${inputs.length} input fields`);
            
            for (let i = 0; i < inputs.length; i++) {
                const inputType = await inputs[i].getAttribute('type') || 'text';
                const inputName = await inputs[i].getAttribute('name') || 'unnamed';
                const inputPlaceholder = await inputs[i].getAttribute('placeholder') || '';
                console.log(`   ${i + 1}. ${inputType} - ${inputName} - "${inputPlaceholder}"`);
            }
            
            // Fill out the form
            console.log('\n📝 Filling out profile form...');
            
            // Child name
            const nameInput = await form.locator('input[name*="name"], input[placeholder*="name"], input[placeholder*="Name"]').first();
            if (await nameInput.isVisible()) {
                await nameInput.fill('Test Child');
                console.log('✅ Child name filled');
            }
            
            // Child age
            const ageInput = await form.locator('input[name*="age"], input[type="number"], input[placeholder*="age"]').first();
            if (await ageInput.isVisible()) {
                await ageInput.fill('9');
                console.log('✅ Child age filled');
            }
            
            // Interests (checkboxes or multi-select)
            const interestInputs = await form.locator('input[type="checkbox"], input[type="radio"]').all();
            if (interestInputs.length > 0) {
                console.log(`🔍 Found ${interestInputs.length} interest options`);
                // Select first 3 interests
                for (let i = 0; i < Math.min(3, interestInputs.length); i++) {
                    await interestInputs[i].check();
                    const label = await interestInputs[i].locator('..').textContent();
                    console.log(`✅ Selected interest: ${label?.trim()}`);
                }
            }
            
            // Learning style
            const learningStyleInputs = await form.locator('select[name*="style"], select[name*="learning"]').all();
            if (learningStyleInputs.length > 0) {
                await learningStyleInputs[0].selectOption('visual');
                console.log('✅ Learning style selected');
            }
            
            await page.screenshot({ path: 'journey_3_form_filled.png' });
            console.log('📸 Screenshot: journey_3_form_filled.png');
            
            // Submit form
            const submitButton = await form.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Generate"), button:has-text("Create")').first();
            if (await submitButton.isVisible()) {
                console.log('🚀 Submitting form...');
                await submitButton.click();
                
                // Wait for response
                await page.waitForTimeout(10000);
                
                await page.screenshot({ path: 'journey_4_after_submission.png' });
                console.log('📸 Screenshot: journey_4_after_submission.png');
                
                // Look for results
                console.log('\n📊 STEP 5: Results Analysis');
                console.log('-' * 30);
                
                // Look for results, activities, recommendations
                const resultsElements = await page.locator('.results, .activities, .recommendations, .plan, .schedule, .activities-list').all();
                console.log(`🔍 Found ${resultsElements.length} potential results sections`);
                
                if (resultsElements.length > 0) {
                    for (let i = 0; i < resultsElements.length; i++) {
                        const elementText = await resultsElements[i].textContent();
                        console.log(`   Results ${i + 1}: ${elementText?.substring(0, 100)}...`);
                    }
                }
                
                // Look for any lists or activity items
                const activityItems = await page.locator('li, .activity, .item, .recommendation').all();
                console.log(`🔍 Found ${activityItems.length} potential activity items`);
                
                if (activityItems.length > 0) {
                    console.log('🎯 Sample activities found:');
                    for (let i = 0; i < Math.min(10, activityItems.length); i++) {
                        const activityText = await activityItems[i].textContent();
                        if (activityText && activityText.trim().length > 0) {
                            console.log(`   ${i + 1}. ${activityText.trim()}`);
                        }
                    }
                }
                
            } else {
                console.log('⚠️ No submit button found');
            }
        } else {
            console.log('⚠️ No forms found on the page');
        }
        
        // Step 6: Test Backend Integration
        console.log('\n🔧 STEP 6: Backend Integration Test');
        console.log('-' * 30);
        
        const backendTest = await page.evaluate(async () => {
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
                        hasProfileAnalysis: !!data?.data?.profile_analysis,
                        activityCount: data?.data?.profile_analysis?.preferred_activities?.length || 0,
                        hasLLMInsights: !!data?.data?.profile_analysis?.llm_insights,
                        sampleActivities: data?.data?.profile_analysis?.preferred_activities?.slice(0, 5) || []
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
        
        if (backendTest.status === 'success') {
            console.log('✅ Backend API working correctly');
            console.log(`📊 Status Code: ${backendTest.statusCode}`);
            console.log(`📋 Profile Analysis: ${backendTest.hasProfileAnalysis ? 'Yes' : 'No'}`);
            console.log(`🎯 Activities Generated: ${backendTest.activityCount}`);
            console.log(`🧠 LLM Insights: ${backendTest.hasLLMInsights ? 'Yes' : 'No'}`);
            
            if (backendTest.sampleActivities.length > 0) {
                console.log('🎯 Sample Activities from Backend:');
                backendTest.sampleActivities.forEach((activity, i) => {
                    console.log(`   ${i + 1}. ${activity}`);
                });
            }
        } else {
            console.log('❌ Backend API Error:', backendTest.error);
        }
        
        // Final comprehensive screenshot
        await page.screenshot({ path: 'journey_final_comprehensive.png', fullPage: true });
        console.log('📸 Final screenshot: journey_final_comprehensive.png');
        
    } catch (error) {
        console.log('❌ Test Error:', error.message);
        await page.screenshot({ path: 'journey_error.png' });
        console.log('📸 Error screenshot: journey_error.png');
    } finally {
        await browser.close();
    }
    
    console.log('\n🎉 DETAILED USER JOURNEY TEST COMPLETED');
    console.log('=' * 60);
    console.log('📸 All screenshots saved for review');
    console.log('📊 Check the console output above for detailed results');
}

detailedUserJourneyTest().catch(console.error);

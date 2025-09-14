const { chromium } = require('playwright');

async function completeFlowTest() {
    console.log('🚀 TESTING COMPLETE USER FLOW');
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
        // Step 1: Go to Child Profile Page
        console.log('\n📱 STEP 1: Loading Child Profile Page');
        console.log('-' * 30);
        
        await page.goto('https://unschooling-464413.web.app/child-profile');
        await page.waitForLoadState('networkidle');
        
        const title = await page.title();
        console.log(`✅ Child profile page loaded: ${title}`);
        
        await page.screenshot({ path: 'flow_1_initial_load.png' });
        console.log('📸 Screenshot: flow_1_initial_load.png');
        
        // Step 2: Click "Add Your First Child" Button
        console.log('\n👶 STEP 2: Adding First Child');
        console.log('-' * 30);
        
        const addChildButton = await page.locator('button:has-text("Add Your First Child")').first();
        if (await addChildButton.isVisible()) {
            console.log('✅ Found "Add Your First Child" button');
            await addChildButton.click();
            await page.waitForTimeout(3000);
            
            await page.screenshot({ path: 'flow_2_after_add_child_click.png' });
            console.log('📸 Screenshot: flow_2_after_add_child_click.png');
        } else {
            console.log('⚠️ "Add Your First Child" button not found');
        }
        
        // Step 3: Look for Profile Form
        console.log('\n📋 STEP 3: Profile Form Detection');
        console.log('-' * 30);
        
        // Look for forms
        const forms = await page.locator('form').all();
        console.log(`🔍 Found ${forms.length} forms after clicking add child`);
        
        if (forms.length > 0) {
            const form = forms[0];
            console.log('✅ Form found after clicking add child!');
            
            // Analyze form fields
            const inputs = await form.locator('input, select, textarea').all();
            console.log(`🔍 Found ${inputs.length} input fields`);
            
            for (let i = 0; i < inputs.length; i++) {
                const inputType = await inputs[i].getAttribute('type') || 'text';
                const inputName = await inputs[i].getAttribute('name') || 'unnamed';
                const inputPlaceholder = await inputs[i].getAttribute('placeholder') || '';
                const inputId = await inputs[i].getAttribute('id') || '';
                console.log(`   ${i + 1}. ${inputType} - ${inputName} - "${inputPlaceholder}" - ${inputId}`);
            }
            
            // Fill out the form
            console.log('\n📝 Filling out profile form...');
            
            // Child name
            const nameInput = await form.locator('input[name*="name"], input[placeholder*="name"], input[placeholder*="Name"], input[id*="name"]').first();
            if (await nameInput.isVisible()) {
                await nameInput.fill('Test Child');
                console.log('✅ Child name filled');
            }
            
            // Child age
            const ageInput = await form.locator('input[name*="age"], input[type="number"], input[placeholder*="age"], input[id*="age"]').first();
            if (await ageInput.isVisible()) {
                await ageInput.fill('9');
                console.log('✅ Child age filled');
            }
            
            // Interests
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
            const learningStyleSelect = await form.locator('select[name*="style"], select[name*="learning"], select[id*="style"]').first();
            if (await learningStyleSelect.isVisible()) {
                await learningStyleSelect.selectOption('visual');
                console.log('✅ Learning style selected');
            }
            
            await page.screenshot({ path: 'flow_3_form_filled.png' });
            console.log('📸 Screenshot: flow_3_form_filled.png');
            
            // Submit form
            const submitButton = await form.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Generate"), button:has-text("Create"), button:has-text("Get Started")').first();
            if (await submitButton.isVisible()) {
                console.log('🚀 Submitting form...');
                await submitButton.click();
                
                // Wait for response
                await page.waitForTimeout(15000);
                
                await page.screenshot({ path: 'flow_4_after_submission.png' });
                console.log('📸 Screenshot: flow_4_after_submission.png');
                
                // Look for results
                console.log('\n📊 STEP 4: Results Analysis');
                console.log('-' * 30);
                
                // Look for any content that might be results
                const pageContent = await page.textContent('body');
                console.log(`📄 Page content length: ${pageContent.length} characters`);
                
                // Look for specific result indicators
                const resultIndicators = await page.locator('.results, .activities, .recommendations, .plan, .schedule, .activities-list, .preferred-activities').all();
                console.log(`🔍 Found ${resultIndicators.length} potential results sections`);
                
                // Look for any lists
                const lists = await page.locator('ul, ol, .list').all();
                console.log(`🔍 Found ${lists.length} lists on page`);
                
                if (lists.length > 0) {
                    for (let i = 0; i < Math.min(3, lists.length); i++) {
                        const listItems = await lists[i].locator('li').all();
                        if (listItems.length > 0) {
                            console.log(`📋 List ${i + 1} has ${listItems.length} items:`);
                            for (let j = 0; j < Math.min(5, listItems.length); j++) {
                                const itemText = await listItems[j].textContent();
                                if (itemText && itemText.trim().length > 0) {
                                    console.log(`   ${j + 1}. ${itemText.trim()}`);
                                }
                            }
                        }
                    }
                }
                
                // Look for any text that might contain activities
                const allText = await page.textContent('body');
                if (allText.includes('Coding games') || allText.includes('AI simulations') || allText.includes('Science experiments')) {
                    console.log('✅ Found activity-related content on page!');
                } else {
                    console.log('⚠️ No activity-related content found on page');
                }
                
                // Check for any error messages
                const errorElements = await page.locator('.error, .alert, .warning').all();
                if (errorElements.length > 0) {
                    console.log(`⚠️ Found ${errorElements.length} error/warning elements`);
                    for (let i = 0; i < errorElements.length; i++) {
                        const errorText = await errorElements[i].textContent();
                        console.log(`   Error ${i + 1}: ${errorText?.trim()}`);
                    }
                }
                
            } else {
                console.log('⚠️ No submit button found');
            }
        } else {
            console.log('⚠️ No forms found after clicking add child');
            
            // Look for any buttons that might lead to profile creation
            const buttons = await page.locator('button, .btn, [role="button"]').all();
            console.log(`🔍 Found ${buttons.length} buttons on page`);
            
            for (let i = 0; i < Math.min(10, buttons.length); i++) {
                const buttonText = await buttons[i].textContent();
                console.log(`   ${i + 1}. "${buttonText?.trim()}"`);
            }
        }
        
        // Step 5: Test Backend Integration
        console.log('\n🔧 STEP 5: Backend Integration Test');
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
                        sampleActivities: data?.data?.profile_analysis?.preferred_activities?.slice(0, 5) || [],
                        cognitiveLevel: data?.data?.profile_analysis?.llm_insights?.cognitive_assessment?.level || 'unknown'
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
            console.log(`🧠 Cognitive Level: ${backendTest.cognitiveLevel}`);
            
            if (backendTest.sampleActivities.length > 0) {
                console.log('🎯 Sample Activities from Backend:');
                backendTest.sampleActivities.forEach((activity, i) => {
                    console.log(`   ${i + 1}. ${activity}`);
                });
            }
        } else {
            console.log('❌ Backend API Error:', backendTest.error);
        }
        
        // Final screenshot
        await page.screenshot({ path: 'flow_final_comprehensive.png', fullPage: true });
        console.log('📸 Final screenshot: flow_final_comprehensive.png');
        
    } catch (error) {
        console.log('❌ Test Error:', error.message);
        await page.screenshot({ path: 'flow_error.png' });
        console.log('📸 Error screenshot: flow_error.png');
    } finally {
        await browser.close();
    }
    
    console.log('\n🎉 COMPLETE FLOW TEST COMPLETED');
    console.log('=' * 60);
    console.log('📸 All screenshots saved for review');
    console.log('📊 Check the console output above for detailed results');
}

completeFlowTest().catch(console.error);

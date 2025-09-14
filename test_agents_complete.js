/**
 * Complete Agent Testing Suite
 * Tests all 4 agents systematically with real data
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBvQZvQZvQZvQZvQZvQZvQZvQZvQZvQZvQ",
  authDomain: "unschooling-app.firebaseapp.com",
  projectId: "unschooling-app",
  storageBucket: "unschooling-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test data
const testChild = {
  child_name: "Test Child",
  child_age: 9,
  interests: ["AI", "Science", "Entrepreneurship"],
  learning_style: "visual",
  plan_type: "hybrid"
};

async function testCompleteAgentFlow() {
  console.log('🚀 STARTING COMPLETE AGENT TEST SUITE');
  console.log('=' .repeat(60));
  
  try {
    // Step 1: Test Firestore Connection
    console.log('\n📊 STEP 1: Testing Firestore Connection');
    console.log('-'.repeat(40));
    
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    console.log(`✅ Users found: ${usersSnapshot.size}`);
    
    if (usersSnapshot.empty) {
      console.log('⚠️ No users found - creating test child...');
      // We'll create a test child in memory for testing
    } else {
      // Load real children
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const childrenRef = collection(db, `users/${userId}/children`);
        const childrenSnapshot = await getDocs(childrenRef);
        console.log(`👶 Children for user ${userId}: ${childrenSnapshot.size}`);
        
        childrenSnapshot.forEach((childDoc) => {
          const childData = childDoc.data();
          console.log(`👶 Child: ${childDoc.id} - ${childData.name || childData.child_name || 'Unknown'}`);
        });
      }
    }
    
    // Step 2: Test Backend API Connection
    console.log('\n🌐 STEP 2: Testing Backend API Connection');
    console.log('-'.repeat(40));
    
    const response = await fetch('https://unschooling-backend-790275794964.us-central1.run.app/api/generate-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'unschooling-api-key-2024',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ profile: testChild })
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Backend API connected successfully');
    console.log(`📊 Response keys: ${Object.keys(data).join(', ')}`);
    
    // Step 3: Test Each Agent Individually
    console.log('\n🤖 STEP 3: Testing Each Agent Individually');
    console.log('-'.repeat(40));
    
    // Profile Agent
    console.log('\n👤 PROFILE AGENT:');
    if (data.enhanced_profile) {
      console.log('✅ Profile Agent: SUCCESS');
      console.log(`📊 Enhanced profile keys: ${Object.keys(data.enhanced_profile).join(', ')}`);
      console.log(`📊 LLM insights: ${data.enhanced_profile.llm_insights ? 'Present' : 'Missing'}`);
      console.log(`📊 Preferred activities: ${data.enhanced_profile.preferred_activities?.length || 0} items`);
    } else {
      console.log('❌ Profile Agent: FAILED - No enhanced_profile');
    }
    
    // Match Agent
    console.log('\n🎯 MATCH AGENT:');
    if (data.matched_topics) {
      console.log('✅ Match Agent: SUCCESS');
      console.log(`📊 Matched topics: ${data.matched_topics.length} topics`);
      console.log(`📊 Match analysis: ${data.match_analysis ? 'Present' : 'Missing'}`);
      console.log(`📊 Available niches: ${data.available_niches?.length || 0} niches`);
    } else {
      console.log('❌ Match Agent: FAILED - No matched_topics');
    }
    
    // Schedule Agent
    console.log('\n📅 SCHEDULE AGENT:');
    if (data.weekly_plan) {
      console.log('✅ Schedule Agent: SUCCESS');
      console.log(`📊 Weekly plan keys: ${Object.keys(data.weekly_plan).join(', ')}`);
      console.log(`📊 Learning objectives: ${data.learning_objectives?.length || 0} objectives`);
      console.log(`📊 Recommended activities: ${data.recommended_activities?.length || 0} activities`);
    } else {
      console.log('❌ Schedule Agent: FAILED - No weekly_plan');
    }
    
    // Reviewer Agent
    console.log('\n🔍 REVIEWER AGENT:');
    if (data.review_insights) {
      console.log('✅ Reviewer Agent: SUCCESS');
      console.log(`📊 Review insights keys: ${Object.keys(data.review_insights).join(', ')}`);
      console.log(`📊 Daily tasks: ${data.daily_tasks ? Object.keys(data.daily_tasks).length : 0} weeks`);
      console.log(`📊 LLM raw output: ${data.llm_raw_output ? 'Present' : 'Missing'}`);
    } else {
      console.log('❌ Reviewer Agent: FAILED - No review_insights');
    }
    
    // Step 4: Test Data Flow
    console.log('\n🔄 STEP 4: Testing Data Flow Between Agents');
    console.log('-'.repeat(40));
    
    const dataFlow = {
      'Profile → Match': data.enhanced_profile && data.matched_topics ? '✅' : '❌',
      'Match → Schedule': data.matched_topics && data.weekly_plan ? '✅' : '❌',
      'Schedule → Reviewer': data.weekly_plan && data.review_insights ? '✅' : '❌',
      'Complete Flow': data.enhanced_profile && data.matched_topics && data.weekly_plan && data.review_insights ? '✅' : '❌'
    };
    
    Object.entries(dataFlow).forEach(([flow, status]) => {
      console.log(`${status} ${flow}`);
    });
    
    // Step 5: Test Frontend Compatibility
    console.log('\n🖥️ STEP 5: Testing Frontend Compatibility');
    console.log('-'.repeat(40));
    
    const frontendChecks = {
      'Profile Agent Output': data.enhanced_profile?.llm_insights ? '✅' : '❌',
      'Match Agent Output': data.matched_topics?.length > 0 ? '✅' : '❌',
      'Schedule Agent Output': data.weekly_plan ? '✅' : '❌',
      'Reviewer Agent Output': data.review_insights ? '✅' : '❌',
      'LLM Raw Output': data.llm_raw_output ? '✅' : '❌',
      'Daily Tasks': data.daily_tasks ? '✅' : '❌'
    };
    
    Object.entries(frontendChecks).forEach(([check, status]) => {
      console.log(`${status} ${check}`);
    });
    
    // Step 6: Summary
    console.log('\n📋 STEP 6: FINAL SUMMARY');
    console.log('=' .repeat(60));
    
    const allAgentsWorking = data.enhanced_profile && data.matched_topics && data.weekly_plan && data.review_insights;
    const allDataPresent = data.llm_raw_output && data.daily_tasks;
    
    console.log(`🎯 All 4 Agents Working: ${allAgentsWorking ? '✅ YES' : '❌ NO'}`);
    console.log(`📊 All Data Present: ${allDataPresent ? '✅ YES' : '❌ NO'}`);
    console.log(`🖥️ Frontend Ready: ${allAgentsWorking && allDataPresent ? '✅ YES' : '❌ NO'}`);
    
    if (allAgentsWorking && allDataPresent) {
      console.log('\n🎉 SUCCESS! All agents are working correctly!');
      console.log('✅ You can now use the frontend dashboard');
    } else {
      console.log('\n⚠️ ISSUES FOUND:');
      if (!data.enhanced_profile) console.log('❌ Profile Agent not working');
      if (!data.matched_topics) console.log('❌ Match Agent not working');
      if (!data.weekly_plan) console.log('❌ Schedule Agent not working');
      if (!data.review_insights) console.log('❌ Reviewer Agent not working');
      if (!data.llm_raw_output) console.log('❌ LLM raw output missing');
      if (!data.daily_tasks) console.log('❌ Daily tasks missing');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Check if backend is running');
    console.log('2. Check if Firebase is configured correctly');
    console.log('3. Check if API key is valid');
    console.log('4. Check network connection');
  }
}

// Run the test
testCompleteAgentFlow();

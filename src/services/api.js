/**
 * API service for the Unschooling React application.
 * Handles HTTP requests, error handling, and retries.
 */

import config, { getApiUrl } from '../config/config';

class ApiService {
  constructor() {
    this.baseURL = config.API_BASE_URL;
    this.timeout = config.API_TIMEOUT;
    this.maxRetries = config.UI.MAX_RETRIES;
    this.mockMode = false; // Use real backend with Firebase authentication
  }

  /**
   * Get authentication token from Firebase Auth
   */
  async getAuthToken() {
    try {
      // Import Firebase auth dynamically to avoid circular imports
      const { auth } = await import('../firebase');
      const { getIdToken } = await import('firebase/auth');
      
      // Get current user
      const user = auth.currentUser;
      if (user) {
        // Get fresh ID token
        const idToken = await getIdToken(user, true); // force refresh
        return idToken;
      }
      
      // If no user is signed in, try to sign in anonymously
      const { signInAnonymously } = await import('firebase/auth');
      const result = await signInAnonymously(auth);
      const idToken = await getIdToken(result.user, true);
      return idToken;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  /**
   * Generate a mock plan when backend is not accessible
   */
  async generateMockPlan(profile) {
    console.log('🎯 ===== PLAN GENERATION STARTED =====');
    console.log('👤 USER PROFILE:', JSON.stringify(profile, null, 2));
    
    const child_age = profile.child_age || 5;
    const interests = profile.interests || [];
    const learning_style = profile.preferred_learning_style || 'mixed';
    const goals = profile.goals || [];
    
    console.log('📊 CHILD DETAILS:');
    console.log('   Age:', child_age);
    console.log('   Interests:', interests);
    console.log('   Learning Style:', learning_style);
    console.log('   Goals:', goals);
    
    // Try to load real data files
    let topicsData = null;
    let nichesData = null;
    
    try {
      // Load topics data
      console.log('📁 LOADING DATA FILES...');
      const topicsResponse = await fetch('/topicsdata.json');
      if (topicsResponse.ok) {
        topicsData = await topicsResponse.json();
        console.log('✅ TOPICS DATA LOADED:', topicsData.length, 'topics available');
        console.log('   Available niches in topics:', [...new Set(topicsData.map(t => t.Niche))]);
      } else {
        console.error('❌ FAILED TO LOAD TOPICS DATA:', topicsResponse.status);
      }
      
      // Load niches data
      const nichesResponse = await fetch('/nichesdata.json');
      if (nichesResponse.ok) {
        nichesData = await nichesResponse.json();
        console.log('✅ NICHES DATA LOADED:', nichesData.length, 'niches available');
        console.log('   Available niches:', nichesData.map(n => n.Niche));
      } else {
        console.error('❌ FAILED TO LOAD NICHES DATA:', nichesResponse.status);
      }
    } catch (error) {
      console.error('❌ ERROR LOADING DATA FILES:', error);
    }
    
    // Find matching topics from the real data
    let matched_topics = [];
    console.log('🔍 SEARCHING FOR MATCHING TOPICS...');
    console.log('   Looking for topics matching interests:', interests);
    
    if (topicsData && interests.length > 0) {
      for (const topic of topicsData) {
        if (interests.includes(topic.Niche)) {
          // Simple age matching
          const age_range = topic.Age || "";
          const age_match = age_range.includes(String(child_age)) || age_range.includes("5-12") || age_range.includes("3 and 4");
          
          console.log(`   Checking topic: "${topic.Topic}" (Niche: ${topic.Niche}, Age: ${age_range})`);
          console.log(`     Interest match: ${interests.includes(topic.Niche) ? '✅' : '❌'}`);
          console.log(`     Age match: ${age_match ? '✅' : '❌'}`);
          
          if (age_match) {
            matched_topics.push(topic);
            console.log(`   ✅ SELECTED: "${topic.Topic}" for ${topic.Niche}`);
            if (matched_topics.length >= 4) {
              console.log('   📋 Reached maximum of 4 topics, stopping search');
              break;
            }
          }
        }
      }
      console.log(`📋 TOTAL MATCHED TOPICS: ${matched_topics.length}`);
      console.log('   Selected topics:', matched_topics.map(t => `${t.Topic} (${t.Niche})`));
    } else {
      console.log('⚠️ No topics data or interests available for matching');
    }
    
    // If no matches found, create generic topics
    if (matched_topics.length === 0) {
      console.log('⚠️ NO MATCHES FOUND - CREATING GENERIC TOPICS');
      matched_topics = interests.length > 0 ? interests.slice(0, 4).map(interest => ({
        'Topic': `Introduction to ${interest}`,
        'Niche': interest,
        'Age': `${child_age}-${child_age + 2}`,
        'Objective': `Learn the basics of ${interest} through fun activities`,
        'Activity 1': `Explore ${interest} through hands-on activities`,
        'Activity 2': `Create a project related to ${interest}`,
        'Estimated Time': '30 mins'
      })) : [{
        'Topic': 'General Learning Adventure',
        'Niche': 'General',
        'Age': `${child_age}-${child_age + 2}`,
        'Objective': 'Explore and learn through fun activities',
        'Activity 1': 'Creative exploration and discovery',
        'Activity 2': 'Build something amazing together',
        'Estimated Time': '30 mins'
      }];
      console.log('   Created generic topics:', matched_topics.map(t => t.Topic));
    }
    
    // Create weekly plan
    console.log('📅 CREATING WEEKLY PLAN...');
    const weekly_plan = {};
    const days = ["Day 1", "Day 2", "Day 3", "Day 4"];
    
    for (let i = 0; i < days.length; i++) {
      const topic = matched_topics[i % matched_topics.length];
      weekly_plan[days[i]] = topic;
      console.log(`   ${days[i]}: ${topic.Topic} (${topic.Niche})`);
    }
    
    const result = {
      'profile': profile,
      'matched_topics': matched_topics,
      'weekly_plan': weekly_plan,
      'review': `Plan created for ${profile.child_name || 'Child'} with ${days.length} days of activities.`
    };
    
    console.log('🎉 ===== PLAN GENERATION COMPLETED =====');
    console.log('📤 FINAL RESULT:', JSON.stringify(result, null, 2));
    console.log('🎯 ===== END =====');
    
    return result;
  }

  /**
   * Make an HTTP request with error handling and retries
   */
  async request(endpoint, options = {}) {
    // If in mock mode, return mock data
    if (this.mockMode) {
      console.log('Mock mode enabled, returning mock data for:', endpoint);
      if (endpoint === config.ENDPOINTS.GENERATE_PLAN && options.body) {
        // Handle both string and object body
        let profile;
        if (typeof options.body === 'string') {
          profile = JSON.parse(options.body).profile;
        } else {
          profile = options.body.profile;
        }
        return {
          success: true,
          data: await this.generateMockPlan(profile),
          message: "Mock plan generated successfully"
        };
      }
      return { success: true, data: {}, message: "Mock response" };
    }

    const url = getApiUrl(endpoint);
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: this.timeout,
    };

    const requestOptions = { ...defaultOptions, ...options };

    // Add authentication header if available
    const authToken = await this.getAuthToken();
    if (authToken) {
      requestOptions.headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Add body for POST/PUT requests
    if (requestOptions.body && typeof requestOptions.body === 'object') {
      requestOptions.body = JSON.stringify(requestOptions.body);
    }

    let lastError;
    
    // Retry logic
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            errorData.error?.message || `HTTP ${response.status}`,
            response.status,
            errorData.error?.code || 'HTTP_ERROR',
            errorData.error?.details
          );
        }

        const data = await response.json();
        return data;

      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          throw error;
        }
        
        // Don't retry on abort/timeout
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout', 408, 'TIMEOUT_ERROR');
        }
        
        // Log retry attempt
        if (attempt < this.maxRetries) {
          console.warn(`API request failed (attempt ${attempt}/${this.maxRetries}):`, error.message);
          // Wait before retrying (exponential backoff)
          await this.delay(Math.pow(2, attempt - 1) * 1000);
        }
      }
    }

    // All retries failed - fall back to mock mode
    console.warn('All API attempts failed, falling back to mock mode');
    this.mockMode = true;
    
    if (endpoint === config.ENDPOINTS.GENERATE_PLAN && options.body) {
      // Handle both string and object body
      let profile;
      if (typeof options.body === 'string') {
        profile = JSON.parse(options.body).profile;
      } else {
        profile = options.body.profile;
      }
      return {
        success: true,
        data: await this.generateMockPlan(profile),
        message: "Plan generated using fallback mode"
      };
    }
    
    throw lastError || new ApiError('Request failed after all retries', 500, 'RETRY_FAILED');
  }

  /**
   * Delay utility for retries
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Health check endpoint
   */
  async healthCheck() {
    return this.request(config.ENDPOINTS.HEALTH);
  }

  /**
   * Generate a personalized learning plan
   */
  async generatePlan(profile) {
    // Simple debug logging function
    const debugLog = (message) => {
      console.log(`🔍 DEBUG: ${message}`);
      // Try to add to debug context if available
      try {
        // Dispatch a custom event that the debug context can listen to
        window.dispatchEvent(new CustomEvent('debug-log', { detail: message }));
      } catch (e) {
        // Ignore if debug context is not available
      }
    };

    // Add debug logging at the start
    debugLog('🚀 PLAN GENERATION JOURNEY STARTED');
    debugLog(`📋 Profile received: ${profile.child_name || 'Unknown'}, Age: ${profile.child_age || 'Unknown'}`);
    debugLog(`🎯 Interests: ${profile.interests?.join(', ') || 'None'}`);
    debugLog(`🎨 Learning Style: ${profile.preferred_learning_style || 'Unknown'}`);
    debugLog(`📝 Plan Type: ${profile.plan_type || 'Unknown'}`);
    debugLog(`🌐 Mock Mode: ${this.mockMode ? 'ENABLED' : 'DISABLED'}`);
    
    // Always send the full profile, including plan_type
    if (!this.mockMode) {
      try {
        debugLog('🌐 STEP 1: PREPARING BACKEND REQUEST');
        
        // Use local proxy if running on localhost
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isLocal) {
          debugLog('🔗 Using local proxy (localhost detected)');
          debugLog('📡 STEP 2: SENDING REQUEST TO LOCAL PROXY');
          
          const res = await fetch('http://localhost:8080/local-proxy', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ profile }), // <-- wrap profile
          });
          
          debugLog(`📡 STEP 3: LOCAL PROXY RESPONSE RECEIVED`);
          debugLog(`✅ Status: ${res.status} ${res.statusText}`);
          
          const data = await res.json();
          debugLog('📄 STEP 4: PARSING LOCAL PROXY RESPONSE');
          debugLog(`📊 Response type: ${data.success ? 'SUCCESS' : 'FAILED'}`);
          debugLog(`🔍 DEBUG: Full local proxy response: ${JSON.stringify(data, null, 2)}`);
          
          return data;
        } else {
          debugLog('🔗 Using remote backend (production)');
          debugLog(`🌐 Backend URL: ${getApiUrl(config.ENDPOINTS.GENERATE_PLAN)}`);
          debugLog('🔑 STEP 2: GETTING AUTHENTICATION TOKEN');
          
          // Get authentication token
          const token = await this.getAuthToken();
          if (token) {
            debugLog('✅ Authentication token obtained');
            debugLog(`🔑 Token preview: ${token.substring(0, 20)}...`);
          } else {
            debugLog('❌ Failed to get authentication token');
          }
          
          const res = await fetch(getApiUrl(config.ENDPOINTS.GENERATE_PLAN), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': 'unschooling-api-key-2024',
            },
            body: JSON.stringify({ 
              profile
            }),
          });
          
          debugLog(`📤 Request body preview: ${JSON.stringify({ 
            profile: { child_name: profile.child_name, child_age: profile.child_age }
          }, null, 2)}`);
          
          debugLog('📡 STEP 3: BACKEND RESPONSE RECEIVED');
          debugLog(`✅ Status: ${res.status} ${res.statusText}`);
          
          let data;
          if (!res.ok) {
            debugLog(`❌ HTTP ERROR: ${res.status} ${res.statusText}`);
            const errorText = await res.text();
            debugLog(`📄 Error details: ${errorText}`);
            throw new Error(`Backend error: ${res.status} - ${errorText}`);
          } else {
            data = await res.json();
            debugLog('📄 STEP 4: PARSING RESPONSE DATA');
            debugLog(`📊 Response type: ${data.success ? 'SUCCESS' : 'FAILED'}`);
            debugLog(`🔍 DEBUG: Full backend response: ${JSON.stringify(data, null, 2)}`);
            
            if (data.success) {
              debugLog('✅ Plan generated successfully!');
            } else {
              debugLog(`❌ Backend Error: ${data.error?.message || 'Unknown error'}`);
              debugLog(`🔍 Error Code: ${data.error?.code || 'Unknown'}`);
            }
          }
          
          return data;
        }
      } catch (error) {
        debugLog('💥 STEP 3: EXCEPTION CAUGHT');
        debugLog(`❌ Error Type: ${error.name}`);
        debugLog(`❌ Error Message: ${error.message}`);
        debugLog(`❌ Error Stack: ${error.stack}`);
        debugLog(`🔍 DEBUG: Full error object: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`);
        throw error;
      }
    } else {
      // Mock mode: generate a 4-week plan for both plan types
      debugLog('🎭 STEP 1: USING MOCK MODE (Backend unavailable)');
      debugLog('📊 STEP 2: PROCESSING PROFILE DATA');
      
      const planType = profile.plan_type || 'hybrid';
      const child_age = profile.child_age || 5;
      const interests = profile.interests || [];
      const learning_style = profile.preferred_learning_style || 'mixed';
      const goals = profile.goals || [];
      
      debugLog(`📋 Plan Type: ${planType}`);
      debugLog(`👶 Child Age: ${child_age}`);
      debugLog(`🎯 Interests: ${interests.join(', ')}`);
      debugLog(`🎨 Learning Style: ${learning_style}`);
      debugLog(`🎯 Goals: ${goals.join(', ')}`);
      
      let topicsData = null;
      debugLog('📁 STEP 3: LOADING TOPICS DATA');
      
      try {
        const topicsResponse = await fetch('/topicsdata.json');
        if (topicsResponse.ok) {
          topicsData = await topicsResponse.json();
          debugLog(`✅ Topics data loaded: ${topicsData.length} topics available`);
        } else {
          debugLog(`❌ Failed to load topics data: ${topicsResponse.status}`);
        }
      } catch (error) {
        debugLog(`❌ Error loading topics data: ${error.message}`);
      }
      
      let matched_topics = [];
      debugLog('🔍 STEP 4: MATCHING TOPICS TO INTERESTS');
      debugLog(`🎯 Looking for topics matching: ${interests.join(', ')}`);
      
      if (topicsData && interests.length > 0) {
        for (const topic of topicsData) {
          if (interests.includes(topic.Niche)) {
            const age_range = topic.Age || "";
            const age_match = age_range.includes(String(child_age)) || age_range.includes("5-12") || age_range.includes("3 and 4");
            if (age_match) matched_topics.push(topic);
          }
        }
        
        debugLog(`✅ Found ${matched_topics.length} matching topics`);
      }
      
      if (matched_topics.length === 0 && interests.length > 0) {
        debugLog('🔄 STEP 5: CREATING FALLBACK TOPICS (No matches found)');
        
        matched_topics = interests.map(interest => ({
          Topic: `Introduction to ${interest}`,
          Niche: interest,
          Age: `${child_age}-${child_age + 2}`,
          Objective: `Learn the basics of ${interest}`,
          "Activity 1": `Explore ${interest}`,
          "Activity 2": `Create a project related to ${interest}`
        }));
        
        debugLog(`✅ Created ${matched_topics.length} fallback topics`);
      }
      // Hybrid: up to 4 topics, Fusion: up to 7 topics
      let selectedTopics = [];
      if (planType === 'fusion') {
        if (matched_topics.length >= 7) {
          selectedTopics = matched_topics.slice(0, 7);
        } else {
          selectedTopics = (matched_topics.concat(matched_topics)).slice(0, 7);
        }
      } else {
        if (matched_topics.length >= 4) {
          selectedTopics = matched_topics.slice(0, 4);
        } else {
          selectedTopics = (matched_topics.concat(matched_topics)).slice(0, 4);
        }
      }
      // Generate 4 weeks x 7 days
      const week_days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
      const num_weeks = 4;
      const weekly_plan = {};
      if (planType === 'fusion') {
        for (let week = 0; week < num_weeks; week++) {
          const week_key = `week_${week+1}`;
          weekly_plan[week_key] = {};
          for (let day_idx = 0; day_idx < 7; day_idx++) {
            const topic = selectedTopics[day_idx % selectedTopics.length];
            weekly_plan[week_key][week_days[day_idx]] = topic;
          }
        }
      } else {
        for (let week = 0; week < num_weeks; week++) {
          const week_key = `week_${week+1}`;
          weekly_plan[week_key] = {};
          for (let day_idx = 0; day_idx < 7; day_idx++) {
            const topic = selectedTopics[(week * 7 + day_idx) % selectedTopics.length];
            weekly_plan[week_key][week_days[day_idx]] = topic;
          }
        }
      }
      debugLog('🎉 STEP 6: MOCK PLAN GENERATION COMPLETE');
      debugLog(`📊 Generated ${Object.keys(weekly_plan).length} weeks of activities`);
      debugLog('✅ Plan ready for display!');
      
      return {
        success: true,
        data: {
          profile,
          weekly_plan
        }
      };
    }
  }

  /**
   * Query embeddings for similar content
   */
  async queryEmbeddings(query) {
    return this.request(config.ENDPOINTS.QUERY_EMBEDDINGS, {
      method: 'POST',
      body: { query }
    });
  }

  /**
   * Update embeddings in the vector store
   */
  async updateEmbeddings(embeddingText) {
    return this.request(config.ENDPOINTS.UPDATE_EMBEDDINGS, {
      method: 'POST',
      body: { embedding_text: embeddingText }
    });
  }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, status = 500, code = 'API_ERROR', details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export { ApiError };
export default apiService; 
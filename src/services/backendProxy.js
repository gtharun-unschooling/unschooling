/**
 * Backend Proxy Service
 * Handles all backend operations (warehouse and LLM) through the frontend
 * Makes it appear as if everything runs on port 3000
 */

// Configuration for backend services
const BACKEND_CONFIG = {
  // Google Cloud Run endpoints (when deployed)
  GOOGLE_CLOUD_RUN: {
    LLM_AGENTS: process.env.REACT_APP_LLM_ENDPOINT || 'https://llm-agents-xxxxx-uc.a.run.app',
    WAREHOUSE: process.env.REACT_APP_WAREHOUSE_ENDPOINT || 'https://warehouse-xxxxx-uc.a.run.app'
  },
  // Local development endpoints (fallback)
  LOCAL: {
    LLM_AGENTS: 'http://localhost:8000',
    WAREHOUSE: 'http://localhost:5001'
  }
};

// Determine which backend to use
const isProduction = process.env.NODE_ENV === 'production';
const useGoogleCloud = isProduction && process.env.REACT_APP_USE_GOOGLE_CLOUD === 'true';

class BackendProxy {
  constructor() {
    this.baseUrl = useGoogleCloud ? BACKEND_CONFIG.GOOGLE_CLOUD_RUN : BACKEND_CONFIG.LOCAL;
    this.isCloudRun = useGoogleCloud;
    console.log(`🌐 Backend Proxy initialized: ${useGoogleCloud ? 'Google Cloud Run' : 'Local Development'}`);
  }

  // Generic request method
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl[endpoint] || this.baseUrl.LLM_AGENTS}${options.path || ''}`;
    
    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ Backend request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // LLM Agent Operations
  async getTopics() {
    return this.makeRequest('LLM_AGENTS', { path: '/api/topics' });
  }

  async getEnhancedTopics() {
    return this.makeRequest('LLM_AGENTS', { path: '/api/topics/enhanced' });
  }

  async getTopicsByAgeGroup(ageGroup) {
    return this.makeRequest('LLM_AGENTS', { path: `/api/topics/by-age-group/${ageGroup}` });
  }

  async getTopicsByDifficulty(difficulty) {
    return this.makeRequest('LLM_AGENTS', { path: `/api/topics/by-difficulty/${difficulty}` });
  }

  async getTopicsByStage(stage) {
    return this.makeRequest('LLM_AGENTS', { path: `/api/topics/by-stage/${stage}` });
  }

  async getNiches() {
    return this.makeRequest('LLM_AGENTS', { path: '/api/niches' });
  }

  async generateLearningPlan(profile) {
    return this.makeRequest('LLM_AGENTS', {
      method: 'POST',
      path: '/api/generate-plan',
      body: profile
    });
  }

  // Warehouse Operations
  async getWarehouseStatus() {
    return this.makeRequest('WAREHOUSE', { path: '/api/warehouse/status' });
  }

  async runWarehouseSystem() {
    return this.makeRequest('WAREHOUSE', {
      method: 'POST',
      path: '/api/warehouse/run-system',
      body: {}
    });
  }

  async generateBusinessReport() {
    return this.makeRequest('WAREHOUSE', {
      method: 'POST',
      path: '/api/warehouse/generate-report',
      body: {}
    });
  }

  async runScalingAnalysis() {
    return this.makeRequest('WAREHOUSE', {
      method: 'POST',
      path: '/api/warehouse/scaling-analysis',
      body: {}
    });
  }

  async getWarehouseHealth() {
    return this.makeRequest('WAREHOUSE', { path: '/api/warehouse/health' });
  }

  // Health Check
  async healthCheck() {
    try {
      const [llmHealth, warehouseHealth] = await Promise.all([
        this.makeRequest('LLM_AGENTS', { path: '/health' }),
        this.makeRequest('WAREHOUSE', { path: '/api/warehouse/health' })
      ]);
      
      return {
        success: true,
        llm: llmHealth,
        warehouse: warehouseHealth,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get backend configuration info
  getConfig() {
    return {
      isCloudRun: this.isCloudRun,
      baseUrls: this.baseUrl,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };
  }
}

// Create singleton instance
const backendProxy = new BackendProxy();

export default backendProxy;

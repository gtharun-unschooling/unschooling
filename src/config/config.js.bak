/**
 * Frontend configuration for the Unschooling React application.
 * Handles environment variables, API endpoints, and application settings.
 */

// Environment detection
const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT || 'production';
const IS_LOCAL = ENVIRONMENT === 'local';
const IS_STAGING = ENVIRONMENT === 'staging';
const IS_PRODUCTION = ENVIRONMENT === 'production';

const config = {
  // Application Settings
  APP_NAME: process.env.REACT_APP_NAME || "Unschooling React",
  ENVIRONMENT: ENVIRONMENT,
  DEBUG: process.env.REACT_APP_DEBUG === "true",
  IS_LOCAL: IS_LOCAL,
  IS_STAGING: IS_STAGING,
  IS_PRODUCTION: IS_PRODUCTION,
  
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "https://llm-agents-44gsrw22gq-uc.a.run.app",
  WAREHOUSE_API_URL: process.env.REACT_APP_WAREHOUSE_API_URL || "https://warehouse-api-44gsrw22gq-uc.a.run.app",
  USE_LOCAL_BACKEND: process.env.REACT_APP_USE_LOCAL_BACKEND === "true",
  API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 90000,
  
  // Firebase Configuration
  FIREBASE: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBX2bZmOUosU-2PXZFQVN_WLLuee_zkFzI",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "unschooling-464413.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "unschooling-464413",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "unschooling-464413.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "790275794964",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:790275794964:web:f981a7f0693cc186631f01"
  },
  
  // API Endpoints
  ENDPOINTS: {
    HEALTH: "/health",
    GENERATE_PLAN: "/api/generate-plan",
    QUERY_EMBEDDINGS: "/api/embeddings/query",
    UPDATE_EMBEDDINGS: "/api/embeddings/update"
  },
  
  // Feature Flags
  FEATURES: {
    EMBEDDINGS_ENABLED: process.env.REACT_APP_EMBEDDINGS_ENABLED !== "false",
    PLAN_GENERATION_ENABLED: process.env.REACT_APP_PLAN_GENERATION_ENABLED !== "false",
    AUTHENTICATION_ENABLED: process.env.REACT_APP_AUTHENTICATION_ENABLED !== "false"
  },
  
  // UI Configuration
  UI: {
    LOADING_TIMEOUT: parseInt(process.env.REACT_APP_LOADING_TIMEOUT) || 100000,
    TOAST_DURATION: parseInt(process.env.REACT_APP_TOAST_DURATION) || 5000,
    MAX_RETRIES: parseInt(process.env.REACT_APP_MAX_RETRIES) || 3
  }
};

// Helper functions
export const getApiUrl = (endpoint) => {
  return `${config.API_BASE_URL}${endpoint}`;
};

export const getWarehouseApiUrl = (endpoint) => {
  return `${config.WAREHOUSE_API_URL}${endpoint}`;
};

export const isFeatureEnabled = (feature) => {
  return config.FEATURES[feature] !== false;
};

export const getFirebaseConfig = () => {
  return config.FIREBASE;
};

export const getEnvironmentInfo = () => {
  return {
    environment: config.ENVIRONMENT,
    isLocal: config.IS_LOCAL,
    isStaging: config.IS_STAGING,
    isProduction: config.IS_PRODUCTION,
    debug: config.DEBUG,
    apiBaseUrl: config.API_BASE_URL,
    warehouseApiUrl: config.WAREHOUSE_API_URL,
    useLocalBackend: config.USE_LOCAL_BACKEND
  };
};

export const logEnvironmentInfo = () => {
  if (config.DEBUG) {
    console.log('🌍 Environment Configuration:', getEnvironmentInfo());
  }
};

export default config; 
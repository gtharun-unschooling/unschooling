import { db } from '../firebase.js';
import { collection, addDoc, getDocs, query, where, orderBy, limit, onSnapshot, doc, updateDoc, serverTimestamp, deleteDoc, writeBatch } from 'firebase/firestore';

class ComprehensiveLoggingService {
  constructor() {
    this.logsCollection = 'comprehensive_logs';
    this.profileLogsCollection = 'profile_logs';
    this.backendLogsCollection = 'backend_logs';
    this.sessionId = this.generateSessionId();
    this.userJourneySteps = new Map(); // Track user journey steps
    this.logBuffer = []; // Buffer for batching logs
    this.bufferSize = 10; // Flush buffer every 10 logs
    this.flushInterval = 30000; // Flush buffer every 30 seconds
    this.importantSteps = new Set([
      'user_login',
      'user_logout', 
      'profile_created',
      'plan_generated',
      'payment_completed',
      'error_occurred'
    ]); // Only log these important steps to Firestore
    
    // Start periodic buffer flush
    setInterval(() => this.flushBuffer(), this.flushInterval);
  }

  // Generate unique session ID
  generateSessionId() {
    let sessionId = sessionStorage.getItem('comprehensive_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('comprehensive_session_id', sessionId);
    }
    return sessionId;
  }

  // Clear all logs from ALL collections
  async clearAllLogs() {
    try {
      console.log('🗑️ Clearing all logs from ALL Firestore collections...');
      
      // Clear comprehensive_logs collection
      const comprehensiveRef = collection(db, this.logsCollection);
      const comprehensiveSnapshot = await getDocs(comprehensiveRef);
      
      // Clear profile_creation_logs collection
      const profileRef = collection(db, this.profileLogsCollection);
      const profileSnapshot = await getDocs(profileRef);
      
      // Clear backend_interaction_logs collection
      const backendRef = collection(db, this.backendLogsCollection);
      const backendSnapshot = await getDocs(backendRef);
      
      // Clear debug_logs collection
      const debugRef = collection(db, this.debugLogsCollection);
      const debugSnapshot = await getDocs(debugRef);
      
      // Combine all documents to delete
      const allDocs = [
        ...comprehensiveSnapshot.docs,
        ...profileSnapshot.docs,
        ...backendSnapshot.docs,
        ...debugSnapshot.docs
      ];
      
      if (allDocs.length === 0) {
        console.log('ℹ️ No logs found to clear in any collection');
        return true;
      }
      
      console.log(`🗑️ Found ${allDocs.length} logs to clear:`);
      console.log(`   - ${comprehensiveSnapshot.size} from comprehensive_logs`);
      console.log(`   - ${profileSnapshot.size} from profile_creation_logs`);
      console.log(`   - ${backendSnapshot.size} from backend_interaction_logs`);
      console.log(`   - ${debugSnapshot.size} from debug_logs`);
      
      // Use batch to delete all documents
      const batch = writeBatch(db);
      allDocs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`✅ Successfully cleared ${allDocs.length} logs from ALL collections`);
      return true;
    } catch (error) {
      console.error('❌ Error clearing all logs:', error);
      return false;
    }
  }

  async clearLogsBeforeTimestamp(timestamp) {
    try {
      console.log(`🗑️ Clearing old logs before timestamp: ${timestamp.toISOString()} from ALL collections...`);
      
      // Clear old logs from comprehensive_logs collection
      const comprehensiveRef = collection(db, this.logsCollection);
      const comprehensiveQuery = query(comprehensiveRef, where('timestamp', '<', timestamp));
      const comprehensiveSnapshot = await getDocs(comprehensiveQuery);
      
      // Clear old logs from profile_creation_logs collection
      const profileRef = collection(db, this.profileLogsCollection);
      const profileQuery = query(profileRef, where('timestamp', '<', timestamp));
      const profileSnapshot = await getDocs(profileQuery);
      
      // Clear old logs from backend_interaction_logs collection
      const backendRef = collection(db, this.backendLogsCollection);
      const backendQuery = query(backendRef, where('timestamp', '<', timestamp));
      const backendSnapshot = await getDocs(backendQuery);
      
      // Clear old logs from debug_logs collection
      const debugRef = collection(db, this.debugLogsCollection);
      const debugQuery = query(debugRef, where('timestamp', '<', timestamp));
      const debugSnapshot = await getDocs(debugQuery);
      
      // Combine all old documents to delete
      const allOldDocs = [
        ...comprehensiveSnapshot.docs,
        ...profileSnapshot.docs,
        ...backendSnapshot.docs,
        ...debugSnapshot.docs
      ];
      
      if (allOldDocs.length === 0) {
        console.log('ℹ️ No old logs found to clear in any collection');
        return true;
      }
      
      console.log(`🗑️ Found ${allOldDocs.length} old logs to clear:`);
      console.log(`   - ${comprehensiveSnapshot.size} from comprehensive_logs`);
      console.log(`   - ${profileSnapshot.size} from profile_creation_logs`);
      console.log(`   - ${backendSnapshot.size} from backend_interaction_logs`);
      console.log(`   - ${debugSnapshot.size} from debug_logs`);
      
      // Use batch to delete all old documents
      const batch = writeBatch(db);
      allOldDocs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`✅ Successfully cleared ${allOldDocs.length} old logs from ALL collections`);
      return true;
    } catch (error) {
      console.error('❌ Error clearing old logs:', error);
      return false;
    }
  }

  // Track user journey step
  trackUserJourneyStep(userId, step, data = {}) {
    const journeyKey = `${userId}_${this.sessionId}`;
    const currentSteps = this.userJourneySteps.get(journeyKey) || [];
    const stepNumber = currentSteps.length + 1;
    
    const journeyStep = {
      stepNumber,
      step,
      timestamp: new Date(),
      data,
      sessionId: this.sessionId
    };
    
    currentSteps.push(journeyStep);
    this.userJourneySteps.set(journeyKey, currentSteps);
    
    return stepNumber;
  }

  // Log user journey step with clear description
  async logUserJourneyStep(userId, step, description, data = {}) {
    try {
      const stepNumber = this.trackUserJourneyStep(userId, step, data);
      
      // Only log to Firestore if it's an important step
      if (this.importantSteps.has(step)) {
        const logEntry = {
          type: 'user_journey',
          stepNumber,
          step,
          description,
          userId,
          sessionId: this.sessionId,
          data: this.sanitizeData(data),
          timestamp: serverTimestamp(),
          browserInfo: this.getBrowserInfo(),
          url: window.location.href,
          userAgent: navigator.userAgent
        };

        await this.bufferLog(logEntry);
        console.log(`👤 User Journey Step ${stepNumber}: ${description} (IMPORTANT - logged to Firestore)`, { userId, step });
      } else {
        // For non-important steps, just log to console
        console.log(`👤 User Journey Step ${stepNumber}: ${description} (console only)`, { userId, step });
      }
      
      return stepNumber;
    } catch (error) {
      console.error('User journey logging error:', error);
    }
  }

  // Log profile creation with clear step-by-step journey
  async logProfileCreation(userId, step, description, profileData = {}) {
    try {
      const logEntry = {
        type: 'profile_creation',
        step,
        description,
        userId,
        sessionId: this.sessionId,
        profileData: this.sanitizeData(profileData),
        timestamp: serverTimestamp(),
        browserInfo: this.getBrowserInfo(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      const docRef = await addDoc(collection(db, this.profileLogsCollection), logEntry);
      console.log(`📝 Profile Creation: ${description}`, { userId, step });
      
      // Also log to comprehensive logs
      await this.logUserJourneyStep(userId, step, description, profileData);
      
      return docRef.id;
    } catch (error) {
      console.error('Profile creation logging error:', error);
    }
  }

  // Log backend interactions with clear step tracking
  async logBackendInteraction(endpoint, step, description, requestData, responseData, userId, processingTime = null) {
    try {
      const logEntry = {
        type: 'backend_interaction',
        step,
        description,
        endpoint,
        userId,
        sessionId: this.sessionId,
        requestData: this.sanitizeData(requestData),
        responseData: this.sanitizeData(responseData),
        processingTime,
        timestamp: serverTimestamp(),
        status: responseData ? 'success' : 'error',
        browserInfo: this.getBrowserInfo(),
        url: window.location.href
      };

      const docRef = await addDoc(collection(db, this.backendLogsCollection), logEntry);
      console.log(`🌐 Backend Interaction: ${description}`, { userId, endpoint, processingTime });
      
      // Also log to comprehensive logs
      await this.logUserJourneyStep(userId, step, description, {
        endpoint,
        requestData,
        responseData,
        processingTime
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Backend interaction logging error:', error);
    }
  }

  // Log debug information with context
  async logDebugInfo(message, context = {}, userId = null, level = 'info') {
    try {
      const logEntry = {
        type: 'debug',
        level,
        message,
        context: this.sanitizeData(context),
        userId: userId || this.getUserId(),
        sessionId: this.sessionId,
        timestamp: serverTimestamp(),
        browserInfo: this.getBrowserInfo(),
        url: window.location.href,
        stackTrace: level === 'error' ? new Error().stack : null
      };

      const docRef = await addDoc(collection(db, this.debugLogsCollection), logEntry);
      console.log(`🐛 Debug: ${level} - ${message}`, context);
      
      return docRef.id;
    } catch (error) {
      console.error('Debug logging error:', error);
    }
  }

  // Get all logs for admin dashboard with better organization
  async getAllLogs(timeRange = 'all', logType = 'all') {
    try {
      let logs = [];

      if (logType === 'all' || logType === 'user_journey') {
        const journeyQuery = query(
          collection(db, this.logsCollection),
          where('type', '==', 'user_journey'),
          orderBy('timestamp', 'asc')
        );
        const journeySnapshot = await getDocs(journeyQuery);
        logs.push(...journeySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          logType: 'user_journey'
        })));
      }

      if (logType === 'all' || logType === 'profile') {
        const profileQuery = query(
          collection(db, this.profileLogsCollection),
          orderBy('timestamp', 'asc')
        );
        const profileSnapshot = await getDocs(profileQuery);
        logs.push(...profileSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          logType: 'profile_creation'
        })));
      }

      if (logType === 'all' || logType === 'backend') {
        const backendQuery = query(
          collection(db, this.backendLogsCollection),
          orderBy('timestamp', 'asc')
        );
        const backendSnapshot = await getDocs(backendQuery);
        logs.push(...backendSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          logType: 'backend_interaction'
        })));
      }

      if (logType === 'all' || logType === 'debug') {
        const debugQuery = query(
          collection(db, this.debugLogsCollection),
          orderBy('timestamp', 'asc')
        );
        const debugSnapshot = await getDocs(debugQuery);
        logs.push(...debugSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          logType: 'debug'
        })));
      }

      return logs.sort((a, b) => a.timestamp?.toDate() - b.timestamp?.toDate());
    } catch (error) {
      console.error('Logs retrieval error:', error);
      return [];
    }
  }

  // Get logs for specific user
  async getUserLogs(userId, timeRange = '24h') {
    try {
      const now = new Date();
      const hoursAgo = timeRange === '1h' ? 1 : timeRange === '6h' ? 6 : 24;
      const startTime = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));

      const q = query(
        collection(db, this.logsCollection),
        where('userId', '==', userId),
        where('timestamp', '>=', startTime),
        orderBy('timestamp', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('User logs retrieval error:', error);
      return [];
    }
  }

  // Get real-time logs
  setupRealTimeLogs(callback, timeRange = 'all') {
    console.log('🔄 Setting up real-time listeners for all log collections...');

    // Set up listeners for all collections
    const unsubscribers = [];
    let allLogs = [];
    let updateTimeout;

    // Helper function to combine and sort all logs with debouncing
    const updateCombinedLogs = () => {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => {
        const combinedLogs = [...allLogs].sort((a, b) => {
          const aTime = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
          const bTime = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
          return aTime - bTime;
        });
        console.log('📝 Combined logs update:', combinedLogs.length);
        callback(combinedLogs);
      }, 2000); // 2 second debounce to prevent excessive updates
    };

    // Main logs collection (user journey)
    const mainQuery = query(
      collection(db, this.logsCollection),
      orderBy('timestamp', 'asc'),
      limit(50)
    );
    const mainUnsubscribe = onSnapshot(mainQuery, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        logType: 'user_journey'
      }));
      console.log('📝 Main logs update:', logs.length);
      allLogs = allLogs.filter(log => log.logType !== 'user_journey').concat(logs);
      updateCombinedLogs();
    });
    unsubscribers.push(mainUnsubscribe);

    // Profile logs collection
    const profileQuery = query(
      collection(db, this.profileLogsCollection),
      orderBy('timestamp', 'asc'),
      limit(50)
    );
    const profileUnsubscribe = onSnapshot(profileQuery, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        logType: 'profile_creation'
      }));
      console.log('📝 Profile logs update:', logs.length);
      allLogs = allLogs.filter(log => log.logType !== 'profile_creation').concat(logs);
      updateCombinedLogs();
    });
    unsubscribers.push(profileUnsubscribe);

    // Backend logs collection
    const backendQuery = query(
      collection(db, this.backendLogsCollection),
      orderBy('timestamp', 'asc'),
      limit(50)
    );
    const backendUnsubscribe = onSnapshot(backendQuery, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        logType: 'backend_interaction'
      }));
      console.log('📝 Backend logs update:', logs.length);
      allLogs = allLogs.filter(log => log.logType !== 'backend_interaction').concat(logs);
      updateCombinedLogs();
    });
    unsubscribers.push(backendUnsubscribe);

    // Debug logs collection
    const debugQuery = query(
      collection(db, this.debugLogsCollection),
      orderBy('timestamp', 'asc'),
      limit(50)
    );
    const debugUnsubscribe = onSnapshot(debugQuery, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        logType: 'debug'
      }));
      console.log('📝 Debug logs update:', logs.length);
      allLogs = allLogs.filter(log => log.logType !== 'debug').concat(logs);
      updateCombinedLogs();
    });
    unsubscribers.push(debugUnsubscribe);

    // Return cleanup function
    return () => {
      console.log('🧹 Cleaning up all real-time listeners...');
      clearTimeout(updateTimeout);
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }

  // Helper methods
  getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenWidth: screen.width,
      screenHeight: screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
  }

  sanitizeData(data) {
    try {
      // Remove circular references and non-serializable objects
      const sanitized = JSON.parse(JSON.stringify(data));
      return sanitized;
    } catch (error) {
      // If sanitization fails, return a simplified version
      return {
        type: typeof data,
        hasData: !!data,
        error: 'Data could not be serialized'
      };
    }
  }

  getUserId() {
    // Try to get user ID from various sources
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('user_id') || 'anonymous';
    }
    return 'anonymous';
  }

  logError(activityType, userId, action, errorMessage) {
    return this.logDebugInfo(`Error in ${activityType}: ${action}`, {
      error: errorMessage,
      activityType,
      action
    }, userId, 'error');
  }

  // Buffer logs for batching
  bufferLog(logEntry) {
    this.logBuffer.push(logEntry);
    if (this.logBuffer.length >= this.bufferSize) {
      this.flushBuffer();
    }
  }

  // Flush buffer to Firestore
  async flushBuffer() {
    if (this.logBuffer.length === 0) {
      return;
    }

    const batch = writeBatch(db);
    const logsToFlush = [...this.logBuffer];
    this.logBuffer = []; // Clear buffer after flushing

    for (const logEntry of logsToFlush) {
      const docRef = await addDoc(collection(db, this.logsCollection), logEntry);
      console.log(`💾 Flushed log to Firestore: ${logEntry.type} - ${logEntry.description || logEntry.message}`);
    }
  }

  // Manual flush buffer
  async manualFlush() {
    console.log('🔄 Manually flushing log buffer...');
    await this.flushBuffer();
    console.log('✅ Manual flush completed');
  }

  // Log important events directly to Firestore
  async logImportantEvent(type, description, data = {}, userId = null) {
    if (!this.importantSteps.has(type)) {
      console.warn(`Skipping important event: ${type} as it's not in the importantSteps set.`);
      return;
    }

    const logEntry = {
      type,
      description,
      userId: userId || this.getUserId(),
      sessionId: this.sessionId,
      data: this.sanitizeData(data),
      timestamp: serverTimestamp(),
      browserInfo: this.getBrowserInfo(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    await this.bufferLog(logEntry); // Use buffer for consistency
    console.log(`🔑 Important Event: ${description}`, { type, userId });
  }

  // Clear current session logs and reset counter
  clearCurrentSession() {
    console.log('🧹 Clearing current session logs and resetting counter...');
    this.userJourneySteps.clear();
    this.logBuffer = [];
    sessionStorage.removeItem('comprehensive_session_id');
    this.sessionId = this.generateSessionId();
    console.log('✅ Current session cleared and reset');
  }

  // Get current session stats
  getSessionStats() {
    const totalSteps = Array.from(this.userJourneySteps.values()).reduce((sum, steps) => sum + steps.length, 0);
    const bufferedLogs = this.logBuffer.length;
    
    return {
      sessionId: this.sessionId,
      totalSteps,
      bufferedLogs,
      collections: {
        logs: this.logsCollection,
        profile: this.profileLogsCollection,
        backend: this.backendLogsCollection
      }
    };
  }

}

// Create singleton instance
const comprehensiveLoggingService = new ComprehensiveLoggingService();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.loggingService = comprehensiveLoggingService;
  
  // Add console commands for debugging
  console.log('🔧 Logging Service Debug Commands Available:');
  console.log('  - window.loggingService.clearCurrentSession() - Clear current session');
  console.log('  - window.loggingService.getSessionStats() - Get session statistics');
  console.log('  - window.loggingService.manualFlush() - Manually flush log buffer');
  console.log('  - window.loggingService.importantSteps - View important step types');
}

export default comprehensiveLoggingService; 
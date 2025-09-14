/**
 * Agent Metrics Service
 * Handles real-time agent performance data collection and storage
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
  addDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

class AgentMetricsService {
  constructor() {
    this.collections = {
      agentMetrics: 'agent_metrics',
      childPerformance: 'child_performance',
      agentExecutions: 'agent_executions',
      systemHealth: 'system_health'
    };
  }

  /**
   * Record agent execution metrics
   */
  async recordAgentExecution(executionData) {
    try {
      const {
        childId,
        childName,
        userId,
        agentName,
        executionTime,
        success,
        error,
        inputData,
        outputData,
        tokensUsed,
        llmUsed
      } = executionData;

      const executionRecord = {
        childId,
        childName,
        userId,
        agentName,
        executionTime,
        success,
        error: error || null,
        inputData: this.sanitizeData(inputData),
        outputData: this.sanitizeData(outputData),
        tokensUsed: tokensUsed || 0,
        llmUsed: llmUsed || false,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        hour: new Date().getHours()
      };

      // Store in agent_executions collection
      const docRef = await addDoc(collection(db, this.collections.agentExecutions), executionRecord);
      
      // Update real-time metrics
      await this.updateRealTimeMetrics(executionRecord);
      
      // Update child-specific metrics
      await this.updateChildMetrics(childId, agentName, executionRecord);
      
      console.log('✅ Agent execution recorded:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error recording agent execution:', error);
      throw error;
    }
  }

  /**
   * Update real-time metrics for admin dashboard
   */
  async updateRealTimeMetrics(executionRecord) {
    try {
      const { agentName, success, executionTime, date, hour } = executionRecord;
      
      const metricsRef = doc(db, this.collections.agentMetrics, `${agentName}_${date}`);
      
      // Get existing metrics or create new
      const existingMetrics = await this.getAgentMetrics(agentName, date);
      
      const updatedMetrics = {
        agentName,
        date,
        totalExecutions: (existingMetrics?.totalExecutions || 0) + 1,
        successfulExecutions: (existingMetrics?.successfulExecutions || 0) + (success ? 1 : 0),
        failedExecutions: (existingMetrics?.failedExecutions || 0) + (success ? 0 : 1),
        totalExecutionTime: (existingMetrics?.totalExecutionTime || 0) + executionTime,
        averageExecutionTime: 0, // Will be calculated
        successRate: 0, // Will be calculated
        lastExecution: serverTimestamp(),
        hourlyBreakdown: {
          ...existingMetrics?.hourlyBreakdown,
          [hour]: {
            executions: (existingMetrics?.hourlyBreakdown?.[hour]?.executions || 0) + 1,
            success: (existingMetrics?.hourlyBreakdown?.[hour]?.success || 0) + (success ? 1 : 0),
            totalTime: (existingMetrics?.hourlyBreakdown?.[hour]?.totalTime || 0) + executionTime
          }
        },
        updatedAt: serverTimestamp()
      };

      // Calculate derived metrics
      updatedMetrics.averageExecutionTime = updatedMetrics.totalExecutionTime / updatedMetrics.totalExecutions;
      updatedMetrics.successRate = (updatedMetrics.successfulExecutions / updatedMetrics.totalExecutions) * 100;

      await setDoc(metricsRef, updatedMetrics, { merge: true });
      
    } catch (error) {
      console.error('❌ Error updating real-time metrics:', error);
    }
  }

  /**
   * Update child-specific performance metrics
   */
  async updateChildMetrics(childId, agentName, executionRecord) {
    try {
      const { success, executionTime, childName } = executionRecord;
      
      const childMetricsRef = doc(db, this.collections.childPerformance, `${childId}_${agentName}`);
      
      const existingMetrics = await this.getChildMetrics(childId, agentName);
      
      const updatedMetrics = {
        childId,
        childName,
        agentName,
        totalExecutions: (existingMetrics?.totalExecutions || 0) + 1,
        successfulExecutions: (existingMetrics?.successfulExecutions || 0) + (success ? 1 : 0),
        failedExecutions: (existingMetrics?.failedExecutions || 0) + (success ? 0 : 1),
        totalExecutionTime: (existingMetrics?.totalExecutionTime || 0) + executionTime,
        averageExecutionTime: 0,
        successRate: 0,
        lastExecution: serverTimestamp(),
        performanceHistory: [
          ...(existingMetrics?.performanceHistory || []).slice(-29), // Keep last 30 entries
          {
            timestamp: serverTimestamp(),
            executionTime,
            success,
            date: executionRecord.date
          }
        ],
        updatedAt: serverTimestamp()
      };

      // Calculate derived metrics
      updatedMetrics.averageExecutionTime = updatedMetrics.totalExecutionTime / updatedMetrics.totalExecutions;
      updatedMetrics.successRate = (updatedMetrics.successfulExecutions / updatedMetrics.totalExecutions) * 100;

      await setDoc(childMetricsRef, updatedMetrics, { merge: true });
      
    } catch (error) {
      console.error('❌ Error updating child metrics:', error);
    }
  }

  /**
   * Get real-time agent metrics for admin dashboard
   */
  async getAgentMetrics(agentName = null, date = null) {
    try {
      let q = collection(db, this.collections.agentMetrics);
      
      if (agentName && date) {
        const docRef = doc(db, this.collections.agentMetrics, `${agentName}_${date}`);
        const docSnap = await getDocs(docRef);
        return docSnap.exists() ? docSnap.data() : null;
      }
      
      if (agentName) {
        q = query(q, where('agentName', '==', agentName));
      }
      
      q = query(q, orderBy('date', 'desc'), limit(30)); // Last 30 days
      
      const snapshot = await getDocs(q);
      const metrics = [];
      
      snapshot.forEach(doc => {
        metrics.push({ id: doc.id, ...doc.data() });
      });
      
      return metrics;
    } catch (error) {
      console.error('❌ Error getting agent metrics:', error);
      return [];
    }
  }

  /**
   * Get child-specific metrics
   */
  async getChildMetrics(childId, agentName = null) {
    try {
      let q = collection(db, this.collections.childPerformance);
      
      if (childId && agentName) {
        const docRef = doc(db, this.collections.childPerformance, `${childId}_${agentName}`);
        const docSnap = await getDocs(docRef);
        return docSnap.exists() ? docSnap.data() : null;
      }
      
      if (childId) {
        q = query(q, where('childId', '==', childId));
      }
      
      const snapshot = await getDocs(q);
      const metrics = [];
      
      snapshot.forEach(doc => {
        metrics.push({ id: doc.id, ...doc.data() });
      });
      
      return metrics;
    } catch (error) {
      console.error('❌ Error getting child metrics:', error);
      return [];
    }
  }

  /**
   * Get all children with their performance data
   */
  async getAllChildrenWithMetrics() {
    try {
      // Get all unique children from child_performance collection
      const snapshot = await getDocs(collection(db, this.collections.childPerformance));
      const childrenMap = new Map();
      
      snapshot.forEach(doc => {
        const data = doc.data();
        const { childId, childName } = data;
        
        if (!childrenMap.has(childId)) {
          childrenMap.set(childId, {
            id: childId,
            name: childName,
            agents: {}
          });
        }
        
        childrenMap.get(childId).agents[data.agentName] = data;
      });
      
      return Array.from(childrenMap.values());
    } catch (error) {
      console.error('❌ Error getting all children with metrics:', error);
      return [];
    }
  }

  /**
   * Get system health metrics
   */
  async getSystemHealthMetrics() {
    try {
      const snapshot = await getDocs(collection(db, this.collections.systemHealth));
      const healthData = [];
      
      snapshot.forEach(doc => {
        healthData.push({ id: doc.id, ...doc.data() });
      });
      
      return healthData;
    } catch (error) {
      console.error('❌ Error getting system health metrics:', error);
      return [];
    }
  }

  /**
   * Record system health check
   */
  async recordSystemHealth(healthData) {
    try {
      const healthRecord = {
        ...healthData,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      };
      
      await addDoc(collection(db, this.collections.systemHealth), healthRecord);
    } catch (error) {
      console.error('❌ Error recording system health:', error);
    }
  }

  /**
   * Sanitize data for Firestore storage
   */
  sanitizeData(data) {
    if (!data) return null;
    
    try {
      // Convert to JSON and back to remove any non-serializable objects
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      console.warn('⚠️ Could not sanitize data:', error);
      return null;
    }
  }

  /**
   * Subscribe to real-time metrics updates
   */
  subscribeToMetrics(callback) {
    const q = query(
      collection(db, this.collections.agentMetrics),
      orderBy('updatedAt', 'desc'),
      limit(10)
    );
    
    return onSnapshot(q, callback);
  }

  /**
   * Subscribe to child performance updates
   */
  subscribeToChildPerformance(childId, callback) {
    const q = query(
      collection(db, this.collections.childPerformance),
      where('childId', '==', childId)
    );
    
    return onSnapshot(q, callback);
  }
}

// Export singleton instance
export const agentMetricsService = new AgentMetricsService();
export default agentMetricsService;

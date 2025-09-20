/**
 * Customer Tracking Service
 * Tracks all customer interactions, agent usage, and costs
 */

import { collection, addDoc, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

class CustomerTrackingService {
  constructor() {
    this.collections = {
      customerInteractions: 'customer_interactions',
      agentExecutions: 'agent_executions',
      costTracking: 'cost_tracking',
      userSessions: 'user_sessions',
      learningPlans: 'learning_plans',
      systemEvents: 'system_events'
    };
  }

  // Track customer interaction
  async trackCustomerInteraction(interaction) {
    try {
      const interactionData = {
        userId: interaction.userId,
        childId: interaction.childId,
        action: interaction.action,
        details: interaction.details,
        timestamp: Timestamp.now(),
        sessionId: interaction.sessionId,
        userAgent: navigator.userAgent,
        ipAddress: interaction.ipAddress || 'unknown',
        cost: interaction.cost || 0,
        tokensUsed: interaction.tokensUsed || 0,
        responseTime: interaction.responseTime || 0,
        success: interaction.success !== false,
        error: interaction.error || null,
        metadata: interaction.metadata || {}
      };

      const docRef = await addDoc(collection(db, this.collections.customerInteractions), interactionData);
      console.log('Customer interaction tracked:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error tracking customer interaction:', error);
      throw error;
    }
  }

  // Track agent execution
  async trackAgentExecution(execution) {
    try {
      const executionData = {
        agentName: execution.agentName,
        userId: execution.userId,
        childId: execution.childId,
        inputData: execution.inputData,
        outputData: execution.outputData,
        executionTime: execution.executionTime,
        tokensUsed: execution.tokensUsed,
        cost: execution.cost,
        success: execution.success,
        error: execution.error,
        timestamp: Timestamp.now(),
        sessionId: execution.sessionId,
        requestId: execution.requestId,
        metadata: execution.metadata || {}
      };

      const docRef = await addDoc(collection(db, this.collections.agentExecutions), executionData);
      console.log('Agent execution tracked:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error tracking agent execution:', error);
      throw error;
    }
  }

  // Track cost
  async trackCost(costData) {
    try {
      const cost = {
        service: costData.service, // 'gemini', 'cloudrun', 'firebase'
        userId: costData.userId,
        childId: costData.childId,
        amount: costData.amount,
        tokens: costData.tokens,
        requestId: costData.requestId,
        timestamp: Timestamp.now(),
        description: costData.description,
        metadata: costData.metadata || {}
      };

      const docRef = await addDoc(collection(db, this.collections.costTracking), cost);
      console.log('Cost tracked:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error tracking cost:', error);
      throw error;
    }
  }

  // Track user session
  async trackUserSession(session) {
    try {
      const sessionData = {
        userId: session.userId,
        startTime: Timestamp.now(),
        endTime: null,
        duration: 0,
        actions: [],
        totalCost: 0,
        totalTokens: 0,
        userAgent: navigator.userAgent,
        ipAddress: session.ipAddress || 'unknown',
        metadata: session.metadata || {}
      };

      const docRef = await addDoc(collection(db, this.collections.userSessions), sessionData);
      console.log('User session tracked:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error tracking user session:', error);
      throw error;
    }
  }

  // Track learning plan generation
  async trackLearningPlan(plan) {
    try {
      const planData = {
        userId: plan.userId,
        childId: plan.childId,
        childProfile: plan.childProfile,
        generatedPlan: plan.generatedPlan,
        topicsMatched: plan.topicsMatched,
        totalCost: plan.totalCost,
        totalTokens: plan.totalTokens,
        executionTime: plan.executionTime,
        timestamp: Timestamp.now(),
        sessionId: plan.sessionId,
        metadata: plan.metadata || {}
      };

      const docRef = await addDoc(collection(db, this.collections.learningPlans), planData);
      console.log('Learning plan tracked:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error tracking learning plan:', error);
      throw error;
    }
  }

  // Track system event
  async trackSystemEvent(event) {
    try {
      const eventData = {
        eventType: event.eventType,
        severity: event.severity,
        message: event.message,
        details: event.details,
        timestamp: Timestamp.now(),
        metadata: event.metadata || {}
      };

      const docRef = await addDoc(collection(db, this.collections.systemEvents), eventData);
      console.log('System event tracked:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error tracking system event:', error);
      throw error;
    }
  }

  // Get customer analytics
  async getCustomerAnalytics(userId, timeRange = '7d') {
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - this.getTimeRangeMs(timeRange));
      
      const interactionsQuery = query(
        collection(db, this.collections.customerInteractions),
        where('userId', '==', userId),
        where('timestamp', '>=', Timestamp.fromDate(startTime)),
        orderBy('timestamp', 'desc')
      );

      const sessionsQuery = query(
        collection(db, this.collections.userSessions),
        where('userId', '==', userId),
        where('startTime', '>=', Timestamp.fromDate(startTime)),
        orderBy('startTime', 'desc')
      );

      const [interactionsSnapshot, sessionsSnapshot] = await Promise.all([
        getDocs(interactionsQuery),
        getDocs(sessionsQuery)
      ]);

      const interactions = interactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const sessions = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        interactions,
        sessions,
        totalInteractions: interactions.length,
        totalSessions: sessions.length,
        totalCost: interactions.reduce((sum, i) => sum + (i.cost || 0), 0),
        totalTokens: interactions.reduce((sum, i) => sum + (i.tokensUsed || 0), 0),
        averageResponseTime: interactions.reduce((sum, i) => sum + (i.responseTime || 0), 0) / interactions.length || 0,
        successRate: (interactions.filter(i => i.success).length / interactions.length * 100) || 0
      };
    } catch (error) {
      console.error('Error getting customer analytics:', error);
      throw error;
    }
  }

  // Get agent performance analytics
  async getAgentPerformanceAnalytics(timeRange = '7d') {
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - this.getTimeRangeMs(timeRange));
      
      const executionsQuery = query(
        collection(db, this.collections.agentExecutions),
        where('timestamp', '>=', Timestamp.fromDate(startTime)),
        orderBy('timestamp', 'desc')
      );

      const executionsSnapshot = await getDocs(executionsQuery);
      const executions = executionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Group by agent
      const agentStats = {};
      executions.forEach(execution => {
        const agentName = execution.agentName;
        if (!agentStats[agentName]) {
          agentStats[agentName] = {
            totalExecutions: 0,
            successfulExecutions: 0,
            totalCost: 0,
            totalTokens: 0,
            totalExecutionTime: 0,
            errors: []
          };
        }

        agentStats[agentName].totalExecutions++;
        if (execution.success) {
          agentStats[agentName].successfulExecutions++;
        }
        agentStats[agentName].totalCost += execution.cost || 0;
        agentStats[agentName].totalTokens += execution.tokensUsed || 0;
        agentStats[agentName].totalExecutionTime += execution.executionTime || 0;
        
        if (execution.error) {
          agentStats[agentName].errors.push(execution.error);
        }
      });

      // Calculate metrics
      Object.keys(agentStats).forEach(agentName => {
        const stats = agentStats[agentName];
        stats.successRate = (stats.successfulExecutions / stats.totalExecutions * 100).toFixed(2);
        stats.averageExecutionTime = (stats.totalExecutionTime / stats.totalExecutions).toFixed(2);
        stats.averageCost = (stats.totalCost / stats.totalExecutions).toFixed(4);
        stats.averageTokens = Math.round(stats.totalTokens / stats.totalExecutions);
        stats.errorRate = (stats.errors.length / stats.totalExecutions * 100).toFixed(2);
      });

      return agentStats;
    } catch (error) {
      console.error('Error getting agent performance analytics:', error);
      throw error;
    }
  }

  // Get cost analytics
  async getCostAnalytics(timeRange = '7d') {
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - this.getTimeRangeMs(timeRange));
      
      const costsQuery = query(
        collection(db, this.collections.costTracking),
        where('timestamp', '>=', Timestamp.fromDate(startTime)),
        orderBy('timestamp', 'desc')
      );

      const costsSnapshot = await getDocs(costsQuery);
      const costs = costsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Group by service
      const serviceStats = {};
      costs.forEach(cost => {
        const service = cost.service;
        if (!serviceStats[service]) {
          serviceStats[service] = {
            totalCost: 0,
            totalTokens: 0,
            requestCount: 0
          };
        }

        serviceStats[service].totalCost += cost.amount || 0;
        serviceStats[service].totalTokens += cost.tokens || 0;
        serviceStats[service].requestCount++;
      });

      // Calculate totals
      const totalCost = Object.values(serviceStats).reduce((sum, stats) => sum + stats.totalCost, 0);
      const totalTokens = Object.values(serviceStats).reduce((sum, stats) => sum + stats.totalTokens, 0);
      const totalRequests = Object.values(serviceStats).reduce((sum, stats) => sum + stats.requestCount, 0);

      return {
        serviceStats,
        totalCost,
        totalTokens,
        totalRequests,
        averageCostPerRequest: totalRequests > 0 ? (totalCost / totalRequests).toFixed(4) : 0,
        averageTokensPerRequest: totalRequests > 0 ? Math.round(totalTokens / totalRequests) : 0
      };
    } catch (error) {
      console.error('Error getting cost analytics:', error);
      throw error;
    }
  }

  // Helper method to get time range in milliseconds
  getTimeRangeMs(timeRange) {
    switch (timeRange) {
      case '1h': return 60 * 60 * 1000;
      case '24h': return 24 * 60 * 60 * 1000;
      case '7d': return 7 * 24 * 60 * 60 * 1000;
      case '30d': return 30 * 24 * 60 * 60 * 1000;
      default: return 7 * 24 * 60 * 60 * 1000;
    }
  }

  // Get recent activity
  async getRecentActivity(limit = 50) {
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
      
      const interactionsQuery = query(
        collection(db, this.collections.customerInteractions),
        where('timestamp', '>=', Timestamp.fromDate(startTime)),
        orderBy('timestamp', 'desc'),
        limit(limit)
      );

      const interactionsSnapshot = await getDocs(interactionsQuery);
      return interactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting recent activity:', error);
      throw error;
    }
  }

  // Export data
  async exportData(format = 'json', timeRange = '7d') {
    try {
      const [customerAnalytics, agentPerformance, costAnalytics, recentActivity] = await Promise.all([
        this.getCustomerAnalytics(null, timeRange),
        this.getAgentPerformanceAnalytics(timeRange),
        this.getCostAnalytics(timeRange),
        this.getRecentActivity(100)
      ]);

      const exportData = {
        customerAnalytics,
        agentPerformance,
        costAnalytics,
        recentActivity,
        exportedAt: new Date().toISOString(),
        timeRange
      };

      if (format === 'json') {
        return JSON.stringify(exportData, null, 2);
      } else if (format === 'csv') {
        return this.convertToCSV(exportData);
      }

      return exportData;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  convertToCSV(data) {
    const csv = [];
    csv.push('Type,Metric,Value,Timestamp');
    
    // Customer analytics
    csv.push(`Customer,Total Interactions,${data.customerAnalytics?.totalInteractions || 0},${new Date().toISOString()}`);
    csv.push(`Customer,Total Sessions,${data.customerAnalytics?.totalSessions || 0},${new Date().toISOString()}`);
    csv.push(`Customer,Total Cost,${data.customerAnalytics?.totalCost || 0},${new Date().toISOString()}`);
    
    // Agent performance
    Object.entries(data.agentPerformance || {}).forEach(([agent, stats]) => {
      csv.push(`Agent,${agent} Executions,${stats.totalExecutions},${new Date().toISOString()}`);
      csv.push(`Agent,${agent} Success Rate,${stats.successRate}%,${new Date().toISOString()}`);
      csv.push(`Agent,${agent} Total Cost,${stats.totalCost},${new Date().toISOString()}`);
    });
    
    // Cost analytics
    csv.push(`Cost,Total Cost,${data.costAnalytics?.totalCost || 0},${new Date().toISOString()}`);
    csv.push(`Cost,Total Tokens,${data.costAnalytics?.totalTokens || 0},${new Date().toISOString()}`);
    csv.push(`Cost,Total Requests,${data.costAnalytics?.totalRequests || 0},${new Date().toISOString()}`);
    
    return csv.join('\n');
  }
}

export const customerTrackingService = new CustomerTrackingService();

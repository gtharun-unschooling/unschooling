/**
 * Admin Metrics Service
 * Provides real-time data for the admin dashboard
 */

import axios from 'axios';
import { getApiUrl } from '../config/config.js';

class AdminMetricsService {
  constructor() {
    this.baseUrl = getApiUrl('');
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 seconds
  }

  // Cache management
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Get all admin metrics from backend
  async getAllMetrics() {
    const cacheKey = 'allMetrics';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${this.baseUrl}/api/admin/metrics`, { timeout: 10000 });
      const data = response.data;
      
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching admin metrics:', error);
      // Return fallback data
      return this.getFallbackMetrics();
    }
  }

  // System Health
  async getSystemHealth() {
    const allMetrics = await this.getAllMetrics();
    return allMetrics.systemHealth;
  }

  // Fallback metrics when backend is unavailable
  getFallbackMetrics() {
    return {
      systemHealth: {
        status: 'error',
        uptime: '0%',
        responseTime: 'N/A',
        activeUsers: 0,
        totalRequests: 0,
        errorRate: '100%',
        services: {
          llmAgents: { status: 'error', responseTime: 'N/A', lastCheck: 'Error' },
          warehouseApi: { status: 'error', responseTime: 'N/A', lastCheck: 'Error' },
          frontend: { status: 'error', responseTime: 'N/A', lastCheck: 'Error' },
          database: { status: 'error', responseTime: 'N/A', lastCheck: 'Error' }
        }
      },
      customerMetrics: {
        totalUsers: 0,
        activeToday: 0,
        newUsers: 0,
        retentionRate: '0%',
        averageSessionTime: '0m 0s',
        topFeatures: [],
        userJourney: {
          profileCreation: 0,
          planGeneration: 0,
          contentAccess: 0,
          progressTracking: 0
        }
      },
      agentPerformance: {},
      costTracking: {
        totalCost: '$0.00',
        dailyCost: '$0.00',
        monthlyCost: '$0.00',
        costBreakdown: {},
        usageStats: {},
        projections: {}
      },
      recentActivity: [],
      alerts: []
    };
  }

  // Customer Metrics
  async getCustomerMetrics() {
    const allMetrics = await this.getAllMetrics();
    return allMetrics.customerMetrics;
  }

  // Agent Performance
  async getAgentPerformance() {
    const allMetrics = await this.getAllMetrics();
    return allMetrics.agentPerformance;
  }

  // Cost Tracking
  async getCostTracking() {
    const allMetrics = await this.getAllMetrics();
    return allMetrics.costTracking;
  }

  // Recent Activity
  async getRecentActivity() {
    const allMetrics = await this.getAllMetrics();
    return allMetrics.recentActivity;
  }

  // Alerts
  async getAlerts() {
    const allMetrics = await this.getAllMetrics();
    return allMetrics.alerts;
  }

  // Real-time updates
  startRealTimeUpdates(callback) {
    this.updateInterval = setInterval(async () => {
      try {
        const [systemHealth, customerMetrics, agentPerformance, costTracking, recentActivity, alerts] = await Promise.all([
          this.getSystemHealth(),
          this.getCustomerMetrics(),
          this.getAgentPerformance(),
          this.getCostTracking(),
          this.getRecentActivity(),
          this.getAlerts()
        ]);

        callback({
          systemHealth,
          customerMetrics,
          agentPerformance,
          costTracking,
          recentActivity,
          alerts
        });
      } catch (error) {
        console.error('Error in real-time update:', error);
      }
    }, 10000); // Update every 10 seconds
  }

  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Export data
  async exportData(format = 'json') {
    try {
      const data = {
        systemHealth: await this.getSystemHealth(),
        customerMetrics: await this.getCustomerMetrics(),
        agentPerformance: await this.getAgentPerformance(),
        costTracking: await this.getCostTracking(),
        recentActivity: await this.getRecentActivity(),
        alerts: await this.getAlerts(),
        exportedAt: new Date().toISOString()
      };

      if (format === 'json') {
        return JSON.stringify(data, null, 2);
      } else if (format === 'csv') {
        // Convert to CSV format (simplified)
        return this.convertToCSV(data);
      }

      return data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  convertToCSV(data) {
    // Simplified CSV conversion
    const csv = [];
    csv.push('Metric,Value,Timestamp');
    csv.push(`Total Users,${data.customerMetrics?.totalUsers || 0},${new Date().toISOString()}`);
    csv.push(`Active Users,${data.customerMetrics?.activeToday || 0},${new Date().toISOString()}`);
    csv.push(`Daily Cost,${data.costTracking?.dailyCost || '$0'},${new Date().toISOString()}`);
    return csv.join('\n');
  }
}

export const adminMetricsService = new AdminMetricsService();

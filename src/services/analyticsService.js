/**
 * Analytics Service
 * Handles data export to BigQuery and advanced analytics
 */

import { agentMetricsService } from './agentMetricsService';

class AnalyticsService {
  constructor() {
    this.bigQueryConfig = {
      projectId: 'unschooling-464413', // Your Firebase project ID
      datasetId: 'unschooling_analytics',
      tables: {
        agentExecutions: 'agent_executions',
        childPerformance: 'child_performance',
        systemHealth: 'system_health',
        dailyMetrics: 'daily_metrics'
      }
    };
  }

  /**
   * Export data from Firestore to BigQuery
   * This would typically be called by a Cloud Function on a schedule
   */
  async exportToBigQuery(date = null) {
    try {
      const exportDate = date || new Date().toISOString().split('T')[0];
      
      console.log(`📊 Starting BigQuery export for date: ${exportDate}`);
      
      // Export agent executions
      await this.exportAgentExecutions(exportDate);
      
      // Export child performance data
      await this.exportChildPerformance(exportDate);
      
      // Export system health data
      await this.exportSystemHealth(exportDate);
      
      // Generate daily aggregated metrics
      await this.generateDailyMetrics(exportDate);
      
      console.log(`✅ BigQuery export completed for date: ${exportDate}`);
      
    } catch (error) {
      console.error('❌ Error exporting to BigQuery:', error);
      throw error;
    }
  }

  /**
   * Export agent execution data to BigQuery
   */
  async exportAgentExecutions(date) {
    try {
      // This would be implemented as a Cloud Function
      // For now, we'll prepare the data structure
      const executions = await agentMetricsService.getAgentExecutions(date);
      
      const bigQueryData = executions.map(execution => ({
        execution_id: execution.id,
        child_id: execution.childId,
        child_name: execution.childName,
        user_id: execution.userId,
        agent_name: execution.agentName,
        execution_time: execution.executionTime,
        success: execution.success,
        error_message: execution.error,
        tokens_used: execution.tokensUsed,
        llm_used: execution.llmUsed,
        timestamp: execution.timestamp,
        date: execution.date,
        hour: execution.hour,
        input_data_size: JSON.stringify(execution.inputData).length,
        output_data_size: JSON.stringify(execution.outputData).length
      }));
      
      console.log(`📤 Prepared ${bigQueryData.length} agent execution records for BigQuery`);
      return bigQueryData;
      
    } catch (error) {
      console.error('❌ Error exporting agent executions:', error);
      throw error;
    }
  }

  /**
   * Export child performance data to BigQuery
   */
  async exportChildPerformance(date) {
    try {
      const children = await agentMetricsService.getAllChildrenWithMetrics();
      
      const bigQueryData = children.flatMap(child => 
        Object.entries(child.agents).map(([agentName, metrics]) => ({
          child_id: child.id,
          child_name: child.name,
          agent_name: agentName,
          total_executions: metrics.totalExecutions,
          successful_executions: metrics.successfulExecutions,
          failed_executions: metrics.failedExecutions,
          total_execution_time: metrics.totalExecutionTime,
          average_execution_time: metrics.averageExecutionTime,
          success_rate: metrics.successRate,
          last_execution: metrics.lastExecution,
          updated_at: metrics.updatedAt
        }))
      );
      
      console.log(`📤 Prepared ${bigQueryData.length} child performance records for BigQuery`);
      return bigQueryData;
      
    } catch (error) {
      console.error('❌ Error exporting child performance:', error);
      throw error;
    }
  }

  /**
   * Export system health data to BigQuery
   */
  async exportSystemHealth(date) {
    try {
      const healthData = await agentMetricsService.getSystemHealthMetrics();
      
      const bigQueryData = healthData.map(health => ({
        health_id: health.id,
        timestamp: health.timestamp,
        date: health.date,
        system_status: health.status,
        response_time: health.responseTime,
        error_rate: health.errorRate,
        active_users: health.activeUsers,
        total_requests: health.totalRequests,
        memory_usage: health.memoryUsage,
        cpu_usage: health.cpuUsage
      }));
      
      console.log(`📤 Prepared ${bigQueryData.length} system health records for BigQuery`);
      return bigQueryData;
      
    } catch (error) {
      console.error('❌ Error exporting system health:', error);
      throw error;
    }
  }

  /**
   * Generate daily aggregated metrics
   */
  async generateDailyMetrics(date) {
    try {
      const metrics = await agentMetricsService.getAgentMetrics(null, date);
      
      const dailyMetrics = {
        date,
        total_executions: metrics.reduce((sum, m) => sum + m.totalExecutions, 0),
        total_successful_executions: metrics.reduce((sum, m) => sum + m.successfulExecutions, 0),
        total_failed_executions: metrics.reduce((sum, m) => sum + m.failedExecutions, 0),
        average_success_rate: metrics.reduce((sum, m) => sum + m.successRate, 0) / metrics.length,
        average_execution_time: metrics.reduce((sum, m) => sum + m.averageExecutionTime, 0) / metrics.length,
        total_execution_time: metrics.reduce((sum, m) => sum + m.totalExecutionTime, 0),
        unique_children: new Set(metrics.map(m => m.childId)).size,
        unique_users: new Set(metrics.map(m => m.userId)).size,
        peak_hour: this.findPeakHour(metrics),
        agent_breakdown: this.generateAgentBreakdown(metrics)
      };
      
      console.log(`📊 Generated daily metrics for ${date}:`, dailyMetrics);
      return dailyMetrics;
      
    } catch (error) {
      console.error('❌ Error generating daily metrics:', error);
      throw error;
    }
  }

  /**
   * Find peak usage hour
   */
  findPeakHour(metrics) {
    const hourlyData = {};
    
    metrics.forEach(metric => {
      Object.entries(metric.hourlyBreakdown || {}).forEach(([hour, data]) => {
        if (!hourlyData[hour]) {
          hourlyData[hour] = 0;
        }
        hourlyData[hour] += data.executions;
      });
    });
    
    return Object.entries(hourlyData).reduce((peak, [hour, count]) => 
      count > peak.count ? { hour: parseInt(hour), count } : peak, 
      { hour: 0, count: 0 }
    ).hour;
  }

  /**
   * Generate agent breakdown
   */
  generateAgentBreakdown(metrics) {
    const breakdown = {};
    
    metrics.forEach(metric => {
      if (!breakdown[metric.agentName]) {
        breakdown[metric.agentName] = {
          executions: 0,
          success_rate: 0,
          average_time: 0
        };
      }
      
      breakdown[metric.agentName].executions += metric.totalExecutions;
      breakdown[metric.agentName].success_rate += metric.successRate;
      breakdown[metric.agentName].average_time += metric.averageExecutionTime;
    });
    
    // Calculate averages
    Object.keys(breakdown).forEach(agent => {
      const count = metrics.filter(m => m.agentName === agent).length;
      breakdown[agent].success_rate /= count;
      breakdown[agent].average_time /= count;
    });
    
    return breakdown;
  }

  /**
   * Get analytics insights (would query BigQuery)
   */
  async getAnalyticsInsights(startDate, endDate) {
    try {
      // This would typically query BigQuery
      // For now, we'll return a structure showing what insights would be available
      
      const insights = {
        performance_trends: {
          description: "Agent performance over time",
          query: `SELECT date, agent_name, success_rate, average_execution_time 
                  FROM ${this.bigQueryConfig.datasetId}.${this.bigQueryConfig.tables.dailyMetrics}
                  WHERE date BETWEEN '${startDate}' AND '${endDate}'
                  ORDER BY date DESC`
        },
        child_performance_analysis: {
          description: "Individual child performance patterns",
          query: `SELECT child_id, child_name, agent_name, success_rate, total_executions
                  FROM ${this.bigQueryConfig.datasetId}.${this.bigQueryConfig.tables.childPerformance}
                  WHERE updated_at >= '${startDate}'
                  ORDER BY success_rate DESC`
        },
        system_health_trends: {
          description: "System performance and health metrics",
          query: `SELECT date, system_status, response_time, error_rate, active_users
                  FROM ${this.bigQueryConfig.datasetId}.${this.bigQueryConfig.tables.systemHealth}
                  WHERE date BETWEEN '${startDate}' AND '${endDate}'
                  ORDER BY date DESC`
        },
        usage_patterns: {
          description: "Peak usage times and patterns",
          query: `SELECT hour, COUNT(*) as execution_count, AVG(execution_time) as avg_time
                  FROM ${this.bigQueryConfig.datasetId}.${this.bigQueryConfig.tables.agentExecutions}
                  WHERE date BETWEEN '${startDate}' AND '${endDate}'
                  GROUP BY hour
                  ORDER BY execution_count DESC`
        }
      };
      
      return insights;
      
    } catch (error) {
      console.error('❌ Error getting analytics insights:', error);
      throw error;
    }
  }

  /**
   * Get BigQuery setup instructions
   */
  getBigQuerySetupInstructions() {
    return {
      steps: [
        {
          step: 1,
          title: "Create BigQuery Dataset",
          description: "Create a new dataset in BigQuery for analytics",
          sql: `CREATE SCHEMA IF NOT EXISTS \`${this.bigQueryConfig.projectId}.${this.bigQueryConfig.datasetId}\`
                OPTIONS (
                  description = "Unschooling app analytics data",
                  location = "US"
                );`
        },
        {
          step: 2,
          title: "Create Agent Executions Table",
          description: "Table to store individual agent execution records",
          sql: `CREATE TABLE IF NOT EXISTS \`${this.bigQueryConfig.projectId}.${this.bigQueryConfig.datasetId}.${this.bigQueryConfig.tables.agentExecutions}\` (
                  execution_id STRING,
                  child_id STRING,
                  child_name STRING,
                  user_id STRING,
                  agent_name STRING,
                  execution_time FLOAT64,
                  success BOOL,
                  error_message STRING,
                  tokens_used INT64,
                  llm_used BOOL,
                  timestamp TIMESTAMP,
                  date DATE,
                  hour INT64,
                  input_data_size INT64,
                  output_data_size INT64
                );`
        },
        {
          step: 3,
          title: "Create Child Performance Table",
          description: "Table to store aggregated child performance metrics",
          sql: `CREATE TABLE IF NOT EXISTS \`${this.bigQueryConfig.projectId}.${this.bigQueryConfig.datasetId}.${this.bigQueryConfig.tables.childPerformance}\` (
                  child_id STRING,
                  child_name STRING,
                  agent_name STRING,
                  total_executions INT64,
                  successful_executions INT64,
                  failed_executions INT64,
                  total_execution_time FLOAT64,
                  average_execution_time FLOAT64,
                  success_rate FLOAT64,
                  last_execution TIMESTAMP,
                  updated_at TIMESTAMP
                );`
        },
        {
          step: 4,
          title: "Create Daily Metrics Table",
          description: "Table to store daily aggregated metrics",
          sql: `CREATE TABLE IF NOT EXISTS \`${this.bigQueryConfig.projectId}.${this.bigQueryConfig.datasetId}.${this.bigQueryConfig.tables.dailyMetrics}\` (
                  date DATE,
                  total_executions INT64,
                  total_successful_executions INT64,
                  total_failed_executions INT64,
                  average_success_rate FLOAT64,
                  average_execution_time FLOAT64,
                  total_execution_time FLOAT64,
                  unique_children INT64,
                  unique_users INT64,
                  peak_hour INT64,
                  agent_breakdown JSON
                );`
        },
        {
          step: 5,
          title: "Set up Cloud Function for Data Export",
          description: "Create a scheduled Cloud Function to export data from Firestore to BigQuery",
          code: `
// Cloud Function to export data daily
const functions = require('firebase-functions');
const { BigQuery } = require('@google-cloud/bigquery');

exports.exportToBigQuery = functions.pubsub
  .schedule('0 2 * * *') // Run daily at 2 AM
  .timeZone('UTC')
  .onRun(async (context) => {
    const bigquery = new BigQuery();
    const datasetId = 'unschooling_analytics';
    
    // Export logic here
    console.log('Exporting data to BigQuery...');
  });
          `
        }
      ],
      benefits: [
        "Advanced analytics and reporting capabilities",
        "Historical data analysis and trends",
        "Custom dashboards with Google Data Studio",
        "Machine learning insights with BigQuery ML",
        "Cost-effective for large-scale analytics",
        "Integration with other Google Cloud services"
      ]
    };
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;

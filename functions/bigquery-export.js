/**
 * Cloud Function to export Firestore data to BigQuery
 * This function runs daily to export agent performance data for analytics
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { BigQuery } = require('@google-cloud/bigquery');

// Initialize BigQuery client
const bigquery = new BigQuery({
  projectId: 'unschooling-464413' // Your Firebase project ID
});

const datasetId = 'unschooling_analytics';
const tables = {
  agentExecutions: 'agent_executions',
  childPerformance: 'child_performance',
  systemHealth: 'system_health',
  dailyMetrics: 'daily_metrics'
};

/**
 * Daily export function - runs at 2 AM UTC every day
 */
exports.exportToBigQuery = functions.pubsub
  .schedule('0 2 * * *') // Daily at 2 AM UTC
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('🚀 Starting daily BigQuery export...');
    
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateString = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD
      
      console.log(`📅 Exporting data for date: ${dateString}`);
      
      // Export agent executions
      await exportAgentExecutions(dateString);
      
      // Export child performance data
      await exportChildPerformance(dateString);
      
      // Export system health data
      await exportSystemHealth(dateString);
      
      // Generate daily aggregated metrics
      await generateDailyMetrics(dateString);
      
      console.log(`✅ BigQuery export completed for ${dateString}`);
      
    } catch (error) {
      console.error('❌ Error in BigQuery export:', error);
      throw error;
    }
  });

/**
 * Export agent execution data to BigQuery
 */
async function exportAgentExecutions(date) {
  try {
    console.log(`📤 Exporting agent executions for ${date}...`);
    
    // Query Firestore for agent executions from the specified date
    const executionsRef = admin.firestore().collection('agent_executions');
    const snapshot = await executionsRef
      .where('date', '==', date)
      .get();
    
    if (snapshot.empty) {
      console.log(`⚠️ No agent executions found for ${date}`);
      return;
    }
    
    const rows = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      rows.push({
        execution_id: doc.id,
        child_id: data.childId || '',
        child_name: data.childName || '',
        user_id: data.userId || '',
        agent_name: data.agentName || '',
        execution_time: data.executionTime || 0,
        success: data.success || false,
        error_message: data.error || null,
        tokens_used: data.tokensUsed || 0,
        llm_used: data.llmUsed || false,
        timestamp: data.timestamp ? data.timestamp.toDate() : null,
        date: data.date || date,
        hour: data.hour || 0,
        input_data_size: data.inputData ? JSON.stringify(data.inputData).length : 0,
        output_data_size: data.outputData ? JSON.stringify(data.outputData).length : 0
      });
    });
    
    // Insert data into BigQuery
    const tableId = `${datasetId}.${tables.agentExecutions}`;
    await bigquery.dataset(datasetId).table(tables.agentExecutions).insert(rows);
    
    console.log(`✅ Exported ${rows.length} agent execution records to BigQuery`);
    
  } catch (error) {
    console.error('❌ Error exporting agent executions:', error);
    throw error;
  }
}

/**
 * Export child performance data to BigQuery
 */
async function exportChildPerformance(date) {
  try {
    console.log(`📤 Exporting child performance data for ${date}...`);
    
    const childPerformanceRef = admin.firestore().collection('child_performance');
    const snapshot = await childPerformanceRef.get();
    
    if (snapshot.empty) {
      console.log('⚠️ No child performance data found');
      return;
    }
    
    const rows = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      rows.push({
        child_id: data.childId || '',
        child_name: data.childName || '',
        agent_name: data.agentName || '',
        total_executions: data.totalExecutions || 0,
        successful_executions: data.successfulExecutions || 0,
        failed_executions: data.failedExecutions || 0,
        total_execution_time: data.totalExecutionTime || 0,
        average_execution_time: data.averageExecutionTime || 0,
        success_rate: data.successRate || 0,
        last_execution: data.lastExecution ? data.lastExecution.toDate() : null,
        updated_at: data.updatedAt ? data.updatedAt.toDate() : null
      });
    });
    
    // Clear existing data and insert new data
    const tableId = `${datasetId}.${tables.childPerformance}`;
    await bigquery.dataset(datasetId).table(tables.childPerformance).insert(rows);
    
    console.log(`✅ Exported ${rows.length} child performance records to BigQuery`);
    
  } catch (error) {
    console.error('❌ Error exporting child performance:', error);
    throw error;
  }
}

/**
 * Export system health data to BigQuery
 */
async function exportSystemHealth(date) {
  try {
    console.log(`📤 Exporting system health data for ${date}...`);
    
    const systemHealthRef = admin.firestore().collection('system_health');
    const snapshot = await systemHealthRef
      .where('date', '==', date)
      .get();
    
    if (snapshot.empty) {
      console.log(`⚠️ No system health data found for ${date}`);
      return;
    }
    
    const rows = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      rows.push({
        health_id: doc.id,
        timestamp: data.timestamp ? data.timestamp.toDate() : null,
        date: data.date || date,
        system_status: data.status || 'unknown',
        response_time: data.responseTime || 0,
        error_rate: data.errorRate || 0,
        active_users: data.activeUsers || 0,
        total_requests: data.totalRequests || 0,
        memory_usage: data.memoryUsage || 0,
        cpu_usage: data.cpuUsage || 0
      });
    });
    
    const tableId = `${datasetId}.${tables.systemHealth}`;
    await bigquery.dataset(datasetId).table(tables.systemHealth).insert(rows);
    
    console.log(`✅ Exported ${rows.length} system health records to BigQuery`);
    
  } catch (error) {
    console.error('❌ Error exporting system health:', error);
    throw error;
  }
}

/**
 * Generate and export daily aggregated metrics
 */
async function generateDailyMetrics(date) {
  try {
    console.log(`📊 Generating daily metrics for ${date}...`);
    
    // Query BigQuery for aggregated metrics
    const query = `
      SELECT 
        '${date}' as date,
        COUNT(*) as total_executions,
        SUM(CASE WHEN success = true THEN 1 ELSE 0 END) as total_successful_executions,
        SUM(CASE WHEN success = false THEN 1 ELSE 0 END) as total_failed_executions,
        AVG(CASE WHEN success = true THEN 1.0 ELSE 0.0 END) * 100 as average_success_rate,
        AVG(execution_time) as average_execution_time,
        SUM(execution_time) as total_execution_time,
        COUNT(DISTINCT child_id) as unique_children,
        COUNT(DISTINCT user_id) as unique_users,
        MODE(hour) as peak_hour,
        JSON_OBJECT(
          'profileAgent', JSON_OBJECT(
            'executions', SUM(CASE WHEN agent_name = 'profileAgent' THEN 1 ELSE 0 END),
            'success_rate', AVG(CASE WHEN agent_name = 'profileAgent' AND success = true THEN 1.0 ELSE 0.0 END) * 100,
            'avg_time', AVG(CASE WHEN agent_name = 'profileAgent' THEN execution_time ELSE NULL END)
          ),
          'matchAgent', JSON_OBJECT(
            'executions', SUM(CASE WHEN agent_name = 'matchAgent' THEN 1 ELSE 0 END),
            'success_rate', AVG(CASE WHEN agent_name = 'matchAgent' AND success = true THEN 1.0 ELSE 0.0 END) * 100,
            'avg_time', AVG(CASE WHEN agent_name = 'matchAgent' THEN execution_time ELSE NULL END)
          ),
          'scheduleAgent', JSON_OBJECT(
            'executions', SUM(CASE WHEN agent_name = 'scheduleAgent' THEN 1 ELSE 0 END),
            'success_rate', AVG(CASE WHEN agent_name = 'scheduleAgent' AND success = true THEN 1.0 ELSE 0.0 END) * 100,
            'avg_time', AVG(CASE WHEN agent_name = 'scheduleAgent' THEN execution_time ELSE NULL END)
          ),
          'reviewerAgent', JSON_OBJECT(
            'executions', SUM(CASE WHEN agent_name = 'reviewerAgent' THEN 1 ELSE 0 END),
            'success_rate', AVG(CASE WHEN agent_name = 'reviewerAgent' AND success = true THEN 1.0 ELSE 0.0 END) * 100,
            'avg_time', AVG(CASE WHEN agent_name = 'reviewerAgent' THEN execution_time ELSE NULL END)
          )
        ) as agent_breakdown
      FROM \`${datasetId}.${tables.agentExecutions}\`
      WHERE date = '${date}'
    `;
    
    const [rows] = await bigquery.query(query);
    
    if (rows.length > 0) {
      const dailyMetrics = rows[0];
      
      // Insert into daily metrics table
      await bigquery.dataset(datasetId).table(tables.dailyMetrics).insert([dailyMetrics]);
      
      console.log(`✅ Generated and exported daily metrics for ${date}:`, dailyMetrics);
    } else {
      console.log(`⚠️ No data found for daily metrics on ${date}`);
    }
    
  } catch (error) {
    console.error('❌ Error generating daily metrics:', error);
    throw error;
  }
}

/**
 * Manual export function for testing
 */
exports.manualExport = functions.https.onCall(async (data, context) => {
  // Verify admin access
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }
  
  const date = data.date || new Date().toISOString().split('T')[0];
  
  try {
    console.log(`🔧 Manual export triggered for date: ${date}`);
    
    await exportAgentExecutions(date);
    await exportChildPerformance(date);
    await exportSystemHealth(date);
    await generateDailyMetrics(date);
    
    return { success: true, message: `Export completed for ${date}` };
    
  } catch (error) {
    console.error('❌ Error in manual export:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Create BigQuery tables if they don't exist
 */
exports.createBigQueryTables = functions.https.onCall(async (data, context) => {
  // Verify admin access
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }
  
  try {
    console.log('🏗️ Creating BigQuery tables...');
    
    // Create dataset if it doesn't exist
    const [dataset] = await bigquery.dataset(datasetId).get({ autoCreate: true });
    console.log(`✅ Dataset ${datasetId} created or exists`);
    
    // Create agent_executions table
    const agentExecutionsSchema = [
      { name: 'execution_id', type: 'STRING' },
      { name: 'child_id', type: 'STRING' },
      { name: 'child_name', type: 'STRING' },
      { name: 'user_id', type: 'STRING' },
      { name: 'agent_name', type: 'STRING' },
      { name: 'execution_time', type: 'FLOAT' },
      { name: 'success', type: 'BOOLEAN' },
      { name: 'error_message', type: 'STRING' },
      { name: 'tokens_used', type: 'INTEGER' },
      { name: 'llm_used', type: 'BOOLEAN' },
      { name: 'timestamp', type: 'TIMESTAMP' },
      { name: 'date', type: 'DATE' },
      { name: 'hour', type: 'INTEGER' },
      { name: 'input_data_size', type: 'INTEGER' },
      { name: 'output_data_size', type: 'INTEGER' }
    ];
    
    await bigquery.dataset(datasetId).table(tables.agentExecutions).create({
      schema: agentExecutionsSchema
    });
    console.log(`✅ Table ${tables.agentExecutions} created`);
    
    // Create child_performance table
    const childPerformanceSchema = [
      { name: 'child_id', type: 'STRING' },
      { name: 'child_name', type: 'STRING' },
      { name: 'agent_name', type: 'STRING' },
      { name: 'total_executions', type: 'INTEGER' },
      { name: 'successful_executions', type: 'INTEGER' },
      { name: 'failed_executions', type: 'INTEGER' },
      { name: 'total_execution_time', type: 'FLOAT' },
      { name: 'average_execution_time', type: 'FLOAT' },
      { name: 'success_rate', type: 'FLOAT' },
      { name: 'last_execution', type: 'TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP' }
    ];
    
    await bigquery.dataset(datasetId).table(tables.childPerformance).create({
      schema: childPerformanceSchema
    });
    console.log(`✅ Table ${tables.childPerformance} created`);
    
    // Create system_health table
    const systemHealthSchema = [
      { name: 'health_id', type: 'STRING' },
      { name: 'timestamp', type: 'TIMESTAMP' },
      { name: 'date', type: 'DATE' },
      { name: 'system_status', type: 'STRING' },
      { name: 'response_time', type: 'FLOAT' },
      { name: 'error_rate', type: 'FLOAT' },
      { name: 'active_users', type: 'INTEGER' },
      { name: 'total_requests', type: 'INTEGER' },
      { name: 'memory_usage', type: 'FLOAT' },
      { name: 'cpu_usage', type: 'FLOAT' }
    ];
    
    await bigquery.dataset(datasetId).table(tables.systemHealth).create({
      schema: systemHealthSchema
    });
    console.log(`✅ Table ${tables.systemHealth} created`);
    
    // Create daily_metrics table
    const dailyMetricsSchema = [
      { name: 'date', type: 'DATE' },
      { name: 'total_executions', type: 'INTEGER' },
      { name: 'total_successful_executions', type: 'INTEGER' },
      { name: 'total_failed_executions', type: 'INTEGER' },
      { name: 'average_success_rate', type: 'FLOAT' },
      { name: 'average_execution_time', type: 'FLOAT' },
      { name: 'total_execution_time', type: 'FLOAT' },
      { name: 'unique_children', type: 'INTEGER' },
      { name: 'unique_users', type: 'INTEGER' },
      { name: 'peak_hour', type: 'INTEGER' },
      { name: 'agent_breakdown', type: 'JSON' }
    ];
    
    await bigquery.dataset(datasetId).table(tables.dailyMetrics).create({
      schema: dailyMetricsSchema
    });
    console.log(`✅ Table ${tables.dailyMetrics} created`);
    
    return { 
      success: true, 
      message: 'All BigQuery tables created successfully',
      tables: Object.values(tables)
    };
    
  } catch (error) {
    console.error('❌ Error creating BigQuery tables:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

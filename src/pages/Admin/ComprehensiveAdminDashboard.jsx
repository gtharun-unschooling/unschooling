import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, FiActivity, FiDollarSign, FiAlertTriangle, 
  FiTrendingUp, FiClock, FiDatabase, FiSettings,
  FiEye, FiDownload, FiRefreshCw, FiFilter,
  FiChevronDown, FiChevronUp, FiSearch, FiCalendar
} from 'react-icons/fi';

const ComprehensiveAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [searchTerm, setSearchTerm] = useState('');

  // Real-time data states with proper default values
  const [systemHealth, setSystemHealth] = useState({
    status: 'loading',
    uptime: '0%',
    responseTime: '0ms',
    activeUsers: 0,
    totalRequests: 0,
    errorRate: '0%',
    services: {}
  });
  const [customerMetrics, setCustomerMetrics] = useState({
    totalUsers: 0,
    activeToday: 0,
    newUsers: 0,
    retentionRate: '0%',
    averageSessionTime: '0m 0s',
    topFeatures: [],
    userJourney: {}
  });
  const [agentPerformance, setAgentPerformance] = useState({});
  const [costTracking, setCostTracking] = useState({
    totalCost: '$0.00',
    dailyCost: '$0.00',
    monthlyCost: '$0.00',
    costBreakdown: {},
    usageStats: {},
    projections: {}
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Mock data - fallback when API is not available
  const mockSystemHealth = {
    status: 'healthy',
    uptime: '99.9%',
    responseTime: '245ms',
    activeUsers: 47,
    totalRequests: 1247,
    errorRate: '0.2%',
    services: {
      llmAgents: { status: 'healthy', responseTime: '1.2s', lastCheck: '2s ago' },
      warehouseApi: { status: 'healthy', responseTime: '89ms', lastCheck: '1s ago' },
      frontend: { status: 'healthy', responseTime: '156ms', lastCheck: '1s ago' },
      database: { status: 'healthy', responseTime: '45ms', lastCheck: '1s ago' }
    }
  };

  const mockCustomerMetrics = {
    totalUsers: 1247,
    activeToday: 89,
    newUsers: 23,
    retentionRate: '87.3%',
    averageSessionTime: '12m 34s',
    topFeatures: [
      { name: 'Learning Plan Generation', usage: 89, trend: '+12%' },
      { name: 'Progress Tracking', usage: 76, trend: '+8%' },
      { name: 'Content Discovery', usage: 65, trend: '+15%' }
    ],
    userJourney: {
      profileCreation: 1247,
      planGeneration: 1103,
      contentAccess: 987,
      progressTracking: 654
    }
  };

  const mockAgentPerformance = {
    profileAgent: {
      totalExecutions: 1247,
      successRate: 98.5,
      averageTime: '1.2s',
      costPerExecution: '$0.003',
      lastExecution: '2 minutes ago',
      errors: 19,
      performance: 'excellent'
    },
    matchAgent: {
      totalExecutions: 1247,
      successRate: 96.2,
      averageTime: '2.8s',
      costPerExecution: '$0.007',
      lastExecution: '2 minutes ago',
      errors: 47,
      performance: 'excellent'
    },
    scheduleAgent: {
      totalExecutions: 1247,
      successRate: 94.8,
      averageTime: '45.2s',
      costPerExecution: '$0.023',
      lastExecution: '3 minutes ago',
      errors: 65,
      performance: 'good'
    },
    reviewerAgent: {
      totalExecutions: 1247,
      successRate: 97.1,
      averageTime: '11.8s',
      costPerExecution: '$0.015',
      lastExecution: '3 minutes ago',
      errors: 36,
      performance: 'excellent'
    }
  };

  const mockCostTracking = {
    totalCost: '$47.23',
    dailyCost: '$2.34',
    monthlyCost: '$71.20',
    costBreakdown: {
      geminiApi: '$38.45',
      cloudRun: '$6.78',
      firebase: '$2.00'
    },
    usageStats: {
      totalTokens: 1247000,
      tokensToday: 62000,
      averageTokensPerRequest: 1000,
      costPerToken: '$0.000038'
    },
    projections: {
      dailyProjection: '$2.45',
      monthlyProjection: '$74.50',
      yearlyProjection: '$894.00'
    }
  };

  const mockRecentActivity = [
    {
      id: 1,
      type: 'user_action',
      user: 'Sarah Johnson',
      action: 'Generated learning plan for Emma (Age: 7)',
      timestamp: '2 minutes ago',
      details: 'AI niche, Visual learning style, 28 topics matched',
      cost: '$0.048'
    },
    {
      id: 2,
      type: 'system_event',
      action: 'Agent performance check completed',
      timestamp: '5 minutes ago',
      details: 'All agents healthy, response times normal',
      cost: null
    },
    {
      id: 3,
      type: 'user_action',
      user: 'Michael Chen',
      action: 'Updated child profile for Alex',
      timestamp: '8 minutes ago',
      details: 'Added new interests: Robotics, Coding',
      cost: null
    },
    {
      id: 4,
      type: 'error_event',
      action: 'Schedule Agent timeout',
      timestamp: '12 minutes ago',
      details: 'Request took 90s, retried successfully',
      cost: '$0.023'
    }
  ];

  const mockAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'High API Usage',
      message: 'Gemini API usage is 15% above daily average',
      timestamp: '10 minutes ago',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      title: 'New User Onboarded',
      message: 'Maria Rodriguez completed profile setup',
      timestamp: '15 minutes ago',
      severity: 'low'
    },
    {
      id: 3,
      type: 'success',
      title: 'System Optimization',
      message: 'Agent response times improved by 12%',
      timestamp: '1 hour ago',
      severity: 'low'
    }
  ];

  // Load real data from API
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/api/admin/metrics');
        if (response.ok) {
          const data = await response.json();
          setSystemHealth(data.systemHealth || mockSystemHealth);
          setCustomerMetrics(data.customerMetrics || mockCustomerMetrics);
          setAgentPerformance(data.agentPerformance || mockAgentPerformance);
          setCostTracking(data.costTracking || mockCostTracking);
          setRecentActivity(data.recentActivity || mockRecentActivity);
          setAlerts(data.alerts || mockAlerts);
        } else {
          console.error('Failed to load admin metrics, using mock data');
          // Fall back to mock data
          setSystemHealth(mockSystemHealth);
          setCustomerMetrics(mockCustomerMetrics);
          setAgentPerformance(mockAgentPerformance);
          setCostTracking(mockCostTracking);
          setRecentActivity(mockRecentActivity);
          setAlerts(mockAlerts);
        }
      } catch (error) {
        console.error('Error loading admin data, using mock data:', error);
        // Fall back to mock data
        setSystemHealth(mockSystemHealth);
        setCustomerMetrics(mockCustomerMetrics);
        setAgentPerformance(mockAgentPerformance);
        setCostTracking(mockCostTracking);
        setRecentActivity(mockRecentActivity);
        setAlerts(mockAlerts);
      } finally {
        setIsLoading(false);
        setLastRefresh(new Date());
      }
    };

    loadAdminData();
    
    // Set up auto-refresh every 30 seconds (reduced frequency)
    const interval = setInterval(loadAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount.replace('$', '')));
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity },
    { id: 'customers', label: 'Customers', icon: FiUsers },
    { id: 'agents', label: 'Agents', icon: FiDatabase },
    { id: 'costs', label: 'Costs', icon: FiDollarSign },
    { id: 'system', label: 'System', icon: FiSettings },
    { id: 'alerts', label: 'Alerts', icon: FiAlertTriangle }
  ];

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e5e7eb'
  };

  const headerContentStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem'
  };

  const headerFlexStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0'
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  };

  const subtitleStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0.25rem 0 0 0'
  };

  const controlsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const selectStyle = {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    backgroundColor: '#ffffff'
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500'
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#1d4ed8'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <div style={headerFlexStyle}>
            <div>
              <h1 style={titleStyle}>Admin Dashboard</h1>
              <p style={subtitleStyle}>
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
            <div style={controlsStyle}>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                style={selectStyle}
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <button
                onClick={refreshData}
                disabled={isLoading}
                style={isLoading ? { ...buttonStyle, opacity: 0.5 } : buttonStyle}
                onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#2563eb')}
              >
                <FiRefreshCw style={{ marginRight: '0.5rem', animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiUsers className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{customerMetrics.activeToday}</p>
                    <p className="text-sm text-green-600">+12% from yesterday</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiTrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">97.1%</p>
                    <p className="text-sm text-green-600">+0.3% from yesterday</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <FiDollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Daily Cost</p>
                    <p className="text-2xl font-bold text-gray-900">{costTracking.dailyCost}</p>
                    <p className="text-sm text-yellow-600">+5% from yesterday</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FiClock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Response</p>
                    <p className="text-2xl font-bold text-gray-900">{systemHealth.responseTime}</p>
                    <p className="text-sm text-green-600">-12% from yesterday</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(systemHealth.services || {}).map(([service, data]) => (
                  <div key={service} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 capitalize">{service}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}>
                        {data.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Response: {data.responseTime}</p>
                    <p className="text-sm text-gray-600">Last check: {data.lastCheck}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        activity.type === 'user_action' ? 'bg-blue-500' :
                        activity.type === 'system_event' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.details}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      {activity.cost && (
                        <p className="text-xs text-gray-600">{activity.cost}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            {/* Customer Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Users</span>
                    <span className="font-semibold">{formatNumber(customerMetrics.totalUsers)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Today</span>
                    <span className="font-semibold">{customerMetrics.activeToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Users</span>
                    <span className="font-semibold text-green-600">+{customerMetrics.newUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retention Rate</span>
                    <span className="font-semibold text-green-600">{customerMetrics.retentionRate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Journey</h3>
                <div className="space-y-3">
                  {Object.entries(customerMetrics.userJourney || {}).map(([step, count]) => (
                    <div key={step} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{step.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-semibold">{formatNumber(count)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Features</h3>
                <div className="space-y-3">
                  {customerMetrics.topFeatures.map((feature, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">{feature.name}</span>
                      <div className="text-right">
                        <span className="font-semibold">{feature.usage}%</span>
                        <span className="text-green-600 text-xs ml-2">{feature.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-6">
            {/* Agent Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(agentPerformance || {}).map(([agentName, metrics]) => (
                <div key={agentName} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {agentName.replace('Agent', ' Agent')}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      metrics.performance === 'excellent' ? 'bg-green-100 text-green-800' :
                      metrics.performance === 'good' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {metrics.performance}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Executions</p>
                      <p className="text-xl font-bold">{formatNumber(metrics.totalExecutions)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-xl font-bold text-green-600">{metrics.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Time</p>
                      <p className="text-xl font-bold">{metrics.averageTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cost/Execution</p>
                      <p className="text-xl font-bold">{metrics.costPerExecution}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Execution</span>
                      <span className="text-gray-900">{metrics.lastExecution}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Errors</span>
                      <span className="text-red-600">{metrics.errors}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'costs' && (
          <div className="space-y-6">
            {/* Cost Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Cost</span>
                    <span className="font-semibold text-xl">{costTracking.totalCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Cost</span>
                    <span className="font-semibold">{costTracking.dailyCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Cost</span>
                    <span className="font-semibold">{costTracking.monthlyCost}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(costTracking.costBreakdown || {}).map(([service, cost]) => (
                    <div key={service} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{service}</span>
                      <span className="font-semibold">{cost}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Tokens</span>
                    <span className="font-semibold">{formatNumber(costTracking.usageStats.totalTokens)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tokens Today</span>
                    <span className="font-semibold">{formatNumber(costTracking.usageStats.tokensToday)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Tokens/Request</span>
                    <span className="font-semibold">{formatNumber(costTracking.usageStats.averageTokensPerRequest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost/Token</span>
                    <span className="font-semibold">{costTracking.usageStats.costPerToken}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Projections */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Projections</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Daily Projection</p>
                  <p className="text-2xl font-bold text-gray-900">{costTracking.projections.dailyProjection}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Monthly Projection</p>
                  <p className="text-2xl font-bold text-gray-900">{costTracking.projections.monthlyProjection}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Yearly Projection</p>
                  <p className="text-2xl font-bold text-gray-900">{costTracking.projections.yearlyProjection}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            {/* System Health Details */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Overall Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(systemHealth.status)}`}>
                        {systemHealth.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uptime</span>
                      <span className="font-semibold">{systemHealth.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-semibold">{systemHealth.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Error Rate</span>
                      <span className="font-semibold">{systemHealth.errorRate}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Traffic</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Users</span>
                      <span className="font-semibold">{systemHealth.activeUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Requests</span>
                      <span className="font-semibold">{formatNumber(systemHealth.totalRequests)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* Alerts */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{alert.timestamp}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensiveAdminDashboard;

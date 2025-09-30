import React, { useState, useEffect } from 'react';
import { FiActivity, FiUsers, FiDollarSign, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

const RealTimeMonitor = ({ onDataUpdate }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [liveMetrics, setLiveMetrics] = useState({
    activeUsers: 0,
    requestsPerMinute: 0,
    averageResponseTime: 0,
    errorRate: 0,
    currentCost: 0
  });

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        activeUsers: Math.floor(Math.random() * 20) + 30,
        requestsPerMinute: Math.floor(Math.random() * 50) + 20,
        averageResponseTime: Math.floor(Math.random() * 200) + 150,
        errorRate: (Math.random() * 2).toFixed(2),
        currentCost: (Math.random() * 0.5 + 0.1).toFixed(3)
      }));
      
      setLastUpdate(new Date());
      setIsConnected(true);
      
      // Notify parent component
      if (onDataUpdate) {
        onDataUpdate({
          timestamp: new Date(),
          metrics: liveMetrics
        });
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [onDataUpdate, liveMetrics]);

  const getStatusColor = (value, type) => {
    switch (type) {
      case 'errorRate':
        return value < 1 ? 'text-green-600' : value < 3 ? 'text-yellow-600' : 'text-red-600';
      case 'responseTime':
        return value < 200 ? 'text-green-600' : value < 500 ? 'text-yellow-600' : 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Real-Time Monitor</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <FiRefreshCw className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FiUsers className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{liveMetrics.activeUsers}</p>
          <p className="text-xs text-gray-600">Active Users</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FiActivity className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{liveMetrics.requestsPerMinute}</p>
          <p className="text-xs text-gray-600">Req/Min</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FiActivity className="w-5 h-5 text-purple-600" />
          </div>
          <p className={`text-2xl font-bold ${getStatusColor(liveMetrics.averageResponseTime, 'responseTime')}`}>
            {liveMetrics.averageResponseTime}ms
          </p>
          <p className="text-xs text-gray-600">Avg Response</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FiAlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className={`text-2xl font-bold ${getStatusColor(liveMetrics.errorRate, 'errorRate')}`}>
            {liveMetrics.errorRate}%
          </p>
          <p className="text-xs text-gray-600">Error Rate</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FiDollarSign className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${liveMetrics.currentCost}</p>
          <p className="text-xs text-gray-600">Current Cost</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500 text-center">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default RealTimeMonitor;

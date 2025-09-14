import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { signInAnonymously, signOut } from 'firebase/auth';

const FirebaseConnectivityTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date() }]);
  };

  const runConnectivityTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Check if Firebase auth is available
    addResult('Firebase Auth Check', 'running', 'Checking if Firebase auth is initialized...');
    if (!auth) {
      addResult('Firebase Auth Check', 'failed', 'Firebase auth is not initialized');
      setIsRunning(false);
      return;
    }
    addResult('Firebase Auth Check', 'success', 'Firebase auth is initialized');

    // Test 2: Check network connectivity
    addResult('Network Connectivity', 'running', 'Testing network connectivity...');
    try {
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      addResult('Network Connectivity', 'success', 'Network connection is working');
    } catch (error) {
      addResult('Network Connectivity', 'failed', `Network error: ${error.message}`);
    }

    // Test 3: Test Firebase connectivity with anonymous auth
    addResult('Firebase Connectivity', 'running', 'Testing Firebase server connectivity...');
    try {
      const userCredential = await signInAnonymously(auth);
      addResult('Firebase Connectivity', 'success', 'Firebase server is reachable');
      
      // Sign out immediately
      await signOut(auth);
      addResult('Firebase Sign Out', 'success', 'Successfully signed out');
    } catch (error) {
      addResult('Firebase Connectivity', 'failed', `Firebase error: ${error.code} - ${error.message}`);
    }

    // Test 4: Check Firebase configuration
    addResult('Firebase Config', 'running', 'Checking Firebase configuration...');
    try {
      const config = auth.app.options;
      const requiredFields = ['apiKey', 'authDomain', 'projectId'];
      const missingFields = requiredFields.filter(field => !config[field]);
      
      if (missingFields.length === 0) {
        addResult('Firebase Config', 'success', 'All required configuration fields are present');
      } else {
        addResult('Firebase Config', 'failed', `Missing configuration fields: ${missingFields.join(', ')}`);
      }
    } catch (error) {
      addResult('Firebase Config', 'failed', `Config error: ${error.message}`);
    }

    setIsRunning(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#22c55e';
      case 'failed': return '#ef4444';
      case 'running': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'failed': return '❌';
      case 'running': return '🔄';
      default: return '⏳';
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>
        🔧 Firebase Connectivity Test
      </h2>
      
      <button
        onClick={runConnectivityTests}
        disabled={isRunning}
        style={{
          padding: '12px 24px',
          backgroundColor: isRunning ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isRunning ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '20px'
        }}
      >
        {isRunning ? 'Running Tests...' : 'Run Connectivity Tests'}
      </button>

      {testResults.length > 0 && (
        <div style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h3 style={{ marginBottom: '16px', color: '#374151' }}>Test Results:</h3>
          {testResults.map((result, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: index < testResults.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}
            >
              <span style={{ marginRight: '12px', fontSize: '18px' }}>
                {getStatusIcon(result.status)}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#374151' }}>
                  {result.test}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: getStatusColor(result.status),
                  marginTop: '2px'
                }}>
                  {result.message}
                </div>
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280',
                marginLeft: '12px'
              }}>
                {result.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        borderRadius: '8px'
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#92400e' }}>💡 Troubleshooting Tips:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400e' }}>
          <li>Check your internet connection</li>
          <li>Verify Firebase project settings in Firebase Console</li>
          <li>Ensure your domain is authorized in Firebase Auth settings</li>
          <li>Check browser console for additional error details</li>
          <li>Try refreshing the page and running tests again</li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseConnectivityTest;

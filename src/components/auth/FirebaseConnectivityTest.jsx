import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const FirebaseConnectivityTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const runConnectivityTest = async () => {
    setIsLoading(true);
    const results = {};

    try {
      // Test 1: Firebase Auth object
      results.authObject = auth ? '✅ Available' : '❌ Missing';
      results.authApp = auth?.app ? '✅ Available' : '❌ Missing';
      results.authConfig = auth?.config ? '✅ Available' : '❌ Missing';

      // Test 2: Google Provider
      try {
        const provider = new GoogleAuthProvider();
        results.googleProvider = '✅ Created successfully';
        results.providerScopes = provider.getScopes();
      } catch (error) {
        results.googleProvider = `❌ Failed: ${error.message}`;
      }

      // Test 3: Firebase Project Info
      if (auth?.app) {
        results.projectId = auth.app.options.projectId || '❌ Missing';
        results.apiKey = auth.app.options.apiKey ? '✅ Present' : '❌ Missing';
        results.authDomain = auth.app.options.authDomain || '❌ Missing';
      }

      // Test 4: Current User
      results.currentUser = auth?.currentUser ? '✅ Signed in' : '❌ Not signed in';

      setTestResults(results);
    } catch (error) {
      results.error = `❌ Test failed: ${error.message}`;
      setTestResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  const testGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Google Sign-In Test Successful:', result.user);
      
      // Sign out immediately after test
      await signOut(auth);
      console.log('✅ Signed out after test');
      
      alert('✅ Google Sign-In test successful!');
    } catch (error) {
      console.error('❌ Google Sign-In Test Failed:', error);
      alert(`❌ Google Sign-In test failed: ${error.message}`);
    }
  };

  useEffect(() => {
    runConnectivityTest();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>🔧 Firebase Connectivity Test</h3>
      
      <button 
        onClick={runConnectivityTest}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          margin: '10px 0',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isLoading ? 'Testing...' : 'Run Connectivity Test'}
      </button>

      <button 
        onClick={testGoogleSignIn}
        style={{
          padding: '10px 20px',
          margin: '10px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Google Sign-In
      </button>

      <div style={{ marginTop: '20px' }}>
        <h4>Test Results:</h4>
        <pre style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '12px',
          overflow: 'auto'
        }}>
          {JSON.stringify(testResults, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>Environment Info:</h4>
        <ul>
          <li>Environment: {process.env.REACT_APP_ENVIRONMENT || 'Not set'}</li>
          <li>Debug Mode: {process.env.REACT_APP_DEBUG || 'Not set'}</li>
          <li>Firebase API Key: {process.env.REACT_APP_FIREBASE_API_KEY ? '✅ Set' : '❌ Not set'}</li>
          <li>Firebase Project ID: {process.env.REACT_APP_FIREBASE_PROJECT_ID || '❌ Not set'}</li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseConnectivityTest;
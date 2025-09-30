import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const FirebaseDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const runDiagnostics = async () => {
    setIsLoading(true);
    const results = {};

    try {
      // 1. Firebase Configuration Check
      results.firebaseConfig = {
        projectId: auth?.app?.options?.projectId || 'Missing',
        apiKey: auth?.app?.options?.apiKey ? 'Present' : 'Missing',
        authDomain: auth?.app?.options?.authDomain || 'Missing',
        appId: auth?.app?.options?.appId || 'Missing'
      };

      // 2. Environment Variables Check
      results.environmentVariables = {
        REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY ? 'Set' : 'Not Set',
        REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'Not Set',
        REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'Not Set',
        NODE_ENV: process.env.NODE_ENV || 'Not Set',
        REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'Not Set'
      };

      // 3. Google Provider Test
      try {
        const provider = new GoogleAuthProvider();
        results.googleProvider = {
          status: 'Success',
          scopes: provider.getScopes(),
          customParameters: provider.getCustomParameters()
        };
      } catch (error) {
        results.googleProvider = {
          status: 'Failed',
          error: error.message
        };
      }

      // 4. Current Domain Check
      results.currentDomain = {
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        port: window.location.port,
        fullUrl: window.location.href
      };

      // 5. Firebase Auth State
      results.authState = {
        currentUser: auth?.currentUser ? 'Signed In' : 'Not Signed In',
        authReady: auth ? 'Ready' : 'Not Ready',
        appName: auth?.app?.name || 'Unknown'
      };

      // 6. Browser Compatibility
      results.browserCompatibility = {
        userAgent: navigator.userAgent,
        hasLocalStorage: typeof Storage !== 'undefined',
        hasSessionStorage: typeof sessionStorage !== 'undefined',
        isSecureContext: window.isSecureContext,
        protocol: window.location.protocol
      };

      setDiagnostics(results);
    } catch (error) {
      results.error = `Diagnostics failed: ${error.message}`;
      setDiagnostics(results);
    } finally {
      setIsLoading(false);
    }
  };

  const testGoogleSignIn = async () => {
    try {
      console.log('🔐 Testing Google Sign-In...');
      console.log('🔐 Auth object:', auth);
      console.log('🔐 Auth type:', typeof auth);
      console.log('🔐 Auth methods:', auth ? Object.getOwnPropertyNames(auth) : 'Auth is null');
      console.log('🔐 signInWithPopup type:', typeof auth?.signInWithPopup);
      
      if (!auth) {
        throw new Error('Auth object is null or undefined');
      }
      
      if (typeof auth.signInWithPopup !== 'function') {
        throw new Error('signInWithPopup is not a function on auth object');
      }
      
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      console.log('🔐 Provider:', provider);
      
      const result = await auth.signInWithPopup(provider);
      console.log('✅ Google Sign-In Test Successful:', result.user);
      
      // Sign out after test
      await auth.signOut();
      console.log('✅ Signed out after test');
      
      alert('✅ Google Sign-In test successful! Check console for details.');
    } catch (error) {
      console.error('❌ Google Sign-In Test Failed:', error);
      console.error('❌ Error Code:', error.code);
      console.error('❌ Error Message:', error.message);
      console.error('❌ Auth object:', auth);
      console.error('❌ Auth methods:', auth ? Object.getOwnPropertyNames(auth) : 'Auth is null');
      
      alert(`❌ Google Sign-In test failed: ${error.message}\n\nError Code: ${error.code}\n\nCheck console for full details.`);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #007bff', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f8f9fa',
      fontFamily: 'monospace'
    }}>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>
        🔧 Firebase Google Sign-In Diagnostics
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runDiagnostics}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            margin: '5px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isLoading ? '🔄 Running Diagnostics...' : '🔍 Run Full Diagnostics'}
        </button>

        <button 
          onClick={testGoogleSignIn}
          style={{
            padding: '12px 24px',
            margin: '5px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🧪 Test Google Sign-In
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ color: '#dc3545' }}>📊 Diagnostic Results:</h3>
        <pre style={{ 
          backgroundColor: '#e9ecef', 
          padding: '15px', 
          borderRadius: '4px',
          fontSize: '12px',
          overflow: 'auto',
          maxHeight: '400px',
          border: '1px solid #dee2e6'
        }}>
          {JSON.stringify(diagnostics, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
        <h4 style={{ color: '#856404', margin: '0 0 10px 0' }}>⚠️ Important Notes:</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#856404' }}>
          <li>Make sure <code>unschooling.in</code> is in Firebase authorized domains</li>
          <li>Check OAuth consent screen is configured in Google Cloud Console</li>
          <li>Verify JavaScript origins include your domain</li>
          <li>Ensure redirect URIs are properly configured</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d1ecf1', border: '1px solid #bee5eb', borderRadius: '4px' }}>
        <h4 style={{ color: '#0c5460', margin: '0 0 10px 0' }}>🔗 Quick Links:</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#0c5460' }}>
          <li><a href="https://console.firebase.google.com/project/unschooling-464413/authentication/providers" target="_blank" rel="noopener noreferrer">Firebase Auth Settings</a></li>
          <li><a href="https://console.cloud.google.com/apis/credentials?project=unschooling-464413" target="_blank" rel="noopener noreferrer">Google Cloud Credentials</a></li>
          <li><a href="https://console.cloud.google.com/apis/credentials/consent?project=unschooling-464413" target="_blank" rel="noopener noreferrer">OAuth Consent Screen</a></li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseDiagnostics;

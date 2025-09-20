import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DebugProvider } from './contexts/DebugContext';
import RoutesComponent from './routes/routes';
import ErrorBoundary from './components/ErrorBoundary';
import EnvironmentSwitcher from './components/EnvironmentSwitcher';
import './styles/global.css';

function App() {
  console.log('🚀 App component rendering...');
  
  try {
    return (
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <DebugProvider>
              <RoutesComponent />
              <EnvironmentSwitcher />
            </DebugProvider>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('🚀 Error in App component:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🚨 App Error</h2>
        <p>Error: {error.message}</p>
      </div>
    );
  }
}

export default App;

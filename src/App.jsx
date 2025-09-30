import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DebugProvider } from './contexts/DebugContext';
import RoutesComponent from './routes/routes';
import ErrorBoundary from './components/ErrorBoundary';
import GoogleAnalytics from './components/analytics/GoogleAnalytics';
import CookieConsent from './components/CookieConsent';
import SEOHead from './components/SEO/SEOHead';
import { HelmetProvider } from 'react-helmet-async';
import './styles/global.css';

function App() {
  console.log('🚀 App component rendering...');
  
  try {
    return (
      <ErrorBoundary>
        <BrowserRouter>
          <HelmetProvider>
            <GoogleAnalytics>
              <AuthProvider>
                <DebugProvider>
                  <SEOHead />
                  <RoutesComponent />
                  <CookieConsent />
                </DebugProvider>
              </AuthProvider>
            </GoogleAnalytics>
          </HelmetProvider>
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

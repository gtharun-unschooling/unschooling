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
import './styles/mobile-responsive.css';
import './styles/typographyConsistency.css';
import './styles/sectionSpecificStyles.css';

function App() {
  console.log('🚀 App component rendering...');
  
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
}

export default App;

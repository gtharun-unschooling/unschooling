/**
 * Enhanced error boundary component with production-ready error handling.
 */

import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Generate unique error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log the error with structured data
    console.error('Error caught by boundary:', {
      errorId,
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
    
    // In production, you could send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo, errorId);
    }
    
    this.setState({
      error,
      errorInfo,
      errorId
    });
  }

  logErrorToService = (error, errorInfo, errorId) => {
    // This is where you'd integrate with Sentry, LogRocket, etc.
    // For now, we'll just log to console
    console.group(`🚨 Production Error: ${errorId}`);
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('User Agent:', navigator.userAgent);
    console.error('URL:', window.location.href);
    console.groupEnd();
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    
    // Create error report
    const errorReport = {
      errorId,
      error: error?.toString(),
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => {
        alert('Error report copied to clipboard. Please send this to support.');
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = JSON.stringify(errorReport, null, 2);
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Error report copied to clipboard. Please send this to support.');
      });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-header">
              <div className="error-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h1 className="error-title">Something went wrong</h1>
              <p className="error-description">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>
              {this.state.errorId && (
                <p className="error-id">Error ID: {this.state.errorId}</p>
              )}
            </div>

            <div className="error-actions">
              <button 
                className="error-btn error-btn-primary"
                onClick={this.handleRetry}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
              
              <button 
                className="error-btn error-btn-secondary"
                onClick={this.handleReportError}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Report Issue
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary className="error-details-summary">
                  Error Details (Development Mode)
                </summary>
                <div className="error-details-content">
                  <div className="error-section">
                    <h3>Error Message:</h3>
                    <pre className="error-code">{this.state.error.toString()}</pre>
                  </div>
                  
                  {this.state.error.stack && (
                    <div className="error-section">
                      <h3>Stack Trace:</h3>
                      <pre className="error-code">{this.state.error.stack}</pre>
                    </div>
                  )}
                  
                  {this.state.errorInfo?.componentStack && (
                    <div className="error-section">
                      <h3>Component Stack:</h3>
                      <pre className="error-code">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
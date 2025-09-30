import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requireAuth = true,
  redirectTo = '/login',
  fallback = null 
}) => {
  const { currentUser, userProfile, loading, isAdmin, isParent } = useAuth();
  const location = useLocation();

  // Show loading state while auth is being determined
  if (loading) {
    return fallback || (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: '1rem'
      }}>
        <LoadingSpinner size="large" />
        <div style={{ fontSize: '1.1rem', color: '#6b7280' }}>
          Loading...
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !currentUser) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If no specific role is required, just check authentication
  if (!requiredRole) {
    return children;
  }

  // Check role-based access
  let hasAccess = false;
  
  switch (requiredRole) {
    case 'admin':
      hasAccess = isAdmin();
      break;
    case 'parent':
      hasAccess = isParent();
      break;
    case 'any':
      hasAccess = currentUser && userProfile;
      break;
    default:
      hasAccess = false;
  }

  // If user doesn't have required role
  if (!hasAccess) {
    // Redirect to appropriate page based on user's actual role
    if (isAdmin()) {
      return <Navigate to="/admin" replace />;
    } else if (isParent()) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

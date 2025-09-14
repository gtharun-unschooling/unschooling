// src/utils/errorMessages.js

/**
 * Converts Firebase authentication error codes to user-friendly messages
 * @param {string} errorCode - Firebase error code
 * @param {boolean} isLogin - Whether the user is trying to login or signup
 * @returns {string} User-friendly error message
 */
export const getAuthErrorMessage = (errorCode, isLogin = true) => {
  const errorMessages = {
    // Registration errors
    'auth/email-already-in-use': isLogin 
      ? 'This email is already registered. Please sign in instead, or use a different email to create a new account.'
      : 'This email is already registered. Please sign in instead, or use a different email to create a new account.',
    
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
    'auth/weak-password': 'Password is too weak. Please choose a stronger password with at least 6 characters.',
    
    // Login errors
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email. Please check your email or create a new account.',
    'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
    'auth/invalid-credential': 'Invalid email or password. Please check your credentials and try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later or reset your password.',
    
    // General errors
    'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
    'auth/popup-closed-by-user': 'Authentication was cancelled. Please try again.',
    'auth/cancelled-popup-request': 'Authentication was cancelled. Please try again.',
    'auth/popup-blocked': 'Popup was blocked by your browser. Please allow popups and try again.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
    'auth/requires-recent-login': 'For security reasons, please sign in again to continue.',
    'auth/credential-already-in-use': 'This account is already linked to another user.',
    
    // Password reset errors
    'auth/user-mismatch': 'The email address doesn\'t match the one used for password reset.',
    'auth/expired-action-code': 'The password reset link has expired. Please request a new one.',
    'auth/invalid-action-code': 'The password reset link is invalid. Please request a new one.',
    
    // Default error
    'default': 'An unexpected error occurred. Please try again or contact support.'
  };

  return errorMessages[errorCode] || errorMessages['default'];
};

/**
 * Gets a helpful action suggestion based on the error
 * @param {string} errorCode - Firebase error code
 * @param {boolean} isLogin - Whether the user is trying to login or signup
 * @returns {string|null} Action suggestion or null if none needed
 */
export const getActionSuggestion = (errorCode, isLogin = true) => {
  const suggestions = {
    'auth/email-already-in-use': isLogin 
      ? 'Try signing in instead, or create a new account with a different email.'
      : 'Try signing in instead, or create a new account with a different email.',
    'auth/user-not-found': 'Try creating a new account, or check if you\'re using the correct email.',
    'auth/wrong-password': 'Try again, or use the "Forgot Password" link to reset your password.',
    'auth/weak-password': 'Use a password with at least 6 characters, including letters and numbers.',
    'auth/too-many-requests': 'Wait a few minutes before trying again, or reset your password.',
    'auth/network-request-failed': 'Check your internet connection and try again.',
    'auth/requires-recent-login': 'Please sign in again to continue with this action.',
    'auth/credential-already-in-use': 'Try signing in with a different method or contact support.',
  };

  return suggestions[errorCode] || null;
};

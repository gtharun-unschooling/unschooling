/**
 * Loading context for managing loading states throughout the application.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);

  /**
   * Set loading state for a specific key
   */
  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  /**
   * Check if a specific key is loading
   */
  const isLoading = useCallback((key) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  /**
   * Check if any loading state is active
   */
  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean) || globalLoading;
  }, [loadingStates, globalLoading]);

  /**
   * Set global loading state
   */
  const setGlobalLoadingState = useCallback((isLoading) => {
    setGlobalLoading(isLoading);
  }, []);

  /**
   * Clear all loading states
   */
  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
    setGlobalLoading(false);
  }, []);

  /**
   * Execute a function with loading state
   */
  const withLoading = useCallback(async (key, asyncFunction) => {
    try {
      setLoading(key, true);
      const result = await asyncFunction();
      return result;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  const value = {
    loadingStates,
    globalLoading,
    setLoading,
    isLoading,
    isAnyLoading,
    setGlobalLoadingState,
    clearAllLoading,
    withLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}; 
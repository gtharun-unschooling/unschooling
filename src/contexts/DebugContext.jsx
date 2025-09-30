import React, { createContext, useState, useContext, useEffect } from "react";

const DebugContext = createContext();

export const useDebug = () => useContext(DebugContext);

export const DebugProvider = ({ children }) => {
  const [debugInfo, setDebugInfo] = useState("");

  const addDebugInfo = (info) => {
    setDebugInfo((prev) => prev + new Date().toLocaleTimeString() + ": " + info + "\n");
  };

  // Listen for debug events from the API service
  useEffect(() => {
    const handleDebugLog = (event) => {
      addDebugInfo(event.detail);
    };

    window.addEventListener('debug-log', handleDebugLog);
    return () => {
      window.removeEventListener('debug-log', handleDebugLog);
    };
  }, []);

  return (
    <DebugContext.Provider value={{ debugInfo, addDebugInfo }}>
      {children}
    </DebugContext.Provider>
  );
}; 
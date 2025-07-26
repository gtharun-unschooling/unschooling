import React, { createContext, useState, useContext } from "react";

const DebugContext = createContext();

export const useDebug = () => useContext(DebugContext);

export const DebugProvider = ({ children }) => {
  const [debugInfo, setDebugInfo] = useState("");

  const addDebugInfo = (info) => {
    setDebugInfo((prev) => prev + new Date().toLocaleTimeString() + ": " + info + "\n");
  };

  return (
    <DebugContext.Provider value={{ debugInfo, addDebugInfo }}>
      {children}
    </DebugContext.Provider>
  );
}; 
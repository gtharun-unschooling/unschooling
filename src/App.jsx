import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import RoutesComponent from './routes/routes.jsx';
import { LoadingProvider } from './contexts/LoadingContext';
import ErrorBoundary from './components/ErrorBoundary';
import { applyGlobalStyles } from './styles/globalStyles';
import firebaseApp from './firebase';
import { DebugProvider, useDebug } from './contexts/DebugContext';

function GlobalDebugBox() {
  const { debugInfo } = useDebug();
  const boxRef = useRef(null);
  const [position, setPosition] = useState({ top: 10, right: 10 });
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });

  // Mouse event handlers for dragging
  const onMouseDown = (e) => {
    if (e.target.className !== 'debug-drag-handle') return;
    setDragging(true);
    const box = boxRef.current;
    setRel({
      x: e.clientX - box.getBoundingClientRect().right,
      y: e.clientY - box.getBoundingClientRect().top,
    });
    e.preventDefault();
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    setPosition((prev) => ({
      top: Math.max(0, e.clientY - rel.y),
      right: Math.max(0, window.innerWidth - e.clientX + rel.x),
    }));
  };
  const onMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  if (!debugInfo) return null;
  return (
    <div
      ref={boxRef}
      style={{
        position: 'fixed',
        top: position.top,
        right: position.right,
        width: '400px',
        maxHeight: '40vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        overflowY: 'auto',
        zIndex: 1000,
        fontFamily: 'monospace',
        boxShadow: '0 4px 16px #00000040',
        cursor: dragging ? 'grabbing' : 'default',
        userSelect: 'none',
      }}
      onMouseDown={onMouseDown}
    >
      <div
        className="debug-drag-handle"
        style={{
          cursor: 'grab',
          margin: '-15px -15px 10px -15px',
          padding: '8px 0 0 0',
          background: 'transparent',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          fontWeight: 600,
          color: '#4ECDC4',
        }}
      >
        🔍 DEBUG INFO (drag me)
      </div>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{debugInfo}</pre>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Apply global styles when the app mounts
    applyGlobalStyles();
    
    // Cleanup global styles when the app unmounts
    return () => {
      const styleElement = document.getElementById('global-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <DebugProvider>
        <LoadingProvider>
          <BrowserRouter>
            <GlobalDebugBox />
            <RoutesComponent />
          </BrowserRouter>
        </LoadingProvider>
      </DebugProvider>
    </ErrorBoundary>
  );
}

export default App;
// Test CI/CD deployment
// Test deployment - Sat Jul 26 07:39:17 IST 2025
// Test deployment with updated secret - Sat Jul 26 07:58:16 IST 2025

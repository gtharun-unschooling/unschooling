import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { auth, db } from './firebase';

console.log('🚀 index.js executing...');
console.log('🚀 Root element:', document.getElementById('root'));

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('🚀 React root created:', root);

try {
  console.log('🚀 Rendering App component...');
  root.render(<App />);
  console.log('🚀 App component rendered successfully');
} catch (error) {
  console.error('🚀 Error rendering App:', error);
}
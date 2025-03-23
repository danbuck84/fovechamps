
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("Main: Application initializing");

// Add global error handler for various errors
window.addEventListener('error', (event) => {
  // List of error sources/messages to suppress
  const suppressPatterns = [
    'firebase', 
    'firestore', 
    'facebook.com', 
    'unrecognized feature',
    'sentry.io'
  ];
  
  const eventMessage = (event.message || '').toLowerCase();
  const eventFilename = (event.filename || '').toLowerCase();
  
  if (suppressPatterns.some(pattern => 
    eventMessage.includes(pattern) || 
    eventFilename.includes(pattern)
  )) {
    console.warn('Suppressed error in window.addEventListener:', 
      eventMessage.substring(0, 100) + (eventMessage.length > 100 ? '...' : ''));
    event.preventDefault();
    return true;
  }
});

// Also catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  const errorMsg = event.reason?.message || String(event.reason) || 'Unknown promise rejection';
  const errorStr = errorMsg.toLowerCase();
  
  if (
    errorStr.includes('firebase') || 
    errorStr.includes('firestore') ||
    errorStr.includes('facebook') ||
    errorStr.includes('feature')
  ) {
    console.warn('Suppressed unhandled promise rejection:', 
      errorStr.substring(0, 100) + (errorStr.length > 100 ? '...' : ''));
    event.preventDefault();
    return;
  }
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Main: Root element not found in DOM");
  throw new Error("Root element not found");
}

console.log("Main: Root element found, rendering app");

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("Main: App rendered");

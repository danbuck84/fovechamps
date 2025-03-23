
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("Main: Application initializing");

// Comprehensive list of all error patterns to suppress
const suppressPatterns = [
  'firebase', 
  'firestore', 
  'facebook.com', 
  'unrecognized feature',
  'feature',
  'sentry',
  'tr?id=',
  'facebook',
  'pixel',
  'preloaded',
  'tr?'
];

// Globally capture and filter errors before they hit the console
window.addEventListener('error', (event) => {
  const eventMessage = (event.message || '').toLowerCase();
  const eventFilename = (event.filename || '').toLowerCase();
  
  if (suppressPatterns.some(pattern => 
    eventMessage.includes(pattern) || 
    eventFilename.includes(pattern)
  )) {
    // Suppress the error completely
    event.preventDefault();
    return true;
  }
});

// Also catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  const errorMsg = event.reason?.message || String(event.reason) || 'Unknown promise rejection';
  const errorStr = errorMsg.toLowerCase();
  
  if (suppressPatterns.some(pattern => errorStr.includes(pattern))) {
    // Suppress the rejection completely
    event.preventDefault();
    return;
  }
});

// Add a handler for the beforeload event to stop resource loading
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      for (const node of mutation.addedNodes) {
        if (node.nodeName === 'LINK' && node.getAttribute('href')?.includes('facebook.com')) {
          node.remove();
        }
      }
    }
  }
});

// Start observing the document
observer.observe(document, { childList: true, subtree: true });

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

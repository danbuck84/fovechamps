
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("Main: Application initializing");

// Add global error handler for Firebase errors
window.addEventListener('error', (event) => {
  if (
    event.filename?.includes('firebase') || 
    event.filename?.includes('firestore') || 
    event.message?.includes('firebase') || 
    event.message?.includes('firestore')
  ) {
    console.warn('Suppressed Firebase-related error in window.addEventListener:', event.message);
    event.preventDefault();
    return true;
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

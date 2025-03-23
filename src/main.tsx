
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("Main: Application initializing");

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

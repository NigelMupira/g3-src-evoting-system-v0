// ============================================
// Application Entry Point
// ============================================
// This is the first file executed when the app starts
// Renders the App component into the DOM

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Create root element and render App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
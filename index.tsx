import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Initialize Telegram WebApp environment if available
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand?: () => void;
        colorScheme?: 'light' | 'dark';
      };
    };
  }
}

if (window.Telegram?.WebApp) {
  // Let Telegram know the WebApp is ready and expand to full height
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand?.();
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
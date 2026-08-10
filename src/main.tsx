import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error logging
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Captured Error Event:', event.error || event.message);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Handled Promise Rejection:', event.reason);
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

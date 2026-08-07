import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add global error listener to catch fatal errors early
if (typeof window !== 'undefined') {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Fatal Client Error:', { message, source, lineno, colno, error });
    // If the screen is still blank after 3 seconds, show a fallback UI
    setTimeout(() => {
      const root = document.getElementById('root');
      if (root && root.innerHTML === '') {
        root.innerHTML = `
          <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #fef2f2; font-family: system-ui, -apple-system, sans-serif; padding: 24px; text-align: center;">
            <div style="background-color: #fee2e2; color: #dc2626; padding: 20px; rounded-xl; border: 1px solid #fecaca; max-width: 400px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
              <h2 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 800;">অপ্রত্যাশিত সমস্যা!</h2>
              <p style="margin: 0 0 16px 0; font-size: 14px; font-weight: 500; color: #991b1b;">অ্যাপটি লোড করতে সমস্যা হচ্ছে। দয়া করে পেজটি রিফ্রেশ করুন অথবা আপনার ইন্টারনেট কানেকশন চেক করুন।</p>
              <button onclick="window.location.reload()" style="background-color: #dc2626; color: white; border: none; padding: 10px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: opacity 0.2s;">Refresh Page</button>
            </div>
            <p style="margin-top: 16px; font-size: 10px; color: #ef4444; font-family: monospace;">Error: ${message}</p>
          </div>
        `;
      }
    }, 3000);
  };
}

if (window.location.hostname === 'fahiminternet.com' || window.location.hostname === 'fahiminternetbd.com') {
  // Safe redirect fallback: show a high-quality loading spinner while navigating to the main www domain
  if (typeof document !== 'undefined' && document.body) {
    document.body.innerHTML = `
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #ecfdf5; font-family: system-ui, -apple-system, sans-serif; padding: 16px; box-sizing: border-box;">
        <div style="width: 48px; height: 48px; border: 4px solid #10b981; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px;"></div>
        <h2 style="color: #064e3b; font-weight: bold; font-size: 1.25rem; margin: 0; text-align: center; line-height: 1.4;">www.fahiminternet.com এ রিডাইরেক্ট করা হচ্ছে...</h2>
        <p style="color: #047857; font-size: 0.875rem; margin-top: 8px; text-align: center;">অনুগ্রহ করে একটু অপেক্ষা করুন।</p>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
      </div>
    `;
  }
  
  // Perform the window location replacement
  const targetUrl = 'https://www.fahiminternet.com' + window.location.pathname + window.location.search + window.location.hash;
  if (window.location.href !== targetUrl) {
    window.location.replace(targetUrl);
  }
} else {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
}

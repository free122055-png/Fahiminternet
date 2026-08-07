import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

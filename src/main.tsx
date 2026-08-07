import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error tracking for better diagnostics
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Captured Error Event:', event.error || event.message);
    const root = document.getElementById('root');
    if (root && root.innerHTML === '') {
      root.innerHTML = `
        <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #fef2f2; font-family: system-ui, -apple-system, sans-serif; padding: 24px; text-align: center;">
          <div style="background-color: #fee2e2; color: #dc2626; padding: 24px; border-radius: 20px; border: 1px solid #fecaca; max-width: 450px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);">
            <div style="width: 48px; height: 48px; background: #ef4444; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px; font-weight: bold;">!</div>
            <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 800; color: #7f1d1d;">সিস্টেম লোড হতে সমস্যা হচ্ছে</h2>
            <p style="margin: 0 0 20px 0; font-size: 14px; font-weight: 500; color: #991b1b; line-height: 1.5;">অ্যাপ্লিকেশনটি চালু করার সময় একটি যান্ত্রিক ত্রুটি ঘটেছে। অনুগ্রহ করে আপনার ইন্টারনেট চেক করুন এবং পুনরায় চেষ্টা করুন।</p>
            <button onclick="window.location.reload()" style="width: 100%; background-color: #dc2626; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.2);">পেজ রিফ্রেশ করুন</button>
          </div>
          <div style="margin-top: 20px; background: #f8fafc; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; text-align: left; max-width: 90%;">
             <p style="margin: 0; font-size: 10px; color: #64748b; font-family: monospace; word-break: break-all;">Diagnostic: ${event.message || 'Unknown runtime error'}</p>
          </div>
        </div>
      `;
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
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

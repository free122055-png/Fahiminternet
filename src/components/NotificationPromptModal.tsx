import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, ShieldCheck, X, Sparkles, Settings } from 'lucide-react';
import { requestFcmToken } from '../lib/fcmService';

interface NotificationPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export default function NotificationPromptModal({
  isOpen,
  onClose,
  userId,
  showToast
}: NotificationPromptModalProps) {
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAllow = async () => {
    if (permissionStatus === 'denied') {
      showToast?.('❌ ব্রাউজার সেটিং থেকে নোটিফিকেশন ব্লক করা রয়েছে। অনুগ্রহ করে সেটিংস থেকে Allow করুন।', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = await requestFcmToken(userId, true);
      if (token) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        if (typeof window !== 'undefined' && 'Notification' in window) {
          setPermissionStatus(Notification.permission);
          if (Notification.permission === 'denied') {
            showToast?.('❌ ব্রাউজার সেটিং থেকে নোটিফিকেশন ব্লক করা হয়েছে।', 'error');
          } else {
            showToast?.('⚠️ নোটিফিকেশন এলাউ করা হয়নি।', 'info');
          }
        }
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      showToast?.('❌ সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {success ? (
             <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
               <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ type: "spring", bounce: 0.5 }}
               >
                 <CheckCircle2 className="w-20 h-20 text-emerald-500" />
               </motion.div>
               <h3 className="text-2xl font-black text-slate-800">নোটিফিকেশন চালু হয়েছে ✓</h3>
             </div>
          ) : (
            <>
              {/* Modal Content */}
              <div className="p-8 space-y-6 text-slate-800 text-center flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center shadow-inner mb-2 border-4 border-white shadow-xl relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
                  <Bell className="w-10 h-10 text-blue-600 animate-bounce" />
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 leading-tight">
                  🔔 নোটিফিকেশন চালু করুন
                </h3>
                
                <p className="text-[15px] text-slate-600 font-medium leading-relaxed">
                  নতুন ইন্টারনেট অফার, রিচার্জ কনফার্মেশন ও গুরুত্বপূর্ণ আপডেট সরাসরি আপনার ফোনের Notification Bar-এ পেতে নোটিফিকেশন চালু করুন।
                </p>

                {/* Action Buttons */}
                <div className="space-y-3 w-full pt-4">
                  {permissionStatus === 'denied' ? (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100">
                      <Settings className="w-6 h-6 shrink-0" />
                      <p className="text-left">Browser Settings থেকে Notification চালু করুন</p>
                    </div>
                  ) : (
                    <button
                      onClick={handleAllow}
                      disabled={loading}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-base rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Bell className="w-5 h-5" />
                      <span>{loading ? 'অনুমতি নেওয়া হচ্ছে...' : '🔔 নোটিফিকেশন চালু করুন'}</span>
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    পরে করব
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

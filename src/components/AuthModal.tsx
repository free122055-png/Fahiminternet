import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, User, Loader2, Wifi, ArrowRight, X, UserPlus } from 'lucide-react';
import { auth, db, googleProvider, signInWithPopup } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { SiteSettings } from '../types';
import { requestFcmToken, sendLocalNotification } from '../lib/fcmService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (isAdmin: boolean) => void;
  message?: string;
  settings?: SiteSettings;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess, message, settings, showToast }: AuthModalProps) {
  if (!isOpen) return null;

  const safeAlert = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (showToast) showToast(msg, type);
    else alert(msg);
  };
  
  const notifyUser = async (userId: string, title: string, message: string) => {
    if (!userId) return;
    requestFcmToken(userId);
    sendLocalNotification(title, message);
    try {
      await fetch('/api/fcm/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, message })
      });
    } catch (e) {
      console.error('Push Notification Error:', e);
    }
  };

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const isAdmin = user.email === 'free122055@gmail.com';
        
        // Save or update user in Firestore
        await setDoc(doc(db, 'users', user.uid), { 
            uid: user.uid, 
            email: user.email, 
            displayName: user.displayName || 'User', 
            photoURL: user.photoURL,
            role: isAdmin ? 'admin' : 'user' 
        }, { merge: true });

        safeAlert('🎉 গুগল লগইন সফল!');
        notifyUser(user.email || user.uid, 'গুগল লগইন সফল!', 'আপনার একাউন্টে সফলভাবে লগইন হয়েছে।');
        onLoginSuccess?.(isAdmin);
        onClose();
    } catch (e: any) {
        console.error('Google Auth Error:', e);
        safeAlert('গুগল লগইন ব্যর্থ।', 'error');
        notifyUser('guest', 'গুগল লগইন ব্যর্থ', 'লগইন করার সময় একটি সমস্যা হয়েছে।');
    } finally {
        setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let cleanPhone = phone.replace(/[^0-9]/g, '');
    
    if (!cleanPhone.startsWith('0')) {
        cleanPhone = '0' + cleanPhone;
    }

    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      safeAlert('⚠️ সঠিক ১১ ডিজিটের নম্বর দিন!', 'error');
      setLoading(false);
      return;
    }

    const authEmail = `${cleanPhone}@fahim-internet.com`;
    const authPassword = `${cleanPhone}_fahim_secure_122055`;
    const isAdmin = ['01618599077', '01764346995'].includes(cleanPhone);

    try {
      if (isRegister) {
        if (!fullName) {
            safeAlert('⚠️ অনুগ্রহ করে আপনার নাম লিখুন!', 'error');
            setLoading(false);
            return;
        }
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        const user = auth.currentUser!;
        await updateProfile(user, { displayName: fullName });
        
        await setDoc(doc(db, 'users', user.uid), { 
            uid: user.uid, 
            phone: phone, 
            displayName: fullName, 
            role: isAdmin ? 'admin' : 'user' 
        });
        
        safeAlert('🎉 রেজিস্ট্রেশন সফল!');
        notifyUser(cleanPhone, 'স্বাগতম!', 'আপনার একাউন্ট সফলভাবে তৈরি হয়েছে।');
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
        safeAlert('🎉 লগইন সফল!');
        notifyUser(cleanPhone, 'লগইন সফল!', 'আপনার একাউন্টে সফলভাবে লগইন হয়েছে।');
      }
      onLoginSuccess?.(isAdmin);
      onClose();
    } catch(e: any) {
      console.error('Auth Error:', e);
      let errorMessage = isRegister ? 'রেজিস্ট্রেশন ব্যর্থ।' : 'লগইন ব্যর্থ।';
      if (e.code === 'auth/invalid-credential') {
          if (!isRegister) {
            safeAlert('লগইন করার চেষ্টা করছি...', 'info');
          }
          errorMessage = 'ভুল তথ্য। যদি একাউন্ট না থাকে, তবে রেজিস্টার করুন।';
      } else if (e.code === 'auth/email-already-in-use') {
          errorMessage = 'এই নম্বরটি ইতিমধ্যে ব্যবহৃত হয়েছে। দয়া করে লগইন করুন।';
      } else {
          errorMessage = isRegister ? `রেজিস্ট্রেশন ব্যর্থ: ${e.message}` : `লগইন ব্যর্থ: ${e.message}`;
      }
      safeAlert(errorMessage, 'error');
      notifyUser(cleanPhone, isRegister ? 'রেজিস্ট্রেশন ব্যর্থ' : 'লগইন ব্যর্থ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-50/95 backdrop-blur-md overflow-y-auto">
      {/* Decorative SVG corners matching the design exactly */}
      <div className="absolute top-0 left-0 w-64 md:w-96 pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform -translate-x-10 -translate-y-10">
          <path fill="#0a6b2b" d="M0,0 L200,0 C150,50 100,150 0,200 Z" />
          <path fill="#0d8536" d="M0,0 L150,0 C100,60 50,120 0,150 Z" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-64 md:w-96 pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform translate-x-10 translate-y-10">
          <path fill="#0a6b2b" d="M200,200 L0,200 C50,150 100,50 200,0 Z" />
          <path fill="#0d8536" d="M200,200 L50,200 C100,140 150,80 200,50 Z" />
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-white rounded-[40px] shadow-2xl p-6 sm:p-8 relative z-10 my-8"
      >
        <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
        </button>

        <div className="flex flex-col items-center text-center mb-8 mt-2">
            <Wifi size={48} strokeWidth={2.5} className="text-[#0d8536] mb-3" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#0d8536] tracking-tight">FAHIM INTERNET</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Fast & Reliable Internet Services</p>
        </div>

        {/* Welcome / Register Banner */}
        <div className="bg-[#eaf8f0] rounded-2xl p-4 flex items-center gap-4 mb-6">
          <div className="w-10 h-10 flex items-center justify-center">
            {isRegister ? (
                <UserPlus className="text-[#0d8536]" size={32} strokeWidth={1.5} />
            ) : (
                <User className="text-[#0d8536]" size={32} strokeWidth={1.5} />
            )}
          </div>
          <div>
            <h3 className="text-slate-900 font-bold text-lg leading-tight">
                {isRegister ? "Create Account" : "Welcome Back!"}
            </h3>
            <p className="text-slate-600 text-sm mt-0.5">
                {isRegister ? "Register with your mobile number" : "Login with your mobile number"}
            </p>
          </div>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegister && (
                <div>
                    <div className="flex items-center gap-2 mb-2 ml-1">
                        <User size={16} className="text-[#0d8536]" />
                        <label className="text-sm font-bold text-slate-900">Full Name</label>
                    </div>
                    <input 
                        type="text"
                        placeholder="Enter your name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white border border-[#b2e2c6] rounded-xl text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:border-[#0d8536] focus:ring-1 focus:ring-[#0d8536] transition-all text-base"
                    />
                </div>
            )}
            
            <div>
                <div className="flex items-center gap-2 mb-2 ml-1">
                    <Phone size={16} className="text-[#0d8536]" />
                    <label className="text-sm font-bold text-slate-900">Mobile Number</label>
                </div>
                <input 
                    type="tel"
                    placeholder="01XXX-XXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white border border-[#b2e2c6] rounded-xl text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:border-[#0d8536] focus:ring-1 focus:ring-[#0d8536] transition-all text-base tracking-wide"
                />
            </div>

            <button
                type="submit"
                className="w-full py-4 mt-2 bg-[#0d8536] hover:bg-[#0a6b2b] text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20"
            >
                {loading ? <Loader2 className="animate-spin w-6 h-6"/> : (isRegister ? "Register" : "Login")}
                {!loading && <ArrowRight size={20} />}
            </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-slate-400 font-semibold text-sm">OR</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <button 
            onClick={handleGoogleLogin} 
            type="button"
            className="w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-base rounded-xl flex items-center justify-center gap-3 transition-all mb-4"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
        </button>

        <button 
            type="button"
            onClick={() => setIsRegister(!isRegister)} 
            className="w-full bg-[#eaf8f0] hover:bg-[#d5f1e1] rounded-xl p-4 flex items-center justify-center gap-2 transition-colors mt-2"
        >
            <User className="text-[#0d8536]" size={20} strokeWidth={2} />
            <span className="text-slate-600 font-medium text-sm">
                {isRegister ? "Already have an account?" : "Don't have an account?"} <span className="text-[#0d8536] font-bold">{isRegister ? "Login" : "Register"}</span>
            </span>
        </button>

      </motion.div>
    </div>
  );
}


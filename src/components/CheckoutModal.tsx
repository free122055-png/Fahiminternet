import React, { useState } from 'react';
import { DataPack, Order, SiteSettings } from '../types';
import { X, ShieldCheck, Copy, Check, ChevronRight, Phone, Wallet, AlertCircle, Shield, Lock, CheckCircle, Info, Users, ArrowRight, ArrowLeft, CreditCard, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { GPLogo, RobiLogo, BanglalinkLogo, AirtelLogo, TeletalkLogo } from './OperatorLogos';
import { BKashLogo, NagadLogo, RocketLogo, UpayLogo, CellfinLogo, BankingLogo } from './BrandLogos';

interface CheckoutModalProps {
  pack: DataPack;
  onClose: () => void;
  onSubmitOrder: (order: Order) => void;
  settings: SiteSettings;
  currentUser?: any;
}

// Custom Premium Operator Logos drawn with high-fidelity SVGs
function OperatorLogo({ operator, settings, className = "w-12 h-12" }: { operator: string, settings?: SiteSettings, className?: string }) {
  let customLogoUrl = '';
  if (settings) {
    if (operator === 'GP') customLogoUrl = settings.gpLogoUrl || '';
    else if (operator === 'Robi') customLogoUrl = settings.robiLogoUrl || '';
    else if (operator === 'Airtel') customLogoUrl = settings.airtelLogoUrl || '';
    else if (operator === 'Banglalink') customLogoUrl = settings.blLogoUrl || '';
    else if (operator === 'Teletalk') customLogoUrl = settings.teletalkLogoUrl || '';
  }

  if (customLogoUrl) {
    return (
      <img
        src={customLogoUrl}
        alt={operator}
        className={`${className} object-contain pointer-events-none`}
        referrerPolicy="no-referrer"
      />
    );
  }

  if (operator === 'GP') {
    return <GPLogo className={`${className} pointer-events-none`} size="100%" />;
  }
  if (operator === 'Robi') {
    return <RobiLogo className={`${className} pointer-events-none`} size="100%" />;
  }
  if (operator === 'Airtel') {
    return <AirtelLogo className={`${className} pointer-events-none`} size="100%" />;
  }
  if (operator === 'Banglalink') {
    return <BanglalinkLogo className={`${className} pointer-events-none`} size="100%" />;
  }
  // Teletalk & default
  return <TeletalkLogo className={`${className} pointer-events-none`} size="100%" />;
}

// Beautiful customized SVGs for the payment methods in the checkout panel
function PaymentMethodIcon({ method, settings, className = "w-8 h-8" }: { method: string, settings?: SiteSettings, className?: string }) {
  if (method === 'wallet') {
    return (
      <div className={`${className} bg-emerald-500/20 rounded-xl p-1.5 flex items-center justify-center border border-emerald-400/30 text-emerald-600`}>
        <Wallet className="w-full h-full text-emerald-600" />
      </div>
    );
  }
  if (method === '') {
    return (
      <div className={`${className} bg-emerald-500/20 rounded-xl p-1.5 flex items-center justify-center border border-emerald-400/30 text-emerald-400`}>
        <Zap className="w-full h-full fill-emerald-400" />
      </div>
    );
  }
  if (method === 'bkash') {
    return <BKashLogo className={className} customLogoUrl={settings?.bkashLogoUrl} />;
  }
  if (method === 'nagad') {
    return <NagadLogo className={className} customLogoUrl={settings?.nagadLogoUrl} />;
  }
  if (method === 'rocket') {
    return <RocketLogo className={className} customLogoUrl={settings?.rocketLogoUrl} />;
  }
  if (method === 'upay') {
    return <UpayLogo className={className} customLogoUrl={settings?.upayLogoUrl} />;
  }
  if (method === 'cellfin') {
    return <CellfinLogo className={className} customLogoUrl={settings?.cellfinLogoUrl} />;
  }
  if (method === 'binance') {
    return (
      <svg className={`${className} pointer-events-none`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="16" fill="#181A20" />
        <g transform="translate(10, 10)">
          <path d="M40 10 L68 38 L40 66 L12 38 Z" fill="#F0B90B" className="opacity-20" />
          <path d="M40 22 L56 38 L40 54 L24 38 Z" fill="#F0B90B" />
          <path d="M40 10 L48 18 L40 26 L32 18 Z" fill="#F0B90B" />
          <path d="M68 38 L60 46 L52 38 L60 30 Z" fill="#F0B90B" />
          <path d="M40 66 L32 58 L40 50 L48 58 Z" fill="#F0B90B" />
          <path d="M12 38 L20 30 L28 38 L20 46 Z" fill="#F0B90B" />
        </g>
      </svg>
    );
  }
  if (method === 'banking') {
    return <BankingLogo className={className} customLogoUrl={settings?.bankingLogoUrl} />;
  }
  // default / ucb
  return (
    <svg className={`${className} pointer-events-none`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="16" fill="#D31115" />
      <circle cx="50" cy="50" r="30" fill="#D31115" />
      <path d="M30 50 C30 38, 42 30, 58 30 C46 30, 38 38, 38 50 C38 62, 46 70, 58 70 C42 70, 30 62, 30 50 Z" fill="#FFC72C" />
      <text x="52" y="58" fill="white" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">U</text>
    </svg>
  );
}

export default function CheckoutModal({ pack, onClose, onSubmitOrder, settings, currentUser }: CheckoutModalProps) {
  const activeUser = currentUser || auth.currentUser;
  
  // Prefill phone if provided from RechargeModal or logged in user
  const initialPhone = pack.targetPhone || (pack as any).phone || currentUser?.phone || '';

  const isAddMoneyPack = pack.id.startsWith('add-money') || pack.title.includes('এড মানি') || pack.title.includes('ব্যালেন্স') || (pack.category as string) === 'add_money';
  const isRechargePack = (pack.id.startsWith('recharge-') || pack.title.includes('ইনস্ট্যান্ট মোবাইল রিচার্জ') || pack.category === 'recharge') && !isAddMoneyPack;

  const cleanInitialPhone = initialPhone.replace(/[^0-9]/g, '');
  // For Add Money, skip target phone entry and start directly at payment step (Step 2)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(() => isAddMoneyPack ? 2 : 1);
  const [copied, setCopied] = useState(false);

  // User input states
  const [targetPhone, setTargetPhone] = useState(() => {
    if (isAddMoneyPack) return currentUser?.phone || activeUser?.phone || cleanInitialPhone || '01700000000';
    return cleanInitialPhone || initialPhone;
  });
  const [selectedOperator, setSelectedOperator] = useState<string>(pack.operator);
  const [selectedDivision, setSelectedDivision] = useState<string>('ঢাকা (Dhaka)');
  const [selectedPayment, setSelectedPayment] = useState<string>(() => {
    if (isAddMoneyPack) return 'bkash';
    const userBal = Number(activeUser?.balance || 0);
    if (!isRechargePack && userBal >= pack.salePrice) return 'wallet';
    return 'bkash';
  });
  // Manual payment inputs
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Generated Order Details
  const [orderId, setOrderId] = useState('');

  const handlePhoneChange = (val: string) => {
    const cleanNum = val.replace(/[^0-9]/g, '').slice(0, 11);
    setTargetPhone(cleanNum);
    
    // Auto-detect Bangladeshi operator from prefix
    if (cleanNum.length >= 3) {
      const prefix = cleanNum.substring(0, 3);
      if (['017', '013'].includes(prefix)) {
        setSelectedOperator('GP');
      } else if (['018'].includes(prefix)) {
        setSelectedOperator('Robi');
      } else if (['016'].includes(prefix)) {
        setSelectedOperator('Airtel');
      } else if (['019', '014'].includes(prefix)) {
        setSelectedOperator('Banglalink');
      } else if (['015'].includes(prefix)) {
        setSelectedOperator('Teletalk');
      }
    }
  };

  // Fixed/User specified payment numbers mapping
  const paymentNumbers: Record<string, string> = {
    bkash: settings.bkashNumber || '01618599077',
    nagad: settings.nagadNumber || '01624228476',
    rocket: settings.rocketNumber || '01624228476',
    upay: settings.upayNumber || '01618599077',
    cellfin: settings.cellfinNumber || '01624228476',
    binance: settings.binanceNumber || '524228476',
    banking: settings.bankingNumber || 'DBBL A/C: 123-456-7890 (Personal)',
    ucb: settings.ucbNumber || 'UCB A/C: 987-654-3210 (Personal)',
  };

  const getPaymentName = (method: string) => {
    switch (method) {
      case 'wallet': return `💳 মেইন ওয়ালেট ব্যালেন্স (বর্তমান: ৳${activeUser?.balance || 0})`;
      case 'bkash': return 'বিকাশ (bKash)';
      case 'nagad': return 'নগদ (Nagad)';
      case 'rocket': return 'রকেট (Rocket)';
      case 'upay': return 'উপায় (Upay)';
      case 'cellfin': return 'সেলফিন (CellFin)';
      case 'binance': return 'Binance';
      case 'banking': return 'ব্যাংকিং সুবিধা';
      case 'ucb': return 'UCB Bank 🏦';
      default: return 'কার্ড পেমেন্ট';
    }
  };

  const handleCopy = () => {
    const num = paymentNumbers[selectedPayment] || '';
    if (num) {
      navigator.clipboard.writeText(num);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const submitOrderManually = async (genId: string) => {
    const generatedId = genId || orderId || 'FI-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);

    const isRechargeOrder = true;
    const rechargeType = (pack as any).rechargeType || 'flexiload';

    const newOrder: Order = {
      id: generatedId,
      customerPhone: targetPhone,
      operator: selectedOperator as any,
      packId: pack.id,
      packTitle: pack.title,
      price: pack.salePrice,
      paymentMethod: selectedPayment,
      paymentPhone: senderPhone,
      transactionId: transactionId.toUpperCase().trim() || `MANUAL-TXN-${Date.now()}`,
      status: 'pending', // Set to pending for manual approval
      createdAt: new Date().toISOString(),
      division: selectedDivision,
      userId: activeUser?.uid || undefined,
      isRecharge: true,
      rechargeType: rechargeType,
    };

    // Save directly to Firestore as pending
    try {
      await setDoc(doc(db, 'orders', generatedId), newOrder);
    } catch (e) {
      console.warn('Firestore setDoc order error:', e);
    }

    onSubmitOrder(newOrder);

    // Show success message, but don't trigger confetti/api
    setStep(4);
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isMobilePayment = ['bkash', 'nagad', 'rocket', 'upay', 'cellfin'].includes(selectedPayment);
    if (isMobilePayment) {
      const cleanSender = senderPhone.replace(/[^0-9]/g, '');
      if (cleanSender.length !== 11 || !cleanSender.startsWith('01')) {
        alert('⚠️ অনুগ্রহ করে সঠিক ১১ ডিজিটের পেমেন্ট প্রেরক নম্বর দিন!');
        return;
      }
    } else {
      if (!senderPhone.trim()) {
        alert('⚠️ অনুগ্রহ করে আপনার পেমেন্ট অ্যাকাউন্ট বিবরণী/আইডি প্রদান করুন!');
        return;
      }
    }
    if (!transactionId.trim() || transactionId.trim().length < 5) {
      alert('⚠️ অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি (TxID) প্রদান করুন!');
      return;
    }
    if (!agreedToTerms) {
      alert('⚠️ অনুগ্রহ করে শর্তাবলী ও গোপনীয় নীতিমালায় সম্মত হন!');
      return;
    }

    // Generate Order ID (FI-XXXXXX)
    const generatedId = orderId || 'FI-' + Math.floor(100000 + Math.random() * 900000);
    if (!orderId) {
      setOrderId(generatedId);
    }

    submitOrderManually(generatedId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      {/* Container sizing matches premium rich dashboard style */}
      <div className="bg-[#F8FAFC] w-full h-full md:h-auto md:max-h-[92vh] md:max-w-5xl md:rounded-xl shadow-md overflow-hidden relative border border-slate-100 flex flex-col font-sans">
        
        {/* UPPER BANNER / TOPBAR HEADER */}
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-20 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              type="button"
              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all cursor-pointer border border-slate-100 mr-1 flex items-center justify-center active:scale-95 group"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3] group-hover:-translate-x-0.5 transition-transform pointer-events-none" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-0.5 overflow-hidden shadow-sm shrink-0">
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt="FAHIM INTERNET Logo" 
                  referrerPolicy="no-referrer" 
                  className="w-full h-full object-contain pointer-events-none" 
                />
              ) : (
                <div className="w-full h-full p-0.5 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" className="w-full h-full select-none">
                    <defs>
                      <linearGradient id="chkLogoFGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0B2B6E" />
                        <stop offset="100%" stopColor="#051230" />
                      </linearGradient>
                      <linearGradient id="chkLogoIGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0EA5E9" />
                        <stop offset="100%" stopColor="#0284C7" />
                      </linearGradient>
                      <linearGradient id="chkLogoSwoosh" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0B2B6E" />
                        <stop offset="100%" stopColor="#0055CC" />
                      </linearGradient>
                      <linearGradient id="chkLogoWifiArcs" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00A0FF" />
                        <stop offset="100%" stopColor="#0066FF" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M10,72 C5,60 12,50 18,54 C15,68 25,82 52,86 Q78,90 95,78 C104,45 105,41 109,42 C108,46 Q98,82 78,95 C50,91 24,87 14,81 L10,72 Z" 
                      fill="url(#chkLogoSwoosh)" 
                    />
                    <path 
                      d="M26,80 L41,35 Q42,32 46,32 L74,32 Q77,32 75,37 Q74,41 70,41 L51,41 L47,52 L64,52 Q67,52 65,57 Q64,61 60,61 L44,61 L38,80 C37,83 32,83 32,80 Z" 
                      fill="url(#chkLogoFGrad)" 
                    />
                    <path 
                      d="M60,85 L71,51 Q72,48 76,48 L84,48 Q87,48 85,52 L74,85 Q73,88 69,88 L61,88 Q59,88 60,85 Z" 
                      fill="url(#chkLogoIGrad)" 
                    />
                    <circle cx="88" cy="44" r="4.5" fill="#0f172a" />
                    <path d="M80,36 A11,11 0 0,1 96,36" fill="none" stroke="url(#chkLogoWifiArcs)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M74,29 A20,20 0 0,1 102,29" fill="none" stroke="url(#chkLogoWifiArcs)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M68,22 A29,29 0 0,1 108,22" fill="none" stroke="url(#chkLogoWifiArcs)" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-black text-slate-900 tracking-tight leading-none uppercase">Checkout</span>
              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mt-1">ধাপে ধাপে নিরাপদ পেমেন্ট</span>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
            <Shield className="w-3.5 h-3.5 text-emerald-600 pointer-events-none" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider pointer-events-none">Secure 256-bit SSL</span>
          </div>
        </div>

        {/* STEP PROGRESS STEPPER - Explicit 4 Steps */}
        <div className="bg-white px-4 sm:px-6 py-3 border-b border-slate-100 flex justify-center items-center gap-1.5 sm:gap-3 md:gap-6 shadow-sm overflow-x-auto flex-shrink-0">
          {[
            { id: 1, label: '১. তথ্য ও নম্বর' },
            { id: 2, label: '২. পেমেন্ট মাধ্যম' },
            { id: 3, label: '৩. ভেরিফিকেশন' },
            { id: 4, label: '৪. সফল' }
          ].map((s, idx, arr) => (
            <React.Fragment key={s.id}>
              <button
                type="button"
                onClick={() => {
                  if (s.id <= 3) setStep(s.id as any);
                }}
                className={`flex items-center gap-1.5 sm:gap-2 shrink-0 border-none bg-transparent cursor-pointer ${
                  step === s.id ? 'text-slate-900 font-black' : 'text-slate-500 font-bold hover:text-slate-800'
                }`}
              >
                <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-mono border-2 transition-all pointer-events-none ${
                  step === s.id 
                    ? 'bg-slate-900 text-white border-slate-950 shadow-md scale-105' 
                    : step > s.id ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-100 border-slate-300 text-slate-600'
                }`}>
                  {step > s.id ? <Check className="w-3 h-3 stroke-[4]" /> : s.id}
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap pointer-events-none">{s.label}</span>
              </button>
              {idx < arr.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 shrink-0 pointer-events-none" />}
            </React.Fragment>
          ))}
        </div>

        {/* BODY AREA */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-grow space-y-6 bg-slate-50/30">
          
          {/* COMPACT MOBILE HEADER */}
          <div className="lg:hidden bg-slate-950 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg border border-white/5 relative overflow-hidden">
            <div className="flex items-center gap-3.5 min-w-0 relative z-10">
              <div className="bg-white rounded-xl p-1.5 w-12 h-12 flex items-center justify-center border border-white/10 shadow-md shrink-0">
                <OperatorLogo operator={selectedOperator} settings={settings} className="w-9 h-9" />
              </div>
              <div className="min-w-0">
                <span className="px-2 py-0.5 bg-white/10 text-white text-[8px] font-black rounded-full uppercase tracking-wider border border-white/20 inline-block mb-1">
                  {selectedOperator} অফার
                </span>
                <h4 className="text-xs font-black text-white truncate leading-tight">{pack.title}</h4>
                <p className="text-[9px] text-slate-400 font-bold mt-0.5">মেয়াদ: {pack.validity}</p>
              </div>
            </div>
            <div className="text-right shrink-0 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl relative z-10">
              <span className="text-[9px] text-slate-400 font-extrabold block leading-none">মূল্য</span>
              <span className="text-base font-black text-emerald-400 mt-1 block leading-none">৳{pack.salePrice}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: ACTIVE STEP FORMS */}
            <div className="lg:col-span-8 space-y-6">
              
              <AnimatePresence mode="wait">
                
                {/* STEP 1: MOBILE NUMBER & OPERATOR/DIVISION */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                      
                      {/* Step Header */}
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm font-black text-sm">
                          ১
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">টার্গেট মোবাইল নম্বর ও বিবরণ</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">যে নম্বরে অফারটি সক্রিয় হবে সেটি লিখুন</p>
                        </div>
                      </div>

                      {/* Phone Input */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-700 block">মোবাইল নম্বর (১১ ডিজিট)</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-3 border-r border-slate-100 h-6">
                            <span className="text-xs font-black text-slate-400 font-mono">+88</span>
                          </div>
                          <input
                            type="tel"
                            required
                            placeholder="01XXXXXXXXX"
                            value={targetPhone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            className="w-full pl-16 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl text-base font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all font-mono text-slate-900"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                            <Users className="w-5 h-5" />
                          </div>
                        </div>
                        {targetPhone.length > 0 && targetPhone.length < 11 && (
                          <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>কমপক্ষে ১১ ডিজিট প্রদান করতে হবে ({targetPhone.length}/11)</span>
                          </p>
                        )}
                      </div>

                      {/* Operator Selection */}
                      <div className="space-y-3 pt-2">
                        <label className="text-[11px] text-slate-500 uppercase tracking-widest font-black flex items-center justify-between">
                          <span>সিম অপারেটর নির্বাচন করুন</span>
                          <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-extrabold">অটো ডিটেক্টেড</span>
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                          {['GP', 'Robi', 'Airtel', 'Banglalink', 'Teletalk'].map((op) => (
                            <button
                              key={op}
                              type="button"
                              onClick={() => setSelectedOperator(op)}
                              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer relative select-none ${
                                selectedOperator === op 
                                  ? 'border-slate-950 bg-slate-900 text-white shadow-md ring-2 ring-slate-950/20' 
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <OperatorLogo operator={op} settings={settings} className="w-8 h-8 mb-1" />
                              <span className={`text-[9px] font-black pointer-events-none ${selectedOperator === op ? 'text-white' : 'text-slate-700'}`}>{op}</span>
                              {selectedOperator === op && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow">
                                  <Check className="w-2.5 h-2.5 stroke-[4]" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Division Selection */}
                      <div className="space-y-3 pt-2">
                        <label className="text-[11px] text-slate-500 uppercase tracking-widest font-black block">
                          বিভাগ (Division) নির্বাচন করুন
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['ঢাকা (Dhaka)', 'চট্টগ্রাম (Ctg)', 'সিলেট (Sylhet)', 'রাজশাহী (Raj)', 'খুলনা (Khulna)', 'বরিশাল (Barisal)', 'রংপুর (Rangpur)', 'ময়মনসিংহ (Mym)'].map((div) => {
                            const isSelected = selectedDivision.includes(div.split(' ')[0]);
                            return (
                              <button
                                key={div}
                                type="button"
                                onClick={() => setSelectedDivision(div)}
                                className={`px-3.5 py-2 rounded-xl border text-[10px] font-black transition-all cursor-pointer select-none ${
                                  isSelected 
                                    ? 'border-slate-950 bg-slate-950 text-white shadow' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                <span className="pointer-events-none">{div}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-black text-xs sm:text-sm rounded-2xl hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                      >
                        বাতিল করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (isAddMoneyPack) {
                            setStep(2);
                            return;
                          }
                          const clean = targetPhone.replace(/[^0-9]/g, '');
                          if (clean.length !== 11 || !clean.startsWith('01')) {
                            alert('⚠️ অনুগ্রহ করে যে নম্বরে অফার/এমবি পাঠাতে চান, সেই সঠিক ১১ ডিজিটের টার্গেট মোবাইল নম্বর (01XXXXXXXXX) প্রদান করুন!');
                            return;
                          }
                          setStep(2);
                        }}
                        className="flex-[2] py-4 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 active:scale-95 transition-all cursor-pointer group"
                      >
                        <span>পরবর্তী ধাপ: পেমেন্ট মেথড (Step 2)</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform pointer-events-none" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: PAYMENT METHOD SELECTION */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                      
                      {/* Step Header */}
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm font-black text-sm">
                          ২
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">পেমেন্ট মাধ্যম নির্বাচন করুন</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">আপনার সুবিধাজনক অটো গেটওয়ে বা ম্যানুয়াল মোবাইল ব্যাংকিং নির্বাচন করুন</p>
                        </div>
                      </div>

                      {/* Payment Options Header */}
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-between">
                          <span>পেমেন্ট মেথড বেছে নিন (বিকাশ / নগদ / রকেট)</span>
                          <span className="text-[9px] bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-black">
                            ✓ অটো রিচার্জ এনাবলড
                          </span>
                        </label>
                      </div>

                      {/* Payment Options Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          ...(!isAddMoneyPack ? [{ id: 'wallet', label: 'মেইন ওয়ালেট (Wallet)', tag: `ব্যালেন্স: ৳${activeUser?.balance || 0}` }] : []),
                          { id: 'bkash', label: 'Bkash', tag: 'Personal' },
                          { id: 'nagad', label: 'Nagad', tag: 'Personal' },
                          { id: 'rocket', label: 'Rocket', tag: 'Personal' },
                          { id: 'upay', label: 'Upay', tag: 'Personal' },
                          { id: 'cellfin', label: 'CellFin', tag: 'Personal' },
                          { id: 'banking', label: 'Bank Transfer', tag: 'Personal' }
                        ].map((m) => {
                          const isSelected = selectedPayment === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setSelectedPayment(m.id)}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col items-center justify-between min-h-[115px] select-none group ${
                                isSelected
                                  ? 'border-emerald-600 bg-slate-900 text-white shadow-lg ring-2 ring-emerald-500/20 scale-[1.02]'
                                  : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-500/70 hover:shadow-md'
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md z-10">
                                  <Check className="w-3 h-3 stroke-[3] pointer-events-none" />
                                </div>
                              )}
                              
                              <div className="h-10 w-full flex items-center justify-center p-0.5 my-auto">
                                <PaymentMethodIcon method={m.id} settings={settings} className="h-9 w-auto max-w-[130px] object-contain" />
                              </div>

                              <div className="w-full border-t border-slate-100 my-2" />

                              <div className="text-center w-full">
                                <span className={`text-xs font-black block truncate pointer-events-none ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                  {m.label}
                                </span>
                                <span className={`text-[10px] font-bold block truncate pointer-events-none mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                                  {m.tag}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Target Phone / Wallet Summary Box */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 text-xs font-bold">
                          <span className="text-slate-500">
                            {isAddMoneyPack ? 'ওয়ালেট অ্যাকাউন্ট (যার ব্যালেন্স যোগ হবে):' : 'টার্গেট নম্বর (যেখানে অফার যাবে):'}
                          </span>
                          <span className="font-mono font-black text-slate-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-emerald-800">
                            {isAddMoneyPack 
                              ? (activeUser?.displayName ? `${activeUser.displayName} (${activeUser.phone || activeUser.email || 'ওয়ালেট'})` : activeUser?.phone || 'আমার ওয়ালেট')
                              : `${targetPhone || 'প্রদান করা হয়নি'} (${selectedOperator})`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <PaymentMethodIcon method={selectedPayment} settings={settings} className="w-7 h-7 object-contain" />
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">নির্বাচিত মাধ্যম</span>
                              <span className="text-xs font-black text-slate-900">{getPaymentName(selectedPayment)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-bold block">পরিশোধযোগ্য</span>
                            <span className="text-sm font-black text-emerald-600 font-mono">৳{pack.salePrice}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-black text-xs sm:text-sm rounded-2xl hover:bg-slate-50 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4 pointer-events-none" />
                        <span>আগের ধাপ</span>
                      </button>

                      {selectedPayment === 'wallet' ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (targetPhone.length !== 11 || !targetPhone.startsWith('01')) {
                              alert('⚠️ অনুগ্রহ করে প্রথমে সঠিক ১১ ডিজিটের টার্গেট মোবাইল নম্বর দিন!');
                              setStep(1);
                              return;
                            }
                            const userBal = Number(activeUser?.balance || 0);
                            if (userBal < pack.salePrice) {
                              alert(`⚠️ আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই!\n\nঅফারটির মূল্য: ৳${pack.salePrice}\nআপনার বর্তমান ব্যালেন্স: ৳${userBal}\n\nঅনুগ্রহ করে প্রথমে এড মানি করে ওয়ালেটে টাকা রিচার্জ করুন।`);
                              return;
                            }
                            const generatedId = orderId || 'FI-' + Math.floor(100000 + Math.random() * 900000);
                            if (!orderId) setOrderId(generatedId);
                            submitOrderManually(generatedId);
                          }}
                          className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer group border-none"
                        >
                          <Zap className="w-4 h-4 fill-white" />
                          <span>অফার অর্ডার সাবমিট করুন (৳{pack.salePrice})</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform pointer-events-none" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="flex-[2] py-4 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 active:scale-95 transition-all cursor-pointer group"
                        >
                          <span>পরবর্তী ধাপ: ম্যানুয়াল পেমেন্ট (Step 3)</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform pointer-events-none" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: PAYMENT INSTRUCTIONS & VERIFICATION */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                      
                      {/* Step Header */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm font-black text-sm">
                            ৩
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900">পেমেন্ট ভেরিফিকেশন ও ট্রানজেকশন আইডি</h4>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{getPaymentName(selectedPayment)} নির্দেশিকা</p>
                          </div>
                        </div>
                        <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-black font-mono">
                          ৳{pack.salePrice}
                        </div>
                      </div>

                      {/* Send Money Instructions Box */}
                      <div className="bg-slate-950 rounded-2xl p-5 text-white space-y-4 relative overflow-hidden shadow-lg">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2.5">
                            <PaymentMethodIcon method={selectedPayment} settings={settings} className="w-7 h-7 object-contain" />
                            <span className="text-xs font-black tracking-wide">{getPaymentName(selectedPayment)} নম্বর</span>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[9px] font-black rounded-lg border border-emerald-500/30">
                            Send Money / পার্সোনাল
                          </span>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">টাকা পাঠানোর নম্বর</span>
                          <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3.5 rounded-xl gap-2">
                            <h3 className="text-lg sm:text-xl font-black font-mono tracking-wider text-white select-all">
                              {paymentNumbers[selectedPayment] || '01XXXXXXXXX'}
                            </h3>
                            <button 
                              type="button"
                              onClick={handleCopy}
                              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow"
                            >
                              {copied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[3] pointer-events-none" />
                                  <span>কপি হয়েছে</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 pointer-events-none" />
                                  <span>কপি করুন</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-1 text-slate-300">
                          <p className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" />
                            <span>ধাপ অনুযায়ী নির্দেশিকা:</span>
                          </p>
                          <p className="text-[10px] font-bold leading-relaxed text-slate-200">
                            ১. উপরের দেয়া নম্বরে ঠিক <strong className="text-emerald-400 font-mono">৳{pack.salePrice}</strong> টাকা Send Money সম্পন্ন করুন। <br />
                            ২. সফলভাবে সেন্ড মানি হওয়ার পর আপনার প্রেরক নম্বর এবং TrxID দিয়ে নিশ্চিত করুন।
                          </p>
                        </div>
                      </div>

                      {/* Sender Phone & TxID Form */}
                      <form onSubmit={handleStep3Submit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-700">আপনার পেমেন্ট নম্বর (যে নম্বর থেকে টাকা পাঠিয়েছেন)</label>
                            <input
                              type="tel"
                              required
                              placeholder="01XXXXXXXXX"
                              value={senderPhone}
                              onChange={(e) => setSenderPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white text-slate-900"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-700">ট্রানজেকশন আইডি (TxID)</label>
                            <input
                              type="text"
                              required
                              placeholder="উদাহরণ: TRX9827364"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white uppercase font-mono text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 pt-2">
                          <label className="flex items-start gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={agreedToTerms}
                              onChange={(e) => setAgreedToTerms(e.target.checked)}
                              className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4 cursor-pointer"
                            />
                            <span className="text-[10px] font-bold text-slate-600 leading-normal">
                              আমি সকল <span className="text-slate-900 font-black">শর্তাবলী</span> ও <span className="text-slate-900 font-black">গোপনীয় নীতিমালা</span> স্বীকার করে অর্ডারটি সাবমিট করছি।
                            </span>
                          </label>
                        </div>

                        <div className="flex gap-4 pt-2">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-black text-xs sm:text-sm rounded-2xl hover:bg-slate-50 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <ArrowLeft className="w-4 h-4 pointer-events-none" />
                            <span>আগের ধাপ</span>
                          </button>
                          <button
                            type="submit"
                            className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer group"
                          >
                            <ShieldCheck className="w-5 h-5 pointer-events-none" />
                            <span>অর্ডার নিশ্চিত করুন (Confirm Order)</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: SUCCESS CELEBRATION */}
                {step === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl border border-slate-100 shadow-sm text-center space-y-6 max-w-xl mx-auto"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50 shadow-inner">
                      <ShieldCheck className="w-10 h-10 stroke-[2.5]" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-950">🎉 আপনার অর্ডারটি সফলভাবে রিসিভ করা হয়েছে!</h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto leading-relaxed">
                        আপনার পেমেন্ট ও রিকোয়েস্ট সফলভাবে জমা হয়েছে এবং বর্তমানে পেন্ডিং রয়েছে। খুব শীঘ্রই আপনার অফারটি চালু করা হবে।
                      </p>
                    </div>

                    {/* Order ID & Tracking Reference Card */}
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2.5 text-xs font-semibold text-slate-600 text-left max-w-md mx-auto shadow-inner">
                      <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                        <span>অর্ডার ট্র্যাকিং আইডি:</span>
                        <strong className="text-base font-mono text-slate-900 font-black">{orderId}</strong>
                      </div>
                      <div className="flex justify-between items-center pt-1 text-[11px]">
                        <span>টার্গেট নম্বর:</span>
                        <strong className="text-slate-900 font-bold">{targetPhone} ({selectedOperator})</strong>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span>পেমেন্ট মাধ্যম:</span>
                        <strong className="text-slate-900 font-bold">{getPaymentName(selectedPayment)}</strong>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span>বিভাগ:</span>
                        <strong className="text-slate-900 font-bold">{selectedDivision}</strong>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span>অফার নাম:</span>
                        <strong className="text-slate-900 font-bold line-clamp-1">{pack.title}</strong>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                        <span>মোট পরিশোধিত মূল্য:</span>
                        <strong className="text-emerald-600 font-mono text-sm font-black">৳{pack.salePrice}</strong>
                      </div>
                    </div>

                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 leading-relaxed max-w-xs mx-auto">
                      💡 আপনি যেকোনো সময় ওয়েবসাইটের <strong className="text-slate-700 font-black">"অর্ডার ট্র্যাকিং"</strong> পেজে গিয়ে আপনার মোবাইল নম্বর দিয়ে লাইভ স্ট্যাটাস দেখতে পারবেন।
                    </p>

                    <button
                      onClick={onClose}
                      className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs sm:text-sm rounded-2xl uppercase tracking-wider transition-all shadow cursor-pointer active:scale-95"
                    >
                      প্যানেল বন্ধ করুন
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>

            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY, WHY BUY, RECENT ORDERS */}
            <div className="hidden lg:block lg:col-span-4 space-y-6">
              
              {/* CARD 1: ORDER SUMMARY */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-800 border-b border-slate-50 pb-3">
                  <CheckCircle className="w-5 h-5 text-slate-900" />
                  <h4 className="text-xs sm:text-sm font-black">অর্ডার সারসংক্ষেপ</h4>
                </div>

                <div className="space-y-2.5 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>অফার</span>
                    <span className="text-slate-800 font-black text-right max-w-[140px] truncate">{pack.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>মেয়াদ</span>
                    <span className="text-slate-800 font-bold">{pack.validity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>অপারেটর</span>
                    <span className="text-slate-800 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {selectedOperator}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>টার্গেট নম্বর</span>
                    <span className="text-slate-800 font-bold font-mono tracking-wider">{targetPhone || '01XXXXXXXXX'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>মূল্য</span>
                    <span className="text-slate-800 font-mono">৳{pack.regularPrice}</span>
                  </div>
                  <div className="flex justify-between text-rose-500 font-bold">
                    <span>ডিসকাউন্ট</span>
                    <span>-৳{pack.regularPrice - pack.salePrice}</span>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-slate-900 font-black">
                    <span className="text-xs sm:text-sm">মোট পরিশোধ</span>
                    <span className="text-base sm:text-lg text-emerald-600 font-mono">৳{pack.salePrice}</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: WHY BUY FROM US */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/40 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-800 border-b border-slate-200/20 pb-3">
                  <Shield className="w-5 h-5 text-slate-900" />
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">কেন আমাদের থেকে কিনবেন?</h4>
                </div>

                <div className="space-y-2.5 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>দ্রুত একটিভেশন (১-২ মিনিট)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>সেরা রেট গ্যারান্টি</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>১০০% নিরাপদ লেনদেন</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>২৪/৭ কাস্টমার সাপোর্ট</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { DataPack, Order } from '../types';
import { X, ShieldCheck, CreditCard, Copy, Check, ChevronRight, PhoneCall, Gift, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  pack: DataPack;
  onClose: () => void;
  onSubmitOrder: (order: Order) => void;
}

export default function CheckoutModal({ pack, onClose, onSubmitOrder }: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [copied, setCopied] = useState(false);

  // Form Fields
  const [targetPhone, setTargetPhone] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Generated Order Details
  const [orderId, setOrderId] = useState('');

  // Payment Numbers
  const paymentNumbers = {
    bkash: '01795-123456',
    nagad: '01895-123456',
    rocket: '01995-123456'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentNumbers[paymentMethod]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Step 1 Validation
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      alert('⚠️ অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01712345678)!');
      return;
    }
    setStep(2);
  };

  // Step 2 Submission (Complete Order)
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPayPhone = paymentPhone.replace(/[^0-9]/g, '');
    if (cleanPayPhone.length !== 11 || !cleanPayPhone.startsWith('01')) {
      alert('⚠️ অনুগ্রহ করে সঠিক ১১ ডিজিটের পেমেন্ট নম্বর দিন!');
      return;
    }

    if (!transactionId.trim() || transactionId.trim().length < 6) {
      alert('⚠️ অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি (TxID) দিন!');
      return;
    }

    // Generate custom Order ID
    const generatedId = 'FI-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);

    const newOrder: Order = {
      id: generatedId,
      customerPhone: targetPhone,
      operator: pack.operator,
      packId: pack.id,
      packTitle: pack.title,
      price: pack.salePrice,
      paymentMethod,
      paymentPhone,
      transactionId: transactionId.toUpperCase().trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      division
    };

    onSubmitOrder(newOrder);

    // Trigger celebration confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header Title bar */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-400 font-mono font-black uppercase tracking-wider block">
              SECURE ORDER GATEWAY
            </span>
            <h3 className="text-sm md:text-base font-black">অর্ডার প্রসেসিং ও পেমেন্ট</h3>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Package Mini Summary */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <span className="px-1.5 py-0.5 bg-slate-200 text-slate-800 text-[9px] font-black rounded uppercase">
              {pack.operator}
            </span>
            <h4 className="text-xs font-black text-slate-800 mt-1 line-clamp-1">{pack.title}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">মেয়াদ: {pack.validity}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-slate-400 block">পরিশোধযোগ্য</span>
            <span className="text-lg font-black text-emerald-600 font-mono">৳{pack.salePrice}</span>
          </div>
        </div>

        {/* Step Progress Stepper */}
        <div className="px-6 pt-5 pb-3 bg-white flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-emerald-600' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono border ${
              step >= 1 ? 'bg-emerald-500 text-white border-emerald-500' : 'border-slate-200'
            }`}>1</span>
            <span>টার্গেট নম্বর</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-emerald-600' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono border ${
              step >= 2 ? 'bg-emerald-500 text-white border-emerald-500' : 'border-slate-200'
            }`}>2</span>
            <span>পেমেন্ট করুন</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-600' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono border ${
              step === 3 ? 'bg-emerald-500 text-white border-emerald-500' : 'border-slate-200'
            }`}>3</span>
            <span>সম্পন্ন</span>
          </div>
        </div>

        {/* Modal Forms Area */}
        <div className="p-6 overflow-y-auto flex-grow">
          
          {/* STEP 1: TARGET PHONE & DIVISION */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">
                  ১. টার্গেট মোবাইল নম্বর (Target Phone Number) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-sm font-extrabold text-slate-400 font-mono">
                    BD (+88)
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={targetPhone}
                    onChange={(e) => setTargetPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                    className="w-full pl-20 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-extrabold tracking-widest focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  ⚠️ এই নম্বরে ডাটা অথবা মিনিট অফারটি স্বয়ংক্রিয়ভাবে রিচার্জ করে পাঠিয়ে দেওয়া হবে। দয়া করে নম্বরটি ডাবল চেক করুন।
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">
                  ২. আপনার বিভাগ (Regional Division)
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 focus:border-emerald-500 focus:outline-none"
                >
                  {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'].map((div) => (
                    <option key={div} value={div}>
                      {div === 'Dhaka' ? 'ঢাকা (Dhaka)' :
                       div === 'Chittagong' ? 'চট্টগ্রাম (Chittagong)' :
                       div === 'Sylhet' ? 'সিলেট (Sylhet)' :
                       div === 'Rajshahi' ? 'রাজশাহী (Rajshahi)' :
                       div === 'Khulna' ? 'খুলনা (Khulna)' :
                       div === 'Barisal' ? 'বরিশাল (Barisal)' :
                       div === 'Rangpur' ? 'রংপুর (Rangpur)' : 'ময়মনসিংহ (Mymensingh)'}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 font-semibold">
                  হাউজ অফারসমূহ রিজিওনাল বিভাগের উপর ভিত্তি করে সক্রিয় করা হয়।
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mt-6"
              >
                <span>পরবর্তী ধাপে যান</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT INFO */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-5">
              
              {/* Operator specific payment options */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">
                  পেমেন্ট পদ্ধতি নির্বাচন করুন
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bkash', label: 'বিকাশ', color: 'border-pink-200 text-pink-700 bg-pink-50/50' },
                    { id: 'nagad', label: 'নগদ', color: 'border-orange-200 text-orange-700 bg-orange-50/50' },
                    { id: 'rocket', label: 'রকেট', color: 'border-purple-200 text-purple-700 bg-purple-50/50' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`py-3 px-2 rounded-xl text-xs font-black border tracking-wide transition-all cursor-pointer ${
                        paymentMethod === method.id
                          ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                          : `bg-white text-slate-600 ${method.color}`
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Instructions Details Box */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3 text-xs font-semibold text-slate-700">
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block">আমাদের {paymentMethod === 'bkash' ? 'বিকাশ' : paymentMethod === 'nagad' ? 'নগদ' : 'রকেট'} নম্বর (Personal)</span>
                    <strong className="text-sm font-mono text-slate-900 tracking-wider">
                      {paymentNumbers[paymentMethod]}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-extrabold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="space-y-1 text-[11px] leading-relaxed text-slate-500">
                  <p>১. আপনার মোবাইল থেকে <strong className="text-slate-800">Send Money / ক্যাশ-ইন</strong> করুন।</p>
                  <p>২. টাকার পরিমান: <strong className="text-emerald-600 font-mono text-sm">৳{pack.salePrice}</strong></p>
                  <p>৩. সেন্ড মানি করা সম্পন্ন হলে নিচের ফর্মটি পূরণ করুন:</p>
                </div>
              </div>

              {/* Sender Phone and TxID Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    যে নাম্বার থেকে টাকা পাঠিয়েছেন *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    ট্রানজেকশন আইডি (TxID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BK9X8726F12"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold font-mono tracking-wider focus:border-emerald-500 focus:outline-none uppercase"
                  />
                </div>
              </div>

              {/* Safe Secure Indicator */}
              <div className="bg-emerald-50 border border-emerald-150 p-3 rounded-xl flex items-center gap-2 text-[10px] font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>আপনার পেমেন্ট আইডি নিরাপদ ও এনক্রিপ্টেড উপায়ে ভেরিফাই করা হবে।</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 border border-slate-200 hover:bg-slate-50 font-extrabold text-xs text-slate-600 rounded-xl transition-colors cursor-pointer"
                >
                  পেছনে যান
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  অর্ডার সম্পন্ন করুন
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: SUCCESS CELEBRATION */}
          {step === 3 && (
            <div className="text-center py-6 space-y-6">
              
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 border-4 border-emerald-50">
                <ShieldCheck className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900">অর্ডারটি সফলভাবে জমা হয়েছে!</h3>
                <p className="text-xs font-semibold text-slate-400">
                  আপনার রিচার্জ প্রসেসিং শুরু হয়েছে। পরবর্তী ২ থেকে ১০ মিনিটের মধ্যে অফারটি সচল হবে।
                </p>
              </div>

              {/* Order ID & Tracking Reference Card */}
              <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl max-w-sm mx-auto space-y-2 text-xs font-semibold text-slate-600">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span>অর্ডার আইডি:</span>
                  <strong className="text-sm font-mono text-slate-900">{orderId}</strong>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span>অর্ডার নম্বর:</span>
                  <strong className="text-slate-900">{targetPhone} ({pack.operator})</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>পরিশোধ মূল্য:</span>
                  <strong className="text-emerald-600 font-mono">৳{pack.salePrice}</strong>
                </div>
              </div>

              {/* Helpful tips */}
              <p className="text-[10px] font-bold text-slate-400 leading-relaxed max-w-xs mx-auto">
                💡 আপনি যেকোনো সময় ওয়েবসাইটের <strong className="text-slate-700 font-extrabold">"অর্ডার ট্র্যাকিং"</strong> পেজে গিয়ে আপনার এই মোবাইল নম্বর দিয়ে লাইভ অগ্রগতি পরীক্ষা করতে পারবেন।
              </p>

              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
              >
                প্যানেল বন্ধ করুন
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

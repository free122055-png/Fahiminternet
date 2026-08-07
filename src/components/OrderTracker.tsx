import React, { useState } from 'react';
import { Order } from '../types';
import { Search, Loader2, Calendar, ClipboardCheck, Phone, CheckCircle2, Circle, AlertCircle, RefreshCw, History, LogIn, ArrowRight } from 'lucide-react';

interface OrderTrackerProps {
  orders: Order[];
  currentUser?: any;
  onOpenAuthModal?: (msg?: string) => void;
  onNavigateToHome?: () => void;
}

export default function OrderTracker({ orders, currentUser, onOpenAuthModal, onNavigateToHome }: OrderTrackerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrders, setFoundOrders] = useState<Order[]>([]);
  const [searching, setSearching] = useState(false);

  // Filter orders by logged-in user's UID
  const userOrders = currentUser
    ? orders.filter((order) => order.userId === currentUser.uid)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setTimeout(() => {
      const cleanQuery = searchQuery.trim().toLowerCase();
      // Search matches either order ID (e.g. FI-XXXXXX) or customer phone number
      const results = orders.filter(
        (order) =>
          order.id.toLowerCase().includes(cleanQuery) ||
          order.customerPhone.includes(cleanQuery)
      );
      
      // Sort by latest order first
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setFoundOrders(results);
      setSearching(false);
      setSearched(true);
    }, 600); // realistic short loader
  };

  // Status visual configurations
  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'যাচাইধীন (Pending)',
          color: 'text-amber-500',
          step: 1
        };
      case 'approved':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          label: 'অনুমোদিত (Approved)',
          color: 'text-indigo-500',
          step: 2
        };
      case 'processing':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          label: 'প্রক্রিয়াধীন (Processing)',
          color: 'text-blue-500',
          step: 3
        };
      case 'completed':
        return {
          bg: 'bg-slate-50 text-emerald-800 border-emerald-200',
          label: 'রিচার্জ সফল (Completed)',
          color: 'text-emerald-500',
          step: 4
        };
      case 'cancelled':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          label: 'বাতিলকৃত (Cancelled)',
          color: 'text-rose-500',
          step: 0
        };
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Search Bar Block */}
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-slate-100 space-y-4">
        <div className="text-center space-y-1.5 max-w-md mx-auto">
          <h2 className="text-lg md:text-xl font-black text-slate-950">লাইভ অর্ডার ট্র্যাকার</h2>
          <p className="text-xs font-semibold text-slate-400">
            আপনার অর্ডার আইডি অথবা টার্গেট মোবাইল নম্বর দিয়ে সাবমিট করা অফারের লাইভ অগ্রগতির স্টেটাস চেক করুন।
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-lg mx-auto flex gap-2 pt-2">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              required
              placeholder="মোবাইল নম্বর অথবা অর্ডার আইডি (যেমন: FI-123456)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-150 rounded-xl text-xs font-bold focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>খুঁজুন</span>}
          </button>
        </form>
      </div>

      {/* SEARCH RESULTS & ORDER HISTORY DISPLAY */}
      <div className="space-y-4">
        
        {/* Scenario A: Searched & No results found */}
        {searched && foundOrders.length === 0 && (
          <div className="bg-white rounded-xl p-8 border border-slate-150 shadow-sm text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800">কোনো অর্ডার পাওয়া যায়নি!</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                আপনার দেওয়া মোবাইল নম্বর অথবা অর্ডার আইডি টি দিয়ে সঠিক পেমেন্ট সম্পন্ন হয়েছে কি না বা কোনো ভুল হয়েছে কি না পুনরায় যাচাই করুন।
              </p>
            </div>
            <button
              onClick={() => {
                setSearched(false);
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              পিছনে যান (Go Back)
            </button>
          </div>
        )}

        {/* Scenario B: Searched & Results found */}
        {searched && foundOrders.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pl-1">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                প্রাপ্ত ফলাফল ({foundOrders.length})
              </h3>
              <button
                onClick={() => {
                  setSearched(false);
                  setSearchQuery('');
                  setFoundOrders([]);
                }}
                className="text-xs text-slate-900 hover:text-emerald-700 font-black flex items-center gap-1 cursor-pointer"
              >
                <span>হিস্ট্রি-তে ফিরে যান</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {foundOrders.map((order) => {
              const statusConf = getStatusConfig(order.status);
              const formattedDate = new Date(order.createdAt).toLocaleDateString('bn-BD', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={order.id} 
                  className="bg-white rounded-xl p-6 md:p-8 border border-slate-100 shadow-md space-y-6"
                >
                  {/* Top Order Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-slate-900 uppercase">
                          ID: {order.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${statusConf.bg}`}>
                          {statusConf.label}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-800 line-clamp-1">{order.packTitle}</h4>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold block">পরিমান মূল্য</span>
                      <strong className="text-lg font-black text-slate-900 font-mono">৳{order.price}</strong>
                    </div>
                  </div>

                  {/* Stepper Status Indicators */}
                  {order.status !== 'cancelled' ? (
                    <div className="space-y-4">
                      {/* Interactive visual stepping bar */}
                      <div className="relative flex items-center justify-between">
                        {/* Background connection bar line */}
                        <div className="absolute left-0 right-0 h-1 bg-slate-100 -z-10" />
                        {/* Dynamic active line width */}
                        <div 
                          className="absolute left-0 h-1 bg-emerald-500 -z-10 transition-all duration-500" 
                          style={{ 
                            width: `${((statusConf.step - 1) / 3) * 100}%` 
                          }} 
                        />

                        {/* Stepper Steps */}
                        {[
                          { stepNum: 1, label: 'পেমেন্ট যাচাই', desc: 'Pending' },
                          { stepNum: 2, label: 'অর্ডার অনুমোদন', desc: 'Approved' },
                          { stepNum: 3, label: 'রিচার্জ প্রসেস', desc: 'Processing' },
                          { stepNum: 4, label: 'সফল সম্পন্ন', desc: 'Completed' }
                        ].map((s) => {
                          const isActive = statusConf.step >= s.stepNum;
                          const isCurrent = statusConf.step === s.stepNum;

                          return (
                            <div key={s.stepNum} className="flex flex-col items-center text-center space-y-1 bg-white px-2">
                              {isActive ? (
                                <CheckCircle2 className={`w-5 h-5 ${isCurrent ? 'text-emerald-500 animate-pulse' : 'text-emerald-500'} fill-emerald-50`} />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-200 fill-white" />
                              )}
                              <span className={`text-[10px] font-black ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-rose-50 border border-rose-150 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                      <div className="space-y-1">
                        <h5 className="text-xs font-black text-rose-800">অর্ডারটি বাতিল বা রিফান্ড করা হয়েছে!</h5>
                        <p className="text-[10px] font-medium text-rose-700/80 leading-relaxed">
                          পেমেন্ট তথ্য যাচাইকরণ অথবা নম্বর ভুল থাকার কারণে অর্ডারটি বাতিল করা হয়েছে। দয়া করে লাইভ সাপোর্টে যোগাযোগ করুন বা সঠিক ট্রানজেকশন তথ্য দিয়ে পুনরায় চেষ্টা করুন।
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Date, Payment Phone, Target Phone specs footer */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-500">
                    <div className="space-y-0.5">
                      <span className="text-slate-400 block uppercase">অর্ডার সময়কাল</span>
                      <span className="text-slate-800">{formattedDate}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 block uppercase">টার্গেট মোবাইল নম্বর</span>
                      <span className="text-slate-800 font-mono text-sm font-black">{order.customerPhone}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 block uppercase">পেমেন্ট গেটওয়ে ({order.paymentMethod.toUpperCase()})</span>
                      <span className="text-slate-800 font-mono">নম্বর: {order.paymentPhone}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Scenario C: Not searched, User is Logged In */}
        {!searched && currentUser && (
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 pl-1">
              <History className="w-4 h-4 text-slate-900" />
              <span>আপনার অর্ডার হিস্ট্রি ({userOrders.length})</span>
            </h3>

            {userOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-8 border border-slate-150 text-center space-y-4 shadow-sm">
                <History className="w-12 h-12 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-800">আপনার কোনো পূর্ববর্তী অর্ডার নেই!</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    আপনি এখনও ফাহিম ইন্টারনেট থেকে কোনো মেগাবাইট, মিনিট বা কম্বো প্যাকেজ ক্রয় করেননি। আজই আপনার পছন্দের অফার অর্ডার করুন।
                  </p>
                </div>
                {onNavigateToHome && (
                  <button
                    onClick={onNavigateToHome}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-sm"
                  >
                    অফারগুলো দেখুন (View Offers)
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {userOrders.map((order) => {
                  const statusConf = getStatusConfig(order.status);
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div 
                      key={order.id} 
                      className="bg-white rounded-xl p-6 md:p-8 border border-slate-100 shadow-md hover:shadow-sm transition-shadow space-y-6 text-left"
                    >
                      {/* Top Order Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-black text-slate-900 uppercase">
                              ID: {order.id}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${statusConf.bg}`}>
                              {statusConf.label}
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-slate-800 line-clamp-1">{order.packTitle}</h4>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-slate-400 font-bold block">পরিমান মূল্য</span>
                          <strong className="text-lg font-black text-slate-900 font-mono">৳{order.price}</strong>
                        </div>
                      </div>

                      {/* Stepper Status Indicators */}
                      {order.status !== 'cancelled' ? (
                        <div className="space-y-4">
                          <div className="relative flex items-center justify-between">
                            <div className="absolute left-0 right-0 h-1 bg-slate-100 -z-10" />
                            <div 
                              className="absolute left-0 h-1 bg-emerald-500 -z-10 transition-all duration-500" 
                              style={{ 
                                width: `${((statusConf.step - 1) / 3) * 100}%` 
                              }} 
                            />

                            {[
                              { stepNum: 1, label: 'পেমেন্ট যাচাই', desc: 'Pending' },
                              { stepNum: 2, label: 'অর্ডার অনুমোদন', desc: 'Approved' },
                              { stepNum: 3, label: 'রিচার্জ প্রসেস', desc: 'Processing' },
                              { stepNum: 4, label: 'সফল সম্পন্ন', desc: 'Completed' }
                            ].map((s) => {
                              const isActive = statusConf.step >= s.stepNum;
                              const isCurrent = statusConf.step === s.stepNum;

                              return (
                                <div key={s.stepNum} className="flex flex-col items-center text-center space-y-1 bg-white px-2">
                                  {isActive ? (
                                    <CheckCircle2 className={`w-5 h-5 ${isCurrent ? 'text-emerald-500 animate-pulse' : 'text-emerald-500'} fill-emerald-50`} />
                                  ) : (
                                    <Circle className="w-5 h-5 text-slate-200 fill-white" />
                                  )}
                                  <span className={`text-[9px] sm:text-[10px] font-black ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                                    {s.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-rose-50 border border-rose-150 rounded-xl p-4 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                          <div className="space-y-1 text-left">
                            <h5 className="text-xs font-black text-rose-800">অর্ডারটি বাতিল বা রিফান্ড করা হয়েছে!</h5>
                            <p className="text-[10px] font-medium text-rose-700/80 leading-relaxed">
                              পেমেন্ট তথ্য যাচাইকরণ অথবা নম্বর ভুল থাকার কারণে অর্ডারটি বাতিল করা হয়েছে। দয়া করে লাইভ সাপোর্টে যোগাযোগ করুন।
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Date, Payment Phone, Target Phone specs footer */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-500">
                        <div className="space-y-0.5 text-left">
                          <span className="text-slate-400 block uppercase">অর্ডার সময়কাল</span>
                          <span className="text-slate-800">{formattedDate}</span>
                        </div>
                        <div className="space-y-0.5 text-left">
                          <span className="text-slate-400 block uppercase">টার্গেট মোবাইল নম্বর</span>
                          <span className="text-slate-800 font-mono text-sm font-black">{order.customerPhone}</span>
                        </div>
                        <div className="space-y-0.5 text-left">
                          <span className="text-slate-400 block uppercase">পেমেন্ট গেটওয়ে ({order.paymentMethod.toUpperCase()})</span>
                          <span className="text-slate-800 font-mono">নম্বর: {order.paymentPhone}</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Scenario D: Not searched, User is Guest (Prompt to Login) */}
        {!searched && !currentUser && (
          <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-150 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-900 mx-auto border border-emerald-100">
              <History className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h4 className="text-sm font-black text-slate-800">অর্ডার হিস্ট্রি দেখতে লগইন করুন</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                আপনার অ্যাকাউন্ট লগইন করা থাকলে আপনি যেকোনো সময় আপনার করা সকল অর্ডারের লাইভ অগ্রগতি ও বিগত হিস্ট্রি এক ক্লিকেই দেখতে পারবেন।
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onOpenAuthModal && (
                <button
                  onClick={() => onOpenAuthModal('👤 অর্ডার হিস্ট্রি দেখতে প্রথমে আপনার অ্যাকাউন্টে লগইন করুন!')}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>লগইন করুন (Login)</span>
                </button>
              )}
              <span className="text-[11px] text-slate-400 font-bold">অথবা সরাসরি মোবাইল নম্বর দিয়ে উপরে খুঁজুন</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { Order, DataPack, Operator, PackCategory } from '../types';
import { 
  ShieldCheck, Lock, Eye, EyeOff, LayoutDashboard, ListOrdered, Package, 
  TrendingUp, CircleDollarSign, Hourglass, CheckSquare, RefreshCw, Trash2, 
  Plus, Sparkles, Check, X, AlertTriangle 
} from 'lucide-react';

interface AdminPanelProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  packs: DataPack[];
  onAddPack: (pack: DataPack) => void;
  onDeletePack: (packId: string) => void;
  onResetDefaultPacks: () => void;
}

export default function AdminPanel({
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  packs,
  onAddPack,
  onDeletePack,
  onResetDefaultPacks
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Active Admin View Tab
  const [adminTab, setAdminTab] = useState<'dashboard' | 'orders' | 'packages'>('dashboard');

  // Form State for Adding Packages
  const [newPackTitle, setNewPackTitle] = useState('');
  const [newPackOperator, setNewPackOperator] = useState<Operator>('GP');
  const [newPackCategory, setNewPackCategory] = useState<PackCategory>('internet');
  const [newPackData, setNewPackData] = useState('10 GB');
  const [newPackMinutes, setNewPackMinutes] = useState(0);
  const [newPackSms, setNewPackSms] = useState(0);
  const [newPackValidity, setNewPackValidity] = useState('30 Days');
  const [newPackRegularPrice, setNewPackRegularPrice] = useState(299);
  const [newPackSalePrice, setNewPackSalePrice] = useState(249);
  const [newPackCashback, setNewPackCashback] = useState(15);
  const [newPackIsHot, setNewPackIsHot] = useState(false);
  const [newPackIsPopular, setNewPackIsPopular] = useState(false);
  const [newPackDesc, setNewPackDesc] = useState('');

  const correctPin = '7700';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === correctPin) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('❌ পিন ভুল হয়েছে! অনুগ্রহ করে সঠিক মালিকানা পিন টাইপ করুন।');
      setPin('');
    }
  };

  // ANALYTICS CALCULATIONS
  const completedOrders = orders.filter(o => o.status === 'completed');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const processingOrders = orders.filter(o => o.status === 'processing');
  
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.price, 0);
  const totalPendingMoney = pendingOrders.reduce((sum, o) => sum + o.price, 0);

  // Operator counts
  const getOperatorAnalytics = () => {
    const counts = { GP: 0, Robi: 0, Airtel: 0, Banglalink: 0, Teletalk: 0 };
    orders.forEach(o => {
      if (counts[o.operator] !== undefined) {
        counts[o.operator]++;
      }
    });
    return counts;
  };
  const operatorCounts = getOperatorAnalytics();

  // Division counts
  const getDivisionAnalytics = () => {
    const counts: Record<string, number> = {};
    orders.forEach(o => {
      counts[o.division] = (counts[o.division] || 0) + 1;
    });
    return counts;
  };
  const divisionCounts = getDivisionAnalytics();

  const handleAddNewPack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackTitle.trim()) {
      alert('⚠️ অনুগ্রহ করে প্যাকেজের একটি সঠিক নাম দিন!');
      return;
    }

    const newPack: DataPack = {
      id: `pack-${Date.now()}`,
      title: newPackTitle,
      category: newPackCategory,
      operator: newPackOperator,
      data: newPackData,
      minutes: Number(newPackMinutes),
      sms: Number(newPackSms),
      validity: newPackValidity,
      regularPrice: Number(newPackRegularPrice),
      salePrice: Number(newPackSalePrice),
      cashback: Number(newPackCashback),
      isHot: newPackIsHot,
      isPopular: newPackIsPopular,
      description: newPackDesc
    };

    onAddPack(newPack);
    
    // Reset Form
    setNewPackTitle('');
    setNewPackDesc('');
    setNewPackData('10 GB');
    setNewPackMinutes(0);
    setNewPackSms(0);
    setNewPackRegularPrice(299);
    setNewPackSalePrice(249);
    setNewPackCashback(15);
    setNewPackIsHot(false);
    setNewPackIsPopular(false);

    alert('🎉 নতুন প্যাকেজ সফলভাবে যোগ করা হয়েছে!');
  };

  // Gated PIN Overlay UI
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl space-y-6 text-center">
        <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-slate-900/10">
          <Lock className="w-6 h-6 stroke-[2.5]" />
        </div>
        
        <div className="space-y-1.5">
          <h2 className="text-base font-black text-slate-900">মালিকানা পিন ভেরিফিকেশন</h2>
          <p className="text-xs font-semibold text-slate-400">
            Fahim Internet এডমিন প্যানেল অ্যাক্সেস করতে মালিকানা সিকিউরিটি পিন দিন।
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              required
              placeholder="এডমিন সিকিউরিটি পিন (ডিফল্ট পিন: 7700)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-150 rounded-2xl text-center text-sm font-black tracking-widest focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {errorMsg && (
            <p className="text-[11px] font-bold text-rose-600 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
          >
            প্যানেল আনলক করুন
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold leading-relaxed">
          🔒 সিকিউরিটি নোট: ডিফল্ট এডমিন পিন কোড হলো <strong className="text-slate-600">7700</strong>।
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden min-h-[500px] flex flex-col md:flex-row">
      
      {/* Side Menu Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-300 p-6 border-r border-slate-900 space-y-8 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
              Fahim Admin Panel
            </h3>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold block mt-1">Status: Owner Verified</span>
        </div>

        <nav className="space-y-1.5 font-bold text-xs">
          <button
            onClick={() => setAdminTab('dashboard')}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
              adminTab === 'dashboard'
                ? 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-600/10'
                : 'hover:bg-slate-900 hover:text-slate-100 text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>অ্যানালিটিক্স ড্যাশবোর্ড</span>
          </button>
          
          <button
            onClick={() => setAdminTab('orders')}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
              adminTab === 'orders'
                ? 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-600/10'
                : 'hover:bg-slate-900 hover:text-slate-100 text-slate-400'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>অর্ডার রিকোয়েস্ট ({orders.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('packages')}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
              adminTab === 'packages'
                ? 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-600/10'
                : 'hover:bg-slate-900 hover:text-slate-100 text-slate-400'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>প্যাকেজ ম্যানেজার ({packs.length})</span>
          </button>
        </nav>

        <div className="pt-12 border-t border-slate-900/60 text-[10px] font-bold text-slate-500 space-y-4">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full py-2 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-400 rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer"
          >
            লগআউট করুন
          </button>
        </div>
      </aside>

      {/* Main Admin Display Content */}
      <main className="flex-grow p-6 md:p-8 overflow-x-auto">
        
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {adminTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-950">ব্যবসায়িক অ্যানালিটিক্স</h2>
              <p className="text-xs text-slate-400 font-semibold">
                Fahim Internet-এর সর্বমোট বিক্রি, লাভ এবং অপারেটর অনুযায়ী ডিস্ট্রিবিউশন পরিসংখ্যান।
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CircleDollarSign className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">মোট পরিশোধিত আয়</span>
                  <p className="text-xl font-black text-slate-900 font-mono">৳{totalRevenue}</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Hourglass className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">যাচাইধীন বকেয়া</span>
                  <p className="text-xl font-black text-slate-900 font-mono">৳{totalPendingMoney}</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">মোট অর্ডার রিকোয়েস্ট</span>
                  <p className="text-xl font-black text-slate-900 font-mono">{orders.length} টি</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">সফল ডেলিভারি</span>
                  <p className="text-xl font-black text-slate-900 font-mono">{completedOrders.length} টি</p>
                </div>
              </div>
            </div>

            {/* Graphical Analytics (Visual Pure CSS charts) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              {/* Chart 1: Operator distributions */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200/60 pb-2">
                  অপারেটরভিত্তিক রিচার্জ ভলিউম (Operator Volume)
                </h3>

                <div className="space-y-4 pt-2">
                  {(Object.keys(operatorCounts) as Operator[]).map((op) => {
                    const count = operatorCounts[op];
                    const percentage = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                    
                    const barColor = 
                      op === 'GP' ? 'bg-blue-500' :
                      op === 'Robi' ? 'bg-red-500' :
                      op === 'Airtel' ? 'bg-pink-500' :
                      op === 'Banglalink' ? 'bg-orange-500' :
                      'bg-emerald-500';

                    return (
                      <div key={op} className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span className="uppercase font-extrabold">{op} Mobile</span>
                          <span>{count} টি ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${barColor} transition-all duration-1000`} 
                            style={{ width: `${Math.max(percentage, 2)}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart 2: Divisions breakdown */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200/60 pb-2">
                  বিভাগ অনুযায়ী শীর্ষ ক্রেতা এলাকা (Division Distribution)
                </h3>

                {Object.keys(divisionCounts).length === 0 ? (
                  <p className="text-xs text-slate-400 font-semibold py-8 text-center">
                    পর্যাপ্ত ডেটা পাওয়া যায়নি। অর্ডার শুরু হলে এই চার্ট সক্রিয় হবে।
                  </p>
                ) : (
                  <div className="space-y-3.5 pt-2">
                    {Object.entries(divisionCounts).map(([div, count]) => {
                      const totalOrders = orders.length || 1;
                      const percentage = Math.round((count / totalOrders) * 100);

                      return (
                        <div key={div} className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-700 font-bold">{div} Division</span>
                          <div className="flex items-center gap-2.5 w-1/2">
                            <div className="w-full bg-slate-200 h-2.5 rounded-md overflow-hidden">
                              <div className="bg-indigo-500 h-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 font-black shrink-0">
                              {count} orders
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ACTIVE ORDERS PROCESSOR */}
        {adminTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-slate-950">অর্ডার রিকোয়েস্ট লিস্ট ({orders.length})</h2>
                <p className="text-xs text-slate-400 font-semibold">
                  গ্রাহকদের জমা দেওয়া পেমেন্ট রিকোয়েস্ট পরীক্ষা করুন এবং রিচার্জ সচল করে স্টেটাস পরিবর্তন করুন।
                </p>
              </div>

              {orders.length > 0 && (
                <div className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-lg font-black uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>পেমেন্ট তথ্য যাচাই করে পরিবর্তন নিশ্চিত করুন</span>
                </div>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl py-12 text-center text-xs font-bold text-slate-400 space-y-2">
                <ListOrdered className="w-8 h-8 text-slate-300 mx-auto" />
                <p>এখনো পর্যন্ত কোনো অর্ডার জমা পড়েনি!</p>
              </div>
            ) : (
              <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white font-black uppercase tracking-wider text-[9px]">
                      <th className="px-4 py-3.5">ID / টার্গেট</th>
                      <th className="px-4 py-3.5">প্যাকেজ অফার</th>
                      <th className="px-4 py-3.5">পেমেন্ট গেটওয়ে</th>
                      <th className="px-4 py-3.5">স্টেটাস</th>
                      <th className="px-4 py-3.5 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 bg-white font-semibold text-slate-700">
                    {orders.map((order) => {
                      const formattedDate = new Date(order.createdAt).toLocaleDateString('bn-BD', {
                        day: 'numeric',
                        month: 'short'
                      });

                      return (
                        <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-4 space-y-1">
                            <span className="font-mono text-slate-900 font-black block">{order.id}</span>
                            <span className="text-[11px] text-slate-500 font-black block font-mono">{order.customerPhone}</span>
                            <span className="text-[9px] text-slate-400 block uppercase font-mono">{order.division} | {formattedDate}</span>
                          </td>
                          
                          <td className="px-4 py-4">
                            <span className="text-slate-800 font-bold block line-clamp-1">{order.packTitle}</span>
                            <span className="text-[10px] text-emerald-600 block font-mono font-black mt-0.5">৳{order.price}</span>
                          </td>

                          <td className="px-4 py-4 space-y-1">
                            <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-black uppercase text-slate-800">
                              {order.paymentMethod}
                            </span>
                            <span className="text-[10px] text-slate-500 font-black block font-mono mt-0.5">নম্বর: {order.paymentPhone}</span>
                            <span className="text-[10px] text-slate-400 font-black block font-mono">TxID: {order.transactionId}</span>
                          </td>

                          <td className="px-4 py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border block text-center ${
                              order.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                              order.status === 'approved' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                              order.status === 'processing' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                              order.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                              'bg-rose-50 border-rose-200 text-rose-700'
                            }`}>
                              {order.status === 'pending' ? 'Pending' :
                               order.status === 'approved' ? 'Approved' :
                               order.status === 'processing' ? 'Processing' :
                               order.status === 'completed' ? 'Completed' : 'Cancelled'}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Step processors */}
                              <select
                                value={order.status}
                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                                className="px-2 py-1 bg-white border border-slate-200 text-[10px] font-black text-slate-700 rounded-lg focus:outline-none"
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approve</option>
                                <option value="processing">Process</option>
                                <option value="completed">Complete</option>
                                <option value="cancelled">Cancel</option>
                              </select>

                              {/* Delete option */}
                              <button
                                onClick={() => {
                                  if (confirm('❌ আপনি কি নিশ্চিত যে এই অর্ডারটি মুছে ফেলতে চান?')) {
                                    onDeleteOrder(order.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PACKAGES MANAGER */}
        {adminTab === 'packages' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-slate-950">প্যাকেজ অফার ম্যানেজার</h2>
                <p className="text-xs text-slate-400 font-semibold">
                  নতুন ডাটা বা মিনিট প্যাক অফার যোগ করুন অথবা ডিফল্ট প্যাকেজ রিসেট করুন।
                </p>
              </div>

              {/* Seed/Reset default packs CTA */}
              <button
                onClick={() => {
                  if (confirm('🔄 আপনি কি স্টোরের প্যাকেজসমূহ রিসেট করে ডিফল্ট অফারগুলো লোড করতে চান?')) {
                    onResetDefaultPacks();
                    alert('🎉 প্যাকেজসমূহ সফলভাবে ডিফল্ট স্টেটাসে রিসেট করা হয়েছে!');
                  }
                }}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>রিসেট ডিফল্ট অফার্স</span>
              </button>
            </div>

            {/* Add New Package Collapsible form */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Plus className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">১. নতুন প্যাকেজ যোগ করুন</h3>
              </div>

              <form onSubmit={handleAddNewPack} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-600">
                {/* Title */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide">প্যাকেজ নাম (Title) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GP ৬০ জিবি + ৮০০ মিনিট স্পেশাল হাউজ"
                    value={newPackTitle}
                    onChange={(e) => setNewPackTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Operator */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide">অপারেটর (Operator)</label>
                  <select
                    value={newPackOperator}
                    onChange={(e) => setNewPackOperator(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  >
                    <option value="GP">GP</option>
                    <option value="Robi">Robi</option>
                    <option value="Airtel">Airtel</option>
                    <option value="Banglalink">Banglalink</option>
                    <option value="Teletalk">Teletalk</option>
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide">ক্যাটাগরি (Category)</label>
                  <select
                    value={newPackCategory}
                    onChange={(e) => setNewPackCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  >
                    <option value="internet">ইন্টারনেট প্যাক (Internet)</option>
                    <option value="unlimited">আনলিমিটেড প্যাক (Unlimited)</option>
                    <option value="family">ফ্যামিলি প্যাক (Family)</option>
                    <option value="house">হাউজ অফার (House Offer)</option>
                    <option value="minute">মিনিট প্যাক (Minute)</option>
                    <option value="sms">এসএমএস প্যাক (SMS)</option>
                  </select>
                </div>

                {/* Data Value */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide">ডাটা (e.g. 15 GB, Unlimited, 0)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 30 GB"
                    value={newPackData}
                    onChange={(e) => setNewPackData(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>

                {/* Minutes */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide">মিনিট (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={newPackMinutes}
                    onChange={(e) => setNewPackMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>

                {/* SMS */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide">এসএমএস (SMS)</label>
                  <input
                    type="number"
                    required
                    value={newPackSms}
                    onChange={(e) => setNewPackSms(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>

                {/* Validity */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide">মেয়াদকাল (Validity)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 30 Days"
                    value={newPackValidity}
                    onChange={(e) => setNewPackValidity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>

                {/* Regular Price */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide">নিয়মিত মূল্য (৳)</label>
                  <input
                    type="number"
                    required
                    value={newPackRegularPrice}
                    onChange={(e) => setNewPackRegularPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>

                {/* Sale Price */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide">অফার মূল্য (৳)</label>
                  <input
                    type="number"
                    required
                    value={newPackSalePrice}
                    onChange={(e) => setNewPackSalePrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>

                {/* Cashback */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide">ক্যাশব্যাক বোনাস (৳)</label>
                  <input
                    type="number"
                    required
                    value={newPackCashback}
                    onChange={(e) => setNewPackCashback(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>

                {/* Hot / Popular flags */}
                <div className="flex items-center gap-6 pt-3 md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newPackIsHot}
                      onChange={(e) => setNewPackIsHot(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                    <span>হট অফার (HOT 🔥)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newPackIsPopular}
                      onChange={(e) => setNewPackIsPopular(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                    <span>জনপ্রিয় অফার (POPULAR ⭐)</span>
                  </label>
                </div>

                {/* Description */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide">সংক্ষিপ্ত বিবরণ (Description)</label>
                  <input
                    type="text"
                    placeholder="e.g. গ্রামীনফোনের সুপারফাস্ট ইন্টারনেট স্পিড ও ধামাকা রিচার্জ বোনাস প্যাক।"
                    value={newPackDesc}
                    onChange={(e) => setNewPackDesc(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Submit button */}
                <div className="md:col-span-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>অফারটি স্টোরে প্রকাশ করুন</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Existing Active Packs List */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  ২. স্টোরের সক্রিয় অফারসমূহ ({packs.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packs.map((pack) => (
                  <div 
                    key={pack.id} 
                    className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex justify-between items-center text-xs font-semibold"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-slate-200 text-slate-800 text-[8px] font-black uppercase rounded">
                          {pack.operator}
                        </span>
                        <span className="text-slate-400 text-[9px] uppercase tracking-wider font-bold">
                          {pack.category}
                        </span>
                      </div>
                      <h4 className="text-slate-800 font-extrabold mt-1 line-clamp-1">{pack.title}</h4>
                      <p className="text-[10px] text-emerald-600 font-mono font-black">
                        ৳{pack.salePrice} <span className="text-slate-400 font-normal line-through">৳{pack.regularPrice}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`❌ আপনি কি নিশ্চিত যে "${pack.title}" প্যাকেজটি ডিলিট করতে চান?`)) {
                          onDeletePack(pack.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                      title="Delete Offer Pack"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

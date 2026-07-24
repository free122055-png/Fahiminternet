import React from 'react';
import { Smartphone, Shield, Clock, HelpCircle, UserCheck, Layers, ChevronRight } from 'lucide-react';

interface HeaderProps {
  activeTab: 'store' | 'builder' | 'tracking' | 'admin';
  setActiveTab: (tab: 'store' | 'builder' | 'tracking' | 'admin') => void;
  isAdmin: boolean;
  toggleAdminMode: () => void;
}

export default function Header({ activeTab, setActiveTab, isAdmin, toggleAdminMode }: HeaderProps) {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-xl border-b border-slate-800">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-1.5 text-[11px] font-black tracking-wide text-center uppercase flex items-center justify-center gap-1.5 shadow-inner">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        <span>১০০% নিরাপদ পেমেন্ট ও ১ মিনিটে সুপারফাস্ট অ্যাক্টিভেশন গ্যারান্টি!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Brand Title */}
        <div 
          onClick={() => setActiveTab('store')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-all">
            <Smartphone className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent tracking-tight leading-none">
                Fahim Internet
              </h1>
              <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-[8px] font-black uppercase tracking-widest font-mono">
                TELECOM
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              Premium Digital Offer Store
            </p>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 w-full md:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'store', label: 'প্যাকেজ স্টোর' },
            { id: 'builder', label: 'কাস্টম অফার বিল্ডার' },
            { id: 'tracking', label: 'অর্ডার ট্র্যাকিং' },
            { id: 'admin', label: 'ম্যানেজমেন্ট প্যানেল' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap tracking-wide transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10 font-bold scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Support Call-to-Action / Admin Toggle Switch */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggleAdminMode}
            className={`px-3.5 py-2 rounded-xl text-[11px] font-black tracking-wider uppercase border transition-all flex items-center gap-1.5 cursor-pointer ${
              isAdmin 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>এডমিন মোড: {isAdmin ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
          </button>

          <a 
            href="tel:+8801700000000"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-extrabold transition-all border border-slate-700"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>০১৭০০-০০০০০০</span>
          </a>
        </div>
      </div>
    </header>
  );
}

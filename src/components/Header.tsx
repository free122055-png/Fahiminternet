import React, { useState } from 'react';
import { 
  User, UserPlus, Wifi, ChevronDown, Shield, Check, Smartphone, Menu, X, Moon, Sun, ShoppingCart, GraduationCap, Sparkles, Search, Bell,
  Home, Network, Phone, MessageSquare, Gift, Zap, Package, History, Heart, Download, Bot, HelpCircle, MessageSquare as MessageCircle, PhoneCall, Building2, ShieldCheck, FileText, ArrowRight, LogOut
} from 'lucide-react';

import { SiteSettings } from '../types';

type TabType = 'homepage' | 'store' | 'builder' | 'tracking' | 'admin';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAdmin: boolean;
  toggleAdminMode: () => void;
  onOpenWifiModal: () => void;
  onOpenAboutModal: () => void;
  settings: SiteSettings;
  currentUser: any | null;
  onOpenAuthModal: (msg?: string) => void;
  onLogout: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: any) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  onOpenAIModal: () => void;
  onOpenHelpModal: () => void;
  onOpenContactModal: () => void;
  onOpenPrivacyModal: () => void;
  onOpenTermsModal: () => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  isAdmin, 
  toggleAdminMode,
  onOpenWifiModal,
  onOpenAboutModal,
  settings,
  currentUser,
  onOpenAuthModal,
  onLogout,
  selectedCategory,
  setSelectedCategory,
  showFavoritesOnly,
  setShowFavoritesOnly,
  onOpenAIModal,
  onOpenHelpModal,
  onOpenContactModal,
  onOpenPrivacyModal,
  onOpenTermsModal,
  showToast
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100 select-none">
      <header className="max-w-7xl mx-auto px-3 sm:px-6 py-3.5 flex items-center justify-between">
        
        {/* LEFT: Logo & Brand */}
        <div className="flex items-center shrink-0">
          <div 
            onClick={() => { setActiveTab('homepage'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 sm:gap-4 cursor-pointer transition-all duration-350 active:scale-[0.98] group p-1 sm:px-3 sm:py-2 rounded-2xl hover:bg-slate-50/80"
            title="ফাহিম ইন্টারনেট হোম"
          >
            {/* Premium Logo Container */}
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-[18px] bg-white border border-emerald-100/50 shadow-sm overflow-hidden p-1 group-hover:shadow-md transition-shadow">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="FAHIM INTERNET Logo" referrerPolicy="no-referrer" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white rounded-lg shadow-inner">
                    <span className="text-2xl font-black italic">F</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-emerald-50">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
              </div>
            </div>
            
            <div className="flex flex-col text-left justify-center">
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tighter leading-none">
                  {settings.brandName?.split(' ')[0] || 'Fahim'}
                </span>
                <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
              </div>
              <span className="text-base sm:text-lg font-bold text-emerald-500 tracking-tight leading-none mt-1 uppercase">
                {settings.brandName?.split(' ').slice(1).join(' ') || 'Internet'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">

          {/* Direct Software Portal Action Button */}
          {currentUser ? (
            <button 
              onClick={() => setActiveTab('homepage')}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full transition-all duration-300 shadow-xs cursor-pointer select-none font-black text-xs shrink-0 border-none"
            >
              <Smartphone className="w-4 h-4 text-emerald-200" />
              <span>সফটওয়্যার পোর্টাল</span>
            </button>
          ) : (
            <button 
              onClick={() => onOpenAuthModal('⚠️ সফটওয়্যারে প্রবেশ করতে প্রথমে আপনার একাউন্টে লগইন করুন।')}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full transition-all duration-300 shadow-xs cursor-pointer select-none font-black text-xs shrink-0 border-none"
            >
              <User className="w-4 h-4 text-emerald-200" />
              <span>লগইন / রেজিস্ট্রেশন</span>
            </button>
          )}

        </div>

      </header>

      {/* -------------------- PREMIUM MULTI-CATEGORY NAVIGATION SIDEBAR -------------------- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-start animate-fade-in select-none" id="premium-drawer-wrapper">
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm cursor-pointer transition-opacity duration-300"
            id="premium-drawer-overlay"
          />

          {/* Sidebar Drawer Panel */}
          <div className="relative w-[280px] xs:w-[320px] sm:w-[340px] max-w-[85%] h-full bg-white text-slate-800 flex flex-col shadow-md z-10 animate-slide-in overflow-hidden border-r border-slate-100" id="premium-drawer-panel">
            {/* Header / Brand */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-md ">
                  FI
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-tight text-slate-800 leading-none">Fahim Internet</h3>
                  <span className="text-[9px] font-bold text-slate-400 tracking-wider">PREMIUM STORE</span>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-slate-150/70 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                id="close-premium-drawer-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable menu categories */}
            <div className="flex-grow overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
              
              {/* Profile Card Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-200 shrink-0 bg-slate-50 flex items-center justify-center">
                    {currentUser?.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt="User Profile" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-xs shadow-sm">
                        {currentUser?.displayName?.charAt(0) || 'F'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate leading-none">
                      {currentUser?.displayName || 'ফাহিম গ্রাহক'}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold truncate mt-0.5">
                      {currentUser?.phone || currentUser?.email || 'Guest User'}
                    </p>
                  </div>
                </div>
                <div>
                  {currentUser ? (
                    <button 
                      onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                      className="px-2 py-1 rounded-md text-[9px] font-black bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>লগআউট</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => { onOpenAuthModal(); setMobileMenuOpen(false); }}
                      className="px-2.5 py-1 rounded-md text-[9px] font-black bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer"
                    >
                      লগইন
                    </button>
                  )}
                </div>
              </div>

              {/* GROUP 1: মূল নেভিগেশন */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase pl-1">মূল নেভিগেশন (Main)</p>
                <div className="space-y-1">
                  
                  {/* Home */}
                  <button 
                    onClick={() => {
                      setActiveTab('homepage');
                      setSelectedCategory('All');
                      setShowFavoritesOnly(false);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer ${
                      activeTab === 'homepage' && !showFavoritesOnly && selectedCategory === 'All'
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/10 font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      activeTab === 'homepage' && !showFavoritesOnly && selectedCategory === 'All'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-50 text-slate-900'
                    }`}>
                      <Home className="w-4 h-4" />
                    </div>
                    <span>🏠 Home</span>
                  </button>

                  {/* Offers Builder */}
                  <button 
                    onClick={() => {
                      setActiveTab('builder');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer ${
                      activeTab === 'builder'
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10 font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      activeTab === 'builder'
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      <Zap className="w-4 h-4" />
                    </div>
                    <span>⚡ Offers & Builder</span>
                  </button>

                  {/* Favorite Packages */}
                  <button 
                    onClick={() => {
                      setActiveTab('homepage');
                      setShowFavoritesOnly(true);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer ${
                      showFavoritesOnly
                        ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/10 font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      showFavoritesOnly
                        ? 'bg-white/20 text-white'
                        : 'bg-rose-50 text-rose-600'
                    }`}>
                      <Heart className="w-4 h-4" />
                    </div>
                    <span>❤️ Favorite Packages</span>
                  </button>

                </div>
              </div>

              {/* GROUP 2: সার্ভিস অফারসমূহ */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase pl-1">সার্ভিস ক্যাটাগরি (Services)</p>
                <div className="space-y-1">
                  
                  {/* Internet Packages */}
                  <button 
                    onClick={() => {
                      setActiveTab('homepage');
                      setSelectedCategory('internet');
                      setShowFavoritesOnly(false);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer ${
                      activeTab === 'homepage' && !showFavoritesOnly && selectedCategory === 'internet'
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10 font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      activeTab === 'homepage' && !showFavoritesOnly && selectedCategory === 'internet'
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      <Wifi className="w-4 h-4" />
                    </div>
                    <span>📶 Internet Packages</span>
                  </button>

                  {/* WiFi Packages */}
                  <button 
                    onClick={() => {
                      onOpenWifiModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600">
                      <Network className="w-4 h-4" />
                    </div>
                    <span>🛜 WiFi Packages</span>
                  </button>

                  {/* Minutes */}
                  <button 
                    onClick={() => {
                      setActiveTab('homepage');
                      setSelectedCategory('minute');
                      setShowFavoritesOnly(false);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer ${
                      activeTab === 'homepage' && !showFavoritesOnly && selectedCategory === 'minute'
                        ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/10 font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      activeTab === 'homepage' && !showFavoritesOnly && selectedCategory === 'minute'
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>📞 Minutes</span>
                  </button>

                  {/* SMS */}
                  <button 
                    onClick={() => {
                      setActiveTab('homepage');
                      setSelectedCategory('sms');
                      setShowFavoritesOnly(false);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer ${
                      activeTab === 'homepage' && !showFavoritesOnly && selectedCategory === 'sms'
                        ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/10 font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      activeTab === 'homepage' && !showFavoritesOnly && selectedCategory === 'sms'
                        ? 'bg-white/20 text-white'
                        : 'bg-pink-50 text-pink-600'
                    }`}>
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span>💬 SMS</span>
                  </button>

                  {/* Combo Packages */}
                  <button 
                    onClick={() => {
                      setActiveTab('homepage');
                      setSelectedCategory('family');
                      setShowFavoritesOnly(false);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer ${
                      activeTab === 'homepage' && !showFavoritesOnly && selectedCategory === 'family'
                        ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/10 font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      activeTab === 'homepage' && !showFavoritesOnly && selectedCategory === 'family'
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-50 text-purple-600'
                    }`}>
                      <Gift className="w-4 h-4" />
                    </div>
                    <span>🎁 Combo Packages</span>
                  </button>

                </div>
              </div>

              {/* GROUP 3: আমার ড্যাশবোর্ড */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase pl-1">আমার ড্যাশবোর্ড (Dashboard)</p>
                <div className="space-y-1">
                  
                  {/* My Orders */}
                  <button 
                    onClick={() => {
                      setActiveTab('tracking');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer ${
                      activeTab === 'tracking'
                        ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10 font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      activeTab === 'tracking'
                        ? 'bg-white/20 text-white'
                        : 'bg-teal-50 text-teal-600'
                    }`}>
                      <Package className="w-4 h-4" />
                    </div>
                    <span>📦 My Orders</span>
                  </button>

                  {/* Order History */}
                  <button 
                    onClick={() => {
                      setActiveTab('tracking');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
                      <History className="w-4 h-4" />
                    </div>
                    <span>📜 Order History</span>
                  </button>

                  {/* My Profile */}
                  <button 
                    onClick={() => {
                      if (currentUser) {
                        alert(`👤 আপনার প্রোফাইল বিবরণ:\n\nনাম: ${currentUser.displayName || 'Fahim Hossain'}\nইমেইল: ${currentUser.email || 'guest@fahim-internet.com'}\nমোবাইল: ${currentUser.phoneNumber || 'প্রদান করা হয়নি'}`);
                      } else {
                        onOpenAuthModal('👤 প্রোফাইল দেখতে প্রথমে লগইন করুন!');
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <User className="w-4 h-4" />
                    </div>
                    <span>👤 My Profile</span>
                  </button>

                  {/* Log out or Log in menu option */}
                  {currentUser ? (
                    <button 
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100"
                    >
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="font-black text-rose-600">🚪 লগআউট করুন (Logout)</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        onOpenAuthModal();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-black text-blue-600">🔑 লগইন করুন (Login)</span>
                    </button>
                  )}



                </div>
              </div>

              {/* GROUP 4: সহায়তা ও নীতিসমূহ */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase pl-1">সহায়তা ও এক্সপ্লোর (Support)</p>
                <div className="space-y-1">
                  
                  {/* AI Assistant */}
                  <button 
                    onClick={() => {
                      onOpenAIModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer text-slate-700 hover:bg-slate-50 hover:text-emerald-700 "
                  >
                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-900 shadow-sm ">
                      <Bot className="w-4 h-4 " />
                    </div>
                    <span className="text-slate-900 font-black">🤖 AI Assistant</span>
                  </button>

                  {/* Download APK */}
                  {settings.apkUrl && (
                    <a 
                      href={settings.apkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                        <Download className="w-4 h-4" />
                      </div>
                      <span>📥 Download APK</span>
                    </a>
                  )}

                  {/* Help Center / FAQ */}
                  <button 
                    onClick={() => {
                      onOpenHelpModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span>❓ Help Center / FAQ</span>
                  </button>

                  {/* Live Chat Support */}
                  <button 
                    onClick={() => {
                      const url = `https://wa.me/${settings.supportPhone || '01618599077'}?text=Hello Fahim Internet, I need support regarding my internet packages.`;
                      window.open(url, '_blank');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span>💬 Live Chat Support</span>
                  </button>

                  {/* Contact Us */}
                  <button 
                    onClick={() => {
                      onOpenContactModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <span>📞 Contact Us</span>
                  </button>

                  {/* About Us */}
                  <button 
                    onClick={() => {
                      onOpenAboutModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span>🏢 About Us</span>
                  </button>

                  {/* Privacy Policy */}
                  <button 
                    onClick={() => {
                      onOpenPrivacyModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-50 text-slate-900">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span>🔒 Privacy Policy</span>
                  </button>

                  {/* Terms & Conditions */}
                  <button 
                    onClick={() => {
                      onOpenTermsModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-extrabold text-xs text-left cursor-pointer text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <div className="p-1.5 rounded-lg bg-yellow-50 text-yellow-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span>📄 Terms & Conditions</span>
                  </button>

                </div>
              </div>

            </div>

            {/* Logout Panel / Bottom Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 font-bold flex flex-col gap-2">
              <div className="flex items-center justify-between text-slate-500">
                <span>Helpline: {settings.supportPhone}</span>
                <span>v2.4 Premium</span>
              </div>
              {currentUser ? (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-center font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-xs"
                  id="drawer-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                  <span>লগআউট করুন (Logout)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-center font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-xs"
                  id="drawer-login-btn"
                >
                  <User className="w-4 h-4" />
                  <span>লগইন / সাইন আপ (Login)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

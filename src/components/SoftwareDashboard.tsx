import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DataPack, Order, SiteSettings } from '../types';
import { 
  Globe, Phone, Box, Users, Smartphone, Zap, Gift, Wallet, 
  History, Headphones, Search, User, ChevronRight, Bell, Settings,
  LogOut, Shield, Sparkles, AlertCircle, ArrowRight, RefreshCw, Layers, CheckCircle, Eye,
  ArrowLeft, Filter, SlidersHorizontal, Heart, ShieldCheck, Menu, X, MessageSquare, HelpCircle, Send,
  Lock, FileText, PhoneCall, Info, Trash2, ShieldAlert, Clock, XCircle, Share2, Calendar, CheckCircle2, ChevronLeft, Check,
  LayoutGrid, Mail, Home, BadgePercent, ChevronDown
} from 'lucide-react';
import { GPLogo, RobiLogo, BanglalinkLogo, AirtelLogo, TeletalkLogo } from './OperatorLogos';
import PackCard from './PackCard';
import PopularPackCard from './PopularPackCard';
import UserProfile from './UserProfile';
import { 
  MyPacks, OrderHistory, OrderTracking, FavoriteOffers, 
  AddMoney, PaymentHistory, Cashback, SavedCards, 
  SupportTeam, LiveChat, Tickets, Faq, 
  AccountSettings, ChangePassword, SecuritySettings, NotificationSettings,
  AboutUs, PrivacyPolicy, TermsConditions, ContactUs, DeleteAccount 
} from './ProfileSections';

function formatBnNumber(num: number | string): string {
  const bnDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return String(num).replace(/[0-9]/g, (w) => bnDigits[w] || w);
}

function formatBnDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const monthsBn = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const day = formatBnNumber(d.getDate().toString().padStart(2, '0'));
    const month = monthsBn[d.getMonth()];
    const year = formatBnNumber(d.getFullYear());

    let hours = d.getHours();
    const minutes = formatBnNumber(d.getMinutes().toString().padStart(2, '0'));
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursBn = formatBnNumber(hours.toString().padStart(2, '0'));

    return `${day} ${month} ${year}, ${hoursBn}:${minutes} ${ampm}`;
  } catch {
    return dateStr;
  }
}

function getBnOperatorName(op: string): string {
  const map: { [key: string]: string } = {
    'GP': 'গ্রামীণফোন',
    'Airtel': 'Airtel',
    'Robi': 'রবি',
    'Teletalk': 'টেলিটক',
    'Banglalink': 'বাংলালিঙ্ক'
  };
  return map[op] || op;
}

interface SoftwareDashboardProps {
  currentUser: any;
  settings: SiteSettings;
  packs: DataPack[];
  orders: Order[];
  onLogout: () => void;
  onInitiatePurchase: (pack: DataPack) => void;
  onOpenAdmin: () => void;
  onOpenAddMoney: () => void;
  onOpenRecharge: () => void;
  onOpenSupport?: () => void;
  onOpenTracker?: () => void;
  onOpenProfile?: () => void;
  onOpenDemoCurtain?: () => void;
  onOpenAuth?: (msg?: string) => void;
  isAdmin?: boolean;
}

export default function SoftwareDashboard({
  currentUser,
  settings,
  packs,
  orders,
  onLogout,
  onInitiatePurchase,
  onOpenAdmin,
  onOpenAddMoney,
  onOpenRecharge,
  onOpenSupport,
  onOpenTracker,
  onOpenProfile,
  onOpenDemoCurtain,
  onOpenAuth,
  isAdmin = false
}: SoftwareDashboardProps) {
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'offers' | 'wallet' | 'history' | 'profile'>('home');
  const [historyTab, setHistoryTab] = useState<'orders' | 'payments'>('orders');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOperator, setSelectedOperator] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);
  const [activeMenuModal, setActiveMenuModal] = useState<'privacy' | 'terms' | 'contact' | 'about' | 'support' | 'delete_account' | 'my_packs' | 'order_history' | 'order_tracking' | 'favorite_offers' | 'add_money' | 'payment_history' | 'cashback' | 'saved_cards' | 'support_team' | 'live_chat' | 'tickets' | 'faq' | 'account_settings' | 'change_password' | 'security' | 'notification_settings' | null>(null);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'lowest' | 'highest'>('lowest');
  const [favIds, setFavIds] = useState<string[]>([]);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');
  const [selectedHistoryOrder, setSelectedHistoryOrder] = useState<Order | null>(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const isLoggedIn = Boolean(currentUser && (currentUser.uid || currentUser.phone));

  const requireAuth = (action: () => void, customMsg?: string) => {
    if (!isLoggedIn) {
      if (onOpenAuth) {
        onOpenAuth(customMsg || 'এই ফিচার বা সেবাটি ব্যবহার করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন।');
      } else {
        setActiveNavTab('profile');
      }
      return false;
    }
    action();
    return true;
  };

  const bannerList = (settings?.bannerImages && settings.bannerImages.length > 0) 
    ? settings.bannerImages 
    : [
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200&h=400'
      ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // ------------------ ANIMATED OFFER BANNER SYSTEM ("অফার দেখুন" CAROUSEL) ------------------
  const [offerSlideIndex, setOfferSlideIndex] = useState(0);

  interface OfferSlideItem {
    id: string;
    operator: string;
    title: string;
    tagline: string;
    data: string;
    dataUnit: string;
    minute: string;
    netType: string;
    price: string;
    bgGradient: string;
    btnBg: string;
    logo: React.ReactNode;
    personImg: string;
    imageUrl?: string;
  }

  const offerSlides = React.useMemo(() => {
    const defaultSlides: OfferSlideItem[] = [
      {
        id: 'gp-special',
        operator: 'GP',
        title: 'গ্রামীণফোন',
        tagline: 'স্পেশাল ইন্টারনেট অফার!',
        data: '40 GB',
        dataUnit: 'ইন্টারনেট',
        minute: '300 মিনিট',
        netType: 'সব নেটওয়ার্ক',
        price: 'মাত্র ৫০০ টাকা',
        bgGradient: 'from-[#032e15] via-[#064e24] to-[#011a0c]',
        btnBg: 'bg-[#00e281] hover:bg-[#00c972] text-slate-950',
        logo: <GPLogo className="w-6 h-6 text-[#00f28e]" />,
        personImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=600'
      },
      {
        id: 'airtel-special',
        operator: 'Airtel',
        title: 'Airtel',
        tagline: 'ধামাকা ক্যাশব্যাক অফার!',
        data: '30 GB',
        dataUnit: 'ইন্টারনেট',
        minute: '200 মিনিট',
        netType: 'সব নেটওয়ার্ক',
        price: 'মাত্র ৪০০ টাকা',
        bgGradient: 'from-[#4a0000] via-[#800000] to-[#2d0000]',
        btnBg: 'bg-red-600 hover:bg-red-500 text-white',
        logo: <AirtelLogo className="w-6 h-6 text-red-500" />,
        personImg: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600&h=600'
      },
      {
        id: 'robi-special',
        operator: 'Robi',
        title: 'রবি',
        tagline: 'রবি মেগা বাম্পার অফার!',
        data: '50 GB',
        dataUnit: 'ইন্টারনেট',
        minute: '500 মিনিট',
        netType: 'সব নেটওয়ার্ক',
        price: 'মাত্র ৫৫০ টাকা',
        bgGradient: 'from-[#3b0213] via-[#630623] to-[#24010b]',
        btnBg: 'bg-rose-600 hover:bg-rose-500 text-white',
        logo: <RobiLogo className="w-6 h-6 text-rose-500" />,
        personImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600&h=600'
      },
      {
        id: 'bl-special',
        operator: 'Banglalink',
        title: 'বাংলালিঙ্ক',
        tagline: 'বাংলালিঙ্ক সুপার অফার!',
        data: '25 GB',
        dataUnit: 'ইন্টারনেট',
        minute: '400 মিনিট',
        netType: 'সব নেটওয়ার্ক',
        price: 'মাত্র ৪৫০ টাকা',
        bgGradient: 'from-[#3a1a00] via-[#662e00] to-[#210f00]',
        btnBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
        logo: <BanglalinkLogo className="w-6 h-6 text-amber-500" />,
        personImg: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600&h=600'
      },
      {
        id: 'teletalk-special',
        operator: 'Teletalk',
        title: 'টেলিটক',
        tagline: 'টেলিটক সাশ্রয়ী প্যাক!',
        data: '20 GB',
        dataUnit: 'ইন্টারনেট',
        minute: '100 মিনিট',
        netType: 'সব নেটওয়ার্ক',
        price: 'মাত্র ২৫০ টাকা',
        bgGradient: 'from-[#00282a] via-[#004d50] to-[#001718]',
        btnBg: 'bg-teal-500 hover:bg-teal-400 text-slate-950',
        logo: <TeletalkLogo className="w-6 h-6 text-teal-400" />,
        personImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=600'
      }
    ];

    if (settings?.offerBanners && settings.offerBanners.length > 0) {
      return settings.offerBanners.map((imgUrl, i) => ({
        id: `offer-banner-${i}`,
        operator: 'All',
        title: 'ট্রেন্ডিং স্পেশাল অফার',
        tagline: 'সেরা ডিসকাউন্ট ও ইন্টারনেট প্যাক',
        data: '',
        dataUnit: '',
        minute: '',
        netType: '',
        price: '',
        bgGradient: '',
        btnBg: 'bg-emerald-500 text-slate-950',
        logo: null,
        personImg: '',
        imageUrl: imgUrl
      }));
    }

    return defaultSlides;
  }, [settings?.offerBanners, settings?.bannerImages]);

  const [isOfferPaused, setIsOfferPaused] = React.useState(false);
  const pauseTimeoutRef = React.useRef<any>(null);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const handleUserInteraction = () => {
    setIsOfferPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsOfferPaused(false);
    }, 6000);
  };

  React.useEffect(() => {
    if (offerSlides.length <= 1 || isOfferPaused) return;
    const timer = setInterval(() => {
      setOfferSlideIndex(prev => {
        const next = (prev + 1) % offerSlides.length;
        if (carouselRef.current) {
          carouselRef.current.scrollTo({ left: next * carouselRef.current.clientWidth, behavior: 'smooth' });
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [offerSlides.length, isOfferPaused]);

  // Filter history orders based on history filter pills
  const filteredHistoryOrders = orders.filter((ord) => {
    if (historyFilter === 'completed') return ord.status === 'completed' || ord.status === 'approved';
    if (historyFilter === 'pending') return ord.status === 'pending' || ord.status === 'processing';
    if (historyFilter === 'cancelled') return ord.status === 'cancelled';
    return true;
  });

  // Filter & sort packs based on current selection
  const filteredPacks = packs.filter((pack) => {
    const matchesOp = selectedOperator === 'All' || pack.operator.toLowerCase() === selectedOperator.toLowerCase();
    const matchesCat = selectedCategory === 'All' || 
      pack.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === 'combo' && (pack.category === 'family' || pack.category === 'combo')) ||
      (selectedCategory === 'family' && (pack.category === 'family' || pack.category === 'combo')) ||
      (selectedCategory === 'minute' && (pack.category === 'minute' || pack.category === 'minutes' || (pack.minutes > 0 && (pack.data === '0' || pack.data === '0 MB' || pack.data === '0 GB')))) ||
      (selectedCategory === 'internet' && (pack.category === 'internet' || pack.category === 'combo' || pack.category === 'family' || (pack.data !== '0' && pack.data !== '0 MB' && pack.data !== '0 GB')));
    const matchesQuery = !searchQuery || 
      pack.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pack.data.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.operator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOp && matchesCat && matchesQuery;
  }).sort((a, b) => {
    if (sortBy === 'lowest') return a.salePrice - b.salePrice;
    if (sortBy === 'highest') return b.salePrice - a.salePrice;
    return 0;
  });

  // Category list for dashboard grid with search keywords and natural styling
  const dashboardCategories = [
    { 
      id: 'internet',
      label: 'ইন্টারনেট প্যাক', 
      icon: Globe, 
      bgCircle: 'bg-blue-50 text-blue-600 border border-blue-100', 
      barColor: 'bg-blue-500', 
      cat: 'internet', 
      keywords: ['internet', 'data', 'ইন্টারনেট', 'প্যাক', 'এমবি', 'gb', 'mb'] 
    },
    { 
      id: 'minute',
      label: 'মিনিট প্যাক', 
      icon: PhoneCall, 
      bgCircle: 'bg-emerald-50 text-emerald-600 border border-emerald-100', 
      barColor: 'bg-emerald-500', 
      cat: 'minute', 
      keywords: ['minute', 'min', 'মিনিট', 'কল', 'টকটাইম'] 
    },
    { 
      id: 'recharge',
      label: 'মোবাইল রিচার্জ', 
      icon: Smartphone, 
      bgCircle: 'bg-orange-50 text-orange-600 border border-orange-100', 
      barColor: 'bg-orange-500', 
      action: onOpenRecharge, 
      keywords: ['recharge', 'রিচার্জ', 'টাকা', 'ফ্লেক্সি'] 
    },
    { 
      id: 'special',
      label: 'স্পেশাল অফার', 
      icon: Zap, 
      bgCircle: 'bg-purple-50 text-purple-600 border border-purple-100', 
      barColor: 'bg-purple-500', 
      cat: 'All', 
      keywords: ['special', 'offer', 'স্পেশাল', 'অফার'] 
    },
    { 
      id: 'cashback',
      label: 'ক্যাশব্যাক অফার', 
      icon: Gift, 
      bgCircle: 'bg-pink-50 text-pink-600 border border-pink-100', 
      barColor: 'bg-pink-500', 
      cat: 'gift', 
      keywords: ['cashback', 'ক্যাশব্যাক', 'বোনাস'] 
    },
    { 
      id: 'add_money',
      label: 'Add Money', 
      icon: Wallet, 
      bgCircle: 'bg-emerald-50 text-emerald-600 border border-emerald-100', 
      barColor: 'bg-emerald-500', 
      action: () => setActiveMenuModal('add_money'), 
      keywords: ['add money', 'wallet', 'এড মানি', 'ব্যালেন্স'] 
    },
    { 
      id: 'all_service',
      label: 'সকল সার্ভিস', 
      icon: LayoutGrid, 
      bgCircle: 'bg-indigo-50 text-indigo-600 border border-indigo-100', 
      barColor: 'bg-indigo-500', 
      cat: 'All', 
      keywords: ['all', 'সকল', 'সার্ভিস', 'অফার'] 
    },
    { 
      id: 'bundle',
      label: 'বান্ডিল প্যাক', 
      icon: Box, 
      bgCircle: 'bg-amber-50 text-amber-600 border border-amber-100', 
      barColor: 'bg-amber-500', 
      cat: 'combo', 
      keywords: ['bundle', 'combo', 'বান্ডিল', 'কম্বো'] 
    },
    { 
      id: 'family',
      label: 'ফ্যামিলি প্যাক', 
      icon: Users, 
      bgCircle: 'bg-violet-50 text-violet-600 border border-violet-100', 
      barColor: 'bg-violet-500', 
      cat: 'family', 
      keywords: ['family', 'ফ্যামিলি', 'শেয়ার'] 
    },
    { 
      id: 'support',
      label: 'সাপোর্ট টিম', 
      icon: Headphones, 
      bgCircle: 'bg-sky-50 text-sky-600 border border-sky-100', 
      barColor: 'bg-sky-500', 
      action: onOpenSupport, 
      keywords: ['support', 'help', 'সাপোর্ট', 'হেল্প', 'যোগাযোগ'] 
    },
    { 
      id: 'tracking',
      label: 'অর্ডার ট্র্যাকিং', 
      icon: ShieldCheck, 
      bgCircle: 'bg-teal-50 text-teal-700 border border-teal-100', 
      barColor: 'bg-teal-600', 
      action: onOpenTracker, 
      keywords: ['track', 'order', 'ট্র্যাকিং', 'অর্ডার'] 
    },
  ];

  const filteredDashboardCategories = dashboardCategories.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchLabel = item.label.toLowerCase().includes(q);
    const matchKeyword = item.keywords.some(k => k.toLowerCase().includes(q));
    return matchLabel || matchKeyword;
  });

  const searchMatchingPacks = searchQuery.trim() ? packs.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.operator.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }) : [];

  // Popular / Featured packs for horizontal scroll
  const popularPacks = packs.filter(p => p.isPopular || p.isHot);
  const displayPopularPacks = popularPacks.length > 0 ? popularPacks : packs.slice(0, 8);

  // Calculate user balance (mock default if not set on user object)
  const userBalance = currentUser?.balance !== undefined ? currentUser.balance : 0;

  return (
    <div className="w-full h-full min-h-full bg-slate-100 font-sans flex items-center justify-center select-none overflow-hidden sm:py-2 sm:px-2">
      
      {/* 📱 MOBILE / DESKTOP APP CONTAINER */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl h-full sm:h-[96vh] sm:max-h-[880px] bg-white sm:rounded-[36px] sm:shadow-2xl sm:border sm:border-slate-200 overflow-hidden relative flex flex-col">

        {/* ------------------ HOME TAB ------------------ */}
        {activeNavTab === 'home' ? (
          <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden relative">
            {/* 📌 PERMANENTLY FIXED TOP SECTION (HEADER + HERO BANNER + OVERLAPPING SEARCH BAR) */}
            <div className="shrink-0 bg-white z-30 pb-7 shadow-xs border-b border-slate-100/50">
              {/* Top Header */}
              <header className="bg-white px-5 py-3 flex items-center justify-between border-b border-slate-100/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                    <span className="text-2xl font-black italic">F</span>
                  </div>
                  <div>
                    <h1 className="text-base font-black text-slate-900 leading-none tracking-tight">Fahim</h1>
                    <p className="text-xs font-bold text-emerald-500 leading-none mt-0.5">Internet</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => requireAuth(() => setShowNotificationModal(true), 'নোটিফিকেশন দেখতে অনুগ্রহ করে অ্যাকাউন্টে লগইন করুন।')}
                    className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 relative hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                  </button>
                  {currentUser ? (
                    <button 
                      onClick={() => setActiveNavTab('profile')}
                      className="w-10 h-10 rounded-full border-2 border-emerald-100 overflow-hidden shadow-xs flex items-center justify-center bg-slate-100"
                    >
                      {currentUser?.photoURL ? (
                        <img 
                          src={currentUser.photoURL} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-black">
                          {currentUser?.displayName?.charAt(0) || 'U'}
                        </div>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenAuth ? onOpenAuth() : setActiveNavTab('profile')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>লগইন</span>
                    </button>
                  )}
                </div>
              </header>

              {/* 1. HERO BANNER WITH OVERLAPPING FLOATING SEARCH BAR (SINGLE STATIC IMAGE) */}
              <div className="px-5 pt-2 relative">
                <div className="h-32 sm:h-40 w-full rounded-3xl overflow-hidden relative border border-slate-200/80 shadow-md bg-slate-900">
                  <img
                    src={settings?.topBannerImage || (settings?.bannerImages && settings.bannerImages.length > 0 ? settings.bannerImages[0] : 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200&h=400')}
                    alt="Main Banner"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200&h=400';
                    }}
                  />
                </div>

                {/* FLOATING OVERLAY SEARCH BAR (BKASH DASHBOARD STYLE OVERLAPPING BANNER EDGE) */}
                <div className="absolute -bottom-6 left-5 right-5 h-14 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-2 flex items-center gap-3 z-20">
                  <div className="w-10 h-10 flex items-center justify-center text-slate-400 shrink-0">
                    <Search className="w-5 h-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="প্যাক, অফার খুঁজুন..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      requireAuth(() => {
                        setActiveNavTab('offers');
                        setShowSearchInput(true);
                      }, 'সকল অফার ফিল্টার বা সার্চ করতে অনুগ্রহ করে লগইন করুন।');
                    }}
                    className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 hover:bg-emerald-100 transition-colors shrink-0 cursor-pointer"
                    title="সকল অফার ফিল্টার করুন"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 📜 SCROLLABLE DASHBOARD CONTENT (BELOW THE RED LINE) */}
            <div className="flex-1 overflow-y-auto pb-28 hide-scrollbar pt-3">
              
              {/* 2. BALANCE CARD */}
              <div className="px-5 mt-2">
                <div className="bg-gradient-to-br from-emerald-50/30 via-white to-white rounded-[28px] border-2 border-emerald-100/50 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] p-6 flex items-center justify-between transition-all hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.15)] hover:border-emerald-200/60">
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] font-black text-emerald-700/70 uppercase tracking-[0.2em]">মূল ব্যালেন্স</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">৳ {Number(userBalance).toLocaleString('bn-BD', { minimumFractionDigits: 2 })}</span>
                      <button className="w-8 h-8 rounded-full bg-white border border-emerald-50 flex items-center justify-center text-emerald-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all active:rotate-180 duration-500 shadow-sm">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 border-l border-emerald-100/80 pl-5">
                    <button onClick={() => requireAuth(() => setActiveMenuModal('add_money'), 'ওয়ালেট এ ব্যালেন্স যোগ (এড মানি) করতে অনুগ্রহ করে অ্যাকাউন্টে লগইন করুন।')} className="flex flex-col items-center gap-2 cursor-pointer group">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                        <Zap className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-[11px] font-black text-slate-800 tracking-tight">এড মানি</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. CATEGORY ICONS GRID (NATURAL USER-FRIENDLY DESIGN) */}
              <div className="px-4 mt-6">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-3.5 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block" />
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">দ্রুত সেবা</h3>
                  </div>
                  <button 
                    onClick={() => {
                      requireAuth(() => {
                        setActiveNavTab('offers');
                        setSelectedCategory('All');
                      }, 'সকল সেবা সুবিধা দেখতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন অথবা একাউন্ট খুলুন।');
                    }}
                    className="text-[11px] font-extrabold text-slate-600 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                  >
                    <span>সব সেবা দেখুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {searchQuery.trim() && (
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-black text-emerald-700">ক্যাটাগরি ফলাফল:</span>
                    <span className="text-[11px] font-bold text-slate-500">"{searchQuery}" এর জন্য</span>
                  </div>
                )}

                {filteredDashboardCategories.length > 0 ? (
                  <>
                    <div className="grid grid-cols-4 gap-2.5">
                      {(showAllFeatures ? filteredDashboardCategories : filteredDashboardCategories.slice(0, 8)).map((item, idx) => (
                        <motion.button 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (idx % 8) * 0.03 }}
                          key={item.label}
                          onClick={() => {
                            requireAuth(() => {
                              if (item.action) item.action();
                              else {
                                setActiveNavTab('offers');
                                setSelectedCategory(item.cat || 'All');
                                setSelectedOperator('All');
                              }
                            }, `${item.label} সুবিধাটি ব্যবহার করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন।`);
                          }}
                          className="bg-white border border-slate-100/90 rounded-[26px] p-3 sm:p-3.5 flex flex-col items-center justify-between shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group cursor-pointer active:scale-95"
                        >
                          {/* Icon Circle */}
                          <div className={`w-14 h-14 sm:w-15 sm:h-15 rounded-full flex items-center justify-center overflow-hidden ${item.bgCircle} group-hover:scale-110 transition-transform duration-300 shadow-sm p-1.5`}>
                            {settings?.quickServiceIcons?.[item.id] ? (
                              <img src={settings.quickServiceIcons[item.id]} alt={item.label} className="w-full h-full object-contain rounded-full" />
                            ) : (
                              <item.icon className="w-6 h-6 stroke-[2.2]" />
                            )}
                          </div>

                          {/* Label */}
                          <span className="text-[10px] sm:text-[11px] font-black text-slate-800 leading-tight text-center tracking-tight mt-2 min-h-[24px] flex items-center justify-center px-0.5">
                            {item.label}
                          </span>

                          {/* Bottom Accent Line */}
                          <div className={`w-4 h-1 rounded-full ${item.barColor} mt-1.5 opacity-80 group-hover:w-6 group-hover:opacity-100 transition-all`} />
                        </motion.button>
                      ))}
                    </div>

                    {/* Toggle Button for More Features */}
                    {filteredDashboardCategories.length > 8 && !searchQuery.trim() && (
                      <div className="flex justify-center mt-6">
                        <button 
                          onClick={() => setShowAllFeatures(!showAllFeatures)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm text-xs font-black text-slate-700 hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-700 transition-all active:scale-95 group"
                        >
                          <span>{showAllFeatures ? 'কম দেখুন' : 'আরও দেখুন'}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAllFeatures ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
                    <p className="text-xs font-bold text-slate-600">কোনো ক্যাটাগরি পাওয়া যায়নি</p>
                    <p className="text-[11px] text-slate-400">অন্য শব্দ দিয়ে অনুসন্ধান করার চেষ্টা করুন</p>
                  </div>
                )}
              </div>

              {/* ------------------ SPECIAL ANIMATED OFFER BANNER CAROUSEL ("ট্রেন্ডিং অফার" SYSTEM) ------------------ */}
              {!searchQuery.trim() && (
                <div className="mt-5 mb-3 px-2 sm:px-3">
                  {/* Header Title as seen in video */}
                  <div className="flex items-center justify-between mb-2.5 px-2">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span className="w-2.5 h-4 rounded-full bg-gradient-to-b from-red-500 to-rose-600 shadow-xs" />
                      <span>ট্রেন্ডিং অফার</span>
                    </h3>
                    <div className="flex items-center gap-1.5">
                      {offerSlides.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            handleUserInteraction();
                            setOfferSlideIndex(idx);
                            if (carouselRef.current) {
                              carouselRef.current.scrollTo({ left: idx * carouselRef.current.clientWidth, behavior: 'smooth' });
                            }
                          }}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            offerSlideIndex === idx 
                              ? 'bg-red-500 w-6 shadow-xs' 
                              : 'bg-slate-300 w-1.5 hover:bg-slate-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Full Width Clean Taller Banner Carousel with Smooth Sliding Track & Touch Swipe */}
                  <div 
                    ref={carouselRef}
                    className="relative overflow-x-auto snap-x snap-mandatory hide-scrollbar flex w-full h-[200px] sm:h-[235px] rounded-[28px] shadow-xl border border-slate-900/10 bg-slate-950"
                    onPointerDown={handleUserInteraction}
                    onScroll={(e) => {
                      const scrollLeft = (e.target as HTMLDivElement).scrollLeft;
                      const width = (e.target as HTMLDivElement).clientWidth;
                      const index = Math.round(scrollLeft / width);
                      if (index !== offerSlideIndex) {
                        setOfferSlideIndex(index);
                      }
                    }}
                  >
                    {offerSlides.map((slide, sIdx) => (
                      <div
                        key={slide.id || sIdx}
                        className="w-full h-full shrink-0 snap-center relative select-none cursor-pointer"
                        onClick={() => {
                          requireAuth(() => {
                            if (slide.operator && slide.operator !== 'All') {
                              setSelectedOperator(slide.operator);
                            }
                            setActiveNavTab('offers');
                          }, 'ট্রেন্ডিং অফারসমূহ দেখতে অনুগ্রহ করে লগইন করুন।');
                        }}
                      >
                          {slide.imageUrl ? (
                            <div className="relative w-full h-full group">
                              <img 
                                src={slide.imageUrl} 
                                alt={slide.title} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end justify-between p-5">
                                <span className="text-sm sm:text-base font-black text-white drop-shadow-md">{slide.title}</span>
                                <button className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-xl transition-all active:scale-95">
                                  <span>অফার দেখুন</span>
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-r ${slide.bgGradient} p-5 sm:p-6 flex items-center justify-between relative overflow-hidden`}>
                              {/* Ambient Glow Effects */}
                              <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-black/30 rounded-full blur-2xl pointer-events-none" />

                              {/* Left Content */}
                              <div className="relative z-10 flex-1 flex flex-col justify-between h-full space-y-2">
                                {/* Header Logo + Title */}
                                <div className="flex items-center gap-2.5">
                                  <div className="p-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm">
                                    {slide.logo}
                                  </div>
                                  <div>
                                    <span className="text-base sm:text-lg font-black text-white tracking-tight">{slide.title}</span>
                                    <p className="text-xs sm:text-sm font-extrabold text-amber-300 leading-none mt-0.5">{slide.tagline}</p>
                                  </div>
                                </div>

                                {/* Offer Specs */}
                                <div className="space-y-1.5">
                                  <div className="flex items-baseline gap-2.5">
                                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">{slide.data}</span>
                                    <span className="text-sm sm:text-base font-bold text-slate-200 uppercase tracking-wider">{slide.dataUnit}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs sm:text-sm font-extrabold text-emerald-300">
                                    <span>{slide.minute}</span>
                                    <span className="w-2 h-2 rounded-full bg-white/40" />
                                    <span className="text-slate-200 font-medium">{slide.netType}</span>
                                  </div>
                                </div>

                                {/* Price & Action Button */}
                                <div className="flex items-center gap-3 pt-1">
                                  <span className="text-sm sm:text-base font-black text-amber-200 bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 shadow-sm">
                                    {slide.price}
                                  </span>
                                  <button className={`px-5 py-2 rounded-full text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-xl transition-all cursor-pointer ${slide.btnBg}`}>
                                    <span>অফার দেখুন</span>
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Right Side Illustration */}
                              {slide.personImg && (
                                <div className="relative z-10 w-36 sm:w-44 h-full shrink-0 flex items-end justify-center -mr-4 sm:-mr-6">
                                  <img 
                                    src={slide.personImg} 
                                    alt="User" 
                                    className="h-[120%] object-cover object-top filter drop-shadow-2xl select-none"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ------------------ 4. POPULAR OFFERS HORIZONTAL SCROLL SECTION (MATCHES SCREENSHOT) ------------------ */}
              {!searchQuery.trim() && displayPopularPacks.length > 0 && (
                <div className="mt-6 space-y-2.5">
                  {/* Section Header */}
                  <div className="px-5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <h3 className="text-sm font-black text-slate-800 tracking-tight">
                        জনপ্রিয় অফারসমূহ <span className="text-xs font-bold text-slate-400 font-sans">(Popular Offers)</span>
                      </h3>
                    </div>
                    <span className="bg-amber-50 text-amber-600 border border-amber-200/80 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      ★ BEST CHOICE
                    </span>
                  </div>

                  {/* Horizontal Scrollable Offers Container */}
                  <div className="flex gap-3 overflow-x-auto hide-scrollbar px-5 py-1">
                    {displayPopularPacks.map(pack => (
                      <PopularPackCard 
                        key={pack.id} 
                        pack={pack} 
                        onSelect={(p) => requireAuth(() => onInitiatePurchase(p), 'অফার কিনতে হলে প্রথমে আপনাকে অ্যাকাউন্টে লগইন করতে হবে।')} 
                        settings={settings}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Offers List on Home Tab when searching */}
              {searchQuery.trim() && searchMatchingPacks.length > 0 && (
                <div className="px-5 space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>মিলে যাওয়া প্যাকসমূহ ({searchMatchingPacks.length})</span>
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {searchMatchingPacks.map(pack => (
                      <PackCard 
                        key={pack.id} 
                        pack={pack} 
                        onSelect={onInitiatePurchase} 
                        onToggleFavorite={(id) => {
                          setFavIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
                        }}
                        isFavorite={favIds.includes(pack.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 4. SPECIAL OFFER BANNER */}
              <div className="px-5 mt-8">
                <div className="bg-emerald-50 rounded-[30px] p-6 relative overflow-hidden flex items-center justify-between border border-emerald-100 shadow-xs">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200/30 rounded-full -mr-12 -mt-12" />
                  
                  <div className="relative z-10 space-y-3">
                    <div>
                      <h4 className="text-lg font-black text-emerald-900 leading-tight">স্পেশাল অফার!</h4>
                      <p className="text-xs font-bold text-emerald-700 opacity-80 leading-tight mt-1">
                        নির্বাচিত প্যাকে পাচ্ছেন <br /> এক্সট্রা ক্যাশব্যাক!
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        requireAuth(() => {
                          setActiveNavTab('offers');
                          setSelectedCategory('All');
                        }, 'স্পেশাল ক্যাশব্যাক অফার দেখতে অনুগ্রহ করে লগইন করুন।');
                      }}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-full shadow-md shadow-emerald-600/20 transition-colors cursor-pointer"
                    >
                      অফার দেখুন
                    </button>
                  </div>

                  <div className="relative z-10 w-28 h-28 flex items-center justify-center">
                    <div className="absolute inset-0 bg-emerald-200/40 rounded-full animate-pulse" />
                    <Gift className="w-16 h-16 text-emerald-600" />
                  </div>
                </div>
              </div>

              {/* Promotional Banners */}
              {((settings.promoBanners && settings.promoBanners.length > 0) ? settings.promoBanners : [
                { id: 'default-1', imageUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=600&h=800', isActive: true, targetPackId: '' },
                { id: 'default-2', imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&h=800', isActive: true, targetPackId: '' },
                { id: 'default-3', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=800', isActive: true, targetPackId: '' }
              ]).filter(b => b.isActive).length > 0 && (
                <div className="space-y-4 pt-8 pb-2">
                  <div className="px-5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">
                        <BadgePercent className="w-3 h-3 fill-white" />
                      </div>
                      <h3 className="text-sm font-black text-slate-800 tracking-tight">
                        প্রোমোশনাল অফার
                      </h3>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveNavTab('offers');
                      }}
                      className="text-xs font-bold text-indigo-600 flex items-center gap-1"
                    >
                      সব দেখুন <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex gap-4 overflow-x-auto hide-scrollbar px-5 pb-4 snap-x snap-mandatory">
                    {((settings.promoBanners && settings.promoBanners.length > 0) ? settings.promoBanners : [
                      { id: 'default-1', imageUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=600&h=800', isActive: true, targetPackId: '' },
                      { id: 'default-2', imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&h=800', isActive: true, targetPackId: '' },
                      { id: 'default-3', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=800', isActive: true, targetPackId: '' }
                    ]).filter(b => b.isActive).map(banner => (
                      <div 
                        key={banner.id}
                        onClick={() => {
                          requireAuth(() => {
                            const pack = packs.find(p => p.id === banner.targetPackId);
                            if (pack) {
                              onInitiatePurchase(pack);
                            } else {
                              setActiveNavTab('offers');
                            }
                          }, 'প্রোমোশনাল অফার ক্রয় করতে অনুগ্রহ করে লগইন করুন।');
                        }}
                        className="w-[240px] sm:w-[280px] shrink-0 rounded-[20px] overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-[0.98] snap-center bg-slate-100"
                      >
                        <img src={banner.imageUrl} alt="Promo Banner" className="w-full h-auto aspect-[3/4] object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden relative">
            {/* Top Header for non-home tabs */}
            <header className="bg-white shrink-0 z-30 px-5 py-3 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                  <span className="text-2xl font-black italic">F</span>
                </div>
                <div>
                  <h1 className="text-base font-black text-slate-900 leading-none tracking-tight">Fahim</h1>
                  <p className="text-xs font-bold text-emerald-500 leading-none mt-0.5">Internet</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowNotificationModal(true)}
                  className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 relative hover:bg-slate-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                </button>
                <button 
                  onClick={() => setActiveNavTab('profile')}
                  className="w-10 h-10 rounded-full border-2 border-emerald-100 overflow-hidden shadow-xs"
                >
                  <img 
                    src={currentUser?.photoURL || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto pb-24 hide-scrollbar">


          {activeNavTab === 'offers' && (
            <div className="p-5 space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            
            {/* Top Bar with Back Arrow, Title, and Search Icon */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveNavTab('home')}
                  className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors cursor-pointer border-none"
                  title="ফিরে যান"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {selectedCategory === 'internet' ? 'ইন্টারনেট প্যাক' :
                   selectedCategory === 'minute' ? 'মিনিট প্যাক' :
                   selectedCategory === 'combo' ? 'বান্ডেল প্যাক' :
                   selectedCategory === 'family' ? 'ফ্যামিলি প্যাক' :
                   selectedCategory === 'gift' ? 'মাই প্যাক অফার' : 'ইন্টারনেট ও ড্রাইভ প্যাক'}
                </h2>
              </div>

              <button
                onClick={() => setShowSearchInput(!showSearchInput)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer border-none ${
                  showSearchInput ? 'bg-emerald-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Optional Collapsible Search Input */}
            {showSearchInput && (
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs animate-fade-in">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="অফার বা মেগাবাইট লিখে খুঁজুন..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Operator Horizontal Filter Tabs (Rounded Green Active Pill matching screenshot) */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 hide-scrollbar">
              {[
                { id: 'All', label: 'সব' },
                { id: 'GP', label: 'জি পি' },
                { id: 'Robi', label: 'রবি' },
                { id: 'Airtel', label: 'এয়ারটেল' },
                { id: 'Banglalink', label: 'বাংলালিংক' },
                { id: 'Teletalk', label: 'টেলিটক' }
              ].map((op) => {
                const isActive = selectedOperator === op.id;
                return (
                  <button
                    key={op.id}
                    onClick={() => setSelectedOperator(op.id)}
                    className={`px-4.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
                      isActive
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    {op.label}
                  </button>
                );
              })}
            </div>

            {/* Sub-bar: Filter Button & Lowest Price Sort Selector */}
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setSelectedOperator('All');
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-3.5 py-1.5 bg-white border border-slate-200/90 text-slate-700 hover:text-emerald-700 rounded-full text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                >
                  <Filter className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ফিল্টার</span>
                </button>

                {/* Category Quick Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border border-slate-200/90 text-slate-700 rounded-full px-3 py-1 text-xs font-extrabold cursor-pointer focus:outline-none"
                >
                  <option value="All">সকল টাইপ</option>
                  <option value="internet">ইন্টারনেট</option>
                  <option value="minute">মিনিট</option>
                  <option value="combo">বান্ডেল</option>
                  <option value="family">ফ্যামিলি</option>
                  <option value="gift">মাই প্যাক</option>
                </select>
              </div>

              {/* Sort selector */}
              <button
                onClick={() => setSortBy(prev => prev === 'lowest' ? 'highest' : 'lowest')}
                className="px-3.5 py-1.5 bg-white border border-slate-200/90 text-slate-700 hover:text-emerald-700 rounded-full text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              >
                <span>{sortBy === 'lowest' ? 'সর্বনিম্ন মূল্য' : 'সর্বোচ্চ মূল্য'}</span>
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            </div>

            {/* Offers List (Exact Horizontal Card Rows matching screenshot) */}
            {filteredPacks.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-500">কোনো অফার পাওয়া যায়নি!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPacks.map((pack) => {
                  const discountPercent = pack.regularPrice > pack.salePrice 
                    ? Math.round(((pack.regularPrice - pack.salePrice) / pack.regularPrice) * 100)
                    : 0;
                  const isFav = favIds.includes(pack.id);

                  return (
                    <div 
                      key={pack.id} 
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all p-3.5 sm:p-4 flex items-center justify-between gap-3 relative group"
                    >
                      {/* Top Right Heart Favorite Toggle */}
                      <button
                        onClick={() => {
                          setFavIds(prev => isFav ? prev.filter(i => i !== pack.id) : [...prev, pack.id]);
                        }}
                        className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer border-none bg-transparent"
                        title={isFav ? "পছন্দ থেকে সরান" : "পছন্দের তালিকায় রাখুন"}
                      >
                        <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>

                      {/* Left: Operator Logo & Label */}
                      <div className="flex flex-col items-center justify-center w-14 flex-shrink-0 gap-1 border-r border-slate-150 pr-3">
                        {pack.operator === 'GP' && <GPLogo size={36} logoUrl={settings?.gpLogoUrl} />}
                        {pack.operator === 'Robi' && <RobiLogo size={36} logoUrl={settings?.robiLogoUrl} />}
                        {pack.operator === 'Banglalink' && <BanglalinkLogo size={36} logoUrl={settings?.blLogoUrl} />}
                        {pack.operator === 'Airtel' && <AirtelLogo size={36} logoUrl={settings?.airtelLogoUrl} />}
                        {pack.operator === 'Teletalk' && <TeletalkLogo size={36} logoUrl={settings?.teletalkLogoUrl} />}
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">
                          {pack.operator === 'Banglalink' ? 'banglalink' : pack.operator.toLowerCase()}
                        </span>
                      </div>

                      {/* Middle: Data Title, Details & Price */}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        {(() => {
                          const isMinuteOnly = pack.category === 'minute' || pack.category === 'minutes' || !pack.data || pack.data === '0' || pack.data === '0 MB' || pack.data === '0 GB';
                          const displayHeading = isMinuteOnly 
                            ? `${pack.minutes} মিনিট` 
                            : (pack.minutes > 0 ? `${pack.data} + ${pack.minutes} মিনিট` : pack.data);

                          return (
                            <>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100/80 text-[10px] font-black inline-block">
                                {isMinuteOnly ? 'মিনিট' : pack.category === 'combo' ? 'বান্ডেল' : pack.category === 'family' ? 'ফ্যামিলি' : 'ইন্টারনেট'}
                              </span>

                              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                                {displayHeading}
                              </h3>

                              <div className="text-[11px] font-bold text-slate-500 leading-snug">
                                <p>মেয়াদ: {pack.validity}</p>
                                <p>
                                  {isMinuteOnly 
                                    ? `টকটাইম: ${pack.minutes} মিনিট (অল নেটওয়ার্ক)` 
                                    : `ইন্টারনেট: ${pack.data}${pack.minutes > 0 ? ` + ${pack.minutes} মিনিট` : ''}`
                                  }
                                </p>
                              </div>
                            </>
                          );
                        })()}

                        {/* Price Row */}
                        <div className="flex items-baseline gap-1.5 pt-0.5">
                          <span className="text-base font-black text-emerald-700">
                            ৳{pack.salePrice}
                          </span>
                          {pack.regularPrice > pack.salePrice && (
                            <span className="text-xs font-bold text-slate-400 line-through">
                              ৳{pack.regularPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Discount & Emerald Buy Button */}
                      <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0 pl-1 pt-1">
                        {discountPercent > 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-150 text-[11px] font-black">
                            {discountPercent}% ছাড়
                          </span>
                        ) : <div className="h-4" />}

                        <button
                          onClick={() => onInitiatePurchase(pack)}
                          className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer border-none"
                        >
                          কিনুন
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Security Guarantee Banner (Matches Screenshot Bottom) */}
            <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3.5 flex items-center gap-3 text-emerald-900">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black leading-tight text-emerald-950">নিরাপদ লেনদেন</h4>
                <p className="text-[11px] font-bold text-emerald-700 leading-tight">
                  আপনার সকল লেনদেন ১০০% নিরাপদ ও এনক্রিপ্টেড
                </p>
              </div>
            </div>

          </div>
        )}


        {/* ------------------ 6. PAYMENT HISTORY TAB (EXACT UI FROM SCREENSHOT) ------------------ */}
        {activeNavTab === 'wallet' && (
          <div className="space-y-4 animate-fade-in pb-16">
            
            {/* 1. GREEN HEADER BANNER */}
            <div className="bg-emerald-700 rounded-2xl p-4 text-white shadow-md flex items-center gap-3.5 relative overflow-hidden">
              <div className="w-11 h-11 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <Clock className="w-5.5 h-5.5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                  লেনদেন ইতিহাস
                </h2>
                <p className="text-xs text-emerald-100 font-bold opacity-90 leading-tight mt-0.5">
                  আপনার সকল রিচার্জ ও লেনদেনের ইতিহাস দেখুন
                </p>
              </div>
            </div>

            {/* 2. FILTER PILLS ROW (সকল, সফল, পেন্ডিং, ব্যর্থ) */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {[
                { id: 'all', label: 'সকল', icon: CheckCircle2, activeBg: 'bg-emerald-700 text-white border-emerald-700' },
                { id: 'completed', label: 'সফল', icon: CheckCircle, activeBg: 'bg-emerald-700 text-white border-emerald-700' },
                { id: 'pending', label: 'পেন্ডিং', icon: Clock, activeBg: 'bg-emerald-700 text-white border-emerald-700' },
                { id: 'cancelled', label: 'ব্যর্থ', icon: XCircle, activeBg: 'bg-emerald-700 text-white border-emerald-700' },
              ].map((tab) => {
                const isActive = historyFilter === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setHistoryFilter(tab.id as any)}
                    className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                      isActive
                        ? `${tab.activeBg} shadow-sm`
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${
                      isActive 
                        ? 'text-white' 
                        : tab.id === 'completed' 
                        ? 'text-emerald-600' 
                        : tab.id === 'pending' 
                        ? 'text-amber-500' 
                        : tab.id === 'cancelled' 
                        ? 'text-rose-500' 
                        : 'text-emerald-700'
                    }`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 3. TRANSACTIONS ORDER LIST CARDS */}
            {filteredHistoryOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-2">
                <Box className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-500">কোনো লেনদেন পাওয়া যায়নি!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredHistoryOrders.map((ord) => {
                  const isSuccess = ord.status === 'completed' || ord.status === 'approved';
                  const isPending = ord.status === 'pending' || ord.status === 'processing';
                  const isFailed = ord.status === 'cancelled';

                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedHistoryOrder(ord)}
                      className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      {/* Left: Operator Circular Logo Badge */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                          ord.operator === 'GP' ? 'bg-emerald-600 text-white' :
                          ord.operator === 'Airtel' ? 'bg-rose-600 text-white' :
                          ord.operator === 'Robi' ? 'bg-amber-600 text-white' :
                          ord.operator === 'Teletalk' ? 'bg-sky-600 text-white' :
                          'bg-orange-500 text-white'
                        }`}>
                          {ord.operator === 'GP' && <GPLogo size={24} logoUrl={settings?.gpLogoUrl} />}
                          {ord.operator === 'Airtel' && <AirtelLogo size={24} logoUrl={settings?.airtelLogoUrl} />}
                          {ord.operator === 'Robi' && <RobiLogo size={24} logoUrl={settings?.robiLogoUrl} />}
                          {ord.operator === 'Teletalk' && <TeletalkLogo size={24} logoUrl={settings?.teletalkLogoUrl} />}
                          {ord.operator === 'Banglalink' && <BanglalinkLogo size={24} logoUrl={settings?.blLogoUrl} />}
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                            {getBnOperatorName(ord.operator)}
                          </h3>
                          <p className="text-xs font-extrabold text-slate-700 truncate leading-tight">
                            {ord.packTitle || 'অফার রিচার্জ'}
                          </p>
                          <p className="text-[11px] font-bold text-slate-500 leading-tight font-mono">
                            {ord.customerPhone}
                          </p>
                          {ord.rejectReason && (
                            <p className="text-[10px] font-extrabold text-rose-600 leading-tight truncate max-w-[180px]">
                              কারণ: {ord.rejectReason}
                            </p>
                          )}
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 pt-0.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{formatBnDate(ord.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount & Status Badge */}
                      <div className="flex flex-col items-end justify-between self-stretch shrink-0 py-0.5">
                        <span className="text-base sm:text-lg font-black text-slate-900">
                          ৳{formatBnNumber(ord.price)}
                        </span>

                        {isSuccess && (
                          <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-150 text-emerald-700 text-[11px] font-black rounded-full flex items-center gap-1">
                            <span>সফল</span>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          </span>
                        )}

                        {isPending && (
                          <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-150 text-amber-700 text-[11px] font-black rounded-full flex items-center gap-1">
                            <span>পেন্ডিং</span>
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                          </span>
                        )}

                        {isFailed && (
                          <span className="px-2.5 py-0.5 bg-rose-50 border border-rose-150 text-rose-700 text-[11px] font-black rounded-full flex items-center gap-1">
                            <span>ব্যর্থ</span>
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}


        {/* ------------------ 7. HISTORY TAB ------------------ */}
        {activeNavTab === 'history' && (
          <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <OrderHistory userId={currentUser?.uid} />
          </div>
        )}

        {activeNavTab === 'profile' && (
          <UserProfile 
            currentUser={currentUser}
            onLogout={onLogout} 
            onOpenAuth={onOpenAuth}
            onAction={(action) => {
              switch(action) {
                case 'open_auth':
                  if (onOpenAuth) onOpenAuth();
                  break;
                case 'my_packs': setActiveMenuModal('my_packs'); break;
                case 'order_history': setActiveMenuModal('order_history'); break;
                case 'order_tracking': setActiveMenuModal('order_tracking'); break;
                case 'favorite_offers': setActiveMenuModal('favorite_offers'); break;
                case 'account_settings': setActiveMenuModal('account_settings'); break;
                case 'change_password': setActiveMenuModal('change_password'); break;
                case 'security': setActiveMenuModal('security'); break;
                case 'notification_settings': setActiveMenuModal('notification_settings'); break;
                case 'add_money': setActiveMenuModal('add_money'); break;
                case 'payment_history': setActiveMenuModal('payment_history'); break;
                case 'cashback': setActiveMenuModal('cashback'); break;
                case 'saved_cards': setActiveMenuModal('saved_cards'); break;
                case 'support_team': setActiveMenuModal('support_team'); break;
                case 'live_chat': setActiveMenuModal('live_chat'); break;
                case 'tickets': setActiveMenuModal('tickets'); break;
                case 'faq': setActiveMenuModal('faq'); break;
                case 'privacy_policy': setActiveMenuModal('privacy'); break;
                case 'terms_conditions': setActiveMenuModal('terms'); break;
                case 'contact_us': setActiveMenuModal('contact'); break;
                case 'about_us': setActiveMenuModal('about'); break;
                case 'delete_account': setActiveMenuModal('delete_account'); break;
                default: alert(`${action} অপশনটি এখন কাজ করছে না, এটি শীঘ্রই যুক্ত করা হবে।`);
              }
            }} 
          />
        )}

      </main>
          </div>
        )}

      {/* ------------------ 8. BOTTOM MOBILE NAVIGATION BAR (4 TABS) ------------------ */}
      <nav className="absolute bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-100 flex items-center justify-around px-4 z-40 pb-2">
        {[
          { id: 'home', label: 'হোম', icon: Home },
          { id: 'offers', label: 'অফার', icon: LayoutGrid },
          { id: 'history', label: 'হিস্টোরি', icon: History },
          { id: 'profile', label: 'প্রোফাইল', icon: User },
        ].map((tab) => {
          const isActive = activeNavTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'home' || tab.id === 'profile') {
                  setActiveNavTab(tab.id as any);
                } else {
                  requireAuth(
                    () => setActiveNavTab(tab.id as any),
                    `${tab.label} ট্যাব এক্সেস করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন অথবা একাউন্ট খুলুন।`
                  );
                }
              }}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative border-none bg-transparent cursor-pointer ${
                isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-emerald-50 scale-110' : ''
              }`}>
                <Icon className={`w-5.5 h-5.5 ${isActive ? 'fill-emerald-600/10' : ''}`} />
              </div>
              <span className={`text-[10px] font-black transition-all ${
                isActive ? 'scale-105' : 'opacity-70'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTabDot"
                  className="absolute -top-1 w-1 h-1 bg-emerald-600 rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>


      {/* ------------------ 9. FULL-SCREEN MENU DRAWER ------------------ */}
      <AnimatePresence>
        {showMenuDrawer && (
          <div className="absolute inset-0 z-50 flex justify-start overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenuDrawer(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-4/5 max-w-[300px] bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto"
            >
              {/* Drawer Top Header */}
              <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 text-white font-black text-lg flex items-center justify-center border border-white/20">
                    FI
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-tight leading-tight uppercase">ফাাহিম ইন্টারনেট</h3>
                    <p className="text-[10px] text-emerald-200 font-bold">সফটওয়্যার নেভিগেশন মেনু</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowMenuDrawer(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User Account Info Banner in Drawer */}
              <div className="p-4 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                    {currentUser?.displayName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{currentUser?.displayName || 'সম্মানিত গ্রাহক'}</h4>
                    <p className="text-[10px] font-bold text-emerald-700">ব্যালেন্স: ৳{Number(userBalance).toLocaleString('bn-BD')}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowMenuDrawer(false);
                    setActiveMenuModal('add_money');
                  }}
                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black rounded-lg shadow-xs cursor-pointer border-none"
                >
                  + এড মানি
                </button>
              </div>

              {/* Services & Account List in Menu */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                <div>
                  <h4 className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                    মেনু নেভিগেশন
                  </h4>
                  <div className="space-y-1">
                    
                    {/* 1. Privacy Policy */}
                    <button
                      onClick={() => {
                        setShowMenuDrawer(false);
                        setActiveMenuModal('privacy');
                      }}
                      className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-800 transition-colors cursor-pointer border-none text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🔒</span>
                        <span>Privacy Policy</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>

                    {/* 2. Terms & Conditions */}
                    <button
                      onClick={() => {
                        setShowMenuDrawer(false);
                        setActiveMenuModal('terms');
                      }}
                      className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-800 transition-colors cursor-pointer border-none text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">📜</span>
                        <span>Terms & Conditions</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>

                    {/* 3. Contact Us */}
                    <button
                      onClick={() => {
                        setShowMenuDrawer(false);
                        setActiveMenuModal('contact');
                      }}
                      className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-800 transition-colors cursor-pointer border-none text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">📞</span>
                        <span>Contact Us</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>

                    {/* 4. About App */}
                    <button
                      onClick={() => {
                        setShowMenuDrawer(false);
                        setActiveMenuModal('about');
                      }}
                      className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-800 transition-colors cursor-pointer border-none text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">ℹ️</span>
                        <span>About App</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>

                    {/* 5. Help & Support */}
                    <button
                      onClick={() => {
                        setShowMenuDrawer(false);
                        setActiveMenuModal('support');
                      }}
                      className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-800 transition-colors cursor-pointer border-none text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">❓</span>
                        <span>Help & Support</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>

                    {/* 6. Delete Account */}
                    <button
                      onClick={() => {
                        setShowMenuDrawer(false);
                        setActiveMenuModal('delete_account');
                      }}
                      className="w-full px-3 py-2.5 rounded-xl hover:bg-rose-50 flex items-center justify-between text-xs font-extrabold text-rose-600 transition-colors cursor-pointer border-none text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🗑️</span>
                        <span>Delete Account</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-rose-300" />
                    </button>

                    {/* 7. Logout */}
                    <button
                      onClick={() => {
                        setShowMenuDrawer(false);
                        onLogout();
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs flex items-center justify-between transition-colors cursor-pointer border-none text-left mt-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🚪</span>
                        <span>Logout</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-rose-400" />
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setShowMenuDrawer(false);
                          onOpenAdmin();
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-black text-xs flex items-center justify-between transition-colors cursor-pointer border-none text-left mt-2 shadow-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Settings className="w-4 h-4" />
                          <span>এডমিন কন্ট্রোল প্যানেল</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </button>
                    )}

                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400">FAHIM INTERNET V2.4 • 100% SECURED</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ------------------ NOTIFICATION MODAL ------------------ */}
      <AnimatePresence>
        {showNotificationModal && (
          <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-xs w-full rounded-2xl p-4 border border-slate-200 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>জরুরি নোটিশ ও বার্তা</span>
                </h3>
                <button 
                  onClick={() => setShowNotificationModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold border-none bg-transparent cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1.5 text-xs">
                <span className="font-extrabold text-emerald-800 block">📢 সিস্টেম আপডেট</span>
                <p className="text-emerald-900 font-medium leading-relaxed text-[11px]">
                  {settings.marqueeText || "সকল অপারেটরের ইন্টারনেট ও মিনিট প্যাক অটো রিচার্জ চালু রয়েছে। দ্রুত সেবা পেতে অফারটি বেছে নিন।"}
                </p>
              </div>

              <button
                onClick={() => setShowNotificationModal(false)}
                className="w-full py-2 bg-slate-900 text-white font-extrabold text-xs rounded-xl cursor-pointer border-none"
              >
                ঠিক আছে
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ------------------ DYNAMIC MENU MODALS (PRIVACY, TERMS, CONTACT, ABOUT, SUPPORT, DELETE ACCOUNT) ------------------ */}
      <AnimatePresence>
        {activeMenuModal && (
          <div className={`absolute inset-0 z-50 overflow-y-auto ${activeMenuModal === 'add_money' ? 'bg-white' : 'bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4'}`}>
            <motion.div
              initial={activeMenuModal === 'add_money' ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
              animate={activeMenuModal === 'add_money' ? { y: 0 } : { scale: 1, opacity: 1 }}
              exit={activeMenuModal === 'add_money' ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={activeMenuModal === 'add_money' 
                ? "bg-white min-h-full w-full p-6 space-y-6 pb-20"
                : "bg-white max-w-xs w-full rounded-2xl p-4 border border-slate-200 shadow-2xl space-y-3 my-auto max-h-[90%] overflow-y-auto"
              }
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between ${activeMenuModal === 'add_money' ? 'pb-4 border-b-2 border-slate-50' : 'border-b border-slate-100 pb-2.5'}`}>
                <h3 className={`${activeMenuModal === 'add_money' ? 'text-lg' : 'text-xs'} font-black text-slate-900 flex items-center gap-1.5`}>
                  {activeMenuModal === 'privacy' && <span>🔒 Privacy Policy</span>}
                  {activeMenuModal === 'terms' && <span>📜 Terms & Conditions</span>}
                  {activeMenuModal === 'contact' && <span>📞 Contact Us</span>}
                  {activeMenuModal === 'about' && <span>ℹ️ About App</span>}
                  {activeMenuModal === 'support' && <span>❓ Help & Support</span>}
                  {activeMenuModal === 'add_money' && (
                    <div className="flex flex-col">
                      <span className="text-lg font-black tracking-tight">অ্যাড মানি</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Wallet Recharge</span>
                    </div>
                  )}
                  {activeMenuModal === 'payment_history' && <span>📄 Payment History</span>}
                  {activeMenuModal === 'account_settings' && <span>👤 Account Settings</span>}
                  {activeMenuModal === 'change_password' && <span>🔒 Change Password</span>}
                  {activeMenuModal === 'notification_settings' && <span>🔔 Notifications</span>}
                  {activeMenuModal === 'faq' && <span>❓ Help / FAQ</span>}
                  {activeMenuModal === 'delete_account' && <span className="text-rose-600">🗑️ Delete Account</span>}
                  {!['privacy', 'terms', 'contact', 'about', 'support', 'add_money', 'payment_history', 'account_settings', 'change_password', 'notification_settings', 'faq', 'delete_account'].includes(activeMenuModal) && <span>সেটিং বিস্তারিত</span>}
                </h3>
                <button
                  onClick={() => setActiveMenuModal(null)}
                  className={`${activeMenuModal === 'add_money' ? 'w-10 h-10 text-base' : 'w-6 h-6 text-xs'} rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold border-none cursor-pointer transition-all active:scale-90`}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body Content */}
              <div className={`${activeMenuModal === 'add_money' ? 'text-sm' : 'text-xs'} space-y-2.5 text-slate-700 font-medium`}>
                {activeMenuModal === 'my_packs' && <MyPacks userId={currentUser?.uid} />}
                {activeMenuModal === 'order_history' && <OrderHistory userId={currentUser?.uid} />}
                {activeMenuModal === 'order_tracking' && <OrderTracking userId={currentUser?.uid} />}
                {activeMenuModal === 'favorite_offers' && <FavoriteOffers userId={currentUser?.uid} />}
                {activeMenuModal === 'add_money' && <AddMoney userId={currentUser?.uid} settings={settings} currentUser={currentUser} />}
                {activeMenuModal === 'payment_history' && <PaymentHistory userId={currentUser?.uid} />}
                {activeMenuModal === 'cashback' && <Cashback userId={currentUser?.uid} />}
                {activeMenuModal === 'saved_cards' && <SavedCards userId={currentUser?.uid} />}
                {activeMenuModal === 'support_team' && <SupportTeam userId={currentUser?.uid} />}
                {activeMenuModal === 'live_chat' && <LiveChat userId={currentUser?.uid} />}
                {activeMenuModal === 'tickets' && <Tickets userId={currentUser?.uid} />}
                {activeMenuModal === 'faq' && <Faq userId={currentUser?.uid} />}
                {activeMenuModal === 'support' && <Faq userId={currentUser?.uid} />}
                {activeMenuModal === 'account_settings' && <AccountSettings userId={currentUser?.uid} currentUser={currentUser} />}
                {activeMenuModal === 'change_password' && <ChangePassword userId={currentUser?.uid} />}
                {activeMenuModal === 'security' && <SecuritySettings userId={currentUser?.uid} />}
                {activeMenuModal === 'notification_settings' && <NotificationSettings userId={currentUser?.uid} />}
                {activeMenuModal === 'about' && <AboutUs userId={currentUser?.uid} />}
                {activeMenuModal === 'privacy' && <PrivacyPolicy userId={currentUser?.uid} />}
                {activeMenuModal === 'terms' && <TermsConditions userId={currentUser?.uid} />}
                {activeMenuModal === 'contact' && <ContactUs userId={currentUser?.uid} settings={settings} />}
                {activeMenuModal === 'delete_account' && <DeleteAccount userId={currentUser?.uid} currentUser={currentUser} />}
              </div>

              {/* Close Button */}
              {activeMenuModal !== 'delete_account' && (
                <button
                  onClick={() => setActiveMenuModal(null)}
                  className={`w-full py-4 ${activeMenuModal === 'add_money' ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-slate-900 hover:bg-slate-800 text-white'} font-extrabold text-xs rounded-xl cursor-pointer border-none mt-4 transition-all`}
                >
                  বন্ধ করুন
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------ 10. TRANSACTION DETAILS MODAL (EXACT MATCH FROM SCREENSHOT) ------------------ */}
      <AnimatePresence>
        {selectedHistoryOrder && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-[390px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92%] animate-fade-in"
            >
              {/* Top Header Bar */}
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <button
                  onClick={() => setSelectedHistoryOrder(null)}
                  className="flex items-center gap-1.5 text-slate-800 hover:text-emerald-700 font-extrabold text-sm cursor-pointer border-none bg-transparent"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-800" />
                  <span>লেনদেন বিস্তারিত</span>
                </button>
                <button
                  onClick={() => {
                    const text = `অর্ডার আইডি: ${selectedHistoryOrder.id}\nঅপারেটর: ${getBnOperatorName(selectedHistoryOrder.operator)}\nসেবা: ${selectedHistoryOrder.packTitle}\nমোবাইল: ${selectedHistoryOrder.customerPhone}\nমূল্য: ৳${selectedHistoryOrder.price}`;
                    if (navigator.share) {
                      navigator.share({ title: 'লেনদেন বিস্তারিত', text }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(text);
                      alert('📋 লেনদেন বিবরণ কপি করা হয়েছে!');
                    }
                  }}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors border-none cursor-pointer"
                  title="শেয়ার করুন"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Body Content */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
                
                {/* Status Illustration / Graphic */}
                <div className="text-center space-y-2 py-2">
                  <div className="relative inline-block">
                    {/* Floating confetti dots */}
                    <div className="absolute -top-1 -left-3 w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="absolute -top-3 right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="absolute -bottom-1 -left-2 w-2 h-2 rounded-full bg-rose-400" />
                    <div className="absolute -bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-sky-400" />

                    {selectedHistoryOrder.status === 'completed' || selectedHistoryOrder.status === 'approved' ? (
                      <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                        <Check className="w-10 h-10 stroke-[3]" />
                      </div>
                    ) : selectedHistoryOrder.status === 'pending' || selectedHistoryOrder.status === 'processing' ? (
                      <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                        <Clock className="w-10 h-10 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/30">
                        <X className="w-10 h-10 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-emerald-700 pt-1">
                    {selectedHistoryOrder.status === 'completed' || selectedHistoryOrder.status === 'approved'
                      ? 'লেনদেন সফল!'
                      : selectedHistoryOrder.status === 'pending' || selectedHistoryOrder.status === 'processing'
                      ? 'অর্ডার পেন্ডিং!'
                      : 'লেনদেন ব্যর্থ!'}
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    {selectedHistoryOrder.status === 'completed' || selectedHistoryOrder.status === 'approved'
                      ? 'আপনার রিচার্জ সফলভাবে সম্পন্ন হয়েছে'
                      : selectedHistoryOrder.status === 'pending' || selectedHistoryOrder.status === 'processing'
                      ? 'আপনার রিচার্জ অর্ডারটি পেন্ডিং রয়েছে'
                      : selectedHistoryOrder.rejectReason
                      ? `বাতিলের কারণ: ${selectedHistoryOrder.rejectReason}`
                      : 'অর্ডারটি বাতিল করা হয়েছে এবং ওয়ালেটে টাকা ফেরত দেওয়া হয়েছে'}
                  </p>
                </div>

                {/* Detailed Info Box ("লেনদেন তথ্য") */}
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                    লেনদেন তথ্য
                  </h4>

                  <div className="space-y-2 text-xs font-bold divide-y divide-slate-100">
                    
                    {/* Row 1: Order ID */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-500">লেনদেন আইডি</span>
                      <span className="font-mono text-slate-900 font-black">{selectedHistoryOrder.id}</span>
                    </div>

                    {/* Row 2: Operator */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-500">অপারেটর</span>
                      <div className="flex items-center gap-1.5 font-black text-slate-900">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white shrink-0 ${
                          selectedHistoryOrder.operator === 'GP' ? 'bg-emerald-600' :
                          selectedHistoryOrder.operator === 'Airtel' ? 'bg-rose-600' :
                          selectedHistoryOrder.operator === 'Robi' ? 'bg-amber-600' :
                          selectedHistoryOrder.operator === 'Teletalk' ? 'bg-sky-600' : 'bg-orange-500'
                        }`}>
                          {selectedHistoryOrder.operator === 'GP' && <GPLogo size={14} logoUrl={settings?.gpLogoUrl} />}
                          {selectedHistoryOrder.operator === 'Airtel' && <AirtelLogo size={14} logoUrl={settings?.airtelLogoUrl} />}
                          {selectedHistoryOrder.operator === 'Robi' && <RobiLogo size={14} logoUrl={settings?.robiLogoUrl} />}
                          {selectedHistoryOrder.operator === 'Teletalk' && <TeletalkLogo size={14} logoUrl={settings?.teletalkLogoUrl} />}
                          {selectedHistoryOrder.operator === 'Banglalink' && <BanglalinkLogo size={14} logoUrl={settings?.blLogoUrl} />}
                        </div>
                        <span>{getBnOperatorName(selectedHistoryOrder.operator)}</span>
                      </div>
                    </div>

                    {/* Row 3: Package Title */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-500">সেবা</span>
                      <span className="text-slate-900 font-black text-right max-w-[190px] truncate">{selectedHistoryOrder.packTitle}</span>
                    </div>

                    {/* Row 4: Phone Number */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-500">মোবাইল নম্বর</span>
                      <span className="font-mono text-slate-900 font-black">{selectedHistoryOrder.customerPhone}</span>
                    </div>

                    {/* Row 5: Price */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-500">মূল্য</span>
                      <span className="text-slate-900 font-black">৳{formatBnNumber(selectedHistoryOrder.price)}</span>
                    </div>

                    {/* Row 6: Fee */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-500">চার্জ</span>
                      <span className="text-slate-900 font-black">৳০</span>
                    </div>

                    {/* Row 7: Total Amount */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-900 font-black">মোট পরিমাণ</span>
                      <span className="text-base font-black text-emerald-600">৳{formatBnNumber(selectedHistoryOrder.price)}</span>
                    </div>

                    {/* Row 8: Payment Method */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-500">পেমেন্ট মেথড</span>
                      <span className="text-slate-900 font-black">
                        {selectedHistoryOrder.paymentMethod === 'wallet' ? 'ব্যালেন্স' : selectedHistoryOrder.paymentMethod || 'ব্যালেন্স'}
                      </span>
                    </div>

                    {/* Row 9: Date & Time */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-500">তারিখ ও সময়</span>
                      <span className="text-slate-900 font-bold text-[11px]">{formatBnDate(selectedHistoryOrder.createdAt)}</span>
                    </div>

                    {/* Row 10: Status */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-500">স্ট্যাটাস</span>
                      {selectedHistoryOrder.status === 'completed' || selectedHistoryOrder.status === 'approved' ? (
                        <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-150 text-emerald-700 text-[11px] font-black rounded-full flex items-center gap-1">
                          <span>সফল</span>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                      ) : selectedHistoryOrder.status === 'pending' || selectedHistoryOrder.status === 'processing' ? (
                        <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-150 text-amber-700 text-[11px] font-black rounded-full flex items-center gap-1">
                          <span>পেন্ডিং</span>
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-rose-50 border border-rose-150 text-rose-700 text-[11px] font-black rounded-full flex items-center gap-1">
                          <span>ব্যর্থ</span>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        </span>
                      )}
                    </div>

                    {/* Row 11: Rejection Reason if available */}
                    {selectedHistoryOrder.rejectReason && (
                      <div className="pt-2">
                        <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 space-y-0.5">
                          <span className="font-extrabold text-[11px] text-rose-700 block">❌ ব্যর্থ হওয়ার কারণ:</span>
                          <p className="font-bold text-xs leading-relaxed">{selectedHistoryOrder.rejectReason}</p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 shrink-0">
                <button
                  onClick={() => setSelectedHistoryOrder(null)}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl cursor-pointer border-none transition-all"
                >
                  বন্ধ করুন
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div> {/* END OF SMARTPHONE MOBILE CONTAINER FRAME */}

    </div>
  );
}

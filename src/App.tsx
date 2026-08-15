import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { AppTab, DataPack, Order, Operator, PackCategory, SiteSettings, WifiPackage } from './types';
import { INITIAL_PACKS } from './data';
import { initOneSignal, triggerPaymentNotification, triggerRechargeNotification } from './lib/onesignalService';
import NotificationPromptModal from './components/NotificationPromptModal';
import Header from './components/Header';
import Toast, { ToastType } from './components/Toast';
import PackCard from './components/PackCard';
import PopularPackCard from './components/PopularPackCard';
import HeroPackCard from './components/HeroPackCard';
import CustomBuilder from './components/CustomBuilder';
import CheckoutModal from './components/CheckoutModal';
import OrderTracker from './components/OrderTracker';
import AdminPanel from './components/AdminPanel';
import BannerCarousel from './components/BannerCarousel';
import PhoneSimulator from './components/PhoneSimulator';
import { GPLogo, RobiLogo, BanglalinkLogo, AirtelLogo, TeletalkLogo } from './components/OperatorLogos';
import LiveCoverageMap from './components/LiveCoverageMap';
import ScrollRevealSection from './components/ScrollRevealSection';
import ScrollRevealCard from './components/ScrollRevealCard';
import confetti from 'canvas-confetti';

// Icons for App UI
import { 
  Wifi, Phone, Layers, ShieldCheck, HelpCircle, Landmark, Search, 
  ChevronRight, Sparkles, Star, Flame, BookmarkCheck, Users, Clock,
  Check, Play, RotateCcw, AlertCircle, RefreshCw, MapPin, Shield, ThumbsUp, Send, Smartphone, X, Maximize, Minimize, Zap,
  ShoppingCart, Percent, Bot, ChevronDown, MessageCircle, CheckCircle, ArrowRight
} from 'lucide-react';

// Firestore DB imports
import { db, auth } from './lib/firebase';
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, onSnapshot, getDoc, query, orderBy, limit
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AuthModal from './components/AuthModal';
import PrivacyPolicy from './components/PrivacyPolicy';
import SoftwareDashboard from './components/SoftwareDashboard';

// 5 Specific Hero Packages shown in the Client Screenshot
const HERO_PACKS = [
  {
    id: 'hero-1',
    title: 'Daily Pack',
    data: '১ GB',
    price: 15,
    validity: 'মেয়াদ: ১ দিন',
    bullets: ['সকল নেটওয়ার্কে ব্যবহারযোগ্য', '24/7 Valid'],
    btnColor: 'bg-slate-900 hover:bg-[#15803d]',
    accentText: 'text-slate-900',
    badge: 'Daily Pack',
    themeColor: 'emerald',
    packData: {
      id: 'gp-daily-1',
      title: 'Daily Pack ১ GB ইন্টারনেট',
      category: 'internet' as const,
      operator: 'GP' as const,
      data: '1 GB',
      minutes: 0,
      sms: 0,
      validity: '1 Day',
      regularPrice: 20,
      salePrice: 15,
      cashback: 0
    }
  },
  {
    id: 'hero-2',
    title: '3 Day Pack',
    data: '৫ GB',
    price: 49,
    validity: 'মেয়াদ: ৩ দিন',
    bullets: ['সকল নেটওয়ার্কে ব্যবহারযোগ্য', '24/7 Valid'],
    btnColor: 'bg-blue-600 hover:bg-blue-700',
    accentText: 'text-blue-600',
    badge: '3 Day Pack',
    themeColor: 'blue',
    packData: {
      id: 'robi-3day-5',
      title: '3 Day Pack ৫ GB ইন্টারনেট',
      category: 'internet' as const,
      operator: 'Robi' as const,
      data: '5 GB',
      minutes: 0,
      sms: 0,
      validity: '3 Days',
      regularPrice: 60,
      salePrice: 49,
      cashback: 0
    }
  },
  {
    id: 'hero-3',
    title: '7 Day Pack',
    data: '১৫ GB',
    price: 99,
    validity: 'মেয়াদ: ৭ দিন',
    bullets: ['সকল নেটওয়ার্কে ব্যবহারযোগ্য', '24/7 Valid'],
    isPopular: true,
    btnColor: 'bg-purple-600 hover:bg-purple-700',
    accentText: 'text-purple-600',
    badge: '7 Day Pack',
    themeColor: 'purple',
    packData: {
      id: 'airtel-7day-15',
      title: '7 Day Pack ১৫ GB ইন্টারনেট',
      category: 'internet' as const,
      operator: 'Airtel' as const,
      data: '15 GB',
      minutes: 0,
      sms: 0,
      validity: '7 Days',
      regularPrice: 120,
      salePrice: 99,
      cashback: 5
    }
  },
  {
    id: 'hero-4',
    title: '15 Day Pack',
    data: '৩০ GB',
    price: 179,
    validity: 'মেয়াদ: ১৬ দিন',
    bullets: ['সকল নেটওয়ার্কে ব্যবহারযোগ্য', '24/7 Valid'],
    btnColor: 'bg-amber-600 hover:bg-amber-700',
    accentText: 'text-amber-600',
    badge: '15 Day Pack',
    themeColor: 'amber',
    packData: {
      id: 'bl-15day-30',
      title: '15 Day Pack ৩০ GB ইন্টারনেট',
      category: 'internet' as const,
      operator: 'Banglalink' as const,
      data: '30 GB',
      minutes: 0,
      sms: 0,
      validity: '16 Days',
      regularPrice: 220,
      salePrice: 179,
      cashback: 10
    }
  },
  {
    id: 'hero-5',
    title: 'Monthly Pack',
    data: '৬০ GB',
    price: 299,
    validity: 'মেয়াদ: ৩০ দিন',
    bullets: ['সকল নেটওয়ার্কে ব্যবহারযোগ্য', '24/7 Valid'],
    btnColor: 'bg-rose-600 hover:bg-rose-700',
    accentText: 'text-rose-600',
    badge: 'Monthly Pack',
    themeColor: 'rose',
    packData: {
      id: 'gp-monthly-60',
      title: 'Monthly Pack ৬০ GB ইন্টারনেট',
      category: 'internet' as const,
      operator: 'GP' as const,
      data: '60 GB',
      minutes: 0,
      sms: 0,
      validity: '30 Days',
      regularPrice: 380,
      salePrice: 299,
      cashback: 15
    }
  }
];

// Home WiFi Connection Packages
const DEFAULT_WIFI_PACKAGES: WifiPackage[] = [
  {
    id: 'wifi_default_1',
    name: 'Starter Package',
    speed: '10 Mbps',
    price: '৳ ৫০০ / মাস',
    features: ['আনলিমিটেড ডাটা', 'ফ্রি ফাইবার রাউটার সংযোগ', '১টি ডিভাইস অপ্টিমাইজড', '২৪/৭ কাস্টমার সাপোর্ট'],
    badge: 'বেসিক হোম ইউজার'
  },
  {
    id: 'wifi_default_2',
    name: 'Standard Package',
    speed: '25 Mbps',
    price: '৳ ৮০০ / মাস',
    features: ['আনলিমিটেড ডাটা (Buffer-Free)', 'ফ্রি অপটিক্যাল ফাইবার সংযোগ', '৪টি ডিভাইস ফুল স্পিড', '২৪/৭ কাস্টমার সাপোর্ট', 'ফ্রি ক্যাবল কানেকশন'],
    badge: 'সর্বাধিক জনপ্রিয়',
    popular: true
  },
  {
    id: 'wifi_default_3',
    name: 'Premium Gamer Package',
    speed: '50 Mbps',
    price: '৳ ১,২০০ / মাস',
    features: ['আনলিমিটেড ডাটা (Ultra-Low Ping)', 'ডুয়াল-ব্যান্ড রাউটার সাপোর্ট', 'আনলিমিটেড ডিভাইস', 'রিয়েল-টাইম গেমিং অপ্টিমাইজেশন', '২৪/৭ ডেডিকেটেড ম্যানেজার'],
    badge: 'হাই-স্পিড গেমিং'
  },
  {
    id: 'wifi_default_4',
    name: 'Enterprise Corporate',
    speed: '100 Mbps',
    price: '৳ ২,০০০ / মাস',
    features: ['ডেডিকেটেড ব্যান্ডউইথ', 'স্ট্যাটিক আইপি এড্রেস', 'সার্ভার হোস্টিং রেডি', '৪ ঘণ্টা SLA ব্যাকআপ স্পিড', '২৪/৭ অন-সাইট ইঞ্জিনিয়ার সাপোর্ট'],
    badge: 'বিজনেস সলিউশন'
  }
];

const DEFAULT_SETTINGS: SiteSettings = {
  supportPhone: '01618599077',
  supportEmail: 'rajibulislamfahim8610@gmail.com',
  supportAddress: 'ফাহিম টেলিকম সেন্টার, মিরপুর ১০, ঢাকা, বাংলাদেশ।',
  supportWebsite: 'https://fahiminternet.com',
  privacyPolicyUrl: 'https://fahiminternet.com/privacy-policy',
  termsConditionsUrl: 'https://fahiminternet.com/terms-conditions',
  appVersion: 'v2.5.0 Premium',
  developerName: 'Rajibul Islam',
  developerEmail: 'rajibulislamfahim8610@gmail.com',
  disclaimerText: 'This app is not affiliated with any telecom operator. We act as a third-party digital offer distribution platform. All services are subject to operator availability and terms.',
  bkashNumber: '01618599077',
  nagadNumber: '01624228476',
  rocketNumber: '01624228476',
  upayNumber: '01618599077',
  cellfinNumber: '01624228476',
  marqueeText: 'ফাহিম ইন্টারনেট-এ স্বাগতম! আমাদের নতুন সুপারফাস্ট কাস্টম অফার ও ডাবল ক্যাশব্যাক ভাউচারগুলো চেক করুন। ১ মিনিটেই ১০০% রিচার্জ গ্যারান্টি!',
  bannerImages: [],
  promoBanners: [],
  topBannerImage: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop',
  offerBanners: [],
  apkUrl: 'https://github.com/free122055/fahim-internet-apk/releases/download/v1.0/fahim-internet.apk',
  adminNumber: '01618599077',
  adminPassword: '122055',
  logoUrl: '',
  gpLogoUrl: '',
  robiLogoUrl: '',
  blLogoUrl: '',
  airtelLogoUrl: '',
  teletalkLogoUrl: '',
  ziniRegisteredDomain: '',
  fcmServerKey: '',
  fcmVapidKey: '',
  bkashLogoUrl: '',
  nagadLogoUrl: '',
  rocketLogoUrl: '',
  upayLogoUrl: '',
  cellfinLogoUrl: '',
  bankingLogoUrl: ''
};

export default function App() {
  const [renderError, setRenderError] = useState(false);

  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    try {
      if (window.location.pathname === '/privacy-policy') return 'privacy';
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'admin' || params.get('admin') === 'true' || params.get('panel') === 'admin') {
        return 'admin';
      }
    } catch (e) {}
    return 'homepage';
  });

  const [navigationStack, setNavigationStack] = useState<AppTab[]>(['homepage']);

  // Android-like back navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (navigationStack.length > 1) {
        event.preventDefault();
        const newStack = [...navigationStack];
        newStack.pop();
        const previousTab = newStack[newStack.length - 1];
        setNavigationStack(newStack);
        setActiveTab(previousTab);
      } else {
        // At root, show exit confirmation
        if (confirm("আপনি কি অ্যাপ থেকে বের হয়ে যেতে চান?")) {
          // This is technically not possible in a standard browser environment
          // but we can close the window or handle it as per requirement.
          window.close();
        } else {
          // Push state back to prevent exit
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigationStack]);

  const navigateTo = (tab: AppTab) => {
    if (tab === activeTab) return;
    
    // Add to stack and history
    window.history.pushState({ tab }, '', window.location.pathname + `?page=${tab}`);
    setNavigationStack(prev => [...prev, tab]);
    setActiveTab(tab);
  };

  const handleBack = () => {
    if (navigationStack.length > 1) {
      const newStack = [...navigationStack];
      newStack.pop();
      const previousTab = newStack[newStack.length - 1];
      setNavigationStack(newStack);
      setActiveTab(previousTab);
      window.history.back();
    } else {
      // At root, show exit confirmation
      if (confirm("আপনি কি অ্যাপ থেকে বের হয়ে যেতে চান?")) {
        window.close();
      }
    }
  };
  const [packs, setPacks] = useState<DataPack[]>(INITIAL_PACKS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type, isVisible: true });
  };
  const isAdminRef = useRef(false);
  const landingScrollContainerRef = useRef<HTMLDivElement>(null);

  // ZiniPay automatic verification states
  const [ziniVerifying, setZiniVerifying] = useState(false);
  const [ziniStatusMessage, setZiniStatusMessage] = useState('');
  const [ziniSuccessOrder, setZiniSuccessOrder] = useState<any | null>(null);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);

  // Lazy tutorial video loading state
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  useEffect(() => {
    isAdminRef.current = isAdmin;
  }, [isAdmin]);

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [wifiPacks, setWifiPacks] = useState<WifiPackage[]>([]);

  // User Authentication state
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');

  // Initialize OneSignal Push Notifications
  useEffect(() => {
    const userPhone = currentUser?.phone || currentUser?.uid || '';
    initOneSignal(userPhone);
  }, [currentUser]);

  // Realtime FCM / Firestore Notification Stream
  useEffect(() => {
    try {
      const q = query(
        collection(db, 'notifications'),
        orderBy('createdAt', 'desc'),
        limit(15)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            const userPhone = currentUser?.phone || '';
            const userUid = currentUser?.uid || '';
            const isForMe = !data.targetUser || data.targetUser === 'all' || data.targetUser === userPhone || data.targetUser === userUid;

            if (isForMe && data.title) {
              const notifTime = new Date(data.createdAt).getTime();
              // Alert for recent notifications within last 2 minutes
              if (!isNaN(notifTime) && Math.abs(Date.now() - notifTime) < 120000) {
                showToast(`🔔 ${data.title}: ${data.body || ''}`, 'info');
              }
            }
          }
        });
      }, (err) => {
        console.warn('Realtime notification listener warning:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Error attaching realtime notification listener:', e);
    }
  }, [currentUser]);

  // Notification Prompt Modal state
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default' && !sessionStorage.getItem('fcm_prompt_dismissed')) {
        const timer = setTimeout(() => {
          setShowNotifPrompt(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleCloseNotifPrompt = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fcm_prompt_dismissed', 'true');
    }
    setShowNotifPrompt(false);
  }, []);

  const handleCloseAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setAuthModalMessage('');
  }, []);

  const handleLoginSuccess = useCallback((isUserAdmin: boolean) => {
    // Force isAdmin update based on the flag passed from AuthModal
    setIsAdmin(isUserAdmin);
    
    // We still update local storage if user info is available, but prioritize the admin flag
    const localUserStr = localStorage.getItem('fahim_local_user');
    if (localUserStr) {
      try {
        const parsedLocalUser = JSON.parse(localUserStr);
        setCurrentUser({ ...parsedLocalUser, role: isUserAdmin ? 'admin' : parsedLocalUser.role });
        
        // Request OneSignal Subscription for logged in user
        if (parsedLocalUser.phone) {
          initOneSignal(parsedLocalUser.phone);
        }
      } catch (e) {
        console.error('Error parsing local user:', e);
      }
    }

    // Trigger Notification Popup Modal on login if permission not granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      sessionStorage.removeItem('fcm_prompt_dismissed');
      setTimeout(() => {
        setShowNotifPrompt(true);
      }, 500);
    }
  }, []);

  const handleSetActiveTab = (tab: 'homepage' | 'store' | 'builder' | 'tracking' | 'admin') => {
    if (tab === 'builder' || tab === 'tracking') {
      if (!currentUser) {
        setAuthModalMessage('⚠️ এই সার্ভিসটি ব্যবহার করতে হলে প্রথমে আপনাকে লগইন করতে হবে। একাউন্ট না থাকলে সহজেই ১ মিনিটে নতুন একাউন্ট খুলে নিন!');
        setAuthModalOpen(true);
        return;
      }
    }
    navigateTo(tab === 'store' ? 'homepage' : tab);
  };

  // Full Screen / Standalone tab tracking states
  const [isIframe, setIsIframe] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dynamic SEO Page Title & Meta Description update
  useEffect(() => {
    let title = 'FAHIM INTERNET - প্রিমিয়াম মাল্টি-সার্ভিস ডিজিটাল প্ল্যাটফর্ম';
    let description = 'FAHIM INTERNET-এ জিপি, রবি, এয়ারটেল ও বাংলালিংক ইন্টারনেট, মিনিট ও স্পেশাল ড্রাইভ অফার পান সবচেয়ে কম মূল্যে। দ্রুত ও ১০০% নিরাপদ রিচার্জ গ্যারান্টি!';
    
    switch (activeTab) {
      case 'homepage':
      case 'store':
        title = 'FAHIM INTERNET - সাশ্রয়ী এমবি, মিনিট ও বান্ডেল অফার কিনুন';
        description = 'FAHIM INTERNET-এ পান সবচেয়ে কম খরচে জিপি, রবি, এয়ারটেল ও বাংলালিংক ইন্টারনেট, মিনিট ও ধামাকা ড্রাইভ অফার। দ্রুত এবং ১০০% নিরাপদ রিচার্জ গ্যারান্টি!';
        break;
      case 'builder':
        title = 'অফার বিল্ডার - নিজের মত ইন্টারনেট ও মিনিট প্যাক তৈরি করুন | FAHIM INTERNET';
        description = 'FAHIM INTERNET কাস্টম অফার বিল্ডার দিয়ে আপনার নিজের বাজেট অনুযায়ী ইন্টারনেট ও মিনিট সিলেক্ট করে কাস্টম প্যাক তৈরি করুন এবং দ্রুত রিচার্জ করুন।';
        break;
      case 'tracking':
        title = 'অর্ডার ট্র্যাকিং - আপনার অফার ডেলিভারি স্ট্যাটাস চেক করুন | FAHIM INTERNET';
        description = 'FAHIM INTERNET-এ করা আপনার ইন্টারনেট বা মিনিট অফারের রিয়েল-টাইম ডেলিভারি স্ট্যাটাস এবং ট্র্যাকিং আইডি চেক করুন মুহূর্তেই।';
        break;
      case 'admin':
        title = 'এডমিন কন্ট্রোল প্যানেল | FAHIM INTERNET';
        description = 'FAHIM INTERNET এডমিন ড্যাশবোর্ড - নতুন অফার যোগ করুন, গ্রাহকের অর্ডার প্রসেস করুন এবং সাইট কনফিগারেশন আপডেট করুন।';
        break;
    }

    document.title = title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', description);
      document.head.appendChild(metaDesc);
    }

    // Update OpenGraph tags too for better social sharing
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    } else {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.setAttribute('content', title);
      document.head.appendChild(ogTitle);
    }
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    } else {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      ogDesc.setAttribute('content', description);
      document.head.appendChild(ogDesc);
    }

    // Dynamic Page-Specific Structured Data (JSON-LD) for Google Search
    const existingSchemaScript = document.getElementById('dynamic-page-schema');
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    let schemaData: any = null;
    if (activeTab === 'homepage' || activeTab === 'store') {
      schemaData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": "https://fahiminternet.com/#store",
        "url": "https://fahiminternet.com/",
        "name": "ইন্টারনেট ও মিনিট অফার স্টোর - FAHIM INTERNET",
        "description": "জিপি, রবি, বাংলালিংক এবং এয়ারটেল এর সকল স্পেশাল ডিল, ড্রাইভ প্যাক এবং রেগুলার প্যাক এক জায়গায় সবচেয়ে কম দামে কিনুন।",
        "isPartOf": {
          "@id": "https://fahiminternet.com/#website"
        }
      };
    } else if (activeTab === 'builder') {
      schemaData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://fahiminternet.com/#builder",
        "url": "https://fahiminternet.com/?page=builder",
        "name": "কাস্টম অফার বিল্ডার - নিজের মত প্যাক বানান | FAHIM INTERNET",
        "description": "FAHIM INTERNET কাস্টম অফার বিল্ডার ব্যবহার করে নিজের পছন্দমত ইন্টারনেট ও মিনিট নির্ধারণ করে স্পেশাল ডিসকাউন্টে প্যাক তৈরি করুন।",
        "isPartOf": {
          "@id": "https://fahiminternet.com/#website"
        }
      };
    } else if (activeTab === 'tracking') {
      schemaData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://fahiminternet.com/#tracking",
        "url": "https://fahiminternet.com/?page=tracking",
        "name": "অর্ডার ট্র্যাকিং সিস্টেম - FAHIM INTERNET",
        "description": "আপনার রিচার্জ অর্ডারের লাইভ ডেলিভারি স্ট্যাটাস ও ট্র্যাকিং হিস্ট্রি যেকোনো সময় ট্র্যাক করুন।",
        "isPartOf": {
          "@id": "https://fahiminternet.com/#website"
        }
      };
    }

    if (schemaData) {
      const script = document.createElement('script');
      script.id = 'dynamic-page-schema';
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schemaData);
      document.head.appendChild(script);
    }
  }, [activeTab]);

  useEffect(() => {
    setIsIframe(window.self !== window.top);
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = () => {
    if (window.self !== window.top) {
      // If nested inside an iframe (like AI Studio preview), open in a new tab for genuine standalone fullscreen
      window.open(window.location.href, '_blank');
    } else {
      // Standard browser Fullscreen API
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn(`Fullscreen activation failed: ${err.message}`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  // Typewriter effect states
  const typewriterPhrases = ["দ্রুততম ইন্টারনেট", "সবচেয়ে কম মূল্যে", "সুপার ফাস্ট স্পিডে", "১ মিনিটে ডেলিভারি!"];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeletingPhrase, setIsDeletingPhrase] = useState(false);

  useEffect(() => {
    const fullPhrase = typewriterPhrases[currentPhraseIndex];
    let delay = isDeletingPhrase ? 50 : 100;

    if (!isDeletingPhrase && typedText === fullPhrase) {
      delay = 1800;
    } else if (isDeletingPhrase && typedText === "") {
      delay = 300;
    }

    const timer = setTimeout(() => {
      if (!isDeletingPhrase) {
        if (typedText === fullPhrase) {
          setIsDeletingPhrase(true);
        } else {
          setTypedText(fullPhrase.substring(0, typedText.length + 1));
        }
      } else {
        if (typedText === "") {
          setIsDeletingPhrase(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % typewriterPhrases.length);
        } else {
          setTypedText(fullPhrase.substring(0, typedText.length - 1));
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [typedText, isDeletingPhrase, currentPhraseIndex]);

  // Filters State for the Custom Offer Search Engine
  const [showAllPacks, setShowAllPacks] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<'All' | Operator>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | PackCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Favorites tracking states (persisted via localStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fahim_favorites') || '[]');
    } catch {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // New Modals states
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // AI Assistant messages state
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'আসসালামু আলাইকুম! ফাহিম ইন্টারনেট এআই অ্যাসিস্ট্যান্টে আপনাদের স্বাগতম। 😊\n\nআমি আপনাকে সেরা অফার বা প্যাকেজ খুঁজতে, ওয়াইফাই লাইনের বুকিং ও স্পিড টেস্ট সহ যেকোনো বিষয়ে সাহায্য করতে পারি। আপনার প্রশ্নটি লিখুন অথবা নিচের কুইক সাজেশন থেকে যেকোনো একটি চাপুন!'
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiIsTyping, setAiIsTyping] = useState(false);

  const handleSendAiMessage = (userText: string) => {
    if (!userText.trim()) return;
    
    const newMessages = [...aiMessages, { sender: 'user' as const, text: userText }];
    setAiMessages(newMessages);
    setAiInput('');
    setAiIsTyping(true);

    setTimeout(() => {
      let reply = 'দুঃখিত, আমি আপনার প্রশ্নটি ঠিক বুঝতে পারিনি। দয়া করে ফাহিম ইন্টারনেটের সাথে সরাসরি হোয়াটসঅ্যাপে যোগাযোগ করতে পারেন (হেল্পলাইন: 01618599077)। আমরা আপনাকে দ্রুত সাহায্য করব!';
      const txt = userText.toLowerCase();

      if (txt.includes('হ্যালো') || txt.includes('hi') || txt.includes('hello') || txt.includes('আসসালামু') || txt.includes('সালাম')) {
        reply = 'ওয়ালাইকুম আসসালাম! আশা করি ভালো আছেন। আজ আপনাকে কিভাবে সাহায্য করতে পারি? সেরা অফার দেখতে "অফার" লিখুন!';
      } else if (txt.includes('অফার') || txt.includes('প্যাকেজ') || txt.includes('internet') || txt.includes('package') || txt.includes('প্যাক')) {
        reply = 'ফাহিম ইন্টারনেটে আপনি পাচ্ছেন GP, Robi, Airtel ও Banglalink এর আকর্ষণীয় মেগাবایت ও মিনিট অফারসমূহ।\n\n• ৫% ক্যাশব্যাক অফার\n• কাস্টম অফার বিল্ডার অপশন\n\nআপনি হোমপেজে গিয়ে অপারেটর বাটনে ক্লিক করে সব সরাসরি চেক করতে পারবেন!';
      } else if (txt.includes('ওয়াইফাই') || txt.includes('wifi') || txt.includes('লাইন') || txt.includes('ব্রডব্যান্ড')) {
        reply = 'ফাহিম ইন্টারনেট ব্রডব্যান্ড লাইনে পাচ্ছেন সেরা গতির বাফার-ফ্রি ইন্টারনেট!\n\n• ১০ এমবিপিএস - ৳৫০০/মাস\n• ২০ এমবিপিএস - ৳৮০০/মাস\n• ৩০ এমবিপিএস - ৳১০০০/মাস\n\nবুকিং দিতে মেনু থেকে WiFi Packages-এ ক্লিক করে আপনার নাম, মোবাইল ও ঠিকানা লিখে বুক করতে পারেন।';
      } else if (txt.includes('পেমেন্ট') || txt.includes('payment') || txt.includes('বিকাশ') || txt.includes('রকেট') || txt.includes('নগদ')) {
        reply = 'আমাদের এখানে পেমেন্ট করা সম্পূর্ণ নিরাপদ ও স্বয়ংক্রিয়। আপনি বিকাশ, রকেট, নগদ অথবা যেকোনো মোবাইল ব্যাংকিং এর মাধ্যমে নিরাপদে পেমেন্ট করতে পারবেন। অফারটি সিলেক্ট করে আপনার নাম্বার দিয়ে পেমেন্ট করুন!';
      } else if (txt.includes('অর্ডার') || txt.includes('track') || txt.includes('হিস্ট্রি') || txt.includes('আইডি')) {
        reply = 'অর্ডার ট্র্যাক করতে উপরের ডান পাশে "Track Order" ট্যাবটিতে ক্লিক করুন এবং আপনার ট্র্যাকিং আইডি প্রদান করে সহজেই লাইভ আপডেট দেখে নিন!';
      }

      setAiMessages((prev) => [...prev, { sender: 'bot' as const, text: reply }]);
      setAiIsTyping(false);
    }, 800);
  };

  // Helper to toggle a package favorite status
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('fahim_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Quick buy states
  const [quickBuyMobile, setQuickBuyMobile] = useState('');
  const [quickBuyOperator, setQuickBuyOperator] = useState<Operator>('GP');
  const [quickBuyPackageId, setQuickBuyPackageId] = useState('');

  // Modals and interactive toggles
  const [checkoutPack, setCheckoutPack] = useState<DataPack | null>(null);
  const [wifiModalOpen, setWifiModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Speedometer Test States
  const [speedVal, setSpeedVal] = useState(0.0);
  const [isTesting, setIsTesting] = useState(false);
  const [pingVal, setPingVal] = useState(12);
  const [jitterVal, setJitterVal] = useState(2);
  const [lossVal, setLossVal] = useState(0);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    let unsubscribeUserDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 1. Initial set from Auth
        setCurrentUser(user);

        // 2. Setup real-time listener for Firestore User Doc
        if (unsubscribeUserDoc) unsubscribeUserDoc();
        unsubscribeUserDoc = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();
            // Merge Auth user with Firestore user data
            setCurrentUser({
              ...user,
              ...userData
            });
            
            if (userData.role === 'admin' || user.email === 'free122055@gmail.com') {
              setIsAdmin(true);
            }
          }
        }, (error) => {
          console.warn('Error listening to user doc:', error);
        });

        // 3. Initial checks based on email
        const adminPhones = ['01618599077', '01764346995'];
        console.log('DEBUG: User logged in. Email:', user.email);
        
        let isUserAdmin = user.email === '01618599077@fahim-internet.com' || 
                          user.email === '01764346995@fahim-internet.com' || 
                          user.email === 'free122055@gmail.com' ||
                          (user.email && user.email.split('@')[0] && adminPhones.includes(user.email.split('@')[0]));
        
        console.log('DEBUG: isUserAdmin check result:', isUserAdmin);
        
        if (isUserAdmin) setIsAdmin(true);

      } else {
        if (unsubscribeUserDoc) unsubscribeUserDoc();
        unsubscribeUserDoc = null;
        
        const localUserStr = localStorage.getItem('fahim_local_user');
        if (localUserStr) {
          try {
            const parsedLocalUser = JSON.parse(localUserStr);
            setCurrentUser(parsedLocalUser);
            setIsAdmin(parsedLocalUser.role === 'admin' || parsedLocalUser.uid === 'admin_local_bypass');
          } catch (e) {
            setCurrentUser(null);
            setIsAdmin(false);
          }
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
      }
    });
    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, []);

  // Handle automatic ZiniPay callback and verification
  useEffect(() => {
    const handleZiniCallback = async () => {
      // Robust query parameter extraction (handles both ?search and #hash?params)
      const getParam = (key: string) => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has(key)) return searchParams.get(key);
        
        // Fallback to hash parameters (common in some redirects)
        const hash = window.location.hash;
        if (hash.includes('?')) {
          const hashQuery = new URLSearchParams(hash.split('?')[1]);
          if (hashQuery.has(key)) return hashQuery.get(key);
        }
        return null;
      };

      const ziniStatus = getParam('zinistatus');
      const invoiceId = getParam('invoiceId');

      if (!ziniStatus || !invoiceId) return;

      // Clean the URL query parameters right away so user doesn't re-trigger on refresh
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: cleanUrl }, '', cleanUrl);

      if (ziniStatus === 'cancel') {
        alert('❌ পেমেন্ট বাতিল করা হয়েছে! দয়া করে আবার চেষ্টা করুন বা ম্যানুয়াল পেমেন্ট সম্পন্ন করুন।');
        return;
      }

      if (ziniStatus === 'success') {
        setZiniVerifying(true);
        setZiniStatusMessage('পেমেন্ট স্বয়ংক্রিয়ভাবে যাচাই করা হচ্ছে...');

        // Attempt to get token if user is logged in, but proceed regardless
        let token = '';
        try {
          const activeUser = auth.currentUser;
          if (activeUser) {
            token = await activeUser.getIdToken(true);
          }
        } catch (e) {
          console.warn('Could not get auth token for verification:', e);
        }

        try {
          const response = await fetch('/api/zinipay/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ invoiceId })
          });

          if (!response.ok) {
            throw new Error('সার্ভার থেকে কোনো রেসপন্স পাওয়া যায়নি।');
          }

          const data = await response.json();
          if (data.success && data.verified) {
            // Get the pending order details from client-side Firestore
            const pendingRef = doc(db, 'pending_zinipay_orders', invoiceId);
            const pendingSnap = await getDoc(pendingRef);
            
            let pendingOrder: any = null;
            if (pendingSnap.exists()) {
              pendingOrder = pendingSnap.data();
            } else {
              try {
                const localStr = localStorage.getItem(`pending_zinipay_${invoiceId}`) || localStorage.getItem('pending_zinipay_order');
                if (localStr) {
                  pendingOrder = JSON.parse(localStr);
                }
              } catch (e) {
                console.warn('Error reading local pending order:', e);
              }
            }

            let orderId = 'FI-' + Math.floor(100000 + Math.random() * 900000);
            let successMsg = 'পেমেন্ট সফলভাবে যাচাই করা হয়েছে এবং আপনার অর্ডারটি এপ্রুভ করা হয়েছে!';
            
            if (pendingOrder) {
              const finalOrder: Order = {
                id: orderId,
                customerPhone: pendingOrder.customerPhone || '',
                operator: pendingOrder.operator || '',
                packId: pendingOrder.packId || '',
                packTitle: pendingOrder.packTitle || '',
                price: pendingOrder.amount || data.amount || 0,
                paymentMethod: pendingOrder.paymentMethod || 'zinipay',
                paymentPhone: 'ZiniPay Auto Paid',
                transactionId: invoiceId,
                status: 'approved', // Automatically approved because online payment was verified successfully!
                createdAt: new Date().toISOString(),
                division: pendingOrder.division || '',
                userId: pendingOrder.userId || auth.currentUser?.uid || null
              };

              // Create the final order in Firestore
              try {
                await setDoc(doc(db, 'orders', orderId), finalOrder);
                // Trigger Payment Push Notification
                triggerPaymentNotification(pendingOrder.customerPhone || pendingOrder.userId || 'all');
              } catch (fsErr) {
                console.warn('Firestore setDoc final order failed due to Quota/Error:', fsErr);
                setIsQuotaExceeded(true);
              }

              // Always save to localStorage immediately as a foolproof fallback
              try {
                const localOrders = localStorage.getItem('fahim_orders');
                let parsed: Order[] = [];
                if (localOrders) {
                  try {
                    parsed = JSON.parse(localOrders);
                  } catch (e) {
                    parsed = [];
                  }
                }
                if (!parsed.some(o => o.id === finalOrder.id)) {
                  parsed.unshift(finalOrder);
                  localStorage.setItem('fahim_orders', JSON.stringify(parsed));
                  setOrders(parsed);
                }
              } catch (e) {
                console.warn('Error saving final order to localStorage:', e);
              }

              // Auto trigger Success TopUp API for Instant Recharge
              if (pendingOrder.customerPhone) {
                console.log(`⚡ Auto-triggering Success TopUp API for order ${orderId} to ${pendingOrder.customerPhone}...`);
                fetch('/api/recharge', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderId: orderId,
                    phone: pendingOrder.customerPhone,
                    amount: pendingOrder.amount || data.amount || 0,
                    operator: pendingOrder.operator || 'GP',
                    rechargeType: pendingOrder.rechargeType || 'flexiload'
                  })
                })
                .then(res => res.json())
                .then(rechargeRes => {
                  console.log('⚡ Instant TopUp API Response:', rechargeRes);
                  if (rechargeRes.success) {
                    // Trigger Recharge Push Notification
                    triggerRechargeNotification(pendingOrder.customerPhone || pendingOrder.userId || 'all');
                    try {
                      setDoc(doc(db, 'orders', orderId), {
                        status: 'completed',
                        apiResponseStatus: 'SUCCESS',
                        apiTransactionId: rechargeRes.apiTransactionId || `TXN-${Date.now()}`
                      }, { merge: true }).catch(err => console.warn('Firestore update order status error:', err));
                    } catch {}

                    // Update local storage order list to status completed too
                    try {
                      const localOrders = localStorage.getItem('fahim_orders');
                      if (localOrders) {
                        const parsed: Order[] = JSON.parse(localOrders);
                        const updated = parsed.map(o => o.id === orderId ? { ...o, status: 'completed' as const, apiResponseStatus: 'SUCCESS', apiTransactionId: rechargeRes.apiTransactionId } : o);
                        localStorage.setItem('fahim_orders', JSON.stringify(updated));
                        setOrders(updated);
                      }
                    } catch {}
                  }
                })
                .catch(err => console.warn('Instant TopUp API call error:', err));
              }

              // Create a transaction record in Firestore
              try {
                const txId = 'TX-' + Math.floor(100000 + Math.random() * 900000);
                await setDoc(doc(db, 'transactions', txId), {
                  id: txId,
                  userId: pendingOrder.userId || auth.currentUser?.uid || 'guest',
                  amount: pendingOrder.amount || data.amount || 0,
                  type: 'payment',
                  paymentMethod: pendingOrder.paymentMethod || 'zinipay',
                  status: 'completed',
                  createdAt: new Date().toISOString(),
                  description: `ZiniPay Payment Approved for: ${pendingOrder.packTitle || 'Drive Pack'}`,
                  transactionId: invoiceId
                });
              } catch (fsErr) {
                console.warn('Firestore setDoc tx failed due to Quota/Error:', fsErr);
              }

              // Delete the pending order from Firestore and localStorage
              try {
                await deleteDoc(pendingRef);
              } catch {}
              try {
                localStorage.removeItem(`pending_zinipay_${invoiceId}`);
                localStorage.removeItem('pending_zinipay_order');
              } catch {}
            } else {
              // Fallback: If pending order doesn't exist, create order with verified amount
              console.log('Pending order document not found, creating fallback order.');
              const fallbackOrder: Order = {
                id: orderId,
                customerPhone: '01700000000',
                operator: 'GP',
                packId: 'fallback',
                packTitle: 'Drive Pack (Auto Verified)',
                price: data.amount || 100,
                paymentMethod: 'zinipay',
                paymentPhone: 'ZiniPay Auto Paid',
                transactionId: invoiceId,
                status: 'approved',
                createdAt: new Date().toISOString(),
                division: 'ঢাকা (Dhaka)',
                userId: auth.currentUser?.uid || null
              };
              
              try {
                await setDoc(doc(db, 'orders', orderId), fallbackOrder);
              } catch (fsErr) {
                console.warn('Firestore setDoc fallback order failed due to Quota/Error:', fsErr);
                setIsQuotaExceeded(true);
              }

              try {
                const localOrders = localStorage.getItem('fahim_orders');
                let parsed: Order[] = [];
                if (localOrders) {
                  try {
                    parsed = JSON.parse(localOrders);
                  } catch (e) {
                    parsed = [];
                  }
                }
                parsed.unshift(fallbackOrder);
                localStorage.setItem('fahim_orders', JSON.stringify(parsed));
                setOrders(parsed);
              } catch (e) {
                console.warn('Error saving fallback order to localStorage:', e);
              }

              successMsg = 'পেমেন্ট সফলভাবে যাচাই করা হয়েছে এবং অর্ডার রেকর্ড করা হয়েছে!';
            }

            setZiniStatusMessage('✅ ' + successMsg);
            setZiniSuccessOrder({
              orderId: orderId,
              message: successMsg
            });

            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 }
            });
          } else {
            throw new Error(data.message || 'পেমেন্ট সম্পন্ন হয়নি বা পেন্ডিং রয়েছে।');
          }
        } catch (err: any) {
          console.error('ZiniPay automatic verify error:', err);
          setZiniStatusMessage(`❌ পেমেন্ট ভেরিফিকেশন ব্যর্থ হয়েছে!\nকারণ: ${err.message || String(err)}`);
          alert(`❌ পেমেন্ট ভেরিফিকেশন ব্যর্থ হয়েছে!\nকারণ: ${err.message || String(err)}\n\nযদি আপনার অ্যাকাউন্ট থেকে টাকা কেটে নেওয়া হয়ে থাকে, অনুগ্রহ করে ট্রানজেকশন আইডি সহ অ্যাডমিনের সাথে যোগাযোগ করুন।`);
        }
      }
    };

    handleZiniCallback().catch(err => console.warn('ZiniPay callback error:', err));
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('fahim_local_user');
      await signOut(auth);
      setCurrentUser(null);
      setIsAdmin(false);
      navigateTo('homepage');
      showToast('🔒 সফলভাবে লগআউট করা হয়েছে!', 'success');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const handleInitiatePurchase = (packData: DataPack) => {
    if (!currentUser) {
      setAuthModalMessage('⚠️ এমবি বা অফার ক্রয় করতে হলে প্রথমে আপনাকে লগইন করতে হবে। একাউন্ট না থাকলে সহজেই ১ মিনিটে নতুন একাউন্ট খুলে নিন!');
      setAuthModalOpen(true);
      return;
    }

    setCheckoutPack(packData);
  };

  const handleSubmitOrder = async (newOrder: Order) => {
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
      const updated = [newOrder, ...orders];
      setOrders(updated);
      localStorage.setItem('fahim_orders', JSON.stringify(updated));
    } catch (e: any) {
      console.error('Firestore create order error:', e);
      const updated = [newOrder, ...orders];
      setOrders(updated);
      localStorage.setItem('fahim_orders', JSON.stringify(updated));
    }
  };

  // Auto speedometer animation on load
  useEffect(() => {
    runSpeedTest();
  }, []);

  // Listen to custom header navigation events to filter categories
  useEffect(() => {
    const handleSetCategory = (e: Event) => {
      const category = (e as CustomEvent).detail;
      if (category) {
        setSelectedCategory(category);
        setSelectedOperator('All');
        const el = document.getElementById('mb-packages');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const handleProfileUpdated = (e: Event) => {
      const updatedUser = (e as CustomEvent).detail;
      if (updatedUser) {
        setCurrentUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
      }
    };

    window.addEventListener('setCategoryFilter', handleSetCategory);
    window.addEventListener('userProfileUpdated', handleProfileUpdated);
    return () => {
      window.removeEventListener('setCategoryFilter', handleSetCategory);
      window.removeEventListener('userProfileUpdated', handleProfileUpdated);
    };
  }, []);

  const runSpeedTest = () => {
    if (isTesting) return;
    setIsTesting(true);
    setSpeedVal(0.0);
    setPingVal(Math.floor(Math.random() * 8) + 8);
    setJitterVal(Math.floor(Math.random() * 3) + 1);
    setLossVal(0);

    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 8;
      if (current >= 45.6) {
        setSpeedVal(45.6);
        setIsTesting(false);
        clearInterval(interval);
      } else {
        setSpeedVal(parseFloat(current.toFixed(1)));
      }
    }, 80);
  };

  const handleLoadTutorialVideo = async () => {
    if (isVideoLoading || (settings.tutorialVideoUrl && settings.tutorialVideoUrl !== 'lazy' && settings.tutorialVideoUrl !== 'chunked')) return;
    setIsVideoLoading(true);
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'video_config'));
      if (docSnap.exists()) {
        const videoData = docSnap.data();
        if (videoData && videoData.tutorialVideoUrl !== undefined) {
          if (videoData.isChunked || videoData.tutorialVideoUrl === 'chunked') {
            const chunksSnap = await getDocs(collection(db, 'settings', 'video_config', 'chunks'));
            const sortedChunks = chunksSnap.docs
              .map(d => d.data() as { data: string; index: number })
              .sort((a, b) => a.index - b.index);
            const fullBase64 = sortedChunks.map(c => c.data).join('');
            setSettings(prev => ({ ...prev, tutorialVideoUrl: fullBase64 }));
          } else {
            setSettings(prev => ({ ...prev, tutorialVideoUrl: videoData.tutorialVideoUrl }));
          }
        }
      }
    } catch (err) {
      console.warn('Tutorial video not configured in Firestore yet or offline:', err);
    } finally {
      setIsVideoLoading(false);
    }
  };

  // Auto-seed Firestore database collections if they are empty when an Admin logs in
  useEffect(() => {
    if (isAdmin) {
      const seedDatabaseIfEmpty = async () => {
        try {
          // 1. Seed Packages if empty
          const packagesSnap = await getDocs(collection(db, 'packages'));
          if (packagesSnap.empty) {
            console.log('🔄 Detected empty Firestore packages collection. Seeding INITIAL_PACKS...');
            const seedPromises = INITIAL_PACKS.map(pack => 
              setDoc(doc(db, 'packages', pack.id), pack)
            );
            await Promise.all(seedPromises);
            console.log('✅ Successfully seeded default packages to Firestore!');
          }

          // 2. Seed Wifi Packages if empty
          const wifiSnap = await getDocs(collection(db, 'wifi_packages'));
          if (wifiSnap.empty) {
            console.log('🔄 Detected empty Firestore wifi_packages collection. Seeding DEFAULT_WIFI_PACKAGES...');
            const seedWifiPromises = DEFAULT_WIFI_PACKAGES.map(wp => 
              setDoc(doc(db, 'wifi_packages', wp.id), wp)
            );
            await Promise.all(seedWifiPromises);
            console.log('✅ Successfully seeded default wifi packages to Firestore!');
          }

          // 3. Seed Site Settings if missing
          const settingsDoc = await getDoc(doc(db, 'settings', 'site_config'));
          if (!settingsDoc.exists()) {
            console.log('🔄 Detected missing site_config settings document. Seeding DEFAULT_SETTINGS...');
            await setDoc(doc(db, 'settings', 'site_config'), DEFAULT_SETTINGS);
            console.log('✅ Successfully seeded site settings to Firestore!');
          }
        } catch (e) {
          console.error('⚠️ Failed to auto-seed database:', e);
          const msg = String(e).toLowerCase();
          if (msg.includes('quota') || msg.includes('exceeded') || msg.includes('permission') || msg.includes('limit')) {
            setIsQuotaExceeded(true);
          }
        }
      };
      seedDatabaseIfEmpty();
    }
  }, [isAdmin]);

  // Connect to Firestore Database and handle fallback localstorage
  useEffect(() => {
    // Force version upgrade to sync Airtel category fixes
    const packsVer = localStorage.getItem('fahim_packs_ver_v7');
    if (!packsVer) {
      localStorage.setItem('fahim_packs', JSON.stringify(INITIAL_PACKS));
      localStorage.setItem('fahim_packs_ver_v7', 'true');
      setPacks(INITIAL_PACKS);
    } else {
      const localPacks = localStorage.getItem('fahim_packs');
      if (localPacks) {
        try {
          const parsed: DataPack[] = JSON.parse(localPacks);
          const cleaned = parsed.filter(p => p.id.startsWith('gp-fam-') || p.id.startsWith('robi-min-') || p.id.startsWith('airtel-min-') || p.id.startsWith('airtel-bundle-') || p.id.startsWith('custom-pack-') || p.id.startsWith('pack-user-'));
          setPacks(cleaned.length >= 60 ? cleaned : INITIAL_PACKS);
        } catch (e) { setPacks(INITIAL_PACKS); }
      } else {
        localStorage.setItem('fahim_packs', JSON.stringify(INITIAL_PACKS));
      }
    }

    const localOrders = localStorage.getItem('fahim_orders');
    if (localOrders) {
      try { setOrders(JSON.parse(localOrders)); } catch (e) { console.error(e); }
    }

    // Trigger initial tutorial video check/load
    handleLoadTutorialVideo();

    const handleQuotaCheck = (err: any) => {
      const msg = String(err).toLowerCase();
      if (msg.includes('quota') || msg.includes('exceeded') || msg.includes('permission') || msg.includes('limit')) {
        setIsQuotaExceeded(true);
      }
    };

    // Connect to live Firestore collections
    try {
      const unsubPacks = onSnapshot(collection(db, 'packages'), (snapshot) => {
        if (!snapshot.empty) {
          const firestorePacks: DataPack[] = [];
          let hasAirtelBundlePacks = false;

          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as DataPack;
            const id = docSnap.id;
            
            // Only keep valid packs
            if (id.startsWith('gp-fam-') || id.startsWith('robi-min-') || id.startsWith('airtel-min-') || id.startsWith('airtel-bundle-') || id.startsWith('custom-pack-') || id.startsWith('pack-user-')) {
              firestorePacks.push({ id, ...data });
              if (id.startsWith('airtel-bundle-')) hasAirtelBundlePacks = true;
            } else {
              // Delete old demo pack doc from Firestore automatically to clean up the DB
              try { deleteDoc(doc(db, 'packages', id)); } catch (err) { console.warn(err); }
            }
          });

          if (!hasAirtelBundlePacks || firestorePacks.length < 60) {
            // Seed missing INITIAL_PACKS into Firestore
            INITIAL_PACKS.forEach(async (pack) => {
              try { await setDoc(doc(db, 'packages', pack.id), pack); } catch (err) { console.warn(err); }
            });
            const mergedMap = new Map<string, DataPack>();
            INITIAL_PACKS.forEach(p => mergedMap.set(p.id, p));
            firestorePacks.forEach(p => mergedMap.set(p.id, p));
            const merged = Array.from(mergedMap.values());
            setPacks(merged);
            localStorage.setItem('fahim_packs', JSON.stringify(merged));
          } else {
            setPacks(firestorePacks);
            localStorage.setItem('fahim_packs', JSON.stringify(firestorePacks));
          }
        } else {
          // Seed database if empty
          INITIAL_PACKS.forEach(async (pack) => {
            try { await setDoc(doc(db, 'packages', pack.id), pack); } catch (err) { console.warn(err); }
          });
          setPacks(INITIAL_PACKS);
          localStorage.setItem('fahim_packs', JSON.stringify(INITIAL_PACKS));
        }
      }, (err) => {
        console.warn('Firestore subscription packages failed:', err);
        handleQuotaCheck(err);
        const localPacks = localStorage.getItem('fahim_packs');
        if (localPacks) {
          try {
            const parsed: DataPack[] = JSON.parse(localPacks);
            const cleaned = parsed.filter(p => p.id.startsWith('gp-fam-') || p.id.startsWith('robi-min-') || p.id.startsWith('airtel-min-') || p.id.startsWith('airtel-bundle-') || p.id.startsWith('custom-pack-') || p.id.startsWith('pack-user-'));
            setPacks(cleaned.length >= 60 ? cleaned : INITIAL_PACKS);
          } catch (e) { setPacks(INITIAL_PACKS); }
        } else {
          setPacks(INITIAL_PACKS);
        }
      });

      const ordersRef = collection(db, 'orders');
      const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'), limit(150));
      const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
        const firestoreOrders: Order[] = [];
        snapshot.forEach((docSnap) => {
          firestoreOrders.push({ id: docSnap.id, ...docSnap.data() } as Order);
        });
        firestoreOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(firestoreOrders);
        localStorage.setItem('fahim_orders', JSON.stringify(firestoreOrders));
      }, (err) => {
        console.warn('Firestore subscription orders failed:', err);
        handleQuotaCheck(err);
        const localOrders = localStorage.getItem('fahim_orders');
        if (localOrders) {
          try { setOrders(JSON.parse(localOrders)); } catch (e) { console.error(e); }
        }
      });

      const unsubSettings = onSnapshot(doc(db, 'settings', 'site_config'), (docSnap) => {
        if (docSnap.exists()) {
          const fetchedData = docSnap.data() as SiteSettings;
          setSettings(prev => ({
            ...prev, // Keep images from other listeners
            ...fetchedData,
            tutorialVideoUrl: prev.tutorialVideoUrl !== undefined ? prev.tutorialVideoUrl : fetchedData.tutorialVideoUrl
          }));
        } else {
          // Seed settings if empty (Only if current client is Admin)
          if (isAdminRef.current) {
            setDoc(doc(db, 'settings', 'site_config'), DEFAULT_SETTINGS).catch(console.warn);
          } else {
            setSettings(prev => ({ ...prev, ...DEFAULT_SETTINGS }));
          }
        }
      }, (err) => {
        console.warn('Firestore subscription settings failed:', err);
        handleQuotaCheck(err);
      });

      const unsubSettingsBanners = onSnapshot(doc(db, 'settings', 'site_images_banners'), (docSnap) => {
        if (docSnap.exists()) {
          const fetchedData = docSnap.data();
          setSettings(prev => ({ ...prev, ...fetchedData }));
        }
      }, (err) => console.warn('Banners listener failed:', err));

      const unsubSettingsLogos = onSnapshot(doc(db, 'settings', 'site_images_logos'), (docSnap) => {
        if (docSnap.exists()) {
          const fetchedData = docSnap.data();
          setSettings(prev => ({ ...prev, ...fetchedData }));
        }
      }, (err) => console.warn('Logos listener failed:', err));

      const unsubVideo = onSnapshot(doc(db, 'settings', 'video_config'), (docSnap) => {
        if (docSnap.exists()) {
          const videoData = docSnap.data();
          if (videoData && videoData.tutorialVideoUrl !== undefined) {
            if (videoData.isChunked || videoData.tutorialVideoUrl === 'chunked') {
              setSettings(prev => ({ ...prev, tutorialVideoUrl: 'chunked' }));
              handleLoadTutorialVideo();
            } else {
              setSettings(prev => ({ ...prev, tutorialVideoUrl: videoData.tutorialVideoUrl }));
            }
          }
        }
      }, (err) => {
        console.warn('Firestore subscription video failed:', err);
        handleQuotaCheck(err);
      });
      const unsubWifi = onSnapshot(collection(db, 'wifi_packages'), (snapshot) => {
        if (!snapshot.empty) {
          const firestoreWifi: WifiPackage[] = [];
          snapshot.forEach((docSnap) => {
            firestoreWifi.push({ id: docSnap.id, ...docSnap.data() } as WifiPackage);
          });
          setWifiPacks(firestoreWifi);
        } else {
          if (isAdminRef.current) {
            DEFAULT_WIFI_PACKAGES.forEach(async (p) => {
              try { await setDoc(doc(db, 'wifi_packages', p.id), p); } catch (err) { console.warn(err); }
            });
          }
        }
      }, (err) => {
        console.warn('Firestore subscription wifi failed:', err);
        handleQuotaCheck(err);
        setWifiPacks(DEFAULT_WIFI_PACKAGES);
      });

      return () => {
        unsubPacks();
        unsubOrders();
        unsubSettings();
        unsubSettingsBanners();
        unsubSettingsLogos();
        unsubVideo();
        unsubWifi();
      };
    } catch (e) {
      console.warn('Database initialization warning. Running offline fallback.', e);
    }
  }, []);

  // Update order status (Admin)
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status'], rejectReason?: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) throw new Error('Order not found');

      const updateData: any = { status };
      if (rejectReason !== undefined) {
        updateData.rejectReason = rejectReason;
      }

      // Refund user balance if order is cancelled and it wasn't an Add Money request
      const isAddMoney = order.packId.startsWith('add-money') || order.packTitle.includes('এড মানি');
      if (status === 'cancelled' && order.status !== 'cancelled' && !isAddMoney && order.userId) {
        try {
          const userRef = doc(db, 'users', order.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const uData = userSnap.data();
            const currentB = Number(uData.balance || 0);
            const refundedB = currentB + order.price;
            await updateDoc(userRef, { balance: refundedB });
          }
        } catch (refundErr) {
          console.warn('Error refunding cancelled order balance:', refundErr);
        }

        if (currentUser && (currentUser.uid === order.userId || currentUser.id === order.userId)) {
          const refundedB = Number(currentUser.balance || 0) + order.price;
          const updatedUser = { ...currentUser, balance: refundedB };
          setCurrentUser(updatedUser);
          localStorage.setItem('fahim_local_user', JSON.stringify(updatedUser));
        }
      }

      // Trigger recharge if approving a pending order via API
      if (status === 'completed' && order.status === 'pending') {
        try {
          const rechargeRes = await fetch('/api/recharge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              phone: order.customerPhone,
              amount: order.price,
              operator: order.operator,
              rechargeType: order.rechargeType
            })
          });
          const apiData = await rechargeRes.json();
          console.log('Admin approved order recharge result:', apiData);
        } catch (rechargeErr) {
          console.warn('Recharge API warning on approval:', rechargeErr);
        }
      }

      await updateDoc(doc(db, 'orders', orderId), updateData);
      const updated = orders.map(o => o.id === orderId ? { ...o, ...updateData } : o);
      setOrders(updated);
      localStorage.setItem('fahim_orders', JSON.stringify(updated));
    } catch (e: any) {
      console.error('Firestore order status update error:', e);
      alert('❌ অর্ডার স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে: ' + (e?.message || String(e)));
    }
  };

  // Delete Order (Admin)
  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      const updated = orders.filter(o => o.id !== orderId);
      setOrders(updated);
      localStorage.setItem('fahim_orders', JSON.stringify(updated));
    } catch (e: any) {
      console.error('Firestore order deletion error:', e);
      alert('❌ অর্ডার সার্ভার থেকে ডিলিট করতে ব্যর্থ হয়েছে! কারণ: ' + (e?.message || String(e)));
    }
  };

  // Add Pack (Admin)
  const handleAddPack = async (newPack: DataPack) => {
    try {
      await setDoc(doc(db, 'packages', newPack.id), newPack);
      const updated = [newPack, ...packs];
      setPacks(updated);
      localStorage.setItem('fahim_packs', JSON.stringify(updated));
    } catch (e: any) {
      console.error('Firestore write package error:', e);
      alert('❌ অফারটি সার্ভারে সেভ করতে ব্যর্থ হয়েছে! কারণ: ' + (e?.message || String(e)));
    }
  };

  // Delete Pack (Admin)
  const handleDeletePack = async (packId: string) => {
    try {
      await deleteDoc(doc(db, 'packages', packId));
      const updated = packs.filter(p => p.id !== packId);
      setPacks(updated);
      localStorage.setItem('fahim_packs', JSON.stringify(updated));
    } catch (e: any) {
      console.error('Firestore delete package error:', e);
      alert('❌ অফারটি সার্ভার থেকে ডিলিট করতে ব্যর্থ হয়েছে! কারণ: ' + (e?.message || String(e)));
    }
  };

  // Update Pack (Admin)
  const handleUpdatePack = async (updatedPack: DataPack) => {
    try {
      await setDoc(doc(db, 'packages', updatedPack.id), updatedPack);
      const updated = packs.map(p => p.id === updatedPack.id ? updatedPack : p);
      setPacks(updated);
      localStorage.setItem('fahim_packs', JSON.stringify(updated));
    } catch (e: any) {
      console.error('Firestore update package error:', e);
      alert('❌ অফারটি সার্ভারে আপডেট করতে ব্যর্থ হয়েছে! কারণ: ' + (e?.message || String(e)));
    }
  };

  // Reset Packs to Initial (Admin)
  const handleResetDefaultPacks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'packages'));
      const deletes = querySnapshot.docs.map(snap => deleteDoc(snap.ref));
      await Promise.all(deletes);

      const writes = INITIAL_PACKS.map(p => setDoc(doc(db, 'packages', p.id), p));
      await Promise.all(writes);

      setPacks(INITIAL_PACKS);
      localStorage.setItem('fahim_packs', JSON.stringify(INITIAL_PACKS));
      alert('🎉 অফার প্যাকেজগুলো সফলভাবে ডিফল্ট অবস্থায় রিসেট করা হয়েছে!');
    } catch (e: any) {
      console.error('Firestore reset packages error:', e);
      alert('❌ অফারগুলো রিসেট করতে ব্যর্থ হয়েছে! কারণ: ' + (e?.message || String(e)));
    }
  };

  // Update Site Settings (Admin)
  const handleUpdateSettings = async (updatedSettings: SiteSettings) => {
    try {
      const { 
        tutorialVideoUrl, 
        topBannerImage, offerBanners, promoBanners, quickServiceIcons, bannerImages,
        gpLogoUrl, robiLogoUrl, blLogoUrl, airtelLogoUrl, teletalkLogoUrl,
        bkashLogoUrl, nagadLogoUrl, rocketLogoUrl, upayLogoUrl, cellfinLogoUrl, bankingLogoUrl, logoUrl,
        ...configSettings 
      } = updatedSettings;
      
      // 1. Save general settings (Without large images)
      await setDoc(doc(db, 'settings', 'site_config'), configSettings);

      // 1.5 Save images to separate docs to avoid 1MB limit
      await setDoc(doc(db, 'settings', 'site_images_banners'), { 
        topBannerImage: topBannerImage || '', 
        offerBanners: offerBanners || [], 
        promoBanners: promoBanners || [], 
        quickServiceIcons: quickServiceIcons || {},
        bannerImages: bannerImages || []
      }, { merge: true });

      await setDoc(doc(db, 'settings', 'site_images_logos'), { 
        gpLogoUrl: gpLogoUrl || '', robiLogoUrl: robiLogoUrl || '', blLogoUrl: blLogoUrl || '', airtelLogoUrl: airtelLogoUrl || '', teletalkLogoUrl: teletalkLogoUrl || '',
        bkashLogoUrl: bkashLogoUrl || '', nagadLogoUrl: nagadLogoUrl || '', rocketLogoUrl: rocketLogoUrl || '', upayLogoUrl: upayLogoUrl || '', cellfinLogoUrl: cellfinLogoUrl || '', bankingLogoUrl: bankingLogoUrl || '',
        logoUrl: logoUrl || ''
      }, { merge: true });
      
      // 2. Save video settings with automatic chunking support
      if (tutorialVideoUrl !== undefined && tutorialVideoUrl !== 'lazy' && tutorialVideoUrl !== 'chunked') {
        const isLargeVideo = tutorialVideoUrl.length > 50000 || tutorialVideoUrl.startsWith('data:');
        
        if (isLargeVideo) {
          // Large video string or Base64 file upload. Split into safe 300,000 char chunks (~300KB each)
          const chunkSize = 300000;
          const chunks: string[] = [];
          for (let i = 0; i < tutorialVideoUrl.length; i += chunkSize) {
            chunks.push(tutorialVideoUrl.substring(i, i + chunkSize));
          }
          
          // First, clear old chunks from database
          try {
            const chunksColRef = collection(db, 'settings', 'video_config', 'chunks');
            const existingChunks = await getDocs(chunksColRef);
            const deletePromises = existingChunks.docs.map(docSnap => deleteDoc(docSnap.ref));
            await Promise.all(deletePromises);
          } catch (err) {
            console.warn('Error clearing old video chunks:', err);
          }
          
          // Write new chunks
          const writePromises = chunks.map((chunkStr, i) => {
            return setDoc(doc(db, 'settings', 'video_config', 'chunks', `chunk_${i}`), {
              data: chunkStr,
              index: i
            });
          });
          await Promise.all(writePromises);
          
          // Save metadata doc without the huge video payload
          await setDoc(doc(db, 'settings', 'video_config'), {
            tutorialVideoUrl: 'chunked',
            isChunked: true,
            totalChunks: chunks.length
          });
        } else {
          // Standard URL or empty string
          if (!tutorialVideoUrl) {
            try {
              const chunksColRef = collection(db, 'settings', 'video_config', 'chunks');
              const existingChunks = await getDocs(chunksColRef);
              const deletePromises = existingChunks.docs.map(docSnap => deleteDoc(docSnap.ref));
              await Promise.all(deletePromises);
            } catch (err) {
              console.warn('Error clearing old video chunks:', err);
            }
          }
          
          await setDoc(doc(db, 'settings', 'video_config'), {
            tutorialVideoUrl: tutorialVideoUrl || '',
            isChunked: false
          });
        }
      }
      
      setSettings(updatedSettings);
    } catch (e: any) {
      console.error('Firestore write settings error:', e);
      alert('❌ সেটিংস সেভ করতে সমস্যা হয়েছে: ' + (e?.message || String(e)));
      throw e;
    }
  };

  // Add Wifi Pack (Admin)
  const handleAddWifiPack = async (newPack: WifiPackage) => {
    try {
      await setDoc(doc(db, 'wifi_packages', newPack.id), newPack);
      setWifiPacks(prev => [newPack, ...prev]);
    } catch (e: any) {
      console.error('Firestore write wifi package error:', e);
      alert('❌ ওয়াইফাই অফারটি সেভ করতে ব্যর্থ হয়েছে!');
    }
  };

  // Delete Wifi Pack (Admin)
  const handleDeleteWifiPack = async (packId: string) => {
    try {
      await deleteDoc(doc(db, 'wifi_packages', packId));
      setWifiPacks(prev => prev.filter(p => p.id !== packId));
    } catch (e: any) {
      console.error('Firestore delete wifi package error:', e);
      alert('❌ ওয়াইফাই অফারটি ডিলিট করতে ব্যর্থ হয়েছে!');
    }
  };

  return (
    <div className="font-sans selection:bg-blue-100 selection:text-blue-900 h-[100dvh] overflow-hidden bg-slate-100">
      {/* ERROR BOUNDARY WRAPPER */}
      {renderError ? (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6 border-2 border-rose-100 shadow-sm">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1 className="text-xl font-black text-slate-900 mb-2">যান্ত্রিক ত্রুটি দেখা দিয়েছে!</h1>
          <p className="text-sm text-slate-500 max-w-xs mb-8 leading-relaxed font-bold">
            অ্যাপটি লোড করতে একটি সমস্যা হয়েছে। সাময়িক এই সমস্যার জন্য আমরা দুঃখিত। দয়া করে পেজটি রিফ্রেশ করুন।
          </p>
          <button 
            onClick={() => {
              setRenderError(false);
              window.location.reload();
            }}
            className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-100 active:scale-95 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>আবার চেষ্টা করুন</span>
          </button>
        </div>
      ) : (
        <>
          <main className="h-full w-full overflow-hidden p-0">
        {(activeTab === 'homepage' || activeTab === 'store') && (
          <div className="h-full w-full overflow-hidden flex flex-col">
            {/* PRIMARY SOFTWARE DASHBOARD INTERFACE */}
            <SoftwareDashboard
              currentUser={currentUser}
              settings={settings}
              packs={packs}
              orders={orders}
              onLogout={handleLogout}
              onInitiatePurchase={handleInitiatePurchase}
              onOpenAdmin={() => navigateTo('admin')}
              onOpenAddMoney={() => {
                handleInitiatePurchase({
                  id: 'add-money-pack',
                  title: 'ওয়ালেট এড মানি / ব্যালেন্স রিচার্জ',
                  category: 'recharge',
                  operator: 'GP',
                  data: '0',
                  minutes: 0,
                  sms: 0,
                  validity: 'অনলিমিটেড',
                  regularPrice: 500,
                  salePrice: 500,
                  cashback: 0
                });
              }}
              onOpenRecharge={() => {
                handleInitiatePurchase({
                  id: 'instant-recharge-pack',
                  title: 'ইনস্ট্যান্ট মোবাইল রিচার্জ (ফ্লেক্সিলোড)',
                  category: 'recharge',
                  operator: 'GP',
                  data: '0',
                  minutes: 0,
                  sms: 0,
                  validity: 'ইনস্ট্যান্ট',
                  regularPrice: 100,
                  salePrice: 100,
                  cashback: 0
                });
              }}
              onOpenSupport={() => setHelpModalOpen(true)}
              onOpenTracker={() => navigateTo('tracking')}
              onOpenProfile={() => {}}
              onOpenAuth={(msg) => { setAuthModalMessage(msg || ''); setAuthModalOpen(true); }}
              isAdmin={isAdmin}
            />
          </div>
        )}

        {/* VIEW 2: CUSTOM PACK BUILDER */}
        {activeTab === 'builder' && (
          <div className="h-full overflow-y-auto bg-slate-50 p-4">
            <button 
              onClick={handleBack} 
              className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs mb-4 flex items-center gap-2 cursor-pointer border-none shadow-xs"
            >
              ← অ্যাপে ফিরে যান
            </button>
            <CustomBuilder 
              onOrderCustomPack={(customPack) => handleInitiatePurchase(customPack)} 
              settings={settings}
            />
          </div>
        )}

        {/* VIEW 3: LIVE ORDER TRACKING */}
        {activeTab === 'tracking' && (
          <div className="h-full overflow-y-auto bg-slate-50 p-4">
            <button 
              onClick={handleBack} 
              className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs mb-4 flex items-center gap-2 cursor-pointer border-none shadow-xs"
            >
              ← অ্যাপে ফিরে যান
            </button>
            <OrderTracker 
              orders={orders} 
              currentUser={currentUser}
              onOpenAuthModal={(msg) => {
                setAuthModalMessage(msg || '');
                setAuthModalOpen(true);
              }}
              onNavigateToHome={handleBack}
            />
          </div>
        )}

        {/* VIEW 4: ADMIN CONTROLS PANEL */}
        {activeTab === 'admin' && (
          <div className="h-full overflow-y-auto bg-slate-100 p-4">
            <div className="max-w-7xl mx-auto space-y-4">
              <button 
                onClick={handleBack} 
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer border-none shadow-sm transition-all"
              >
                ← সফটওয়্যার ড্যাশবোর্ডে ফিরে যান
              </button>
              <AdminPanel 
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onDeleteOrder={handleDeleteOrder}
                packs={packs}
                onAddPack={handleAddPack}
                onDeletePack={handleDeletePack}
                onUpdatePack={handleUpdatePack}
                onResetDefaultPacks={handleResetDefaultPacks}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                wifiPacks={wifiPacks}
                onAddWifiPack={handleAddWifiPack}
                onDeleteWifiPack={handleDeleteWifiPack}
                isAdmin={isAdmin}
                onBackToHome={handleBack}
              />
            </div>
          </div>
        )}

        {/* VIEW 5: PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <PrivacyPolicy onClose={handleBack} />
        )}
      </main>

      {/* CHECKOUT POPUP MODAL */}
      {checkoutPack && (
        <CheckoutModal 
          pack={checkoutPack} 
          onClose={() => setCheckoutPack(null)} 
          onSubmitOrder={handleSubmitOrder}
          settings={settings}
          currentUser={currentUser}
        />
      )}

      {/* AUTHENTICATION POPUP MODAL */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={handleCloseAuthModal}
        message={authModalMessage}
        settings={settings}
        onLoginSuccess={handleLoginSuccess}
        showToast={showToast}
      />

      {/* ZINIPAY AUTO-VERIFICATION SCREEN OVERLAY */}
      {ziniVerifying && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-xl p-6 sm:p-8 border border-slate-100 shadow-md space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-emerald-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-slate-900 " />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-800">স্বয়ংক্রিয় পেমেন্ট ভেরিফিকেশন</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-bold leading-relaxed">
                {ziniStatusMessage || 'আপনার পেমেন্টটি নিরাপদভাবে যাচাই করা হচ্ছে, অনুগ্রহ করে ব্রাউজার বন্ধ বা ব্যাক করবেন না...'}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">SECURED BY ZINIPAY GATEWAY</span>
              <p className="text-[11px] text-slate-500 font-bold leading-normal">
                পেমেন্ট সম্পূর্ণ হওয়ার পর আমরা স্বয়ংক্রিয়ভাবে অপারেটরের কাছে অফার রিকুয়েস্ট পাঠিয়ে দিই।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ZINIPAY SUCCESS POPUP MODAL */}
      {ziniSuccessOrder && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-xl p-6 sm:p-8 border border-emerald-100 shadow-md space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-emerald-100">
                <CheckCircle className="w-12 h-12 text-slate-900 stroke-[2.5]" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-800">পেমেন্ট সফল হয়েছে! 🎉</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-bold leading-relaxed">
                আপনার অনলাইন পেমেন্টটি সফলভাবে সম্পন্ন ও যাচাই করা হয়েছে। অফারটি দ্রুত একটিভ করার কাজ চলছে!
              </p>
            </div>
            <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100/50 text-left space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-emerald-100/30 pb-2">
                <span className="text-slate-500 font-bold">অর্ডার আইডি (Tracking ID):</span>
                <span className="text-emerald-700 font-black font-mono">{ziniSuccessOrder.orderId}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold">অর্ডার স্ট্যাটাস:</span>
                <span className="bg-emerald-600 text-white font-extrabold px-2.5 py-1 rounded-full text-[10px] uppercase">APPROVED ⚡</span>
              </div>
            </div>
            <button
              onClick={() => {
                setZiniSuccessOrder(null);
                setZiniVerifying(false);
                navigateTo('tracking'); // Redirect them to tracking page so they can watch their order progress!
              }}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl transition-all shadow-sm  active:scale-[0.99] cursor-pointer"
            >
              অর্ডার ট্র্যাকিং দেখুন
            </button>
          </div>
        </div>
      )}

      {/* -------------------- DYNAMIC MODAL: WIFI FIBER PACKAGES -------------------- */}
      {wifiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-xl rounded-none shadow-md overflow-hidden relative border border-slate-100 flex flex-col">
            
            {/* Header */}
            <div className="bg-slate-950 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-900 font-mono font-black uppercase tracking-wider block">HIGH-SPEED FIBER BROADBAND</span>
                <h3 className="text-sm md:text-base font-black">ওয়াইফাই ফাইবার ব্রডব্যান্ড প্যাকেজসমূহ</h3>
              </div>
              <button 
                onClick={() => setWifiModalOpen(false)}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-slate-50 border border-emerald-150 p-4 rounded-xl text-xs font-bold text-emerald-800 flex items-start gap-3">
                <Check className="w-5 h-5 text-slate-900 flex-shrink-0 stroke-[3]" />
                <p>নতুন সংযোগে ফ্রি অপটিক্যাল ফাইবার এবং ফ্রি রাউটার কনফিগারেশন সুবিধা! আজই বুকিং করুন, আমাদের টিম ২৪ ঘণ্টার মধ্যে আপনার সংযোগ নিশ্চিত করবে।</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(wifiPacks.length > 0 ? wifiPacks : DEFAULT_WIFI_PACKAGES).map((wifi, idx) => (
                  <div 
                    key={idx}
                    className={`p-5 rounded-xl border ${
                      wifi.popular ? 'border-[#0f172a] bg-emerald-50/10' : 'border-slate-100 bg-white'
                    } flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase tracking-wider">
                          {wifi.badge}
                        </span>
                        {wifi.popular && (
                          <span className="text-[9px] font-black text-slate-900 uppercase">★ POPULAR</span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-slate-800">{wifi.name}</h4>
                      <h3 className="text-2xl font-black text-slate-900 font-sans pt-1">
                        {wifi.speed}
                      </h3>
                      <p className="text-xs font-black text-slate-600 font-sans">{wifi.price}</p>
                    </div>

                    <ul className="space-y-1.5 text-[10px] text-slate-500 font-bold border-t border-slate-50 pt-3">
                      {wifi.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-slate-900 stroke-[3]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                     <button
                       onClick={() => {
                         alert(`Booking Confirmed! 📞 আমাদের প্রতিনিধি আপনার সাথে শীঘ্রই যোগাযোগ করবেন।\nপ্যাকেজ: ${wifi.name} (${wifi.speed})`);
                         setWifiModalOpen(false);
                       }}
                       className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase rounded-lg tracking-wide cursor-pointer transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95 border-none"
                     >
                       Book Connection
                     </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center text-[10px] font-black text-slate-400">
              * মিরপুর ও আশেপাশের এলাকার জন্য বুকিং প্রযোজ্য। হেল্পলাইন: 09638-123456
            </div>

          </div>
        </div>
      )}

      {/* -------------------- DYNAMIC MODAL: ABOUT FAHIM INTERNET -------------------- */}
      {aboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-lg md:rounded-xl rounded-none shadow-md overflow-hidden relative border border-slate-100 flex flex-col">
            
            {/* Header */}
            <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-100 font-mono font-black uppercase tracking-wider block">ABOUT US & COMPLIANCE</span>
                <h3 className="text-sm md:text-base font-black">আমাদের সম্পর্কে ও লাইসেন্স পরিচিতি</h3>
              </div>
              <button 
                onClick={() => setAboutModalOpen(false)}
                className="p-1.5 bg-emerald-700 hover:bg-emerald-800 text-emerald-100 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-semibold text-slate-600 leading-relaxed">
              <div className="text-center py-4 border-b border-slate-100">
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mx-auto text-slate-900 mb-2 border border-emerald-100 shadow-sm">
                  <Wifi className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h4 className="text-base font-black text-slate-800">Fahim Internet & Telecom</h4>
                <p className="text-[10px] text-slate-900 uppercase font-black tracking-wider mt-1">BTRC Approved Broadband & Telecom Provider</p>
              </div>

              <div className="space-y-2">
                <p>
                  Fahim Internet বাংলাদেশের একটি শীর্ষস্থানীয় ব্রডব্যান্ড ফাইবার ইন্টারনেট এবং টেলিকম সেবা প্রদানকারী প্রতিষ্ঠান। ২০১৮ সাল থেকে অত্যন্ত সুনামের সাথে আমরা আমাদের গ্রাহকদের সফলভাবে মোবাইল ইন্টারনেট প্যাকেজ, ড্রাইভ রিচার্জ এবং ফাইবার ব্রডব্যান্ড ওয়াইফাই সংযোগ সেবা প্রদান করে আসছি।
                </p>
                <p>
                  আমাদের লক্ষ্য হলো কোনো প্রকার অতিরিক্ত চার্জ ছাড়াই অত্যন্ত সাশ্রয়ী মূল্যে সবার জন্য হাই-স্পিড ও স্থিতিশীল ইন্টারনেট সংযোগ নিশ্চিত করা।
                </p>
              </div>

              {/* BTRC ISP License Compliance Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <strong className="text-slate-800 block text-[11px] font-black uppercase tracking-wider border-b border-slate-200 pb-1 text-slate-900">আইএসপি লাইসেন্স ও অনুমোদন তথ্য:</strong>
                <ul className="space-y-1 text-[10px] text-slate-600">
                  <li>• <strong>লাইসেন্স ধরণ:</strong> ক্যাটাগরি-এ ব্রডব্যান্ড ইন্টারনেট (Category-A ISP)</li>
                  <li>• <strong>অনুমোদনকারী:</strong> বাংলাদেশ টেলিযোগাযোগ নিয়ন্ত্রণ কমিশন (BTRC)</li>
                  <li>• <strong>লাইসেন্স নম্বর:</strong> BTRC/ISP/2026/894-A</li>
                  <li>• <strong>সার্ভিস এরিয়া:</strong> মিরপুর ও সমগ্র ঢাকা মেট্রোপলিটন এলাকা</li>
                </ul>
              </div>

              {/* Services List Box */}
              <div className="bg-emerald-50/40 border border-emerald-150 p-4 rounded-xl space-y-2">
                <strong className="text-slate-800 block text-[11px] font-black uppercase text-emerald-800">আমাদের অনুমোদিত সেবাসমূহ:</strong>
                <ul className="space-y-1.5 text-[10px] text-slate-500 font-bold">
                  <li className="flex items-center gap-1.5">✓ হাই-স্পিড অপটিক্যাল ফাইবার ব্রডব্যান্ড (FTTH Connect)</li>
                  <li className="flex items-center gap-1.5">✓ সকল মোবাইল অপারেটরের ধামাকা ড্রাইভ ও মিনিট অফার রিচার্জ</li>
                  <li className="flex items-center gap-1.5">✓ ২৪/৭ ডেডিকেটেড হোয়াটসঅ্যাপ ব্যাকআপ ও বিটিআরসি প্রোটোকল সাপোর্ট</li>
                  <li className="flex items-center gap-1.5">✓ লোকাল FTP সিনেমা ও লাইভ টিভি স্ট্রিম সার্ভার অ্যাক্সেস</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
              <button
                onClick={() => setAboutModalOpen(false)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase rounded-lg cursor-pointer transition-colors"
              >
                প্যানেল বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- DYNAMIC MODAL: AI CHAT ASSISTANT -------------------- */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" id="ai-modal-root">
          <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-md md:rounded-xl rounded-none shadow-md overflow-hidden relative border border-slate-100 flex flex-col" id="ai-modal-panel">
            {/* Header */}
            <div className="bg-slate-900 px-6 py-4.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                  <Bot className="w-5 h-5 text-emerald-100 " />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-100 font-black uppercase tracking-wider block">PREMIUM AI</span>
                  <h3 className="text-xs font-black">ফাহিম ইন্টারনেট এআই অ্যাসিস্ট্যান্ট</h3>
                </div>
              </div>
              <button 
                onClick={() => setAiModalOpen(false)}
                className="p-1.5 bg-emerald-700 hover:bg-emerald-800 text-emerald-100 hover:text-white rounded-full transition-colors cursor-pointer"
                id="close-ai-modal-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 text-[11px] bg-slate-50 min-h-[320px] max-h-[380px] flex flex-col" id="ai-chat-messages-container">
              {aiMessages.map((msg, i) => (
                <div 
                  key={i}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 font-bold text-[10px] shadow-sm">
                      AI
                    </div>
                  )}
                  <div className={`p-3 rounded-xl max-w-[80%] font-semibold whitespace-pre-line shadow-sm border ${
                    msg.sender === 'user' 
                      ? 'bg-emerald-600 text-white border-emerald-500 rounded-tr-none' 
                      : 'bg-white text-slate-700 border-slate-150 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiIsTyping && (
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] pl-2">
                  <Bot className="w-4 h-4 " />
                  <span>টাইপ করছে...</span>
                </div>
              )}
            </div>

            {/* Quick Suggestions list */}
            <div className="p-3 bg-white border-t border-slate-100 flex flex-wrap gap-1.5 justify-center" id="ai-modal-quick-suggestions">
              {[
                { label: '📶 সেরা ইন্টারনেট অফার', text: 'সবচেয়ে সেরা ইন্টারনেট অফার কি কি আছে?' },
                { label: '🛜 ব্রডব্যান্ড ওয়াইফাই', text: 'ব্রডব্যান্ড ওয়াইফাই লাইনের স্পিড ও মাসিক চার্জ কেমন?' },
                { label: '📞 পেমেন্ট করার নিয়ম', text: 'আমি কিভাবে বিকাশ বা নগদ দিয়ে অফার কেনার পেমেন্ট করব?' },
                { label: '📦 অর্ডার ট্র্যাক', text: 'আমি কিভাবে আমার সফল বা পেন্ডিং অর্ডার ট্র্যাক করব?' }
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendAiMessage(suggestion.text)}
                  className="px-2.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-emerald-150 transition-all font-bold text-[10px] cursor-pointer"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>

            {/* Input form */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
              <input 
                type="text" 
                placeholder="প্রশ্নটি এখানে বাংলায় লিখুন..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendAiMessage(aiInput);
                }}
                className="flex-grow bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs outline-none text-slate-700 font-semibold"
              />
              <button
                onClick={() => handleSendAiMessage(aiInput)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                পাঠান
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- DYNAMIC MODAL: HELP CENTER & FAQ -------------------- */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" id="help-modal-root">
          <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-md md:rounded-xl rounded-none shadow-md overflow-hidden relative border border-slate-100 flex flex-col" id="help-modal-panel">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-100 font-mono font-black uppercase tracking-wider block">SUPPORT DESK</span>
                <h3 className="text-sm font-black">সহায়তা কেন্দ্র ও প্রশ্নোত্তর (FAQ)</h3>
              </div>
              <button 
                onClick={() => setHelpModalOpen(false)}
                className="p-1.5 bg-blue-700 hover:bg-blue-800 text-blue-100 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Accordion */}
            <div className="p-6 overflow-y-auto space-y-3.5 max-h-[450px]" id="faq-accordions-list">
              {[
                {
                  q: 'অফার সফল হতে সাধারণত কত সময় লাগে?',
                  a: 'আমাদের সমস্ত অর্ডার স্বয়ংক্রিয়ভাবে প্রসেস করা হয়। পেমেন্ট সম্পন্ন করার পর সাধারণত ১ থেকে ১০ মিনিটের মধ্যে অফারটি আপনার নাম্বারে সচল হয়ে যায়।'
                },
                {
                  q: 'ক্যাশব্যাক বা ডিসকাউন্ট কিভাবে ফেরত পাবো?',
                  a: 'আপনি অফার ক্রয়ের সাথে সাথেই আপনার অফারে উল্লেখিত ক্যাশব্যাক ব্যালেন্স স্বয়ংক্রিয়ভাবে সরাসরি আপনার বিকাশ/নগদ নাম্বারে ক্যাশব্যাক হিসেবে জমা হয়ে যাবে!'
                },
                {
                  q: 'পেমেন্ট করার নিরাপদ নিয়ম কি?',
                  a: 'আমাদের পেমেন্ট গেটওয়ে সম্পূর্ণ সুরক্ষিত। অফার পছন্দ করে আপনার নাম্বার ও মোবাইল অপারেটর নিশ্চিত করার পর পেমেন্ট গেটওয়েতে বিকাশ, রকেট বা নগদ দিয়ে পেমেন্ট ওভেন করতে পারবেন।'
                },
                {
                  q: 'কাস্টম অফার বিল্ডার দিয়ে কিভাবে অফার বানাবো?',
                  a: 'মেনু থেকে "Offers & Builder" অপশনে যান। সেখানে আপনার ইচ্ছেমতো ইন্টারনেট ও টকটাইম (মিনিট) সিলেক্ট করুন এবং সরাসরি "Build Offer" চাপুন!'
                },
                {
                  q: 'কোনো সমস্যা হলে সরাসরি কিভাবে যোগাযোগ করব?',
                  a: 'আপনার অফার অ্যাক্টিভেশনে কোনো সমস্যা হলে দয়া করে সরাসরি আমাদের হোয়াটসঅ্যাপ হটলাইন নাম্বারে (01618599077) যোগাযোগ করুন। আমাদের টিম দ্রুত সমাধান দিবে।'
                }
              ].map((item, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-slate-150 rounded-xl overflow-hidden bg-slate-50 transition-all shadow-sm"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-2 font-black text-xs text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-[11px] font-semibold text-slate-500 leading-relaxed bg-white border-t border-slate-100">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Direct WhatsApp Action banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-emerald-100 text-center space-y-2 mt-4">
                <p className="text-[11px] font-black text-emerald-800">কোনো কিছু বুঝতে সমস্যা হচ্ছে?</p>
                <button
                  onClick={() => {
                    const url = `https://wa.me/${settings.supportPhone || '01618599077'}?text=Hello ${settings.brandName || 'Fahim Internet'}, I need support.`;
                    window.open(url, '_blank');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>সরাসরি হোয়াটসঅ্যাপ করুন</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
              <button
                onClick={() => setHelpModalOpen(false)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase rounded-lg cursor-pointer transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- DYNAMIC MODAL: CONTACT US -------------------- */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" id="contact-modal-root">
          <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-md md:rounded-xl rounded-none shadow-md overflow-hidden relative border border-slate-100 flex flex-col" id="contact-modal-panel">
            {/* Header */}
            <div className="bg-orange-500 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-orange-100 font-mono font-black uppercase tracking-wider block">CONTACT US</span>
                <h3 className="text-sm font-black">আমাদের সাথে যোগাযোগের মাধ্যম</h3>
              </div>
              <button 
                onClick={() => setContactModalOpen(false)}
                className="p-1.5 bg-orange-600 hover:bg-orange-700 text-orange-100 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content & Form */}
            <div className="p-6 overflow-y-auto space-y-5 max-h-[450px]">
              {/* Direct Info list */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-extrabold block">হটলাইন নাম্বার</span>
                  <a href={`tel:${settings.supportPhone || '01618599077'}`} className="text-xs font-black text-slate-800 hover:underline">{settings.supportPhone || '01618599077'}</a>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-extrabold block">হোয়াটসঅ্যাপ চ্যাট</span>
                  <a href={`https://wa.me/${settings.supportPhone || '01618599077'}`} target="_blank" rel="noreferrer" className="text-xs font-black text-slate-900 hover:underline">{settings.supportPhone || '01618599077'}</a>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl text-center col-span-2 space-y-1">
                  <span className="text-[10px] text-slate-400 font-extrabold block">অফিস ঠিকানা</span>
                  <p className="text-xs font-black text-slate-700">{settings.supportAddress || 'মিরপুর-১০ গোলচত্বর, ঢাকা, বাংলাদেশ'}</p>
                </div>
              </div>

              {/* Message box */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('✉️ আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! ফাহিম ইন্টারনেট হটলাইন টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে। ধন্যবাদ!');
                  setContactModalOpen(false);
                }}
                className="space-y-3 pt-2"
              >
                <h4 className="text-xs font-black text-slate-800">যেকোনো মতামত বা মেসেজ পাঠান:</h4>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="আপনার নাম" 
                    required
                    className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <input 
                    type="tel" 
                    placeholder="আপনার মোবাইল নাম্বার" 
                    required
                    className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <textarea 
                    rows={3}
                    placeholder="আপনার বার্তাটি বিস্তারিত লিখুন..." 
                    required
                    className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-orange-500 focus:bg-white resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  মেসেজ পাঠান (Send Message)
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
              <button
                onClick={() => setContactModalOpen(false)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase rounded-lg cursor-pointer transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- DYNAMIC MODAL: PRIVACY POLICY -------------------- */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" id="privacy-modal-root">
          <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-md md:rounded-xl rounded-none shadow-md overflow-hidden relative border border-slate-100 flex flex-col" id="privacy-modal-panel">
            {/* Header */}
            <div className="bg-emerald-600 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-100 font-mono font-black uppercase tracking-wider block">LEGAL POLICY</span>
                <h3 className="text-sm font-black">আমাদের প্রাইভেসি পলিসি (Privacy)</h3>
              </div>
              <button 
                onClick={() => setPrivacyModalOpen(false)}
                className="p-1.5 bg-emerald-700 hover:bg-emerald-800 text-emerald-100 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-slate-600 text-xs font-semibold leading-relaxed max-h-[450px]">
              <p className="font-bold text-slate-800">সর্বশেষ আপডেট: জুলাই ২০২৬</p>
              <p>
                ফাহিম ইন্টারনেট ও টেলিকমে আপনার গোপনীয়তা রক্ষা করা আমাদের অন্যতম প্রধান দায়িত্ব। আমাদের সার্ভিস ব্যবহারের ক্ষেত্রে আপনার কোন কোন তথ্য আমরা সংরক্ষণ ও ব্যবহার করি তা নিচে উল্লেখ করা হলো:
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-black text-slate-800 text-[11px]">১. তথ্য সংগ্রহ ও ব্যবহার:</h4>
                  <p className="text-[10px] text-slate-500 pl-2">অর্ডার সফলভাবে অ্যাক্টিভ করতে আমরা আপনার মোবাইল নাম্বার, ইমেল অ্যাড্রেস এবং অপারেটর বিবরণ সংগ্রহ করি। এই তথ্য অন্য কোনো থার্ড-পার্টির সাথে শেয়ার করা হয় না।</p>
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-[11px]">২. পেমেন্ট ও নিরাপত্তা:</h4>
                  <p className="text-[10px] text-slate-500 pl-2">সমস্ত লেনদেন স্বনামধন্য সুরক্ষিত পেমেন্ট গেটওয়ের মাধ্যমে সম্পন্ন করা হয়। ফাহিম ইন্টারনেট আপনার ব্যাংক বা মোবাইল ফাইন্যান্সিয়াল পাসওয়ার্ড/পিন সংরক্ষণ করে না।</p>
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-[11px]">৩. কুকিজ ও ট্র্যাকিং:</h4>
                  <p className="text-[10px] text-slate-500 pl-2">আপনার ব্রাউজার সেশন, অফার কার্ট ও ইউজার লগইন মনে রাখতে আমরা প্রয়োজনীয় লোকালস্টোরেজ কুকিজ ব্যবহার করি।</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase rounded-lg cursor-pointer transition-colors"
              >
                প্যানেল বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- DYNAMIC MODAL: TERMS & CONDITIONS -------------------- */}
      {termsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" id="terms-modal-root">
          <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-md md:rounded-xl rounded-none shadow-md overflow-hidden relative border border-slate-100 flex flex-col" id="terms-modal-panel">
            {/* Header */}
            <div className="bg-[#1e293b] px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-300 font-mono font-black uppercase tracking-wider block">TERMS OF SERVICE</span>
                <h3 className="text-sm font-black">শর্তাবলী ও নিয়মাবলী (Terms)</h3>
              </div>
              <button 
                onClick={() => setTermsModalOpen(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-slate-600 text-xs font-semibold leading-relaxed max-h-[450px]">
              <p className="font-bold text-slate-800">সর্বশেষ আপডেট: জুলাই ২০২৬</p>
              <p>
                ফাহিম ইন্টারনেট ও টেলিকমের পোর্টাল ব্যবহার করে যেকোনো মোবাইল অফার ক্রয় করার ক্ষেত্রে নিম্নলিখিত শর্তাবলী প্রযোজ্য হবে:
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-black text-slate-800 text-[11px]">১. সঠিক তথ্য প্রদান:</h4>
                  <p className="text-[10px] text-slate-500 pl-2">অর্ডার করার সময় অবশ্যই সঠিক রিচার্জ নাম্বার এবং সঠিক অপারেটর সিলেক্ট করতে হবে। ভুল নাম্বারে রিচার্জ চলে গেলে ফাহিম ইন্টারনেট authority দায়ী থাকবে না।</p>
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-[11px]">২. প্রসেসিং সময়:</h4>
                  <p className="text-[10px] text-slate-500 pl-2">অধিকাংশ রিচার্জ তাৎক্ষণিক সফল হয়। তবে অপারেটর সার্ভার ডাউন থাকার ক্ষেত্রে ৫ মিনিট থেকে ৩ ঘণ্টা পর্যন্ত সময় লাগতে পারে।</p>
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-[11px]">৩. রিফান্ড বা বাতিলকরণ:</h4>
                  <p className="text-[10px] text-slate-500 pl-2">একবার অফার প্রসেসিং শুরু হলে তা বাতিল করা সম্ভব নয়। তবে কোনো টেকনিক্যাল কারণে রিচার্জ সফল না হলে আপনার পেমেন্টকৃত সম্পূর্ণ টাকা ২৪ ঘণ্টার মধ্যে রিফান্ড করা হবে।</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
              <button
                onClick={() => setTermsModalOpen(false)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase rounded-lg cursor-pointer transition-colors"
              >
                প্যানেল বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      <NotificationPromptModal
        isOpen={showNotifPrompt}
        onClose={handleCloseNotifPrompt}
        userId={currentUser?.phone || currentUser?.uid}
        showToast={showToast}
      />

      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
        </>
      )}
    </div>
  );
}

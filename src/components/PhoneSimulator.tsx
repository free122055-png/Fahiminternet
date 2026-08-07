import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, Smartphone, Check, CreditCard, Flame, Sparkles, HelpCircle, 
  Activity, ArrowRight, Play, RotateCcw, AlertCircle, ShoppingBag
} from 'lucide-react';
import { DataPack } from '../types';
import { BKashLogo, NagadLogo, RocketLogo } from './BrandLogos';

interface PhoneSimulatorProps {
  apkUrl?: string;
  packs?: DataPack[];
  tutorialVideoUrl?: string;
  onLoadTutorialVideo?: () => void;
  isVideoLoading?: boolean;
}

export default function PhoneSimulator({ 
  apkUrl, 
  packs, 
  tutorialVideoUrl, 
  onLoadTutorialVideo, 
  isVideoLoading 
}: PhoneSimulatorProps) {
  const [activeTab, setActiveTab] = useState<'tutorial' | 'live-feed'>('tutorial');

  // Helper to convert YouTube URL to Embed URL
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&loop=1&playlist=${match[2]}&controls=0&modestbranding=1&rel=0`;
    }
    return null;
  };

  // Trigger lazy loading of the tutorial video when the user views the tutorial tab
  useEffect(() => {
    if (activeTab === 'tutorial' && (tutorialVideoUrl === 'lazy' || tutorialVideoUrl === 'chunked') && onLoadTutorialVideo) {
      onLoadTutorialVideo();
    }
  }, [activeTab, tutorialVideoUrl, onLoadTutorialVideo]);

  const [tutStep, setTutStep] = useState<number>(0);
  const [simulatedMobile, setSimulatedMobile] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [simulatedOperator, setSimulatedOperator] = useState('GP');
  const [selectedSimPack, setSelectedSimPack] = useState<any>(null);

  // Dynamically select tutorial pack from active DB packs
  const activeTutorialPack = React.useMemo(() => {
    if (packs && packs.length > 0) {
      // Find a GP pack or any pack with valid price
      const gpPack = packs.find(p => p.operator === 'GP' && p.salePrice > 0);
      if (gpPack) return gpPack;
      return packs[0];
    }
    return {
      id: 'default-sim',
      title: '২৫ জিবি মেগা ইন্টারনেট',
      validity: '৩০ দিন',
      salePrice: 349,
      regularPrice: 399,
      operator: 'GP' as const,
      data: '২৫ জিবি'
    };
  }, [packs]);
  
  // Real-time live feed state
  const [liveOrders, setLiveOrders] = useState<Array<{
    id: string;
    number: string;
    operator: 'GP' | 'Robi' | 'Banglalink' | 'Airtel' | 'Teletalk';
    packName: string;
    price: number;
    timeAgo: string;
  }>>([
    { id: '1', number: '017***5439', operator: 'GP', packName: '১৫ জিবি + ৩০০ মিনিট', price: 299, timeAgo: '১ মিনিট আগে' },
    { id: '2', number: '018***8294', operator: 'Robi', packName: '৫০ জিবি (ইন্টারনেট)', price: 499, timeAgo: '২ মিনিট আগে' },
    { id: '3', number: '019***1024', operator: 'Banglalink', packName: '১০ জিবি + ১৫০ মিনিট', price: 198, timeAgo: '৩ মিনিট আগে' },
    { id: '4', number: '016***0943', operator: 'Airtel', packName: '৮ জিবি (সাপ্তাহিক)', price: 114, timeAgo: '৪ মিনিট আগে' },
    { id: '5', number: '015***3342', operator: 'Teletalk', packName: '৩০ জিবি সুপার ডাটা', price: 249, timeAgo: '৫ মিনিট আগে' },
  ]);

  // Timed looping for the tutorial
  useEffect(() => {
    let timer: any;
    
    if (activeTab === 'tutorial') {
      if (tutStep === 0) {
        // Welcoming state
        setSimulatedMobile('');
        setSelectedSimPack(null);
        timer = setTimeout(() => setTutStep(1), 2500);
      } 
      else if (tutStep === 1) {
        // Typing number state
        setIsTyping(true);
        // Prefix based on operator of tutorial pack
        const prefix = activeTutorialPack.operator === 'Robi' ? '018' :
                       activeTutorialPack.operator === 'Banglalink' ? '019' :
                       activeTutorialPack.operator === 'Airtel' ? '016' :
                       activeTutorialPack.operator === 'Teletalk' ? '015' : '017';
        
        let numberStr = `${prefix}89456123`;
        let currentIdx = 0;
        setSimulatedOperator(activeTutorialPack.operator);
        setSimulatedMobile('');
        
        const typeInterval = setInterval(() => {
          if (currentIdx < numberStr.length) {
            setSimulatedMobile(prev => prev + numberStr[currentIdx]);
            currentIdx++;
          } else {
            clearInterval(typeInterval);
            setIsTyping(false);
            // Move to step 2
            timer = setTimeout(() => setTutStep(2), 1500);
          }
        }, 150);
        
        return () => {
          clearInterval(typeInterval);
          clearTimeout(timer);
        };
      } 
      else if (tutStep === 2) {
        // Choose Pack State
        setSelectedSimPack(activeTutorialPack);
        timer = setTimeout(() => setTutStep(3), 2000);
      } 
      else if (tutStep === 3) {
        // Payment Processing State
        timer = setTimeout(() => setTutStep(4), 2500);
      } 
      else if (tutStep === 4) {
        // Success screen
        timer = setTimeout(() => {
          setTutStep(0);
        }, 5000);
      }
    }

    return () => clearTimeout(timer);
  }, [tutStep, activeTab, activeTutorialPack]);

  // Append new simulated orders every few seconds to look extremely active!
  useEffect(() => {
    const operators: Array<'GP' | 'Robi' | 'Banglalink' | 'Airtel' | 'Teletalk'> = ['GP', 'Robi', 'Banglalink', 'Airtel', 'Teletalk'];
    const prefixMap = { GP: '017', Robi: '018', Banglalink: '019', Airtel: '016', Teletalk: '015' };
    
    // Map packs to random feed choices if available, otherwise fallback
    const randomPacks = packs && packs.length > 0
      ? packs.map(p => ({ name: p.title, price: p.salePrice }))
      : [
          { name: '১৫ জিবি + ৩০০ মিনিট', price: 299 },
          { name: '৫০ জিবি (ইন্টারনেট)', price: 499 },
          { name: '১০ জিবি + ১৫০ মিনিট', price: 198 },
          { name: '৮ জিবি (সাপ্তাহিক)', price: 114 },
          { name: '৩০ জিবি সুপার ডাটা', price: 249 },
          { name: '৫ জিবি ৩ দিন টকটাইম', price: 59 },
          { name: '১০০ জিবি মেগা অফার', price: 799 },
          { name: '১০০০ মিনিট ৩০ দিন', price: 610 }
        ];

    const liveInterval = setInterval(() => {
      const op = operators[Math.floor(Math.random() * operators.length)];
      const prefix = prefixMap[op];
      const middle = '***';
      const suffix = Math.floor(Math.random() * 9000 + 1000).toString();
      const pack = randomPacks[Math.floor(Math.random() * randomPacks.length)];

      const newOrder = {
        id: Date.now().toString(),
        number: `${prefix}${middle}${suffix}`,
        operator: op,
        packName: pack.name,
        price: pack.price,
        timeAgo: 'এইমাত্র'
      };

      setLiveOrders(prev => [newOrder, ...prev.slice(0, 4)]);
    }, 6000);

    return () => clearInterval(liveInterval);
  }, [packs]);

  return (
    <div className="w-[280px] h-[560px] bg-slate-900 rounded-[44px] p-3 shadow-md border-4 border-slate-800 relative ring-12 ring-slate-900/10 flex flex-col justify-between overflow-hidden">
      
      {/* Top notch dynamic island */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-20 flex items-center justify-center">
        <div className="w-2.5 h-2.5 bg-[#0f172a] rounded-full mr-12" />
        <div className="w-1.5 h-1.5 bg-[#0f172a] rounded-full" />
      </div>

      {/* Internal Phone Screen Container */}
      <div className="bg-[#050B14] rounded-xl w-full h-full flex flex-col justify-between p-3.5 relative overflow-hidden z-10 text-white select-none">
        
        {/* Dynamic mesh background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Status Bar */}
        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 mt-2.5 relative z-10 px-1">
          <span>FAHIM Net</span>
          <div className="flex items-center gap-1">
            <Wifi className="w-2.5 h-2.5 text-slate-900" />
            <span>4G LTE</span>
          </div>
        </div>

        {/* Dynamic Sub-Header with Action Tabs */}
        <div className="relative z-10 mt-3 flex items-center justify-center p-0.5 bg-slate-950/60 rounded-full border border-slate-800">
          <button 
            onClick={() => {
              setActiveTab('tutorial');
              setTutStep(0);
            }}
            className={`flex-1 py-1 px-1.5 rounded-full text-[9px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'tutorial' 
                ? 'bg-slate-900 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-2.5 h-2.5" />
            <span>কিভাবে কিনবেন</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('live-feed')}
            className={`flex-1 py-1 px-1.5 rounded-full text-[9px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'live-feed' 
                ? 'bg-slate-900 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-2.5 h-2.5 text-emerald-400" />
            <span>লাইভ বিক্রয়</span>
          </button>
        </div>

        {/* PHONE MAIN DISPLAY SCREEN CONTENT */}
        <div className="flex-1 my-3 relative overflow-hidden rounded-xl bg-slate-950/40 border border-slate-900/60 p-2.5 flex flex-col justify-between z-10">
          
          <AnimatePresence mode="wait">
            {activeTab === 'tutorial' ? (
              isVideoLoading || tutorialVideoUrl === 'lazy' || tutorialVideoUrl === 'chunked' ? (
                <div key="video-tutorial-loading" className="absolute inset-0 w-full h-full bg-slate-950 flex flex-col items-center justify-center space-y-3 p-4">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-slate-300">ভিডিও টিউটোরিয়াল লোড হচ্ছে...</p>
                  <p className="text-[8px] text-slate-500 font-bold text-center leading-relaxed">প্রথমবার লোড হতে ৫-১০ সেকেন্ড সময় লাগতে পারে। অনুগ্রহ করে অপেক্ষা করুন।</p>
                </div>
              ) : (tutorialVideoUrl && tutorialVideoUrl !== 'lazy' && tutorialVideoUrl !== 'chunked') ? (
                <div key="video-tutorial-layer" className="absolute inset-0 w-full h-full overflow-hidden bg-black flex flex-col justify-between">
                  {getYouTubeEmbedUrl(tutorialVideoUrl) ? (
                    <iframe 
                      src={getYouTubeEmbedUrl(tutorialVideoUrl)!}
                      title="Tutorial Video"
                      className="w-full h-full object-cover border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video 
                      src={tutorialVideoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-[8px] text-white font-black flex items-center justify-between z-10 pointer-events-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>ভিডিও টিউটোরিয়াল</span>
                    </div>
                    <span className="text-[7px] text-slate-400">max 30s</span>
                  </div>
                </div>
              ) : (
                <motion.div 
                  key={`step-${tutStep}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex-1 flex flex-col justify-between h-full"
                >
                {/* TUTORIAL STEP 0: Welcome Screen */}
                {tutStep === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center ">
                      <ShoppingBag className="w-6 h-6 text-slate-900" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-300">FAHIM Internet</h4>
                      <h3 className="text-sm font-black text-emerald-400">সহজেই এমবি কিনুন</h3>
                      <p className="text-[9px] text-slate-500 font-bold max-w-[160px] leading-relaxed mx-auto">
                        ১ মিনিটে আপনার মোবাইল নাম্বারে ১০০% গ্যারান্টি রিচার্জ টিউটোরিয়াল
                      </p>
                    </div>

                    <div className="pt-2 w-full px-4">
                      <div className="py-2 bg-slate-900 text-white text-[9px] font-black rounded-lg uppercase tracking-wider flex items-center justify-center gap-1 relative shadow-sm">
                        <span>প্যাক সিলেক্ট করুন</span>
                        <ArrowRight className="w-3 h-3" />
                        
                        {/* Interactive hand finger cursor pointing to buy button */}
                        <motion.div 
                          initial={{ x: 20, y: 20, opacity: 0 }}
                          animate={{ x: 0, y: 0, opacity: 1 }}
                          transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                          className="absolute bottom-[-15px] right-4 z-20 text-2xl"
                        >
                          👆
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TUTORIAL STEP 1: Typing Phone Number */}
                {tutStep === 1 && (
                  <div className="flex-1 flex flex-col justify-between py-1 text-left">
                    <div className="space-y-3">
                      <span className="text-[8px] font-black uppercase text-slate-900 tracking-wider block">ধাপ ০১: মোবাইল নাম্বার</span>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400">আপনার মোবাইল নাম্বার দিন</label>
                        <div className="relative bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center justify-between">
                          <span className="text-[11px] font-extrabold tracking-widest font-mono text-white">
                            {simulatedMobile || ' '}
                            <span className=" text-slate-900">|</span>
                          </span>
                          <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                      </div>

                      {/* Detected Operator indicator */}
                      <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-900 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                          <span className="text-[8px] font-extrabold text-slate-400">অপারেটর সনাক্তকরণ:</span>
                        </div>
                        <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/30 text-[8px] font-black text-blue-400 rounded">
                          {simulatedOperator}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="w-full py-2 bg-slate-800 text-slate-400 text-[9px] font-black rounded-lg flex items-center justify-center gap-1">
                        <span>পরবর্তী ধাপ</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                )}

                {/* TUTORIAL STEP 2: Selected Pack */}
                {tutStep === 2 && (
                  <div className="flex-1 flex flex-col justify-between py-1 text-left">
                    <div className="space-y-3">
                      <span className="text-[8px] font-black uppercase text-slate-900 tracking-wider block">ধাপ ০২: সেরা প্যাকেজ নির্বাচন</span>

                      <div className="bg-slate-900 border-2 border-[#0f172a] rounded-xl p-3 space-y-2 relative overflow-hidden">
                        <div className="absolute top-1 right-1">
                          <span className="px-1 py-0.5 bg-emerald-500/10 text-[7px] font-black text-slate-900 rounded uppercase">Best Deal</span>
                        </div>

                        <span className="px-1.5 py-0.5 bg-blue-500 text-white rounded-[4px] text-[7px] font-black tracking-wide uppercase">
                          {selectedSimPack?.operator || 'GP'} Offernet
                        </span>

                        <div className="space-y-0.5">
                          <h4 className="text-xs font-black text-white leading-none line-clamp-2">{selectedSimPack?.title || '২৫ জিবি মেগা ইন্টারনেট'}</h4>
                          <p className="text-[8px] text-slate-400 font-bold">মেয়াদ: {selectedSimPack?.validity || '৩০ দিন'} | অল নেটওয়ার্ক</p>
                        </div>

                        <div className="flex items-end justify-between pt-1 border-t border-slate-800">
                          <span className="text-sm font-black text-slate-900">৳{selectedSimPack?.salePrice || 349}</span>
                          <span className="text-[8px] text-slate-500 font-bold line-through">৳{selectedSimPack?.regularPrice || (selectedSimPack?.salePrice ? selectedSimPack.salePrice + 50 : 399)}</span>
                        </div>
                        
                        {/* Click indicator finger */}
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0.8 }}
                          animate={{ scale: 1.1, opacity: 1 }}
                          transition={{ repeat: Infinity, duration: 0.5, repeatType: 'reverse' }}
                          className="absolute bottom-2 right-2 text-2xl z-20"
                        >
                          👆
                        </motion.div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="w-full py-2 bg-slate-900 text-white text-[9px] font-black rounded-lg flex items-center justify-center gap-1 shadow-sm">
                        <span>পেমেন্ট করুন (৳{selectedSimPack?.salePrice || 349})</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TUTORIAL STEP 3: Payment Screen */}
                {tutStep === 3 && (
                  <div className="flex-1 flex flex-col justify-between py-1 text-left">
                    <div className="space-y-3">
                      <span className="text-[8px] font-black uppercase text-slate-900 tracking-wider block">ধাপ ০৩: পেমেন্ট গেটওয়ে</span>

                      <p className="text-[8px] text-slate-400 font-bold leading-normal">
                        বিকাশ, রকেট, নগদ, অথবা যেকোনো ব্যাংকিং চ্যানেলের মাধ্যমে সিকিউর পেমেন্ট করুন।
                      </p>

                      <div className="grid grid-cols-3 gap-1.5">
                        <div className="bg-white border border-slate-200 rounded-lg p-1.5 flex flex-col items-center justify-center relative shadow-sm">
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
                          <BKashLogo className="w-7 h-7" />
                          <span className="text-[6px] font-black text-slate-700 mt-1">bKash</span>
                          
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ repeat: Infinity, duration: 0.6 }}
                            className="absolute bottom-[-10px] right-[-5px] text-xl z-20"
                          >
                            👆
                          </motion.div>
                        </div>
                        
                        <div className="bg-white/90 border border-slate-100 rounded-lg p-1.5 opacity-60 flex flex-col items-center justify-center shadow-sm">
                          <NagadLogo className="w-7 h-7" />
                          <span className="text-[6px] font-black text-slate-700 mt-1">Nagad</span>
                        </div>

                        <div className="bg-white/90 border border-slate-100 rounded-lg p-1.5 opacity-60 flex flex-col items-center justify-center shadow-sm">
                          <RocketLogo className="w-7 h-7" />
                          <span className="text-[6px] font-black text-slate-700 mt-1">Rocket</span>
                        </div>
                      </div>

                      {/* Loader element */}
                      <div className="pt-2 flex items-center justify-center gap-2">
                        <RotateCcw className="w-3.5 h-3.5 text-slate-900 animate-spin" />
                        <span className="text-[8px] font-bold text-slate-400">অর্ডার ভেরিফাই করা হচ্ছে...</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg text-center text-[7px] text-slate-400 font-bold">
                      🔐 100% Secure SSL Encrypted Gateway
                    </div>
                  </div>
                )}

                {/* TUTORIAL STEP 4: Success Screen */}
                {tutStep === 4 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-2 -short">
                    <div className="w-11 h-11 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center relative">
                      <Check className="w-6 h-6 text-slate-900" />
                      <Sparkles className="w-4 h-4 text-amber-400 absolute top-[-5px] right-[-5px] animate-spin" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full font-black uppercase tracking-wider">
                        রিচার্জ সফল হয়েছে!
                      </span>
                      <h4 className="text-sm font-black text-white leading-tight">অভিনন্দন!</h4>
                      <p className="text-[8px] text-slate-400 font-bold leading-normal max-w-[170px] mx-auto">
                        আপনার {selectedSimPack?.title || '২৫ জিবি মেগা'} প্যাকটি সফলভাবে <span className="text-white font-mono">{simulatedMobile || '০১৭৮৯৪৫৬১২৩'}</span> নাম্বারে চালু হয়েছে।
                      </p>
                    </div>

                    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-left space-y-1 font-sans text-[7px]">
                      <div className="flex justify-between text-slate-400">
                        <span>Transaction ID:</span>
                        <span className="text-white font-bold font-mono">FAHIM82947192</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Amount Paid:</span>
                        <span className="text-slate-900 font-black">৳{selectedSimPack?.salePrice || 349}</span>
                      </div>
                    </div>

                    <p className="text-[7px] text-slate-500 font-bold italic ">
                      পুনরায় টিউটোরিয়াল শুরু হচ্ছে...
                    </p>
                  </div>
                )}

              </motion.div>
            )) : (
              /* LIVE SALES FEED MODE */
              <motion.div 
                key="live-feed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between h-full text-left"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase text-slate-900 tracking-wider">রিয়েল-টাইম অর্ডার ফিড</span>
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-slate-900"></span>
                    </span>
                  </div>

                  {/* Scrolling Feed Container */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5">
                    <AnimatePresence>
                      {liveOrders.map((order) => (
                        <motion.div 
                          key={order.id}
                          layout
                          initial={{ opacity: 0, x: -10, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-slate-900/60 border border-slate-850 p-2 rounded-xl flex items-center justify-between gap-2 hover:border-slate-800 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {/* Operator Icon Representation */}
                            <div className="w-6 h-6 rounded-lg bg-slate-950 flex items-center justify-center flex-shrink-0 text-[7px] font-black border border-slate-800">
                              {order.operator === 'GP' && <span className="text-[#00a1e4]">GP</span>}
                              {order.operator === 'Robi' && <span className="text-[#dc2626]">Robi</span>}
                              {order.operator === 'Banglalink' && <span className="text-[#f97316]">BL</span>}
                              {order.operator === 'Airtel' && <span className="text-[#e11d48]">Air</span>}
                              {order.operator === 'Teletalk' && <span className="text-slate-900">TT</span>}
                            </div>
                            
                            <div className="space-y-0.5">
                              <p className="text-[9px] font-black font-mono text-white leading-none">{order.number}</p>
                              <p className="text-[7px] text-slate-400 font-bold leading-none">{order.packName}</p>
                            </div>
                          </div>

                          <div className="text-right space-y-0.5">
                            <span className="text-[9px] font-black text-slate-900 block leading-none">৳{order.price}</span>
                            <span className="text-[6px] text-slate-500 font-bold block leading-none">{order.timeAgo}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="bg-slate-900/10 border border-[#0f172a]/20 p-2 rounded-xl text-center space-y-1 mt-2">
                  <span className="text-[8px] font-black text-slate-900 uppercase tracking-wider block">১০০% অটোমেটিক ডেলিভারি</span>
                  <p className="text-[7px] text-slate-400 font-bold leading-normal">
                    আমাদের ওয়েবসাইট ও অ্যাপ থেকে করা প্রতিটি রিচার্জ পেমেন্ট সম্পূর্ণ হওয়ার ১ মিনিটের মধ্যে স্বয়ংক্রিয়ভাবে প্রদান করা হয়।
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Playback Progress Indicator Bar / Footer */}
        <div className="flex justify-between items-center text-[7px] text-slate-500 font-bold border-t border-slate-900 pt-2 px-1 relative z-10">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-ping" />
            <span>Interactive Guide</span>
          </div>
          <span>FAHIM INTERNET V2.0</span>
        </div>

      </div>
    </div>
  );
}

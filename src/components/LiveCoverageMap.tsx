import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Search, 
  Activity, 
  Wifi, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  Globe
} from 'lucide-react';

interface CoverageNode {
  id: string;
  nameBn: string;
  nameEn: string;
  lat: number; // For rendering inside 0-100 grid coords
  lng: number; // For rendering inside 0-100 grid coords
  activeUsers: number;
  baseLatency: number;
  operators: {
    GP: string;
    Robi: string;
    BL: string;
    Airtel: string;
    Teletalk: string;
  };
  status: 'operational' | 'congested' | 'maintenance';
}

const COVERAGE_NODES: CoverageNode[] = [
  {
    id: 'dhaka',
    nameBn: 'ঢাকা',
    nameEn: 'Dhaka',
    lat: 52,
    lng: 50,
    activeUsers: 48920,
    baseLatency: 8,
    operators: { GP: 'strong', Robi: 'strong', BL: 'strong', Airtel: 'medium', Teletalk: 'medium' },
    status: 'operational'
  },
  {
    id: 'chittagong',
    nameBn: 'চট্টগ্রাম',
    nameEn: 'Chittagong',
    lat: 78,
    lng: 78,
    activeUsers: 32410,
    baseLatency: 14,
    operators: { GP: 'strong', Robi: 'strong', BL: 'medium', Airtel: 'strong', Teletalk: 'weak' },
    status: 'operational'
  },
  {
    id: 'sylhet',
    nameBn: 'সিলেট',
    nameEn: 'Sylhet',
    lat: 30,
    lng: 76,
    activeUsers: 18230,
    baseLatency: 16,
    operators: { GP: 'strong', Robi: 'strong', BL: 'weak', Airtel: 'medium', Teletalk: 'medium' },
    status: 'operational'
  },
  {
    id: 'rajshahi',
    nameBn: 'রাজশাহী',
    nameEn: 'Rajshahi',
    lat: 38,
    lng: 25,
    activeUsers: 15480,
    baseLatency: 12,
    operators: { GP: 'strong', Robi: 'medium', BL: 'strong', Airtel: 'weak', Teletalk: 'medium' },
    status: 'operational'
  },
  {
    id: 'khulna',
    nameBn: 'খুলনা',
    nameEn: 'Khulna',
    lat: 72,
    lng: 34,
    activeUsers: 14120,
    baseLatency: 15,
    operators: { GP: 'medium', Robi: 'strong', BL: 'strong', Airtel: 'medium', Teletalk: 'weak' },
    status: 'operational'
  },
  {
    id: 'barisal',
    nameBn: 'বরিশাল',
    nameEn: 'Barisal',
    lat: 74,
    lng: 51,
    activeUsers: 9840,
    baseLatency: 16,
    operators: { GP: 'strong', Robi: 'medium', BL: 'medium', Airtel: 'weak', Teletalk: 'medium' },
    status: 'operational'
  },
  {
    id: 'rangpur',
    nameBn: 'রংপুর',
    nameEn: 'Rangpur',
    lat: 16,
    lng: 32,
    activeUsers: 11950,
    baseLatency: 18,
    operators: { GP: 'strong', Robi: 'medium', BL: 'medium', Airtel: 'weak', Teletalk: 'medium' },
    status: 'operational'
  },
  {
    id: 'mymensingh',
    nameBn: 'ময়মনসিংহ',
    nameEn: 'Mymensingh',
    lat: 32,
    lng: 52,
    activeUsers: 10410,
    baseLatency: 11,
    operators: { GP: 'strong', Robi: 'strong', BL: 'medium', Airtel: 'medium', Teletalk: 'medium' },
    status: 'operational'
  },
  {
    id: 'comilla',
    nameBn: 'কুমিল্লা',
    nameEn: 'Comilla',
    lat: 61,
    lng: 66,
    activeUsers: 12450,
    baseLatency: 11,
    operators: { GP: 'strong', Robi: 'strong', BL: 'strong', Airtel: 'medium', Teletalk: 'weak' },
    status: 'operational'
  },
  {
    id: 'bogura',
    nameBn: 'বগুড়া',
    nameEn: 'Bogura',
    lat: 32,
    lng: 36,
    activeUsers: 9150,
    baseLatency: 13,
    operators: { GP: 'strong', Robi: 'medium', BL: 'strong', Airtel: 'medium', Teletalk: 'medium' },
    status: 'operational'
  },
  {
    id: 'coxsbazar',
    nameBn: 'কক্সবাজার',
    nameEn: "Cox's Bazar",
    lat: 91,
    lng: 85,
    activeUsers: 8490,
    baseLatency: 20,
    operators: { GP: 'strong', Robi: 'strong', BL: 'medium', Airtel: 'medium', Teletalk: 'weak' },
    status: 'operational'
  },
  {
    id: 'jessore',
    nameBn: 'যশোর',
    nameEn: 'Jessore',
    lat: 66,
    lng: 28,
    activeUsers: 7920,
    baseLatency: 14,
    operators: { GP: 'medium', Robi: 'strong', BL: 'strong', Airtel: 'weak', Teletalk: 'medium' },
    status: 'operational'
  }
];

const RECENT_PACK_OPTIONS = [
  'GP 30 GB + 700 Min Combo',
  'Robi Unlimited Internet 30 Days',
  'Banglalink 10 GB Local Pack',
  'Airtel 500 Minutes Booster',
  'Teletalk 40 GB Student Pack',
  'GP Family Combo 80 GB',
  'Robi 15 GB Dedicated Offer',
  'Banglalink Special 800 Min'
];

const RECENT_METHOD_OPTIONS = ['Bkash', 'Nagad', 'Rocket', 'Upay'];

interface SimulatedPing {
  id: string;
  node: CoverageNode;
  pack: string;
  method: string;
  timestamp: string;
}

export default function LiveCoverageMap() {
  const [selectedNode, setSelectedNode] = useState<CoverageNode>(COVERAGE_NODES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabMode, setActiveTabMode] = useState<'status' | 'heatmap' | 'operators'>('status');
  
  // Interactive network diagnosis state
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [nationalUptime, setNationalUptime] = useState(99.98);
  const [totalTraffic, setTotalTraffic] = useState(194830);

  // Live order pings simulation
  const [livePings, setLivePings] = useState<SimulatedPing[]>([]);
  const [recentLog, setRecentLog] = useState<SimulatedPing[]>([]);

  // Fluctuating ping state to make it look truly live
  const [liveLatency, setLiveLatency] = useState(selectedNode.baseLatency);

  useEffect(() => {
    // Generate some initial logs
    const initialLogs: SimulatedPing[] = Array.from({ length: 4 }).map((_, i) => {
      const node = COVERAGE_NODES[Math.floor(Math.random() * COVERAGE_NODES.length)];
      const pack = RECENT_PACK_OPTIONS[Math.floor(Math.random() * RECENT_PACK_OPTIONS.length)];
      const method = RECENT_METHOD_OPTIONS[Math.floor(Math.random() * RECENT_METHOD_OPTIONS.length)];
      return {
        id: `ping-${Date.now()}-${i}`,
        node,
        pack,
        method,
        timestamp: `${i + 1} মিনিট আগে`
      };
    });
    setRecentLog(initialLogs);
  }, []);

  // Set up live intervals for ping fluctuations and simulation
  useEffect(() => {
    // Latency fluctuation
    const latencyInterval = setInterval(() => {
      setLiveLatency(prev => {
        const diff = (Math.random() * 4 - 2); // +/- 2ms
        const next = Math.max(2, Math.round(selectedNode.baseLatency + diff));
        return next;
      });
    }, 1500);

    // Dynamic stats fluctuation
    const statsInterval = setInterval(() => {
      setNationalUptime(prev => {
        const change = (Math.random() * 0.02 - 0.01);
        return parseFloat(Math.min(100, Math.max(99.9, prev + change)).toFixed(3));
      });
      setTotalTraffic(prev => {
        const change = Math.floor(Math.random() * 15 - 5);
        return prev + change;
      });
    }, 3000);

    // Live order ping simulation
    const pingInterval = setInterval(() => {
      const node = COVERAGE_NODES[Math.floor(Math.random() * COVERAGE_NODES.length)];
      const pack = RECENT_PACK_OPTIONS[Math.floor(Math.random() * RECENT_PACK_OPTIONS.length)];
      const method = RECENT_METHOD_OPTIONS[Math.floor(Math.random() * RECENT_METHOD_OPTIONS.length)];
      
      const newPing: SimulatedPing = {
        id: `ping-${Date.now()}-${Math.random()}`,
        node,
        pack,
        method,
        timestamp: 'এইমাত্র'
      };

      // Set live ping trigger
      setLivePings(prev => [newPing, ...prev.slice(0, 2)]);
      
      // Append to local log
      setRecentLog(prev => {
        const updated = [newPing, ...prev.map(p => {
          if (p.timestamp === 'এইমাত্র') return { ...p, timestamp: '১ মিনিট আগে' };
          if (p.timestamp.includes('মিনিট')) {
            const min = parseInt(p.timestamp);
            return { ...p, timestamp: `${min + 1} মিনিট আগে` };
          }
          return p;
        })];
        return updated.slice(0, 8);
      });
    }, 7000);

    return () => {
      clearInterval(latencyInterval);
      clearInterval(statsInterval);
      clearInterval(pingInterval);
    };
  }, [selectedNode]);

  // Adjust live latency when selected node changes
  useEffect(() => {
    setLiveLatency(selectedNode.baseLatency);
    setScanResult(null);
  }, [selectedNode]);

  const handleDiagnose = () => {
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setScanning(false);
      setScanResult({
        quality: Math.random() > 0.15 ? 'Excellent' : 'Good',
        packetLoss: '0.00%',
        routeHop: '4 Hops via Dhaka Hub',
        statusText: 'সকল অপারেটর সিগন্যাল শতভাগ সক্রিয় এবং সর্বোচ্চ স্পিড লিমিট উন্মুক্ত আছে।'
      });
    }, 1800);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const lower = searchQuery.toLowerCase().trim();
    const found = COVERAGE_NODES.find(
      node => 
        node.nameEn.toLowerCase().includes(lower) || 
        node.nameBn.includes(lower)
    );

    if (found) {
      setSelectedNode(found);
    } else {
      alert(`দুঃখিত! "${searchQuery}" কভারেজ নোড হিসেবে সরাসরি নিবন্ধিত নেই। তবে এর আশেপাশের নোড সমূহে ফাহিম ইন্টারনেটের সেবা সক্রিয় আছে!`);
    }
  };

  return (
    <div className="bg-[#050C16] border border-slate-800 rounded-xl p-6 lg:p-10 text-slate-200 shadow-md relative overflow-hidden select-none" id="live-coverage-main-box">
      
      {/* Dynamic tech canvas background lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* TOP HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6 relative z-10">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span>Live Telecom Monitoring System v3.1</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            লাইভ কভারেজ ও <span className="text-emerald-400">অর্ডার ফিডব্যাক</span>
          </h2>
          <p className="text-xs text-slate-400 font-bold leading-relaxed max-w-xl">
            বাংলাদেশের সকল জেলা ও উপজেলায় ফাহিম ইন্টারনেটের রিচার্জ নোড ও সিগন্যাল কোয়ালিটি লাইভ মনিটর করুন।
          </p>
        </div>

        {/* Global Live Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-5 bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
          <div className="text-left space-y-0.5">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">জাতীয় আপটাইম</span>
            <span className="text-sm md:text-base font-black font-mono text-emerald-400">{nationalUptime}%</span>
          </div>
          <div className="text-left space-y-0.5 border-l border-slate-800 pl-3 md:pl-5">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">সক্রিয় ইউজার</span>
            <span className="text-sm md:text-base font-black font-mono text-blue-400">{totalTraffic.toLocaleString()}</span>
          </div>
          <div className="text-left space-y-0.5 border-l border-slate-800 pl-3 md:pl-5">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">নেটওয়ার্ক লেটেন্সি</span>
            <span className="text-sm md:text-base font-black font-mono text-amber-400">{liveLatency}ms</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND VISUAL TOGGLES BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 relative z-10">
        {/* Search Division / District */}
        <form onSubmit={handleSearch} className="w-full sm:max-w-xs relative">
          <input 
            type="text" 
            placeholder="আপনার জেলা বা নোড লিখুন (যেমন: কুমিল্লা)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-9 pr-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-black text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </form>

        {/* Mode Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 border border-slate-800 rounded-xl w-full sm:w-auto">
          {[
            { id: 'status', label: 'সিগন্যাল কভারেজ', icon: <Wifi className="w-3.5 h-3.5" /> },
            { id: 'heatmap', label: 'ট্রাফিক ডেনসিটি', icon: <Activity className="w-3.5 h-3.5" /> },
            { id: 'operators', label: 'অপারেটর লেটেন্সি', icon: <Database className="w-3.5 h-3.5" /> }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveTabMode(mode.id as any)}
              className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-lg text-[10px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTabMode === mode.id 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CORE MAP & STATS CONTENT SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 relative z-10 items-stretch">
        
        {/* LEFT COLUMN: THE INTERACTIVE MAP STAGE (7/12) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950/40 border border-slate-800 rounded-xl p-5 relative overflow-hidden min-h-[460px] md:min-h-[500px]">
          
          {/* Subtle diagnostic grids */}
          <div className="absolute top-4 left-4 flex flex-col space-y-1 text-left text-[9px] font-mono text-slate-400">
            <span>PING HOST: api.fahimnet.net</span>
            <span>SYSTEM: ONLINE (AUTO)</span>
            <span>GRID SYSTEM: 100x120 RES</span>
          </div>

          <div className="absolute top-4 right-4 text-right text-[9px] font-mono text-slate-400">
            <span>ACTIVE MARKERS: {COVERAGE_NODES.length}</span>
            <span className="block text-emerald-500">GPS SYNC: COMPLETED</span>
          </div>

          {/* Map Container Stage */}
          <div className="flex-grow flex items-center justify-center relative my-6 min-h-[300px]">
            
            {/* Holographic scanner laser line effect */}
            <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30 animate-[bounce_6s_infinite] pointer-events-none" />

            {/* Simulated Live Order Ping Overlay Alert */}
            <AnimatePresence>
              {livePings.map((ping) => (
                <motion.div
                  key={ping.id}
                  initial={{ opacity: 0, scale: 0.8, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -15 }}
                  transition={{ duration: 0.4 }}
                  style={{ 
                    top: `${ping.node.lat - 15}%`, 
                    left: `${ping.node.lng - 32}%` 
                  }}
                  className="absolute z-40 flex items-center gap-2 bg-emerald-600/90 backdrop-blur-md text-white py-1.5 px-3 rounded-full text-[9px] font-black border border-emerald-400 shadow-md pointer-events-none shadow-emerald-950/50"
                >
                  <Zap className="w-3 h-3 animate-bounce" />
                  <span>{ping.node.nameBn} - এ {ping.pack.split(' ')[0]} এর অফার ক্রয় করা হয়েছে ({ping.method})</span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* The SVG Outline Map of Bangladesh */}
            <svg 
              viewBox="0 0 100 120" 
              className={`w-[85%] md:w-[75%] h-auto transition-colors duration-500 ${
                activeTabMode === 'heatmap' 
                  ? 'text-emerald-950/20 stroke-emerald-500/20' 
                  : 'text-emerald-400/60 stroke-slate-800/80'
              } fill-current stroke-1`}
            >
              {/* High precision aesthetic raw outline path */}
              <path d="M 50,5 C 62,8 71,11 80,18 C 86,24 81,34 88,41 C 93,48 91,59 86,67 C 81,74 86,81 83,89 C 79,97 66,99 61,107 C 56,111 51,117 46,114 C 41,111 43,97 39,91 C 35,87 29,84 23,79 C 19,71 16,61 19,51 C 23,41 21,31 26,24 C 33,17 41,11 50,5 Z" />
            </svg>

            {/* Connection mesh lines if heat map mode is active */}
            {activeTabMode === 'heatmap' && (
              <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <line x1="50" y1="52" x2="78" y2="78" stroke="#10b981" strokeWidth="0.25" strokeDasharray="1,1" />
                <line x1="50" y1="52" x2="30" y2="76" stroke="#10b981" strokeWidth="0.25" strokeDasharray="1,1" />
                <line x1="50" y1="52" x2="38" y2="25" stroke="#10b981" strokeWidth="0.25" strokeDasharray="1,1" />
                <line x1="50" y1="52" x2="72" y2="34" stroke="#10b981" strokeWidth="0.25" strokeDasharray="1,1" />
                <line x1="50" y1="52" x2="32" y2="52" stroke="#10b981" strokeWidth="0.25" strokeDasharray="1,1" />
                <line x1="78" y1="78" x2="91" y2="85" stroke="#10b981" strokeWidth="0.25" strokeDasharray="1,1" />
                <line x1="38" y1="25" x2="32" y2="36" stroke="#10b981" strokeWidth="0.25" strokeDasharray="1,1" />
              </svg>
            )}

            {/* PULSING INTERACTIVE NODE MARKERS */}
            {COVERAGE_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              
              // Custom heat color depending on mode
              let markerColor = 'bg-emerald-500';
              let ringColor = 'bg-emerald-500';
              let borderClass = 'border-white';
              
              if (activeTabMode === 'heatmap') {
                if (node.activeUsers > 30000) {
                  markerColor = 'bg-rose-500';
                  ringColor = 'bg-rose-500';
                } else if (node.activeUsers > 15000) {
                  markerColor = 'bg-amber-500';
                  ringColor = 'bg-amber-500';
                } else {
                  markerColor = 'bg-emerald-500';
                  ringColor = 'bg-emerald-500';
                }
              } else if (activeTabMode === 'operators') {
                markerColor = 'bg-blue-500';
                ringColor = 'bg-blue-400';
              }

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ top: `${node.lat}%`, left: `${node.lng}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/node cursor-pointer p-2 transition-transform duration-300 hover:scale-[1.3]"
                >
                  <div className="relative">
                    {/* Ring Pulse */}
                    <span className={`absolute inline-flex h-6 w-6 rounded-full ${ringColor} opacity-40 animate-ping -left-1.5 -top-1.5`} />
                    
                    {/* Static Dot */}
                    <span className={`relative flex rounded-full h-3 w-3 ${markerColor} border-2 ${isSelected ? 'border-white scale-125' : 'border-slate-200'} shadow-md`} />
                    
                    {/* Quick name badge on desktop */}
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[8px] font-black transition-all bg-slate-900 border border-slate-800 text-emerald-400 group-hover/node:opacity-100 ${
                      isSelected ? 'opacity-100 text-white border-emerald-500' : 'opacity-40'
                    }`}>
                      {node.nameBn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Node Selector Slider Footer */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-slate-900/60 pt-4 scrollbar-thin scrollbar-thumb-slate-800">
            {COVERAGE_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-black whitespace-nowrap border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-600/25 border-emerald-500 text-emerald-300 shadow-sm' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  📍 {node.nameBn} ({node.nameEn})
                </button>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: DETAILED DIAGNOSTIC & SIMULATED PURCHASE FEEDS (5/12) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          
          {/* NODE METRICS PANEL */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-6 text-left space-y-5 flex-grow">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="space-y-0.5">
                <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wider">SELECTED AREA MATRIX</span>
                <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                  <MapPin className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                  <span>{selectedNode.nameBn} নোড কভারেজ ({selectedNode.nameEn})</span>
                </h3>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase">
                ACTIVE
              </span>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">সক্রিয় ব্যবহারকারী</span>
                <strong className="text-sm font-black text-white block font-mono">
                  {selectedNode.activeUsers.toLocaleString()} Users
                </strong>
                <span className="text-[9px] text-emerald-500 font-semibold">● Real-time Live load</span>
              </div>

              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">সিগন্যাল লেটেন্সি</span>
                <strong className="text-sm font-black font-mono text-amber-400 block">
                  {liveLatency} ms (Avg)
                </strong>
                <span className="text-[9px] text-slate-400 font-semibold">100% Signal Path Ping</span>
              </div>
            </div>

            {/* Operators Signal Quality List */}
            <div className="space-y-2 pt-1">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">অপারেটর সিগন্যাল কোয়ালিটি (Signal Quality)</h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-300">
                {Object.entries(selectedNode.operators).map(([op, strength]) => {
                  const isStrong = strength === 'strong';
                  const isMedium = strength === 'medium';
                  return (
                    <div key={op} className="flex items-center justify-between p-2.5 bg-slate-950/40 border border-slate-800 rounded-lg">
                      <span className="font-extrabold">{op === 'BL' ? 'Banglalink' : op}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        isStrong 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : isMedium 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {strength === 'strong' ? 'Strong' : strength === 'medium' ? 'Good' : 'Moderate'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SIGNAL TEST BUTTON */}
            <div className="pt-2 border-t border-slate-900 space-y-4">
              {scanning ? (
                <div className="w-full py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center gap-2 text-xs font-black">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span>সিগন্যাল প্যাথ মনিটর করা হচ্ছে...</span>
                </div>
              ) : (
                <button
                  onClick={handleDiagnose}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-emerald-950/20"
                >
                  <Activity className="w-4 h-4" />
                  <span>সিগন্যাল স্পিড ও পিং পরীক্ষা করুন</span>
                </button>
              )}

              {/* Scan result simulation */}
              {scanResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h5 className="text-xs font-black text-emerald-300">সিগন্যাল কানেকশন স্ট্যাবল (১০০%)</h5>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                    {scanResult.statusText} ফাহিম ইন্টারনেটের রিচার্জ সার্ভারের সাথে এই নোডের বর্তমান পিং রেট <strong className="text-amber-400 font-mono font-black">{liveLatency}ms</strong> যা বাফার-ফ্রি টেলিকম ডাটা সক্রিয়করণের জন্য আদর্শ।
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* REAL-TIME SIMULATED RECENT LIVE FEED */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 text-left space-y-4 h-[190px] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
              <h4 className="text-xs font-black text-slate-300 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>লাইভ রিয়েল-টাইম অর্ডার ফিডব্যাক</span>
              </h4>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Auto Scrolling dynamic purchases list */}
            <div className="flex-grow overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-900">
              {recentLog.map((log) => (
                <div key={log.id} className="flex items-center justify-between gap-3 text-[10px] font-bold py-1.5 border-b border-slate-800">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-white font-mono truncate max-w-[210px]">{log.pack.split(' ')[0]} {log.pack.includes('Combo') ? 'Combo' : log.pack.includes('Internet') ? 'Data' : 'Minutes'} - {log.node.nameBn}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-emerald-500 font-mono text-[9px]">{log.timestamp}</span>
                    <span className="px-1.5 py-0.2 bg-slate-900 text-[9px] text-slate-400 font-black rounded border border-slate-800 font-sans uppercase">
                      {log.method}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

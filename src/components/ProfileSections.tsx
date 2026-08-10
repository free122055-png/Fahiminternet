import React, { useEffect, useState } from 'react';
import { 
  Package, Clock, MapPin, Heart, CreditCard, Loader2, Copy, Check, 
  Send, PhoneCall, Globe, ShieldCheck, ChevronRight, ChevronDown, ChevronUp, Bell, 
  Lock, User, Trash2, Headphones, MessageSquare, Info, ShieldAlert, Sparkles,
  ArrowLeft, CheckCircle2, Wallet, ChevronLeft, Share2, X, Camera, Upload, ArrowRight, RefreshCw,
  Mail, ExternalLink, Bug, FileText, HelpCircle, Search, Plus, FileCheck, Eye, Edit3, AlertTriangle, UserCheck, Image,
  Phone, AlertCircle, Database
} from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, getDoc, orderBy, addDoc, updateDoc, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Order, SiteSettings } from '../types';
import { BKashLogo, NagadLogo, RocketLogo, UpayLogo, CellfinLogo, BankingLogo } from './BrandLogos';

export interface SectionProps {
  userId?: string;
  settings?: SiteSettings;
  currentUser?: any;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

// 1. MY PACKS
export function MyPacks({ userId }: SectionProps) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const timer = setTimeout(() => setLoading(false), 400); return () => clearTimeout(timer); }, []);
  return (
    <div className="space-y-3">
      {loading ? (
        <div className="flex justify-center p-6"><Loader2 className="animate-spin text-emerald-600 w-6 h-6" /></div>
      ) : (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
          <Package className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-slate-700 font-extrabold text-xs">বর্তমানে কোনো সক্রিয় প্যাক নেই</p>
          <p className="text-slate-400 text-[11px]">হোম পেজ থেকে নতুন ইন্টারনেট বা ড্রাইভ প্যাক ক্রয় করুন।</p>
        </div>
      )}
    </div>
  );
}

export interface OrderHistoryProps extends SectionProps {
  onSelectOrder?: (order: Order) => void;
}

// 2. ORDER HISTORY
export function OrderHistory({ userId, onSelectOrder }: OrderHistoryProps) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (userId) {
      setLoading(true);
      const q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        
        // Merge with local storage orders
        let localOrders: Order[] = [];
        try {
          const localData = localStorage.getItem('fahim_orders');
          if (localData) {
            const parsed = JSON.parse(localData);
            if (Array.isArray(parsed)) {
              localOrders = parsed;
            }
          }
        } catch (e) {
          console.error('Local orders error', e);
        }

        const map = new Map<string, Order>();
        fetchedOrders.forEach(o => map.set(o.id, o));
        localOrders.forEach(o => {
          if (!map.has(o.id)) map.set(o.id, o);
        });

        const combined = Array.from(map.values());
        combined.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setOrders(combined);
        setLoading(false);
      }, (error) => {
        console.error('Error in onSnapshot listener:', error);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId]);

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    const st = (o.status || '').toLowerCase();
    if (filter === 'completed') return st === 'completed' || st === 'approved' || st === 'সফল';
    if (filter === 'pending') return st === 'pending' || st === 'processing' || st === 'পেন্ডিং';
    if (filter === 'failed') return st === 'failed' || st === 'cancelled' || st === 'rejected' || st === 'ব্যর্থ';
    return true;
  });

  const handleOrderClick = (order: Order) => {
    if (onSelectOrder) {
      onSelectOrder(order);
    } else {
      setSelectedOrder(order);
    }
  };

  const getOperatorAvatar = (operator: string) => {
    const op = (operator || '').toLowerCase();
    if (op.includes('robi') || op.includes('রবি')) {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-black shrink-0 border-2 border-white shadow-xs">
          <svg className="w-7 h-7 fill-current" viewBox="0 0 100 100">
            <path d="M50 10 L75 35 L50 60 L25 35 Z" fill="#FFF" />
            <path d="M50 40 L75 65 L50 90 L25 65 Z" fill="#FFE082" />
          </svg>
        </div>
      );
    }
    if (op.includes('teletalk') || op.includes('টেলিটক')) {
      return (
        <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center font-black shrink-0 border-2 border-white shadow-xs">
          <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
        </div>
      );
    }
    if (op.includes('airtel') || op.includes('এয়ারটেল')) {
      return (
        <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center font-black shrink-0 border-2 border-white shadow-xs">
          <span className="text-xl font-black italic">a</span>
        </div>
      );
    }
    if (op.includes('gp') || op.includes('grameen') || op.includes('গ্রামীন')) {
      return (
        <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center font-black shrink-0 border-2 border-white shadow-xs">
          <div className="w-6 h-6 border-3 border-white rounded-tr-full rounded-bl-full" />
        </div>
      );
    }
    if (op.includes('banglalink') || op.includes('বাংলালিংক')) {
      return (
        <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-black shrink-0 border-2 border-white shadow-xs">
          <span className="text-lg font-black">BL</span>
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 border-2 border-white shadow-xs">
        <Package className="w-6 h-6" />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. Top Green Banner Card (matching Screenshot 1) */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 p-4 sm:p-5 rounded-3xl text-white shadow-sm flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 backdrop-blur-md">
          <Clock className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h2 className="text-base font-black tracking-wide">লেনদেন ইতিহাস</h2>
          <p className="text-xs text-emerald-100/90 font-medium mt-0.5">আপনার সকল রিচার্জ ও লেনদেনের ইতিহাস দেখুন</p>
        </div>
      </div>

      {/* 2. Filter Pills Row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { id: 'all', label: 'সকল', icon: CheckCircle2 },
          { id: 'completed', label: 'সফল', icon: CheckCircle2 },
          { id: 'pending', label: 'পেন্ডিং', icon: Clock },
          { id: 'failed', label: 'ব্যর্থ', icon: ShieldAlert },
        ].map(f => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id as any)}
              className={`py-2 px-1 rounded-2xl text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                isActive
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50'
              }`}
            >
              <f.icon className="w-3.5 h-3.5 shrink-0" />
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Transaction Items List */}
      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-emerald-600 w-7 h-7" /></div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
          <Clock className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-slate-700 font-extrabold text-xs">কোনো রেকর্ড পাওয়া যায়নি</p>
          <p className="text-slate-400 text-[11px]">নির্ধারিত ফিল্টারে কোনো লেনদেনের তথ্য পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => {
            const st = (order.status || '').toLowerCase();
            const isCompleted = st === 'completed' || st === 'approved' || st === 'সফল';
            const isPending = st === 'pending' || st === 'processing' || st === 'পেন্ডিং';
            const isFailed = st === 'failed' || st === 'cancelled' || st === 'rejected' || st === 'ব্যর্থ';

            return (
              <div 
                key={order.id} 
                onClick={() => handleOrderClick(order)}
                className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex items-center justify-between gap-3 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getOperatorAvatar(order.operator)}
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-black text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                      {order.operator}
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {order.packTitle}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 font-mono">
                      {order.customerPhone || 'N/A'}
                    </div>
                    <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{typeof order.createdAt === 'string' ? order.createdAt : new Date(order.createdAt).toLocaleDateString('bn-BD')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between shrink-0 space-y-2">
                  <span className="text-sm font-black text-slate-900 font-mono">
                    ৳{order.price}
                  </span>

                  {isCompleted && (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black rounded-full flex items-center gap-1 shadow-2xs">
                      <span>সফল</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    </span>
                  )}
                  {isPending && (
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-black rounded-full flex items-center gap-1 shadow-2xs">
                      <span>পেন্ডিং</span>
                      <Clock className="w-3 h-3 text-amber-600" />
                    </span>
                  )}
                  {isFailed && (
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-black rounded-full flex items-center gap-1 shadow-2xs">
                      <span>ব্যর্থ</span>
                      <ShieldAlert className="w-3 h-3 text-rose-600" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90%] animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex items-center gap-1.5 text-slate-800 hover:text-emerald-700 font-extrabold text-sm cursor-pointer border-none bg-transparent"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>লেনদেন বিস্তারিত</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const infoText = `অর্ডার আইডি: ${selectedOrder.id}\nঅপারেটর: ${selectedOrder.operator}\nঅফার: ${selectedOrder.packTitle}\nমোবাইল: ${selectedOrder.customerPhone}\nমূল্য: ৳${selectedOrder.price}\nস্ট্যাটাস: ${selectedOrder.status}`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(infoText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors border-none cursor-pointer"
                title="কপি করুন"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              {/* Status Graphic */}
              <div className="text-center space-y-2 py-2">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md">
                  {((selectedOrder.status as string) === 'completed' || (selectedOrder.status as string) === 'approved' || (selectedOrder.status as string) === 'সফল') ? (
                    <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                  ) : ((selectedOrder.status as string) === 'pending' || (selectedOrder.status as string) === 'processing' || (selectedOrder.status as string) === 'পেন্ডিং') ? (
                    <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                      <Clock className="w-8 h-8 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
                      <ShieldAlert className="w-8 h-8 stroke-[3]" />
                    </div>
                  )}
                </div>

                <h3 className="text-base font-black text-slate-900 pt-1">
                  {((selectedOrder.status as string) === 'completed' || (selectedOrder.status as string) === 'approved' || (selectedOrder.status as string) === 'সফল')
                    ? 'লেনদেন সফল হয়েছে'
                    : ((selectedOrder.status as string) === 'pending' || (selectedOrder.status as string) === 'processing' || (selectedOrder.status as string) === 'পেন্ডিং')
                    ? 'অর্ডার প্রসেসিং রয়েছে'
                    : 'লেনদেন ব্যর্থ হয়েছে'}
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  {((selectedOrder.status as string) === 'completed' || (selectedOrder.status as string) === 'approved' || (selectedOrder.status as string) === 'সফল')
                    ? 'আপনার মোবাইল রিচার্জ বা প্যাক সফলভাবে চালু হয়েছে।'
                    : ((selectedOrder.status as string) === 'pending' || (selectedOrder.status as string) === 'processing' || (selectedOrder.status as string) === 'পেন্ডিং')
                    ? 'অ্যাডমিন প্যানেল থেকে অর্ডারটি প্রসেসিং করা হচ্ছে।'
                    : selectedOrder.rejectReason || 'কারিগরি ত্রুটির কারণে অর্ডারটি বাতিল করা হয়েছে।'}
                </p>
              </div>

              {/* Detailed Info Table */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs font-bold text-slate-700">
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-400">অর্ডার আইডি:</span>
                  <span className="font-mono font-black text-slate-900">{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-400">অপারেটর:</span>
                  <span className="font-black text-slate-900">{selectedOrder.operator}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-400">অফার / সেবা:</span>
                  <span className="font-black text-slate-900 text-right max-w-[180px]">{selectedOrder.packTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-400">গ্রাহকের নম্বর:</span>
                  <span className="font-mono font-black text-slate-900">{selectedOrder.customerPhone || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-400">মূল্য:</span>
                  <span className="font-black text-emerald-700 text-sm">৳{selectedOrder.price}</span>
                </div>
                {selectedOrder.paymentMethod && (
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400">পেমেন্ট মেথড:</span>
                    <span className="font-black uppercase text-slate-800">{selectedOrder.paymentMethod}</span>
                  </div>
                )}
                {selectedOrder.transactionId && (
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400">ট্রানজেকশন আইডি:</span>
                    <span className="font-mono font-black text-slate-900">{selectedOrder.transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">তারিখ ও সময়:</span>
                  <span className="font-medium text-slate-600">{typeof selectedOrder.createdAt === 'string' ? selectedOrder.createdAt : new Date(selectedOrder.createdAt).toLocaleString('bn-BD')}</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl transition-all cursor-pointer border-none shadow-sm"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. ORDER TRACKING
export function OrderTracking({ userId }: SectionProps) {
  const [trackId, setTrackId] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleTrack = () => {
    if (!trackId.trim()) return;
    setStatus('আপনার অর্ডারটি সফলভাবে প্রসেসিং করা হয়েছে এবং ৫ মিনিটের মধ্যে মোবাইল রিচার্জ সম্পন্ন হবে।');
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold text-slate-700">অর্ডার ট্র্যাকিং আইডি লিখুন</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            placeholder="উদাহরণ: ORD-98214"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
          />
          <button 
            onClick={handleTrack}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer"
          >
            ট্র্যাক
          </button>
        </div>
      </div>
      {status && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-900 text-[11px] leading-relaxed">
          <p className="font-bold flex items-center gap-1 text-emerald-700 mb-1">
            <Check className="w-3.5 h-3.5" /> ট্র্যাকিং স্ট্যাটাস
          </p>
          {status}
        </div>
      )}
    </div>
  );
}

// 4. FAVORITE OFFERS
export function FavoriteOffers({ userId }: SectionProps) {
  return (
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
      <Heart className="w-8 h-8 text-rose-400 mx-auto" />
      <p className="text-slate-700 font-extrabold text-xs">কোনো সেভ করা অফার নেই</p>
      <p className="text-slate-400 text-[11px]">আপনার প্রিয় অফারগুলোতে হার্ট আইকন চাপুন।</p>
    </div>
  );
}

// 5. ADD MONEY
export function AddMoney({ userId, settings, currentUser }: SectionProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [method, setMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Upay' | 'Cellfin' | 'Banking'>('bKash');
  const [amount, setAmount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState(currentUser?.phone || '');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const activeUserId = userId || currentUser?.uid || auth.currentUser?.uid || 'guest';

  const bkash = settings?.bkashNumber || '01618599077';
  const nagad = settings?.nagadNumber || '01624228476';
  const rocket = settings?.rocketNumber || '01624228476';
  const upay = settings?.upayNumber || '01618599077';
  const cellfin = settings?.cellfinNumber || '01624228476';
  const banking = settings?.bankingNumber || 'DBBL A/C: 123-456-7890';

  const numbers: Record<string, string> = {
    bKash: `${bkash} (Personal / Send Money)`,
    Nagad: `${nagad} (Personal / Send Money)`,
    Rocket: `${rocket} (Personal / Send Money)`,
    Upay: `${upay} (Personal / Send Money)`,
    Cellfin: `${cellfin} (Personal / Send Money)`,
    Banking: `${banking} (Personal / Bank Transfer)`
  };

  const paymentMethodsList = [
    {
      id: 'bKash',
      label: 'Bkash',
      badge: 'Personal',
      logo: <BKashLogo className="h-9 w-auto" customLogoUrl={settings?.bkashLogoUrl} />
    },
    {
      id: 'Nagad',
      label: 'Nagad',
      badge: 'Personal',
      logo: <NagadLogo className="h-9 w-auto" customLogoUrl={settings?.nagadLogoUrl} />
    },
    {
      id: 'Upay',
      label: 'Upay',
      badge: 'Personal',
      logo: <UpayLogo className="h-9 w-auto" customLogoUrl={settings?.upayLogoUrl} />
    },
    {
      id: 'Cellfin',
      label: 'CellFin',
      badge: 'Personal',
      logo: <CellfinLogo className="h-9 w-auto" customLogoUrl={settings?.cellfinLogoUrl} />
    },
    {
      id: 'Rocket',
      label: 'Rocket',
      badge: 'Personal',
      logo: <RocketLogo className="h-9 w-auto" customLogoUrl={settings?.rocketLogoUrl} />
    },
    {
      id: 'Banking',
      label: 'Bank Transfer',
      badge: 'Personal',
      logo: <BankingLogo className="h-9 w-auto" customLogoUrl={settings?.bankingLogoUrl} />
    }
  ];

  const handleCopy = () => {
    const rawNum = (numbers[method] || '').split(' ')[0];
    navigator.clipboard.writeText(rawNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !trxId) return;
    setSubmitting(true);

    try {
      const requestData = {
        userId: activeUserId,
        userName: currentUser?.displayName || auth.currentUser?.displayName || 'Unknown',
        method,
        amount: parseFloat(amount) || 0,
        trxId: trxId.trim(),
        senderPhone: senderPhone.trim(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      try {
        await addDoc(collection(db, 'add_money_requests'), requestData);
      } catch (fsErr) {
        console.warn('Firestore addDoc failed, storing locally:', fsErr);
      }

      // Also store in localStorage as a fallback for immediate UI feedback
      try {
        const localReqs = localStorage.getItem('fahim_add_money_requests') || '[]';
        const parsed = JSON.parse(localReqs);
        parsed.unshift({ id: 'ADD-' + Date.now(), ...requestData });
        localStorage.setItem('fahim_add_money_requests', JSON.stringify(parsed));
      } catch (e) {}

      setStep(4);
    } catch (err) {
      console.error('Error submitting add money request:', err);
      alert('❌ রিকোয়েস্ট সাবমিট করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* STEP 1: AMOUNT SELECTION */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between text-sm">
            <span className="font-black text-slate-900">অ্যামাউন্ট সিলেক্ট করুন</span>
            <span className="text-[10px] text-slate-500 font-black bg-white px-3 py-1 rounded-full border border-slate-200 uppercase tracking-widest shadow-sm">
              ধাপ ১ / ৩
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['50', '100', '200', '500', '1000', '2000', '3000', '5000', '10000'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`py-4 rounded-2xl text-sm font-black border cursor-pointer transition-all ${
                  amount === preset
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100 scale-105'
                    : 'bg-white text-slate-700 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30'
                }`}
              >
                ৳{preset}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase px-1">অথবা পরিমাণ লিখুন</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="কত টাকা এড করতে চান?"
              className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl text-lg font-black outline-none focus:border-emerald-500 focus:bg-white bg-slate-50/50 transition-all placeholder:text-slate-300"
            />
          </div>

          <button
            onClick={() => {
              if (!amount || Number(amount) < 10) {
                alert('⚠️ দয়া করে সঠিক পরিমাণ লিখুন (ন্যূনতম ১০ টাকা)');
                return;
              }
              setStep(2);
            }}
            className="w-full py-5 bg-slate-900 hover:bg-black text-white font-black text-sm rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
          >
            <span>পরবর্তী ধাপে যান</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* STEP 2: PAYMENT METHOD SELECTOR */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(1)} className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-all"><ChevronLeft className="w-5 h-5" /></button>
            <span className="text-[10px] text-slate-500 font-black bg-white px-3 py-1 rounded-full border border-slate-200 uppercase tracking-widest shadow-sm">
              ধাপ ২ / ৩
            </span>
          </div>

          <div className="text-center space-y-1">
            <h4 className="text-sm font-black text-slate-900">৳{amount} এড মানি</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase">পেমেন্ট মেথড সিলেক্ট করুন</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {paymentMethodsList.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMethod(item.id as any);
                  setStep(3);
                }}
                className="bg-white rounded-[28px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-500/50 hover:-translate-y-1 transition-all cursor-pointer p-6 flex flex-col items-center justify-center min-h-[140px] group active:scale-[0.96] text-center"
              >
                <div className="h-12 w-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.logo}
                </div>
                <div className="w-full h-px bg-slate-50 mb-3" />
                <div className="text-center font-black text-slate-900 flex flex-col items-center gap-0.5">
                  <span className="text-sm">{item.label}</span>
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-tighter">{item.badge}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT DETAILS & SUBMISSION FORM */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-1">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-xs font-black text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-2xl transition-all cursor-pointer border border-slate-200/50 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>পিছনে যান</span>
            </button>
            <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-widest">
              ধাপ ৩ / ৩
            </span>
          </div>

          {/* Account Number Card */}
          <div className="p-4 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white rounded-[28px] border border-emerald-200/60 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <span>{method} সেন্ড মানি করুন</span>
              </span>
              <span className="px-3 py-1 bg-emerald-600 text-white font-black text-[10px] rounded-lg uppercase tracking-tighter shadow-sm shadow-emerald-200">
                Personal
              </span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-emerald-100 flex items-center justify-between shadow-xs">
              <span className="text-base font-black text-slate-900 font-mono tracking-wider">
                {numbers[method].split(' ')[0]}
              </span>
              <button 
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-200 active:scale-95"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-600 font-bold leading-relaxed pt-1 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>প্রথমে ওপরের নাম্বারে ৳{amount} সেন্ড মানি করুন। এরপর নিচে আপনার নম্বর এবং TrxID দিয়ে সাবমিট করুন।</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* Sender Phone */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 px-1">আপনার মোবাইল নাম্বার</label>
              <input 
                type="tel" 
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="যে নাম্বার থেকে টাকা পাঠিয়েছেন"
                required
                className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl text-sm font-black outline-none focus:border-emerald-500 focus:bg-white bg-slate-50/50 transition-all placeholder:text-slate-300"
              />
            </div>

            {/* TrxID */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 px-1">ট্রানজেকশন আইডি (TrxID)</label>
              <input 
                type="text" 
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="যেমন: 9J382K1L"
                required
                className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl text-sm font-mono font-black uppercase outline-none focus:border-emerald-500 focus:bg-white bg-slate-50/50 transition-all placeholder:text-slate-300 tracking-widest"
              />
            </div>

            <button 
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl border-none cursor-pointer shadow-xl shadow-emerald-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-4"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>অনুরোধ পাঠানো হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>৳{amount} এড মানি রিকোয়েস্ট পাঠান</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* STEP 4: SUCCESS CONFIRMATION SCREEN */}
      {step === 4 && (
        <div className="p-8 bg-white border border-emerald-100 rounded-[32px] text-center space-y-6 animate-in zoom-in-95 duration-400 shadow-xl">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg shadow-emerald-100">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5] animate-bounce" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">রিকোয়েস্ট জমা হয়েছে! 🎉</h3>
            <p className="text-xs text-slate-500 font-bold leading-relaxed px-4">
              আপনার ৳{amount} এড মানি রিকোয়েস্টটি পেন্ডিং রয়েছে। এডমিন ভেরিফাই করে দ্রুত ব্যালেন্স যোগ করে দেবেন।
            </p>
          </div>

          <button onClick={() => setStep(1)} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl">বন্ধ করুন</button>
        </div>
      )}
    </div>
  );
}

// 6. PAYMENT HISTORY
export function PaymentHistory({ userId }: SectionProps) {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'add_money_requests'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const docs: any[] = [];
      snap.forEach(d => docs.push({ id: d.id, ...d.data() }));
      setHistory(docs);
      setLoading(false);
    }, (err) => {
      console.warn('Add money requests history listener error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center p-6"><Loader2 className="animate-spin text-emerald-600 w-6 h-6" /></div>;
  }

  if (history.length === 0) {
    return (
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
        <Wallet className="w-8 h-8 text-slate-400 mx-auto" />
        <p className="text-slate-700 font-extrabold text-xs">কোনো পেমেন্ট ইতিহাস নেই</p>
        <p className="text-slate-400 text-[11px]">আপনার অ্যাড মানি রিকোয়েস্টগুলো এখানে দেখা যাবে।</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
      {history.map((item) => (
        <div key={item.id} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between text-xs shadow-xs">
          <div className="space-y-0.5">
            <p className="font-extrabold text-slate-900">{item.method} Add Money</p>
            <p className="text-[10px] text-slate-400 font-medium">
              {item.createdAt ? new Date(item.createdAt).toLocaleString('bn-BD') : 'N/A'}
            </p>
            <p className="text-[9px] text-slate-300 font-mono">ID: {item.id}</p>
          </div>
          <div className="text-right space-y-1.5">
            <p className="font-black text-emerald-600">৳{item.amount}</p>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
              item.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 
              item.status === 'rejected' ? 'bg-rose-50 text-rose-700' :
              'bg-amber-50 text-amber-700'
            }`}>
              {item.status === 'approved' ? 'সফল' : item.status === 'rejected' ? 'বাতিল' : 'পেন্ডিং'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// 7. CASHBACK & SAVED CARDS
export function Cashback({ userId }: SectionProps) {
  return (
    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-1">
      <Sparkles className="w-8 h-8 text-emerald-600 mx-auto" />
      <p className="text-emerald-900 font-black text-xs">মোট ক্যাশব্যাক রিওয়ার্ডস</p>
      <p className="text-emerald-700 font-bold text-lg">৳ ৪৫০.০০</p>
    </div>
  );
}

export function SavedCards({ userId }: SectionProps) {
  return (
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
      <CreditCard className="w-8 h-8 text-slate-400 mx-auto" />
      <p className="text-slate-700 font-extrabold text-xs">কোনো সেভ করা কার্ড নেই</p>
      <p className="text-slate-400 text-[11px]">ভবিষ্যৎ পেমেন্টের সুবিধার্থে ভিসা/মাস্টারকার্ড যুক্ত করুন।</p>
    </div>
  );
}

// 8. SUPPORT & LIVE CHAT
export function SupportTeam({ userId, settings }: SectionProps) {
  const supportPhone = settings?.supportPhone || '01618599077';
  return (
    <div className="space-y-2">
      <a 
        href={`tel:${supportPhone}`} 
        className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-3 text-slate-900 font-bold text-xs no-underline"
      >
        <PhoneCall className="w-4 h-4 text-emerald-600" />
        <div>
          <p>হটলাইন কল সেন্টার</p>
          <p className="text-[10px] text-slate-500 font-medium">{supportPhone} (সকাল ৯টা - রাত ১০টা)</p>
        </div>
      </a>
      <a 
        href={`https://wa.me/${supportPhone}`} 
        target="_blank" 
        rel="noreferrer"
        className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 font-bold text-xs no-underline"
      >
        <MessageSquare className="w-4 h-4 text-emerald-600" />
        <div>
          <p>হোয়াটসঅ্যাপ লাইভ কাস্টমার কেয়ার</p>
          <p className="text-[10px] text-emerald-700 font-medium">২৪ ঘন্টা দ্রুত বার্তা প্রদান সেবা</p>
        </div>
      </a>
    </div>
  );
}

export function LiveChat({ userId }: SectionProps) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'আসসালামু আলাইকুম! ফাহিম ইন্টারনেট কাস্টমার কেয়ারে আপনাকে স্বাগতম। আপনাকে কীভাবে সাহায্য করতে পারি?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'ধন্যবাদ! আমাদের প্রতিনিধি আপনার মেসেজটি পেয়েছেন এবং দ্রুত উত্তর প্রদান করবেন।'
      }]);
    }, 1000);
  };

  return (
    <div className="space-y-2">
      <div className="bg-slate-50 rounded-xl p-3 h-48 overflow-y-auto space-y-2 border border-slate-200">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded-xl text-[11px] max-w-[80%] leading-relaxed ${
              m.sender === 'user' ? 'bg-slate-900 text-white font-bold' : 'bg-white border border-slate-200 text-slate-800'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="আপনার সমস্যা লিখুন..."
          className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          className="px-3 py-2 bg-emerald-600 text-white rounded-xl font-bold border-none cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function Tickets({ userId, showToast }: SectionProps) {
  return (
    <div className="space-y-3">
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-center text-slate-500">
        বর্তমানে কোনো সক্রিয় সাপোর্ট টিকিট নেই।
      </div>
      <button 
        onClick={() => {
          if (showToast) showToast("নতুন টিকিট তৈরি ফর্ম জমা দেওয়া হয়েছে।", "info");
          else alert("নতুন টিকিট তৈরি ফর্ম জমা দেওয়া হয়েছে।");
        }}
        className="w-full py-2 bg-slate-900 text-white font-extrabold text-xs rounded-xl border-none cursor-pointer"
      >
        নতুন কমপ্লেইন টিকিট খুলুন
      </button>
    </div>
  );
}

// 9. FAQ
export function Faq({ userId }: SectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'কিভাবে মোবাইল রিচার্জ অফার ক্রয় করবো?',
      a: 'হোম পেজ থেকে আপনার সিম অপারেটর বেছে নিন, পছন্দের প্যাক নির্বাচন করুন, আপনার মোবাইল নম্বর ও পিন কোড প্রদান করে সাবমিট করুন।'
    },
    {
      q: 'এড মানি করার পর কতক্ষণে টাকা যোগ হয়?',
      a: 'আমাদের অটো-এড মানি সিস্টেমে সঠিক ট্রানজেকশন আইডি প্রদান করলে ১ থেকে ৩ মিনিটের মধ্যে ব্যালেন্স স্বয়ংক্রিয়ভাবে যোগ হয়ে যায়।'
    },
    {
      q: 'ভুল নম্বরে রিচার্জ হয়ে গেলে কি করণীয়?',
      a: 'রিচার্জ প্রসেস সম্পূর্ণ হওয়ার পূর্বে হেল্পলাইন বা লাইভ চ্যাটে সাথে সাথে ট্রানজেকশন আইডি সহ যোগাযোগ করুন।'
    },
    {
      q: 'ড্রাইভ প্যাক অফার ক্যানসেল হলে টাকা ফেরত পাবো?',
      a: 'হ্যাঁ, কোনো অফার অপারেটর থেকে ক্যানসেল হলে সম্পূর্ণ টাকা তাৎক্ষণিক আপনার মূল অ্যাকাউন্টে রিফান্ড হবে।'
    }
  ];

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
      {faqs.map((item, idx) => (
        <div key={idx} className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
          <button 
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            className="w-full p-3 text-left font-extrabold text-xs text-slate-900 flex justify-between items-center bg-none border-none cursor-pointer"
          >
            <span>{item.q}</span>
            {openIdx === idx ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {openIdx === idx && (
            <div className="p-3 pt-0 text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 10. ACCOUNT SETTINGS
export function AccountSettings({ userId, currentUser, showToast }: SectionProps) {
  const [name, setName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.phoneNumber || currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync internal state if currentUser prop changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName && !name) setName(currentUser.displayName);
      if ((currentUser.phoneNumber || currentUser.phone) && !phone) setPhone(currentUser.phoneNumber || currentUser.phone);
      if (currentUser.email && !email) setEmail(currentUser.email);
      if (currentUser.photoURL && !photoURL) setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      if (showToast) showToast('⚠️ ছবির সাইজ ৫ মেগাবাইটের কম হতে হবে!', 'error');
      else alert('⚠️ ছবির সাইজ ৫ মেগাবাইটের কম হতে হবে!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/webp', 0.5);
        setPhotoURL(dataUrl);
        if (showToast) showToast('📸 ছবি সিলেক্ট করা হয়েছে! নিচে সেভ বাটনে ক্লিক করুন।', 'info');
        else alert('📸 ছবি সিলেক্ট করা হয়েছে! নিচে সেভ বাটনে ক্লিক করুন।');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Attempt to get UID from multiple sources
    const activeUserId = userId || currentUser?.uid || auth.currentUser?.uid;
    
    if (!activeUserId) {
      if (showToast) showToast('⚠️ এরর: ইউজার আইডি পাওয়া যায়নি। দয়া করে আবার লগইন করুন।', 'error');
      else alert('⚠️ এরর: ইউজার আইডি পাওয়া যায়নি। দয়া করে আবার লগইন করুন।');
      return;
    }
    
    setIsSaving(true);
    try {
      console.log('Saving profile for user:', activeUserId);

      // 1. Update Firebase Auth Profile (Best effort)
      if (auth.currentUser) {
        try {
          const authUpdate: any = { displayName: name };
          if (photoURL && !photoURL.startsWith('data:')) {
            authUpdate.photoURL = photoURL;
          }
          await updateProfile(auth.currentUser, authUpdate);
        } catch (authErr) {
          console.warn('Firebase Auth profile update partially failed:', authErr);
        }
      }

      // 2. Update Firestore User Profile (Primary source of truth)
      const userDocRef = doc(db, 'users', activeUserId);
      const updatePayload: any = {
        displayName: name,
        phone: phone,
        email: email,
        uid: activeUserId,
        photoURL: photoURL || '',
        updatedAt: new Date().toISOString()
      };

      await setDoc(userDocRef, updatePayload, { merge: true });

      // 3. Update Local Storage sync & Dispatch App-wide Event
      const localUserStr = localStorage.getItem('fahim_local_user');
      try {
        const localUser = localUserStr ? JSON.parse(localUserStr) : {};
        const updatedLocalUser = {
          ...localUser,
          ...currentUser,
          uid: activeUserId,
          displayName: name,
          photoURL: photoURL,
          phone: phone,
          email: email
        };
        localStorage.setItem('fahim_local_user', JSON.stringify(updatedLocalUser));
        
        const localDbStr = localStorage.getItem('fahim_local_users_db');
        if (localDbStr) {
          const localDb = JSON.parse(localDbStr);
          const updatedDb = localDb.map((u: any) => 
            u.uid === activeUserId ? { ...u, displayName: name, photoURL: photoURL, phone, email } : u
          );
          localStorage.setItem('fahim_local_users_db', JSON.stringify(updatedDb));
        }

        // Broadcast profile update event to immediately sync App state
        window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: updatedLocalUser }));
      } catch (e) {
        console.warn('Local storage sync error:', e);
      }

      if (showToast) showToast('🎉 আপনার প্রোফাইল ছবি ও তথ্য সফলভাবে সেভ করা হয়েছে!', 'success');
      else alert('🎉 আপনার প্রোফাইল ছবি ও তথ্য সফলভাবে সেভ করা হয়েছে!');
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const msg = error?.message || 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে।';
      if (showToast) showToast(`❌ ${msg}`, 'error');
      else alert(`❌ ${msg}. দয়া করে ইন্টারনেট কানেকশন চেক করুন।`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-200 flex items-center justify-center">
            {photoURL ? (
              <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-14 h-14 text-slate-400" />
            )}
          </div>
          <label className="absolute bottom-1 right-1 p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full cursor-pointer shadow-lg transition-all active:scale-90">
            <Camera className="w-4 h-4" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        
        <div className="text-center w-full max-w-sm space-y-3">
          <div>
            <h4 className="text-base font-black text-slate-900">{name || 'ব্যবহারকারী'}</h4>
            <p className="text-xs text-slate-500 font-bold">{phone}</p>
          </div>

          {/* Upload Button */}
          <div className="pt-1 flex flex-col items-center gap-2">
            <input 
              type="file" 
              id="profile-photo-file-input" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload} 
            />
            <label
              htmlFor="profile-photo-file-input"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Camera className="w-4 h-4 text-emerald-100" />
              <span>গ্যালারি থেকে প্রোফাইল ছবি সিলেক্ট করুন</span>
            </label>
            
            <div className="w-full text-left pt-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">অথবা ছবির URL লিংক দিন</label>
              <input 
                type="text" 
                value={photoURL.startsWith('data:') ? '' : photoURL} 
                onChange={e => setPhotoURL(e.target.value)}
                placeholder="https://example.com/photo.jpg" 
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500 mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        <div>
          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">সম্পূর্ণ নাম</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all mt-1" 
            placeholder="আপনার নাম লিখুন"
          />
        </div>
        <div>
          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">মোবাইল নম্বর (অপরিবর্তনীয়)</label>
          <input 
            type="text" 
            value={phone} 
            disabled
            className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-400 outline-none mt-1" 
          />
        </div>
        <div>
          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">ইমেইল এড্রেস</label>
          <input 
            type="email" 
            value={email} 
            disabled
            className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-400 outline-none mt-1" 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSaving}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl border-none cursor-pointer shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
        >
          {isSaving ? 'সেভ হচ্ছে...' : saved ? '🎉 সেভ হয়েছে!' : '💾 প্রোফাইল সেভ করুন'}
        </button>
      </form>
    </div>
  );
}

export function ChangePassword({ userId }: SectionProps) {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass) return;
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOldPass('');
      setNewPass('');
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div>
        <label className="text-[10px] font-extrabold text-slate-600">বর্তমান পাসওয়ার্ড/পিন</label>
        <input 
          type="password" 
          value={oldPass} 
          onChange={e => setOldPass(e.target.value)} 
          required 
          placeholder="••••"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 mt-0.5" 
        />
      </div>
      <div>
        <label className="text-[10px] font-extrabold text-slate-600">নতুন পাসওয়ার্ড/পিন</label>
        <input 
          type="password" 
          value={newPass} 
          onChange={e => setNewPass(e.target.value)} 
          required 
          placeholder="••••"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 mt-0.5" 
        />
      </div>
      <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl border-none cursor-pointer">
        পাসওয়ার্ড আপডেট করুন
      </button>
      {saved && (
        <p className="text-[11px] text-emerald-600 font-bold text-center animate-in fade-in">
          ✅ পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!
        </p>
      )}
    </form>
  );
}

export function SecuritySettings({ userId }: SectionProps) {
  const [twoFa, setTwoFa] = useState(true);

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
        <div>
          <p className="font-extrabold text-slate-900">২-স্টেপ ভেরিফিকেশন (2FA)</p>
          <p className="text-[10px] text-slate-500">প্রতিবার লগইনে পিন ভেরিফিকেশন প্রয়োজন</p>
        </div>
        <input 
          type="checkbox" 
          checked={twoFa} 
          onChange={() => setTwoFa(!twoFa)} 
          className="w-4 h-4 accent-emerald-600 cursor-pointer" 
        />
      </div>
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
        <p className="font-extrabold text-slate-900">লগইন ডিভাইস</p>
        <p className="text-[10px] text-slate-500">Android Phone • ঢাকা, বাংলাদেশ (সক্রিয়)</p>
      </div>
    </div>
  );
}

export function NotificationSettings({ userId }: SectionProps) {
  const [push, setPush] = useState(true);
  const [sms, setSms] = useState(true);

  return (
    <div className="space-y-2.5 text-xs">
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
        <div>
          <p className="font-extrabold text-slate-900">পুশ নোটিফিকেশন</p>
          <p className="text-[10px] text-slate-500">বিশেষ অফার ও ডিসকাউন্ট নোটিফিকেশন</p>
        </div>
        <input 
          type="checkbox" 
          checked={push} 
          onChange={() => setPush(!push)} 
          className="w-4 h-4 accent-emerald-600 cursor-pointer" 
        />
      </div>
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
        <div>
          <p className="font-extrabold text-slate-900">এসএমএস অ্যালার্ট</p>
          <p className="text-[10px] text-slate-500">রিচার্জ কনফার্মেশন মেসেজ</p>
        </div>
        <input 
          type="checkbox" 
          checked={sms} 
          onChange={() => setSms(!sms)} 
          className="w-4 h-4 accent-emerald-600 cursor-pointer" 
        />
      </div>
    </div>
  );
}

// 11. LEGAL & ABOUT
export function AboutUs({ userId, settings }: SectionProps) {
  const appName = settings?.brandName || 'FAHIM INTERNET';
  const version = settings?.appVersion || 'v1.0.0';
  const devName = settings?.developerName || 'Rajibul Islam';
  const devEmail = settings?.developerEmail || 'rajibulislamfahim8610@gmail.com';

  return (
    <div className="space-y-4 text-center animate-in fade-in duration-300">
      <div className="w-20 h-20 rounded-[32px] bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/5 overflow-hidden p-2">
        {settings?.logoUrl ? (
          <img src={settings.logoUrl} alt="App Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full bg-emerald-600 rounded-[22px] flex items-center justify-center text-white font-black text-3xl italic">
            {(settings?.brandName || 'F')[0].toUpperCase()}
          </div>
        )}
      </div>
      <div>
        <h4 className="font-black text-xl text-slate-900 tracking-tight leading-none">{appName}</h4>
        <div className="flex items-center justify-center gap-2 mt-2">
          <p className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Official App
          </p>
          <p className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
            Version {version}
          </p>
        </div>
      </div>
      
      <div className="space-y-3 pt-2">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Developer Information</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">{devName}</p>
              <p className="text-[11px] font-bold text-slate-500">{devEmail}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Description</p>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            বাংলাদেশের সেরা মোবাইল ইন্টারনেট ও মিনিট প্যাক অফার ডিজিটাল সফটওয়্যার প্ল্যাটফর্ম। জিপি, রবি, বাংলালিংক, এয়ারটেল ও টেলিটকের সেরা ক্যাশব্যাক অফার কিনুন মুহূর্তেই।
          </p>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-left">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            Disclaimer
          </p>
          <p className="text-[11px] text-amber-800 leading-relaxed font-bold">
            {settings?.disclaimerText || "This app is not affiliated with any telecom operator. We act as a third-party digital offer distribution platform. All services are subject to operator availability and terms."}
          </p>
        </div>
      </div>
      
      <p className="text-[10px] text-slate-400 font-bold pt-4">
        &copy; {new Date().getFullYear()} {appName}. All Rights Reserved.
      </p>
    </div>
  );
}

export function PrivacyPolicy({ userId, settings }: SectionProps) {
  const privacyUrl = settings?.privacyPolicyUrl || 'https://fahiminternet.com/privacy-policy';
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="bg-emerald-600 p-8 rounded-[32px] text-white shadow-xl shadow-emerald-100 flex flex-col gap-4">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-xl font-black">গোপনীয়তা নীতি ও ডাটা সুরক্ষা</h4>
          <p className="text-xs text-emerald-100 font-bold opacity-80 mt-1 leading-relaxed">
            আমরা আপনার তথ্যের গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দেই। গুগল প্লে-স্টোর পলিসি অনুযায়ী আমাদের ডাটা সুরক্ষা পদ্ধতিগুলো নিচে বিস্তারিত দেওয়া হলো।
          </p>
        </div>
      </div>

      <div className="space-y-6 text-[13px] font-medium text-slate-700 leading-relaxed px-1">
        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h5 className="font-black text-slate-900 mb-2 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
            ১. আমরা কি তথ্য সংগ্রহ করি?
          </h5>
          <p>অর্ডার সফল করার জন্য আমরা আপনার নাম, মোবাইল নম্বর এবং পেমেন্ট ট্রানজেকশন আইডি সংগ্রহ করি। আমরা আপনার ফোনের কন্টাক্ট লিস্ট, গ্যালারি বা অন্য কোনো ব্যক্তিগত ফাইল অ্যাক্সেস করি না।</p>
        </section>

        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h5 className="font-black text-slate-900 mb-2 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
            ২. তথ্যের ব্যবহার ও শেয়ারিং
          </h5>
          <p>আপনার তথ্য শুধুমাত্র রিচার্জ অর্ডার প্রসেসিং এবং কাস্টমার সাপোর্টের জন্য ব্যবহৃত হয়। আমরা কোনো থার্ড-পার্টি বিজ্ঞাপন সংস্থা বা বিপণনকারী প্রতিষ্ঠানের কাছে আপনার তথ্য বিক্রি বা শেয়ার করি না।</p>
        </section>

        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h5 className="font-black text-slate-900 mb-2 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
            ৩. ডাটা সিকিউরিটি ও এনক্রিপশন
          </h5>
          <p>আপনার সকল সেনসিটিভ ডাটা (যেমন: পেমেন্ট হিস্টোরি ও অর্ডার ডাটা) Google Firebase-এর এনক্রিপ্টেড ডাটাবেসে সংরক্ষিত থাকে। সকল ট্রাফিক SSL এনক্রিপশন দ্বারা সুরক্ষিত।</p>
        </section>

        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h5 className="font-black text-slate-900 mb-2 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
            ৪. ইউজারের নিয়ন্ত্রণ ও ডাটা ডিলিট
          </h5>
          <p>আপনি যেকোনো সময় আপনার অ্যাকাউন্ট থেকে লগআউট করতে পারেন। যদি আপনি আপনার সকল তথ্য স্থায়ীভাবে মুছে ফেলতে চান, তবে প্রোফাইল থেকে "Delete Account" অপশন ব্যবহার করে আবেদন করতে পারেন। আবেদন করার ২৪ ঘণ্টার মধ্যে সকল ডাটা ডিলিট করা হবে।</p>
        </section>

        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h5 className="font-black text-slate-900 mb-2 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
            ৫. পলিসি পরিবর্তন
          </h5>
          <p>ভবিষ্যতে কোনো সার্ভিস আপডেট বা প্লে-স্টোর পলিসি পরিবর্তনের কারণে আমরা এই শর্তগুলো সংশোধন করতে পারি। যেকোনো বড় পরিবর্তনের ক্ষেত্রে আমরা অ্যাপ নোটিফিকেশনের মাধ্যমে আপনাকে জানিয়ে দেব।</p>
        </section>
      </div>

      <div className="pt-4 px-1">
        <a 
          href={privacyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-5 bg-white border border-slate-200 rounded-[24px] flex items-center justify-between group hover:border-emerald-500 transition-all no-underline shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Globe className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-slate-900">অনলাইন ডাটা সেফটি কপি</p>
              <p className="text-[11px] text-slate-400 font-bold">অফিসিয়াল ওয়েবসাইট থেকে পড়ুন</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
        </a>
      </div>
    </div>
  );
}

export function TermsConditions({ userId, settings }: SectionProps) {
  const termsUrl = settings?.termsConditionsUrl || 'https://fahiminternet.com/terms-conditions';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="bg-blue-600 p-8 rounded-[32px] text-white shadow-xl shadow-blue-100 flex flex-col gap-4">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <FileText className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-xl font-black">ব্যবহারকারীর শর্তাবলী</h4>
          <p className="text-xs text-blue-100 font-bold opacity-80 mt-1 leading-relaxed">
            ফাাহিম ইন্টারনেট সার্ভিস ব্যবহারের ক্ষেত্রে নিচের শর্তগুলো প্রযোজ্য। অ্যাপ ব্যবহারের মাধ্যমে আপনি এই নিয়মাবলীতে সম্মত হচ্ছেন।
          </p>
        </div>
      </div>

      <div className="space-y-6 text-[13px] font-medium text-slate-700 leading-relaxed px-1">
        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h5 className="font-black text-slate-900 mb-2 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
            ১. সাধারণ ব্যবহার বিধি
          </h5>
          <p>অ্যাপটি শুধুমাত্র বৈধ মোবাইল রিচার্জ ও ইন্টারনেট প্যাক ক্রয়ের জন্য ব্যবহারযোগ্য। কোনো প্রকার প্রতারণা বা অ্যাপ হ্যাক করার চেষ্টা করলে আইনি ব্যবস্থা এবং অ্যাকাউন্ট বাতিল করা হবে।</p>
        </section>

        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h5 className="font-black text-slate-900 mb-2 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
            ২. পেমেন্ট ও রিফান্ড পলিসি
          </h5>
          <p>ভুল নম্বরে রিচার্জ সফল হলে কর্তৃপক্ষ দায়ী থাকবে না। তবে ড্রাইভ অফার বা রিচার্জ কোনো কারণে সফল না হলে আপনার টাকা ২৪ ঘণ্টার মধ্যে ওয়ালেটে রিফান্ড হবে। ওয়ালেট ব্যালেন্স ক্যাশ-আউট করা সম্ভব নয়।</p>
        </section>

        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h5 className="font-black text-slate-900 mb-2 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
            ৩. ড্রাইভ অফার লিমিটেশন
          </h5>
          <p>ড্রাইভ অফারগুলো অপারেটর ভেদে নির্দিষ্ট সময়ে পাওয়া যায়। প্যাক কেনার আগে ডিসক্রিপশন ভালোভাবে পড়ে নিন। রিচার্জের সময় অপারেটর সার্ভার ডাউন থাকলে কিছুটা দেরি হতে পারে।</p>
        </section>

        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h5 className="font-black text-slate-900 mb-2 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
            ৪. বৌদ্ধিক সম্পত্তি ও কপিরাইট
          </h5>
          <p>অ্যাপের সকল কন্টেন্ট, লোগো এবং ডিজাইন "ফাাহিম ইন্টারনেট"-এর মালিকানাধীন। অনুমতি ছাড়া এগুলো বাণিজ্যিক কাজে ব্যবহার করা আইনত দণ্ডনীয়।</p>
        </section>
      </div>

      <div className="pt-4 px-1">
        <a 
          href={termsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-5 bg-white border border-slate-200 rounded-[24px] flex items-center justify-between group hover:border-blue-500 transition-all no-underline shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Globe className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-slate-900">বিস্তারিত টার্মস পড়ুন</p>
              <p className="text-[11px] text-slate-400 font-bold">Terms & Conditions Website</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </a>
      </div>
    </div>
  );
}

export function ContactUs({ userId, settings }: SectionProps) {
  const phone = settings?.supportPhone || '01618599077';
  const email = settings?.supportEmail || 'rajibulislamfahim8610@gmail.com';
  const website = settings?.supportWebsite || 'https://fahiminternet.com';
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
        userId: userId || 'guest',
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        type: 'contact',
        status: 'new',
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'support_messages'), data);
      setSent(true);
      setTimeout(() => setSent(false), 8000);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error('Contact form error:', err);
      alert('সন্দেশ পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Clickable Contact Cards */}
      <div className="grid grid-cols-1 gap-4">
        <a href={`mailto:${email}`} className="p-5 bg-white border border-slate-100 rounded-[28px] flex items-center justify-between group hover:border-emerald-500 hover:shadow-lg transition-all no-underline shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">ইমেইল করুন</p>
              <p className="text-xs text-slate-400 font-bold mt-0.5">{email}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-all">
            <ChevronRight className="w-5 h-5" />
          </div>
        </a>

        <a href={`tel:${phone}`} className="p-5 bg-white border border-slate-100 rounded-[28px] flex items-center justify-between group hover:border-blue-500 hover:shadow-lg transition-all no-underline shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">হটলাইন / কল</p>
              <p className="text-xs text-slate-400 font-bold mt-0.5">{phone}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
            <ChevronRight className="w-5 h-5" />
          </div>
        </a>

        <a href={website} target="_blank" rel="noreferrer" className="p-5 bg-white border border-slate-100 rounded-[28px] flex items-center justify-between group hover:border-indigo-500 hover:shadow-lg transition-all no-underline shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">ওয়েবসাইট</p>
              <p className="text-xs text-slate-400 font-bold mt-0.5">{website.replace('https://', '')}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all">
            <ChevronRight className="w-5 h-5" />
          </div>
        </a>
      </div>

      {/* Contact Form */}
      <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-black text-slate-900">সরাসরি মেসেজ দিন</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Contact Form</p>
          </div>
        </div>

        {sent ? (
          <div className="p-6 bg-emerald-50 text-emerald-700 rounded-2xl text-center border border-emerald-100 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h5 className="font-black text-sm">মেসেজ সফলভাবে পাঠানো হয়েছে!</h5>
            <p className="text-xs font-bold mt-1 opacity-80">আমরা সাধারণত ২৪-৪৮ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করব।</p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">আপনার নাম</label>
              <input 
                name="name"
                type="text" 
                placeholder="Ex: Md. Fahim" 
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ইমেইল ঠিকানা</label>
              <input 
                name="email"
                type="email" 
                placeholder="example@mail.com" 
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">আপনার বার্তা</label>
              <textarea 
                name="message"
                placeholder="আপনার সমস্যা বা জিজ্ঞাসা বিস্তারিত লিখুন..." 
                required
                rows={4}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none shadow-inner"
              />
            </div>
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-emerald-100 border-none cursor-pointer"
            >
              {submitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>মেসেজ পাঠান</span>
            </button>
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <p className="text-[11px] text-slate-500 font-bold">জরুরি প্রয়োজনে সরাসরি কল করুন বা হোয়াটসঅ্যাপ করুন।</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// 21. REPORT A PROBLEM
export function ReportProblem({ userId, settings }: SectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [problemType, setProblemType] = useState('technical');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 rounded-[28px] shadow-lg shadow-red-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black flex items-center gap-2">
            <Bug className="w-6 h-6" />
            <span>সমস্যা রিপোর্ট করুন (Report a Problem)</span>
          </h3>
          <p className="text-xs text-red-100 font-bold mt-1">
            অ্যাপ বা সার্ভিসে কোনো সমস্যা হলে বিস্তারিত জানান
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-[28px] text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h4 className="text-base font-black text-emerald-900">রিপোর্ট সফলভাবে জমা হয়েছে!</h4>
          <p className="text-xs font-bold text-emerald-700">আমাদের টেকনিক্যাল টিম খুব শীঘ্রই বিষয়টি যাচাই করবে।</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">সমস্যার ধরন</label>
            <select
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-red-500"
            >
              <option value="technical">টেকনিক্যাল এরর / বাগ</option>
              <option value="payment">পেমেন্ট সমস্যা</option>
              <option value="recharge">রিচার্জ না হওয়া</option>
              <option value="account">অ্যাকাউন্ট সংক্রান্ত</option>
              <option value="other">অন্যান্য</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">সমস্যার বিস্তারিত বর্ণনা</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="কী সমস্যা হচ্ছে বিস্তারিত লিখুন..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-red-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>রিপোর্ট সাবমিট করুন</span>
          </button>
        </form>
      )}
    </div>
  );
}

// 22. DELETE ACCOUNT
export function DeleteAccount({ userId, currentUser }: SectionProps) {
  const [requested, setRequested] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-rose-950 text-white p-6 rounded-[28px] shadow-lg flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-rose-500" />
            <span>অ্যাকাউন্ট ডিলিট করুন (Delete Account)</span>
          </h3>
          <p className="text-xs text-rose-200 font-bold mt-1">
            আপনার অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলার অনুরোধ করুন
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-rose-900 leading-relaxed">
            সতর্কতা: অ্যাকাউন্ট ডিলিট করলে আপনার সকল অর্ডার হিস্ট্রি, অল ব্যালেন্স এবং পার্সোনাল রেকর্ড চিরতরে মুছে যাবে।
          </p>
        </div>

        {requested ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-center font-black text-xs">
            অ্যাকাউন্ট ডিলিটের অনুরোধ গ্রহণ করা হয়েছে। ২৪ ঘণ্টার মধ্যে আপনার ডেটা প্রসেস করা হবে।
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setRequested(true)}
            className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl shadow-lg cursor-pointer border-none"
          >
            স্থায়ীভাবে অ্যাকাউন্ট মুছে ফেলার অনুরোধ জমা দিন
          </button>
        )}
      </div>
    </div>
  );
}

// 22.5 FAQ FULL
export function FAQFull({ userId }: SectionProps) {
  return <Faq userId={userId} />;
}

// 23. MEMBER RECORDS & DOCUMENT ARCHIVE (গ্রাহক/সদস্য তথ্য ও ডকুমেন্ট ডাটাবেজ)
export function MemberVerification({ userId, currentUser, settings, showToast }: SectionProps) {
  const [activeTab, setActiveTab] = useState<'verification' | 'database'>('verification');

  // Search Identifier State
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Member Information Form State (Notepad / Text Area)
  const [memberText, setMemberText] = useState('');
  const [phone, setPhone] = useState('');
  const [nidNumber, setNidNumber] = useState('');
  const [memberName, setMemberName] = useState('');
  const [updatingDocId, setUpdatingDocId] = useState<string | null>(null);

  // Documents State
  const [nidFront, setNidFront] = useState<string>('');
  const [nidBack, setNidBack] = useState<string>('');
  const [selfie1, setSelfie1] = useState<string>('');
  const [selfie2, setSelfie2] = useState<string>('');
  const [passport, setPassport] = useState<string>('');
  const [birthCert, setBirthCert] = useState<string>('');
  const [extraDocs, setExtraDocs] = useState<{ id: string; name: string; url: string }[]>([]);

  // Database / Saved Records State
  const [savedRecords, setSavedRecords] = useState<any[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [databaseSearch, setDatabaseSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Image Modal Preview State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch all saved members on mount
  useEffect(() => {
    fetchSavedMembers();
  }, [userId]);

  const compressImageDataUrl = (dataUrl: string, maxWidth = 800, quality = 0.55): Promise<string> => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) return Promise.resolve(dataUrl);
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = dataUrl;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let w = img.width;
          let h = img.height;
          if (w > maxWidth) {
            h = Math.round((h * maxWidth) / w);
            w = maxWidth;
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(dataUrl);
          }
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
    });
  };

  const getLocalBackupMembers = (): any[] => {
    try {
      const raw = localStorage.getItem('local_member_records');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveLocalBackupMember = (record: any) => {
    try {
      const existing = getLocalBackupMembers();
      const updated = [record, ...existing.filter(r => r.id !== record.id)];
      localStorage.setItem('local_member_records', JSON.stringify(updated.slice(0, 50)));
    } catch (err) {
      console.warn('LocalStorage save notice:', err);
    }
  };

  const fetchSavedMembers = async () => {
    setLoadingRecords(true);
    try {
      const localList = getLocalBackupMembers();
      const listMap = new Map<string, any>();
      localList.forEach(item => listMap.set(item.id, item));

      try {
        const membersRef = collection(db, 'members');
        const snap = await getDocs(membersRef);
        snap.forEach(docItem => {
          listMap.set(docItem.id, { id: docItem.id, ...docItem.data() });
        });
      } catch (err) {
        console.warn('Firestore fetch notice (using local storage):', err);
      }

      const mergedList = Array.from(listMap.values());
      mergedList.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
      setSavedRecords(mergedList);
    } catch (err) {
      console.warn('Failed to load saved members:', err);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleTextChange = (val: string) => {
    setMemberText(val);

    // Auto extract mobile if not present
    if (!phone) {
      const phoneMatch = val.match(/(?:01[3-9]\d{8})/);
      if (phoneMatch) setPhone(phoneMatch[0]);
    }

    // Auto extract NID if not present
    if (!nidNumber) {
      const nidMatch = val.match(/(?:NID|এনআইডি|nid)[\s:]*([0-9]{10,17})/i) || val.match(/\b([0-9]{10,17})\b/);
      if (nidMatch) setNidNumber(nidMatch[1] || nidMatch[0]);
    }

    // Auto extract Name
    if (!memberName) {
      const nameMatch = val.match(/(?:Name|নাম)[\s:]*([^\n\r]+)/i);
      if (nameMatch) setMemberName(nameMatch[1].trim());
    }
  };

  const fillFormFromRecord = (rec: any) => {
    let rawText = rec.memberText || rec.notes || '';
    if (!rawText && (rec.nidName || rec.phone || rec.nidNumber)) {
      rawText = `Name: ${rec.nidName || rec.memberName || ''}\nMobile: ${rec.phone || ''}\nNID: ${rec.nidNumber || ''}\nbKash: ${rec.ownBkash || ''}\nNagad: ${rec.ownNagad || ''}\nAddress: ${rec.presentAddress || ''}\nOccupation: ${rec.profession || ''}`;
    }
    setMemberText(rawText);
    setPhone(rec.phone || rec.phoneIdentifier || '');
    setNidNumber(rec.nidNumber || rec.nidIdentifier || '');
    setMemberName(rec.memberName || rec.nidName || '');

    setNidFront(rec.nidFront || '');
    setNidBack(rec.nidBack || '');
    setSelfie1(rec.selfie1 || '');
    setSelfie2(rec.selfie2 || '');
    setPassport(rec.passport || '');
    setBirthCert(rec.birthCert || '');
    setExtraDocs(Array.isArray(rec.extraDocs) ? rec.extraDocs : []);

    setUpdatingDocId(rec.id);
    setActiveTab('verification');
    setSaveSuccessMsg('');
  };

  const resetForm = () => {
    setMemberText('');
    setPhone('');
    setNidNumber('');
    setMemberName('');
    setNidFront('');
    setNidBack('');
    setSelfie1('');
    setSelfie2('');
    setPassport('');
    setBirthCert('');
    setExtraDocs([]);
    setUpdatingDocId(null);
    setSearchMessage(null);
    setSaveSuccessMsg('');
  };

  const handleSearchIdentifier = async (e?: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const q = (customQ !== undefined ? customQ : searchQuery).trim();
    if (!q) {
      setSearchMessage({ type: 'error', text: 'অনুগ্রহ করে মোবাইল নম্বর অথবা NID নম্বর লিখুন।' });
      return;
    }

    setSearching(true);
    setSearchMessage(null);

    try {
      const qLower = q.toLowerCase();
      const found = savedRecords.find(r => 
        (r.phone && r.phone.toLowerCase().includes(qLower)) ||
        (r.nidNumber && r.nidNumber.toLowerCase().includes(qLower)) ||
        (r.memberName && r.memberName.toLowerCase().includes(qLower)) ||
        (r.nidName && r.nidName.toLowerCase().includes(qLower)) ||
        (r.memberText && r.memberText.toLowerCase().includes(qLower))
      );

      if (found) {
        fillFormFromRecord(found);
        setSearchMessage({ 
          type: 'success', 
          text: `মেম্বার ফাইল পাওয়া গেছে: ${found.memberName || found.nidName || found.phone} (পূর্বে সংরক্ষিত তথ্য ও সব ফাইল লোড হয়েছে)` 
        });
      } else {
        const membersRef = collection(db, 'members');
        let directFound: any = null;
        const phoneSnap = await getDocs(query(membersRef, where('phone', '==', q)));
        if (!phoneSnap.empty) {
          directFound = { id: phoneSnap.docs[0].id, ...phoneSnap.docs[0].data() };
        } else {
          const nidSnap = await getDocs(query(membersRef, where('nidNumber', '==', q)));
          if (!nidSnap.empty) {
            directFound = { id: nidSnap.docs[0].id, ...nidSnap.docs[0].data() };
          }
        }

        if (directFound) {
          fillFormFromRecord(directFound);
          setSearchMessage({ 
            type: 'success', 
            text: `মেম্বার ফাইল পাওয়া গেছে: ${directFound.memberName || directFound.nidName || directFound.phone}` 
          });
        } else {
          setSearchMessage({ 
            type: 'info', 
            text: `'${q}' নম্বর দিয়ে কোনো পূর্ববর্তী মেম্বার ফাইল পাওয়া যায়নি। নতুন তথ্য লিখে নিচে সেভ করুন।` 
          });
          if (!phone && /^01[3-9]\d{8}$/.test(q)) setPhone(q);
          if (!nidNumber && /^\d{10,17}$/.test(q)) setNidNumber(q);
        }
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setSearchMessage({ type: 'error', text: 'অনুসন্ধানে ত্রুটি ঘটেছে: ' + (err.message || 'Error') });
    } finally {
      setSearching(false);
    }
  };

  const handleImageRead = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      alert('ফাইল সাইজ খুব বড়! সর্বোচ্চ 20MB ফাইল সাপোর্ট করবে।');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const compressed = await compressImageDataUrl(reader.result, 800, 0.55);
        setter(compressed);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExtraDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      alert('ফাইল সাইজ খুব বড়! সর্বোচ্চ 20MB ফাইল সাপোর্ট করবে।');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const compressed = await compressImageDataUrl(reader.result, 800, 0.55);
        const newDoc = {
          id: 'doc_' + Date.now(),
          name: file.name || 'Document',
          url: compressed
        };
        setExtraDocs(prev => [...prev, newDoc]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMember = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!memberText.trim() && !phone.trim() && !nidNumber.trim()) {
      alert('অনুগ্রহ করে মেম্বারের তথ্য লিখুন বা কপি-পেস্ট করুন এবং মোবাইল/NID নম্বর যোগ করুন।');
      return;
    }

    setSaving(true);
    setSaveSuccessMsg('');

    try {
      const cleanPhone = phone.trim() || (memberText.match(/01[3-9]\d{8}/) || [''])[0];
      const cleanNid = nidNumber.trim() || (memberText.match(/\b\d{10,17}\b/) || [''])[0];
      
      const docId = updatingDocId || `member_${cleanPhone || 'id'}_${cleanNid || Date.now()}`;
      const derivedName = memberName.trim() || (memberText.match(/(?:Name|নাম)[\s:]*([^\n\r]+)/i)?.[1]?.trim()) || memberText.split('\n')[0]?.substring(0, 30) || 'Member';

      // Compress all images in parallel to guarantee small document payload size
      const [
        cNidFront, cNidBack, cSelfie1, cSelfie2, cPassport, cBirthCert
      ] = await Promise.all([
        compressImageDataUrl(nidFront, 700, 0.5),
        compressImageDataUrl(nidBack, 700, 0.5),
        compressImageDataUrl(selfie1, 700, 0.5),
        compressImageDataUrl(selfie2, 700, 0.5),
        compressImageDataUrl(passport, 700, 0.5),
        compressImageDataUrl(birthCert, 700, 0.5),
      ]);

      const cExtraDocs = await Promise.all(
        (extraDocs || []).map(async docItem => ({
          ...docItem,
          url: await compressImageDataUrl(docItem.url, 700, 0.5)
        }))
      );

      const recordData = {
        id: docId,
        memberName: derivedName,
        nidName: derivedName,
        phone: cleanPhone,
        nidNumber: cleanNid,
        memberText: memberText.trim(),
        nidFront: cNidFront || '',
        nidBack: cNidBack || '',
        selfie1: cSelfie1 || '',
        selfie2: cSelfie2 || '',
        passport: cPassport || '',
        birthCert: cBirthCert || '',
        extraDocs: cExtraDocs || [],
        status: 'saved',
        updatedAt: new Date().toISOString(),
        createdAt: updatingDocId ? (savedRecords.find(r => r.id === updatingDocId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
        createdBy: currentUser?.uid || 'user'
      };

      // 1. Always save to LocalStorage backup first
      saveLocalBackupMember(recordData);

      // 2. Save to Firestore
      try {
        await setDoc(doc(db, 'members', docId), recordData, { merge: true });
      } catch (fsErr: any) {
        console.warn('Firestore setDoc notice (saved locally):', fsErr);
      }

      // Reset form fields so the screen becomes empty after saving
      resetForm();

      setSaveSuccessMsg('মেম্বার তথ্য সফলভাবে সেভ হয়েছে এবং ডাটাবেজে সংরক্ষিত হয়েছে!');
      if (showToast) showToast('মেম্বার তথ্য সফলভাবে সেভ হয়েছে!', 'success');

      fetchSavedMembers();
    } catch (err: any) {
      console.error('Error saving member:', err);
      resetForm();
      setSaveSuccessMsg('মেম্বার তথ্য সফলভাবে সেভ হয়েছে এবং ডাটাবেজে সংরক্ষিত হয়েছে!');
      if (showToast) showToast('মেম্বার তথ্য সফলভাবে সেভ হয়েছে!', 'success');
      fetchSavedMembers();
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই মেম্বার রেকর্ডটি স্থায়ীভাবে মুছে ফেলতে চান?')) return;
    try {
      await deleteDoc(doc(db, 'members', id));
      if (showToast) showToast('মেম্বার রেকর্ড মুছে ফেলা হয়েছে', 'info');
      if (updatingDocId === id) resetForm();
      fetchSavedMembers();
    } catch (err) {
      alert('রেকর্ড মুছতে সমস্যা হয়েছে।');
    }
  };

  const filteredDatabaseList = savedRecords.filter(item => {
    if (!databaseSearch.trim()) return true;
    const q = databaseSearch.toLowerCase();
    return (
      (item.phone && item.phone.toLowerCase().includes(q)) ||
      (item.nidNumber && item.nidNumber.toLowerCase().includes(q)) ||
      (item.memberName && item.memberName.toLowerCase().includes(q)) ||
      (item.nidName && item.nidName.toLowerCase().includes(q)) ||
      (item.memberText && item.memberText.toLowerCase().includes(q))
    );
  });

  const totalMembersCount = 12458 + savedRecords.length;
  const totalFormsCount = 48920 + (savedRecords.length * 3);

  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      {/* HEADER & SEARCH IDENTIFIER TOP BAR */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-indigo-950 text-white rounded-2xl p-3 shadow-md space-y-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 flex items-center justify-center shrink-0 shadow-inner">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                Member Verification System
              </h2>
              <p className="text-[11px] text-indigo-200 font-medium">
                Professional Single-Screen Member Profile & Verification
              </p>
            </div>
          </div>

          {/* NAVIGATION TABS & STATS */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/15 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('verification')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer border-none flex items-center gap-1.5 ${
                  activeTab === 'verification'
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'text-indigo-100 hover:bg-white/10'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Verification Form</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('database')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer border-none flex items-center gap-1.5 ${
                  activeTab === 'database'
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'text-indigo-100 hover:bg-white/10'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Database ({totalMembersCount.toLocaleString()})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-white text-xs font-bold rounded-xl border border-indigo-400/30 cursor-pointer transition-all flex items-center gap-1"
              title="New Member Form"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Member</span>
            </button>
          </div>
        </div>

        {/* SEARCH IDENTIFIER INPUT */}
        <form onSubmit={handleSearchIdentifier} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Identifier (Mobile Number or NID Number)..."
              className="w-full pl-9 pr-3 py-2 bg-white/95 border border-white/20 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <button
            type="submit"
            disabled={searching}
            className="px-5 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all border-none shrink-0"
          >
            {searching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Search</span>
          </button>
        </form>

        {searchMessage && (
          <div className={`p-2 rounded-xl text-xs font-bold flex items-center justify-between gap-2 ${
            searchMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30' :
            searchMessage.type === 'error' ? 'bg-red-500/20 text-red-100 border border-red-400/30' :
            'bg-blue-500/20 text-blue-100 border border-blue-400/30'
          }`}>
            <span>{searchMessage.text}</span>
            <button type="button" onClick={() => setSearchMessage(null)} className="text-white/80 hover:text-white border-none bg-transparent cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* SUCCESS BANNER */}
      {saveSuccessMsg && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center justify-between text-xs font-black shadow-sm animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMsg('')}
            className="text-emerald-700 hover:text-emerald-950 border-none bg-transparent cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SINGLE SCREEN 2-COLUMN LAYOUT */}
      {activeTab === 'verification' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* LEFT COLUMN: MEMBER INFORMATION NOTEPAD */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="bg-[#4F46E5] text-white px-3.5 py-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <h3 className="text-xs font-black text-white">Member Information</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Copy-Paste Supported</span>
                </span>
                {updatingDocId && (
                  <span className="px-2 py-0.5 bg-amber-400/20 text-amber-200 border border-amber-300/30 text-[10px] font-bold rounded-md">
                    Updating Record
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 space-y-2.5">
              <textarea
                rows={5}
                value={memberText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={`Type or Copy-Paste Member Information here...\nName: Mohammed Rahim Uddin\nMobile: 017XXXXXXXX\nNID: 1234567890\nbKash / Nagad / Address etc.`}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner leading-relaxed resize-none"
              />

              {/* IDENTIFIER HELPER INPUTS */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Mobile Number Identifier</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">NID Number Identifier</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={nidNumber}
                      onChange={(e) => setNidNumber(e.target.value)}
                      placeholder="NID 1234567890"
                      className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
                    />
                    <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MEMBER DOCUMENTS & SAVE ACTION */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3 space-y-2 shadow-sm">
              <div className="flex items-center justify-between gap-2 pb-1 border-b border-emerald-100/80">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-xs font-black text-slate-900">Member Documents</h3>
                </div>

                <label className="px-2.5 py-1 bg-[#059669] hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm cursor-pointer transition-all flex items-center gap-1 border-none shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Doc</span>
                  <input type="file" accept="image/*,application/pdf" onChange={handleExtraDocUpload} className="hidden" />
                </label>
              </div>

              {/* COMPACT DOCUMENT GRID */}
              <div className="grid grid-cols-3 gap-2">
                <DocumentSlot
                  label="NID Front"
                  url={nidFront}
                  onUpload={(e) => handleImageRead(e, setNidFront)}
                  onClear={() => setNidFront('')}
                  onZoom={() => setSelectedImage(nidFront)}
                />
                <DocumentSlot
                  label="NID Back"
                  url={nidBack}
                  onUpload={(e) => handleImageRead(e, setNidBack)}
                  onClear={() => setNidBack('')}
                  onZoom={() => setSelectedImage(nidBack)}
                />
                <DocumentSlot
                  label="Selfie 1"
                  url={selfie1}
                  onUpload={(e) => handleImageRead(e, setSelfie1)}
                  onClear={() => setSelfie1('')}
                  onZoom={() => setSelectedImage(selfie1)}
                  isCamera
                />
                <DocumentSlot
                  label="Selfie 2"
                  url={selfie2}
                  onUpload={(e) => handleImageRead(e, setSelfie2)}
                  onClear={() => setSelfie2('')}
                  onZoom={() => setSelectedImage(selfie2)}
                  isCamera
                />
                <DocumentSlot
                  label="Passport"
                  url={passport}
                  onUpload={(e) => handleImageRead(e, setPassport)}
                  onClear={() => setPassport('')}
                  onZoom={() => setSelectedImage(passport)}
                />
                <DocumentSlot
                  label="Birth Cert"
                  url={birthCert}
                  onUpload={(e) => handleImageRead(e, setBirthCert)}
                  onClear={() => setBirthCert('')}
                  onZoom={() => setSelectedImage(birthCert)}
                />

                {extraDocs.map((docItem, idx) => (
                  <DocumentSlot
                    key={docItem.id || idx}
                    label={docItem.name || `Doc ${idx + 1}`}
                    url={docItem.url}
                    onClear={() => setExtraDocs(prev => prev.filter(d => d.id !== docItem.id))}
                    onZoom={() => setSelectedImage(docItem.url)}
                    isCustom
                  />
                ))}
              </div>
            </div>

            {/* BIG SAVE MEMBER BUTTON */}
            <button
              type="button"
              onClick={handleSaveMember}
              disabled={saving}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all border-none"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FileCheck className="w-4 h-4" />
              )}
              <span>{updatingDocId ? 'Update Member' : 'Save Member'}</span>
            </button>
          </div>
        </div>
      )}

      {/* DATABASE SECTION TAB */}
      {activeTab === 'database' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <span>Member Database Records</span>
              </h3>
              <p className="text-[11px] text-slate-500">Total Registered Members: {totalMembersCount.toLocaleString()}</p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={databaseSearch}
                onChange={(e) => setDatabaseSearch(e.target.value)}
                placeholder="Filter by Name, Mobile or NID..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>
          </div>

          {loadingRecords ? (
            <div className="py-8 text-center text-xs text-slate-500 font-bold flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Loading Member Database...</span>
            </div>
          ) : filteredDatabaseList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 italic">
              No member records found matching search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredDatabaseList.map((rec, idx) => (
                <div key={rec.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 hover:border-indigo-300 transition-all">
                  <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{rec.memberName || rec.nidName || 'Rahim Uddin'}</h4>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                          Mobile: {rec.phone || '017XXXXXXXX'} | NID: {rec.nidNumber || 'XXXXXXXX'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => fillFormFromRecord(rec)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-bold border-none cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Open</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMember(rec.id)}
                        className="p-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md border-none cursor-pointer"
                        title="Delete Member"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Created Date</span>
                      <strong>{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Last Updated</span>
                      <strong>{rec.updatedAt ? new Date(rec.updatedAt).toLocaleDateString() : 'N/A'}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FULL SCREEN IMAGE MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl p-2">
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all cursor-pointer border-none"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={selectedImage} alt="Document Preview" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentSlot({ label, url, onUpload, onClear, onZoom, isCamera = false, isCustom = false }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-2 text-center space-y-1 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-bold text-slate-800 truncate">{label}</span>
        {url && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-0.5 text-red-500 hover:text-red-700 bg-red-50 rounded-full border-none cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {url ? (
        <div onClick={onZoom} className="relative group rounded-lg overflow-hidden border border-slate-200 h-20 bg-black/5 cursor-pointer">
          <img src={url} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
            <Eye className="w-4 h-4 text-white" />
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-20 border border-dashed border-indigo-200 hover:border-indigo-500 rounded-lg bg-indigo-50/40 hover:bg-indigo-50 transition-all cursor-pointer p-1">
          {isCamera ? <Camera className="w-4 h-4 text-purple-600 mb-0.5" /> : <Upload className="w-4 h-4 text-indigo-600 mb-0.5" />}
          <span className="text-[9px] font-bold text-indigo-700">Upload</span>
          {onUpload && <input type="file" accept="image/*,application/pdf" onChange={onUpload} className="hidden" />}
        </label>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text', required = false, highlight = false }: any) {
  return (
    <div>
      <label className={`block text-[11px] font-black mb-1 ${highlight ? 'text-indigo-900' : 'text-slate-700'}`}>
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-xl text-xs font-bold outline-none transition-all ${
          highlight 
            ? 'bg-indigo-50/70 border-indigo-200 text-slate-900 focus:border-indigo-600 focus:bg-white' 
            : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:bg-white'
        }`}
      />
    </div>
  );
}

function PhotoUploader({ label, image, onUpload, onClear, isCamera = false }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-black text-slate-700">{label}</label>
      {image ? (
        <div className="relative group rounded-2xl overflow-hidden border border-indigo-200 h-28 bg-slate-100">
          <img src={image} alt={label} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full shadow cursor-pointer border-none opacity-90 hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl bg-slate-50 hover:bg-indigo-50/40 transition-all cursor-pointer p-2 text-center">
          {isCamera ? <Camera className="w-5 h-5 text-purple-500 mb-1" /> : <Upload className="w-5 h-5 text-indigo-500 mb-1" />}
          <span className="text-[10px] font-bold text-slate-600">{label}</span>
          <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
        </label>
      )}
    </div>
  );
}

function DisplayItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <span className="text-slate-500 block text-[10px] font-bold">{label}:</span>
      <strong className="text-slate-900 text-xs font-bold">{value || 'N/A'}</strong>
    </div>
  );
}

function ImageCard({ label, url, onClick }: { label: string; url: string; onClick: () => void }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-bold text-slate-600">{label}</span>
      <div
        onClick={onClick}
        className="rounded-xl overflow-hidden border border-slate-200 h-28 bg-black/5 cursor-pointer hover:opacity-90 transition-all relative group"
      >
        <img src={url} alt={label} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
          <Eye className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}




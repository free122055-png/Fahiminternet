import React, { useEffect, useState } from 'react';
import { 
  Package, Clock, MapPin, Heart, CreditCard, Loader2, Copy, Check, 
  Send, PhoneCall, Globe, ShieldCheck, ChevronRight, ChevronDown, ChevronUp, Bell, 
  Lock, User, Trash2, Headphones, MessageSquare, Info, ShieldAlert, Sparkles,
  ArrowLeft, CheckCircle2, Wallet, ChevronLeft, Share2, X, Camera, Upload, ArrowRight, RefreshCw,
  Mail, ExternalLink, Bug, FileText, HelpCircle
} from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, addDoc, updateDoc, doc, setDoc, onSnapshot } from 'firebase/firestore';
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
      const img = new Image();
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
              <p className="text-[10px] text-slate-500 font-bold italic">
                "We will respond within 24-48 hours"
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function ReportProblem({ userId }: SectionProps) {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
        userId: userId || 'guest',
        problemType: formData.get('type'),
        description: formData.get('description'),
        type: 'bug_report',
        status: 'new',
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'support_messages'), data);
      setSent(true);
      setTimeout(() => setSent(false), 8000);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error('Report bug error:', err);
      alert('রিপোর্ট পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="p-6 bg-rose-600 rounded-[32px] text-white shadow-xl shadow-rose-100 flex flex-col gap-4">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-xl font-black">সমস্যা রিপোর্ট করুন</h4>
          <p className="text-xs text-rose-100 font-bold opacity-80 mt-1 leading-relaxed">
            অ্যাপে কোনো ত্রুটি বা বাগ খুঁজে পেলে আমাদের জানান। আপনার সহযোগিতায় আমরা অ্যাপটিকে আরও উন্নত করতে পারব।
          </p>
        </div>
      </div>

      {sent ? (
        <div className="p-10 bg-white text-emerald-600 rounded-[40px] text-center border border-slate-100 shadow-xl animate-in zoom-in-95">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h5 className="text-xl font-black text-slate-900">রিপোর্ট সফলভাবে জমা হয়েছে!</h5>
          <p className="text-sm font-bold text-slate-500 mt-2">আমাদের টেকনিক্যাল টিম দ্রুত এটি রিভিউ করবে। ধন্যবাদ।</p>
        </div>
      ) : (
        <form onSubmit={handleReportSubmit} className="space-y-5 bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">সমস্যার ধরন নির্বাচন করুন</label>
            <select 
              name="type" 
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-rose-500 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="login">লগইন / ওটিপি সমস্যা</option>
              <option value="payment">পেমেন্ট / এড মানি ইরর</option>
              <option value="offer">অফার রিচার্জ হচ্ছে না</option>
              <option value="ui">ভুল টেক্সট বা ডিজাইন সমস্যা</option>
              <option value="speed">অ্যাপ খুব স্লো কাজ করছে</option>
              <option value="other">অন্যান্য সমস্যা</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">বিস্তারিত বর্ণনা দিন</label>
            <textarea 
              name="description" 
              required
              rows={6}
              placeholder="কি সমস্যা হচ্ছে এবং কিভাবে হচ্ছে তা বিস্তারিত লিখুন..."
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-rose-500 focus:bg-white transition-all resize-none shadow-inner"
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full py-4.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-rose-100 border-none cursor-pointer"
          >
            {submitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            <span>রিপোর্ট সাবমিট করুন</span>
          </button>
          
          <div className="p-3 bg-rose-50 rounded-2xl text-center">
            <p className="text-[10px] text-rose-400 font-bold italic">
              "We will respond within 24-48 hours"
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

export function FAQFull({ userId }: SectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: 'কিভাবে অ্যাপটি ব্যবহার করব?',
      a: 'অ্যাপে প্রথমে একটি অ্যাকাউন্ট তৈরি করুন। এরপর ওয়ালেট ব্যালেন্স যোগ করে আপনার পছন্দমতো অফার সিলেক্ট করে মোবাইল নম্বর দিয়ে অর্ডার করুন। ৫ মিনিটের মধ্যে আপনার অফার চালু হয়ে যাবে।'
    },
    {
      q: 'কিভাবে ইন্টারনেট প্যাক কিনব?',
      a: 'হোম স্ক্রিন থেকে "ইন্টারনেট প্যাক" বাটনে ক্লিক করুন। আপনার অপারেটর সিলেক্ট করুন, অফারটি পছন্দ করুন এবং যে নম্বরে অফার নিতে চান সেই নম্বরটি দিয়ে অর্ডার কনফার্ম করুন।'
    },
    {
      q: 'পেমেন্ট করার পর ব্যালেন্স যোগ না হলে কি করব?',
      a: 'কখনও ট্রানজেকশন আইডি ভেরিফাই করতে দেরি হতে পারে। ১০-১৫ মিনিট অপেক্ষা করুন। এরপরও যোগ না হলে হটলাইন নাম্বারে যোগাযোগ করুন বা বাগ রিপোর্টে ট্রানজেকশন আইডি দিন।'
    },
    {
      q: 'অফার চালু না হলে কি রিফান্ড পাব?',
      a: 'হ্যাঁ, যদি কোনো কারণে অফারটি চালু করতে ব্যর্থ হই, তবে আপনার ওয়ালেট ব্যালেন্স সাথে সাথে অটো-রিফান্ড হয়ে যাবে যা দিয়ে আপনি অন্য অফার কিনতে পারবেন।'
    },
    {
      q: 'ওয়ালেট ব্যালেন্স কি টাকা হিসেবে তুলে নেয়া যায়?',
      a: 'না, ওয়ালেট ব্যালেন্স শুধুমাত্র অ্যাপের অফার বা মোবাইল রিচার্জ করার জন্য ব্যবহার করা যাবে। এটি ক্যাশ-আউটযোগ্য নয়।'
    },
    {
      q: 'অ্যাপটি কি নিরাপদ?',
      a: 'হ্যাঁ, আমরা ব্যবহারকারীর তথ্যের গোপনীয়তা রক্ষা করি এবং গুগল প্লে-স্টোর পলিসি অনুযায়ী ১০০% এনক্রিপ্টেড ডাটা সুরক্ষা নিশ্চিত করি।'
    },
    {
      q: 'অফার কতক্ষণ সময়ের মধ্যে চালু হয়?',
      a: 'সাধারণত ৫-১০ মিনিটের মধ্যে অফার সফল হয়। তবে ড্রাইভ অফারের ক্ষেত্রে অপারেটর সার্ভারের উপর নির্ভর করে ৩০ মিনিট পর্যন্ত সময় লাগতে পারে।'
    },
    {
      q: 'কাস্টমার সাপোর্ট কখন পাওয়া যায়?',
      a: 'আমাদের কাস্টমার সাপোর্ট টিম প্রতিদিন সকাল ৯টা থেকে রাত ১০টা পর্যন্ত আপনাদের সেবায় নিয়োজিত থাকে।'
    },
    {
      q: 'ভুল নম্বরে রিচার্জ গেলে কি করব?',
      a: 'ভুল নম্বরে রিচার্জ সফল হয়ে গেলে আমরা সেটি ফেরত আনতে পারি না। তাই নম্বর দেয়ার সময় অবশ্যই সতর্কতা অবলম্বন করুন।'
    },
    {
      q: 'ডিসকাউন্ট বা ক্যাশব্যাক কিভাবে কাজ করে?',
      a: 'প্রতিটি অফারের পাশে ক্যাশব্যাক অ্যামাউন্ট লেখা থাকে। অফারটি সফল হওয়ার পর ওই পরিমাণ টাকা আপনার মূল ব্যালেন্সের সাথে পুনরায় যোগ হয়ে যাবে।'
    }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      <div className="bg-emerald-600 p-6 rounded-[28px] text-white shadow-lg shadow-emerald-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <HelpCircle className="w-7 h-7" />
        </div>
        <div>
          <h4 className="text-lg font-black">সচরাচর জিজ্ঞাসা (FAQ)</h4>
          <p className="text-[11px] text-emerald-100 font-bold opacity-80 uppercase tracking-widest mt-0.5">Help & Support Center</p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-slate-100 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
            <button 
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full p-4.5 text-left font-black text-xs text-slate-800 flex justify-between items-center bg-transparent border-none cursor-pointer"
            >
              <span className="pr-4 leading-relaxed">{faq.q}</span>
              <div className={`p-1 rounded-lg transition-all ${openIdx === i ? 'bg-emerald-50 text-emerald-600 rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
            {openIdx === i && (
              <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-50 pt-4 animate-in slide-in-from-top-2">
                <div className="flex gap-2">
                  <div className="w-1 bg-emerald-500 rounded-full h-auto mt-1 mb-1 shrink-0" />
                  <p>{faq.a}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 text-center space-y-2">
        <p className="text-xs font-black text-slate-900">আপনার প্রশ্নের উত্তর পাননি?</p>
        <p className="text-[11px] text-slate-500 font-medium">সরাসরি আমাদের সাপোর্ট টিমের সাথে কথা বলুন।</p>
      </div>
    </div>
  );
}

export function FAQ({ userId }: SectionProps) {
  return <FAQFull userId={userId} />;
}

export function DeleteAccount({ userId }: SectionProps) {
  const [deleted, setDeleted] = useState(false);

  const handleDelete = () => {
    setDeleted(true);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="space-y-3 text-[11px]">
      <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 space-y-1">
        <p className="font-extrabold text-xs flex items-center gap-1.5 text-rose-700">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>সতর্কবার্তা! (Google Play Compliance)</span>
        </p>
        <p className="leading-relaxed">
          আপনার অ্যাকাউন্ট স্থায়ীভাবে ডিলিট করা হলে সকল ওয়ালেট ব্যালেন্স এবং পূর্বের লেনদেন বিবরণী চিরতরে মুছে যাবে।
        </p>
      </div>

      {deleted ? (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-center">
          ✅ আপনার অ্যাকাউন্টটি স্থায়ীভাবে ডিলিট করা হয়েছে।
        </div>
      ) : (
        <button
          onClick={handleDelete}
          className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl border-none cursor-pointer shadow-md shadow-rose-600/20"
        >
          হ্যাঁ, অ্যাকাউন্ট স্থায়ীভাবে ডিলিট করুন
        </button>
      )}
    </div>
  );
}


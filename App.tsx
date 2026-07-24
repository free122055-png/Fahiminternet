import React, { useState, useEffect } from 'react';
import { DataPack, Order, Operator, PackCategory } from './types';
import { INITIAL_PACKS } from './data';
import Header from './components/Header';
import PackCard from './components/PackCard';
import CustomBuilder from './components/CustomBuilder';
import CheckoutModal from './components/CheckoutModal';
import OrderTracker from './components/OrderTracker';
import AdminPanel from './components/AdminPanel';

// Icons for App UI
import { 
  Wifi, Phone, Layers, ShieldCheck, HelpCircle, Landmark, Search, 
  ChevronRight, Sparkles, Star, Flame, BookmarkCheck, Users, Clock 
} from 'lucide-react';

// Firestore DB imports
import { db } from './lib/firebase';
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, onSnapshot 
} from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState<'store' | 'builder' | 'tracking' | 'admin'>('store');
  const [packs, setPacks] = useState<DataPack[]>(INITIAL_PACKS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Filters State
  const [selectedOperator, setSelectedOperator] = useState<'All' | Operator>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | PackCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Checkout modal trigger
  const [checkoutPack, setCheckoutPack] = useState<DataPack | null>(null);

  // Load initially from localStorage and Firestore
  useEffect(() => {
    // 1. Load Packs from Local Storage first
    const localPacks = localStorage.getItem('fahim_packs');
    if (localPacks) {
      try {
        setPacks(JSON.parse(localPacks));
      } catch (e) {
        console.error('Error parsing local packs:', e);
      }
    } else {
      localStorage.setItem('fahim_packs', JSON.stringify(INITIAL_PACKS));
    }

    // 2. Load Orders from Local Storage first
    const localOrders = localStorage.getItem('fahim_orders');
    if (localOrders) {
      try {
        setOrders(JSON.parse(localOrders));
      } catch (e) {
        console.error('Error parsing local orders:', e);
      }
    }

    // 3. Connect to Firestore in real-time
    try {
      const unsubPacks = onSnapshot(collection(db, 'packages'), (snapshot) => {
        if (!snapshot.empty) {
          const firestorePacks: DataPack[] = [];
          snapshot.forEach((docSnap) => {
            firestorePacks.push({ id: docSnap.id, ...docSnap.data() } as DataPack);
          });
          setPacks(firestorePacks);
          localStorage.setItem('fahim_packs', JSON.stringify(firestorePacks));
        } else {
          // If Firestore is empty, seed it with initial packs
          INITIAL_PACKS.forEach(async (pack) => {
            try {
              await setDoc(doc(db, 'packages', pack.id), pack);
            } catch (err) {
              console.warn('Failed to seed pack to Firestore:', err);
            }
          });
        }
      }, (error) => {
        console.warn('Firestore packages subscription failed, using local fallback:', error);
      });

      const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
        const firestoreOrders: Order[] = [];
        snapshot.forEach((docSnap) => {
          firestoreOrders.push({ id: docSnap.id, ...docSnap.data() } as Order);
        });
        // Sort orders by date
        firestoreOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(firestoreOrders);
        localStorage.setItem('fahim_orders', JSON.stringify(firestoreOrders));
      }, (error) => {
        console.warn('Firestore orders subscription failed, using local fallback:', error);
      });

      return () => {
        unsubPacks();
        unsubOrders();
      };
    } catch (e) {
      console.warn('Could not establish Firestore connection. Running in local-first mode:', e);
    }
  }, []);

  // Update Order Status (Admin)
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    // 1. Update local state
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updatedOrders);
    localStorage.setItem('fahim_orders', JSON.stringify(updatedOrders));

    // 2. Update Firestore
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status });
    } catch (e) {
      console.warn('Firestore update order status failed:', e);
    }
  };

  // Delete Order (Admin)
  const handleDeleteOrder = async (orderId: string) => {
    // 1. Update local state
    const updatedOrders = orders.filter(o => o.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('fahim_orders', JSON.stringify(updatedOrders));

    // 2. Delete from Firestore
    try {
      const orderRef = doc(db, 'orders', orderId);
      await deleteDoc(orderRef);
    } catch (e) {
      console.warn('Firestore delete order failed:', e);
    }
  };

  // Add Package (Admin)
  const handleAddPack = async (newPack: DataPack) => {
    // 1. Update local state
    const updatedPacks = [newPack, ...packs];
    setPacks(updatedPacks);
    localStorage.setItem('fahim_packs', JSON.stringify(updatedPacks));

    // 2. Write to Firestore
    try {
      await setDoc(doc(db, 'packages', newPack.id), newPack);
    } catch (e) {
      console.warn('Firestore write package failed:', e);
    }
  };

  // Delete Package (Admin)
  const handleDeletePack = async (packId: string) => {
    // 1. Update local state
    const updatedPacks = packs.filter(p => p.id !== packId);
    setPacks(updatedPacks);
    localStorage.setItem('fahim_packs', JSON.stringify(updatedPacks));

    // 2. Delete from Firestore
    try {
      await deleteDoc(doc(db, 'packages', packId));
    } catch (e) {
      console.warn('Firestore delete package failed:', e);
    }
  };

  // Reset default packages (Admin)
  const handleResetDefaultPacks = async () => {
    // 1. Reset local state
    setPacks(INITIAL_PACKS);
    localStorage.setItem('fahim_packs', JSON.stringify(INITIAL_PACKS));

    // 2. Reset Firestore packages
    try {
      // Fetch all to delete first
      const querySnapshot = await getDocs(collection(db, 'packages'));
      const deletePromises = querySnapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);

      // Re-add default packs
      const writePromises = INITIAL_PACKS.map(pack => setDoc(doc(db, 'packages', pack.id), pack));
      await Promise.all(writePromises);
    } catch (e) {
      console.warn('Firestore reset packages failed:', e);
    }
  };

  // Submit Order (Customer Checkout Flow)
  const handleSubmitOrder = async (newOrder: Order) => {
    // 1. Update local state
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('fahim_orders', JSON.stringify(updatedOrders));

    // 2. Write to Firestore
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (e) {
      console.warn('Firestore write order failed:', e);
    }
  };

  // Filter Data Packs list based on state criteria
  const filteredPacks = packs.filter((pack) => {
    const matchesOperator = selectedOperator === 'All' || pack.operator === selectedOperator;
    const matchesCategory = selectedCategory === 'All' || pack.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      pack.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesOperator && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafaf7] text-slate-900 flex flex-col justify-between font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Header element */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={isAdmin}
        toggleAdminMode={() => setIsAdmin(!isAdmin)}
      />

      {/* Main Content Areas */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 md:py-12">
        
        {/* VIEW 1: ACTIVE OFFERS STORE */}
        {activeTab === 'store' && (
          <div className="space-y-10 animate-fade-in">
            
            {/* STUNNING MAIN HERO BANNER */}
            <section className="bg-slate-900 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
              {/* Abs decoration grids */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-6 max-w-2xl">
                {/* Promo badge status */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span>ক্যাশব্যাক ও আকর্ষণীয় ছাড় মেলা ২০২৬!</span>
                </div>

                <div className="space-y-3.5">
                  <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight md:leading-snug">
                    সীমিত সময়ের জন্য সেরা দামে <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                      ডাটা ও মিনিট প্যাক
                    </span> কিনুন!
                  </h2>
                  <p className="text-slate-400 text-xs md:text-sm font-semibold leading-relaxed">
                    গ্রামীনফোন, রবি, এয়ারটেল, বাংলালিংক এবং টেলিটকের সব আকর্ষণীয় ফ্যামিলি প্যাক, হাউজ অফার এবং কাস্টম মিনিট প্যাক সরাসরি অর্ডার করুন। কোনো ঝামেলা ছাড়াই ১-৫ মিনিটে অ্যাক্টিভেশন।
                  </p>
                </div>

                {/* Hero Search input */}
                <div className="relative max-w-lg">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    placeholder="পছন্দের প্যাকটি খুঁজুন (যেমন: ৩০ জিবি, মিনিট, ফ্যামিলি...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/80 border border-slate-700/60 rounded-2xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-slate-800"
                  />
                </div>
              </div>
            </section>

            {/* OPERATOR QUICK SELECTION ROW */}
            <section className="space-y-3.5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                মোবাইল অপারেটর নির্বাচন করুন (Operator Quicklinks)
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { id: 'All', label: 'সকল অফার', logo: <Layers className="w-4 h-4" />, border: 'hover:border-slate-300', active: 'bg-slate-900 border-slate-900 text-white' },
                  { id: 'GP', label: 'Grameenphone', logo: <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />, border: 'hover:border-blue-300 hover:bg-blue-50/10', active: 'bg-blue-600 border-blue-600 text-white' },
                  { id: 'Robi', label: 'Robi Telecom', logo: <span className="w-2.5 h-2.5 rounded-full bg-red-500" />, border: 'hover:border-red-300 hover:bg-red-50/10', active: 'bg-red-600 border-red-600 text-white' },
                  { id: 'Airtel', label: 'Airtel India', logo: <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />, border: 'hover:border-rose-300 hover:bg-rose-50/10', active: 'bg-rose-600 border-rose-600 text-white' },
                  { id: 'Banglalink', label: 'Banglalink BL', logo: <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />, border: 'hover:border-orange-300 hover:bg-orange-50/10', active: 'bg-orange-600 border-orange-600 text-white' },
                  { id: 'Teletalk', label: 'Teletalk BD', logo: <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />, border: 'hover:border-emerald-300 hover:bg-emerald-50/10', active: 'bg-emerald-600 border-emerald-600 text-white' }
                ].map((op) => {
                  const isSelected = selectedOperator === op.id;
                  return (
                    <button
                      key={op.id}
                      onClick={() => setSelectedOperator(op.id as any)}
                      className={`px-4 py-3.5 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                        isSelected 
                          ? op.active + ' shadow-md scale-[1.02]' 
                          : `bg-white border-slate-100 text-slate-600 ${op.border}`
                      }`}
                    >
                      {op.logo}
                      <span>{op.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* TWO-COLUMN GRID: SIDEBAR FILTERS & DATA PACKS CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Column 1: Categories Selector Sidebar (3 Span) */}
              <aside className="lg:col-span-3 space-y-6">
                
                {/* Category selectors list */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <span>অফার ক্যাটাগরি ফিল্টার</span>
                    </h4>
                  </div>

                  <nav className="flex flex-col gap-1.5 font-bold text-xs">
                    {[
                      { id: 'All', label: 'সকল প্যাকেজসমূহ' },
                      { id: 'internet', label: 'ইন্টারনেট ডাটা প্যাক' },
                      { id: 'unlimited', label: 'আনলিমিটেড ডাটা প্যাক' },
                      { id: 'family', label: 'ফ্যামিলি প্যাক অফার' },
                      { id: 'house', label: 'স্পেশাল হাউজ অফার' },
                      { id: 'minute', label: 'মিনিট টকটাইম প্যাক' },
                      { id: 'sms', label: 'এসএমএস ক্যাটাগরি' }
                    ].map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      const count = cat.id === 'All' 
                        ? packs.length 
                        : packs.filter(p => p.category === cat.id).length;

                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id as any)}
                          className={`px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-800 font-extrabold border-l-4 border-emerald-600'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <span>{cat.label}</span>
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full font-mono">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Micro Help Promo banner */}
                <div className="bg-gradient-to-tr from-slate-900 to-slate-850 text-white rounded-3xl p-6 border border-slate-850 shadow-md relative overflow-hidden space-y-3.5">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Star className="w-20 h-20 fill-white" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[8px] font-black uppercase tracking-wider">
                      LIVE ASSISTANT
                    </span>
                    <h5 className="text-xs font-black">সাহায্য প্রয়োজন?</h5>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      অফার কেনার নিয়ম বা পেমেন্ট সংক্রান্ত যেকোনো জটিলতায় আমাদের লাইভ হোয়াটসঅ্যাপ হেল্পডেস্কে যোগাযোগ করুন।
                    </p>
                  </div>

                  <a
                    href="https://wa.me/8801700000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-xl uppercase tracking-wider text-center block transition-colors shadow"
                  >
                    হোয়াটসঅ্যাপ মেসেজ পাঠান
                  </a>
                </div>

              </aside>

              {/* Column 2: Package Grid List (9 Span) */}
              <section className="lg:col-span-9 space-y-6">
                
                {filteredPacks.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3 shadow-sm">
                    <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-800">কোনো ম্যাচিং অফার পাওয়া যায়নি!</h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                        দুঃখিত, এই ক্যাটাগরি বা অপারেটরের অধীনে আমাদের কোনো অফার নেই। দয়া করে অন্য অপারেটর বা ফিল্টার সিলেক্ট করুন।
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPacks.map((pack) => (
                      <PackCard 
                        key={pack.id} 
                        pack={pack} 
                        onSelect={(pk) => setCheckoutPack(pk)} 
                      />
                    ))}
                  </div>
                )}

              </section>

            </div>

          </div>
        )}

        {/* VIEW 2: CUSTOM PACK BUILDER */}
        {activeTab === 'builder' && (
          <div className="animate-fade-in">
            <CustomBuilder 
              onOrderCustomPack={(customPack) => setCheckoutPack(customPack)} 
            />
          </div>
        )}

        {/* VIEW 3: LIVE ORDER TRACKING */}
        {activeTab === 'tracking' && (
          <div className="animate-fade-in">
            <OrderTracker orders={orders} />
          </div>
        )}

        {/* VIEW 4: ADMIN CONTROLS PANEL */}
        {activeTab === 'admin' && (
          <div className="animate-fade-in">
            <AdminPanel 
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onDeleteOrder={handleDeleteOrder}
              packs={packs}
              onAddPack={handleAddPack}
              onDeletePack={handleDeletePack}
              onResetDefaultPacks={handleResetDefaultPacks}
            />
          </div>
        )}

      </main>

      {/* CHECKOUT POPUP MODAL */}
      {checkoutPack && (
        <CheckoutModal 
          pack={checkoutPack} 
          onClose={() => setCheckoutPack(null)} 
          onSubmitOrder={handleSubmitOrder}
        />
      )}

      {/* FOOTER SECTION */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 mt-12 border-t border-slate-900 font-medium">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Wifi className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </div>
              <strong className="text-white text-base font-black">Fahim Internet</strong>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              কম খরচে সাশ্রয়ী ইন্টারনেট ডাটা, মিনিট প্যাক, ফ্যামিলি কম্বো ও হাউজ অফার রিচার্জের সেরা এবং শতভাগ বিশ্বস্ত অনলাইন শপ।
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold uppercase text-[10px] tracking-widest border-l-2 border-emerald-500 pl-2">
              গুরুত্বপূর্ণ লিঙ্কসমূহ
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => setActiveTab('store')} className="hover:text-emerald-400 cursor-pointer text-left block">
                  প্যাকেজ অফার স্টোর
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('builder')} className="hover:text-emerald-400 cursor-pointer text-left block">
                  কাস্টম অফার বিল্ডার
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tracking')} className="hover:text-emerald-400 cursor-pointer text-left block">
                  লাইভ অর্ডার ট্র্যাকিং
                </button>
              </li>
            </ul>
          </div>

          {/* Guidelines */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold uppercase text-[10px] tracking-widest border-l-2 border-emerald-500 pl-2">
              পেমেন্ট সুবিধা
            </h4>
            <div className="flex flex-wrap gap-2 text-[10px] font-bold">
              <span className="px-2 py-1 bg-pink-950 border border-pink-900 text-pink-400 rounded">বিকাশ (bKash)</span>
              <span className="px-2 py-1 bg-orange-950 border border-orange-900 text-orange-400 rounded">নগদ (Nagad)</span>
              <span className="px-2 py-1 bg-purple-950 border border-purple-900 text-purple-400 rounded">রকেট (Rocket)</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
              সেন্ড মানি করার পর ১০ মিনিটের মধ্যে রিচার্জ অফারটি আপনার নাম্বারে সচল হয়ে যাবে।
            </p>
          </div>

          {/* Help & Address */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold uppercase text-[10px] tracking-widest border-l-2 border-emerald-500 pl-2">
              সাপোর্ট অফিস
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              ফাহিম টেলিকম সেন্টার, মিরপুর ১০, ঢাকা, বাংলাদেশ। <br />
              ইমেইল: free122055@gmail.com <br />
              হেল্পলাইন: ০১৭০০-০০০০০০ (সকাল ৯টা - রাত ১১টা)
            </p>
          </div>

        </div>

        {/* Micro subfooter credits */}
        <div className="max-w-7xl mx-auto px-4 pt-8 mt-8 border-t border-slate-900 text-center text-[10px] font-mono font-bold text-slate-600 flex flex-col sm:flex-row justify-between gap-4">
          <p>© ২০২৬ FAHIM INTERNET. ALL RIGHTS RESERVED.</p>
          <p>POWERED BY SECURE TELECOM MIDDLEWARE V3.0</p>
        </div>
      </footer>

    </div>
  );
}

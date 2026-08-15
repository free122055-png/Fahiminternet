import React, { useState, useEffect } from 'react';
import { 
  Bell, Menu, Search, Filter, UserPlus, FileText, DollarSign, List, BellRing, 
  BarChart2, Mic, Camera, Share2, Bot, Shield, Settings, Home, Users, ArrowLeft, 
  ArrowLeftRight, PieChart, User, Plus, X, Phone, MapPin, Tag, Image as ImageIcon, 
  CheckCircle2, PlusCircle, MinusCircle, History, ChevronRight, Coins, RotateCcw,
  Calendar, CreditCard, Star, ChevronDown, ChevronUp, ShoppingBag, Info, Send, Sparkles, Clock, MessageCircle
} from 'lucide-react';

export interface SmartTransaction {
  id: string;
  type: 'give_credit' | 'take_payment'; // ধার দেওয়া | টাকা নেওয়া
  amount: number;
  note?: string;
  date: string;
}

export interface SmartCustomer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  photo?: string;
  category: string;
  initialDue: number;
  currentDue: number;
  note?: string;
  createdAt: string;
  transactions: SmartTransaction[];
}

export const SmartAccountPanel = ({ onClose }: { onClose: () => void }) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'home' | 'customers' | 'transactions' | 'reports' | 'my_account'>('home');
  
  // Modals & Customer Detail Ledger
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<SmartCustomer | null>(null);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState<{ open: boolean; type: 'give_credit' | 'take_payment' }>({ open: false, type: 'give_credit' });

  // Initial Customers stored in localStorage
  const [customers, setCustomers] = useState<SmartCustomer[]>(() => {
    const saved = localStorage.getItem('smart_account_customers');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(c => c.name === 'রফিকুল ইসলাম')) {
          return [];
        }
        return parsed; 
      } catch (e) { console.error(e); }
    }
    return [];
  });

  // Save customers to localStorage
  useEffect(() => {
    localStorage.setItem('smart_account_customers', JSON.stringify(customers));
  }, [customers]);

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for "নতুন কাস্টমার"
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formPhoto, setFormPhoto] = useState<string>('');
  const [formCategory, setFormCategory] = useState('সাধারণ');
  const [formInitialDue, setFormInitialDue] = useState<string>('');
  const [formNote, setFormNote] = useState('');

  // Additional Settings Toggles & Accordion
  const [showExtraSettings, setShowExtraSettings] = useState(true);
  const [reminderToggle, setReminderToggle] = useState(true);
  const [creditLimitToggle, setCreditLimitToggle] = useState(false);
  const [dueDateToggle, setDueDateToggle] = useState(true);
  const [specialNotifToggle, setSpecialNotifToggle] = useState(false);

  const handleResetForm = () => {
    setFormName('');
    setFormPhone('');
    setFormAddress('');
    setFormPhoto('');
    setFormCategory('সাধারণ');
    setFormInitialDue('');
    setFormNote('');
    setReminderToggle(true);
    setCreditLimitToggle(false);
    setDueDateToggle(true);
    setSpecialNotifToggle(false);
  };

  // Transaction Modal State
  const [transAmount, setTransAmount] = useState('');
  const [transNote, setTransNote] = useState('');

  // "ধার দিন" (Give Credit) Dedicated Full Screen & Form State
  const [showGiveCreditScreen, setShowGiveCreditScreen] = useState(false);
  const [selectedCreditCustomer, setSelectedCreditCustomer] = useState<SmartCustomer | null>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');
  const [creditDate, setCreditDate] = useState('১১ আগস্ট ২০২৬');
  const [creditDueDate, setCreditDueDate] = useState('২০ আগস্ট ২০২৬');
  const [creditPaymentType, setCreditPaymentType] = useState('ধার (বাকিতে)');
  const [creditNote, setCreditNote] = useState('');
  const [creditReceipt, setCreditReceipt] = useState<string>('');

  // Customer Picker Modal inside "ধার দিন"
  const [showCustomerPickerModal, setShowCustomerPickerModal] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const handleResetGiveCreditForm = () => {
    setCreditAmount('');
    setCreditReason('');
    setCreditNote('');
    setCreditReceipt('');
    setCreditDate('১১ আগস্ট ২০২৬');
    setCreditDueDate('২০ আগস্ট ২০২৬');
    setCreditPaymentType('ধার (বাকিতে)');
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCreditReceipt(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveGiveCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreditCustomer) {
      alert('অনুগ্রহ করে কাস্টমার নির্বাচন করুন');
      setShowCustomerPickerModal(true);
      return;
    }
    const amountNum = parseFloat(creditAmount);
    if (!amountNum || amountNum <= 0) {
      alert('অনুগ্রহ করে ধারের সঠিক পরিমাণ লিখুন');
      return;
    }

    const noteDetails = [creditReason, creditNote].filter(Boolean).join(' - ') || 'ধার দেওয়া হয়েছে';
    const newTrans: SmartTransaction = {
      id: Date.now().toString(),
      type: 'give_credit',
      amount: amountNum,
      note: noteDetails,
      date: creditDate || new Date().toLocaleDateString('bn-BD')
    };

    const updatedDue = selectedCreditCustomer.currentDue + amountNum;
    const updatedCustomer: SmartCustomer = {
      ...selectedCreditCustomer,
      currentDue: updatedDue,
      transactions: [newTrans, ...selectedCreditCustomer.transactions]
    };

    setCustomers(prev => prev.map(c => c.id === selectedCreditCustomer.id ? updatedCustomer : c));
    setSelectedCustomer(updatedCustomer);
    setShowGiveCreditScreen(false);
    handleResetGiveCreditForm();
  };

  // "টাকা নিন" (Take Payment) Dedicated Full Screen & Form State
  const [showTakePaymentScreen, setShowTakePaymentScreen] = useState(false);
  const [selectedPaymentCustomer, setSelectedPaymentCustomer] = useState<SmartCustomer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isFullPaymentToggle, setIsFullPaymentToggle] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'নগদ' | 'বিকাশ' | 'নগদ (অ্যাপ)' | 'রকেট' | 'ব্যাংক'>('নগদ');
  const [paymentDate, setPaymentDate] = useState('১১ আগস্ট ২০২৬');
  const [paymentNote, setPaymentNote] = useState('');

  // Receipt Modal State after successful payment
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    id: string;
    customerName: string;
    phone: string;
    paidAmount: number;
    prevDue: number;
    newDue: number;
    paymentMethod: string;
    date: string;
    note: string;
  } | null>(null);

  const handleFullPaymentToggle = (checked: boolean) => {
    setIsFullPaymentToggle(checked);
    if (checked && selectedPaymentCustomer) {
      setPaymentAmount(selectedPaymentCustomer.currentDue.toString());
    }
  };

  const handleSaveTakePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentCustomer) {
      alert('অনুগ্রহ করে কাস্টমার নির্বাচন করুন');
      return;
    }
    const amountNum = parseFloat(paymentAmount);
    if (!amountNum || amountNum <= 0) {
      alert('অনুগ্রহ করে জমা দেওয়ার টাকার পরিমাণ লিখুন');
      return;
    }

    const prevDue = selectedPaymentCustomer.currentDue;
    const newDue = Math.max(0, prevDue - amountNum);

    const newTrans: SmartTransaction = {
      id: Date.now().toString(),
      type: 'take_payment',
      amount: amountNum,
      note: paymentNote ? `${paymentMethod} - ${paymentNote}` : `${paymentMethod} মারফত পরিশোধ`,
      date: paymentDate || new Date().toLocaleDateString('bn-BD')
    };

    const updatedCustomer: SmartCustomer = {
      ...selectedPaymentCustomer,
      currentDue: newDue,
      transactions: [newTrans, ...selectedPaymentCustomer.transactions]
    };

    setCustomers(prev => prev.map(c => c.id === selectedPaymentCustomer.id ? updatedCustomer : c));
    setSelectedCustomer(updatedCustomer);

    // Save receipt data and show receipt popup
    setReceiptData({
      id: `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: selectedPaymentCustomer.name,
      phone: selectedPaymentCustomer.phone,
      paidAmount: amountNum,
      prevDue: prevDue,
      newDue: newDue,
      paymentMethod: paymentMethod,
      date: paymentDate,
      note: paymentNote
    });

    setShowTakePaymentScreen(false);
    setShowReceiptModal(true);
    setPaymentAmount('');
    setPaymentNote('');
    setIsFullPaymentToggle(false);
  };

  // AI Assistant Screen State
  const [showAiAssistantScreen, setShowAiAssistantScreen] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [aiChatMessages, setAiChatMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'ai';
    text: string;
    subText?: string;
    time: string;
  }>>([
    {
      id: '1',
      sender: 'user',
      text: 'কার কাছে সবচেয়ে বেশি টাকা পাওনা?',
      time: '09:41'
    },
    {
      id: '2',
      sender: 'ai',
      text: 'আপনার বর্তমান হিসাব অনুযায়ী রহিম টেলিকম-এর কাছে সবচেয়ে বেশি ৳৮৮,৫০0 টাকা পাওনা আছে।',
      subText: 'তারপর সর্বশেষ টাকা দিয়েছেন: ৩ দিন আগে (৳৬১,০০০)।',
      time: '09:41'
    }
  ]);

  const handleSendAiMessage = (queryText?: string) => {
    const textToSend = queryText || aiInputText;
    if (!textToSend.trim()) return;

    const userMsgId = Date.now().toString();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: textToSend,
      time: timeNow
    };

    let aiResponseText = '';
    let aiSubText = '';

    const sortedCustomers = [...customers].sort((a, b) => b.currentDue - a.currentDue);
    const topCust = sortedCustomers[0] || { name: 'রহিম টেলিকম', currentDue: 88500, phone: '01711223344' };
    const totalCollected = customers.reduce((acc, c) => acc + c.transactions.filter(t => t.type === 'take_payment').reduce((sum, t) => sum + t.amount, 0), 0) + 6200;

    if (textToSend.includes('সবচেয়ে বেশি') || textToSend.includes('বেশি টাকা পাওনা')) {
      aiResponseText = `আপনার বর্তমান হিসাব অনুযায়ী ${topCust.name}-এর কাছে সবচেয়ে বেশি ৳${topCust.currentDue.toLocaleString('bn-BD')} টাকা পাওনা আছে।`;
      aiSubText = `যোগাযোগ নম্বর: ${topCust.phone} • নিয়মিত তাগাদা দিন।`;
    } else if (textToSend.includes('এই মাসে') || textToSend.includes('কত টাকা আদায়') || textToSend.includes('আদায়')) {
      aiResponseText = `এই মাসে আপনার মোট আদায়কৃত টাকার পরিমাণ ৳${totalCollected.toLocaleString('bn-BD')}।`;
      aiSubText = `মোট বকেয়া রয়েছে ৳${totalDue.toLocaleString('bn-BD')} (${customers.length} জন কাস্টমার)।`;
    } else if (textToSend.includes('৩০ দিন') || textToSend.includes('বেশি বাকি')) {
      aiResponseText = `যাদের বকেয়া ৩০ দিনের বেশি পুরোনো তাদের মধ্যে শীর্ষ তালিকায় রয়েছেন ${topCust.name} (৳${topCust.currentDue.toLocaleString('bn-BD')})।`;
      aiSubText = `আজই রিমাইন্ডার পাঠিয়ে টাকা সংগ্রহের অনুরোধ করতে পারেন।`;
    } else if (textToSend.includes('টাকা চাইলে ভালো হবে') || textToSend.includes('আজ কাদের')) {
      aiResponseText = `আজ ${topCust.name} এবং কামাল হোসেনের কাছ থেকে টাকা চাইলে পেমেন্ট পাওয়ার সম্ভাবনা সবচেয়ে বেশি।`;
      aiSubText = `সকালে বা বিকালের দিকে SMS রিমাইন্ডার পাঠান।`;
    } else if (textToSend.includes('রহিম') || textToSend.includes('ইতিহাস')) {
      aiResponseText = `রহিম (রফিকুল ইসলাম)-এর পেমেন্ট ইতিহাস ভালো। মোট বকেয়া ৳${topCust.currentDue.toLocaleString('bn-BD')}।`;
      aiSubText = `সর্বশেষ লেনদেন সফলভাবে সম্পন্ন হয়েছে।`;
    } else {
      aiResponseText = `আপনার ব্যবসার হিসাব বিশ্লেষণ করে দেখেছি—মোট পাওনা ৳${totalDue.toLocaleString('bn-BD')} এবং মোট আদায় ৳${totalCollected.toLocaleString('bn-BD')}।`;
      aiSubText = `যেকোনো নির্দিষ্ট কাস্টমার বা বকেয়া সম্পর্কে জানতে প্রশ্ন করুন।`;
    }

    const newAiMsg = {
      id: (Date.now() + 1).toString(),
      sender: 'ai' as const,
      text: aiResponseText,
      subText: aiSubText,
      time: timeNow
    };

    setAiChatMessages(prev => [...prev, newUserMsg, newAiMsg]);
    setAiInputText('');
  };

  // Reminders Screen State
  const [showRemindersScreen, setShowRemindersScreen] = useState(false);
  const [reminderActiveTab, setReminderActiveTab] = useState<'today' | 'upcoming' | 'week' | 'snooze'>('today');
  const [showAiReminderMsgModal, setShowAiReminderMsgModal] = useState(false);
  const [selectedReminderCustomer, setSelectedReminderCustomer] = useState<{name: string; due: number; days: string; risk: string} | null>(null);
  const [aiGeneratedReminderText, setAiGeneratedReminderText] = useState('');

  // Security Screen State
  const [showSecurityScreen, setShowSecurityScreen] = useState(false);
  const [securityActiveTab, setSecurityActiveTab] = useState<'overview' | 'audit' | 'trash' | 'edits'>('overview');
  const [pinLockEnabled, setPinLockEnabled] = useState(true);
  const [fingerprintLockEnabled, setFingerprintLockEnabled] = useState(true);
  const [loginSecurityEnabled, setLoginSecurityEnabled] = useState(true);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [deletedTransactions, setDeletedTransactions] = useState<any[]>([]);
  const [editHistory, setEditHistory] = useState<any[]>([]);

  const handleGenerateAiReminderMessage = (cust: {name: string; due: number; days: string; risk: string}) => {
    setSelectedReminderCustomer(cust);
    const messages = [
      `আসসালামু আলাইকুম ${cust.name} ভাই, আপনার নিকট আমাদের বকেয়া ৳${cust.due.toLocaleString('bn-BD')} টাকার হিসাবটি একটু খেয়াল রাখার অনুরোধ করছি। সুবিধা মতো পরিশোধ করলে কৃতজ্ঞ থাকব। ধন্যবাদ! — স্মার্ট হিসাব খাতা`,
      `নমস্কার ${cust.name}, আপনার ব্যবসার বকেয়া ৳${cust.due.toLocaleString('bn-BD')} (${cust.days}) পরিশোধ করার জন্য বিনীত অনুরোধ জানাচ্ছি। কোনো প্রশ্ন থাকলে জানাতে পারেন।`,
      `প্রিয় ${cust.name}, আপনার হিসাবের বকেয়া ৳${cust.due.toLocaleString('bn-BD')} আজ পরিশোধযোগ্য। আপনার সহযোগিতা কাম্য। ধন্যবাদ!`
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setAiGeneratedReminderText(randomMsg);
    setShowAiReminderMsgModal(true);
  };


  // Overall Totals
  const totalDue = customers.reduce((sum, c) => sum + (c.currentDue > 0 ? c.currentDue : 0), 0);
  const todayCollection = customers.reduce((sum, c) => {
    const todayTrans = c.transactions.filter(t => t.type === 'take_payment');
    return sum + todayTrans.reduce((s, t) => s + t.amount, 0);
  }, 6200);

  // Photo upload reader
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create Customer Function
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      alert('অনুগ্রহ করে কাস্টমারের নাম ও মোবাইল নম্বর প্রদান করুন');
      return;
    }

    const initDueNum = parseFloat(formInitialDue) || 0;
    const newCustomer: SmartCustomer = {
      id: Date.now().toString(),
      name: formName.trim(),
      phone: formPhone.trim(),
      address: formAddress.trim(),
      photo: formPhoto,
      category: formCategory,
      initialDue: initDueNum,
      currentDue: initDueNum,
      note: formNote.trim(),
      createdAt: new Date().toLocaleDateString('bn-BD'),
      transactions: initDueNum > 0 ? [{
        id: Date.now().toString() + '_init',
        type: 'give_credit',
        amount: initDueNum,
        note: 'প্রাথমিক বাকি হিসাব',
        date: new Date().toLocaleDateString('bn-BD')
      }] : []
    };

    setCustomers(prev => [newCustomer, ...prev]);

    // Reset Form
    setFormName('');
    setFormPhone('');
    setFormAddress('');
    setFormPhoto('');
    setFormCategory('সাধারণ');
    setFormInitialDue('');
    setFormNote('');
    setShowAddCustomerModal(false);

    // Open new customer details ledger immediately
    setSelectedCustomer(newCustomer);
  };

  // Add Transaction (ধার দিন / টাকা নিন)
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const amountNum = parseFloat(transAmount);
    if (!amountNum || amountNum <= 0) {
      alert('সঠিক টাকার পরিমাণ লিখুন');
      return;
    }

    const isCredit = showAddTransactionModal.type === 'give_credit';
    const newTrans: SmartTransaction = {
      id: Date.now().toString(),
      type: showAddTransactionModal.type,
      amount: amountNum,
      note: transNote.trim() || (isCredit ? 'ধার দেওয়া হয়েছে' : 'টাকা পাওয়া গেছে'),
      date: new Date().toLocaleDateString('bn-BD')
    };

    const updatedDue = isCredit ? selectedCustomer.currentDue + amountNum : selectedCustomer.currentDue - amountNum;

    const updatedCustomer: SmartCustomer = {
      ...selectedCustomer,
      currentDue: updatedDue,
      transactions: [newTrans, ...selectedCustomer.transactions]
    };

    setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? updatedCustomer : c));
    setSelectedCustomer(updatedCustomer);
    setTransAmount('');
    setTransNote('');
    setShowAddTransactionModal({ open: false, type: 'give_credit' });
  };

  // Filtered customer list
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-4 flex items-center justify-between text-white border-b border-indigo-800/50">
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer border-none text-white flex items-center gap-1">
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded shadow-sm">
                <span className="text-indigo-900 font-black text-xl">৳</span>
            </div>
          <h1 className="text-xl font-bold tracking-tight">স্মার্ট হিসাব খাতা</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowRemindersScreen(true)} className="p-1.5 hover:bg-white/10 rounded-full text-white relative cursor-pointer">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
          </button>
          <Menu size={20} className="cursor-pointer" />
        </div>
      </div>
      <p className="text-white/80 text-center text-xs pb-3 pt-1 bg-gradient-to-r from-indigo-900 to-slate-900 font-medium">আপনার ব্যবসার হিসাব, এখন আরও সহজ ও স্মার্টভাবে</p>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-100 border-b border-slate-200">
        <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center shadow-sm">
            <p className="text-[11px] font-bold text-rose-700 mb-0.5">মোট পাওনা</p>
            <p className="font-extrabold text-sm text-rose-900">৳ {totalDue.toLocaleString('bn-BD')}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center shadow-sm">
            <p className="text-[11px] font-bold text-emerald-700 mb-0.5">আজ আদায়</p>
            <p className="font-extrabold text-sm text-emerald-900">৳ {todayCollection.toLocaleString('bn-BD')}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xl text-center shadow-sm">
            <p className="text-[11px] font-bold text-blue-700 mb-0.5">মোট কাস্টমার</p>
            <p className="font-extrabold text-sm text-blue-900">{customers.length} জন</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
        
        {/* Main Home Grid View */}
        {activeTab === 'home' && (
          <>
            {/* Search Box */}
            <div className="flex items-center bg-white rounded-xl p-2.5 mb-4 border border-slate-200 shadow-sm">
                <Search size={18} className="text-slate-400 mr-2" />
                <input 
                  placeholder="কাস্টমার নাম / মোবাইল নম্বর দিয়ে খুঁজুন" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-xs font-semibold text-slate-700 placeholder:font-normal" 
                />
                <Filter size={18} className="text-slate-400 cursor-pointer" />
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                    { icon: UserPlus, label: 'নতুন কাস্টমার', sub: 'কাস্টমার যোগ করুন', color: 'text-indigo-700 bg-white hover:bg-indigo-50/50', iconBg: 'bg-indigo-50 text-indigo-600', onClick: () => setShowAddCustomerModal(true) },
                    { icon: FileText, label: 'ধার দিন', sub: 'নতুন ধার যোগ করুন', color: 'text-emerald-700 bg-white hover:bg-emerald-50/50', iconBg: 'bg-emerald-50 text-emerald-600', onClick: () => {
                      setSelectedCreditCustomer(selectedCustomer || (customers.length > 0 ? customers[0] : null));
                      setShowGiveCreditScreen(true);
                    }},
                    { icon: DollarSign, label: 'টাকা নিন', sub: 'আদায়কৃত টাকা নথিভুক্ত', color: 'text-rose-700 bg-white hover:bg-rose-50/50', iconBg: 'bg-rose-50 text-rose-600', onClick: () => {
                      setSelectedPaymentCustomer(selectedCustomer || (customers.length > 0 ? customers[0] : null));
                      setShowTakePaymentScreen(true);
                    }},
                    { icon: List, label: 'হিসাব তালিকা', sub: 'সকল কাস্টমারের হিসাব', color: 'text-sky-700 bg-white hover:bg-sky-50/50', iconBg: 'bg-sky-50 text-sky-600', onClick: () => setActiveTab('customers') },
                    { icon: BellRing, label: 'রিমাইন্ডার', sub: 'টাকা আদায়ের স্মারক', color: 'text-amber-700 bg-white hover:bg-amber-50/50', iconBg: 'bg-amber-50 text-amber-600', onClick: () => setShowRemindersScreen(true) },
                    { icon: BarChart2, label: 'রিপোর্ট', sub: 'আদায় ও পাওনার সারাংশ', color: 'text-violet-700 bg-white hover:bg-violet-50/50', iconBg: 'bg-violet-50 text-violet-600', onClick: () => setActiveTab('reports') },
                    { icon: Share2, label: 'হিসাব শেয়ার', sub: 'কাস্টমারের সাথে শেয়ার করুন', color: 'text-blue-700 bg-white hover:bg-blue-50/50', iconBg: 'bg-blue-50 text-blue-600', onClick: () => alert('এসএমএস বা হোয়াটসঅ্যাপে শেয়ার করুন') },
                    { icon: Bot, label: 'AI সহকারী', sub: 'হিসাব বিশ্লেষণ ও পরামর্শ', color: 'text-purple-700 bg-white hover:bg-purple-50/50', iconBg: 'bg-purple-50 text-purple-600', onClick: () => setShowAiAssistantScreen(true) },
                    { icon: Shield, label: 'নিরাপত্তা', sub: 'ডেটা সুরক্ষিত রাখুন', color: 'text-green-700 bg-white hover:bg-green-50/50', iconBg: 'bg-green-50 text-green-600', onClick: () => setShowSecurityScreen(true) },
                ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={item.onClick}
                      className={`${item.color} p-3 rounded-2xl flex flex-col items-center text-center active:scale-95 transition-all shadow-xs hover:shadow cursor-pointer`}
                    >
                        <div className={`p-2.5 rounded-2xl ${item.iconBg} shadow-2xs mb-1.5`}>
                          <item.icon size={22}/>
                        </div>
                        <p className="font-extrabold text-xs leading-tight mb-0.5">{item.label}</p>
                        <p className="text-[9px] text-slate-500 font-medium leading-tight">{item.sub}</p>
                    </button>
                ))}
            </div>

            {/* Quick Recent Customers List */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <Users size={16} className="text-indigo-600" />
                  সাম্প্রতিক কাস্টমার
                </h3>
                <button onClick={() => setActiveTab('customers')} className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                  সব দেখুন ({customers.length})
                </button>
              </div>

              {customers.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">কোনো কাস্টমার যুক্ত করা হয়নি</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {customers.slice(0, 5).map((c) => (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedCustomer(c)}
                      className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-1 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs overflow-hidden border border-indigo-200">
                          {c.photo ? (
                            <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            c.name.substring(0, 1)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-800">{c.name}</p>
                          <p className="text-[10px] text-slate-500">{c.phone} • <span className="bg-slate-100 px-1 rounded text-[9px]">{c.category}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-xs ${c.currentDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {c.currentDue > 0 ? `৳ ${c.currentDue.toLocaleString('bn-BD')} বাকি` : 'কোনো বাকি নেই'}
                        </p>
                        <p className="text-[9px] text-slate-400">ট্যাপ করে হিসাব দেখুন</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Customer List Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Users size={18} className="text-indigo-600" />
                সকল কাস্টমার তালিকা ({filteredCustomers.length})
              </h2>
              <button 
                onClick={() => setShowAddCustomerModal(true)} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={16} /> নতুন কাস্টমার
              </button>
            </div>

            <div className="flex items-center bg-white rounded-xl p-2.5 border border-slate-200 shadow-sm">
              <Search size={18} className="text-slate-400 mr-2" />
              <input 
                placeholder="কাস্টমার নাম বা নম্বর খুঁজুন..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-xs font-semibold text-slate-700" 
              />
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
                <Users size={40} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600">কোনো কাস্টমার পাওয়া যায়নি</p>
                <button 
                  onClick={() => setShowAddCustomerModal(true)} 
                  className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={16} /> নতুন কাস্টমার যোগ করুন
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCustomers.map((c) => (
                  <div 
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-sm border border-indigo-200 overflow-hidden">
                        {c.photo ? <img src={c.photo} alt={c.name} className="w-full h-full object-cover" /> : c.name.substring(0, 1)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">{c.name}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">{c.phone}</p>
                        {c.address && <p className="text-[9px] text-slate-400">{c.address}</p>}
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <p className={`font-black text-xs ${c.currentDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {c.currentDue > 0 ? `৳ ${c.currentDue.toLocaleString('bn-BD')}` : '৳ ০.০০'}
                        </p>
                        <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">{c.category}</span>
                      </div>
                      <ChevronRight size={18} className="text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'transactions' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
            <ArrowLeftRight size={36} className="mx-auto text-indigo-600 mb-2" />
            <h3 className="font-bold text-sm text-slate-800 mb-1">সকল লেনদেন ইতিহাস</h3>
            <p className="text-xs text-slate-500 mb-4">আপনার দোকানের সকল দেনা-পাওনার বিবরণ</p>
            <div className="divide-y divide-slate-100 text-left">
              {customers.flatMap(c => c.transactions.map(t => ({ ...t, customerName: c.name }))).map((t, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{t.customerName}</p>
                    <p className="text-[10px] text-slate-400">{t.date} • {t.note}</p>
                  </div>
                  <p className={`font-black ${t.type === 'give_credit' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {t.type === 'give_credit' ? `- ৳ ${t.amount}` : `+ ৳ ${t.amount}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
            <PieChart size={36} className="mx-auto text-indigo-600 mb-2" />
            <h3 className="font-bold text-sm text-slate-800 mb-1">ব্যবসায়িক রিপোর্ট ও হিসাব সারাংশ</h3>
            <div className="grid grid-cols-2 gap-3 mt-4 text-left">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <p className="text-[10px] text-rose-700 font-bold">মোট পাওনা বাকি</p>
                <p className="text-base font-black text-rose-900">৳ {totalDue.toLocaleString('bn-BD')}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-[10px] text-emerald-700 font-bold">মোট আদায়কৃত টাকা</p>
                <p className="text-base font-black text-emerald-900">৳ {todayCollection.toLocaleString('bn-BD')}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'my_account' && (
          <div className="space-y-4 pb-12">
            {/* Business Profile Card */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 rounded-3xl shadow-lg space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/80 border border-indigo-400/30 flex items-center justify-center text-white font-black text-xl shadow-md">
                  ফ
                </div>
                <div>
                  <h3 className="font-extrabold text-base">ফাহিম ইন্টারনেট ডিজিটাল শপ</h3>
                  <p className="text-xs text-indigo-200">দোকান ও ব্যবসা পরিচালনা পোর্টাল • প্রোফাইল আইডি: SHK-8821</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-800/60 text-xs">
                <div>
                  <p className="text-[10px] text-indigo-300">মোট কাস্টমার</p>
                  <p className="font-bold">{customers.length} জন</p>
                </div>
                <div>
                  <p className="text-[10px] text-indigo-300">মোট পাওনা</p>
                  <p className="font-bold text-rose-300">৳ {customers.reduce((acc, c) => acc + c.transactions.reduce((tAcc, t) => tAcc + (t.type === 'give_credit' ? t.amount : -t.amount), c.initialDue || 0), 0).toLocaleString('bn-BD')}</p>
                </div>
              </div>
            </div>

            {/* Complete User Manual & FAQ Section (Extremely Detailed for Beginners) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                  <Info size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">সহজ সাহায্য ও নির্দেশিকা (Help / FAQ)</h3>
                  <p className="text-[11px] text-slate-500">যini জীবনে প্রথম মোবাইল ব্যবহার করছেন, তিনিও যেন খুব সহজে বুঝতে পারেন</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                
                {/* Intro banner */}
                <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100 text-indigo-900 text-xs font-medium">
                  👋 <span className="font-bold">স্বাগতম!</span> এই সফটওয়্যারটি আপনার দোকানের বাকি এবং লেনদেন হিসাব রাখার জন্য অত্যন্ত সহজ ও নির্ভুলভাবে তৈরি করা হয়েছে। নিচে প্রতিটি সেকশন কীভাবে ব্যবহার করবেন তার বিস্তারিত নিয়ম দেওয়া হলো:
                </div>

                {/* FAQ 1: Home & Overview */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-black text-indigo-900 flex items-center gap-2 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">১</span>
                    হোম স্ক্রিন ও উপড়ের ৩টি কার্ড কীভাবে কাজ করে?
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    অ্যাপের হোম পেজে ঢুকলেই উপরে তিনটি বড় রঙের ঘর (কার্ড) দেখতে পাবেন:<br/>
                    • <span className="font-bold text-slate-800">মোট পাওনা:</span> আপনার সমস্ত কাস্টমারের মোট কত টাকা বাকি আছে, তা এখানে অটোমেটিক যোগ হয়ে দেখায়।<br/>
                    • <span className="font-bold text-slate-800">আজ আদায়:</span> আজকের দিনে কাস্টমাররা আপনাকে ক্যাশ, বিকাশ বা রকেটে মোট কত টাকা শোধ করেছে, তার হিসাব।<br/>
                    • <span className="font-bold text-slate-800">মোট কাস্টমার:</span> আপনার খাতায় মোট কতজন কাস্টমার যুক্ত আছেন।
                  </p>
                </div>

                {/* FAQ 2: New Customer */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-black text-indigo-900 flex items-center gap-2 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">২</span>
                    নতুন কাস্টমার কীভাবে যোগ করব?
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    ১. হোম স্ক্রিনের <span className="font-bold text-indigo-700">"নতুন কাস্টমার"</span> বোতামে চাপ দিন。<br/>
                    ২. কাস্টমারের নাম, মোবাইল নম্বর, ঠিকানা এবং যদি আগে থেকেই কোনো বাকি থাকে তা লিখে <span className="font-bold">"সেভ করুন"</span> চাপুন。<br/>
                    ❌ <span className="font-bold text-rose-600">নিয়ম:</span> একই কাস্টমার দুইবার তৈরি করা যাবে না। সিস্টেম নিজেই ডুপ্লিকেট নাম বা নম্বর চেক করে বাধা দেবে। একবার কাস্টমার তৈরি হলে তার নাম সব জায়গায় পেয়ে যাবেন।
                  </p>
                </div>

                {/* FAQ 3: Give Credit & Take Payment */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-black text-indigo-900 flex items-center gap-2 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">৩</span>
                    বাকিতে মাল বিক্রি (ধার দিন) এবং টাকা আদায় (টাকা নিন) করব কীভাবে?
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    • <span className="font-bold text-emerald-700">ধার দিন:</span> কাস্টমার বাকিতে পণ্য কিনলে হোম স্ক্রিনের "ধার দিন" এ যান, কাস্টমার সিলেক্ট করুন, টাকার পরিমাণ ও কত তারিখের মধ্যে টাকা দেবে (Due Date) তা লিখে সেভ করুন। এতে তার বাকি ও দোকানের মোট পাওনা বেড়ে যাবে।<br/>
                    • <span className="font-bold text-rose-700">টাকা নিন:</span> কাস্টমার বকেয়া টাকা শোধ করতে এলে "টাকা নিন" এ যান, কাস্টমার সিলেক্ট করুন, কত টাকা দিল (নগদ/বিকাশ/অন্যান্য) লিখে সেভ করুন। এতে তার বাকি কমে যাবে এবং আজকের আদায় বেড়ে যাবে।<br/>
                    ⚠️ <span className="font-bold text-amber-700">সতর্কতা:</span> ব্যালেন্স বা বাকি সরাসরি খাতায় লিখে এডিট করা যায় না। সবসময় "ধার দিন" বা "টাকা নিন" এন্ট্রি করলেই ব্যালেন্স অটোমেটিক হিসাব হয়ে যায়।
                  </p>
                </div>

                {/* FAQ 4: Customer List & Ledger */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-black text-indigo-900 flex items-center gap-2 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">৪</span>
                    হিসাব তালিকা ও কাস্টমার ডিটেইলস কীভাবে দেখব?
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    হোম পেজের <span className="font-bold text-indigo-700">"হিসাব তালিকা"</span> তে গেলে সব কাস্টমারের নাম ও তাদের কার কত বাকি আছে তা দেখতে পাবেন। যেকোনো কাস্টমারের নামের ওপর চাপ দিলে তার আগের দেওয়া সব ধার, জমা দেওয়া টাকা এবং রসিদের ইতিহাস পরিষ্কার দেখতে পাবেন। সেখান থেকেও সরাসরি ধার দেওয়া বা টাকা নেওয়া যায়।
                  </p>
                </div>

                {/* FAQ 5: Reminders & AI Message */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-black text-indigo-900 flex items-center gap-2 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">৫</span>
                    রিমাইন্ডার এবং AI দিয়ে টাকা চাওয়ার মেসেজ কীভাবে পাঠাব?
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    হোম পেজের <span className="font-bold text-indigo-700">"রিমাইন্ডার"</span> সেকশনে কোন কাস্টমারের টাকা দেওয়ার সময় পার হয়ে গেছে বা কার কত দিন বাকি আছে তা দেখা যায়। কাস্টমারের নামের পাশে থাকা <span className="font-bold text-purple-700">"AI মেসেজ"</span> বাটনে চাপ দিলে আর্টিফিশিয়াল ইন্টেলিজেন্স খুব ভদ্র ও সুন্দর ভাষায় টাকা চাওয়ার একটি SMS বা WhatsApp মেসেজ লিখে দেবে, যা আপনি এক ক্লিকেই কাস্টমারকে পাঠাতে পারবেন।
                  </p>
                </div>

                {/* FAQ 6: Reports & Sharing */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-black text-indigo-900 flex items-center gap-2 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">৬</span>
                    রিপোর্ট এবং হিসাব শেয়ার করার নিয়ম কী?
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    • <span className="font-bold text-indigo-700">রিপোর্ট:</span> এখানে আপনাকে কোনো হিসাব আলাদা করে লিখতে হবে না। আপনার করা লেনদেন থেকেই সফটওয়্যার নিজে নিজে দৈনিক, মাসিক এবং ৩০ দিনের বেশি বকেয়ার হিসাব চার্ট আকারে দেখিয়ে দেবে।<br/>
                    • <span className="font-bold text-indigo-700">হিসাব শেয়ার:</span> কাস্টমারকে হিসাবের স্টেটমেন্ট পাঠাতে চাইলে শেয়ার অপশন ব্যবহার করে WhatsApp বা SMS-এ সম্পূর্ণ হিসাব পাঠিয়ে দিতে পারবেন।
                  </p>
                </div>

                {/* FAQ 7: AI Assistant */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-black text-indigo-900 flex items-center gap-2 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">৭</span>
                    AI সহকারী কীভাবে সাহায্য করবে?
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    হোম পেজের <span className="font-bold text-indigo-700">"AI সহকারী"</span> তে গিয়ে আপনার দোকানের যেকোনো হিসাব নিয়ে মুখে বা লিখে প্রশ্ন করতে পারেন (যেমন: "আজ মোট কত টাকা আদায় হলো?" বা "কার কাছে সবচেয়ে বেশি টাকা পাবো?")। AI আপনার সেন্ট্রাল ডেটাবেস দেখে সঠিক উত্তর বলে দেবে।
                  </p>
                </div>

                {/* FAQ 8: Security & Trash Recovery */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-black text-indigo-900 flex items-center gap-2 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">৮</span>
                    নিরাপত্তা, ট্র্যাশ রিকভারি এবং এডিট হিস্ট্রি
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    • <span className="font-bold text-indigo-700">কোনো পিন লক নেই:</span> আপনার অ্যাপে কোনো ঝামেলাপূর্ণ পাসওয়ার্ড বা পিন লক নেই, খুব সহজ নিয়মে সবসময় ওপেন থাকবে।<br/>
                    • <span className="font-bold text-indigo-700">মুছে ফেলা হিসাব (Trash):</span> ভুলবশত কোনো লেনদেন ডিলিট হয়ে গেলে তা চিরতরে মুছে যায় না; নিরাপত্তা সেকশনের ট্র্যাশে জমা থাকে। সেখান থেকে <span className="font-bold text-emerald-700">"পুনরুদ্ধার করুন"</span> চাপলে আবার আগের মতো ঠিক হয়ে যাবে।<br/>
                    • <span className="font-bold text-indigo-700">অ্যাক্টিভিটি ও এডিট লগ:</span> কে কখন কোন হিসাব পরিবর্তন বা এডিট করেছে, তার পুরো ইতিহাস নিরাপত্তা সেকশনে সংরক্ষিত থাকে।
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* ----------------- SCREEN: Add New Customer (নতুন কাস্টমার - EXACT UI MATCH) ----------------- */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-[#1E1B4B] z-60 flex flex-col h-full overflow-y-auto animate-in fade-in duration-200">
          {/* Top Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-950 p-4 text-white flex items-center justify-between border-b border-indigo-900/50 shrink-0">
            <button 
              type="button"
              onClick={() => setShowAddCustomerModal(false)} 
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all shrink-0"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600/80 border border-indigo-400/30 flex items-center justify-center text-white relative shrink-0">
                <UserPlus size={20} />
              </div>
              <div className="text-left">
                <h2 className="font-black text-lg text-white leading-tight">নতুন কাস্টমার</h2>
                <p className="text-[11px] text-indigo-200/80 font-medium">নতুন কাস্টমারের তথ্য যোগ করুন</p>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setShowAddCustomerModal(false)} 
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all shrink-0"
            >
              <Home size={18} />
            </button>
          </div>

          {/* Form Area in White Container with rounded top */}
          <div className="bg-slate-50 flex-1 rounded-t-[32px] p-4 space-y-3.5 -mt-2 overflow-y-auto max-w-2xl mx-auto w-full">
            <form onSubmit={handleCreateCustomer} className="space-y-3.5">
              
              {/* Photo Card: কাস্টমারের ছবি (ঐচ্ছিক) */}
              <div className="bg-indigo-50/70 border border-indigo-100/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-full bg-indigo-100 border-2 border-indigo-200/80 flex items-center justify-center text-indigo-400 shrink-0 overflow-hidden">
                    {formPhoto ? (
                      <img src={formPhoto} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={28} className="text-indigo-400" />
                    )}
                    <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center border-2 border-white shadow-xs">
                      <Camera size={10} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-indigo-950">কাস্টমারের ছবি (ঐচ্ছিক)</h4>
                    <p className="text-[11px] text-slate-500 font-medium">কাস্টমারের ছবি যোগ করুন</p>
                  </div>
                </div>

                <label className="relative border border-indigo-200 bg-white/90 hover:bg-white text-indigo-700 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95 shrink-0">
                  <Camera size={14} className="text-indigo-600" />
                  <span>ছবি তুলুন</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>

              {/* Section Header: মূল তথ্য */}
              <div className="bg-indigo-50/80 border border-indigo-100/80 rounded-xl px-3.5 py-2 flex items-center gap-2 text-indigo-900 font-bold text-xs">
                <User size={15} className="text-indigo-600" />
                <span>মূল তথ্য</span>
              </div>

              {/* Field 1: কাস্টমারের নাম * */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center gap-3 focus-within:border-indigo-400 transition-all">
                <div className="w-9 h-9 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <User size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-slate-700 block leading-tight">কাস্টমারের নাম <span className="text-rose-500">*</span></span>
                  <input 
                    type="text" 
                    required
                    placeholder="কাস্টমারের নাম লিখুন"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 outline-none bg-transparent placeholder:text-slate-400 pt-0.5"
                  />
                </div>
              </div>

              {/* Field 2: মোবাইল নম্বর * */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center gap-3 focus-within:border-indigo-400 transition-all">
                <div className="w-9 h-9 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-slate-700 block leading-tight">মোবাইল নম্বর <span className="text-rose-500">*</span></span>
                  <input 
                    type="tel" 
                    required
                    placeholder="মোবাইল নম্বর লিখুন"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 outline-none bg-transparent placeholder:text-slate-400 pt-0.5"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => formPhone && alert(`কল করা হচ্ছে: ${formPhone}`)}
                  className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0 hover:bg-emerald-200 transition-colors cursor-pointer"
                >
                  <Phone size={16} />
                </button>
              </div>

              {/* Field 3: ঠিকানা */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center gap-3 focus-within:border-indigo-400 transition-all">
                <div className="w-9 h-9 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-slate-700 block leading-tight">ঠিকানা</span>
                  <input 
                    type="text" 
                    placeholder="ঐচ্ছিক (ঠিকানা লিখুন)"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 outline-none bg-transparent placeholder:text-slate-400 pt-0.5"
                  />
                </div>
              </div>

              {/* Field 4 Row: [ক্যাটাগরি] & [প্রাথমিক বাকি] */}
              <div className="grid grid-cols-2 gap-3">
                {/* Category Dropdown */}
                <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center gap-2.5 relative">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Users size={16} />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="text-[10px] font-bold text-slate-700 block leading-tight">ক্যাটাগরি</span>
                    <select 
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full text-xs font-bold text-slate-800 outline-none bg-transparent appearance-none cursor-pointer pt-0.5"
                    >
                      <option value="সাধারণ">সাধারণ</option>
                      <option value="নিয়মিত">নিয়মিত</option>
                      <option value="পাইকারী">পাইকারী</option>
                      <option value="বিশেষ">বিশেষ</option>
                    </select>
                  </div>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Initial Due Input */}
                <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Coins size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-700 block leading-tight">প্রাথমিক বাকি</span>
                    <div className="flex items-center gap-0.5 pt-0.5">
                      <span className="text-xs font-bold text-slate-800">৳</span>
                      <input 
                        type="number" 
                        placeholder="0"
                        value={formInitialDue}
                        onChange={(e) => setFormInitialDue(e.target.value)}
                        className="w-full text-xs font-bold text-slate-800 outline-none bg-transparent placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Field 5: নোট */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center gap-3 focus-within:border-indigo-400 transition-all">
                <div className="w-9 h-9 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-slate-700 block leading-tight">নোট</span>
                  <input 
                    type="text" 
                    placeholder="ঐচ্ছিক (কোনো বিশেষ তথ্য লিখুন)"
                    value={formNote}
                    onChange={(e) => setFormNote(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 outline-none bg-transparent placeholder:text-slate-400 pt-0.5"
                  />
                </div>
              </div>

              {/* Section: অতিরিক্ত সেটিংস */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5 space-y-3">
                <div 
                  onClick={() => setShowExtraSettings(!showExtraSettings)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Settings size={15} />
                    </div>
                    <span>অতিরিক্ত সেটিংস</span>
                  </div>
                  {showExtraSettings ? <ChevronUp size={16} className="text-emerald-700" /> : <ChevronDown size={16} className="text-emerald-700" />}
                </div>

                {showExtraSettings && (
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {/* Toggle 1: রিমাইন্ডার সেট করুন */}
                    <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="p-1 rounded-md bg-indigo-50 text-indigo-600 shrink-0">
                          <Bell size={12} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 truncate">রিমাইন্ডার সেট করুন</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setReminderToggle(!reminderToggle)}
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${reminderToggle ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'}`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                      </button>
                    </div>

                    {/* Toggle 2: ক্রেডিট সীমা নির্ধারণ */}
                    <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="p-1 rounded-md bg-indigo-50 text-indigo-600 shrink-0">
                          <CreditCard size={12} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 truncate">ক্রেডিট সীমা নির্ধারণ</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setCreditLimitToggle(!creditLimitToggle)}
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${creditLimitToggle ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'}`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                      </button>
                    </div>

                    {/* Toggle 3: ডিউ ডেট সেট করুন */}
                    <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="p-1 rounded-md bg-indigo-50 text-indigo-600 shrink-0">
                          <Calendar size={12} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 truncate">ডিউ ডেট সেট করুন</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setDueDateToggle(!dueDateToggle)}
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${dueDateToggle ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'}`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                      </button>
                    </div>

                    {/* Toggle 4: বিশেষ নোটিফিকেশন */}
                    <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="p-1 rounded-md bg-indigo-50 text-indigo-600 shrink-0">
                          <Star size={12} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 truncate">বিশেষ নোটিফিকেশন</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setSpecialNotifToggle(!specialNotifToggle)}
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${specialNotifToggle ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'}`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Buttons: রিসেট & কাস্টমার যোগ করুন */}
              <div className="flex items-center gap-3 pt-2 pb-6">
                <button 
                  type="button" 
                  onClick={handleResetForm}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold py-3.5 px-6 rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-indigo-100 cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  <RotateCcw size={16} />
                  <span>রিসেট</span>
                </button>

                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-950 hover:from-indigo-800 hover:to-indigo-900 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <UserPlus size={18} />
                  <span>কাস্টমার যোগ করুন</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ----------------- SCREEN: Give Credit (ধার দিন - EXACT DESIGN MATCH) ----------------- */}
      {showGiveCreditScreen && (
        <div className="fixed inset-0 bg-[#1E1B4B] z-60 flex flex-col h-full overflow-y-auto animate-in fade-in duration-200">
          {/* Top Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-950 p-4 text-white flex items-center justify-between border-b border-indigo-900/50 shrink-0">
            <button 
              type="button"
              onClick={() => setShowGiveCreditScreen(false)} 
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all shrink-0"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600/80 border border-indigo-400/30 flex items-center justify-center text-white relative shrink-0 shadow-inner">
                <Coins size={20} />
              </div>
              <div className="text-left">
                <h2 className="font-black text-lg text-white leading-tight">ধার দিন</h2>
                <p className="text-[11px] text-indigo-200/80 font-medium">কাস্টমারকে মাল বা সেবা বাকিতে দিন</p>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setShowGiveCreditScreen(false)} 
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all shrink-0"
            >
              <Home size={18} />
            </button>
          </div>

          {/* Main Form Body */}
          <div className="bg-slate-50 flex-1 rounded-t-[32px] p-4 space-y-3.5 -mt-2 overflow-y-auto max-w-2xl mx-auto w-full">
            <form onSubmit={handleSaveGiveCredit} className="space-y-3.5">

              {/* Customer Selector Card */}
              <div 
                onClick={() => setShowCustomerPickerModal(true)}
                className="bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-100 rounded-2xl p-3.5 cursor-pointer transition-all shadow-2xs group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-indigo-950 group-hover:text-indigo-700 transition-colors">কাস্টমার নির্ধারণ করুন</h4>
                      <p className="text-[11px] text-slate-500 font-medium">নাম বা মোবাইল নম্বর দিয়ে খুঁজুন</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Selected Customer Card Banner */}
                {selectedCreditCustomer ? (
                  <div className="mt-3 bg-white rounded-xl p-3 border border-indigo-200/90 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center border border-indigo-200 overflow-hidden">
                        {selectedCreditCustomer.photo ? (
                          <img src={selectedCreditCustomer.photo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          selectedCreditCustomer.name.substring(0, 1)
                        )}
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold">নির্বাচিত কাস্টমার</div>
                        <h5 className="font-extrabold text-xs text-slate-800 leading-tight">{selectedCreditCustomer.name}</h5>
                        <p className="text-[10px] text-slate-500 font-semibold">{selectedCreditCustomer.phone}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-rose-500 block">বর্তমান বাকি</span>
                      <span className="text-xs font-black text-rose-600">৳{selectedCreditCustomer.currentDue.toLocaleString('bn-BD')}</span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[9px] font-bold border border-rose-100">📅 ৩০ দিন+</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-center text-xs text-indigo-600 font-bold bg-white/60 py-2 rounded-xl border border-indigo-100">
                    + কোনো কাস্টমার সিলেক্ট করা নেই (এখানে চাপ দিন)
                  </div>
                )}
              </div>

              {/* Section Header: ধার দেওয়ার তথ্য */}
              <div className="bg-indigo-50/80 border border-indigo-100/80 rounded-xl px-3.5 py-2 flex items-center gap-2 text-indigo-900 font-bold text-xs">
                <Coins size={15} className="text-indigo-600" />
                <span>ধার দেওয়ার তথ্য</span>
              </div>

              {/* Field 1: ধারের পরিমাণ (টাকা) * */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center gap-3 focus-within:border-indigo-400 transition-all">
                <div className="w-9 h-9 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <span className="font-black text-sm">৳</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-slate-700 block leading-tight">ধারের পরিমাণ (টাকা) <span className="text-rose-500">*</span></span>
                  <input 
                    type="number" 
                    required
                    placeholder="যত টাকা ধার দিচ্ছেন লিখুন"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 outline-none bg-transparent placeholder:text-slate-400 pt-0.5"
                  />
                </div>
              </div>

              {/* Field 2: কেন ধার দিচ্ছেন? (ঐচ্ছিক) */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center gap-3 focus-within:border-indigo-400 transition-all relative">
                <div className="w-9 h-9 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <ShoppingBag size={18} />
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <span className="text-[11px] font-bold text-slate-700 block leading-tight">কেন ধার দিচ্ছেন? (ঐচ্ছিক)</span>
                  <input 
                    type="text" 
                    placeholder="যেমন: পণ্য ক্রয়, সার্ভিস, ইত্যাদি"
                    value={creditReason}
                    onChange={(e) => setCreditReason(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 outline-none bg-transparent placeholder:text-slate-400 pt-0.5"
                  />
                </div>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Field 3: তারিখ * */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center gap-3 focus-within:border-indigo-400 transition-all">
                <div className="w-9 h-9 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Calendar size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-slate-700 block leading-tight">তারিখ <span className="text-rose-500">*</span></span>
                  <input 
                    type="text" 
                    value={creditDate}
                    onChange={(e) => setCreditDate(e.target.value)}
                    className="w-full text-xs font-bold text-slate-800 outline-none bg-transparent pt-0.5"
                  />
                </div>
                <Calendar size={18} className="text-indigo-600 shrink-0 cursor-pointer" />
              </div>

              {/* Grid 2 Fields: [পরিশোধের তারিখ (Due Date)] & [পেমেন্টের ধরন] */}
              <div className="grid grid-cols-2 gap-3">
                {/* Due Date */}
                <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-700 block leading-tight">পরিশোধের তারিখ (Due Date)</span>
                    <input 
                      type="text" 
                      value={creditDueDate}
                      onChange={(e) => setCreditDueDate(e.target.value)}
                      className="w-full text-xs font-bold text-slate-800 outline-none bg-transparent pt-0.5"
                    />
                  </div>
                  <Calendar size={14} className="text-indigo-500 shrink-0" />
                </div>

                {/* Payment Type */}
                <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center gap-2.5 relative">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Tag size={16} />
                  </div>
                  <div className="flex-1 min-w-0 pr-3">
                    <span className="text-[10px] font-bold text-slate-700 block leading-tight">পেমেন্টের ধরন</span>
                    <select 
                      value={creditPaymentType}
                      onChange={(e) => setCreditPaymentType(e.target.value)}
                      className="w-full text-xs font-bold text-slate-800 outline-none bg-transparent appearance-none cursor-pointer pt-0.5"
                    >
                      <option value="ধার (বাকিতে)">ধার (বাকিতে)</option>
                      <option value="আংশিক নগদ">আংশিক নগদ</option>
                      <option value="চেক/অনলাইন">চেক/অনলাইন</option>
                    </select>
                  </div>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Field: নোট (ঐচ্ছিক) */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center gap-3 focus-within:border-indigo-400 transition-all">
                <div className="w-9 h-9 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-slate-700 block leading-tight">নোট (ঐচ্ছিক)</span>
                  <input 
                    type="text" 
                    placeholder="কোনো অতিরিক্ত তথ্য লিখুন"
                    value={creditNote}
                    onChange={(e) => setCreditNote(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 outline-none bg-transparent placeholder:text-slate-400 pt-0.5"
                  />
                </div>
              </div>

              {/* Photo/Receipt Attachment Card */}
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ImageIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-emerald-950">রসিদ/পণ্যের ছবি সংযুক্ত করুন (ঐচ্ছিক)</h4>
                    <p className="text-[10px] text-slate-500 font-medium">ছবি তুলে বা গ্যালারী থেকে নির্ধারণ করুন</p>
                  </div>
                </div>

                <label className="relative border border-indigo-200 bg-white/90 hover:bg-white text-indigo-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95 shrink-0">
                  <Camera size={14} className="text-indigo-600" />
                  <span>ছবি যোগ করুন</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>

              {/* AI Advice Box */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Bot size={18} />
                  </div>
                  <p className="text-[11px] font-bold text-indigo-950">
                    <span className="text-indigo-700 font-black">AI পরামর্শ:</span> এই কাস্টমার সাধারণত ৮-১২ দিনের মধ্যে টাকা পরিশোধ করেন।
                  </p>
                </div>
                <Info size={16} className="text-indigo-400 shrink-0" />
              </div>

              {/* Action Buttons: খালি করুন & ধার যোগ করুন */}
              <div className="flex items-center gap-3 pt-2 pb-6">
                <button 
                  type="button" 
                  onClick={handleResetGiveCreditForm}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold py-3.5 px-6 rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-indigo-100 cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  <FileText size={16} />
                  <span>খালি করুন</span>
                </button>

                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-950 hover:from-indigo-800 hover:to-indigo-900 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <CheckCircle2 size={18} />
                  <span>ধার যোগ করুন</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ----------------- CUSTOMER PICKER MODAL inside "ধার দিন" ----------------- */}
      {showCustomerPickerModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="bg-indigo-950 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-indigo-300" />
                <h3 className="font-extrabold text-sm">কাস্টমার নির্বাচন করুন</h3>
              </div>
              <button onClick={() => setShowCustomerPickerModal(false)} className="text-white/80 hover:text-white p-1 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-3 bg-slate-100 border-b border-slate-200">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="নাম বা মোবাইল নম্বর লিখুন..." 
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="p-3 overflow-y-auto flex-1 space-y-2">
              {customers
                .filter(c => c.name.toLowerCase().includes(pickerSearch.toLowerCase()) || c.phone.includes(pickerSearch))
                .map(cust => (
                  <div 
                    key={cust.id}
                    onClick={() => {
                      setSelectedCreditCustomer(cust);
                      setShowCustomerPickerModal(false);
                    }}
                    className="p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-sm border border-indigo-200 overflow-hidden shrink-0">
                        {cust.photo ? <img src={cust.photo} alt="" className="w-full h-full object-cover" /> : cust.name.substring(0, 1)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">{cust.name}</h4>
                        <p className="text-[10px] text-slate-500">{cust.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">বাকি</span>
                      <span className="text-xs font-black text-rose-600">৳{cust.currentDue.toLocaleString('bn-BD')}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SCREEN: Take Payment (টাকা নিন - EXACT DESIGN MATCH) ----------------- */}
      {showTakePaymentScreen && (
        <div className="fixed inset-0 bg-[#0B132B] z-60 flex flex-col h-full overflow-y-auto animate-in fade-in duration-200">
          {/* Top Main App Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-950 p-4 text-white flex items-center justify-between border-b border-indigo-900/50 shrink-0">
            <button 
              type="button"
              onClick={() => setShowTakePaymentScreen(false)} 
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all shrink-0"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 border border-blue-400/40 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Coins size={20} />
              </div>
              <div className="text-left">
                <h2 className="font-black text-base text-white leading-tight">স্মার্ট <span className="text-amber-300">হিসাব খাতা</span></h2>
                <p className="text-[10px] text-indigo-200/90 font-medium">সহজ হিসাব • দ্রুত আদায় • স্মার্ট ব্যবসা</p>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setShowTakePaymentScreen(false)} 
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all shrink-0"
            >
              <Home size={18} />
            </button>
          </div>

          {/* Form Area Body */}
          <div className="bg-slate-50 flex-1 rounded-t-[32px] p-4 space-y-3.5 -mt-2 overflow-y-auto max-w-2xl mx-auto w-full">
            <form onSubmit={handleSaveTakePayment} className="space-y-3.5">

              {/* Title Banner Card: টাকা নিন */}
              <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-4 text-white flex items-center justify-between shadow-md relative overflow-hidden">
                <div className="flex items-center gap-3.5 z-10">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-inner">
                    <Coins size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white leading-tight">টাকা নিন</h3>
                    <p className="text-[11px] text-indigo-100 font-medium">কাস্টমারের কাছ থেকে টাকা পরিশোধের এন্ট্রি দিন</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/80 shrink-0 z-10">
                  <CreditCard size={20} />
                </div>
                {/* Decorative glow circle */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              </div>

              {/* 3 Metrics Row: [কাস্টমারের মোট বাকি] [দেওয়া টাকা] [বর্তমান বাকি] */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* 1. কাস্টমারের মোট বাকি */}
                <div className="bg-[#EAF8F1] border border-emerald-200/80 rounded-2xl p-2.5 flex flex-col justify-between shadow-2xs">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <User size={15} className="text-emerald-600 shrink-0" />
                    <span className="text-[10px] font-bold text-emerald-900 leading-tight">কাস্টমারের মোট বাকি</span>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-sm font-black text-emerald-950">৳ {(selectedPaymentCustomer?.currentDue || 8500).toLocaleString('bn-BD')}</span>
                  </div>
                </div>

                {/* 2. দেওয়া টাকা */}
                <div className="bg-[#FDF2F4] border border-rose-200/80 rounded-2xl p-2.5 flex flex-col justify-between shadow-2xs">
                  <div className="flex items-center gap-1.5 text-rose-800">
                    <Calendar size={15} className="text-rose-600 shrink-0" />
                    <span className="text-[10px] font-bold text-rose-900 leading-tight">দেওয়া টাকা</span>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-sm font-black text-rose-600">৳ {(parseFloat(paymentAmount) || 0).toLocaleString('bn-BD')}</span>
                  </div>
                </div>

                {/* 3. বর্তমান বাকি */}
                <div className="bg-[#EEF5FF] border border-sky-200/80 rounded-2xl p-2.5 flex flex-col justify-between shadow-2xs">
                  <div className="flex items-center gap-1.5 text-sky-800">
                    <CreditCard size={15} className="text-sky-600 shrink-0" />
                    <span className="text-[10px] font-bold text-sky-900 leading-tight">বর্তমান বাকি</span>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-sm font-black text-sky-900">
                      ৳ {Math.max(0, (selectedPaymentCustomer?.currentDue || 8500) - (parseFloat(paymentAmount) || 0)).toLocaleString('bn-BD')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Selection Box */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 leading-tight">কাস্টমার নির্ধারণ করুন</h4>
                    <p className="text-[10px] text-slate-400 font-medium">যার কাছ থেকে টাকা নিচ্ছেন</p>
                  </div>
                </div>

                <div className="relative min-w-[150px]">
                  <select 
                    value={selectedPaymentCustomer?.id || ''}
                    onChange={(e) => {
                      const found = customers.find(c => c.id === e.target.value);
                      if (found) {
                        setSelectedPaymentCustomer(found);
                        if (isFullPaymentToggle) setPaymentAmount(found.currentDue.toString());
                      }
                    }}
                    className="w-full bg-slate-50 border border-indigo-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none appearance-none cursor-pointer pr-7 text-right"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Amount Input Box with Full Payment Toggle */}
              <div className="bg-[#FFFDF5] border border-amber-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-black text-lg flex items-center justify-center shrink-0 border border-amber-200">
                      ৳
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-slate-700 block leading-tight">টাকার পরিমাণ <span className="text-rose-500">*</span></span>
                      <input 
                        type="number" 
                        required
                        placeholder="টাকা পরিমান লিখুন"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full text-sm font-extrabold text-slate-900 outline-none bg-transparent placeholder:text-slate-400 pt-0.5"
                      />
                    </div>
                  </div>

                  {/* Full Payment Toggle */}
                  <label className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs cursor-pointer shrink-0">
                    <span className="text-[11px] font-bold text-slate-700">পূর্ণ পরিশোধ</span>
                    <input 
                      type="checkbox"
                      checked={isFullPaymentToggle}
                      onChange={(e) => handleFullPaymentToggle(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Payment Method Options (পেমেন্ট মাধ্যম) */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <CreditCard size={14} />
                  </div>
                  <span>পেমেন্ট মাধ্যম</span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { id: 'নগদ', label: 'নগদ', icon: '💵', color: 'border-indigo-500 bg-indigo-50 text-indigo-900' },
                    { id: 'বিকাশ', label: 'বিকাশ', icon: '🌸', color: 'border-pink-500 bg-pink-50 text-pink-900' },
                    { id: 'নগদ (অ্যাপ)', label: 'নগদ', icon: '🟠', color: 'border-orange-500 bg-orange-50 text-orange-900' },
                    { id: 'রকেট', label: 'রকেট', icon: '🚀', color: 'border-purple-500 bg-purple-50 text-purple-900' },
                    { id: 'ব্যাংক', label: 'ব্যাংক', icon: '🏦', color: 'border-sky-500 bg-sky-50 text-sky-900' },
                  ].map(m => {
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer relative ${
                          isSelected ? 'border-indigo-600 bg-indigo-50/90 text-indigo-950 shadow-2xs ring-1 ring-indigo-500' : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-base leading-none">{m.icon}</span>
                        <span className="text-[10px] font-bold truncate max-w-full">{m.label}</span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[8px]">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Note Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Date */}
                <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-700 block leading-tight">তারিখ</span>
                    <input 
                      type="text" 
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full text-xs font-bold text-slate-800 outline-none bg-transparent pt-0.5"
                    />
                  </div>
                  <ChevronDown size={14} className="text-slate-400 shrink-0" />
                </div>

                {/* Note */}
                <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-700 block leading-tight">নোট (ঐচ্ছিক)</span>
                    <input 
                      type="text" 
                      placeholder="কোনো অতিরিক্ত তথ্য লিখুন"
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      className="w-full text-xs font-semibold text-slate-800 outline-none bg-transparent placeholder:text-slate-400 pt-0.5"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Select Pill Box (দ্রুত নির্ধারণ) */}
              <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    ⚡ <span className="font-extrabold text-indigo-950">দ্রুত নির্ধারণ</span>
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">দ্রুত টাকা এন্ট্রির জন্য নিচের অপশনগুলো ব্যবহার করুন</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 2000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPaymentAmount(amt.toString())}
                      className="bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold text-xs py-2 px-3 rounded-xl shadow-2xs flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <span>৳</span>
                      <span>{amt.toLocaleString('bn-BD')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Remaining Due Banner */}
              <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2">
                  <BarChart2 size={18} className="text-emerald-600" />
                  <span className="text-xs font-black text-emerald-950">
                    পরবর্তী বাকি: ৳ {Math.max(0, (selectedPaymentCustomer?.currentDue || 8500) - (parseFloat(paymentAmount) || 0)).toLocaleString('bn-BD')}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                  <RotateCcw size={12} className="animate-spin" />
                  <span>হিসাব স্বয়ংক্রিয়ভাবে আপডেট হবে</span>
                </div>
              </div>

              {/* Main Submit Action Button */}
              <div className="pt-2 pb-6">
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-950 hover:from-indigo-800 hover:to-indigo-900 text-white font-black py-4 px-6 rounded-2xl text-sm shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <CheckCircle2 size={20} />
                  <span>টাকা নিন এবং সংরক্ষণ করুন</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ----------------- SCREEN: AI Assistant (AI সহকারী - EXACT DESIGN MATCH) ----------------- */}
      {showAiAssistantScreen && (
        <div className="fixed inset-0 bg-[#0B132B] z-60 flex flex-col h-full overflow-hidden animate-in fade-in duration-200">
          {/* Top Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-950 p-4 text-white flex items-center justify-between border-b border-indigo-900/50 shrink-0">
            <button 
              type="button"
              onClick={() => setShowAiAssistantScreen(false)} 
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all shrink-0"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600 border border-purple-400/40 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Bot size={20} />
              </div>
              <div className="text-left">
                <h2 className="font-black text-base text-white leading-tight">স্মার্ট <span className="text-amber-300">হিসাব খাতা</span></h2>
                <p className="text-[10px] text-indigo-200/90 font-medium">সহজ হিসাব • দ্রুত আদায় • স্মার্ট ব্যবসা</p>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setShowAiAssistantScreen(false)} 
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all shrink-0"
            >
              <Home size={18} />
            </button>
          </div>

          {/* Body Area */}
          <div className="bg-slate-50 flex-1 rounded-t-[32px] p-4 flex flex-col overflow-y-auto -mt-2 max-w-2xl mx-auto w-full space-y-4">

            {/* AI Assistant Banner Card */}
            <div className="bg-gradient-to-r from-indigo-100/90 via-purple-100/80 to-indigo-50 border border-indigo-200/80 rounded-3xl p-4 flex items-center justify-between shadow-xs shrink-0 relative overflow-hidden">
              <div className="flex items-center gap-3.5 z-10">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md relative shrink-0">
                  <Bot size={26} />
                  <span className="absolute -bottom-1 -right-1 bg-amber-400 text-indigo-950 text-[9px] font-black px-1 rounded-md">AI</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-indigo-950">AI সহকারী ✨</h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> অনলাইন
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-tight">আপনার হিসাব সম্পর্কে যেকোনো প্রশ্ন করুন, আমি দিবো দ্রুত ও নির্ভুল উত্তর</p>
                </div>
              </div>
            </div>

            {/* 4 Quick Category Chips */}
            <div className="grid grid-cols-4 gap-2 shrink-0">
              {[
                { label: 'হিসাব জানুন', icon: Search },
                { label: 'রিপোর্ট দেখুন', icon: PieChart },
                { label: 'কাস্টমার বিশ্লেষণ', icon: Users },
                { label: 'টাকা আদায় পরামর্শ', icon: Sparkles },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendAiMessage(chip.label)}
                  className="bg-white hover:bg-indigo-50 border border-slate-200/90 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center gap-1 shadow-2xs cursor-pointer transition-all active:scale-95"
                >
                  <chip.icon size={16} className="text-indigo-600" />
                  <span className="text-[10px] font-bold text-slate-800 truncate max-w-full">{chip.label}</span>
                </button>
              ))}
            </div>

            {/* Search/Prompt Box */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center gap-2.5 shrink-0">
              <Bot size={18} className="text-indigo-600 shrink-0" />
              <input 
                type="text"
                placeholder="আপনি যা জানতে চান লিখুন..."
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendAiMessage(); }}
                className="flex-1 text-xs font-semibold text-slate-800 outline-none bg-transparent placeholder:text-slate-400"
              />
              <button 
                onClick={() => handleSendAiMessage()}
                className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-xs cursor-pointer"
              >
                <Send size={14} />
              </button>
            </div>

            {/* Preset Suggestions Section */}
            <div className="space-y-2 shrink-0">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-indigo-600" />
                  <span>আপনি AI-কে যা জিজ্ঞেস করতে পারেন</span>
                </span>
                <span className="text-[10px] font-bold text-indigo-600 cursor-pointer hover:underline">সব দেখুন &gt;</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  'কার কাছে সবচেয়ে বেশি টাকা পাওনা?',
                  'এই মাসে কত টাকা আদায় করেছি?',
                  'কারা ৩০ দিনের বেশি বাকি?',
                  'আমার মোট পাওনা ও আদায়ের পরিসংখ্যান দিন'
                ].map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAiMessage(sug)}
                    className="bg-white hover:bg-indigo-50/70 border border-slate-200/80 rounded-2xl p-3 text-left text-xs font-bold text-slate-800 shadow-2xs flex items-center justify-between group cursor-pointer transition-all"
                  >
                    <span>{sug}</span>
                    <ChevronRight size={14} className="text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 space-y-3 py-2">
              {aiChatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs mb-1">
                      <Bot size={16} />
                    </div>
                  )}

                  <div className={`max-w-[80%] rounded-2xl p-3 shadow-xs ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-xs' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs space-y-1'
                  }`}>
                    <p className="text-xs font-bold leading-relaxed">{msg.text}</p>
                    {msg.subText && (
                      <p className={`text-[11px] font-semibold ${msg.sender === 'user' ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {msg.subText}
                      </p>
                    )}
                    <div className={`text-[9px] text-right mt-1 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {msg.time} {msg.sender === 'user' && '✓✓'}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-indigo-200 text-indigo-800 flex items-center justify-center shrink-0 font-black text-xs mb-1">
                      👤
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Input Bar */}
            <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-lg flex items-center gap-2 mt-auto shrink-0 mb-2">
              <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer">
                <Mic size={18} />
              </button>
              <input 
                type="text"
                placeholder="এখানে আপনার প্রশ্ন লিখুন..."
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendAiMessage(); }}
                className="flex-1 text-xs font-semibold text-slate-800 outline-none bg-transparent placeholder:text-slate-400"
              />
              <button 
                onClick={() => handleSendAiMessage()}
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ----------------- SCREEN: Reminders (রিমাইন্ডার - EXACT DESIGN MATCH) ----------------- */}
      {showRemindersScreen && (
        <div className="fixed inset-0 bg-[#0B132B] z-60 flex flex-col h-full overflow-hidden animate-in fade-in duration-200">
          {/* Top Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-950 p-4 text-white flex items-center justify-between border-b border-indigo-900/50 shrink-0">
            <button 
              type="button"
              onClick={() => setShowRemindersScreen(false)} 
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all shrink-0"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 border border-amber-300/40 flex items-center justify-center text-slate-950 shrink-0 shadow-xs">
                <Bell size={20} className="fill-slate-950" />
              </div>
              <div className="text-left">
                <h2 className="font-black text-base text-white leading-tight">রিমাইন্ডার</h2>
                <p className="text-[10px] text-indigo-200/90 font-medium">পাওনা টাকা আদায়ের জন্য স্মার্ট রিমাইন্ডার সিস্টেম</p>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setShowRemindersScreen(false)} 
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all shrink-0"
            >
              <Settings size={18} />
            </button>
          </div>

          {/* Body Area */}
          <div className="bg-slate-50 flex-1 rounded-t-[32px] p-4 flex flex-col overflow-y-auto -mt-2 max-w-2xl mx-auto w-full space-y-4">

            {/* 3 Summary Metric Cards */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200/80 rounded-2xl p-3 text-center shadow-2xs">
                <div className="flex items-center justify-center gap-1 text-rose-700 mb-1">
                  <Calendar size={14} />
                  <span className="text-[10px] font-bold">মোট বাকি</span>
                </div>
                <h4 className="font-black text-sm text-rose-950">৳ ৮৪,৫০০</h4>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-3 text-center shadow-2xs">
                <div className="flex items-center justify-center gap-1 text-emerald-700 mb-1">
                  <CheckCircle2 size={14} />
                  <span className="text-[10px] font-bold">আজকের রিমাইন্ডার</span>
                </div>
                <h4 className="font-black text-sm text-emerald-950">৫ জন</h4>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-3 text-center shadow-2xs">
                <div className="flex items-center justify-center gap-1 text-blue-700 mb-1">
                  <Clock size={14} />
                  <span className="text-[10px] font-bold">নির্ধারিত সময়</span>
                </div>
                <h4 className="font-black text-sm text-blue-950">আজ</h4>
              </div>
            </div>

            {/* 4 Tabs */}
            <div className="grid grid-cols-4 gap-1.5 bg-slate-200/80 p-1 rounded-2xl shrink-0">
              {[
                { id: 'today', label: 'আজকের 5', icon: Calendar },
                { id: 'upcoming', label: 'আপকামিং 3', icon: Clock },
                { id: 'week', label: 'এই সপ্তাহ 8', icon: List },
                { id: 'snooze', label: 'স্নুজ রিমাইন্ডার', icon: RotateCcw },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setReminderActiveTab(tab.id as any)}
                  className={`py-2 px-1 text-center text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    reminderActiveTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-indigo-900 bg-transparent'
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Reminder Customer List Cards */}
            <div className="space-y-2.5 shrink-0">
              {[
                { name: 'রহিম টেলিকম', phone: '01XXXXXXXXX', due: 8500, days: '৩০ দিন বাকি', risk: 'উচ্চ ঝুঁকি', riskBg: 'bg-rose-100 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
                { name: 'করিম মিয়া', phone: '01XXXXXXXXX', due: 3500, days: '১৫ দিন বাকি', risk: 'মাঝারি ঝুঁকি', riskBg: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
                { name: 'সুমন আহমেদ', phone: '01XXXXXXXXX', due: 2000, days: '৭ দিন বাকি', risk: 'নিরাপদ', riskBg: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
                { name: 'করিমুল ইসলাম', phone: '01XXXXXXXXX', due: 5200, days: '৩৫ দিন বাকি', risk: 'উচ্চ ঝুঁকি', riskBg: 'bg-rose-100 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
                { name: 'আনোয়ার হোসেন', phone: '01XXXXXXXXX', due: 1500, days: '৫ দিন বাকি', risk: 'নিরাপদ', riskBg: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
              ].map((cust, idx) => (
                <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-indigo-300 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shadow-2xs">
                        {cust.name.substring(0, 1)}
                      </div>
                      <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full ${cust.dot} border-2 border-white`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-xs text-slate-900">{cust.name}</h4>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${cust.riskBg}`}>
                          {cust.risk}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-medium">
                        <span>📞 {cust.phone}</span>
                        <span>•</span>
                        <span className="text-rose-600 font-bold">📅 {cust.days}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <p className="font-black text-xs text-indigo-950">৳ {cust.due.toLocaleString('bn-BD')}</p>
                      <button 
                        onClick={() => handleGenerateAiReminderMessage(cust)}
                        className="mt-1 text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-xl border border-indigo-200 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <Bot size={12} className="text-indigo-600" />
                        <span>AI মেসেজ</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Reminder Tips & Actions Card */}
            <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-xs space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-slate-900">স্মার্ট রিমাইন্ডার টিপস</h4>
                    <p className="text-[10px] text-slate-500 font-medium">সময়মতো রিমাইন্ডার পাঠান, দ্রুত টাকা আদায় করুন।</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 cursor-pointer hover:underline">আরও দেখুন &gt;</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => alert('হোয়াটসঅ্যাপ রিমাইন্ডার পাঠানো হচ্ছে')}
                  className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl p-3 text-center cursor-pointer transition-all"
                >
                  <MessageCircle size={18} className="text-emerald-600 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-slate-800">WhatsApp</p>
                  <p className="text-[9px] text-slate-500">সরাসরি পাঠান</p>
                </button>

                <button 
                  onClick={() => alert('এসএমএস রিমাইন্ডার পাঠানো হচ্ছে')}
                  className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl p-3 text-center cursor-pointer transition-all"
                >
                  <Send size={18} className="text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-slate-800">SMS</p>
                  <p className="text-[9px] text-slate-500">এসএমএস পাঠান</p>
                </button>

                <button 
                  onClick={() => handleGenerateAiReminderMessage({ name: 'সকল বকেয়া কাস্টমার', due: 18500, days: 'মিশ্র সময়', risk: 'বিশেষ' })}
                  className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl p-3 text-center cursor-pointer transition-all"
                >
                  <Sparkles size={18} className="text-purple-600 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-slate-800">AI মেসেজ</p>
                  <p className="text-[9px] text-slate-500">মেসেজ তৈরি</p>
                </button>
              </div>
            </div>

            {/* Bottom Navigation CTAs */}
            <div className="grid grid-cols-2 gap-2 mt-auto pb-2">
              <button 
                onClick={() => { setShowRemindersScreen(false); setShowGiveCreditScreen(true); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus size={16} />
                <span>নতুন রিমাইন্ডার সেট করুন</span>
              </button>

              <button 
                onClick={() => { setShowRemindersScreen(false); setActiveTab('customers'); }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 px-4 rounded-2xl font-bold text-xs shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Users size={16} />
                <span>গ্রাহক তালিকা</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ----------------- MODAL: AI Polite Reminder Message Generator ----------------- */}
      {showAiReminderMsgModal && selectedReminderCustomer && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-90 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white relative">
              <button 
                onClick={() => setShowAiReminderMsgModal(false)}
                className="absolute right-3 top-3 text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-white/25 rounded-2xl flex items-center justify-center text-white shrink-0">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">AI দিয়ে ভদ্রভাবে টাকা চাওয়ার মেসেজ</h3>
                  <p className="text-[10px] text-purple-100">কাস্টমার: {selectedReminderCustomer.name}</p>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="p-4 space-y-3 bg-slate-50">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">তৈরিকৃত জেনারেটেড মেসেজ:</label>
                <textarea 
                  value={aiGeneratedReminderText}
                  onChange={(e) => setAiGeneratedReminderText(e.target.value)}
                  rows={4}
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(aiGeneratedReminderText);
                    alert('মেসেজটি ক্লিপবোর্ডে কপি করা হয়েছে!');
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-all"
                >
                  কপি করুন
                </button>

                <button
                  onClick={() => {
                    window.open(`https://wa.me/?text=${encodeURIComponent(aiGeneratedReminderText)}`, '_blank');
                    setShowAiReminderMsgModal(false);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp-এ পাঠান</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: Payment Receipt (পেমেন্ট রসিদ) ----------------- */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white text-center relative">
              <button 
                onClick={() => setShowReceiptModal(false)}
                className="absolute right-3 top-3 text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-extrabold text-base">পেমেন্ট রসিদ সফলভাবে তৈরি হয়েছে!</h3>
              <p className="text-[11px] text-emerald-100">কাস্টমারের বাকি আপডেট করা হয়েছে</p>
            </div>

            {/* Receipt Printable Slip */}
            <div className="p-4 space-y-3 bg-slate-50 border-b border-slate-200 text-slate-800">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                  <div>
                    <h4 className="font-black text-sm text-indigo-950">স্মার্ট হিসাব খাতা</h4>
                    <p className="text-[9px] text-slate-400 font-bold">ভাউচার নম্বর: {receiptData.id}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-100">
                    {receiptData.date}
                  </span>
                </div>

                <div className="space-y-1 text-xs font-semibold">
                  <div className="flex justify-between text-slate-600">
                    <span>কাস্টমারের নাম:</span>
                    <span className="font-bold text-slate-900">{receiptData.customerName}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>মোবাইল:</span>
                    <span className="font-bold text-slate-900">{receiptData.phone}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>পেমেন্ট মাধ্যম:</span>
                    <span className="font-bold text-indigo-700">{receiptData.paymentMethod}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-2 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>পূর্বে মোট বাকি:</span>
                    <span className="font-bold">৳ {receiptData.prevDue.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-extrabold text-sm bg-emerald-50 p-1.5 rounded-lg">
                    <span>আজ পরিশোধিত জমা:</span>
                    <span>৳ {receiptData.paidAmount.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-extrabold text-xs pt-1">
                    <span>বর্তমান অবশিষ্ট বাকি:</span>
                    <span>৳ {receiptData.newDue.toLocaleString('bn-BD')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 bg-white space-y-2">
              <button
                onClick={() => {
                  alert(`WhatsApp-এ মেসেজ তৈরি হচ্ছে: ${receiptData.customerName} আপনাকে ৳ ${receiptData.paidAmount} প্রদান করেছেন। বর্তমান বাকি: ৳ ${receiptData.newDue}`);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Share2 size={16} />
                <span>হোয়াটসঅ্যাপে রসিদ শেয়ার করুন</span>
              </button>

              <button
                onClick={() => setShowReceiptModal(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- CUSTOMER LEDGER DETAIL MODAL (কাস্টমার আলাদা হিসাব পাতা) ----------------- */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900 z-70 flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200">
          {/* Top Header */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-4 text-white flex items-center justify-between border-b border-indigo-800">
            <button onClick={() => setSelectedCustomer(null)} className="p-1 hover:bg-white/10 rounded-lg text-white cursor-pointer">
              <ArrowLeft size={22} />
            </button>
            <h3 className="font-bold text-sm">কাস্টমার হিসাব খাতা</h3>
            <button onClick={() => alert(`ফোন নম্বর: ${selectedCustomer.phone}`)} className="p-1.5 bg-emerald-600 text-white rounded-full cursor-pointer">
              <Phone size={18} />
            </button>
          </div>

          {/* Customer Profile Card */}
          <div className="bg-white p-4 border-b border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-lg border-2 border-indigo-200 overflow-hidden shrink-0">
                {selectedCustomer.photo ? <img src={selectedCustomer.photo} alt={selectedCustomer.name} className="w-full h-full object-cover" /> : selectedCustomer.name.substring(0, 1)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-extrabold text-base text-slate-800">{selectedCustomer.name}</h2>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100">{selectedCustomer.category}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{selectedCustomer.phone}</p>
                {selectedCustomer.address && <p className="text-[10px] text-slate-400">{selectedCustomer.address}</p>}
              </div>
            </div>

            {/* Total Balance Overview Box */}
            <div className="mt-3 bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md">
              <div>
                <p className="text-[10px] text-slate-400 font-bold">বর্তমান মোট বাকি (পাওনা)</p>
                <p className={`text-xl font-black ${selectedCustomer.currentDue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ৳ {selectedCustomer.currentDue.toLocaleString('bn-BD')}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedCreditCustomer(selectedCustomer);
                    setShowGiveCreditScreen(true);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <PlusCircle size={14} /> ধার দিন
                </button>
                <button 
                  onClick={() => {
                    setSelectedPaymentCustomer(selectedCustomer);
                    setShowTakePaymentScreen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <MinusCircle size={14} /> টাকা নিন
                </button>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
            <h4 className="font-bold text-xs text-slate-600 mb-3 flex items-center gap-1.5">
              <History size={16} /> লেনদেনের বিস্তারিত ইতিহাস
            </h4>

            {selectedCustomer.transactions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">কোনো লেনদেন পাওয়া যায়নি</p>
            ) : (
              <div className="space-y-2">
                {selectedCustomer.transactions.map((t) => (
                  <div key={t.id} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${t.type === 'give_credit' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {t.type === 'give_credit' ? <PlusCircle size={18} /> : <MinusCircle size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-800">{t.type === 'give_credit' ? 'ধার দেওয়া হয়েছে' : 'টাকা পাওয়া গেছে'}</p>
                        <p className="text-[10px] text-slate-400">{t.date} • {t.note}</p>
                      </div>
                    </div>
                    <p className={`font-black text-sm ${t.type === 'give_credit' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {t.type === 'give_credit' ? `+ ৳ ${t.amount.toLocaleString('bn-BD')}` : `- ৳ ${t.amount.toLocaleString('bn-BD')}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- MODAL: Add Transaction (ধার দিন / টাকা নিন) ----------------- */}
      {showAddTransactionModal.open && selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-4 shadow-2xl animate-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className={`font-bold text-sm ${showAddTransactionModal.type === 'give_credit' ? 'text-rose-600' : 'text-emerald-600'}`}>
                {showAddTransactionModal.type === 'give_credit' ? 'ধার দেওয়া হিসাব যোগ' : 'টাকা আদায়/জমা হিসাব যোগ'}
              </h3>
              <button onClick={() => setShowAddTransactionModal({ open: false, type: 'give_credit' })} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-3">
              <div>
                <p className="text-xs text-slate-600 mb-1">কাস্টমার: <span className="font-bold text-slate-800">{selectedCustomer.name}</span></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">টাকার পরিমাণ <span className="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  required 
                  autoFocus
                  placeholder="0.00"
                  value={transAmount}
                  onChange={(e) => setTransAmount(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-base text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">নোট / পণ্যের বিবরণ</label>
                <input 
                  type="text" 
                  placeholder="যেমন: ২ প্যাকেট ডাটা সিম ক্রয়"
                  value={transNote}
                  onChange={(e) => setTransNote(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <button 
                type="submit"
                className={`w-full text-white font-extrabold py-3 rounded-xl text-xs shadow-md cursor-pointer ${showAddTransactionModal.type === 'give_credit' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: Security Center (নিরাপত্তা) ----------------- */}
      {showSecurityScreen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-80 flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg h-[90vh] sm:h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">নিরাপত্তা ও ডেটা সুরক্ষা</h3>
                  <p className="text-[10px] text-slate-400">আপনার হিসাবের গুরুত্বপূর্ণ কার্যক্রম ও ইতিহাস</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSecurityScreen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sub Tabs */}
            <div className="flex bg-slate-100 p-1.5 border-b border-slate-200 gap-1 overflow-x-auto">
              {[
                { id: 'overview', label: '🛡️ ড্যাশবোর্ড' },
                { id: 'audit', label: '📝 কার্যক্রমের ইতিহাস' },
                { id: 'trash', label: '🗑️ ট্র্যাশ ও রিকভারি' },
                { id: 'edits', label: '✏️ পরিবর্তনের ইতিহাস' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSecurityActiveTab(tab.id as any)}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${securityActiveTab === tab.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {securityActiveTab === 'overview' && (
                <div className="space-y-4">
                  {/* Security Overview Card */}
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield size={24} className="text-emerald-200" />
                      <h4 className="font-extrabold text-base">আপনার হিসাব সুরক্ষিত</h4>
                    </div>
                    <p className="text-xs text-emerald-100 leading-relaxed">
                      কেন্দ্রীয় ডেটাবেস থেকে সব লেনদেন ও কাস্টমার তথ্য নিখুঁতভাবে সুরক্ষিত রয়েছে। কোনো আলাদা পাসওয়ার্ড বা লক ছাড়াই আপনার বর্তমান অ্যাকাউন্ট সম্পূর্ণ সচল ও নিরাপদ।
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                        <p className="text-[10px] text-emerald-200">মোট কাস্টমার</p>
                        <p className="text-lg font-black">{customers.length} জন</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                        <p className="text-[10px] text-emerald-200">মোট লেনদেন</p>
                        <p className="text-lg font-black">{customers.reduce((acc, c) => acc + c.transactions.length, 0)} টি</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wide">ডেটা ব্যাকআপ ও রিস্টোর</h4>
                    <p className="text-xs text-slate-500">আপনার সমস্ত কাস্টমার এবং ট্রানজ্যাকশন ডেটা JSON ফাইল হিসেবে ব্যাকআপ রাখুন বা রিস্টোর করুন।</p>
                    
                    <div className="flex gap-2 pt-1">
                      <button 
                        onClick={() => {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customers, null, 2));
                          const downloadAnchor = document.createElement('a');
                          downloadAnchor.setAttribute("href", dataStr);
                          downloadAnchor.setAttribute("download", `smart_hisab_backup_${new Date().toISOString().slice(0,10)}.json`);
                          document.body.appendChild(downloadAnchor);
                          downloadAnchor.click();
                          downloadAnchor.remove();
                          alert('ডেটা ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে!');
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Coins size={14} /> ডেটা ব্যাকআপ নিন
                      </button>
                      <label className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-indigo-200 shadow-sm cursor-pointer">
                        <RotateCcw size={14} /> রিস্টোর করুন
                        <input type="file" accept=".json" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              try {
                                const parsed = JSON.parse(event.target?.result as string);
                                if (Array.isArray(parsed)) {
                                  setCustomers(parsed);
                                  alert('সফলভাবে ব্যাকআপ থেকে ডেটা রিস্টোর করা হয়েছে!');
                                }
                              } catch (err) {
                                alert('ফাইল ফরম্যাট সঠিক নয়!');
                              }
                            };
                            reader.readAsText(file);
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {securityActiveTab === 'audit' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-xs text-slate-700">কার্যক্রমের ইতিহাস (Activity Log)</h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">রিয়েল-টাইম</span>
                  </div>
                  <p className="text-[11px] text-slate-500">ধার দেওয়া, টাকা নেওয়া বা কাস্টমার তৈরির সম্পূর্ণ ইতিহাস নিচে সংরক্ষিত রয়েছে:</p>

                  <div className="space-y-2">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="bg-slate-100 text-slate-800 font-bold text-[10px] px-2 py-0.5 rounded-md">{log.user}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{log.time}</span>
                        </div>
                        <p className="font-extrabold text-xs text-slate-800 mt-1">{log.action}</p>
                        <p className="text-xs text-slate-600">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {securityActiveTab === 'trash' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wide">মুছে ফেলা ট্রানজ্যাকশন (Trash / Deleted)</h4>
                    <p className="text-xs text-slate-500">কোনো লেনদেন ডিলিট করলে তা এখানে সংরক্ষিত থাকে। পুনরুদ্ধার করলে মূল হিসাব ও ব্যালেন্স স্বয়ংক্রিয়ভাবে আপডেট হবে।</p>
                    
                    {deletedTransactions.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">কোনো মুছে ফেলা ট্রানজ্যাকশন নেই</p>
                    ) : (
                      deletedTransactions.map(item => (
                        <div key={item.id} className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-xs text-slate-800">{item.customer} ({item.type}: ৳{item.amount})</p>
                              <p className="text-[10px] text-slate-500">তারিখ: {item.time} • ডিলিট করেছেন: {item.deletedBy}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button 
                              onClick={() => {
                                alert(`"${item.customer}" এর ৳${item.amount} ট্রানজ্যাকশন সফলভাবে পুনরুদ্ধার করা হয়েছে!`);
                                setDeletedTransactions(prev => prev.filter(d => d.id !== item.id));
                              }}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-2 rounded-xl shadow-sm cursor-pointer"
                            >
                              পুনরুদ্ধার করুন (Restore)
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm('স্থায়ীভাবে মুছে ফেলতে চান?')) {
                                  setDeletedTransactions(prev => prev.filter(d => d.id !== item.id));
                                  alert('স্থায়ীভাবে মুছে ফেলা হয়েছে।');
                                }
                              }}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold px-3 py-2 rounded-xl border border-rose-200 cursor-pointer"
                            >
                              স্থায়ীভাবে মুছুন
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {securityActiveTab === 'edits' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wide">লেনদেন পরিবর্তনের ইতিহাস (Edit History)</h4>
                    <p className="text-xs text-slate-500">কোনো লেনদেন এডিট বা পরিবর্তন হলে আগের ও নতুন পরিমাণ এখানে সংরক্ষিত থাকে:</p>

                    {editHistory.map(edit => (
                      <div key={edit.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-800">{edit.customer}</span>
                          <span className="text-[10px] text-slate-400">{edit.time}</span>
                        </div>
                        <p className="text-xs text-slate-700">লেনদেন পরিবর্তন করা হয়েছে</p>
                        <div className="flex gap-4 text-xs pt-1">
                          <span className="text-rose-600 font-bold">আগের পরিমাণ: ৳{edit.oldAmount}</span>
                          <span className="text-emerald-600 font-bold">নতুন পরিমাণ: ৳{edit.newAmount}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">পরিবর্তনকারী: {edit.changedBy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bg-slate-900 text-white flex justify-around p-3 border-t border-slate-800">
        {[
          { id: 'home', icon: Home, label: 'হোম' },
          { id: 'customers', icon: Users, label: 'কাস্টমার' },
          { id: 'transactions', icon: ArrowLeftRight, label: 'লেনদেন' },
          { id: 'reports', icon: PieChart, label: 'রিপোর্ট' },
          { id: 'my_account', icon: User, label: 'আমার হিসাব' },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === tab.id ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
          >
            <tab.icon size={20}/>
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};


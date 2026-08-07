import React, { useState, useEffect, useRef } from 'react';
import { Order, DataPack, Operator, PackCategory, SiteSettings, WifiPackage, PromoBanner } from '../types';
import { 
  ShieldCheck, Lock, Eye, EyeOff, LayoutDashboard, ListOrdered, Package, 
  TrendingUp, CircleDollarSign, Hourglass, CheckSquare, RefreshCw, Trash2, 
  Plus, Sparkles, Check, X, AlertTriangle, Settings, Wifi, Edit, Upload, Shield, Smartphone, FileText, Save, Phone, CreditCard,
  GraduationCap, Briefcase, ArrowRight, ExternalLink, Copy, CheckCircle, Users, Image as ImageIcon, Bell, Search, Globe, Zap, Bot, LayoutGrid, Building2,
  Link2, CheckCircle2, Layers, Wallet, Headset, Video, MonitorPlay, User, PhoneCall
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { GPLogo, RobiLogo, BanglalinkLogo, AirtelLogo, TeletalkLogo } from './OperatorLogos';



interface AdminPanelProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], rejectReason?: string) => void;
  onDeleteOrder: (orderId: string) => void;
  packs: DataPack[];
  onAddPack: (pack: DataPack) => void;
  onDeletePack: (packId: string) => void;
  onUpdatePack: (pack: DataPack) => void;
  onResetDefaultPacks: () => void;
  settings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => Promise<any> | any;
  wifiPacks: WifiPackage[];
  onAddWifiPack: (wifiPack: WifiPackage) => void;
  onDeleteWifiPack: (wifiPackId: string) => void;
  isAdmin: boolean;
  onBackToHome?: () => void;
}

const convertBengaliToEnglishNumerals = (str: string): string => {
  const bMap: { [key: string]: string } = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  return str.replace(/[০-৯]/g, (w) => bMap[w] || w);
};

const parseNumericInput = (val: string | number): number => {
  const englishStr = convertBengaliToEnglishNumerals(String(val));
  const cleanStr = englishStr.replace(/[^0-9.]/g, '');
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

export default function AdminPanel({
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  packs,
  onAddPack,
  onDeletePack,
  onUpdatePack,
  onResetDefaultPacks,
  settings,
  onUpdateSettings,
  wifiPacks,
  onAddWifiPack,
  onDeleteWifiPack,
  isAdmin,
  onBackToHome
}: AdminPanelProps): any {
  // Package editing state
  // Package Edit State
  const [editingPack, setEditingPack] = useState<any>(null);
  const [editPackTitle, setEditPackTitle] = useState('');
  const [editPackSalePrice, setEditPackSalePrice] = useState<number>(0);
  const [editPackRegularPrice, setEditPackRegularPrice] = useState<number>(0);
  const [editPackData, setEditPackData] = useState('');
  const [editPackValidity, setEditPackValidity] = useState('');

  const handleUpdatePackInternal = async () => {
    if (!editingPack) return;
    try {
      await updateDoc(doc(db, 'packages', editingPack.id), {
        title: editPackTitle,
        salePrice: Number(editPackSalePrice),
        regularPrice: Number(editPackRegularPrice),
        data: editPackData,
        validity: editPackValidity
      });
      alert('🎉 অফারটি সফলভাবে আপডেট করা হয়েছে!');
      setEditingPack(null);
    } catch (err: any) {
      alert('❌ অফার আপডেট করতে সমস্যা হয়েছে: ' + (err?.message || String(err)));
    }
  };

  // Active Admin View Tab
  const [adminTab, setAdminTab] = useState<'dashboard' | 'orders' | 'packages' | 'users' | 'banners' | 'software_requests' | 'settings' | 'add_money'>('dashboard');
  const [isAdminMobileView, setIsAdminMobileView] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Add Money States
  const [addMoneyRequests, setAddMoneyRequests] = useState<any[]>([]);

  // User Edit State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserBalance, setEditUserBalance] = useState('');
  const [editUserDataBalance, setEditUserDataBalance] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');

  // Package Form State
  const [showAddPackForm, setShowAddPackForm] = useState(false);
  const [newPack, setNewPack] = useState<Partial<DataPack>>({
    operator: 'GP',
    category: 'internet',
    title: '',
    data: '',
    validity: '',
    salePrice: 0,
    regularPrice: 0
  });




  // New states for Madrasa Results and AI Software Requests
  const [resultsList, setResultsList] = useState<any[]>([]);
  const [softwareRequests, setSoftwareRequests] = useState<any[]>([]);

  // States for Homepage Design Selector
  const [designSearch, setDesignSearch] = useState('');
  const [designCategory, setDesignCategory] = useState('All');

  // Madrasa result form states
  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [regNo, setRegNo] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [madrasaName, setMadrasaName] = useState('');
  const [examClass, setExamClass] = useState('তাকমিল (M.A)');
  const [examYear, setExamYear] = useState('২০২৬');
  const [examGPA, setExamGPA] = useState('৪.৭৫');
  const [examTotalMarks, setExamTotalMarks] = useState('৬৫০');

  // Subject marks states (Default subjects)
  const [subjMarks, setSubjMarks] = useState<Record<string, string>>({
    'বুখারী শরীফ ১ম খণ্ড': '৮৫',
    'বুখারী শরীফ ২য় খণ্ড': '৮৮',
    'মুসলিম শরীফ ১ম খণ্ড': '৮২',
    'মুসলিম শরীফ ২য় খণ্ড': '৮০',
    'তিরমিযী শরীফ ১ম খণ্ড': '৮৪',
    'তিরমিযী শরীফ ২য় খণ্ড': '৮৩',
    'আবূ দাঊদ শরীফ': '৮৬',
    'নাসাঈ ও তহাবী শরীফ': '৮৫'
  });

  // Load results, software requests and users on component mount
  useEffect(() => {
    const unsubResults = onSnapshot(collection(db, 'results'), (snap) => {
      const docs: any[] = [];
      snap.forEach((d) => docs.push({ id: d.id, ...d.data() }));
      setResultsList(docs);
    });

    const unsubSoftware = onSnapshot(collection(db, 'software_requests'), (snap) => {
      const docs: any[] = [];
      snap.forEach((d) => docs.push({ id: d.id, ...d.data() }));
      // Sort newest first
      docs.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      setSoftwareRequests(docs);
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const docs: any[] = [];
      snap.forEach((d) => docs.push({ id: d.id, ...d.data() }));
      docs.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      setUsersList(docs);
    }, (err) => {
      console.warn('Users listener error:', err);
    });

    const unsubAddMoney = onSnapshot(collection(db, 'add_money_requests'), (snap) => {
      const docs: any[] = [];
      snap.forEach((d) => docs.push({ id: d.id, ...d.data() }));
      docs.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      setAddMoneyRequests(docs);
    });

    return () => {
      unsubResults();
      unsubSoftware();
      unsubUsers();
      unsubAddMoney();
    };
  }, []);

  const handleUploadResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !rollNo || !regNo) {
      alert('⚠️ অনুগ্রহ করে ছাত্রের নাম, রোল এবং রেজিস্ট্রেশন নম্বর প্রদান করুন।');
      return;
    }

    try {
      const subjectsArray = Object.entries(subjMarks).map(([name, val]) => {
        const marks = Number(val) || 0;
        let grade = 'Maqbul';
        if (marks >= 90) grade = 'Mumtaz';
        else if (marks >= 80) grade = 'Jayyid Jiddan';
        else if (marks >= 70) grade = 'Jayyid';
        else if (marks >= 50) grade = 'Maqbul';
        else grade = 'Rasib';

        return { name, marks, grade };
      });

      const data = {
        studentName: studentName.trim(),
        roll: rollNo.trim(),
        reg: regNo.trim(),
        fatherName: fatherName.trim() || 'মুহাম্মাদুল্লাহ',
        madrasa: madrasaName.trim() || 'জামিয়া ইসলামিয়া কওমিয়া',
        class: examClass,
        year: examYear,
        gpa: examGPA,
        totalMarks: Number(examTotalMarks) || 650,
        subjects: subjectsArray,
        status: Number(examTotalMarks) >= 400 ? 'passed' : 'failed'
      };

      await addDoc(collection(db, 'results'), data);
      alert('🎉 মাদরাসা ছাত্রের ফলাফল সফলভাবে ডাটাবেজে আপলোড করা হয়েছে!');
      
      // Reset
      setStudentName('');
      setRollNo('');
      setRegNo('');
      setFatherName('');
      setMadrasaName('');
    } catch (err: any) {
      console.error(err);
      alert('❌ ফলাফল আপলোডের ক্ষেত্রে একটি সমস্যা ঘটেছে।');
    }
  };

  const handleDeleteResult = async (id: string) => {
    if (!confirm('🗑️ আপনি কি এই ছাত্রের ফলাফল চিরতরে মুছে ফেলতে চান?')) return;
    try {
      await deleteDoc(doc(db, 'results', id));
      alert('🗑️ ফলাফল সফলভাবে মুছে ফেলা হয়েছে!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSoftwareStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'software_requests', id), { status });
      alert('🎉 প্রজেক্ট ডেলিভারি স্টেটাস আপডেট করা হয়েছে!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUser = async (userId: string) => {
    try {
      // Use setDoc with merge: true to avoid "No document to update" error
      // This will create the document if it doesn't exist
      await setDoc(doc(db, 'users', userId), {
        displayName: editUserName,
        balance: Number(editUserBalance),
        dataBalance: Number(editUserDataBalance),
        phone: editUserPhone
      }, { merge: true });
      
      alert('🎉 ইউজারের তথ্য সফলভাবে আপডেট করা হয়েছে!');
      setEditingUser(null);
    } catch (err: any) {
      console.error('Update User Error:', err);
      alert('❌ ইউজারের তথ্য আপডেটে সমস্যা হয়েছে: ' + (err?.message || String(err)));
    }
  };

  const handleUpdateAddMoneyStatus = async (requestId: string, status: 'approved' | 'rejected', userId: string, amount: number) => {
    if (!userId || userId === 'guest') {
      if (status === 'approved') {
        alert('⚠️ এই রিকোয়েস্টটির সাথে কোনো ভ্যালিড ইউজার আইডি নেই (Guest User)। সরাসরি ব্যালেন্স যোগ করা সম্ভব নয়। রিকোয়েস্টটি শুধু রিজেক্ট বা ডিলিট করতে পারেন।');
        return;
      }
    }

    try {
      if (status === 'approved') {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        let currentBalance = 0;
        if (userSnap.exists()) {
          currentBalance = Number(userSnap.data().balance || 0);
        } else if (userId !== 'guest') {
          console.warn(`User doc not found for ${userId}, creating one with balance.`);
        }
        
        await setDoc(userRef, { 
          balance: currentBalance + amount 
        }, { merge: true });
      }
      
      await updateDoc(doc(db, 'add_money_requests', requestId), { status });
      alert(`🎉 অ্যাড মানি রিকোয়েস্ট ${status === 'approved' ? 'এপ্রুভ' : 'রিজেক্ট'} করা হয়েছে!`);
    } catch (err: any) {
      console.error('Update Add Money Status Error:', err);
      alert('❌ স্টেটাস আপডেট করতে সমস্যা হয়েছে: ' + (err?.message || String(err)));
    }
  };

  const handleAddPackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPack.title || !newPack.salePrice) {
      alert('⚠️ টাইটেল ও দাম দিন।');
      return;
    }
    const pack: DataPack = {
      id: Math.random().toString(36).substr(2, 9),
      operator: newPack.operator as Operator,
      category: newPack.category as PackCategory,
      title: newPack.title!,
      data: newPack.data || '',
      validity: newPack.validity || '',
      salePrice: Number(newPack.salePrice),
      regularPrice: Number(newPack.regularPrice || newPack.salePrice),
      minutes: 0,
      sms: 0,
      commission: 0,
      cashback: 0
    };
    onAddPack(pack);
    setShowAddPackForm(false);
    setNewPack({ operator: 'GP', category: 'internet', title: '', data: '', validity: '', salePrice: 0, regularPrice: 0 });
    alert('🎉 অফারটি সফলভাবে যোগ করা হয়েছে!');
  };

  const handleDeleteSoftwareRequest = async (id: string) => {
    if (!confirm('🗑️ আপনি কি এই প্রজেক্ট রিকোয়েস্টটি ডিলিট করতে চান?')) return;
    try {
      await deleteDoc(doc(db, 'software_requests', id));
      alert('🗑️ প্রজেক্ট রিকোয়েস্টটি ডিলিট করা হয়েছে!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (confirm(`আপনি কি এই ইউজারের ভূমিকা (${currentRole || 'user'} ➔ ${newRole}) পরিবর্তন করতে চান?`)) {
      try {
        await setDoc(doc(db, 'users', userId), { role: newRole }, { merge: true });
        alert('🎉 ইউজারের রোল সফলভাবে আপডেট করা হয়েছে!');
      } catch (err: any) {
        console.error(err);
        alert('❌ রোল আপডেট করতে সমস্যা হয়েছে: ' + (err.message || String(err)));
      }
    }
  };

  const handleDeleteUserDoc = async (userId: string) => {
    if (confirm('🗑️ আপনি কি এই ইউজার প্রোফাইলটি ডিলিট করতে চান?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        alert('🗑️ ইউজার প্রোফাইল মুছে ফেলা হয়েছে!');
      } catch (err: any) {
        console.error(err);
        alert('❌ ডিলিট করতে সমস্যা হয়েছে: ' + (err.message || String(err)));
      }
    }
  };

  // Form State for Adding/Editing Packages
  const [newPackTitle, setNewPackTitle] = useState('');
  const [newPackOperator, setNewPackOperator] = useState<Operator>('GP');
  const [newPackCategory, setNewPackCategory] = useState<PackCategory>('regular');
  const [newPackData, setNewPackData] = useState('10 GB');
  const [newPackMinutes, setNewPackMinutes] = useState<string | number>('0');
  const [newPackSms, setNewPackSms] = useState<string | number>('0');
  const [newPackValidity, setNewPackValidity] = useState('30 Days');
  const [newPackRegularPrice, setNewPackRegularPrice] = useState<string | number>('299');
  const [newPackSalePrice, setNewPackSalePrice] = useState<string | number>('249');
  const [newPackCashback, setNewPackCashback] = useState<string | number>('15');
  const [newPackIsHot, setNewPackIsHot] = useState(false);
  const [newPackIsPopular, setNewPackIsPopular] = useState(false);
  const [newPackDesc, setNewPackDesc] = useState('');

  // Form State for settings
  const [settingsSupportPhone, setSettingsSupportPhone] = useState(settings.supportPhone);
  const [settingsSupportEmail, setSettingsSupportEmail] = useState(settings.supportEmail);
  const [settingsSupportAddress, setSettingsSupportAddress] = useState(settings.supportAddress);
  const [settingsBkash, setSettingsBkash] = useState(settings.bkashNumber);
  const [settingsNagad, setSettingsNagad] = useState(settings.nagadNumber);
  const [settingsRocket, setSettingsRocket] = useState(settings.rocketNumber);
  const [settingsUpay, setSettingsUpay] = useState(settings.upayNumber || '01618599077');
  const [settingsCellfin, setSettingsCellfin] = useState(settings.cellfinNumber || '01624228476');
  const [settingsBinance, setSettingsBinance] = useState(settings.binanceNumber || '524228476');
  const [settingsBanking, setSettingsBanking] = useState(settings.bankingNumber || 'DBBL A/C: 123-456-7890 (Personal)');
  const [settingsUcb, setSettingsUcb] = useState(settings.ucbNumber || 'UCB A/C: 987-654-3210 (Personal)');
  const [settingsMarquee, setSettingsMarquee] = useState(settings.marqueeText);
  const [settingsBannerImages, setSettingsBannerImages] = useState<string[]>(settings.bannerImages || []);
  const [settingsPromoBanners, setSettingsPromoBanners] = useState<PromoBanner[]>(settings.promoBanners || []);
  const [settingsTopBannerImage, setSettingsTopBannerImage] = useState<string>(settings.topBannerImage || '');
  const [settingsOfferBanners, setSettingsOfferBanners] = useState<string[]>(settings.offerBanners || []);
  const [settingsQuickServiceIcons, setSettingsQuickServiceIcons] = useState<Record<string, string>>(settings.quickServiceIcons || {});
  const [newTopBannerUrl, setNewTopBannerUrl] = useState('');
  const [newOfferBannerUrl, setNewOfferBannerUrl] = useState('');
  const [newPromoBannerUrl, setNewPromoBannerUrl] = useState('');
  const [newPromoBannerTarget, setNewPromoBannerTarget] = useState('');
  const [newPromoBannerCategory, setNewPromoBannerCategory] = useState<PackCategory>('internet');
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [settingsApkUrl, setSettingsApkUrl] = useState(settings.apkUrl || '');
  const [settingsTutorialVideoUrl, setSettingsTutorialVideoUrl] = useState(settings.tutorialVideoUrl || '');
  const [settingsAdminNumber, setSettingsAdminNumber] = useState(settings.adminNumber || '01777007700');
  const [settingsAdminPassword, setSettingsAdminPassword] = useState(settings.adminPassword || '7700');
  const [settingsBrandName, setSettingsBrandName] = useState(settings.brandName || 'Fahim Internet');
  const [settingsLogoUrl, setSettingsLogoUrl] = useState(settings.logoUrl || '');
  const [settingsGpLogoUrl, setSettingsGpLogoUrl] = useState(settings.gpLogoUrl || '');
  const [settingsRobiLogoUrl, setSettingsRobiLogoUrl] = useState(settings.robiLogoUrl || '');
  const [settingsBlLogoUrl, setSettingsBlLogoUrl] = useState(settings.blLogoUrl || '');
  const [settingsAirtelLogoUrl, setSettingsAirtelLogoUrl] = useState(settings.airtelLogoUrl || '');
  const [settingsTeletalkLogoUrl, setSettingsTeletalkLogoUrl] = useState(settings.teletalkLogoUrl || '');
  const [settingsBkashLogoUrl, setSettingsBkashLogoUrl] = useState(settings.bkashLogoUrl || '');
  const [settingsNagadLogoUrl, setSettingsNagadLogoUrl] = useState(settings.nagadLogoUrl || '');
  const [settingsRocketLogoUrl, setSettingsRocketLogoUrl] = useState(settings.rocketLogoUrl || '');
  const [settingsUpayLogoUrl, setSettingsUpayLogoUrl] = useState(settings.upayLogoUrl || '');
  const [settingsCellfinLogoUrl, setSettingsCellfinLogoUrl] = useState(settings.cellfinLogoUrl || '');
  const [settingsBankingLogoUrl, setSettingsBankingLogoUrl] = useState(settings.bankingLogoUrl || '');
  const [settingsZiniRegisteredDomain, setSettingsZiniRegisteredDomain] = useState(settings.ziniRegisteredDomain || '');
  const [settingsZinipayApiKey, setSettingsZinipayApiKey] = useState(settings.zinipayApiKey || '');
  const [settingsRechargeEnabled, setSettingsRechargeEnabled] = useState<boolean>(settings.rechargeEnabled !== false);
  const [settingsRechargeNoticeText, setSettingsRechargeNoticeText] = useState(settings.rechargeNoticeText || 'আমাদের মোবাইল রিচার্জ সেবাটি খুব শীঘ্রই চালু হতে যাচ্ছে! সাথেই থাকুন।');
  const [settingsRechargeApiProvider, setSettingsRechargeApiProvider] = useState(settings.rechargeApiProvider || 'generic');
  const [settingsRechargeApiUrl, setSettingsRechargeApiUrl] = useState(settings.rechargeApiUrl || 'https://successtopup.com/api/v1/topup');
  const [settingsRechargeApiKey, setSettingsRechargeApiKey] = useState(settings.rechargeApiKey || 'st_71a8ccbfdd954b6d3a997f6b1039edca');
  const [settingsRechargeApiSecret, setSettingsRechargeApiSecret] = useState(settings.rechargeApiSecret || 'st_79e4a1cbe04876bf69dd6da7d09ae9108279aeac596f50f77e86a37919a09d07');
  const [settingsRechargeApiUsername, setSettingsRechargeApiUsername] = useState(settings.rechargeApiUsername || '');
  const [settingsRechargeAutoTrigger, setSettingsRechargeAutoTrigger] = useState<boolean>(settings.rechargeAutoTrigger !== false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);

  // Form State for Adding Wifi Package
  const [newWifiName, setNewWifiName] = useState('');
  const [newWifiSpeed, setNewWifiSpeed] = useState('');
  const [newWifiPrice, setNewWifiPrice] = useState('');
  const [newWifiBadge, setNewWifiBadge] = useState('');
  const [newWifiFeatures, setNewWifiFeatures] = useState('');
  const [newWifiIsPopular, setNewWifiIsPopular] = useState(false);

  // Order list search and filter states
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [copiedPhoneOrderId, setCopiedPhoneOrderId] = useState<string | null>(null);
  const [copiedTxOrderId, setCopiedTxOrderId] = useState<string | null>(null);
  const [rejectModalOrder, setRejectModalOrder] = useState<Order | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState<string>('অফারটি এই নম্বরে পাওয়া যাচ্ছে না');

  useEffect(() => {
    setSettingsSupportPhone(settings.supportPhone);
    setSettingsSupportEmail(settings.supportEmail);
    setSettingsSupportAddress(settings.supportAddress);
    setSettingsBkash(settings.bkashNumber);
    setSettingsNagad(settings.nagadNumber);
    setSettingsRocket(settings.rocketNumber);
    setSettingsUpay(settings.upayNumber || '01618599077');
    setSettingsCellfin(settings.cellfinNumber || '01624228476');
    setSettingsBinance(settings.binanceNumber || '524228476');
    setSettingsBanking(settings.bankingNumber || 'DBBL A/C: 123-456-7890 (Personal)');
    setSettingsUcb(settings.ucbNumber || 'UCB A/C: 987-654-3210 (Personal)');
    setSettingsMarquee(settings.marqueeText);
    setSettingsBannerImages(settings.bannerImages || []);
    setSettingsPromoBanners(settings.promoBanners || []);
    setSettingsTopBannerImage(settings.topBannerImage || '');
    setSettingsOfferBanners(settings.offerBanners || []);
    setSettingsQuickServiceIcons(settings.quickServiceIcons || {});
    setSettingsApkUrl(settings.apkUrl || '');
    setSettingsTutorialVideoUrl(settings.tutorialVideoUrl || '');
    setSettingsAdminNumber(settings.adminNumber || '01777007700');
    setSettingsAdminPassword(settings.adminPassword || '7700');
    setSettingsLogoUrl(settings.logoUrl || '');
    setSettingsGpLogoUrl(settings.gpLogoUrl || '');
    setSettingsRobiLogoUrl(settings.robiLogoUrl || '');
    setSettingsBlLogoUrl(settings.blLogoUrl || '');
    setSettingsAirtelLogoUrl(settings.airtelLogoUrl || '');
    setSettingsTeletalkLogoUrl(settings.teletalkLogoUrl || '');
    setSettingsBkashLogoUrl(settings.bkashLogoUrl || '');
    setSettingsNagadLogoUrl(settings.nagadLogoUrl || '');
    setSettingsRocketLogoUrl(settings.rocketLogoUrl || '');
    setSettingsUpayLogoUrl(settings.upayLogoUrl || '');
    setSettingsCellfinLogoUrl(settings.cellfinLogoUrl || '');
    setSettingsBankingLogoUrl(settings.bankingLogoUrl || '');
    setSettingsZiniRegisteredDomain(settings.ziniRegisteredDomain || '');
    setSettingsZinipayApiKey(settings.zinipayApiKey || '');
    setSettingsRechargeEnabled(settings.rechargeEnabled !== false);
    setSettingsRechargeNoticeText(settings.rechargeNoticeText || 'আমাদের মোবাইল রিচার্জ সেবাটি খুব শীঘ্রই চালু হতে যাচ্ছে! সাথেই থাকুন।');
    setSettingsRechargeApiProvider(settings.rechargeApiProvider || 'generic');
    setSettingsRechargeApiUrl(settings.rechargeApiUrl || 'https://successtopup.com/api/v1/topup');
    setSettingsRechargeApiKey(settings.rechargeApiKey || 'st_71a8ccbfdd954b6d3a997f6b1039edca');
    setSettingsRechargeApiSecret(settings.rechargeApiSecret || 'st_79e4a1cbe04876bf69dd6da7d09ae9108279aeac596f50f77e86a37919a09d07');
    setSettingsRechargeApiUsername(settings.rechargeApiUsername || '');
    setSettingsRechargeAutoTrigger(settings.rechargeAutoTrigger !== false);
  }, [settings]);

  const getCurrentSettingsState = (): SiteSettings => ({
    ...settings,
    supportPhone: settingsSupportPhone,
    supportEmail: settingsSupportEmail,
    supportAddress: settingsSupportAddress,
    bkashNumber: settingsBkash,
    nagadNumber: settingsNagad,
    rocketNumber: settingsRocket,
    upayNumber: settingsUpay,
    cellfinNumber: settingsCellfin,
    binanceNumber: settingsBinance,
    bankingNumber: settingsBanking,
    ucbNumber: settingsUcb,
    marqueeText: settingsMarquee,
    bannerImages: settingsBannerImages,
    promoBanners: settingsPromoBanners,
    topBannerImage: settingsTopBannerImage,
    offerBanners: settingsOfferBanners,
    quickServiceIcons: settingsQuickServiceIcons,
    apkUrl: settingsApkUrl,
    tutorialVideoUrl: settingsTutorialVideoUrl,
    adminNumber: settingsAdminNumber,
    adminPassword: settingsAdminPassword,
    brandName: settingsBrandName,
    logoUrl: settingsLogoUrl,
    gpLogoUrl: settingsGpLogoUrl,
    robiLogoUrl: settingsRobiLogoUrl,
    blLogoUrl: settingsBlLogoUrl,
    airtelLogoUrl: settingsAirtelLogoUrl,
    teletalkLogoUrl: settingsTeletalkLogoUrl,
    bkashLogoUrl: settingsBkashLogoUrl,
    nagadLogoUrl: settingsNagadLogoUrl,
    rocketLogoUrl: settingsRocketLogoUrl,
    upayLogoUrl: settingsUpayLogoUrl,
    cellfinLogoUrl: settingsCellfinLogoUrl,
    bankingLogoUrl: settingsBankingLogoUrl,
    ziniRegisteredDomain: settingsZiniRegisteredDomain,
    zinipayApiKey: settingsZinipayApiKey,
    rechargeEnabled: settingsRechargeEnabled,
    rechargeNoticeText: settingsRechargeNoticeText,
    rechargeApiProvider: settingsRechargeApiProvider,
    rechargeApiUrl: settingsRechargeApiUrl,
    rechargeApiKey: settingsRechargeApiKey,
    rechargeApiSecret: settingsRechargeApiSecret,
    rechargeApiUsername: settingsRechargeApiUsername,
    rechargeAutoTrigger: settingsRechargeAutoTrigger
  });

  const handleOperatorLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, operatorId: Operator) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await compressIcon(file);
    const keyMap: Record<Operator, keyof SiteSettings> = {
      'GP': 'gpLogoUrl',
      'Robi': 'robiLogoUrl',
      'Banglalink': 'blLogoUrl',
      'Airtel': 'airtelLogoUrl',
      'Teletalk': 'teletalkLogoUrl'
    };
    const field = keyMap[operatorId];
    if (field) {
      const updated = { ...getCurrentSettingsState(), [field]: base64 };
      if (operatorId === 'GP') setSettingsGpLogoUrl(base64);
      if (operatorId === 'Robi') setSettingsRobiLogoUrl(base64);
      if (operatorId === 'Banglalink') setSettingsBlLogoUrl(base64);
      if (operatorId === 'Airtel') setSettingsAirtelLogoUrl(base64);
      if (operatorId === 'Teletalk') setSettingsTeletalkLogoUrl(base64);
      await onUpdateSettings(updated);
      alert('🎉 অপারেটর লোগো সফলভাবে আপডেট করা হয়েছে!');
    }
  };

  const handlePaymentLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, paymentId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await compressIcon(file);
    const keyMap: Record<string, keyof SiteSettings> = {
      'bkash': 'bkashLogoUrl',
      'nagad': 'nagadLogoUrl',
      'rocket': 'rocketLogoUrl',
      'upay': 'upayLogoUrl',
      'cellfin': 'cellfinLogoUrl',
      'banking': 'bankingLogoUrl'
    };
    const field = keyMap[paymentId];
    if (field) {
      const updated = { ...getCurrentSettingsState(), [field]: base64 };
      if (paymentId === 'bkash') setSettingsBkashLogoUrl(base64);
      if (paymentId === 'nagad') setSettingsNagadLogoUrl(base64);
      if (paymentId === 'rocket') setSettingsRocketLogoUrl(base64);
      if (paymentId === 'upay') setSettingsUpayLogoUrl(base64);
      if (paymentId === 'cellfin') setSettingsCellfinLogoUrl(base64);
      if (paymentId === 'banking') setSettingsBankingLogoUrl(base64);
      await onUpdateSettings(updated);
      alert('🎉 পেমেন্ট মেথড লোগো সফলভাবে আপডেট করা হয়েছে!');
    }
  };

  const handleMainLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await compressIcon(file);
    setSettingsLogoUrl(base64);
    const updated = { ...getCurrentSettingsState(), logoUrl: base64 };
    await onUpdateSettings(updated);
    alert('🎉 মেইন ব্র্যান্ড লোগো সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleAddPromoBanner = async () => {
    if (!newPromoBannerUrl || !newPromoBannerTarget) {
      alert('ব্যানার ইমেজ URL এবং টার্গেট অফার সিলেক্ট করুন');
      return;
    }
    const newBanner: PromoBanner = {
      id: Date.now().toString(),
      imageUrl: newPromoBannerUrl,
      targetPackId: newPromoBannerTarget,
      category: newPromoBannerCategory,
      isActive: true
    };
    const updated = [...settingsPromoBanners, newBanner];
    setSettingsPromoBanners(updated);
    setNewPromoBannerUrl('');
    setNewPromoBannerTarget('');
    await onUpdateSettings({ ...getCurrentSettingsState(), promoBanners: updated });
    alert('প্রোমোশনাল ব্যানার যোগ করা হয়েছে!');
  };

  const handleDeletePromoBanner = async (id: string) => {
    const updated = settingsPromoBanners.filter(b => b.id !== id);
    setSettingsPromoBanners(updated);
    await onUpdateSettings({ ...getCurrentSettingsState(), promoBanners: updated });
  };

  const handleTogglePromoBanner = async (id: string) => {
    const updated = settingsPromoBanners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
    setSettingsPromoBanners(updated);
    await onUpdateSettings({ ...getCurrentSettingsState(), promoBanners: updated });
  };

  const compressImages = async (files: File[]): Promise<string[]> => {
    const newCompressedImages: string[] = [];
    for (const file of files) {
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 500;
            const MAX_HEIGHT = 200;
            let width = img.width;
            let height = img.height;
            canvas.width = MAX_WIDTH;
            canvas.height = MAX_HEIGHT;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const imgAspect = width / height;
              const targetAspect = MAX_WIDTH / MAX_HEIGHT;
              let sourceX = 0, sourceY = 0, sourceWidth = width, sourceHeight = height;
              if (imgAspect > targetAspect) {
                sourceWidth = height * targetAspect;
                sourceX = (width - sourceWidth) / 2;
              } else {
                sourceHeight = width / targetAspect;
                sourceY = (height - sourceHeight) / 2;
              }
              ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, MAX_WIDTH, MAX_HEIGHT);
              newCompressedImages.push(canvas.toDataURL('image/webp', 0.40));
            }
            resolve();
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    }
    return newCompressedImages;
  };

  const compressIcon = async (file: File): Promise<string> => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 100;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/webp', 0.50));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleQuickServiceIconUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const compressedUrl = await compressIcon(file);
    const updated = { ...settingsQuickServiceIcons, [id]: compressedUrl };
    setSettingsQuickServiceIcons(updated);
    await onUpdateSettings({ ...getCurrentSettingsState(), quickServiceIcons: updated });
    alert('🎉 দ্রুত সেবার আইকন সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleTopBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;
    const compressed = await compressImages(validFiles);
    if (compressed.length > 0) {
      const img = compressed[0];
      setSettingsTopBannerImage(img);
      await onUpdateSettings({ ...getCurrentSettingsState(), topBannerImage: img });
    }
  };

  const handleOfferBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;
    const compressed = await compressImages(validFiles);
    if (compressed.length > 0) {
      const updated = [...settingsOfferBanners, ...compressed];
      setSettingsOfferBanners(updated);
      await onUpdateSettings({ ...getCurrentSettingsState(), offerBanners: updated });
    }
  };

  const handlePromoBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert('❌ দয়া করে শুধুমাত্র ইমেজ ফাইল (.jpg, .png, .webp, .jpeg) নির্বাচন করুন।');
      return;
    }
    const compressed = await compressImages(validFiles);
    if (compressed.length > 0) {
      setNewPromoBannerUrl(compressed[0]);
      alert('🎉 গ্যালারি থেকে প্রোমোশনাল অফার ব্যানার সিলেক্ট করা হয়েছে!');
    }
  };

  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert('❌ দয়া করে শুধুমাত্র ইমেজ ফাইল (.jpg, .png, .webp, .jpeg) নির্বাচন করুন।');
      return;
    }

    const newCompressedImages = await compressImages(validFiles);

    if (newCompressedImages.length > 0) {
      const updated = [...settingsBannerImages, ...newCompressedImages];
      setSettingsBannerImages(updated);
      try {
        await onUpdateSettings({ ...settings, bannerImages: updated });
        alert('✅ নতুন ব্যানার সফলভাবে আপলোড করা হয়েছে!');
      } catch (err: any) {
        alert('❌ ব্যানার সেভ করতে সমস্যা হয়েছে: ' + (err?.message || String(err)));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Admin Header */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-800"
            >
              <span>← হোম পেজ</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md">
              A
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-wider text-white">FAHIM INTERNET ADMIN</h1>
              <p className="text-[10px] text-slate-400 font-bold">সিস্টেম কন্ট্রোল প্যানেল</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Mobile Friendly) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-4 border-t border-slate-800">
          <button
            onClick={() => setAdminTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>ড্যাশবোর্ড</span>
          </button>
          <button
            onClick={() => setAdminTab('orders')}
            className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap relative ${
              adminTab === 'orders' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>অর্ডার ({orders.length})</span>
          </button>
          <button
            onClick={() => setAdminTab('packages')}
            className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'packages' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>অফার</span>
          </button>
          <button
            onClick={() => setAdminTab('users')}
            className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'users' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>ইউজার</span>
          </button>
          <button
            onClick={() => setAdminTab('banners')}
            className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'banners' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>ব্যানার ও নোটিশ</span>
          </button>
          <button
            onClick={() => setAdminTab('software_requests')}
            className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'software_requests' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>প্রজেক্ট রিকোয়েস্ট</span>
          </button>
          <button
            onClick={() => setAdminTab('add_money')}
            className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'add_money' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>অ্যাড মানি ({addMoneyRequests.filter(r => r.status === 'pending').length})</span>
          </button>
          <button
            onClick={() => setAdminTab('settings')}
            className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'settings' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>সেটিংস</span>
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 pb-24">
        {adminTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <ListOrdered className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">মোট অর্ডার</p>
                  <p className="text-2xl font-black text-slate-900">{orders.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">অ্যাক্টিভ অফার</p>
                  <p className="text-2xl font-black text-slate-900">{packs.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">মোট ইউজার</p>
                  <p className="text-2xl font-black text-slate-900">{usersList.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">সফটওয়্যার রিকোয়েস্ট</p>
                  <p className="text-2xl font-black text-slate-900">{softwareRequests.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-900">অর্ডার ম্যানেজমেন্ট ({orders.length})</h3>
                <p className="text-sm text-slate-500 font-bold">এখান থেকে গ্রাহকের রিচার্জ ও অফার রিকোয়েস্টগুলো ম্যানেজ করুন।</p>
              </div>
            </div>

            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">অর্ডার আইডি ও সময়</th>
                      <th className="px-6 py-4">গ্রাহক ও পেমেন্ট নম্বর</th>
                      <th className="px-6 py-4">প্যাকেজ ও বিবরণ</th>
                      <th className="px-6 py-4">মূল্য</th>
                      <th className="px-6 py-4">স্টেটাস</th>
                      <th className="px-6 py-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs font-bold">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 group">
                        <td className="px-6 py-4">
                          <p className="text-slate-900 font-black">#{order.id.slice(-6).toUpperCase()}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{order.createdAt}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-900 font-black">{order.customerPhone}</p>
                          <p className="text-[10px] text-emerald-600 uppercase tracking-tighter">Pay: {order.paymentMethod} • {order.paymentPhone}</p>
                          <p className="text-[9px] text-slate-400 font-mono mt-0.5">{order.transactionId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-900 font-black line-clamp-1">{order.packTitle}</p>
                          <p className="text-[10px] text-slate-500 uppercase">{order.operator} • {order.rechargeType || 'অফার'}</p>
                        </td>
                        <td className="px-6 py-4 font-black text-emerald-600">৳{order.price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            order.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 
                            order.status === 'cancelled' ? 'bg-rose-50 text-rose-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {order.status === 'completed' ? 'সফল' : order.status === 'cancelled' ? 'বাতিল' : 'পেন্ডিং'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black transition-all shadow-sm"
                                >
                                  এপ্রুভ
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('অর্ডার বাতিল করার কারণ লিখুন:');
                                    if (reason) onUpdateOrderStatus(order.id, 'cancelled', reason);
                                  }}
                                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black transition-all shadow-sm"
                                >
                                  রিজেক্ট
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => onDeleteOrder(order.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'packages' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
              <div>
                <h3 className="text-lg font-black text-slate-900">অফার ও প্যাকেজ ম্যানেজমেন্ট</h3>
                <p className="text-sm text-slate-500 font-bold">এখান থেকে নতুন অফার যোগ বা ম্যানেজ করুন।</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddPackForm(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  নতুন অফার যোগ করুন
                </button>
                <button
                  onClick={() => onResetDefaultPacks()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  ডিফল্ট অফার রিস্টোর
                </button>
              </div>
            </div>

            {showAddPackForm && (
              <div className="bg-white p-6 rounded-[24px] border-2 border-emerald-500 shadow-xl space-y-4 animate-in slide-in-from-top-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-slate-900">নতুন অফার যোগ করুন</h4>
                  <button onClick={() => setShowAddPackForm(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleAddPackSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase">অপারেটর</label>
                    <select value={newPack.operator} onChange={e => setNewPack({...newPack, operator: e.target.value as any})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold">
                      {['GP', 'Robi', 'Banglalink', 'Airtel', 'Teletalk'].map(op => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase">ক্যাটাগরি</label>
                    <select value={newPack.category} onChange={e => setNewPack({...newPack, category: e.target.value as any})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold">
                      {['internet', 'minute', 'combo', 'recharge', 'wifi'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">প্যাকেজ টাইটেল</label>
                    <input type="text" value={newPack.title} onChange={e => setNewPack({...newPack, title: e.target.value})} placeholder="যেমন: ৩০ জিবি + ৫০০ মিনিট" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase">ডাটা (ঐচ্ছিক)</label>
                    <input type="text" value={newPack.data} onChange={e => setNewPack({...newPack, data: e.target.value})} placeholder="যেমন: ৩০ জিবি" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase">মেয়াদ (ঐচ্ছিক)</label>
                    <input type="text" value={newPack.validity} onChange={e => setNewPack({...newPack, validity: e.target.value})} placeholder="যেমন: ৩০ দিন" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase">বিক্রয় মূল্য</label>
                    <input type="number" value={newPack.salePrice} onChange={e => setNewPack({...newPack, salePrice: Number(e.target.value)})} placeholder="যেমন: ৪৯৯" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase">অফিসিয়াল মূল্য (ঐচ্ছিক)</label>
                    <input type="number" value={newPack.regularPrice} onChange={e => setNewPack({...newPack, regularPrice: Number(e.target.value)})} placeholder="যেমন: ৫৯৯" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" />
                  </div>
                  <button type="submit" className="md:col-span-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm shadow-lg shadow-emerald-200 transition-all">
                    অফারটি ডাটাবেজে যুক্ত করুন
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">অফার</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">অপারেটর</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">মূল্য</th>
                      <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-wider">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {packs.map((pack) => (
                      <tr key={pack.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{pack.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{pack.category}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-700">{pack.operator}</span>
                        </td>
                        <td className="px-6 py-4 font-black text-emerald-600">৳{pack.salePrice}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingPack(pack);
                                setEditPackTitle(pack.title);
                                setEditPackSalePrice(pack.salePrice);
                                setEditPackRegularPrice(pack.regularPrice);
                                setEditPackData(pack.data || '');
                                setEditPackValidity(pack.validity || '');
                              }}
                              className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeletePack(pack.id)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">নিবন্ধিত ইউজার তালিকা ({usersList.length})</h3>
                <p className="text-sm text-slate-500 font-bold">এখান থেকে ইউজারদের ব্যালেন্স ও তথ্য ম্যানেজ করুন।</p>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="ইউজার খুঁজুন..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usersList.filter(u => 
                (u.displayName || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                (u.phone || '').includes(userSearchQuery)
              ).map((u) => (
                <div key={u.id} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-lg font-black">
                      {u.displayName?.charAt(0) || u.phone?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{u.displayName || 'Unnamed User'}</p>
                      <p className="text-[10px] text-slate-500 font-bold">{u.phone || u.email || 'No contact'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-500 uppercase">ব্যালেন্স</p>
                      <p className="text-sm font-black text-emerald-600">৳{u.balance || 0}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-500 uppercase">রোল</p>
                      <p className="text-sm font-black text-slate-700">{u.role || 'user'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setEditUserName(u.displayName || '');
                        setEditUserBalance(String(u.balance || 0));
                        setEditUserDataBalance(String(u.dataBalance || 0));
                        setEditUserPhone(u.phone || '');
                      }}
                      className="flex-grow py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      এডিট করুন
                    </button>
                    <button
                      onClick={() => handleToggleUserRole(u.id, u.role)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black rounded-xl transition-all"
                    >
                      রোল পরিবর্তন
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Package Edit Modal */}
        {editingPack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">অফার এডিট করুন</h3>
                <button onClick={() => setEditingPack(null)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-600">প্যাকেজ টাইটেল</label>
                  <input 
                    type="text" 
                    value={editPackTitle} 
                    onChange={e => setEditPackTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-600">সেল প্রাইস (৳)</label>
                    <input 
                      type="number" 
                      value={editPackSalePrice} 
                      onChange={e => setEditPackSalePrice(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-600">রেগুলার প্রাইস (৳)</label>
                    <input 
                      type="number" 
                      value={editPackRegularPrice} 
                      onChange={e => setEditPackRegularPrice(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-600">ডেটা (GB/MB)</label>
                    <input 
                      type="text" 
                      value={editPackData} 
                      onChange={e => setEditPackData(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-600">মেয়াদ</label>
                    <input 
                      type="text" 
                      value={editPackValidity} 
                      onChange={e => setEditPackValidity(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setEditingPack(null)}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm rounded-2xl transition-all"
                >
                  বাতিল
                </button>
                <button 
                  onClick={handleUpdatePackInternal}
                  className="flex-2 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-emerald-100"
                >
                  আপডেট করুন
                </button>
              </div>
            </div>
          </div>
        )}
            {editingUser && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
                  <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-black">ইউজার এডিট করুন</h4>
                      <p className="text-[10px] font-bold text-slate-400">ইউজার আইডি: {editingUser.id}</p>
                    </div>
                    <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase">নাম</label>
                      <input type="text" value={editUserName} onChange={e => setEditUserName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase">ফোন নম্বর</label>
                      <input type="text" value={editUserPhone} onChange={e => setEditUserPhone(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase">ব্যালেন্স (৳)</label>
                        <input type="number" value={editUserBalance} onChange={e => setEditUserBalance(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase">ডাটা ব্যালেন্স</label>
                        <input type="number" value={editUserDataBalance} onChange={e => setEditUserDataBalance(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500" />
                      </div>
                    </div>
                    <button 
                      onClick={() => handleUpdateUser(editingUser.id)}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      পরিবর্তনগুলো সেভ করুন
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {adminTab === 'banners' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Top Banner Section */}
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">১. টপ ব্যানার (Top Banner)</h3>
                    <p className="text-sm text-slate-500 font-semibold">হোমপেজের একদম উপরের ছোট ব্যানার</p>
                  </div>
                </div>
                <input type="file" accept="image/*" onChange={handleTopBannerFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {settingsTopBannerImage && (
                  <div className="relative group rounded-xl overflow-hidden border border-slate-200 mt-4">
                    <img src={settingsTopBannerImage} alt="Top Banner" className="w-full h-auto object-cover" />
                    <button onClick={async () => {
                      setSettingsTopBannerImage('');
                      await onUpdateSettings({ ...settings, topBannerImage: '' });
                    }} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Trending/Offer Banners Section */}
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">২. ট্রেন্ডিং অফার ব্যানার (Offer Slider)</h3>
                    <p className="text-sm text-slate-500 font-semibold">স্লাইডারে প্রদর্শিত বড় ব্যানারগুলো</p>
                  </div>
                </div>
                <input type="file" accept="image/*" multiple onChange={handleOfferBannerFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                {settingsOfferBanners.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {settingsOfferBanners.map((url, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200">
                        <img src={url} alt="Offer Banner" className="w-full h-24 object-cover" />
                        <button onClick={async () => {
                          const updated = settingsOfferBanners.filter((_, i) => i !== idx);
                          setSettingsOfferBanners(updated);
                          await onUpdateSettings({ ...settings, offerBanners: updated });
                        }} className="absolute top-1 right-1 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Main Carousel Banners */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>৩. স্লাইডিং ব্যানার ইমেজ ম্যানেজার (Home Carousel)</span>
                </h3>
                <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-bold">
                  মোট ব্যানার: {settingsBannerImages.length} টি
                </span>
              </div>

              {/* Add Banner Image Controls */}
              <div className="bg-slate-50 p-5 border border-slate-150 rounded-xl space-y-6">
                
                {/* Option 1: Direct File Upload */}
                <div className="space-y-2 border-b border-slate-200 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-black flex items-center justify-center">১</span>
                    <label className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">গ্যালারি থেকে সরাসরি কভার ব্যানার আপলোড করুন (রিসাইজড ও অপ্টিমাইজড)</label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input 
                      type="file" 
                      id="banner-file-upload-main" 
                      accept="image/*" 
                      onChange={handleBannerFileUpload} 
                      className="hidden" 
                    />
                    <label
                      htmlFor="banner-file-upload-main"
                      className="px-5 py-3 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>গ্যালারি থেকে সিলেক্ট করুন</span>
                    </label>
                    <div className="text-sm text-slate-600 font-semibold leading-normal">
                      <p>✅ গ্যালারি থেকে ছবি সিলেক্ট করলেই সেটি <strong className="text-slate-600">১২০০x৪৮০ সাইজে ক্রপ</strong> ও কম্প্রেস হয়ে সরাসরি সার্ভারে সেভ হবে।</p>
                    </div>
                  </div>
                </div>

                {/* Option 2: Image URL Input */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-black flex items-center justify-center">২</span>
                    <label className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">অথবা, নতুন ব্যানার ফটো ইমেজ URL লিংক দিয়ে যোগ করুন</label>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="যেমন: https://images.unsplash.com/... বা যেকোনো ইমেজের লিংক"
                      value={newBannerUrl}
                      onChange={(e) => setNewBannerUrl(e.target.value)}
                      className="flex-grow px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (!newBannerUrl.trim()) {
                          alert('❌ অনুগ্রহ করে একটি সঠিক ইমেজ URL টাইপ করুন!');
                          return;
                        }
                        const updated = [...settingsBannerImages, newBannerUrl.trim()];
                        setSettingsBannerImages(updated);
                        setNewBannerUrl('');
                        await onUpdateSettings({ ...settings, bannerImages: updated });
                        alert('🎉 নতুন ব্যানার ফটো যোগ করা হয়েছে!');
                      }}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>যোগ করুন</span>
                    </button>
                  </div>
                </div>

                {/* Grid preview of current banners */}
                {settingsBannerImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    {settingsBannerImages.map((url, index) => (
                      <div key={index} className="relative rounded-xl overflow-hidden border border-slate-150 bg-white aspect-[2.5/1]">
                        <img src={url} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={async () => {
                            const updated = settingsBannerImages.filter((_, i) => i !== index);
                            setSettingsBannerImages(updated);
                            await onUpdateSettings({ ...settings, bannerImages: updated });
                            alert('🗑️ ব্যানারটি ডিলিট করা হয়েছে!');
                          }}
                          className="absolute top-1 right-1 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-all cursor-pointer shadow-md z-10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Promotional Linked Banners */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">৪. প্রোমোশনাল অফার ব্যানার (Linked to Packs)</h3>
                  <p className="text-sm text-slate-500 font-semibold">নির্দিষ্ট অফারের সাথে লিঙ্ক করা ব্যানার যোগ করুন</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {/* Direct File Upload & URL input */}
                <div className="space-y-3 md:col-span-3">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wide flex items-center justify-between">
                    <span>১. গ্যালারি/ডিভাইস থেকে সরাসরি প্রোমোশনাল ব্যানার আপলোড করুন</span>
                    <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">Direct Upload Enabled</span>
                  </label>
                  
                  <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
                    <input 
                      type="file" 
                      id="promo-banner-file-upload" 
                      accept="image/*" 
                      onChange={handlePromoBannerFileUpload} 
                      className="hidden" 
                    />
                    <label
                      htmlFor="promo-banner-file-upload"
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Upload className="w-4 h-4 text-purple-200" />
                      <span>গ্যালারি থেকে ফটো সিলেক্ট করুন</span>
                    </label>
                    <span className="text-xs font-bold text-slate-400">বা ইমেজ ফাইল সিলেক্ট করুন</span>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-black text-slate-500 uppercase">অথবা, ব্যানার ইমেজ URL লিংক টাইপ করুন</label>
                    <input 
                      type="text" 
                      value={newPromoBannerUrl} 
                      onChange={e => setNewPromoBannerUrl(e.target.value)} 
                      placeholder="https://example.com/banner.jpg বা উপরে ফটো সিলেক্ট করুন" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 font-bold text-xs mt-1 bg-white" 
                    />
                  </div>

                  {/* Preview if image selected/pasted */}
                  {newPromoBannerUrl && (
                    <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl flex items-center gap-4">
                      <div className="w-24 h-14 rounded-lg overflow-hidden border border-purple-200 shrink-0 bg-slate-200">
                        <img src={newPromoBannerUrl} alt="Selected Banner Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-purple-900">ফটো সিলেক্ট করা হয়েছে!</p>
                        <p className="text-[10px] font-bold text-purple-600 truncate">{newPromoBannerUrl.substring(0, 60)}...</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setNewPromoBannerUrl('')}
                        className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-100 rounded-lg transition-all cursor-pointer"
                      >
                        রিমুভ
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 uppercase">ক্যাটাগরি (ঐচ্ছিক)</label>
                  <select value={newPromoBannerCategory} onChange={e => setNewPromoBannerCategory(e.target.value as PackCategory)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 font-bold bg-white text-xs">
                    <option value="internet">ইন্টারনেট প্যাক</option>
                    <option value="minute">মিনিট প্যাক</option>
                    <option value="combo">কম্বো প্যাক</option>
                    <option value="family">ফ্যামিলি প্যাক</option>
                    <option value="gift">গিফট প্যাক</option>
                    <option value="regular">রেগুলার প্যাক</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-black text-slate-500 uppercase">লিঙ্ক করা অফার (Select Pack)</label>
                  <select value={newPromoBannerTarget} onChange={e => setNewPromoBannerTarget(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 font-bold bg-white text-xs">
                    <option value="">অফার সিলেক্ট করুন...</option>
                    {packs.map(p => (
                      <option key={p.id} value={p.id}>{p.operator} - {p.title} (৳{p.salePrice})</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3 flex justify-end mt-2">
                  <button onClick={handleAddPromoBanner} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer">
                    <Plus className="w-4 h-4" />
                    প্রোমোশনাল ব্যানার যোগ করুন
                  </button>
                </div>
              </div>

              {settingsPromoBanners.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                  {settingsPromoBanners.map((banner) => {
                    const targetPack = packs.find(p => p.id === banner.targetPackId);
                    return (
                      <div key={banner.id} className={`rounded-2xl border ${banner.isActive ? 'border-purple-200 bg-white shadow-lg' : 'border-slate-200 bg-slate-50 opacity-60'} overflow-hidden transition-all hover:shadow-xl`}>
                        <div className="h-32 bg-slate-100 relative">
                          <img src={banner.imageUrl} alt="Promo" className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button onClick={() => handleTogglePromoBanner(banner.id)} className={`p-2 rounded-lg text-white backdrop-blur-md ${banner.isActive ? 'bg-emerald-500/80 hover:bg-emerald-500' : 'bg-slate-500/80 hover:bg-slate-500'}`}>
                              {banner.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            </button>
                            <button onClick={() => handleDeletePromoBanner(banner.id)} className="p-2 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-white backdrop-blur-md">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Target Offer:</p>
                          {targetPack ? (
                            <p className="text-xs font-black text-slate-800 line-clamp-2">{targetPack.operator} {targetPack.title} - ৳{targetPack.salePrice}</p>
                          ) : (
                            <p className="text-xs font-black text-rose-500 italic">অফার পাওয়া যায়নি!</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* 4. Quick Service Icons */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">৪. দ্রুত সেবা আইকন</h3>
                  <p className="text-sm text-slate-500 font-semibold">হোমপেজের দ্রুত সেবা সেকশনের আইকন পরিবর্তন করুন</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                  { id: "internet", label: "ইন্টারনেট প্যাক" },
                  { id: "minute", label: "মিনিট প্যাক" },
                  { id: "recharge", label: "মোবাইল রিচার্জ" },
                  { id: "special", label: "স্পেশাল অফার" },
                  { id: "cashback", label: "ক্যাশব্যাক অফার" },
                  { id: "add_money", label: "Add Money" },
                  { id: "all_service", label: "সকল সার্ভিস" },
                  { id: "bundle", label: "বান্ডিল প্যাক" },
                  { id: "family", label: "ফ্যামিলি প্যাক" },
                  { id: "support", label: "সাপোর্ট টিম" },
                  { id: "tracking", label: "অর্ডার ট্র্যাকিং" }
                ].map(service => (
                  <div key={service.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-1">
                      {settingsQuickServiceIcons[service.id] ? (
                        <img src={settingsQuickServiceIcons[service.id]} alt={service.label} className="w-full h-full object-contain rounded-full" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                          <Settings className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] font-black text-slate-800">{service.label}</p>
                    <label className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap">
                      আইকন পরিবর্তন
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleQuickServiceIconUpload(service.id, e)}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: SOFTWARE REQUESTS */}
        {adminTab === 'software_requests' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-900">সফটওয়্যার ও প্রজেক্ট রিকোয়েস্ট ({softwareRequests.length})</h3>
                <p className="text-sm text-slate-500 font-bold">গ্রাহকদের কাস্টম সফটওয়্যার বা ওয়েবসাইট তৈরির রিকোয়েস্টগুলো এখানে ম্যানেজ করুন।</p>
              </div>
            </div>

            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">গ্রাহক ও প্রজেক্ট</th>
                      <th className="px-6 py-4">বাজেট ও সময়সীমা</th>
                      <th className="px-6 py-4">বিবরণ</th>
                      <th className="px-6 py-4">স্টেটাস</th>
                      <th className="px-6 py-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs font-bold">
                    {softwareRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 group">
                        <td className="px-6 py-4">
                          <p className="text-slate-900 font-black">{req.name || req.userName || 'Unknown'}</p>
                          <p className="text-[10px] text-emerald-600 mt-0.5">{req.phone || req.email || 'N/A'}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{new Date(req.createdAt || Date.now()).toLocaleString('bn-BD')}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-900 font-black text-sm">৳{req.budget || 'Negotiable'}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">ডেডলাইন: {req.deadline || 'জরুরি নয়'}</p>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-slate-700 font-semibold truncate">{req.description || req.projectType || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            req.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 
                            req.status === 'in_progress' ? 'bg-indigo-50 text-indigo-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {req.status === 'completed' ? 'সম্পন্ন' : req.status === 'in_progress' ? 'চলমান' : 'পেন্ডিং'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={req.status || 'pending'}
                              onChange={(e) => handleUpdateSoftwareStatus(req.id, e.target.value)}
                              className="px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 focus:outline-none"
                            >
                              <option value="pending">পেন্ডিং</option>
                              <option value="in_progress">চলমান</option>
                              <option value="completed">সম্পন্ন</option>
                            </select>
                            <button
                              onClick={() => handleDeleteSoftwareRequest(req.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {softwareRequests.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold">
                          কোনো সফটওয়্যার/প্রজেক্ট রিকোয়েস্ট পাওয়া যায়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ADD MONEY REQUESTS */}
        {adminTab === 'add_money' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-900">অ্যাড মানি রিকোয়েস্ট ম্যানেজমেন্ট ({addMoneyRequests.length})</h3>
                <p className="text-sm text-slate-500 font-bold">এখান থেকে ইউজারদের ব্যালেন্স রিচার্জ রিকোয়েস্টগুলো ম্যানেজ করুন।</p>
              </div>
            </div>

            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">ইউজার ও সময়</th>
                      <th className="px-6 py-4">পেমেন্ট মেথড ও ট্রানজেকশন</th>
                      <th className="px-6 py-4">পরিমাণ</th>
                      <th className="px-6 py-4">স্টেটাস</th>
                      <th className="px-6 py-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs font-bold">
                    {addMoneyRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 group">
                        <td className="px-6 py-4">
                          <p className="text-slate-900 font-black">{req.userName || 'Unknown User'}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{new Date(req.createdAt).toLocaleString('bn-BD')}</p>
                          <p className="text-[9px] text-slate-300 font-mono mt-0.5">UID: {req.userId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-900 font-black uppercase">{req.method}</p>
                          <p className="text-[10px] text-emerald-600 tracking-tighter">Acc: {req.senderPhone || req.accountNumber || 'N/A'}</p>
                          <p className="text-[9px] text-slate-500 font-mono mt-0.5">TXID: {req.trxId || req.transactionId || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4 font-black text-emerald-600 text-lg">৳{req.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            req.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 
                            req.status === 'rejected' ? 'bg-rose-50 text-rose-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {req.status === 'approved' ? 'সফল' : req.status === 'rejected' ? 'বাতিল' : 'পেন্ডিং'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {req.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateAddMoneyStatus(req.id, 'approved', req.userId, req.amount)}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black transition-all shadow-sm flex items-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  এপ্রুভ
                                </button>
                                <button
                                  onClick={() => handleUpdateAddMoneyStatus(req.id, 'rejected', req.userId, req.amount)}
                                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black transition-all shadow-sm flex items-center gap-1.5"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  রিজেক্ট
                                </button>
                              </>
                            )}
                            <button
                              onClick={async () => {
                                if (confirm('আপনি কি এই রিকোয়েস্টটি ডিলিট করতে চান?')) {
                                  try {
                                    await deleteDoc(doc(db, 'add_money_requests', req.id));
                                    alert('🎉 রিকোয়েস্টটি সফলভাবে ডিলিট করা হয়েছে!');
                                  } catch (err) {
                                    alert('❌ ডিলিট করতে সমস্যা হয়েছে।');
                                  }
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {addMoneyRequests.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold">
                          কোনো অ্যাড মানি রিকোয়েস্ট পাওয়া যায়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'settings' && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-950">সিস্টেম কনফিগারেশন প্যানেল</h2>
              <p className="text-sm text-slate-600 font-semibold">
                হেল্পলাইন, পেমেন্ট গেটওয়ে এবং সাইট সেটিংস পরিবর্তন করুন।
              </p>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Card 1: Brand & Identity */}
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-lg">
                  <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">১. ব্র্যান্ড ও পরিচয় সেটিংস</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Brand Identity Settings</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-wider border border-emerald-100">
                      Active Branding
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-8 flex-grow">
                    {/* Brand Name */}
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        ব্র্যান্ডের নাম (Brand Name)
                      </label>
                      <div className="relative group">
                        <input 
                          type="text" 
                          value={settingsBrandName} 
                          onChange={(e) => setSettingsBrandName(e.target.value)} 
                          className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 font-black text-slate-800 transition-all shadow-inner-sm"
                          placeholder="যেমন: ফাহিম ইন্টারনেট"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold px-1 italic">সফটওয়্যার ও ওয়েবসাইটের সর্বত্র এই নামটি প্রদর্শিত হবে।</p>
                    </div>

                    {/* Logo Upload & Preview */}
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        মেইন ব্র্যান্ড লোগো (Brand Logo)
                      </label>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:border-emerald-200">
                        <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm p-1.5 shrink-0 group-hover:scale-105 transition-transform">
                          {settingsLogoUrl ? (
                            <img src={settingsLogoUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                              <Building2 className="w-8 h-8 opacity-20" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-3 w-full">
                          <input 
                            type="file" 
                            accept="image/*" 
                            id="main-logo-upload-card" 
                            onChange={handleMainLogoUpload}
                            className="hidden" 
                          />
                          <label 
                            htmlFor="main-logo-upload-card"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-700 rounded-xl text-[11px] font-black transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            <Upload className="w-4 h-4" />
                            লোগো ফাইল আপলোড করুন
                          </label>
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-400 font-bold leading-tight">PNG/JPG ফরম্যাট সমর্থন করে।</p>
                            <p className="text-[10px] text-slate-400 font-bold leading-tight">সুপারিশ: স্বচ্ছ ব্যাকগ্রাউন্ড সহ লোগো ব্যবহার করুন।</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">অথবা লোগো ইমেজ URL দিন</label>
                        <input 
                          type="text" 
                          value={settingsLogoUrl} 
                          onChange={(e) => setSettingsLogoUrl(e.target.value)} 
                          placeholder="https://example.com/logo.png"
                          className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-500 font-mono text-xs text-slate-600 transition-all"
                        />
                      </div>
                    </div>

                    {/* Other Identity Settings */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">ZiniPay নিবন্ধিত ডোমেইন</label>
                        <input
                          type="text"
                          value={settingsZiniRegisteredDomain}
                          onChange={(e) => setSettingsZiniRegisteredDomain(e.target.value)}
                          placeholder="যেমন: https://www.fahiminternet.com"
                          className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 font-bold text-slate-800 transition-all shadow-inner-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">অ্যান্ড্রয়েড APK ডাউনলোড লিংক</label>
                        <div className="relative">
                          <Smartphone className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
                          <input
                            type="url"
                            value={settingsApkUrl}
                            onChange={(e) => setSettingsApkUrl(e.target.value)}
                            placeholder="https://example.com/app.apk"
                            className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-800 shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Helpline & Support */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">২. হেল্পলাইন ও কাস্টমার সাপোর্ট</h3>
                </div>
                <div className="p-8 space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">সাপোর্ট মোবাইল নম্বর</label>
                    <input
                      type="text"
                      value={settingsSupportPhone}
                      onChange={(e) => setSettingsSupportPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">সাপোর্ট ইমেইল</label>
                    <input
                      type="email"
                      value={settingsSupportEmail}
                      onChange={(e) => setSettingsSupportEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">অফিস ঠিকানা</label>
                    <textarea
                      value={settingsSupportAddress}
                      onChange={(e) => setSettingsSupportAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white font-bold h-20"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Payment Numbers */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col lg:col-span-2">
                <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">৩. পেমেন্ট গেটওয়ে নম্বর ম্যানেজমেন্ট</h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'বিকাশ (bKash)', value: settingsBkash, setter: setSettingsBkash, icon: 'https://seeklogo.com/images/B/bkash-logo-0CBB05719F-seeklogo.com.png' },
                    { label: 'নগদ (Nagad)', value: settingsNagad, setter: setSettingsNagad, icon: 'https://seeklogo.com/images/N/nagad-logo-7A70BB6666-seeklogo.com.png' },
                    { label: 'রকেট (Rocket)', value: settingsRocket, setter: setSettingsRocket, icon: 'https://seeklogo.com/images/D/dutch-bangla-rocket-logo-B4D1CC458D-seeklogo.com.png' },
                    { label: 'উপায় (Upay)', value: settingsUpay, setter: setSettingsUpay, icon: 'https://seeklogo.com/images/U/upay-logo-0E646AF653-seeklogo.com.png' },
                    { label: 'সেলফিন (Cellfin)', value: settingsCellfin, setter: setSettingsCellfin, icon: 'https://play-lh.googleusercontent.com/9-O1xP8M_6Xy-kX7_v_9u_L_v4-h0_8_8_8_8_8_8_8_8_8_8_8_8_8_8_8_8' },
                    { label: 'ব্যাংকিং (Bank)', value: settingsBanking, setter: setSettingsBanking, icon: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png' },
                    { label: 'বাইন্যান্স (Binance)', value: settingsBinance, setter: setSettingsBinance, icon: 'https://seeklogo.com/images/B/binance-coin-bnb-logo-CD9440D531-seeklogo.com.png' },
                    { label: 'UCB (Upay)', value: settingsUcb, setter: setSettingsUcb, icon: 'https://seeklogo.com/images/U/ucb-logo-0E646AF653-seeklogo.com.png' }
                  ].map((pm, idx) => (
                    <div key={idx} className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <img src={pm.icon} alt="" className="w-5 h-5 object-contain" />
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{pm.label}</label>
                      </div>
                      <input
                        type="text"
                        value={pm.value}
                        onChange={(e) => pm.setter(e.target.value)}
                        placeholder="নম্বর দিন"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-amber-500 font-bold text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 4: API & Auto-Recharge Automation */}
              <div className="bg-slate-950 rounded-[32px] border border-slate-800 shadow-xl overflow-hidden flex flex-col lg:col-span-2 text-white">
                <div className="px-8 py-6 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                      <Zap className="w-6 h-6 fill-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-black uppercase tracking-wider">৪. রিচার্জ এপিআই ও অটোমেশন কনফিগারেশন</h3>
                      <p className="text-xs text-slate-400 font-bold mt-0.5">অটো রিচার্জ গেটওয়ে (Success TopUp / SpeedDigit API) সংযোগ করুন।</p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setSettingsRechargeEnabled(!settingsRechargeEnabled)}
                    className={`px-5 py-2 rounded-2xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                      settingsRechargeEnabled
                        ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                        : 'bg-rose-600 text-white shadow-rose-600/20'
                    }`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${settingsRechargeEnabled ? 'bg-white animate-pulse' : 'bg-rose-200'}`} />
                    <span>{settingsRechargeEnabled ? 'এপিআই রিচার্জ চালু' : 'এপিআই রিচার্জ বন্ধ'}</span>
                  </button>
                </div>
                
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-semibold">
                    <div className="space-y-2 lg:col-span-2">
                      <label className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">API Endpoint URL (Target Gateway)</label>
                      <input
                        type="url"
                        value={settingsRechargeApiUrl}
                        onChange={(e) => setSettingsRechargeApiUrl(e.target.value)}
                        placeholder="https://successtopup.com/api/v1/topup"
                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-sm focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">API Provider Type</label>
                      <select
                        value={settingsRechargeApiProvider}
                        onChange={(e) => setSettingsRechargeApiProvider(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-black text-sm focus:border-emerald-500 outline-none cursor-pointer"
                      >
                        <option value="generic">Standard REST API (JSON)</option>
                        <option value="get_param">Query Parameters (GET)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">API Key</label>
                      <input type="text" value={settingsRechargeApiKey} onChange={(e) => setSettingsRechargeApiKey(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">API Secret</label>
                      <input type="text" value={settingsRechargeApiSecret} onChange={(e) => setSettingsRechargeApiSecret(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">API Username</label>
                      <input type="text" value={settingsRechargeApiUsername} onChange={(e) => setSettingsRechargeApiUsername(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-sm" />
                    </div>
                  </div>

                  <div className="p-5 bg-slate-900/50 rounded-[24px] border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                        ইনস্ট্যান্ট অটো-ট্রিগার সেটিংস
                      </span>
                      <p className="text-sm text-slate-400 font-bold">পেমেন্ট সফল হওয়ার সাথে সাথে ব্যাকএন্ড সার্ভার অটো এপিআই কল করবে।</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettingsRechargeAutoTrigger(!settingsRechargeAutoTrigger)}
                      className={`px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-lg cursor-pointer ${
                        settingsRechargeAutoTrigger
                          ? 'bg-emerald-600 text-white shadow-emerald-600/10'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {settingsRechargeAutoTrigger ? 'অটো ট্রিগার: ACTIVE' : 'অটো ট্রিগার: DISABLED'}
                    </button>
                  </div>

                  {/* API Test Connection Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!settingsRechargeApiUrl || !settingsRechargeApiKey) {
                          alert('⚠️ এপিআই টেস্ট করার জন্য প্রথমে API Endpoint URL এবং API Key ঘরগুলো পূরণ করুন।');
                          return;
                        }
                        try {
                          const res = await fetch('/api/recharge', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              phone: '01700000000',
                              amount: 10,
                              operator: 'GP',
                              rechargeType: 'flexiload'
                            })
                          });
                          const data = await res.json();
                          if (data.success) {
                            alert('🎉 এপিআই কানেকশন সফল হয়েছে! প্রোভাইডার থেকে উত্তর:\n' + JSON.stringify(data.data || data, null, 2));
                          } else {
                            alert('⚠️ এপিআই রেসপন্স:\n' + (data.message || JSON.stringify(data, null, 2)));
                          }
                        } catch (err: any) {
                          alert('❌ এপিআই টেস্টে ভুল হয়েছে: ' + (err.message || String(err)));
                        }
                      }}
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>এপিআই কানেকশন টেস্ট করুন (Test API)</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Card 5: Operator Logos & Branding */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col lg:col-span-2">
                <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">৫. সিম অপারেটর লোগো ম্যানেজমেন্ট</h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {[
                      { id: 'GP', name: 'গ্রামীণফোন', state: settingsGpLogoUrl, setter: setSettingsGpLogoUrl },
                      { id: 'Robi', name: 'রবি', state: settingsRobiLogoUrl, setter: setSettingsRobiLogoUrl },
                      { id: 'Banglalink', name: 'বাংলালিংক', state: settingsBlLogoUrl, setter: setSettingsBlLogoUrl },
                      { id: 'Airtel', name: 'এয়ারটেল', state: settingsAirtelLogoUrl, setter: setSettingsAirtelLogoUrl },
                      { id: 'Teletalk', name: 'টেলিটক', state: settingsTeletalkLogoUrl, setter: setSettingsTeletalkLogoUrl }
                    ].map((op) => (
                      <div key={op.id} className="flex flex-col items-center gap-4 text-center">
                        <div className="relative w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden p-2">
                          {op.state ? (
                            <img src={op.state} alt={op.name} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <span className="text-[10px] font-black text-slate-300">ডিফল্ট লোগো</span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider block">{op.name}</span>
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black cursor-pointer hover:bg-black transition-all">
                            <Upload className="w-3 h-3" />
                            <span>আপলোড</span>
                            <input type="file" accept="image/*" onChange={(e) => handleOperatorLogoUpload(e, op.id as Operator)} className="hidden" />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 6: Payment Method Logos */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col lg:col-span-2">
                <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">৬. পেমেন্ট মেথড লোগো ম্যানেজমেন্ট</h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {[
                      { id: 'bkash', name: 'বিকাশ', state: settingsBkashLogoUrl, setter: setSettingsBkashLogoUrl },
                      { id: 'nagad', name: 'নগদ', state: settingsNagadLogoUrl, setter: setSettingsNagadLogoUrl },
                      { id: 'rocket', name: 'রকেট', state: settingsRocketLogoUrl, setter: setSettingsRocketLogoUrl },
                      { id: 'upay', name: 'উপায়', state: settingsUpayLogoUrl, setter: setSettingsUpayLogoUrl },
                      { id: 'cellfin', name: 'সেলফিন', state: settingsCellfinLogoUrl, setter: setSettingsCellfinLogoUrl },
                      { id: 'banking', name: 'ব্যাংক', state: settingsBankingLogoUrl, setter: setSettingsBankingLogoUrl }
                    ].map((pm) => (
                      <div key={pm.id} className="flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden p-2">
                          {pm.state ? (
                            <img src={pm.state} alt={pm.name} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <span className="text-[10px] font-black text-slate-300">ডিফল্ট</span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider block">{pm.name}</span>
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black cursor-pointer hover:bg-black transition-all">
                            <Upload className="w-3 h-3" />
                            <span>আপলোড</span>
                            <input type="file" accept="image/*" onChange={(e) => handlePaymentLogoUpload(e, pm.id)} className="hidden" />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Part 2: Software Download Link Manager */}
            <div className="p-6 bg-slate-50 border border-slate-150 rounded-xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-900" />
                <span>২. সফটওয়্যার ডাউনলোড লিংক ম্যানেজার</span>
              </h3>
              
              <p className="text-sm text-slate-500 font-bold leading-relaxed">
                এখানে আপনার নিজস্ব অ্যান্ড্রয়েড অ্যাপ (.apk) বা যেকোনো সফটওয়্যারের লিংক সেভ করতে পারেন। লিংকটি সেভ করলে গ্রাহকরা হোমপেজে এবং প্রতিটি পেজের ওপরের হেডার মেনুতে "ডাউনলোড সফটওয়্যার" বাটনে ক্লিক করে অ্যাপটি সরাসরি ডাউনলোড করতে পারবেন।
              </p>

              <div className="bg-white p-5 border border-slate-150 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5 md:col-span-3">
                  <label className="text-sm text-slate-600 uppercase tracking-wide">সফটওয়্যার / অ্যাপ ডাউনলোড লিংক (URL)</label>
                  <input
                    type="url"
                    value={settingsApkUrl}
                    onChange={(e) => setSettingsApkUrl(e.target.value)}
                    placeholder="যেমন: https://example.com/software.apk"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0f172a] font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!settingsApkUrl.trim()) {
                        alert('❌ দয়া করে একটি সঠিক সফটওয়্যার লিংক লিখুন!');
                        return;
                      }
                      onUpdateSettings({
                        ...settings,
                        apkUrl: settingsApkUrl.trim()
                      });
                      alert('🎉 সফটওয়্যার ডাউনলোড লিংক সফলভাবে সেভ করা হয়েছে!');
                    }}
                    className="w-full px-5 py-2.5 bg-slate-900 hover:bg-[#15803d] text-white rounded-xl uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow"
                  >
                    <Check className="w-4 h-4" />
                    <span>লিংক সেভ করুন</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Part 2.5: Tutorial Video Manager */}
            <div className="p-6 bg-slate-50 border border-slate-150 rounded-xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-900" />
                <span>২.৫. টিউটোরিয়াল ভিডিও ম্যানেজার (সর্বোচ্চ ৩০ সেকেন্ড)</span>
              </h3>
              
              <p className="text-sm text-slate-500 font-bold leading-relaxed">
                আপনার গ্রাহকদের অফার কেনার সঠিক নিয়ম দেখানোর জন্য এখানে একটি ৩০ সেকেন্ডের টিউটোরিয়াল ভিডিও আপলোড করতে পারেন অথবা ভিডিওর সরাসরি লিংক (Direct URL) যুক্ত করতে পারেন। এই ভিডিওটি ড্যাশবোর্ডের মোবাইল আইকনে প্রদর্শন করা হবে।
              </p>

              <div className="bg-white p-5 border border-slate-150 rounded-xl shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-1.5 md:col-span-3">
                    <label className="text-sm text-slate-600 uppercase tracking-wide">ভিডিও সরাসরি লিংক (Direct URL)</label>
                    <input
                      type="url"
                      value={settingsTutorialVideoUrl}
                      onChange={(e) => setSettingsTutorialVideoUrl(e.target.value)}
                      placeholder="যেমন: https://example.com/tutorial_video.mp4"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0f172a] font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!settingsTutorialVideoUrl.trim()) {
                          alert('❌ দয়া করে একটি সঠিক ভিডিও লিংক লিখুন!');
                          return;
                        }
                        onUpdateSettings({
                          ...settings,
                          tutorialVideoUrl: settingsTutorialVideoUrl.trim()
                        });
                        alert('🎉 টিউটোরিয়াল ভিডিও লিংক সফলভাবে সেভ করা হয়েছে!');
                      }}
                      className="w-full px-5 py-2.5 bg-slate-900 hover:bg-[#15803d] text-white rounded-xl uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow"
                    >
                      <Check className="w-4 h-4" />
                      <span>লিংক সেভ করুন</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-4 space-y-3">
                  <span className="text-sm text-slate-600 font-extrabold uppercase block">
                    অথবা সরাসরি ভিডিও ফাইল আপলোড করুন (সর্বোচ্চ ১০ MB - অটোমেটিক ক্লাউড চাঙ্কিং)
                  </span>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                      type="file"
                      accept="video/*"
                      disabled={isVideoUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            alert('❌ ভিডিও ফাইলের সাইজ অবশ্যই ১০ মেগাবাইট (10 MB)-এর কম হতে হবে। অনুগ্রহ করে ছোট/কম্প্রেসড ভিডিও আপলোড করুন অথবা সরাসরি ভিডিও লিংক ব্যবহার করুন!');
                            return;
                          }
                          setIsVideoUploading(true);
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            try {
                              const base64 = reader.result as string;
                              setSettingsTutorialVideoUrl(base64);
                              await onUpdateSettings({
                                ...settings,
                                tutorialVideoUrl: base64
                              });
                              alert('🎉 ভিডিও ফাইলটি সফলভাবে আপলোড এবং ডাটাবেজে সেভ করা হয়েছে!');
                            } catch (err: any) {
                              console.error(err);
                              alert('❌ ভিডিও সেভ করতে ব্যর্থ হয়েছে! অনুগ্রহ করে আবার চেষ্টা করুন বা সরাসরি লিংক ব্যবহার করুন।');
                            } finally {
                              setIsVideoUploading(false);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-slate-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer disabled:opacity-50"
                    />
                    
                    {settingsTutorialVideoUrl && !isVideoUploading && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm('আপনি কি টিউটোরিয়াল ভিডিওটি ডিলিট করতে চান?')) {
                            setSettingsTutorialVideoUrl('');
                            await onUpdateSettings({
                              ...settings,
                              tutorialVideoUrl: ''
                            });
                            alert('🎉 টিউটোরিয়াল ভিডিওটি সফলভাবে ডিলিট করা হয়েছে!');
                          }
                        }}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-sm uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        ভিডিও ডিলিট করুন
                      </button>
                    )}
                  </div>
                  {isVideoUploading && (
                    <div className="text-xs text-slate-900 font-bold flex items-center gap-2 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>ভিডিও ফাইল প্রসেস ও ডাটাবেজে সেভ হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন... (কিছু সময় লাগতে পারে)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Part 3: WiFi Connection Packages Manager */}
            <div className="p-6 bg-slate-50 border border-slate-150 rounded-xl space-y-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Wifi className="w-4 h-4 text-slate-900" />
                <span>৩. হোম ওয়াইফাই সংযোগ প্যাকেজ ম্যানেজার</span>
              </h3>

              {/* Add Wifi Package Form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newWifiName || !newWifiSpeed || !newWifiPrice) {
                  alert('❌ দয়া করে প্যাকেজ নাম, স্পিড এবং মূল্য ফিল্ডগুলো পূরণ করুন।');
                  return;
                }
                const parsedFeatures = newWifiFeatures
                  ? newWifiFeatures.split(',').map(f => f.trim()).filter(Boolean)
                  : ['আনলিমিটেড ডাটা', '২৪/৭ সাপোর্ট'];
                
                onAddWifiPack({
                  id: `wifi-${Date.now()}`,
                  name: newWifiName,
                  speed: newWifiSpeed,
                  price: newWifiPrice,
                  features: parsedFeatures,
                  badge: newWifiBadge,
                  popular: newWifiIsPopular
                });

                // Reset wifi form fields
                setNewWifiName('');
                setNewWifiSpeed('');
                setNewWifiPrice('');
                setNewWifiBadge('');
                setNewWifiFeatures('');
                setNewWifiIsPopular(false);

                alert('🎉 ওয়াইফাই কানেকশন প্যাকেজ সফলভাবে যোগ করা হয়েছে!');
              }} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold bg-white p-5 border border-slate-150 rounded-xl shadow-sm">
                
                <div className="md:col-span-3 border-b border-slate-100 pb-1.5">
                  <h4 className="text-sm font-extrabold text-slate-700">নতুন ওয়াইফাই কানেকশন যোগ করুন</h4>
                </div>

                {/* Package Name */}
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-600 uppercase tracking-wide">প্যাকেজ নাম</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Starter Package"
                    value={newWifiName}
                    onChange={(e) => setNewWifiName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                {/* Speed */}
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-600 uppercase tracking-wide">স্পিড (Bandwidth Speed)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20 Mbps"
                    value={newWifiSpeed}
                    onChange={(e) => setNewWifiSpeed(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-600 uppercase tracking-wide">মূল্য (যেমন: ৳ ৫০০ / মাস)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ৳ ৫০০ / মাস"
                    value={newWifiPrice}
                    onChange={(e) => setNewWifiPrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                {/* Badge */}
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-600 uppercase tracking-wide">প্যাকেজ ব্যাজ (Badge)</label>
                  <input
                    type="text"
                    placeholder="e.g. সর্বাধিক জনপ্রিয় বা হোম ইউজার"
                    value={newWifiBadge}
                    onChange={(e) => setNewWifiBadge(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                {/* Features */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm text-slate-600 uppercase tracking-wide">বৈশিষ্ট্যসমূহ (কমা দিয়ে আলাদা করুন)</label>
                  <input
                    type="text"
                    placeholder="যেমন: আনলিমিটেড ডাটা, ফ্রি রাউটার সংযোগ, ২৪/৭ কাস্টমার সাপোর্ট"
                    value={newWifiFeatures}
                    onChange={(e) => setNewWifiFeatures(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                {/* Popular Toggle */}
                <div className="md:col-span-3 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="newWifiIsPopular"
                    checked={newWifiIsPopular}
                    onChange={(e) => setNewWifiIsPopular(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <label htmlFor="newWifiIsPopular" className="cursor-pointer select-none font-bold text-slate-600">জনপ্রিয় ওয়াইফাই অফার হিসেবে চিহ্নিত করুন (স্টার কার্ড ব্যাকগ্রাউন্ড পাবে)</label>
                </div>

                <div className="md:col-span-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন ওয়াইফাই সংযোগ যোগ করুন</span>
                  </button>
                </div>

              </form>

              {/* Active Wifi packages list */}
              <div className="space-y-3">
                <div className="border-b border-slate-150 pb-1.5">
                  <h4 className="text-sm font-extrabold text-slate-700">সক্রিয় ওয়াইফাই প্যাকেজসমূহ ({wifiPacks.length})</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wifiPacks.map((pack) => (
                    <div 
                      key={pack.id}
                      className="p-4 bg-white border border-slate-150 rounded-xl flex justify-between items-center text-xs shadow-sm hover:shadow-md transition-all font-semibold"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{pack.name}</span>
                          {pack.popular && (
                            <span className="px-1.5 py-0.5 bg-amber-500 text-white text-xs font-black uppercase rounded">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 font-semibold mt-1">স্পিড: {pack.speed} | মূল্য: {pack.price}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {pack.features.slice(0, 3).map((f, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">{f}</span>
                          ))}
                          {pack.features.length > 3 && <span className="text-xs text-slate-600 px-1 font-bold">+{pack.features.length - 3} more</span>}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`❌ আপনি কি নিশ্চিত যে "${pack.name}" ওয়াইফাই প্যাকেজটি ডিলিট করতে চান?`)) {
                            onDeleteWifiPack(pack.id);
                          }
                        }}
                        className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-slate-150 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>


            {/* Part 5: Custom Domain (fahiminternet.com) & Google Search Setup Guide */}
            <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-2xl border border-emerald-900/40 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-wide flex items-center gap-2">
                      <span>কাস্টম ডোমেইন কানেকশন গাইড (fahiminternet.com)</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm rounded-full font-bold">SEO Ready</span>
                    </h3>
                    <p className="text-sm text-slate-300 font-semibold mt-0.5">
                      গুগল সার্চে <strong className="text-emerald-400">fahiminternet.com</strong> লিখে সার্চ করলে সরাসরি এই ওয়েবসাইট আসবে।
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-sm text-emerald-400 font-black uppercase tracking-wider block">১. ডোমেইন রেজিস্টার (DNS) সেটিংস</span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    আপনার ডোমেইন প্রদানকারীর (যেমন Namecheap, GoDaddy, Cloudflare বা BD DNS) DNS Management এ গিয়ে নিচের রেকর্ডগুলো যোগ করুন:
                  </p>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-sm space-y-1 text-emerald-300">
                    <div>Type: <strong>A Record</strong> | Host: <strong>@</strong> | Points to Cloud Run IP</div>
                    <div>Type: <strong>CNAME</strong> | Host: <strong>www</strong> | Target: <strong>fahiminternet.com</strong></div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-sm text-emerald-400 font-black uppercase tracking-wider block">২. গুগল সার্চ কনসোল ও ইন্ডেক্সিং</span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    ওয়েবসাইটের হেডারে Schema.org structured data, JSON-LD এবং Open Graph মেটা ট্যাগ যুক্ত করা আছে। গুগল সার্চ কনসোলে ওয়েবসাইট জমা দিলে ২৪-৪৮ ঘণ্টার মধ্যে গুগল সার্চ রেজাল্টে <strong className="text-emerald-400">FAHIM INTERNET</strong> নামটি দেখাবে।
                  </p>
                </div>
              </div>
            </div>
            </div>
          </div>
        )}
      </main>

      {/* Web Mobile Browser Bottom Navigation Bar */}
      {isAdminMobileView && (
        <div className="sticky bottom-0 bg-slate-950 text-slate-600 border-t border-slate-800 p-2 flex items-center justify-around text-sm font-bold z-30 flex-shrink-0">
          <button
            onClick={() => setAdminTab('dashboard')}
            className={`flex flex-col items-center gap-1 p-1 cursor-pointer transition-colors ${adminTab === 'dashboard' ? 'text-emerald-400 font-black' : 'hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>ড্যাশবোর্ড</span>
          </button>

          <button
            onClick={() => setAdminTab('orders')}
            className={`flex flex-col items-center gap-1 p-1 cursor-pointer transition-colors relative ${adminTab === 'orders' ? 'text-emerald-400 font-black' : 'hover:text-white'}`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>অর্ডার ({orders.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('packages')}
            className={`flex flex-col items-center gap-1 p-1 cursor-pointer transition-colors ${adminTab === 'packages' ? 'text-emerald-400 font-black' : 'hover:text-white'}`}
          >
            <Package className="w-4 h-4" />
            <span>অফার</span>
          </button>

          <button
            onClick={() => setAdminTab('users')}
            className={`flex flex-col items-center gap-1 p-1 cursor-pointer transition-colors ${adminTab === 'users' ? 'text-emerald-400 font-black' : 'hover:text-white'}`}
          >
            <Users className="w-4 h-4" />
            <span>ইউজার</span>
          </button>

          <button
            onClick={() => setAdminTab('banners')}
            className={`flex flex-col items-center gap-1 p-1 cursor-pointer transition-colors ${adminTab === 'banners' ? 'text-emerald-400 font-black' : 'hover:text-white'}`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>নোটিশ</span>
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`flex flex-col items-center gap-1 p-1 cursor-pointer transition-colors ${adminTab === 'settings' ? 'text-emerald-400 font-black' : 'hover:text-white'}`}
          >
            <Settings className="w-4 h-4" />
            <span>সেটিংস</span>
          </button>
        </div>
      )}
      {/* Reject Reason Modal */}
      {rejectModalOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
              <h3 className="font-bold text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                অর্ডার বাতিল করুন
              </h3>
              <button
                onClick={() => setRejectModalOrder(null)}
                className="p-1 hover:bg-rose-200 rounded-full text-rose-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">বাতিলের কারণ / মেসেজ (গ্রাহক দেখতে পাবেন):</label>
                <textarea
                  value={rejectReasonText}
                  onChange={(e) => setRejectReasonText(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-rose-400 focus:outline-none text-sm text-slate-800 resize-none h-24"
                  placeholder="যেমন: অফারটি এই নম্বরে পাওয়া যাচ্ছে না..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setRejectModalOrder(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  ফিরে যান
                </button>
                <button
                  onClick={() => {
                    onUpdateOrderStatus(rejectModalOrder.id, 'cancelled', rejectReasonText);
                    setRejectModalOrder(null);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors cursor-pointer flex justify-center items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  বাতিল নিশ্চিত করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

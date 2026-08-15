export type AppTab = 'homepage' | 'store' | 'builder' | 'tracking' | 'admin' | 'privacy';

export type Operator = 'GP' | 'Robi' | 'Airtel' | 'Banglalink' | 'Teletalk';

export type PackCategory = 'family' | 'gift' | 'house' | 'regular' | 'minute' | 'minutes' | 'rise' | 'combo' | 'internet' | 'unlimited' | 'sms' | 'recharge';

export interface DataPack {
  id: string;
  title: string;
  category: PackCategory;
  operator: Operator;
  data: string; // e.g. "15 GB", "Unlimited", "0"
  minutes: number;
  sms: number;
  validity: string; // e.g. "7 Days", "30 Days", "Unlimited"
  regularPrice: number;
  salePrice: number;
  cashback: number;
  commission?: number;
  isHot?: boolean;
  isPopular?: boolean;
  description?: string;
  regionalDivision?: string; // Optional for house offers targeting specific regions
  targetPhone?: string;
  rechargeType?: 'flexiload' | 'prepaid' | 'postpaid';
}

export interface Order {
  id: string; // e.g. FI-XXXXXX
  customerPhone: string; // target number to activate
  operator: Operator;
  packId: string;
  packTitle: string;
  price: number;
  paymentMethod: string;
  paymentPhone: string; // sender bkash/nagad number
  transactionId: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  division: string;
  userId?: string;
  isRecharge?: boolean;
  rechargeType?: 'flexiload' | 'prepaid' | 'postpaid';
  apiResponseStatus?: string;
  apiTransactionId?: string;
  rejectReason?: string;
}

export interface WifiPackage {
  id: string;
  name: string;
  speed: string;
  price: string;
  features: string[];
  badge: string;
  popular?: boolean;
}

export interface PromoBanner {
  id: string;
  imageUrl: string;
  targetPackId: string;
  category?: PackCategory;
  isActive: boolean;
}

export interface SiteSettings {
  supportPhone: string;
  supportEmail: string;
  supportAddress: string;
  supportWebsite?: string;
  privacyPolicyUrl?: string;
  termsConditionsUrl?: string;
  appVersion?: string;
  developerName?: string;
  developerEmail?: string;
  disclaimerText?: string;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  upayNumber?: string;
  cellfinNumber?: string;
  binanceNumber?: string;
  bankingNumber?: string;
  ucbNumber?: string;
  marqueeText: string;
  bannerImages?: string[];
  topBannerImage?: string;
  offerBanners?: string[];
  promoBanners?: PromoBanner[];
  apkUrl?: string;
  tutorialVideoUrl?: string;
  adminNumber?: string;
  adminPassword?: string;
  brandName?: string;
  selectedDesignId?: string;
  logoUrl?: string;
  gpLogoUrl?: string;
  robiLogoUrl?: string;
  blLogoUrl?: string;
  airtelLogoUrl?: string;
  teletalkLogoUrl?: string;
  ziniRegisteredDomain?: string;
  zinipayApiKey?: string;
  zinipayDomain?: string;
  fcmServerKey?: string;
  fcmVapidKey?: string;
  bkashLogoUrl?: string;
  nagadLogoUrl?: string;
  rocketLogoUrl?: string;
  upayLogoUrl?: string;
  cellfinLogoUrl?: string;
  bankingLogoUrl?: string;
  rechargeEnabled?: boolean;
  rechargeNoticeText?: string;
  rechargeApiProvider?: string;
  rechargeApiUrl?: string;
  rechargeApiKey?: string;
  rechargeApiSecret?: string;
  rechargeApiUsername?: string;
  rechargeAutoTrigger?: boolean;
  quickServiceIcons?: Record<string, string>;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  phone: string;
  photoURL?: string;
  role: 'user' | 'admin';
  balance?: number;
  dataBalance?: number;
  createdAt: string;
}



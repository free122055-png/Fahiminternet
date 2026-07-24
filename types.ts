export type Operator = 'GP' | 'Robi' | 'Airtel' | 'Banglalink' | 'Teletalk';

export type PackCategory = 'internet' | 'unlimited' | 'family' | 'house' | 'minute' | 'sms';

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
  isHot?: boolean;
  isPopular?: boolean;
  description?: string;
  regionalDivision?: string; // Optional for house offers targeting specific regions
}

export interface Order {
  id: string; // e.g. FI-XXXXXX
  customerPhone: string; // target number to activate
  operator: Operator;
  packId: string;
  packTitle: string;
  price: number;
  paymentMethod: 'bkash' | 'nagad' | 'rocket';
  paymentPhone: string; // sender bkash/nagad number
  transactionId: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  division: string;
}

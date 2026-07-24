import { DataPack } from './types';

export const INITIAL_PACKS: DataPack[] = [
  // GP (Grameenphone) Offers
  {
    id: 'gp-internet-1',
    title: 'GP ধামাকা ৩০ জিবি ইন্টারনেট প্যাক',
    category: 'internet',
    operator: 'GP',
    data: '30 GB',
    minutes: 0,
    sms: 0,
    validity: '30 Days',
    regularPrice: 499,
    salePrice: 420,
    cashback: 25,
    isHot: true,
    description: 'গ্রামীনফোনের সুপারফাস্ট 4G ডাটা অফার। সকল গ্রাহকের জন্য প্রযোজ্য।'
  },
  {
    id: 'gp-house-1',
    title: 'GP হাউজ ধামাকা ৬০ জিবি + ১০০০ মিনিট',
    category: 'house',
    operator: 'GP',
    data: '60 GB',
    minutes: 1000,
    sms: 0,
    validity: '30 Days',
    regularPrice: 998,
    salePrice: 799,
    cashback: 80,
    isPopular: true,
    description: 'হাউজ স্পেশাল ক্যাশব্যাক রেট। ঢাকা ও চট্টগ্রাম বিভাগের জন্য ১০০% অ্যাক্টিভেশন গ্যারান্টি।'
  },
  {
    id: 'gp-unlimited-1',
    title: 'GP আনলিমিটেড লাইটওয়েট প্যাক',
    category: 'unlimited',
    operator: 'GP',
    data: 'Unlimited',
    minutes: 0,
    sms: 0,
    validity: '30 Days',
    regularPrice: 699,
    salePrice: 610,
    cashback: 40,
    description: 'সীমাহীন ব্যবহারের ডাটা প্যাক (FUP প্রযোজ্য)। কোনো দৈনিক লিমিট নেই!'
  },
  {
    id: 'gp-minute-1',
    title: 'GP মিনিট মাস্টার - ৮০০ মিনিট',
    category: 'minute',
    operator: 'GP',
    data: '0',
    minutes: 800,
    sms: 0,
    validity: '30 Days',
    regularPrice: 530,
    salePrice: 475,
    cashback: 30,
    description: 'যেকোনো লোকাল নম্বরে কথা বলুন দিনরাত ২৪ ঘণ্টা সেরা নেটওয়ার্কে।'
  },

  // Robi Offers
  {
    id: 'robi-family-1',
    title: 'Robi ফ্যামিলি প্যাক ৮০ জিবি + ১৫০০ মিনিট',
    category: 'family',
    operator: 'Robi',
    data: '80 GB',
    minutes: 1500,
    sms: 200,
    validity: '30 Days',
    regularPrice: 1199,
    salePrice: 950,
    cashback: 120,
    isHot: true,
    description: 'পরিবারের সর্বোচ্চ ৪ জন সদস্যের সাথে ব্যালেন্স শেয়ার করার বিশেষ সুযোগ।'
  },
  {
    id: 'robi-internet-1',
    title: 'Robi ২০ জিবি সুপার সেভার প্যাক',
    category: 'internet',
    operator: 'Robi',
    data: '20 GB',
    minutes: 0,
    sms: 0,
    validity: '7 Days',
    regularPrice: 289,
    salePrice: 235,
    cashback: 15,
    description: 'কম মেয়াদে সর্বোচ্চ গতির ইন্টারনেট ব্যবহারের জন্য সেরা অপশন।'
  },
  {
    id: 'robi-minute-1',
    title: 'Robi টকটাইম কিং - ৫০০ মিনিট',
    category: 'minute',
    operator: 'Robi',
    data: '0',
    minutes: 500,
    sms: 0,
    validity: '30 Days',
    regularPrice: 340,
    salePrice: 299,
    cashback: 20,
    isPopular: true,
    description: 'রবি নেটওয়ার্কে কম খরচে কথা বলার আকর্ষণীয় টকটাইম প্যাক।'
  },

  // Airtel Offers
  {
    id: 'airtel-house-1',
    title: 'Airtel স্পেশাল ৪5 জিবি + ৮০০ মিনিট',
    category: 'house',
    operator: 'Airtel',
    data: '45 GB',
    minutes: 800,
    sms: 0,
    validity: '30 Days',
    regularPrice: 799,
    salePrice: 620,
    cashback: 50,
    isHot: true,
    description: 'এয়ারটেল ডাবল ধামাকা অফার। ফ্রেন্ডস সার্কেলের জন্য সেরা।'
  },
  {
    id: 'airtel-internet-1',
    title: 'Airtel ৫০ জিবি সুপার স্টুডেন্ট প্যাক',
    category: 'internet',
    operator: 'Airtel',
    data: '50 GB',
    minutes: 0,
    sms: 100,
    validity: '30 Days',
    regularPrice: 649,
    salePrice: 535,
    cashback: 35,
    isPopular: true,
    description: 'সোশ্যাল মিডিয়া ও অনলাইন ক্লাস ব্রাউজিংয়ের জন্য বিশেষ ডাটা স্পিড।'
  },

  // Banglalink Offers
  {
    id: 'bl-internet-1',
    title: 'Banglalink ৪০ জিবি স্পিড প্যাক',
    category: 'internet',
    operator: 'Banglalink',
    data: '40 GB',
    minutes: 0,
    sms: 0,
    validity: '30 Days',
    regularPrice: 599,
    salePrice: 495,
    cashback: 40,
    isHot: true,
    description: 'বাংলালিংক অরেঞ্জ নেটওয়ার্কের দ্রুততম ইন্টারনেট প্যাক।'
  },
  {
    id: 'bl-minute-1',
    title: 'Banglalink ৬০০ মিনিট লেজেন্ড প্যাক',
    category: 'minute',
    operator: 'Banglalink',
    data: '0',
    minutes: 600,
    sms: 0,
    validity: '30 Days',
    regularPrice: 399,
    salePrice: 345,
    cashback: 25,
    description: 'টকটাইম প্রেমীদের জন্য বাংলালিংকের সেরা সাশ্রয়ী প্যাকেজ।'
  },

  // Teletalk Offers
  {
    id: 'teletalk-internet-1',
    title: 'Teletalk বর্ণমালা ৩০ জিবি স্বনির্ভর প্যাক',
    category: 'internet',
    operator: 'Teletalk',
    data: '30 GB',
    minutes: 200,
    sms: 100,
    validity: '30 Days',
    regularPrice: 399,
    salePrice: 320,
    cashback: 15,
    isPopular: true,
    description: 'সরকারি অপারেটর টেলিটকের বিশেষ সাশ্রয়ী স্টুডেন্ট ও চাকরিপ্রার্থী প্যাক।'
  },
  {
    id: 'teletalk-sms-1',
    title: 'Teletalk ১০০০ এসএমএস মেগা প্যাক',
    category: 'sms',
    operator: 'Teletalk',
    data: '0',
    minutes: 0,
    sms: 1000,
    validity: '30 Days',
    regularPrice: 99,
    salePrice: 75,
    cashback: 5,
    description: 'যেকোনো নাম্বারে দ্রুত ও কম খরচে খুদেবার্তা পাঠানোর মেগা ডিল।'
  }
];

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  arabicName: string;
  englishMeaning: string;
  bengaliMeaning: string;
  totalAyat: number;
  type: 'মাক্কী' | 'মাদানী';
  juzNumber: number;
}

export interface Qari {
  id: string;
  name: string;
  arabicName: string;
  country: string;
  image: string;
  isPopular?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  serverUrl: string;
  fallbackUrl?: string;
  bio: string;
}

// Complete 114 Surahs of Al-Quran with Bengali translations & Juz mapping
export const ALL_SURAHS: Surah[] = [
  { number: 1, name: 'আল-ফাতিহা', englishName: 'Al-Fatihah', arabicName: 'الفاتحة', englishMeaning: 'The Opening', bengaliMeaning: 'সূচনা', totalAyat: 7, type: 'মাক্কী', juzNumber: 1 },
  { number: 2, name: 'আল-বাকারা', englishName: 'Al-Baqarah', arabicName: 'البقرة', englishMeaning: 'The Cow', bengaliMeaning: 'গাভী', totalAyat: 286, type: 'মাদানী', juzNumber: 1 },
  { number: 3, name: 'আলে ইমরান', englishName: 'Ali Imran', arabicName: 'آل عمران', englishMeaning: 'Family of Imran', bengaliMeaning: 'ইমরানের পরিবার', totalAyat: 200, type: 'মাদানী', juzNumber: 3 },
  { number: 4, name: 'আন-নিসা', englishName: 'An-Nisa', arabicName: 'النساء', englishMeaning: 'The Women', bengaliMeaning: 'নারী', totalAyat: 176, type: 'মাদানী', juzNumber: 4 },
  { number: 5, name: 'আল-মায়িদাহ', englishName: 'Al-Maidah', arabicName: 'المائدة', englishMeaning: 'The Table Spread', bengaliMeaning: 'খাদ্যপূর্ণ থালা', totalAyat: 120, type: 'মাদানী', juzNumber: 6 },
  { number: 6, name: 'আল-আনআম', englishName: 'Al-Anam', arabicName: 'الأنعام', englishMeaning: 'The Cattle', bengaliMeaning: 'গৃহপালিত পশু', totalAyat: 165, type: 'মাক্কী', juzNumber: 7 },
  { number: 7, name: 'আল-আরাফ', englishName: 'Al-Araf', arabicName: 'الأعراف', englishMeaning: 'The Heights', bengaliMeaning: 'উঁচু স্থানসমূহ', totalAyat: 206, type: 'মাক্কী', juzNumber: 8 },
  { number: 8, name: 'আল-আনফাল', englishName: 'Al-Anfal', arabicName: 'الأنفال', englishMeaning: 'The Spoils of War', bengaliMeaning: 'যুদ্ধলব্ধ সম্পদ', totalAyat: 75, type: 'মাদানী', juzNumber: 9 },
  { number: 9, name: 'আত-তাওবাহ', englishName: 'At-Tawbah', arabicName: 'التوبة', englishMeaning: 'The Repentance', bengaliMeaning: 'অনুশোচনা', totalAyat: 129, type: 'মাদানী', juzNumber: 10 },
  { number: 10, name: 'ইউনুস', englishName: 'Yunus', arabicName: 'يونس', englishMeaning: 'Jonah', bengaliMeaning: 'ইউনুস (আঃ)', totalAyat: 109, type: 'মাক্কী', juzNumber: 11 },
  { number: 11, name: 'হুদ', englishName: 'Hud', arabicName: 'هود', englishMeaning: 'Hud', bengaliMeaning: 'হুদ (আঃ)', totalAyat: 123, type: 'মাক্কী', juzNumber: 11 },
  { number: 12, name: 'ইউসুফ', englishName: 'Yusuf', arabicName: 'يوسف', englishMeaning: 'Joseph', bengaliMeaning: 'ইউসুফ (আঃ)', totalAyat: 111, type: 'মাক্কী', juzNumber: 12 },
  { number: 13, name: 'আর-রাদ', englishName: 'Ar-Rad', arabicName: 'الرعد', englishMeaning: 'The Thunder', bengaliMeaning: 'বজ্রপাত', totalAyat: 43, type: 'মাদানী', juzNumber: 13 },
  { number: 14, name: 'ইব্রাহিম', englishName: 'Ibrahim', arabicName: 'إبراهيم', englishMeaning: 'Abraham', bengaliMeaning: 'ইব্রাহিম (আঃ)', totalAyat: 52, type: 'মাক্কী', juzNumber: 13 },
  { number: 15, name: 'আল-হিজর', englishName: 'Al-Hijr', arabicName: 'الحجر', englishMeaning: 'The Rocky Tract', bengaliMeaning: 'পাথুরে উপত্যকা', totalAyat: 99, type: 'মাক্কী', juzNumber: 14 },
  { number: 16, name: 'আন-নাহল', englishName: 'An-Nahl', arabicName: 'النحل', englishMeaning: 'The Bee', bengaliMeaning: 'মৌমাছি', totalAyat: 128, type: 'মাক্কী', juzNumber: 14 },
  { number: 17, name: 'আল-ইসরা', englishName: 'Al-Isra', arabicName: 'الإسراء', englishMeaning: 'The Night Journey', bengaliMeaning: 'রাত্রিকালীন ভ্রমণ', totalAyat: 111, type: 'মাক্কী', juzNumber: 15 },
  { number: 18, name: 'সূরা আল-কাহফ', englishName: 'Al-Kahf', arabicName: 'الكهف', englishMeaning: 'The Cave', bengaliMeaning: 'গুহা', totalAyat: 110, type: 'মাক্কী', juzNumber: 15 },
  { number: 19, name: 'মারইয়াম', englishName: 'Maryam', arabicName: 'مريم', englishMeaning: 'Mary', bengaliMeaning: 'মারইয়াম (আঃ)', totalAyat: 98, type: 'মাক্কী', juzNumber: 16 },
  { number: 20, name: 'ত্বা-হা', englishName: 'Ta-Ha', arabicName: 'طه', englishMeaning: 'Ta-Ha', bengaliMeaning: 'ত্বা-হা', totalAyat: 135, type: 'মাক্কী', juzNumber: 16 },
  { number: 21, name: 'আল-আম্বিয়া', englishName: 'Al-Anbiya', arabicName: 'الأنبياء', englishMeaning: 'The Prophets', bengaliMeaning: 'নবীগণ', totalAyat: 112, type: 'মাক্কী', juzNumber: 17 },
  { number: 22, name: 'আল-হজ্জ', englishName: 'Al-Hajj', arabicName: 'الحج', englishMeaning: 'The Pilgrimage', bengaliMeaning: 'হজ্ব', totalAyat: 78, type: 'মাদানী', juzNumber: 17 },
  { number: 23, name: 'আল-মুমিনুন', englishName: 'Al-Muminun', arabicName: 'المؤمنون', englishMeaning: 'The Believers', bengaliMeaning: 'বিশ্বাসীগণ', totalAyat: 118, type: 'মাক্কী', juzNumber: 18 },
  { number: 24, name: 'আন-নূর', englishName: 'An-Nur', arabicName: 'النور', englishMeaning: 'The Light', bengaliMeaning: 'জ্যোতি / আলো', totalAyat: 64, type: 'মাদানী', juzNumber: 18 },
  { number: 25, name: 'আল-ফুরকান', englishName: 'Al-Furqan', arabicName: 'الفرقان', englishMeaning: 'The Criterion', bengaliMeaning: 'সত্য-মিথ্যার পার্থক্যকারী', totalAyat: 77, type: 'মাক্কী', juzNumber: 18 },
  { number: 26, name: 'আশ-শুআরা', englishName: 'Ash-Shuara', arabicName: 'الشعراء', englishMeaning: 'The Poets', bengaliMeaning: 'কবিগণ', totalAyat: 227, type: 'মাক্কী', juzNumber: 19 },
  { number: 27, name: 'আন-নামল', englishName: 'An-Naml', arabicName: 'النمل', englishMeaning: 'The Ant', bengaliMeaning: 'পিঁপড়া', totalAyat: 93, type: 'মাক্কী', juzNumber: 19 },
  { number: 28, name: 'আল-কাসাস', englishName: 'Al-Qasas', arabicName: 'القصص', englishMeaning: 'The Stories', bengaliMeaning: 'কাহিনী', totalAyat: 88, type: 'মাক্কী', juzNumber: 20 },
  { number: 29, name: 'আল-আনকাবুত', englishName: 'Al-Ankabut', arabicName: 'العنكبوت', englishMeaning: 'The Spider', bengaliMeaning: 'মাকড়সা', totalAyat: 69, type: 'মাক্কী', juzNumber: 20 },
  { number: 30, name: 'আর-রূম', englishName: 'Ar-Rum', arabicName: 'الروم', englishMeaning: 'The Romans', bengaliMeaning: 'রোমান জাতি', totalAyat: 60, type: 'মাক্কী', juzNumber: 21 },
  { number: 31, name: 'লুকমান', englishName: 'Luqman', arabicName: 'لقمان', englishMeaning: 'Luqman', bengaliMeaning: 'লুকমান (আঃ)', totalAyat: 34, type: 'মাক্কী', juzNumber: 21 },
  { number: 32, name: 'আস-সাজদাহ', englishName: 'As-Sajdah', arabicName: 'السجدة', englishMeaning: 'The Prostration', bengaliMeaning: 'সিজদা', totalAyat: 30, type: 'মাক্কী', juzNumber: 21 },
  { number: 33, name: 'আল-আহযাব', englishName: 'Al-Ahzab', arabicName: 'الأحزاب', englishMeaning: 'The Combined Forces', bengaliMeaning: 'সম্মিলিত বাহিনী', totalAyat: 73, type: 'মাদানী', juzNumber: 21 },
  { number: 34, name: 'সাবা', englishName: 'Saba', arabicName: 'سبأ', englishMeaning: 'Sheba', bengaliMeaning: 'সাবা জাতি', totalAyat: 54, type: 'মাক্কী', juzNumber: 22 },
  { number: 35, name: 'ফাতির', englishName: 'Fatir', arabicName: 'فاطر', englishMeaning: 'Originator', bengaliMeaning: 'সৃষ্টিকর্তা', totalAyat: 45, type: 'মাক্কী', juzNumber: 22 },
  { number: 36, name: 'সূরা ইয়াসিন', englishName: 'Ya-Sin', arabicName: 'يس', englishMeaning: 'Ya-Sin', bengaliMeaning: 'ইয়াসীন (কুরআনের হৃৎপিণ্ড)', totalAyat: 83, type: 'মাক্কী', juzNumber: 22 },
  { number: 37, name: 'আস-সাফফাত', englishName: 'As-Saffat', arabicName: 'الصافات', englishMeaning: 'Those Ranged in Ranks', bengaliMeaning: 'সারিবদ্ধভাবে দাঁড়ানো', totalAyat: 182, type: 'মাক্কী', juzNumber: 23 },
  { number: 38, name: 'সোয়াদ', englishName: 'Sad', arabicName: 'ص', englishMeaning: 'The Letter Sad', bengaliMeaning: 'সোয়াদ', totalAyat: 88, type: 'মাক্কী', juzNumber: 23 },
  { number: 39, name: 'আজ-জুমার', englishName: 'Az-Zumar', arabicName: 'الزمر', englishMeaning: 'The Troops', bengaliMeaning: 'দলসমূহ', totalAyat: 75, type: 'মাক্কী', juzNumber: 23 },
  { number: 40, name: 'গাফির', englishName: 'Ghafir', arabicName: 'غافر', englishMeaning: 'The Forgiver', bengaliMeaning: 'ক্ষমাকারী', totalAyat: 85, type: 'মাক্কী', juzNumber: 24 },
  { number: 41, name: 'ফুসসিলাত', englishName: 'Fussilat', arabicName: 'فصلت', englishMeaning: 'Explained in Detail', bengaliMeaning: 'সুস্পষ্ট বিবরণ', totalAyat: 54, type: 'মাক্কী', juzNumber: 24 },
  { number: 42, name: 'আশ-শূরা', englishName: 'Ash-Shura', arabicName: 'الشورى', englishMeaning: 'The Consultation', bengaliMeaning: 'পরামর্শ', totalAyat: 53, type: 'মাক্কী', juzNumber: 25 },
  { number: 43, name: 'আজ-জুখরূফ', englishName: 'Az-Zukhruf', arabicName: 'الزخرف', englishMeaning: 'The Ornaments of Gold', bengaliMeaning: 'স্বর্ণালংকার', totalAyat: 89, type: 'মাক্কী', juzNumber: 25 },
  { number: 44, name: 'আদ-দুখান', englishName: 'Ad-Dukhan', arabicName: 'الدخان', englishMeaning: 'The Smoke', bengaliMeaning: 'ধোঁয়া', totalAyat: 59, type: 'মাক্কী', juzNumber: 25 },
  { number: 45, name: 'আল-জাসিয়াহ', englishName: 'Al-Jathiyah', arabicName: 'الجاثية', englishMeaning: 'The Crouching', bengaliMeaning: 'নতজানু', totalAyat: 37, type: 'মাক্কী', juzNumber: 25 },
  { number: 46, name: 'আল-আহকাফ', englishName: 'Al-Ahqaf', arabicName: 'الأحقاف', englishMeaning: 'The Wind-Curved Sandhills', bengaliMeaning: 'বালির পাহাড়সমূহ', totalAyat: 35, type: 'মাক্কী', juzNumber: 26 },
  { number: 47, name: 'মুহাম্মদ', englishName: 'Muhammad', arabicName: 'محمد', englishMeaning: 'Muhammad', bengaliMeaning: 'মুহাম্মদ (সাঃ)', totalAyat: 38, type: 'মাদানী', juzNumber: 26 },
  { number: 48, name: 'আল-ফাতহ', englishName: 'Al-Fath', arabicName: 'الفتح', englishMeaning: 'The Victory', bengaliMeaning: 'বিজয়', totalAyat: 29, type: 'মাদানী', juzNumber: 26 },
  { number: 49, name: 'আল-হুজুরাত', englishName: 'Al-Hujurat', arabicName: 'الحجرات', englishMeaning: 'The Rooms', bengaliMeaning: 'বাসগৃহসমূহ', totalAyat: 18, type: 'মাদানী', juzNumber: 26 },
  { number: 50, name: 'ক্বাফ', englishName: 'Qaf', arabicName: 'ق', englishMeaning: 'The Letter Qaf', bengaliMeaning: 'ক্বাফ', totalAyat: 45, type: 'মাক্কী', juzNumber: 26 },
  { number: 51, name: 'আজ-যারিয়াত', englishName: 'Adh-Dhariyat', arabicName: 'الذاريات', englishMeaning: 'The Winnowing Winds', bengaliMeaning: 'বিক্ষেপকারী বাতাস', totalAyat: 60, type: 'মাক্কী', juzNumber: 26 },
  { number: 52, name: 'আত-তূর', englishName: 'At-Tur', arabicName: 'الطور', englishMeaning: 'The Mount', bengaliMeaning: 'তূর পর্বত', totalAyat: 49, type: 'মাক্কী', juzNumber: 27 },
  { number: 53, name: 'আন-নাজম', englishName: 'An-Najm', arabicName: 'النجم', englishMeaning: 'The Star', bengaliMeaning: 'নক্ষত্র', totalAyat: 62, type: 'মাক্কী', juzNumber: 27 },
  { number: 54, name: 'আল-ক্বামার', englishName: 'Al-Qamar', arabicName: 'القمر', englishMeaning: 'The Moon', bengaliMeaning: 'চাঁদ', totalAyat: 55, type: 'মাক্কী', juzNumber: 27 },
  { number: 55, name: 'সূরা আর-রহমান', englishName: 'Ar-Rahman', arabicName: 'الرحمن', englishMeaning: 'The Beneficent', bengaliMeaning: 'পরম দয়ালু', totalAyat: 78, type: 'মাদানী', juzNumber: 27 },
  { number: 56, name: 'আল-ওয়াক্বিয়া', englishName: 'Al-Waqiah', arabicName: 'الواقعة', englishMeaning: 'The Inevitable', bengaliMeaning: 'নিশ্চিত ঘটনা (কিয়ামত)', totalAyat: 96, type: 'মাক্কী', juzNumber: 27 },
  { number: 57, name: 'আল-হাদীদ', englishName: 'Al-Hadid', arabicName: 'الحديد', englishMeaning: 'The Iron', bengaliMeaning: 'লোহা', totalAyat: 29, type: 'মাদানী', juzNumber: 27 },
  { number: 58, name: 'আল-মুজাদালাহ', englishName: 'Al-Mujadila', arabicName: 'المجادلة', englishMeaning: 'The Pleading Woman', bengaliMeaning: 'বাদানুবাদকারিণী', totalAyat: 22, type: 'মাদানী', juzNumber: 28 },
  { number: 59, name: 'আল-হাশর', englishName: 'Al-Hashr', arabicName: 'الحشر', englishMeaning: 'The Exile', bengaliMeaning: 'সমাবেশ', totalAyat: 24, type: 'মাদানী', juzNumber: 28 },
  { number: 60, name: 'আল-মুমতাহিনাহ', englishName: 'Al-Mumtahanah', arabicName: 'الممتحنة', englishMeaning: 'She That Is to Be Examined', bengaliMeaning: 'পরীক্ষিতা নারী', totalAyat: 13, type: 'মাদানী', juzNumber: 28 },
  { number: 61, name: 'আস-সাফ', englishName: 'As-Saff', arabicName: 'الصف', englishMeaning: 'The Ranks', bengaliMeaning: 'সারিবদ্ধ সৈন্য', totalAyat: 14, type: 'মাদানী', juzNumber: 28 },
  { number: 62, name: 'আল-জুমুআহ', englishName: 'Al-Jumuah', arabicName: 'الجمعة', englishMeaning: 'The Congregation', bengaliMeaning: 'শুক্রবার / সম্মেলন', totalAyat: 11, type: 'মাদানী', juzNumber: 28 },
  { number: 63, name: 'আল-মুনাফিকুন', englishName: 'Al-Munafiqun', arabicName: 'المنافقون', englishMeaning: 'The Hypocrites', bengaliMeaning: 'কপট বিশ্বাসীগণ', totalAyat: 11, type: 'মাদানী', juzNumber: 28 },
  { number: 64, name: 'আত-তাগাবুন', englishName: 'At-Taghabun', arabicName: 'التغابن', englishMeaning: 'The Mutual Disillusion', bengaliMeaning: 'লাভ-ক্ষতি', totalAyat: 18, type: 'মাদানী', juzNumber: 28 },
  { number: 65, name: 'আত-ত্বালাক্ব', englishName: 'At-Talaq', arabicName: 'الطلاق', englishMeaning: 'The Divorce', bengaliMeaning: 'তালাক', totalAyat: 12, type: 'মাদানী', juzNumber: 28 },
  { number: 66, name: 'আত-তাহরীম', englishName: 'At-Tahrim', arabicName: 'التحريم', englishMeaning: 'The Prohibition', bengaliMeaning: 'নিষিদ্ধকরণ', totalAyat: 12, type: 'মাদানী', juzNumber: 28 },
  { number: 67, name: 'সূরা আল-মুলক', englishName: 'Al-Mulk', arabicName: 'الملك', englishMeaning: 'The Sovereignty', bengaliMeaning: 'সার্বভৌম কর্তৃত্ব', totalAyat: 30, type: 'মাক্কী', juzNumber: 29 },
  { number: 68, name: 'আল-ক্বলম', englishName: 'Al-Qalam', arabicName: 'القلم', englishMeaning: 'The Pen', bengaliMeaning: 'কলম', totalAyat: 52, type: 'মাক্কী', juzNumber: 29 },
  { number: 69, name: 'আল-হাক্কাহ', englishName: 'Al-Haqqah', arabicName: 'الحاقة', englishMeaning: 'The Reality', bengaliMeaning: 'অনিবার্য সত্য', totalAyat: 52, type: 'মাক্কী', juzNumber: 29 },
  { number: 70, name: 'আল-মাআরিজ', englishName: 'Al-Maarij', arabicName: 'المعارج', englishMeaning: 'The Ascending Stairways', bengaliMeaning: 'উন্নয়নের সোপান', totalAyat: 44, type: 'মাক্কী', juzNumber: 29 },
  { number: 71, name: 'নূহ', englishName: 'Nuh', arabicName: 'نوح', englishMeaning: 'Noah', bengaliMeaning: 'নূহ (আঃ)', totalAyat: 28, type: 'মাক্কী', juzNumber: 29 },
  { number: 72, name: 'আল-জিন', englishName: 'Al-Jinn', arabicName: 'الجن', englishMeaning: 'The Jinn', bengaliMeaning: 'জিন জাতি', totalAyat: 28, type: 'মাক্কী', juzNumber: 29 },
  { number: 73, name: 'আল-মুযযাম্মিল', englishName: 'Al-Muzzammil', arabicName: 'المزمل', englishMeaning: 'The Enshrouded One', bengaliMeaning: 'বস্ত্রাচ্ছাদিত', totalAyat: 20, type: 'মাক্কী', juzNumber: 29 },
  { number: 74, name: 'আল-মুদ্দাসসির', englishName: 'Al-Muddaththir', arabicName: 'المدثر', englishMeaning: 'The Cloaked One', bengaliMeaning: 'চাদরাবৃত', totalAyat: 56, type: 'মাক্কী', juzNumber: 29 },
  { number: 75, name: 'আল-ক্বিয়ামাহ', englishName: 'Al-Qiyamah', arabicName: 'القيامة', englishMeaning: 'The Resurrection', bengaliMeaning: 'পুনরুত্থান দিবস', totalAyat: 40, type: 'মাক্কী', juzNumber: 29 },
  { number: 76, name: 'আল-ইনসান', englishName: 'Al-Insan', arabicName: 'الإنسان', englishMeaning: 'The Man', bengaliMeaning: 'মানবজাতি', totalAyat: 31, type: 'মাদানী', juzNumber: 29 },
  { number: 77, name: 'আল-মুরসালাত', englishName: 'Al-Mursalat', arabicName: 'المرسلات', englishMeaning: 'The Emissaries', bengaliMeaning: 'প্রেরিত বাতাসসমূহ', totalAyat: 50, type: 'মাক্কী', juzNumber: 29 },
  { number: 78, name: 'আন-নাবা', englishName: 'An-Naba', arabicName: 'النبأ', englishMeaning: 'The Tidings', bengaliMeaning: 'মহা সংবাদ', totalAyat: 40, type: 'মাক্কী', juzNumber: 30 },
  { number: 79, name: 'আন-নাযিআত', englishName: 'An-Naziat', arabicName: 'النازعات', englishMeaning: 'Those Who Drag Forth', bengaliMeaning: 'উৎপাটনকারী ফেরেশতা', totalAyat: 46, type: 'মাক্কী', juzNumber: 30 },
  { number: 80, name: 'আবাসা', englishName: 'Abasa', arabicName: 'عبس', englishMeaning: 'He Frowned', bengaliMeaning: 'ভ্রূকুটি করল', totalAyat: 42, type: 'মাক্কী', juzNumber: 30 },
  { number: 81, name: 'আত-তাকভীর', englishName: 'At-Takwir', arabicName: 'التكوير', englishMeaning: 'The Overthrowing', bengaliMeaning: 'অন্ধকারাচ্ছন্নকরণ', totalAyat: 29, type: 'মাক্কী', juzNumber: 30 },
  { number: 82, name: 'আল-ইনফিতার', englishName: 'Al-Infitar', arabicName: 'الانفطار', englishMeaning: 'The Cleaving', bengaliMeaning: 'বিদীর্ণ হওয়া', totalAyat: 19, type: 'মাক্কী', juzNumber: 30 },
  { number: 83, name: 'আল-মুতাফফিফীন', englishName: 'Al-Mutaffifin', arabicName: 'المطففين', englishMeaning: 'The Defrauding', bengaliMeaning: 'প্রতারণাকারীগণ', totalAyat: 36, type: 'মাক্কী', juzNumber: 30 },
  { number: 84, name: 'আল-ইনশিকাক', englishName: 'Al-Inshiqaq', arabicName: 'الانشقاق', englishMeaning: 'The Splitting Open', bengaliMeaning: 'খণ্ড-বিখণ্ড হওয়া', totalAyat: 25, type: 'মাক্কী', juzNumber: 30 },
  { number: 85, name: 'আল-বুরুজ', englishName: 'Al-Buruj', arabicName: 'البروج', englishMeaning: 'The Mansions of the Stars', bengaliMeaning: 'নক্ষত্রপুঞ্জ', totalAyat: 22, type: 'মাক্কী', juzNumber: 30 },
  { number: 86, name: 'আত-তারিক্ব', englishName: 'At-Tariq', arabicName: 'الطارق', englishMeaning: 'The Morning Star', bengaliMeaning: 'নৈশ আগমনকারী', totalAyat: 17, type: 'মাক্কী', juzNumber: 30 },
  { number: 87, name: 'আল-আলা', englishName: 'Al-Ala', arabicName: 'الأعلى', englishMeaning: 'The Most High', bengaliMeaning: 'সর্বোচ্চ', totalAyat: 19, type: 'মাক্কী', juzNumber: 30 },
  { number: 88, name: 'আল-গাশিয়াহ', englishName: 'Al-Ghashiyah', arabicName: 'الغاشية', englishMeaning: 'The Overwhelming', bengaliMeaning: 'আচ্ছন্নকারী বিপর্যয়', totalAyat: 26, type: 'মাক্কী', juzNumber: 30 },
  { number: 89, name: 'আল-ফজর', englishName: 'Al-Fajr', arabicName: 'الفجر', englishMeaning: 'The Dawn', bengaliMeaning: 'ভোরবেলা', totalAyat: 30, type: 'মাক্কী', juzNumber: 30 },
  { number: 90, name: 'আল-বালাদ', englishName: 'Al-Balad', arabicName: 'البلد', englishMeaning: 'The City', bengaliMeaning: 'নগরী', totalAyat: 20, type: 'মাক্কী', juzNumber: 30 },
  { number: 91, name: 'আশ-শামস', englishName: 'Ash-Shams', arabicName: 'الشمس', englishMeaning: 'The Sun', bengaliMeaning: 'সূর্য', totalAyat: 15, type: 'মাক্কী', juzNumber: 30 },
  { number: 92, name: 'আল-লাইল', englishName: 'Al-Layl', arabicName: 'الليل', englishMeaning: 'The Night', bengaliMeaning: 'রাত', totalAyat: 21, type: 'মাক্কী', juzNumber: 30 },
  { number: 93, name: 'আদ-দুহা', englishName: 'Ad-Duha', arabicName: 'الضحى', englishMeaning: 'The Morning Hours', bengaliMeaning: 'পূর্বাহ্ণ', totalAyat: 11, type: 'মাক্কী', juzNumber: 30 },
  { number: 94, name: 'আশ-শারহ', englishName: 'Ash-Sharh', arabicName: 'الشرح', englishMeaning: 'The Relief', bengaliMeaning: 'বক্ষ প্রশস্তকরণ', totalAyat: 8, type: 'মাক্কী', juzNumber: 30 },
  { number: 95, name: 'আত-তীন', englishName: 'At-Tin', arabicName: 'التين', englishMeaning: 'The Fig', bengaliMeaning: 'ডুমুর / আঞ্জির', totalAyat: 8, type: 'মাক্কী', juzNumber: 30 },
  { number: 96, name: 'আল-আলাক্ব', englishName: 'Al-Alaq', arabicName: 'العلق', englishMeaning: 'The Clot', bengaliMeaning: 'রক্তপিণ্ড', totalAyat: 19, type: 'মাক্কী', juzNumber: 30 },
  { number: 97, name: 'আল-ক্বদর', englishName: 'Al-Qadr', arabicName: 'القدر', englishMeaning: 'The Power', bengaliMeaning: 'মহিমান্বিত রাত', totalAyat: 5, type: 'মাক্কী', juzNumber: 30 },
  { number: 98, name: 'আল-বায়্যিনাহ', englishName: 'Al-Bayyinah', arabicName: 'البينة', englishMeaning: 'The Clear Proof', bengaliMeaning: 'সুস্পষ্ট প্রমাণ', totalAyat: 8, type: 'মাদানী', juzNumber: 30 },
  { number: 99, name: 'আজ-যিলযাল', englishName: 'Az-Zalzalah', arabicName: 'الزلزلة', englishMeaning: 'The Earthquake', bengaliMeaning: 'ভূমিকম্প', totalAyat: 8, type: 'মাদানী', juzNumber: 30 },
  { number: 100, name: 'আল-আদিয়াত', englishName: 'Al-Adiyat', arabicName: 'العاديات', englishMeaning: 'The Courser', bengaliMeaning: 'অভিযানকারী অশ্ব', totalAyat: 11, type: 'মাক্কী', juzNumber: 30 },
  { number: 101, name: 'আল-ক্বারিয়াহ', englishName: 'Al-Qariah', arabicName: 'القارعة', englishMeaning: 'The Calamity', bengaliMeaning: 'মহা বিপর্যয়', totalAyat: 11, type: 'মাক্কী', juzNumber: 30 },
  { number: 102, name: 'আত-তাকাসুর', englishName: 'At-Takathur', arabicName: 'التكاثر', englishMeaning: 'The Rivalry in World Increase', bengaliMeaning: 'প্রাচুর্যের প্রতিযোগিতা', totalAyat: 8, type: 'মাক্কী', juzNumber: 30 },
  { number: 103, name: 'আল-আসর', englishName: 'Al-Asr', arabicName: 'العصر', englishMeaning: 'The Declining Day', bengaliMeaning: 'সময় / কাল', totalAyat: 3, type: 'মাক্কী', juzNumber: 30 },
  { number: 104, name: 'আল-হুমাযাহ', englishName: 'Al-Humazah', arabicName: 'الهمزة', englishMeaning: 'The Traducer', bengaliMeaning: 'পরনিন্দাকারী', totalAyat: 9, type: 'মাক্কী', juzNumber: 30 },
  { number: 105, name: 'আল-ফীল', englishName: 'Al-Fil', arabicName: 'الفيل', englishMeaning: 'The Elephant', bengaliMeaning: 'হাতি', totalAyat: 5, type: 'মাক্কী', juzNumber: 30 },
  { number: 106, name: 'কুরাইশ', englishName: 'Quraysh', arabicName: 'قريش', englishMeaning: 'Quraysh', bengaliMeaning: 'কুরাইশ বংশ', totalAyat: 4, type: 'মাক্কী', juzNumber: 30 },
  { number: 107, name: 'আল-মাউন', englishName: 'Al-Maun', arabicName: 'الماعون', englishMeaning: 'The Small Kindnesses', bengaliMeaning: 'গৃহস্থালি প্রয়োজনীয় জিনিস', totalAyat: 7, type: 'মাক্কী', juzNumber: 30 },
  { number: 108, name: 'আল-কাউসার', englishName: 'Al-Kawthar', arabicName: 'الكوثر', englishMeaning: 'The Abundance', bengaliMeaning: 'প্রাচুর্য / কাউসার', totalAyat: 3, type: 'মাক্কী', juzNumber: 30 },
  { number: 109, name: 'আল-কাফিরুন', englishName: 'Al-Kafirun', arabicName: 'الكافرون', englishMeaning: 'The Disbelievers', bengaliMeaning: 'অবিশ্বাসীগণ', totalAyat: 6, type: 'মাক্কী', juzNumber: 30 },
  { number: 110, name: 'আন-নাসর', englishName: 'An-Nasr', arabicName: 'النصر', englishMeaning: 'The Divine Support', bengaliMeaning: 'সাহায্য / বিজয়', totalAyat: 3, type: 'মাদানী', juzNumber: 30 },
  { number: 111, name: 'আল-লাহাব', englishName: 'Al-Masad', arabicName: 'المسد', englishMeaning: 'The Palm Fiber', bengaliMeaning: 'জ্বলন্ত অঙ্গার', totalAyat: 5, type: 'মাক্কী', juzNumber: 30 },
  { number: 112, name: 'আল-ইখলাস', englishName: 'Al-Ikhlas', arabicName: 'الإخلاص', englishMeaning: 'The Sincerity', bengaliMeaning: 'একত্ববাদ', totalAyat: 4, type: 'মাক্কী', juzNumber: 30 },
  { number: 113, name: 'আল-ফালাক', englishName: 'Al-Falaq', arabicName: 'الفلق', englishMeaning: 'The Daybreak', bengaliMeaning: 'নিশিভোর', totalAyat: 5, type: 'মাক্কী', juzNumber: 30 },
  { number: 114, name: 'আন-নাস', englishName: 'An-Nas', arabicName: 'الناس', englishMeaning: 'Mankind', bengaliMeaning: 'মানবজাতি', totalAyat: 6, type: 'মাক্কী', juzNumber: 30 }
];

// Verified high-speed Reciters list with verified 100% active Audio Servers
export const ALL_QARIS: Qari[] = [
  {
    id: 'saud_al_jumah',
    name: 'শায়খ সাউদ আল-জুমাহ',
    arabicName: 'سعود الجمعة',
    country: 'সৌদি আরব',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    isPopular: true,
    isFeatured: true,
    serverUrl: 'https://server7.mp3quran.net/shur',
    fallbackUrl: 'https://server8.mp3quran.net/afs',
    bio: 'হৃদয়স্পর্শী, সুললিত ও গভীর আবেশময় তিলাওয়াত।'
  },
  {
    id: 'abdul_rahman_sudais',
    name: 'শায়খ আব্দুর রহমান আস-সুদাইস',
    arabicName: 'عبد الرحمن السديس',
    country: 'সৌদি আরব',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    isPopular: true,
    serverUrl: 'https://server11.mp3quran.net/sds',
    fallbackUrl: 'https://server8.mp3quran.net/afs',
    bio: 'মসজিদুল হারামের প্রধান খতিব ও সুললিত ক্বারী।'
  },
  {
    id: 'mishary_rashid',
    name: 'শায়খ মিশার রশিদ',
    arabicName: 'مشاري راشد العفاسي',
    country: 'কুয়েত',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    isPopular: true,
    serverUrl: 'https://server8.mp3quran.net/afs',
    fallbackUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy',
    bio: 'বিশ্ববিখ্যাত ক্বারী ও ইমাম।'
  },
  {
    id: 'abdul_basit',
    name: 'শায়খ আব্দুল বাসিত',
    arabicName: 'عبد الباسط عبد الصمد',
    country: 'মিশর',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    isPopular: true,
    serverUrl: 'https://server7.mp3quran.net/basit',
    fallbackUrl: 'https://server8.mp3quran.net/afs',
    bio: 'বিশ্বের শ্রেষ্ঠ ও অনন্য তাজবীদ বিশারদ।'
  },
  {
    id: 'maher_muaiqly',
    name: 'শায়খ মাহের আল-মুয়াইকলি',
    arabicName: 'ماهر المعيقلي',
    country: 'সৌদি আরব',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    isPopular: true,
    serverUrl: 'https://server12.mp3quran.net/maher',
    fallbackUrl: 'https://server8.mp3quran.net/afs',
    bio: 'মসজিদুল হারামের প্রখ্যাত ইমাম।'
  },
  {
    id: 'yasser_dosari',
    name: 'শায়খ ইয়াসির আদ-দোসারি',
    arabicName: 'ياسر الدوسري',
    country: 'সৌদি আরব',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    isNew: true,
    serverUrl: 'https://server11.mp3quran.net/yasser',
    fallbackUrl: 'https://server8.mp3quran.net/afs',
    bio: 'মসজিদুল হারামের সুললিত ও তেজোদৃপ্ত কণ্ঠের ইমাম।'
  },
  {
    id: 'abdul_rashid_sufi',
    name: 'আব্দুল রশীদ আলী সুফি',
    arabicName: 'عبد الرشيد صوفي',
    country: 'সুদান',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    isNew: true,
    serverUrl: 'https://server16.mp3quran.net/soufi/Rewayat-Hafs-A-n-Assem',
    fallbackUrl: 'https://server8.mp3quran.net/afs',
    bio: 'কিরাত বিশেষজ্ঞ ও বিশিষ্ট ক্বারী।'
  },
  {
    id: 'fares_abbad',
    name: 'ফারেস আব্বাদ',
    arabicName: 'فارس عباد',
    country: 'কুয়েত',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    isNew: true,
    serverUrl: 'https://server8.mp3quran.net/frs_a',
    fallbackUrl: 'https://server8.mp3quran.net/afs',
    bio: 'অত্যন্ত শান্ত ও গভীর ভাবগাম্ভীর্যপূর্ণ কণ্ঠ।'
  },
  {
    id: 'saad_ghamdi',
    name: 'শায়খ সাদ আল-গামদি',
    arabicName: 'سعد الغامدي',
    country: 'সৌদি আরব',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    isPopular: true,
    serverUrl: 'https://server7.mp3quran.net/s_gmd',
    fallbackUrl: 'https://server8.mp3quran.net/afs',
    bio: 'বিশ্বের অন্যতম জনপ্রিয় ও সুমধুর তিলাওয়াতকারী।'
  },
  {
    id: 'ahmad_ajmy',
    name: 'আহমেদ আল-আজমী',
    arabicName: 'أحمد بن علي العجمي',
    country: 'সৌদি আরব',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    serverUrl: 'https://server10.mp3quran.net/ajm',
    fallbackUrl: 'https://server8.mp3quran.net/afs',
    bio: 'অসাধারণ আবেগ ও সুরেলা কণ্ঠের তিলাওয়াত।'
  },
  {
    id: 'minshawi',
    name: 'মুহাম্মদ সিদ্দিক আল-মিনশাবি',
    arabicName: 'محمد صديق المنشاوي',
    country: 'মিশর',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    serverUrl: 'https://server10.mp3quran.net/minsh',
    fallbackUrl: 'https://server8.mp3quran.net/afs',
    bio: 'মিশরের স্বর্ণযুগের অবিস্মরণীয় ক্বারী।'
  }
];

// Helper to generate reliable audio URL with 3-digit padding
export const getSurahAudioUrl = (qari: Qari, surahNumber: number): string => {
  const padNumber = String(surahNumber).padStart(3, '0');
  const base = qari.serverUrl.replace(/\/+$/, '');
  return `${base}/${padNumber}.mp3`;
};

// Fallback generator if a specific server is temporarily unreachable
export const getFallbackAudioUrl = (qari: Qari, surahNumber: number): string => {
  const padNumber = String(surahNumber).padStart(3, '0');
  if (qari.fallbackUrl) {
    const base = qari.fallbackUrl.replace(/\/+$/, '');
    if (base.includes('islamic.network')) {
      return `${base}/${surahNumber}.mp3`;
    }
    return `${base}/${padNumber}.mp3`;
  }
  // Universal backup: Mishary Rashid Alafasy from server8
  return `https://server8.mp3quran.net/afs/${padNumber}.mp3`;
};


import React from 'react';
import { DataPack, SiteSettings } from '../types';
import { Wifi, Phone, Clock, Mail, ShoppingCart, Percent, Flame, Sparkles, Check, Heart } from 'lucide-react';
import { GPLogo, RobiLogo, BanglalinkLogo, AirtelLogo, TeletalkLogo } from './OperatorLogos';

interface PackCardProps {
  pack: DataPack;
  onSelect: (pack: DataPack) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  settings?: SiteSettings;
}

export default function PackCard({ pack, onSelect, isFavorite = false, onToggleFavorite, settings }: PackCardProps) {
  const { id, title, operator, data, minutes, sms, validity, regularPrice, salePrice, cashback, isHot, isPopular } = pack;

  // Calculate discount percentage
  const discountPercent = regularPrice > salePrice 
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;

  // Replicate the exact colorful palettes from the screenshot
  const getThemeConfig = () => {
    const val = (validity || '').toLowerCase();
    
    // 1. Blue Theme for Daily
    if (val.includes('1 day') || val.includes('daily') || val.includes('১ দিন') || val.includes('১দিন') || val.includes('1day')) {
      return {
        bg: 'bg-white',
        border: 'border-slate-200 group-hover:border-slate-300',
        textPrice: 'text-[#0072f5]',
        btnBg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/40 hover:shadow-blue-500/60',
        badgeBg: 'bg-[#0072f5] text-white',
        badgeText: 'Daily',
        glow: 'group-hover:shadow-blue-200/40'
      };
    }
    // 2. Green Theme for 7 Days / Weekly
    if (val.includes('7') || val.includes('৭') || val.includes('weekly') || val.includes('সপ্তাহ')) {
      return {
        bg: 'bg-white',
        border: 'border-slate-200 group-hover:border-slate-300',
        textPrice: 'text-slate-900',
        btnBg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/40 hover:shadow-emerald-500/60',
        badgeBg: 'bg-slate-900 text-white',
        badgeText: '7 Days',
        glow: 'group-hover:shadow-emerald-200/40'
      };
    }
    // 3. Purple Theme for 15 Days
    if (val.includes('15') || val.includes('১৫')) {
      return {
        bg: 'bg-white',
        border: 'border-slate-200 group-hover:border-slate-300',
        textPrice: 'text-[#7c3aed]',
        btnBg: 'bg-violet-600 hover:bg-violet-700 shadow-violet-500/40 hover:shadow-violet-500/60',
        badgeBg: 'bg-[#7c3aed] text-white',
        badgeText: '15 Days',
        glow: 'group-hover:shadow-purple-200/40'
      };
    }
    
    // For 30 days or other, we cycle based on title character sum to distribute Orange, Pink, Teal nicely
    const charSum = (title || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const key = charSum % 3;
    
    if (key === 0) {
      // 4. Orange Theme
      return {
        bg: 'bg-[#fffbeb]',
        border: 'border-amber-200/80 group-hover:border-amber-400',
        textPrice: 'text-[#ea580c]',
        btnBg: 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/40 hover:shadow-orange-500/60',
        badgeBg: 'bg-[#ea580c] text-white',
        badgeText: '30 Days',
        glow: 'group-hover:shadow-amber-200/40'
      };
    } else if (key === 1) {
      // 5. Pink/Magenta Theme
      return {
        bg: 'bg-[#fdf2f8]',
        border: 'border-pink-200/80 group-hover:border-pink-400',
        textPrice: 'text-[#db2777]',
        btnBg: 'bg-pink-600 hover:bg-pink-700 shadow-pink-500/40 hover:shadow-pink-500/60',
        badgeBg: 'bg-[#db2777] text-white',
        badgeText: '30 Days',
        glow: 'group-hover:shadow-pink-200/40'
      };
    } else {
      // 6. Teal Theme
      return {
        bg: 'bg-[#f0fdfa]',
        border: 'border-teal-200/80 group-hover:border-teal-400',
        textPrice: 'text-[#0d9488]',
        btnBg: 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/40 hover:shadow-teal-500/60',
        badgeBg: 'bg-[#0d9488] text-white',
        badgeText: '30 Days',
        glow: 'group-hover:shadow-teal-200/40'
      };
    }
  };

  const theme = getThemeConfig();

  const isMinuteOnly = pack.category === 'minute' || pack.category === 'minutes' || !data || data === '0' || data === '0 MB' || data === '0 GB';

  // Extract amount string to look like "1 GB", "40 GB", "110 মিনিট"
  const displayAmount = isMinuteOnly 
    ? `${minutes} মিনিট` 
    : (minutes > 0 ? `${data} + ${minutes} Min` : data);

  return (
    <div 
      className={`group relative rounded-[28px] p-6 border flex flex-col justify-between text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${theme.bg} ${theme.border} ${theme.glow} shadow-sm`}
    >
      {/* Top badges bar */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2.5">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-wide uppercase shadow-sm ${theme.badgeBg}`}>
            {theme.badgeText}
          </span>
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(id);
              }}
              className={`p-2 rounded-full border transition-all duration-300 cursor-pointer active:scale-90 ${
                isFavorite 
                  ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-sm' 
                  : 'bg-white/80 hover:bg-white border-slate-200 text-slate-400 hover:text-rose-500'
              }`}
              title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              id={`toggle-fav-btn-${id}`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current animate-pulse' : ''}`} />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/60">
            {operator === 'GP' && <GPLogo size={18} className="flex-shrink-0" logoUrl={settings?.gpLogoUrl} />}
            {operator === 'Robi' && <RobiLogo size={18} className="flex-shrink-0" logoUrl={settings?.robiLogoUrl} />}
            {operator === 'Banglalink' && <BanglalinkLogo size={18} className="flex-shrink-0" logoUrl={settings?.blLogoUrl} />}
            {operator === 'Airtel' && <AirtelLogo size={18} className="flex-shrink-0" logoUrl={settings?.airtelLogoUrl} />}
            {operator === 'Teletalk' && <TeletalkLogo size={18} className="flex-shrink-0" logoUrl={settings?.teletalkLogoUrl} />}
            <span>{operator}</span>
          </span>
        </div>
      </div>

      {/* Main package highlight */}
      <div className="space-y-1.5 my-3">
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">
          {displayAmount}
        </h3>
        <p className="text-[11px] text-slate-500 font-black tracking-wide uppercase">
          Valid for {validity}
        </p>
      </div>

      {/* Specs list with icons replicating the screenshot format */}
      <div className="space-y-3.5 my-6 text-left text-xs font-black text-slate-600 border-t border-b border-dashed border-slate-200/80 py-5 px-1">
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
            {isMinuteOnly ? <Phone className="w-4 h-4 stroke-[2.5]" /> : <Wifi className="w-4 h-4 stroke-[2.5]" />}
          </div>
          <span className="tracking-tight">
            {isMinuteOnly 
              ? `টকটাইম: ${minutes} মিনিট (অল নেটওয়ার্ক)` 
              : `ইন্টারনেট: ${data} ${minutes > 0 ? `| ${minutes} মিনিট` : ''}`
            }
          </span>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
            <Clock className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="tracking-tight">মেয়াদ: {validity}</span>
        </div>
        {sms > 0 && (
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
              <Mail className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="tracking-tight">{sms} টি ফ্রি এসএমএস</span>
          </div>
        )}
        
        {/* Title details to identify specific promo */}
        <p className="text-[10px] text-slate-400 leading-normal font-bold border-t border-slate-100 pt-3.5 mt-2 line-clamp-2 italic">
          {title}
        </p>
      </div>

      {/* Price row */}
      <div className="text-center mb-5 space-y-2.5">
        <span className={`text-3xl font-black font-sans tracking-tighter block ${theme.textPrice}`}>
          ৳{salePrice}
        </span>
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-700 bg-emerald-50/50 border border-emerald-100 px-3 py-1 rounded-full">
            <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
            সক্রিয় অফার
          </span>
          {cashback > 0 && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full animate-pulse shadow-sm">
              <Sparkles className="w-3 h-3 text-rose-500 fill-rose-500" /> ৳{cashback} ক্যাশব্যাক!
            </span>
          )}
        </div>
      </div>

      {/* Buy Now button with Check/Tick Icon */}
      <button
        onClick={() => onSelect(pack)}
        className={`w-full py-3.5 rounded-2xl font-black text-xs text-white tracking-[0.15em] flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-95 cursor-pointer uppercase ${theme.btnBg} border-none ring-offset-2 focus:ring-2`}
      >
        <ShoppingCart className="w-4 h-4" />
        <span>Buy Now</span>
      </button>

      {/* Hot/Popular absolute ribbons overlay */}
      {(isHot || isPopular) && (
        <div className="absolute -top-1.5 -right-1.5 flex items-center gap-1 z-10">
          {isHot && (
            <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
              <Flame className="w-2.5 h-2.5 fill-white" /> HOT
            </span>
          )}
          {isPopular && (
            <span className="bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> POPULAR
            </span>
          )}
        </div>
      )}
    </div>
  );
}

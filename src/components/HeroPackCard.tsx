import React from 'react';
import { DataPack, SiteSettings } from '../types';
import { ChevronRight, Sparkles } from 'lucide-react';
import { GPLogo, RobiLogo, BanglalinkLogo, AirtelLogo, TeletalkLogo } from './OperatorLogos';

interface HeroPackCardProps {
  pack: any; // Using the special hero pack structure from App.tsx
  onSelect: (pack: DataPack) => void;
  settings?: SiteSettings;
}

export default function HeroPackCard({ pack, onSelect, settings }: HeroPackCardProps) {
  const { title, data, price, validity, btnColor, accentText, badge, themeColor, packData } = pack;

  const renderOperatorLogo = () => {
    switch (packData.operator) {
      case 'GP': return <GPLogo size={38} logoUrl={settings?.gpLogoUrl} />;
      case 'Robi': return <RobiLogo size={38} logoUrl={settings?.robiLogoUrl} />;
      case 'Banglalink': return <BanglalinkLogo size={38} logoUrl={settings?.blLogoUrl} />;
      case 'Airtel': return <AirtelLogo size={38} logoUrl={settings?.airtelLogoUrl} />;
      case 'Teletalk': return <TeletalkLogo size={38} logoUrl={settings?.teletalkLogoUrl} />;
      default: return null;
    }
  };

  const getThemeStyles = () => {
    switch (themeColor) {
      case 'emerald': return 'bg-emerald-50 border-emerald-100 text-emerald-700';
      case 'blue': return 'bg-blue-50 border-blue-100 text-blue-700';
      case 'purple': return 'bg-purple-50 border-purple-100 text-purple-700';
      case 'amber': return 'bg-amber-50 border-amber-100 text-amber-700';
      case 'rose': return 'bg-rose-50 border-rose-100 text-rose-700';
      default: return 'bg-slate-50 border-slate-100 text-slate-700';
    }
  };

  return (
    <div 
      onClick={() => onSelect(packData)}
      className="flex-shrink-0 w-[145px] sm:w-[165px] bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-pointer group flex flex-col items-center p-4 text-center space-y-3"
    >
      <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center p-1 shadow-sm group-hover:scale-110 transition-all duration-300">
        {renderOperatorLogo()}
      </div>

      <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getThemeStyles()}`}>
        {badge}
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{data}</h3>
        <div className="flex items-center justify-center gap-1">
          <span className="text-lg font-black text-emerald-600 font-sans">৳{price}</span>
        </div>
      </div>

      <div className="w-full pt-2 border-t border-slate-100">
        <p className="text-[10px] font-bold text-slate-400">{validity}</p>
      </div>

      <button className={`w-full py-2 rounded-xl text-[10px] font-black text-white transition-all ${btnColor} shadow-sm group-hover:scale-105 active:scale-95`}>
        কিনুন
      </button>
    </div>
  );
}

import React from 'react';
import { DataPack, SiteSettings } from '../types';
import { ChevronRight, Flame } from 'lucide-react';
import { GPLogo, RobiLogo, BanglalinkLogo, AirtelLogo, TeletalkLogo } from './OperatorLogos';

interface PopularPackCardProps {
  pack: DataPack;
  onSelect: (pack: DataPack) => void;
  settings?: SiteSettings;
}

export default function PopularPackCard({ pack, onSelect, settings }: PopularPackCardProps) {
  const { operator, data, minutes, validity, salePrice, isHot } = pack;

  const isMinuteOnly = pack.category === 'minute' || pack.category === 'minutes' || !data || data === '0' || data === '0 MB' || data === '0 GB';

  const displayAmount = isMinuteOnly 
    ? `${minutes} মিনিট` 
    : (minutes > 0 && data && data !== '0' && data !== '0 MB' ? `${data} + ${minutes} Min` : data);

  // Format validity
  const displayValidity = validity.toLowerCase().includes('30 days') || validity.includes('30 দিন')
    ? '৩০ দিন'
    : validity.toLowerCase().includes('7 days') || validity.includes('৭ দিন')
    ? '৭ দিন'
    : validity.toLowerCase().includes('1 day') || validity.includes('১ দিন')
    ? '১ দিন'
    : validity;

  // Render operator logo
  const renderOperatorLogo = () => {
    switch (operator) {
      case 'GP':
        return <GPLogo size={36} logoUrl={settings?.gpLogoUrl} />;
      case 'Robi':
        return <RobiLogo size={36} logoUrl={settings?.robiLogoUrl} />;
      case 'Banglalink':
        return <BanglalinkLogo size={36} logoUrl={settings?.blLogoUrl} />;
      case 'Airtel':
        return <AirtelLogo size={36} logoUrl={settings?.airtelLogoUrl} />;
      case 'Teletalk':
        return <TeletalkLogo size={36} logoUrl={settings?.teletalkLogoUrl} />;
      default:
        return null;
    }
  };

  const getSubLabel = () => {
    if (pack.description) return pack.description;
    if (minutes > 0 && data && data !== '0' && data !== '') {
      return 'ইন্টারনেট + মিনিট';
    } else if (minutes > 0) {
      return 'মিনিট অফার';
    } else {
      return 'ইন্টারনেট অফার';
    }
  };

  return (
    <div 
      onClick={() => onSelect(pack)}
      className="bg-white border border-slate-200/60 rounded-[28px] p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group relative overflow-hidden w-[290px] sm:w-[320px] shrink-0"
    >
      {/* Absolute Badge for HOT */}
      {isHot && (
        <div className="absolute top-0 right-0">
          <span className="bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[8px] font-black px-2.5 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
            <Flame className="w-2.5 h-2.5 fill-white" /> HOT
          </span>
        </div>
      )}

      {/* Left Column: Operator Logo & Text */}
      <div className="flex flex-col items-center justify-center border-r border-slate-100 pr-4 min-w-[75px] shrink-0 gap-1.5">
        <div className="w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          {renderOperatorLogo()}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{operator}</span>
      </div>

      {/* Middle Column: Pack Details */}
      <div className="flex-1 min-w-0 space-y-1 text-left">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-base font-black text-slate-900 tracking-tight">{displayAmount}</span>
          <span className="bg-slate-100 text-slate-600 border border-slate-200/60 px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0">
            {displayValidity}
          </span>
        </div>
        <p className="text-[11px] font-medium text-slate-500 leading-tight truncate">
          {getSubLabel()}
        </p>
      </div>

      {/* Right Column: Price and Arrow */}
      <div className="flex items-center gap-2 shrink-0 pl-1">
        <span className="text-base sm:text-lg font-black text-slate-900 font-sans tracking-tight">
          ৳{salePrice}
        </span>
        <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200/60 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-200 shadow-2xs">
          <ChevronRight className="w-4 h-4 transition-colors" />
        </div>
      </div>
    </div>
  );
}

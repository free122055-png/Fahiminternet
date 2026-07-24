import React from 'react';
import { DataPack } from '../types';
import { Wifi, Phone, Mail, Clock, ShoppingCart, Percent, Gift, Sparkles, Flame } from 'lucide-react';

interface PackCardProps {
  pack: DataPack;
  onSelect: (pack: DataPack) => void;
}

export default function PackCard({ pack, onSelect }: PackCardProps) {
  const { title, operator, data, minutes, sms, validity, regularPrice, salePrice, cashback, isHot, isPopular, description } = pack;

  // Calculate discount percentage
  const discountPercent = Math.round(((regularPrice - salePrice) / regularPrice) * 100);

  // Operator Specific Themes & Logo Accents
  const getOperatorConfig = (op: typeof operator) => {
    switch (op) {
      case 'GP':
        return {
          bg: 'bg-gradient-to-br from-white to-blue-50/20 hover:border-blue-300',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          accentColor: 'text-blue-600',
          btnBg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10',
          dot: 'bg-blue-500'
        };
      case 'Robi':
        return {
          bg: 'bg-gradient-to-br from-white to-red-50/20 hover:border-red-300',
          badge: 'bg-red-100 text-red-800 border-red-200',
          accentColor: 'text-red-600',
          btnBg: 'bg-red-600 hover:bg-red-700 shadow-red-500/10',
          dot: 'bg-red-500'
        };
      case 'Airtel':
        return {
          bg: 'bg-gradient-to-br from-white to-rose-50/20 hover:border-rose-300',
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
          accentColor: 'text-rose-600',
          btnBg: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/10',
          dot: 'bg-rose-500'
        };
      case 'Banglalink':
        return {
          bg: 'bg-gradient-to-br from-white to-orange-50/20 hover:border-orange-300',
          badge: 'bg-orange-100 text-orange-800 border-orange-200',
          accentColor: 'text-orange-600',
          btnBg: 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/10',
          dot: 'bg-orange-500'
        };
      case 'Teletalk':
        return {
          bg: 'bg-gradient-to-br from-white to-emerald-50/20 hover:border-emerald-300',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          accentColor: 'text-emerald-600',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10',
          dot: 'bg-emerald-500'
        };
      default:
        return {
          bg: 'bg-white hover:border-slate-300',
          badge: 'bg-slate-100 text-slate-800 border-slate-200',
          accentColor: 'text-slate-600',
          btnBg: 'bg-slate-800 hover:bg-slate-900',
          dot: 'bg-slate-500'
        };
    }
  };

  const opConf = getOperatorConfig(operator);

  return (
    <div 
      className={`relative group bg-white border border-slate-100 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between ${opConf.bg}`}
    >
      {/* Top Banner Tags */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-1.5">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${opConf.badge}`}>
            {operator}
          </span>
          {isHot && (
            <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-600 fill-amber-500 animate-pulse" />
              HOT 🔥
            </span>
          )}
          {isPopular && (
            <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 px-2 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              POPULAR
            </span>
          )}
        </div>
        
        {discountPercent > 0 && (
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-xl border border-emerald-200 text-[10px] font-black">
            <Percent className="w-3 h-3" />
            <span>{discountPercent}% ছাড়</span>
          </div>
        )}
      </div>

      {/* Package Header Content */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Feature Specs Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-dashed border-slate-100">
          {/* Data spec */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50 ${opConf.accentColor}`}>
              <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold leading-none">ডাটা প্যাক</span>
              <span className="text-[11px] mt-0.5 block">{data !== '0' ? data : 'নাই'}</span>
            </div>
          </div>

          {/* Talktime spec */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50 ${opConf.accentColor}`}>
              <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold leading-none">মিনিট টকটাইম</span>
              <span className="text-[11px] mt-0.5 block">{minutes > 0 ? `${minutes} মিনিট` : 'নাই'}</span>
            </div>
          </div>

          {/* Validity spec */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50 ${opConf.accentColor}`}>
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold leading-none">মেয়াদকাল</span>
              <span className="text-[11px] mt-0.5 block">{validity}</span>
            </div>
          </div>

          {/* SMS spec */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50 ${opConf.accentColor}`}>
              <Mail className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold leading-none">খুদেবার্তা</span>
              <span className="text-[11px] mt-0.5 block">{sms > 0 ? `${sms} SMS` : 'নাই'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing and Action row */}
      <div className="mt-5 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Dynamic Pricing displays */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-emerald-600 font-mono">৳{salePrice}</span>
            {regularPrice > salePrice && (
              <span className="text-xs text-slate-400 font-extrabold line-through font-mono">
                ৳{regularPrice}
              </span>
            )}
          </div>
          
          {cashback > 0 && (
            <div className="inline-flex items-center gap-1.5 mt-1 text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
              <Gift className="w-3 h-3 fill-amber-100" />
              <span>৳{cashback} ক্যাশব্যাক!</span>
            </div>
          )}
        </div>

        {/* CTA Buy Button */}
        <button
          onClick={() => onSelect(pack)}
          className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-black text-white flex items-center justify-center gap-2 tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer ${opConf.btnBg}`}
        >
          <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>অর্ডার করুন</span>
        </button>
      </div>
    </div>
  );
}

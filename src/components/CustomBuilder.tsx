import React, { useState } from 'react';
import { DataPack, Operator, SiteSettings } from '../types';
import { Sliders, CheckCircle2, RefreshCw, Sparkles, Smartphone, Gift, BadgeAlert, Layers } from 'lucide-react';
import { GPLogo, RobiLogo, BanglalinkLogo, AirtelLogo, TeletalkLogo } from './OperatorLogos';

interface CustomBuilderProps {
  onOrderCustomPack: (pack: DataPack) => void;
  settings?: SiteSettings;
}

export default function CustomBuilder({ onOrderCustomPack, settings }: CustomBuilderProps) {
  // Config state
  const [operator, setOperator] = useState<Operator>('GP');
  const [validity, setValidity] = useState<'3' | '7' | '30'>('30');
  const [data, setData] = useState<number>(15); // GB
  const [minutes, setMinutes] = useState<number>(300); // Minutes
  const [sms, setSms] = useState<number>(50); // SMS
  const [division, setDivision] = useState<string>('Dhaka');

  // Dynamic division pricing offsets (adds realistic regional flavor)
  const getDivisionOffset = (div: string) => {
    switch (div) {
      case 'Dhaka': return 0.95; // 5% discount for central division
      case 'Chittagong': return 0.98;
      case 'Sylhet': return 1.02; // slight remote fee
      default: return 1.0;
    }
  };

  // Base Calculation Logic
  const basePrice = 15;
  const pricePerGB = 9;
  const pricePerMinute = 0.65;
  const pricePerSMS = 0.12;

  const rawPrice = basePrice + 
                   (data * pricePerGB) + 
                   (minutes * pricePerMinute) + 
                   (sms * pricePerSMS);

  // Validity modifier
  const validityMultiplier = validity === '30' ? 1.15 : validity === '7' ? 1.05 : 1.0;
  
  // Custom discount multiplier
  const regionalMultiplier = getDivisionOffset(division);

  const calculatedRegularPrice = Math.round(rawPrice * validityMultiplier * regionalMultiplier);
  const calculatedSalePrice = Math.round(calculatedRegularPrice * 0.85); // 15% discount
  const estimatedSavings = calculatedRegularPrice - calculatedSalePrice;
  const calculatedCashback = Math.max(Math.round(calculatedSalePrice * 0.05), 5); // 5% cashback

  const handleOrderCustom = () => {
    const customPack: DataPack = {
      id: `custom-${Date.now()}`,
      title: `কাস্টম স্পেশাল - ${data > 0 ? `${data} GB ` : ''}${minutes > 0 ? `+ ${minutes} Min ` : ''}(${validity} Days)`,
      category: 'house',
      operator,
      data: data > 0 ? `${data} GB` : '0',
      minutes,
      sms,
      validity: `${validity} Days`,
      regularPrice: calculatedRegularPrice,
      salePrice: calculatedSalePrice,
      cashback: calculatedCashback,
      isHot: true,
      description: `ব্যবহারকারীর কাস্টম তৈরি স্পেশাল প্যাক। বিভাগ: ${division}।`,
      regionalDivision: division
    };

    onOrderCustomPack(customPack);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
      {/* Header Panel */}
      <div className="bg-slate-900 px-6 py-8 text-white relative">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Sliders className="w-24 h-24 stroke-[1.5]" />
        </div>
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-emerald-400 fill-emerald-500" />
            <span>টেলিকম কাস্টম প্যাক বিল্ডার (Offer Customizer)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">আপনার নিজের প্যাক নিজেই তৈরি করুন!</h2>
          <p className="text-slate-400 text-xs leading-relaxed font-semibold">
            আপনার যতটুকু প্রয়োজন ঠিক ততটুকু ডাটা, মিনিট এবং এসএমএস সিলেক্ট করুন। আমরা দেব সর্বোচ্চ ছাড় এবং লাইভ আকর্ষণীয় ক্যাশব্যাক বোনাস!
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8">
        
        {/* Left Side: Parameters sliders */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Operator choice */}
          <div className="space-y-2.5">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">অপারেটর নির্বাচন করুন</label>
            <div className="grid grid-cols-5 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
              {(['GP', 'Robi', 'Airtel', 'Banglalink', 'Teletalk'] as const).map((op) => {
                const isSelected = operator === op;
                const opColor = 
                  op === 'GP' ? 'hover:bg-blue-50 border-blue-200 text-blue-600' :
                  op === 'Robi' ? 'hover:bg-red-50 border-red-200 text-red-600' :
                  op === 'Airtel' ? 'hover:bg-rose-50 border-rose-200 text-rose-600' :
                  op === 'Banglalink' ? 'hover:bg-orange-50 border-orange-200 text-orange-600' :
                  'hover:bg-slate-50 border-emerald-200 text-slate-900';

                return (
                  <button
                    key={op}
                    onClick={() => setOperator(op)}
                    className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 rounded-xl text-xs font-black border uppercase tracking-wider transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                        : `bg-white border-transparent text-slate-500 ${opColor}`
                    }`}
                  >
                    {op === 'GP' && <GPLogo size={24} className="flex-shrink-0" logoUrl={settings?.gpLogoUrl} />}
                    {op === 'Robi' && <RobiLogo size={24} className="flex-shrink-0" logoUrl={settings?.robiLogoUrl} />}
                    {op === 'Banglalink' && <BanglalinkLogo size={24} className="flex-shrink-0" logoUrl={settings?.blLogoUrl} />}
                    {op === 'Airtel' && <AirtelLogo size={24} className="flex-shrink-0" logoUrl={settings?.airtelLogoUrl} />}
                    {op === 'Teletalk' && <TeletalkLogo size={24} className="flex-shrink-0" logoUrl={settings?.teletalkLogoUrl} />}
                    <span className="text-[10px]">{op}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Validity & Division options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Validity */}
            <div className="space-y-2.5">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">প্যাকের মেয়াদকাল</label>
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                {[
                  { id: '3', label: '৩ দিন' },
                  { id: '7', label: '৭ দিন' },
                  { id: '30', label: '৩০ দিন' }
                ].map((val) => (
                  <button
                    key={val.id}
                    onClick={() => setValidity(val.id as any)}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      validity === val.id
                        ? 'bg-white text-slate-900 shadow-sm font-black border border-slate-200'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Region / Division */}
            <div className="space-y-2.5">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">আপনার বিভাগ (Regional Division)</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'].map((div) => (
                  <option key={div} value={div}>
                    {div === 'Dhaka' ? 'ঢাকা (Dhaka)' :
                     div === 'Chittagong' ? 'চট্টগ্রাম (Chittagong)' :
                     div === 'Sylhet' ? 'সিলেট (Sylhet)' :
                     div === 'Rajshahi' ? 'রাজশাহী (Rajshahi)' :
                     div === 'Khulna' ? 'খুলনা (Khulna)' :
                     div === 'Barisal' ? 'বরিশাল (Barisal)' :
                     div === 'Rangpur' ? 'রংপুর (Rangpur)' : 'ময়মনসিংহ (Mymensingh)'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Internet Data Slider */}
          <div className="space-y-3 bg-slate-50/50 border border-slate-150 p-4 rounded-xl">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-500 uppercase tracking-wide">১. ইন্টারনেট ডাটা (Data)</span>
              <span className="text-slate-900 font-black text-sm">{data} GB</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={data}
              onChange={(e) => setData(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[0, 10, 20, 30, 50, 80].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setData(preset)}
                  className={`px-2.5 py-1 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                    data === preset 
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {preset === 0 ? 'Data ছাড়া' : `${preset} GB`}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Minutes Slider */}
          <div className="space-y-3 bg-slate-50/50 border border-slate-150 p-4 rounded-xl">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-500 uppercase tracking-wide">২. মিনিট টকটাইম (Minutes)</span>
              <span className="text-slate-900 font-black text-sm">{minutes} Min</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[0, 100, 300, 500, 800, 1000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setMinutes(preset)}
                  className={`px-2.5 py-1 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                    minutes === preset 
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {preset === 0 ? 'Min ছাড়া' : `${preset} Min`}
                </button>
              ))}
            </div>
          </div>

          {/* 5. SMS Slider */}
          <div className="space-y-3 bg-slate-50/50 border border-slate-150 p-4 rounded-xl">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-500 uppercase tracking-wide">৩. এসএমএস (SMS)</span>
              <span className="text-slate-900 font-black text-sm">{sms} SMS</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="500"
              step="25"
              value={sms}
              onChange={(e) => setSms(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[0, 50, 100, 200, 300, 500].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setSms(preset)}
                  className={`px-2.5 py-1 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                    sms === preset 
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {preset === 0 ? 'SMS ছাড়া' : `${preset} SMS`}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Calculated Dynamic Price and Details */}
        <div className="lg:col-span-5 bg-slate-50 p-6 rounded-xl border border-slate-200/60 flex flex-col justify-between">
          
          {/* Spec Summary Card */}
          <div className="space-y-5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-2">
              আপনার নির্বাচিত অফার বিবরণী
            </h3>

            {/* Specs overview */}
            <div className="space-y-3 font-semibold text-xs text-slate-700">
              <div className="flex justify-between">
                <span>অপারেটর:</span>
                <span className="font-extrabold text-slate-900 uppercase font-mono">{operator} Mobile</span>
              </div>
              <div className="flex justify-between">
                <span>ইন্টারনেট ডাটা:</span>
                <span className="font-extrabold text-slate-900">{data > 0 ? `${data} GB` : 'নাই'}</span>
              </div>
              <div className="flex justify-between">
                <span>মিনিট টকটাইম:</span>
                <span className="font-extrabold text-slate-900">{minutes > 0 ? `${minutes} মিনিট` : 'নাই'}</span>
              </div>
              <div className="flex justify-between">
                <span>মেয়াদকাল:</span>
                <span className="font-extrabold text-slate-900">{validity} দিন</span>
              </div>
              <div className="flex justify-between">
                <span>খুদেবার্তা (SMS):</span>
                <span className="font-extrabold text-slate-900">{sms > 0 ? `${sms} SMS` : 'নাই'}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3">
                <span>টার্গেট বিভাগ:</span>
                <span className="font-extrabold text-slate-900">{division} Division</span>
              </div>
            </div>

            {/* Estimated Active timeline */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/60 text-[10px] font-bold text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>আনুমানিক অ্যাক্টিভেশন টাইম: ২-১০ মিনিট।</span>
            </div>
          </div>

          {/* Price Calculation and Action button */}
          <div className="mt-8 space-y-4">
            
            {/* Saving / Cashback indicator */}
            <div className="space-y-1 bg-slate-50 border border-emerald-150 p-3.5 rounded-xl">
              <div className="flex justify-between text-xs font-extrabold text-emerald-800">
                <span className="flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 fill-emerald-100" /> কাস্টম ছাড় (15% Off):
                </span>
                <span>- ৳{estimatedSavings}</span>
              </div>
              <div className="flex justify-between text-xs font-extrabold text-amber-700">
                <span>ক্যাশব্যাক বোনাস (5%):</span>
                <span>+ ৳{calculatedCashback}</span>
              </div>
            </div>

            {/* Total Pricing display */}
            <div className="flex items-end justify-between border-t border-slate-200 pt-4">
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">মোট মূল্য</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900 font-mono">৳{calculatedSalePrice}</span>
                  {calculatedRegularPrice > calculatedSalePrice && (
                    <span className="text-xs text-slate-400 font-bold line-through font-mono">
                      ৳{calculatedRegularPrice}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-extrabold text-slate-400">
                VAT সহ সম্পূর্ণ ফ্রি রিচার্জ
              </span>
            </div>

            {/* CTA Order Button */}
            <button
              onClick={handleOrderCustom}
              disabled={data === 0 && minutes === 0 && sms === 0}
              className={`w-full py-4 text-xs font-black text-white rounded-xl uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-none ${
                data === 0 && minutes === 0 && sms === 0
                  ? 'bg-slate-300 shadow-none cursor-not-allowed opacity-50'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50'
              }`}
            >
              <span>কাস্টম অফারটি সাবমিট করুন</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

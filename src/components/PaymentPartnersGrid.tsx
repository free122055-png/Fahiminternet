import React from 'react';
import { ShieldCheck, Sparkles, Zap, Lock, RefreshCw } from 'lucide-react';
import { SiteSettings } from "../types";
import { BKashLogo, NagadLogo, RocketLogo, UpayLogo, CellfinLogo, BankingLogo } from './BrandLogos';

interface Props {
  settings: SiteSettings;
}

export default function PaymentPartnersGrid({ settings }: Props) {
  return (
    <div id="payment-gateways-grid-section" className="w-full py-10 bg-[#050B14] rounded-xl border border-slate-800 shadow-sm p-6 md:p-10 space-y-8 text-center">
      {/* Grid Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] md:text-xs font-black uppercase tracking-wider">
          🛡️ 100% Secure Payment System
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-none pt-2">
          সরাসরি <span className="text-[#0EA5E9] font-black">ZiniPay</span> গেটওয়ে সিস্টেম
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-xl mx-auto">
          আমাদের ওয়েবসাইটে আলাদা কোনো ম্যানুয়াল পেমেন্ট পদ্ধতি নেই। সরাসরি জিনিপে (ZiniPay) সিস্টেমের মাধ্যমে আপনি সম্পূর্ণ নিরাপদে ও অটোমেটিকভাবে পেমেন্ট করতে পারবেন।
        </p>
      </div>

      {/* Unified ZiniPay Premium Showcase Card */}
      <div className="max-w-3xl mx-auto bg-slate-950/40 border border-slate-800 rounded-xl p-6 md:p-8 shadow-md relative overflow-hidden group text-left">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Presentation Section */}
          <div className="space-y-4 max-w-md text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              {/* ZiniPay Logo representation */}
              <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-xl shadow-sm ">
                ZP
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-black text-white leading-tight tracking-tight">
                  ZiniPay Gateway
                </h4>
                <span className="text-[10px] bg-sky-500/20 text-sky-600 px-2 py-0.5 rounded-full font-black tracking-wider uppercase border border-sky-500/30">
                  Auto-Verification Active
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              জিনিপে (ZiniPay) গেটওয়ের মাধ্যমে পেমেন্ট করার সাথে সাথেই আমাদের গেটওয়ে সিস্টেম স্বয়ংক্রিয়ভাবে লেনদেন যাচাই করে এবং অর্ডারটি সাথে সাথে এডমিন প্যানেলে এপ্রুভ হয়ে যায়। কোনো রকম ম্যানুয়াল স্ক্রিনশট বা TxID সাবমিট করার ঝামেলা নেই।
            </p>

            {/* Bullet benefits */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] md:text-xs text-slate-500 font-bold">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> ১০০% সুরক্ষিত গেটওয়ে</span>
              <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-emerald-400" /> ইনস্ট্যান্ট অটোমেটিক এপ্রুভ</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-400" /> ৩-১০ মিনিটে অফার ডেলিভারি</span>
              <span className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-emerald-400" /> ট্রানজেকশন ট্র্যাকিং সুবিধা</span>
            </div>
          </div>

          {/* Supported Methods inside ZiniPay */}
          <div className="w-full md:w-auto bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col items-center justify-center gap-4 text-center md:min-w-[280px]">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-500" /> Supported via ZiniPay
            </span>

            {/* bKash, Nagad, Rocket, Upay, Cellfin, Bank original logos grid */}
            <div className="flex flex-wrap justify-center gap-2 w-full max-w-[200px] mx-auto">
              {/* bKash badge */}
              {settings.bkashNumber && (
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-1 h-11 w-14 flex items-center justify-center shadow-sm hover:scale-105 transition-transform duration-200">
                <BKashLogo className="h-9 w-9" customLogoUrl={settings.bkashLogoUrl} />
              </div>
              )}
              {/* Nagad badge */}
              {settings.nagadNumber && (
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-1 h-11 w-14 flex items-center justify-center shadow-sm hover:scale-105 transition-transform duration-200">
                <NagadLogo className="h-9 w-9" customLogoUrl={settings.nagadLogoUrl} />
              </div>
              )}
              {/* Rocket badge */}
              {settings.rocketNumber && (
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-1 h-11 w-14 flex items-center justify-center shadow-sm hover:scale-105 transition-transform duration-200">
                <RocketLogo className="h-9 w-9" customLogoUrl={settings.rocketLogoUrl} />
              </div>
              )}
              {/* Upay badge */}
              {settings.upayNumber && (
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-1 h-11 w-14 flex items-center justify-center shadow-sm hover:scale-105 transition-transform duration-200">
                <UpayLogo className="h-9 w-9" customLogoUrl={settings.upayLogoUrl} />
              </div>
              )}
              {/* Cellfin badge */}
              {settings.cellfinNumber && (
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-1 h-11 w-14 flex items-center justify-center shadow-sm hover:scale-105 transition-transform duration-200">
                <CellfinLogo className="h-9 w-9" customLogoUrl={settings.cellfinLogoUrl} />
              </div>
              )}
              {/* Bank badge */}
              {settings.bankingNumber && (
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-1 h-11 w-14 flex items-center justify-center shadow-sm hover:scale-105 transition-transform duration-200">
                <BankingLogo className="h-9 w-9" customLogoUrl={settings.bankingLogoUrl} />
              </div>
              )}
            </div>

            <div className="text-[9px] text-slate-500 font-bold max-w-[220px] leading-relaxed">
              বিকাশ, নগদ, রকেট, উপায়, সেলফিন এবং ব্যাংকের মার্চেন্ট পেমেন্ট সুবিধা জিনিপের অধীনে সচল রয়েছে।
            </div>
          </div>

        </div>
      </div>

      {/* Trust reassurance tagline */}
      <div className="border-t border-slate-800 pt-5 text-center flex flex-col sm:flex-row items-center justify-center gap-6 text-[10px] sm:text-xs font-bold text-slate-500">
        <span className="flex items-center gap-1.5">
          ✅ ৩-১০ মিনিটে দ্রুত অফার সচল
        </span>
        <span className="hidden sm:inline text-slate-600">|</span>
        <span className="flex items-center gap-1.5">
          🔒 SSL 256-Bit ডেটা এনক্রিপশন
        </span>
        <span className="hidden sm:inline text-slate-600">|</span>
        <span className="flex items-center gap-1.5">
          💬 ২৪/৭ হেল্পলাইন ও লাইভ চ্যাট সাপোর্ট
        </span>
      </div>
    </div>
  );
}

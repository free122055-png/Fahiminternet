import React from 'react';
import { 
  User, ShieldCheck, MapPin, Settings, LogOut, Trash2, 
  ChevronRight, Bell, Lock, FileText, Smartphone, CreditCard,
  Headset, MessageCircle, HelpCircle, Gift, Wallet, Package, Clock, Heart, BadgeCheck, Copy,
  Info, AlertTriangle, CheckCircle, PackageSearch, Camera, Mail, PhoneCall
} from 'lucide-react';

// Added premium icons placeholders
const FacebookIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const InstagramIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.23.056 2.062.25 2.784.533.754.293 1.293.642 1.858 1.207.564.564.914 1.104 1.207 1.858.283.722.477 1.554.533 2.784.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.23-.25 2.062-.533 2.784-.293.754-.642 1.293-1.207 1.858-.564.564-1.104.914-1.858 1.207-.722.283-1.554.477-2.784.533-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.23-.056-2.062-.25-2.784-.533-.754-.293-1.293-.642-1.858-1.207-.564-.564-.914-1.104-1.207-1.858-.283-.722-.477-1.554-.533-2.784-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.056-1.23.25-2.062.533-2.784.293-.754.642-1.293 1.207-1.858.564-.564 1.104-.914 1.858-1.207.722-.283 1.554-.477 2.784-.533 1.266-.058 1.646-.07 4.85-.07zm0 2.163c-3.138 0-3.51.013-4.752.069-1.144.053-1.763.242-2.176.402-.547.212-.936.466-1.346.876-.41.41-.664.799-.876 1.346-.16.413-.349 1.032-.402 2.176-.056 1.242-.069 1.614-.069 4.752s.013 3.51.069 4.752c.053 1.144.242 1.763.402 2.176.212.547.466.936.876 1.346.41.41.799.664 1.346.876.413.16 1.032.349 2.176.402 1.242.056 1.614.069 4.752.069s3.51-.013 4.752-.069c1.144-.053 1.763-.242 2.176-.402.547-.212.936-.466 1.346-.876.41-.41.664-.799.876-1.346.16-.413.349-1.032.402-2.176.056-1.242.069-1.614.069-4.752s-.013-3.51-.069-4.752c-.053-1.144-.242-1.763-.402-2.176-.212-.547-.466-.936-.876-1.346-.41-.41-.799-.664-1.346-.876-.413-.16-1.032-.349-2.176-.402-1.242-.056-1.614-.069-4.752-.069zM12 7.389c-2.549 0-4.611 2.062-4.611 4.611s2.062 4.611 4.611 4.611 4.611-2.062 4.611-4.611-2.062-4.611-4.611-4.611zm0 7.058c-1.35 0-2.447-1.097-2.447-2.447s1.097-2.447 2.447-2.447 2.447 1.097 2.447 2.447-1.097 2.447-2.447 2.447zm6.474-7.147c-.595 0-1.077.482-1.077 1.077s.482 1.077 1.077 1.077 1.077-.482 1.077-1.077-.482-1.077-1.077-1.077z"/></svg>;
const TelegramIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.124l-6.87 4.32-2.96-.924c-1.43-.455-1.458-1.438.305-2.128l11.564-4.464c.535-.205 1.01.127.838 1.94z"/></svg>;
const WhatsAppIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.67-1.612-.916-2.207-.242-.579-.487-.5-67-.508-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.005 0C5.374 0 0 5.374 0 12.005c0 2.091.545 4.133 1.583 5.932L0 24l6.326-1.657a11.85 11.85 0 005.679 1.442h.005c6.631 0 12.005-5.374 12.005-12.005 0-3.21-1.25-6.23-3.523-8.503"/></svg>;


interface UserProfileProps {
  currentUser?: any;
  settings?: any;
  onLogout: () => void;
  onAction: (action: string) => void;
  onOpenAuth?: (msg?: string) => void;
}

export default function UserProfile({ currentUser, settings, onLogout, onAction, onOpenAuth }: UserProfileProps) {
  const [copied, setCopied] = React.useState(false);

  const isLoggedIn = Boolean(currentUser && (currentUser.uid || currentUser.phone));
  const displayName = currentUser?.displayName || 'ব্যবহারকারী (Guest)';
  const phoneOrEmail = currentUser?.phone || currentUser?.phoneNumber || currentUser?.email || '';
  const userIdText = currentUser?.uid ? `FAHIM-${currentUser.uid.substring(0, 7).toUpperCase()}` : '';
  const mainBalanceFormatted = currentUser?.balance !== undefined
    ? `৳ ${Number(currentUser.balance).toLocaleString('bn-BD', { minimumFractionDigits: 2 })}`
    : '৳ ০০.০০';

  const handleCopyId = () => {
    if (userIdText) {
      navigator.clipboard.writeText(userIdText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const triggerAuth = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      onAction('open_auth');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-20">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-b-[32px] shadow-sm mb-6 border-b border-slate-100">
        {!isLoggedIn ? (
          <div className="text-center py-2 space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 shadow-sm mx-auto flex items-center justify-center text-emerald-600">
              <User className="w-10 h-10 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">স্বাগতম! (Guest User)</h2>
              <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed">
                সহজে অফার রিচার্জ, ওয়ালেট ব্যালেন্স যোগ এবং অর্ডার ট্র্যাক করতে আপনার অ্যাকাউন্টে লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন।
              </p>
            </div>
            <button
              onClick={triggerAuth}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>লগইন / অ্যাকাউন্ট রেজিস্ট্রেশন করুন</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative group">
                <div 
                  className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onAction('account_settings')}
                >
                  {currentUser?.photoURL ? (
                    <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-2xl font-black">
                      {displayName.charAt(0)}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => onAction('account_settings')}
                  className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 text-white rounded-full border-2 border-white shadow-sm hover:bg-emerald-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold flex items-center gap-1 text-slate-900">
                  {displayName}
                  <BadgeCheck className="w-5 h-5 text-emerald-500" />
                </h2>
                <p className="text-slate-500 font-bold text-xs">{phoneOrEmail}</p>
                <span className="inline-block mt-1 px-3 py-0.5 bg-slate-900 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-wide">
                  {currentUser?.role === 'admin' ? 'Administrator' : 'Verified Member'}
                </span>
              </div>
            </div>
            {userIdText && (
              <div className="flex items-center justify-between bg-slate-100 p-3 rounded-2xl">
                <span className="text-xs font-bold text-slate-700">User ID: {userIdText}</span>
                <button onClick={handleCopyId} className="flex items-center gap-1 text-xs text-emerald-600 font-bold hover:text-emerald-700 cursor-pointer">
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'কপি হয়েছে!' : 'কপি'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 1. Balance */}
      <div className="px-6 mb-6">
        <h3 className="text-slate-900 font-black mb-3 flex items-center gap-2 text-sm">
          <Wallet className="w-4 h-4 text-emerald-600" />
          ১. Balance
        </h3>
        <div>
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between px-5 shadow-sm">
            <div>
              <p className="text-xs font-bold text-slate-400">Main Balance</p>
              <p className="text-base font-black text-emerald-400 mt-0.5">{mainBalanceFormatted}</p>
            </div>
            {!isLoggedIn ? (
              <button
                onClick={triggerAuth}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all cursor-pointer"
              >
                লগইন করুন
              </button>
            ) : (
              <button
                onClick={() => onAction('add_money')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all cursor-pointer"
              >
                এড মানি
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-6 space-y-6">
        
        {/* 1. Wallet & Finance */}
        <Section title="১. Wallet & Finance">
          <ListItem 
            icon={<Wallet className="text-emerald-600" />} 
            title="Add Balance" 
            subtitle="এড মানি করে ব্যালেন্স যোগ করুন"
            onClick={() => isLoggedIn ? onAction('add_money') : triggerAuth()} 
          />
          <ListItem 
            icon={<FileText className="text-blue-600" />} 
            title="Payment History" 
            subtitle="আপনার সকল লেনদেনের হিস্টোরি"
            onClick={() => isLoggedIn ? onAction('payment_history') : triggerAuth()} 
          />
        </Section>
        
        {/* 2. Account Security */}
        <Section title="২. Account Security">
          <ListItem 
            icon={<Settings className="text-slate-600" />} 
            title="Edit Profile" 
            subtitle="নাম ও প্রোফাইল ছবি পরিবর্তন করুন"
            onClick={() => isLoggedIn ? onAction('account_settings') : triggerAuth()} 
          />
          <ListItem 
            icon={<Lock className="text-amber-600" />} 
            title="Change Password" 
            subtitle="নিরাপত্তার জন্য পাসওয়ার্ড পরিবর্তন করুন"
            onClick={() => isLoggedIn ? onAction('change_password') : triggerAuth()} 
          />
          <ListItem 
            icon={<Bell className="text-rose-600" />} 
            title="Notification" 
            subtitle="অফার ও আপডেট নোটিফিকেশন"
            onClick={() => isLoggedIn ? onAction('notification_settings') : triggerAuth()} 
          />
        </Section>

        {/* 3. Support Center */}
        <Section title="৩. Support Center">
          <ListItem 
            icon={<MessageCircle className="text-emerald-600" />} 
            title="Contact Us" 
            subtitle="সরাসরি আমাদের সাথে যোগাযোগ করুন"
            onClick={() => onAction('contact_us')} 
          />
          <div className="px-4 pb-4 grid grid-cols-5 gap-2">
            <a href="mailto:fahimbillha70@gmail.com" className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors">
              <Mail className="w-5 h-5 text-emerald-600" />
              <span className="text-[9px] font-bold text-slate-700">Email</span>
            </a>
            <a href="https://wa.me/8801618599077" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors">
              <WhatsAppIcon />
              <span className="text-[9px] font-bold text-slate-700">WhatsApp</span>
            </a>
            <a href="https://www.facebook.com/fahim12205" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors">
              <FacebookIcon />
              <span className="text-[9px] font-bold text-slate-700">Facebook</span>
            </a>
            <a href="https://www.instagram.com/rajibul_islam_fahim?igsh=ZmZjdnBxbnpja2Jz" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors">
              <InstagramIcon />
              <span className="text-[9px] font-bold text-slate-700">Insta</span>
            </a>
            <a href="https://t.me/fahim123633" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors">
              <TelegramIcon />
              <span className="text-[9px] font-bold text-slate-700">Tele</span>
            </a>
          </div>
          <ListItem 
            icon={<HelpCircle className="text-blue-600" />} 
            title="Help / FAQ" 
            subtitle="সচরাচর জিজ্ঞাসিত প্রশ্নের উত্তর"
            onClick={() => onAction('faq')} 
          />
          <ListItem 
            icon={<AlertTriangle className="text-rose-600" />} 
            title="Report a Problem" 
            subtitle="অ্যাপে কোনো সমস্যা হলে আমাদের জানান"
            onClick={() => onAction('report_problem')} 
          />
        </Section>

        {/* 4. Legal & About */}
        <Section title="৪. Legal (Google Play Store)">
          <ListItem 
            icon={<ShieldCheck className="text-emerald-600" />} 
            title="Privacy Policy" 
            subtitle="আপনার তথ্য সুরক্ষা এবং গোপনীয়তা"
            onClick={() => onAction('privacy_policy')} 
          />
          <ListItem 
            icon={<FileText className="text-blue-600" />} 
            title="Terms & Conditions" 
            subtitle="আমাদের ব্যবহারের শর্তাবলী ও নিয়মাবলী"
            onClick={() => onAction('terms_conditions')} 
          />
          <ListItem 
            icon={<Info className="text-indigo-600" />} 
            title="About App" 
            subtitle="অ্যাপ ভার্সন ও ডেভেলপার ইনফরমেশন"
            onClick={() => onAction('about_us')} 
          />
        </Section>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-2">
          {isLoggedIn ? (
            <>
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 font-bold text-slate-800 hover:bg-slate-50 transition-colors text-sm cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <LogOut className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-slate-900">Logout</p>
                    <p className="text-[10px] text-slate-400 font-bold">অ্যাকাউন্ট থেকে লগআউট করুন</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              <button 
                onClick={() => onAction('delete_account')} 
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors text-sm cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-xl">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-red-600">Delete Account</p>
                    <p className="text-[10px] text-red-300 font-bold">অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলুন</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-200" />
              </button>
            </>
          ) : (
            <button
              onClick={triggerAuth}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              <span>লগইন / একাউন্ট রেজিস্ট্রেশন</span>
            </button>
          )}
        </div>

        {/* Footer Info */}
        <div className="pt-4 pb-8 text-center space-y-1">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            {settings?.brandName || 'FAHIM INTERNET'} {settings?.appVersion || 'v1.0.0'}
          </p>
          <p className="text-[10px] font-bold text-slate-400">
            Developer Email: <span className="text-slate-500 font-black">{settings?.developerEmail || 'rajibulislamfahim8610@gmail.com'}</span>
          </p>
          <p className="text-[9px] text-slate-300 font-medium px-4 leading-relaxed">
            আমরা কোনো ব্যক্তিগত সংবেদনশীল তথ্য সংগ্রহ করি না। সকল তথ্য Google Play পলিসি অনুযায়ী এনক্রিপ্টেড এবং সুরক্ষিত।
          </p>
        </div>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-widest px-1">
        {title}
      </h3>
      <div className="bg-white rounded-[24px] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  );
}

function ListItem({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer text-left"
    >
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-white transition-colors shadow-sm">
          {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
        </div>
        <div>
          <p className="text-sm font-black text-slate-900 leading-none">{title}</p>
          <p className="text-[10px] font-bold text-slate-500 mt-1.5">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
    </button>
  );
}

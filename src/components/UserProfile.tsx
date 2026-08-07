import React from 'react';
import { 
  User, ShieldCheck, MapPin, Settings, LogOut, Trash2, 
  ChevronRight, Bell, Lock, FileText, Smartphone, CreditCard,
  Headset, MessageCircle, HelpCircle, Gift, Wallet, Package, Clock, Heart, BadgeCheck, Copy,
  Info, AlertTriangle, CheckCircle, PackageSearch, Camera
} from 'lucide-react';

interface UserProfileProps {
  currentUser?: any;
  onLogout: () => void;
  onAction: (action: string) => void;
  onOpenAuth?: (msg?: string) => void;
}

export default function UserProfile({ currentUser, onLogout, onAction, onOpenAuth }: UserProfileProps) {
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
        
        {/* 2. Wallet */}
        <Section title="২. Wallet" icon={<CreditCard className="w-4 h-4 text-emerald-600" />}>
          <GridItem icon={<Wallet />} label="Add Balance" onClick={() => isLoggedIn ? onAction('add_money') : triggerAuth()} />
          <GridItem icon={<FileText />} label="Payment History" onClick={() => isLoggedIn ? onAction('payment_history') : triggerAuth()} />
        </Section>
        
        {/* 3. Account */}
        <Section title="৩. Account" icon={<User className="w-4 h-4 text-emerald-600" />}>
          <GridItem icon={<Settings />} label="Edit Profile" onClick={() => isLoggedIn ? onAction('account_settings') : triggerAuth()} />
          <GridItem icon={<Lock />} label="Change Password" onClick={() => isLoggedIn ? onAction('change_password') : triggerAuth()} />
          <GridItem icon={<Bell />} label="Notification" onClick={() => isLoggedIn ? onAction('notification_settings') : triggerAuth()} />
        </Section>

        {/* 4. Support */}
        <Section title="৪. Support" icon={<Headset className="w-4 h-4 text-emerald-600" />}>
          <GridItem icon={<MessageCircle />} label="Contact Us" onClick={() => onAction('contact_us')} />
          <GridItem icon={<HelpCircle />} label="Help / FAQ" onClick={() => onAction('faq')} />
        </Section>

        {/* 5. Legal */}
        <Section title="৫. Legal (Play Store)" icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}>
          <GridItem icon={<ShieldCheck />} label="Privacy Policy" onClick={() => onAction('privacy_policy')} />
          <GridItem icon={<FileText />} label="Terms & Conditions" onClick={() => onAction('terms_conditions')} />
          <GridItem icon={<Info />} label="About App" onClick={() => onAction('about_us')} />
        </Section>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-2">
          {isLoggedIn ? (
            <>
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 font-bold text-slate-800 hover:bg-slate-50 transition-colors text-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-slate-600" />
                  <span>Logout</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              <button 
                onClick={() => onAction('delete_account')} 
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors text-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-red-500" />
                  <span>Delete Account</span>
                </div>
                <ChevronRight className="w-5 h-5 text-red-300" />
              </button>
            </>
          ) : (
            <button
              onClick={triggerAuth}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>লগইন / একাউন্ট রেজিস্ট্রেশন</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-slate-900 font-black mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="grid grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-100">
        {children}
      </div>
    </div>
  );
}

function GridItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-2 text-center w-full"
    >
      <div className="p-3 bg-slate-50 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
      </div>
      <span className="text-[10px] font-bold text-slate-700 leading-tight">{label}</span>
    </button>
  );
}

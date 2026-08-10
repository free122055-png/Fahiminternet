import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 bg-white p-6 overflow-y-auto"
    >
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-slate-600 mb-6 hover:text-slate-900"
        >
          <ArrowLeft size={20} /> ফিরে যান
        </button>
        
        <h1 className="text-3xl font-bold mb-6 text-slate-900 flex items-center gap-3">
          <ShieldCheck className="text-emerald-600" size={32} /> Privacy Policy
        </h1>
        
        <div className="prose prose-slate max-w-none">
          <p>Last updated: August 10, 2026</p>
          <p>FAHIM INTERNET ("we," "our," or "us") operates the FAHIM INTERNET mobile application and website. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of Personal Information we receive from users of the Application.</p>

          <h2>1. Information Collection and Use</h2>
          <p>While using our Application, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your name, phone number, and transaction history ("Personal Information").</p>

          <h2>2. Log Data</h2>
          <p>Like many site operators, we collect information that your browser/app sends whenever you visit our Service ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, device type, operating system version, and other statistics.</p>

          <h2>3. Cookies</h2>
          <p>Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive. We use cookies to collect information to improve our services for you.</p>

          <h2>4. Security</h2>
          <p>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>

          <h2>5. Changes to This Privacy Policy</h2>
          <p>This Privacy Policy is effective as of the date mentioned above and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.</p>
        </div>
      </div>
    </motion.div>
  );
}

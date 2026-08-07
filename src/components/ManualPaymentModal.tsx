import React, { useState } from 'react';
import { X, Send, Landmark } from 'lucide-react';

interface ManualPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { method: string, transId: string, phone: string }) => void;
  amount: number;
}

export default function ManualPaymentModal({ isOpen, onClose, onConfirm, amount }: ManualPaymentModalProps) {
  const [method, setMethod] = useState('bKash');
  const [transId, setTransId] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">ম্যানুয়াল পেমেন্ট সম্পন্ন করুন</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        
        <p className="text-sm text-slate-600 mb-4">আপনার পেমেন্ট {method} এ সেন্ড মানি করে নিচের তথ্যগুলো পূরণ করুন:</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">পেমেন্ট মেথড</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full p-2 border rounded-lg text-sm">
              <option>bKash</option>
              <option>Nagad</option>
              <option>Rocket</option>
            </select>
          </div>
          <input type="text" placeholder="যে নাম্বার থেকে পাঠিয়েছেন" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
          <input type="text" placeholder="ট্রানজেকশন আইডি (TransID)" value={transId} onChange={(e) => setTransId(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
          
          <button onClick={() => onConfirm({ method, transId, phone })} className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> পেমেন্ট সাবমিট করুন
          </button>
        </div>
      </div>
    </div>
  );
}

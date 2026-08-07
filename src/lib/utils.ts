import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mobileToEmail(phone: string): string {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  return `${cleanPhone}@daily-offers.bd`;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(amount).replace('BDT', '৳');
}

export function formatDate(date: any): string {
  if (!date) return '...';
  // Handle Firestore Timestamp
  if (date.toDate && typeof date.toDate === 'function') {
    const d = date.toDate();
    if (isNaN(d.getTime())) return '...';
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  // Handle ISO string or Date object
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return typeof date === 'string' ? date : '...';
  }
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function toMs(date: any): number {
  if (!date) return 0;
  if (date.toMillis && typeof date.toMillis === 'function') {
    return date.toMillis();
  }
  if (date.toDate && typeof date.toDate === 'function') {
    return date.toDate().getTime();
  }
  const t = new Date(date).getTime();
  return isNaN(t) ? 0 : t;
}

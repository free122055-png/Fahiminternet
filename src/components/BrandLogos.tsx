import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface LogoProps {
  className?: string;
  customLogoUrl?: string;
}

export function BKashLogo({ className = "h-10 w-auto", customLogoUrl }: LogoProps) {
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState<string>('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFetchedLogoUrl(data.bkashLogoUrl || '');
      }
    }, (err) => console.warn('BKashLogo listener error:', err));
    return () => unsub();
  }, []);

  const logoUrl = (customLogoUrl && customLogoUrl.trim() !== '') ? customLogoUrl : fetchedLogoUrl;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="bKash"
        className={`${className} object-contain pointer-events-none max-h-12`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <svg className={`${className} pointer-events-none max-h-12`} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" id="svg-bkash-logo">
      {/* bKash Origami Bird */}
      <g transform="translate(130, 8) scale(0.7)">
        <path d="M25 50 L35 22 L52 32 L44 57 Z" fill="#E2136E" />
        <path d="M52 32 L78 12 L70 48 L44 57 Z" fill="#E2136E" />
        <path d="M70 48 L82 68 L52 68 L44 57 Z" fill="#E2136E" />
        <path d="M44 57 L52 68 L28 68 Z" fill="#A80B4F" />
      </g>
      {/* bKash Wordmark */}
      <text x="15" y="42" fill="#222" fontSize="32" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-1">
        b<tspan fill="#E2136E">Kash</tspan>
      </text>
    </svg>
  );
}

export function NagadLogo({ className = "h-10 w-auto", customLogoUrl }: LogoProps) {
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState<string>('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFetchedLogoUrl(data.nagadLogoUrl || '');
      }
    }, (err) => console.warn('NagadLogo listener error:', err));
    return () => unsub();
  }, []);

  const logoUrl = (customLogoUrl && customLogoUrl.trim() !== '') ? customLogoUrl : fetchedLogoUrl;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Nagad"
        className={`${className} object-contain pointer-events-none max-h-12`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <svg className={`${className} pointer-events-none max-h-12`} viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg" id="svg-nagad-logo">
      {/* Nagad Emblem */}
      <g transform="translate(10, 5) scale(0.9)">
        <circle cx="25" cy="25" r="22" fill="#F37021" />
        <path d="M12 25 C15 15 28 10 38 14 C28 20 25 30 12 25 Z" fill="#FFFFFF" />
        <path d="M15 28 C22 20 33 16 43 20 C32 26 28 36 15 28 Z" fill="#FFD200" />
        <circle cx="38" cy="15" r="3.5" fill="#FFFFFF" />
      </g>
      {/* Nagad Bangla Wordmark */}
      <text x="65" y="40" fill="#E03A12" fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif">
        নগদ
      </text>
      <text x="130" y="38" fill="#666" fontSize="11" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif">
        ডাক বিভাগের ডিজিটাল লেনদেন
      </text>
    </svg>
  );
}

export function RocketLogo({ className = "h-10 w-auto", customLogoUrl }: LogoProps) {
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState<string>('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFetchedLogoUrl(data.rocketLogoUrl || '');
      }
    }, (err) => console.warn('RocketLogo listener error:', err));
    return () => unsub();
  }, []);

  const logoUrl = (customLogoUrl && customLogoUrl.trim() !== '') ? customLogoUrl : fetchedLogoUrl;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Rocket"
        className={`${className} object-contain pointer-events-none max-h-12`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <svg className={`${className} pointer-events-none max-h-12`} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" id="svg-rocket-logo">
      {/* Rocket Plane Emblem */}
      <g transform="translate(120, 5) scale(0.85)">
        <path d="M40 8 L65 42 L50 42 L50 58 C50 60, 36 60, 36 58 L36 42 L20 42 L40 8 Z" fill="#8C3494" />
        <path d="M20 42 L10 52 L28 48 Z" fill="#8C3494" />
        <path d="M35 58 L40 65 L45 58 Z" fill="#FF9E1B" />
      </g>
      {/* Rocket Text */}
      <text x="10" y="24" fill="#8C3494" fontSize="10" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1">
        ROCKET
      </text>
      <text x="10" y="46" fill="#8C3494" fontSize="22" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif">
        রকেট
      </text>
    </svg>
  );
}

export function UpayLogo({ className = "h-10 w-auto", customLogoUrl }: LogoProps) {
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState<string>('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFetchedLogoUrl(data.upayLogoUrl || '');
      }
    }, (err) => console.warn('UpayLogo listener error:', err));
    return () => unsub();
  }, []);

  const logoUrl = (customLogoUrl && customLogoUrl.trim() !== '') ? customLogoUrl : fetchedLogoUrl;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Upay"
        className={`${className} object-contain pointer-events-none max-h-12`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <svg className={`${className} pointer-events-none max-h-12`} viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg" id="svg-upay-logo">
      {/* Upay Smile Emblem */}
      <g transform="translate(55, 2) scale(0.65)">
        <path d="M20 15 H36 V38 C36 44 44 46 50 46 C56 46 64 44 64 38 V15 H80 V38 C80 54 50 58 20 38 V15 Z" fill="#F4B223" />
        <circle cx="28" cy="12" r="6" fill="#00A3E0" />
        <circle cx="72" cy="12" r="6" fill="#00A3E0" />
      </g>
      {/* Upay Wordmark */}
      <text x="80" y="52" fill="#0F2D69" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
        উপায়
      </text>
    </svg>
  );
}

export function CellfinLogo({ className = "h-10 w-auto", customLogoUrl }: LogoProps) {
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState<string>('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFetchedLogoUrl(data.cellfinLogoUrl || '');
      }
    }, (err) => console.warn('CellfinLogo listener error:', err));
    return () => unsub();
  }, []);

  const logoUrl = (customLogoUrl && customLogoUrl.trim() !== '') ? customLogoUrl : fetchedLogoUrl;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="CellFin"
        className={`${className} object-contain pointer-events-none max-h-12`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <svg className={`${className} pointer-events-none max-h-12`} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" id="svg-cellfin-logo">
      {/* Cellfin Icon */}
      <g transform="translate(10, 8) scale(0.85)">
        <rect width="44" height="44" rx="10" fill="#00A15D" />
        <circle cx="22" cy="22" r="10" fill="none" stroke="white" strokeWidth="3" />
        <circle cx="22" cy="22" r="4" fill="#FFC72C" />
      </g>
      {/* CellFin Wordmark */}
      <text x="60" y="36" fill="#CC0000" fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif">
        Cell<tspan fill="#00A15D">Fin</tspan>
      </text>
      <text x="60" y="50" fill="#666" fontSize="9" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif">
        Banking and beyond
      </text>
    </svg>
  );
}

export function BankingLogo({ className = "h-10 w-auto", customLogoUrl }: LogoProps) {
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState<string>('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFetchedLogoUrl(data.bankingLogoUrl || '');
      }
    }, (err) => console.warn('BankingLogo listener error:', err));
    return () => unsub();
  }, []);

  const logoUrl = (customLogoUrl && customLogoUrl.trim() !== '') ? customLogoUrl : fetchedLogoUrl;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Banking"
        className={`${className} object-contain pointer-events-none max-h-12`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <svg className={`${className} pointer-events-none max-h-12`} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" id="svg-banking-logo">
      {/* DBBL Symbol */}
      <g transform="translate(10, 8) scale(0.85)">
        <rect width="44" height="44" rx="10" fill="#005A3C" />
        <circle cx="22" cy="22" r="12" fill="white" />
        <path d="M22 10 C28 10 34 16 34 22 C26 22 22 16 22 10 Z" fill="#005A3C" />
        <path d="M22 34 C16 34 10 28 10 22 C18 22 22 28 22 34 Z" fill="#E2136E" />
      </g>
      {/* DBBL Text */}
      <text x="60" y="34" fill="#005A3C" fontSize="24" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif">
        ব্যাংকিং <tspan fill="#666" fontSize="14">(DBBL)</tspan>
      </text>
      <text x="60" y="50" fill="#888" fontSize="10" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif">
        ব্যাংক একাউন্ট ট্রান্সফার
      </text>
    </svg>
  );
}

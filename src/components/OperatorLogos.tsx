import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  logoUrl?: string;
}

// 1. Grameenphone (GP) Logo - Official Telenor style 3D/2D blue propeller
export const GPLogo: React.FC<LogoProps> = ({ className, size = 20, logoUrl: propLogoUrl, ...props }) => {
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState<string>('');

  useEffect(() => {
    if (propLogoUrl !== undefined) return;
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFetchedLogoUrl(data.gpLogoUrl || '');
      }
    });
    return () => unsub();
  }, [propLogoUrl]);

  const logoUrl = propLogoUrl !== undefined ? propLogoUrl : fetchedLogoUrl;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="GP"
        className={className}
        style={{ width: size, height: size, objectFit: 'contain' }}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="gpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00b4f0" />
          <stop offset="100%" stopColor="#005ea6" />
        </linearGradient>
      </defs>
      <g transform="translate(0, 0)">
        {/* Three rotating petals representing the Grameenphone / Telenor logo */}
        <path
          d="M 50,50 C 53,42 63,33 73,33 C 83,33 81,45 71,51 C 61,57 53,52 50,50 Z"
          fill="url(#gpGradient)"
        />
        <path
          d="M 50,50 C 53,42 63,33 73,33 C 83,33 81,45 71,51 C 61,57 53,52 50,50 Z"
          fill="url(#gpGradient)"
          transform="rotate(120 50 50)"
        />
        <path
          d="M 50,50 C 53,42 63,33 73,33 C 83,33 81,45 71,51 C 61,57 53,52 50,50 Z"
          fill="url(#gpGradient)"
          transform="rotate(240 50 50)"
        />
      </g>
    </svg>
  );
};

// 2. Robi Logo - Official Axiata 9-faceted colorful gem
export const RobiLogo: React.FC<LogoProps> = ({ className, size = 20, logoUrl: propLogoUrl, ...props }) => {
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState<string>('');

  useEffect(() => {
    if (propLogoUrl !== undefined) return;
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFetchedLogoUrl(data.robiLogoUrl || '');
      }
    });
    return () => unsub();
  }, [propLogoUrl]);

  const logoUrl = propLogoUrl !== undefined ? propLogoUrl : fetchedLogoUrl;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Robi"
        className={className}
        style={{ width: size, height: size, objectFit: 'contain' }}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Coordinates of base rhombus pointing straight up (symmetry axis is vertical)
  const basePoints = "50,50 57.52,29.33 50,8.65 42.48,29.33";

  // Robi / Axiata 9 official colors
  const colors = [
    '#ed1c24', // 0° Red
    '#f37023', // 40° Orange
    '#ffb81c', // 80° Gold
    '#92c83e', // 120° Lime Green
    '#00a651', // 160° Green
    '#00aeef', // 200° Cyan
    '#0054a6', // 240° Blue
    '#2e3192', // 280° Dark Blue
    '#ec008c'  // 320° Magenta/Pink
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <g>
        {colors.map((color, index) => {
          const rotation = index * 40;
          return (
            <polygon
              key={index}
              points={basePoints}
              fill={color}
              transform={`rotate(${rotation} 50 50)`}
            />
          );
        })}
      </g>
    </svg>
  );
};

// 3. Banglalink Logo - Orange base with official tiger stripes
export const BanglalinkLogo: React.FC<LogoProps> = ({ className, size = 20, logoUrl: propLogoUrl, ...props }) => {
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState<string>('');

  useEffect(() => {
    if (propLogoUrl !== undefined) return;
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFetchedLogoUrl(data.blLogoUrl || '');
      }
    });
    return () => unsub();
  }, [propLogoUrl]);

  const logoUrl = propLogoUrl !== undefined ? propLogoUrl : fetchedLogoUrl;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Banglalink"
        className={className}
        style={{ width: size, height: size, objectFit: 'contain' }}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="blGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff5a00" />
          <stop offset="100%" stopColor="#ff9000" />
        </linearGradient>
      </defs>
      
      {/* Round circular background badge */}
      <rect x="5" y="5" width="90" height="90" rx="45" fill="url(#blGradient)" />
      
      {/* Stylized white tiger stripe claw marks */}
      <g fill="#ffffff">
        <path d="M 25,75 Q 40,40 70,25 C 65,30 50,55 25,75 Z" />
        <path d="M 15,60 Q 32,30 60,15 C 55,20 40,42 15,60 Z" />
        <path d="M 35,85 Q 52,55 80,40 C 75,45 60,67 35,85 Z" />
        <path d="M 10,45 Q 22,25 45,12 C 40,16 30,32 10,45 Z" />
        <path d="M 50,92 Q 68,68 90,58 C 85,62 72,80 50,92 Z" />
      </g>
    </svg>
  );
};

// 4. Airtel Logo - Red circular badge with official white loop wave
export const AirtelLogo: React.FC<LogoProps> = ({ className, size = 20, logoUrl: propLogoUrl, ...props }) => {
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState<string>('');

  useEffect(() => {
    if (propLogoUrl !== undefined) return;
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFetchedLogoUrl(data.airtelLogoUrl || '');
      }
    });
    return () => unsub();
  }, [propLogoUrl]);

  const logoUrl = propLogoUrl !== undefined ? propLogoUrl : fetchedLogoUrl;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Airtel"
        className={className}
        style={{ width: size, height: size, objectFit: 'contain' }}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="airtelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff1e42" />
          <stop offset="100%" stopColor="#d6001c" />
        </linearGradient>
      </defs>
      
      {/* Red circular background */}
      <rect x="5" y="5" width="90" height="90" rx="45" fill="url(#airtelGradient)" />
      
      {/* Official cursive "airtel wave" single line loop */}
      <path
        d="M 32,68 C 30,68 28,64 28,58 C 28,45 38,32 50,32 C 62,32 70,40 70,50 C 70,62 58,70 48,70 C 40,70 34,64 34,56 C 34,46 42,38 52,38 C 58,38 62,42 62,48 C 62,54 56,58 50,58"
        fill="none"
        stroke="#ffffff"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// 5. Teletalk Logo - Bangladesh green & red globe receiver
export const TeletalkLogo: React.FC<LogoProps> = ({ className, size = 20, logoUrl: propLogoUrl, ...props }) => {
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState<string>('');

  useEffect(() => {
    if (propLogoUrl !== undefined) return;
    const unsub = onSnapshot(doc(db, 'settings', 'site_config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFetchedLogoUrl(data.teletalkLogoUrl || '');
      }
    });
    return () => unsub();
  }, [propLogoUrl]);

  const logoUrl = propLogoUrl !== undefined ? propLogoUrl : fetchedLogoUrl;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Teletalk"
        className={className}
        style={{ width: size, height: size, objectFit: 'contain' }}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      {/* Green left crescent */}
      <path
        d="M 38,15 C 16,30 16,70 38,85 C 26,70 26,30 38,15 Z"
        fill="#0f172a"
      />
      {/* Red right crescent */}
      <path
        d="M 62,15 C 84,30 84,70 62,85 C 74,70 74,30 62,15 Z"
        fill="#dc2626"
      />
      {/* Red center solid dot */}
      <circle cx="50" cy="50" r="14" fill="#dc2626" />
      
      {/* Elegant overlapping green arc */}
      <path
        d="M 50,32 A 18 18 0 0 1 68,50"
        fill="none"
        stroke="#0f172a"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

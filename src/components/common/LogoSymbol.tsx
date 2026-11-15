import React from 'react';

interface LogoSymbolProps {
  className?: string;
  size?: number;
  monochrome?: 'black' | 'white';
}

/**
 * HOORAM STUDIO Official Brand Mark: Model 2 (Double-O Infinisun / اینفینی‌سان)
 * Built directly from the dual 'OO' of HOORAM:
 * Two intersecting luminous orbits forming an infinite optical cinema lens.
 */
export const LogoSymbol: React.FC<LogoSymbolProps> = ({
  className = 'w-9 h-9 sm:w-10 sm:h-10',
  size,
  monochrome
}) => {
  if (monochrome === 'black') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="none"
        width={size}
        height={size}
        className={className}
        aria-label="لوگوی استودیو تبلیغاتی هورام | HOORAM STUDIO"
      >
        <circle cx="38" cy="50" r="24" stroke="#000000" strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="62" cy="50" r="24" stroke="#000000" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 50 35.5 C 56.5 42.5, 56.5 57.5, 50 64.5 C 43.5 57.5, 43.5 42.5, 50 35.5 Z" fill="#000000" />
        <circle cx="50" cy="50" r="2.8" fill="#FFFFFF" />
      </svg>
    );
  }

  if (monochrome === 'white') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="none"
        width={size}
        height={size}
        className={className}
        aria-label="لوگوی استودیو تبلیغاتی هورام | HOORAM STUDIO"
      >
        <circle cx="38" cy="50" r="24" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="62" cy="50" r="24" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 50 35.5 C 56.5 42.5, 56.5 57.5, 50 64.5 C 43.5 57.5, 43.5 42.5, 50 35.5 Z" fill="#FFFFFF" />
        <circle cx="50" cy="50" r="2.8" fill="#07090E" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-label="لوگوی استودیو تبلیغاتی هورام | HOORAM STUDIO"
    >
      <defs>
        <linearGradient id="m2LeftGrad" x1="15" y1="25" x2="60" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="m2RightGrad" x1="40" y1="25" x2="85" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="m2LensGrad" x1="50" y1="35" x2="50" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <filter id="m2CoreGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Left Ring: First 'O' of HOORAM / Sun Origin */}
      <circle cx="38" cy="50" r="24" stroke="url(#m2LeftGrad)" strokeWidth="5" strokeLinecap="round" />
      {/* Right Ring: Second 'O' of HOORAM / Cinema Lens & Infinity */}
      <circle cx="62" cy="50" r="24" stroke="url(#m2RightGrad)" strokeWidth="5" strokeLinecap="round" />
      {/* Overlapping Radiant Lens (Vesica Piscis) */}
      <path
        d="M 50 35.5 C 56.5 42.5, 56.5 57.5, 50 64.5 C 43.5 57.5, 43.5 42.5, 50 35.5 Z"
        fill="url(#m2LensGrad)"
        filter="url(#m2CoreGlow)"
      />
      {/* Pure Brilliant Sparkle Core */}
      <circle cx="50" cy="50" r="3.2" fill="#FFFFFF" />
    </svg>
  );
};

import React from 'react';

interface LogoSymbolProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * HOORAM STUDIO Master Brand Mark: The Radiant Nexus (نکسوس تابش نور)
 * Abstract geometric symbol embodying 'Hoor' (infinite light & brilliance).
 */
export const LogoSymbol: React.FC<LogoSymbolProps> = ({
  className = 'w-9 h-9 sm:w-10 sm:h-10',
  size,
  color = '#6366F1'
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      aria-label="لوگوی استودیو تبلیغاتی هورام | HOORAM STUDIO"
    >
      <defs>
        <linearGradient id="nexusGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      {/* Two optically balanced monolithic arcs forming an infinite circle separated by a 45-degree light corridor */}
      <path
        d="M 256 40 C 375.3 40, 472 136.7, 472 256 C 472 311.5 451.2 362.2 417 401 L 344 328 C 358.8 307.2 367.5 282.6 367.5 256 C 367.5 194.4 317.6 144.5 256 144.5 C 229.4 144.5 204.8 153.2 184 168 L 111 95 C 149.8 60.8 200.5 40 256 40 Z"
        fill="url(#nexusGrad)"
      />
      <path
        d="M 256 472 C 136.7 472, 40 375.3, 40 256 C 40 200.5 60.8 149.8 95 111 L 168 184 C 153.2 204.8 144.5 229.4 144.5 256 C 144.5 317.6 194.4 367.5 256 367.5 C 282.6 367.5 307.2 358.8 328 344 L 401 417 C 362.2 451.2 311.5 472 256 472 Z"
        fill="url(#nexusGrad)"
      />
      {/* Central optical light core */}
      <circle cx="256" cy="256" r="30" fill="#38BDF8" />
    </svg>
  );
};

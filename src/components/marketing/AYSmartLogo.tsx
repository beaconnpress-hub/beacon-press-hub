import React from 'react';
import { BRAND_COLORS } from '@/lib/branding/colors';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AYSmartLogo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 160, height: 160 },
    xl: { width: 240, height: 240 },
  };

  const { width, height } = sizes[size];

  if (variant === 'icon') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Shield background */}
        <path
          d="M100 20L40 60V110C40 160 100 180 100 180C100 180 160 160 160 110V60L100 20Z"
          fill={BRAND_COLORS.emeraldGreen}
          opacity="0.1"
          stroke={BRAND_COLORS.emeraldGreen}
          strokeWidth="2"
        />

        {/* Upward arrow - representing growth */}
        <path
          d="M100 70L130 110L115 110L115 140L85 140L85 110L70 110L100 70Z"
          fill={BRAND_COLORS.richGold}
        />

        {/* Inner shield accent */}
        <circle
          cx="100"
          cy="100"
          r="50"
          fill="none"
          stroke={BRAND_COLORS.richGold}
          strokeWidth="1"
          opacity="0.3"
        />
      </svg>
    );
  }

  if (variant === 'text') {
    return (
      <div className={className}>
        <h1 className="text-3xl font-black italic tracking-tight">
          AY<span style={{ color: BRAND_COLORS.richGold }}>SMART</span>
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: BRAND_COLORS.emeraldGreen }}>
          Investment Ltd
        </p>
      </div>
    );
  }

  // Full logo variant
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shield background */}
        <path
          d="M100 20L40 60V110C40 160 100 180 100 180C100 180 160 160 160 110V60L100 20Z"
          fill={BRAND_COLORS.emeraldGreen}
          opacity="0.1"
          stroke={BRAND_COLORS.emeraldGreen}
          strokeWidth="2"
        />

        {/* Upward arrow - representing growth */}
        <path
          d="M100 70L130 110L115 110L115 140L85 140L85 110L70 110L100 70Z"
          fill={BRAND_COLORS.richGold}
        />

        {/* Inner shield accent */}
        <circle
          cx="100"
          cy="100"
          r="50"
          fill="none"
          stroke={BRAND_COLORS.richGold}
          strokeWidth="1"
          opacity="0.3"
        />
      </svg>

      <div className="text-center mt-2">
        <h2 
          className="text-xl font-black italic tracking-tight"
          style={{ color: BRAND_COLORS.darkSlate }}
        >
          AY<span style={{ color: BRAND_COLORS.richGold }}>SMART</span>
        </h2>
        <p 
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: BRAND_COLORS.emeraldGreen }}
        >
          Investment Ltd
        </p>
      </div>
    </div>
  );
};

export default AYSmartLogo;

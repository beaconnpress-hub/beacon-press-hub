// AY'SMART INVESTMENT LTD - Premium Color Palette System
// Organic, natural, professional real estate branding

export const BRAND_COLORS = {
  // Primary Colors
  emeraldGreen: '#1B5E3F',      // Main brand color - trust, prosperity, growth
  richGold: '#D4A574',           // Premium accents - wealth, success
  
  // Secondary Colors
  forestGreen: '#4A7C59',        // Deeper green - stability, foundation
  deepEarthBrown: '#8B7355',    // Earth/soil - grounded, reliable
  
  // Backgrounds & Neutrals
  warmCream: '#F9F7F3',          // Main background - natural, organic, welcoming
  offWhite: '#FFFFFF',           // Secondary background
  
  // Text Colors
  darkSlate: '#1A2332',          // Primary text - professional, readable
  mediumGray: '#4A5568',         // Secondary text
  lightGray: '#A0AEC0',          // Tertiary text
  
  // Functional Colors
  success: '#10B981',            // Success states
  error: '#EF4444',              // Error states
  warning: '#F59E0B',            // Warning states
};

export const BRAND_GRADIENTS = {
  // Primary gradient - Emerald to Gold
  primaryGradient: `linear-gradient(135deg, ${BRAND_COLORS.emeraldGreen} 0%, ${BRAND_COLORS.richGold} 100%)`,
  
  // Nature gradient - Forest to Cream
  natureGradient: `linear-gradient(135deg, ${BRAND_COLORS.forestGreen} 0%, ${BRAND_COLORS.warmCream} 100%)`,
  
  // Earth gradient - Brown to Gold
  earthGradient: `linear-gradient(135deg, ${BRAND_COLORS.deepEarthBrown} 0%, ${BRAND_COLORS.richGold} 100%)`,
  
  // Subtle background gradient
  backgroundGradient: `linear-gradient(180deg, ${BRAND_COLORS.warmCream} 0%, ${BRAND_COLORS.offWhite} 100%)`,
};

export const BRAND_SHADOWS = {
  light: '0 2px 8px rgba(27, 94, 63, 0.08)',
  medium: '0 4px 16px rgba(27, 94, 63, 0.12)',
  heavy: '0 8px 24px rgba(27, 94, 63, 0.16)',
  premium: '0 12px 40px rgba(212, 165, 116, 0.15)',
};

export const BRAND_OPACITY = {
  emerald: {
    10: 'rgba(27, 94, 63, 0.1)',
    20: 'rgba(27, 94, 63, 0.2)',
    30: 'rgba(27, 94, 63, 0.3)',
    50: 'rgba(27, 94, 63, 0.5)',
  },
  gold: {
    10: 'rgba(212, 165, 116, 0.1)',
    20: 'rgba(212, 165, 116, 0.2)',
    30: 'rgba(212, 165, 116, 0.3)',
  },
};

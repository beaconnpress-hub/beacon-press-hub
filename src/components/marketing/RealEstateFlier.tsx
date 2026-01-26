'use client';

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { BRAND_COLORS, BRAND_GRADIENTS } from '@/lib/branding/colors';
import AYSmartLogo from './AYSmartLogo';

interface FlierData {
  title: string;
  location: string;
  size: string;
  pricePerPlot: string;
  pricePerAcre: string;
  titleType: string;
  highlights: string[];
  image?: string;
  phone: string;
  whatsapp: string;
  email: string;
}

interface RealEstateFlierProps {
  data: FlierData;
  format?: 'instagram-story' | 'facebook' | 'whatsapp' | 'digital' | 'print';
}

const formatDimensions = {
  'instagram-story': { width: 1080, height: 1920 },
  'facebook': { width: 1200, height: 628 },
  'whatsapp': { width: 1080, height: 1920 },
  'digital': { width: 1920, height: 1080 },
  'print': { width: 1024, height: 1280 },
};

export const RealEstateFlier: React.FC<RealEstateFlierProps> = ({ 
  data, 
  format = 'instagram-story' 
}) => {
  const flierRef = useRef<HTMLDivElement>(null);
  const dims = formatDimensions[format];

  const exportAsImage = async (filename: string) => {
    if (!flierRef.current) return;

    try {
      const canvas = await html2canvas(flierRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: BRAND_COLORS.warmCream,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = filename;
      link.click();
    } catch (error) {
      console.error('Error exporting flier:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Preview Container */}
      <div
        ref={flierRef}
        style={{
          width: `${dims.width}px`,
          height: `${dims.height}px`,
          background: BRAND_COLORS.warmCream,
        }}
        className="mx-auto rounded-lg shadow-2xl overflow-hidden relative"
      >
        {/* Gradient background */}
        <div
          style={{ background: BRAND_GRADIENTS.backgroundGradient }}
          className="absolute inset-0"
        />

        {/* Content */}
        <div className="relative h-full flex flex-col p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="scale-75">
              <AYSmartLogo variant="icon" size="sm" />
            </div>
            <div className="text-right">
              <h3
                className="text-sm font-black uppercase tracking-widest"
                style={{ color: BRAND_COLORS.emeraldGreen }}
              >
                Prime Investment
              </h3>
              <p
                className="text-xs"
                style={{ color: BRAND_COLORS.mediumGray }}
              >
                Opportunity
              </p>
            </div>
          </div>

          {/* Hero Section */}
          <div
            className="flex-1 rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative"
            style={{
              background: data.image
                ? `url(${data.image}) center/cover`
                : BRAND_GRADIENTS.primaryGradient,
            }}
          >
            {!data.image && (
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🏞️</div>
                <p className="text-sm font-bold">Beautiful Land Visualization</p>
              </div>
            )}
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Left Panel - Details */}
            <div>
              <h2
                className="text-2xl font-black mb-3 leading-tight"
                style={{ color: BRAND_COLORS.darkSlate }}
              >
                {data.title}
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <p
                    className="text-xs font-bold uppercase"
                    style={{ color: BRAND_COLORS.emeraldGreen }}
                  >
                    Location 📍
                  </p>
                  <p style={{ color: BRAND_COLORS.darkSlate }}>{data.location}</p>
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase"
                    style={{ color: BRAND_COLORS.emeraldGreen }}
                  >
                    Size
                  </p>
                  <p style={{ color: BRAND_COLORS.darkSlate }}>{data.size}</p>
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase"
                    style={{ color: BRAND_COLORS.richGold }}
                  >
                    Pricing 💰
                  </p>
                  <p className="font-bold" style={{ color: BRAND_COLORS.darkSlate }}>
                    {data.pricePerPlot}
                  </p>
                  <p className="text-xs" style={{ color: BRAND_COLORS.mediumGray }}>
                    {data.pricePerAcre}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase"
                    style={{ color: BRAND_COLORS.emeraldGreen }}
                  >
                    Title 🧰
                  </p>
                  <p style={{ color: BRAND_COLORS.darkSlate }}>{data.titleType}</p>
                </div>
              </div>
            </div>

            {/* Right Panel - Highlights */}
            <div
              className="rounded-lg p-4"
              style={{ background: `${BRAND_COLORS.emeraldGreen}15` }}
            >
              <h3
                className="text-lg font-black mb-3"
                style={{ color: BRAND_COLORS.emeraldGreen }}
              >
                Why Invest? 📊
              </h3>
              <ul className="space-y-2 text-xs">
                {data.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span
                      className="font-bold"
                      style={{ color: BRAND_COLORS.richGold }}
                    >
                      ✓
                    </span>
                    <span style={{ color: BRAND_COLORS.darkSlate }}>
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trust Signal */}
          <div
            className="rounded-lg p-3 mb-4 text-center"
            style={{ background: `${BRAND_COLORS.richGold}20` }}
          >
            <p
              className="text-xs font-black uppercase"
              style={{ color: BRAND_COLORS.darkSlate }}
            >
              🔐 SECURE YOUR INVESTMENT WITH CONFIDENCE!
            </p>
          </div>

          {/* CTA Section */}
          <div
            className="rounded-lg p-4 text-center text-white"
            style={{ background: BRAND_GRADIENTS.primaryGradient }}
          >
            <p className="text-sm font-black mb-2">📞 CONTACT US TODAY</p>
            <div className="space-y-1 text-xs">
              <p>Phone: {data.phone}</p>
              <p>WhatsApp: {data.whatsapp}</p>
              <p>Email: {data.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={() => exportAsImage(`flier-${data.title}.png`)}
          className="px-6 py-3 rounded-lg font-bold text-white transition"
          style={{ background: BRAND_COLORS.emeraldGreen }}
        >
          📥 Download Flier
        </button>
        <button
          onClick={() => navigator.share({
            title: data.title,
            text: `Check out this amazing real estate opportunity: ${data.title}`,
          })}
          className="px-6 py-3 rounded-lg font-bold text-white transition"
          style={{ background: BRAND_COLORS.richGold, color: BRAND_COLORS.darkSlate }}
        >
          📤 Share
        </button>
      </div>
    </div>
  );
};

export default RealEstateFlier;

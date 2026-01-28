'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import toast from 'react-hot-toast';
import { useAdminAuth, AdminLoadingSpinner } from '@/lib/useAdminAuth';
import RealEstateFlier from '@/components/marketing/RealEstateFlier';
import { BRAND_COLORS } from '@/lib/branding/colors';
import type { FlierData } from '@/lib/types';

interface FlierFormData {
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

const defaultHighlights = [
  'Strategic location with high appreciation potential',
  'Excellent road networks and accessibility',
  'Close to schools, hospitals, and commercial areas',
  'Professional surveying and documentation',
  'Flexible payment plans available',
];

export default function FlierGeneratorPage() {
  const router = useRouter();
  const { isAuthorized, loading } = useAdminAuth();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [format, setFormat] = useState<'instagram-story' | 'facebook' | 'whatsapp' | 'digital' | 'print'>('instagram-story');
  const [highlightInput, setHighlightInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FlierFormData>({
    title: 'Greenfield Estate Premium Plots',
    location: 'Lagos, Nigeria',
    size: '500 sqm - 5 Acres',
    pricePerPlot: '₦15,000,000 - ₦50,000,000',
    pricePerAcre: 'Per Acre: ₦3,000,000',
    titleType: 'Certified Survey, Government Approved',
    highlights: defaultHighlights,
    phone: '+234 813 627 2360',
    whatsapp: '+234 813 627 2360',
    email: 'admin@ayinvestmentltd.com',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()],
      }));
      setHighlightInput('');
    }
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleLogout = async () => {
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  const handleSave = async () => {
    setIsSaving(true);
    const flierData: FlierData = {
      title: formData.title,
      location: formData.location,
      price: formData.pricePerPlot,
      image_url: formData.image || '',
      features: formData.highlights,
      contact_info: {
        name: 'Agent',
        phone: formData.phone,
        email: formData.email,
      },
    };

    try {
      const { error } = await supabase.from('fliers').insert([flierData]);

      if (error) throw error;

      toast.success('Flier saved to library!');
      router.push('/admin/fliers');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save flier';
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return <AdminLoadingSpinner />
  }

  // Redirect if not authorized
  if (!isAuthorized) {
    return null
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{ background: BRAND_COLORS.warmCream }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1
            className="text-4xl font-black mb-2"
            style={{ color: BRAND_COLORS.darkSlate }}
          >
            🎨 Flier Generator
          </h1>
          <p style={{ color: BRAND_COLORS.mediumGray }}>
            Create professional property marketing fliers
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-3 rounded-lg font-bold text-white"
          style={{ background: BRAND_COLORS.deepEarthBrown }}
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div
            className="rounded-2xl p-6 shadow-lg sticky top-8"
            style={{ background: 'white', borderTop: `4px solid ${BRAND_COLORS.emeraldGreen}` }}
          >
            <h2
              className="text-xl font-black mb-6"
              style={{ color: BRAND_COLORS.emeraldGreen }}
            >
              Property Details
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-sm font-bold" style={{ color: BRAND_COLORS.darkSlate }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: BRAND_COLORS.emeraldGreen }}
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-bold" style={{ color: BRAND_COLORS.darkSlate }}>
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: BRAND_COLORS.emeraldGreen }}
                />
              </div>

              {/* Size */}
              <div>
                <label className="text-sm font-bold" style={{ color: BRAND_COLORS.darkSlate }}>
                  Plot Size Range *
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="e.g., 500 sqm - 5 Acres"
                  className="w-full mt-1 p-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: BRAND_COLORS.emeraldGreen }}
                />
              </div>

              {/* Pricing */}
              <div>
                <label className="text-sm font-bold" style={{ color: BRAND_COLORS.darkSlate }}>
                  Price Per Plot *
                </label>
                <input
                  type="text"
                  name="pricePerPlot"
                  value={formData.pricePerPlot}
                  onChange={handleInputChange}
                  placeholder="₦15,000,000 - ₦50,000,000"
                  className="w-full mt-1 p-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: BRAND_COLORS.emeraldGreen }}
                />
              </div>

              {/* Price Per Acre */}
              <div>
                <label className="text-sm font-bold" style={{ color: BRAND_COLORS.darkSlate }}>
                  Price Per Acre *
                </label>
                <input
                  type="text"
                  name="pricePerAcre"
                  value={formData.pricePerAcre}
                  onChange={handleInputChange}
                  placeholder="Per Acre: ₦3,000,000"
                  className="w-full mt-1 p-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: BRAND_COLORS.emeraldGreen }}
                />
              </div>

              {/* Title Type */}
              <div>
                <label className="text-sm font-bold" style={{ color: BRAND_COLORS.darkSlate }}>
                  Title Type / Documentation *
                </label>
                <input
                  type="text"
                  name="titleType"
                  value={formData.titleType}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: BRAND_COLORS.emeraldGreen }}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="text-sm font-bold" style={{ color: BRAND_COLORS.darkSlate }}>
                  Hero Image URL (optional)
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://..."
                  className="w-full mt-1 p-3 border-2 rounded-lg focus:outline-none text-xs"
                  style={{ borderColor: BRAND_COLORS.emeraldGreen }}
                />
              </div>

              {/* Contact Info */}
              <div>
                <label className="text-sm font-bold" style={{ color: BRAND_COLORS.darkSlate }}>
                  Phone *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: BRAND_COLORS.emeraldGreen }}
                />
              </div>

              <div>
                <label className="text-sm font-bold" style={{ color: BRAND_COLORS.darkSlate }}>
                  WhatsApp *
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: BRAND_COLORS.emeraldGreen }}
                />
              </div>

              <div>
                <label className="text-sm font-bold" style={{ color: BRAND_COLORS.darkSlate }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: BRAND_COLORS.emeraldGreen }}
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="text-sm font-bold" style={{ color: BRAND_COLORS.darkSlate }}>
                  Investment Highlights
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                    placeholder="Add a highlight..."
                    className="flex-1 p-2 border-2 rounded text-sm focus:outline-none"
                    style={{ borderColor: BRAND_COLORS.emeraldGreen }}
                  />
                  <button
                    onClick={addHighlight}
                    className="px-3 py-2 rounded font-bold text-white text-sm"
                    style={{ background: BRAND_COLORS.richGold }}
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {formData.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start p-2 rounded text-sm"
                      style={{ background: `${BRAND_COLORS.emeraldGreen}10` }}
                    >
                      <span style={{ color: BRAND_COLORS.darkSlate }}>{highlight}</span>
                      <button
                        onClick={() => removeHighlight(idx)}
                        className="text-red-500 font-bold hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Format Selector */}
              <div>
                <label className="text-sm font-bold" style={{ color: BRAND_COLORS.darkSlate }}>
                  Export Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full mt-2 p-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: BRAND_COLORS.emeraldGreen }}
                >
                  <option value="instagram-story">📱 Instagram Story (1080x1920)</option>
                  <option value="facebook">👍 Facebook Feed (1200x628)</option>
                  <option value="whatsapp">💬 WhatsApp (1080x1920)</option>
                  <option value="digital">🖥️ Digital Display (1920x1080)</option>
                  <option value="print">🖨️ Print Ready (1024x1280)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: 'white' }}
          >
            <h2
              className="text-xl font-black mb-6"
              style={{ color: BRAND_COLORS.richGold }}
            >
              Live Preview
            </h2>
            <div className="overflow-auto flex justify-center">
              <RealEstateFlier data={formData} format={format} />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t" style={{ borderColor: BRAND_COLORS.emeraldGreen }}>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-6 py-3 rounded font-bold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: isSaving ? '#888' : BRAND_COLORS.richGold }}
              >
                {isSaving ? 'Saving...' : '💾 Save Design to Library'}
              </button>
              <button
                onClick={() => {
                  // Download functionality could be added here
                  toast.success('Download feature coming soon!')
                }}
                className="flex-1 px-6 py-3 rounded font-bold text-white transition"
                style={{ background: BRAND_COLORS.emeraldGreen }}
              >
                📥 Download Image
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <div
          className="rounded-2xl p-6"
          style={{ background: `${BRAND_COLORS.emeraldGreen}10`, borderLeft: `4px solid ${BRAND_COLORS.emeraldGreen}` }}
        >
          <h3
            className="text-lg font-black mb-4"
            style={{ color: BRAND_COLORS.emeraldGreen }}
          >
            💡 Pro Tips for Maximum Impact
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex gap-3">
              <span className="text-xl">🎯</span>
              <div>
                <p className="font-bold" style={{ color: BRAND_COLORS.darkSlate }}>Use High-Quality Images</p>
                <p className="text-sm" style={{ color: BRAND_COLORS.mediumGray }}>
                  Aerial views and landscape photos perform best
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-bold" style={{ color: BRAND_COLORS.darkSlate }}>Highlight Key Benefits</p>
                <p className="text-sm" style={{ color: BRAND_COLORS.mediumGray }}>
                  Focus on ROI, accessibility, and growth potential
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">📱</span>
              <div>
                <p className="font-bold" style={{ color: BRAND_COLORS.darkSlate }}>Share Across Platforms</p>
                <p className="text-sm" style={{ color: BRAND_COLORS.mediumGray }}>
                  Use format selector for each social media platform
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">🔄</span>
              <div>
                <p className="font-bold" style={{ color: BRAND_COLORS.darkSlate }}>Regular Updates</p>
                <p className="text-sm" style={{ color: BRAND_COLORS.mediumGray }}>
                  Refresh fliers weekly with new properties
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

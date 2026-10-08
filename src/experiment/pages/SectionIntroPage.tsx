import React from 'react';
import { Slide } from '../types';
import { SlideImage, TeachMeIcon } from '../TeachMeIcons';
import { findBestVisualMatch } from '../../utils/visualLibraryMatcher';

export const SectionIntroPage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  const sec = slide.sec || 'PREPARE • Prerequisites';

  // Process slide fl items dynamically from extracted SOP
  const rawItems: string[] = slide.fl || [
    'Workstation & SOP guide verified',
    'Required equipment and tools active',
    'Safety checks & credentials cleared',
  ];

  const fallbackImages = [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=300&q=80',
  ];

  const items = rawItems.map((raw, idx) => {
    const parts = raw.split(/(?<!\d)[:\-\–](?!\d)\s*/);
    let title = '';
    let subtitle = '';

    if (parts.length > 1 && parts[0].trim().length < 50) {
      title = parts[0]?.trim();
      subtitle = parts.slice(1).join(' ').trim();
    } else {
      const words = raw.trim().split(/\s+/);
      if (words.length > 6) {
        title = words.slice(0, 5).join(' ');
        subtitle = words.slice(5).join(' ');
      } else {
        title = raw.trim();
        subtitle = 'Mandatory SOP prerequisite verification before starting execution.';
      }
    }

    // Ensure title and subtitle are properly formatted and distinct
    title = title.charAt(0).toUpperCase() + title.slice(1);
    subtitle = subtitle.charAt(0).toUpperCase() + subtitle.slice(1);

    const isProhibited =
      raw.toLowerCase().includes('never') ||
      raw.toLowerCase().includes('do not') ||
      raw.toLowerCase().includes('don\'t') ||
      raw.toLowerCase().includes('prohibit') ||
      raw.toLowerCase().includes('bypass');

    // Run custom dynamic visual match on this specific item text for high-fidelity thumbnails
    const itemMatch = findBestVisualMatch(raw, slide.title || '');
    const itemImg = itemMatch.url || fallbackImages[idx % fallbackImages.length];

    return {
      title,
      subtitle,
      img: itemImg,
      status: isProhibited ? 'prohibited' : 'check',
    };
  });

  return (
    <div className="space-y-4">
      {/* Stage Badge */}
      <div className="flex items-center gap-2">
        <span className="pill stage-prepare-pill">
          <TeachMeIcon name="check" className="w-3.5 h-3.5 inline mr-1" />
          Prerequisites & Preparation
        </span>
      </div>

      {/* Headline Header */}
      <div>
        <h2 className="text-2xl font-black text-amber-600 tracking-tight leading-none mb-1">
          Critical checks
        </h2>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
          before you proceed
        </h3>
      </div>

      {slide.content && (
        <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
          {slide.content}
        </p>
      )}

      {/* Horizontal Cards with Right-Side Image Thumbnails (Screenshot 1 Layout) */}
      <div className="space-y-3 pt-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all gap-3"
          >
            {/* Left Column: Green Checkmark Badge + Text */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <span className="flex-none w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs mt-0.5">
                ✓
              </span>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-slate-900 leading-tight">
                  {item.title}
                </h4>
                <p className="text-xs font-medium text-slate-500 leading-snug">
                  {item.subtitle}
                </p>
              </div>
            </div>

            {/* Right Column: Square Photo Thumbnail with Badge Overlay */}
            <div className="relative flex-none w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-inner">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback vector icon
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              {item.status === 'prohibited' ? (
                <div className="absolute inset-0 bg-rose-900/20 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-lg border-2 border-white shadow-md">
                    ⊘
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-[10px] border border-white shadow-xs">
                  ✓
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


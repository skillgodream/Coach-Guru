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

      {/* Vertical Timeline Step-by-Step Checklist (Screenshot 2 Format) */}
      <div className="space-y-1 pt-1 relative">
        {items.map((item, idx) => (
          <div key={idx} className="relative flex gap-4">
            
            {/* Timeline Vertical Connecting Line */}
            {idx < items.length - 1 && (
              <div 
                className="absolute left-4 top-8 bottom-0 w-[2px] bg-slate-200/80" 
                style={{ transform: 'translateX(-50%)' }} 
              />
            )}

            {/* Left Column: Sequential Number Badge */}
            <div className="flex-none relative">
              <span className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs relative z-10">
                {idx + 1}
              </span>
            </div>

            {/* Right Column: Title + Subtitle + Large Step Image */}
            <div className="flex-1 space-y-3 pb-6">
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-slate-900 leading-tight">
                  {item.title}
                </h4>
                <p className="text-xs font-semibold text-slate-500 leading-snug">
                  {item.subtitle}
                </p>
              </div>

              {/* Large Rounded Image underneath text */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs max-w-sm">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to hidden
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                
                {/* Status Badge Overlay inside image */}
                {item.status === 'prohibited' ? (
                  <div className="absolute inset-0 bg-rose-950/20 backdrop-blur-[0.5px] flex items-center justify-center">
                    <div className="px-3 py-1.5 rounded-full bg-rose-600 text-white flex items-center gap-1.5 font-extrabold text-[10px] border border-white/40 shadow-md">
                      <span>⊘ Prohibited Action</span>
                    </div>
                  </div>
                ) : (
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-emerald-500 text-white flex items-center gap-1 font-bold text-[9px] border border-white/30 shadow-2xs">
                    ✓ Verified Check
                  </div>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};


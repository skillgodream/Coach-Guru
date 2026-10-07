import React from 'react';
import { Slide } from '../types';
import { SlideImage, TeachMeIcon } from '../TeachMeIcons';

export const SectionIntroPage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  const sec = slide.sec || 'PREPARE • Prerequisites';

  // Sample checklist items with right-hand visual cards matching Screenshot 1
  const defaultItems = [
    {
      title: 'Dilute Sanitizer (1:10 ratio)',
      subtitle: 'Measure chemical accurately into blue applicator bottle.',
      img: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=300&q=80',
      status: 'check',
    },
    {
      title: 'Microfibre Cloths Ready',
      subtitle: 'Color-coded microfibre cloths for surface sanitization.',
      img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=300&q=80',
      status: 'check',
    },
    {
      title: 'Never Spray Directly Over Dirt',
      subtitle: 'Wipe visible debris before applying disinfectant spray.',
      img: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=300&q=80',
      status: 'prohibited',
    },
  ];

  // Process slide fl items
  const rawItems: string[] = slide.fl || [
    'Gloves on & PPE active',
    'Sanitizer 1:10 in blue bottle',
    'Microfibre cloths ready',
  ];

  const items = defaultItems.slice(0, rawItems.length).map((def, idx) => ({
    ...def,
    title: rawItems[idx] || def.title,
  }));

  return (
    <div className="space-y-4">
      {/* Stage Badge */}
      <div className="flex items-center gap-2">
        <span className="pill stage-prepare-pill">
          <TeachMeIcon name="check" className="w-3.5 h-3.5 inline mr-1" />
          THE CURRENT STAGE: STAGE 2 OF 8 • PREPARE (Prerequisites & Setup)
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


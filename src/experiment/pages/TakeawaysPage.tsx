import React from 'react';
import { Slide } from '../types';
import { TeachMeIcon } from '../TeachMeIcons';

export const TakeawaysPage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  let items = slide.items;
  if (!items || items.length === 0) {
    items = slide.content
      .split('\n')
      .map((l) => l.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(Boolean);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="pill stage-prove-pill">
          <TeachMeIcon name="bulb" className="w-3.5 h-3.5 inline mr-1" />
          THE CURRENT STAGE: STAGE 8 OF 8 • PROVE (Recall & Retention Check)
        </span>
      </div>

      <h2 className="text-xl font-extrabold text-[#0F1B3D] tracking-tight leading-snug">
        Key Takeaways & Retention Checks
      </h2>

      <div className="bg-gradient-to-br from-amber-50 via-amber-100/40 to-yellow-50 rounded-2xl p-4 border border-amber-200/90 shadow-xs space-y-2.5">
        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block pb-1 border-b border-amber-200/60">
          Essential Operational Rules
        </span>

        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-white/90 p-3 rounded-xl border border-amber-100 shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              ✓
            </span>
            <span className="text-xs font-bold text-amber-950 leading-relaxed">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

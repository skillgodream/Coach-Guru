import React from 'react';
import { Slide } from '../types';
import { SlideImage, TeachMeIcon } from '../TeachMeIcons';

export const ImportantRulePage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  let why =
    slide.why ||
    slide.gurujiCoaching?.whyItMatters ||
    'Safety and compliance boundary. Never bypass standard verification checks.';

  if (slide.title && why.trim().toLowerCase() === slide.title.trim().toLowerCase()) {
    why = 'Non-negotiable operational control: skipping this check leads to compliance violations, inventory/process discrepancies, and safety risks.';
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="pill stage-control-pill">
          <TeachMeIcon name="warn" className="w-3.5 h-3.5 inline mr-1" />
          Mandatory Quality Rule
        </span>
      </div>

      <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 rounded-2xl p-4.5 border-2 border-rose-200/90 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-rose-800">
          <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0">
            !
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-rose-700">
            Mandatory Quality Control
          </span>
        </div>

        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
          {slide.title}
        </h2>

        {slide.img && (
          <SlideImage
            icon={slide.ic || 'warn'}
            slash={true}
            img={slide.img}
            alt={slide.alt}
          />
        )}

        <div className="bg-white/90 rounded-xl p-3.5 border border-rose-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
            <TeachMeIcon name="bulb" className="w-3.5 h-3.5 text-amber-600 inline" />
            Why It Matters
          </span>
          <p className="text-sm font-semibold text-slate-800 leading-snug">
            {why}
          </p>
        </div>
      </div>
    </div>
  );
};

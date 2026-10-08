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
      {/* Zero-Pill refined metadata label */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 tracking-wider uppercase">
        <TeachMeIcon name="warn" className="w-3.5 h-3.5 text-rose-500" />
        <span>Mandatory Quality Rule</span>
      </div>

      {/* Premium, sleek card container (refined solid rose tints, 1px thin border) */}
      <div className="bg-rose-50/60 rounded-2xl p-4.5 border border-rose-100 shadow-sm space-y-4">
        <div className="flex items-center gap-1.5 text-rose-800">
          <span className="w-5 h-5 rounded-md bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
            !
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-rose-700">
            Mandatory Quality Control
          </span>
        </div>

        {slide.img ? (
          /* Side-by-side grid format for image and text on critical checks */
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Left/Top: Image Side */}
            <div className="sm:col-span-5 w-full">
              <SlideImage
                icon={slide.ic || 'warn'}
                slash={true}
                img={slide.img}
                alt={slide.alt}
              />
            </div>
            {/* Right/Bottom: Text Side */}
            <div className="sm:col-span-7 space-y-3">
              <h2 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                {slide.title}
              </h2>
              <div className="bg-white rounded-xl p-3.5 border border-rose-100/80 shadow-2xs space-y-1.5">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <TeachMeIcon name="bulb" className="w-3.5 h-3.5 text-amber-500 inline" />
                  Why It Matters
                </span>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  {why}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Text-only format */
          <div className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
              {slide.title}
            </h2>
            <div className="bg-white rounded-xl p-3.5 border border-rose-100/80 shadow-2xs space-y-1.5">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <TeachMeIcon name="bulb" className="w-3.5 h-3.5 text-amber-500 inline" />
                Why It Matters
              </span>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {why}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

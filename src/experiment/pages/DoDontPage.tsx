import React from 'react';
import { Slide } from '../types';
import { TeachMeIcon } from '../TeachMeIcons';

export const DoDontPage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  const dos = slide.dos || slide.comparison?.do || [
    'Verify identity with name and DOB',
    'Follow standard process flow',
  ];
  const donts = slide.donts || slide.comparison?.dont || [
    'Skip verification checks',
    'Collect from unverified patient',
  ];

  return (
    <div className="space-y-4">
      {/* Zero-Pill premium metadata label */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 tracking-wider uppercase">
        <TeachMeIcon name="check" className="w-3.5 h-3.5 text-rose-500" />
        <span>Operational Boundaries</span>
      </div>

      <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
        {slide.title || 'Do & Don’t Compliance Guidelines'}
      </h2>

      <div className="space-y-3.5">
        {/* DO Card */}
        <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-emerald-100">
            <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              <TeachMeIcon name="check" className="w-3 h-3 stroke-[3]" />
            </span>
            <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
              DO (Compliant Protocol)
            </span>
          </div>

          <div className="space-y-2">
            {dos.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-white/90 p-2.5 rounded-xl border border-emerald-50 shadow-2xs">
                <span className="w-4 h-4 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-xs font-semibold text-slate-700 leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* DON'T Card */}
        <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-rose-100">
            <span className="w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              <TeachMeIcon name="x" className="w-3 h-3 stroke-[3]" />
            </span>
            <span className="text-xs font-black text-rose-800 uppercase tracking-wider">
              DON’T (Prohibited Failure Modes)
            </span>
          </div>

          <div className="space-y-2">
            {donts.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-white/90 p-2.5 rounded-xl border border-rose-50 shadow-2xs">
                <span className="w-4 h-4 rounded-md bg-rose-500 text-white flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                  ✕
                </span>
                <span className="text-xs font-semibold text-slate-700 leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

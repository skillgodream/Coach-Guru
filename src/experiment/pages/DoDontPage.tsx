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
      <div className="flex items-center gap-2">
        <span className="pill stage-control-pill">
          <TeachMeIcon name="check" className="w-3.5 h-3.5 inline mr-1" />
          Operational Boundaries
        </span>
      </div>

      <h2 className="text-xl font-extrabold text-[#0F1B3D] tracking-tight leading-snug">
        {slide.title || 'Do & Don’t Compliance Guidelines'}
      </h2>

      <div className="space-y-3">
        {/* DO Card */}
        <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/90 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 pb-2 border-b border-emerald-200/60">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              <TeachMeIcon name="check" className="w-3.5 h-3.5 stroke-[3]" />
            </span>
            <span className="text-sm font-extrabold text-emerald-950 uppercase tracking-wider">
              DO (Compliant Protocol)
            </span>
          </div>

          <div className="space-y-2">
            {dos.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-white/90 p-2.5 rounded-xl border border-emerald-100">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-xs font-bold text-emerald-950 leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* DON'T Card */}
        <div className="bg-rose-50/80 rounded-2xl p-4 border border-rose-200/90 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 pb-2 border-b border-rose-200/60">
            <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
              <TeachMeIcon name="x" className="w-3.5 h-3.5 stroke-[3]" />
            </span>
            <span className="text-sm font-extrabold text-rose-950 uppercase tracking-wider">
              DON’T (Prohibited Failure Modes)
            </span>
          </div>

          <div className="space-y-2">
            {donts.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-white/90 p-2.5 rounded-xl border border-rose-100">
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✕
                </span>
                <span className="text-xs font-bold text-rose-950 leading-relaxed">
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

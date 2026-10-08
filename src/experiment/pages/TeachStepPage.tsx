import React from 'react';
import { Slide } from '../types';
import { SlideImage, TeachMeIcon } from '../TeachMeIcons';

export const TeachStepPage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  const stepLabel = slide.step || slide.evidenceSource || 'PERFORM • Operational Step';
  const icon = slide.ic || 'bottle';

  let items = slide.items;
  if (!items || items.length === 0) {
    items = slide.content
      .split('\n')
      .map((l) => l.replace(/^[\*\-•]\s*/, '').trim())
      .filter(Boolean);
    if (items.length === 0 && slide.content) {
      items = [slide.content];
    }
  }

  return (
    <div className="space-y-4">
      {/* Zero-Pill premium metadata label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 tracking-wider uppercase">
          <TeachMeIcon name="arrow" className="w-3.5 h-3.5 text-indigo-500 rotate-90" />
          <span>{slide.step || 'Standard Operational Protocol'}</span>
        </div>
        {slide.evidenceSource && !slide.evidenceSource.startsWith('S1.') && !slide.evidenceSource.startsWith('S2.') && (
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50/60 border border-indigo-100 px-2.5 py-1 rounded-full">
            {slide.evidenceSource}
          </span>
        )}
      </div>

      <h2 className="text-xl font-black text-[#0F1B3D] tracking-tight leading-snug">
        {slide.title}
      </h2>

      {slide.img && (
        <SlideImage icon={icon} typeModifier="t" img={slide.img} alt={slide.alt} />
      )}

      {/* Structured Action Items Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2.5">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block pb-1 border-b border-slate-100">
          Required Actions
        </span>

        {items.map((item, idx) => {
          // Highlight active lead verbs if present
          const parts = item.match(/^([A-Z][a-z]+(?:\s+[a-z]+)?)(.*)/);
          const leadVerb = parts ? parts[1] : '';
          const rest = parts ? parts[2] : item;

          return (
            <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/40 border border-slate-100">
              {/* Premium sleek numbering tag */}
              <span className="flex-none w-6 h-6 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm text-[#0F1B3D] leading-snug">
                {leadVerb ? (
                  <>
                    <strong className="font-extrabold text-indigo-700">{leadVerb}</strong>
                    <span>{rest}</span>
                  </>
                ) : (
                  <span>{item}</span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Slide } from '../types';
import { SlideImage, TeachMeIcon } from '../TeachMeIcons';

export const ObjectivesPage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  const lead = slide.lead || 'By the end of this lesson, you will be able to:';
  
  // Extract items from slide.items or from slide.content if formatted with newlines/numbers
  let items = slide.items;
  if (!items || items.length === 0) {
    items = slide.content
      .split('\n')
      .map((line) => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(Boolean);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="pill stage-orient-pill">
          <TeachMeIcon name="target" className="w-3.5 h-3.5 inline mr-1" />
          What You Will Learn
        </span>
      </div>

      <h2 className="text-xl font-extrabold text-[#0F1B3D] tracking-tight leading-snug">
        {slide.title || 'Lesson Objectives'}
      </h2>
      
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {lead}
      </p>

      {slide.img && (
        <SlideImage
          icon="target"
          img={slide.img}
          alt={slide.alt}
        />
      )}

      <div className="space-y-2.5 mt-3">
        {items.map((item, j) => (
          <div 
            key={j}
            className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-indigo-100/80 shadow-xs hover:border-indigo-200 transition-all"
          >
            <span className="flex-none w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              {j + 1}
            </span>
            <span className="text-sm font-semibold text-[#0F1B3D] leading-relaxed pt-0.5">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

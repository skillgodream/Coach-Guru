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
      {/* Zero-Pill premium metadata label */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 tracking-wider uppercase">
        <TeachMeIcon name="target" className="w-3.5 h-3.5 text-indigo-600" />
        <span>What You Will Learn</span>
      </div>

      <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
        {slide.title || 'Lesson Objectives'}
      </h2>
      
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
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
            className="flex items-start gap-3.5 p-3.5 bg-white rounded-xl border border-slate-100 shadow-xs hover:border-indigo-100 hover:shadow-sm transition-all duration-200"
          >
            {/* Sophisticated neutral-indigo numbering badge instead of chunky colored circle */}
            <span className="flex-none w-6 h-6 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
              {j + 1}
            </span>
            <span className="text-sm font-semibold text-slate-700 leading-relaxed">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Slide } from '../types';
import { TeachMeIcon } from '../TeachMeIcons';

export const CompletionPage: React.FC<{
  slide: Slide;
  onNext: () => void;
}> = ({ slide, onNext }) => {
  const nextTitle = slide.next || 'Next Mode: Guide Me';
  const nextSubtitle = slide.nb || 'Practise the steps with live coach guidance beside you.';

  return (
    <div className="flex flex-col items-center text-center space-y-4 py-4">
      <div className="w-20 h-20 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm animate-bounce">
        <TeachMeIcon name="party" className="w-10 h-10" />
      </div>

      <div className="space-y-1">
        <span className="pill stage-prove-pill inline-block">
          THE CURRENT STAGE: STAGE 8 OF 8 • PROVE (Operational Transition)
        </span>
        <h2 className="text-2xl font-black text-[#0F1B3D] tracking-tight">
          {slide.title || 'Theory Mastery Achieved!'}
        </h2>
        <p className="text-sm font-medium text-slate-600 max-w-xs mx-auto leading-relaxed">
          {slide.content || "You've reviewed the operational logic. Ready for interactive floor practice?"}
        </p>
      </div>

      <button 
        onClick={onNext}
        className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-left transition-all cursor-pointer border border-indigo-500"
      >
        <div>
          <b className="text-base font-extrabold text-white block">{nextTitle}</b>
          <p className="text-xs text-indigo-100 font-medium leading-tight mt-0.5">
            {nextSubtitle}
          </p>
        </div>
        <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
          <TeachMeIcon name="arrow" className="w-5 h-5" />
        </span>
      </button>
    </div>
  );
};

import React from 'react';
import { Slide } from '../types';
import { TeachMeIcon } from '../TeachMeIcons';

export const ScenarioPage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  // Use a clean, domain-appropriate default or generic icon image if no slide image
  const heroImg = slide.img || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-4">
      {/* Zero-Pill premium metadata label */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 tracking-wider uppercase">
        <TeachMeIcon name="bulb" className="w-3.5 h-3.5 text-amber-500" />
        <span>Frontline Workplace Scenario</span>
      </div>

      {/* Main Orange/Red Title Banner */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
          {slide.title || 'Dust on the surface.'}
        </h2>
        <p className="text-xs font-black text-amber-600 tracking-wider uppercase mt-1">
          Frontline SOP Exception Trigger
        </p>
      </div>

      {/* Hero Character Image Card (Premium split layout styling) */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 shadow-md aspect-16/10 flex items-end">
        <img
          src={heroImg}
          alt="Workplace situation"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        {/* Speech / Context Overlay */}
        <div className="relative z-10 p-3.5 m-3 bg-white/95 backdrop-blur-md rounded-xl border border-slate-100 shadow-lg text-slate-900 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">
            Operational Situation:
          </span>
          <p className="text-xs font-bold leading-relaxed text-slate-800">
            {slide.content || 'You are about to spray a surface and notice visible dust and debris. Direct spraying will block disinfectant contact.'}
          </p>
        </div>
      </div>

      {/* Bottom Prompt Callout Card */}
      <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 space-y-2">
        <div className="flex items-center gap-2 text-amber-950 font-black text-xs uppercase tracking-wider">
          <span className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
            ?
          </span>
          <span>What is the compliant decision?</span>
        </div>
        <p className="text-xs font-medium text-slate-600 pl-7">
          Proceed to the next slide to test your decision according to SOP protocol.
        </p>
      </div>
    </div>
  );
};

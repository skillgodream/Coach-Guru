import React from 'react';
import { Slide } from '../types';
import { TeachMeIcon } from '../TeachMeIcons';

export const ScenarioPage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  const heroImg = slide.img || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-4">
      {/* Stage Badge */}
      <div className="flex items-center gap-2">
        <span className="pill stage-decide-pill">
          <TeachMeIcon name="bulb" className="w-3.5 h-3.5 inline mr-1" />
          THE CURRENT STAGE: STAGE 5 OF 8 • DECIDE (Frontline Workplace Scenario)
        </span>
      </div>

      {/* Main Orange/Red Title Banner matching Screenshot 3 */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
          {slide.title || 'Dust on the surface.'}
        </h2>
        <p className="text-sm font-black text-amber-600 tracking-tight">
          Frontline SOP Exception Trigger
        </p>
      </div>

      {/* Hero Character Image Card (Screenshot 3 Layout) */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-md aspect-4/3 flex items-end">
        <img
          src={heroImg}
          alt="Housekeeper facing workplace situation"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

        {/* Speech / Context Overlay */}
        <div className="relative z-10 p-4 m-3 bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 shadow-lg text-slate-900 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">
            Operational Situation:
          </span>
          <p className="text-xs font-bold leading-relaxed">
            {slide.content || 'You are about to spray a surface and notice visible dust and debris. Direct spraying will block disinfectant contact.'}
          </p>
        </div>
      </div>

      {/* Bottom Prompt Callout Card */}
      <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-300/80 space-y-2">
        <div className="flex items-center gap-2 text-amber-950 font-black text-xs uppercase tracking-wider">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
            ?
          </span>
          <span>What is the compliant decision?</span>
        </div>
        <p className="text-xs font-medium text-slate-600 pl-8">
          Proceed to the next slide to test your decision according to SOP protocol.
        </p>
      </div>
    </div>
  );
};


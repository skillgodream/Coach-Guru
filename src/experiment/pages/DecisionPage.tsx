import React, { useState } from 'react';
import { Slide } from '../types';
import { TeachMeIcon } from '../TeachMeIcons';

export const DecisionPage: React.FC<{
  slide: Slide;
  onChoiceSelect: (isCorrect: boolean, feedback: string) => void;
  feedback?: string | null;
  onNext?: () => void;
}> = ({ slide, onChoiceSelect, feedback }) => {
  const [selectedIndices, setSelectedIndices] = useState<Record<number, boolean>>({});
  const [feedbackText, setFeedbackText] = useState<string>(
    feedback || 'Select an option to evaluate your judgment according to SOP.'
  );
  const [isSolved, setIsSolved] = useState<boolean>(false);

  // Normalize choices: either slide.opts or slide.choices
  const options = (slide.opts || []).length > 0
    ? (slide.opts || []).map((o) => ({
        text: o.t,
        why: o.why,
        isCorrect: Boolean(o.ok),
      }))
    : (slide.choices || []).map((c) => ({
        text: c.text,
        why: c.feedback || c.why || '',
        isCorrect: c.isCorrect,
      }));

  const handlePick = (index: number) => {
    if (isSolved) return;

    const opt = options[index];
    if (!opt) return;

    setSelectedIndices((prev) => ({ ...prev, [index]: true }));
    setFeedbackText(opt.why);

    if (opt.isCorrect) {
      setIsSolved(true);
      onChoiceSelect(true, opt.why);
    } else {
      onChoiceSelect(false, opt.why);
    }
  };

  const letterLabels = ['A', 'B', 'C', 'D'];
  const heroImage = slide.img || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80';
  const speechText = slide.content || 'I see visible dust on the surface. Should I spray sanitizer directly or wipe first?';

  return (
    <div className="space-y-4">
      {/* Zero-Pill premium metadata label */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 tracking-wider uppercase">
        <TeachMeIcon name="bulb" className="w-3.5 h-3.5 text-amber-500" />
        <span>Decision & Judgment Point</span>
      </div>

      {/* Main Title Banner */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
          {slide.title || 'What should you do?'}
        </h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
          Evaluate room sanitization condition
        </p>
      </div>

      {/* Hero Housekeeper Portrait Banner with Speech Bubble Overlay */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 shadow-sm aspect-16/10 flex items-end">
        <img
          src={heroImage}
          alt="Housekeeper evaluating room situation"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-95"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

        {/* Integrated Speech Bubble Overlay on Image */}
        <div className="relative z-10 p-3.5 m-3 bg-white/95 backdrop-blur-md rounded-xl border border-slate-100 shadow-md text-slate-900 max-w-[92%] space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-600 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            Housekeeper Dilemma:
          </div>
          <p className="text-xs font-bold leading-relaxed text-slate-800">
            "{speechText}"
          </p>
        </div>
      </div>

      {/* Choice Options with letter badges */}
      <div className="space-y-2.5 pt-1">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          What is the correct SOP choice?
        </div>

        {options.map((opt, j) => {
          const wasClicked = selectedIndices[j];
          let borderBgClass = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300 hover:shadow-xs';

          if (wasClicked) {
            if (opt.isCorrect) {
              borderBgClass = 'bg-emerald-50/50 border-emerald-400 text-emerald-950 font-semibold shadow-2xs';
            } else {
              borderBgClass = 'bg-rose-50/50 border-rose-300 text-rose-950 opacity-90';
            }
          }

          return (
            <button
              key={j}
              disabled={isSolved && !wasClicked}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${borderBgClass}`}
              onClick={() => handlePick(j)}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-md flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                  wasClicked && opt.isCorrect
                    ? 'bg-emerald-600 text-white'
                    : wasClicked && !opt.isCorrect
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-50 text-slate-500 border border-slate-200 font-bold'
                }`}>
                  {letterLabels[j] || j + 1}
                </span>

                <span className="text-xs sm:text-sm font-semibold leading-relaxed">
                  {opt.text}
                </span>
              </div>

              {wasClicked && (
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-black shrink-0 ${
                  opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}>
                  {opt.isCorrect ? '✓' : '✕'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Rationale / Feedback Box */}
      {feedbackText && (
        <div className={`p-3.5 rounded-xl border text-xs font-semibold leading-relaxed transition-all duration-200 ${
          isSolved 
            ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950 shadow-2xs'
            : Object.keys(selectedIndices).length > 0
            ? 'bg-rose-50/50 border-rose-200 text-rose-950'
            : 'bg-amber-50/50 border-amber-200 text-amber-950'
        }`}>
          <span className="font-extrabold uppercase tracking-wider block mb-0.5 text-[9px]">
            {isSolved ? '✓ Compliant Rationale:' : Object.keys(selectedIndices).length > 0 ? '✕ SOP Hazard:' : 'Guidance:'}
          </span>
          <span>{feedbackText}</span>
        </div>
      )}
    </div>
  );
};

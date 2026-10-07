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
      {/* Header Stage Pill */}
      <div className="flex items-center gap-2">
        <span className="pill stage-decide-pill">
          <TeachMeIcon name="bulb" className="w-3.5 h-3.5 inline mr-1" />
          THE CURRENT STAGE: STAGE 6 OF 8 • HANDLE & ESCALATE (Evaluated Frontline Judgment)
        </span>
      </div>

      {/* Main Title Banner matching Screenshot 2 / 3 */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
          {slide.title || 'What should you do?'}
        </h2>
        <p className="text-sm font-black text-amber-600 tracking-tight">
          Evaluate room sanitization condition
        </p>
      </div>

      {/* Hero Housekeeper Portrait Banner with Speech Bubble Overlay (Screenshot 2 Layout) */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-sm aspect-4/3 sm:aspect-16/9 flex items-end">
        <img
          src={heroImage}
          alt="Housekeeper evaluating room situation"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

        {/* Integrated Speech Bubble Overlay on Image */}
        <div className="relative z-10 p-3.5 m-3 bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 shadow-lg text-slate-900 max-w-[90%] space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-amber-600 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Housekeeper Dilemma:
          </div>
          <p className="text-xs font-bold leading-snug">
            "{speechText}"
          </p>
        </div>
      </div>

      {/* Choice Options with Circle A, B, C Badges (Screenshot 2 Layout) */}
      <div className="space-y-2.5 pt-1">
        <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          What should you do?
        </div>

        {options.map((opt, j) => {
          const wasClicked = selectedIndices[j];
          let borderBgClass = 'bg-white border-slate-200/90 text-slate-800 hover:border-amber-400 hover:shadow-xs';

          if (wasClicked) {
            if (opt.isCorrect) {
              borderBgClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs';
            } else {
              borderBgClass = 'bg-rose-50 border-rose-400 text-rose-950 opacity-90';
            }
          }

          return (
            <button
              key={j}
              disabled={isSolved && !wasClicked}
              className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${borderBgClass}`}
              onClick={() => handlePick(j)}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                  wasClicked && opt.isCorrect
                    ? 'bg-emerald-600 text-white'
                    : wasClicked && !opt.isCorrect
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}>
                  {letterLabels[j] || j + 1}
                </span>

                <span className="text-xs sm:text-sm font-bold leading-tight">
                  {opt.text}
                </span>
              </div>

              {wasClicked && (
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
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
        <div className={`p-3.5 rounded-2xl border text-xs font-semibold leading-relaxed transition-all ${
          isSolved 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
            : Object.keys(selectedIndices).length > 0
            ? 'bg-rose-50 border-rose-300 text-rose-950'
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          <span className="font-extrabold uppercase tracking-wider block mb-0.5 text-[10px]">
            {isSolved ? '✓ Compliant Rationale:' : Object.keys(selectedIndices).length > 0 ? '✕ SOP Hazard:' : 'Guidance:'}
          </span>
          <span>{feedbackText}</span>
        </div>
      )}
    </div>
  );
};


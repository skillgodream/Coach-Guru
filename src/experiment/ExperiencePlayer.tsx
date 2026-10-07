import React, { useState, useEffect } from 'react';
import { SlidePlan } from './types';
import { Renderer } from './Renderer';
import { TeachMeIcon } from './TeachMeIcons';
import './teach-me.css';

export function getStageForSlide(slide: any): {
  stageNum: number;
  stageName: string;
  stageTag: string;
  pillClass: string;
} {
  switch (slide?.type) {
    case 'WELCOME':
      return { stageNum: 1, stageName: 'ORIENT', stageTag: 'Role & Expected Outcomes', pillClass: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
    case 'OBJECTIVES':
      return { stageNum: 1, stageName: 'ORIENT', stageTag: 'What You Will Learn', pillClass: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
    case 'SECTION_INTRO':
      return { stageNum: 2, stageName: 'PREPARE', stageTag: 'Prerequisites & Setup', pillClass: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    case 'TEACH_STEP':
      return { stageNum: 3, stageName: 'PERFORM', stageTag: 'Sequential Protocol', pillClass: 'bg-blue-100 text-blue-900 border-blue-300' };
    case 'IMPORTANT_RULE':
      return { stageNum: 4, stageName: 'CONTROL', stageTag: 'Critical Rules & Safety', pillClass: 'bg-amber-100 text-amber-900 border-amber-300' };
    case 'DO_DONT':
      return { stageNum: 4, stageName: 'CONTROL', stageTag: 'Do & Don’t Boundaries', pillClass: 'bg-amber-100 text-amber-900 border-amber-300' };
    case 'REAL_WORLD_SCENARIO':
      return { stageNum: 5, stageName: 'DECIDE', stageTag: 'Frontline Judgment Point', pillClass: 'bg-purple-100 text-purple-900 border-purple-300' };
    case 'DECISION':
      return { stageNum: 6, stageName: 'HANDLE', stageTag: 'Evaluated Judgment', pillClass: 'bg-purple-100 text-purple-900 border-purple-300' };
    case 'KEY_TAKEAWAYS':
      return { stageNum: 8, stageName: 'PROVE', stageTag: 'Recall & Retention', pillClass: 'bg-yellow-100 text-yellow-900 border-yellow-300' };
    case 'COMPLETION':
      return { stageNum: 8, stageName: 'PROVE', stageTag: 'Operational Transition', pillClass: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    default:
      return { stageNum: 3, stageName: 'PERFORM', stageTag: 'Operational Protocol', pillClass: 'bg-blue-100 text-blue-900 border-blue-300' };
  }
}

export function ExperiencePlayer({
  plan,
  onClose,
  onComplete,
}: {
  plan: SlidePlan;
  onClose: () => void;
  onComplete?: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [decisionSolved, setDecisionSolved] = useState<boolean>(false);

  const slide = plan.slides[currentIndex];
  const isWelcome = slide?.type === 'WELCOME';
  const isDecision = slide?.type === 'DECISION';
  const isLastSlide = currentIndex === plan.slides.length - 1;
  const currentStage = getStageForSlide(slide);

  // Reset decision state when slide changes
  useEffect(() => {
    setFeedback(null);
    setDecisionSolved(false);
  }, [currentIndex]);

  if (!slide) return <div>Error: Slide not found</div>;

  const handleChoice = (isCorrect: boolean, feedbackText: string) => {
    setFeedback(feedbackText);
    if (isCorrect) {
      setDecisionSolved(true);
    }
  };

  const handleNext = () => {
    if (isLastSlide) {
      if (onComplete) {
        onComplete();
      } else {
        onClose();
      }
      return;
    }
    setCurrentIndex((prev) => Math.min(plan.slides.length - 1, prev + 1));
  };

  const handleBack = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const isNextDisabled = isDecision && !decisionSolved;

  return (
    <div className="fixed inset-0 z-50 teach-me-wrapper">
      <div id="app" className="teach-me-app">
        {/* Top Header Bar with Explicit Current Stage Indicator */}
        <div className="top flex items-center justify-between px-4 py-3 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 disabled:opacity-40 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Locked Current Stage Header Display */}
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-xs ${currentStage.pillClass}`}>
              CURRENT STAGE: STAGE {currentStage.stageNum} OF 8 • {currentStage.stageName}
            </span>
          </div>

          <span className="text-xs font-black text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
            {currentIndex + 1} / {plan.slides.length}
          </span>
        </div>

        {/* Slide Body */}
        <div className={`sl ${isWelcome ? 'full' : ''}`} id="sl" key={currentIndex}>
          <Renderer
            slide={slide}
            onChoiceSelect={handleChoice}
            feedback={feedback}
            onNext={handleNext}
          />
        </div>

        {/* Shared Bottom Navigation (hidden on Welcome) */}
        {!isWelcome && (
          <div className="ft" id="ft">
            <button
              className="bk"
              id="bk"
              onClick={handleBack}
              disabled={currentIndex === 0}
            >
              ← Back
            </button>

            <button
              className="cn"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#dc2626',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              onClick={onClose}
            >
              Cancel
            </button>

            <div className="ds">
              {plan.slides.map((_, j) => (
                <i key={j} className={j === currentIndex ? 'a' : ''}></i>
              ))}
            </div>

            <button
              className="nx"
              id="nx"
              onClick={handleNext}
              disabled={isNextDisabled}
            >
              {isLastSlide ? 'Continue' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


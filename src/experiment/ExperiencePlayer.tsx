import React, { useState, useEffect } from 'react';
import { SlidePlan } from './types';
import { Renderer } from './Renderer';
import './teach-me.css';

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
        {/* Top Bar */}
        <div className={`top ${isWelcome ? 'h' : ''}`}>
          <button onClick={onClose} aria-label="Exit training">
            Exit
          </button>
          <span>
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

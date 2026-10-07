import React, { useState } from 'react';
import { Slide } from '../types';

export const DecisionPage: React.FC<{
  slide: Slide;
  onChoiceSelect: (isCorrect: boolean, feedback: string) => void;
  feedback?: string | null;
  onNext?: () => void;
}> = ({ slide, onChoiceSelect, feedback }) => {
  const [selectedIndices, setSelectedIndices] = useState<Record<number, boolean>>({});
  const [feedbackText, setFeedbackText] = useState<string>(
    feedback || 'Choose an answer to continue.'
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

  return (
    <>
      <span className="pill">Your Decision</span>
      <h2>{slide.title || 'How do you handle the visible debris?'}</h2>
      {options.map((opt, j) => {
        const wasClicked = selectedIndices[j];
        let stateClass = '';
        if (wasClicked) {
          stateClass = opt.isCorrect ? 'ok' : 'bad';
        }

        return (
          <button
            key={j}
            className={`opt ${stateClass}`.trim()}
            onClick={() => handlePick(j)}
          >
            {opt.text}
          </button>
        );
      })}
      <div className="fb">{feedbackText}</div>
    </>
  );
};

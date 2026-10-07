import React from 'react';
import { Slide } from '../types';
import { TeachMeIcon } from '../TeachMeIcons';

export const CompletionPage: React.FC<{
  slide: Slide;
  onNext: () => void;
}> = ({ slide, onNext }) => {
  const nextTitle = slide.next || 'Next: Guide Me';
  const nextSubtitle = slide.nb || 'Practise the steps with a coach beside you.';

  return (
    <div className="done sl" style={{ padding: 0, animation: 'none' }}>
      <TeachMeIcon name="party" className="ic conf" />
      <h2 style={{ fontSize: '34px' }}>{slide.title || 'Great Job!'}</h2>
      <p>{slide.content || "You've completed this section."}</p>
      <div className="nx2" onClick={onNext} role="button" tabIndex={0}>
        <div>
          <b style={{ color: 'var(--n)' }}>{nextTitle}</b>
          <p className="sm" style={{ margin: '2px 0 0' }}>
            {nextSubtitle}
          </p>
        </div>
        <span className="go">
          <TeachMeIcon name="arrow" className="ic" />
        </span>
      </div>
    </div>
  );
};

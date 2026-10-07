import React from 'react';
import { Slide } from '../types';
import { SlideImage } from '../TeachMeIcons';

export const ImportantRulePage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  const why =
    slide.why ||
    slide.gurujiCoaching?.whyItMatters ||
    'Safety and efficacy. Always measure. Never guess the ratio.';

  return (
    <div className="rule">
      <span className="pill">
        <span className="ex">!</span>
        Important Rule
      </span>
      <h2>{slide.title}</h2>
      <SlideImage
        icon={slide.ic || 'warn'}
        slash={true}
        img={slide.img}
        alt={slide.alt}
      />
      <div className="why">
        <b>Why it matters</b>
        <span>{why}</span>
      </div>
    </div>
  );
};

import React from 'react';
import { Slide } from '../types';
import { SlideImage } from '../TeachMeIcons';

export const ScenarioPage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  return (
    <>
      <span className="pill">Example Scenario</span>
      <h2>{slide.title || 'Dust on the Surface'}</h2>
      <SlideImage
        icon={slide.ic || 'wipe'}
        typeModifier="t"
        img={slide.img}
        alt={slide.alt}
      />
      <p>{slide.content}</p>
      <div className="q">
        <i>?</i>
        <span>What should you do?</span>
      </div>
    </>
  );
};

import React from 'react';
import { Slide } from '../types';
import { SlideImage } from '../TeachMeIcons';

export const TeachStepPage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  const step = slide.step || slide.evidenceSource || 'Step 1 of 2';
  const icon = slide.ic || 'bottle';

  let items = slide.items;
  if (!items || items.length === 0) {
    items = slide.content
      .split('\n')
      .map((l) => l.replace(/^[\*\-•]\s*/, '').trim())
      .filter(Boolean);
    if (items.length === 0 && slide.content) {
      items = [slide.content];
    }
  }

  return (
    <>
      <span className="pill">{step}</span>
      <h2>{slide.title}</h2>
      <SlideImage icon={icon} typeModifier="t" img={slide.img} alt={slide.alt} />
      {items.map((item, idx) => (
        <div className="bul" key={idx}>
          <span className="dot"></span>
          <span>{item}</span>
        </div>
      ))}
    </>
  );
};

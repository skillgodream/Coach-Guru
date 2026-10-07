import React from 'react';
import { Slide } from '../types';
import { SlideImage } from '../TeachMeIcons';

export const ObjectivesPage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  const lead = slide.lead || 'By the end of this lesson, you will be able to:';
  
  // Extract items from slide.items or from slide.content if formatted with newlines/numbers
  let items = slide.items;
  if (!items || items.length === 0) {
    items = slide.content
      .split('\n')
      .map((line) => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(Boolean);
  }

  return (
    <>
      <SlideImage
        icon="target"
        img={slide.img}
        alt={slide.alt}
      />
      <h2>{slide.title}</h2>
      <p className="sm">{lead}</p>
      {items.map((item, j) => (
        <div className="row" key={j}>
          <span className="num">{j + 1}</span>
          <span>{item}</span>
        </div>
      ))}
    </>
  );
};

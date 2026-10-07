import React from 'react';
import { Slide } from '../types';
import { SlideImage } from '../TeachMeIcons';

export const SectionIntroPage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  const sec = slide.sec || 'Section 1 of 3';
  const checklist = slide.fl || [
    'Gloves on',
    'Sanitizer 1:10',
    'Blue applicator bottle',
    'Microfibre cloths',
    'Trolley stocked',
  ];

  return (
    <>
      <span className="pill">{sec}</span>
      <h2 style={{ fontSize: '30px' }}>{slide.title}</h2>
      <p>{slide.content}</p>
      <SlideImage
        icon="room"
        typeModifier="t hf"
        fl={checklist}
        img={slide.img}
        alt={slide.alt}
      />
    </>
  );
};

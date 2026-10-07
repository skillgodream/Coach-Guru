import React from 'react';
import { Slide } from '../types';
import { TeachMeIcon } from '../TeachMeIcons';

export const WelcomePage: React.FC<{
  slide: Slide;
  onNext: () => void;
}> = ({ slide, onNext }) => {
  const role = slide.role || 'Role: Frontline Specialist';
  const body = slide.content;
  const cta = slide.cta || "Let's Begin";

  return (
    <div className="hero">
      <div className="art">
        <TeachMeIcon name="room" className="ic" />
      </div>
      <span className="pill stage-orient-pill" style={{ marginBottom: '12px' }}>
        THE CURRENT STAGE: STAGE 1 OF 8 • ORIENT
      </span>
      <h1>{slide.title}</h1>
      <p>
        <b>{role}</b>
      </p>
      <p>{body}</p>
      <button className="cta" onClick={onNext}>
        <span>{cta}</span>
        <TeachMeIcon name="arrow" className="ic" />
      </button>
    </div>
  );
};


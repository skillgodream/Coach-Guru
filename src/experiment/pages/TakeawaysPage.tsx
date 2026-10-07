import React from 'react';
import { Slide } from '../types';
import { TeachMeIcon } from '../TeachMeIcons';

export const TakeawaysPage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  let items = slide.items;
  if (!items || items.length === 0) {
    items = slide.content
      .split('\n')
      .map((l) => l.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(Boolean);
  }

  return (
    <div className="tkp">
      <span className="pill">
        <TeachMeIcon name="bulb" className="ic" />
        <span>Key Takeaways</span>
      </span>
      <div style={{ height: '8px' }}></div>
      {items.map((item, idx) => (
        <div className="it" key={idx}>
          <span className="tk">
            <TeachMeIcon name="check" className="ic" />
          </span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
};

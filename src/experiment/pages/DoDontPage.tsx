import React from 'react';
import { Slide } from '../types';
import { TeachMeIcon } from '../TeachMeIcons';

export const DoDontPage: React.FC<{
  slide: Slide;
  onNext?: () => void;
}> = ({ slide }) => {
  const dos = slide.dos || slide.comparison?.do || [
    'Wipe visible dirt with a damp cloth',
    'Spray all high-touch surfaces',
  ];
  const donts = slide.donts || slide.comparison?.dont || [
    'Spray sanitizer directly over dirt',
    'Miss high-touch areas like remotes',
  ];

  return (
    <>
      <h2>{slide.title || 'Do and Don’t'}</h2>
      <div className="pan do">
        <h3>
          <span className="big">
            <TeachMeIcon name="check" className="ic" />
          </span>
          Do
        </h3>
        {dos.map((item, idx) => (
          <div className="it" key={idx}>
            <span className="tk">
              <TeachMeIcon name="check" className="ic" />
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="pan dont">
        <h3>
          <span className="big">
            <TeachMeIcon name="x" className="ic" />
          </span>
          Don’t
        </h3>
        {donts.map((item, idx) => (
          <div className="it" key={idx}>
            <span className="tk">
              <TeachMeIcon name="x" className="ic" />
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </>
  );
};

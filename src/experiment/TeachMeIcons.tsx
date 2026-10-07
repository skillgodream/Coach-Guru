import React from 'react';

export type IconKey =
  | 'target'
  | 'bottle'
  | 'spray'
  | 'room'
  | 'warn'
  | 'wipe'
  | 'check'
  | 'x'
  | 'bulb'
  | 'arrow'
  | 'cap'
  | 'party'
  | 'slash';

export const TeachMeIcon: React.FC<{
  name: IconKey | string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ name, className = '', style }) => {
  const combinedClass = `ic ${className}`.trim();

  switch (name) {
    case 'target':
      return (
        <svg className={combinedClass} style={style} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      );
    case 'bottle':
      return (
        <svg className={combinedClass} style={style} viewBox="0 0 24 24">
          <path d="M10 2h4v3l2 3v13a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8l2-3z" />
          <path d="M8 13h8" />
        </svg>
      );
    case 'spray':
      return (
        <svg className={combinedClass} style={style} viewBox="0 0 24 24">
          <path d="M4 10h8v10H4zM12 12h5M17 9l4-1M17 12h4M17 15l4 1M7 10V6h6" />
        </svg>
      );
    case 'room':
      return (
        <svg className={combinedClass} style={style} viewBox="0 0 24 24">
          <path d="M3 19v-7h18v7M3 12V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5M3 19v2M21 19v2M7 12V9h4v3" />
        </svg>
      );
    case 'warn':
      return (
        <svg className={combinedClass} style={style} viewBox="0 0 24 24">
          <path d="M12 3l10 18H2z" />
          <path d="M12 10v5M12 18h.01" />
        </svg>
      );
    case 'wipe':
      return (
        <svg className={combinedClass} style={style} viewBox="0 0 24 24">
          <path d="M4 16l7-11 4 3-7 11zM15 9l5 3" />
          <path d="M3 21h8" />
        </svg>
      );
    case 'check':
      return (
        <svg className={combinedClass} style={style} viewBox="0 0 24 24">
          <path d="M5 12l5 5 9-10" />
        </svg>
      );
    case 'x':
      return (
        <svg className={combinedClass} style={style} viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case 'bulb':
      return (
        <svg className={combinedClass} style={style} viewBox="0 0 24 24">
          <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11c1 1 1 2 1 3h4c0-1 0-2 1-3a6 6 0 0 0-3-11z" />
        </svg>
      );
    case 'arrow':
      return (
        <svg className={combinedClass} style={style} viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case 'cap':
      return (
        <svg className={combinedClass} style={style} viewBox="0 0 24 24">
          <path d="M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5" />
        </svg>
      );
    case 'party':
      return (
        <svg className={combinedClass} style={style} viewBox="0 0 24 24">
          <path d="M4 21l5-14 10 10zM14 5l1-2M18 8l2-1M17 3l.5 1.5M20 12l2 .5" />
        </svg>
      );
    case 'slash':
      return (
        <svg className={combinedClass} style={style} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M5.6 5.6l12.8 12.8" />
        </svg>
      );
    default:
      return (
        <svg className={combinedClass} style={style} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
};

export const SlideImage: React.FC<{
  img?: string;
  alt?: string;
  icon: IconKey | string;
  typeModifier?: string;
  fl?: string[];
  slash?: boolean | number;
}> = ({ img, alt, icon, typeModifier = '', fl, slash }) => {
  return (
    <div className={`im ${typeModifier}`.trim()}>
      {img ? (
        <img src={img} alt={alt || ''} />
      ) : (
        <TeachMeIcon name={icon} className="ic" />
      )}
      {fl && fl.length > 0 && (
        <div className="fl">
          {fl.map((item, idx) => (
            <div key={idx}>
              <span className="tk">
                <TeachMeIcon name="check" className="ic" />
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
      {Boolean(slash) && (
        <div className="slash">
          <TeachMeIcon name="slash" className="ic" />
        </div>
      )}
    </div>
  );
};

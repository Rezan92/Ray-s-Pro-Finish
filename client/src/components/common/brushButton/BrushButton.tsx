import React, { useId } from 'react';
import { Link } from 'react-router-dom';
import styles from './BrushButton.module.css';

interface BrushButtonProps {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  primaryColor?: string;
  hoverColor?: string;
  className?: string;
}

export const BrushButton: React.FC<BrushButtonProps> = ({
  to,
  onClick,
  children,
  primaryColor = 'var(--color-primary)',
  hoverColor = 'var(--color-brand-dark)',
  className = '',
}) => {
  // Generate a unique ID for the SVG filter so multiple buttons don't clash on the same page
  const uniqueId = useId().replace(/:/g, '');
  const filterId = `brush-bristles-${uniqueId}`;

  const customStyle = {
    '--brush-primary': primaryColor,
    '--brush-hover': hoverColor,
    '--brush-filter': `url(#${filterId})`,
  } as React.CSSProperties;

  const content = (
    <>
      <svg width="0" height="0" className={styles.svgFilter}>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.8" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feColorMatrix in="noise" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 -1.5" result="holes" />
          <feComposite in="displaced" in2="holes" operator="out" />
        </filter>
      </svg>
      {children}
    </>
  );

  const combinedClassName = `${styles.brushButton} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClassName} style={customStyle} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} style={customStyle} onClick={onClick}>
      {content}
    </button>
  );
};

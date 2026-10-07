import React from 'react';

/**
 * LoadingSpinner — flexible loading indicator.
 *
 * @param {string}  [text='Loading…'] - Label shown below the spinner. Pass falsy to hide.
 * @param {'sm'|'md'|'lg'} [size='md'] - Controls ring dimensions.
 * @param {boolean} [overlay=false]   - When true, renders as a fixed full-screen overlay.
 */
const SIZES = {
  sm: 24,
  md: 40,
  lg: 64,
};

const LoadingSpinner = ({ text = 'Loading…', size = 'md', overlay = false }) => {
  const px = SIZES[size] ?? SIZES.md;

  const inner = (
    <div className="spinner-wrapper">
      <div
        className="spinner-ring"
        style={{ width: px, height: px, borderWidth: px < 32 ? 2 : 3 }}
      />
      {text && <span className="spinner-text" style={{ fontSize: size === 'sm' ? 12 : 14 }}>{text}</span>}
    </div>
  );

  if (overlay) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(6, 11, 24, 0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
        aria-live="polite"
        aria-label={text || 'Loading'}
      >
        {inner}
      </div>
    );
  }

  return inner;
};

export default LoadingSpinner;

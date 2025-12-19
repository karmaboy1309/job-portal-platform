import React from 'react';

const LoadingSpinner = ({ size = 48 }) => {
  const style = {
    width: size,
    height: size,
    border: `${Math.max(4, Math.floor(size / 10))}px solid #e6e6e6`,
    borderTop: `${Math.max(4, Math.floor(size / 10))}px solid #4a90e2`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '16px auto'
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={style} aria-hidden="true" />
    </div>
  );
};

export default LoadingSpinner;

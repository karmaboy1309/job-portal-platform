import React from 'react';

const LoadingSpinner = ({ text = 'Loading…' }) => (
  <div className="spinner-wrapper">
    <div className="spinner-ring" />
    {text && <span className="spinner-text">{text}</span>}
  </div>
);

export default LoadingSpinner;

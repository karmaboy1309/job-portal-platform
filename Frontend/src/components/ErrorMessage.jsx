import React from 'react';

const ErrorMessage = ({ children, message }) => (
  <div className="error-box">
    <span className="error-icon">⚠️</span>
    <span>{children || message || 'Something went wrong. Please try again.'}</span>
  </div>
);

export default ErrorMessage;

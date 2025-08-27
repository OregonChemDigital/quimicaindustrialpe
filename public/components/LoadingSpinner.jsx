import React from 'react';
// CSS imported via main.css

const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className={`loading-spinner ${sizeClasses[size]}`}></div>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner; 
import React from 'react';



const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        <div className={`spinner ${sizeClasses[size]}`}></div>
      </div>
    );
  }

  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner; 
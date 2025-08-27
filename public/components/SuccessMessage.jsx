import React, { useEffect, useState } from 'react';
// CSS imported via main.css

const SuccessMessage = ({ message, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="message-toast message-success">
      <div className="message-content">
        <svg
          className="message-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            fill="currentColor"
          />
        </svg>
        <p className="message-text">{message}</p>
      </div>
    </div>
  );
};

export default SuccessMessage; 
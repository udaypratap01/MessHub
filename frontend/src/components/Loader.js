import React from 'react';
import '../styles/Loader.css';

function Loader({ fullPage = true, size = 'medium', text = 'Loading...' }) {
  return (
    <div className={`loader-wrapper ${fullPage ? 'full-page' : 'inline'} ${size}`}>
      <div className="loader-container">
        {/* Spinner */}
        <div className="spinner-wrapper">
          <div className="spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <div className="loader-logo">🍽️</div>
        </div>

        {/* Loading text */}
        {text && <p className="loader-text">{text}</p>}

        {/* Animated dots */}
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default Loader;

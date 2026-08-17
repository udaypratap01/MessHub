import React from 'react';
import '../styles/Card.css';

function Card({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  trendValue,
  onClick,
  children,
  className = '',
}) {
  return (
    <div 
      className={`card card-${color} ${className} stagger-item`} 
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
    >
      {/* Card Header */}
      <div className="card-header">
        <div className="card-icon">{icon}</div>
        <div className="card-title-section">
          <h4 className="card-title">{title}</h4>
          {trend && (
            <div className={`card-trend ${trend === 'up' ? 'up' : 'down'}`}>
              <span className="trend-icon">{trend === 'up' ? '↗' : '↘'}</span>
              <span className="trend-text">Placeholder Trend</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Value */}
      <div className="card-value">
        {value || 'Placeholder Value'}
      </div>

      {/* Card Description */}
      <p className="card-description">Placeholder metric description and context</p>

      {/* Card Children (for custom content) */}
      {children && <div className="card-content">{children}</div>}

      {/* Card Footer */}
      {onClick && (
        <div className="card-footer">
          <button className="card-action">Explore More →</button>
        </div>
      )}
    </div>
  );
}

export default Card;

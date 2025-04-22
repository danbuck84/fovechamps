
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showF1Badge?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showF1Badge = true }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  
  return (
    <Link to="/" className="no-underline">
      <div className={`fove-logo ${sizeClasses[size]}`}>
        <span className="fove-logo-text-fo">FoVe</span>
        <span className="fove-logo-text-ve">Champs</span>
        {showF1Badge && <span className="fove-f1-badge">F1 2025</span>}
      </div>
    </Link>
  );
};

export default Logo;

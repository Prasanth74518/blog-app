import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  className = '', 
  disabled = false, 
  onClick 
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg transition-colors duration-200';
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
import React from 'react';

const Card = ({
  children,
  className = '',
  hoverEffect = true,
  padding = 'p-6',
  ...props
}) => {
  return (
    <div
      className={`glass-panel rounded-3xl transition-all duration-300 ${
        hoverEffect ? 'hover:shadow-xl hover:-translate-y-1' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

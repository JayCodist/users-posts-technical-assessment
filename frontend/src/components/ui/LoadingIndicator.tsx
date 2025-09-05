import React from 'react';

interface LoadingIndicatorProps {
  size?: 'default' | 'small';
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = 'default', className = '' }) => {
  const sizeClass = size === 'small' ? 'small' : '';
  
  return (
    <div className={`lds-ellipsis ${sizeClass} ${className}`}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export default React.memo(LoadingIndicator);

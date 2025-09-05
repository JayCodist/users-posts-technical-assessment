import React from 'react';

interface BackButtonProps {
  title: string;
  onClick: () => void;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ title, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`hover:bg-gray-100 rounded-md p-1 text-gray-500 transition-colors duration-150 self-start ${className}`}
    >
      ← {title}
    </button>
  );
};

export default React.memo(BackButton);

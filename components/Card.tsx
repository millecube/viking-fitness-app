import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  variant?: 'white' | 'dark' | 'green';
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action, variant = 'white' }) => {
  const bgStyles = {
    white: 'bg-white dark:bg-zinc-900 border-none',
    dark: 'bg-fitness-black text-white border-none',
    green: 'bg-fitness-darkGreen text-white border-none'
  };

  const textStyles = {
    white: 'text-fitness-textMain dark:text-white',
    dark: 'text-white',
    green: 'text-white'
  };

  return (
    <div className={`${bgStyles[variant]} shadow-sm rounded-4xl overflow-hidden flex flex-col transition-colors duration-300 ${className}`}>
      {(title || action) && (
        <div className="px-8 py-6 flex justify-between items-center">
          {title && <h3 className={`${textStyles[variant]} font-bold tracking-tight text-lg`}>{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-8 flex-1">
        {children}
      </div>
    </div>
  );
};
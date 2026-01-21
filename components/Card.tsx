import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'highlight';
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action, variant = 'default' }) => {
  // Logic: 
  // Light Mode: White Background
  // Dark Mode: Lighter Navy (viking-blueLight) to distinguish from main background
  
  const bgClass = variant === 'highlight' 
    ? 'bg-viking-action text-white' 
    : 'bg-white dark:bg-viking-blueLight border border-viking-blue/5 dark:border-white/5';

  const textClass = variant === 'highlight'
    ? 'text-white'
    : 'text-viking-blue dark:text-white';

  return (
    <div className={`${bgClass} ${textClass} shadow-sm rounded-3xl overflow-hidden flex flex-col transition-colors duration-300 ${className}`}>
      {(title || action) && (
        <div className="px-6 py-5 flex justify-between items-center border-b border-black/5 dark:border-white/5">
          {title && <h3 className={`font-bold tracking-tight text-lg ${variant === 'highlight' ? 'text-white' : 'text-viking-blue dark:text-white'}`}>{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6 flex-1">
        {children}
      </div>
    </div>
  );
};
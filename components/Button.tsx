import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold uppercase tracking-wide transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-display";
  
  const variants = {
    // Primary: Action Blue generally works best for Calls to Action in both modes
    primary: "bg-viking-action text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20 border border-transparent",
    
    // Secondary: Inverts based on mode
    secondary: "bg-viking-blue text-white dark:bg-white dark:text-viking-blue hover:opacity-90 border border-transparent",
    
    // Outline: Borders follow text color
    outline: "border-2 border-viking-blue text-viking-blue dark:border-white dark:text-white hover:bg-viking-blue hover:text-white dark:hover:bg-white dark:hover:text-viking-blue bg-transparent",
    
    danger: "bg-red-600 text-white hover:bg-red-700 border border-transparent",
    
    ghost: "text-viking-blue dark:text-white hover:bg-viking-blue/5 dark:hover:bg-white/10"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
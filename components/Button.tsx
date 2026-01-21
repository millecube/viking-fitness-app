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
  const baseStyles = "inline-flex items-center justify-center rounded font-bold uppercase tracking-wide transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-display";
  
  const variants = {
    primary: "bg-viking-action text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20 border border-transparent",
    secondary: "bg-slate-200 dark:bg-viking-navyLight text-viking-navy dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 border border-transparent",
    outline: "border-2 border-slate-300 dark:border-viking-grey text-slate-500 dark:text-viking-grey hover:border-viking-action hover:text-viking-action bg-transparent",
    danger: "bg-red-600 text-white hover:bg-red-700 border border-transparent",
    ghost: "text-slate-500 dark:text-viking-grey hover:text-viking-navy dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
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
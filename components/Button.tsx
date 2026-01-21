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
  // Bubble Base: Rounded full, backdrop blur, transition for hover effects
  const baseStyles = "inline-flex items-center justify-center rounded-full font-bold uppercase tracking-wide transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md active:scale-95";
  
  const variants = {
    // Primary: Viking Action Blue #0D1AC4
    primary: "bg-viking-action/90 text-white shadow-[0_8px_30px_rgba(13,26,196,0.4)] border border-white/20 hover:bg-viking-action hover:shadow-[0_8px_30px_rgba(13,26,196,0.6)] hover:-translate-y-1",
    
    // Secondary: Glassy White/Dark (Bubble effect)
    secondary: "bg-viking-surfaceLight/40 dark:bg-black/40 text-viking-action dark:text-white border border-viking-action/20 dark:border-white/10 shadow-lg hover:bg-white/60 dark:hover:bg-black/60 hover:-translate-y-1",
    
    // Outline: Transparent with border
    outline: "bg-transparent border-2 border-viking-action/30 dark:border-white/30 text-viking-action dark:text-white hover:bg-viking-action/5 dark:hover:bg-white/5",
    
    danger: "bg-red-600/90 text-white shadow-lg shadow-red-600/30 border border-white/20 hover:bg-red-600",
    
    ghost: "bg-transparent text-viking-action dark:text-white hover:bg-viking-action/10 dark:hover:bg-white/10"
  };

  const sizes = {
    sm: "px-5 py-2 text-xs",
    md: "px-8 py-3.5 text-sm",
    lg: "px-10 py-5 text-base"
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
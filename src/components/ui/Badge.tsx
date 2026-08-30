import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'success';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
}) => {
  const variantStyles = {
    primary: 'bg-blue-500/10 text-blue-400 border border-blue-500/25',
    secondary: 'bg-slate-800/80 text-slate-300 border border-slate-700/50',
    accent: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/25',
    outline: 'bg-transparent text-slate-400 border border-slate-700/60',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-xs font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

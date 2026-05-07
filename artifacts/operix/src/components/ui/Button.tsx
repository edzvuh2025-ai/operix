import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-[#1e2028] hover:bg-[#2d2e35]',
    danger: 'bg-red-600 hover:bg-red-700',
  };
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  return (
    <button
      className={cn('rounded-lg font-medium text-white disabled:opacity-50', variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

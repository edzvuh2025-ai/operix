import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn('w-full px-3 py-2 bg-[#1e2028] border border-[#2d2e35] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500', className)}
      {...props}
    />
  );
}

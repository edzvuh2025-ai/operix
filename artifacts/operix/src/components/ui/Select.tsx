import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, children, ...props }: SelectProps & { children: React.ReactNode }) {
  return (
    <select
      className={cn('w-full px-3 py-2 bg-[#1e2028] border border-[#2d2e35] rounded-lg text-white focus:outline-none focus:border-blue-500', className)}
      {...props}
    >
      {children}
    </select>
  );
}

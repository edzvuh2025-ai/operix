import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn('w-full px-3 py-2 bg-[#1e2028] border border-[#2d2e35] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none', className)}
      {...props}
    />
  );
}

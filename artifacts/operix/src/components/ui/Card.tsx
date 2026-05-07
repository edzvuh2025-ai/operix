import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return <div className={cn('bg-[#0f1117] rounded-lg border border-[#1e2028] p-4', className)} {...props} />;
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn('mb-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardProps) {
  return <h2 className={cn('text-xl font-bold text-white', className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('', className)} {...props} />;
}

import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'selected' | 'elevated'
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white transition-all duration-200',
        {
          'shadow-sm border border-gray-100': variant === 'default',
          'shadow-md border-2 border-coral-500 ring-4 ring-coral-100': variant === 'selected',
          'shadow-lg border border-gray-100': variant === 'elevated',
        },
        className
      )}
      {...props}
    />
  )
}

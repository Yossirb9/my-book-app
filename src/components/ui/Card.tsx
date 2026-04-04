import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'selected' | 'elevated' | 'dark' | 'outline'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ className, variant = 'default', padding, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-200',
        {
          'bg-white shadow-sm border border-gray-100': variant === 'default',
          'bg-white shadow-md border-2 border-coral-500 ring-4 ring-coral-100': variant === 'selected',
          'bg-white shadow-lg border border-gray-100': variant === 'elevated',
          'bg-[#1e1e1e] border border-white/10': variant === 'dark',
          'bg-transparent border-2 border-coral-200 hover:border-coral-400': variant === 'outline',
        },
        {
          'p-0': padding === 'none',
          'p-3': padding === 'sm',
          'p-5': padding === 'md',
          'p-7': padding === 'lg',
        },
        className
      )}
      {...props}
    />
  )
}

export default Card

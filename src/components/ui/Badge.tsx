import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

type BadgeVariant = 'new' | 'popular' | 'generating' | 'ready' | 'default'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  new: 'bg-coral-100 text-coral-700 border-coral-200',
  popular: 'bg-amber-100 text-amber-700 border-amber-200',
  generating: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  ready: 'bg-green-100 text-green-700 border-green-200',
  default: 'bg-gray-100 text-gray-600 border-gray-200',
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border',
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge

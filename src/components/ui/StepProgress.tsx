'use client'
import { cn } from '@/lib/utils'

interface StepProgressProps {
  currentStep: number
  totalSteps: number
  label?: string
}

export function StepProgress({ currentStep, totalSteps, label }: StepProgressProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <p className="text-sm text-gray-500">
          שלב {currentStep} מתוך {totalSteps}
          {label && ` — ${label}`}
        </p>
      )}
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              i + 1 === currentStep
                ? 'w-6 bg-coral-500'
                : i + 1 < currentStep
                ? 'w-2 bg-coral-300'
                : 'w-2 bg-gray-200'
            )}
          />
        ))}
      </div>
    </div>
  )
}

'use client'

import { CREATE_STEP_LABELS } from '@/lib/createFlow'
import { cn } from '@/lib/utils'

interface StepProgressProps {
  currentStep: number
  totalSteps?: number
}

export function StepProgress({ currentStep, totalSteps = CREATE_STEP_LABELS.length }: StepProgressProps) {
  const progress = `${Math.max(0, ((currentStep - 1) / Math.max(1, totalSteps - 1)) * 100)}%`

  return (
    <div className="w-full max-w-[15rem] md:max-w-sm">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-coral-500">
            שלב {currentStep} מתוך {totalSteps}
          </p>
          <p className="truncate text-sm font-bold text-gray-800">{CREATE_STEP_LABELS[currentStep - 1]}</p>
        </div>
        <div className="h-2 w-20 rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-coral-500 transition-all duration-300"
            style={{ width: progress }}
          />
        </div>
      </div>

      <div className="hidden md:block">
        <div className="mb-3 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-coral-500 transition-all duration-300"
            style={{ width: progress }}
          />
        </div>
        <div className="grid grid-cols-5 gap-2 text-center">
          {CREATE_STEP_LABELS.map((label, index) => {
            const stepNumber = index + 1

            return (
              <div key={label} className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors',
                    stepNumber < currentStep && 'bg-coral-500 text-white',
                    stepNumber === currentStep && 'bg-coral-100 text-coral-700 ring-2 ring-coral-300',
                    stepNumber > currentStep && 'bg-gray-200 text-gray-500'
                  )}
                >
                  {stepNumber}
                </span>
                <span
                  className={cn(
                    'text-[11px] font-medium leading-tight',
                    stepNumber === currentStep ? 'text-gray-900' : 'text-gray-500'
                  )}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

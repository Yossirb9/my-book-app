'use client'

import { CREATE_STEP_LABELS } from '@/lib/createFlow'
import { cn } from '@/lib/utils'

interface StepProgressProps {
  currentStep: number
  totalSteps?: number
  onStepClick?: (step: number) => void
}

export function StepProgress({
  currentStep,
  totalSteps = CREATE_STEP_LABELS.length,
  onStepClick,
}: StepProgressProps) {
  const progress = `${Math.max(0, ((currentStep - 1) / Math.max(1, totalSteps - 1)) * 100)}%`

  return (
    <div className="w-full">
      {/* מובייל */}
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-coral-300">
            שלב {currentStep} מתוך {totalSteps}
          </p>
          <p className="truncate text-sm font-bold text-white">{CREATE_STEP_LABELS[currentStep - 1]}</p>
        </div>
        <div className="h-2 w-24 rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-coral-400 transition-all duration-300"
            style={{ width: progress }}
          />
        </div>
      </div>

      {/* דסקטופ */}
      <div className="hidden lg:block">
        <div className="mb-6 h-1.5 w-full rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#e87c53_0%,#ffb347_100%)] transition-all duration-300"
            style={{ width: progress }}
          />
        </div>

        <div className="space-y-3">
          {CREATE_STEP_LABELS.map((label, index) => {
            const stepNumber = index + 1
            const isDone = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const isClickable = isDone && onStepClick

            return (
              <div
                key={label}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onClick={() => isClickable && onStepClick(stepNumber)}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    onStepClick(stepNumber)
                  }
                }}
                className={cn(
                  'flex items-center gap-4 rounded-[1.35rem] border px-4 py-3 transition-all',
                  isCurrent && 'border-coral-300/40 bg-coral-500/12 shadow-[0_12px_30px_rgba(232,124,83,0.12)]',
                  isDone && 'border-white/10 bg-white/[0.06]',
                  !isCurrent && !isDone && 'border-white/8 bg-transparent',
                  isClickable && 'cursor-pointer hover:bg-white/10 hover:border-white/20'
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors',
                    isDone && 'bg-coral-500 text-white',
                    isCurrent && 'bg-white text-[#171925]',
                    !isDone && !isCurrent && 'bg-white/10 text-white/45'
                  )}
                >
                  {isDone ? '✓' : stepNumber}
                </span>
                <div className="min-w-0">
                  <p className={cn('text-sm font-semibold', isCurrent ? 'text-white' : isDone ? 'text-white/90' : 'text-white/55')}>
                    {label}
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-white/40">
                    {isCurrent ? 'השלב הפעיל עכשיו' : isDone ? 'לחצו לחזרה' : 'ממתין לבחירה'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import Badge from '@/components/ui/Badge'
import { StepProgress } from '@/components/ui/StepProgress'
import { getCharacterNamesSummary, getPrimaryCharacter, isEnsembleTemplate } from '@/lib/characters'
import { CREATE_STEP_DETAILS } from '@/lib/createFlow'
import { cn } from '@/lib/utils'
import { useCreateBookStore } from '@/store/createBookStore'
import { TEMPLATE_LABELS } from '@/types'

type CreateShellProps = {
  step: number
  children: ReactNode
  footer?: ReactNode
  backHref?: string
  onBack?: () => void
  badge?: string
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

export default function CreateShell({
  step,
  children,
  footer,
  backHref = '/',
  onBack,
  badge,
}: CreateShellProps) {
  const { params, setStep } = useCreateBookStore()
  const detail = CREATE_STEP_DETAILS[step - 1]
  const isEnsemble = isEnsembleTemplate(params.template)
  const mainCharacter =
    params.template && params.characters
      ? getPrimaryCharacter({ template: params.template, characters: params.characters })?.name
      : null
  const charactersSummary = getCharacterNamesSummary(params.characters || [])

  const backControl = onBack ? (
    <button type="button" onClick={onBack} className="text-sm font-medium text-white/60 transition-colors hover:text-white">
      חזרה
    </button>
  ) : (
    <Link href={backHref} className="text-sm font-medium text-white/60 transition-colors hover:text-white">
      חזרה
    </Link>
  )

  return (
    <div className="create-shell min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-8 lg:px-6 lg:py-6">
        <aside className="hidden lg:block">
          <div className="create-sidebar sticky top-6 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(24,24,38,0.96)_0%,rgba(13,13,22,0.98)_100%)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <div className="mb-8 flex items-center justify-between">
              {backControl}
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                Create
              </span>
            </div>

            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-coral-300">{detail.eyebrow}</p>
              <h1 className="mt-4 text-3xl font-black leading-tight text-white">{detail.title}</h1>
              <p className="mt-4 text-sm leading-7 text-white/65">{detail.description}</p>
            </div>

            <StepProgress currentStep={step} onStepClick={setStep} />

            <div className="mt-8 space-y-3">
              <SummaryRow label="נושא" value={params.template ? TEMPLATE_LABELS[params.template] : 'עדיין לא נבחר'} />
              <SummaryRow
                label={isEnsemble ? 'הדמויות בסיפור' : 'דמות ראשית'}
                value={isEnsemble ? charactersSummary : mainCharacter || 'נוסיף אותה בשלב הבא'}
              />
            </div>
          </div>
        </aside>

        <section className="flex min-h-dvh flex-col lg:min-h-0">
          <div className="border-b border-black/5 bg-[#11111a] px-4 py-4 text-white shadow-[0_8px_24px_rgba(12,12,18,0.14)] lg:hidden">
            <div className="flex items-center justify-between gap-4">
              {backControl}
              {badge ? <Badge variant="new">{badge}</Badge> : <div className="w-12" />}
            </div>
            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-coral-300">{detail.eyebrow}</p>
              <h1 className="mt-3 text-2xl font-black text-white">{detail.title}</h1>
              <p className="mt-2 text-sm leading-7 text-white/70">{detail.description}</p>
            </div>
            <div className="mt-5">
              <StepProgress currentStep={step} onStepClick={setStep} />
            </div>
          </div>

          <div className="flex-1 px-4 py-4 lg:px-0 lg:py-0">
            <div className="create-stage min-h-full overflow-hidden rounded-[1.8rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,250,243,0.98)_0%,rgba(255,244,230,0.99)_100%)] shadow-[0_24px_80px_rgba(158,118,85,0.12)] sm:rounded-[2.4rem]">
              <div className="hidden items-start justify-between gap-6 border-b border-black/5 px-8 py-7 lg:flex">
                <div>
                  <div className="flex items-center gap-3">
                    {badge ? <Badge variant="new">{badge}</Badge> : null}
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-coral-500">
                      שלב {step} מתוך {CREATE_STEP_DETAILS.length}
                    </span>
                  </div>
                  <h2 className="mt-4 text-4xl font-black tracking-tight text-[#161625]">{detail.title}</h2>
                </div>
                <div className="max-w-md text-right text-sm leading-7 text-gray-500">{detail.description}</div>
              </div>

              <div className={cn('px-4 pb-40 pt-4 lg:px-8 lg:pb-8 lg:pt-8', footer ? 'lg:pb-28' : 'lg:pb-10')}>
                {children}
              </div>

              {footer ? (
                <>
                  <div className="create-desktop-footer hidden lg:block">
                    <div className="create-desktop-footer-inner">{footer}</div>
                  </div>
                  <div className="create-mobile-footer lg:hidden">{footer}</div>
                </>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

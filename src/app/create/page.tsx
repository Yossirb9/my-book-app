'use client'

import { useCreateBookStore } from '@/store/createBookStore'
import StepBookType from '@/components/create/StepBookType'
import StepCharacters from '@/components/create/StepCharacters'
import StepParameters from '@/components/create/StepParameters'
import StepPayment from '@/components/create/StepPayment'
import StepPersonalization from '@/components/create/StepPersonalization'

const STEPS = [StepBookType, StepParameters, StepCharacters, StepPersonalization, StepPayment]

export default function CreatePage() {
  const step = useCreateBookStore((state) => state.step)
  const StepComponent = STEPS[step - 1]

  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top_right,rgba(232,124,83,0.16),transparent_22%),linear-gradient(180deg,#0f1018_0%,#171925_48%,#11111a_100%)]">
      <StepComponent />
    </main>
  )
}

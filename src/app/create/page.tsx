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
    <main className="min-h-dvh bg-[#FFF9F0] md:flex md:items-start md:justify-center">
      <div className="wizard-page w-full md:max-w-[640px]">
        <StepComponent />
      </div>
    </main>
  )
}

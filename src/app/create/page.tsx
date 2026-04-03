'use client'
import { useCreateBookStore } from '@/store/createBookStore'
import StepBookType from '@/components/create/StepBookType'
import StepParameters from '@/components/create/StepParameters'
import StepCharacters from '@/components/create/StepCharacters'
import StepPersonalization from '@/components/create/StepPersonalization'
import StepPayment from '@/components/create/StepPayment'

const STEPS = [StepBookType, StepParameters, StepCharacters, StepPersonalization, StepPayment]

export default function CreatePage() {
  const step = useCreateBookStore((s) => s.step)
  const StepComponent = STEPS[step - 1]

  return (
    <main className="min-h-dvh bg-[#FFF9F0]">
      <StepComponent />
    </main>
  )
}

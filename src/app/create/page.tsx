'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace('/login?returnTo=/create')
    })
  }, [router])

  return (
    <main className="min-h-dvh bg-[#FFF9F0]">
      <StepComponent />
    </main>
  )
}

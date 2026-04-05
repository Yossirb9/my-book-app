import AdminLoginForm from '@/components/crm/AdminLoginForm'

type BackofficeLoginPageProps = {
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function BackofficeLoginPage({ searchParams }: BackofficeLoginPageProps) {
  const params = await searchParams

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f7f4ef] px-4 py-10">
      <div className="relative z-10">
        <AdminLoginForm initialError={params?.error} />
      </div>
    </main>
  )
}

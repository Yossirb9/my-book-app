import AdminLoginForm from '@/components/crm/AdminLoginForm'

type BackofficeLoginPageProps = {
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function BackofficeLoginPage({ searchParams }: BackofficeLoginPageProps) {
  const params = await searchParams

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[linear-gradient(180deg,#e4efe8_0%,#f5faf7_50%,#edf5f1_100%)] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(18,49,45,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(148,180,162,0.25),transparent_28%)]" />
      <div className="relative z-10">
        <AdminLoginForm initialError={params?.error} />
      </div>
    </main>
  )
}

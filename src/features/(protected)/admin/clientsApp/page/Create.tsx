'use client'

import { PageContainer } from '@/components/layout/PageContainer'
import { CreateClientAppForm } from '../components/forms/CreateClientAppForm'
import { useCreateClientApp } from '@/hooks/api/useClientApp'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CreateClientAppPage() {
  const { mutateAsync, isPending } = useCreateClientApp()
  const router = useRouter()

  return (
    <PageContainer title="Tambah Client App">
      <CreateClientAppForm
        onSubmit={async (vals) => {
          try {
            await mutateAsync(vals)
            toast.success('Client App berhasil dibuat')
            router.push('/admin/clients-apps')
          } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const msg = err && typeof err === 'object' && 'message' in (err as any) ? (err as any).message : 'Gagal membuat Client App'
            toast.error(msg as string)
          }
        }}
        isSubmitting={isPending}
      />
    </PageContainer>
  )
}

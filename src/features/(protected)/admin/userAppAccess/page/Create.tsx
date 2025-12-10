'use client'

import { PageContainer } from '@/components/layout/PageContainer'
import { CreateUserAppAccessForm } from '../components/forms/CreateUserAppAccessForm'
import { useCreateUserAppAccess } from '@/hooks/api/useUserAppAccess'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CreateUserAppAccessPage() {
  const { mutateAsync, isPending } = useCreateUserAppAccess()
  const router = useRouter()

  return (
    <PageContainer title="Tambah Akses Pengguna">
      <CreateUserAppAccessForm
        onSubmit={async (vals) => {
          try {
            await mutateAsync(vals)
            toast.success('Akses pengguna berhasil dibuat')
            router.push('/admin/user-app-access')
          } catch (err) {
            const msg = err && typeof err === 'object' && 'message' in (err as any) ? (err as any).message : 'Gagal membuat akses'
            toast.error(msg as string)
          }
        }}
        isSubmitting={isPending}
      />
    </PageContainer>
  )
}

'use client'

import { PageContainer } from '@/components/layout/PageContainer'
import { EditUserAppAccessForm } from '../components/forms/EditUserAppAccessForm'
import { useUserAppAccess, useUpdateUserAppAccess } from '@/hooks/api/useUserAppAccess'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'

export default function EditUserAppAccessPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id as string
  const { data, isLoading } = useUserAppAccess(id)
  const { mutateAsync, isPending } = useUpdateUserAppAccess()
  const router = useRouter()

  return (
    <PageContainer title="Edit Akses Pengguna">
      <EditUserAppAccessForm
        defaultValues={data}
        onSubmit={async (vals) => {
          try {
            await mutateAsync({ id, payload: vals })
            toast.success('Akses pengguna berhasil diperbarui')
            router.push('/admin/user-app-access')
          } catch (err) {
            const msg = err && typeof err === 'object' && 'message' in (err as any) ? (err as any).message : 'Gagal memperbarui akses'
            toast.error(msg as string)
          }
        }}
        isSubmitting={isPending || isLoading}
      />
    </PageContainer>
  )
}

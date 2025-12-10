'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useDeleteUserAppAccess } from '@/hooks/api/useUserAppAccess'
import { DataTableRowActions } from '@/components/table/DataTableRowActions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EditUserAppAccessForm } from '@/features/(protected)/admin/userAppAccess/components/forms/EditUserAppAccessForm'

interface Props {
  accessId: string
  userName?: string
}

export function UserAppAccessActionCell({ accessId, userName }: Props) {
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const del = useDeleteUserAppAccess()

  const handleDeleteConfirm = () => {
    del.mutateAsync(accessId, {
      onSuccess: () => {
        toast.success(`Akses untuk ${userName ?? `#${accessId}`} berhasil dihapus`)
        setOpenDelete(false)
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? (error as { message?: string }).message
              : 'Gagal menghapus akses'
        toast.error(message)
      }
    })
  }

  return (
    <>
      <DataTableRowActions row={{ id: accessId }} onEdit={() => setOpenEdit(true)} onDelete={() => setOpenDelete(true)} />

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Akses {userName ?? `#${accessId}`}</DialogTitle>
          </DialogHeader>
          {openEdit && <EditUserAppAccessForm key={accessId} accessId={accessId} onSuccess={() => setOpenEdit(false)} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus akses {userName ?? `#${accessId}`}?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan. Data akan dihapus permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useDeleteClientApp } from '@/hooks/api/useClientApp'
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
import { EditClientAppForm } from '../forms/EditClientAppForm'

interface Props {
  appId: string
  appName?: string
}

export function ClientAppActionCell({ appId, appName }: Props) {
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const del = useDeleteClientApp()

  const handleDeleteConfirm = () => {
    del.mutateAsync(appId, {
      onSuccess: () => {
        toast.success(`Client App ${appName ?? `#${appId}`} berhasil dihapus`)
        setOpenDelete(false)
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? (error as { message?: string }).message
              : 'Gagal menghapus Client App'
        toast.error(message)
      }
    })
  }

  return (
    <>
      <DataTableRowActions row={{ id: appId }} onEdit={() => setOpenEdit(true)} onDelete={() => setOpenDelete(true)} />
      {/* modal edit */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client App</DialogTitle>
          </DialogHeader>
          {openEdit && <EditClientAppForm key={appId} appId={appId} onSuccess={() => setOpenEdit(false)} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {appName ?? `#${appId}`}?</AlertDialogTitle>
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

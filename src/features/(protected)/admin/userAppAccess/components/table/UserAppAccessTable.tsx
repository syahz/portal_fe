'use client'

import { DataTable } from '@/components/table/DataTable'
import type { UserAppAccessExpanded } from '@/types/api/userAppAccess'
import { Table } from '@tanstack/react-table'

interface Props {
  table: Table<UserAppAccessExpanded>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
}

export function UserAppAccessTable({ table, isLoading, isFetching, error }: Props) {
  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      emptyMessage="Tidak ada akses aplikasi untuk saat ini."
      errorMessage="Gagal memuat data akses. Silakan coba lagi."
    />
  )
}

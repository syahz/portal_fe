'use client'

import { DataTable } from '@/components/table/DataTable'
import type { ClientApp } from '@/types/api/clientApp'
import { Table } from '@tanstack/react-table'

interface Props {
  table: Table<ClientApp>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
}

export function ClientAppTable({ table, isLoading, isFetching, error }: Props) {
  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      emptyMessage="Tidak ada Client App untuk saat ini."
      errorMessage="Gagal memuat Client App. Silakan coba lagi."
    />
  )
}

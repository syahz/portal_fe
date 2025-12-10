'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/PageContainer'
import { DataTableSearch } from '@/components/table/DataTableSearch'
import { DataTablePagination } from '@/components/table/DataTablePagination'
import { useUserAppAccesses } from '@/hooks/api/useUserAppAccess'
import { useSearchFilters } from '@/hooks/useSearchFilter'
import React, { useMemo, useState } from 'react'
import { useReactTable, getCoreRowModel, PaginationState, SortingState } from '@tanstack/react-table'
import { UserAppAccessColumns } from '../components/table/UserAppAccessColumns'
import { UserAppAccessTable } from '../components/table/UserAppAccessTable'

const SearchConfig = {
  placeholder: 'Cari berdasarkan nama user atau app...',
  searchButtonText: 'Search',
  resetButtonText: 'Reset'
}

export default function UserAppAccessPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const { searchValue, appliedSearch, filters, setSearchValue, handleSearchSubmit, handleClearFilters, handleFilterChange } = useSearchFilters({})

  const queryParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: appliedSearch,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    sortOrder: sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined
  }

  const { data, isLoading, error, isFetching } = useUserAppAccesses(queryParams)
  console.log(data)
  const defaultData = useMemo(() => [], [])
  const columns = useMemo(() => UserAppAccessColumns, [])

  const table = useReactTable({
    data: data?.items || defaultData,
    columns,
    pageCount: data?.pagination?.totalPage ?? -1,
    state: {
      pagination: { pageIndex, pageSize },
      sorting
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true
  })

  React.useEffect(() => {
    const totalPages = data?.pagination?.totalPage
    if (totalPages && pageIndex >= totalPages) {
      table.setPageIndex(0)
    }
  }, [data?.pagination?.totalPage, pageIndex, table])

  return (
    <PageContainer title="User App Access">
      <div className="flex w-full gap-4 py-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Manajemen Akses Aplikasi Pengguna</h2>
        <Link href={'/admin/user-app-access/create'}>
          <Button size="sm" variant="default" className="flex items-center gap-2">
            <span>Tambah Akses</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <DataTableSearch
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearchSubmit}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          config={SearchConfig}
        />

        <UserAppAccessTable table={table} isLoading={isLoading} isFetching={isFetching} error={error as Error | null} />

        {data?.pagination && (
          <DataTablePagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPage}
            pageSize={data.pagination.limit}
            totalItems={data.pagination.totalData}
            onPageChange={(page) => table.setPageIndex(page - 1)}
            onPageSizeChange={(size) => table.setPageSize(size)}
          />
        )}
      </div>
    </PageContainer>
  )
}

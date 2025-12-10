'use client'

import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import type { UserAppAccessExpanded } from '@/types/api/userAppAccess'
import { UserAppAccessActionCell } from '@/features/(protected)/admin/userAppAccess/components/table/UserAppAccessActionCell'

export const UserAppAccessColumns: ColumnDef<UserAppAccessExpanded>[] = [
  {
    accessorKey: 'user.name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        User
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.user.name}</span>
  },
  { accessorKey: 'user.email', header: 'Email' },
  { accessorKey: 'app.name', header: 'App' },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <UserAppAccessActionCell accessId={row.original.id} userName={row.original.user.name} />
  }
]

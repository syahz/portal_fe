'use client'

import { truncateText } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ClientApp } from '@/types/api/clientApp'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { ClientAppActionCell } from '@/features/(protected)/admin/clientsApp/components/table/ClientAppActionCell'

export const ClientAppColumns: ColumnDef<ClientApp>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    meta: { className: 'sticky left-0 bg-card z-10 min-w-[100px]' }
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <span>{truncateText(row.original.description, 60)}</span>
  },
  { accessorKey: 'redirect_uri', header: 'Redirect URI' },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ClientAppActionCell appId={row.original.id} appName={row.original.name} />,
    meta: { className: 'sticky right-0 bg-card z-10 w-[120px]' }
  }
]

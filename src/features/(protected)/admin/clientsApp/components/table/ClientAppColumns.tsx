'use client'

import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import type { ClientApp } from '@/types/api/clientApp'
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
    meta: { className: 'sticky left-0 bg-card z-10 min-w-[250px]' }
  },
  { accessorKey: 'clientId', header: 'Client ID' },
  { accessorKey: 'redirectUri', header: 'Redirect URI' },
  { accessorKey: 'dashboardUrl', header: 'Dashboard URL' },
  { accessorKey: 'logoUrl', header: 'Logo' },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ClientAppActionCell appId={row.original.id} appName={row.original.name} />,
    meta: { className: 'sticky right-0 bg-card z-10 w-[120px]' }
  }
]

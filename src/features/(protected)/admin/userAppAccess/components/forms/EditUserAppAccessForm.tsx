'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { EditUserAppAccessSchema, type UpdateUserAppAccessFormValues } from '../validation/UserAppAccessValidation'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useClientApps } from '@/hooks/api/useClientApp'
import { useGetParticipants } from '@/hooks/api/useParticipant'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'
import { useRouter } from 'next/navigation'
import { useUpdateUserAppAccess, useUserAppAccess } from '@/hooks/api/useUserAppAccess'
import { toast } from 'sonner'

type EditUserAppAccessFormProps = {
  accessId: string
  onSuccess?: () => void
}

export function EditUserAppAccessForm({ accessId, onSuccess }: EditUserAppAccessFormProps) {
  const router = useRouter()
  const [isFormReady, setIsFormReady] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [debouncedUserSearch, setDebouncedUserSearch] = useState('')
  const [appSearch, setAppSearch] = useState('')
  const [userPopoverOpen, setUserPopoverOpen] = useState(false)
  const { data: appAccessData, isLoading: isLoadingAppAccess } = useUserAppAccess(accessId)
  const { data: appsData, isLoading: isLoadingApps } = useClientApps({ page: 1, limit: 20, search: appSearch || undefined })
  // Fetch a large page once, then filter client-side
  const { data: usersData, isLoading: isLoadingUsers } = useGetParticipants({ page: 1, limit: 1000 })
  const users = usersData?.items || []
  const appAccess = appAccessData?.data
  console.log('appAccessData:', appAccess?.app_id)
  const app = appsData?.items || []

  const updateUserAppAccess = useUpdateUserAppAccess(accessId)

  const form = useForm<UpdateUserAppAccessFormValues>({
    resolver: zodResolver(EditUserAppAccessSchema),
    defaultValues: {
      user_id: '',
      app_id: ''
    }
  })

  useEffect(() => {
    if (appAccess && users.length > 0 && app.length > 0) {
      form.reset({
        user_id: String(appAccess.user_id),
        app_id: String(appAccess.app_id)
      })
      setIsFormReady(true)
    } else {
      setIsFormReady(false)
    }
  }, [appAccess, form, users.length, app.length])

  // Debounce user search input to reduce re-renders while typing
  useEffect(() => {
    const t = setTimeout(() => setDebouncedUserSearch(userSearch.trim().toLowerCase()), 150)
    return () => clearTimeout(t)
  }, [userSearch])

  if (isLoadingAppAccess || isLoadingUsers || isLoadingApps || !isFormReady) {
    return <DynamicSkeleton variant="dialogForm" />
  }

  const onSubmit = (values: UpdateUserAppAccessFormValues) => {
    updateUserAppAccess.mutateAsync(values, {
      onSuccess: () => {
        toast.success('Aplikasi klien berhasil diperbarui!')
        router.push('/admin/user-app-access')
        onSuccess?.()
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? (error as { message?: string }).message
              : 'Gagal memperbarui divisi'
        toast.error(message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {(() => {
                        const selectedUser = users.find((u) => String(u.id) === String(field.value))
                        return selectedUser ? `${selectedUser.name}` : 'Pilih user...'
                      })()}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                  <Command>
                    <CommandInput
                      placeholder="Cari user..."
                      onValueChange={(v) => {
                        setUserSearch(v)
                        setUserPopoverOpen(true)
                      }}
                    />
                    <CommandList>
                      {isLoadingUsers ? (
                        <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" /> Memuat...
                        </div>
                      ) : null}
                      <CommandEmpty>Tidak ada user</CommandEmpty>
                      <CommandGroup>
                        {users
                          .filter((u) => {
                            if (!debouncedUserSearch) return true
                            const q = debouncedUserSearch
                            return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
                          })
                          .map((user) => (
                            <CommandItem
                              key={user.id}
                              value={`${user.name} ${user.email}`}
                              onSelect={() => {
                                field.onChange(String(user.id))
                                setUserPopoverOpen(false)
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', String(user.id) === String(field.value) ? 'opacity-100' : 'opacity-0')} />
                              {user.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="app_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client App</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? String(appAccess?.app_id ?? '')}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih aplikasi" className="truncate" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <div className="p-2">
                    <Input placeholder="Cari aplikasi..." value={appSearch} onChange={(e) => setAppSearch(e.target.value)} />
                  </div>
                  {isLoadingApps ? (
                    <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Memuat...
                    </div>
                  ) : null}
                  {app
                    .filter((a) => {
                      const q = appSearch.toLowerCase()
                      return (
                        a.name.toLowerCase().includes(q) ||
                        String(a.clientId ?? '')
                          .toLowerCase()
                          .includes(q)
                      )
                    })
                    .map((a) => (
                      <SelectItem key={a.id} value={String(a.id)} className="truncate">
                        {a.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-fit" disabled={updateUserAppAccess.isPending}>
          {updateUserAppAccess.isPending ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </form>
    </Form>
  )
}

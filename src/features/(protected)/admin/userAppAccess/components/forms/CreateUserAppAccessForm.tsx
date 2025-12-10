'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { CreateUserAppAccessSchema, type CreateUserAppAccessFormValues } from '../validation/UserAppAccessValidation'
import type { CreateUserAppAccessRequest } from '@/types/api/userAppAccess'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useClientApps } from '@/hooks/api/useClientApp'
import { useGetParticipants } from '@/hooks/api/useParticipant'

export function CreateUserAppAccessForm({
  onSubmit,
  isSubmitting
}: {
  onSubmit: (values: CreateUserAppAccessRequest) => Promise<void> | void
  isSubmitting?: boolean
}) {
  const form = useForm<CreateUserAppAccessFormValues>({
    resolver: zodResolver(CreateUserAppAccessSchema),
    defaultValues: {
      user_id: '',
      app_id: ''
    }
  })

  // Local search states for remote filtering
  const [userSearch, setUserSearch] = useState('')
  const [appSearch, setAppSearch] = useState('')
  const [userPopoverOpen, setUserPopoverOpen] = useState(false)
  const [debouncedUserSearch, setDebouncedUserSearch] = useState('')
  const usersQuery = useGetParticipants({ page: 1, limit: 20, search: userSearch || undefined })
  const appsQuery = useClientApps({ page: 1, limit: 20, search: appSearch || undefined })

  // Debounce user search input to reduce re-renders while typing
  useEffect(() => {
    const t = setTimeout(() => setDebouncedUserSearch(userSearch.trim().toLowerCase()), 150)
    return () => clearTimeout(t)
  }, [userSearch])
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(async (vals) => onSubmit(vals as CreateUserAppAccessRequest))} className="grid gap-6">
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
                        const found = usersQuery.data?.items?.find((u) => u.id === field.value)
                        return found ? `${found.name} ` : 'Pilih user...'
                      })()}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Cari user..."
                      onValueChange={(v) => {
                        setUserSearch(v)
                        setUserPopoverOpen(true)
                      }}
                    />
                    <CommandList>
                      {usersQuery.isLoading ? (
                        <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" /> Memuat...
                        </div>
                      ) : null}
                      <CommandEmpty>Tidak ada user</CommandEmpty>
                      <CommandGroup>
                        {usersQuery.data?.items
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {(() => {
                        const found = appsQuery.data?.items?.find((a) => a.id === field.value)
                        return found ? `${found.name}` : 'Pilih aplikasi...'
                      })()}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Cari aplikasi..." onValueChange={(v) => setAppSearch(v)} />
                    <CommandList>
                      {appsQuery.isLoading ? (
                        <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" /> Memuat...
                        </div>
                      ) : null}
                      <CommandEmpty>Tidak ada aplikasi</CommandEmpty>
                      <CommandGroup>
                        {appsQuery.data?.items?.map((app) => (
                          <CommandItem
                            key={app.id}
                            value={`${app.name} `}
                            onSelect={() => {
                              field.onChange(app.id)
                            }}
                          >
                            <Check className={cn('mr-2 h-4 w-4', app.id === field.value ? 'opacity-100' : 'opacity-0')} />
                            {app.name}
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
        <Button type="submit" className="w-fit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </form>
    </Form>
  )
}

'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useClientApp, useUpdateClientApp } from '@/hooks/api/useClientApp'
import { EditClientAppSchema, UpdateClientAppFormValues } from '../validation/ClientAppValidation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

type EditClientAppFormProps = {
  appId: string
  onSuccess?: () => void
}
export function EditClientAppForm({ appId, onSuccess }: EditClientAppFormProps) {
  const router = useRouter()
  const [isFormReady, setIsFormReady] = useState(false)

  const { data: appData, isLoading: isLoadingApp } = useClientApp(appId)
  const updateClientApp = useUpdateClientApp(appId)

  const form = useForm<UpdateClientAppFormValues>({
    resolver: zodResolver(EditClientAppSchema),
    defaultValues: {
      name: '',
      description: '',
      client_id: '',
      client_secret: '',
      redirect_uri: '',
      dashboard_url: ''
    }
  })

  useEffect(() => {
    if (appData) {
      form.reset({
        name: appData.name ?? '',
        description: appData.description ?? '',
        client_id: appData.client_id ?? '',
        client_secret: appData.client_secret ?? '',
        redirect_uri: appData.redirect_uri ?? '',
        dashboard_url: appData.dashboard_url ?? ''
      })

      setIsFormReady(true)
    } else {
      setIsFormReady(false)
    }
  }, [appData, form])

  if (isLoadingApp || !isFormReady) {
    return <DynamicSkeleton variant="dialogForm" />
  }

  const onSubmit = (values: UpdateClientAppFormValues) => {
    updateClientApp.mutateAsync(values, {
      onSuccess: () => {
        toast.success('Aplikasi klien berhasil diperbarui!')
        router.push('/admin/clients-apps')
        onSuccess?.()
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? (error as { message?: string }).message
              : 'Gagal memperbarui client app'
        toast.error(message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client_secret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Secret</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="redirect_uri"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Redirect URI</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dashboard_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dashboard URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-fit" disabled={updateClientApp.isPending}>
          {updateClientApp.isPending ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </form>
    </Form>
  )
}
